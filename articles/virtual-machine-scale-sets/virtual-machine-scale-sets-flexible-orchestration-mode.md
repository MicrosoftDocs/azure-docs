---
title: Flexible Orchestration Mode for Virtual Machine Scale Sets in Azure
description: Learn how to use Flexible Orchestration Mode for Virtual Machine Scale Sets in Azure.
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: extensions
ms.date: 02/12/2021
ms.reviewer: avverma
ms.custom: mimckitt

---

# Preview: Flexible Orchestration Mode for Virtual Machine Scale Sets in Azure 

Intro here...

> [!IMPORTANT]
> The orchestration mode is defined when you create the scale set and cannot be changed or updated later.


## Scale sets with Uniform orchestration
Content...


## Scale sets with Flexible orchestration 
Content...

> [!IMPORTANT]
> Virtual machine scale sets in flexible orchestration mode (VMSS Flex) is currently in public preview. An opt-in procedure is needed to use the public preview functionality described below.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## What has changed with flexible orchestration mode?
Content...

### Assign fault domain during VM creation

### Instance naming 

### Query instances for power state

### Scale sets VM Batch operations

### Monitor application health 

### List scale sets VM API changes 

### Retrieve boot diagnostics data 

### VM extensions 


## Flexible versus Uniform orchestration modes 

TABLE GOES HERE. 


## Register for flexible orchestration mode
Before you can deploy virtual machine scale sets in flexible orchestration mode, you must first register your subscription for the preview feature. The registration may take several minutes to complete.

### Azure PowerShell 
Use the [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature) cmdlet to enable the preview for your subscription. 

```azurepowershell-interactive
Register-AzProviderFeature -FeatureName VMOrchestratorMultiFD -ProviderNamespace Microsoft.Compute 
```

Feature registration can take up to 15 minutes. To check the registration status: 

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName VMOrchestratorMultiFD -ProviderNamespace Microsoft.Compute 
```

Once the feature has been registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider. 

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.Compute 
```

### Azure CLI 2.0 
Use [az feature register](/cli/azure/feature#az-feature-register) to enable the preview for your subscription. 

```azurecli-interactive
az feature register --namespace Microsoft.Compute --name VMOrchestratorMultiFD 
```

Feature registration can take up to 15 minutes. To check the registration status: 

```azurecli-interactive
az feature show --namespace Microsoft.Compute --name VMOrchestratorMultiFD 
```

Once the feature has been registered for your subscription, complete the opt-in process by propagating the change into the Compute resource provider. 

```azurecli-interactive
az provider register --namespace Microsoft.Compute 
```


## Get started with Flexible orchestration mode

### Create a scale set in Flexible orchestration mode
Content... (create empty scale set, set mode, add VMs)


### Azure CLI 2.0
Content...

### Terraform
Content...

### Azure PowerShell
Content... TBD.

### Azure Portal 
Content... TBD.



## Frequently asked questions

**How much scale does VMSS Flex support?**
You can add up to 1000 VMs to a scale set in Flexible orchestration mode.

**How does availability with VMSS Flex compare to Availability Sets or VMSS Uniform?**
|  | VMSS Flex | VMSS Uniform | Availability Sets |
|-|-|-|-|
| Deploy across availability zones | Coming soon | Yes | No |
| Fault domain availability guarantees within a region | Yes, up to 1000 instances can be spread across up to 3 fault domains in the region. Maximum fault domain count varies by region. | Yes, up to 100 instances | Yes, up to 200 instances |
| Placement groups |  |  |  |
| Update domains |  |  |  |


## Next steps
> [!div class="nextstepaction"]
> [Learn how to deploy your application on scale set.](virtual-machine-scale-sets-deploy-app.md)