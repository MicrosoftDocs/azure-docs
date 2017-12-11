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
# Data security and controlled access to Azure Search operations

In Azure Search, security is comprehensive, starting at the physical layer, moving up through encryption on transmissions and backend data, culminating on per-user requests for operations and content. This article covers security at each level, with primary focus on how operations and data are secured in Azure Search.

Access to service operations are through api-keys that grants two levels of access: full (write operations on the service) or query (read-only). Access control is a cross-section of basic permissions (read vs read-write) plus a context that defines a scope of operations. For both indexing and querying, you connect to the service and an object in tandem.When chained to an object (service, index, and so forth), these two permission levels satisfy most security requirements.

Specifically, in the context of search, most connections are read-only queries. Less frequent are the write operations that modify content structures managed by your service: creating, refreshing, or deleting indexes, suggesters, synonym maps, indexers, indexer data sources.

Every connection requires an access key and a fully-qualified endpoint. Without a key, you cannot access a service. Without an endpoint that also includes a particular index and operation, you cannot connect.

## Physical security

Microsoft data centers provide industry-leading physical security and are compliant with a comprehensive portfolio of standards and regulations. To learn more, go to our [Global data centers](https://www.microsoft.com/cloud-platform/global-datacenters) page or watch a short video on data center security.

> [!VIDEO https://www.youtube.com/embed/r1cyTL8JqRg]

## Encrypted storage on backend

Azure Search leverages built-in encryption on its backend storage layer with full [AICPA SOC 2 compliance](https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/aicpasoc2report.html) for all new services created after December 31 2017. Encryption is in effect in all regional data centers offering Azure Search resources.

Encryption is transparent, with encryption keys managed internally, and universally applied. You cannot turn it off for specific services or indexes, nor manage keys directly, nor supply your own.

## Azure-wide security features

Several security mechanisms are available across the Azure Stack, and thus automatically available to the Azure Search resources you create.

+ Locks at the subscription or resource level
+ Role-based Access Control (RBAC)

All Azure services support role-based access controls (RBAC) for setting levels of access consistently across all services. For example, viewing sensitive data, such as the admin key, is restricted to the Owner and Contributor roles, whereas viewing service status is available to members of any role. 

RBAC provides Owner, Contributor, and Reader roles. By default, all service administrators are members of the Owner role. For details, see Role-based access control in the Azure portal.

## Azure Search authentication

Authentication occurs on each request and is based on an access key that determines the scope of operations. A valid access key is considered proof the request originates from a trusted entity. 

In Azure Search, per-service authentication exists at two levels: full rights, query-only. The type of key determines which level of access is in effect.

|Key|Description|Limits|  
|---------|-----------------|------------|  
|Admin|Admin keys grant full rights to all operations, including the ability to manage the service, create and delete **indexes**, **indexers**, and **data sources**.<br /><br /> Two admin **api-keys**, referred to as *primary* and *secondary* keys in the portal,  are generated when the service is created and can be individually regenerated on demand. Having two keys allows you to roll over one key while using the second key for continued access to the service.<br /><br /> Admin keys are only specified in HTTP request headers. You cannot place an admin **api-key** in a URL.|Maximum of 2 per service|  
|Query|Query keys grant read-only access to indexes and documents, and are typically distributed to client applications that issue search requests.<br /><br /> Query keys are created on demand. You can create them manually in the portal or programmatically via the [Management REST API](https://docs.microsoft.com/rest/api/searchmanagement/).<br /><br /> Query keys can be specified  in an HTTP request header for search, suggestion, or lookup operation. Alternatively, you can pass a query key  as a parameter on a URL. Depending on how your client application formulates the request, it might be easier to pass the key as a query parameter:<br /><br /> `GET /indexes/hotels/docs?search=*&$orderby=lastRenovationDate desc&api-version=2016-09-01&api-key=A8DA81E03F809FE166ADDB183E9ED84D`|50 per service|  

 Visually, there is no distinction between an admin key or query key. Both keys are strings composed of 32 randomly-generated alpha-numeric characters. If you lose track of what type of key is specified in your application, you can [check the key values in the portal](https://portal.azure.com) or use the [REST API](https://docs.microsoft.com/rest/api/searchmanagement/) to return the value and key type.  

> [!NOTE]  
>  It is considered a poor security practice to pass sensitive data such as an `api-key` in the request URI. For this reason, Azure Search will only accept a query key as an `api-key` in the query string, and you should avoid doing so unless the contents of your index should be publicly available. As a general rule, we recommend passing your `api-key` as a request header.  

### How to access keys

You can obtain access keys in the portal or through the [Management REST API](https://docs.microsoft.com/rest/api/searchmanagement/). For more information, see [Manage keys](search-manage.md#manage-api-keys).

![Portal page, Settings, Keys section][../media/search-security-overview/settings-keys.png]

## Index access

No built-in index security.
Access control is at the service level.
multi-tenancy solutions often include a middle tier that handles index isolation.
Connections are scoped to a particular index -- there is no concept of joining indexes or accessing multiple indexes simultaneously for query operations.

## Administrative access 

The Azure Search Management REST API is an extension of the Azure Resource Manager and shares its dependencies. As such, Active Directory is a prerequisite to service administration of Azure Search. All administrative requests from client code must be authenticated using Azure Active Directory before the request reaches the resource manager.

Note that if your application code handles service administration operations as well as data operations on search indexes or documents, you'll be using two authentication approaches for each of the Azure Search service APIs:
Service and key administration, due to the dependency on Resource Manager, relies on Active Directory for authentication.

Data requests against the Azure Search service endpoint, such as Create Index (Azure Search Service REST API) or Search Documents (Azure Search Service REST API), use an api-key in the request header. See Azure Search Service REST for information about authenticating a data request.

Authentication documentation for ARM can be found at Use Resource Manager authentication API to access subscriptions.

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