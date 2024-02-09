---
title: PowerShell scripts using Az.Search module
titleSuffix: Azure AI Search
description: Create and configure an Azure AI Search service with PowerShell. You can scale a service up or down, manage admin and query api-keys, and query for system information.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.devlang: powershell
ms.topic: how-to
ms.date: 01/25/2023
ms.custom:
  - devx-track-azurepowershell
  - ignite-2023
---

# Manage your Azure AI Search service with PowerShell
> [!div class="op_single_selector"]
> * [Portal](search-manage.md)
> * [PowerShell](search-manage-powershell.md)
> * [Azure CLI](search-manage-azure-cli.md)
> * [REST API](search-manage-rest.md)
> * [.NET SDK](/dotnet/api/microsoft.azure.management.search)
> * [Python](https://pypi.python.org/pypi/azure-mgmt-search/0.1.0)

You can run PowerShell cmdlets and scripts on Windows, Linux, or in [Azure Cloud Shell](../cloud-shell/overview.md) to create and configure Azure AI Search. The **Az.Search** module extends [Azure PowerShell](/powershell/) with full parity to the [Search Management REST APIs](/rest/api/searchmanagement) and the ability to perform the following tasks:

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

You cannot change a server name, region, or tier programmatically or in the portal. Dedicated resources are allocated when a service is created. As such, changing the underlying hardware (location or node type) requires a new service. 

You cannot use tools or APIs to transfer content, such as an index, from one service to another. Within a service, programmatic creation of content is through [Search Service REST API](/rest/api/searchservice/) or an SDK such as [Azure SDK for .NET](/dotnet/api/overview/azure/search.documents-readme). While there are no dedicated commands for content migration, you can write script that calls REST API or a client library to create and load indexes on a new service.

Preview administration features are typically not available in the **Az.Search** module. If you want to use a preview feature, [use the Management REST API](search-manage-rest.md) and a preview API version. 

<a name="check-versions-and-load"></a>

## Check versions and load modules

The examples in this article are interactive and require elevated permissions. Local PowerShell and the Azure PowerShell (the **Az** module) are required.

### PowerShell version check

PowerShell 7.0.6 LTS, PowerShell 7.1.3, or higher is the recommended version of PowerShell for use with the Azure Az PowerShell module on all platforms. [Install the latest version of PowerShell](/powershell/scripting/install/installing-powershell) if you don't have it.

```azurepowershell-interactive
$PSVersionTable.PSVersion
```

### Load Azure PowerShell

If you aren't sure whether **Az** is installed, run the following command as a verification step. 

```azurepowershell-interactive
Get-InstalledModule -Name Az
```

Some systems do not auto-load modules. If you get an error on the previous command, try loading the module, and if that fails, go back to the installation [Azure PowerShell installation instructions](/powershell/azure/) to see if you missed a step.

```azurepowershell-interactive
Import-Module -Name Az
```

### Connect to Azure with a browser sign-in token

You can use your portal sign-in credentials to connect to a subscription in PowerShell. Alternatively you can [authenticate non-interactively with a service principal](../active-directory/develop/howto-authenticate-service-principal-powershell.md).

```azurepowershell-interactive
Connect-AzAccount
```

If you hold multiple Azure subscriptions, set your Azure subscription. To see a list of your current subscriptions, run this command.

```azurepowershell-interactive
Get-AzSubscription | sort SubscriptionName | Select SubscriptionName
```

To specify the subscription, run the following command. In the following example, the subscription name is `ContosoSubscription`.

```azurepowershell-interactive
Select-AzSubscription -SubscriptionName ContosoSubscription
```

<a name="list-search-services"></a>

## List services in a subscription

The following commands are from [**Az.Resources**](/powershell/module/az.resources), returning information about existing resources and services already provisioned in your subscription. If you don't know how many search services are already created, these commands return that information, saving you a trip to the portal.

The first command returns all search services.

```azurepowershell-interactive
Get-AzResource -ResourceType Microsoft.Search/searchServices | ft
```

From the list of services, return information about a specific resource.

```azurepowershell-interactive
Get-AzResource -ResourceName <service-name>
```

Results should look similar to the following output.

```
Name              : my-demo-searchapp
ResourceGroupName : demo-westus
ResourceType      : Microsoft.Search/searchServices
Location          : westus
ResourceId        : /subscriptions/<alphanumeric-subscription-ID>/resourceGroups/demo-westus/providers/Microsoft.Search/searchServices/my-demo-searchapp
```

## Import Az.Search

Commands from [**Az.Search**](/powershell/module/az.search) are not available until you load the module.

```azurepowershell-interactive
Install-Module -Name Az.Search -Scope CurrentUser
```

### List all Az.Search commands

As a verification step, return a list of commands provided in the module.

```azurepowershell-interactive
Get-Command -Module Az.Search
```

Results should look similar to the following output.

```
CommandType     Name                                               Version    Source                                                                
-----------     ----                                               -------    ------                                                                
Cmdlet          Get-AzSearchAdminKeyPair                           0.8.0      Az.Search                                                             
Cmdlet          Get-AzSearchPrivateEndpointConnection              0.8.0      Az.Search                                                             
Cmdlet          Get-AzSearchPrivateLinkResource                    0.8.0      Az.Search                                                             
Cmdlet          Get-AzSearchQueryKey                               0.8.0      Az.Search                                                             
Cmdlet          Get-AzSearchService                                0.8.0      Az.Search                                                             
Cmdlet          Get-AzSearchSharedPrivateLinkResource              0.8.0      Az.Search                                                             
Cmdlet          New-AzSearchAdminKey                               0.8.0      Az.Search                                                             
Cmdlet          New-AzSearchQueryKey                               0.8.0      Az.Search                                                             
Cmdlet          New-AzSearchService                                0.8.0      Az.Search                                                             
Cmdlet          New-AzSearchSharedPrivateLinkResource              0.8.0      Az.Search                                                             
Cmdlet          Remove-AzSearchPrivateEndpointConnection           0.8.0      Az.Search                                                             
Cmdlet          Remove-AzSearchQueryKey                            0.8.0      Az.Search                                                             
Cmdlet          Remove-AzSearchService                             0.8.0      Az.Search                                                             
Cmdlet          Remove-AzSearchSharedPrivateLinkResource           0.8.0      Az.Search                                                             
Cmdlet          Set-AzSearchPrivateEndpointConnection              0.8.0      Az.Search                                                             
Cmdlet          Set-AzSearchService                                0.8.0      Az.Search                                                             
Cmdlet          Set-AzSearchSharedPrivateLinkResource              0.8.0      Az.Search   
```

If you have an older version of the package, update the module to get the latest functionality.

```azurepowershell-interactive
Update-Module -Name Az.Search
```

## Get search service information

After **Az.Search** is imported and you know the resource group containing your search service, run [Get-AzSearchService](/powershell/module/az.search/get-azsearchservice) to return the service definition, including name, region, tier, and replica and partition counts. For this command, provide the resource group that contains the search service.

```azurepowershell-interactive
Get-AzSearchService -ResourceGroupName <resource-group-name>
```

Results should look similar to the following output.

```
Name              : my-demo-searchapp
ResourceGroupName : demo-westus
ResourceType      : Microsoft.Search/searchServices
Location          : West US
Sku               : Standard
ReplicaCount      : 1
PartitionCount    : 1
HostingMode       : Default
ResourceId        : /subscriptions/<alphanumeric-subscription-ID>/resourceGroups/demo-westus/providers/Microsoft.Search/searchServices/my-demo-searchapp
```

## Create or delete a service

[**New-AzSearchService**](/powershell/module/az.search/new-azsearchservice) is used to [create a new search service](search-create-service-portal.md).

```azurepowershell-interactive
New-AzSearchService -ResourceGroupName <resource-group-name> -Name <search-service-name> -Sku "Standard" -Location "West US" -PartitionCount 3 -ReplicaCount 3 -HostingMode Default
``` 

Results should look similar to the following output.

```azurepowershell
ResourceGroupName : demo-westus
Name              : my-demo-searchapp
Id                : /subscriptions/<alphanumeric-subscription-ID>/demo-westus/providers/Microsoft.Search/searchServices/my-demo-searchapp
Location          : West US
Sku               : Standard
ReplicaCount      : 3
PartitionCount    : 3
HostingMode       : Default
Tags
```     

[**Remove-AzSearchService**](/powershell/module/az.search/remove-azsearchservice) is used to delete a service and its data.

```azurepowershell-interactive
Remove-AzSearchService -ResourceGroupName <resource-group-name> -Name <search-service-name>
``` 

You'll be asked to confirm the action.

```azurepowershell
Confirm
Are you sure you want to remove Search Service 'pstestazuresearch01'?
[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): y
```


### Create a service with IP rules

Depending on your security requirements, you may want to create a search service with an [IP firewall configured](service-configure-firewall.md). To do so, first define the IP Rules and then pass them to the `IPRuleList` parameter as shown below.

```azurepowershell-interactive
$ipRules = @([pscustomobject]@{Value="55.5.63.73"},
		[pscustomobject]@{Value="52.228.215.197"},
		[pscustomobject]@{Value="101.37.221.205"})

 New-AzSearchService -ResourceGroupName <resource-group-name> `
                      -Name <search-service-name> `
                      -Sku Standard `
                      -Location "West US" `
                      -PartitionCount 3 -ReplicaCount 3 `
                      -HostingMode Default `
                      -IPRuleList $ipRules
```

### Create a service with a system assigned managed identity

In some cases, such as when [using managed identity to connect to a data source](search-howto-managed-identities-storage.md), you will need to turn on [system assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md). This is done by adding `-IdentityType SystemAssigned` to the command.

```azurepowershell-interactive
New-AzSearchService -ResourceGroupName <resource-group-name> `
                      -Name <search-service-name> `
                      -Sku Standard `
                      -Location "West US" `
                      -PartitionCount 3 -ReplicaCount 3 `
                      -HostingMode Default `
                      -IdentityType SystemAssigned
```

### Create an S3HD service

To create an [S3HD](./search-sku-tier.md#tier-descriptions) service, a combination of `-Sku` and `-HostingMode` is used. Set `-Sku` to `Standard3` and `-HostingMode` to `HighDensity`.

```azurepowershell-interactive
New-AzSearchService -ResourceGroupName <resource-group-name> `
                      -Name <search-service-name> `
                      -Sku Standard3 `
                      -Location "West US" `
                      -PartitionCount 1 -ReplicaCount 3 `
                      -HostingMode HighDensity
```

## Create a service with a private endpoint

[Private Endpoints](../private-link/private-endpoint-overview.md) for Azure AI Search allow a client on a virtual network to securely access data in a search index over a [Private Link](../private-link/private-link-overview.md). The private endpoint uses an IP address from the [virtual network address space](../virtual-network/ip-services/private-ip-addresses.md) for your search service. Network traffic between the client and the search service traverses over the virtual network and a private link on the Microsoft backbone network, eliminating exposure from the public internet. For more details, see 
[Creating a private endpoint for Azure AI Search](service-create-private-endpoint.md)

The following example shows how to create a search service with a private endpoint. 

First, deploy a search service with `PublicNetworkAccess` set to `Disabled`.

```azurepowershell-interactive
$searchService = New-AzSearchService `
    -ResourceGroupName <search-service-resource-group-name> `
    -Name <search-service-name> `
    -Sku Standard `
    -Location "West US" `
    -PartitionCount 1 -ReplicaCount 1 `
    -HostingMode Default `
    -PublicNetworkAccess Disabled
```

Next, create a virtual network, private network connection, and the private endpoint.

```azurepowershell-interactive
# Create the subnet
$subnetConfig = New-AzVirtualNetworkSubnetConfig `
    -Name <subnet-name> `
    -AddressPrefix 10.1.0.0/24 `
    -PrivateEndpointNetworkPolicies Disabled 

# Create the virtual network
$virtualNetwork = New-AzVirtualNetwork `
    -ResourceGroupName <vm-resource-group-name> `
    -Location "West US" `
    -Name <virtual-network-name> `
    -AddressPrefix 10.1.0.0/16 `
    -Subnet $subnetConfig

# Create the private network connection
$privateLinkConnection = New-AzPrivateLinkServiceConnection `
    -Name <private-link-name> `
    -PrivateLinkServiceId $searchService.Id `
    -GroupId searchService

# Create the private endpoint
$privateEndpoint = New-AzPrivateEndpoint `
    -Name <private-endpoint-name> `
    -ResourceGroupName <private-endpoint-resource-group-name> `
    -Location "West US" `
    -Subnet $virtualNetwork.subnets[0] `
    -PrivateLinkServiceConnection $privateLinkConnection
```

Finally, create a private DNS Zone. 

```azurepowershell-interactive
## Create private dns zone
$zone = New-AzPrivateDnsZone `
    -ResourceGroupName <private-dns-resource-group-name> `
    -Name "privatelink.search.windows.net"

## Create dns network link
$link = New-AzPrivateDnsVirtualNetworkLink `
    -ResourceGroupName <private-dns-link-resource-group-name> `
    -ZoneName "privatelink.search.windows.net" `
    -Name "myLink" `
    -VirtualNetworkId $virtualNetwork.Id

## Create DNS configuration 
$config = New-AzPrivateDnsZoneConfig `
    -Name "privatelink.search.windows.net" `
    -PrivateDnsZoneId $zone.ResourceId

## Create DNS zone group
New-AzPrivateDnsZoneGroup `
    -ResourceGroupName <private-dns-zone-resource-group-name> `
    -PrivateEndpointName <private-endpoint-name> `
    -Name 'myZoneGroup' `
    -PrivateDnsZoneConfig $config
```

For more details on creating private endpoints in PowerShell, see this [Private Link Quickstart](../private-link/create-private-endpoint-powershell.md)

### Manage private endpoint connections

In addition to creating a private endpoint connection, you can also `Get`, `Set`, and `Remove` the connection.

[Get-AzSearchPrivateEndpointConnection](/powershell/module/az.search/Get-AzSearchPrivateEndpointConnection) is used to retrieve a private endpoint connection and to see its status.

```azurepowershell-interactive
Get-AzSearchPrivateEndpointConnection -ResourceGroupName <search-service-resource-group-name> -ServiceName <search-service-name>
```

[Set-AzSearchPrivateEndpointConnection](/powershell/module/az.search/Set-AzSearchPrivateEndpointConnection) is used to update the connection. The following example sets a private endpoint connection to rejected:

```azurepowershell-interactive
Set-AzSearchPrivateEndpointConnection -ResourceGroupName <search-service-resource-group-name> -ServiceName <search-service-name> -Name <pe-connection-name> -Status Rejected  -Description "Rejected"
```

[Remove-AzSearchPrivateEndpointConnection](/powershell/module/az.search/Remove-AzSearchPrivateEndpointConnection) is used to delete the private endpoint connection.

```azurepowershell-interactive
 Remove-AzSearchPrivateEndpointConnection -ResourceGroupName <search-service-resource-group-name> -ServiceName <search-service-name> -Name <pe-connection-name>
```

## Regenerate admin keys

[**New-AzSearchAdminKey**](/powershell/module/az.search/new-azsearchadminkey) is used to roll over admin [API keys](search-security-api-keys.md). Two admin keys are created with each service for authenticated access. Keys are required on every request. Both admin keys are functionally equivalent, granting full write access to a search service with the ability to retrieve any information, or create and delete any object. Two keys exist so that you can use one while replacing the other. 

You can only regenerate one at a time, specified as either the `primary` or `secondary` key. For uninterrupted service, remember to update all client code to use a secondary key while rolling over the primary key. Avoid changing the keys while operations are in flight.

As you might expect, if you regenerate keys without updating client code, requests using the old key will fail. Regenerating all new keys does not permanently lock you out of your service, and you can still access the service through the portal. After you regenerate primary and secondary keys, you can update client code to use the new keys and operations will resume accordingly.

Values for the API keys are generated by the service. You cannot provide a custom key for Azure AI Search to use. Similarly, there is no user-defined name for admin API-keys. References to the key are fixed strings, either `primary` or `secondary`. 

```azurepowershell-interactive
New-AzSearchAdminKey -ResourceGroupName <search-service-resource-group-name> -ServiceName <search-service-name> -KeyKind Primary
```

Results should look similar to the following output. Both keys are returned even though you only change one at a time.

```
Primary                    Secondary
-------                    ---------
<alphanumeric-guid>        <alphanumeric-guid>  
```

## Create or delete query keys

[**New-AzSearchQueryKey**](/powershell/module/az.search/new-azsearchquerykey) is used to create query [API keys](search-security-api-keys.md) for read-only access from client apps to an Azure AI Search index. Query keys are used to authenticate to a specific index for the purpose of retrieving search results. Query keys do not grant read-only access to other items on the service, such as an index, data source, or indexer.

You cannot provide a key for Azure AI Search to use. API keys are generated by the service.

```azurepowershell-interactive
New-AzSearchQueryKey -ResourceGroupName <search-service-resource-group-name> -ServiceName <search-service-name> -Name <query-key-name> 
```

## Scale replicas and partitions

[**Set-AzSearchService**](/powershell/module/az.search/set-azsearchservice) is used to [increase or decrease replicas and partitions](search-capacity-planning.md) to readjust billable resources within your service. Increasing replicas or partitions adds to your bill, which has both fixed and variable charges. If you have a temporary need for additional processing power, you can increase replicas and partitions to handle the workload. The monitoring area in the Overview portal page has tiles on query latency, queries per second, and throttling, indicating whether current capacity is adequate.

It can take a while to add or remove resourcing. Adjustments to capacity occur in the background, allowing existing workloads to continue. Additional capacity is used for incoming requests as soon as it's ready, with no additional configuration required. 

Removing capacity can be disruptive. Stopping all indexing and indexer jobs prior to reducing capacity is recommended to avoid dropped requests. If that isn't feasible, you might consider reducing capacity incrementally, one replica and partition at a time, until your new target levels are reached.

Once you submit the command, there is no way to terminate it midway through. You will have to wait until the command is finished before revising the counts.

```azurepowershell-interactive
Set-AzSearchService -ResourceGroupName <search-service-resource-group-name> -Name <search-service-name> -PartitionCount 6 -ReplicaCount 6
```

Results should look similar to the following output.

```
ResourceGroupName : demo-westus
Name              : my-demo-searchapp
Location          : West US
Sku               : Standard
ReplicaCount      : 6
PartitionCount    : 6
HostingMode       : Default
Id                : /subscriptions/65a1016d-0f67-45d2-b838-b8f373d6d52e/resourceGroups/demo-westus/providers/Microsoft.Search/searchServices/my-demo-searchapp
```

## Create a shared private link resource

Private endpoints of secured resources that are created through Azure AI Search APIs are referred to as *shared private link resources*. This is because you're "sharing" access to a resource, such as a storage account, that has been integrated with the [Azure Private Link service](https://azure.microsoft.com/services/private-link/).

If you're using an indexer to index data in Azure AI Search, and your data source is on a private network, you can create an outbound [private endpoint connection](../private-link/private-endpoint-overview.md) to reach the data.

A full list of the Azure Resources for which you can create outbound private endpoints from Azure AI Search can be found [here](search-indexer-howto-access-private.md#group-ids) along with the related **Group ID** values.

[New-AzSearchSharedPrivateLinkResource](/powershell/module/az.search/New-AzSearchSharedPrivateLinkResource) is used to create the shared private link resource. Keep in mind that some configuration may be required for the data source before running this command.

```azurepowershell-interactive
New-AzSearchSharedPrivateLinkResource -ResourceGroupName <search-serviceresource-group-name> -ServiceName <search-service-name> -Name <spl-name> -PrivateLinkResourceId /subscriptions/<alphanumeric-subscription-ID>/resourceGroups/<storage-resource-group-name>/providers/Microsoft.Storage/storageAccounts/myBlobStorage -GroupId <group-id> -RequestMessage "Please approve" 
```

[Get-AzSearchSharedPrivateLinkResource](/powershell/module/az.search/Get-AzSearchSharedPrivateLinkResource)
allows you to retrieve the shared private link resources and view their status.

```azurepowershell-interactive
Get-AzSearchSharedPrivateLinkResource -ResourceGroupName <search-service-resource-group-name> -ServiceName <search-service-name> -Name <spl-name>
```

You'll need to approve the connection with the following command before it can be used.

```azurepowershell-interactive
Approve-AzPrivateEndpointConnection `
    -Name <spl-name> `
    -ServiceName <search-service-name> `
    -ResourceGroupName <search-service-resource-group-name> `
    -Description = "Approved"
```

[Remove-AzSearchSharedPrivateLinkResource](/powershell/module/az.search/Remove-AzSearchSharedPrivateLinkResource) is used to delete the shared private link resource.

```azurepowershell-interactive
$job = Remove-AzSearchSharedPrivateLinkResource -ResourceGroupName <search-service-resource-group-name> -ServiceName <search-service-name> -Name <spl-name> -Force -AsJob

$job | Get-Job
```

For full details on setting up shared private link resources, see the documentation on [making indexer connections through a private endpoint](search-indexer-howto-access-private.md).

## Next steps

Build an [index](search-what-is-an-index.md), [query an index](search-query-overview.md) using the portal, REST APIs, or the .NET SDK.

* [Create an Azure AI Search index in the Azure portal](search-get-started-portal.md)
* [Set up an indexer to load data from other services](search-indexer-overview.md)
* [Query an Azure AI Search index using Search explorer in the Azure portal](search-explorer.md)
* [How to use Azure AI Search in .NET](search-howto-dotnet-sdk.md)
