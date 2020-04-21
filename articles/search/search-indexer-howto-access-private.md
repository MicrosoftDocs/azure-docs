---
title: Indexers accessing secure resources via private endpoints
titleSuffix: Azure Cognitive Search
description: How to guide that describes setting up private endpoints for indexers to communicate with secure resources

manager: nitinme
author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/13/2020
---

# Accessing secure resources via private endpoints

Indexers have limited support for accessing certain types of resources, which are secured to either only allow access from an approved set of virtual network or have turned off access from any source altogether. The first scenario describes a resource (such as storage), with a public endpoint which only allows traffic originating from specific virtual networks. The second scenario "disables" the public endpoint, and all communication to the resource must occur over a [private link](https://docs.microsoft.com/azure/private-link/private-link-overview).

In either case, customers can request Azure Cognitive Search to create a [private endpoint connection](https://docs.microsoft.com/azure/private-link/private-endpoint-overview) in order to securely access the data in their resource. The ability for a given search service to create private endpoint connections is currently available in a gated capacity. To request access to this capability, please fill out this form: @TODO MARK@.

## Shared Private Link Resources Management APIs

Private endpoints that are created by Azure Cognitive Search upon customer request, to access "secure" resources are referred to as *shared private link resources*. The customer is "sharing" access to a resource (such as a storage account), that has on-boarded to the [Azure Private Link service](https://azure.microsoft.com/services/private-link/).

Azure Cognitive Search offers via the search management API, the ability to [Create or Update shared private link resources](https://docs.microsoft.com/rest/api/searchmanagement/sharedprivatelinkresources/createorupdate). You will use this API along with other *shared private link resources* management APIs to configure access to a secure resource from an Azure Cognitive Search indexer.

Private endpoint connections to some resources can only be created via the preview version of the search management API (`2019-10-01-Preview`). These are indicated with the "preview" tag in the table below. Resources without "preview" tag can be created via both the preview API as well as the GA API (`2020-03-13`)

The following are the list of Azure resources to which private endpoints can be created from Azure Cognitive Search. `groupId` listed in the table below needs to be used exactly (case-sensitive) in the API to create a shared private link resource.

| Azure Resource | Group Id |
| --- | --- |
| Azure Storage - Blob (or) ADLS Gen 2 | `blob`|
| Azure Storage - Tables | `table`|
| Cosmos DB - SQL API | `Sql`|
| Azure SQL server | `sqlServer`|
| Azure MySQL server (preview) | `mysqlServer`|
| Azure Key Vault | `vault` |
| Azure functions (preview) | `sites` |

The list of Azure resources for which private endpoint connections are supported can also be queried via the [List Supported API](https://docs.microsoft.com/rest/api/searchmanagement/privatelinkresources/listsupported).

The ability to access resources via private endpoints is available only via the REST API for now (no SDK or portal support). For the purposes of this guide, a mix of [ARMClient](https://github.com/projectkudu/ARMClient) and [PostMan](https://www.postman.com/) are used to demonstrate the API calls.

> [!NOTE]
> Throughout this guide, let's assume that the name of the search service is __contoso-search__ which exists in the resource group __contoso__ of a subscription with subscription id __00000000-0000-0000-0000-000000000000__. The resource id of this search service will be `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Search/searchServices/contoso-search`

Once your service has been flighted with this feature, perform the following steps to access secure resources via private endpoints.

The rest of the guide will show how the __contoso-search__ service can be configured so that its indexers can access data from the secure storage account `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Storage/storageAccounts/contoso-storage`

## Securing your storage account

Configure the storage account to [allow access only from specific subnets](https://docs.microsoft.com/azure/storage/common/storage-network-security#grant-access-from-a-virtual-network). Via the Azure portal, if you check this option and leave the set empty, it means that no traffic from any virtual network is allowed.

   ![Virtual Network Access](media\search-indexer-howto-secure-access\storage-firewall-noaccess.PNG "Virtual Network Access")

> [!NOTE]
> The [trusted Microsoft service approach](https://docs.microsoft.com/azure/storage/common/storage-network-security#trusted-microsoft-services) can be used to bypass virtual network or IP restrictions on such a storage account and can enable the search service to access data in the storage account as described in the [how to guide](search-indexer-howto-access-trusted-service-exception.md). However, when using this approach communication between Azure Cognitive Search and the storage account happens via the public IP address of the storage account, over the secure Microsoft backbone network.

## Step 1: Create a shared private link resource to the storage account

Make the following API call to request Azure Cognitive Search to create a private endpoint connection to the storage account

`armclient PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Search/searchServices/contoso-search/sharedPrivateLinkResources/blob-pe?api-version=2020-03-13 create-pe.json`

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

When this call succeeds, a private endpoint resource is created. This resource has a private IP address associated with it, obtained from the address space allocated to the virtual network of the search service specific "private" indexer execution environment. Any communication from Azure Cognitive Search to the storage account that occurs over the private endpoint connection goes through this private IP address and a secure private link channel.

A `200 OK` response wil contain the state of the private endpoint connection (which will be created in a "Pending" state).

```json
{
      "name": "blob-pe",
      "properties": {
        "privateLinkResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Storage/storageAccounts/contoso-storage",
        "groupId": "blob",
        "requestMessage": "please approve",
        "status": "Pending"
      }
}
```

Make sure to specify the correct `groupId` for the type of resource for which you are creating the private endpoint. Any mismatch will result in a non successful response message.

## Step 2a: Approve the private endpoint connection for the storage account

Navigate to the "Private endpoint connections" tab of the storage account. There should be a request for a private endpoint connection, with the request message from the previous API call. Allow from 2-5 minutes for this approval request to show up in the portal.

   ![Private endpoint approval](media\search-indexer-howto-secure-access\storage-privateendpoint-approval.png "Private endpoint approval")

Select the private endpoint that was created by Azure Cognitive Search (use the "Private endpoint" column to identify the private endpoint connection by the name specified in the previous API) and choose "Approve", with an appropriate message (the message isn't significant). Make sure the private endpoint connection appears as follows (it could anywhere from 1-2 minutes for the status to be updated on the portal)

![Private endpoint approved](media\search-indexer-howto-secure-access\storage-privateendpoint-after-approval.png "Private endpoint approved")

After the private endpoint connection request is approved, it means that traffic is *capable* of flowing through the private endpoint. However, this cannot happen until the search service knows that 