---
title: Stream data as input into Azure Stream Analytics
description: Learn about setting up a data connection in Azure Stream Analytics. Inputs include a data stream from events, and also reference data.
services: stream-analytics
author: sidram
ms.author: sidram
manager: jeanb
ms.reviewer: jasonh
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 07/27/2018
---
# Output Error Policy
This article describes the output data error handling policies that can be configured in Azure Stream Analytics.

Output data error handling policies apply only to data conversion errors that occur when the output event produced by a Stream Analytics job does not conform to the schema of the target sink. You can configure this policy by choosing either **Retry** or **Drop**.

## Retry
Azure Stream Analytics will retry writing the event indefinitely until it succeeds. There is no timeout for retries. Eventually all subsequent events are blocked from processing by the event that is retrying. The time intervals between retries increase exponentially. This is the default output error handling policy.

## Drop
Azure Stream Analytics will drop any output event that results in a data conversion error. The dropped events cannot be recovered for re-processing later.


All transient errors (e.g., network errors) are retried regardless of the output error handling policy configuration.
