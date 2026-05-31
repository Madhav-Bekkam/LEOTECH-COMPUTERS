import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const MarkdownViewer = ({ content }) => {
  return (
    <div className="w-full text-slate-300 leading-relaxed font-medium">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2 font-space" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-[#00C2FF] mt-8 mb-4 font-space" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl font-bold text-white mt-6 mb-3 font-space" {...props} />,
          h4: ({node, ...props}) => <h4 className="text-lg font-bold text-slate-200 mt-4 mb-2 font-space" {...props} />,
          p: ({node, ...props}) => <p className="mb-4 text-base leading-loose" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2 text-slate-300 ml-4" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2 text-slate-300 ml-4" {...props} />,
          li: ({node, ...props}) => <li className="pl-2" {...props} />,
          strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
          em: ({node, ...props}) => <em className="italic text-slate-400" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-[#00C2FF] pl-4 py-1 mb-6 bg-[#00C2FF]/10 text-slate-200 rounded-r-lg italic" {...props} />
          ),
          table: ({node, ...props}) => (
            <div className="overflow-x-auto mb-6 rounded-xl border border-white/10">
              <table className="w-full text-left border-collapse min-w-full" {...props} />
            </div>
          ),
          thead: ({node, ...props}) => <thead className="bg-white/5 border-b border-white/10" {...props} />,
          th: ({node, ...props}) => <th className="p-4 font-bold text-white" {...props} />,
          td: ({node, ...props}) => <td className="p-4 border-b border-white/5" {...props} />,
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="mb-6 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <div className="bg-black/80 px-4 py-2 text-xs text-slate-400 font-bold uppercase flex justify-between items-center border-b border-white/10">
                  {match[1]}
                </div>
                <SyntaxHighlighter
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, padding: '1.5rem', background: 'rgba(0,0,0,0.4)' }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="bg-black/50 text-[#00C2FF] px-1.5 py-0.5 rounded-md text-sm font-mono border border-white/5" {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content || 'No notes content available.'}
      </ReactMarkdown>
    </div>
  );
};
