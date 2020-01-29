---
title: Azure VMware Solutions (AVS) - AVS maintenance and updates
description: Describes the AVS service process for scheduled maintenance and updates
titleSuffix: Azure VMware Solutions (AVS)
author: sharaths-cs
ms.author: dikamath
ms.date: 08/20/2019
ms.topic: article
ms.service: azure-vmware-cloudsimple
ms.reviewer: cynthn
manager: dikamath
---
# AVS maintenance and updates

The AVS Private Cloud environment is designed to have no single point of failure.

* ESXi clusters are configured with vSphere High Availability (HA). The clusters are sized to have at least one spare node for resiliency.
* Redundant primary storage is provided by vSAN, which requires at least three nodes to provide protection against a single failure. vSAN can be configured to provide higher resiliency for larger clusters.
* vCenter, PSC, and NSX Manager VMs are configured with RAID-10 storage to protect against storage failure. The VMs are protected against node/network failures by vSphere HA.
* ESXi hosts have redundant fans and NICs.
* TOR and spine switches are configured in HA pairs to provide resiliency.

AVS continuously monitors the following VMs for uptime and availability, and provides availability SLAs:

* ESXi hosts
* vCenter
* PSC
* NSX Manager

AVS also monitors the following continuously for failures:

* Hard disks
* Physical NIC ports
* Servers
* Fans
* Power
* Switches
* Switch ports

If a disk or node fails, a new node is automatically added to the affected VMware cluster to bring it back to health immediately.

AVS backs up, maintains, and updates these VMware elements in the AVS Private Clouds:

* ESXi
* vCenter Platform Services
* Controller
* vSAN
* NSX

## Back up and restore

AVS backup includes:

* Nightly incremental backups of vCenter, PSC, and DVS rules.
* vCenter native APIs to back up components at the application layer.
* Automatic backup prior to update or upgrade of the VMware management software.
* vCenter data encryption at the source before data is transferred over a TLS1.2 encrypted channel to Azure. The data is stored in an Azure blob where it's replicated across regions.

You can request a restore by opening a [Support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Maintenance

AVS does several types of planned maintenance.

### Backend/internal maintenance

This maintenance typically involves reconfiguring physical assets or installing software patches. It doesn’t affect normal consumption of the assets being serviced. With redundant NICs going to each physical rack, normal network traffic and AVS Private Cloud operations aren’t affected. You might notice a performance impact only if your organization expects to use the full redundant bandwidth during the maintenance interval.

### AVS portal maintenance

Some limited service downtime is required when the AVS control plane or infrastructure is updated. Currently, maintenance intervals can be as frequent as once per month. The frequency is expected to decline over time. AVS provides notification for portal maintenance and keeps the interval as short as possible. During a portal maintenance interval, the following services continue to function without any impact:

* VMware management plane and applications
* vCenter access
* All networking and storage
* All Azure traffic

### VMware infrastructure maintenance

Occasionally it's necessary to make changes to the configuration of the VMware infrastructure. Currently, these intervals can occur every 1-2 months, but the frequency is expected to decline over time. This type of maintenance can usually be done without interrupting normal consumption of the AVS services. During a VMware maintenance interval, the following services continue to function without any impact:

* VMware management plane and applications
* vCenter access
* All networking and storage
* All Azure traffic

## Updates and Upgrades

AVS is responsible for lifecycle management of VMware software (ESXi, vCenter, PSC, and NSX) in the AVS Private Cloud.

Software updates include:

* **Patches**. Security patches or bug fixes released by VMware.
* **Updates**. Minor version change of a VMware stack component.
* **Upgrades**. Major version change of a VMware stack component.

AVS tests a critical security patch as soon as it becomes available from VMware. Per SLA, AVS rolls out the security patch to AVS Private Cloud environments within a week.

AVS provides quarterly maintenance updates to VMware software components. When a new major version of VMware software is available, AVS works with customers to coordinate a suitable maintenance window for upgrade.

## Next steps

[Back up workload VMs using Veeam](backup-workloads-veeam.md)
