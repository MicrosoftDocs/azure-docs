---
title: Powershell scripts using Az.Search module - Azure Search
description: Create and configure an Azure Search service with PowerShell. You can scale a service up or down, manage admin and query api-keys, and query system information.
author: HeidiSteen
manager: cgronlun

services: search
ms.service: search
ms.devlang: powershell
ms.topic: conceptual
ms.date: 03/11/2019
ms.author: heidist

---
# Manage your Azure Search service with PowerShell
> [!div class="op_single_selector"]
> * [Portal](search-manage.md)
> * [REST API](https://docs.microsoft.com/rest/api/searchmanagement/)
> * [PowerShell](search-manage-powershell.md)
> 

You can run PowerShell commands and scripts on Windows, Linux, or in Azure Console to create and configure an Azure Search service. The **Az.Search** module extends **Az** with commands for the same Azure Search operations enabled through the [Azure Search Management REST APIs](https://docs.microsoft.com/rest/api/searchmanagement). 

> [!div class="checklist"]
> * [Get search service information](#get-search-service-information)
> * [Create or delete a service](#create-or-delete-a-service)
> * [Regenerate admin api-keys (two per service, always)](#regenerate-admin-api-keys)
> * [Create or delete query api-keys (up to 50, optional)](#create-or-delete-query-keys)
> * [Increase or decrease replicas and partitions used by a service](#scale-replicas-and-partitions)

Unsupported operations, as related to **Az.Search** specifically, include the following:
+ Changing the name, region, or tier of an existing service. Dedicated resources are provisioned when you create a service at a specific tier and regions. If you need to change the underlying hardware (location or node type), you will need to create a new service, upload indexes and other objects to the new service, and delete the old.
+ Content management (indexes, indexers, data sources, suggesters, skillsets). There are no dedicated PowerShell commands for content management. You can write PowerShell script that creates and loads and index, but your script must call the [REST](https://docs.microsoft.com/rest/api/searchservice/) or [.NET](https://docs.microsoft.com/dotnet/api/?term=microsoft.azure.search) APIs. There are no commands in the **Az.Search** module that provide these operations.

Not supported through PowerShell or any other API (portal-only operations):
+ [Attaching a cognitive services resource](cognitive-search-attach-cognitive-services.md) for [AI-enriched cognitive search indexing](cognitive-search-concept-intro.md). A cognitive service is attached to a skillset, not a subscription or service.
+ [Configuring or enabling add-on solutions](search-monitor-usage.md#add-on-monitoring-solutions) or [search traffic analytics](search-traffic-analytics.md) for monitoring Azure Search.

The following examples are interactive commands. [Full sample script](#sample-script) can be found at the end of this article.

## Check versions and load modules

Azure PowerShell must be installed. For installation instructions, see [Install Azure PowerShell](/powershell/azure/overview).

### Powershell version check (5.1 or later)

You client must be 5.1 or later on Windows or Linux, and run with elevated privileges.

```azurepowershell-interactive
$PSVersionTable.PSVersion
```

### Az module verification step

If you aren't sure whether **Az** is installed, run the following command as a verification step. 

```azurepowershell-interactive
Get-InstalledModule -Name Az
```

Some systems do not auto-load modules. If you get an error on the previous command, try loading the module, and if that fails, go back to the installation instructions.

```azurepowershell-interactive
Import-Module -Name Az
```

### Connect to Azure with a browser sign-in token

You can use your portal sign-in credentials to connect to a subscription in PowerShell.

```azurepowershell-interactive
Connect-AzAccount
```

Alternatively you can [authenticate non-interactively with a service principal](../active-directory/develop/howto-authenticate-service-principal-powershell.md).

If you have multiple Azure subscriptions, you need to set your Azure subscription. To see a list of your current subscriptions, run this command.

```azurepowershell-interactive
Get-AzSubscription | sort SubscriptionName | Select SubscriptionName
```

To specify the subscription, run the following command. In the following example, the subscription name is `ContosoSubscription`.

```azurepowershell-interactive
Select-AzSubscription -SubscriptionName ContosoSubscription
```

### List all resource groups and search services

The following commands are from **Az.Resources**, returning information about existing resources and services already provisioned in your subscription. If you aren't sure about a search resource name or group, these commands return that information, saving you a trip to the portal.

```azurepowershell-interactive
TBD
TBD

```

## Import Az.Search

Commands from **Az.Search** are not available until you load the module.

```azurepowershell-interactive
Install-Module -Name Az.Search
```

### List all Az.Search commands

As a verification step, return a list of commands provided in the module.

```azurepowershell-interactive
Get-Command -Module Az.Search
```

## Get search service information

After **Az.Search** is imported and you have the resource group that contains your search service, run this command to return the service definition, including name, region, tier, and replica/partition counts.

## Create or delete a service

## Regenerate admin keys

## Create or delete query keys

## Scale replicas and partitions

<how long does it take, what happens and what will users see, when do I see a change in billing>

## Sample script

The folowing script can be pasted into a .ps file and modified to work with your subscription.

<TBD SCRIPT GOES HERE>

## Next Steps

Build an [index](search-what-is-an-index.md), [query an index](search-query-overview.md) using the portal, REST APIs, or the .NET SDK.

* [Create an Azure Search index in the Azure portal](search-create-index-portal.md)
* [Set up an indexer to load data from other services](search-indexer-overview.md)
* [Query an Azure Search index using Search explorer in the Azure portal](search-explorer.md)
* [How to use Azure Search in .NET](search-howto-dotnet-sdk.md)





## Commands to help you get started
    $serviceName = "your-service-name-lowercase-with-dashes"
    $sku = "free" # or "basic" or "standard" for paid services
    $location = "West US"
    # You can get a list of potential locations with
    # (Get-AzResourceProvider -ListAvailable | Where-Object {$_.ProviderNamespace -eq 'Microsoft.Search'}).Locations
    $resourceGroupName = "YourResourceGroup" 
    # If you don't already have this resource group, you can create it with 
    # New-AzResourceGroup -Name $resourceGroupName -Location $location

    # Register the ARM provider idempotently. This must be done once per subscription
    Register-AzResourceProvider -ProviderNamespace "Microsoft.Search"

    # Create a new search service
    # This command will return once the service is fully created
    New-AzResourceGroupDeployment `
        -ResourceGroupName $resourceGroupName `
        -TemplateUri "https://gallery.azure.com/artifact/20151001/Microsoft.Search.1.0.9/DeploymentTemplates/searchServiceDefaultTemplate.json" `
        -NameFromTemplate $serviceName `
        -Sku $sku `
        -Location $location `
        -PartitionCount 1 `
        -ReplicaCount 1

    # Get information about your new service and store it in $resource
    $resource = Get-AzResource `
        -ResourceType "Microsoft.Search/searchServices" `
        -ResourceGroupName $resourceGroupName `
        -ResourceName $serviceName `
        -ApiVersion 2015-08-19

    # View your resource
    $resource

    # Get the primary admin API key
    $primaryKey = (Invoke-AzResourceAction `
        -Action listAdminKeys `
        -ResourceId $resource.ResourceId `
        -ApiVersion 2015-08-19).PrimaryKey

    # Regenerate the secondary admin API Key
    $secondaryKey = (Invoke-AzResourceAction `
        -ResourceType "Microsoft.Search/searchServices/regenerateAdminKey" `
        -ResourceGroupName $resourceGroupName `
        -ResourceName $serviceName `
        -ApiVersion 2015-08-19 `
        -Action secondary).SecondaryKey

    # Create a query key for read only access to your indexes
    $queryKeyDescription = "query-key-created-from-powershell"
    $queryKey = (Invoke-AzResourceAction `
        -ResourceType "Microsoft.Search/searchServices/createQueryKey" `
        -ResourceGroupName $resourceGroupName `
        -ResourceName $serviceName `
        -ApiVersion 2015-08-19 `
        -Action $queryKeyDescription).Key

    # View your query key
    $queryKey

    # Delete query key
    Remove-AzResource `
        -ResourceType "Microsoft.Search/searchServices/deleteQueryKey/$($queryKey)" `
        -ResourceGroupName $resourceGroupName `
        -ResourceName $serviceName `
        -ApiVersion 2015-08-19

    # Scale your service up
    # Note that this will only work if you made a non "free" service
    # This command will not return until the operation is finished
    # It can take 15 minutes or more to provision the additional resources
    $resource.Properties.ReplicaCount = 2
    $resource | Set-AzResource

    # Delete your service
    # Deleting your service will delete all indexes and data in the service
    $resource | Remove-AzResource


