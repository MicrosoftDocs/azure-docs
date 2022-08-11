---
title: Integrate ServiceNow with Microsoft Defender for IoT
description: In this tutorial, learn how to integrate ServiceNow with Microsoft Defender for IoT.
ms.topic: how-to
ms.date: 08/11/2022
---

# Integrate ServiceNow with Microsoft Defender for IoT

The Defender for IoT integration with ServiceNow provides a new level of centralized visibility, monitoring, and control for the IoT and OT landscape. These bridged platforms enable automated device visibility and threat management to previously unreachable ICS & IoT devices.

The ServiceNow Configuration Management Database (CMDB) is enriched and supplemented with a rich set of device attributes that are pushed by the Defender for IoT platform. This ensures comprehensive and continuous visibility into the device landscape. This visibility lets you monitor and respond from a single-pane-of-glass.

A new [Operational Technology Manager](https://store.servicenow.com/sn_appstore_store.do#!/store/application/31eed0f72337201039e2cb0a56bf65ef/1.1.2?referer=%2Fstore%2Fsearch%3Flistingtype%3Dallintegrations%25253Bancillary_app%25253Bcertified_apps%25253Bcontent%25253Bindustry_solution%25253Boem%25253Butility%25253Btemplate%26q%3Doperational%2520technology%2520manager&sl=sh) integration is now available from the ServiceNow store. The new integration streamlines Microsoft Defender for IoT sensor appliances, OT assets, network connections, and vulnerabilities to ServiceNow’s Operational Technology (OT) data model.

Please read the ServiceNow supporting links and docs for the ServiceNow terms of service.

## ServiceNow integrations with Microsoft Defender for IoT

Once you have the Operational Technology Manager application, two new integrations are available:

## Service Graph Connector (SGC)

Key Features:

- Import Microsoft Defender for IoT Sensors into the Network IDS (NIDS) class and take advantage of NIDS metadata assignment capabilities
- OT Assets and devices detected by sensors with validated NIDS records will be imported and assigned the metadata on the NIDS record automatically.
- When Manufacturing Process Manager is also installed, sites can be assigned to detected OT assets and access can be restricted to users on a per site basis.
- Support for importing OT specific attributes including zone and Purdue Model to define the different levels of critical infrastructure.
- Connection details of detected communication between OT Assets are imported as relationships which can be used to understand the context of any OT asset.
- Embedded OT Control Modules are created with relationships to the parent OT Control System, which can also be used to understand the context. 
- Data from additional sources like ServiceNow Discovery and Microsoft SCCM can be updated in the multisource CMDB.
- Sensors located on IT networks (i.e. in datacenters) can be designated as “IT” and appropriate Configuration Item records and relationships can be created.

For more information, please see the [Service Graph Connector (SGC)](https://store.servicenow.com/sn_appstore_store.do#!/store/application/ddd4bf1b53f130104b5cddeeff7b1229) information on the ServiceNow store.

## Vulnerability Response (VR)

Track and resolve vulnerabilities of your OT assets with the data imported from Defender for IoT into the ServiceNow Operational Technology Vulnerability Response application.

- Create vulnerable items (VITs) from the imported data from Defender for IoT for a view of your OT asset vulnerability within the context of the production process
- Schedule automatic imports of new vulnerabilities 
- VITs can be routed automatically to your teams for remediation (when used with the Service Graph Connector Integration) 
- Automatically close "resolved" VITs 

For more information, please see the [Vulnerability Response (VR)](https://store.servicenow.com/sn_appstore_store.do#!/store/application/463a7907c3313010985a1b2d3640dd7e) information on the ServiceNow store.

> [!NOTE]
> Microsoft Defender for IoT's legacy ServiceNow integration [legacy ServiceNow integration](integrations/service-now-legacy.md) is not affected by the new integrations and Microsoft will continue supporting it.