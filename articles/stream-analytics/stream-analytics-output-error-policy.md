---
title: Output error policies in Azure Stream Analytics
description: Learn about the Retry and Drop output error handling policies in Azure Stream Analytics, including how each policy works and when to use them.
author: AliciaLiMicrosoft
ms.author: ali
ms.service: azure-stream-analytics
ms.topic: concept-article
ms.date: 06/10/2026
ai-usage: ai-assisted

#customer intent: As a developer or data engineer, I want to understand the output error handling policies in Azure Stream Analytics so that I can choose the right policy for my streaming job.
---
# Azure Stream Analytics output error policies

An output error policy is a configuration in Azure Stream Analytics that controls how the job handles data conversion errors when an output event doesn't conform to the schema of the target sink. Azure Stream Analytics provides two policies: **Retry** and **Drop**.

To configure the policy in the Azure portal, open a Stream Analytics job, select **Error policy** under **Settings**, and then choose the policy you want.

:::image type="content" source="./media/stream-analytics-output-error-policy/stream-analytics-error-policy-locate.png" alt-text="Screenshot that shows the Error Policy option under Configure in a Stream Analytics job in the Azure portal.":::


## Retry policy

When a data conversion error occurs, Azure Stream Analytics retries writing the event indefinitely until the write succeeds. There's no timeout for retries. The event that's retrying blocks all subsequent events from processing. This policy also blocks the output where the error occurred and any other outputs that share the same input.

Retry is the default output error handling policy. The retry interval varies based on the output and can range from a few seconds to a few minutes over subsequent retries.


## Drop policy

Azure Stream Analytics drops any output event that results in a data conversion error. You can't recover dropped events for reprocessing later.

> [!NOTE]
> Azure Stream Analytics retries all transient errors (for example, network errors) regardless of the output error handling policy configuration.


## Related content

- [Understand outputs from Azure Stream Analytics](./stream-analytics-define-outputs.md)
- [Troubleshoot Azure Stream Analytics outputs](./stream-analytics-troubleshoot-output.md)
- [Troubleshoot Azure Stream Analytics by using resource logs](./stream-analytics-job-diagnostic-logs.md)
