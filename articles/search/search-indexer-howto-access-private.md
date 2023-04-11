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
ms.date: 02/22/2023
---

# Make outbound connections through a private endpoint

If you have an Azure PaaS resource that has a private connection enabled through [Azure Private Link](../private-link/private-link-overview.md), you'll need to create a *shared private link* to reach those resources from Azure Cognitive Search. This article walks you through the steps for creating, testing, and managing a private link.

## When to use a shared private link

Cognitive Search makes outbound calls to other Azure PaaS resources in the following scenarios:

+ Indexer connection requests to supported data sources
+ Indexer (skillset) connections to Azure Storage for caching enrichments or writing to a knowledge store
+ Encryption key requests to Azure Key Vault
+ Custom skill requests to Azure Functions or similar resource

For those service-to-service communication scenarios, Search typically sends a request over a public internet connection. However, if your data, key vault, or function is accessed through a [private endpoint](../private-link/private-endpoint-overview.md), then your search service needs a way to reach that endpoint. The mechanism by which a search service connects to a private endpoint is called a *shared private link*.

A shared private link is:

+ Created using Azure Cognitive Search tooling, APIs, or SDKs
+ Approved by the Azure PaaS resource owner
+ Used internally by Search on a private connection to a specific Azure resource

Only your search service can use the private links that it creates, and there can be only one shared private link created on your service for each resource and sub-resource combination.

Once you set up the private link, it's used automatically whenever Search connects to that PaaS resource. You don't need to modify the connection string or alter the client you're using to issue the requests, although the device used for the connection must connect using an authorized IP in the Azure PaaS resource's firewall.

> [!NOTE]
> There are two scenarios for using [Azure Private Link](../private-link/private-link-overview.md) and Azure Cognitive Search together. Creating a shared private link is one scenario, relevant when an *outbound* connection to Azure PaaS requires a private connection. The second scenario is [configure search for a private *inbound* connection](service-create-private-endpoint.md) from clients that run in a virtual network. While both scenarios have a dependency on Azure Private Link, they are independent. You can create a shared private link without having to configure your own search service for a private endpoint.

### Limitations

When evaluating shared private links for your scenario, remember these constraints.

+ Several of the resource types used in a shared private link are in preview. If you're connecting to a preview resource (Azure Database for MySQL, Azure Functions, or Azure SQL Managed Instance), use a preview version of the Management REST API to create the shared private link. These versions include `2020-08-01-preview` or `2021-04-01-preview`.

+ Indexer execution must use the private execution environment that's specific to your search service. Private endpoint connections aren't supported from the multi-tenant environment. The configuration setting for this requirement is covered in this article.

## Prerequisites

+ An Azure Cognitive Search at the Basic tier or higher. If you're using [AI enrichment](cognitive-search-concept-intro.md) and skillsets, the tier must be Standard 2 (S2) or higher. See [Service limits](search-limits-quotas-capacity.md#shared-private-link-resource-limits) for details.

+ An Azure PaaS resource from the following list of supported resource types, configured to run in a virtual network, with a private endpoint created through Azure Private Link.

+ You should have a minimum of Contributor permissions on both Azure Cognitive Search and the Azure PaaS resource for which you're creating the shared private link.

<a name="group-ids"></a>

### Supported resource types

You can create a shared private link for the following resources.

| Resource type                     | Sub-resource (or Group ID) |
|-----------------------------------|----------------------------|
| Microsoft.Storage/storageAccounts <sup>1</sup> | `blob`, `table`, `dfs`, `file` |
| Microsoft.DocumentDB/databaseAccounts <sup>2</sup>| `Sql` |
| Microsoft.Sql/servers | `sqlServer` |
| Microsoft.KeyVault/vaults | `vault` |
| Microsoft.DBforMySQL/servers (preview) | `mysqlServer`|
| Microsoft.Web/sites (preview) <sup>3</sup> | `sites` |
| Microsoft.Sql/managedInstances (preview) <sup>4</sup>| `managedInstance` |

<sup>1</sup> If Azure Storage and Azure Cognitive Search are in the same region, the connection to storage is made over the Microsoft backbone network, which means a shared private link is redundant for this configuration. However, if you already set up a private endpoint for Azure Storage, you should also set up a shared private link or the connection is refused on the storage side. Also, if you're using multiple storage formats for various scenarios in search, make sure to create a separate shared private link for each sub-resource.

<sup>2</sup> The `Microsoft.DocumentDB/databaseAccounts` resource type is used for indexer connections to Azure Cosmos DB for NoSQL. The provider name and group ID are case-sensitive.

<sup>3</sup> The `Microsoft.Web/sites` resource type is used for App service and Azure functions. In the context of Azure Cognitive Search, an Azure function is the more likely scenario. An Azure function is commonly used for hosting the logic of a custom skill. Azure Function has Consumption, Premium and Dedicated [App Service hosting plans](../app-service/overview-hosting-plans.md). The [App Service Environment (ASE)](../app-service/environment/overview.md) and [Azure Kubernetes Service (AKS)](../aks/intro-kubernetes.md) aren't supported at this time.

<sup>4</sup> Although `Microsoft.Sql/managedInstances` is listed in the search **Networking** portal page, creating a shared private link to Azure SQL Managed Instance (preview) requires using the REST API, Azure PowerShell, or the Azure CLI with the `az rest` command. The portal doesn't currently construct a valid fully qualified domain name for SQL Managed instances. For a workaround, see [Create a shared private link for SQL Managed Instance](#create-a-shared-private-link-for-a-sql-managed-instance).

### Private endpoint verification

1. Sign in to [Azure portal](https://portal.azure.com/).

1. Type "private link" in the top search bar, and then select **Private Link** to open the Private Link Center.

1. Select **Private endpoints** to view existing endpoints. The Azure PaaS resource for which you're creating a shared private link must have a private endpoint in this list. See [Manage private endpoint connections](../private-link/manage-private-endpoint.md?tabs=manage-private-link-powershell#manage-private-endpoint-connections-on-azure-paas-resources) for details.

These Private Link tutorials provide steps for creating a private endpoint for Azure PaaS:

+ [Tutorial: Connect to a storage account using an Azure Private Endpoint](../private-link/tutorial-private-endpoint-storage-portal.md)

+ [Tutorial: Connect to an Azure Cosmos DB account using an Azure Private Endpoint](../private-link/tutorial-private-endpoint-cosmosdb-portal.md)

+ [Tutorial: Connect to a web app using an Azure Private Endpoint](../private-link/tutorial-private-endpoint-webapp-portal.md)

## 1 - Create a shared private link

Use the Azure portal, Management REST API, the Azure CLI, or Azure PowerShell to create a shared private link.

Here are a few tips:

+ Give the private link a meaningful name. In the Azure PaaS resource, a shared private link appears alongside other private endpoints. A name like "shared-private-link-for-search" can remind you how it's used.

+ Don't skip the [private link verification](#private-endpoint-verification) step. It's possible to create a shared private link for an Azure PaaS resource that doesn't have a private endpoint. The link won't work if the resource isn't registered.

+ SQL managed instance has extra requirements for creating a private link. Currently, you can't use the portal or the Azure CLI `az search` command because neither one formulates a valid URI. Instead, follow the instructions in [Create a shared private link for SQL Managed Instance](#create-a-shared-private-link-for-a-sql-managed-instance) in this article for a workaround.

When you complete these steps, you have a shared private link that's provisioned in a pending state. **It takes several minutes to create the link**. Once it's created, the resource owner needs to approve the request before it's operational.

### [**Azure portal**](#tab/portal-create)

1. [Sign in to Azure portal](https://portal.azure.com) and [find your search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Storage%2storageAccounts/).

1. Under **Settings** on the left navigation pane, select **Networking**.

1. On the **Shared Private Access** tab, select **+ Add Shared Private Access**.

1. Select either **Connect to an Azure resource in my directory** or **Connect to an Azure resource by resource ID or alias**.

1. If you select the first option (recommended), the portal helps you pick the appropriate Azure resource and fills in other properties, such as the group ID of the resource and the resource type.

   ![Screenshot of the "Add Shared Private Access" pane, showing a guided experience for creating a shared private link resource. ](media\search-indexer-howto-secure-access\new-shared-private-link-resource.png)

1. If you select the second option, enter the Azure resource ID manually and choose the appropriate group ID from the list at the beginning of this article.

   ![Screenshot of the "Add Shared Private Access" pane, showing the manual experience for creating a shared private link resource.](media\search-indexer-howto-secure-access\new-shared-private-link-resource-manual.png)

1. Confirm the provisioning status is "Updating".

   ![Screenshot of the "Add Shared Private Access" pane, showing the resource creation in progress. ](media\search-indexer-howto-secure-access\new-shared-private-link-resource-progress.png)

1. Once the resource is successfully created, the provisioning state of the resource changes to "Succeeded".

   ![Screenshot of the "Add Shared Private Access" pane, showing the resource creation completed. ](media\search-indexer-howto-secure-access\new-shared-private-link-resource-success.png)

### [**REST API**](#tab/rest-create)

> [!NOTE]
> Preview API versions, either `2020-08-01-preview` or `2021-04-01-preview`, are required for group IDs that are in preview. The following resource types are in preview: `managedInstance`, `mySqlServer`, `sites`. 
> For `managedInstance`, see [create a shared private link for SQL Managed Instance](#create-a-shared-private-link-for-a-sql-managed-instance) for help formulating a fully qualified domain name.

While tools like Azure portal, Azure PowerShell, or the Azure CLI have built-in mechanisms for account sign-in, a REST client like Postman needs to provide a bearer token that allows your request to go through. 

Because it's easy and quick, this section uses Azure CLI steps for getting a bearer token. For more durable approaches, see [Manage with REST](search-manage-rest.md).

1. Open a command line and run `az login` for Azure sign-in.

1. Show the active account and subscription. Verify that this subscription is the same one that has the Azure PaaS resource for which you're creating the shared private link.

   ```azurecli
   az account show
   ```

   Change the subscription if it's not the right one:

   ```azurecli
   az account set --subscription {{Azure PaaS subscription ID}}
   ```

1. Create a bearer token, and then copy the entire token (everything between the quotation marks).

   ```azurecli
   az account get-access-token
   ```

1. Switch to a REST client and set up a [GET Shared Private Link Resource](/rest/api/searchmanagement/2020-08-01/shared-private-link-resources/get). This step allows you to review existing shared private links to ensure you're not duplicating a link. There can be only one shared private link for each resource and sub-resource combination.

    ```http
    GET https://https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{rg-name}}/providers/Microsoft.Search/searchServices/{{service-name}}/sharedPrivateLinkResources?api-version={{api-version}}
    ```

1. On the **Authorization** tab, select **Bearer Token** and then paste in the token.

1. Set the content type to JSON.

1. Send the request. You should get a list of all shared private link resources that exist for your search service. Make sure there's no existing shared private link for the resource and sub-resource combination.

1. Formulate a PUT request to [Create or Update Shared Private Link](/rest/api/searchmanagement/2020-08-01/shared-private-link-resources/create-or-update) for the Azure PaaS resource. Provide a URI and request body similar to the following example:

    ```http
    PUT https://https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{rg-name}}/providers/Microsoft.Search/searchServices/{{service-name}}/sharedPrivateLinkResources/{{shared-private-link-name}}?api-version={{api-version}}
    {
        "properties":
         {
            "groupID": "blob",
            "privateLinkResourceId": "/subscriptions/{{subscriptionId}}/resourceGroups/{{rg-name}}/providers/Microsoft.Storage/storageAccounts/{{storage-account-name}}",
            "provisioningState": "",
            "requestMessage": "Please approve this request.",
            "resourceRegion": "",
            "status": ""
         }
    }
    ```

1. As before, provide the bearer token and make sure the content type is JSON. 

   If the Azure PaaS resource is in a different subscription, use the Azure CLI to change the subscription, and then get a bearer token that is valid for that subscription:

   ```azurecli
   az account set --subscription {{Azure PaaS subscription ID}}

   az account get-access-token
   ```

1. Send the request. To check the status, rerun the first GET Shared Private Link request to monitor the provisioning state as it transitions from updating to succeeded.

### [**PowerShell**](#tab/ps-create)

See [Manage with PowerShell](search-manage-powershell.md) for instructions on getting started.

First, use [Get-AzSearchSharedPrivateLinkResource](/powershell/module/az.search/get-azsearchprivatelinkresource) to review any existing shared private links to ensure you're not duplicating a link. There can be only one shared private link for each resource and sub-resource combination.

```azurepowershell
Get-AzSearchSharedPrivateLinkResource -ResourceGroupName <search-service-resource-group-name> -ServiceName <search-service-name>
```

Use [New-AzSearchSharedPrivateLinkResource](/powershell/module/az.search/new-azsearchsharedprivatelinkresource) to create a shared private link, substituting valid values for the placeholders. This example is for blob storage.

```azurepowershell
New-AzSearchSharedPrivateLinkResource -ResourceGroupName <search-service-resource-group-name> -ServiceName <search-service-name> -Name <spl-name> -PrivateLinkResourceId /subscriptions/<alphanumeric-subscription-ID>/resourceGroups/<storage-resource-group-name>/providers/Microsoft.Storage/storageAccounts/myBlobStorage -GroupId blob -RequestMessage "Please approve"
```

Rerun the first request to monitor the provisioning state as it transitions from updating to succeeded.

### [**Azure CLI**](#tab/cli-create)

See [Manage with the Azure CLI](search-manage-azure-cli.md) for instructions on getting started.

First, use [az-search-shared-private-link-resource list](/cli/azure/search/shared-private-link-resource) to review any existing shared private links to ensure you're not duplicating a link. There can be only one shared private link for each resource and sub-resource combination.

```azurecli
az search shared-private-link-resource list --service-name {{your-search-service-name}} --resource-group {{your-search-service-resource-group}}
```

Use [az-search-shared-private-link-resource create](/cli/azure/search/shared-private-link-resource?view=azure-cli-latest#az-search-shared-private-link-resource-create&preserve-view=true) for the next step. This example is for Azure Cosmos DB for NoSQL.

The syntax is case-sensitive, so make sure that the group ID is `Sql` and the provider name is `Microsoft.DocumentDB`.

```azurecli
az search shared-private-link-resource create --name {{your-shared-private-link-name}} --service-name {{your-search-service-name}} --resource-group {{your-search-service-resource-group}} --group-id Sql --resource-id "/subscriptions/{{your-subscription-ID}}/{{your-cosmos-db-resource-group}}/providers/Microsoft.DocumentDB/databaseAccounts/{{your-cosmos-db-account-name}}" 
```

Rerun the first request to monitor the provisioning state as it transitions from updating to succeeded.

---

### Shared private link creation workflow

A `202 Accepted` response is returned on success. The process of creating an outbound private endpoint is a long-running (asynchronous) operation. It involves deploying the following resources:

+ A private endpoint, allocated with a private IP address in a `"Pending"` state. The private IP address is obtained from the address space that's allocated to the virtual network of the execution environment for the search service-specific private indexer. Upon approval of the private endpoint, any communication from Azure Cognitive Search to the Azure resource originates from the private IP address and a secure private link channel.

+ A private DNS zone for the type of resource, based on the group ID. By deploying this resource, you ensure that any DNS lookup to the private resource utilizes the IP address that's associated with the private endpoint.

### Create a shared private link for a SQL Managed Instance

Currently, you can't create a shared private link for a SQL Managed Instance using the Azure portal or the `az search` module of the Azure CLI. The URI for a SQL Managed Instance includes a DNS zone as part of it's fully qualified domain name (FQDN), and currently neither the portal nor `az search` in the Azure CLI support that part. 

As a workaround, choose an approach that provides a `resourceRegion` parameter. This parameter takes the [DNS Zone](/azure/azure-sql/managed-instance/connectivity-architecture-overview#virtual-cluster-connectivity-architecture) of the SQL Managed Instance, which is inserted in the URI to create the FQDN.

Approaches that provide `resourceRegion` include the Management REST API or the Azure CLI using the `az rest` command. This section explains how to the Azure CLI with `az rest` to create a shared private link for a SQL managed instance.

1. Get the [DNS Zone](/azure/azure-sql/managed-instance/connectivity-architecture-overview#virtual-cluster-connectivity-architecture) for the `resourceRegion` parameter. 

   The DNS zone is part of the domain name of the SQL Managed Instance. For example, if the FQDN of the SQL Managed Instance is `my-sql-managed-instance.a1b22c333d44.database.windows.net`, the DNS zone is `a1b22c333d44`. See [Create an Azure SQL Managed Instance](/azure/azure-sql/managed-instance/instance-create-quickstart) for instructions on how to retrieve connection details, such as the DNS zone.

1. Create a JSON file for the body of the create shared private link request. Save the file locally. In the Azure CLI, type `dir` to view the current location. The following is an example of what a *create-pe.json* file might contain:

   ```json
   {
       "name": "{{shared-private-link-name}}",
       "properties": {
           "privateLinkResourceId": "/subscriptions/{{target-resource-subscription-ID}}/resourceGroups/{{target-resource-rg}}/providers/Microsoft.Sql/managedInstances/{{target-resource-name}}",
           "resourceRegion": "a1b22c333d44",
           "groupId": "managedInstance",
           "requestMessage": "please approve",
       }
   }
   ```

1. Using the Azure CLI, call the `az rest` command to use the [Management REST API](/rest/api/searchmanagement/2021-04-01-preview/shared-private-link-resources/create-or-update) of Azure Cognitive Search. 

   Because shared private link support for SQL managed instances is still in preview, you need a preview version of the REST API. You can use either `2021-04-01-preview` or `2020-08-01-preview`.

   ```azurecli
   az rest --method put --uri https://management.azure.com/subscriptions/{{search-service-subscription-ID}}/resourceGroups/{{search service-resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}/sharedPrivateLinkResources/{{shared-private-link-name}}?api-version=2020-08-01 --body @create-pe.json
   ```

<!-- 
1. Check the response. The `PUT` call to create the shared private endpoint returns an `Azure-AsyncOperation` header value that looks like the following:

   `"Azure-AsyncOperation": "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Search/searchServices/contoso-search/sharedPrivateLinkResources/blob-pe/operationStatuses/08586060559526078782?api-version=2020-08-01"`

   You can poll for the status by manually querying the `Azure-AsyncOperationHeader` value.

   ```azurecli
   az rest --method get --uri https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Search/searchServices/contoso-search/sharedPrivateLinkResources/blob-pe/operationStatuses/08586060559526078782?api-version=2020-08-01
   ```
 -->

## 2 - Approve the private endpoint connection

The resource owner must approve the connection request you created. This section assumes the portal for this step, but you can also use the REST APIs of the Azure PaaS resource. [Private Endpoint Connections (Storage Resource Provider)](/rest/api/storagerp/privateendpointconnections) and [Private Endpoint Connections (Cosmos DB Resource Provider)](/rest/api/cosmos-db-resource-provider/2022-05-15/private-endpoint-connections) are two examples.

1. In the Azure portal, open the **Networking** page of the Azure PaaS resource.

1. Find the section that lists the private endpoint connections. The following example is for a storage account. 

   ![Screenshot of the Azure portal, showing the "Private endpoint connections" pane.](media\search-indexer-howto-secure-access\storage-privateendpoint-approval.png)

1. Select the connection, and then select **Approve**. It can take a few minutes for the status to be updated in the portal.

   ![Screenshot of the Azure portal, showing an "Approved" status on the "Private endpoint connections" pane.](media\search-indexer-howto-secure-access\storage-privateendpoint-after-approval.png)

After the private endpoint connection request is approved, traffic is *capable* of flowing through the private endpoint. After the private endpoint is approved, Azure Cognitive Search creates the necessary DNS zone mappings in the DNS zone that's created for it.

## 3 - Check shared private link status

On the Azure Cognitive Search side, you can confirm request approval by revisiting the Shared Private Access tab of the search service **Networking** page. Connection state should be approved.

   ![Screenshot of the Azure portal, showing an "Approved" shared private link resource.](media\search-indexer-howto-secure-access\new-shared-private-link-resource-approved.png)

Alternatively, you can also obtain connection state by using the [GET Shared Private Link API](/rest/api/searchmanagement/2021-04-01-preview/shared-private-link-resources/get).

```dotnetcli
az rest --method get --uri https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Search/searchServices/contoso-search/sharedPrivateLinkResources/blob-pe?api-version=2020-08-01
```

This would return a JSON, where the connection state shows up as "status" under the "properties" section. Following is an example for a storage account.

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

If the provisioning state (`properties.provisioningState`) of the resource is "Succeeded" and connection state(`properties.status`) is "Approved", it means that the shared private link resource is functional and the indexer can be configured to communicate over the private endpoint.

## 4 - Configure the indexer to run in the private environment

[Indexer execution](search-indexer-securing-resources.md#indexer-execution-environment) occurs in either a private environment that's specific to the search service, or a multi-tenant environment that's used internally to offload expensive skillset processing for multiple customers. 

The execution environment is usually transparent, but once you start building firewall rules or establishing private connections, you have to take indexer execution into account. For a private connection, configure indexer execution to always run in the private environment. 

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

## 5 - Test the shared private link

1. If you haven't done so already, verify that your Azure PaaS resource refuses connections from the public internet. If connections are accepted, review the DNS settings in the **Networking** page of your Azure PaaS resource.

1. Choose a tool that can invoke an outbound request scenario, such as an indexer connection to a private endpoint. An easy choice is using the **Import data** wizard, but you can also try the Postman app and REST APIs for more precision. Assuming that your search service isn't also configured for a private connection, the REST client connection to Search can be over the public internet.

1. Set the connection string to the private Azure PaaS resource. The format of the connection string doesn't change for shared private link. The search service invokes the shared private link internally.

   For indexer workloads, the connection string is in the data source definition. An example of a data source might look like this:

   ```http
    {
      "name": "my-blob-ds",
      "type": "azureblob",
      "subtype": null,
      "credentials": {
        "connectionString": "DefaultEndpointsProtocol=https;AccountName=<YOUR-STORAGE-ACCOUNT>;AccountKey=..."
      }
   ```

1. For indexer workloads, remember to set the execution environment in the indexer definition. An example of an indexer definition might look like this:

   ```http
   "name": "indexer",
   "dataSourceName": "my-blob-ds",
   "targetIndexName": "my-index",
   "parameters": {
      "configuration": {
          "executionEnvironment": "private"
          }
      },
   "fieldMappings": []
   }
   ```

1. Run the indexer. If the indexer execution succeeds and the search index is populated, the shared private link is working.

## Troubleshooting

+ If your indexer creation fails with "Data source credentials are invalid," check the approval status of the shared private link before debugging the connection. If the status is `Approved`, check the `properties.provisioningState` property. If it's `Incomplete`, there might be a problem with underlying dependencies. In this case, reissue the `PUT` request to re-create the shared private link. You might also need to repeat the approval step.

+ If indexers fail consistently or intermittently, check the [`executionEnvironment` property](/rest/api/searchservice/update-indexer) on the indexer. The value should be set to `private`. If you didn't set this property, and indexer runs succeeded in the past, it's because the search service used a private environment of its own accord. A search service moves processing out of the standard environment if the system is under load.

+ If you get an error when creating a shared private link, check [service limits](search-limits-quotas-capacity.md) to verify that you're under the quota for your tier.

## Next steps

Learn more about private endpoints and other secure connection methods:

+ [Troubleshoot issues with shared private link resources](troubleshoot-shared-private-link-resources.md)
+ [What are private endpoints?](../private-link/private-endpoint-overview.md)
+ [DNS configurations needed for private endpoints](../private-link/private-endpoint-dns.md)
+ [Indexer access to content protected by Azure network security features](search-indexer-securing-resources.md)