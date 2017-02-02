---
title: Tag Azure resources for logical organization | Microsoft Docs
description: Shows how to apply tags to organize Azure resources for billing and managing.
services: azure-resource-manager
documentationcenter: ''
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: 003a78e5-2ff8-4685-93b4-e94d6fb8ed5b
ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: AzurePortal
ms.devlang: na
ms.topic: article
ms.date: 01/31/2017
ms.author: tomfitz

---
# Use tags to organize your Azure resources
You can apply tags to your Azure resources and resource groups to logically organize them by categories. Each tag consists of a key and a value. For example, you can apply the key "Environment" and the value "Production" to all the resources in production. Without this tag, you may have difficulty identifying whether a resource is intended for development, test, or production. However, "Environment" and "Production" are just examples. You define the keys and values that make the most sense for organizing your subscription.

The following limitations apply to tags:

* Each resource or resource group can have a maximum of 15 tags. 
* The tag name is limited to 512 characters.
* The tag value is limited to 256 characters. 
* Tags applied to the resource group are not inherited by the resources in that resource group. 

After applying tags, you can retrieve all the resources in your subscription with that tag key and value. Tags enable you to retrieve related resources that reside in different resource groups. This approach is helpful when you need to organize resources for billing or management.

> [!NOTE]
> You can only apply tags to resources that support Resource Manager operations. If you created a Virtual Machine, Virtual Network, or Storage through the classic deployment model (such as through the classic portal), you cannot apply a tag to that resource. To support tagging, redeploy these resources through Resource Manager. All other resources support tagging.
> 
> 

## Templates
To tag a resource during deployment, add the **tags** element to the resource you are deploying, and provide the tag name and value. The following example shows a storage account with a tag.

```json
{
	"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	"contentVersion": "1.0.0.0",
	"variables": {
    "storageName": "[concat('storage', uniqueString(resourceGroup().id))]"
  },
	"resources": [
    {
      "apiVersion": "2016-01-01",
      "type": "Microsoft.Storage/storageAccounts",
      "name": "[variables('storageName')]",
      "location": "[resourceGroup().location]",
      "tags": {
        "Dept": "Finance",
        "Environment": "Production"
      },
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "properties": { }
    }
	]
}
```

Or, you can pass an object with tag keys and values, as shown in the following example:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "tagvalues": {
      "type": "object",
      "defaultValue": {
        "Dept": "Finance",
        "Environment": "Production"
      }
    }
  },
  "variables": {
    "storageName": "[concat('storage', uniqueString(resourceGroup().id))]"
  },
  "resources": [
    {
      "apiVersion": "2016-01-01",
      "type": "Microsoft.Storage/storageAccounts",
      "name": "[variables('storageName')]",
      "location": "[resourceGroup().location]",
      "tags": "[parameters('tagvalues')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "properties": {}
    }
  ]
}
```

## Portal
[!INCLUDE [resource-manager-tag-resource](../../includes/resource-manager-tag-resources.md)]

## PowerShell
[!INCLUDE [resource-manager-tag-resources-powershell](../../includes/resource-manager-tag-resources-powershell.md)]

## Azure CLI 2.0 (Preview)

With Azure CLI 2.0 (Preview), you can add tags to resources and resource group, and query resources by tag values.

Every time you apply tags to a resource or resource group, you overwrite the existing tags on that resource or resource group. Therefore, you must use a different approach based on whether the resource or resource group has existing tags that you want to preserve. To add tags to a:

* resource group without existing tags.

  ```azurecli
  az group update -n TagTestGroup --set tags.Environment=Test tags.Dept=IT
  ```

* resource without existing tags.

  ```azurecli
  az resource tag --tags Dept=IT Environment=Test -g TagTestGroup -n storageexample --resource-type "Microsoft.Storage/storageAccounts"
  ``` 

To add tags to a resource that already has tags, first retrieve the existing tags: 

```azurecli
az resource show --query tags --output list -g TagTestGroup -n storageexample --resource-type "Microsoft.Storage/storageAccounts"
```

Which returns the following format:

```
Dept        : Finance
Environment : Test
```

Reapply the existing tags to the resource, and add the new tags.

```azurecli
az resource tag --tags Dept=Finance Environment=Test CostCenter=IT -g TagTestGroup -n storageexample --resource-type "Microsoft.Storage/storageAccounts"
``` 

To get resource groups with a specific tag, use `az group list`.

```azurecli
az group list --tag Dept=IT
```

To get all the resources with a particular tag and value, use `az resource list`.

```azurecli
az resource list --tag Dept=Finance
```

## Azure CLI 1.0
[!INCLUDE [resource-manager-tag-resources-cli](../../includes/resource-manager-tag-resources-cli.md)]

## REST API
The portal and PowerShell both use the [Resource Manager REST API](https://docs.microsoft.com/rest/api/resources/) behind the scenes. If you need to integrate tagging into another environment, you can get tags with a GET on the resource id and update the set of tags with a PATCH call.

## Tags and billing
For supported services, you can use tags to group your billing data. For example, Virtual Machines deployed with Azure Resource Manager enable you to define and apply tags to organize the billing usage for virtual machines. If you are running multiple VMs for different organizations, you can use the tags to group usage by cost center. You can also use tags to categorize costs by runtime environment; such as, the billing usage for VMs running in production environment.

You can retrieve information about tags through the [Azure Resource Usage and RateCard APIs](../billing/billing-usage-rate-card-overview.md) or the usage comma-separated values (CSV) file. You download the usage file from the [Azure accounts portal](https://account.windowsazure.com/) or [EA portal](https://ea.azure.com). For more information about programmatic access to billing information, see [Gain insights into your Microsoft Azure resource consumption](../billing/billing-usage-rate-card-overview.md). For REST API operations, see [Azure Billing REST API Reference](https://msdn.microsoft.com/library/azure/1ea5b323-54bb-423d-916f-190de96c6a3c).

When you download the usage CSV for services that support tags with billing, the tags appear in the **Tags** column. For more information, see [Understand your bill for Microsoft Azure](../billing/billing-understand-your-bill.md).

![See tags in billing](./media/resource-group-using-tags/billing_csv.png)

## Next Steps
* You can apply restrictions and conventions across your subscription with customized policies. The policy you define could require that all resources have a value for a particular tag. For more information, see [Use Policy to manage resources and control access](resource-manager-policy.md).
* For an introduction to using Azure PowerShell when deploying resources, see [Using Azure PowerShell with Azure Resource Manager](powershell-azure-resource-manager.md).
* For an introduction to using Azure CLI when deploying resources, see [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management](xplat-cli-azure-resource-manager.md).
* For an introduction to using the portal, see [Using the Azure portal to manage your Azure resources](resource-group-portal.md)  
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

