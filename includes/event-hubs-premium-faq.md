---
title: include file
description: include file
services: event-hubs
author: kasun04
ms.service: event-hubs
ms.topic: include
ms.date: 05/12/2021
ms.author: kasun04
ms.custom: "include file"

---

### What can I achieve with a Processing Unit?

For Event Hubs Premium, how much you can ingest and stream depends on various factors such as your producers, consumers, the rate at which you're ingesting and processing, and much more. 
Approximately Event Hubs Premium can offer core capacity of ~5-10MB/s ingress and 10-20MB/s egress per processing unit give that we have sufficient enough partitions that storage is not a throttling factor.  

### Can I migrate my Standard namespaces to Premium namespace?
We don't currently support this.  
