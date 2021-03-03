---
title: Azure VMware Solution platform updates
description: Learn about the updates to Azure VMware Solution.
ms.topic: reference
ms.date: 03/08/2021
---

# Azure VMware Solution platform updates
Important updates to Azure VMware Solutions will be applied starting in March 2021. You'll receive notification through Azure Service Health that includes the timeline of the maintenance. In this article, you learn what to expect during this maintenance operation and changes to your private cloud.

>[!NOTE]
>This is a non-disruptive upgrade. During the upgrade, you may see one of the redundant components go down.

## March 4, 2021


### ESXi updates

- Applied patches to ESXi in existing private clouds to [VMware ESXi 6.7, Patch Release ESXi670-202011002](https://docs.vmware.com/en/VMware-vSphere/6.7/rn/esxi670-202011002.html). 

- Applied the documented workarounds for the vSphere stack as per [VMSA-2021-0002](https://www.vmware.com/security/advisories/VMSA-2021-0002.html).

>[!NOTE]
>This is non-disruptive and should not impact Azure VMware Services or workloads. During this maintenance activity, various VMware alerts, such as _Lost network connectivity on DVPorts_ and _Lost uplink redundancy on DVPorts_, appear in vCenter and will clear automatically as the maintenance progresses.


### VMware infrastructure upgrade

VMware infrastructure of your private cloud will be updated to a newer version. This includes updates to vCenter, ESXi, NSX-T, and VMware HCX components (if deployed) of your private cloud.

During the upgrade, a new node will be added to your private cloud before a node is placed in maintenance mode for upgrade operation. This ensures the capacity of your private cloud and availability of your private cloud is maintained during the upgrade process. During the upgrade of VMware components, you may see alarms displayed on your vCenter web UI. The alarms are a part of the maintenance operations performed by the service operations team.

**Component version**
- ESXi 6.7U3.XXX
- vCenter 6.7U3.XX
- vSAN 6.7.XX
- NSX Data Center 3.2.1.XXX
- HCX 4.0.XX

### Datacenter updates
This update includes updates to datacenter infrastructure. Non-disruptive updates will be performed during the maintenance period. You will notice reduced redundancy during the update process. Alerts may be generated in your private cloud VMware infrastructure, your ExpressRoute circuits, GlobalReach connections, and any Site-to-Site VPN devices related to one of the link availabilities. This is normal during the update as the components will be rebooted as a part of the update.

- If a Site-to-Site VPN is deployed as a single instance (non-HA), you may have to re-establish the VPN connection.
- If you use a Point-to-Site VPN connection, you will have to re-establish the VPN connection.

## Post update
Once the updates are complete, you should see newer versions of VMware components. If you notice any issues or have any questions, contact our support team by opening a support ticket.



