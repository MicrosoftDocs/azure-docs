---
title: Remove an Azure Site Recovery replication appliance
description: Learn how to remove an Azure Site Recovery replication appliance using the Azure portal.
author: ankitaduttaMSFT
ms.service: azure-site-recovery
ms.topic: how-to
ms.date: 07/04/2024
ms.author: ankitadutta
---

# How to Delete the Replication Appliance


## Overview

The Azure Site Recovery replication appliance is a virtual machine that runs on-premises and replicates data from your on-premises servers to Azure for disaster recovery purposes. You can delete the appliance from the Azure portal, when you no longer need it. 

This article provides a step-by-step guide for removing the Azure Site Recovery replication appliance from the Azure portal.


## Before you begin

There are two ways to remove the replication appliance: **delete** and **reset**. If all the components of the appliance are in a healthy state and the appliance is still accessible, you're allowed to only *reset* the appliance. Resetting moves the appliance to its factory state, enabling it to be associated with any Recovery Service vault again. 

If all the appliance components are in a critical state and there's no connectivity with the appliance, it can be *deleted* from the Azure portal. Before deleting the Recovery Services vault, you must also *remove infrastructure* to ensure that all the resources created in the background for replication and appliance registration are also removed. However, before you delete the Azure Site Recovery replication appliance, you must complete some preparatory steps to avoid errors.


## Prerequisites

Before you delete the Azure Site Recovery replication appliance, ensure that you *disable replication of all servers* using the Azure Site Recovery replication appliance. To do this, go to Azure portal, select the Recovery Services vault > *Replicated items* blade. Select the servers you want to stop replicating, select **Stop replication**, and confirm the action.


## Verify account permissions

If you just created your free Azure account, you're the administrator of your subscription and you have the permissions you need. If you're not the subscription administrator, work with the administrator to assign the permissions you need. To enable replication for a new virtual machine, you must have permission to:

- Create a virtual machine in the selected resource group.
- Create a virtual machine in the selected virtual network.
- Write to an Azure storage account.
- Write to an Azure managed disk.

To complete these tasks your account should be assigned the Virtual Machine Contributor built-in role. In addition, to manage Site Recovery operations in a vault, your account should be assigned the Site Recovery Contributor built-in role.

## VMware account permissions

**Task** | **Role/Permissions** | **Details**
--- | --- | ---
**VM discovery** | At least a read-only user<br/><br/> Data Center object –> Propagate to Child Object, role=Read-only | User assigned at datacenter level, and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object, to the child objects (vSphere hosts, datastores, VMs and networks).
**Full replication, failover, failback** |  Create a role (Azure_Site_Recovery) with the required permissions, and then assign the role to a VMware user or group<br/><br/> Data Center object –> Propagate to Child Object, role=Azure_Site_Recovery<br/><br/> Datastore -> Allocate space, browse datastore, low-level file operations, remove file, update virtual machine files<br/><br/> Network -> Network assign<br/><br/> Resource -> Assign VM to resource pool, migrate powered off VM, migrate powered on VM<br/><br/> Tasks -> Create task, update task<br/><br/> Virtual machine -> Configuration<br/><br/> Virtual machine -> Interact -> answer question, device connection, configure CD media, configure floppy media, power off, power on, VMware tools install<br/><br/> Virtual machine -> Inventory -> Create, register, unregister<br/><br/> Virtual machine -> Provisioning -> Allow virtual machine download, allow virtual machine files upload<br/><br/> Virtual machine -> Snapshots -> Remove snapshots, Create snapshots | User assigned at datacenter level, and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object, to the child objects (vSphere hosts, datastores, VMs and networks).

## Delete an unhealthy appliance

You can only delete the Azure Site Recovery replication appliance from the Azure portal if all components are in a critical state and the appliance is no longer accessible.

> [!IMPORTANT]
> The appliance must be unhealthy (in a critical state) for at least 30 minutes before it is eligible for deletion. If the appliance is healthy, you can only reset it. Ensure that you have disabled replication for all servers before deleting the appliance.


To delete an appliance, follow these steps:

1. Sign in to the Azure portal.
2. Go to the *Recovery Services vault* > *Site Recovery infrastructure* (under **Manage**), select Azure Site Recovery *replication appliances* under **For VMware & Physical machines**.
3. For the Azure Site Recovery replication appliance you want to delete, select **Delete** from its menu.

    :::image type="content" source="./media/delete-appliance/delete.png" alt-text="Screenshot of Site Recovery appliance page.":::

1. Confirm that no replicated items are associated with the replication appliance. If there are replicated items associated, a pop-up appears to block the appliance deletion.

    :::image type="content" source="./media/delete-appliance/notification.png" alt-text="Screenshot of pop-up notification.":::

1. If no replicated items are associated with the appliance, a pop-up appears to inform you about the Microsoft Entra ID Apps that must be deleted. Note these App IDs and proceed with deletion.


### Post delete appliance

After successfully deleting the Azure Site Recovery replication appliance, you can:

- Free up resources used by the Azure Site Recovery replication appliance, such as the storage account, network interface, and public IP address.
- Delete the Recovery Services vault if it is no longer needed.
- Remove Microsoft Entra Apps with the Azure Site Recovery replication appliance. To do this, go to Azure portal > *Microsoft Entra ID* > *App registrations* under the *Manage* blade. Select the app that you should delete, and select **Delete** then confirm the action. You can learn the app names by following the steps [here](#delete-an-unhealthy-appliance).


## Reset a healthy appliance

You can only reset the Azure Site Recovery replication appliance if all components are in a healthy state. To reset the appliance, follow these steps:

1. On the Azure portal, go to the appliance you want to reset. 
    Ensure that no replicated items are associated with this appliance.
1. On **Microsoft Azure Appliance Configuration Manager**, go to the *Reset appliance* section and select **Reset**.
1. If no machines are associated with the appliance, the reset begins.
1. Once completed successfully, ensure the following:
   - Open `Services.msc` and restart the service `World Wide Web Publishing Service`.
   - Clear the cache for Microsoft Edge or other browsers being used. Restart the browser after the cache cleanup. Learn more [here](https://www.microsoft.com/edge/learning-center/how-to-manage-and-clear-your-cache-and-cookies).
   - Restart the machine.


## Next steps

In this article, you learned how to delete the Azure Site Recovery replication appliance from the Azure portal. You can now free up the associated resources and delete the Recovery Services vault as needed.