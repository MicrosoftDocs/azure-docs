---
title: Prepare Azure VMware Solution for disaster recovery to Azure Site Recovery
description: Learn how to prepare Azure VMware Solution servers for disaster recovery to Azure by using the Azure Site Recovery service.
author: ankitaduttaMSFT
manager: rochakm
ms.service: site-recovery
ms.topic: tutorial
ms.date: 08/29/2023
ms.author: ankitadutta
ms.custom: MVC, engagement-fy23
---
# Prepare Azure VMware Solution for disaster recovery to Azure Site Recovery

This tutorial describes how to prepare Azure VMware Solution servers for disaster recovery to Azure by using the [Azure Site Recovery](site-recovery-overview.md) service.

This is the second tutorial in a series that shows you how to set up disaster recovery to Azure for Azure VMware Solution virtual machines (VMs). In the first tutorial, you [set up the Azure components](avs-tutorial-prepare-azure.md) that you need for Azure VMware Solution disaster recovery.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Prepare an account on the vCenter server to automate VM discovery.
> * Prepare an account for automatic installation of the Mobility service on VMware vSphere VMs.
> * Review requirements and support for VMware vCenter servers and VMs.
> * Prepare to connect to Azure VMs after failover.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario. They use default options where possible, and they don't show all possible settings and paths.

## Prerequisites

Before you begin, make sure that you prepared Azure as described in the [first tutorial in this series](avs-tutorial-prepare-azure.md).

## Prepare an account for automatic discovery

Site Recovery needs access to Azure VMware Solution servers to:

* Automatically discover VMs. At least a read-only account is required.
* Orchestrate replication, failover, and failback. You need an account that can run operations such as creating and removing disks, and turning on VMs.

Create the account as follows:

1. To use a dedicated account, create a role at the vCenter server level. Give the role a name such as **Azure_Site_Recovery**.
2. Assign the role the permissions summarized in the following table.
3. Create a user on the vCenter server. Assign the role to the user.

Task | Role/Permissions | Details
--- | --- | ---
VM discovery | At least a read-only user<br/><br/> Data Center object > Propagate to Child Object, role=Read-only | User is assigned at the datacenter level and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object to the child objects (vSphere hosts, datastores, VMs, and networks).
Full replication, failover, failback |  Create a role (Azure_Site_Recovery) with the required permissions, and then assign the role to a VMware user or group<br/><br/> Data Center object > Propagate to Child Object, role=Azure_Site_Recovery<br/><br/> Datastore > Allocate space, browse datastore, low-level file operations, remove file, update virtual machine files<br/><br/> Network > Network assign<br/><br/> Resource > Assign VM to resource pool, migrate powered off VM, migrate powered on VM<br/><br/> Tasks > Create task, update task<br/><br/> Virtual machine > Configuration<br/><br/> Virtual machine > Interact > answer question, device connection, configure CD media, configure floppy media, power off, power on, VMware tools install<br/><br/> Virtual machine > Inventory > Create, register, unregister<br/><br/> Virtual machine > Provisioning > Allow virtual machine download, allow virtual machine files upload<br/><br/> Virtual machine > Snapshots > Remove snapshots | User is assigned at the datacenter level and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object to the child objects (vSphere hosts, datastores, VMs, and networks).

## Prepare an account for Mobility service installation

The Mobility service must be installed on machines that you want to replicate. Azure Site Recovery can do a push installation of this service when you enable replication for a machine. Or, you can install it manually or by using installation tools.

In this tutorial, you install the Mobility service by using the push installation. For this push installation, you need to prepare an account that Azure Site Recovery can use to access the VM. You specify this account when you set up disaster recovery in the Azure console.

To prepare the account with permissions to install on the VM, take one of the following actions, based on your operating system:

* For a Windows VM, if you're not using a domain account, disable remote access control on the local machine:
  1. In the registry, go to *HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System*.
  1. Add the `DWORD` entry `LocalAccountTokenFilterPolicy`, with a value of `1`.
* For a Linux VM, prepare a root account on the source Linux server.

## Check Azure VMware Solution requirements

Make sure that the VMware vCenter server and VMs comply with requirements:

* Verify [Azure VMware Solution software versions](../azure-vmware/concepts-private-clouds-clusters.md#vmware-software-versions).
* Verify [VMware vCenter server requirements](vmware-physical-azure-support-matrix.md#on-premises-virtualization-servers).
* For Linux VMs, check [file system and storage requirements](vmware-physical-azure-support-matrix.md#linux-file-systemsguest-storage).
* Check [network](vmware-physical-azure-support-matrix.md#network) and [storage](vmware-physical-azure-support-matrix.md#storage) support.
* Check what's supported for [Azure networking](vmware-physical-azure-support-matrix.md#azure-vm-network-after-failover), [storage](vmware-physical-azure-support-matrix.md#azure-storage), and [compute](vmware-physical-azure-support-matrix.md#azure-compute) after failover.
* Verify that the Azure VMware Solution VMs that you'll replicate to Azure comply with [Azure VM requirements](vmware-physical-azure-support-matrix.md#azure-vm-requirements).
* For Linux VMs, ensure that no two devices or mount points have the same names. These names must be unique and aren't case-sensitive. For example, you can't name two devices for the same VM as *device1* and *Device1*.

## Prepare to connect to Azure VMs after failover

After failover, you might want to connect to the Azure VMs from your Azure VMware Solution network.

### Connect to a Windows VM by using RDP

Before failover, enable Remote Desktop Protocol (RDP) on the Azure VMware Solution VM:

* For internet access:
  * Make sure that TCP and UDP rules are added for the **Public** profile.
  * Make sure that RDP is allowed in **Windows Firewall** > **Allowed Apps** for all profiles.
* For site-to-site VPN access:
  * Make sure that RDP is allowed in **Windows Firewall** > **Allowed apps and features** for **Domain and Private** networks.
  * Check that the operating system's SAN policy is set to **OnlineAll**. [Learn more](https://support.microsoft.com/kb/3031135).

There should be no Windows updates pending on the VM when you trigger a failover. If there are, you won't be able to sign in to the virtual   machine until the update finishes.

After failover, check **Boot diagnostics** to view a screenshot of the VM. If you can't connect, check that the VM is running and review [troubleshooting tips](https://social.technet.microsoft.com/wiki/contents/articles/31666.troubleshooting-remote-desktop-connection-after-failover-using-asr.aspx).

### Connect to Linux VMs by using SSH

On the Azure VMware Solution VM before failover:

* Check that the Secure Shell (SSH) service is set to start automatically on system startup.
* Check that firewall rules allow an SSH connection.

After failover, allow incoming connections to the SSH port for the network security group rules on the failed-over VM, and for the Azure subnet to which it's connected. [Add a public IP address](./site-recovery-monitor-and-troubleshoot.md) for the VM.

You can check **Boot diagnostics** to view a screenshot of the VM.

## Failback requirements

If you plan to fail back to your Azure VMware Solution cloud, there are several [prerequisites for failback](avs-tutorial-reprotect.md#before-you-begin). You can prepare these now, but you don't need to. You can prepare after you fail over to Azure.

## Next steps

> [!div class="nextstepaction"]
> [Set up disaster recovery](avs-tutorial-replication.md)

If you're replicating multiple VMs:

> [!div class="nextstepaction"]
> [Perform capacity planning](site-recovery-deployment-planner.md)
