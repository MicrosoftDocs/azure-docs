---
title: Create virtual machines in a Flexible scale set using Terraform
description: Learn how to create a virtual machine scale set in Flexible orchestration mode using Terraform.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: flexible-scale-sets
ms.date: 08/05/2021
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, vmss-flex
---

# Preview: Create virtual machines in a Flexible scale set using Terraform

**Applies to:** :heavy_check_mark: Flexible scale sets


This article steps through using Terraform to create a virtual machine scale set in Flexible orchestration mode. For more information about Flexible scale sets, see [Flexible orchestration mode for virtual machine scale sets](flexible-virtual-machine-scale-sets.md). 


> [!IMPORTANT]
> Virtual machine scale sets in Flexible orchestration mode is currently in public preview. An opt-in procedure is needed to use the public preview functionality described below.
> This preview version is provided without a service level agreement and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


> [!CAUTION]
> The orchestration mode is defined when you create the scale set and cannot be changed or updated later.


## Register for Flexible orchestration mode

Before you can deploy virtual machine scale sets in Flexible orchestration mode, you must first [register your subscription for the preview feature](flexible-virtual-machine-scale-sets.md#register-for-flexible-orchestration-mode). The registration may take several minutes to complete.


## Get started with Flexible orchestration mode

Create a Flexible virtual machine scale set with Terraform. This process requires **Terraform Azurerm provider v2.15.0** or later. Note the following parameters:
- When no zone is specified, `platform_fault_domain_count` can be 1, 2, or 3 depending on region.
- When a zone is specified, `the fault domain count` can be 1.
- `single_placement_group` parameter must be `false` for Flexible virtual machine scale sets.
- If you are doing a regional deployment, no need to specify `zones`.

```terraform
resource "azurerm orchestrated_virtual_machine_scale_set" "tf_vmssflex" {
name = "tf_vmssflex"
location = azurerm_resource_group.myterraformgroup.location
resource_group_name = azurerm_resource_group.myterraformgroup.name
platform_fault_domain_count = 1
single_placement_group = false
zones = ["1"]
}
```


## Next steps
> [!div class="nextstepaction"]
> [Learn how to create a Flexible scale set in the Azure portal.](flexible-virtual-machine-scale-sets-portal.md)