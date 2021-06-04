---
title: Scenarios and best practices for monitoring Azure Blob Storage
description: Learn best practice guidelines and how to them when using metrics and logs to monitor your Azure Blob Storage. 
author: normesta
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
ms.author: normesta
ms.date: 05/28/2021
ms.custom: "monitoring"
---

# Scenarios and best practices for monitoring Azure Blob Storage

Intro goes here

## Monitor use and capacity

Tasks for determining use and capacity

#### Identify storage accounts with no or low use

Monitor for accounts that have low or now traffic. This includes write and read operations and even storage levels.

#### Monitor the capacity of a container

Details go here

## Monitor activity

Tasks for monitoring account activity

#### Audit activities for Blob Storage

This is about compliance auditing. Compliance auditing companies will often time be hired to audit a companies cloud platform based on controls. A popular control that relates to this scenario is about "access management". We need to use this section to discuss both data plane and control plane operations audit. The key elements of logs - who why what when.

#### Analyze traffic per source

This where we can suggest different approaches to determining traffic (bytes - operation type etc) by source. Source could be a service principal or AD identity. If no AD is used, we can show how to identity traffic by IP address. We'll have to call out that multiple people can use an IP address so this might not always be the best identifier. They can also identify traffic by agent. An agent also has challenges. Discuss exactly what those are with Francis.

##### Identify the client associated with a request

This is a subheading of the "Analyze traffic per source".

## Optimize cost

#### Optimize cost for infrequent queries

This is a scenario that applies in cases where there may be an annual compliance audit. The cost of query analytics is high. It could be lower cost to store these logs in storage archive and use tiering to save. Then at the time a query is needed, to use whatever mechanism makes sense to query the logs. This could be more cost effective.

## See also

- [Monitoring Azure Blob Storage](monitor-blob-storage.md).

  

