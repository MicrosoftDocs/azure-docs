---
title: Azure Sentinel content hub catalog  | Microsoft Docs
description: This article displays and details the currently available Azure Sentinel content hub packages.
services: sentinel
cloud: na
documentationcenter: na
author: batamig
manager: rkarlin
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 10/12/2021
ms.author: bagol
ms.custom: ignite-fall-2021
---

# Azure Sentinel content hub catalog

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

> [!IMPORTANT]
>
> The Azure Sentinel content hub experience is currently in **PREVIEW**, as are all individual solution packages. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[Azure Sentinel solutions](sentinel-solutions.md) provide a consolidated way to acquire Azure Sentinel content - like data connectors, workbooks, analytics, and automation - in your workspace with a single deployment step.

This article lists the out-of-the-box (built-in), on-demand, Azure Sentinel data connectors and solutions available for you to deploy in your workspace. Deploying a solution makes any included security content, such as data connectors, playbooks, workbooks, or rules, in the relevant area of Azure Sentinel. 

For more information, see [Centrally discover and deploy Azure Sentinel out-of-the-box content and solutions](sentinel-solutions-deploy.md).

## Domain solutions

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Microsoft Insider Risk Management** |[Data connector](data-connectors-reference.md#microsoft-365-insider-risk-management-irm-preview), workbook, analytics rules, hunting queries |Security - Insider threat | Microsoft|
| **Microsoft MITRE ATT&CK solution for Cloud**| Workbooks, analytics rules, hunting queries|Security - Threat protection, Security - Others |Microsoft |
| **Azure Sentinel Deception** | [Workbooks, analytics rules, watchlists](monitor-key-vault-honeytokens.md)  | Security - Threat Protection  |Microsoft |
|**Zero Trust** (TIC3.0) |Workbooks |Identity, Security - Others |Microsoft |
| | | | |


## Arista Networks

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Arista Networks** (Awake Security) |Data connector, workbooks, analytics rules | Security - Network |[Arista - Awake Security](https://awakesecurity.com/) |
| | | | |


## Armorblox

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Armorblox - Sentinel** |Data connector | Security - Threat protection |[Armorblox](https://www.armorblox.com/contact/) |
| | | | |




## Azure

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Azure Firewall Solution for Sentinel**| [Data connector](data-connectors-reference.md#azure-firewall), workbook, analytics rules, playbooks, hunting queries, custom Logic App connector |Security - Network Security, Networking | Community|
|**Azure Sentinel for SQL PaaS**     |  [Data connector](data-connectors-reference.md#azure-sql-databases), workbook, analytics rules, playbooks, hunting queries     | Application        |      Community   |
|**Azure Sentinel Training Lab** |Workbook, analytics rules, playbooks, hunting queries | Training and tutorials |Microsoft |
|**Azure SQL** | [Data connector](data-connectors-reference.md#azure-sql-databases), workbook, analytics, playbooks, hunting queries  | Application |Microsoft  |
| | | | |


## Box

|Name   |Includes  |Categories |Supported by  |
|------------------|---------|---------|---------|
|**Box Solution**| Data connector, workbook, analytics rules, hunting queries, parser |  Storage, application  | Microsoft|
| | | | |


## Check Point

|Name   |Includes  |Categories |Supported by  |
|------------------|---------|---------|---------|
|**Check Point Azure Sentinel Solutions**   |[Data connector](data-connectors-reference.md#check-point), playbooks, custom Logic App connector  | Security - Automation (SOAR) | [Checkpoint](https://www.checkpoint.com/support-services/contact-support/)|
| | | | |


## Cisco

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Cisco ACI** |Data connector, parser |Security – Network |Microsoft |
|**Cisco ASA** |[Data connector](data-connectors-reference.md#cisco-asa), playbooks, custom Logic App connector |Security – Automation (SOAR) |Microsoft |
|**Cisco Duo Security** |Data connector, parser | Identity|Microsoft |
|**Cisco ISE**  |Data connector, workbooks, analytics rules, playbooks, hunting queries, parser, custom Logic App connector |Networking, Security - Others | Microsoft |
|**Cisco Meraki** |[Data connector](data-connectors-reference.md#cisco-meraki-preview), playbooks, custom Logic App connector |Security - Network |Microsoft |
|**Cisco Secure Email Gateway / ESA** |Data connector, parser |Security - Threat Protection |Microsoft |
|**Cisco StealthWatch** |Data connector, parser |Security - Network | Microsoft|
|**Cisco Umbrella** |[Data connector](data-connectors-reference.md#cisco-umbrella-preview), workbooks, analytics rules, playbooks, hunting queries, parser, custom Logic App connector |Security - Cloud Security |Microsoft |
|**Cisco Web Security Appliance (WSA)** | Data connector, parser|Security - Network |Microsoft |
| | | | |


## Cloudflare


|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Cloudflare Solution**|Data connector, workbooks, analytics rules, hunting queries, parser| Security - Network, networking |Microsoft |
| | | | |


## Contrast Security



|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Contrast Protect Azure Sentinel Solution**|Data connector, workbooks, analytics rules |Security - Threat protection |Microsoft  |
| | | | |

## Crowdstrike


|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**CrowdStrike Falcon Endpoint Protection Solution**| Data connector, workbooks, analytics rules, playbooks, parser| Security - Threat protection| Microsoft|
| | | | |

## Digital Guardian


|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Digital Guardian** |Data connector, parser |Security - Information Protection |Microsoft |
| | | |

## FalconForce

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**FalconFriday Content - Falcon Friday** |Analytics rules |User Behavior (UEBA), Security - Insider threat | [FalconForce](https://www.falconforce.nl/en/)|
| | | |

## FireEye NX (Network Security)

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**FireEye NX (Network Security)** |Data connector, parser |Security - Network| Microsoft|
| | | |

## Flare Systems Firework

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Flare Systems Firework** |Data connector |Security - Threat protection |Microsoft|
| | | |

## Forescout

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Forescout** |Data connector, parser |Security - Network | Microsoft|
| | | |

## Fortinet Fortigate

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Fortinet Fortigate** |[Data connector](data-connectors-reference.md#fortinet), playbooks, custom Logic App connector|Security - Automation (SOAR) | Microsoft|
| | | |


## Google

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Google Cloud Platform DNS Solution** |Data connector, parser |Cloud Provider, Networking |Microsoft |
|**Google Cloud Platform Cloud Monitoring Solution**|Data connector, parser |Cloud Provider | Microsoft|
|**Google Cloud Platform Identity and Access Management Solution**|Data connector, workbook, analytics rules, playbooks, hunting queries, parser, custom Logic App connector|Cloud Provider, Identity |Microsoft |
| | | | |


## HYAS

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**HYAS Insight for Azure Sentinel Solutions Gallery**| Playbooks| Security - Threat Intelligence, Security - Automation (SOAR) |Microsoft |
| | | | |

## Imperva

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Imperva Cloud WAF** (formally Imperva Incapsula)| [Data connector](data-connectors-reference.md#imperva-waf-gateway-preview), parser| Security - Network | Microsoft|
| | | | |

## InfoBlox

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**InfoBlox Threat Defense / InfoBlox Cloud Data Connector**| [Data connector](data-connectors-reference.md#infoblox-network-identity-operating-system-nios-preview), workbook, analytics rules| Security - Threat protection | Microsoft|
| | | | |


## IronNet

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**IronNet CyberSecurity Iron Defense - Azure Sentinel** | |Security - Network |Microsoft |
| | | |



## Juniper

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Juniper IDP** |Data connector, parser|Security - Network |Microsoft |
| | | | |


## Kaspersky

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Kaspersky AntiVirus** |Data connector, parser   | Security - Threat protection|Microsoft |
| | | | |


## Lookout

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Lookout Mobile Threat Defense for Azure Sentinel**| [Data connector](data-connectors-reference.md#lookout-mobile-threat-defense-preview)|Security - Network |[Lookout](https://www.lookout.com/support) |
| | | |

## McAfee

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**McAfee ePolicy Orchestrator Solution**| Data connector, workbook, analytics rules, playbooks, hunting queries, parser, custom Logic App connector| Security - Threat protection| Microsoft |
|**McAfee Network Security Platform Solution** (Intrushield) + AntiVirus Information (T1 minus Logic apps) |Data connector, workbooks, analytics rules, hunting queries, parser |Security - Threat protection | Microsoft|
| | | | |

## Microsoft

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Azure Sentinel 4 Microsoft Dynamics 365**     |   [Data connector](data-connectors-reference.md#dynamics-365), workbooks, analytics rules, and hunting queries |      Application   |Microsoft         |
|**Azure Sentinel for Teams**     | Data connector, analytics rules, playbooks, hunting queries      |   Application      |    Community     |
| | | | |


## Oracle


|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Oracle Cloud Infrastructure** |Data connector, parser | Cloud Provider | Microsoft|
|**Oracle Database Audit Solution** | Data connector, workbook, analytics rules, hunting queries, parser| Application|Microsoft |
| | | | |

## Palo Alto

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Palo Alto PAN-OS**|[Data connector](#palo-alto), playbooks, custom Logic App connector |Security - Automation (SOAR), Security - Network |Microsoft |
|**Palo Alto Prisma Solution**|[Data connector](#palo-alto), workbooks, analytics rules, hunting queries, parser |Security - Cloud security |Microsoft |
| | | | |

## Ping Identity

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**PingFederate Solution** |Data connector, workbooks, analytics rules, hunting queries, parser| Identity|Microsoft |
| | | | |

## Proofpoint

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Proofpoint POD Solution** |[Data connector](data-connectors-reference.md#proofpoint-on-demand-pod-email-security-preview), workbook, analytics rules, hunting queries, parser| Security - Threat protection|Microsoft |
|**Proofpoint TAP Solution** | Workbooks, analytics rules, playbooks, custom Logic App connector|Security - Automation (SOAR), Security - Threat protection |Microsoft |
| | | |

## Qualys

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Qualys VM Solution** |Workbooks, analytics rules |Security - Vulnerability Management |Microsoft |
| | | | |

## Rapid7

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Rapid7 InsightVM CloudAPI Solution** |Data connector, parser|Security - Vulnerability Management |Microsoft |
| | | | |

## ReversingLabs

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**ReversingLabs TitaniumCloud File Enrichment Solution**|Playbooks |Security - Threat intelligence |[ReversingLabs](https://support.reversinglabs.com/hc/en-us) |
| | | | |

## RiskIQ

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**RiskIQ Security Intelligence Playbooks**|Playbooks |Security - Threat intelligence, Security - Automation (SOAR) |[RiskIQ](https://www.riskiq.com/integrations/microsoft/) |
| | | | |

## RSA

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**RSA SecurID** |Data connector, parser |Security - Others, Identity |Microsoft |
| | | |



## SAP

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Continuous Threat Monitoring for SAP**|[Data connector](sap-deploy-solution.md), [workbooks, analytics rules, watchlists](sap-solution-security-content.md) | Application  |Community |
| | | | |

## Semperis

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Semperis**|Data connector, workbooks, analytics rules, parser | Security - Threat protection, Identity  |[Semperis](https://www.semperis.com/contact-us/) |
| | | | |

## Senserva Pro

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Senserva Offer for Azure Sentinel** |Data connector, workbooks, analytics rules, hunting queries |Compliance |[Senserva](https://www.senserva.com/contact/) |
| | | | |


## Sonrai Security

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Sonrai Security - Azure Sentinel** |Data connector, workbooks, analytics rules   | Compliance|Sonrai Security |
| | | | |

## Slack

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Slack Audit Solution**|Data connector, workbooks, analytics rules, hunting queries, parser |Application| Microsoft|
| | | | |


## Sophos

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Sophos Endpoint Protection Solution** |Data connector, parser| Security - Threat protection |Microsoft |
|**Sophos XG Firewall Solution**| Workbooks, analytics rules, parser |Security - Network |Microsoft |
| | | | |


## Symantec

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Symantec Endpoint**|Data connector, workbook, analytics rules, playbooks, hunting queries, parser| Security - Threat protection|Microsoft |
|**Symantec ProxySG  Solution**|Workbooks, analytics rules |Security - Network |Symantec |
| | | | |

## Tenable

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Tenable Nessus Scanner / IO VM reports for cloud**  | Data connector, parser| Security - Vulnerability Management| Microsoft |
| | | | |


## Trend Micro

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Trend Micro Apex One Solution**  | Data connector, hunting queries, parser| Security - Threat protection|Microsoft |
| | | | |




## Ubiquiti

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Ubiquiti UniFi Solution**|Data connector, workbooks, analytics rules, hunting queries, parser |Security - Network |Microsoft |
| | | | |


## vArmour

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**vArmour Application Controller and Azure Sentinel Solution**|Data connector, workbook, analytics rules |IT Operations |[vArmour](https://www.varmour.com/contact-us/) |
| | | | |

## Vectra

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Vectra Stream Solution** |Data connector, hunting queries, parser |Security - Network |Microsoft |
| | | |


## VMware

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**VMware Carbon Black Solution**|Workbooks, analytics rules| Security - Threat protection| Microsoft|
| | | | |

## Zeek Network

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Corelight for Azure Sentinel**|Data connector, workbooks, analytics rules, hunting queries, parser | IT Operations, Security - Network | [Zeek Network](https://support.corelight.com/)|
| | | | |


## Next steps

In this document, you learned about Azure Sentinel solutions and how to find and deploy them.

- Learn more about [Azure Sentinel Solutions](sentinel-solutions.md).
- [Find and deploy Azure Sentinel Solutions](sentinel-solutions-deploy.md).
