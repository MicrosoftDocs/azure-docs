---
title: Resource Health for Azure VMware Solution
description: Learn about Azure Resource Health for your Azure VMware Solution private cloud.
ms.topic: article
ms.service: azure-vmware
ms.date: 08/05/2025
---

# Azure Resource Health for Azure VMware Solution Private Cloud

In this article, you learn how [Azure Resource Health](/azure/service-health/resource-health-overview) helps you diagnose and get support for service problems that affect your Private Cloud resources. Azure Resource Health reports on the current and past health of your private cloud infrastructure resources and provides you with a dashboard of the health of the infrastructure resources. Azure Resource Health allows you to report on historical events related to your Azure VMware Solution private cloud.

:::image type="content" source="media/resource-health/resource-health-overview.png" alt-text="Screenshot showing resource health alerts." lightbox="media/resource-health/resource-health-overview.png":::

## Benefits of Resource Health

- Get notified about unplanned maintenance that took place in your private cloud infrastructure.

- Resource Health provides a dashboard of the health of your resources. Resource Health shows all the time that your resources are unavailable, which makes it easy for you to check if SLA was violated.

- A group of critical alerts are enabled which notify you about host replacements, storage critical alarms and also about the network health of your private cloud.

- The alerts are updated to have all the necessary information for better reporting and triage purposes.

- You can [leverage Azure Action groups on Resource Health alerts](./configure-alerts-for-azure-vmware-solution.md) that allow you to configure Email/SMS/Webhook/ITSM and get notified via communication method of your choice.

- The health of your private cloud infrastructure reflects following statuses: **Available**, **Unavailable**, **Unknown** & **Degraded**. To learn more about the health status, see the [health status](/azure/service-health/resource-health-overview#health-status) section.

## Pre-configured Alarms enabled in Azure Resource Health

The following table gives the list of alerts that are currently monitored and surfaced on Resource Health. **Customer intervention required** alerts require your input to remediate.

|#     |Alert Name                                                                                                                               |Remediation Mode |
|------|-----------------------------------------------------------------------------------------------------------------------------------------|-----------------|
|1     |Physical disk health alarm                                                                                                               |System remediated|
|2     |System board health alarm                                                                                                                |System remediated|
|3     |Memory health alarm                                                                                                                      |System remediated|
|4     |Storage health alarm                                                                                                                     |System remediated|
|5     |Temperature health alarm                                                                                                                 |System remediated|
|6     |Host connection state alarm                                                                                                              |System remediated|
|7     |High Availability (HA) host Status                                                                                                       |System remediated|
|8     |Network connectivity lost alarm                                                                                                          |System remediated|
|9     |vSAN host disk error alarm                                                                                                               |System remediated|
|10    |Voltage health alarm                                                                                                                     |System remediated|
|11    |Processor health alarm                                                                                                                   |System remediated|
|12    |Fan health alarm                                                                                                                         |System remediated|
|13    |High pNIC error rate detected                                                                                                            |System remediated|
|14    |Critical iDRAC alerts if there are hardware faults (CPU/DIMM/PCI bus/Voltage issues)                                                     |System remediated|
|15    |vSphere HA restarted a virtual machine                                                                                                   |System remediated|
|16    |Unhealthy host replacement start and end                                                                                                 |System remediated|
|17    |Repair service notification to customers (Host reboot and restart of management services)                                                |System remediated|
|18    |Virtual Machine reboots for an HA event                                                                                                  |System remediated|
|19    |NSX Alarm - BGP between CLF and NSX T0 is down                                                                                           |System remediated|
|20    |NSX Alarm - All BGP peer are down between CLF and NSX T0                                                                                 |System remediated|
|21    |vSAN non-compliant disk utilization                                                                                                      |Customer intervention required|
|22    |Cluster has 14 or more hosts ([AVS supports a maximum of 16 hosts in a cluster](/azure/azure-vmware/architecture-private-clouds#clusters); consider adding a new cluster for additional hosts)       |Customer intervention required|
|23    |Private cloud has 90 or more hosts ([AVS supports a maximum of 96 hosts in a private cloud](/azure/azure-vmware/architecture-private-clouds#clusters); consider a new private cloud for additional hosts) |Customer intervention required|
|24    |Virtual Machine is configured to use an external device that prevents maintenance operations                                             |Customer intervention required|
|25    |Virtual Machine configured with DRS Override set to "Disabled" mode (EPC_DRSOVERRIDERULE)                                                |Customer intervention required|
|26    |CD-ROM is mounted on the Virtual Machine and its ISO image isn't accessible and blocks maintenance operations. For more information, refer to [AVS SDDC maintenance best practices](azure-vmware-solution-private-cloud-maintenance-best-practices.md#maintenance-operations-best-practices) (EPC_CDROM_EMULATEMODE)                                                                                                                                                                 |Customer intervention required|
|27    |Virtual Machine is configured with Small Computer System Interface (SCSI) bus sharing in "virtual mode" and blocks maintenance operations (EPC_SCSIDEVICE_SHARINGMODE). For more information, refer to [AVS SDDC maintenance best practices](azure-vmware-solution-private-cloud-maintenance-best-practices.md#maintenance-operations-best-practices)                                                                            |Customer intervention required|
|28    |External datastore mounted becomes inaccessible and will block maintenance operations (EPC_DATASTORE_INACCESSIBLE)                      |Customer intervention required|
|29    |Connected network adapter becomes inaccessible and blocks any maintenance operations (EPC_NWADAPTER_STALE)                              |Customer intervention required|
|30    |Virtual Machine’s serial port is connected to a device that can't be accessed on the destination host (EPC_SERIAL_PORT)                 |Customer intervention required|
|31    |NSX–T alarms for license expiration                                                                                                     |Customer intervention required|
|32    |NSX Alarm - Customer Internet Protocol Security (IPSec) tunnel is down                                                                  |Customer intervention required|
|33    |NSX Alarm - LDAP issue                                                                                                                  |Customer intervention required|
|34    |NSX Alarm - Edge VM CPU usage very high                                                                                                 |Customer intervention required|
|35    |NSX Segment Assignment Failed - Overlapping with already existing segments                                                              |Customer intervention required|
|36    |Cross-resource and cross-subscription group reference not supported by default                                                          |Customer intervention required|
|37    |HCX Alarm - Network Profile MTU Size Smaller than Recommended                                                                           |Customer intervention required|

## Next Steps

Now that you have configured an alert rule for your Azure VMware Solution private cloud, you can learn more about: 

-  [Configure Azure Monitor actions on your Resource Health alerts](./configure-alerts-for-azure-vmware-solution.md)

-  [Azure Monitor](/azure/azure-monitor/overview)

-  [Azure Action Groups](/azure/azure-monitor/alerts/action-groups)
