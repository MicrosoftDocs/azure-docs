---
title: Indexer access to protected resources
titleSuffix: Azure Cognitive Search
description: Conceptual overview of the network-level security options for Azure data access by indexers in Azure Cognitive Search.

manager: nitinme
author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/14/2020
---

# Indexer access to content protected by Azure network security features (Azure Cognitive Search)

Azure Cognitive Search indexers can make outbound calls to various Azure resources during execution. This article explains the concepts behind indexer access to content that is protected by IP firewalls, private endpoints, or other Azure network-level security mechanisms. An indexer makes outbound calls in two situations: connecting to data sources during indexing, and connecting to encapsulated code through a skillset. A list of all possible resource types that an indexer might access in a typical run are listed in the table below.

| Resource | Purpose within indexer run |
| --- | --- |
| Azure Storage (blobs, tables, ADLS Gen 2) | Data source |
| Azure Storage (blobs, tables) | Skillsets (caching enriched documents, and storing knowledge store projections) |
| Azure Cosmos DB (various APIs) | Data source |
| Azure SQL Database | Data source |
| SQL Server on Azure virtual machines | Data source |
| SQL Managed Instance | Data source |
| Azure Functions | Host for custom web api skills |
| Cognitive Services | Attached to skillset that will be used to bill enrichment beyond the 20 free documents limit |

> [!NOTE]
> The Cognitive Service resource attached to a skillset is used for billing, based on the enrichments performed and written into the search index. It is not used for accessing the Cognitive Services APIs. Access from an indexer's enrichment pipeline to Cognitive Services APIs occurs via an internal secure communication channel, where data is strongly encrypted in transit and is never stored at rest.

Customers can secure these resources via several network isolation mechanisms offered by Azure. With the exception of a Cognitive Service resource, indexers have limited ability to access all other resources even if they are network-isolated, outlined in the table below.

| Resource | IP Restriction | Private endpoint |
| --- | --- | ---- |
| Azure Storage (blobs, tables, ADLS Gen 2) | Supported only if the storage account and search service are in different regions | Supported |
| Azure Cosmos DB - SQL API | Supported | Supported |
| Azure Cosmos DB - Cassandra, Mongo, and Gremlin API | Supported | Unsupported |
| Azure SQL Database | Supported | Supported |
| SQL Server on Azure virtual machines | Supported | N/A |
| SQL Managed Instance | Supported | N/A |
| Azure Functions | Supported | Supported, only for certain tiers of Azure functions |

> [!NOTE]
> In addition to the options listed above, for network-secured Azure Storage accounts, customers can leverage the fact that Azure Cognitive Search is a [trusted Microsoft service](../storage/common/storage-network-security.md#trusted-microsoft-services). This means that a specific search service can bypass virtual network or IP restrictions on the storage account and can access data in the storage account, if the appropriate role-based access control is enabled on the storage account. For more information, see [Indexer connections using the trusted service exception](search-indexer-howto-access-trusted-service-exception.md). This option can be utilized instead of the IP restriction route, in case either the storage account or the search service cannot be moved to a different region.

When choosing which secure access mechanism that an indexer should use, consider the following constraints:

- An indexer cannot connect to a [virtual network service endpoint](../virtual-network/virtual-network-service-endpoints-overview.md). Public endpoints with credentials, private endpoints, trusted service, and IP addressing are the only supported methodologies for indexer connections.
- A search service cannot be provisioned into a specific virtual network, running natively on a virtual machine. This functionality will not be offered by Azure Cognitive Search.
- When indexers utilize (outbound) private endpoints to access resources, additional [private link charges](https://azure.microsoft.com/pricing/details/search/) may apply.

## Indexer execution environment

Azure Cognitive Search indexers are capable of efficiently extracting content from data sources, adding enrichments to the extracted content, optionally generating projections before writing the results to the search index. Depending on the number of responsibilities assigned to an indexer, it can run in one of two environments:

- An environment private to a specific search service. Indexers running in such environments share resources with other workloads (such as other customer-initiated indexing or querying workloads). Typically, only indexers that perform text-based indexing (for example, do not use a skillset) run in this environment.
- A multi-tenant environment hosting indexers that are resource intensive, such as those with skillsets. This environment is used to offload computationally intensive processing, leaving service-specific resources available for routine operations. This multi-tenant environment is managed and secured by Microsoft, at no extra cost to the customer.

For any given indexer run, Azure Cognitive Search determines the best environment in which to run the indexer. If you are using an IP firewall to control access to Azure resources, knowing about execution environments will help you set up an IP range that is inclusive of both.

## Granting access to indexer IP ranges

If the resource that your indexer is trying to access is restricted to only a certain set of IP ranges, then you need to expand the set to include the possible IP ranges from which an indexer request can originate. As stated above, there are two possible environments in which indexers run and from which access requests can originate. You will need to add the IP addresses of **both** environments for indexer access to work.

- To obtain the IP address of the search service specific private environment, `nslookup` (or `ping`) the fully qualified domain name (FQDN) of your search service. For example, the FQDN of a search service in the public cloud would be `<service-name>.search.windows.net`. This information is available on the Azure portal.
- The IP addresses of the multi-tenant environments are available via the `AzureCognitiveSearch` service tag. [Azure service tags](../virtual-network/service-tags-overview.md) have a published range of IP addresses for each service - this is available via a [discovery API (preview)](../virtual-network/service-tags-overview.md#use-the-service-tag-discovery-api-public-preview) or a [downloadable JSON file](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files). In either case, IP ranges are broken down by region - you can pick only the IP ranges assigned for the region in which your search service is provisioned.

For certain data sources, the service tag itself can be used directly instead of enumerating the list of IP ranges (the IP address of the search service still needs to be used explicitly). These data sources restrict access by means of setting up a [Network Security Group rule](../virtual-network/network-security-groups-overview.md), which natively support adding a service tag, unlike IP rules such as the ones offered by Azure Storage, Cosmos DB, Azure SQL, and so forth. The data sources that support the ability to utilize the `AzureCognitiveSearch` service tag directly in addition to search service IP address are:

- [SQL Server on Azure virtual machines](./search-howto-connecting-azure-sql-iaas-to-azure-search-using-indexers.md#restrict-access-to-the-azure-cognitive-search)

- [SQL Managed Instances](./search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers.md#verify-nsg-rules)

For more information about this connectivity option, see [Indexer connections through an IP firewall](search-indexer-howto-access-ip-restricted.md).

## Granting access via private endpoints

Indexers can utilize [private endpoints](../private-link/private-endpoint-overview.md) to access resources, access to which are locked down either to select virtual networks or do not have any public access enabled.
This functionality is only available in billable search services, with limits on the number of private endpoints that be created. For more information, see [Service limits](search-limits-quotas-capacity.md#shared-private-link-resource-limits).

### Step 1: Create a private endpoint to the secure resource

Customers should call the search management operation, [CreateOrUpdate API](/rest/api/searchmanagement/sharedprivatelinkresources/createorupdate) on a **shared private link resource**,  in order to create a private endpoint connection to their secure resource (for example, a storage account). Traffic that goes over this (outbound) private endpoint connection will originate only from the virtual network that's in the search service specific "private" indexer execution environment.

Azure Cognitive Search will validate that callers of this API have Azure RBAC permissions to approve private endpoint connection requests to the secure resource. For example, if you request a private endpoint connection to a storage account with read-only permissions, this call will be rejected.

### Step 2: Approve the private endpoint connection

When the (asynchronous) operation that creates a shared private link resource completes, a private endpoint connection will be created in a "Pending" state. No traffic flows over the connection yet.
The customer is then expected to locate this request on their secure resource and "Approve" it. Typically, this can be done either via the Azure portal or via the [REST API](/rest/api/virtualnetwork/privatelinkservices/updateprivateendpointconnection).

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

These steps are described in greater detail in [Indexer connections through a private endpoint](search-indexer-howto-access-private.md).
Once you have an approved private endpoint to a resource, indexers that are set to be *private* attempt to obtain access via the private endpoint connection.

### Limits

To ensure optimal performance and stability of the search service, restrictions are imposed (by search service tier) on the following dimensions:

- The kinds of indexers that can be set to be *private*.
- The number of shared private link resources that can be created.
- The number of distinct resource types for which shared private link resources can be created.

These limits are documented in [service limits](search-limits-quotas-capacity.md).

## Next steps

- [Indexer connections through IP firewalls](search-indexer-howto-access-ip-restricted.md)
- [Indexer connections using the trusted service exception](search-indexer-howto-access-trusted-service-exception.md)
- [Indexer connections to a private endpoint](search-indexer-howto-access-private.md)