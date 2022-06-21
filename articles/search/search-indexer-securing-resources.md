---
title: Indexer access to protected resources
titleSuffix: Azure Cognitive Search
description: Learn import concepts and requirements related to network-level security options for outbound requests made by indexers in Azure Cognitive Search.

manager: nitinme
author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/20/2022
---

# Indexer access to content protected by Azure network security features

If your Azure Cognitive Search solution runs in an Azure virtual network, this article explains the concepts behind  indexer access to content that's protected by IP firewalls or private endpoints. It describes supported scenarios and options. Because Azure Storage is used for both data access and persistent storage, this article also covers considerations that are specific to search and storage connectivity.

Looking for step-by-step instructions instead? See [How to configure firewall rules to allow indexer access](search-indexer-howto-access-ip-restricted.md) or [How to make outbound connections through a private endpoint](search-indexer-howto-access-private.md).

## Resources accessed by indexers

Azure Cognitive Search indexers can make outbound calls to various Azure resources during execution. An indexer makes outbound calls in three situations:

- Connecting to external data sources during indexing
- Connecting to external, encapsulated code through a skillset that includes custom skills
- Connecting to Azure Storage during skillset execution to cache enrichments, save debug session state, or write to a knowledge store

A list of all possible Azure resource types that an indexer might access in a typical run are listed in the table below.

| Resource | Purpose within indexer run |
| --- | --- |
| Azure Storage (blobs, ADLS Gen 2, files, tables) | Data source |
| Azure Storage (blobs, tables) | Skillsets (caching enrichments, debug sessions, knowledge store projections) |
| Azure Cosmos DB (various APIs) | Data source |
| Azure SQL Database | Data source |
| SQL Server on Azure virtual machines | Data source |
| SQL Managed Instance | Data source |
| Azure Functions | Attached to a skillset and used to host for custom web API skills |

> [!NOTE]
> An indexer also connects to Cognitive Services for built-in skills. However, that connection is made over the internal network and isn't subject to any network provisions under your control.

## Supported network protections

Your Azure resources could be protected using any number of the network isolation mechanisms offered by Azure. Depending on the resource and region, Cognitive Search indexers can make outbound connections through IP firewalls and private endpoints, subject to the limitations indicated in the following table.

| Resource | IP restriction | Private endpoint |
| --- | --- | ---- |
| Azure Storage for text-based indexing (blobs, ADLS Gen 2, files, tables) | Supported only if the storage account and search service are in different regions. | Supported |
| Azure Storage for AI enrichment (caching, debug sessions, knowledge store) | Supported only if the storage account and search service are in different regions. | Supported |
| Azure Cosmos DB - SQL API | Supported | Supported |
| Azure Cosmos DB - MongoDB API | Supported | Unsupported |
| Azure Cosmos DB - Gremlin API | Supported | Unsupported |
| Azure SQL Database | Supported | Supported |
| SQL Server on Azure virtual machines | Supported | N/A |
| SQL Managed Instance | Supported | N/A |
| Azure Functions | Supported | Supported, only for certain tiers of Azure functions |

## Access to a network-protected storage account

A search service stores indexes and synonym lists. For other features that require storage, Cognitive Search takes a dependency on Azure Storage. Enrichment caching, debug sessions, and knowledge stores fall into this category. The location of each service, and any network protections in place for storage, will determine your data access strategy.

### Same-region services

In Azure Storage, access through a firewall requires that the request originates from a different region. If Azure Storage and Azure Cognitive Search are in the same region, you can bypass the IP restrictions on the storage account by accessing data under the system identity of the search service. 

There are two options for supporting data access using the system identity:

- Configure search to run as a [trusted service](search-indexer-howto-access-trusted-service-exception.md) and use the [trusted service exception](../storage/common/storage-network-security.md#trusted-access-based-on-a-managed-identity) in Azure Storage.

- Configure a [resource instance rule](../storage/common/storage-network-security.md#grant-access-from-azure-resource-instances) in Azure Storage that admits inbound requests from an Azure resource.

The above options depend on Azure Active Directory for authentication, which means that the connection must be made with an Azure AD login. Currently, only a Cognitive Search [system-assigned managed identity](search-howto-managed-identities-data-sources.md#create-a-system-managed-identity) is supported for same-region connections through a firewall.

### Services in different regions

When search and storage are in different regions, you can use the previously mentioned options or set up IP rules that admit requests from your service. Depending on the workload, you might need to set up rules for multiple execution environments as described in the next section.

## Indexer execution environment

Azure Cognitive Search has the concept of an *indexer execution environment* that optimizes processing based on the characteristics of the job. There are two environments. For any given indexer run, Azure Cognitive Search determines the best environment in which to run the indexer. If you're using an IP firewall to control access to Azure resources, knowing about execution environments will help you set up an IP range that is inclusive of both.

For optimum processing, a search service will determine an internal execution environment to set up the operation. Depending on the number and types of tasks assigned, the indexer will run in one of two environments:

- A private execution environment that's specific to a search service. Indexers running in such environments share resources with other indexing and query workloads on the same search service. Typically, only indexers that perform text-based indexing (without skillsets) run in this environment.

- A multi-tenant environment hosting indexers that are resource intensive - such as indexers with skillsets, indexers processing large documents, indexers processing a large volume of documents, and so on. This environment is used to offload computationally intensive processing, leaving service-specific resources available for routine operations. This multi-tenant environment is managed and secured by Microsoft, at no extra cost, and isn't subject to any network provisions under your control.

The following section explains the IP configuration for admitting requests from either execution environment.

### Setting up IP ranges for both indexer execution environments

If the Azure resource that provides source data exists behind a firewall, you'll need [inbound rules that admit indexer connections](search-indexer-howto-access-ip-restricted.md) for all of the IPs from which an indexer request can originate. The IPs include the one used by the search service and the multi-tenant environment.

- To obtain the IP address of the search service (and the private execution environment), you'll use `nslookup` (or `ping`) the fully qualified domain name (FQDN) of your search service. The FQDN of a search service in the public cloud would be `<service-name>.search.windows.net`.

- To obtain the IP addresses of the multi-tenant environments within which an indexer might run, you'll use the `AzureCognitiveSearch` service tag. 

  [Azure service tags](../virtual-network/service-tags-overview.md) have a published range of IP addresses for each service. You can find these IPs using the [discovery API](../virtual-network/service-tags-overview.md#use-the-service-tag-discovery-api) or a [downloadable JSON file](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files). IP ranges are allocated by region, so check your search service region before you start.

When setting the IP rule for the multi-tenant environment, certain SQL data sources support a simple approach for IP address specification. Instead of enumerating all of the IP addresses in the rule, you can create a [Network Security Group rule](../virtual-network/network-security-groups-overview.md) that specifies the `AzureCognitiveSearch` service tag. This simple approach is supported for the following data sources:

- [SQL Server on Azure virtual machines](./search-howto-connecting-azure-sql-iaas-to-azure-search-using-indexers.md#restrict-access-to-the-azure-cognitive-search)

- [SQL Managed Instances](./search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers.md#verify-nsg-rules)

  If you're using the service tag for the multi-tenant environment IP rule, you'll still need an explicit IP rule for the search service itself.

## Choosing a data access approach

When integrating Azure Cognitive Search into a solution that runs on a virtual network, consider the following constraints:

- An indexer can't make a direct connection to a [virtual network service endpoint](../virtual-network/virtual-network-service-endpoints-overview.md). Public endpoints with credentials, private endpoints, trusted service, and IP addressing are the only supported methodologies for indexer connections.

- A search service always runs in the cloud and can't be provisioned into a specific virtual network, running natively on a virtual machine. This functionality won't be offered by Azure Cognitive Search.

In light of the above constrains, your choices for achieving search integration in a virtual network are:

- Configure an inbound firewall rule on your Azure resource that admits indexer requests for data.

- Configure an outbound connection from Cognitive Search that makes indexer connections using a [private endpoint](../private-link/private-endpoint-overview.md). The search service connection to your protected resource is through a *shared private link*. A shared private link is an [Azure Private Link](../private-link/private-link-overview.md) resource that's created, managed, and used from within Cognitive Search. If your resources are fully locked down (running on a protected virtual network, or otherwise not available over a public connection), a private endpoint is your only choice.

Configuring an IP firewall is free. A private endpoint, which is based on Azure Private Link, has a billing impact.

### Billing impact of Azure Private Link

- A shared private link requires a billable search service, where the minimum tier is either Basic for text-based indexing or Standard 2 (S2) for skills-based indexing. See [tier limits on the number of private endpoints](search-limits-quotas-capacity.md#shared-private-link-resource-limits) for details. 

- Inbound and outbound connections are subject to [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).

### Step 1: Create a private endpoint to the secure resource

In Azure Cognitive Search, you can create a shared private link using either the portal or a [management API](/rest/api/searchmanagement/2021-04-01-preview/shared-private-link-resources/create-or-update). 

Traffic that goes over this (outbound) private endpoint connection will originate only from the virtual network that's in the search service specific "private" indexer execution environment.

Azure Cognitive Search will validate that callers of this API have Azure RBAC role permissions to approve private endpoint connection requests to the secure resource. For example, if you request a private endpoint connection to a storage account with read-only permissions, this call will be rejected.

### Step 2: Approve the private endpoint connection

When the (asynchronous) operation that creates a shared private link resource completes, a private endpoint connection will be created in a "Pending" state. No traffic flows over the connection yet.

The customer is then expected to locate this request on their secure resource and "Approve" it. Typically, this can be done either via the Azure portal or via the [REST API](/rest/api/virtualnetwork/privatelinkservices/updateprivateendpointconnection).

### Step 3: Force indexers to run in the "private" environment

An approved private endpoint allows outgoing calls from the search service to a resource that has some form of network level access restrictions (for example a storage account data source that is configured to only be accessed from certain virtual networks) to succeed.

This means any indexer that is able to reach out to such a data source over the private endpoint will succeed.
If the private endpoint isn't approved, or if the indexer doesn't utilize the private endpoint connection then the indexer run will end up in `transientFailure`.

To enable indexers to access resources via private endpoint connections, it's mandatory to set the `executionEnvironment` of the indexer to `"Private"` to ensure that all indexer runs will be able to utilize the private endpoint. This is because private endpoints are provisioned within the private search service-specific environment.

```json
    {
      "name" : "myindexer",
      ... other indexer properties
      "parameters" : {
          ... other parameters
          "configuration" : {
            ... other configuration properties
            "executionEnvironment": "Private"
          }
        }
    }
```

These steps are described in greater detail in [Indexer connections through a private endpoint](search-indexer-howto-access-private.md).

Once you have an approved private endpoint to a resource, indexers that are set to be *private* attempt to obtain access via the private endpoint connection.

## Next steps

- [How to make indexer connections through IP firewalls](search-indexer-howto-access-ip-restricted.md)
- [How to make indexer connections using the trusted service exception](search-indexer-howto-access-trusted-service-exception.md)
- [How to make indexer connections to a private endpoint](search-indexer-howto-access-private.md)
