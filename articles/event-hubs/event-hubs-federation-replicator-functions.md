---
title: Event replication tasks and applications - Azure Event Hubs | Microsoft Docs
description: This article provides an overview of building event replication tasks and applications with Azure Functions
ms.topic: article
ms.date: 09/15/2020
---

# Event replication tasks and applications

[Azure Functions](../azure-functions/functions-overview.md) is a scalable and reliable execution environment for configuring and running [event replication and federation](event-hubs-federation-overview.md) tasks.

In this overview, you will learn about Azure Functions' built-in capabilities for such applications, about pre-built code blocks that you can adapt and modify for transformation tasks, and about how to configure an Azure Functions application such that it integrates ideally with Event Hubs and other Azure Messaging services. For many details, this article will point to the Azure Functions documentation.

## What is a replication task?

A replication task receives events from a source and forwards them to a target. As the task forwards the events, it might perform one or more actions on the forwarded events, for instance:

- *Transcoding* - If the event content (also referred to as "body" or "payload") arrives from the source encoded using the Apache Avro format or some proprietary serialization format, but the expectation of the system owning the target is for the content to be JSON encoded, a transcoding replication task will first deserialize the payload from Apache Avro into an in-memory object graph and then serialize that graph into the JSON format for the event that is being forwarded.  
- *Transformation* - Events that contain structured data may require reshaping of that data for easier consumption by downstream consumers. This may involve work like flattening nested structures, pruning extraneous data elements, or reshaping the payload to exactly fit a given schema.
- *Validation* - Event data from external sources often need to be checked for whether they are in compliance with a set of rules before they may be forwarded. The rules may be expressed using schemas or code. Events that are found not to be in compliance may be dropped, with the issue noted in logs, or may be forwarded to a special target destination to handle them further.
- *Enrichment* - Event data coming from some sources may require enrichment with further context for it to be usable in target systems. This may involve looking up reference data and embedding that data with the event, or adding information about the source that is known to the replication task, but not contained in the events. 
- *Filtering* - Some events arriving from a source might have to be withheld from the target based on some rule. A filter tests the event against a rule and drops the event if the event does not match the rule.
- *Routing* - Some replication tasks may allow for two or more alternative targets, and define rules for which replication target is chosen for any particular event.
- 