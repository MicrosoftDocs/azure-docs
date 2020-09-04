---
title: Access Indexer resources securely
titleSuffix: Azure Cognitive Search
description: Conceptual overview of the network-level security options for Azure data access by indexers in Azure Cognitive Search.

manager: nitinme
author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 09/07/2020
---

# Indexer access to data sources using Azure network security features

Azure Cognitive Search indexers can make outbound calls to various Azure resources during execution. This article explains the concepts behind indexer access to resources when those resources are protected by IP firewalls, private endpoints, and other network-level security mechanisms. The possible resource types that an indexer might access in a typical run are listed in the table below.

| Resource | Purpose within indexer run |
| --- | --- |
| Azure Storage (blobs, tables, ADLS Gen 2) | Data source |
| Azure Storage (blobs, tables) | Skillsets (caching enriched documents, and storing knowledge store projections) |
| Azure Cosmos DB (various APIs) | Data source |
| Azure SQL Database | Data source |
| SQL server on Azure IaaS VMs | Data source |
| SQL managed instances | Data source |
| Azure Functions | Host for custom web api skills |
| Cognitive Services | Attached to skillset that will be used to bill enrichment beyond the 20 free documents limit |

> [!NOTE]
> The cognitive service resource attached to a skillset is used for billing, based on the enrichments performed and written into the search index. It is not used for accessing the Cognitive Services APIs. Access from an indexer's enrichment pipeline to Cognitive Services APIs occurs via a secure communication channel, where data is strongly encrypted in transit and is never stored at rest.

Customers can secure these resources via several network isolation mechanisms offered by Azure. With the exception of cognitive service resource, indexers have limited ability to access all other resources even if they are network isolated outlined in the table below.

| Resource | IP Restriction | Private endpoint |
| --- | --- | ---- |
| Azure storage (blobs, tables, ADLS Gen 2) | Supported only if the storage account and search service are in different regions | Supported |
| Azure Cosmos DB - SQL API | Supported | Supported |
| Azure Cosmos DB - Cassandra, Mongo, and Gremlin API | Supported | Unsupported |
| Azure SQL Database | Supported | Supported |
| SQL server on Azure IaaS VMs | Supported | N/A |
| SQL managed instances | Supported | N/A |
| Azure Functions | Supported | Supported, only for certain SKUs of Azure functions |

> [!NOTE]
> In addition to the options listed above, for network secured Azure storage accounts, customers can leverage the fact that Azure Cognitive Search is a [trusted Microsoft service](https://docs.microsoft.com/azure/storage/common/storage-network-security#trusted-microsoft-services). This means that a specific search service can bypass virtual network or IP restrictions on the storage account and can access data in the storage account, if the appropriate role based access control is enabled on the storage account. Details are available in the [how to guide](search-indexer-howto-access-trusted-service-exception.md). This option can be utilized instead of the IP restriction route, in case either the storage account or the search service cannot be moved to a different region.

When choosing which secure access mechanism that an indexer should use, consider the following constraints:

- [Service endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview) will not be supported for any Azure resource.
- A search service cannot be provisioned into a specific virtual network - this functionality will not be offered by Azure Cognitive Search.
- When indexers utilize (outbound) private endpoints to access resources, additional [private link charges](https://azure.microsoft.com/pricing/details/search/) may apply.

## Indexer execution environment

Azure Cognitive Search indexers are capable of efficiently extracting content from data sources, adding enrichments to the extracted content, optionally generating projections before writing the results to the search index. Depending on the number of responsibilities assigned to an indexer, it can run in one of two environments:

- An environment private to a specific search service. Indexers running in such environments share resources with other workloads (such as other customer initiated indexing or querying workload). Typically only indexers that do not require much resources (for example, do not use a skillset) run in this environment.
- A multi-tenant environment that hosts indexers that are resource hungry, such as ones with a skillset. Resource hungry resources run on this environment to offer optimal performance whilst ensuring that the search service resources are available for other workloads. This multi-tenant environment is managed and secured by Azure Cognitive Search, at no extra cost to the customer.

For any given indexer run, Azure Cognitive Search determines the best environment in which to run the indexer.

## Granting access to indexer IP ranges

If the resource that your indexer is trying to access is restricted to only a certain set of IP ranges, then you need to expand the set to include the possible IP ranges from which an indexer request can originate. As stated above, there are two possible environments in which indexers run and from which access requests can originate. You will need to add the IP addresses of __both__ environments for indexer access to work.

- To obtain the IP address of the search service specific private environment, `nslookup` (or `ping`) the fully qualified domain name (FQDN) of your search service. The FQDN of a search service in the public cloud, for example, would be `<service-name>.search.windows.net`. This information is available on the Azure portal.
- The IP addresses of the multi-tenant environments are available via the `AzureCognitiveSearch` service tag. [Azure service tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview) have a published range of IP addresses for each service - this is available via a [discovery API (preview)](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#use-the-service-tag-discovery-api-public-preview) or a [downloadable JSON file](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#discover-service-tags-by-using-downloadable-json-files). In either case, IP ranges are broken down by region - you can pick only the IP ranges assigned for the region in which your search service is provisioned.

For certain data sources, the service tag itself can be used directly instead of enumerating the list of IP ranges (the IP address of the search service still needs to be used explicitly). These data sources restrict access by means of setting up a [Network Security Group rule](https://docs.microsoft.com/azure/virtual-network/security-overview), which natively support adding a service tag, unlike IP rules such as the ones offered by Azure Storage, CosmosDB, Azure SQL etc., The data sources that support the ability to utilize the `AzureCognitiveSearch` service tag directly in addition to search service IP address are:

- [SQL server on IaaS VMs](https://docs.microsoft.com/azure/search/search-howto-connecting-azure-sql-iaas-to-azure-search-using-indexers#restrict-access-to-the-azure-cognitive-search)

- [SQL managed instances](https://docs.microsoft.com/azure/search/search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers#verify-nsg-rules)

Details are described in the [how to guide](search-indexer-howto-access-ip-restricted.md).

## Granting access via private endpoints

Indexers can utilize [private endpoints](https://docs.microsoft.com/azure/private-link/private-endpoint-overview) to access resources, access to which are locked down either to select virtual networks or do not have any public access enabled.
This functionality is only available for paid services, with limits on the number of private endpoints that be created. Details about the limits are documented in the [Azure Search limits page](search-limits-quotas-capacity.md).

### Step 1: Create a private endpoint to the secure resource

Customers should call the search management operation, [Create or Update *shared private link resource* API](https://docs.microsoft.com/rest/api/searchmanagement/sharedprivatelinkresources/createorupdate) in order to create a private endpoint connection to their secure resource (for example, a storage account). Traffic that goes over this (outbound) private endpoint connection will originate only from the virtual network that's in the search service specific "private" indexer execution environment.

Azure Cognitive Search will validate that callers of this API have permissions to approve private endpoint connection requests to the secure resource. For example, if you request a private endpoint connection to a storage account that you do not have access to, this call will be rejected.

### Step 2: Approve the private endpoint connection

When the (asynchronous) operation that creates a shared private link resource completes, a private endpoint connection will be created in a "Pending" state. No traffic flows over the connection yet.
The customer is then expected to locate this request on their secure resource and "Approve" it. Typically, this can be done either via the Portal or via the [REST API](https://docs.microsoft.com/rest/api/virtualnetwork/privatelinkservices/updateprivateendpointconnection).

### Step 3: Force indexers to run in the "private" environment

An approved private endpoint allows outgoing calls from the search service to a resource that has some form of network level access restrictions (for example a storage account data source that is configured to only be accessed from certain virtual networks) to succeed.
This means any indexer that is able to reach out to such a data source over the private endpoint will succeed.
If the private endpoint is not approved, or if the indexer does not utilize the private endpoint connection then the indexer run will end up in `transientFailure`.

To enable indexers to access resources via private endpoint connections, it is mandatory to set the `executionEnvironment` of the indexer to `"Private"` to ensure that all indexer runs will be able to utilize the private endpoint. This is because private endpoints are provisioned within the private search service-specific environment.

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

These steps are described in greater detail in the [how to guide](search-indexer-howto-access-private.md).
Once you have an approved private endpoint to a resource, indexers that are set to be *private* attempt to obtain access via the private endpoint connection.

### Limits

To ensure optimal performance and stability of the search service, restrictions are imposed (by search service SKU) on the following dimensions:

- The kinds of indexers that can be set to be *private*.
- The number of shared private link resources that can be created.
- The number of distinct resource types for which shared private link resources can be created.

These limits are documented in [service limits](search-limits-quotas-capacity.md).
