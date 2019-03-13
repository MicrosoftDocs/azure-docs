---
title: Manage VMware vCenter servers for disaster recovery of VMware VMs to Azure using Azure Site Recovery | Microsoft Docs'
description: This article describes how add and manage VMware vCenter for disaster recovery of VMware VMs to Azure with  Azure Site Recovery.
author: Rajeswari-Mamilla
ms.service: site-recovery
ms.topic: conceptual
ms.date: 03/13/2019
ms.author: ramamill

---

# Manage VMware vCenter server

This article discusses the various Site Recovery operations that can be performed on a VMware vCenter. Verify the [prerequisites](vmware-physical-azure-support-matrix.md#replicated-machines) before you start.


## Set up an account for automatic discovery

Site Recovery needs access to VMware for the process server to automatically discover virtual machines, and for failover and failback of virtual machines. Create an account for access as follows:

1. Log onto the configuration server machine.
2. Open the launch the cspsconfigtool.exe using the Desktop shortcut.
3. Click **Add Account** on the **Manage Account** tab.

  ![add-account](./media/vmware-azure-manage-vcenter/addaccount.png)
1. Provide the account details, and click **OK** to add it.  The account should have the privileges summarized in the following table. 

It takes about 15 minutes for the account information to be synced up with the Site Recovery service.

### Account permissions

|**Task** | **Account** | **Permissions** | **Details**|
|--- | --- | --- | ---|
|**Automatic discovery/Migrate (without failback)** | You need at least a read-only user | Data Center object –> Propagate to Child Object, role=Read-only | User assigned at datacenter level, and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object, to the child objects (vSphere hosts, datastores, virtual machines, and networks).|
|**Replication/Failover** | You need at least a read-only user| Data Center object –> Propagate to Child Object, role=Read-only | User assigned at datacenter level, and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object to the child objects (vSphere hosts, datastores, virtual machines, and networks).<br/><br/> Useful for migration purposes, but not full replication, failover, failback.|
|**Replication/failover/failback** | We suggest you create a role (AzureSiteRecoveryRole) with the required permissions, and then assign the role to a VMware user or group | Data Center object –> Propagate to Child Object, role=AzureSiteRecoveryRole<br/><br/> Datastore -> Allocate space, browse datastore, low-level file operations, remove file, update virtual machine files<br/><br/> Network -> Network assign<br/><br/> Resource -> Assign VM to resource pool, migrate powered off VM, migrate powered on VM<br/><br/> Tasks -> Create task, update task<br/><br/> Virtual machine -> Configuration<br/><br/> Virtual machine -> Interact -> answer question, device connection, configure CD media, configure floppy media, power off, power on, VMware tools install<br/><br/> Virtual machine -> Inventory -> Create, register, unregister<br/><br/> Virtual machine -> Provisioning -> Allow virtual machine download, allow virtual machine files upload<br/><br/> Virtual machine -> Snapshots -> Remove snapshots | User assigned at datacenter level, and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object, to the child objects (vSphere hosts, datastores, virtual machines, and networks).|


## Add VMware server to the vault

1. On the Azure portal, open your vault > **Site Recovery Infrastructure** > **Configuration Severs**, and open the configuration server.
2. On the **Details** page, click **+vCenter**.

[!INCLUDE [site-recovery-add-vcenter](../../includes/site-recovery-add-vcenter.md)]

## Modify credentials

Modify the credentials used to connect to the vCenter server or ESXi host as follows:

1. Log onto the configuration server, and launch the cspsconfigtool.exe from the desktop.
2. Click **Add Account** on the **Manage Account** tab.

  ![add-account](./media/vmware-azure-manage-vcenter/addaccount.png)
3. Provide the new account details, and click **OK** to add it. The account should have the privileges listed [above](#account-permissions).
4. On the Azure portal, open the vault > **Site Recovery Infrastructure** > **Configuration Severs**, and open the configuration server.
5. In the **Details** page, click **Refresh Server**.
6. After the Refresh Server job completes, select the vCenter Server, to open the vCenter **Summary** page.
7. Select the newly added account in the **vCenter server/vSphere host account** field, and click **Save**.

    ![modify-account](./media/vmware-azure-manage-vcenter/modify-vcente-creds.png)

## Delete a vCenter server

1. In the Azure portal, open your vault > **Site Recovery Infrastructure** > **Configuration Severs**, and open the configuration server.
2. On the **Details** page, select the vCenter server.
3. Click on the **Delete** button.

  ![delete-account](./media/vmware-azure-manage-vcenter/delete-vcenter.png)

## Modify vCenter IP address, port

1. Sign in to Azure Portal.
2. Navigate to **Recovery Services vault** > **Site Recovery Infrastructure** > **Configuration Servers**.
3. Click on respective configuration server to which the vCenter is assigned to.
4. Under **vCenter servers** section, click on the respective vCenter.
5. On vCenter summary page, update the IP address/port of vCenter in respective fields and save.

![Add_IP_new_vCenter](media/vmware-azure-manage-vcenter/Add_IP.png)

6. For changes to become effective wait for 15 minutes or [refresh the configuration server](vmware-azure-manage-configuration-server.md#refresh-configuration-server).

## Migrate ALL protected virtual machines to a new vCenter

For migration of all virtual machines to the new vCenter, do not add another vCenter account. This can lead to duplicate entries. Just update the IP address of new vCenter by following the guidelines below.

1. Sign in to Azure Portal.
2. Navigate to **Recovery Services vault** > **Site Recovery Infrastructure** > **Configuration Servers**.
3. Click on respective configuration server to which the old vCenter is assigned to.
4. Under **vCenter servers** section, click on the vCenter you are planning to migrate from.
5. On vCenter summary page, update the IP address of new vCenter in the field "vCenter server/vSphere hostname or IP address" and save.

As soon as the IP address is updated, Site Recovery components will start receiving discovery information of virtual machines from new vCenter. This will not impact the ongoing replication activities.

## Migrate FEW protected virtual machines to a new vCenter

> [!NOTE]
> This section is applicable only when you are migrating few of the protected virtual machines to a new vCenter. If you want protect new set of virtual machines from a new vCenter, [add new vCenter details to configuration server](#add-vmware-server-to-the-vault) and start with "[Enable protection](vmware-azure-tutorial.md#enable-replication)".

To move few virtual machines to a new vCenter, follow the below given steps

1. [Add new vCenter details to the configuration server](#add-vmware-server-to-the-vault)
2. [Disable replication of virtual machines](site-recovery-manage-registration-and-protection.md#disable-protection-for-a-vmware-vm-or-physical-server-vmware-to-azure) you are planning to migrate.
3. Complete the migration of selected virtual machines to new vCenter.
4. Now, protect migrated virtual machines by [selecting new vCenter during Enable protection](vmware-azure-tutorial.md#enable-replication).

> [!TIP]
> If the number of virtual machines being migrated is **higher** that the number of number of virtual machines retained in the old vCenter, update IP address of new vCenter using the instruction given [here](#modify-vcenter-ip-address-port). For the few virtual machines that are retained on old vCenter, [disable the replication](site-recovery-manage-registration-and-protection.md#disable-protection-for-a-vmware-vm-or-physical-server-vmware-to-azure); [add new vCenter details to configuration server](#add-vmware-server-to-the-vault) and start "[Enable protection](vmware-azure-tutorial.md#enable-replication)."