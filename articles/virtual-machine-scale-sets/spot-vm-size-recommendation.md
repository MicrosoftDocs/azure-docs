---
title: Spot Virtual Machine Size Recommendation for Virtual Machine Scale Sets
description: Learn how to pick the right VM size when using Azure Spot for Virtual Machine Scale Sets.
author: ju-shim
ms.author: jushiman
ms.service: virtual-machine-scale-sets
ms.subservice: spot
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 11/22/2022
ms.reviewer: cynthn
---

# Spot Virtual Machine size recommendation 

The Spot VM size recommendations tool is an easy way to view and select alternative VM sizes that are better suited for your stateless, flexible, and fault tolerant workload needs during the Virtual Machine Scale Set deployment process in the Azure portal. This tool allows Azure to recommend appropriate VM sizes to you after you filter by region, price, and eviction rate. You can further filter the recommended VMs list by size, type, generation, and disk (premium or ephemeral OS disk). 

## Azure portal 

You can access Azure's size recommendations through the Virtual Machine Scale Sets creation process in the Azure portal. The following steps will instruct you on how to access this tool during that process. 

1. Log in to the [Azure portal](https://portal.azure.com).
1. In the search bar, search for and select **Virtual Machine Scale Sets**.
1. Select **Create** on the **Virtual Machine Scale Sets** page.
1. In the **Basics** tab, fill out the required fields. 
1. Under **Instance details**, select **Run with Azure Spot discount**. 
    
    :::image type="content" source="./media/spot-vm-size-recommendation/run-with-azure-spot-discount.png" alt-text="Screenshot of a selected checkbox next to the Run with Azure Spot discount option.":::

1. In the same section, under **Azure Spot configuration**, select **Configure**.
1. On the **Azure Spot configuration** page, in the **Spot details** tab, go to the **Size** selector.
1. Expand the **Size** drop-down and select **See all sizes** option at the bottom of the list.
    
    :::image type="content" source="./media/spot-vm-size-recommendation/spot-details-see-all-sizes.png" alt-text="Screenshot of the See all sizes option in the Size selector":::

1. On the **Select a VM size** page, click **Add filter**.
1. You can choose which filters to apply. For this example, we will only apply **Size** and set it to *Medium (7-16)* for the number of vCPU.
     
    :::image type="content" source="./media/spot-vm-size-recommendation/size-filter-medium.png" alt-text="Screenshot of the Medium option selected for the Size filter.":::

1. Click **OK**.
1. From the resulting list of VMs, select a preferred VM size. 
1. Click **Select** at the bottom to continue. 
1. Back on the **Spot details** tab, click **Next** to go to the next tab.
1. The **Size recommendations** tab allows you to view and select alternative VM sizes that are better suited for your stateless, flexible, and fault tolerant workload needs with regard to region, pricing, and eviction rates.
     
    :::image type="content" source="./media/spot-vm-size-recommendation/size-recommendations-tab.png" alt-text="Screenshot of the Size recommendations tab with a list of alternative VM sizes.":::

1. Make your selection and click **Save**. 
1. Continue through the Virtual Machine Scale Set creation process. 


## Next steps

> [!div class="nextstepaction"]
> [Learn more about Spot virtual machines](../virtual-machines/spot-vms.md)