<properties
	pageTitle="Using tags to organize your Azure resources | Microsoft Azure"
	description="Shows how to apply tags to organize resources for billing and managing."
	services="azure-resource-manager"
	documentationCenter=""
	authors="tfitzmac"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="azure-resource-manager"
	ms.workload="multiple"
	ms.tgt_pltfrm="AzurePortal"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/10/2016"
	ms.author="tomfitz"/>


# Using tags to organize your Azure resources

Resource Manager enables you to logically organize resources by applying tags. The tags consist of key/value pairs that identify resources with properties that you define. To mark resources as belonging to the same category, apply the same tag to those resources.

When you view resources with a particular tag, you see resources from all of your resource groups. You are not limited to only resources in the same resource group which enables you to organize your resources in a way that is independent of the deployment relationships. Tags can be particularly helpful when you need to organize resources for billing or management.

Each tag you add to a resource or resource group is automatically added to the subscription-wide taxonomy. You can also prepopulate the taxonomy for your subscription with tag names and values you'd like to use as resources are tagged in the future.

Each resource or resource group can have a maximum of 15 tags. The tag name is limited to 512 characters, and the tag value is limited to 256 characters.

> [AZURE.NOTE] You can only apply tags to resources that support Resource Manager operations. If you created a Virtual Machine, Virtual Network, or Storage through the classic deployment model (such as through the classic portal or Service Management API), you cannot apply a tag to that resource. You must re-deploy these resources through Resource Manager to support tagging. All other resources support tagging.

## Templates

To tag a resource during deployment, simply add the **tags** element to the resource you are deploying, and provide the tag name and value. The tag name and value do not need to pre-exist in your subscription. You can provide up to 15 tags for each resource.

The following example shows a storage account with a tag.

    "resources": [
        {
            "type": "Microsoft.Storage/storageAccounts",
            "apiVersion": "2015-06-15",
            "name": "[concat('storage', uniqueString(resourceGroup().id))]",
            "location": "[resourceGroup().location]",
            "tags": {
                "dept": "Finance"
            },
            "properties": 
            {
                "accountType": "Standard_LRS"
            }
        }
    ]

Currently, Resource Manager does not support processing an object for the tag names and values. Instead, you can pass an object for the tag values, but you must still specify the tag names, as shown below.

    {
      "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "tagvalues": {
          "type": "object",
          "defaultValue": {
            "dept": "Finance",
            "project": "Test"
          }
        }
      },
      "resources": [
      {
        "apiVersion": "2015-06-15",
        "type": "Microsoft.Storage/storageAccounts",
        "name": "examplestorage",
        "tags": {
          "dept": "[parameters('tagvalues').dept]",
          "project": "[parameters('tagvalues').project]"
        },
        "location": "[resourceGroup().location]",
        "properties": {
          "accountType": "Standard_LRS"
        }
      }]
    }


## Portal

[AZURE.INCLUDE [resource-manager-tag-resource](../includes/resource-manager-tag-resources.md)]

## PowerShell

Tags exist directly on resources and resource groups, so to see what tags are already applied, we can simply get a resource or resource group with **Get-AzureRmResource** or 
**Get-AzureRmResourceGroup**. Let's start with a resource group.

    Get-AzureRmResourceGroup -Name tag-demo-group

This cmdlet returns several bits of metadata on the resource group including what tags have been applied, if any.

    ResourceGroupName : tag-demo-group
    Location          : westus
    ProvisioningState : Succeeded
    Tags              :
                    Name         Value
                    ===========  ==========
                    Dept         Finance
                    Environment  Production

When getting metadata for a resource, the tags are not directly displayed. 

    Get-AzureRmResource -ResourceName tfsqlserver -ResourceGroupName tag-demo-group

You'll see in the results that the tags are only displayed as Hashtable object.

    Name              : tfsqlserver
    ResourceId        : /subscriptions/{guid}/resourceGroups/tag-demo-group/providers/Microsoft.Sql/servers/tfsqlserver
    ResourceName      : tfsqlserver
    ResourceType      : Microsoft.Sql/servers
    Kind              : v12.0
    ResourceGroupName : tag-demo-group
    Location          : westus
    SubscriptionId    : {guid}
    Tags              : {System.Collections.Hashtable}

You can view the actual tags by retrieving the **Tags** property.

    (Get-AzureRmResource -ResourceName tfsqlserver -ResourceGroupName tag-demo-group).Tags | %{ $_.Name + ": " + $_.Value }
   
Which returns formatted results:
    
    Dept: Finance
    Environment: Production

Instead of viewing the tags for a particular resource group or resource, you will often want to retrieve all of the resources or resource groups that have a particular tag and value. 
To get resource groups with a specific tag, use **Find-AzureRmResourceGroup** cmdlet with the **-Tag** parameter.

    Find-AzureRmResourceGroup -Tag @{ Name="Dept"; Value="Finance" } | %{ $_.Name }
    
Which returns the names of the resource groups with that tag value.
   
    tag-demo-group
    web-demo-group

To get all of the resources with a particular tag and value, use the **Find-AzureRmResource** cmdlet.

    Find-AzureRmResource -TagName Dept -TagValue Finance | %{ $_.ResourceName }
    
Which returns the names of resources with that tag value.
    
    tfsqlserver
    tfsqldatabase

To add a tag to a resource group that has no existing tags, simply use the **Set-AzureRmResourceGroup** command and specify a tag object.

    Set-AzureRmResourceGroup -Name test-group -Tag @( @{ Name="Dept"; Value="IT" }, @{ Name="Environment"; Value="Test"} )

Which returns the resource group with its new tag values.

    ResourceGroupName : test-group
    Location          : southcentralus
    ProvisioningState : Succeeded
    Tags              :
                    Name          Value
                    =======       =====
                    Dept          IT
                    Environment   Test
                    
You can add tags to a resource that has no existing tags by using the **Set-AzureRmResource** command 

    Set-AzureRmResource -Tag @( @{ Name="Dept"; Value="IT" }, @{ Name="Environment"; Value="Test"} ) -ResourceId /subscriptions/{guid}/resourceGroups/test-group/providers/Microsoft.Web/sites/examplemobileapp

Tags are updated as a whole, so if you are adding one tag to a resource that's already been tagged, you'll need to use an array with all the tags you want to keep. To do this, you can first select the existing tags, add a new one to that set, and re-apply all of the tags.

    $tags = (Get-AzureRmResourceGroup -Name tag-demo).Tags
    $tags += @{Name="status";Value="approved"}
    Set-AzureRmResourceGroup -Name test-group -Tag $tags

To remove one or more tags, simply save the array without the ones you want to remove.

The process is the same for resources, except you'll use the **Get-AzureRmResource** and **Set-AzureRmResource** cmdlets. 

To get a list of all tags within a subscription using PowerShell, use the **Get-AzureRmTag** cmdlet.

    Get-AzureRmTag
    Name                      Count
    ----                      ------
    env                       8
    project                   1

You may see tags that start with "hidden-" and "link:". These are internal tags, which you should ignore and avoid changing.

Use the **New-AzureRmTag** cmdlet to add new tags to the taxonomy. These tags will be included in the autocomplete even though they haven't been applied to any resources or resource groups, yet. To remove a tag name/value, first remove the tag from any resources it may be used with and then use the **Remove-AzureRmTag** cmdlet to remove it from the taxonomy.

## Azure CLI

Tags exist directly on resources and resource groups, so to see what tags are already applied, we can simply get a resource group and its resources with **azure group show**.

    azure group show -n tag-demo-group
    
Which returns metadata about the resource group, including any tags applied to it.
    
    info:    Executing command group show
    + Listing resource groups
    + Listing resources for the group
    data:    Id:                  /subscriptions/{guid}/resourceGroups/tag-demo-group
    data:    Name:                tag-demo-group
    data:    Location:            westus
    data:    Provisioning State:  Succeeded
    data:    Tags: Dept=Finance;Environment=Production
    data:    Resources:
    data:
    data:      Id      : /subscriptions/{guid}/resourceGroups/tag-demo-group/providers/Microsoft.Sql/servers/tfsqlserver
    data:      Name    : tfsqlserver
    data:      Type    : servers
    data:      Location: eastus2
    data:      Tags    : Dept=Finance;Environment=Production
    ...

To get the tags for only the resource group, use a JSON utility such as [jq](http://stedolan.github.io/jq/download/).

    azure group show -n tag-demo-group --json | jq ".tags"
    
Which returns the tags for that resource group.
    
    {
      "Dept": "Finance",
      "Environment": "Production" 
    }

You can view the tags for a particular resouce by using **azure resource show**.

    azure resource show -g tag-demo-group -n tfsqlserver -r Microsoft.Sql/servers -o 2014-04-01-preview --json | jq ".tags"
    
Which returns the tags for that resource.
    
    {
      "Dept": "Finance",
      "Environment": "Production"
    }
    
You can retrieve all of the resources with a particular tag and value as shown below.

    azure resource list --json | jq ".[] | select(.tags.Dept == \"Finance\") | .name"
    
Which returns the names of the resources with that tag.
    
    "tfsqlserver"
    "tfsqlserver/tfsqldata"

Tags are updated as a whole, so if you are adding one tag to a resource that's already been tagged, you'll need to retrieve all the existing tags that you want to keep. To set tag values 
for a resource group, use **azure group set** and provide all of the tags for the resource group. 

    azure group set -n tag-demo-group -t Dept=Finance;Environment=Production;Project=Upgrade
    
A summary of the resource group with the new tags is returned.
    
    info:    Executing command group set
    ...
    data:    Name:                tag-demo-group
    data:    Location:            westus
    data:    Provisioning State:  Succeeded
    data:    Tags: Dept=Finance;Environment=Production;Project=Upgrade
    ...
    
You can list the existing tags in your subscription with **azure tag list**, and add a new tag with **azure tag create**. To remove a tag from the taxonomy for your subscription, first remove the tag from any resources it may be used with, and then remove the tag with **azure tag delete**.

## REST API

The portal and PowerShell both use the [Resource Manager REST API](https://msdn.microsoft.com/library/azure/dn848368.aspx) behind the scenes. If you need to integrate tagging into another environment, you can get tags with a GET on the resource id and update the set of tags with a PATCH call.


## Tags and billing

For supported services, you can use tags to group your billing data. For example, [Virtual Machines integrated with Azure Resource Manager](./virtual-machines/virtual-machines-windows-compare-deployment-models.md) enable
you to define and apply tags to organize the billing usage for virtual machines. If you are running multiple VMs for different organizations, you can use the tags to group usage by cost center.  
You can also use tags to categorize costs by runtime environment; such as, the billing usage for VMs running in production environment.

You can retrieve information about tags through the [Azure Resource Usage and RateCard APIs](billing-usage-rate-card-overview.md) or the usage comma-separated values (CSV) file that you can download from
the [Azure accounts portal](https://account.windowsazure.com/) or [EA portal](https://ea.azure.com). For more information about programmatic access to billing information, see [Gain insights into your Microsoft Azure resource consumption](billing-usage-rate-card-overview.md). For REST API operations, see [Azure Billing REST API Reference](https://msdn.microsoft.com/library/azure/1ea5b323-54bb-423d-916f-190de96c6a3c).

When you download the usage CSV for services that support tags with billing, the tags will appear in the **Tags** column. For more details, see [Understand your bill for Microsoft Azure](billing-understand-your-bill.md).

![See tags in billing](./media/resource-group-using-tags/billing_csv.png)

## Next Steps

- You can apply restrictions and conventions across your subscription with customized policies. The policy you define could require that a particular tag be set for all resources. For more information, see [Use Policy to manage resources and control access](resource-manager-policy.md).
- For an introduction to using Azure PowerShell when deploying resources, see [Using Azure PowerShell with Azure Resource Manager](./powershell-azure-resource-manager.md).
- For an introduction to using Azure CLI when deploying resources, see [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management](./xplat-cli-azure-resource-manager.md).
- For an introduction to using the portal, see [Using the Azure portal to manage your Azure resources](./azure-portal/resource-group-portal.md)  
