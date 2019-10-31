---
 title: include file
 description: include file
 services: virtual-machines
 author: shants123
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 10/04/2019
 ms.author: shants
 ms.custom: include file
---

## FAQ


**Q: Why do you need to reboot my virtual machines now?**

**A:** While the majority of updates and upgrades to the Azure platform do not impact virtual machine's availability, there are cases where we can't avoid rebooting virtual machines hosted in Azure. We have accumulated several changes that require us to restart our servers that will result in virtual machines reboot.

**Q: If I follow your recommendations for High Availability by using an Availability Set, am I safe?**

**A:** Virtual machines deployed in an availability set or virtual machine scale sets have the notion of Update Domains (UD). When performing maintenance, Azure honors the UD constraint and will not reboot virtual machines from different UD (within the same availability set).  Azure also waits for at least 30 minutes before moving to the next group of virtual machines. 

For more information about high availability, see [Availability for virtual machines in Azure](../articles/virtual-machines/linux/availability.md).

**Q: How do I get notified about planned maintenance?**

**A:** A planned maintenance wave starts by setting a schedule to one or more Azure regions. Soon after, an email notification is sent to the subscription owners (one email per subscription). Additional channels and recipients for this notification could be configured using Activity Log Alerts. In case you deploy a virtual machine to a region where planned maintenance is already scheduled, you will not receive the notification but rather need to check the maintenance state of the VM.

**Q: I don't see any indication of planned maintenance in the portal, Powershell, or CLI. What is wrong?**

**A:** Information related to planned maintenance is available during a planned maintenance wave only for the VMs that are going to be impacted by it. In other words, if you see not data, it could be that the maintenance wave has already completed (or not started) or that your virtual machine is already hosted in an updated server.

**Q: Is there a way to know exactly when my virtual machine will be impacted?**

**A:** When setting the schedule, we define a time window of several days. However, the exact sequencing of servers (and VMs) within this window is unknown. Customers who would like to know the exact time for their VMs can use [scheduled events](../articles/virtual-machines/linux/scheduled-events.md) and query from within the virtual machine and receive a 15-minute notification before a VM reboot.

**Q: How long will it take you to reboot my virtual machine?**

**A:**  Depending on the size of your VM, reboot may take up to several minutes during the self-service maintenance window. During the Azure initiated reboots in the scheduled maintenance window, the reboot will typically take about 25 minutes. Note that in case you use Cloud Services (Web/Worker Role), Virtual Machine Scale Sets, or availability sets, you will be given 30 minutes between each group of VMs (UD) during the scheduled maintenance window.

**Q: What is the experience in the case of Virtual Machine Scale Sets?**

**A:** Planned maintenance is now available for Virtual Machine Scale Sets. For instructions on how to initiate self-service maintenance refer [planned maintenance for virtual machine scale sets](../articles/virtual-machine-scale-sets/virtual-machine-scale-sets-maintenance-notifications.md) document.

**Q: What is the experience in the case of Cloud Services (Web/Worker Role) and Service Fabric?**

**A:** While these platforms are impacted by planned maintenance, customers using these platforms are considered safe given that only VMs in a single Upgrade Domain (UD) will be impacted at any given time. Self-service maintenance is currently not available for Cloud Services (Web/Worker Role) and Service Fabric.

**Q: I don’t see any maintenance information on my VMs. What went wrong?**

**A:** There are several reasons why you’re not seeing any maintenance information on your VMs:
1.	You are using a subscription marked as Microsoft internal.
2.	Your VMs are not scheduled for maintenance. It could be that the maintenance wave has ended, canceled, or modified so that your VMs are no longer impacted by it.
3.	You don’t have the **Maintenance** column added to your VM list view. While we have added this column to the default view, customers who configured to see non-default columns must manually add the **Maintenance** column to their VM list view.

**Q: My VM is scheduled for maintenance for the second time. Why?**

**A:** There are several use cases where you will see your VM scheduled for maintenance after you have already completed your maintenance-redeploy:
1.	We have canceled the maintenance wave and restarted it with a different payload. It could be that we've detected faulted payload and we simply need to deploy an additional payload.
2.	Your VM was *service healed* to another node due to a hardware fault.
3.	You have selected to stop (deallocate) and restart the VM.
4.	You have **auto shutdown** turned on for the VM.

