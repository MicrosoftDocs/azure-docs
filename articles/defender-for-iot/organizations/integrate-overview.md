---
title: Integrations with partner services - Microsoft Defender for IoT
description: Learn about supported integrations with Microsoft Defender for IoT.
ms.date: 08/02/2022
ms.topic: overview
---

# Integrations with Microsoft and partner services

Integrate Microsoft Defender for Iot with partner services to view partner data in Defender for IoT, or to view Defender for IoT data in a partner service.

## Azure Monitor

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|**Azure Monitor workbooks**     | Create and view Azure Graph workbooks directly in Defender for IoT to visualize Defender for IoT data.        | - OT, Enterprise IoT, and device builder data   <br><br>- Cloud-connected sensors only     | Microsoft        | [Use Azure Monitor workbooks in Microsoft Defender for IoT](workbooks.md)   |
|**Log Analytics**     |  Store Defender for IoT data in a Log Analytics workspace, and then create and use Azure Monitor workbooks in Defender for IoT to visualize the data stored in Log Analytics.       | - OT, Enterprise IoT, and device builder data  <br><br>- Cloud-connected sensors only      | Microsoft        | TBD   |

## Axonius


|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|TBD cloud support     |         |   - Cloud-connected sensors only       | Microsoft        |    |
|**Axonius Cybersecurity Asset Management**      |    Import and manage device inventory discovered by Defender for IoT in your Axonius instance.      |  - OT networks only<br>- Locally managed sensors only      |   Axonius      |  [Axonius documentation](https://docs.axonius.com/docs/azure-defender-for-iot)  |

## ClearPass


|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|TBD cloud support     |         |   - Cloud-connected sensors only       | Microsoft        |    |
|**Aruba ClearPass**      |   Share Defender for IoT data with ClearPass Security Exchange and update the ClearPass Policy Manager Endpoint Database with Defender for IoT data.      |  - OT networks only<br>- Locally managed sensors only      |   ClearPass      |  [Integrate ClearPass with Microsoft Defender for IoT](tutorial-clearpass.md)  |

## CyberArk

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|TBD cloud support     |         |   - Cloud-connected sensors only      |   Microsoft      |    |
|**CyberArk**     |    Send CyberArk PSM syslog data on remote sessions and verification failures to Defender for IoT for data correlation.     |   - OT networks only<br>- Locally managed sensors only        |    CyberArk     |  [Integrate CyberArk with Microsoft Defender for IoT](tutorial-cyberark.md)  |

## Forescout

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|TBD cloud support     |         |   - Cloud-connected sensors only      |   Microsoft      |    |
|**Forescout**     |   Automate actions in Forescout based on activity detected by Defender for IoT, and correlate Defender for IoT data with other *Forescout eyeExtended* modules that oversee monitoring, incident management, and device control.      |   - OT networks only<br>- Locally managed sensors only      |   Forescout      |   [Integrate Forescout with Microsoft Defender for IoT] |

## Fortinet

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|TBD cloud support     |         |   - Cloud-connected sensors only      |   Microsoft      |    |
|**Fortinet**     |    Send Defender for IoT data to Fortinet services for: <br><br>- Enhanced network visibility in FortiSIEM<br>- Extra abilities in FortiGate to stop anomalous behavior       |   - OT networks only<br>- Locally managed sensors only       |   Fortinet      | [Integrate Fortinet with Microsoft Defender for IoT](tutorial-fortinet.md)   |

## Microsoft Defender for Endpoint

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|Row1     |         |         |         |    |
|Row2     |         |         |         |    |

## Microsoft Sentinel

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|Row1     |         |         |         |    |
|Row2     |         |         |         |    |


## Palo Alto

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|TBD cloud support     |         |   - Cloud-connected sensors only      |   Microsoft      |    |
|**Palo Alto**     |   Use Defender for IoT data to block critical threats with Palo Alto firewalls, either with automatic blocking or with blocking recommendations.      |  - OT networks only<br>- Locally managed sensors only       |     Palo Alto    | [Integrate Palo-Alto with Microsoft Defender for IoT](tutorial-palo-alto.md)   |

## Qradar

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|TBD cloud support     |         |   - Cloud-connected sensors only      |   Microsoft      |    |
|**QRadar**     |   Forward Defender for IoT alerts to IBM QRadar.       |   - OT networks only<br>- Locally managed sensors only      |      Qradar   | [Integrate Qradar with Microsoft Defender for IoT](tutorial-qradar.md)   |

## ServiceNow

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|TBD cloud support     |         |   - Cloud-connected sensors only      |   Microsoft      |    |
| **Vulnerability Response Integration with Microsoft Azure Defender for IoT** | View Defender for IoT device detections, attributes, and connections in ServiceNow.  |    - OT networks only<br>- Locally managed sensors only |  - OT networks only<br>- Locally managed sensors only       |    ServiceNow  | [ServiceNow store](https://store.servicenow.com/sn_appstore_store.do#!/store/application/463a7907c3313010985a1b2d3640dd7e/1.0.1?referer=%2Fstore%2Fsearch%3Flistingtype%3Dallintegrations%25253Bancillary_app%25253Bcertified_apps%25253Bcontent%25253Bindustry_solution%25253Boem%25253Butility%25253Btemplate%26q%3Ddefender%2520for%2520iot&sl=sh) |
| **Service Graph Connector Integration with Microsoft Azure Defender for IoT** | View Defender for IoT device detections, attributes, and connections in ServiceNow. |  - OT networks only<br>- Locally managed sensors only       |    ServiceNow     |  - [ServiceNow store](https://store.servicenow.com/sn_appstore_store.do#!/store/application/ddd4bf1b53f130104b5cddeeff7b1229/1.0.0?referer=%2Fstore%2Fsearch%3Flistingtype%3Dallintegrations%25253Bancillary_app%25253Bcertified_apps%25253Bcontent%25253Bindustry_solution%25253Boem%25253Butility%25253Btemplate%26q%3Ddefender%2520for%2520iot&sl=sh) |
| **Microsoft Defender for IoT** (Legacy) | View Defender for IoT device detections, attributes, and connections in ServiceNow.  |    - OT networks only<br>- Locally managed sensors only       |    ServiceNow     |  - [ServiceNow store](https://store.servicenow.com/sn_appstore_store.do#!/store/application/6dca6137dbba13406f7deeb5ca961906/3.1.5?referer=%2Fstore%2Fsearch%3Flistingtype%3Dallintegrations%25253Bancillary_app%25253Bcertified_apps%25253Bcontent%25253Bindustry_solution%25253Boem%25253Butility%25253Btemplate%26q%3Ddefender%2520for%2520iot&sl=sh)<br><br>- [Integrate ServiceNow with Microsoft Defender for IoT](tutorial-servicenow.md) |

## Skybox

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|TBD cloud support     |         |   - Cloud-connected sensors only       | Microsoft        |    |
|**Skybox**      |   Import vulnerability occurrence data discovered by Defender for IoT in your Skybox platform.     |  - OT networks only<br>- Locally managed sensors only      |   Skybox      |  - [Skybox documentation](https://docs.skyboxsecurity.com)  <br><br>  - [Skybox integration page](https://www.skyboxsecurity.com/products/integrations)  |


## Splunk

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|TBD cloud support     |         |   - Cloud-connected sensors only      |   Microsoft      |    |
|**Splunk**     |  Send Defender for IoT alerts to Splunk       |   - OT networks only<br>- Locally managed sensors only       |  Splunk       | [Integrate Splunk with Microsoft Defender for IoT](tutorial-splunk.md)   |


## Next steps

For more information, see:

**Device inventory**:

- [Use the Device inventory in the Azure portal](how-to-manage-device-inventory-for-organizations.md)
- [Use the Device inventory in the OT sensor](how-to-investigate-sensor-detections-in-a-device-inventory.md)
- [Use the Device inventory in the on-premises management console](how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md)

**Alerts**:

- [View alerts in the Azure portal](how-to-manage-cloud-alerts.md)
- [View alerts in the OT sensor](how-to-view-alerts.md)
- [View alerts in the on-premises management console](how-to-work-with-alerts-on-premises-management-console.md)
