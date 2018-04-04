---
title: Prepare on-premises VMware servers for disaster recovery of VMware VMs to Azure| Microsoft Docs
description: Learn how to prepare on-premises VMware servers for disaster recovery to Azure using the Azure Site Recovery service.
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: tutorial
ms.date: 03/15/2018
ms.author: raynew
ms.custom: MVC

---
# Prepare on-premises VMware servers for disaster recovery to Azure

This tutorial shows you how to prepare your on-premises VMware infrastructure when you want to
replicate VMware VMs to Azure. In this tutorial you'll learn how to:

> [!div class="checklist"]
> * Prepare an account on the vCenter server or vSphere ESXi host, to automate VM discovery
> * Prepare an account for automatic installation of the Mobility service on VMware VMs
> * Review VMware server requirements
> * Review VMware VM requirements

In this tutorial series, we show how to back up a single VM using Azure Site Recovery. If you are
planning to protect multiple VMware VMs, you should download the
[Deployment Planner tool](https://aka.ms/asr-deployment-planner) for VMware replication. This tool
you gather information about VM compatibility, disks per VM, and data churn per disk. The tool also
covers network bandwidth requirements, and the Azure infrastructure needed for successful
replication and test failover. [Learn more](site-recovery-deployment-planner.md) about running the
tool.

This is the second tutorial in the series. Make sure that you have
[set up the Azure components](tutorial-prepare-azure.md) as described in the previous tutorial.

## Prepare an account for automatic discovery

Site Recovery needs access to VMware servers to:

- Automatically discovers VMs. At least a read-only account is required.
- Orchestrate replication, failover, and failback. You need an account that can run operations such
  as creating and removing disks, and powering on VMs.

Create the account as follows:

1. To use a dedicated account, create a role at the vCenter level. Give the role a name such as
   **Azure_Site_Recovery**.
2. Assign the role the permissions summarized in the table below.
3. Create a user on the vCenter server or vSphere host. Assign the role to the user.

### VMware account permissions

**Task** | **Role/Permissions** | **Details**
--- | --- | ---
**VM discovery** | At least a read-only user<br/><br/> Data Center object –> Propagate to Child Object, role=Read-only | User assigned at datacenter level, and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object, to the child objects (vSphere hosts, datastores, VMs and networks).
**Full replication, failover, failback** |  Create a role (Azure_Site_Recovery) with the required permissions, and then assign the role to a VMware user or group<br/><br/> Data Center object –> Propagate to Child Object, role=Azure_Site_Recovery<br/><br/> Datastore -> Allocate space, browse datastore, low-level file operations, remove file, update virtual machine files<br/><br/> Network -> Network assign<br/><br/> Resource -> Assign VM to resource pool, migrate powered off VM, migrate powered on VM<br/><br/> Tasks -> Create task, update task<br/><br/> Virtual machine -> Configuration<br/><br/> Virtual machine -> Interact -> answer question, device connection, configure CD media, configure floppy media, power off, power on, VMware tools install<br/><br/> Virtual machine -> Inventory -> Create, register, unregister<br/><br/> Virtual machine -> Provisioning -> Allow virtual machine download, allow virtual machine files upload<br/><br/> Virtual machine -> Snapshots -> Remove snapshots | User assigned at datacenter level, and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object, to the child objects (vSphere hosts, datastores, VMs and networks).

## Prepare an account for Mobility service installation

The Mobility service must be installed on the VM you want to replicate. Site Recovery installs this
service automatically when you enable replication for the VM. For automatic installation, you need
to prepare an account that Site Recovery will use to access the VM. You'll specify this account
when you set up disaster recovery in the Azure console.

1. Prepare a domain or local account with permissions to install on the VM.
2. To install on Windows VMs, if you're not using a domain account, disable Remote User Access
   control on the local machine.
   - From the registry, under
     **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System**, add the
     DWORD entry **LocalAccountTokenFilterPolicy**, with a value of 1.
3. To install on Linux VMs, prepare a root account on the source Linux server.


## Check VMware requirements

Make sure VMware servers and VMs comply with requirements.

1. [Verify](vmware-physical-azure-support-matrix.md#on-premises-virtualization-servers) VMware server requirements.
2. For Linux, [check](vmware-physical-azure-support-matrix.md#linux-file-systemsguest-storage) file system and storage requirements. 
3. Check on-premises [network](vmware-physical-azure-support-matrix.md#network) and [storage](vmware-physical-azure-support-matrix.md#storage) support. 
4. Check what's supported for [Azure networking](vmware-physical-azure-support-matrix.md#azure-vm-network-after-failover), [storage](vmware-physical-azure-support-matrix.md#azure-storage), and [compute](vmware-physical-azure-support-matrix.md#azure-compute), after failover.
5. Your on-premises VMs you replicate to Azure must comply with [Azure VM requirements](vmware-physical-azure-support-matrix.md#azure-vm-requirements).


## Prepare to connect to Azure VMs after failover

During a failover scenario you may want to connect to your replicated VMs in Azure from your
on-premises network.

To connect to Windows VMs using RDP after failover, do the following:

1. To access over the internet, enable RDP on the on-premises VM before failover. Make sure that
   TCP, and UDP rules are added for the **Public** profile, and that RDP is allowed in **Windows
   Firewall** > **Allowed Apps** for all profiles.
2. To access over site-to-site VPN, enable RDP on the on-premises machine. RDP should be allowed in
   the **Windows Firewall** -> **Allowed apps and features** for **Domain and Private** networks.
   Check that the operating system's SAN policy is set to **OnlineAll**. [Learn
   more](https://support.microsoft.com/kb/3031135). There should be no Windows updates pending on
   the VM when you trigger a failover. If there are, you won't be able to log in to the virtual
   machine until the update completes.
3. On the Windows Azure VM after failover, check **Boot diagnostics** to view a screenshot of the
   VM. If you can't connect, check that the VM is running and review these
   [troubleshooting tips](http://social.technet.microsoft.com/wiki/contents/articles/31666.troubleshooting-remote-desktop-connection-after-failover-using-asr.aspx).

To connect to Linux VMs using SSH after failover, do the following:

1. On the on-premises machine before failover, check that the Secure Shell service is set to start
   automatically on system boot. Check that firewall rules allow an SSH connection.

2. On the Azure VM after failover, allow incoming connections to the SSH port for the network
   security group rules on the failed over VM, and for the Azure subnet to which it's connected.
   [Add a public IP address](site-recovery-monitoring-and-troubleshooting.md)
   for the VM. You can check **Boot diagnostics** to view a screenshot of the VM.

## Next steps

> [!div class="nextstepaction"]
> [Set up disaster recovery to Azure for VMware VMs](vmware-azure-tutorial.md)
