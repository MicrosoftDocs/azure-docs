---
title: Azure CLI scripts using the az search module
titleSuffix: Azure AI Search
description: Create and configure an Azure AI Search service with the Azure CLI. You can scale a service up or down, manage admin and query api-keys, and query for system information.

author: mattgotteiner
ms.author: magottei
ms.service: cognitive-search
ms.devlang: azurecli
ms.custom:
  - devx-track-azurecli
  - ignite-2023
ms.topic: how-to
ms.date: 02/21/2024
---

# Manage your Azure AI Search service with the Azure CLI
> [!div class="op_single_selector"]
> * [Portal](search-manage.md)
> * [PowerShell](search-manage-powershell.md)
> * [Azure CLI](search-manage-azure-cli.md)
> * [REST API](search-manage-rest.md)

You can run Azure CLI commands and scripts on Windows, macOS, Linux, or in [Azure Cloud Shell](../cloud-shell/overview.md) to create and configure Azure AI Search. The [**az search**](/cli/azure/search) module extends the [Azure CLI](/cli/) with full parity to the [Search Management REST APIs](/rest/api/searchmanagement) and the ability to perform the following tasks:

> [!div class="checklist"]
> * [List search services in a subscription](#list-search-services)
> * [Return service information](#get-search-service-information)
> * [Create or delete a service](#create-or-delete-a-service)
> * [Create a service with a private endpoint](#create-a-service-with-a-private-endpoint)
> * [Regenerate admin API-keys](#regenerate-admin-keys)
> * [Create or delete query api-keys](#create-or-delete-query-keys)
> * [Scale up or down with replicas and partitions](#scale-replicas-and-partitions)
> * [Create a shared private link resource](#create-a-shared-private-link-resource)

Occasionally, questions are asked about tasks *not* on the above list.

You can't change a server name, region, or tier programmatically or in the portal. Dedicated resources are allocated when a service is created. As such, changing the underlying hardware (location or node type) requires a new service. 

You can't use tools or APIs to transfer content, such as an index, from one service to another. Within a service, programmatic creation of content is through [Search Service REST API](/rest/api/searchservice/) or an SDK such as [Azure SDK for .NET](/dotnet/api/overview/azure/search.documents-readme). While there are no dedicated commands for content migration, you can write script that calls REST API or a client library to create and load indexes on a new service.

Preview administration features are typically not available in the **az search** module. If you want to use a preview feature, [use the Management REST API](search-manage-rest.md) and a preview API version.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

Azure CLI versions are [listed on GitHub](https://github.com/Azure/azure-cli/releases).

<a name="list-search-services"></a>

## List services in a subscription

The following commands are from [**az resource**](/cli/azure/resource), returning information about existing resources and services already provisioned in your subscription. If you don't know how many search services are already created, these commands return that information, saving you a trip to the portal.

The first command returns all search services.

```azurecli-interactive
az resource list --resource-type Microsoft.Search/searchServices --output table
```

From the list of services, return information about a specific resource.

```azurecli-interactive
az resource list --name <search-service-name>
```

## List all az search commands

You can view information on the subgroups and commands available in [**az search**](/cli/azure/search) from within the CLI. Alternatively, you can review the [documentation](/cli/azure/search).

To view the subgroups available within `az search`, run the following command.

```azurecli-interactive
az search --help
```

The response should look similar to the following output.

```bash
Group
    az search : Manage Azure Search services, admin keys and query keys.
        WARNING: This command group is in preview and under development. Reference and support
        levels: https://aka.ms/CLI_refstatus
Subgroups:
    admin-key                    : Manage Azure Search admin keys.
    private-endpoint-connection  : Manage Azure Search private endpoint connections.
    private-link-resource        : Manage Azure Search private link resources.
    query-key                    : Manage Azure Search query keys.
    service                      : Manage Azure Search services.
    shared-private-link-resource : Manage Azure Search shared private link resources.

For more specific examples, use: az find "az search"
```

Within each subgroup, multiple commands are available. You can see the available commands for the `service` subgroup by running the following line.

```azurecli-interactive
az search service --help
```

You can also see the arguments available for a particular command.

```azurecli-interactive
az search service create --help
```

## Get search service information

If you know the resource group containing your search service, run [**az search service show**](/cli/azure/search/service#az-search-service-show) to return the service definition, including name, region, tier, and replica and partition counts. For this command, provide the resource group that contains the search service.

```azurecli-interactive
az search service show --name <service-name> --resource-group <search-service-resource-group-name>
```

## Create or delete a service

To [create a new search service](search-create-service-portal.md), use the [**az search service create**](/cli/azure/search/service#az-search-service-create) command.

```azurecli-interactive
az search service create \
    --name <service-name> \
    --resource-group <search-service-resource-group-name> \
    --sku Standard \
    --partition-count 1 \
    --replica-count 1
``` 

Results should look similar to the following output:

```
{
  "hostingMode": "default",
  "id": "/subscriptions/<alphanumeric-subscription-ID>/resourceGroups/demo-westus/providers/Microsoft.Search/searchServices/my-demo-searchapp",
  "identity": null,
  "location": "West US",
  "name": "my-demo-searchapp",
  "networkRuleSet": {
    "bypass": "None",
    "ipRules": []
  },
  "partitionCount": 1,
  "privateEndpointConnections": [],
  "provisioningState": "succeeded",
  "publicNetworkAccess": "Enabled",
  "replicaCount": 1,
  "resourceGroup": "demo-westus",
  "sharedPrivateLinkResources": [],
  "sku": {
    "name": "standard"
  },
  "status": "running",
  "statusDetails": "",
  "tags": null,
  "type": "Microsoft.Search/searchServices"
}
```

[**az search service delete**](/cli/azure/search/service#az-search-service-delete-required-parameters) removes the service and its data.

```azurecli-interactive
az search service delete --name <service-name> \
                         --resource-group  <search-service-resource-group-name> \
```

### Create a service with IP rules

Depending on your security requirements, you might want to create a search service with an [IP firewall configured](service-configure-firewall.md). To do so, pass the Public IP (v4) addresses or CIDR ranges to the `ip-rules` argument as shown below. Rules should be separated by a comma (`,`) or semicolon (`;`).

```azurecli-interactive
az search service create \
    --name <search-service-name> \
    --resource-group <search-service-resource-group-name> \
    --sku Standard \
    --partition-count 1 \
    --replica-count 1 \
    --ip-rules "55.5.63.73;52.228.215.197;101.37.221.205"
```

### Create a service with a system assigned managed identity

In some cases, such as when [using managed identity to connect to a data source](search-howto-managed-identities-storage.md), you need to turn on [system assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md). This is done by adding `--identity-type SystemAssigned` to the command.

```azurecli-interactive
az search service create \
    --name <search-service-name> \
    --resource-group <search-service-resource-group-name> \
    --sku Standard \
    --partition-count 1 \
    --replica-count 1 \
    --identity-type SystemAssigned
```

## Create a service with a private endpoint

[Private Endpoints](../private-link/private-endpoint-overview.md) for Azure AI Search allow a client on a virtual network to securely access data in a search index over a [Private Link](../private-link/private-link-overview.md). The private endpoint uses an IP address from the [virtual network address space](../virtual-network/ip-services/private-ip-addresses.md) for your search service. Network traffic between the client and the search service traverses over the virtual network and a private link on the Microsoft backbone network, eliminating exposure from the public internet. For more information, please refer to the documentation on 
[creating a private endpoint for Azure AI Search](service-create-private-endpoint.md).

The following example shows how to create a search service with a private endpoint.

First, deploy a search service with `PublicNetworkAccess` set to `Disabled`.

```azurecli-interactive
az search service create \
    --name <search-service-name> \
    --resource-group <search-service-resource-group-name> \
    --sku Standard \
    --partition-count 1 \
    --replica-count 1 \
    --public-access Disabled
```

Next, create a virtual network and the private endpoint.

```azurecli-interactive
# Create the virtual network
az network vnet create \
    --resource-group <vnet-resource-group-name> \
    --location "West US" \
    --name <virtual-network-name> \
    --address-prefixes 10.1.0.0/16 \
    --subnet-name <subnet-name> \
    --subnet-prefixes 10.1.0.0/24

# Update the subnet to disable private endpoint network policies
az network vnet subnet update \
    --name <subnet-name> \
    --resource-group <vnet-resource-group-name> \
    --vnet-name <virtual-network-name> \
    --disable-private-endpoint-network-policies true

# Get the id of the search service
id=$(az search service show \
    --resource-group <search-service-resource-group-name> \
    --name <search-service-name> \
    --query [id] \
    --output tsv)

# Create the private endpoint
az network private-endpoint create \
    --name <private-endpoint-name> \
    --resource-group <private-endpoint-resource-group-name> \
    --vnet-name <virtual-network-name> \
    --subnet <subnet-name> \
    --private-connection-resource-id $id \
    --group-id searchService \
    --connection-name <private-link-connection-name>  
```

Finally, create a private DNS Zone. 

```azurecli-interactive
## Create private DNS zone
az network private-dns zone create \
    --resource-group <private-dns-resource-group-name> \
    --name "privatelink.search.windows.net"

## Create DNS network link
az network private-dns link vnet create \
    --resource-group <private-dns-resource-group-name> \
    --zone-name "privatelink.search.windows.net" \
    --name "myLink" \
    --virtual-network <virtual-network-name> \
    --registration-enabled false

## Create DNS zone group
az network private-endpoint dns-zone-group create \
   --resource-group <private-endpoint-resource-group-name>\
   --endpoint-name <private-endpoint-name> \
   --name "myZoneGroup" \
   --private-dns-zone "privatelink.search.windows.net" \
   --zone-name "searchServiceZone"
```

For more information on creating private endpoints in Azure CLI, see this [Private Link Quickstart](../private-link/create-private-endpoint-cli.md).

### Manage private endpoint connections

In addition to creating a private endpoint connection, you can also `show`, `update`, and `delete` the connection.

To retrieve a private endpoint connection and to see its status, use [**az search private-endpoint-connection show**](/cli/azure/search/private-endpoint-connection#az-search-private-endpoint-connection-show).

```azurecli-interactive
az search private-endpoint-connection show \
    --name <pe-connection-name> \
    --service-name <search-service-name> \
    --resource-group <search-service-resource-group-name> 
```

To update the connection, use [**az search private-endpoint-connection update**](/cli/azure/search/private-endpoint-connection#az-search-private-endpoint-connection-update). The following example sets a private endpoint connection to rejected:

```azurecli-interactive
az search private-endpoint-connection update \
    --name <pe-connection-name> \
    --service-name <search-service-name> \
    --resource-group <search-service-resource-group-name> 
    --status Rejected \
    --description "Rejected" \
    --actions-required "Please fix XYZ"
```

To delete the private endpoint connection, use [**az search private-endpoint-connection delete**](/cli/azure/search/private-endpoint-connection#az-search-private-endpoint-connection-delete).

```azurecli-interactive
az search private-endpoint-connection delete \
    --name <pe-connection-name> \
    --service-name <search-service-name> \
    --resource-group <search-service-resource-group-name> 
```

## Regenerate admin keys

To roll over admin [API keys](search-security-api-keys.md), use [**az search admin-key renew**](/cli/azure/search/admin-key#az-search-admin-key-renew). Two admin keys are created with each service for authenticated access. Keys are required on every request. Both admin keys are functionally equivalent, granting full write access to a search service with the ability to retrieve any information, or create and delete any object. Two keys exist so that you can use one while replacing the other. 

You can only regenerate one at a time, specified as either the `primary` or `secondary` key. For uninterrupted service, remember to update all client code to use a secondary key while rolling over the primary key. Avoid changing the keys while operations are in flight.

As you might expect, if you regenerate keys without updating client code, requests using the old key will fail. Regenerating all new keys doesn't permanently lock you out of your service, and you can still access the service through the portal. After you regenerate primary and secondary keys, you can update client code to use the new keys and operations will resume accordingly.

Values for the API keys are generated by the service. You can't provide a custom key for Azure AI Search to use. Similarly, there's no user-defined name for admin API-keys. References to the key are fixed strings, either `primary` or `secondary`. 

```azurecli-interactive
az search admin-key renew \
    --resource-group <search-service-resource-group-name> \
    --service-name <search-service-name> \
    --key-kind primary
```

Results should look similar to the following output. Both keys are returned even though you only change one at a time.

```   
{
  "primaryKey": <alphanumeric-guid>,
  "secondaryKey": <alphanumeric-guid>  
}
```

## Create or delete query keys

To create query [API keys](search-security-api-keys.md) for read-only access from client apps to an Azure AI Search index, use [**az search query-key create**](/cli/azure/search/query-key#az-search-query-key-create). Query keys are used to authenticate to a specific index for retrieving search results. Query keys don't grant read-only access to other items on the service, such as an index, data source, or indexer.

You can't provide a key for Azure AI Search to use. API keys are generated by the service.

```azurecli-interactive
az search query-key create \
    --name myQueryKey \
    --resource-group <search-service-resource-group-name> \
    --service-name <search-service-name>
```

## Scale replicas and partitions

To [increase or decrease replicas and partitions](search-capacity-planning.md) use [**az search service update**](/cli/azure/search/service#az-search-service-update). Increasing replicas or partitions adds to your bill, which has both fixed and variable charges. If you have a temporary need for more processing power, you can increase replicas and partitions to handle the workload. The monitoring area in the Overview portal page has tiles on query latency, queries per second, and throttling, indicating whether current capacity is adequate.

It can take a while to add or remove resourcing. Adjustments to capacity occur in the background, allowing existing workloads to continue. Extra capacity is used for incoming requests as soon as it's ready, with no extra configuration required. 

Removing capacity can be disruptive. Stopping all indexing and indexer jobs prior to reducing capacity is recommended to avoid dropped requests. If that isn't feasible, you might consider reducing capacity incrementally, one replica and partition at a time, until your new target levels are reached.

Once you submit the command, there's no way to terminate it midway through. You have to wait until the command is finished before revising the counts.

```azurecli-interactive
az search service update \
    --name <search-service-name> \
    --resource-group <search-service-resource-group-name> \
    --partition-count 6 \
    --replica-count 6
```

In addition to updating replica and partition counts, you can also update `ip-rules`, `public-access`, and `identity-type`.

## Create a shared private link resource

Private endpoints of secured resources that are created through Azure AI Search APIs are referred to as *shared private link resources*. This is because you're "sharing" access to a resource, such as a storage account that has been integrated with the [Azure Private Link service](https://azure.microsoft.com/services/private-link/).

If you're using an indexer to index data in Azure AI Search, and your data source is on a private network, you can create an outbound [private endpoint connection](../private-link/private-endpoint-overview.md) to reach the data.

A full list of the Azure Resources for which you can create outbound private endpoints from Azure AI Search can be found [here](search-indexer-howto-access-private.md#group-ids) along with the related **Group ID** values.

To create the shared private link resource, use [**az search shared-private-link-resource create**](/cli/azure/search/shared-private-link-resource#az-search-shared-private-link-resource-list). Keep in mind that some configuration might be required for the data source before running this command.

```azurecli-interactive
az search shared-private-link-resource create \
    --name <spl-name> \
    --service-name <search-service-name> \
    --resource-group <search-service-resource-group-name> \
    --group-id blob \
    --resource-id "/subscriptions/<alphanumeric-subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/myBlobStorage"  \
    --request-message "Please approve" 
```


To retrieve the shared private link resources and view their status, use [**az search shared-private-link-resource list**](/cli/azure/search/shared-private-link-resource#az-search-shared-private-link-resource-list).

```azurecli-interactive
az search shared-private-link-resource list \
    --service-name <search-service-name> \
    --resource-group <search-service-resource-group-name> 
```

You need to approve the connection with the following command before it can be used. The ID of the private endpoint connection must be retrieved from the child resource. In this case, we get the connection ID from az storage.

```azurecli-interactive
id = (az storage account show -n myBlobStorage --query "privateEndpointConnections[0].id")

az network private-endpoint-connection approve --id $id
```

To delete the shared private link resource, use [**az search shared-private-link-resource delete**](/cli/azure/search/shared-private-link-resource#az-search-shared-private-link-resource-delete).

```azurecli-interactive
az search shared-private-link-resource delete \
    --name <spl-name> \
    --service-name <search-service-name> \
    --resource-group <search-service-resource-group-name> 
```

For more information on setting up shared private link resources, see [making indexer connections through a private endpoint](search-indexer-howto-access-private.md).

## Next steps

Build an [index](search-what-is-an-index.md), [query an index](search-query-overview.md) using the portal, REST APIs, or the .NET SDK.

* [Create an Azure AI Search index in the Azure portal](search-get-started-portal.md)
* [Set up an indexer to load data from other services](search-indexer-overview.md)
* [Query an Azure AI Search index using Search explorer in the Azure portal](search-explorer.md)
* [How to use Azure AI Search in .NET](search-howto-dotnet-sdk.md)
