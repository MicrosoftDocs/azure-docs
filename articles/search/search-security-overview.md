---
title: Security overview
titleSuffix: Azure Cognitive Search
description: Azure Cognitive Search is compliant with SOC 2, HIPAA, and other certifications. Connection and data encryption, authentication, and identity access through user and group security identifiers in filter expressions.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/03/2020
---

# Security in Azure Cognitive Search - overview

This article describes the key security features in Azure Cognitive Search that can protect content and operations. 

+ At the storage layer, encryption-at-rest is a given at the platform level, but Cognitive Search also offers a "double encryption" option for customers who want the dual protection of both user-owned and Microsoft-managed keys.

+ Inbound security protects the search service endpoint at increasing levels of security: from API keys on the request, to inbound rules in the firewall, to private endpoints that fully shield your service from the public internet.

+ Outbound security applies to indexers that pull content from external sources. For outbound requests, set up a managed identity to make search a trusted service when accessing data from Azure Storage, Azure SQL, Cosmos DB, or other Azure data sources. A managed identity is a substitute for credentials or access keys on the connection. Outbound security is not covered in this article. For more information about this capability, see [Connect to a data source using a managed identity](search-howto-managed-identities-data-sources.md).

Watch this fast-paced video for an overview of the security architecture and each feature category.

> [!VIDEO https://channel9.msdn.com/Shows/AI-Show/Azure-Cognitive-Search-Whats-new-in-security/player]

## Encrypted transmissions and storage

Encryption is pervasive in Azure Cognitive Search, starting with connections and transmissions, extending to content stored on disk. For search services on the public internet, Azure Cognitive Search listens on HTTPS port 443. All client-to-service connections use TLS 1.2 encryption. Earlier versions (1.0 or 1.1) are not supported.

### Data encryption-at-rest

Azure Cognitive Search stores index definitions and content, data source definitions, indexer definitions, skillset definitions, and synonym maps.

Across the storage layer, data is encrypted on disk using keys managed by Microsoft. You cannot turn encryption on or off, or view encryption settings in the portal or programmatically. Encryption is fully internalized, with no measurable impact on indexing time-to-completion or index size. It occurs automatically on all indexing, including on incremental updates to an index that is not fully encrypted (created before January 2018).

Internally, encryption is based on [Azure Storage Service Encryption](../storage/common/storage-service-encryption.md), using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard).

> [!NOTE]
> Encryption at rest was announced in January 24, 2018 and applies to all service tiers, including the free tier, in all regions. For full encryption, indexes created prior to that date must be dropped and rebuilt in order for encryption to occur. Otherwise, only new data added after January 24 is encrypted.

### Customer-managed key (CMK) encryption

Customers who want additional storage protection can encrypt data and objects before they are stored and encrypted on disk. This approach is based on a user-owned key, managed and stored through Azure Key Vault, independently of Microsoft. Encrypting content before it is encrypted on disk is referred to as "double encryption". Currently, you can selectively double encrypt indexes and synonym maps. For more information, see [Customer-managed encryption keys in Azure Cognitive Search](search-security-manage-encryption-keys.md).

> [!NOTE]
> CMK encryption is generally available for search services created after January 2019. It is not supported on Free (shared) services. 
>
>Enabling this feature will increase index size and degrade query performance. Based on observations to date, you can expect to see an increase of 30%-60% in query times, although actual performance will vary depending on the index definition and types of queries. Because of this performance impact, we recommend that you only enable this feature on indexes that really require it.

<a name="service-access-and-authentication"></a>

## Inbound security and endpoint protection

Inbound security features protect the search service endpoint through increasing levels of security and complexity. First, all requests require an API key for authenticated access. Second, you can optionally set firewall rules that limit access to specific IP addresses. For advanced protection, a third option is to enable Azure Private Link to shield your service endpoint from all internet traffic.

### Public access using API keys

By default, a search service is accessed through the public cloud, using key-based authentication for admin or query access to the search service endpoint. An api-key is a string composed of randomly generated numbers and letters. The type of key (admin or query) determines the level of access. Submission of a valid key is considered proof the request originates from a trusted entity. 

There are two levels of access to your search service, enabled by the following API keys:

+ Admin key (allows read-write access for [create-read-update-delete](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations on the search service)

+ Query key (allows read-only access to the documents collection of an index)

*Admin keys* are created when the service is provisioned. There are two admin keys, designated as *primary* and *secondary* to keep them straight, but in fact they are interchangeable. Each service has two admin keys so that you can roll one over without losing access to your service. You can [regenerate admin key](search-security-api-keys.md#regenerate-admin-keys) periodically per Azure security best practices, but you cannot add to the total admin key count. There are a maximum of two admin keys per search service.

*Query keys* are created as-needed and are designed for client applications that issue queries. You can create up to 50 query keys. In application code, you specify the search URL and a query api-key to allow read-only access to the documents collection of a specific index. Together, the endpoint, an api-key for read-only access, and a target index define the scope and access level of the connection from your client application.

Authentication is required on each request, where each request is composed of a mandatory key, an operation, and an object. When chained together, the two permission levels (full or read-only) plus the context (for example, a query operation on an index) are sufficient for providing full-spectrum security on service operations. For more information about keys, see [Create and manage api-keys](search-security-api-keys.md).

### IP-restricted access

To further control access to your search service, you can create inbound firewall rules that allow access to specific IP address or a range of IP addresses. All client connections must be made through an allowed IP address, or the connection is denied.

You can use the portal to [configure inbound access](service-configure-firewall.md). 

Alternatively, you can use the management REST APIs. API version 2020-03-13, with the [IpRule](https://docs.microsoft.com/rest/api/searchmanagement/2019-10-01-preview/createorupdate-service#IpRule) parameter, allows you to restrict access to your service by identifying IP addresses, individually or in a range, that you want to grant access to your search service. 

### Private endpoint (no Internet traffic)

A [Private Endpoint](../private-link/private-endpoint-overview.md) for Azure Cognitive Search allows a client on a [virtual network](../virtual-network/virtual-networks-overview.md) to securely access data in a search index over a [Private Link](../private-link/private-link-overview.md). 

The private endpoint uses an IP address from the virtual network address space for connections to your search service. Network traffic between the client and the search service traverses over the virtual network and a private link on the Microsoft backbone network, eliminating exposure from the public internet. A VNET allows for secure communication among resources, with your on-premises network as well as the Internet. 

While this solution is the most secure, using additional services is an added cost so be sure you have a clear understanding of the benefits before diving in. or more information about costs, see the [pricing page](https://azure.microsoft.com/pricing/details/private-link/). For more information about how these components work together, watch the video at the top of this article. Coverage of the private endpoint option starts at 5:48 into the video. For instructions on how to set up the endpoint, see [Create a Private Endpoint for Azure Cognitive Search](service-create-private-endpoint.md).

## Index access

In Azure Cognitive Search, an individual index is not a securable object. Instead, access to an index is determined at the service layer (read or write access to the service), along with the context of an operation.

For end-user access, you can structure query requests to connect using a query key, which makes any request read-only, and include the specific index used by your app. In a query request, there is no concept of joining indexes or accessing multiple indexes simultaneously so all requests target a single index by definition. As such, construction of the query request itself (a key plus a single target index) defines the security boundary.

Administrator and developer access to indexes is undifferentiated: both need write access to create, delete, and update objects managed by the service. Anyone with an admin key to your service can read, modify, or delete any index in the same service. For protection against accidental or malicious deletion of indexes, your in-house source control for code assets is the remedy for reversing an unwanted index deletion or modification. Azure Cognitive Search has failover within the cluster to ensure availability, but it does not store or execute your proprietary code used to create or load indexes.

For multitenancy solutions requiring security boundaries at the index level, such solutions typically include a middle tier, which customers use to handle index isolation. For more information about the multitenant use case, see [Design patterns for multitenant SaaS applications and Azure Cognitive Search](search-modeling-multitenant-saas-applications.md).

## User access

How a user accesses an index and other objects is determined by the type of API key on the request. Most developers create and assign [*query keys*](search-security-api-keys.md) for client-side search requests. A query key grants read-only access to searchable content within the index.

If you require granular, per-user control over search results, you can build security filters on your queries, returning documents associated with a given security identity. Instead of predefined roles and role assignments, identity-based access control is implemented as a *filter* that trims search results of documents and content based on identities. The following table describes two approaches for trimming search results of unauthorized content.

| Approach | Description |
|----------|-------------|
|[Security trimming based on identity filters](search-security-trimming-for-azure-search.md)  | Documents the basic workflow for implementing user identity access control. It covers adding security identifiers to an index, and then explains filtering against that field to trim results of prohibited content. |
|[Security trimming based on Azure Active Directory identities](search-security-trimming-for-azure-search-with-aad.md)  | This article expands on the previous article, providing steps for retrieving identities from Azure Active Directory (AAD), one of the [free services](https://azure.microsoft.com/free/) in the Azure cloud platform. |

## Administrative rights

[Role-based access (RBAC)](../role-based-access-control/overview.md) is an authorization system built on [Azure Resource Manager](../azure-resource-manager/management/overview.md) for provisioning of Azure resources. In Azure Cognitive Search, Resource Manager is used to create or delete the service, manage API keys, and scale the service. As such, RBAC role assignments will determine who can perform those tasks, regardless of whether they are using the [portal](search-manage.md), [PowerShell](search-manage-powershell.md), or the [Management REST APIs](https://docs.microsoft.com/rest/api/searchmanagement/search-howto-management-rest-api).

In contrast, admin rights over content hosted on the service, such as the ability to create or delete an index, is conferred through API keys as described in the [previous section](#index-access).

> [!TIP]
> Using Azure-wide mechanisms, you can lock a subscription or resource to prevent accidental or unauthorized deletion of your search service by users with admin rights. For more information, see [Lock resources to prevent unexpected deletion](../azure-resource-manager/management/lock-resources.md).

## Certifications and compliance

Azure Cognitive Search has been certified compliant for multiple global, regional, and industry-specific standards for both the public cloud and Azure Government. For the complete list, download the [**Microsoft Azure Compliance Offerings** whitepaper](https://aka.ms/azurecompliance) from the official Audit reports page.

## See also

+ [Azure security fundamentals](../security/fundamentals/index.yml)
+ [Azure Security](https://azure.microsoft.com/overview/security)
+ [Azure Security Center](../security-center/index.yml)