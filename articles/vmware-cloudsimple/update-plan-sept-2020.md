--- 
title: Azure VMware Solution by CloudSimple September 2020 update
description: In this article, learn about what to expect during this maintenance operation and changes to your private cloud.
author: dikamath
ms.author: dikamath 
ms.date: 09/3/2020 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
manager: dikamath
---

# Azure VMware Solution by CloudSimple September 2020 update

An important update to Azure VMware Solution service will be performed in September. An email notification, sent as a part of maintenance will include the timeline of the maintenance. In this article, you learn about what to expect during this maintenance operation and changes to your private cloud.

> [!NOTE]
> This is a non-disruptive upgrade. During the upgrade, you may see one of the redundant components go down.

## VMware infrastructure upgrade

VMware infrastructure of your private cloud will be updated to a newer version. This includes updates to vCenter, ESXi, NSX-T, and Hybrid Cloud Extension (HCX) components (if deployed) of your private cloud.

During the upgrade, a new node will be added to your private cloud before a node is placed in maintenance mode for upgrade operation. This ensures the capacity of your private cloud and availability of your private cloud is maintained during the upgrade process. During the upgrade of VMware components, you may see alarms displayed on your vCenter web UI. The alarms
are a part of the maintenance operations performed by the service operations team.

**Component version**

- ESXi 6.7U3
- vCenter 6.7U3
- vSAN 6.7
- NSX Data Center 2.5.1
- HCX 3.5.2

## Datacenter updates

This update includes updates to datacenter infrastructure. Non-disruptive updates will be performed during the maintenance period. You will notice reduced redundancy during the update process. Alerts may be generated in your private cloud VMware infrastructure, your ExpressRoute circuits, GlobalReach connections, and any Site-to-Site VPN devices related to one of the link availabilities. This is normal during the update as the components will be rebooted as a part of the update.

-   If a Site-to-Site VPN is deployed as a single instance (non-HA), you may have to re-establish the VPN connection.

-   If you use a Point-to-Site VPN connection, you will have to re-establish the VPN connection.

## Post update

Once the updates are complete, you should see newer versions of VMware components. If you notice any issues or have any questions, contact our support team by opening a [support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).
