"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Target,
    ShieldCheck,
    BadgeAlert,
    Loader2
} from "lucide-react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer
} from "recharts";
import axios from "axios";

export default function Results() {
    const { username } = useParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post("http://localhost:8000/analyze", { username });
                setData(res.data);
            } catch (err: any) {
                setError(err.response?.data?.detail || "Failed to analyze profile. Make sure the backend is running.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [username]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                <p className="text-xl font-medium animate-pulse">Running RepoLens Analysis...</p>
                <p className="text-muted-foreground">Simulating recruiter eyes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
                <BadgeAlert className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Analysis Failed</h2>
                <p className="text-muted-foreground mb-8 max-w-md">{error}</p>
                <button
                    onClick={() => router.push("/")}
                    className="px-6 py-2 bg-zinc-800 rounded-lg border border-zinc-700 hover:bg-zinc-700 transition"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const chartData = [
        { subject: "Tech Depth", A: data.scores.technical_depth, fullMark: 100 },
        { subject: "Consistency", A: data.scores.consistency, fullMark: 100 },
        { subject: "Impact", A: data.scores.impact, fullMark: 100 },
        { subject: "Impression", A: data.scores.first_impression, fullMark: 100 },
        { subject: "Recruiter", A: data.scores.recruiter_score, fullMark: 100 },
    ];

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8 pb-24">
            <div className="flex items-center justify-between">
                <button onClick={() => router.push("/")} className="p-2 hover:bg-zinc-800 rounded-full transition">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="text-right">
                    <p className="text-sm text-zinc-500">Recruiter Evaluation for</p>
                    <h1 className="text-2xl font-bold">@{data.user.login}</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div className="glass p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ShieldCheck className="w-32 h-32" />
                        </div>
                        <p className="text-zinc-400 font-medium mb-1">Portfolio Score</p>
                        <div className="text-8xl font-black gradient-text">{data.scores.portfolio_score}</div>
                        <div className="mt-8 pt-8 border-t border-white/5 space-y-2">
                            <p className="text-sm text-zinc-500 uppercase tracking-widest">Recruiter Verdict</p>
                            <div className={`text-3xl font-bold ${data.analysis.verdict === 'Shortlist' ? 'text-green-500' :
                                    data.analysis.verdict === 'Maybe' ? 'text-yellow-500' : 'text-red-500'
                                }`}>
                                {data.analysis.verdict}
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-500" />
                            Personality Profile
                        </h3>
                        <div className="inline-block px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                            {data.analysis.personality_type}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    <div className="glass p-6 rounded-3xl flex flex-col items-center justify-center">
                        <h3 className="font-bold mb-4">Competency Map</h3>
                        <div className="w-full h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                    <PolarGrid stroke="#333" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
                                    <Radar
                                        name="Score"
                                        dataKey="A"
                                        stroke="#a855f7"
                                        fill="#a855f7"
                                        fillOpacity={0.6}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl space-y-6">
                        <h3 className="font-bold text-lg">Detailed Breakdown</h3>
                        <ScoreBar label="Technical Depth" value={data.scores.technical_depth} color="bg-blue-500" />
                        <ScoreBar label="Consistency" value={data.scores.consistency} color="bg-pink-500" />
                        <ScoreBar label="Impact" value={data.scores.impact} color="bg-green-500" />
                        <ScoreBar label="First Impression" value={data.scores.first_impression} color="bg-orange-500" />
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-green-400">
                        <CheckCircle2 className="w-6 h-6" />
                        Key Strengths
                    </h3>
                    <ul className="space-y-4">
                        {data.analysis.strengths.map((s: string, i: number) => (
                            <li key={i} className="flex gap-3 text-zinc-300">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                {s}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-400">
                        <AlertCircle className="w-6 h-6" />
                        Red Flags
                    </h3>
                    <ul className="space-y-4">
                        {data.analysis.red_flags.map((s: string, i: number) => (
                            <li key={i} className="flex gap-3 text-zinc-300">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                {s}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-3xl">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                    Actionable Roadmap
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {data.analysis.roadmap.map((step: string, i: number) => (
                        <div key={i} className="bg-zinc-800/50 p-6 rounded-2xl border border-white/5 relative group">
                            <div className="text-4xl font-black text-white/5 absolute top-2 right-4">{i + 1}</div>
                            <p className="text-sm font-medium text-zinc-200">{step}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

function ScoreBar({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm uppercase tracking-wider text-zinc-500 font-medium">
                <span>{label}</span>
                <span className="text-white">{value}/100</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}
