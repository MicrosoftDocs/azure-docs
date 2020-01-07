---
title: Prepare VMware VMs for reprotection and failback with Azure Site Recovery
description: Prepare for fail back of VMware VMs after failover with Azure Site Recovery
ms.topic: conceptual
ms.date: 12/24/2019
---

# Prepare for reprotection and failback of VMware VMs

After [failover](site-recovery-failover.md) of on-premises VMware VMs or physical servers to Azure, you reprotect the Azure VMs created after failover, so that they replicate back to the on-premises site. With replication from Azure to on-premises in place, you can then fail back by running a failover from Azure to on-premises when you're ready.

Before you continue, get a quick overview with this video about how to fail back from Azure to an on-premises site.<br /><br />
> [!VIDEO https://channel9.msdn.com/Series/Azure-Site-Recovery/VMware-to-Azure-with-ASR-Video5-Failback-from-Azure-to-On-premises/player]

## Reprotection/failback components

You need a number of components and settings in place before you can reprotect and fail back from Azure.

**Component**| **Details**
--- | ---
**On-premises configuration server** | The on-premises configuration server must be running and connected to Azure.<br/><br/> The VM you're failing back to must exist in the configuration server database. If disaster affects the configuration server, restore it with the same IP address to ensure that failback works.<br/><br/>  If IP addresses of replicated machines were retained on failover, site-to-site connectivity (or ExpressRoute connectivity) should be established between Azure VMs machines and the failback NIC of the configuration server. For retained IP addresses the configuration server needs two NICs - one for source machine connectivity, and one for Azure failback connectivity. This avoids overlap of subnet address ranges for the source and failed over VMs.
**Process server in Azure** | You need a process server in Azure before you can fail back to your on-premises site.<br/><br/> The process server receives data from the protected Azure VM, and sends it to the on-premises site.<br/><br/> You need a low-latency network between the process server and the protected VM, so we recommend that you deploy the process server in Azure for higher replication performance.<br/><br/> For proof-of-concept, you can use the on-premises process server, and ExpressRoute with private peering.<br/><br/> The process server should be in the Azure network in which the failed over VM is located. The process server must also be able to communicate with the on-premises configuration server and master target server.
**Separate master target server** | The master target server receives failback data, and by default a Windows master target server runs on the on-premises configuration server.<br/><br/> A master target server can have up to 60 disks attached to it. VMs being failed back have more than a collective total of 60 disks, or if you're failing back large volumes of traffic, create a separate master target server for failback.<br/><br/> If machines are gathered into a replication group for multi-VM consistency, the VMs must all be Windows, or must all be Linux. Why? Because all VMs in a replication group must use the same master target server, and the master target server must have same operating system (With the same or a higher version) than those of the replicated machines.<br/><br/> The master target server shouldn't have any snapshots on its disks, otherwise reprotection and failback won't work.<br/><br/> The master target can't have a Paravirtual SCSI controller. The controller can only be an LSI Logic controller. Without an LSI Logic controller, reprotection fails.
**Failback replication policy** | To replicate back to on-premises site, you need a failback policy. This policy is automatically created when you create a replication policy to Azure.<br/><br/> The policy is automatically associated with the configuration server. It's set to an RPO threshold of 15 minutes, recovery point retention of 24 hours, and app-consistent snapshot frequency is 60 minutes. The policy can't be edited. 
**Site-to-site VPN/ExpressRoute private peering** | Reprotection and failback needs a site-to-site VPN connection, or ExpressRoute private peering to replicate data. 


## Ports for reprotection/failback

A number of ports must be open for reprotection/failback. The following graphic illustrates the ports and reprotect/failback flow.

![Ports for failover and failback](./media/vmware-azure-reprotect/failover-failback.png)


## Deploy a process server in Azure

1. [Set up a process server](vmware-azure-set-up-process-server-azure.md) in Azure for failback.
2. Ensure that Azure VMs can reach the process server. 
3. Make sure that the site-to-site VPN connection or ExpressRoute private peering network has enough bandwidth to send data from the process server to the on-premises site.

## Deploy a separate master target server

1. Note the master target server [requirements and limitations](#reprotectionfailback-components).
2. Create a [Windows](site-recovery-plan-capacity-vmware.md#deploy-additional-master-target-servers) or [Linux](vmware-azure-install-linux-master-target.md) master target server, to match the operating system of the VMs you want to reprotect and fail back.
3. Make sure you don't use Storage vMotion for the master target server, or failback can fail. The VM machine can't start because the disks aren't available to it.
    - To prevent this, exclude the master target server from your vMotion list.
    - If a master target undergoes a Storage vMotion task after reprotection, the protected VM disks attached to the master target server migrate to the target of the vMotion task. If you try to fail back after this, disk detachment fails because the disks aren't found. It's then hard to find the disks in your storage accounts. If this occurs, find them manually and attach them to the VM. After that, the on-premises VM can be booted.

4. Add a retention drive to the existing Windows master target server. Add a new disk and format the drive. The retention drive is used to stop the points in time when the VM replicates back to the on-premises site. Note these criteria. If they aren't met, the drive isn't listed for the master target server:
    - The volume isn't used for any other purpose, such as a replication target, and it isn't in lock mode.
    - The volume isn't a cache volume. The custom installation volume for the process server and master target isn't eligible for a retention volume. When the process server and master target are installed on a volume, the volume is a cache volume of the master target.
    - The file system type of the volume isn't FAT or FAT32.
    - The volume capacity is nonzero.
    - The default retention volume for Windows is the R volume.
    - The default retention volume for Linux is /mnt/retention.

5. Add a drive if you're using an existing process server. The new drive must meet the requirements in the last step. If the retention drive isn't present, it doesn't appear in the selection drop-down list on the portal. After you add a drive to the on-premises master target, it takes up to 15 minutes for the drive to appear in the selection on the portal. You can refresh the configuration server if the drive doesn't appear after 15 minutes.
6. Install VMware tools or open-vm-tools on the master target server. Without the tools, the datastores on the master target's ESXi host can't be detected.
7. Set the disk.EnableUUID=true setting in the configuration parameters of the master target VM in VMware. If this row doesn't exist, add it. This setting is required to provide a consistent UUID to the VMDK so that it mounts correctly.
8. Check vCenter Server access requirements:
    - If the VM to which you're failing back is on an ESXi host managed by VMware vCenter Server, the master target server needs access to the on-premises VM Virtual Machine Disk (VMDK) file, in order to write the replicated data to the virtual machine's disks. Make sure that the on-premises VM datastore is mounted on the master target host with read/write access.
    - If the VM isn't on an ESXi host managed by a VMware vCenter Server, Site Recovery creates a new VM during reprotection. This VM is created on the ESXi host on which you create the master target server VM. Choose the ESXi host carefully, to create the VM on the host that you want. The hard disk of the VM must be in a datastore that's accessible by the host on which the master target server is running.
    - Another option, if the on-premises VM already exists for failback, is to delete it before you do a failback. Failback then creates a new VM on the same host as the master target ESXi host. When you fail back to an alternate location, the data is recovered to the same datastore and the same ESXi host as that used by the on-premises master target server.
9. For physical machines failing back to VMware VMs, you should complete discovery of the host on which the master target server is running, before you can reprotect the machine.
10. Check that the ESXi host on which the master target VM has at least one virtual machine file system (VMFS) datastore attached to it. If no VMFS datastores are attached, the datastore input in the reprotection settings is empty and you can't proceed.


## Next steps

[Reprotect](vmware-azure-reprotect.md) a VM.
