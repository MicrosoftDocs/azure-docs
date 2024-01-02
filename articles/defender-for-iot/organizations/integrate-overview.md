---
title: Integrate with partner services | Microsoft Defender for IoT
description: Learn about supported integrations across your organization's security stack with Microsoft Defender for IoT.
ms.date: 09/06/2023
ms.topic: overview
ms.custom: enterprise-iot
---

# Integrations with Microsoft and partner services

Integrate Microsoft Defender for IoT with partner services to view data from across your security stack data in Defender for IoT, or to view Defender for IoT data in one of your security ecosystem integrations.

> [!IMPORTANT]
> Defender for IoT is refreshing its security stack integrations to improve the overall robustness, scalability, and ease of maintenance of various security solutions.
> 
> If you're integrating your security solution with cloud-based systems, we recommend that you use data connectors through [Microsoft Sentinel](concept-sentinel-integration.md). For on-premises integrations, we recommend that you either configure your OT sensor to [forward syslog events](how-to-forward-alert-information-to-partners.md)), or use [Defender for IoT APIs](references-work-with-defender-for-iot-apis.md).
> 
> The legacy [Aruba ClearPass](#aruba-clearpass), [Palo Alto Panorama](#palo-alto), and [Splunk](#splunk) integrations are supported through October 2024 using sensor version 23.1.3, and won't be supported in upcoming major software versions. For customers using legacy integration methods, we recommend moving your integrations to the standard cloud or on-premises methods.

## Aruba ClearPass

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
| **Aruba ClearPass** (cloud) | View Defender for IoT data together with Aruba ClearPass data, using Microsoft Sentinel to create custom dashboards, custom alerts, and improve your investigation ability.<br><br> Connect to [Microsoft Sentinel](concept-sentinel-integration.md), and install the [Aruba ClearPass data connector](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-arubaclearpass?tab=Overview). | - OT networks <br>- Cloud-connected or locally managed OT sensors | Microsoft |  [Microsoft Sentinel documentation](/azure/sentinel/data-connectors/aruba-clearpass) |
| **Aruba ClearPass** (on-premises) | View Defender for IoT data together with Aruba ClearPass data by doing one of the following:<br><br>- Configure your sensor to send syslog files directly to ClearPass. <br>- | - OT networks <br>- Cloud-connected or locally managed OT sensors | Microsoft |  [Forward on-premises OT alert information](how-to-forward-alert-information-to-partners.md) <br><br>[Defender for IoT API reference](references-work-with-defender-for-iot-apis.md)|
|**Aruba ClearPass** (legacy)      |   Share Defender for IoT data directly with ClearPass Security Exchange and update the ClearPass Policy Manager Endpoint Database with Defender for IoT data.   |  - OT networks<br>- Locally managed sensors and on-premises management consoles     |   Microsoft      |  [Integrate ClearPass with Microsoft Defender for IoT](tutorial-clearpass.md)  |


## Axonius

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|**Axonius Cybersecurity Asset Management**      |    Import and manage device inventory discovered by Defender for IoT in your Axonius instance.      |  - OT networks<br>- Locally managed sensors and on-premises management consoles      |   Axonius      |  [Axonius documentation](https://docs.axonius.com/docs/azure-defender-for-iot)  |

## CyberArk PSM

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|**CyberArk Privileged Session Manager (PSM)**     |    Send CyberArk PSM syslog data on remote sessions and verification failures to Defender for IoT for data correlation.     |   - OT networks<br>- Locally managed sensors and on-premises management consoles        |    Microsoft     |  [Integrate CyberArk with Microsoft Defender for IoT](tutorial-cyberark.md)  |

## Forescout

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|**Forescout**     |   Automate actions in Forescout based on activity detected by Defender for IoT, and correlate Defender for IoT data with other *Forescout eyeExtended* modules that oversee monitoring, incident management, and device control.      |   - OT networks<br>- Locally managed sensors and on-premises management consoles      |   Microsoft      |   [Integrate Forescout with Microsoft Defender for IoT](tutorial-forescout.md) |

## Fortinet

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|**Fortinet FortiSIEM and FortiGate**     |    Send Defender for IoT data to Fortinet services for: <br><br>- Enhanced network visibility in FortiSIEM<br>- Extra abilities in FortiGate to stop anomalous behavior       |   - OT networks<br>- Locally managed sensors and on-premises management consoles       |   Microsoft      | [Integrate Fortinet with Microsoft Defender for IoT](tutorial-fortinet.md)   |

## IBM QRadar

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
| **IBM QRadar** | Send Defender for IoT alerts to IBM QRadar | - OT networks <br>- Cloud connected sensors | Microsoft | [Stream Defender for IoT cloud alerts to a partner SIEM](integrations/send-cloud-data-to-partners.md) |
|**IBM QRadar**     |   Forward Defender for IoT alerts to IBM QRadar.       |   - OT networks<br>- Locally managed sensors and on-premises management consoles      |      Microsoft   | [Integrate Qradar with Microsoft Defender for IoT](tutorial-qradar.md)   |

## LogRhythm

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|**LogRhythm**      |   Forward Defender for IoT alerts to LogRhythm.  |  - OT networks<br>- Locally managed sensors and on-premises management consoles      |   Microsoft      | [Integrate LogRhythm with Microsoft Defender for IoT](integrations/logrhythm.md)  |

## Micro Focus ArcSight

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|**Micro Focus ArcSight**      |   Forward Defender for IoT alerts to ArcSight.  |  - OT networks<br>- Locally managed sensors and on-premises management consoles      |   Microsoft      | [Integrate ArcSight with Microsoft Defender for IoT](integrations/arcsight.md)  |

## Microsoft Defender for Endpoint

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|**Microsoft Defender for Endpoint**     | Integrates Defender for IoT data in Defender for Endpoint's device inventory, alerts, recommendations, and vulnerabilities. Displays device data about Defender for Endpoint endpoints in the Defender for IoT **Device inventory** page on the Azure portal.        | - Enterprise IoT networks and sensors        |  Microsoft       |  [Onboard with Microsoft Defender for IoT](/microsoft-365/security/defender-endpoint/enable-microsoft-defender-for-iot-integration)  |

## Microsoft Sentinel

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|**Defender for IoT data connector in Microsoft Sentinel**  (cloud)   |  Displays Defender for IoT cloud data in Microsoft Sentinel, supporting end-to-end SOC investigations for Defender for IoT alerts.  <br><br>Connects to other partner services, allowing you to synchronize your data between Defender for IoT and supported partner systems, across Microsoft Sentinel. |    - OT and Enterprise IoT networks <br>- Cloud-connected sensors       |    Microsoft       | - [OT threat monitoring in enterprise SOCs](concept-sentinel-integration.md) <br>- [Tutorial: Connect Microsoft Defender for IoT with Microsoft Sentinel](iot-solution.md) <br>- [Tutorial: Investigate and detect threats for IoT devices](iot-advanced-threat-monitoring.md)  |
| **Microsoft Sentinel** (on-premises) | View Defender for IoT data together with Microsoft Sentinel data by configuring your sensor to send syslog files directly to Microsoft Sentinel.| - OT networks <br>- Cloud-connected or locally managed OT sensors | Microsoft |  [Forward on-premises OT alert information](how-to-forward-alert-information-to-partners.md) |
|**Microsoft Sentinel** (legacy)    |  Send Defender for IoT alerts from on-premises resources to Microsoft Sentinel.   |    - OT networks <br>- Locally managed sensors and on-premises management consoles       |  Microsoft       | [Connect on-premises OT network sensors to Microsoft Sentinel](integrations/on-premises-sentinel.md) |

## Palo Alto

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
| **Palo Alto Panorama** (cloud) | View Defender for IoT data together with Panorama data. Use Microsoft Sentinel solutions, which include out-of-the-box workbooks, hunting queries, automation playbooks, and analytics rules, or create custom dashboards, alerts, and more. <br><br> Connect to [Microsoft Sentinel](concept-sentinel-integration.md), and install one or more of the following solutions: <br>- [Palo Alto PAN-OS Solution](/azure/sentinel/data-connectors/palo-alto-networks-firewall) <br>- [Palo Alto Networks Cortex Data Lake Solution](/azure/sentinel/data-connectors/palo-alto-networks-cortex-data-lake-cdl) <br>- [Palo Alto Prisma Cloud CSPM solution](/azure/sentinel/data-connectors/palo-alto-prisma-cloud-cspm-using-azure-function)  | - OT networks <br>- Cloud-connected or locally managed OT sensors | Microsoft |Microsoft Sentinel documentation: <br>- [Palo Alto PAN-OS Solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-paloaltopanos?tab=Overview) <br>- [Palo Alto Networks Cortex Data Lake Solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-paloaltocdl?tab=Overview) <br>- [Palo Alto Prisma Cloud CSPM solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-paloaltoprisma?tab=Overview) |
| **Palo Alto Panorama** (on-premises) | View Defender for IoT data together with Panorama data by configuring your sensor to send syslog files directly to Palo Alto Panorama.| - OT networks <br>- Cloud-connected or locally managed OT sensors | Microsoft |  [Forward on-premises OT alert information](how-to-forward-alert-information-to-partners.md) |
|**Palo Alto**  (legacy)   |   Use Defender for IoT data to block critical threats with Palo Alto firewalls, either with automatic blocking or with blocking recommendations.      |  - OT networks<br>- Locally managed sensors and on-premises management consoles       |     Microsoft    | [Integrate Palo-Alto with Microsoft Defender for IoT](tutorial-palo-alto.md)   |

## RSA NetWitness

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|**RSA NetWitness**      |   Forward Defender for IoT alerts to RSA NetWitness   |  - OT networks<br>- Locally managed sensors and on-premises management consoles      |   Microsoft      | [Integrate RSA NetWitness with Microsoft Defender for IoT](integrations/netwitness.md) <br><br>[Defender for IoT - RSA NetWitness CEF Parser Implementation Guide](https://community.netwitness.com//t5/netwitness-platform-integrations/cyberx-platform-rsa-netwitness-cef-parser-implementation-guide/ta-p/554364)  |

## ServiceNow

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
| **Vulnerability Response Integration with Microsoft Azure Defender for IoT** | View Defender for IoT device vulnerabilities in ServiceNow.  |    - OT networks<br>- Locally managed sensors and on-premises management consoles  |    ServiceNow  | [ServiceNow store](https://store.servicenow.com/sn_appstore_store.do#!/store/application/463a7907c3313010985a1b2d3640dd7e/1.0.1?referer=%2Fstore%2Fsearch%3Flistingtype%3Dallintegrations%25253Bancillary_app%25253Bcertified_apps%25253Bcontent%25253Bindustry_solution%25253Boem%25253Butility%25253Btemplate%26q%3Ddefender%2520for%2520iot&sl=sh) |
| **Service Graph Connector Integration with Microsoft Azure Defender for IoT** | View Defender for IoT device detections, sensors, and network connections in ServiceNow. |  - OT networks<br>- Locally managed sensors and on-premises management consoles       |    ServiceNow     |  [ServiceNow store](https://store.servicenow.com/sn_appstore_store.do#!/store/application/ddd4bf1b53f130104b5cddeeff7b1229/1.0.0?referer=%2Fstore%2Fsearch%3Flistingtype%3Dallintegrations%25253Bancillary_app%25253Bcertified_apps%25253Bcontent%25253Bindustry_solution%25253Boem%25253Butility%25253Btemplate%26q%3Ddefender%2520for%2520iot&sl=sh) |
| **Microsoft Defender for IoT** (Legacy) | View Defender for IoT device detections and alerts in ServiceNow.  |    - OT networks<br>- Locally managed sensors and on-premises management consoles       |    Microsoft     |  [ServiceNow store](https://store.servicenow.com/sn_appstore_store.do#!/store/application/6dca6137dbba13406f7deeb5ca961906/3.1.5?referer=%2Fstore%2Fsearch%3Flistingtype%3Dallintegrations%25253Bancillary_app%25253Bcertified_apps%25253Bcontent%25253Bindustry_solution%25253Boem%25253Butility%25253Btemplate%26q%3Ddefender%2520for%2520iot&sl=sh)<br><br>[Integrate ServiceNow with Microsoft Defender for IoT](tutorial-servicenow.md) |

## Skybox

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|**Skybox**      |   Import vulnerability occurrence data discovered by Defender for IoT in your Skybox platform.     |  - OT networks<br>- Locally managed sensors and on-premises management consoles    |   Skybox      |  [Skybox documentation](https://docs.skyboxsecurity.com)  <br><br>  [Skybox integration page](https://www.skyboxsecurity.com/products/integrations)  |

## Splunk

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
| **Splunk** (cloud) | Send Defender for IoT alerts to Splunk using one of the following methods: <br><br>- Via the [OT Security Add-on for Splunk](https://apps.splunk.com/app/5151), which widens your capacity to ingest and monitor OT assets and provides OT vulnerability management reports that help you comply with and audit for NERC CIP. <br><br>- Via a SIEM that supports Event Hubs, such as Microsoft Sentinel  | - OT networks <br>- Cloud-connected or locally managed OT sensors | Microsoft and Splunk |- Splunk documentation on [The OT Security Add-on for Splunk](https://splunk.github.io/ot-security-solution/integrationguide/) and [installing add-ins](https://docs.splunk.com/Documentation/AddOns/released/Overview/Distributedinstall) <br>- [Stream Defender for IoT cloud alerts to a partner SIEM](integrations/send-cloud-data-to-partners.md) |
| **Splunk** (on-premises) | View Defender for IoT data together with Splunk data by configuring your sensor to send syslog files directly to Splunk.| - OT networks <br>- Cloud-connected or locally managed OT sensors | Microsoft |  [Forward on-premises OT alert information](how-to-forward-alert-information-to-partners.md) |
|**Splunk** (on-premises, legacy integration)    |  Send Defender for IoT alerts to Splunk       |   - OT networks<br>- Locally managed sensors and on-premises management consoles       |  Microsoft       | [Integrate Splunk with Microsoft Defender for IoT](tutorial-splunk.md)   |

## Next steps

For more information, see:

- [Stream Defender for IoT cloud alerts to a partner SIEM](integrations/send-cloud-data-to-partners.md)
