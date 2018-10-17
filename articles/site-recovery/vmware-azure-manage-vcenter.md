---
title: ' Manage VMware vCenter servers in Azure Site Recovery | Microsoft Docs'
description: This article describes how add and manage VMware vCenter in Azure Site Recovery.
author: Rajeswari-Mamilla
ms.service: site-recovery
ms.devlang: na
ms.topic: conceptual
ms.date: 06/20/2018
ms.author: ramamill

---

# Manage VMware vCenter servers 

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

> [!NOTE]
If you need to modify the vCenter IP address, FQDN, or port, then you need to delete the vCenter server, and add it back to the portal.
