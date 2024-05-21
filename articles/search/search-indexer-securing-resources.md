---
title: Indexer access to protected resources
titleSuffix: Azure AI Search
description: Learn import concepts and requirements related to network-level security options for outbound requests made by indexers in Azure AI Search.

manager: nitinme
author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 05/01/2024
---

# Indexer access to content protected by Azure network security

If your Azure resources are deployed in an Azure virtual network, this concept article explains how a search indexer can access content that's protected by network security. It describes the outbound traffic patterns and indexer execution environments. It also covers the network protections supported by Azure AI Search and factors that might influence your security strategy. Finally, because Azure Storage is used for both data access and persistent storage, this article also covers network considerations that are specific to [search and storage connectivity](#access-to-a-network-protected-storage-account).

Looking for step-by-step instructions instead? See [How to configure firewall rules to allow indexer access](search-indexer-howto-access-ip-restricted.md) or [How to make outbound connections through a private endpoint](search-indexer-howto-access-private.md).

## Resources accessed by indexers

Azure AI Search indexers can make outbound calls to various Azure resources in three situations:

- Connections to external data sources during indexing
- Connections to external, encapsulated code through a skillset that includes custom skills
- Connections to Azure Storage during skillset execution to cache enrichments, save debug session state, or write to a knowledge store

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

Indexers connect to resources using the following approaches:

- A public endpoint with credentials
- A private endpoint, using Azure Private Link
- Connect as a trusted service
- Connect through IP addressing

If your Azure resource is on a virtual network, you should use either a private endpoint or IP addressing to admit indexer connections to the data.

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

Azure AI Search has the concept of an *indexer execution environment* that optimizes processing based on the characteristics of the job. There are two environments. If you're using an IP firewall to control access to Azure resources, knowing about execution environments will help you set up an IP range that is inclusive of both environments.

For any given indexer run, Azure AI Search determines the best environment in which to run the indexer. Depending on the number and types of tasks assigned, the indexer will run in one of two environments.

| Execution environment | Description |
|-----------------------|-------------|
| Private | Internal to a search service. Indexers running in the private environment share computing resources with other indexing and query workloads on the same search service. Typically, only indexers that perform text-based indexing (without skillsets) run in this environment. If you set up a private connection between an indexer and your data, this is the only execution enriovnment you can use. |
|  multitenant | Managed and secured by Microsoft at no extra cost. It isn't subject to any network provisions under your control. This environment is used to offload computationally intensive processing, leaving service-specific resources available for routine operations. Examples of resource-intensive indexer jobs include attaching skillsets, processing large documents, or processing a high volume of documents. |

### Setting up IP ranges for indexer execution

This section explains IP firewall configuration for admitting requests from either execution environment.

If your Azure resource is behind a firewall, set up [inbound rules that admit indexer connections](search-indexer-howto-access-ip-restricted.md) for all of the IPs from which an indexer request can originate. This includes the IP address used by the search service, and the IP addresses used by the multitenant environment.

- To obtain the IP address of the search service (and the private execution environment), use `nslookup` (or `ping`) to find the fully qualified domain name (FQDN) of your search service. The FQDN of a search service in the public cloud would be `<service-name>.search.windows.net`.

- To obtain the IP addresses of the multitenant environments within which an indexer might run, use the `AzureCognitiveSearch` service tag. 

  [Azure service tags](../virtual-network/service-tags-overview.md) have a published range of IP addresses of the multitenant environments for each region. You can find these IPs using the [discovery API](../virtual-network/service-tags-overview.md#use-the-service-tag-discovery-api) or a [downloadable JSON file](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files). IP ranges are allocated by region, so check your search service region before you start.

#### Setting up IP rules for Azure SQL

When setting the IP rule for the multitenant environment, certain SQL data sources support a simple approach for IP address specification. Instead of enumerating all of the IP addresses in the rule, you can create a [Network Security Group rule](../virtual-network/network-security-groups-overview.md) that specifies the `AzureCognitiveSearch` service tag. 

You can specify the service tag if your data source is either:

- [SQL Server on Azure virtual machines](./search-howto-connecting-azure-sql-iaas-to-azure-search-using-indexers.md#restrict-network-access-to-azure-ai-search)

- [SQL Managed Instances](./search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers.md#verify-nsg-rules)

Notice that if you specified the service tag for the multitenant environment IP rule, you'll still need an explicit inbound rule for the private execution environment (meaning the search service itself), as obtained through `nslookup`.

## Choose a connectivity approach

A search service can't be provisioned into a specific virtual network, running natively on a virtual machine. Although some Azure resources offer [virtual network service endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview), this functionality won't be offered by Azure AI Search. You should plan on implementing one of the following approaches.

| Approach | Details |
|----------|---------|
| Secure the inbound connection to your Azure resource | Configure an inbound firewall rule on your Azure resource that admits indexer requests for your data. Your firewall configuration should include the service tag for multitenant execution and the IP address of your search service. See [Configure firewall rules to allow indexer access](search-indexer-howto-access-ip-restricted.md). |
| Private connection between Azure AI Search and your Azure resource | Configure a shared private link used exclusively by your search service for connections to your resource. Connections travel over the internal network and bypass the public internet. If your resources are fully locked down (running on a protected virtual network, or otherwise not available over a public connection), a private endpoint is your only choice. See [Make outbound connections through a private endpoint](search-indexer-howto-access-private.md).|

Connections through a private endpoint must originate from the search service's private execution environment. 

Configuring an IP firewall is free. A private endpoint, which is based on Azure Private Link, has a billing impact. See [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/) for details.

After you configure network security, follow up with role assignments that specify which users and groups have read and write access to your data and operations. 

### Considerations for using a private endpoint

This section narrows in on the private connection option.

+ A shared private link requires a billable search service, where the minimum tier is either Basic for text-based indexing or Standard 2 (S2) for skills-based indexing. See [tier limits on the number of private endpoints](search-limits-quotas-capacity.md#shared-private-link-resource-limits) for details.

- Once a shared private link is created, the search service always uses it for every indexer connection to that specific Azure resource. The private connection is locked and enforced internally. You can't bypass the private connection for a public connection.

- Requires a billable Azure Private Link resource.

- Requires that a subscription owner approve the private endpoint connection.

- Requires that you turn off the multitenant execution environment for the indexer.

  You do this by setting the `executionEnvironment` of the indexer to `"Private"`. This step ensures that all indexer execution is confined to the private environment provisioned within the search service. This setting is scoped to an indexer and not the search service. If you want all indexers to connect over private endpoints, each one must have the following configuration:
  
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

Azure AI Search will validate that callers of the private endpoint have appropriate role assignments. For example, if you request a private endpoint connection to a storage account with read-only permissions, this call will be rejected.

If the private endpoint isn't approved, or if the indexer didn't use the private endpoint connection, you'll find a `transientFailure` error message in indexer execution history.

## Supplement network security with token authentication

Firewalls and network security are a first step in preventing unauthorized access to data and operations. Authorization should be your next step. 

We recommend role-based access, where Microsoft Entra ID users and groups are assigned to roles that determine read and write access to your service. See [Connect to Azure AI Search using role-based access controls](search-security-rbac.md) for a description of built-in roles and instructions for creating custom roles.

If you don't need key-based authentication, we recommend that you disable API keys and use role assignments exclusively.

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
