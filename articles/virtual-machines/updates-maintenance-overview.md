---
title: Guest updates and host maintenance overview
description: Learn about the updates and maintenance options available with virtual machines in Azure
author: mimckitt
ms.author: mimckitt
ms.service: virtual-machines
ms.topic: overview
ms.date: 03/20/2024
ms.reviewer: cynthn
---

# Guest updates and host maintenance overview

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

This article provides an overview of the various guest updates and host maintenance options for Azure virtual machines (VMs).

Azure periodically updates its infrastructure to improve reliability, performance, security or to launch new features. Most updates are transparent to the customers. To incorporate these updates Azure uses a robust infrastructure including region pairs, availability zones in combination with multiple tools and features. Azure also offers customers the ability to control updates on various Azure machines including Virtual Machine Scale Sets, Host Machines, Guest Virtual Machines and Extensions attached to VMs. This control is possible through maintenance configurations which customers can use to set up recurring schedules for when they want available platform updates to occur.

Azure infrastructure updates can range from upgrading network components, decommissioning hardware on network, patching software components in hosting environment or updating guest OS/ software’s on VMs. Each of these updates are performed using different tools available in Azure.

Maintenance platform aims to provide customers with *unified maintenance experience* for all Azure resources that are impacted during maintenance. Maintenance experience is available for a variety of Azure resources, including host ([Azure Dedicated Host](dedicated-hosts.md) and [Isolated](isolation.md) VMs), guest (VMs and Arc VMs), AKS, SFMC, Network Gateways (VPN Gateway, ExpressRoute, Virtual Network Gateway) resources either via Azure Portal, PowerShell or CLI. [Maintenance control](maintenance-configurations.md) provides customers with an option to skip or defer certain updates and schedule them only during their preferred maintenance window.

## Host maintenance

Host maintenance is performed on the physical hosts where VMs are located and are usually transparent to the customers. But some updates can have an impact that is tolerated by most customers. During these updates the VMs that are allocated on the hosts might freeze (*non-rebootful updates*), reboot (*rebootful updates*) or be live migrated to another updated hosts. Azure chooses the update mechanism that's least impactful to customer VMs. 

### Dedicated hosts, Isolated VMs and Shared Hosts  
   
   Host maintenance experience is available for [Dedicated](dedicated-hosts.md) hosts, [Isolated](isolation.md) VMs, and Shared hosts. Dedicated hosts are hosts in which all VMs are owned by one customer. Shared hosts are hosts in which VMs from multiple end-customers reside together. Isolated VMs are large machines that are isolated to a specific hardware type and dedicated to a single customer.  

   On [Dedicated](dedicated-hosts.md) hosts, customers have host maintenance experience available for all updates. Customers can opt into a maintenance control and schedule maintenance window based on their needs within 35days from last maintenance date. [Isolated](isolation.md) VMs have maintenance control experience available like Dedicated hosts.  

Customer can use [maintenance control](maintenance-configurations.md) to:

- Apply all updates together.
- Wait up to 35 days to apply updates for Host machines.
- Set up a maintenance schedule or use Azure Functions to automate platform updates.
- Maintenance configurations are effective across subscriptions and resource groups.

On Shared hosts, customers have maintenance experience available for rebootful updates or for high impact update. For updates that are <30sec maintenance control experience isn't available today.

### Maintenance notifications  
   
   Azure provides notifications before, during, and after maintenance operations. [Scheduled events](./windows/scheduled-events.md) provide notifications before an event starts and while it is in progress so your application can react automatically. [Flash Health Events](flash-overview.md) enable you to consume and analyze alerts and trends in VMs availability for reporting and root cause analysis.  
   
   #### Scheduled Events  
      
   [Scheduled events](./windows/scheduled-events.md) provide advance notification of upcoming availability impacts so you can prepare your application for the impact ahead of time. They are optimized for automated resiliency by being delivered directly to the impacted VM and to all VMs in the same placement group. For information on Scheduled Events, see [Scheduled Events for Windows VMs](./windows/scheduled-events.md) and [Scheduled Events for Linux](./linux/scheduled-events.md).
      
   #### Flash Health Events  
      
   [Flash Health Events](flash-overview.md) provide near real-time information about past availability impacts so customers can react to events and easily mitigate incidents. Flash information is available in Azure Monitor, AzureResource Graph, or Event Grid to integrate with your systems and processes.

## Guest updates 

### OS Image upgrade  
     
   [Automatic OS upgrades](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md?context=/azure/virtual-machines/context/context) are available for Virtual Machine Scale Sets. An upgrade works by replacing the OS disk of a VM with a new disk created using the latest image version. Any configured extensions and custom data scripts are run on the OS disk, while data disks are retained. To minimize the application downtime, upgrades take place in batches, with no more than 20% of the scale set upgrading at any time.
     Maintenance Control is also available for OS Image upgrades. Customers can opt into this experience by using maintenance configurations to schedule when these image upgrades are applied. To use this experience scale sets, need to have automatic OS upgrades enabled. Customers can schedule recurrence for up to a week (seven days) and a minimum of 5 hours is required for the maintenance window.

### Guest VM patching
   
   [Automatic VM guest patching](automatic-vm-guest-patching.md) is integrated with Azure update manager that allows you to save recurring deployment schedules to install updates for your Windows Server and Linux machines in Azure, in on-premises environments, and in other cloud environments connected using Azure Arc-enabled servers.

### Guest extension upgrades
   [Automatic Extension Upgrade](automatic-extension-upgrade.md) is available for Azure VMs and Azure Virtual Machine Scale Sets. When Automatic Extension Upgrade is enabled on a VM or scale set, the extension is upgraded automatically whenever the extension publisher releases a new version for that extension. The extension upgrade process replaces the existing extension version on a VM with a new version of the same extension when published by the extension publisher. The health of the VM is monitored after the new extension is installed. If the VM isn't in a healthy state within 5 minutes of the upgrade completion, the extension version is rolled back to the previous version.
Maintenance control on extensions is currently only available via CLI and PowerShell. Customers can schedule recurrence for up to a week (7 days) and a minimum of 5 hours is required for the maintenance window.

### Hotpatch  

[Hotpatching](../automanage/automanage-hotpatch.md?context=/azure/virtual-machines/context/context) is a new way to install updates on new Windows Server Azure Edition virtual machines (VMs) that doesn’t require a reboot after installation. Hotpatch for Windows Server Azure Edition VMs, has the following benefits:

- Lower workload impact with less reboots
- Faster deployment of updates as the packages are smaller, install faster, and have easier patch orchestration with Azure Update Manager
- Better protection, as the Hotpatch update packages are scoped to Windows security updates that install faster without rebooting

### Azure update management  

You can use [Update Management in Azure Automation](../automation/update-management/overview.md?context=/azure/virtual-machines/context/context) to manage to operate system updates for your Windows and Linux virtual machines in Azure, in on-premises environments, and in other cloud environments. You can quickly assess the status of available updates on all agent machines and manage the process of installing required updates for servers.

### Update manager  

[Update Manager](../update-center/overview.md) is a new-age unified service in Azure to manage and govern updates (Windows and Linux), both on-premises and other cloud platforms, across hybrid environments from a single dashboard. The new functionality provides native and out-of-the-box experience, granular access controls, flexibility to create schedules or take action now, ability to check updates automatically and much more. The enhanced functionality ensures that the administrators have visibility into the health of all systems in the environment. For more information, see [key benefits](../update-center/overview.md#key-benefits).

## Next steps

Review the [Availability and scale](availability.md) documentation for more ways to increase the uptime of your applications and services.
