---
title: Maintenance control for Azure virtual machines using the Azure portal 
description: Learn how to control when maintenance is applied to your Azure VMs using Maintenance control and the Azure portal.
author: cynthn
ms.service: virtual-machines
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 04/22/2020
ms.author: cynthn
#pmcontact: shants
---

# Control updates with Maintenance Control and the Azure portal

Maintenance control lets you decide when to apply updates to your isolated VMs and Azure dedicated hosts. This topic covers the Azure portal options for Maintenance control. For more about benefits of using Maintenance control, its limitations, and other management options, see [Managing platform updates with Maintenance Control](maintenance-control.md).

## Create a maintenance configuration

1. Sign in to the Azure portal.

1. Search for **Maintenance Configurations**.

   ![Screenshot showing how to open Maintenance Configurations](media/virtual-machines-maintenance-control-portal/maintenance-configurations-search.png)

1. Click **Add**.

   ![Screenshot showing how to add a maintenance configuration](media/virtual-machines-maintenance-control-portal/maintenance-configurations-add.png)

1. Choose a subscription and resource group, provide a name for the configuration, and choose a region. Click **Next**.

   ![Screenshot showing Maintenance Configuration basics](media/virtual-machines-maintenance-control-portal/maintenance-configurations-basics.png)

1. Add tags and values. Click **Next**.

   ![Screenshot showing how to add tags to a maintenance configuration](media/virtual-machines-maintenance-control-portal/maintenance-configurations-tags.png)

1. Review the summary. Click **Create**.

   ![Screenshot showing how to create a maintenance configuration](media/virtual-machines-maintenance-control-portal/maintenance-configurations-create.png)

1. After the deployment is complete, click **Go to resource**.

   ![Screenshot showing Maintenance Configuration deployment complete](media/virtual-machines-maintenance-control-portal/maintenance-configurations-deployment-complete.png)

## Assign the configuration

On the details page of the maintenance configuration, click Assignments and then click **Assign resource**. 

![Screenshot showing how to assign a resource](media/virtual-machines-maintenance-control-portal/maintenance-configurations-add-assignment.png)

Select the resources that you want the maintenance configuration assigned to and click **Ok**. The **Type** column shows whether the resource is an isolated VM or Azure dedicated host. The VM needs to be running to assign the configuration. An error occurs if you try to assign a configuration to a VM that is stopped. 

<!---Shantanu to add details about the error case--->

![Screenshot showing how to select a resource](media/virtual-machines-maintenance-control-portal/maintenance-configurations-select-resource.png)

## Check configuration

You can verify that the configuration was applied correctly or check to see any maintenance configuration that is currently assigned using **Maintenance Configurations**. The **Type** column shows whether the configuration is assigned to an isolated VM or Azure dedicated host. 

![Screenshot showing how to check a maintenance configuration](media/virtual-machines-maintenance-control-portal/maintenance-configurations-host-type.png)

You can also check the configuration for a specific virtual machine on its properties page. Click **Maintenance** to see the configuration assigned to that virtual machine.

![Screenshot showing how to check Maintenance for a host](media/virtual-machines-maintenance-control-portal/maintenance-configurations-check-config.png)

## Check for pending updates

There are also two ways to check if updates are pending for a maintenance configuration. In **Maintenance Configurations**, on the details for the configuration, click **Assignments** and check **Maintenance status**.

![Screenshot showing how to check pending updates](media/virtual-machines-maintenance-control-portal/maintenance-configurations-pending.png)

You can also check a specific host using **Virtual Machines** or properties of the dedicated host. 

![Screenshot showing how to check Maintenance for a host](media/virtual-machines-maintenance-control-portal/maintenance-configurations-pending-vm.png)

## Apply updates

You can apply pending updates on demand using **Virtual Machines**. On the VM details, click **Maintenance** and click **Apply maintenance now**.

![Screenshot showing how to apply pending updates](media/virtual-machines-maintenance-control-portal/maintenance-configurations-apply-updates-now.png)

## Check the status of applying updates 

You can check on the progress of the updates for a configuration in **Maintenance Configurations** or using **Virtual Machines**. On the VM details, click **Maintenance**. In the following example, the **Maintenance state** shows an update is **Pending**.

![Screenshot showing how to check status of pending updates](media/virtual-machines-maintenance-control-portal/maintenance-configurations-status.png)

## Delete a maintenance configuration

To delete a configuration, open the configuration details and click **Delete**.

![Screenshot showing how to check Maintenance for a host](media/virtual-machines-maintenance-control-portal/maintenance-configurations-delete.png)


## Next steps

To learn more, see [Maintenance and updates](maintenance-and-updates.md).
