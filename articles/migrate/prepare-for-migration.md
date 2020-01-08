---
title: Prepare machines for migration with Azure Migrate 
description: Learn how to prepare on-premises machines for migration with Azure Migrate.
ms.topic: tutorial
ms.date: 12/10/2019
ms.custom: MVC
---

# Prepare on-premises machines for migration to Azure

This article describes how to prepare on-premises machines before you start migrating them to Azure with [Azure Migrate Server Migration](migrate-services-overview.md#azure-migrate-server-migration-tool).


In this article, you:
> [!div class="checklist"]
> * Verify migration limitations.
> * Check operating system requirements and support limitations.
> * Review URL/port access for machines you want to migrate.
> * Review changes you might need to make before you begin migration.
> * Configure settings so that drive letters are preserved after migration.
> * Prepare machines so that you can connect to the Azure VMs after migration.


## Verify migration limitations

- You can assess up to 35,000 VMware VMs/Hyper-V VMs in a single Azure Migrate project using Azure Migrate Server Migration. A project can combine both VMware VMs and Hyper-V VMs, up to the limits for each.
- You can select up to 10 VMs at once for migration. If you need to replicate more, replicate in groups of 10.
- For VMware agentless migration, you can run up to 100 replications simultaneously.

## Verify operating system requirements

- Verify that your [Windows operating systems](https://support.microsoft.com/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines) are supported in Azure.
- Verify that your [Linux distributions](../virtual-machines/linux/endorsed-distros.md) are supported in Azure.


## Check what's supported

- For VMware VMs, Azure Migrate Server Migration supports [agentless or agent-based migration](server-migrate-overview.md). Verify VMware VM [migration requirements and support](migrate-support-matrix-vmware-migration.md).
- Verify [migration requirements and support](migrate-support-matrix-hyper-v-migration.md) for Hyper-V.
- Verify [migration requirements and support](migrate-support-matrix-physical-migration.md) for on-premises physical machines, or other virtualized servers. 




## Review URL/port access

Machines might need internet access during migration.

- [Review URLs](migrate-appliance.md#url-access) that the Azure Migrate appliance needs to access during agentless migration. [Review port access](migrate-support-matrix-vmware-migration.md#agentless-ports) requirements.
- Review [URLs](migrate-replication-appliance.md#url-access) and [ports] (migrate-replication-appliance.md#port-access) that the replication appliance uses during VMware VM agent-based migration. 
- [Review](migrate-support-matrix-hyper-v-migration.md#hyper-v-hosts) URLs and ports that Hyper-V hosts need to access during migration. 
- Review [URLs](migrate-replication-appliance.md#url-access) and [ports] (migrate-replication-appliance.md#port-access) that the replication appliance uses during physical server migration.



## Verify required changes before migration

Some VMs might require changes so that they can run in Azure. Azure Migrate makes these changes automatically for VMs running these operating systems:
- Red Hat Enterprise Linux 6.5+, 7.0+
- CentOS 6.5+, 7.0+
- SUSE Linux Enterprise Server 12 SP1+
- Ubuntu 14.04LTS, 16.04LTS, 18.04LTS
- Debian 7, 8

For other operating systems, you need to prepare machines manually before migration. 

### Prepare Windows machines

If you're migrating a Windows machine, then make these changes before migration. If you migrate the VM before you make the changes, the VM might not boot up in Azure.

1. [Enable Azure serial access console](../virtual-machines/troubleshooting/serial-console-windows.md) for the Azure VM. This helps with troubleshooting. You don't need to reboot the VM. The Azure VM will boot using the disk image. This is equivalent to a reboot for the new VM. 
2. If you're migrating machines running Windows Server 2003, install Hyper-V Guest Integration Services on the VM operating system.	[Learn more](https://docs.microsoft.com/windows-server/virtualization/hyper-v/manage/manage-hyper-v-integration-services#install-or-update-integration-services).

### Prepare Linux machines

1. Install Hyper-V Linux Integration Services. Most new versions of Linux distributions include this by default.
2. Rebuild the Linux init image so that it contains the necessary Hyper-V drivers. This ensures that the VM will boot in Azure, and is only required on some distributions.
3. [Enable Azure serial console logging](../virtual-machines/troubleshooting/serial-console-linux.md). This helps with troubleshooting. You don't need to reboot the VM. The Azure VM will boot using the disk image. This is equivalent to a reboot for the new VM.
4. Update the device map file with the device name to volume associations, so that you use persistent device identifiers.
5. Update fstab entries to use persistent volume identifiers.
6. Remove any udev rules that reserve interface names based on MAC address etc.
7. Update network interfaces to receive an IP address from DHCP.
8. [Learn more](../virtual-machines/linux/create-upload-generic.md) about the steps needed to run a Linux VM on Azure, and get instructions for some of the popular Linux distributions.

## Preserve drive letters after migration

When you migrate an on-premises machine to Microsoft Azure, the drive letters of additional data disks might change from their previous values. By default, Azure VMs are assigned drive D for use as temporary storage. This drive assignment causes all other attached storage drive assignments to increment by one letter.

For example, if your on-premises installation uses a data disk that is assigned to drive D for application installations, the assignment for this drive increments to drive E after you migrate the VM to Azure. To prevent this automatic assignment, and to ensure that Azure assigns the next free drive letter to its temporary volume, set the storage area network (SAN) policy to OnlineAll, as follows:

1. On the on-premises machine (not the host server) open an elevated command prompt.
2. Type **diskpart**.
3. Type **SAN**. If the drive letter of the guest operating system isn't maintained, **Offline All** or **Offline Shared** is returned.
4. At the **DISKPART** prompt, type **SAN Policy=OnlineAll**. This setting ensures that disks are brought online, and are both readable and writeable.
5. During the test migration, you can verify that the drive letters are preserved.


## Check Azure VM requirements

On-premises machines that you replicate to Azure must comply with Azure VM requirements for operating system and architecture, disks, network settings, and VM naming. Verify the requirements for [VMware VMs/physical servers](migrate-support-matrix-vmware-migration.md#azure-vm-requirements), and [Hyper-V VMs](migrate-support-matrix-hyper-v-migration.md#azure-vm-requirements) before migration.


## Prepare to connect after migration

Azure VMs are created during migration to Azure. After migration, you need to be able to connect to the new Azure VMs. There are a number of steps required to connect successfully.

### Prepare to connect to Windows Azure VMs

On on-premises Windows machines, do the following:

1. Configure Windows settings. These include removing any static persistent routes or WinHTTP proxy.
2. Make sure [these services](../virtual-machines/windows/prepare-for-upload-vhd-image.md#check-the-windows-services) are running.
3. Enable remote desktop (RDP) to allow remote connections to the on-premises machine. [Learn how](../virtual-machines/windows/prepare-for-upload-vhd-image.md#update-remote-desktop-registry-settings) to enable RDP with PowerShell.
4. To access an Azure VM over the internet after migration, in Windows Firewall on the on-premises machine, allow TCP and UDP in the Public profile, and set RDP as an allowed app for all profiles.
5. If you want to access an Azure VM over a site-to-site VPN after migration, in Windows Firewall on the on-premises machine, allow RDP for the Domain and Private profiles. [Learn](../virtual-machines/windows/prepare-for-upload-vhd-image.md#configure-windows-firewall-rules) how to allow RDP traffic. 
6. Make sure that there are no Windows updates pending on the on-premises VM when you migrate. If there are, updates might start installing on the Azure VM after migration, and you won't be able to sign into the VM until updates finish.


### Prepare to connect with Linux Azure VMs

On on-premises Linux machines, do the following:

1. Check that the Secure Shell service is set to start automatically on system boot.
2. Check that firewall rules allow an SSH connection.

### Configure Azure VMs after migration

After migration, do the following on the Azure VMs that are created.

1. To connect to the VM over the internet, assign a public IP address to the VM. You can't use the same public IP address for the Azure VM that you used for your on-premises machine. [Learn more](../virtual-network/virtual-network-public-ip-address.md).
2. Check that network security group (NSG) rules on the VM allow incoming connections to the RDP or SSH port.
3. Check [Boot diagnostics](../virtual-machines/troubleshooting/boot-diagnostics.md#enable-boot-diagnostics-on-existing-virtual-machine) to view the VM.

> [!NOTE]
> The Azure Bastion service offers private RDP and SSH access to Azure VMs. [Learn more](../bastion/bastion-overview.md) about this service.



## Next steps

Decide which method you want to use for [migrating VMware VMs](server-migrate-overview.md) to Azure, or start migrating [Hyper-V VMs](tutorial-migrate-hyper-v.md) or [physical servers or virtualized/cloud VMs](tutorial-migrate-physical-virtual-machines.md).
