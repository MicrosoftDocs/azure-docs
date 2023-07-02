---
title: Integrations with partner services - Microsoft Defender for IoT
description: Learn about supported integrations with Microsoft Defender for IoT.
ms.date: 06/26/2023
ms.topic: overview
ms.custom: enterprise-iot
---

# Integrations with Microsoft and partner services

Integrate Microsoft Defender for Iot with partner services to view partner data in Defender for IoT, or to view Defender for IoT data in a partner service.

## Aruba ClearPass

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|**Aruba ClearPass**      |   Share Defender for IoT data with ClearPass Security Exchange and update the ClearPass Policy Manager Endpoint Database with Defender for IoT data.      |  - OT networks<br>- Locally managed sensors and on-premises management consoles     |   Microsoft      |  [Integrate ClearPass with Microsoft Defender for IoT](tutorial-clearpass.md)  |

> [!IMPORTANT]
> Defender for IoT plans to end support for the legacy Aruba ClearPass integration with the upcoming version 23.1.
>
> We recommend transitioning your integration connecting to [Microsoft Sentinel](concept-sentinel-integration.md), and installing the [Aruba ClearPass data connector](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-arubaclearpass?tab=Overview) instead.
>
> For more information, see:
>
>- [Microsoft Sentinel documentation](/azure/sentinel/data-connectors/aruba-clearpass)
>- Our [TechCommunity blog](TBD)
>- [Plan costs and understand Microsoft Sentinel pricing and billing](/azure/sentinel/billing)
>
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
|**Defender for IoT data connector in Microsoft Sentinel**     |  Displays Defender for IoT cloud data in Microsoft Sentinel, supporting end-to-end SOC investigations for Defender for IoT alerts.   |    - OT and Enterprise IoT networks <br>- Cloud-connected sensors       |    Microsoft       | [Integrate Microsoft Sentinel and Microsoft Defender for IoT](../../sentinel/iot-solution.md?tabs=use-out-of-the-box-analytics-rules-recommended)  |
|**Microsoft Sentinel**     |  Send Defender for IoT alerts from on-premises resources to Microsoft Sentinel.   |    - OT networks <br>- Locally managed sensors and on-premises management consoles       |  Microsoft       | [Connect on-premises OT network sensors to Microsoft Sentinel](integrations/on-premises-sentinel.md) |

## Palo Alto

|Name  |Description  |Support scope  |Supported by  |Learn more |
|---------|---------|---------|---------|---------|
|**Palo Alto**     |   Use Defender for IoT data to block critical threats with Palo Alto firewalls, either with automatic blocking or with blocking recommendations.      |  - OT networks<br>- Locally managed sensors and on-premises management consoles       |     Microsoft    | [Integrate Palo-Alto with Microsoft Defender for IoT](tutorial-palo-alto.md)   |

> [!IMPORTANT]
> Defender for IoT plans to end support for the legacy Palo Alto Panorama integration with the upcoming version 23.1.
>
> We recommend transitioning your integration connecting to [Microsoft Sentinel](concept-sentinel-integration.md), and installing one or more of the following solutions instead:
>- [Palo Alto PAN-OS Solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-paloaltopanos?tab=Overview)
>- [Palo Alto Networks Cortex Data Lake Solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-paloaltocdl?tab=Overview)
>- [Palo Alto Prisma Cloud CSPM solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-paloaltoprisma?tab=Overview) 
>
> For more information, see our [TechCommunity blog](tbd) and the following Microsoft Sentinel documentation: 
>- [Palo Alto Networks (Firewall) connector for Microsoft Sentinel](/azure/sentinel/data-connectors/palo-alto-networks-firewall)
>- [Palo Alto Networks Cortex Data Lake (CDL) connector for Microsoft Sentinel](/azure/sentinel/data-connectors/palo-alto-networks-cortex-data-lake-cdl)
>- [Palo Alto Prisma Cloud CSPM (using Azure Function) connector for Microsoft Sentinel](/azure/sentinel/data-connectors/palo-alto-prisma-cloud-cspm-using-azure-function)
>- [Plan costs and understand Microsoft Sentinel pricing and billing](/azure/sentinel/billing)
>

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
| **Splunk** | Send Defender for IoT alerts to Splunk | - OT networks <br>- Cloud connected sensors | Microsoft | [Stream Defender for IoT cloud alerts to a partner SIEM](integrations/send-cloud-data-to-partners.md) |
|**Splunk**     |  Send Defender for IoT alerts to Splunk       |   - OT networks<br>- Locally managed sensors and on-premises management consoles       |  Microsoft       | [Integrate Splunk with Microsoft Defender for IoT](tutorial-splunk.md)   |

> [!IMPORTANT]
> Defender for IoT plans to end support for the legacy Splunk integration with the upcoming version 23.1.
>
> We recommend transitioning any legacy integrations to the [OT Security Add-on for Splunk](https://apps.splunk.com/app/5151) instead. For more information, see:
>
>- [The Splunk documentation on installing add-ins](https://docs.splunk.com/Documentation/AddOns/released/Overview/Distributedinstall)
>- [The Splunk documentation on the OT Security Add-on for Splunk](https://splunk.github.io/ot-security-solution/integrationguide/)
>- Our [TechCommunity blog](TBD)  
>

## Next steps

> [!div class="nextstepaction"]
> [Stream Defender for IoT cloud alerts to a partner SIEM](integrations/send-cloud-data-to-partners.md)
