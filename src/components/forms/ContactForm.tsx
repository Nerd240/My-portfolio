import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Loader2, Github, Linkedin, Shield } from 'lucide-react';
import { contactMessageSchema, ContactMessageInput } from '../../lib/validation';
import { siteConfig } from '../../config/site';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactMessageInput>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactMessageInput, string>>>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactMessageInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setStatus('idle');
    setStatusMessage('');

    // Client-side Zod validation
    const result = contactMessageSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactMessageInput, string>> = {};
      result.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactMessageInput] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to deliver message. Please try again.');
      }

      setStatus('success');
      setStatusMessage('Your message has been stored in the database and sent to Ash. Thank you!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setStatusMessage(err.message || 'An unexpected error occurred while sending your message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      {/* Left Info Column */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-100 font-sans">
            Get in Touch
          </h2>
          <p className="mt-2 text-sm text-neutral-400 leading-relaxed font-sans">
            Whether you are a fellow CS student, mentor, lab peer, or recruiter interested in an early-career developer with strong systems curiosity, feel free to send a message.
          </p>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 flex items-center gap-3">
            <Mail className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <div className="text-neutral-500 text-[10px] uppercase tracking-wider">Email Address</div>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-neutral-200 hover:text-sky-400 transition-colors font-medium select-all"
              >
                {siteConfig.email}
              </a>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 flex items-center gap-3">
            <Github className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-neutral-500 text-[10px] uppercase tracking-wider">GitHub Code Hub</div>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                className="text-neutral-200 hover:text-emerald-400 transition-colors font-medium"
              >
                github.com/Nerd240
              </a>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 flex items-center gap-3">
            <Linkedin className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <div className="text-neutral-500 text-[10px] uppercase tracking-wider">LinkedIn Network</div>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-neutral-200 hover:text-sky-400 transition-colors font-medium"
              >
                linkedin.com/in/aashraya-shrestha
              </a>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/30 text-xs text-neutral-400 space-y-2">
          <div className="flex items-center gap-1.5 text-neutral-200 font-mono font-semibold">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Direct Database Ingestion</span>
          </div>
          <p className="leading-relaxed">
            Messages are validated through Zod schemas, recorded directly to the backend database, and managed in Ash's admin console. Rate limiting is enforced.
          </p>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="lg:col-span-3">
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-5"
          noValidate
        >
          {status === 'success' && (
            <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-sm flex items-start gap-3 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{statusMessage}</div>
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-sm flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{statusMessage}</div>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-xs font-mono font-medium text-neutral-300 mb-1.5">
              Full Name or Handle <span className="text-rose-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g. Alex Mercer"
              className={`w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border ${
                errors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
              } text-neutral-100 placeholder:text-neutral-600 text-sm font-sans outline-none transition-colors disabled:opacity-50`}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-400 font-mono">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-xs font-mono font-medium text-neutral-300 mb-1.5">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g. alex@example.com"
              className={`w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border ${
                errors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
              } text-neutral-100 placeholder:text-neutral-600 text-sm font-sans outline-none transition-colors disabled:opacity-50`}
            />
            {errors.email && <p className="mt-1 text-xs text-rose-400 font-mono">{errors.email}</p>}
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-xs font-mono font-medium text-neutral-300 mb-1.5">
              Message <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              disabled={loading}
              placeholder="Write your note, question, project idea, or inquiry..."
              className={`w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border ${
                errors.message ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
              } text-neutral-100 placeholder:text-neutral-600 text-sm font-sans outline-none transition-colors disabled:opacity-50 resize-y`}
            />
            {errors.message && <p className="mt-1 text-xs text-rose-400 font-mono">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-mono text-sm font-medium transition-colors shadow-sm disabled:opacity-50 cursor-pointer min-h-[44px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting to Database...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
