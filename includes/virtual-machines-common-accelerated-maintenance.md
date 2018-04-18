

## What is happening?

An industry-wide, hardware-based security vulnerability was [disclosed on January 3](https://googleprojectzero.blogspot.com/2018/01/reading-privileged-memory-with-side.html). Keeping customers secure is always our top priority and we are taking active steps to ensure that no Azure customer is exposed to these vulnerabilities.

With the public disclosure of the security vulnerability, we [accelerated the planned maintenance timing](https://azure.microsoft.com/blog/securing-azure-customers-from-cpu-vulnerability/) and began automatically rebooting the VMs that still needed the update.


## How can I see which of my VMs are already updated? 

You can see the status of your VMs, and if the reboot completed, in the [VM list in the Azure portal](https://aka.ms/T08tdc). Your VMs are listed as either “Already updated” if the update has been applied, or “Scheduled” if the update is still required. If you want to see just your VMs “Scheduled” refer to your [Azure Service Health](https://portal.azure.com/).

## Can I find out exactly when my VMs will be rebooted?

The best way to get an alert about the reboot is to configure [Scheduled Events](https://docs.microsoft.com/azure/virtual-machines/windows/scheduled-events). This provides a 15 minute notification of the VM going down due to maintenance.

## Can I manually redeploy now to perform the required maintenance? 

We cannot guarantee that a redeployed VM will be allocated to an updated host. Wherever possible, the Azure fabric will try to allocate VMs to hosts that are already updated. It is possible that redeploying a VM could land on a non-updated host, in which case you may be subject to a second reboot, forced as part of scheduled maintenance. As a result, manual redeploys are not recommended as a workaround.

## How long will the reboot take? 

Most reboots are taking approximately **30 minutes**.

## Does the guest OS need to be updated? 

This Azure infrastructure update addresses the disclosed vulnerability at the hypervisor level and does not require an update to your Windows or Linux VM images. However, as always, you should continue to apply security best practices for your VM images. Please consult with the vendor of your operating systems for updates and instructions, as needed. For Windows Server VM customers, guidance has now been published and is available [here](../articles/virtual-machines/windows/mitigate-se.md).

## Will there be a performance impact as a result of resolving this update?

The majority of Azure customers have not seen a noticeable performance impact with this update. We’ve worked to optimize the CPU and disk I/O path and are not seeing noticeable performance impact after the fix has been applied. A small set of customers may experience some networking performance impact. This can be addressed by using Azure Accelerated Networking, for [Windows](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-powershell) or [Linux](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-cli), which is a free capability available to all Azure customers.

## I follow your recommendations for High Availability, will my environment remain highly available during the reboot?

Yes, virtual machines deployed in an availability set or virtual machine scale sets have the Update Domains (UD) construct. When performing maintenance, Azure honors the UD constraint and will not reboot virtual machines from different UD (within the same availability set). For more information about high availability, refer to [Manage the availability of Windows virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/manage-availability) or [Manage the availability of Linux virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/linux/manage-availability).

## I have architected my business continuity/disaster recovery plan using region pairs. Will reboots to my VMs occur in region pairs at the same time?

Normally, Azure planned maintenance events are rolled out to paired regions one at a time to minimize the risk of disruption in both regions. However, due to the urgent nature of this security update, we are rolling the update out to all regions concurrently.

## ​What about PaaS services on Azure?  

The Azure platform services including web & mobile, data services, IoT, serverless, etc. have addressed the vulnerability. There is no action needed for customers using these services.

## Intel released additional guidance on January 22, 2018 related to the security vulnerabilities.  Will this guidance cause any additional maintenance activities by Azure?  

Azure mitigations previously announced on Jan 3, 2018 are unaffected by the [updated guidance](https://newsroom.intel.com/news/root-cause-of-reboot-issue-identified-updated-guidance-for-customers-and-partners/) from Intel. There will be no additional maintenance activity on customer VMs as a result of this new information.
 

## Next steps

To learn more, see [Securing Azure customers from CPU vulnerability](https://azure.microsoft.com/blog/securing-azure-customers-from-cpu-vulnerability/).
