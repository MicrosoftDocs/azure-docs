---
title: Azure VMware Solution platform updates
description: Learn about the updates to Azure VMware Solution.
ms.topic: reference
ms.date: 03/08/2021
---

# Azure VMware Solution platform updates
Important updates to Azure VMware Solutions will be applied starting in March 2021. You'll receive notification through Azure Service Health that includes the timeline of the maintenance. In this article, you learn what to expect during this maintenance operation and changes to your private cloud.

## March 4, 2021

### ESXi updates

- Applied patches to ESXi in existing private clouds to [VMware ESXi 6.7, Patch Release ESXi670-202011002](https://docs.vmware.com/en/VMware-vSphere/6.7/rn/esxi670-202011002.html). 

- Applied the documented workarounds for the vSphere stack as per [VMSA-2021-0002](https://www.vmware.com/security/advisories/VMSA-2021-0002.html).

>[!NOTE]
>This is non-disruptive and should not impact Azure VMware Services or workloads. During maintenance, various VMware alerts, such as _Lost network connectivity on DVPorts_ and _Lost uplink redundancy on DVPorts_, appear in vCenter and clear automatically as the maintenance progresses.

## March 15, 2021
Starting March 15, 2021, all new Azure VMware Solution private clouds get deployed with VMware vCenter version 6.7U3l and NSX-T version 3.1.1. 

Any existing private clouds will be updated and upgraded **through June 2021** to provide the latest features available in these releases. 

**Component version post-upgrade**
- vCenter 6.7U3l
- vSAN 6.7
- NSX Data Center 3.1.1
- HCX 3.5.2

You'll receive an email with the planned maintenance date and time.  You'll have the flexibility to reschedule an upgrade. The email will also have details on the upgraded component, its impact on workloads, private cloud access, and other Azure services.  You'll receive a notification an hour before the upgrade and again when it finishes. 


## Post update
Once complete, newer versions of VMware components appear. If you notice any issues or have any questions, contact our support team by opening a support ticket.



