---
title: Indexer access to protected resources
titleSuffix: Azure AI Search
description: Learn import concepts and requirements related to network-level security options for outbound requests made by indexers in Azure AI Search.

manager: nitinme
author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/19/2023
---

# Indexer access to content protected by Azure network security

If your search solution requirements include an Azure virtual network, this concept article explains how a search indexer can access content that's protected by network security. It describes the outbound traffic patterns and indexer execution environments. It also covers the network protections supported by Azure AI Search and factors that might influence your security strategy. Finally, because Azure Storage is used for both data access and persistent storage, this article also covers network considerations that are specific to search and storage connectivity.

Looking for step-by-step instructions instead? See [How to configure firewall rules to allow indexer access](search-indexer-howto-access-ip-restricted.md) or [How to make outbound connections through a private endpoint](search-indexer-howto-access-private.md).

## Resources accessed by indexers

Azure AI Search indexers can make outbound calls to various Azure resources during execution. An indexer makes outbound calls in three situations:

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
> An indexer also connects to Azure AI services for built-in skills. However, that connection is made over the internal network and isn't subject to any network provisions under your control.

## Supported network protections

Your Azure resources could be protected using any number of the network isolation mechanisms offered by Azure. Depending on the resource and region, Azure AI Search indexers can make outbound connections through IP firewalls and private endpoints, subject to the limitations indicated in the following table.

| Resource | IP restriction | Private endpoint |
| --- | --- | ---- |
| Azure Storage for text-based indexing (blobs, ADLS Gen 2, files, tables) | Supported only if the storage account and search service are in different regions. | Supported |
| Azure Storage for AI enrichment (caching, debug sessions, knowledge store) | Supported only if the storage account and search service are in different regions. | Supported |
| Azure Cosmos DB for NoSQL | Supported | Supported |
| Azure Cosmos DB for MongoDB | Supported | Unsupported |
| Azure Cosmos DB for Apache Gremlin | Supported | Unsupported |
| Azure SQL Database | Supported | Supported |
| SQL Server on Azure virtual machines | Supported | N/A |
| SQL Managed Instance | Supported | N/A |
| Azure Functions | Supported | Supported, only for certain tiers of Azure functions |

## Indexer execution environment

Azure AI Search has the concept of an *indexer execution environment* that optimizes processing based on the characteristics of the job. There are two environments. If you're using an IP firewall to control access to Azure resources, knowing about execution environments will help you set up an IP range that is inclusive of both.

For any given indexer run, Azure AI Search determines the best environment in which to run the indexer. Depending on the number and types of tasks assigned, the indexer will run in one of two environments:

- A *private execution environment* that's internal to a search service. 

  Indexers running in the private environment share computing resources with other indexing and query workloads on the same search service. Typically, only indexers that perform text-based indexing (without skillsets) run in this environment.

- A *multi-tenant environment* that's managed and secured by Microsoft at no extra cost. It isn't subject to any network provisions under your control. 

  This environment is used to offload computationally intensive processing, leaving service-specific resources available for routine operations. Examples of resource-intensive indexer jobs include attaching skillsets, processing large documents, or processing a high volume of documents.

The following section explains the IP configuration for admitting requests from either execution environment.

### Setting up IP ranges for indexer execution

If the Azure resource that provides source data exists behind a firewall, you need [inbound rules that admit indexer connections](search-indexer-howto-access-ip-restricted.md) for all of the IPs from which an indexer request can originate. The IPs include the one used by the search service and the multi-tenant environment.

- To obtain the IP address of the search service (and the private execution environment), use `nslookup` (or `ping`) to find the fully qualified domain name (FQDN) of your search service. The FQDN of a search service in the public cloud would be `<service-name>.search.windows.net`.

- To obtain the IP addresses of the multi-tenant environments within which an indexer might run, use the `AzureCognitiveSearch` service tag. 

  [Azure service tags](../virtual-network/service-tags-overview.md) have a published range of IP addresses for each service. You can find these IPs using the [discovery API](../virtual-network/service-tags-overview.md#use-the-service-tag-discovery-api) or a [downloadable JSON file](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files). IP ranges are allocated by region, so check your search service region before you start.

When setting the IP rule for the multi-tenant environment, certain SQL data sources support a simple approach for IP address specification. Instead of enumerating all of the IP addresses in the rule, you can create a [Network Security Group rule](../virtual-network/network-security-groups-overview.md) that specifies the `AzureCognitiveSearch` service tag. 

You can specify the service tag if your data source is either:

- [SQL Server on Azure virtual machines](./search-howto-connecting-azure-sql-iaas-to-azure-search-using-indexers.md#restrict-access-to-the-azure-ai-search)

- [SQL Managed Instances](./search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers.md#verify-nsg-rules)

Notice that if you specified the service tag for the multi-tenant environment IP rule, you'll still need an explicit inbound rule for the private execution environment (meaning the search service itself), as obtained through `nslookup`.

## Choosing a connectivity approach

When integrating Azure AI Search into a solution that runs on a virtual network, consider the following constraints:

- An indexer can't make a direct connection to a [virtual network service endpoint](../virtual-network/virtual-network-service-endpoints-overview.md). Public endpoints with credentials, private endpoints, trusted service, and IP addressing are the only supported methodologies for indexer connections.

- A search service always runs in the cloud and can't be provisioned into a specific virtual network, running natively on a virtual machine. This functionality won't be offered by Azure AI Search.

Given the above constrains, your choices for achieving search integration in a virtual network are:

- Configure an inbound firewall rule on your Azure PaaS resource that admits indexer requests for data.

- Configure an outbound connection from Search that makes indexer connections using a [private endpoint](../private-link/private-endpoint-overview.md). 

  For a private endpoint, the search service connection to your protected resource is through a *shared private link*. A shared private link is an [Azure Private Link](../private-link/private-link-overview.md) resource that's created, managed, and used from within Azure AI Search. If your resources are fully locked down (running on a protected virtual network, or otherwise not available over a public connection), a private endpoint is your only choice.

  Connections through a private endpoint must originate from the search service's private execution environment. To meet this requirement, you'll have to disable multi-tenant execution. This step is described in [Make outbound connections through a private endpoint](search-indexer-howto-access-private.md).

Configuring an IP firewall is free. A private endpoint, which is based on Azure Private Link, has a billing impact.

### Working with a private endpoint

This section summarizes the main steps for setting up a private endpoint for outbound indexer connections. This summary might help you decide whether a private endpoint is the best choice for your scenario. Detailed steps are covered in [How to make outbound connections through a private endpoint](search-indexer-howto-access-private.md).

#### Billing impact of Azure Private Link

- A shared private link requires a billable search service, where the minimum tier is either Basic for text-based indexing or Standard 2 (S2) for skills-based indexing. See [tier limits on the number of private endpoints](search-limits-quotas-capacity.md#shared-private-link-resource-limits) for details. 

- Inbound and outbound connections are subject to [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).

#### Step 1: Create a private endpoint to the secure resource

You'll create a shared private link using either the portal pages of your search service or through the [Management API](/rest/api/searchmanagement/shared-private-link-resources/create-or-update).

In Azure AI Search, your search service must be at least the Basic tier for text-based indexers, and S2 for indexers with skillsets.

A private endpoint connection will accept requests from the private indexer execution environment, but not the multi-tenant environment. You'll need to disable multi-tenant execution as described in step 3 to meet this requirement.

#### Step 2: Approve the private endpoint connection

When the (asynchronous) operation that creates a shared private link resource completes, a private endpoint connection will be created in a "Pending" state. No traffic flows over the connection yet.

You'll need to locate and approve this request on your secure resource. Depending on the resource, you can complete this task using Azure portal. Otherwise, use the [Private Link Service REST API](/rest/api/virtualnetwork/privatelinkservices/updateprivateendpointconnection).

#### Step 3: Force indexers to run in the "private" environment

For private endpoint connections, it's mandatory to set the `executionEnvironment` of the indexer to `"Private"`. This step ensures that all indexer execution is confined to the private environment provisioned within the search service.

This setting is scoped to an indexer and not the search service. If you want all indexers to connect over private endpoints, each one must have the following configuration:

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

Once you have an approved private endpoint to a resource, indexers that are set to be *private* attempt to obtain access via the private link that was created and approved for the Azure resource. 

Azure AI Search will validate that callers of the private endpoint have appropriate Azure RBAC role permissions. For example, if you request a private endpoint connection to a storage account with read-only permissions, this call will be rejected.

If the private endpoint isn't approved, or if the indexer didn't use the private endpoint connection, you'll find a `transientFailure` error message in indexer execution history.

## Access to a network-protected storage account

A search service stores indexes and synonym lists. For other features that require storage, Azure AI Search takes a dependency on Azure Storage. Enrichment caching, debug sessions, and knowledge stores fall into this category. The location of each service, and any network protections in place for storage, will determine your data access strategy.

### Same-region services

In Azure Storage, access through a firewall requires that the request originates from a different region. If Azure Storage and Azure AI Search are in the same region, you can bypass the IP restrictions on the storage account by accessing data under the system identity of the search service. 

There are two options for supporting data access using the system identity:

- Configure search to run as a [trusted service](search-indexer-howto-access-trusted-service-exception.md) and use the [trusted service exception](../storage/common/storage-network-security.md#trusted-access-based-on-a-managed-identity) in Azure Storage.

- Configure a [resource instance rule](../storage/common/storage-network-security.md#grant-access-from-azure-resource-instances) in Azure Storage that admits inbound requests from an Azure resource.

The above options depend on Microsoft Entra ID for authentication, which means that the connection must be made with a Microsoft Entra login. Currently, only an Azure AI Search [system-assigned managed identity](search-howto-managed-identities-data-sources.md#create-a-system-managed-identity) is supported for same-region connections through a firewall.

### Services in different regions

When search and storage are in different regions, you can use the previously mentioned options or set up IP rules that admit requests from your service. Depending on the workload, you might need to set up rules for multiple execution environments as described in the next section.

## Next steps

Now that you're familiar with indexer data access options for solutions deployed in an Azure virtual network, review either of the following how-to articles as your next step:

- [How to make indexer connections to a private endpoint](search-indexer-howto-access-private.md)
- [How to make indexer connections through an IP firewall](search-indexer-howto-access-ip-restricted.md)
