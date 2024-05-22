---
title: Prepare machines for migration with Azure Migrate
description: Learn how to prepare on-premises machines for migration with Azure Migrate.
author: sunishvohra-ms 
ms.author: sunishvohra
ms.manager: vijain
ms.service: azure-migrate
ms.topic: how-to
ms.date: 09/13/2023
ms.custom: engagement-fy23
---

# Prepare on-premises machines for migration to Azure

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

This article describes how to prepare on-premises machines before you migrate them to Azure using the [Migration and modernization](migrate-services-overview.md#migration-and-modernization-tool) tool.

In this article, you:
> [!div class="checklist"]
> * Review migration limitations.
> * Select a method for migrating VMware vSphere VMs.
> * Check hypervisor and operating system requirements for machines you want to migrate.
> * Review URL and port access for machines you want to migrate.
> * Review changes you might need to make before you begin migration.
> * Check Azure VMs requirements for migrated machines.
> * Prepare machines so you can connect to the Azure VMs after migration.


## Verify migration limitations

The table summarizes discovery, assessment, and migration limits for Azure Migrate. We recommend that you assess machines before migration, but you don't have to.

**Scenario** | **Project** | **Discovery/Assessment** | **Migration**
--- | --- | --- | ---
**VMware vSphere VMs** | Discover and assess up to 35,000 VMs in a single Azure Migrate project. | Discover up to 10,000 VMware vSphere VMs with a single [Azure Migrate appliance](common-questions-appliance.md) for VMware vSphere. <br> The appliance supports adding multiple vCenter Servers. You can add up to 10 vCenter Servers per appliance. | **Agentless migration**: you can simultaneously replicate a maximum of 500 VMs across multiple vCenter Servers (discovered from one appliance) using a scale-out appliance.<br> **Agent-based migration**: you can [scale out](./agent-based-migration-architecture.md#performance-and-scaling) the [replication appliance](migrate-replication-appliance.md) to replicate large numbers of VMs.<br/><br/> In the portal, you can select up to 10 machines at once for replication. To replicate more machines, add in batches of 10.
**Hyper-V VMs** | Discover and assess up to 35,000 VMs in a single Azure Migrate project. | Discover up to 5,000 Hyper-V VMs with a single Azure Migrate appliance | An appliance isn't used for Hyper-V migration. Instead, the Hyper-V Replication Provider runs on each Hyper-V host.<br/><br/> Replication capacity is influenced by performance factors such as VM churn, and upload bandwidth for replication data.<br/><br/> In the portal, you can select up to 10 machines at once for replication. To replicate more machines, add in batches of 10.
**Physical machines** | Discover and assess up to 35,000 machines in a single Azure Migrate project. | Discover up to 1000 physical servers with a single Azure Migrate appliance for physical servers. | You can [scale out](./agent-based-migration-architecture.md#performance-and-scaling) the [replication appliance](migrate-replication-appliance.md) to replicate large numbers of servers.<br/><br/> In the portal, you can select up to 10 machines at once for replication. To replicate more machines, add in batches of 10.

## Select a VMware vSphere migration method

If you're migrating VMware vSphere VMs to Azure, [compare](server-migrate-overview.md#compare-migration-methods) the agentless and agent-based migration methods, to decide what works best for you.

## Verify hypervisor requirements

- Verify [VMware agentless](migrate-support-matrix-vmware-migration.md#vmware-vsphere-requirements-agentless), or [VMware vSphere agent-based](migrate-support-matrix-vmware-migration.md#vmware-vsphere-requirements-agent-based) requirements.
- Verify [Hyper-V host](migrate-support-matrix-hyper-v-migration.md#hyper-v-host-requirements) requirements.


## Verify operating system requirements

Verify supported operating systems for migration:

- If you're migrating VMware vSphere VMs or Hyper-V VMs, verify VMware vSphere VM requirements for [agentless](migrate-support-matrix-vmware-migration.md#vm-requirements-agentless), and [agent-based](migrate-support-matrix-vmware-migration.md#vm-requirements-agent-based) migration, and requirements for [Hyper-V VMs](migrate-support-matrix-hyper-v-migration.md#hyper-v-vms).
- Verify [Windows operating systems](https://support.microsoft.com/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines) are supported in Azure.
- Verify [Linux distributions](../virtual-machines/linux/endorsed-distros.md) supported in Azure.

## Review URL and port access

Review which URLs and ports are accessed during migration.

**Scenario** | **Details** |  **URLs** | **Ports**
--- | --- | --- | ---
**VMware vSphere agentless migration** | Uses the [Azure Migrate appliance](migrate-appliance-architecture.md) for migration. Nothing is installed on VMware vSphere VMs. | Review the public cloud and government [URLs](migrate-appliance.md#url-access) needed for discovery, assessment, and migration with the appliance. | [Review](migrate-support-matrix-vmware-migration.md#port-requirements-agentless) the port requirements for agentless migration.
**VMware vSphere agent-based migration** | Uses the [replication appliance](migrate-replication-appliance.md) for migration. The Mobility service agent is installed on VMs. | Review the [public cloud](migrate-replication-appliance.md#url-access) and [Azure Government](migrate-replication-appliance.md#azure-government-url-access) URLs that the replication appliance needs to access. | [Review](migrate-replication-appliance.md#port-access) the ports used during agent-based migration.
**Hyper-V migration** | Uses a Provider installed on Hyper-V hosts for migration. Nothing is installed on Hyper-V VMs. | Review the [public cloud](migrate-support-matrix-hyper-v-migration.md#url-access-public-cloud) and [Azure Government](migrate-support-matrix-hyper-v-migration.md#url-access-azure-government) URLs that the Replication Provider running on the hosts needs to access. | The Replication Provider on the Hyper-V host uses outbound connections on HTTPS port 443 to send VM replication data.
**Physical machines** | Uses the [replication appliance](migrate-replication-appliance.md) for migration. The Mobility service agent is installed on the physical machines. | Review the [public cloud](migrate-replication-appliance.md#url-access) and [Azure Government](migrate-replication-appliance.md#azure-government-url-access) URLs that the replication appliance needs to access. | [Review](migrate-replication-appliance.md#port-access) the ports used during physical migration.

## Verify required changes before migrating

There are some changes needed on VMs before you migrate them to Azure.

- For some operating systems, Azure Migrate makes changes automatically during the replication/migration process.
- For other operating systems, you need to configure settings manually.
- It's important to configure settings manually before you begin migration. Some of the changes may affect VM boot up, or connectivity to the VM may not be established. If you migrate the VM before you make the change, the VM might not boot up in Azure.

Review the tables to identify the changes you need to make.

### Windows machines

Changes performed are summarized in the table.

**Action** | **VMware vSphere (agentless migration)** | **VMware vSphere (agent-based)/physical machines** | **Windows on Hyper-V**
--- | --- | --- | ---
**Configure the SAN policy as Online All**<br/><br/> | Set automatically for machines running Windows Server 2008 R2 or later.<br/><br/> Configure manually for earlier operating systems. | Set automatically in most cases. | Set automatically for machines running Windows Server 2008 R2 or later.
**Install Hyper-V Guest Integration** | [Install manually](prepare-windows-server-2003-migration.md#install-on-vmware-vms) on machines running Windows Server 2003. | [Install manually](prepare-windows-server-2003-migration.md#install-on-vmware-vms) on machines running Windows Server 2003. | [Install manually](prepare-windows-server-2003-migration.md#install-on-hyper-v-vms) on machines running Windows Server 2003.
**Enable Azure Serial Console** <br/><br/>[Enable the console](/troubleshoot/azure/virtual-machines/serial-console-windows) on Azure VMs to help with troubleshooting. You don't need to reboot the VM. The Azure VM will boot by using the disk image. The disk image boot is equivalent to a reboot for the new VM. | Enable manually | Enable manually | Enable manually
**Install the Windows Azure Guest Agent** <br/><br/> The Virtual Machine Agent (VM Agent) is a secure, lightweight process that manages virtual machine (VM) interaction with the Azure Fabric Controller. The VM Agent has a primary role in enabling and executing Azure virtual machine extensions that enable post-deployment configuration of VM, such as installing and configuring software. |  Set automatically for machines running Windows Server 2008 R2 or later. <br/> Configure manually for earlier operating systems. | Set automatically for machines running Windows Server 2008 R2 or later. | Set automatically for machines running Windows Server 2008 R2 or later.
**Connect after migration**<br/><br/> To connect after migration, there are a number of steps to take before you migrate. | [Set up](#prepare-to-connect-to-azure-windows-vms) manually. | [Set up](#prepare-to-connect-to-azure-windows-vms) manually. | [Set up](#prepare-to-connect-to-azure-windows-vms) manually.

[Learn more](./prepare-for-agentless-migration.md#changes-performed-on-windows-servers) on the changes performed on Windows servers for agentless VMware vSphere migrations.

#### Configure SAN policy

By default, Azure VMs are assigned drive D: to use as temporary storage.

- This drive assignment causes all other attached storage drive assignments to increment by one letter.
- For example, if your on-premises installation uses a data disk that is assigned to drive D: for application installations, the assignment for this drive increments to drive E: after you migrate the VM to Azure.
- To prevent this automatic assignment, and to ensure that Azure assigns the next free drive letter to its temporary volume, set the storage area network (SAN) policy to **OnlineAll**:

Configure this setting manually as follows:

1. On the on-premises machine (not the host server), open an elevated command prompt.
2. Enter **diskpart**.
3. Enter **SAN**. If the drive letter of the guest operating system isn't maintained, **Offline All** or **Offline Shared** is returned.
4. At the **DISKPART** prompt, enter **SAN Policy=OnlineAll**. This setting ensures that disks are brought online, and it ensures that you can read and write to both disks.
5. During the test migration, you can verify that the drive letters are preserved.


### Linux machines

Azure Migrate completes these actions automatically for these versions

- Red Hat Enterprise Linux  8.x, 7.9, 7.8, 7.7, 7.6, 7.5, 7.4, 7.3, 7.2, 7.1, 7.0, 6.x (Azure Linux VM agent is also installed automatically during migration)
- Cent OS 8.x, 7.7, 7.6, 7.5, 7.4, 6.x (Azure Linux VM agent is also installed automatically during migration)
- SUSE Linux Enterprise Server 15 SP0, 15 SP1, 12, 11 SP4, 11 SP3
- Ubuntu 20.04, 19.04, 19.10, 18.04LTS, 16.04LTS, 14.04LTS (Azure Linux VM agent is also installed automatically during migration)
- Debian 10, 9, 8, 7
- Oracle Linux 8, 7.7-CI, 7.7, 6

For other versions, prepare machines as summarized in the table. 
> [!Note]
> Some changes may affect the VM boot up, or connectivity to the VM may not be established.


**Action** | **Details** | **Linux version**
--- | --- | ---
**Install Hyper-V Linux Integration Services** | Rebuild the Linux init image so it contains the necessary Hyper-V drivers. Rebuilding the init image ensures that the VM will boot in Azure. | Most new versions of Linux distributions have this included by default.<br/><br/> If not included, install manually for all versions except those called out above.
**Enable Azure Serial Console logging** | Enabling console logging helps you troubleshoot. You don't need to reboot the VM. The Azure VM will boot by using the disk image. The disk image boot is equivalent to a reboot for the new VM.<br/><br/> Follow [these instructions](/troubleshoot/azure/virtual-machines/serial-console-linux) to enable.
**Update device map file** | Update the device map file with the device name-to-volume associations, so you use persistent device identifiers. | Install manually for all versions except those called out above. (Only applicable in agent-based VMware scenario)
**Update fstab entries** |	Update entries to use persistent volume identifiers.	| Update manually for all versions except those called out above.
**Remove udev rule** | Remove any udev rules that reserves interface names based on mac address etc. | Remove manually for all versions except those called out above.
**Update network interfaces** | Update network interfaces to receive IP address based on DHCP.nst | Update manually for all versions except those called out above.
**Enable ssh** | Ensure ssh is enabled and the sshd service is set to start automatically on reboot.<br/><br/> Ensure that incoming ssh connection requests are not blocked by the OS firewall or scriptable rules.| Enable manually for all versions except those called out above.
**Install the Linux Azure Guest Agent** | The Microsoft Azure Linux Agent (waagent) is a secure, lightweight process that manages Linux & FreeBSD provisioning, and VM interaction with the Azure Fabric Controller.| Enable manually for all versions except those called out above.  <br> Follow instructions to [install the Linux Agent manually](../virtual-machines/extensions/agent-linux.md#installation) for other OS versions. Review the list of [required packages](../virtual-machines/extensions/agent-linux.md#requirements) to install Linux VM agent. 

[Learn more](./prepare-for-agentless-migration.md#changes-performed-on-linux-servers) on the changes performed on Linux servers for agentless VMware vSphere migrations.

The following table summarizes the steps performed automatically for the operating systems listed above.


| Action                                      | Agent\-Based VMware vSphere Migration | Agentless VMware vSphere Migration | Agentless Hyper\-V Migration   |
|---------------------------------------------|-------------------------------|----------------------------|------------|
| Update kernel image with Hyper\-V Linux Integration Services. <br> (The LIS drivers should be present on the kernel.) | Yes                           | Yes                        | Yes |
| Enable Azure Serial Console logging         | Yes                           | Yes                        | Yes        |
| Update device map file                      | Yes                           | No                         | No         |
| Update fstab entries                        | Yes                           | Yes                        | Yes        |
| Remove udev rule                            | Yes                           | Yes                        | Yes        |
| Update network interfaces                   | Yes                           | Yes                        | Yes        |
| Enable ssh                                  | No                            | No                         | No         |    
| Install Azure VM Linux agent                | Yes                           | Yes                        | Yes        |

Learn more about steps for [running a Linux VM on Azure](../virtual-machines/linux/create-upload-generic.md), and get instructions for some of the popular Linux distributions.

Review the list of [required packages](../virtual-machines/extensions/agent-linux.md#requirements) to install Linux VM agent. Azure Migrate installs the Linux VM agent automatically for  RHEL 8.x/7.x/6.x, CentOS 8.x/7.x/6.x, Ubuntu 14.04/16.04/18.04/19.04/19.10/20.04, SUSE 15 SP0/15 SP1/12/11 SP4/11 SP3, Debian 9/8/7, and Oracle 7 when using the agentless method of VMware migration.

## Check Azure VM requirements

On-premises machines that you replicate to Azure must comply with Azure VM requirements for the operating system and architecture, the disks, network settings, and VM naming.

Before migrating, review the Azure VMs requirements for [VMware](migrate-support-matrix-vmware-migration.md#azure-vm-requirements), [Hyper-V](migrate-support-matrix-hyper-v-migration.md#azure-vm-requirements), and [physical server](migrate-support-matrix-physical-migration.md#azure-vm-requirements) migration.



## Prepare to connect after migration

Azure VMs are created during migration to Azure. After migration, you must be able to connect to the new Azure VMs. Multiple steps are required to connect successfully.

### Prepare to connect to Azure Windows VMs

On on-premises Windows machines:

1. Configure Windows settings. Settings include removing any static persistent routes or WinHTTP proxy.
2. Make sure [required services](../virtual-machines/windows/prepare-for-upload-vhd-image.md#check-the-windows-services) are running.
3. Enable remote desktop (RDP) to allow remote connections to the on-premises machine. Learn how to [use PowerShell to enable RDP](../virtual-machines/windows/prepare-for-upload-vhd-image.md#update-remote-desktop-registry-settings).
4. To access an Azure VM over the internet after migration, in Windows Firewall on the on-premises machine, allow TCP and UDP in the Public profile, and set RDP as an allowed app for all profiles.
5. If you want to access an Azure VM over a site-to-site VPN after migration, in Windows Firewall on the on-premises machine, allow RDP for the Domain and Private profiles. Learn how to [allow RDP traffic](../virtual-machines/windows/prepare-for-upload-vhd-image.md#configure-windows-firewall-rules).
6. Make sure there are no Windows updates pending on the on-premises VM when you migrate. If there are, updates might start installing on the Azure VM after migration, and you won't be able to sign into the VM until updates finish.


### Prepare to connect with Linux Azure VMs

On on-premises Linux machines:

1. Check that the Secure Shell service is set to start automatically on system boot.
2. Check that firewall rules allow an SSH connection.

### Configure Azure VMs after migration

After migration, complete these steps on the Azure VMs that are created:

1. To connect to the VM over the internet, assign a public IP address to the VM. You must use a different public IP address for the Azure VM than you used for your on-premises machine. [Learn more](../virtual-network/ip-services/virtual-network-public-ip-address.md).
2. Check that network security group (NSG) rules on the VM allow incoming connections to the RDP or SSH port.
3. Check [boot diagnostics](/troubleshoot/azure/virtual-machines/boot-diagnostics#enable-boot-diagnostics-on-existing-virtual-machine) to view the VM.


## Next steps

Decide which method you want to use to [migrate VMware vSphere VMs](server-migrate-overview.md) to Azure, or begin migrating [Hyper-V VMs](tutorial-migrate-hyper-v.md) or [physical servers or virtualized or cloud VMs](tutorial-migrate-physical-virtual-machines.md).


## See what's supported

For VMware vSphere VMs, Migration and modernization supports [agentless or agent-based migration](server-migrate-overview.md).

- **VMware vSphere VMs**: Verify [migration requirements and support](migrate-support-matrix-vmware-migration.md) for VMware vSphere VMs.
- **Hyper-V VMs**: Verify [migration requirements and support](migrate-support-matrix-hyper-v-migration.md) for Hyper-V VMs.
- **Physical machines**: Verify [migration requirements and support](migrate-support-matrix-physical-migration.md) for on-premises physical machines and other virtualized servers.

## Learn more

- [Prepare for VMware vSphere agentless migration with Azure Migrate.](./prepare-for-agentless-migration.md)
