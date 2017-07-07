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
ms.date: 04/20/2017
ms.author: tomfitz

---
# Use tags to organize your Azure resources
[!INCLUDE [resource-manager-tag-introduction](../../includes/resource-manager-tag-introduction.md)]

> [!NOTE]
> You can only apply tags to resources that support Resource Manager operations. If you created a Virtual Machine, Virtual Network, or Storage through the classic deployment model (such as through the classic portal), you cannot apply a tag to that resource. To support tagging, redeploy these resources through Resource Manager. All other resources support tagging.
> 
> 

## Ensure tag consistency with policies

Resource policies enable you to create standard rules for your organization. You can create policies that ensure resources are tagged with the appropriate values. For more information, see [Apply resource policies for tags](resource-manager-policy-tags.md).

## Templates

[!INCLUDE [resource-manager-tags-in-templates](../../includes/resource-manager-tags-in-templates.md)]

## Portal
[!INCLUDE [resource-manager-tag-resource](../../includes/resource-manager-tag-resources.md)]

## PowerShell
[!INCLUDE [resource-manager-tag-resources-powershell](../../includes/resource-manager-tag-resources-powershell.md)]

## Azure CLI 2.0

With Azure CLI 2.0, you can add tags to resources and resource group, and query resources by tag values.

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
Tags enable you to group your billing data. For example, if you are running multiple VMs for different organizations, use the tags to group usage by cost center. You can also use tags to categorize costs by runtime environment; such as, the billing usage for VMs running in production environment.


You can retrieve information about tags through the [Azure Resource Usage and RateCard APIs](../billing/billing-usage-rate-card-overview.md) or the usage comma-separated values (CSV) file. You download the usage file from the [Azure accounts portal](https://account.windowsazure.com/) or [EA portal](https://ea.azure.com). For more information about programmatic access to billing information, see [Gain insights into your Microsoft Azure resource consumption](../billing/billing-usage-rate-card-overview.md). For REST API operations, see [Azure Billing REST API Reference](https://msdn.microsoft.com/library/azure/1ea5b323-54bb-423d-916f-190de96c6a3c).


When you download the usage CSV for services that support tags with billing, the tags appear in the **Tags** column. For more information, see [Understand your bill for Microsoft Azure](../billing/billing-understand-your-bill.md).

![See tags in billing](./media/resource-group-using-tags/billing_csv.png)

## Next Steps
* You can apply restrictions and conventions across your subscription with customized policies. The policy you define could require that all resources have a value for a particular tag. For more information, see [Use Policy to manage resources and control access](resource-manager-policy.md).
* For an introduction to using Azure PowerShell when deploying resources, see [Using Azure PowerShell with Azure Resource Manager](powershell-azure-resource-manager.md).
* For an introduction to using Azure CLI when deploying resources, see [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management](xplat-cli-azure-resource-manager.md).
* For an introduction to using the portal, see [Using the Azure portal to manage your Azure resources](resource-group-portal.md)  
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

