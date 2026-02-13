"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Github, Search, Sparkles, Target, Zap } from "lucide-react";

export default function Home() {
    const [url, setUrl] = useState("");
    const router = useRouter();

    const handleAnalyze = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        const username = url.split("/").pop();
        if (username) {
            router.push(`/results/${username}`);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl w-full space-y-8"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span>AI-Powered Recruitment Analysis</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                    Repo<span className="gradient-text">Lens</span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Stop wondering why you're not getting callbacks. See your GitHub profile through the eyes of a real tech recruiter.
                </p>

                <form onSubmit={handleAnalyze} className="relative max-w-xl mx-auto mt-12 group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                    <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-2">
                        <Github className="ml-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="github.com/your-username"
                            className="flex-1 bg-transparent border-none focus:ring-0 text-white p-4 outline-none"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-bold transition-all flex items-center gap-2"
                        >
                            Analyze <Search className="w-4 h-4" />
                        </button>
                    </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
                    <FeatureCard
                        icon={<Target className="text-purple-500" />}
                        title="Recruiter Verdict"
                        desc="Shortlist, Maybe, or Hard Pass. Brutally honest feedback."
                    />
                    <FeatureCard
                        icon={<Zap className="text-pink-500" />}
                        title="Actionable Roadmap"
                        desc="5 specific steps to transform your profile in 48 hours."
                    />
                    <FeatureCard
                        icon={<Sparkles className="text-blue-500" />}
                        title="AI Rewrite"
                        desc="Suggestions to turn boring READMEs into impact stories."
                    />
                </div>
            </motion.div>
        </main>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-left space-y-3 hover:border-purple-500/50 transition-colors group">
            <div className="p-2 rounded-lg bg-zinc-800 w-fit group-hover:scale-110 transition-transform">{icon}</div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
    );
}
