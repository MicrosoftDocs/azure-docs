---
title: External availability error codes - Azure Stream Analytics
description: Troubleshoot Azure Stream Analytics issues with external availability error codes. 
author: ahartoon
ms.author: anboisve
ms.topic: troubleshooting
ms.date: 05/07/2020
ms.service: stream-analytics
---

# Azure Stream Analytics external availability error codes

You can use activity logs and resource logs to help debug unexpected behaviors from your Azure Stream Analytics job. This article lists the description for every external availability error code. External availability errors occur when a dependent service is unavailable.

## ExternalServiceUnavailable

* **Cause**: A service is temporarily unavailable.
* **Recommendation**: Stream Analytics will continue to attempt to reach the service.

## EventHubMessagingError

* **Cause**: Stream Analytics encountered error when communicating with Event Hubs. 


## Next steps

* [Troubleshoot input connections](stream-analytics-troubleshoot-input.md)
* [Troubleshoot Azure Stream Analytics outputs](stream-analytics-troubleshoot-output.md)
* [Troubleshoot Azure Stream Analytics queries](stream-analytics-troubleshoot-query.md)
* [Troubleshoot Azure Stream Analytics by using resource logs](stream-analytics-job-diagnostic-logs.md)
* [Azure Stream Analytics data errors](data-errors.md)
