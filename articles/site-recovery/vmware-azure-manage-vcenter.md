---
title: Manage VMware vCenter servers in Azure Site Recovery
description: This article describes how to add and manage VMware vCenter for disaster recovery of VMware VMs to Azure with  Azure Site Recovery.
services: site-recovery
author: ankitaduttaMSFT
manager: gaggupta
ms.service: site-recovery
ms.topic: conceptual
ms.author: ankitadutta
ms.date: 05/27/2021
---

# Manage VMware vCenter Server

This article summarizes management actions on a VMware vCenter Server in [Azure Site Recovery](site-recovery-overview.md).

## Verify prerequisites for vCenter Server

The prerequisites for vCenter Servers and VMs during disaster recovery of VMware VMs to Azure are listed in the [support matrix](vmware-physical-azure-support-matrix.md#replicated-machines).

## Set up an account for automatic discovery

When you set up disaster recovery for on-premises VMware VMs, Site Recovery needs access to the vCenter Server/vSphere host. The Site Recovery process server can then automatically discover VMs, and fail them over as needed. By default, the process server runs on the Site Recovery configuration server. Add an account for the configuration server to connect to the vCenter Server/vSphere host as follows:

1. Sign in to the configuration server.
1. Open the configuration server tool (_cspsconfigtool.exe_) using the Desktop shortcut.
1. On the **Manage Account** tab, click **Add Account**.

   ![add-account](./media/vmware-azure-manage-vcenter/addaccount.png)

1. Provide the account details, and click **OK** to add it. The account should have the privileges summarized in the account permissions table.

   > [!NOTE]
   > It takes about 15 minutes to synchronize account information with Site Recovery.

### Account permissions

|**Task** | **Account** | **Permissions** | **Details**|
|--- | --- | --- | ---|
|**VM discovery/migration (without failback)** | At least a read-only user account. | Data Center object –> Propagate to Child Object, role=Read-only | User assigned at datacenter level, and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object, to the child objects (vSphere hosts, datastores, virtual machines, and networks).|
|**Replication/failover** | At least a read-only user account. | Data Center object –> Propagate to Child Object, role=Read-only | User assigned at datacenter level, and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object to the child objects (vSphere hosts, datastores, virtual machines, and networks).<br/><br/> Useful for migration purposes, but not full replication, failover, failback.|
|**Replication/failover/failback** | We suggest you create a role (AzureSiteRecoveryRole) with the required permissions, and then assign the role to a VMware user or group. | Data Center object –> Propagate to Child Object, role=AzureSiteRecoveryRole<br/><br/> Datastore -> Allocate space, browse datastore, low-level file operations, remove file, update virtual machine files<br/><br/> Network -> Network assign<br/><br/> Resource -> Assign VM to resource pool, migrate powered off VM, migrate powered on VM<br/><br/> Tasks -> Create task, update task<br/><br/> Virtual machine -> Configuration<br/><br/> Virtual machine -> Interact -> answer question, device connection, configure CD media, configure floppy media, power off, power on, VMware tools install<br/><br/> Virtual machine -> Inventory -> Create, register, unregister<br/><br/> Virtual machine -> Provisioning -> Allow virtual machine download, allow virtual machine files upload<br/><br/> Virtual machine -> Snapshots -> Remove snapshots | User assigned at datacenter level, and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object, to the child objects (vSphere hosts, datastores, virtual machines, and networks).|

## Add VMware server to the vault

When you set up disaster recovery for on-premises VMware VMs, you add the vCenter Server/vSphere host on which you're discovering VMs to the Site Recovery vault, as follows:

1. In vault > **Site Recovery Infrastructure** > **Configuration Severs**, open the configuration server.
1. In **Details** page, click **vCenter**.
1. In **Add vCenter**, specify a friendly name for the vSphere host or vCenter server.
1. Specify the IP address or FQDN of the server.
1. Leave the port as 443 unless your VMware servers are configured to listen for requests on a different port.
1. Select the account used to connect to the VMware vCenter or vSphere ESXi server. Then click **OK**.

## Modify credentials

If necessary, you can modify the credentials used to connect to the vCenter Server/vSphere host as follows:

1. Sign in to the configuration server.
1. Open the configuration server tool (_cspsconfigtool.exe_) using the Desktop shortcut.
1. Click **Add Account** on the **Manage Account** tab.

   ![add-account](./media/vmware-azure-manage-vcenter/addaccount.png)

1. Provide the new account details, and click **OK**. The account needs the permissions listed in the [account permissions](#account-permissions) table.
1. In the vault > **Site Recovery Infrastructure** > **Configuration Severs**, open the configuration server.
1. In **Details**, click **Refresh Server**.
1. After the Refresh Server job finishes, select the vCenter Server.
1. In **Summary**, select the newly added account in **vCenter server/vSphere host account**, and click **Save**.

   ![modify-account](./media/vmware-azure-manage-vcenter/modify-vcente-creds.png)

## Delete a vCenter Server

1. In the vault > **Site Recovery Infrastructure** > **Configuration Severs**, open the configuration server.
1. On the **Details** page, select the vCenter server.
1. Click on the **Delete** button.

   ![delete-account](./media/vmware-azure-manage-vcenter/delete-vcenter.png)

## Modify the IP address and port

You can modify the IP address of the vCenter Server, or the ports used for communication between the server and Site Recovery. By default, Site Recovery accesses vCenter Server/vSphere host information through port 443.

1. In the vault > **Site Recovery Infrastructure** > **Configuration Servers**, click on the configurations server to which the vCenter Server is added.
1. In **vCenter servers**, click on the vCenter Server you want to modify.
1. In **Summary**, update the IP address and port, and save the changes.

   ![add_ip_new_vcenter](media/vmware-azure-manage-vcenter/add-ip.png)

1. For changes to become effective, wait for 15 minutes or [refresh the configuration server](vmware-azure-manage-configuration-server.md#refresh-configuration-server).

## Migrate all VMs to a new server

If you want to migrate all VMs to use a new vCenter Server, you just need to update the IP address assigned to the vCenter Server. Don't add another VMware account, since that might lead to duplicate entries. Update the address as follows:

1. In the vault > **Site Recovery Infrastructure** > **Configuration Servers**, click on the configurations server to which the vCenter Server is added.
1. In the **vCenter servers** section, click on the vCenter Server that you want to migrate from.
1. In **Summary**, update the IP address to that of the new vCenter Server, and save the changes.
1. As soon as the IP address is updated, Site Recovery starts receiving VM discovery information from the new vCenter Server. This doesn't impact ongoing replication activities.

## Migrate a few VMs to a new server

If you only want to migrate a few of your replicating VMs to a new vCenter Server, do the following:

1. [Add](#add-vmware-server-to-the-vault) the new vCenter Server to the configuration server.
1. [Disable replication](site-recovery-manage-registration-and-protection.md#disable-protection-for-a-vmware-vm-or-physical-server-vmware-to-azure) for VMs that will move to the new server.
1. In VMware, migrate the VMs to the new vCenter Server.
1. [Enable replication](vmware-azure-tutorial.md#enable-replication) for the migrated VMs again, selecting the new vCenter Server.

## Migrate most VMs to a new server

If the number of VMs that you want to migrate to a new vCenter Server is higher than the number of VMs that will remain on the original vCenter Server, do the following:

1. [Update the IP address](#modify-the-ip-address-and-port) assigned to the vCenter Server in the configuration server settings, to the address of the new vCenter Server.
1. [Disable replication](site-recovery-manage-registration-and-protection.md#disable-protection-for-a-vmware-vm-or-physical-server-vmware-to-azure) for the few VMs that remain on the old server.
1. [Add the old vCenter Server](#add-vmware-server-to-the-vault) and its IP address to the configuration server.
1. [Re-enable replication](vmware-azure-tutorial.md#enable-replication) for the VMs that remain on the old server.

## Next steps

If you have any issues, see [Troubleshoot vCenter Server discovery failures](vmware-azure-troubleshoot-vcenter-discovery-failures.md).
