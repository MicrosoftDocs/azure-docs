---
title: Prepare on-premises VMware servers for disaster recovery of VMware VMs to Azure| Microsoft Docs
description: Learn how to prepare on-premises VMware servers for disaster recovery to Azure using the Azure Site Recovery service.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 90a4582c-6436-4a54-a8f8-1fee806b8af7
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/18/2017
ms.author: raynew

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
3. Create a user on the vCenter server. or vSphere host. Assign the role to the user.

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


## Check VMware server requirements

Make sure VMware servers meet the following requirements.

**Component** | **Requirement**
--- | ---
**vCenter server** | vCenter 6.5, 6.0 or 5.5
**vSphere host** | vSphere 6.5, 6.0, 5.5

## Check VMware VM requirements

Make sure that the VM complies with the Azure requirements summarized in the following table.

**VM Requirement** | **Details**
--- | ---
**Operating system disk size** | Up to 2048 GB.
**Operating system disk count** | 1
**Data disk count** | 64 or less
**Data disk VHD size** | Up to 4095 GB
**Network adapters** | Multiple adapters are supported
**Shared VHD** | Not supported
**FC disk** | Not supported
**Hard disk format** | VHD or VHDX.<br/><br/> Although VHDX isn't currently supported in Azure, Site Recovery automatically converts VHDX to VHD when you fail over to Azure. When you fail back to on-premises VMs continue to use the VHDX format.
**Bitlocker** | Not supported. Disable before you enable replication for a VM.
**VM name** | Between 1 and 63 characters.<br/><br/> Restricted to letters, numbers, and hyphens. The VM name must start and end with a letter or number.
**VM type** | Generation 1 - Linux or Windows<br/><br/>Generation 2 - Windows only

The VM must also be running a supported operating system. See the
[Site Recovery support matrix](site-recovery-support-matrix-to-azure.md#support-for-replicated-machine-os-versions)
for a complete list of supported versions.

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
   [Add a public IP address](site-recovery-monitoring-and-troubleshooting.md#adding-a-public-ip-on-a-resource-manager-virtual-machine)
   for the VM. You can check **Boot diagnostics** to view a screenshot of the VM.

## Next steps

> [!div class="nextstepaction"]
> [Set up disaster recovery to Azure for VMware VMs](tutorial-vmware-to-azure.md)
