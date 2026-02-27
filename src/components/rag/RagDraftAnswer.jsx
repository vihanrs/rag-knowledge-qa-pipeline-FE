import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PencilLineIcon } from 'lucide-react';
import { MessageResponse } from '@/components/ai-elements/message';

export const RagDraftAnswer = ({ draftAnswer }) => {
  if (!draftAnswer) return null;

  return (
    <Card className="w-full border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PencilLineIcon className="size-5" />
          Draft Answer
          <Badge variant="outline" className="text-xs font-normal">unverified</Badge>
        </CardTitle>
        <CardDescription>
          Initial answer from the summarization agent, before verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MessageResponse className="text-sm text-muted-foreground">
          {draftAnswer}
        </MessageResponse>
      </CardContent>
    </Card>
  );
};
