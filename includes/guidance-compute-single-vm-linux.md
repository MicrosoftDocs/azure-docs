This article outlines a set of proven practices for running a Linux virtual machine (VM) on Azure, paying attention to scalability, availability, manageability, and security. Azure supports running various popular Linux distributions, including CentOS, Debian, Red Hat Enterprise, Ubuntu, and FreeBSD. For more information, see [Azure and Linux][azure-linux].

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This article uses Resource Manager, which Microsoft recommends for new deployments.

We don't recommend using a single VM for production workloads, because there is no up-time service level agreement (SLA) for single VMs on Azure. To get the SLA, you must deploy multiple VMs in an [availability set][availability-set]. For more information, see [Running multiple VMs on Azure][multi-vm]. 

## Architecture diagram

Provisioning a VM in Azure involves more moving parts than just the VM itself. There are compute, networking, and storage elements that you need to consider.  

![[0]][0]

- **Resource group.** A [_resource group_][resource-manager-overview] is a container that holds related resources. Create a resource group to hold the resources for this VM.

- **VM**. You can provision a VM from a list of published images or from a virtual hard disk (VHD) file that you upload to Azure blob storage.

- **OS disk.** The OS disk is a VHD stored in [Azure storage][azure-storage]. That means it persists even if the host machine goes down. The OS disk is `/dev/sda1`.

- **Temporary disk.** The VM is created with a temporary disk. This disk is stored on a physical drive on the host machine. It is _not_ saved in Azure storage, and might go away during reboots and other VM lifecycle events. Use this disk only for temporary data, such as page or swap files. The temporary disk is `/dev/sdb1` and is mounted at `/mnt/resource` or `/mnt`.

- **Data disks.** A [data disk][data-disk] is a persistent VHD used for application data. Data disks are stored in Azure storage, like the OS disk.

- **Virtual network (VNet) and subnet.** Every VM in Azure is deployed into a (VNet), which is further divided into subnets.

- **Public IP address.** A public IP address is needed to communicate with the VM&mdash;for example over SSH.

- **Network interface (NIC)**. The NIC enables the VM to communicate with the virtual network.

- **Network security group (NSG)**. The [NSG][nsg] is used to allow/deny network traffic to the subnet. You can associate an NSG with an individual NIC or with a subnet. If you associate it with a subnet, the NSG rules apply to all VMs in that subnet.
 
- **Diagnostics.** Diagnostic logging is crucial for managing and troubleshooting the VM.

## Recommendations

### VM recommendations

- We recommend the DS- and GS-series, unless you have a specialized workload such as high-performance computing. For details, see [Virtual machine sizes][virtual-machine-sizes]. When moving an existing workload to Azure, start with the VM size that's the closest match to your on-premise servers. Then measure the performance of your actual workload concerning CPU, memory, and disk input/output operations per second (IOPS), and adjust the size if needed. Also, if you need multiple NICs, be aware of the NIC limit for each size.  

- When you provision the VM and other resources, you must specify a location. Generally, choose a location closest to your internal users or customers. However, not all VM sizes may be available in all locations. For details, see [Services by region][services-by-region]. To list the VM sizes available in a given location, run the following Azure command-line interface (CLI) command:

    ```
    azure vm sizes --location <location>
    ```

- For information about choosing a published VM image, see [Navigate and select Azure virtual machine images][select-vm-image].

### Disk and storage recommendations

- For best disk I/O performance, we recommend [Premium Storage][premium-storage], which stores data on solid-state drives (SSDs). Cost is based on the size of the provisioned disk. IOPS and throughput (that is, data transfer rate) also depend on disk size, so when you provision a disk, consider all three factors (capacity, IOPS, and throughput). 

- One storage account can support 1 to 20 VMs.

- Add one or more data disks. When you create a VHD, it is unformatted. Log in to the VM to format the disk. The data disks show as `/dev/sdc`, `/dev/sdd`, and so on. You can run `lsblk` to list the block devices, including the disks. To use a data disk, create a partition and file system, and mount the disk. For example:

    ```bat
    # Create a partition.
    sudo fdisk /dev/sdc     # Enter 'n' to partition, 'w' to write the change.     
    
    # Create a file system.
    sudo mkfs -t ext3 /dev/sdc1
    
    # Mount the drive.
    sudo mkdir /data1
    sudo mount /dev/sdc1 /data1
    ```

- If you have many of data disks, be aware of the total I/O limits of the storage account. For more information, see [Virtual Machine Disk Limits][vm-disk-limits].

- When you add a data disk, a logical unit number (LUN) ID is assigned to the disk. Optionally, you can specify the LUN ID &mdash; for example, if you're replacing a disk and want to retain the same LUN ID, or you have an app that looks for a specific LUN ID. However, remember that LUN IDs must be unique for each disk.

- You may want to change the I/O scheduler, to optimize for performance on solid-state drives (SSDs) (used by Premium Storage). A common recommendation is to use the NOOP scheduler for SSDs, but you should use a tool such as [iostat] to monitor disk I/O performance for your particular workload.

- For best performance, create a separate storage account to hold diagnostic logs. A standard locally redundant storage (LRS) account is sufficient for diagnostic logs.


### Network recommendations

- The public IP address can be dynamic or static. The default is dynamic.

    - Reserve a [static IP address][static-ip] if you need a fixed IP address that won't change &mdash; for example, if you need to create an A record in DNS, or need the IP address to be whitelisted.

    - You can also create a fully qualified domain name (FQDN) for the IP address. You can then register a [CNAME record][cname-record] in DNS that points to the FQDN. For more information, see [Create a Fully Qualified Domain Name in the Azure portal][fqdn].

- All NSGs contain a set of [default rules][nsg-default-rules], including a rule that blocks all inbound Internet traffic. The default rules cannot be deleted, but other rules can override them. To enable Internet traffic, create rules that allow inbound traffic to specific ports &mdash; for example, port 80 for HTTP.  

- To enable SSH, add a rule to the NSG that allows inbound traffic to TCP port 22.

## Scalability considerations

- You can scale a VM up or down by [changing the VM size][vm-resize]. 

- To scale out horizontally, put two or more VMs into an availability set behind a load balancer. For details, see [Running multiple VMs on Azure][multi-vm].

## Availability considerations

- As noted above, there is no SLA for a single VM. To get the SLA, you must deploy multiple VMs into an availability set.

- Your VM may be affected by [planned maintenance][planned-maintenance] or [unplanned maintenance][manage-vm-availability]. You can use [VM reboot logs][reboot-logs] to determine whether a VM reboot was caused by planned maintenance.

- VHDs are backed by [Azure Storage][azure-storage], which is replicated for durability and availability.

- To protect against accidental data loss during normal operations (for example, because of user error), you should also implement point-in-time backups, using [blob snapshots][blob-snapshot] or another tool.

## Manageability considerations

- **Resource groups.** Put tightly coupled resources that share the same life cycle into the same [resource group][resource-manager-overview]. Resource groups allow you to deploy and monitor resources as a group, and roll up billing costs by resource group. You can also delete resources as a set, which is very useful for test deployments. Give resources meaningful names. That makes it easier to locate a specific resource and understand its role. See [Recommended Naming Conventions for Azure Resources][naming conventions].

- **SSH**. Before you create a Linux VM, generate a 2048-bit RSA public-private key pair. Use the public key file when you create the VM. For more information, see [How to Use SSH with Linux and Mac on Azure][ssh-linux].

- **VM diagnostics.** Enable monitoring and diagnostics, including basic health metrics, diagnostics infrastructure logs, and [boot diagnostics][boot-diagnostics]. Boot diagnostics can help you diagnose boot failure if your VM gets into a non-bootable state. For more information, see [Enable monitoring and diagnostics][enable-monitoring].  

    The following CLI command enables diagnostics:

    ```text
    azure vm enable-diag <resource-group> <vm-name>
    ```

- **Stopping a VM.** Azure makes a distinction between "Stopped" and "Deallocated" states. You are charged when the VM status is "Stopped". You are not charged when the VM deallocated.

    Use the following CLI command to deallocate a VM:

    ```text
    azure vm deallocate <resource-group> <vm-name>
    ```

    The **Stop** button in the Azure portal also deallocates the VM. However, if you shut down through the OS while logged in, the VM is stopped but _not_ deallocated, so you will still be charged.

- **Deleting a VM.** If you delete a VM, the VHDs are not deleted. That means you can safely delete the VM without losing data. However, you will still be charged for storage. To delete the VHD, delete the file from [blob storage][blob-storage].

  To prevent accidental deletion, use a [resource lock][resource-lock] to lock the entire resource group or lock individual resources, such as the VM. 

## Security considerations

- Automate OS updates by using the [OSPatching] VM extension. Install this extension when you provision the VM. You can specify how often to install patches and whether to reboot after patching.

- Use [role-based access control][rbac] (RBAC) to control access to the Azure resources that you deploy. RBAC lets you assign authorization roles to members of your DevOps team. For example, the Reader role can view Azure resources but not create, manage, or delete them. Some roles are specific to particular Azure resource types. For example, the Virtual Machine Contributor role can restart or deallocate a VM, reset the administrator password, create a VM, and so forth. Other [built-in RBAC roles][rbac-roles] that might be useful for this reference architecture include [DevTest Labs User][rbac-devtest] and [Network Contributor][rbac-network]. 
- A user can be assigned to multiple roles, and you can create custom roles for even more fine-grained permissions.

    > [AZURE.NOTE] RBAC does not limit the actions that a user logged to a VM can perform. Those permissions are determined by the account type on the guest OS.   

- Use [audit logs][audit-logs] to see provisioning actions and other VM events.

- Consider [Azure Disk Encryption][disk-encryption] if you need to encrypt the OS and data disks. 

## Solution deployment

The sample deployment provided in this guidance uses three different [template building blocks][blocks] to create:

- a virtual network (VNet)
- a network security group (NSG)
- a virtual machine (VM)

This reference architecture uses a single resource group that you can deploy by clicking the button below and accepting the default values for all parameters.

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmspnp%2Freference-architectures%2Fmaster%2Fguidance-compute-single-vm%2Fazuredeploy.json" target="_blank">
    <img src="http://azuredeploy.net/deploybutton.png"/>
</a>

### Customize the deployment

If you need to change the deployment to match your needs, follow the instructions in the [guidance-single-vm][readme] page. 

## Next steps

In order for the [SLA for Virtual Machines][vm-sla] to apply, you must deploy two or more instances in an Availability Set. For more information, see [Running multiple VMs on Azure][multi-vm].

<!-- links -->

[audit-logs]: https://azure.microsoft.com/en-us/blog/analyze-azure-audit-logs-in-powerbi-more/
[availability-set]: ../articles/virtual-machines/virtual-machines-windows-create-availability-set.md
[azure-cli]: ../articles/virtual-machines-command-line-tools.md
[azure-linux]: ../articles/virtual-machines/virtual-machines-linux-azure-overview.md
[azure-storage]: ../articles/storage/storage-introduction.md
[blob-snapshot]: ../articles/storage/storage-blob-snapshots.md
[blob-storage]: ../articles/storage/storage-introduction.md
[boot-diagnostics]: https://azure.microsoft.com/en-us/blog/boot-diagnostics-for-virtual-machines-v2/
[cname-record]: https://en.wikipedia.org/wiki/CNAME_record
[data-disk]: ../articles/virtual-machines/virtual-machines-linux-about-disks-vhds.md
[disk-encryption]: ../articles/security/azure-security-disk-encryption.md
[enable-monitoring]: ../articles/azure-portal/insights-how-to-use-diagnostics.md
[fqdn]: ../articles/virtual-machines/virtual-machines-linux-portal-create-fqdn.md
[iostat]: https://en.wikipedia.org/wiki/Iostat
[manage-vm-availability]: ../articles/virtual-machines/virtual-machines-linux-manage-availability.md
[multi-vm]: ../articles/guidance/guidance-compute-multi-vm.md
[naming conventions]: ../articles/guidance/guidance-naming-conventions.md
[nsg]: ../articles/virtual-network/virtual-networks-nsg.md
[nsg-default-rules]: ../articles/virtual-network/virtual-networks-nsg.md#default-rules
[OSPatching]: https://github.com/Azure/azure-linux-extensions/tree/master/OSPatching
[planned-maintenance]: ../articles/virtual-machines/virtual-machines-linux-planned-maintenance.md
[premium-storage]: ../articles/storage/storage-premium-storage.md
[rbac]: ../articles/active-directory/role-based-access-control-what-is.md
[rbac-roles]: ../articles/active-directory/role-based-access-built-in-roles.md
[rbac-devtest]: ../articles/active-directory/role-based-access-built-in-roles.md#devtest-lab-user
[rbac-network]: ../articles/active-directory/role-based-access-built-in-roles.md#network-contributor
[reboot-logs]: https://azure.microsoft.com/en-us/blog/viewing-vm-reboot-logs/
[Resize-VHD]: https://technet.microsoft.com/en-us/library/hh848535.aspx
[Resize virtual machines]: https://azure.microsoft.com/en-us/blog/resize-virtual-machines/
[resource-lock]: ../articles/resource-group-lock-resources.md
[resource-manager-overview]: ../articles/resource-group-overview.md
[select-vm-image]: ../articles/virtual-machines/virtual-machines-linux-cli-ps-findimage.md
[services-by-region]: https://azure.microsoft.com/en-us/regions/#services
[ssh-linux]: ../articles/virtual-machines/virtual-machines-linux-mac-create-ssh-keys.md
[static-ip]: ../articles/virtual-network/virtual-networks-reserved-public-ip.md
[storage-price]: https://azure.microsoft.com/pricing/details/storage/
[virtual-machine-sizes]: ../articles/virtual-machines/virtual-machines-linux-sizes.md
[vm-disk-limits]: ../articles/azure-subscription-service-limits.md#virtual-machine-disk-limits
[vm-resize]: ../articles/virtual-machines/virtual-machines-linux-change-vm-size.md
[vm-sla]: https://azure.microsoft.com/en-us/support/legal/sla/virtual-machines/v1_0/
[arm-templates]: https://azure.microsoft.com/documentation/articles/resource-group-authoring-templates/
[readme]: https://github.com/mspnp/reference-architectures/blob/master/guidance-compute-single-vm
[azure-powershell-download]: https://azure.microsoft.com/documentation/articles/powershell-install-configure/
[components]: #Solution-components
[blocks]: https://github.com/mspnp/template-building-blocks
[0]: ./media/guidance-blueprints/compute-single-vm.png "Single Linux VM architecture in Azure"

