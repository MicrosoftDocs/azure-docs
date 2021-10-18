---
title: Security overview
titleSuffix: Azure Cognitive Search
description: Learn about the security features in Azure Cognitive Search to protect endpoints, content, and operations.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/15/2021
ms.custom: references_regions
---

# Security overview for Azure Cognitive Search

This article describes the security features in Azure Cognitive Search that protect data and operations.

## Network traffic patterns

A search service is hosted on Azure and typically accessed over public network connections. Understanding the service's access patterns can help you design a security strategy that effectively deters unauthorized access to searchable content.

Cognitive Search has three basic network traffic patterns:

+ Inbound requests made by a client to the search service (the predominant pattern)
+ Outbound requests issued by the search service to other services on Azure and elsewhere
+ Internal service-to-service requests over the secure Microsoft backbone network

Inbound requests range from creating objects, loading data, and querying. For inbound access to data and operations, you can implement a progression of security measures, starting with API keys on the request. You can then supplement with either inbound rules in an IP firewall, or create private endpoints that fully shield your service from the public internet.

Outbound requests can include both read and write operations. The primary agent of an outbound call is an indexer and constituent skillsets. For indexers, read operations include [document cracking](search-indexer-overview.md#document-cracking) and data ingestion. An indexer can also write to Azure Storage when creating knowledge stores, persisting cached enrichments, and persisting debug sessions. Finally, a skillset can also include custom skills that run external code, for example in Azure Functions or in a web app.

Internal requests include service-to-service calls for tasks like diagnostic logging, encryption, authentication and authorization through Azure Active Directory, private endpoint connections, and requests made to Cognitive Services for built-in skills.

## Network security

<a name="service-access-and-authentication"></a>

Inbound security features protect the search service endpoint through increasing levels of security and complexity. Cognitive Search uses [key-based authentication](search-security-api-keys.md), where all requests require an API key for authenticated access.

Optionally, you can implement additional layers of control by setting firewall rules that limit access to specific IP addresses. For advanced protection, you can enable Azure Private Link to shield your service endpoint from all internet traffic.

### Connect over the public internet

By default, a search service endpoint is accessed through the public cloud, using key-based authentication for admin or query access to the search service endpoint. Keys are required. Submission of a valid key is considered proof the request originates from a trusted entity. Key-based authentication is covered in the next section. Without API keys, you'll get 401 and 404 responses on the request.

### Connect through IP firewalls

To further control access to your search service, you can create inbound firewall rules that allow access to specific IP address or a range of IP addresses. All client connections must be made through an allowed IP address, or the connection is denied.

:::image type="content" source="media/search-security-overview/inbound-firewall-ip-restrictions.png" alt-text="sample architecture diagram for ip restricted access":::

You can use the portal to [configure inbound access](service-configure-firewall.md).

Alternatively, you can use the management REST APIs. Starting with API version 2020-03-13, with the [IpRule](/rest/api/searchmanagement/2020-08-01/services/create-or-update#iprule) parameter, you can restrict access to your service by identifying IP addresses, individually or in a range, that you want to grant access to your search service.

### Connect to a private endpoint (network isolation, no Internet traffic)

You can establish a [private endpoint](../private-link/private-endpoint-overview.md) for Azure Cognitive Search allows a client on a [virtual network](../virtual-network/virtual-networks-overview.md) to securely access data in a search index over a [Private Link](../private-link/private-link-overview.md).

The private endpoint uses an IP address from the virtual network address space for connections to your search service. Network traffic between the client and the search service traverses over the virtual network and a private link on the Microsoft backbone network, eliminating exposure from the public internet. A VNET allows for secure communication among resources, with your on-premises network as well as the Internet.

:::image type="content" source="media/search-security-overview/inbound-private-link-azure-cog-search.png" alt-text="sample architecture diagram for private endpoint access":::

While this solution is the most secure, using additional services is an added cost so be sure you have a clear understanding of the benefits before diving in. or more information about costs, see the [pricing page](https://azure.microsoft.com/pricing/details/private-link/). For more information about how these components work together, watch the video at the top of this article. Coverage of the private endpoint option starts at 5:48 into the video. For instructions on how to set up the endpoint, see [Create a Private Endpoint for Azure Cognitive Search](service-create-private-endpoint.md).

### Outbound connections to external services

Indexers and skillsets are both objects that can make external connections. You'll provide connection information as part of the object definition, using one of these mechanisms.

+ Credentials in the connection string

+ Managed identity in the connection string

  You can set up a managed identity to make search a trusted service when accessing data from Azure Storage, Azure SQL, Cosmos DB, or other Azure data sources. A managed identity is a substitute for credentials or access keys on the connection. For more information about this capability, see [Connect to a data source using a managed identity](search-howto-managed-identities-data-sources.md).

## Authentication

For inbound requests to the search service, authentication is through an [API key](search-security-api-keys.md) (a string composed of randomly generated numbers and letters) that proves the request is from a trustworthy source. Alternatively, there is new support for Azure Active Directory authentication and role-based authorization, [currently in preview](search-security-rbac.md).

Outbound requests made by an indexer are subject to authentication by the external service. The indexer subservice in Cognitive Search can be made a trusted service on Azure, connecting to other services using a managed identity. For more information, see [Set up an indexer connection to a data source using a managed identity](search-howto-managed-identities-data-sources.md).

## Authorization

Cognitive Search provides different authorization models for content management and service management. 

### Authorization for content management

Authorization to content, and operations related to content, is either write access, as conferred through the [API key](search-security-api-keys.md) provided on the request. The API key is an authentication mechanism, but also authorizes access depending on the type of API key.

+ Admin key (allows read-write access for create-read-update-delete operations on the search service), created when the service is provisioned

+ Query key (allows read-only access to the documents collection of an index), created as-needed and are designed for client applications that issue queries

In application code, you specify the endpoint and an API key to allow access to content and options. An endpoint might be the service itself, the indexes collection, a specific index, a documents collection, or a specific document. When chained together, the endpoint, the operation (for example, a create or update request) and the permission level (full or read-only rights based on the key) constitute the security formula that protects content and operations.

> [!NOTE]
> Authorization for data plane operations using Azure role-based access control (RBAC) is now in preview. You can use this preview capability if you want to [use role assignments instead of API keys](search-security-rbac.md).

### Controlling access to indexes

In Azure Cognitive Search, an individual index is not a securable object. Instead, access to an index is determined at the service layer (read or write access based on which API key you provide), along with the context of an operation.

For read-only access, you can structure query requests to connect using a [query key](search-security-api-keys.md), and include the specific index used by your app. In a query request, there is no concept of joining indexes or accessing multiple indexes simultaneously so all requests target a single index by definition. As such, construction of the query request itself (a key plus a single target index) defines the security boundary.

Administrator and developer access to indexes is undifferentiated: both need write access to create, delete, and update objects managed by the service. Anyone with an [admin key](search-security-api-keys.md) to your service can read, modify, or delete any index in the same service. For protection against accidental or malicious deletion of indexes, your in-house source control for code assets is the remedy for reversing an unwanted index deletion or modification. Azure Cognitive Search has failover within the cluster to ensure availability, but it does not store or execute your proprietary code used to create or load indexes.

For multitenancy solutions requiring security boundaries at the index level, such solutions typically include a middle tier, which customers use to handle index isolation. For more information about the multitenant use case, see [Design patterns for multitenant SaaS applications and Azure Cognitive Search](search-modeling-multitenant-saas-applications.md).

### Controlling access to documents

If you require granular, per-user control over search results, you can build security filters on your queries, returning documents associated with a given security identity. 

Conceptually equivalent to "row-level security", authorization to content within the index is not natively supported using  predefined roles or role assignments that map to entities in Azure Active Directory. Any user permissions on data in external systems, such as Cosmos DB, do not transfer with that data as its being indexed by Cognitive Search.

Workarounds for solutions that require "row-level security" include creating a field in the data source that represents a security group or user identity, and then using filters in Cognitive Search to selectively trims search results of documents and content based on identities. The following table describes two approaches for trimming search results of unauthorized content.

| Approach | Description |
|----------|-------------|
|[Security trimming based on identity filters](search-security-trimming-for-azure-search.md)  | Documents the basic workflow for implementing user identity access control. It covers adding security identifiers to an index, and then explains filtering against that field to trim results of prohibited content. |
|[Security trimming based on Azure Active Directory identities](search-security-trimming-for-azure-search-with-aad.md)  | This article expands on the previous article, providing steps for retrieving identities from Azure Active Directory (Azure AD), one of the [free services](https://azure.microsoft.com/free/) in the Azure cloud platform. |

### Authorization for Service Management

Service Management operations are authorized through [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md). Azure RBAC is an authorization system built on [Azure Resource Manager](../azure-resource-manager/management/overview.md) for provisioning of Azure resources. 

In Azure Cognitive Search, Resource Manager is used to create or delete the service, manage API keys, and scale the service. As such, Azure role assignments will determine who can perform those tasks, regardless of whether they are using the [portal](search-manage.md), [PowerShell](search-manage-powershell.md), or the [Management REST APIs](/rest/api/searchmanagement).

[Three basic roles](search-security-rbac.md) are defined for search service administration. The role assignments can be made using any supported methodology (portal, PowerShell, and so forth) and are honored service-wide. The Owner and Contributor roles can perform a variety of administration functions. You can assign the Reader role to users who only view essential information.

> [!Note]
> Using Azure-wide mechanisms, you can lock a subscription or resource to prevent accidental or unauthorized deletion of your search service by users with admin rights. For more information, see [Lock resources to prevent unexpected deletion](../azure-resource-manager/management/lock-resources.md).

<a name="encryption"></a>

## Data protection

At the storage layer, data encryption is built in for all service-managed content saved to disk, including indexes, synonym maps, and the definitions of indexers, data sources, and skillsets. Optionally, you can add customer-managed keys (CMK) for supplemental encryption of indexed content. For services created after August 1 2020, CMK encryption extends to data on temporary disks, for full "double encryption" of indexed content.

### Data in transit

In Azure Cognitive Search, encryption starts with connections and transmissions, and extends to content stored on disk. For search services on the public internet, Azure Cognitive Search listens on HTTPS port 443. All client-to-service connections use TLS 1.2 encryption. Earlier versions (1.0 or 1.1) are not supported.

### Encrypted data at rest

For data handled internally by the search service, the following table describes the [data encryption models](../security/fundamentals/encryption-models.md). Some features, such as knowledge store, incremental enrichment, and indexer-based indexing, read from or write to data structures in other Azure Services. Those services have their own levels of encryption support separate from Azure Cognitive Search.

| Model | Keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Requirements&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Restrictions | Applies to |
|------------------|-------|-------------|--------------|------------|
| server-side encryption | Microsoft-managed keys | None (built-in) | None, available on all tiers, in all regions, for content created after January 24 2018. | Content (indexes and synonym maps) and definitions (indexers, data sources, skillsets) |
| server-side encryption | customer-managed keys | Azure Key Vault | Available on billable tiers, in all regions, for content created after January 2019. | Content (indexes and synonym maps) on data disks |
| server-side double encryption | customer-managed keys | Azure Key Vault | Available on billable tiers, in selected regions, on search services after August 1 2020. | Content (indexes and synonym maps) on data disks and temporary disks |

### Service-managed keys

Service-managed encryption is a Microsoft-internal operation, based on [Azure Storage Service Encryption](../storage/common/storage-service-encryption.md), using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard). It occurs automatically on all indexing, including on incremental updates to indexes that are not fully encrypted (created before January 2018).

### Customer-managed keys (CMK)

Customer-managed keys require an additional billable service, Azure Key Vault, which can be in a different region, but under the same subscription, as Azure Cognitive Search. Enabling CMK encryption will increase index size and degrade query performance. Based on observations to date, you can expect to see an increase of 30%-60% in query times, although actual performance will vary depending on the index definition and types of queries. Because of this performance impact, we recommend that you only enable this feature on indexes that really require it. For more information, see [Configure customer-managed encryption keys in Azure Cognitive Search](search-security-manage-encryption-keys.md).

<a name="double-encryption"></a>

### Double encryption

In Azure Cognitive Search, double encryption is an extension of CMK. It is understood to be two-fold encryption (once by CMK, and again by service-managed keys), and comprehensive in scope, encompassing long-term storage that is written to a data disk, and short-term  storage written to temporary disks. Double encryption is implemented in services created after specific dates. For more information, see [Double encryption](search-security-manage-encryption-keys.md#double-encryption).

## Security management

### API keys

Reliance on API key-based authentication means that you should have a plan for regenerating the admin key at regular intervals, per Azure security best practices. There are a maximum of two admin keys per search service. For more information about securing and managing API keys, see [Create and manage api-keys](search-security-api-keys.md).

#### Activity and diagnostic logs

Cognitive Search does not log user identities so you cannot refer to logs for information about a specific user. However, the service does log create-read-update-delete operations, which you might be able to correlate with other logs to understand the agency of specific actions.

Using alerts and the logging infrastructure in Azure, you can pick up on query volume spikes or other actions that deviate from expected workloads. For more information about setting up logs, see [Collect and analyze log data](search-monitor-logs.md) and [Monitor query requests](search-monitor-queries.md).

### Certifications and compliance

Azure Cognitive Search participates in regular audits, and has been certified against a number of global, regional, and industry-specific standards for both the public cloud and Azure Government. For the complete list, download the [**Microsoft Azure Compliance Offerings** whitepaper](https://azure.microsoft.com/resources/microsoft-azure-compliance-offerings/) from the official Audit reports page.

For compliance, you can use [Azure Policy](../governance/policy/overview.md) to implement the high-security best practices of [Azure Security Benchmark](../security/benchmarks/introduction.md). Azure Security Benchmark is a collection of security recommendations, codified into security controls that map to key actions you should take to mitigate threats to services and data. There are currently 11 security controls, including [Network Security](../security/benchmarks/security-control-network-security.md), [Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md), and [Data Protection](../security/benchmarks/security-control-data-protection.md) to name a few.

Azure Policy is a capability built into Azure that helps you manage compliance for multiple standards, including those of Azure Security Benchmark. For well-known benchmarks, Azure Policy provides built-in definitions that provide both criteria as well as an actionable response that addresses non-compliance.

For Azure Cognitive Search, there is currently one built-in definition. It is for diagnostic logging. With this built-in, you can assign a policy that identifies any search service that is missing diagnostic logging, and then turns it on. For more information, see [Azure Policy Regulatory Compliance controls for Azure Cognitive Search](security-controls-policy.md).

## Watch this video

Watch this fast-paced video for an overview of the security architecture and each feature category.

> [!VIDEO https://channel9.msdn.com/Shows/AI-Show/Azure-Cognitive-Search-Whats-new-in-security/player]

## See also

+ [Azure security fundamentals](../security/fundamentals/index.yml)
+ [Azure Security](https://azure.microsoft.com/overview/security)
+ [Azure Security Center](../security-center/index.yml)
