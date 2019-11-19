---
title: Maintenance notifications for Azure VMs | Microsoft Docs
description: Overview of maintenance notifications for virtual machines running in Azure.
services: virtual-machines
documentationcenter: ''
author: shants123
editor: ''
tags: azure-service-management,azure-resource-manager

ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 11/19/2019
ms.author: shants
---

# Handling planned maintenance notifications

Azure periodically performs updates to improve the reliability, performance, and security of the host infrastructure for virtual machines. Updates are changes like patching the hosting environment or upgrading and decommissioning hardware. A majority of these updates are completed without any impact to the hosted virtual machines. However, there are cases where updates do have an impact:

- If the maintenance does not require a reboot, Azure uses in-place migration to pause the VM while the host is updated. These types maintenance operations are applied fault domain by fault domain. Progress is stopped if any warning health signals are received.

- If maintenance requires a reboot, you get a notice of when the maintenance is planned. You are given a time window of about 35 days where you can start the maintenance yourself, when it works for you.


Planned maintenance that requires a reboot is scheduled in waves. Each wave has different scope (regions).

- A wave starts with a notification to customers. By default, notification is sent to subscription owner and co-owners. You can add more recipients and messaging options like email, SMS, and webhooks, using [Activity Log Alerts](../articles/azure-monitor/platform/activity-logs-overview.md).  
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

## Next steps

You can handle planned maintenance using the [Azure CLI](maintenance-notifications-cli.md), [Azure PowerShell](maintenance-notifications-powershell.md) or [portal](maintenance-notifications-portal.md).

