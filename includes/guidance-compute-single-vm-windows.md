This article outlines a set of proven practices for running a Windows virtual machine (VM) on Azure, paying attention to scalability, availability, manageability, and security.

> [!NOTE]
> Azure has two different deployment models: [Azure Resource Manager][resource-manager-overview] and classic. This article uses Resource Manager, which Microsoft recommends for new deployments.
>
>

We don't recommend using a single VM for mission critical workloads, because it creates a single point of failure. For higher availability, deploy multiple VMs in an [availability set][availability-set]. For more information, see [Running multiple VMs on Azure][multi-vm].

## Architecture diagram

Provisioning a VM in Azure involves more moving parts than just the VM itself. There are compute, networking, and storage elements.

> A Visio document that includes this architecture diagram is available for download from the [Microsoft download center][visio-download]. This diagram is on the "Compute - single VM" page.
>
>

![[0]][0]

* **Resource group.** A [*resource group*][resource-manager-overview] is a container that holds related resources. Create a resource group to hold the resources for this VM.
* **VM**. You can provision a VM from a list of published images or from a virtual hard disk (VHD) file that you upload to Azure Blob storage.
* **OS disk.** The OS disk is a VHD stored in [Azure Storage][azure-storage]. That means it persists even if the host machine goes down.
* **Temporary disk.** The VM is created with a temporary disk (the `D:` drive on Windows). This disk is stored on a physical drive on the host machine. It is *not* saved in Azure Storage, and might be deleted during reboots and other VM lifecycle events. Use this disk only for temporary data, such as page or swap files.
* **Data disks.** A [data disk][data-disk] is a persistent VHD used for application data. Data disks are stored in Azure Storage, like the OS disk.
* **Virtual network (VNet) and subnet.** Every VM in Azure is deployed into a VNet that is further divided into subnets.
* **Public IP address.** A public IP address is needed to communicate with the VM&mdash;for example over remote desktop (RDP).
* **Network interface (NIC)**. The NIC enables the VM to communicate with the virtual network.
* **Network security group (NSG)**. The [NSG][nsg] is used to allow/deny network traffic to the subnet. You can associate an NSG with an individual NIC or with a subnet. If you associate it with a subnet, the NSG rules apply to all VMs in that subnet.
* **Diagnostics.** Diagnostic logging is crucial for managing and troubleshooting the VM.

## Recommendations

The following recommendations apply for most scenarios. Follow these recommendations unless you have a specific requirement that overrides them.

### VM recommendations

Azure offers many different virtual machine sizes, but we recommend the DS- and GS-series because these machine sizes support [Premium Storage][premium-storage]. Select one of these machine sizes unless you have a specialized workload such as high-performance computing. For details, see [virtual machine sizes][virtual-machine-sizes].

If you are moving an existing workload to Azure, start with the VM size that's the closest match to your on-premises servers. Then measure the performance of your actual workload with respect to CPU, memory, and disk input/output operations per second (IOPS), and adjust the size if needed. If you require multiple NICs for your VM, be aware that the maximum number of NICs is a function of the [VM size][vm-size-tables].   

When you provision the VM and other resources, you must specify a region. Generally, choose a region closest to your internal users or customers. However, not all VM sizes may be available in all regions. For details, see [services by region][services-by-region]. To see a list of the VM sizes available in a given region, run the following Azure command-line interface (CLI) command:

```
azure vm sizes --location <location>
```

For information about choosing a published VM image, see [Navigate and select Windows virtual machine images in Azure with Powershell or CLI][select-vm-image].

### Disk and storage recommendations

For best disk I/O performance, we recommend [Premium Storage][premium-storage], which stores data on solid state drives (SSDs). Cost is based on the size of the provisioned disk. IOPS and throughput also depend on disk size, so when you provision a disk, consider all three factors (capacity, IOPS, and throughput).

Create separate Azure storage accounts for each VM to hold the virtual hard disks (VHDs) in order to avoid hitting the IOPS limits for storage accounts.

Add one or more data disks. When you create a new VHD, it is unformatted. Log into the VM to format the disk. If you have a large number of data disks, be aware of the total I/O limits of the storage account. For more information, see [virtual machine disk limits][vm-disk-limits].

When possible, install applications on a data disk, not the OS disk. However, some legacy applications might need to install components on the C: drive. In that case, you can [resize the OS disk][resize-os-disk] using PowerShell.

For best performance, create a separate storage account to hold diagnostic logs. A standard locally redundant storage (LRS) account is sufficient for diagnostic logs.

### Network recommendations

The public IP address can be dynamic or static. The default is dynamic.

* Reserve a [static IP address][static-ip] if you need a fixed IP address that won't change &mdash; for example, if you need to create an A record in DNS, or need the IP address to be added to a safe list.
* You can also create a fully qualified domain name (FQDN) for the IP address. You can then register a [CNAME record][cname-record] in DNS that points to the FQDN. For more information, see [create a fully qualified domain name in the Azure portal][fqdn].

All NSGs contain a set of [default rules][nsg-default-rules], including a rule that blocks all inbound Internet traffic. The default rules cannot be deleted, but other rules can override them. To enable Internet traffic, create rules that allow inbound traffic to specific ports &mdash; for example, port 80 for HTTP.  

To enable RDP, add an NSG rule that allows inbound traffic to TCP port 3389.

## Scalability considerations

You can scale a VM up or down by [changing the VM size](../articles/virtual-machines/windows/sizes.md). To scale out horizontally, put two or more VMs into an availability set behind a load balancer. For details, see [Running multiple VMs on Azure for scalability and availability][multi-vm].

## Availability considerations

For higher availabiility, deploy multiple VMs in an availability set. This also provides a higher [service level agreement][vm-sla] (SLA).

Your VM may be affected by [planned maintenance][planned-maintenance] or [unplanned maintenance][manage-vm-availability]. You can use [VM reboot logs][reboot-logs] to determine whether a VM reboot was caused by planned maintenance.

VHDs are stored in [Azure storage][azure-storage], and Azure storage is replicated for durability and availability.

To protect against accidental data loss during normal operations (for example, because of user error), you should also implement point-in-time backups, using [blob snapshots][blob-snapshot] or another tool.

## Manageability considerations

**Resource groups.** Put tightly-coupled resources that share the same life cycle into the same [resource group][resource-manager-overview]. Resource groups allow you to deploy and monitor resources as a group and roll up billing costs by resource group. You can also delete resources as a set, which is very useful for test deployments. Give resources meaningful names. That makes it easier to locate a specific resource and understand its role. See [Recommended Naming Conventions for Azure Resources][naming conventions].

**VM diagnostics.** Enable monitoring and diagnostics, including basic health metrics, diagnostics infrastructure logs, and [boot diagnostics][boot-diagnostics]. Boot diagnostics can help you diagnose a boot failure if your VM gets into a nonbootable state. For more information, see [Enable monitoring and diagnostics][enable-monitoring]. Use the [Azure Log Collection][log-collector] extension to collect Azure platform logs and upload them to Azure storage.   

The following CLI command enables diagnostics:

```
azure vm enable-diag <resource-group> <vm-name>
```

**Stopping a VM.** Azure makes a distinction between "stopped" and "deallocated" states. You are charged when the VM status is stopped, but not when the VM is deallocated.

Use the following CLI command to deallocate a VM:

```
azure vm deallocate <resource-group> <vm-name>
```

In the Azure portal, the **Stop** button deallocates the VM. However, if you shut down through the OS while logged in, the VM is stopped but *not* deallocated, so you will still be charged.

**Deleting a VM.** If you delete a VM, the VHDs are not deleted. That means you can safely delete the VM without losing data. However, you will still be charged for storage. To delete the VHD, delete the file from [Blob storage][blob-storage].

To prevent accidental deletion, use a [resource lock][resource-lock] to lock the entire resource group or lock individual resources, such as the VM.

## Security considerations

Use [Azure Security Center][security-center] to get a central view of the security state of your Azure resources. Security Center monitors potential security issues and provides a comprehensive picture of the security health of your deployment. Security Center is configured per Azure subscription. Enable security data collection as described in [Use Security Center]. When data collection is enabled, Security Center automatically scans any VMs created under that subscription.

**Patch management.** If enabled, Security Center checks whether security and critical updates are missing. Use [Group Policy settings][group-policy] on the VM to enable automatic system updates.

**Antimalware.** If enabled, Security Center checks whether antimalware software is installed. You can also use Security Center to install antimalware software from inside the Azure portal.

**Operations.** Use [role-based access control][rbac] (RBAC) to control access to the Azure resources that you deploy. RBAC lets you assign authorization roles to members of your DevOps team. For example, the Reader role can view Azure resources but not create, manage, or delete them. Some roles are specific to particular Azure resource types. For example, the Virtual Machine Contributor role can restart or deallocate a VM, reset the administrator password, create a new VM, and so forth. Other [built-in RBAC roles][rbac-roles] that might be useful for this reference architecture include [DevTest Labs User][rbac-devtest] and [Network Contributor][rbac-network]. A user can be assigned to multiple roles, and you can create custom roles for even more fine-grained permissions.

> [!NOTE]
> RBAC does not limit the actions that a user logged into a VM can perform. Those permissions are determined by the account type on the guest OS.   
>
>

To reset the local administrator password, run the `vm reset-access` Azure CLI command.

```
azure vm reset-access -u <user> -p <new-password> <resource-group> <vm-name>
```

Use [audit logs][audit-logs] to see provisioning actions and other VM events.

**Data encryption.** Consider [Azure Disk Encryption][disk-encryption] if you need to encrypt the OS and data disks.

## Solution deployment

A deployment for this reference architecture is available on [GitHub][github-folder]. It includes a VNet, NSG, and a single VM. To deploy the architecture, follow these steps:

1. Right click the button below and select either "Open link in new tab" or "Open link in new window."  
   [![Deploy to Azure](../articles/guidance/media/blueprints/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmspnp%2Freference-architectures%2Fmaster%2Fguidance-compute-single-vm%2Fazuredeploy.json)
2. Once the link has opened in the Azure portal, you must enter values for some of the settings:

   * The **Resource group** name is already defined in the parameter file, so select **Create New** and enter `ra-single-vm-rg` in the text box.
   * Select the region from the **Location** drop down box.
   * Do not edit the **Template Root Uri** or the **Parameter Root Uri** text boxes.
   * Select **windows** in the **Os Type** drop down box.
   * Review the terms and conditions, then click the **I agree to the terms and conditions stated above** checkbox.
   * Click on the **Purchase** button.
3. Wait for the deployment to complete.
4. The parameter files  include a hard-coded administrator user name and password, and it is strongly recommended that you immediately change both. Click on the VM named `ra-single-vm0 `in the Azure portal. Then, click on **Reset password** in the **Support + troubleshooting** blade. Select **Reset password** in the **Mode** dropdown box, then select a new **User name** and **Password**. Click the **Update** button to persist the new user name and password.

For information on additional ways to deploy this reference architecture, see the readme file in the [guidance-single-vm][github-folder]] GitHub folder.

## Customize the deployment
If you need to change the deployment to match your needs, follow the instructions in the [readme][github-folder].

## Next steps
For higher availability, deploy two or more VMs behind a load balancer. For more information, see [Running multiple VMs on Azure][multi-vm].

<!-- links -->

[audit-logs]: https://azure.microsoft.com/en-us/blog/analyze-azure-audit-logs-in-powerbi-more/
[availability-set]:../articles/virtual-machines/windows/create-availability-set.md
[azure-cli]: /cli/azure/get-started-with-az-cli2
[azure-storage]: ../articles/storage/storage-introduction.md
[blob-snapshot]: ../articles/storage/storage-blob-snapshots.md
[blob-storage]: ../articles/storage/storage-introduction.md
[boot-diagnostics]: https://azure.microsoft.com/en-us/blog/boot-diagnostics-for-virtual-machines-v2/
[cname-record]: https://en.wikipedia.org/wiki/CNAME_record
[data-disk]: ../articles/storage/storage-about-disks-and-vhds-windows.md
[disk-encryption]: ../articles/security/azure-security-disk-encryption.md
[enable-monitoring]: ../articles/monitoring-and-diagnostics/insights-how-to-use-diagnostics.md
[fqdn]:../articles/virtual-machines/windows/portal-create-fqdn.md
[github-folder]: http://github.com/mspnp/reference-architectures/tree/master/guidance-compute-single-vm
[group-policy]: https://technet.microsoft.com/en-us/library/dn595129.aspx
[log-collector]: https://azure.microsoft.com/en-us/blog/simplifying-virtual-machine-troubleshooting-using-azure-log-collector/
[manage-vm-availability]:../articles/virtual-machines/windows/manage-availability.md
[multi-vm]: ../articles/guidance/guidance-compute-multi-vm.md
[naming conventions]: ../articles/guidance/guidance-naming-conventions.md
[nsg]: ../articles/virtual-network/virtual-networks-nsg.md
[nsg-default-rules]: ../articles/virtual-network/virtual-networks-nsg.md#default-rules
[planned-maintenance]:../articles/virtual-machines/windows/planned-maintenance.md
[premium-storage]: ../articles/storage/storage-premium-storage.md
[rbac]: ../articles/active-directory/role-based-access-control-what-is.md
[rbac-roles]: ../articles/active-directory/role-based-access-built-in-roles.md
[rbac-devtest]: ../articles/active-directory/role-based-access-built-in-roles.md#devtest-labs-user
[rbac-network]: ../articles/active-directory/role-based-access-built-in-roles.md#network-contributor
[reboot-logs]: https://azure.microsoft.com/en-us/blog/viewing-vm-reboot-logs/
[resize-os-disk]:../articles/virtual-machines/windows/expand-os-disk.md
[Resize-VHD]: https://technet.microsoft.com/en-us/library/hh848535.aspx
[Resize virtual machines]: https://azure.microsoft.com/en-us/blog/resize-virtual-machines/
[resource-lock]: ../articles/resource-group-lock-resources.md
[resource-manager-overview]: ../articles/azure-resource-manager/resource-group-overview.md
[security-center]: https://azure.microsoft.com/en-us/services/security-center/
[select-vm-image]:../articles/virtual-machines/windows/cli-ps-findimage.md
[services-by-region]: https://azure.microsoft.com/en-us/regions/#services
[static-ip]: ../articles/virtual-network/virtual-networks-reserved-public-ip.md
[storage-account-limits]: ../articles/azure-subscription-service-limits.md#storage-limits
[storage-price]: https://azure.microsoft.com/pricing/details/storage/
[Use Security Center]: ../articles/security-center/security-center-get-started.md#use-security-center
[virtual-machine-sizes]: ../articles/virtual-machines/windows/sizes.md
[visio-download]: http://download.microsoft.com/download/1/5/6/1569703C-0A82-4A9C-8334-F13D0DF2F472/RAs.vsdx
[vm-disk-limits]: ../articles/azure-subscription-service-limits.md#virtual-machine-disk-limits
[vm-resize]:../articles/virtual-machines/linux/change-vm-size.md
[vm-sla]: https://azure.microsoft.com/support/legal/sla/virtual-machines
[vm-size-tables]: ../articles/virtual-machines/windows/sizes.md
[0]: ./media/guidance-blueprints/compute-single-vm.png "Single Windows VM architecture in Azure"
[readme]: https://github.com/mspnp/reference-architectures/blob/master/guidance-compute-single-vm
[blocks]: https://github.com/mspnp/template-building-blocks
