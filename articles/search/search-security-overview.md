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

In Azure Search, access control is a cross-section of basic permissions (read vs read-write) plus a context that defines a scope of operations. For both indexing and querying, you connect to the service and an object in tandem.

You connect to the service to perform some type of operation, such as indexing, queries, or returning system information. 

service management vs service operations 

Administrator rights


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

Connections used in an operation require two things: a key and a qualified endpoint. Without a key, you cannot access a service. Without an endpoint that also includes a particular index and operation, you cannot connect.

The following example illustrates the point. Connections are scoped to a particular index -- there is no concept of joining indexes or accessing multiple indexes simultaneously for query operations.

+ Portal access
+ Management API

This article explains how access to service operations and data is controlled in Azure Search.

## Physical security

Microsoft data centers provide industry-leading physical security and are compliant with a comprehensive portfolio of standards and regulations. To learn more, go to our [Global data centers](https://www.microsoft.com/cloud-platform/global-datacenters) page or watch the [Discover world class security at Microsoft data centers](https://www.youtube.com/watch?v=r1cyTL8JqRg) video.

## Encrypted storage on backend

Azure Search provides built-in encryption at rest on its backend storage layer with full [AICPA SOC 2 compliance](https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/aicpasoc2report.html) for all new services created after December 31 2017. Encryption is in effect in all regional data centers offering Azure Search resources.

Encryption is transparent, with encryption keys managed internally, and universally applied. You cannot turn it off for specific services or indexes, nor manage keys directly, nor supply your own.

## Authentication on requests

Authentication occurs on each request and is based on an access key that determines the scope of operations. A valid access key is considered proof the request originates from a trusted entity. 

In Azure Search, per-service authentication exists at two levels: full rights, query-only (described below).
 
<screenshot>

You can obtain access keys in the portal or through the Management REST API. For more information, see [Manage keys](search-manage.md#manage-api-keys).

There are  two types of **api-keys** for different levels of operation.  

|Key|Description|Limits|  
|---------|-----------------|------------|  
|Admin|Admin keys grant full rights to all operations, including the ability to manage the service, create and delete **indexes**, **indexers**, and **data sources**.<br /><br /> Two admin **api-keys**, referred to as *primary* and *secondary* keys in the portal,  are generated when the service is created and can be individually regenerated on demand. Having two keys allows you to roll over one key while using the second key for continued access to the service.<br /><br /> Admin keys are only specified in HTTP request headers. You cannot place an admin **api-key** in a URL.|Maximum of 2 per service|  
|Query|Query keys grant read-only access to indexes and documents, and are typically distributed to client applications that issue search requests.<br /><br /> Query keys are created on demand. You can create them manually in the portal or programmatically via the [Management REST API](~/docs-ref-conceptual/searchmanagement/index.md).<br /><br /> Query keys can be specified  in an HTTP request header for search, suggestion, or lookup operation. Alternatively, you can pass a query key  as a parameter on a URL. Depending on how your client application formulates the request, it might be easier to pass the key as a query parameter:<br /><br /> `GET /indexes/hotels/docs?search=*&$orderby=lastRenovationDate desc&api-version=2016-09-01&api-key=A8DA81E03F809FE166ADDB183E9ED84D`|50 per service|  

 Visually, there is no distinction between an admin key or query key. Both keys are strings composed of 32 randomly-generated alpha-numeric characters. If you lose track of what type of key is specified in your application, you can [check the key values in the portal](https://portal.azure.com) or use the [REST API](~/docs-ref-conceptual/searchmanagement/index.md) to return the value and key type.  

> [!NOTE]  
>  It is considered a poor security practice to pass sensitive data such as an `api-key` in the request URI. For this reason, Azure Search will only accept a query key as an `api-key` in the query string, and you should avoid doing so unless the contents of your index should be publicly available. As a general rule, we recommend passing your `api-key` as a request header.  

## Index access

No built-in index security.
Access control is at the service level.
multi-tenancy solutions often include a middle tier that handles index isolation.


## Administrative roles  

All Azure services support role-based access controls (RBAC) for setting levels of access consistently across all services. For example, viewing sensitive data, such as the admin key, is restricted to the Owner and Contributor roles, whereas viewing service status is available to members of any role.

## User access to content

 For its own search-centric operations, Azure Search does not provide an authorization model. You cannot define or assign roles that filter search results based on user identity, nor can you vary the level of permissions on search operations beyond what's provided via the admin and query **api-keys**.  


Filter by security identity (user or group) >> filters search results


## Table: Access to operations

The following table summarizes the operations allowed in Azure Search and which key unlocks access a particular operation.

| Operation | Key requirements |
|-----------|-------------------------|
| Create a service | Azure sbuscription holder |
| Scale a service | Admin key |
| Delete a service | Admin key|
| Create, modify, delete indexes and component parts (including analyzer definitions, scoring profiles, CORS options), indexers, data sources, synonyms, suggesters. | Admin key |
| Query an index | Admin or query key |
| Query system information, such as returning statistics, counts, and lists of objects. | Admin key |
| Manage access keys | Admin key and Azure subscription key |


## See also

+ [Identity-based access control using Azure Search filters](search-security-trimming-for-azure-search.md)
+ [Active Directory identity-based access control using Azure Search filters](search-security-trimming-for-azure-search-with-aad.md)
+ [Filters in Azure Search](search-filters.md)