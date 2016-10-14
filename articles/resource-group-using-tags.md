<properties
	pageTitle="Using tags to organize your Azure resources | Microsoft Azure"
	description="Shows how to apply tags to organize resources for billing and managing."
	services="azure-resource-manager"
	documentationCenter=""
	authors="tfitzmac"
	manager="timlt"
	editor="tysonn"/>

<tags
	ms.service="azure-resource-manager"
	ms.workload="multiple"
	ms.tgt_pltfrm="AzurePortal"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/08/2016"
	ms.author="tomfitz"/>


# Using tags to organize your Azure resources

Resource Manager enables you to logically organize resources by applying tags. The tags consist of key/value pairs that identify resources with properties that you define. To mark resources as belonging to the same category, apply the same tag to those resources.

When you view resources with a particular tag, you see resources from all your resource groups. You are not limited to only resources in the same resource group, which enables you to organize your resources in a way that is independent of the deployment relationships. Tags can be helpful when you need to organize resources for billing or management.

Each tag you add to a resource or resource group is automatically added to the subscription-wide taxonomy. You can also prepopulate the taxonomy for your subscription with tag names and values you'd like to use as resources are tagged in the future.

Each resource or resource group can have a maximum of 15 tags. The tag name is limited to 512 characters, and the tag value is limited to 256 characters.

> [AZURE.NOTE] You can only apply tags to resources that support Resource Manager operations. If you created a Virtual Machine, Virtual Network, or Storage through the classic deployment model (such as through the classic portal), you cannot apply a tag to that resource. To support tagging, redeploy these resources through Resource Manager. All other resources support tagging.

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

Currently, Resource Manager does not support processing an object for the tag names and values. Instead, pass an object for the tag values, but you must still specify the tag names, as shown in the following example.

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

[AZURE.INCLUDE [resource-manager-tag-resources](../includes/resource-manager-tag-resources-powershell.md)]

## Azure CLI

[AZURE.INCLUDE [resource-manager-tag-resources-cli](../includes/resource-manager-tag-resources-cli.md)]

## REST API

The portal and PowerShell both use the [Resource Manager REST API](https://msdn.microsoft.com/library/azure/dn848368.aspx) behind the scenes. If you need to integrate tagging into another environment, you can get tags with a GET on the resource id and update the set of tags with a PATCH call.


## Tags and billing

For supported services, you can use tags to group your billing data. For example, [Virtual Machines integrated with Azure Resource Manager](./virtual-machines/virtual-machines-windows-compare-deployment-models.md) enable
you to define and apply tags to organize the billing usage for virtual machines. If you are running multiple VMs for different organizations, you can use the tags to group usage by cost center.  
You can also use tags to categorize costs by runtime environment; such as, the billing usage for VMs running in production environment.

You can retrieve information about tags through the [Azure Resource Usage and RateCard APIs](billing-usage-rate-card-overview.md) or the usage comma-separated values (CSV) file. You download the usage file from
the [Azure accounts portal](https://account.windowsazure.com/) or [EA portal](https://ea.azure.com). For more information about programmatic access to billing information, see [Gain insights into your Microsoft Azure resource consumption](billing-usage-rate-card-overview.md). For REST API operations, see [Azure Billing REST API Reference](https://msdn.microsoft.com/library/azure/1ea5b323-54bb-423d-916f-190de96c6a3c).

When you download the usage CSV for services that support tags with billing, the tags appear in the **Tags** column. For more details, see [Understand your bill for Microsoft Azure](billing-understand-your-bill.md).

![See tags in billing](./media/resource-group-using-tags/billing_csv.png)

## Next Steps

- You can apply restrictions and conventions across your subscription with customized policies. The policy you define could require that all resources have a value for a particular tag. For more information, see [Use Policy to manage resources and control access](resource-manager-policy.md).
- For an introduction to using Azure PowerShell when deploying resources, see [Using Azure PowerShell with Azure Resource Manager](./powershell-azure-resource-manager.md).
- For an introduction to using Azure CLI when deploying resources, see [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management](./xplat-cli-azure-resource-manager.md).
- For an introduction to using the portal, see [Using the Azure portal to manage your Azure resources](./azure-portal/resource-group-portal.md)  
