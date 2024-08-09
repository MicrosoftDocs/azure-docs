---
title: Stream Analytics job with Event Hubs Geo-replication
description: This article has important notes about the behavior of Azure Stream Analytics jobs that process events from Azure Event Hubs. 
author: spelluru
ms.topic: include
ms.date: 08/08/2024
ms.author: spelluru
---

## Considerations when using the Event Hubs Geo-replication feature
Azure Event Hubs recently launched the [Geo-Replication](geo-replication.md) feature in public preview. This feature is different from the [Geo Disaster Recovery](event-hubs-geo-dr.md) feature of Azure Event Hubs.

When the failover type is **Forced** and replication consistency is **Asynchronous**, Stream Analytics job doesn't guarantee exactly once output to an Azure Event Hubs output. 

Azure Stream Analytics, as **producer** with an event hub an output, might observe watermark delay on the job during failover duration and during throttling by Event Hubs in case replication lag  between primary and secondary reaches the maximum configured lag.

Azure Stream Analytics, as **consumer** with Event Hubs as Input, might observe watermark delay on the job during failover duration and might skip data or find duplicate data after failover is complete. 

Due to these caveats, we recommend that you restart the Stream Analytics job with appropriate start time right after Event Hubs failover is complete. Also, since Event Hubs Geo-replication feature is in public preview, we don't recommend using this pattern for production Stream Analytics jobs at this point. The current Stream Analytics behavior will improve before the Event Hubs Geo-replication feature is generally available and can be used in Stream Analytics production jobs.