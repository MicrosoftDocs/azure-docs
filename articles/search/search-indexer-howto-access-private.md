---
title: Connect through a private endpoint
titleSuffix: Azure Cognitive Search
description: Configure indexer connections to access content from other Azure resources that are protected through a private endpoint.

manager: nitinme
author: arv100kri
ms.author: arjagann
ms.service: cognitive-search
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 06/30/2022
---

# Make outbound connections through a private endpoint

Many Azure resources, such as Azure storage accounts, can be configured to accept connections from a list of virtual networks and refuse outside connections that originate from a public network. If you're using an indexer and your Azure PaaS data source is on a private network, you can create an outbound [private endpoint connection](../private-link/private-endpoint-overview.md) used by Azure Cognitive Search to reach the data. 

For [Azure Storage](../storage/common/storage-network-security.md?tabs=azure-portal), if both the storage account and the search service are in the same region, outbound traffic uses a private IP address to communicate to storage and occurs over the Microsoft backbone network. For this scenario, you can omit private endpoints through Azure Cognitive Search. For other Azure PaaS resources, we suggest that you review the networking documentation for those resources to determine whether a private endpoint is helpful.

To create a private endpoint that an indexer can use, use the Azure portal or the [Create Or Update Shared Private Link](/rest/api/searchmanagement/2020-08-01/shared-private-link-resources/create-or-update) operation in the Azure Cognitive Search Management REST API. A private endpoint that's used by your search service is created using Cognitive Search APIs or the portal pages for Azure Cognitive Search.

## Terminology

Private endpoints created through Azure Cognitive Search APIs are referred to as "shared private links" or "managed private endpoints". The concept of a shared private link is that an Azure PaaS resource already has a private endpoint through [Azure Private Link service](https://azure.microsoft.com/services/private-link/), and Azure Cognitive Search is sharing access. Although access is shared, a shared private link creates its own private connection that's used exclusively by Azure Cognitive Search. The shared private link is the mechanism by which Azure Cognitive Search makes the connection to resources in a private network.

## Prerequisites

+ The Azure resource that provides content or code must be previously registered with the [Azure Private Link service](https://azure.microsoft.com/services/private-link/).

+ The search service must be Basic tier or higher. If you're using [AI enrichment](cognitive-search-concept-intro.md) and skillsets, the tier must be Standard 2 (S2) or higher. See [Service limits](search-limits-quotas-capacity.md#shared-private-link-resource-limits).

+ If you're connecting to a preview data source, such as Azure Database for MySQL or Azure Functions, use a preview version of the Management REST API to create the shared private link. Preview versions that support a shared private link include `2020-08-01-preview` or `2021-04-01-preview`.

+ Connections from the search client should be programmatic, either REST APIs or an Azure SDK, rather than through the Azure portal. The device must connect using an authorized IP in the Azure PaaS resource's firewall rules.

+ Indexer execution must use the private execution environment that's specific to your search service. Private endpoint connections aren't supported from the multi-tenant environment. Instructions for this requirement are provided in this article.

+ If you're using [Azure portal](https://portal.azure.com/) to create a shared private link, make sure that access to all public networks is enabled in the data source resource firewall, or there'll be errors when you try to create the object. You only need to enable access while setting up the shared private link. If you can't enable access for this task, use the REST API from a device with an authorized IP in the firewall rules.

> [!NOTE]
> [Import data wizard](search-import-data-portal.md) or invoking indexer-based indexing from the portal over a shared private link is not supported.

<a name="group-ids"></a>

## Supported resources and group IDs

The following table lists Azure resources for which you can create managed private endpoints from within Azure Cognitive Search.

When setting up a shared private link resource, make sure the group ID value is exact. Values are case-sensitive and must be identical to those shown in the following table. Notice that for several resources and features, you'll need to set two IDs.

| Azure resource | Group ID |
| --- | --- |
| Azure Storage - Blob | `blob` <sup>1,</sup> <sup>2</sup>  |
| Azure Storage - Data Lake Storage Gen2 | `dfs` and `blob` |
| Azure Storage - Tables | `table` <sup>2</sup> |
| Azure Cosmos DB for NoSQL | `Sql`|
| Azure SQL Database | `sqlServer`|
| Azure Database for MySQL (preview) | `mysqlServer`|
| Azure Key Vault for [customer-managed keys](search-security-manage-encryption-keys.md) | `vault` |
| Azure Functions (preview) <sup>3</sup>  | `sites` |

<sup>1</sup> If you enabled [enrichment caching](cognitive-search-incremental-indexing-conceptual.md) and the connection to Azure Blob Storage is through a private endpoint, make sure there is a shared private link of type `blob`.

<sup>2</sup> If you're projecting data to a [knowledge store](knowledge-store-concept-intro.md) and the connection to Azure Blob Storage and Azure Table Storage is through a private endpoint, make sure there are two shared private links of type `blob` and `table`, respectively.

<sup>3</sup> Azure Functions (preview) refers to Functions under a Consumption, Premium and Dedicated [App Service plan](../app-service/overview-hosting-plans.md). The [App Service Environment (ASE)](../app-service/environment/overview.md) and [Azure Kubernetes Service (AKS)](../aks/intro-kubernetes.md) are not supported at this time.

> [!TIP]
> You can query for the list of supported resources and group IDs by using the [list of supported APIs](/rest/api/searchmanagement/2021-04-01-preview/private-link-resources/list-supported).

## 1 - Create a shared private link

The following section describes how to create a shared private link resource either using the Azure portal or the Azure CLI.

Azure portal only supports creating a shared private link resource using group ID values that are generally available. For [MySQL Private Link (Preview)](../mysql/concepts-data-access-security-private-link.md) and [Azure Functions Private Link (Preview)](../azure-functions/functions-networking-options.md), use Azure CLI.

### [**Azure portal**](#tab/portal-create)

1. [Sign in to Azure portal](https://portal.azure.com) and [find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/).

1. Under **Settings** on the left navigation pane, select **Networking**.

1. On the **Shared Private Access** tab, select **+ Add Shared Private Access**.

1. On the blade that opens on the right, select either **Connect to an Azure resource in my directory** or **Connect to an Azure resource by resource ID or alias**.

1. If you select the first option (recommended), the blade helps you pick the appropriate Azure resource and fills in other properties, such as the group ID of the resource and the resource type.

   ![Screenshot of the "Add Shared Private Access" pane, showing a guided experience for creating a shared private link resource. ](media\search-indexer-howto-secure-access\new-shared-private-link-resource.png)

1. If you select the second option, enter the Azure resource ID manually and choose the appropriate group ID from the list at the beginning of this article.

   ![Screenshot of the "Add Shared Private Access" pane, showing the manual experience for creating a shared private link resource.](media\search-indexer-howto-secure-access\new-shared-private-link-resource-manual.png)

### [**Azure CLI**](#tab/cli-create)

You can use the Management REST API with Azure PowerShell, or the [Azure CLI](/cli/azure/) as shown in this example.

Remember to use the preview API version, either 2020-08-01-preview or 2021-04-01-preview, if you're using a group ID that's in preview. For example, *sites* and *mysqlServer* are in preview and require you to use the preview API.

```dotnetcli
az rest --method put --uri https://management.azure.com/subscriptions/<search service subscription ID>/resourceGroups/<search service resource group name>/providers/Microsoft.Search/searchServices/<search service name>/sharedPrivateLinkResources/<shared private endpoint name>?api-version=2020-08-01 --body @create-pe.json
```

The definition of a shared private link is provided in a JSON file. The following is an example of what a *create-pe.json* file might contain:

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

A `202 Accepted` response is returned on success. The process of creating an outbound private endpoint is a long-running (asynchronous) operation. It involves deploying the following resources:

+ A private endpoint, allocated with a private IP address in a `"Pending"` state. The private IP address is obtained from the address space that's allocated to the virtual network of the execution environment for the search service-specific private indexer. Upon approval of the private endpoint, any communication from Azure Cognitive Search to the Azure resource originates from the private IP address and a secure private link channel.

+ A private DNS zone for the type of resource, based on the group ID. By deploying this resource, you ensure that any DNS lookup to the private resource utilizes the IP address that's associated with the private endpoint.

Be sure to specify the correct group ID for the type of resource for which you're creating the private endpoint. Any mismatch will result in a non-successful response message.

---

<a name="check-endpoint-status"></a>

## 2 - Check the status of the private endpoint creation

In this step, confirm that the provisioning state of the resource changes to "Succeeded". 

You can use the portal to check provisioning state for both generally available and preview resources.

### [**Azure portal**](#tab/portal-status)

The portal shows you the state of the shared private endpoint. In the following example, the status is "Updating".

![Screenshot of the "Add Shared Private Access" pane, showing the resource creation in progress. ](media\search-indexer-howto-secure-access\new-shared-private-link-resource-progress.png)

Once the resource is successfully created, you'll receive a portal notification and the provisioning state of the resource changes to "Succeeded".

![Screenshot of the "Add Shared Private Access" pane, showing the resource creation completed. ](media\search-indexer-howto-secure-access\new-shared-private-link-resource-success.png)

### [**Azure CLI**](#tab/cli-status)

The `PUT` call to create the shared private endpoint returns an `Azure-AsyncOperation` header value that looks like the following:

`"Azure-AsyncOperation": "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Search/searchServices/contoso-search/sharedPrivateLinkResources/blob-pe/operationStatuses/08586060559526078782?api-version=2020-08-01"`

You can poll for the status by manually querying the `Azure-AsyncOperationHeader` value.

```dotnetcli
az rest --method get --uri https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Search/searchServices/contoso-search/sharedPrivateLinkResources/blob-pe/operationStatuses/08586060559526078782?api-version=2020-08-01
```

---

## 3 - Approve the private endpoint connection

In this section, you use the Azure portal for the approval flow of a private endpoint to the Azure resource you're connecting to. Alternatively, you could use the **[REST API](/rest/api/storagerp/privateendpointconnections)** that's available via the Storage resource provider.

Other providers, such as Azure Cosmos DB or Azure SQL Server, offer similar resource provider REST APIs for managing private endpoint connections.

1. In the Azure portal, find the Azure resource that you're connecting to and open the **Networking** page.

1. Find the section that lists the private endpoint connections. Following is an example for a storage account. After the asynchronous operation has succeeded, there should be a request for a private endpoint connection with the request message from the previous API call.

   ![Screenshot of the Azure portal, showing the "Private endpoint connections" pane.](media\search-indexer-howto-secure-access\storage-privateendpoint-approval.png)

1. Select the private endpoint that Azure Cognitive Search created. In the **Private endpoint** column, identify the private endpoint connection by the name that's specified in the previous API, select **Approve**, and then enter an appropriate message. The message content isn't significant.

   Make sure that the private endpoint connection appears as shown in the following screenshot. It could take one to two minutes for the status to be updated in the portal.

   ![Screenshot of the Azure portal, showing an "Approved" status on the "Private endpoint connections" pane.](media\search-indexer-howto-secure-access\storage-privateendpoint-after-approval.png)

After the private endpoint connection request is approved, traffic is *capable* of flowing through the private endpoint. After the private endpoint is approved, Azure Cognitive Search creates the necessary DNS zone mappings in the DNS zone that's created for it.

## 4 - Query the status of the shared private link resource

To confirm that the shared private link resource has been updated after approval, revisit the "Shared Private Access" blade of the search service **Networking** page on the Azure portal and check the "Connection State".

   ![Screenshot of the Azure portal, showing an "Approved" shared private link resource.](media\search-indexer-howto-secure-access\new-shared-private-link-resource-approved.png)

Alternatively, you can also obtain the "Connection state" by using the [GET API](/rest/api/searchmanagement/2021-04-01-preview/shared-private-link-resources/get).

```dotnetcli
az rest --method get --uri https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Search/searchServices/contoso-search/sharedPrivateLinkResources/blob-pe?api-version=2020-08-01
```

This would return a JSON, where the connection state would show up as "status" under the "properties" section. Following is an example for a storage account.

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

If the "Provisioning State" (`properties.provisioningState`) of the resource is `Succeeded` and "Connection State" (`properties.status`) is `Approved`, it means that the shared private link resource is functional and the indexer can be configured to communicate over the private endpoint.

## 5 - Secure your Azure resource

The steps for restricting access vary by resource. The following scenarios show three of the more common types of resources.

+ Scenario 1: Azure Storage

  The following is an example of how to configure an Azure storage account firewall. If you select this option and leave the page empty, it means that no traffic from virtual networks is allowed.

  ![Screenshot of the "Firewalls and virtual networks" pane for Azure storage, showing the option to allow access to selected networks.](media\search-indexer-howto-secure-access\storage-firewall-noaccess.png)

+ Scenario 2: Azure Key Vault

  The following is an example of how to configure Azure Key Vault firewall.

  ![Screenshot of the "Firewalls and virtual networks" pane for Azure Key Vault, showing the option to allow access to selected networks.](media\search-indexer-howto-secure-access\key-vault-firewall-noaccess.png)

+ Scenario 3: Azure Functions

  No network setting changes are needed for Azure Functions firewalls. The function will automatically only allow access through private link after the creation of a shared private endpoint to the Function.

## 6 - Configure the indexer to run in the private environment

[Indexer execution](search-indexer-securing-resources.md#indexer-execution-environment) occurs in either a private environment that's specific to the search service, or a multi-tenant environment that's used internally to offload expensive skillset processing for multiple customers. The execution environment is usually transparent, but once you start building firewall rules or establishing private connections, you'll have to take indexer execution into account. In the case of private endpoints, you'll need to ensure that indexer execution always occurs in the private environment. 

This step shows you how to configure the indexer to run in the private environment using the REST API. You can also set the execution environment using the JSON editor in the portal.

> [!NOTE]
> You can perform this step before the private endpoint connection is approved. However, until the private endpoint connection shows as approved, any existing indexer that tries to communicate with a secure resource (such as the storage account) will end up in a transient failure state and new indexers will fail to be created.

1. Create the data source definition, index, and skillset (if you're using one) as you would normally. There are no properties in any of these definitions that vary when using a shared private endpoint.

1. [Create an indexer](/rest/api/searchservice/create-indexer) that points to the data source, index, and skillset that you created in the preceding step. In addition, force the indexer to run in the private execution environment by setting the indexer `executionEnvironment` configuration property to `private`.

    ```json
    {
        "name": "indexer",
        "dataSourceName": "blob-datasource",
        "targetIndexName": "index",
        "parameters": {
            "configuration": {
                "executionEnvironment": "private"
            }
        },
        "fieldMappings": []
    }
    ```

    Following is an example of the request in Postman.

    ![Screenshot showing the creation of an indexer on the Postman user interface.](media\search-indexer-howto-secure-access\create-indexer.png)

After the indexer is created successfully, it should connect to the Azure resource over the private endpoint connection. You can monitor the status of the indexer by using the [Indexer Status API](/rest/api/searchservice/get-indexer-status).

> [!NOTE]
> If you already have existing indexers, you can update them via the [PUT API](/rest/api/searchservice/create-indexer) by setting the `executionEnvironment` to `private` or using the JSON editor in the portal.

## Troubleshooting

+ If your indexer creation fails with "Data source credentials are invalid," check the approval status of the shared private link before debugging the connection:

  1. Obtain the status of the shared private link resource by using the [GET API](/rest/api/searchmanagement/2021-04-01-preview/shared-private-link-resources/get).
  1. If the status is `Approved`, check the `properties.provisioningState` property.
  1. If it's `Incomplete`, there might be a problem with underlying dependencies.
  1. In this case, reissue the `PUT` request to re-create the shared private link. You might also need to repeat the approval step.
  1. Check the status of the resource to verify whether the issue is fixed.

+ If indexers fail consistently or intermittently, check the [`executionEnvironment` property](/rest/api/searchservice/update-indexer) on the indexer. The value should be set to `private`. If you didn't set this property, and indexer runs succeeded in the past, it's because the search service used a private environment of its own accord. A search service will move processing out of the standard environment if the system is under load.

+ In the portal, it's expected to get "No Access" when viewing the search private endpoint on your data source's **Networking** page. If you want to manage the shared private link for search in the portal, use the **Networking** page of your search service.

+ If you get an error when creating a shared private link, check [service limits](search-limits-quotas-capacity.md) to verify that you're under the quota for your tier.

+ If you have created a shared private link mapped to your storage account, any indexer in your search service that doesn't have a [skillset](cognitive-search-working-with-skillsets.md) will be able to access the storage account.

+ If your indexers do not have [skillsets](cognitive-search-working-with-skillsets.md) and connect to your data source using a shared private link, you don't have to configure the indexer `executionEnvironment` configuration property to `private`. This is only necessary when running skillsets.


## Next steps

Learn more about private endpoints and other secure connection methods:

+ [Troubleshoot issues with shared private link resources](troubleshoot-shared-private-link-resources.md)
+ [What are private endpoints?](../private-link/private-endpoint-overview.md)
+ [DNS configurations needed for private endpoints](../private-link/private-endpoint-dns.md)
+ [Indexer access to content protected by Azure network security features](search-indexer-securing-resources.md)
