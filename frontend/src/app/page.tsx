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
        const username = url.trim().replace(/\/$/, "").split("/").pop();
        if (username) {
            router.push(`/results/${username}`);
        }
    };

    return (
        <main className="flex flex-col min-h-screen">
            {/* Header Section */}
            <header className="w-full py-4 border-b border-white/5 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-bold tracking-wider uppercase">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI-Powered Recruitment Analysis</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl w-full space-y-12"
                >
                    <div className="space-y-4">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter">
                            Repo<span className="gradient-text">Lens</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto font-medium">
                            Stop wondering why you're not getting callbacks. <br className="hidden md:block" />
                            See your GitHub through the eyes of a <span className="text-white italic">real tech recruiter</span>.
                        </p>
                    </div>

                    <form onSubmit={handleAnalyze} className="relative max-w-2xl mx-auto group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 rounded-2xl blur-xl opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
                        <div className="relative flex flex-col md:flex-row items-stretch md:items-center gap-4">
                            <div className="flex-1 relative flex items-center bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden focus-within:border-purple-500/50 transition-all shadow-2xl">
                                <Github className="ml-4 text-white" />
                                <input
                                    type="text"
                                    placeholder="github.com/your-username"
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-white p-5 outline-none font-medium placeholder:text-zinc-600"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-white hover:bg-zinc-200 text-black px-10 py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95"
                            >
                                ANALYZE <Search className="w-5 h-5 text-blue-600" />
                            </button>
                        </div>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <FeatureCard
                            icon={<Target className="text-rose-500" />}
                            title="Recruiter Verdict"
                            desc="Shortlist, Maybe, or Hard Pass. Brutally honest feedback from AI."
                        />
                        <FeatureCard
                            icon={<Zap className="text-amber-400" />}
                            title="Actionable Roadmap"
                            desc="5 specific steps to transform your profile in 48 hours."
                        />
                        <FeatureCard
                            icon={<Sparkles className="text-cyan-400" />}
                            title="AI Insights"
                            desc="Suggestions to turn boring READMEs into technical impact stories."
                        />
                    </div>
                </motion.div>
            </div>
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
