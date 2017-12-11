---
title: Secure data and operations in Azure Search | Microsoft Docs
description: Azure Search security is based on SOC 2 compliance, encryption, authentication, and identity access through user and group security identifiers in Azure Search filters.
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

Azure Search is [SOC 2](https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/aicpasoc2report.html) compliant, with a comprehensive security architecture spanning physical security, encrypted transmissions, encrypted storage, and platform-wide software safeguards. Operationally, Azure Search only accepts authenticated requests. Optionally, you can add per-user access controls on content. This article touches on security at each layer, but is primarily focused on how data and operations are secured in Azure Search.

![Block diagram of security layers](media/search-security-overview/azsearch-security-diagram.png)

Access to Azure Search operations are through api-keys granting two levels of access: full (write operations on the service) or query (read-only). Per-user access to content is implemented through security filters on your queries, returning documents associated with a given security identity.

Service access is a cross-section of basic permissions (read or read-write) plus a context that defines a scope of operations. Every request is composed of a mandatory key, an operation, and an object. When chained together, the two permission levels of read and read-write are sufficient for providing full spectrum security on service operations. 

## Physical security

Microsoft data centers provide industry-leading physical security and are compliant with a comprehensive portfolio of standards and regulations. To learn more, go to the [Global data centers](https://www.microsoft.com/cloud-platform/global-datacenters) page or watch a short video on data center security.

> [!VIDEO https://www.youtube.com/embed/r1cyTL8JqRg]

## Encrypted transmission and storage

Azure Search listens on HTTPS port 443. Across the platform, connections to Azure services are encrypted. 

On the backend storage used for indexes and other constructs, Azure Search leverages the full [AICPA SOC 2 compliance](https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/aicpasoc2report.html) of the storage layer for all new search services created after December 31, 2017. Encryption is in effect in all regional data centers offering Azure Search resources. Encryption is transparent, with encryption keys managed internally, and universally applied. You cannot turn it off for specific services or indexes, nor manage keys directly, nor supply your own.

## Azure-wide logical security

Several security mechanisms are available across the Azure Stack, and thus automatically available to the Azure Search resources you create.

+ [Locks at the subscription or resource level to prevent deletion](../azure-resource-manager/resource-group-lock-resources.md)
+ [Role-based Access Control (RBAC) to control access to information and administrative operations](../active-directory/role-based-access-control-what-is.md)

All Azure services support role-based access controls (RBAC) for setting levels of access consistently across all services. For example, viewing sensitive data, such as the admin key, is restricted to the Owner and Contributor roles, whereas viewing service status is available to members of any role. RBAC provides Owner, Contributor, and Reader roles. By default, all service administrators are members of the Owner role.

## Service authentication

Azure Search supplies its own authentication methodology. Authentication occurs on each request and is based on an access key that determines the scope of operations. A valid access key is considered proof the request originates from a trusted entity. 

Per-service authentication exists at two levels: full rights, query-only. The type of key determines which level of access is in effect.

|Key|Description|Limits|  
|---------|-----------------|------------|  
|Admin|Grants full rights to all operations, including the ability to manage the service, create and delete **indexes**, **indexers**, and **data sources**.<br /><br /> Two admin **api-keys**, referred to as *primary* and *secondary* keys in the portal, are generated when the service is created and can be individually regenerated on demand. Having two keys allows you to roll over one key while using the second key for continued access to the service.<br /><br /> Admin keys are only specified in HTTP request headers. You cannot place an admin **api-key** in a URL.|Maximum of 2 per service|  
|Query|Grants read-only access to indexes and documents, and are typically distributed to client applications that issue search requests.<br /><br /> Query keys are created on demand. You can create them manually in the portal or programmatically via the [Management REST API](https://docs.microsoft.com/rest/api/searchmanagement/).<br /><br /> Query keys can be specified  in an HTTP request header for search, suggestion, or lookup operation. Alternatively, you can pass a query key  as a parameter on a URL. Depending on how your client application formulates the request, it might be easier to pass the key as a query parameter:<br /><br /> `GET /indexes/hotels/docs?search=*&$orderby=lastRenovationDate desc&api-version=2016-09-01&api-key=A8DA81E03F809FE166ADDB183E9ED84D`|50 per service|  

 Visually, there is no distinction between an admin key or query key. Both keys are strings composed of 32 randomly generated alpha-numeric characters. If you lose track of what type of key is specified in your application, you can [check the key values in the portal](https://portal.azure.com) or use the [REST API](https://docs.microsoft.com/rest/api/searchmanagement/) to return the value and key type.  

> [!NOTE]  
>  It is considered a poor security practice to pass sensitive data such as an `api-key` in the request URI. For this reason, Azure Search only accepts a query key as an `api-key` in the query string, and you should avoid doing so unless the contents of your index should be publicly available. As a general rule, we recommend passing your `api-key` as a request header.  

### How to find the access keys for your service

You can obtain access keys in the portal or through the [Management REST API](https://docs.microsoft.com/rest/api/searchmanagement/). For more information, see [Manage keys](search-manage.md#manage-api-keys).

1. Sign in to the [Azure portal](https://portal.azure.com).
2. List the [search services](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices)  for your subscription.
3. select the service and on the service page, find **Settings** >**Keys** to view admin and query keys.

![Portal page, Settings, Keys section](media/search-security-overview/settings-keys.png)

## Index access

In Azure Search, an individual index is not a securable object. Having access control at the service level meets the needs of most customers because connections are scoped to a particular index. There is no concept of joining indexes or accessing multiple indexes simultaneously for query operations. 

For multitenancy solutions requiring security boundaries at the index level, such solutions typically include a middle tier, which customers use to handle index isolation. For more information about the multitenant use case, see [Design patterns for multitenant SaaS applications and Azure Search](search-modeling-multitenant-saas-applications.md).

## Admin access from client apps

The Azure Search Management REST API is an extension of the Azure Resource Manager and shares its dependencies. As such, Active Directory is a prerequisite to service administration of Azure Search. All administrative requests from client code must be authenticated using Azure Active Directory before the request reaches the Resource Manager.

Data requests against the Azure Search service endpoint, such as Create Index (Azure Search Service REST API) or Search Documents (Azure Search Service REST API), use an api-key in the request header.

If your application code handles service administration operations as well as data operations on search indexes or documents, implement two authentication approaches in your code: the access key native to Azure Search, and the Active Directory authentication methodology required by Resource Manager. 

For information about structuring a request in Azure Search, see [Azure Search Service REST](https://docs.microsoft.com/rest/api/searchservice/). For more information about authentication requirements for Resource Manager, see [Use Resource Manager authentication API to access subscriptions](../azure-resource-manager/resource-manager-api-authentication.md).

## User access to content

For its own search-centric operations, Azure Search does not provide an internal authorization model with predefined roles and role assignments. Instead, customers with identity access control requirements are creating  security filters for trimming search results of documents and content based on identities. Advancements in filter construction have simplified th

The following table describes two approaches for limiting access to search results.

| Approach | Description |
|----------|-------------|
|[Identity-based access control using Azure Search filters](search-security-trimming-for-azure-search.md)  | Documents the basic workflow for implementing user identity access control. It covers adding security identifiers to an index, and then explains filtering against that field to trim results of prohibited content. |
|[Azure Active Directory identity-based access control using Azure Search filters](search-security-trimming-for-azure-search-with-aad.md)  | This article expands on the previous article, providing steps for retrieving identities from Azure Active Directory (AAD), one of the [free services](https://azure.microsoft.com/free/) in the Azure cloud platform. |

## Table: Permissioned operations

The following table summarizes the operations allowed in Azure Search and which key unlocks access a particular operation.

| Operation | Permissions |
|-----------|-------------------------|
| Create a service | Azure subscription holder|
| Scale a service | Admin key, RBAC Owner or Contributor on the resource  |
| Delete a service | Admin key, RBAC Owner or Contributor on the resource |
| Create, modify, delete indexes and component parts (including analyzer definitions, scoring profiles, CORS options), indexers, data sources, synonyms, suggesters. | Admin key, RBAC Owner or Contributor on the resource  |
| Query an index | Admin or query key (RBAC not applicable) |
| Query system information, such as returning statistics, counts, and lists of objects. | Admin key, RBAC on the resource (Owner, Contributor, Reader) |
| Manage admin keys | Admin key, RBAC Owner or Contributor on the resource. |
| Manage query keys |  Admin key, RBAC Owner or Contributor on the resource. RBAC Reader can view query keys. |


## See also

+ [Get started .NET (demonstrates using an admin key to create an index)](search-create-index-dotnet.md)
+ [Get started REST (demonstrates using an admin key to create an index)](search-create-index-rest-api.md)
+ [Identity-based access control using Azure Search filters](search-security-trimming-for-azure-search.md)
+ [Active Directory identity-based access control using Azure Search filters](search-security-trimming-for-azure-search-with-aad.md)
+ [Filters in Azure Search](search-filters.md)