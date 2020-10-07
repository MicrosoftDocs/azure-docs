---
title: Indexers accessing secure resources via private endpoints
titleSuffix: Azure Cognitive Search
description: How to guide that describes setting up private endpoints for indexers to communicate with secure resources

manager: nitinme
author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 09/07/2020
---

# Accessing secure resources via private endpoints

Azure resources (such as storage accounts that are used as data sources), can be configured such that they can only be accessed from a specific list of virtual networks. They can also be configured to disallow any "public network" access.
Customers can request Azure Cognitive Search to create an (outbound) [private endpoint connection](https://docs.microsoft.com/azure/private-link/private-endpoint-overview) in order to securely access data from such data sources via indexers.

## Shared Private Link Resources Management APIs

Private endpoints that are created by Azure Cognitive Search upon customer request, to access "secure" resources are referred to as *shared private link resources*. The customer is "sharing" access to a resource (such as a storage account), that has on-boarded to the [Azure Private Link service](https://azure.microsoft.com/services/private-link/).

Azure Cognitive Search offers via the search management API, the ability to [Create or Update shared private link resources](https://docs.microsoft.com/rest/api/searchmanagement/sharedprivatelinkresources/createorupdate). You will use this API along with other *shared private link resources* management APIs to configure access to a secure resource from an Azure Cognitive Search indexer.

Private endpoint connections to some resources can only be created via the preview version of the search management API (`2020-08-01-Preview`), indicated with the "preview" tag in the table below. Resources without "preview" tag can be created via both the preview API as well as the GA API (`2020-08-01`)

The following are the list of Azure resources to which outbound private endpoints can be created from Azure Cognitive Search. `groupId` listed in the table below needs to be used exactly (case-sensitive) in the API to create a shared private link resource.

| Azure Resource | Group ID |
| --- | --- |
| Azure Storage - Blob (or) ADLS Gen 2 | `blob`|
| Azure Storage - Tables | `table`|
| Azure Cosmos DB - SQL API | `Sql`|
| Azure SQL Database | `sqlServer`|
| Azure Database for MySQL (preview) | `mysqlServer`|
| Azure Key Vault | `vault` |
| Azure Functions (preview) | `sites` |

The list of Azure resources for which outbound private endpoint connections are supported can also be queried via the [List Supported API](https://docs.microsoft.com/rest/api/searchmanagement/privatelinkresources/listsupported).

For the purposes of this guide, a mix of [ARMClient](https://github.com/projectkudu/ARMClient) and [Postman](https://www.postman.com/) are used to demonstrate the REST API calls.

> [!NOTE]
> Throughout this guide, let's assume that the name of the search service is __contoso-search__ which exists in the resource group __contoso__ of a subscription with subscription ID __00000000-0000-0000-0000-000000000000__. The resource ID of this search service will be `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Search/searchServices/contoso-search`

The rest of the guide will show how the __contoso-search__ service can be configured so that its indexers can access data from the secure storage account `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Storage/storageAccounts/contoso-storage`

## Securing your storage account

Configure the storage account to [allow access only from specific subnets](https://docs.microsoft.com/azure/storage/common/storage-network-security#grant-access-from-a-virtual-network). Via the Azure portal, if you check this option and leave the set empty, it means that no traffic from any virtual network is allowed.

   ![Virtual Network Access](media\search-indexer-howto-secure-access\storage-firewall-noaccess.png "Virtual Network Access")

> [!NOTE]
> The [trusted Microsoft service approach](https://docs.microsoft.com/azure/storage/common/storage-network-security#trusted-microsoft-services) can be used to bypass virtual network or IP restrictions on such a storage account and can enable the search service to access data in the storage account as described in the [how to guide](search-indexer-howto-access-trusted-service-exception.md). However, when using this approach communication between Azure Cognitive Search and the storage account happens via the public IP address of the storage account, over the secure Microsoft backbone network.

## Step 1: Create a shared private link resource to the storage account

Make the following API call to request Azure Cognitive Search to create an outbound private endpoint connection to the storage account

`armclient PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Search/searchServices/contoso-search/sharedPrivateLinkResources/blob-pe?api-version=2020-08-01 create-pe.json`

The contents of `create-pe.json` file (that represents the request body to the API) are as follows:

```json
{
      "name": "blob-pe",
      "properties": {
        "privateLinkResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Storage/storageAccounts/contoso-storage",
        "groupId": "blob",
        "requestMessage": "please approve"
      }
}
```

A `202 Accepted` response is returned on success - the process of creating an outbound private endpoint is a long running (asynchronous) operation. It involves deploying the following resources -

1. A private endpoint allocated with a private IP address in a `"Pending"` state. The private IP address is obtained from the address space allocated to the virtual network of the search service specific private indexer execution environment. Upon approval of the private endpoint, any communication from Azure Cognitive Search to the storage account originates from the private IP address and a secure private link channel.
2. A private DNS zone for the type of resource, based on the `groupId`. This will ensure that any DNS lookup to the private resource utilizes the IP address associated with the private endpoint.

Make sure to specify the correct `groupId` for the type of resource for which you are creating the private endpoint. Any mismatch will result in a non-successful response message.

Like all asynchronous Azure operations, the `PUT` call returns a `Azure-AsyncOperation` header value that will look as follows:

`"Azure-AsyncOperation": "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Search/searchServices/contoso-search/sharedPrivateLinkResources/blob-pe/operationStatuses/08586060559526078782?api-version=2020-08-01"`

This URI can be polled periodically to obtain the status of the operation. We recommend waiting until the shared private link resource operation status has reached a terminal state (that is, `succeeded`) before proceeding.

`armclient GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Search/searchServices/contoso-search/sharedPrivateLinkResources/blob-pe/operationStatuses/08586060559526078782?api-version=2020-08-01"`

```json
{
    "status": "running" | "succeeded" | "failed"
}
```

## Step 2a: Approve the private endpoint connection for the storage account

> [!NOTE]
> This section uses Azure portal to walk through the approval flow for a private endpoint to storage. The [REST API](https://docs.microsoft.com/rest/api/storagerp/privateendpointconnections) available via storage resource provider (RP) can also be used instead.
>
> Other providers such as CosmosDB, Azure SQL server etc., also offer similar RP APIs to manage private endpoint connections.

Navigate to the "**Private endpoint connections**" tab of the storage account on Azure portal. There should be a request for a private endpoint connection, with the request message from the previous API call (once the asynchronous operation has __succeeded__).

   ![Private endpoint approval](media\search-indexer-howto-secure-access\storage-privateendpoint-approval.png "Private endpoint approval")

Select the private endpoint that was created by Azure Cognitive Search (use the "Private endpoint" column to identify the private endpoint connection by the name specified in the previous API) and choose "Approve", with an appropriate message (the message isn't significant). Make sure the private endpoint connection appears as follows (it could anywhere from 1-2 minutes for the status to be updated on the portal)

![Private endpoint approved](media\search-indexer-howto-secure-access\storage-privateendpoint-after-approval.png "Private endpoint approved")

After the private endpoint connection request is approved, it means that traffic is *capable* of flowing through the private endpoint. Once the private endpoint is approved Azure Cognitive Search will create the necessary DNS zone mappings in the DNS zone created for it.

## Step 2b: Query the status of the shared private link resource

 To confirm that the shared private link resource has been updated after approval, obtain its status via the [GET API](https://docs.microsoft.com/rest/api/searchmanagement/sharedprivatelinkresources/get).

`armclient GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Search/searchServices/contoso-search/sharedPrivateLinkResources/blob-pe?api-version=2020-08-01`

If the `properties.provisioningState` of the resource is `Succeeded` and `properties.status` is `Approved`, it means that the shared private link resource is functional and indexers can be configured to communicate over the private endpoint.

```json
{
      "name": "blob-pe",
      "properties": {
        "privateLinkResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Storage/storageAccounts/contoso-storage",
        "groupId": "blob",
        "requestMessage": "please approve",
        "status": "Approved",
        "resourceRegion": null,
        "provisioningState": "Succeeded"
      }
}

```

## Step 3: Configure indexer to run in the private environment

> [!NOTE]
> This step can be performed even before the private endpoint connection is approved. Until the private endpoint connection is approved, any indexer that tries to communicate with a secure resource (such as the storage account), will end up in a transient failure state. New indexers will fail to be created. As soon as the private endpoint connection is approved, indexers will be able to access the private storage account.

1. [Create a data source](https://docs.microsoft.com/rest/api/searchservice/create-data-source) that points to the secure storage account and an appropriate container within the storage account. The following shows this request performed via Postman.
![Create Data Source](media\search-indexer-howto-secure-access\create-ds.png "Data Source creation")

2. Similarly [create an index](https://docs.microsoft.com/rest/api/searchservice/create-index) and optionally [create a skillset](https://docs.microsoft.com/rest/api/searchservice/create-skillset) using the REST API.

3. [Create an indexer](https://docs.microsoft.com/rest/api/searchservice/create-indexer) that points to the data source, index, and skillset created above. In addition, force the indexer to run in the private execution environment, by setting the indexer configuration property `executionEnvironment` to `"Private"`.
![Create Indexer](media\search-indexer-howto-secure-access\create-idr.png "Indexer creation")

The indexer should be created successfully, and should be making progress - indexing content from the storage account over the private endpoint connection. The status of the indexer can be monitored via the [Indexer status API](https://docs.microsoft.com/rest/api/searchservice/get-indexer-status).

> [!NOTE]
> If you already have existing indexers, you can simply update them via the [PUT API](https://docs.microsoft.com/rest/api/searchservice/create-indexer) to set the `executionEnvironment` to `"Private"`.

## Troubleshooting issues

- When creating an indexer, if creation fails with an error message similar to "Data source credentials are invalid", it means that either the private endpoint connection has not been *Approved* or it is not functional.
Obtain the status of the shared private link resource using the [GET API](https://docs.microsoft.com/rest/api/searchmanagement/sharedprivatelinkresources/get). If it has been *Approved* check the `properties.provisioningState` of the resource. If it is `Incomplete`, this means some of the underlying dependencies for the resource failed to provision - reissue the `PUT` request to "re-create" the shared private link resource that should fix the issue. A re-approval might be necessary - check the status of the resource once again to verify.
- If the indexer is created without setting its `executionEnvironment`, the indexer creation might succeed, but its execution history will show that indexer runs are unsuccessful. You should [update the indexer](https://docs.microsoft.com/rest/api/searchservice/update-indexer) to specify the execution environment.
- If the indexer is created without setting the `executionEnvironment` and it runs successfully, it means that Azure Cognitive Search has decided that its execution environment is the search service specific "private" environment. However, this can change based on a variety of factors (resources consumed by the indexer, the load on the search service, and so on) and can fail at a later point - we highly recommend you set the `executionEnvironment` as `"Private"` to ensure that it will not fail in the future.
- [Quotas and limits](search-limits-quotas-capacity.md) determine how many shared private link resources can be created and depend on the SKU of the search service.

## Next steps

Learn more about private endpoints:

- [What are private endpoints?](https://docs.microsoft.com/azure/private-link/private-endpoint-overview)
- [DNS configurations needed for private endpoints](https://docs.microsoft.com/azure/private-link/private-endpoint-dns)