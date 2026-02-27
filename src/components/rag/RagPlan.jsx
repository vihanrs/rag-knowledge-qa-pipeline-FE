import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ListChecksIcon, BrainIcon } from 'lucide-react';

export const RagPlan = ({ plan, subQuestions }) => {
  if (!plan && (!subQuestions || subQuestions.length === 0)) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainIcon className="size-5" />
          Query Plan
        </CardTitle>
        <CardDescription>
          How the planning agent decomposed your question
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {plan && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <BrainIcon className="size-4" />
              Strategy
            </div>
            <p className="ml-6 text-sm text-muted-foreground leading-relaxed">{plan}</p>
          </div>
        )}

        {subQuestions && subQuestions.length > 0 && (
          <>
            {plan && <Separator />}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ListChecksIcon className="size-4" />
                Sub-Questions
                <Badge variant="secondary">{subQuestions.length}</Badge>
              </div>
              <ol className="ml-6 space-y-1.5">
                {subQuestions.map((q, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="shrink-0 text-muted-foreground font-mono">{i + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
