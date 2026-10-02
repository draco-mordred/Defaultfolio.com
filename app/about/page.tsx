"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navigation } from "../components/nav";

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative pb-16"
    >
      <Navigation />
      <div className="mx-auto max-w-4xl px-6 pt-32 lg:px-8">
        <header className="border-b border-[var(--border)] pb-8">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--text-soft)]">About</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-[var(--text)] sm:text-5xl">
            Israel Oladele
          </h1>
        </header>

        <div className="mt-10 space-y-8">
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)] backdrop-blur-sm">
            <h2 className="text-xl font-bold text-[var(--text)]">Summary</h2>
            <p className="mt-4 text-base leading-7 text-[var(--text-soft)]">
              I am a detail-oriented AI evaluator and creative technologist with 4 years of
              experience improving the reliability of AI systems through rigorous assessment,
              fact-checking, and structured reasoning. My work spans AI model evaluation,
              multimodal quality analysis, digital art, and research support, with a strong
              focus on identifying hallucinations, logical inconsistencies, and weak
              grounding in model output.
            </p>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)] backdrop-blur-sm">
            <h2 className="text-xl font-bold text-[var(--text)]">Core strengths</h2>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-[var(--text)]">
              {[
                "AI Evaluation",
                "LLM QA",
                "Prompt Engineering",
                "Data Annotation",
                "Python",
                "JavaScript",
                "Digital Art",
                "Fact-checking",
                "Research",
              ].map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1.5"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)] backdrop-blur-sm">
            <h2 className="text-xl font-bold text-[var(--text)]">Experience</h2>
            <div className="mt-5 space-y-5 text-[var(--text-soft)]">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text)]">
                  AI Evaluator & Automation Specialist
                </h3>
                <p className="text-sm text-[var(--muted)]">Freelance AI & Tech Projects | Remote</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
                  <li>Evaluated LLM outputs for clarity, factual accuracy, and policy compliance.</li>
                  <li>Built automation scripts and AI workflows for summarizing large research and lecture materials.</li>
                  <li>Created datasets and assessed edge cases for AI agent evaluation.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--text)]">AI Quality Analyst</h3>
                <p className="text-sm text-[var(--muted)]">Remote</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
                  <li>Reviewed 1,500+ side-by-side model responses across text, image, and video tasks.</li>
                  <li>Detected hallucinations, grounding issues, weak reasoning, and unnatural responses.</li>
                  <li>Wrote structured rationales and verified metadata, references, and source quality.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)] backdrop-blur-sm">
            <h2 className="text-xl font-bold text-[var(--text)]">Creative & technical work</h2>
            <p className="mt-4 text-base leading-7 text-[var(--text-soft)]">
              I also work as a digital illustrator, photo editor, and creative designer,
              producing character illustrations, stylized artwork, and retouched visual assets
              for clients. This creative background strengthens my eye for composition,
              visual consistency, and detail-oriented review—skills that carry directly into
              AI quality work and content evaluation.
            </p>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)] backdrop-blur-sm">
            <h2 className="text-xl font-bold text-[var(--text)]">Education</h2>
            <p className="mt-4 text-base text-[var(--text-soft)]">
              Bachelor of Medicine; Bachelor of Surgery — University of Jos, Nigeria
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
