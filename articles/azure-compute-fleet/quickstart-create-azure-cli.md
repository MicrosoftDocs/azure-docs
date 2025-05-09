---
title: Create an Azure Compute Fleet using Azure CLI
description: Learn how to create an Azure Compute Fleet using Azure CLI.
author: ykh015
ms.author: yakhande
ms.topic: how-to
ms.service: azure-compute-fleet
ms.date: 05/09/2025
ms.reviewer: jushiman
ms.custom: devx-track-arm-template, build-2024
---

# Create an Azure Compute Fleet using Azure CLI

This article steps through using an ARM template to create an Azure Compute Fleet. 


[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]


## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Before using Compute Fleet, complete the feature registration and configure role-based access controls (RBAC). 


## Feature registration

Register the Azure Compute Fleet resource provider with your subscription using Azure CLI. Registration can take up to 30 minutes to successfully show as registered.

```bash
az provider register --namespace 'Microsoft.AzureFleet'
```

### [Azure portal](#tab/portal-1)

1. In the [Azure portal](https://portal.azure.com), navigate to your subscriptions. 
1. Select the subscription you want to enable Azure Compute Fleet on. 
1. Under **Settings**, select **Resource providers**. 
1. Search for *Microsoft.AzureFleet* and register the provider.

---


## Role-based access control permissions 

Assign the appropriate RBAC permissions to use Azure Compute Fleet. 

1. In the [Azure portal](https://portal.azure.com), navigate to your subscriptions. 
1. Select the subscription you want to adjust RBAC permissions. 
1. Select **Access Control (IAM)**. 
1. Select *Add*, then **Add Role Assignment**. 
1. Search for **Virtual Machine Contributor** and highlight it. Select **Next**. 
1. Click on **+ Select Members**. 
1. Search for *Azure Fleet Resource Provider* role. 
1. Select the *Azure Fleet Resource Provider* and select **Review + Assign**. 
1. Repeat the previous steps for the *Network Contributor* role and the *Managed Identity Operator* role. 

If you're using images stored in Compute Gallery when deploying your Compute Fleet, also repeat the previous steps for the *Compute Gallery Sharing Admin* role. 

For more information on assigning roles, see [assign Azure roles using the Azure portal](../role-based-access-control/quickstart-assign-role-user-portal.md).


## ARM template 

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

ARM templates let you deploy groups of related resources. In a single template, you can create the Virtual Machine Scale Set, install applications, and configure autoscale rules. With the use of variables and parameters, this template can be reused to update existing, or create extra scale sets. You can deploy templates through the Azure portal, Azure CLI, or Azure PowerShell, or from continuous integration / continuous delivery (CI/CD) pipelines.


## Review the template



These resources are defined in the template:

- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)
- [**Microsoft.Network/loadBalancers**](/azure/templates/microsoft.network/loadbalancers)


## Clean up resources

When no longer needed, you can use [az group delete](/cli/azure/group) to remove the resource group, scale set, and all related resources as follows. The `--no-wait` parameter returns control to the prompt without waiting for the operation to complete. The `--yes` parameter confirms that you wish to delete the resources without another prompt to do so.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

## Next steps
> [!div class="nextstepaction"]
> [Create an Azure Compute Fleet with Azure portal.](quickstart-create-portal.md)
