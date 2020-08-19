---
title: 'Quickstart: Deploy a Managed Service Fabric cluster by using an ARM template (Preview)'
description: Learn how to quickly create a Managed Service Fabric using an ARM template.
ms.topic: quickstart
ms.date: 08/19/2020
---

# Quickstart: Deploy a Managed Service Fabric cluster using an ARM template

Service Fabric Managed clusters are an evolution of the Azure Service Fabric cluster resource model that streamlines your deployment and cluster management experience. Service Fabric managed clusters are a fully encapsulated resource that enable you to deploy a single Service Fabric cluster resource rather than having to deploy all of the underlying resources that make up a Service Fabric cluster. This article describes how to do deploy a Managed Service Fabric test cluster in Azure using an Azure Resource Manager (ARM template)

The three-node Basic SKU cluster deployed in this tutorial is only intended to be used for instructional purposes (rather than production workloads). For more information about Managed Service Fabric cluster SKUs please see [PLACEHOLDER]().

## Prerequisites

Before you begin this quickstart:
* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* If you choose to use PowerShell locally, this article requires that you install the Az PowerShell
module and connect to your Azure account using the
[Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) cmdlet. For more information
about installing the Az PowerShell module, see
[Install Azure PowerShell][install-azure-powershell].
* [Download the Managed Service Fabric cluster template](https://github.com/Azure-Samples/service-fabric-managed-cluster-templates/PLACEHOLDER)

[!INCLUDE [cloud-shell-try-it](../../includes/cloud-shell-try-it.md)]

Replace `<your-subscription>` with the subscription string that you would like to use. Select a specific subscription ID using the
[Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

```azurepowershell-interactive
Set-AzContext -SubscriptionId <your-subscription>
```

## Create a resource group 

Create a resource group to deploy the Managed Service Fabric cluster to. 

```azurepowershell-interactive
New-AzResourceGroup -Name myResourceGroup -Location EastUS
```


<!-- LINKS - internal -->
