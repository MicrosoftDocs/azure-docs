---
title: 'Replicate applications (VMware to Azure) | Microsoft Docs'
description: This article describes how to set up replication of virtual machines running on VMware into Azure.
services: site-recovery
documentationcenter: ''
author: asgang
manager: rochakm
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 06/05/2017
ms.author: asgang

---


# Replicate applications running on VMware VMs to Azure



This article describes how to set up replication of virtual machines running on VMware into Azure.
## Prerequisites

The article assumes that you have already

1.  [Setup on-premise source environment](site-recovery-set-up-vmware-to-azure.md)
2.  [Setup target environment in Azure](site-recovery-prepare-target-vmware-to-azure.md)


## Enable replication
#### Before you start
When replicating VMware virtual machines, note that:

* Your Azure user account needs to have certain [permissions](site-recovery-role-based-linked-access-control.md#permissions-required-to-enable-replication-for-new-virtual-machines) to enable replication of a new virtual machine to Azure.
* VMware VMs are discovered every 15 minutes. It might take 15 minutes or longer for them to appear in the portal after discovery. Likewise discovery can take 15 minutes or more when you add a new vCenter server or vSphere host.
* Environment changes on the virtual machine (such as VMware tools installation) can take 15 minutes or more to be updated in the portal.
* You can check the last discovered time for VMware VMs in the **Last Contact At** field for the vCenter server/vSphere host, on the **Configuration Servers** blade.
* To add machines for replication without waiting for the scheduled discovery, highlight the configuration server (don’t click it), and click the **Refresh** button.
* When you enable replication, if the machine is prepared, the process server automatically installs the Mobility service on it.


**Now enable replication as follows**:

1. Click **Step 2: Replicate application** > **Source**. After you've enabled replication for the first time, click **+Replicate** in the vault to enable replication for additional machines.
2. In the **Source** blade > **Source**, select the configuration server.
3. In **Machine type**, select **Virtual Machines** or **Physical Machines**.
4. In **vCenter/vSphere Hypervisor**, select the vCenter server that manages the vSphere host, or select the host. This setting isn't relevant if you're replicating physical machines.
5. Select the process server. If you haven't created any additional process servers this will be the name of the configuration server. Then click **OK**.

    ![Enable replication](./media/site-recovery-vmware-to-azure/enable-replication2.png)

6. In **Target** select the subscription and the resource group where you want to create the failed over virtual machines. Choose the deployment model that you want to use in Azure (classic or resource management) for the failed over virtual machines.
7. Select the Azure storage account you want to use for replicating data. Note that:

   * You can select a premium or standard storage account. If you select a premium account, you'll need to specify an additional standard storage account for ongoing replication logs. Accounts must be in the same region as the Recovery Services vault.
   * If you want to use a different storage account than those you have, you can create one*PLaceholder LInk for creating storage account using resource manager which will be covered in getting started*. To create a storage account using Resource Manager, click **Create new**. If you want to create a storage account using the classic model, you do that [in the Azure portal](../storage/storage-create-storage-account-classic-portal.md).

8. Select the Azure network and subnet to which Azure VMs will connect, when they're spun up after failover. The network must be in the same region as the Recovery Services vault. Select **Configure now for selected machines**, to apply the network setting to all machines you select for protection. Select **Configure later** to select the Azure network per machine. If you don't have a network, you need to [create one](#set-up-an-azure-network). To create a network using Resource Manager, click **Create new**. If you want to create a network using the classic model, do that [in the Azure portal](../virtual-network/virtual-networks-create-vnet-classic-pportal.md). Select a subnet if applicable. Then click **OK**.

    ![Enable replication](./media/site-recovery-vmware-to-azure/enable-rep3.png)
9. In **Virtual Machines** > **Select virtual machines**, click and select each machine you want to replicate. You can only select machines for which replication can be enabled. Then click **OK**.

    ![Enable replication](./media/site-recovery-vmware-to-azure/enable-replication5.png)
10. In **Properties** > **Configure properties**, select the account that will be used by the process server to automatically install the Mobility service on the machine.  
11. By default all disks are replicated. To exclude disks from replication, click **All Disks** and clear any disks you don't want to replicate.  Then click **OK**. You can set additional properties later. [Learn more](site-recovery-exclude-disk.md) about excluding disks.

    ![Enable replication](./media/site-recovery-vmware-to-azure/enable-replication6.png)

12. In **Replication settings** > **Configure replication settings**, verify that the correct replication policy is selected. You can modify replication policy settings in **Settings** > **Replication policies** > policy name > **Edit Settings**. Changes you apply to a policy will be applied to replicating and new machines.
13. Enable **Multi-VM consistency** if you want to gather machines into a replication group, and specify a name for the group. Then click **OK**. Note that:

    * Machines in replication group replicate together and have shared crash-consistent and app-consistent recovery points when they fail over.
    * We recommend that you gather VMs and physical servers together so that they mirror your workloads. Enabling multi-VM consistency can impact workload performance and should only be used if machines are running the same workload and you need consistency.

    ![Enable replication](./media/site-recovery-vmware-to-azure/enable-replication7.png)
14. Click **Enable Replication**. You can track progress of the **Enable Protection** job in **Settings** > **Jobs** > **Site Recovery Jobs**. After the **Finalize Protection** job runs the machine is ready for failover.

> [!NOTE]
> If the machine is prepared for push installation the Mobility service component will be installed when protection is enabled. After the component is installed on the machine a protection job starts and fails. After the failure you need to manually restart each machine. After the restart the protection job begins again and initial replication occurs.
>
>

## View and manage VM properties

We recommend that you verify the properties of the source machine. Remember that the Azure VM name should conform with [Azure virtual machine requirements](site-recovery-support-matrix-to-azure.md#failed-over-azure-vm-requirements).

1. Click **Settings** > **Replicated items** >, and select the machine. The **Essentials** blade shows information about machines settings and status.
2. In **Properties**, you can view replication and failover information for the VM.
3. In **Compute and Network** > **Compute properties**, you can specify the Azure VM name and target size. Modify the name to comply with Azure requirements if you need to.
    ![Enable replication](./media/site-recovery-vmware-to-azure/VMProperties_AVSET.png)
 
4.  You can select a [resource group](https://docs.microsoft.com/azure/virtual-machines/windows/infrastructure-resource-groups-guidelines) of which machine will become part of  post fail over. You can change this setting any time before fail over. Post fail over, if you migrate the machine to a different resource group then protection settings of a machine will break.
5. You can select an [availability set](https://docs.microsoft.com/azure/virtual-machines/windows/infrastructure-availability-sets-guidelines) if your machine required to be be a part of one post fail over. While selecting availability set, please keep in mind that:

    * Only availability sets belonging to the specified resource group will be listed  
    * Machines with different virtual networks cannot be a part of same availability set
    * Only virtual machines of same size can be a part of same availability set
5. You can also view and add information about the target network, subnet, and IP address that will be assigned to the Azure VM.
6. In **Disks**, you can see the operating system and data disks on the VM that will be replicated.

### Network adapters and IP addressing 

- You can set the target IP address. If you don't provide an address, the failed over machine will use DHCP. If you set an address that isn't available at failover, the failover won't work. The same target IP address can be used for test failover if the address is available in the test failover network.
- The number of network adapters is dictated by the size you specify for the target virtual machine, as follows:
    - If the number of network adapters on the source machine is less than or equal to the number of adapters allowed for the target machine size, then the target will have the same number of adapters as the source.
    - If the number of adapters for the source virtual machine exceeds the number allowed for the target size then the target size maximum will be used.
    - For example if a source machine has two network adapters and the target machine size supports four, the target machine will have two adapters. If the source machine has two adapters but the supported target size only supports one then the target machine will have only one adapter.
    - If the virtual machine has multiple network adapters they will all connect to the same network.
    - If the virtual machine has multiple network adapters then the first one shown in the list becomes the *Default* network adapter in the Azure virtual machine.
   



## Common issues

* Each disk should be less than 1TB in size.
* The OS disk should be a basic disk and not dynamic disk
* For generation 2/UEFI enabled virtual machines, the operating system family should be Windows and boot disk should be less than 300GB

## Next steps

Once the protection is completed, you can try [fail over](site-recovery-failover.md) to check whether your application comes up in Azure or not.

In case you want to disable protection, check how to [clean registration and protection settings](site-recovery-manage-registration-and-protection.md)
