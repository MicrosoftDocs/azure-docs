---
title: Maintenance notifications 
description: Overview of maintenance notifications for virtual machines running in Azure.
ms.service: virtual-machines
ms.subservice: maintenance
ms.workload: infrastructure-services
ms.topic: conceptual
ms.date: 8/12/2020
#pmcontact: shants
---

# Handling planned maintenance notifications

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Azure periodically performs updates to improve the reliability, performance, and security of the host infrastructure for virtual machines. Updates are changes like patching the hosting environment or upgrading and decommissioning hardware. A majority of these updates are completed without any impact to the hosted virtual machines. However, there are cases where updates do have an impact:

- If the maintenance does not require a reboot, Azure pauses the VM for few seconds while the host is updated. These types of maintenance operations are applied fault domain by fault domain. Progress is stopped if any warning health signals are received.

- If maintenance requires a reboot, you get a notice of when the maintenance is planned. You are given a time window of about 35 days where you can start the maintenance yourself, when it works for you.


Planned maintenance that requires a reboot is scheduled in waves. Each wave has different scope (regions).

- A wave starts with a notification to customers. Virtual Machine related Maintenance notifications are available under [Service Health](https://aka.ms/azureservicehealth) in the Azure portal. For some specific Virtual Machine Planned Maintenance scenarios, Azure may also communicate the schedule by sending an additional email to the Subscription Classic Admin, Co-Admin, and Subscription Owners group. [Azure Service Health](https://azure.microsoft.com/get-started/azure-portal/service-health/#overview) enables users to configure their own custom alerts for the Planned Maintenance category. With Azure Service Health alerts, you can add more recipients and messaging options like email, SMS, and webhooks using [Activity Log Alerts](../service-health/alerts-activity-log-service-notifications-portal.md).  
- Once a notification goes out, a *self-service window* is made available. During this window, you can query which of your virtual machines are affected and start maintenance based on your own scheduling needs. The self-service window is typically about 35 days.
- After the self-service window, a *scheduled maintenance window* begins. At some point during this window, Azure schedules and applies the required maintenance to your virtual machine. 

The goal in having two windows is to give you enough time to start maintenance and reboot your virtual machine while knowing when Azure will automatically start maintenance.


You can use the Azure portal, PowerShell, REST API, and CLI to query for the maintenance windows for your VMs and start self-service maintenance.

 
## Should you start maintenance using during the self-service window?  

The following guidelines should help you decide whether to use this capability and start maintenance at your own time. 

> [!NOTE] 
> Self-service maintenance might not be available for all of your VMs. To determine if proactive redeploy is available for your VM, look for the **Start now** in the maintenance status. Self-service maintenance is currently not available for Cloud Services (Web/Worker Role) and Service Fabric.


Self-service maintenance is not recommended for deployments using **availability sets**. Availability sets are already only updated one update domain at a time. 

- Let Azure trigger the maintenance. For maintenance that requires reboot, maintenance will be done update domain by update domain. The update domains do not necessarily receive the maintenance sequentially, and that there is a 30-minute pause between update domains. 
- If a temporary loss of some capacity (1 update domain) is a concern, you can add instances during the maintenance period. 
- For maintenance that does not require reboot, updates are applied at the fault domain level. 

**Don't** use self-service maintenance in the following scenarios: 
- If you shut down your VMs frequently, either manually, using DevTest Labs, using auto-shutdown, or following a schedule, it could revert the maintenance status and therefore cause additional downtime.
- On short-lived VMs that you know will be deleted before the end of the maintenance wave. 
- For workloads with a large state stored in the local (ephemeral) disk that is desired to be maintained upon update. 
- For cases where you resize your VM often, as it could revert the maintenance status. 
- If you have adopted scheduled events that enable proactive failover or graceful shutdown of your workload, 15 minutes before start of maintenance shutdown

**Use** self-service maintenance, if you are planning to run your VM uninterrupted during the scheduled maintenance phase and none of the counter-indications mentioned above are applicable. 

It is best to use self-service maintenance in the following cases:
- You need to communicate an exact maintenance window to your management or end-customer. 
- You need to complete the maintenance by a given date. 
- You need to control the sequence of maintenance, for example, multi-tier application to guarantee safe recovery.
- More than 30 minutes of VM recovery time is needed between two update domains (UDs). To control the time between update domains, you must trigger maintenance on your VMs one update domain (UD) at a time.


## FAQ


**Q: Why do you need to reboot my virtual machines now?**

**A:** While the majority of updates and upgrades to the Azure platform do not impact virtual machine's availability, there are cases where we can't avoid rebooting virtual machines hosted in Azure. We have accumulated several changes that require us to restart our servers that will result in virtual machines reboot.

**Q: If I follow your recommendations for High Availability by using an Availability Set, am I safe?**

**A:** Virtual machines deployed in an availability set or virtual machine scale sets have the notion of Update Domains (UD). When performing maintenance, Azure honors the UD constraint and will not reboot virtual machines from different UD (within the same availability set).  Azure also waits for at least 30 minutes before moving to the next group of virtual machines. 

For more information about high availability, see [Availability for virtual machines in Azure](availability.md).

**Q: How do I get notified about planned maintenance?**

**A:** A planned maintenance wave starts by setting a schedule to one or more Azure regions. Virtual Machine related Maintenance notifications are available under [Service Health](https://aka.ms/azureservicehealth) in the Azure portal. For some specific Virtual Machine Planned Maintenance scenarios, Azure may also communicate the schedule by sending an additional email (one email per subscription with all recipients added) to the Subscription Classic Admin, Co-Admin, and Subscription Owners group.

[Azure Service Health](https://azure.microsoft.com/get-started/azure-portal/service-health/#overview) enables users to configure their own custom alerts for the Planned Maintenance category. With Azure Service Health alerts you can add more recipients and messaging options like email, SMS, and webhooks using [Activity Log Alerts](../service-health/alerts-activity-log-service-notifications-portal.md).

In case you deploy a virtual machine to a region where planned maintenance is already scheduled, you won't receive the notification but rather need to check the maintenance state of the VM.

**Q: I don't see any indication of planned maintenance in the portal, PowerShell, or CLI. What is wrong?**

**A:** Information related to planned maintenance is available during a planned maintenance wave only for the VMs that are going to be impacted by it. In other words, if you see not data, it could be that the maintenance wave has already completed (or not started) or that your virtual machine is already hosted in an updated server.

**Q: Is there a way to know exactly when my virtual machine will be impacted?**

**A:** When setting the schedule, we define a time window of several days. However, the exact sequencing of servers (and VMs) within this window is unknown. Customers who would like to know the exact time for their VMs can use [scheduled events](./linux/scheduled-events.md) and query from within the virtual machine and receive a 15-minute notification before a VM reboot.

**Q: How long will it take you to reboot my virtual machine?**

**A:**  Depending on the size of your VM, reboot may take up to several minutes during the self-service maintenance window. During the Azure initiated reboots in the scheduled maintenance window, the reboot will typically take about 25 minutes. Note that in case you use Cloud Services (Web/Worker Role), Virtual Machine Scale Sets, or availability sets, you will be given 30 minutes between each group of VMs (UD) during the scheduled maintenance window.

**Q: What is the experience in the case of Virtual Machine Scale Sets?**

**A:** Planned maintenance is now available for Virtual Machine Scale Sets. For instructions on how to initiate self-service maintenance refer [planned maintenance for virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-maintenance-notifications.md) document.

**Q: What is the experience in the case of Cloud Services (Web/Worker Role) and Service Fabric?**

**A:** While these platforms are impacted by planned maintenance, customers using these platforms are considered safe given that only VMs in a single Upgrade Domain (UD) will be impacted at any given time. Self-service maintenance is currently not available for Cloud Services (Web/Worker Role) and Service Fabric.

**Q: I don’t see any maintenance information on my VMs. What went wrong?**

**A:** There are several reasons why you’re not seeing any maintenance information on your VMs:
1.	You are using a subscription marked as Microsoft internal.
2.	Your VMs are not scheduled for maintenance. It could be that the maintenance wave has ended, canceled, or modified so that your VMs are no longer impacted by it.
3. You have deallocated VM and then started it. This can cause VM to move to a location which does not have planned maintenance wave scheduled. So the VM will not show maintenance information any more. 
4.	You don’t have the **Maintenance** column added to your VM list view. While we have added this column to the default view, customers who configured to see non-default columns must manually add the **Maintenance** column to their VM list view.

**Q: My VM is scheduled for maintenance for the second time. Why?**

**A:** There are several use cases where you will see your VM scheduled for maintenance after you have already completed your maintenance-redeploy:
1.	We have canceled the maintenance wave and restarted it with a different payload. It could be that we've detected faulted payload and we simply need to deploy an additional payload.
2.	Your VM was *service healed* to another node due to a hardware fault.
3.	You have selected to stop (deallocate) and restart the VM.
4.	You have **auto shutdown** turned on for the VM.



## Next steps

You can handle planned maintenance using the [Azure CLI](maintenance-notifications-cli.md), [Azure PowerShell](maintenance-notifications-powershell.md) or [portal](maintenance-notifications-portal.md).
