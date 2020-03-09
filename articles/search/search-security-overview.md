---
title: Security and data privacy
titleSuffix: Azure Cognitive Search
description: Azure Cognitive Search is compliant with SOC 2, HIPAA, and other certifications. Connection and data encryption, authentication, and identity access through user and group security identifiers in filter expressions.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---

# Security and data privacy in Azure Cognitive Search

Comprehensive security features and access controls are built into Azure Cognitive Search to ensure private content remains that way. This article enumerates the security features and standards compliance built into Azure Cognitive Search.

Azure Cognitive Search security architecture spans physical security, encrypted transmissions, encrypted storage, and platform-wide standards compliance. Operationally, Azure Cognitive Search only accepts authenticated requests. Optionally, you can add per-user access controls on content through security filters. This article touches on security at each layer, but is primarily focused on how data and operations are secured in Azure Cognitive Search.

## Standards compliance: ISO 27001, SOC 2, HIPAA

Azure Cognitive Search is certified for the following standards, as [announced in June 2018](https://azure.microsoft.com/blog/azure-search-is-now-certified-for-several-levels-of-compliance/):

+ [ISO 27001:2013](https://www.iso.org/isoiec-27001-information-security.html) 
+ [SOC 2 Type 2 compliance](https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/aicpasoc2report.html) For the full report, go to [Azure - and Azure Government SOC 2 Type II Report](https://servicetrust.microsoft.com/ViewPage/MSComplianceGuide?command=Download&downloadType=Document&downloadId=93292f19-f43e-4c4e-8615-c38ab953cf95&docTab=4ce99610-c9c0-11e7-8c2c-f908a777fa4d_SOC%20%2F%20SSAE%2016%20Reports). 
+ [Health Insurance Portability and Accountability Act (HIPAA)](https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act)
+ [GxP (21 CFR Part 11)](https://en.wikipedia.org/wiki/Title_21_CFR_Part_11)
+ [HITRUST](https://en.wikipedia.org/wiki/HITRUST)
+ [PCI DSS Level 1](https://en.wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard)
+ [Australia IRAP Unclassified DLM](https://asd.gov.au/infosec/irap/certified_clouds.htm)

Standards compliance applies to generally available features. Preview features are certified when they transition to general availability, and must not be used in solutions having strict standards requirements. Compliance certification is documented in [Overview of Microsoft Azure compliance](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942) and the [Trust Center](https://www.microsoft.com/en-us/trustcenter). 

## Encrypted transmission and storage

Encryption extends throughout the entire indexing pipeline: from connections, through transmission, and down to indexed data stored in Azure Cognitive Search.

| Security layer | Description |
|----------------|-------------|
| Encryption in transit <br>(HTTPS/SSL/TLS) | Azure Cognitive Search listens on HTTPS port 443. Across the platform, connections to Azure services are encrypted. <br/><br/>All client-to-service Azure Cognitive Search interactions are SSL/TLS 1.2 capable.  Be sure to use TLSv1.2 for SSL connections to your service.|
| Encryption at rest <br>Microsoft managed keys | Encryption is fully internalized in the indexing process, with no measurable impact on indexing time-to-completion or index size. It occurs automatically on all indexing, including on incremental updates to an index that is not fully encrypted (created before January 2018).<br><br>Internally, encryption is based on [Azure Storage Service Encryption](https://docs.microsoft.com/azure/storage/common/storage-service-encryption), using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard).<br><br> Encryption is internal to Azure Cognitive Search, with certificates and encryption keys managed internally by Microsoft, and universally applied. You cannot turn encryption on or off, manage or substitute your own keys, or view encryption settings in the portal or programmatically.<br><br>Encryption at rest was announced in January 24, 2018 and applies to all service tiers, including the free tier, in all regions. For full encryption, indexes created prior to that date must be dropped and rebuilt in order for encryption to occur. Otherwise, only new data added after January 24 is encrypted.|
| Encryption at rest <br>Customer managed keys | Encryption with customer managed keys is now generally available for search services created on or after January 2019. It is not supported on Free (shared) services.<br><br>Azure Cognitive Search indexes and synonym maps can now be encrypted at rest with customer keys managed keys in Azure Key Vault. To learn more, see [Manage encryption keys in Azure Cognitive Search](search-security-manage-encryption-keys.md).<br><br>This feature is not replacing the default encryption at rest, but rather applied in addition to it.<br><br>Enabling this feature will increase index size and degrade query performance. Based on observations to date, you can expect to see an increase of 30%-60% in query times, although actual performance will vary depending on the index definition and types of queries. Because of this performance impact, we recommend that you only enable this feature on indexes that really require it.

## Azure-wide user access controls

Several security mechanisms are available Azure-wide, and thus automatically available to the Azure Cognitive Search resources you create.

+ [Locks at the subscription or resource level to prevent deletion](../azure-resource-manager/management/lock-resources.md)
+ [Role-based Access Control (RBAC) to control access to information and administrative operations](../role-based-access-control/overview.md)

All Azure services support role-based access controls (RBAC) for setting levels of access consistently across all services. For example, viewing sensitive data, such as the admin key, is restricted to the Owner and Contributor roles, whereas viewing service status is available to members of any role. RBAC provides Owner, Contributor, and Reader roles. By default, all service administrators are members of the Owner role.

<a name="service-access-and-authentication"></a>

## Service access and authentication

While Azure Cognitive Search inherits the security safeguards of the Azure platform, it also provides its own key-based authentication. An api-key is a string composed of randomly generated numbers and letters. The type of key (admin or query) determines the level of access. Submission of a valid key is considered proof the request originates from a trusted entity. 

There are two levels of access to your search service, enabled by two types of keys:

* Admin access (valid for any read-write operation against the service)
* Query access (valid for read-only operations, such as queries, against the documents collection of an index)

*Admin keys* are created when the service is provisioned. There are two admin keys, designated as *primary* and *secondary* to keep them straight, but in fact they are interchangeable. Each service has two admin keys so that you can roll one over without losing access to your service. You can [regenerate admin key](search-security-api-keys.md#regenerate-admin-keys) periodically per Azure security best practices, but you cannot add to the total admin key count. There are a maximum of two admin keys per search service.

*Query keys* are created as-needed and are designed for client applications that issue queries. You can create up to 50 query keys. In application code, you specify the search URL and a query api-key to allow read-only access to the documents collection of a specific index. Together, the endpoint, an api-key for read-only access, and a target index define the scope and access level of the connection from your client application.

Authentication is required on each request, where each request is composed of a mandatory key, an operation, and an object. When chained together, the two permission levels (full or read-only) plus the context (for example, a query operation on an index) are sufficient for providing full-spectrum security on service operations. For more information about keys, see [Create and manage api-keys](search-security-api-keys.md).

## Index access

In Azure Cognitive Search, an individual index is not a securable object. Instead, access to an index is determined at the service layer (read or write access), along with the context of an operation.

For end-user access, you can structure query requests to connect using a query key, which makes any request read-only, and include the specific index used by your app. In a query request, there is no concept of joining indexes or accessing multiple indexes simultaneously so all requests target a single index by definition. As such, construction of the query request itself (a key plus a single target index) defines the security boundary.

Administrator and developer access to indexes is undifferentiated: both need write access to create, delete, and update objects managed by the service. Anyone with an admin key to your service can read, modify, or delete any index in the same service. For protection against accidental or malicious deletion of indexes, your in-house source control for code assets is the remedy for reversing an unwanted index deletion or modification. Azure Cognitive Search has failover within the cluster to ensure availability, but it does not store or execute your proprietary code used to create or load indexes.

For multitenancy solutions requiring security boundaries at the index level, such solutions typically include a middle tier, which customers use to handle index isolation. For more information about the multitenant use case, see [Design patterns for multitenant SaaS applications and Azure Cognitive Search](search-modeling-multitenant-saas-applications.md).

## Admin access

[Role-based access (RBAC)](https://docs.microsoft.com/azure/role-based-access-control/overview) determines whether you have access to controls over the service and its content. If you are an Owner or Contributor on an Azure Cognitive Search service, you can use the portal or the PowerShell **Az.Search** module to create, update, or delete objects on the service. You can also use the [Azure Cognitive Search Management REST API](https://docs.microsoft.com/rest/api/searchmanagement/search-howto-management-rest-api).

## User access

By default, user access to an index is determined by the access key on the query request. Most developers create and assign [*query keys*](search-security-api-keys.md) for client-side search requests. A query key grants read access to all content within the index.

If you require granular, per-user control over content, you can build security filters on your queries, returning documents associated with a given security identity. Instead of predefined roles and role assignments, identity-based access control is implemented as a *filter* that trims search results of documents and content based on identities. The following table describes two approaches for trimming search results of unauthorized content.

| Approach | Description |
|----------|-------------|
|[Security trimming based on identity filters](search-security-trimming-for-azure-search.md)  | Documents the basic workflow for implementing user identity access control. It covers adding security identifiers to an index, and then explains filtering against that field to trim results of prohibited content. |
|[Security trimming based on Azure Active Directory identities](search-security-trimming-for-azure-search-with-aad.md)  | This article expands on the previous article, providing steps for retrieving identities from Azure Active Directory (AAD), one of the [free services](https://azure.microsoft.com/free/) in the Azure cloud platform. |

## Table: Permissioned operations

The following table summarizes the operations allowed in Azure Cognitive Search and which key unlocks access a particular operation.

| Operation | Permissions |
|-----------|-------------------------|
| Create a service | Azure subscription holder|
| Scale a service | Admin key, RBAC Owner or Contributor on the resource  |
| Delete a service | Admin key, RBAC Owner or Contributor on the resource |
| Create, modify, delete objects on the service: <br>Indexes and component parts (including analyzer definitions, scoring profiles, CORS options), indexers, data sources, synonyms, suggesters. | Admin key, RBAC Owner or Contributor on the resource  |
| Query an index | Admin or query key (RBAC not applicable) |
| Query system information, such as returning statistics, counts, and lists of objects. | Admin key, RBAC on the resource (Owner, Contributor, Reader) |
| Manage admin keys | Admin key, RBAC Owner or Contributor on the resource. |
| Manage query keys |  Admin key, RBAC Owner or Contributor on the resource.  |

## Physical security

Microsoft data centers provide industry-leading physical security and are compliant with an extensive portfolio of standards and regulations. To learn more, go to the [Global data centers](https://www.microsoft.com/cloud-platform/global-datacenters) page or watch a short video on data center security.

> [!VIDEO https://www.youtube.com/embed/r1cyTL8JqRg]


## See also

+ [Get started .NET (demonstrates using an admin key to create an index)](search-create-index-dotnet.md)
+ [Get started REST (demonstrates using an admin key to create an index)](search-create-index-rest-api.md)
+ [Identity-based access control using Azure Cognitive Search filters](search-security-trimming-for-azure-search.md)
+ [Active Directory identity-based access control using Azure Cognitive Search filters](search-security-trimming-for-azure-search-with-aad.md)
+ [Filters in Azure Cognitive Search](search-filters.md)