---
title: PowerShell scripts using Az.Search module
titleSuffix: Azure Cognitive Search
description: Create and configure an Azure Cognitive Search service with PowerShell. You can scale a service up or down, manage admin and query api-keys, and query for system information.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.devlang: powershell
ms.topic: conceptual
ms.date: 02/11/2020
---

# Manage your Azure Cognitive Search service with PowerShell
> [!div class="op_single_selector"]
> * [Portal](search-manage.md)
> * [PowerShell](search-manage-powershell.md)
> * [REST API](https://docs.microsoft.com/rest/api/searchmanagement/)
> * [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.search)
> * [Python](https://pypi.python.org/pypi/azure-mgmt-search/0.1.0)> 

You can run PowerShell cmdlets and scripts on Windows, Linux, or in [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview) to create and configure Azure Cognitive Search. The **Az.Search** module extends [Azure PowerShell](https://docs.microsoft.com/powershell/) with full parity to the [Search Management REST APIs](https://docs.microsoft.com/rest/api/searchmanagement) and the ability to perform the following tasks:

> [!div class="checklist"]
> * [List search services in a subscription](#list-search-services)
> * [Return service information](#get-search-service-information)
> * [Create or delete a service](#create-or-delete-a-service)
> * [Regenerate admin API-keys](#regenerate-admin-keys)
> * [Create or delete query api-keys](#create-or-delete-query-keys)
> * [Scale up or down with replicas and partitions](#scale-replicas-and-partitions)

Occasionally, questions are asked about tasks *not* on the above list. Currently, you cannot use either the **Az.Search** module or the management REST API to change a server name, region, or tier. Dedicated resources are allocated when a service is created. As such, changing the underlying hardware (location or node type) requires a new service. Similarly, there are no tools or APIs for transferring content, such as an index, from one service to another.

Within a service, content creation and management is through [Search Service REST API](https://docs.microsoft.com/rest/api/searchservice/) or [.NET SDK](https://docs.microsoft.com/dotnet/api/?term=microsoft.azure.search). While there are no dedicated PowerShell commands for content, you can write PowerShell script that calls REST or .NET APIs to create and load indexes.

<a name="check-versions-and-load"></a>

## Check versions and load modules

The examples in this article are interactive and require elevated permissions. Azure PowerShell (the **Az** module) must be installed. For more information, see [Install Azure PowerShell](/powershell/azure/overview).

### PowerShell version check (5.1 or later)

Local PowerShell must be 5.1 or later, on any supported operating system.

```azurepowershell-interactive
$PSVersionTable.PSVersion
```

### Load Azure PowerShell

If you aren't sure whether **Az** is installed, run the following command as a verification step. 

```azurepowershell-interactive
Get-InstalledModule -Name Az
```

Some systems do not auto-load modules. If you get an error on the previous command, try loading the module, and if that fails, go back to the installation instructions to see if you missed a step.

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

The following commands are from [**Az.Resources**](https://docs.microsoft.com/powershell/module/az.resources/?view=azps-1.4.0#resources), returning information about existing resources and services already provisioned in your subscription. If you don't know how many search services are already created, these commands return that information, saving you a trip to the portal.

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
ResourceId        : /subscriptions/<alpha-numeric-subscription-ID>/resourceGroups/demo-westus/providers/Microsoft.Search/searchServices/my-demo-searchapp
```

## Import Az.Search

Commands from [**Az.Search**](https://docs.microsoft.com/powershell/module/az.search/?view=azps-1.4.0#search) are not available until you load the module.

```azurepowershell-interactive
Install-Module -Name Az.Search
```

### List all Az.Search commands

As a verification step, return a list of commands provided in the module.

```azurepowershell-interactive
Get-Command -Module Az.Search
```

Results should look similar to the following output.

```
CommandType     Name                                Version    Source
-----------     ----                                -------    ------
Cmdlet          Get-AzSearchAdminKeyPair            0.7.1      Az.Search
Cmdlet          Get-AzSearchQueryKey                0.7.1      Az.Search
Cmdlet          Get-AzSearchService                 0.7.1      Az.Search
Cmdlet          New-AzSearchAdminKey                0.7.1      Az.Search
Cmdlet          New-AzSearchQueryKey                0.7.1      Az.Search
Cmdlet          New-AzSearchService                 0.7.1      Az.Search
Cmdlet          Remove-AzSearchQueryKey             0.7.1      Az.Search
Cmdlet          Remove-AzSearchService              0.7.1      Az.Search
Cmdlet          Set-AzSearchService                 0.7.1      Az.Search
```

## Get search service information

After **Az.Search** is imported and you know the resource group containing your search service, run [Get-AzSearchService](https://docs.microsoft.com/powershell/module/az.search/get-azsearchservice?view=azps-1.4.0) to return the service definition, including name, region, tier, and replica and partition counts.

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

[**New-AzSearchService**](https://docs.microsoft.com/powershell/module/az.search/new-azsearchadminkey?view=azps-1.4.0) is used to [create a new search service](search-create-service-portal.md).

```azurepowershell-interactive
New-AzSearchService -ResourceGroupName "demo-westus" -Name "my-demo-searchapp" -Sku "Standard" -Location "West US" -PartitionCount 3 -ReplicaCount 3
``` 
Results should look similar to the following output.

```
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

## Regenerate admin keys

[**New-AzSearchAdminKey**](https://docs.microsoft.com/powershell/module/az.search/new-azsearchadminkey?view=azps-1.4.0) is used to roll over admin [API keys](search-security-api-keys.md). Two admin keys are created with each service for authenticated access. Keys are required on every request. Both admin keys are functionally equivalent, granting full write access to a search service with the ability to retrieve any information, or create and delete any object. Two keys exist so that you can use one while replacing the other. 

You can only regenerate one at a time, specified as either the `primary` or `secondary` key. For uninterrupted service, remember to update all client code to use a secondary key while rolling over the primary key. Avoid changing the keys while operations are in flight.

As you might expect, if you regenerate keys without updating client code, requests using the old key will fail. Regenerating all new keys does not permanently lock you out of your service, and you can still access the service through the portal. After you regenerate primary and secondary keys, you can update client code to use the new keys and operations will resume accordingly.

Values for the API keys are generated by the service. You cannot provide a custom key for Azure Cognitive Search to use. Similarly, there is no user-defined name for admin API-keys. References to the key are fixed strings, either `primary` or `secondary`. 

```azurepowershell-interactive
New-AzSearchAdminKey -ResourceGroupName <resource-group-name> -ServiceName <search-service-name> -KeyKind Primary
```

Results should look similar to the following output. Both keys are returned even though you only change one at a time.

```
Primary                    Secondary
-------                    ---------
<alphanumeric-guid>        <alphanumeric-guid>  
```

## Create or delete query keys

[**New-AzSearchQueryKey**](https://docs.microsoft.com/powershell/module/az.search/new-azsearchquerykey?view=azps-1.4.0) is used to create query [API keys](search-security-api-keys.md) for read-only access from client apps to an Azure Cognitive Search index. Query keys are used to authenticate to a specific index for the purpose of retrieving search results. Query keys do not grant read-only access to other items on the service, such as an index, data source, or indexer.

You cannot provide a key for Azure Cognitive Search to use. API keys are generated by the service.

```azurepowershell-interactive
New-AzSearchQueryKey -ResourceGroupName <resource-group-name> -ServiceName <search-service-name> -Name <query-key-name> 
```

## Scale replicas and partitions

[**Set-AzSearchService**](https://docs.microsoft.com/powershell/module/az.search/set-azsearchservice?view=azps-1.4.0) is used to [increase or decrease replicas and partitions](search-capacity-planning.md) to readjust billable resources within your service. Increasing replicas or partitions adds to your bill, which has both fixed and variable charges. If you have a temporary need for additional processing power, you can increase replicas and partitions to handle the workload. The monitoring area in the Overview portal page has tiles on query latency, queries per second, and throttling, indicating whether current capacity is adequate.

It can take a while to add or remove resourcing. Adjustments to capacity occur in the background, allowing existing workloads to continue. Additional capacity is used for incoming requests as soon as it's ready, with no additional configuration required. 

Removing capacity can be disruptive. Stopping all indexing and indexer jobs prior to reducing capacity is recommended to avoid dropped requests. If that isn't feasible, you might consider reducing capacity incrementally, one replica and partition at a time, until your new target levels are reached.

Once you submit the command, there is no way to terminate it midway through. You will have to wait until the command is finished before revising the counts.

```azurepowershell-interactive
Set-AzSearchService -ResourceGroupName <resource-group-name> -Name <search-service-name> -PartitionCount 6 -ReplicaCount 6
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

## Next steps

Build an [index](search-what-is-an-index.md), [query an index](search-query-overview.md) using the portal, REST APIs, or the .NET SDK.

* [Create an Azure Cognitive Search index in the Azure portal](search-create-index-portal.md)
* [Set up an indexer to load data from other services](search-indexer-overview.md)
* [Query an Azure Cognitive Search index using Search explorer in the Azure portal](search-explorer.md)
* [How to use Azure Cognitive Search in .NET](search-howto-dotnet-sdk.md)