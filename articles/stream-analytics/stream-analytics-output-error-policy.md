---
title: Output error policies in Azure Stream Analytics
description: Learn about the output error handling policies available in Azure Stream Analytics.
author: AliciaLiMicrosoft 
ms.author: ali 
ms.service: azure-stream-analytics
ms.topic: conceptual
ms.date: 05/30/2021
---
# Azure Stream Analytics output error policy
This article describes the output data error handling policies that can be configured in Azure Stream Analytics.

Output data error handling policies apply only to data conversion errors that occur when the output event produced by a Stream Analytics job does not conform to the schema of the target sink. You can configure this policy by choosing either **Retry** or **Drop**. In the Azure portal, while in a Stream Analytics job, under **Configure**, select **Error Policy** to make your selection.

![Azure Stream Analytics output error policy location](./media/stream-analytics-output-error-policy/stream-analytics-error-policy-locate.png)


## Retry
When an error occurs, Azure Stream Analytics retries writing the event indefinitely until the write succeeds. There is no timeout for retries. Eventually all subsequent events are blocked from processing by the event that is retrying. This will then block the output on which the error happened, as well as any other outputs sharing the same input.
This option is the default output error handling policy. Retry interval can vary based on each output and can range from a few seconds to a few minutes over subsequent retries.


## Drop
Azure Stream Analytics will drop any output event that results in a data conversion error. The dropped events cannot be recovered for reprocessing later.


All transient errors (for example, network errors) are retried regardless of the output error handling policy configuration.


## Next steps
[Troubleshooting guide for Azure Stream Analytics](./stream-analytics-troubleshoot-query.md)
