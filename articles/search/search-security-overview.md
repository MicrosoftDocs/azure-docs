---
title: Service and data security in Azure Search | Microsoft Docs
description: Security functionality built into Azure Search, including SOC 2 compliance, encryption, authentication, and identity access using user and group security identifiers in Azure Search filters.
services: search
documentationcenter: ''
author: HeidiSteen
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: search
ms.devlang: 
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 12/14/2017
ms.author: heidist

---
# Data security and access control in Azure Search operations



Access controls are a cross-section of basic permissions (read vs read-write) and the context of the connection. For both indexing and querying, you are always connecting to either the service and an object in tandem.

management (write)
create, modify, refresh, delete
Service > Index | Indexer | Data Source (indexer-related) | Suggesters | SynonymMaps


query execution (read)
service > index 
client applications issue requests against an index

Although there are multiple objects, many of them are used only during indexing (such as indexers and data sources), or serve as an extension to an index (suggesters and synonyms). Only an index is accessed during query execution.

API provides access to constructs and operations along specific paths. Security mechanims are built into these access points.

security mechanisms integrate into typical workflows.


Most connections are read-only because search execution is read only.
Write operations consist of creating, refreshing, or deleting data structures in your service: indexes, suggesters, synonym maps, indexers, indexer data sources.

Access the service operations through an api-key that grants two levels of access: full (write operations on the service) or query (read-only).

Connections require two things: a key and endpoint. 

Without a key, you cannot access a service. Without an endpoint that includes a particular index and operation, you cannot connect.


Connections are scoped to a particular index -- there is no concept of joining indexes or accessing multiple indexes simultaneously for query operations.

+ Portal access
+ Management API


This article explains how access to service operations and data is controlled in Azure Search.

## Physical security

Microsoft data centers provide industry-leading physical security and are compliant with a comprehensive portfolio of standards and regulations. To learn more, go to our [Global data centers](https://www.microsoft.com/cloud-platform/global-datacenters) page or watch the [Discover world class security at Microsoft data centers](https://www.youtube.com/watch?v=r1cyTL8JqRg) video.

## Encrypted storage on backend

Azure Search provides built-in encryption at rest on its backend storage layer with full [AICPA SOC 2 compliance](https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/aicpasoc2report.html) for all new services created after December 31 2017. Encryption is in effect in all regional data centers offering Azure Search resources.

Encryption is transparent, with encryption keys managed internally, and universally applied. You cannot turn it off for specific services or indexes, nor manage keys directly, nor supply your own.

## Service access and authentication

Across the Azure cloud platform, access keys are frequently used as the authentication methodology. Cognitive Services, numerous data services, and Azure search itself use an access key on the request as proof of trust. Requests including an access key valid for the service endpoint is trusted to perform operations on that service.

In Azure Search, per-service authentication exists on two levels: full rights, query-only 

Full rights administrative access keys are generated when the service is provisioned. Having two preserves serivce cont business continuity

<screenshot>
You can obtain access keys in the portal or through the Management REST API. For more information, see [Manage keys](search-manage.md#manage-api-keys).

## Index access

Be
Connections are 

???

## Authorized access to content

Filter by security identity (user or group) >> filters search results

## Questions

How to limit access to service
How to limit access to indexes
How to limit access to content

What are the security principals/ what can I secure

## See also

