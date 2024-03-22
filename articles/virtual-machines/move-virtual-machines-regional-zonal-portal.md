---
title: Tutorial - Move Azure single instance Virtual Machines from regional to zonal availability zones
description: Learn how to move single instance Azure virtual machines from a regional configuration to a target Availability Zone within the same Azure region.
author: ankitaduttaMSFT
ms.service: virtual-machines
ms.topic: article
ms.date: 09/25/2023
ms.author: ankitadutta
---

# Move Azure single instance VMs from regional to zonal target availability zones

This article provides information on how to move Azure single instance Virtual Machines (VMs) from a regional to a zonal configuration within the same Azure region.

> [!IMPORTANT]
> Regional to zonal move of single instance VM(s) configuration is currently in *Public Preview*.
## Prerequisites

Ensure the following before you begin:

- **Availability zone regions support**: Ensure that the regions you want to move to are supported by Availability Zones. [Learn more](../reliability/availability-zones-service-support.md) about the supported regions.

- **VM SKU availability**: The availability of VM sizes, or SKUs, can differ based on the region and zone. Ensure to plan for the use of Availability Zones. [Learn more](../virtual-machines/windows/create-powershell-availability-zone.md#check-vm-sku-availability) about the available VM SKUs for each Azure region and zone. 

- **Subscription permissions**: Check that you have *Owner* access on the subscription containing the VMs that you want to move.
   The first time you add a VM to be moved to Zonal configuration, a [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) (formerly, Managed Service Identify (MSI)) that's trusted by the subscription is necessary. To create the identity, and to assign it the required role (Contributor or User Access administrator in the source subscription), the account you use to add resources needs Owner permissions on the subscription. [Learn more](../role-based-access-control/rbac-and-directory-admin-roles.md#azure-roles) about Azure roles.

- **VM support**: Check that the VMs you want to move are supported. [Learn more](../reliability/migrate-vm.md). Check supported VM settings.
      
- **Subscription quota**: The subscription must have enough quota to create the new VM and associated networking resources in target zonal configuration (in same region). If the subscription doesn't have enough quota, you need to [request additional limits](../azure-resource-manager/management/azure-subscription-service-limits.md). 
- **VM health status**: The VMs you want to move must be in a healthy state before attempting the  zonal move. Ensure that all pending reboots and mandatory updates are complete. 

## Select and move VMs

To select the VMs you want to move from Regional to Zonal configuration within same region, follow these steps:

### Select the VMs

To select the VMs for the move, follow these steps: 

1.	On the [Azure portal](https://ms.portal.azure.com/#home), select the VM. In this tutorial, we're using **DemoTestVM1** as an example.
    
    :::image type="content" source="./media/tutorial-move-regional-zonal/demo-test-machine.png" alt-text="Screenshot of demo virtual machine."::: 
 
2.	In the DemoTestVM1 resource pane, select **Availability + scaling** > **edit**. 
    :::image type="content" source="./media/tutorial-move-regional-zonal/availability-scaling.png" alt-text="Screenshot of Availability + scaling option."::: 

    Alternatively, in the **DemoTestVM1** overview plane, you can select **Availability + scale** > **Availability + scaling**.
        :::image type="content" source="./media/tutorial-move-regional-zonal/scaling-pane.png" alt-text="Screenshot of Availability + scaling pane."::: 
    
 
### Select the target availability zones

To select the target availability zones, follow these steps:

1.	Under **Target availability zone**, select the desired target availability zones for the VM. For example, Zone 1.
 
    :::image type="content" source="./media/tutorial-move-regional-zonal/availability-scaling-home.png" alt-text="Screenshot of Availability + scaling homepage."::: 
    
    >[!Important]
    >If you select an unsupported VM to move, the validation fails. In this case, you must restart the workflow with the correct selection of VM. Refer to the [Support Matrix](../reliability/migrate-vm.md#support-matrix) to learn more about unsupported VMs type.

1. If Azure recommends optimizing the VM size, you must select the appropriate VM size that can increase the chances of successful deployment in the selected zone. Alternatively, you can also change the zone while keeping the same source VM size. 
   
    :::image type="content" source="./media/tutorial-move-regional-zonal/aure-recommendation.png" alt-text="Screenshot showing Azure recommendation to increase virtual machine size.":::

1.	Select the consent statement for **System Assigned Managed Identity** process then select **Next**.

    :::image type="content" source="./media/tutorial-move-regional-zonal/move-virtual-machine-availability-zone.png" alt-text="Screenshot of select target availability zone."::: 
   
    The MSI authentication process takes a few minutes to complete. During this time, the updates on the progress are displayed on the screen.
  
###  Review the properties of the VM
 
To review the properties of the VM before you commit the move, follow these steps: 

1.	On the **Review properties** pane, review the VM properties.
    
    #### VM properties 
    
    Find more information on the impact of the move on the VM properties. 
    
    **The following source VM properties are retained in the target zonal VM by default:**
    
    | Property | Description |
    | --- | --- |
    | VM name | Source VM name is retained in the target zonal VM by default. |
    | VNET | By default, the source VNET is retained and target zonal VM is created within the same VNET. You can also create a new VNET or choose an existing from target zonal configuration. |
    | Subnet | By default, the source subnet is retained, and the target zonal virtual machine is created within the same subnet. You can create a new subnet or choose an existing from target zonal configuration. |
    | NSG | Source NSG is retained by default and target zonal VM are created within the same NSG. You can create a new NSG or choose an existing from target zonal configuration. |
    | Load balancer (Standard SKU) | Standard SKU Load balance supports target zonal configuration and are retained. |
    | Public IP (Standard SKU) | Standard SKU PIP supports target zonal configuration and are retained. |
    
    **The following source VM properties are created in the target zonal VM by default:**
    
    | Property | Description |
    | --- | --- |
    | VM | A copy of the source VM is created in the target zonal configuration. The source VM is left intact and stopped after the move. <br> Source VM ARM ID is not retained. |
    | Resource group | By default, a new resource group is created as the source resource group can't be utilized. This is because we're using the same source VM name in the target zone, it is not possible to have two identical VMs in the same resource group. <br> However, you can move the VM to an existing resource group in the target zone. |
    | NIC | A new NIC is created in the target zonal configuration. The source NIC is left intact and stopped after the move. <br> Source NIC ARM ID is not retained. |
    | Disks | The disks attached to the source VM are recreated with a new disk name in the target zonal configuration and is attached to the newly created zonal VM.|
    | Load balancer (Basic SKU) | Basic SKU Load balance won't support target zonal configuration and hence isn't retained. <br> A new Standard SKU Load balancer is created by default. <br> However, you can still edit the load balancer properties, or you can select an existing target load balancer as well.|
    | Public IP (Basic SKU) | Basic SKU Public IPs won't be retained after the move as they don't support target zonal configurations. <br> By default, a new Standard SKU Public IP is created. <br> However, you can still edit the Public IP properties or you can select an existing target Public IP as well.|

2.	Review and fix if there are any errors.  
 
3.	Select the consent statement at the bottom of the page before moving the resources.
        :::image type="content" source="./media/tutorial-move-regional-zonal/migrate-vms.png" alt-text="Screenshot of migrating virtual machine page.":::
 
### Move the VMs

Select **Move** to complete the move to Availability zones.

:::image type="content" source="./media/tutorial-move-regional-zonal/move-completed.png" alt-text="Screenshot of move completion page.":::

During this process:
*    The source virtual machine is stopped hence, there's a brief downtime.
*    A copy of the source VM is created in the target zonal configuration and the new virtual machine is up and running.

### Configure settings post move

Review all the source VM settings and reconfigure extensions, RBACs, Public IPs, Backup/DR etc. as desired.

### Delete source VM

The source VM remains in a stopped mode after the move is complete. You can choose to either delete it or use it for another purpose, based on your requirements.

## Delete additional resources created for move

After the move, you can manually delete the move collection that was created.

To manually remove the move collection that was made, follow these steps:

1.	Ensure you can view hidden resources as the move collection is hidden by default.
2.	Select the Resource group of the move collection using the search string *ZonalMove-MC-RG-SourceRegion*.
3.	Delete the move collection. For example, *ZonalMove-MC-RG-UKSouth*.


> [!NOTE]
> The move collection is hidden and must be turned on to view it.

## Next steps

Learn how to move single instance Azure VMs from regional to zonal configuration using [PowerShell or CLI](./move-virtual-machines-regional-zonal-powershell.md).
