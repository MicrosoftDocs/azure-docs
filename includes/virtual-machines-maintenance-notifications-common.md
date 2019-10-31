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

Azure periodically performs updates to improve the reliability, performance, and security of the host infrastructure for virtual machines. Updates are changes like patching the hosting environment or upgrading and decommissioning hardware. A majority of these updates are performed without any impact to the hosted virtual machines. However, there are cases where updates do have an impact:

- If the maintenance does not require a reboot, Azure uses in-place migration to pause the VM while the host is updated. These non-rebootful maintenance operations are applied fault domain by fault domain, and progress is stopped if any warning health signals are received.

- If maintenance requires a reboot, you get a notice of when the maintenance is planned. In these cases, you are given a time window that is typically 35 days where you can start the maintenance yourself, when it works for you.


Planned maintenance that requires a reboot is scheduled in waves. Each wave has different scope (regions).

- A wave starts with a notification to customers. By default, notification is sent to subscription owner and co-owners. You can add more recipients and messaging options like email, SMS, and webhooks, to the notifications using Azure [Activity Log Alerts](../azure-monitor/platform/activity-logs-overview.md).  
- At the time of the notification, a *self-service window* is made available. During this window that is typically 35 days, you can find which of your virtual machines are included in this wave and proactively start maintenance according to your own scheduling needs.
- After the self-service window, a *scheduled maintenance window* begins. At some point during this window, Azure schedules and applies the required maintenance to your virtual machine. 

The goal in having two windows is to give you enough time to start maintenance and reboot your virtual machine while knowing when Azure will automatically start maintenance.


You can use the Azure portal, PowerShell, REST API, and CLI to query for the maintenance windows for your VMs and start self-service maintenance.

 
## Should you start maintenance using during the self-service window?  

The following guidelines should help you decide whether to use this capability and start maintenance at your own time. 

> [!NOTE] 
> Self-service maintenance might not be available for all of your VMs. To determine if proactive redeploy is available for your VM, look for the **Start now** in the maintenance status. Self-service maintenance is currently not available for Cloud Services (Web/Worker Role) and Service Fabric.


Self-service maintenance is not recommended for deployments using **availability sets** since these are highly available setups, where only one update domain is impacted at any given time. 
- Let Azure trigger the maintenance. For maintenance that requires reboot, be aware that the maintenance will be done update domain by update domain, that the update domains do not necessarily receive the maintenance sequentially, and that there is a 30-minute pause between update domains. 
- If a temporary loss of some of your capacity (1/update domain count) is a concern, it can easily be compensated for by allocating addition instances during the maintenance period. 
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
- You need more than 30 minutes of VM recovery time between two update domains (UDs). To control the time between update domains, you must trigger maintenance on your VMs one update domain (UD) at a time.



