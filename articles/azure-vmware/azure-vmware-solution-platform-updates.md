---
title: Platform updates for Azure VMware Solution
description: Learn about the platform updates to Azure VMware Solution.
ms.topic: reference
ms.date: 03/05/2021
---

# Platform updates for Azure VMware Solution


## March 4, 2021

Important updates to Azure VMware Solutions will be applied starting in March 2021. You'll receive notification through Azure Service Health that includes the timeline of the maintenance. In this article, you learn what to expect during this maintenance operation and changes to your private cloud.

- Azure VMware Solutions will apply patches to ESXi in existing private clouds to [VMware ESXi 6.7, Patch Release ESXi670-202011002](https://docs.vmware.com/en/VMware-vSphere/6.7/rn/esxi670-202011002.html) through March 15, 2021.

- Documented workarounds for the vSphere stack, as per [VMSA-2021-0002](https://www.vmware.com/security/advisories/VMSA-2021-0002.html), will also be applied through March 15, 2021.

>[!NOTE]
>This is non-disruptive and should not impact Azure VMware Services or workloads. During maintenance, various VMware alerts, such as _Lost network connectivity on DVPorts_ and _Lost uplink redundancy on DVPorts_, appear in vCenter and clear automatically as the maintenance progresses.


## Post update
Once complete, newer versions of VMware components appear. If you notice any issues or have any questions, contact our support team by opening a support ticket.



