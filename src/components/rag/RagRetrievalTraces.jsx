import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DatabaseIcon } from 'lucide-react';

export const RagRetrievalTraces = ({ retrievalTraces }) => {
  if (!retrievalTraces) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DatabaseIcon className="size-5" />
          Retrieval Traces
        </CardTitle>
        <CardDescription>
          Context chunks retrieved from the knowledge base
        </CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed font-mono bg-muted/50 rounded-md p-3 overflow-x-auto">
          {retrievalTraces}
        </pre>
      </CardContent>
    </Card>
  );
};
