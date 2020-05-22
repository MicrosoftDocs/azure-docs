---
title: Troubleshoot with Azure Stream Analytics error codes
description: Troubleshoot Azure Stream Analytics issues with internal error codes.
ms.author: mamccrea
author: mamccrea
ms.topic: conceptual
ms.date: 05/07/2020
ms.service: stream-analytics
---

# Azure Stream Analytics internal error codes

You can use activity logs and resource logs to help debug unexpected behaviors from your Azure Stream Analytics job. This article lists the description for every internal error code. Internal errors are generic errors that are thrown within the Stream Analytics platform when Stream Analytics can't distinguish if the error is an Internal Availability error or a bug in the system.

## CosmosDBOutputBatchSizeTooLarge

* **Cause**: The batch size used to write to Cosmos DB is too large. 
* **Recommendation**: Retry with a smaller batch size.

## Next steps

* [Troubleshoot input connections](stream-analytics-troubleshoot-input.md)
* [Troubleshoot Azure Stream Analytics outputs](stream-analytics-troubleshoot-output.md)
* [Troubleshoot Azure Stream Analytics queries](stream-analytics-troubleshoot-query.md)
* [Troubleshoot Azure Stream Analytics by using resource logs](stream-analytics-job-diagnostic-logs.md)
* [Azure Stream Analytics data errors](data-errors.md)