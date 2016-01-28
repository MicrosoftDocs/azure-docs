<properties
   pageTitle=" Running a Virtual Machine (Windows) | Blueprint | Microsoft Azure"
   description="How to run a single VM on Azure, paying attention to scalability, resiliency, manageability, and security."
   services=""
   documentationCenter="na"
   authors="mikewasson"
   manager="roshar"
   editor=""
   tags=""/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="02/05/2016"
   ms.author="mikewasson"/>

# Azure Blueprints: Running a Virtual Machine (Windows) on Azure

This article outlines a set of proven practices for running a single VM on Azure, paying attention to scalability, resiliency, manageability, and security.  

Please note that there is no up-time SLA for single VMs on Azure. Use this configuration for development and test, but not as a production deployment.

> Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This article uses Resource Manager, which Microsoft recommends for new deployments. There are several ways to use Resource Manager, including the [Azure Portal][azure-portal], [Azure PowerShell][azure-powershell], [Azure CLI][azure-cli] commands, or [Resource Manager templates][arm-templates]. This article includes an example using the Azure CLI.

## Architecture blueprint

Provisioning a single VM in Azure involves more moving parts than the core VM itself. There are compute, networking, and storage elements.  

![IaaS: single VM](arch-iaas-single-vm.png)

- **Resource group.** Create a [resource group][resource-manager-overview] to hold the resources for this VM. A _resource group_ is a container that holds related resources.

- **VM**. You can provision a VM from a list of published images or from a VHD file that you upload to Azure blob storage.

- **OS disk.** The OS disk is a VHD stored in [Azure storage][azure-storage]. That means it persists even if the host machine goes down.

- **Temporary disk.** The VM is created with a temporary disk (the `D:` drive on Windows). This disk is stored on a physical drive on the host machine. It is _not_ saved in Azure storage, and might go away during reboots and other VM lifecycle events. Use this disk only for temporary data, such as page or swap files.

- **Data disks.** A [data disk][data-disk] is a persistent VHD used for application data. Data disks are stored in Azure storage, like the OS disk.

- **Virtual network (VNet) and subnet.** Every VM in Azure is deployed into a virtual network (VNet), which is further divided into subnets.

- **Public IP address.** A public IP address is needed to communicate with the VM&mdash;for example over remote desktop (RDP).

- **Network security group (NSG)**. The [NSG][nsg] is used to allow/deny network traffic to the VM. The default NSG rules disallow all incoming Internet traffic.

- **Network interface card (NIC)**. The NIC enables the VM to communicate with the virtual network.

- **Diagnostics.** Diagnostic logging is crucial for managing and troubleshooting the VM.


## VM recommendations

- When moving an existing workload to Azure, choose the [VM size][virtual-machine-sizes] that most closely matches your on-premise servers. We recommend the DS- and GS-series, which can use Premium Storage for I/O intensive workloads. .

    - If your workload does not require high-performance, low-latency disk access, consider the other Standard tier VM sizes, such as A-series or D-series.

- When you provision the VM and other resources, you must specify a location. Generally, choose a location closest to your internal users or customers. However, not all VM SKUs may be available in all locations. For details, see [Services by region][services-by-region].

- For information about choosing a published VM image, see [Navigate and select Azure virtual machine images][select-vm-image].

## Disk and storage recommendations

We recommend [Premium Storage][premium-storage], for the best disk I/O performance. However, note that Premium Storage requires DS- or GS-series VMs.

- For Premium Storage, cost is based on the size of the provisioned disk. IOPS and throughput (i.e., data transfer rate) also depend on disk size, so when you provision a disk, consider all three factors (capacity, IOPS, and throughput). .

- For Standard Storage, cost is based on the amount of data written to disk. Therefore, it is a good practice to provision the maximum size (1023 GB). However, make sure to use quick format when formatting the disks. A full disk format writes zeroes to the disk, which results in actual storage being used. See [Azure Storage Pricing][storage-price].

- If you select Standard storage, we recommend Geo-Redundant Storage (GRS), because it is durable even in the case of a complete regional outage, or a disaster in which the primary region is not recoverable.  

- Add one or more data disks. When you create a new VHD, it is unformatted. Log into the VM to format the disk.

- If you have a large number of data disks, be aware of the total I/O limits of the storage account. For more information, see [Virtual Machine Disk Limits][vm-disk-limits].

- For best performance, create a separate storage account to hold diagnostic logs. A standard locally redundant storage (LRS) account is sufficient for diagnostic logs.

## Network recommendations

- For a single VM, create one VNet with one subnet. Also create an NSG and public IP address.

- The public IP address can be static or dynamic.

    - Reserve a [static IP address][static-ip] if you need a fixed IP address that won't change &mdash; for example, if you need to create an A record in DNS, or need the IP address to be whitelisted.

    - Otherwise, a dynamic address is sufficient. (This is the default.)

- Allocate a NIC and associate it with the IP address, subnet, and NSG.

- The default NSG rules do not allow RDP. To enable RDP, add a rule to the NSG that allows inbound traffic to TCP port 3389.

## Scalability

You can scale a VM up or down by changing the VM size. The following Azure CLI command resizes a VM:

    azure vm set -g <<resource-group>> --vm-size <<new-vm-size>
      --boot-diagnostics-storage-uri <<storage-account-uri>> <<vm-name>>

Resizing the VM will trigger a system restart, and remap your existing OS and data disks after the restart. Anything on the temporary disk will be lost. The `--boot-diagnostics-storage-uri` option enables [boot diagnostics][boot-diagnostics] to log any errors related to startup.

You might not be able to scale from one SKU family to another (for example, from A series to G series). Use the following CLI command to get a list of available sizes for an existing VM:

    azure vm sizes -g <<resource-group>> --vm-name <<vm-name>>

To scale to a size that is not listed, you must delete the VM instance and create a new one. Deleting a VM does not delete the VHDs.

## Availability

- There is no availability SLA for single VMs. To achieve an SLA around availability, you must deploy multiple VMs into an availability set.

- Your VM may be affected by [planned maintenance][planned-maintenance] or [unplanned maintenance][manage-vm-availability]. You can use [VM reboot logs][reboot-logs] to determine whether a VM reboot was caused by planned maintenance.

- Do not put a single VM into an availability set. Putting the VM into an availability set tells Azure to treat the VM as part of a multi-instance set, and you will receive no advanced warning or notification about planned maintenance reboots.

- VHDs are backed by [Azure Storage][azure-storage], which is replicated for durability and availability.

- To protect against accidental data loss during normal operations (e.g., because of user error), you should also implement point-in-time backups, using [blob snapshots][blob-snapshot] or another tool.

## Manageability

- Run the following CLI command to enable VM diagnostics:

        azure vm enable-diag <<resource-group>> <<vm-name>>

    This command enables basic health metrics, diagnostics infrastructure logs, and boot diagnostics. For more information, see [Enable monitoring and diagnostics][enable-monitoring].

- Use the [Azure Log Collection][log-collector] extension to collect logs and upload them to Azure storage.

- Azure makes a distinction between "Stopped" and "De-allocated" states. You are charged when the VM status is "Stopped". You are not charged when the VM de-allocated. (See the [Azure VM FAQ][vm-faq].)

    Use the following CLI command to de-allocate a VM:

        azure vm deallocate <<resource-group>> <<vm-name>>

    Note: The **Stop** button in the Azure portal also deallocates the VM. However, if you shut down from inside Windows (via RDP), the VM is stopped but _not_ de-allocated, so you will still be charged.

- If you delete a VM, the VHDs are not deleted. That means you can safely delete the VM without losing data. However, you will still be charged for storage. To delete the VHD, delete the file from [blob storage][blog-storage].

- To resize the OS disk, download the .vhd file, and use a tool like [Resize-VHD][Resize-VHD] to resize the VHD. Upload the resized VHD to Blob storage, then delete the VM instance and provision a new instance that uses the resized VHD.


## Security

- Use [Azure Security Center][security-center] to get a central view of the security state of your Azure resources. Security Center monitors potential security issues such as system updates, antimalware, and endpoint ACLs, and provides a comprehensive picture of the security health of your deployment. **Note:** At the time of writing, Security Center is still in preview.

- Use [role-based access control][rbac] (RBAC) to define which members of your DevOps team can manage the Azure resources (VM, network, etc) that you deploy.

- Consider installing [security extensions][security-extensions].

- Use [Azure Disk Encryption][disk-encryption] to encrypt the OS and data disks. **Note:** At the time of writing, Azure Disk Encryption is still in preview.

## Troubleshooting

- To reset the local admin password, run the `vm reset-access` Azure CLI command.

        azure vm reset-access -u <<user>> -p <<new-password>> <<resource-group>> <<vm-name>>

- If your VM gets into a non-bootable state, use [Boot Diagnostics][boot-diagnostics] to diagnose boot failures.

- Look at [audit logs][audit-logs] to see provisioning actions and other VM events.

## Azure CLI commands (example)

The following [Azure CLI][azure-cli] commands deploy a single VM instance and the related network and storage resources. Parameter values in `<< >>` are placeholders.

When you create resources, give them meaningful names, and use [tags][tags] to organize them.

    azure config mode arm

    // Login to your Azure account
    azure login

    // Set the Azure subscription. To list your subscriptions, use 'azure account list'
    azure account set <<subscription-id>>

    // Create resource group
    azure group create -n <<resource-group>> -l <<location>>

    // Create VNet
    azure network vnet create --address-prefixes 172.17.0.0/16
      <<resource-group>> <<vnet-name>> <<location>>

    // Create subnet
    azure network vnet subnet create --vnet-name <<vnet-name>>
      --address-prefix 172.17.0.0/24 <<resource-group>> <<subnet-name>>

    // Create IP address (dynamic)
    azure network public-ip create <<resource-group>> <<ip-name>> <<location>>

    // Create NSG
    azure network nsg create <<resource-group>> <<nsg-name>> <<location>>

    // Create NIC
    azure network nic create --network-security-group-name <<nsg-name>>
      --public-ip-name <<ip-name>> --subnet-name <<subnet-name>>
      --subnet-vnet-name <<vnet-name>> <<resource-group>> <<nic-name>>
      <<location>>

    // Create storage account for OS VHD
    azure storage account create -g <<resource-group>> -l <<location>>
      --type PLRS <<storage-account-name>>
    // PLRS = Premium LRS

    // List images for Windows Server 2012 R2.
    // Use this command to get the Uniform Resource Name (URN), which is
    // needed to create a VM from a published image.
    azure vm image list <<location>> MicrosoftWindowsServer WindowsServer
        2012-R2-Datacenter

    // Create a VM from a published image.
    // This example creates a DS1
    azure vm create -g <<resource-group>> -l <<location>> --os-type Windows
      --image-urn <<image-urn>> --vm-size Standard_DS1
      --vnet-subnet-name <<subnet-name>>  --nic-name <<nic-name>>
      --vnet-name <<vnet-name>> --storage-account-name <<storage-account-name>>
      <<vm-name>>

    // ... or create a VM from a VHD that was uploaded to Azure storage.
    azure vm create -g <<resource-group>> -l <<location>> --os-type Windows
      -d myimage.vhd --vm-size Standard_DS1 --vnet-name <<vnet-name>>
      --vnet-subnet-name <<subnet-name>> --nic-name <<nic-name>>
      --storage-account-name <<storage-account-name>> <<vm-name>>

    // Attach data disk
    azure vm disk attach-new -g <<resource-group>> --vm-name <<vm-name>>
      --size-in-gb 128 --vhd-name <<vhd-name>>
      --storage-account-name <<storage-account-name>>

    // Allow RDP
    azure network nsg rule create -g <<resource-group>> --nsg-name <<nsg-name>>
      --direction Inbound --protocol Tcp --destination-port-range 3389
      --source-port-range * --priority 100 --access Allow RDPAllow

## Next steps

- Multiple VMs deployed in an availability set. [TBD]

<!-- links -->

[arm-templates]: ../virtual-machines/virtual-machines-deploy-rmtemplates-azure-cli.md
[audit-logs]: https://azure.microsoft.com/en-us/blog/analyze-azure-audit-logs-in-powerbi-more/
[azure-cli]: ../virtual-machines/virtual-machines-command-line-tools.md
[azure-portal]: ../azure-portal/resource-group-portal.md
[azure-powershell]: ../powershell-azure-resource-manager.md
[azure-storage]: ../storage/storage-introduction.md
[blob-snapshot]: ../storage/storage-blob-snapshots.md
[blog-storage]: ../storage/storage-introduction.md
[boot-diagnostics]: https://azure.microsoft.com/en-us/blog/boot-diagnostics-for-virtual-machines-v2/
[data-disk]: ../virtual-machines/virtual-machines-disks-vhds.md
[disk-encryption]: ../azure-security-disk-encryption.md
[enable-monitoring]: ../azure-portal/insights-how-to-use-diagnostics.md
[log-collector]: https://azure.microsoft.com/en-us/blog/simplifying-virtual-machine-troubleshooting-using-azure-log-collector/
[manage-vm-availability]: ../virtual-machines/virtual-machines-manage-availability.md
[nsg]: ../virtual-network/virtual-networks-nsg.md
[password-reset]: ../virtual-machines/virtual-machines-windows-reset-password.md
[planned-maintenance]: ../virtual-machines/virtual-machines-planned-maintenance.md
[premium-storage]: ../storage/storage-premium-storage-preview-portal.md
[rbac]: ../active-directory/role-based-access-control-configure.md
[reboot-logs]: https://azure.microsoft.com/en-us/blog/viewing-vm-reboot-logs/
[Resize-VHD]: https://technet.microsoft.com/en-us/library/hh848535.aspx
[resource-manager-overview]: ../resource-group-overview.md
[security-center]: https://azure.microsoft.com/en-us/services/security-center/
[security-extensions]: ../virtual-machines/virtual-machines-extensions-features.md#security-and-protection
[select-vm-image]: ../virtual-machines/resource-groups-vm-searching.md
[services-by-region]: https://azure.microsoft.com/en-us/regions/#services
[static-ip]: ../virtual-network/virtual-networks-reserved-public-ip.md
[storage-price]: https://azure.microsoft.com/pricing/details/storage/
[tags]: ../resource-group-using-tags.md
[virtual-machine-sizes]: ../virtual-machines/virtual-machines-size-specs.md
[vm-disk-limits]: ../azure-subscription-service-limits.md#virtual-machine-disk-limits
[vm-faq]: ../virtual-machines/virtual-machines-questions.md
