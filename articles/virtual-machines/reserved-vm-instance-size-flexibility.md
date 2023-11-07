---
title: Virtual machine size flexibility -Azure Reserved VM Instances 
description: Learn what size series a reservation discount applies to when you by a reserved VM instance.
ms.service: virtual-machines
ms.subservice: billing
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 04/06/2021
---

# Virtual machine size flexibility with Reserved VM Instances

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

When you buy a Reserved VM Instance, you can choose to optimize for instance size flexibility or capacity priority. For more information about setting or changing the optimize setting for reserved VM instances, see [Change the optimize setting for reserved VM instances](../cost-management-billing/reservations/manage-reserved-vm-instance.md#change-optimize-setting-for-reserved-vm-instances).

With a reserved virtual machine instance that's optimized for instance size flexibility, the reservation you buy can apply to the virtual machines (VMs) sizes in the same instance size flexibility group. In other words, when you buy a reserved VM instance of any size within an instance flexibility group, the instance applies to all sizes within the group. For example, if you buy a reservation for a VM size that's listed in the DSv2 Series, like Standard_DS3_v2, the reservation discount can apply to the other sizes that are listed in that same instance size flexibility group:

- Standard_DS1_v2
- Standard_DS2_v2
- Standard_DS3_v2
- Standard_DS4_v2

But that reservation discount doesn't apply to VMs sizes that are listed in different instance size flexibility groups, like SKUs in DSv2 Series High Memory: Standard_DS11_v2, Standard_DS12_v2, and so on.

Within the instance size flexibility group, the number of VMs the reservation discount applies to depends on the VM size you pick when you buy a reservation. It also depends on the sizes of the VMs that you have running. The ratio column compares the relative footprint for each VM size in that instance size flexibility group. Use the ratio value to calculate how the reservation discount applies to the VMs you have running.

## Examples

The following examples use the sizes and ratios in the DSv2-series table.

You buy a reserved VM instance with the size Standard_DS4_v2 where the ratio or relative footprint compared to the other sizes in that series is 8.

- Scenario 1: Run eight Standard_DS1_v2 sized VMs with a ratio of 1. Your reservation discount applies to all eight of those VMs.
- Scenario 2: Run two Standard_DS2_v2 sized VMs with a ratio of 2 each. Also run a Standard_DS3_v2 sized VM with a ratio of 4. The total footprint is 2+2+4=8. So your reservation discount applies to all three of those VMs.
- Scenario 3: Run one Standard_DS5_v2 with a ratio of 16. Your reservation discount applies to half that VM's compute cost.
- Scenario 4: Run one Standard_DS5_v2 with a ratio of 16 and purchase an additional Standard_DS4_v2 reservation with a ratio of 8. Both reservations combine and apply the discount to entire VM.

The following sections show what sizes are in the same size series group when you buy a reserved VM instance optimized for instance size flexibility.

## Instance size flexibility ratio for VMs 

CSV below has the instance size flexibility groups, ArmSkuName and the ratios.  

[Instance size flexibility ratios](https://aka.ms/isf)

Azure keeps link and schema updated so that you can use the file programmatically.

## View VM size recommendations

Azure shows VM size recommendations in the purchase experience. When enabled, the **Optimize for instance size flexibility (preview)** option groups and sorts recommendations by instance size flexibility.

:::image type="content" source="./media/reserved-vm-instance-size-flexibility/select-product-recommended-quantity.png" alt-text="Screenshot showing recommended quantities." lightbox="./media/reserved-vm-instance-size-flexibility/select-product-recommended-quantity.png" :::

## Next steps

For more information, see [What are Azure Reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md).
