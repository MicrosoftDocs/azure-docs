---
title: Maintenance control for OS image upgrades on Azure Virtual Machine Scale Sets using Azure portal
description: Learn how to control when automatic OS image upgrades are rolled out to your Azure Virtual Machine Scale Sets using Maintenance control and Azure portal.
author: ju-shim
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 11/22/2022
ms.author: jushiman 
#pmcontact: PPHILLIPS
---

# Maintenance control for OS image upgrades on Azure Virtual Machine Scale Sets using Azure portal

Maintenance control lets you decide when to apply automatic guest OS image upgrades to your Virtual Machine Scale Sets. This topic covers the Azure portal options for Maintenance control. For more information on using Maintenance control, see [Maintenance control for Azure Virtual Machine Scale Sets](virtual-machine-scale-sets-maintenance-control.md).


## Create a maintenance configuration

1. Sign in to the Azure portal.

1. Search for **Maintenance Configurations**.
    
    :::image type="content" source="media/virtual-machine-scale-sets-maintenance-control-portal/maintenance-configurations-search-bar.png" alt-text="Screenshot showing how to open Maintenance Configurations":::

1. Select **Add**.

    :::image type="content" source="media/virtual-machine-scale-sets-maintenance-control-portal/maintenance-configurations-add.png" alt-text="Screenshot showing how to add a maintenance configuration":::

1. In the Basics tab, choose a subscription and resource group, provide a name for the configuration, choose a region, and select *OS image upgrade* for the scope. Select **Next**.
    
    :::image type="content" source="media/virtual-machine-scale-sets-maintenance-control-portal/maintenance-configurations-basics-tab.png" alt-text="Screenshot showing Maintenance Configuration basics":::

1. In the Schedule tab, declare a scheduled window when Azure will apply the updates on your resources. Set a start date, maintenance window, and recurrence. Once you create a scheduled window, you no longer have to apply the updates manually. Select **Next**. 

    > [!IMPORTANT]
    > Maintenance window **duration** must be *5 hours* or longer. Maintenance **recurrence** must be set to repeat at least once a day. 

    :::image type="content" source="media/virtual-machine-scale-sets-maintenance-control-portal/maintenance-configurations-schedule-tab.png" alt-text="Screenshot showing Maintenance Configuration schedule":::

1. In the Assignment tab, assign resources now or skip this step and assign resources after the maintenance configuration deployment. Select **Next**.

1. Add tags and values. Select **Next**.
    
    :::image type="content" source="media/virtual-machine-scale-sets-maintenance-control-portal/maintenance-configurations-tags-tab.png" alt-text="Screenshot showing how to add tags to a maintenance configuration":::

1. Review the summary. Select **Create**.

1. After the deployment is complete, select **Go to resource**.


## Assign the configuration

On the details page of the maintenance configuration, select **Assignments** and then select **Assign resource**. 

![Screenshot showing how to assign a resource](media/virtual-machine-scale-sets-maintenance-control-portal/maintenance-configurations-add-assignment.png)

Select the Virtual Machine Scale Set resources that you want the maintenance configuration assigned to and select **Ok**.  


## Next steps

> [!div class="nextstepaction"]
> [Learn about Maintenance and updates for virtual machines running in Azure](maintenance-and-updates.md)
