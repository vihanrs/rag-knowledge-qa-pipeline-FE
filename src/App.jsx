import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { nanoid } from 'nanoid';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
} from '@/components/ai-elements/prompt-input';
import { Loader } from '@/components/ai-elements/loader';
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolOutput,
} from '@/components/ai-elements/tool';

function App() {
  const [input, setInput] = useState('');
  const [threadId] = useState(() => nanoid());

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: 'http://localhost:8000/qa/stream',
    }),
    body: {
      thread_id: threadId,
    },
  });

  const handleSubmit = (message) => {
    if (!message.text || !message.text.trim()) return;
    sendMessage({ text: message.text.trim() });
    setInput('');
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage({ text: suggestion });
  };

  const TOOL_LABELS = {
    planning: 'Planning',
    retrieval: 'Retrieving context',
    summarization: 'Summarizing',
  };

  const renderMessagePart = (part, index, messageId) => {
    if (part.type === 'text') {
      return (
        <Message key={`${messageId}-${index}`} from="assistant">
          <MessageContent>
            <MessageResponse>{part.text}</MessageResponse>
          </MessageContent>
        </Message>
      );
    }

    // Tool call parts: type is "tool-<toolName>" in AI SDK v5
    if (part.type?.startsWith('tool-')) {
      const toolName = part.type.slice(5);
      const label = TOOL_LABELS[toolName] ?? toolName;
      const output = part.state === 'output-available' ? part.output : undefined;

      return (
        <Tool key={`${messageId}-${index}`}>
          <ToolHeader title={label} type={part.type} state={part.state} />
          <ToolContent>
            <ToolOutput output={output} />
          </ToolContent>
        </Tool>
      );
    }

    return null;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 relative size-full h-screen">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">RAG Knowledge QA</h1>
          <p className="text-sm text-muted-foreground">
            Multi-agent pipeline: Plan → Retrieve → Summarize → Verify
          </p>
        </div>

        {/* Conversation Area */}
        <Conversation className="flex-1">
          <ConversationContent>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-6">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold">Ask Anything About the Document</h2>
                  <p className="text-muted-foreground">
                    The pipeline will plan, retrieve, summarize, and verify your answer
                  </p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id}>
                {message.role === 'user' ? (
                  <Message from="user">
                    <MessageContent>
                      <MessageResponse>
                        {message.parts.find(p => p.type === 'text')?.text || message.content}
                      </MessageResponse>
                    </MessageContent>
                  </Message>
                ) : (
                  message.parts.map((part, i) => renderMessagePart(part, i, message.id))
                )}
              </div>
            ))}

            {status === 'submitted' && (
              <Message from="assistant">
                <MessageContent>
                  <div className="flex items-center gap-2">
                    <Loader />
                    <span className="text-sm text-muted-foreground">Running pipeline...</span>
                  </div>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>

          <ConversationScrollButton />
        </Conversation>

        {/* Suggestions */}
        {messages.length === 0 && (
          <Suggestions className="mb-4">
            <Suggestion
              onClick={() => handleSuggestionClick("What was XYZ Company's net income for the year ended June 30, 2002?")}
              suggestion="What was XYZ Company's net income for 2002?"
            />
            <Suggestion
              onClick={() => handleSuggestionClick("What are XYZ Company's total assets and liabilities as of June 30, 2002?")}
              suggestion="What are the total assets and liabilities?"
            />
            <Suggestion
              onClick={() => handleSuggestionClick("What were the largest operating expenses for XYZ Company in 2002?")}
              suggestion="What were the largest operating expenses?"
            />
          </Suggestions>
        )}

        {/* Input */}
        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Ask a question about the indexed document..."
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputSubmit disabled={!input} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

export default App;
