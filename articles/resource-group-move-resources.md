<properties 
	pageTitle="Move Resources to New Resource Group" 
	description="Use Azure PowerShell or REST API to move resources to a new resource group for Azure Resource Manager." 
	services="azure-resource-manager" 
	documentationCenter="" 
	authors="tfitzmac" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="azure-resource-manager" 
	ms.workload="multiple" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/08/2015" 
	ms.author="tomfitz"/>

# Move resources to new resource group or subscription

This topic shows how to move resources from one resource group to another resource group. You can also move resources to a new subscription. You may need to move resources when you decide that:

1. For billing purposes, a resource needs to live in a different subscription.
2. A resource no longer shares the same lifecycle as the resources it was previously grouped with. You want to move it to a new resource group so you can manage that resource separately from the other resources.
3. A resource now shares the same lifecycle as other resources in a different resource group. You want to move it to the resource group with the other resources so you can manage them together.

There are some important considerations when moving a resource:

1. You cannot change the location of the resource. Moving a resource only moves it to a new resource group. The new resource group may have a different location, but that does 
not change the location of the resource.
2. The destination resource group should contain only resources that share the same application lifecycle as the resources you are moving.
3. If you are using Azure PowerShell, make sure you are using the latest version. The **Move-AzureResource** command is updated frequently. To update your version, run the Microsoft Web Platform Installer and check if a 
new version is available. For more information, see [How to install and configure Azure PowerShell](powershell-install-configure.md).
4. The move operation can take a while to complete and during that time your PowerShell prompt will wait until the operation has completed.

## Supported services

Not all services currently support the ability to move resources.

For now, the services that support moving to both a new resource group and subscription are:

- API Management
- Azure DocumentDB
- Azure Search
- Azure Web Apps (some [limitations](app-service-web/app-service-move-resources.md) apply)
- Data Factory
- Key Vault
- Mobile Engagement
- Operational Insights
- Redis Cache
- SQL Database

The services that support moving to a new resource group but not a new subscription are:

- Compute (classic)
- Storage (classic)

The services that currently do not support moving a resource are:

- Virtual Networks

When working with web apps, you cannot move only an App Service plan. To move web apps, your options are:

- Move all of the resources from one resource group to a different resource group, if the destination resource group does not already have Microsoft.Web resources.
- Move the web apps to a different resource group, but keep the App Service plan in the original resource group.

## Using PowerShell to move resources

To move existing resources to another resource group or subscription, use the **Move-AzureRmResource** command (or **Move-AzureResource** for Azure PowerShell versions earlier than 1.0 Preview).

The first example shows how to move one resource to a new resource group.

    PS C:\> Move-AzureRmResource -DestinationResourceGroupName TestRG -ResourceId /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/OtherExample/providers/Microsoft.ClassicStorage/storageAccounts/examplestorage

The second example shows how to move multiple resources to a new resource group.

    PS C:\> $webapp = Get-AzureRmResource -ResourceGroupName OldRG -ResourceName ExampleSite -ResourceType Microsoft.Web/sites
    PS C:\> $plan = Get-AzureRmResource -ResourceGroupName OldRG -ResourceName ExamplePlan -ResourceType Microsoft.Web/serverFarms
    PS C:\> Move-AzureRmResource -DestinationResourceGroupName NewRG -ResourceId ($webapp.ResourceId, $plan.ResourceId)

To move to a new subscription, include a value for the **DestinationSubscriptionId** parameter.

## Using REST API to move resources

To move existing resources to another resource group or subscription, run:

    POST https://management.azure.com/subscriptions/{source-subscription-id}/resourcegroups/{source-resource-group-name}/moveResources?api-version={api-version} 

Replace **{source-subscription-id}** and **{source-resource-group-name}** with the subscription and resource group that currently contain the resources you wish to move. Use **2015-01-01** for {api-version}.

In the request, include a JSON object that defines the target resource group and the resources you wish to move.

    {
        "targetResourceGroup": "/subscriptions/{target-subscription-id}/resourceGroups/{target-resource-group-name}", "resources": [
            "/subscriptions/{source-id}/resourceGroups/{source-group-name}/providers/{provider-namespace}/{type}/{name}",
            "/subscriptions/{source-id}/resourceGroups/{source-group-name}/providers/{provider-namespace}/{type}/{name}",
            "/subscriptions/{source-id}/resourceGroups/{source-group-name}/providers/{provider-namespace}/{type}/{name}",
            "/subscriptions/{source-id}/resourceGroups/{source-group-name}/providers/{provider-namespace}/{type}/{name}"
        ]
    }

## Next steps
- [Using Azure PowerShell with Resource Manager](./powershell-azure-resource-manager.md)
- [Using the Azure CLI with Resource Manager](./virtual-machines/xplat-cli-azure-resource-manager.md)
- [Using the Azure Portal to manage resources](azure-portal/resource-group-portal.md)
- [Using tags to organize your resources](./resource-group-using-tags.md)
