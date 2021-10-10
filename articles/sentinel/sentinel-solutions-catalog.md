---
title: Microsoft Sentinel content hub catalog  | Microsoft Docs
description: This article displays and details the currently available Microsoft Sentinel content hub packages.
services: sentinel
cloud: na
documentationcenter: na
author: batamig
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 10/04/2021
ms.author: bagol
---
# Microsoft Sentinel content hub catalog

> [!IMPORTANT]
>
> The Microsoft Sentinel content hub experience is currently in **PREVIEW**, as are all individual solution packages. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[Microsoft Sentinel solutions](sentinel-solutions.md) provide a consolidated way to acquire Azure Sentinel content - like data connectors, workbooks, analytics, and automation - in your workspace with a single deployment step.

This article lists the built-in, on-demand, Microsoft Sentinel data connectors and solutions available for you to deploy in your workspace. Deploying a solution makes any included security content, such as data connectors, playbooks, workbooks, or rules, in the relevant area of Azure Sentinel. 

For more information, see [Discover and deploy Azure Sentinel solutions (Public preview)](sentinel-solutions-deploy.md).

<!-- template for new sections>
|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|** ** | | | |
| | | | |
-->

## Azure

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Azure Firewall Solution for Sentinel**| [Data connector](data-connectors-reference.md#azure-firewall), workbook, analytics rules, playbooks, and hunting queries. |Security - Network Security, Networking | Microsoft|
| **Azure Sentinel Training Lab** |Workbook, analytics rules, playbooks, hunting queries | Training and tutorials |Microsoft |
| **Azure SQL** | [Data connector](data-connectors-reference.md#azure-sql-databases), workbook, analytics, playbooks, hunting queries, parser  | Application |Microsoft  |
| | | | |

## Box

|Name   |Includes  |Categories |Supported by  |
|------------------|---------|---------|---------|
| **Box Solution**| Data connector, workbook, analytics rules, hunting queries, parser |  Storage, application  | Box|
| | | | |


## Checkpoint

|Name   |Includes  |Categories |Supported by  |
|------------------|---------|---------|---------|
|**Check Point Azure Sentinel Solutions**   |[Data connector](data-connectors-reference.md#check-point), playbooks  | Security - Automation (SOAR) | Check Point|
| | | | |


## Cisco

<!--add links to data connectors and back-->

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Cisco ACI** |Data connector |Security – Network |Cisco |
|**Cisco ASA** |Data connector, playbooks |Security – Automation (SOAR) |Cisco |
|**Cisco Duo Security** |Data connector | Identity|Cisco |
|**Cisco ISE** |Data connector |Data connector, workbooks, analytics rules, playbooks,hunting queries |Networking, Security - Others | Cisco
|**Cisco Meraki** |Data connector, playbooks |Security - Network |Cisco |
|**Cisco SEG / ESA / Cisco Secure Email Gateway** |Data connector |Security - Threat Protection |Cisco |
|**Cisco StealthWatch** |Data connector |Security - Network | Cisco|
|**Cisco Umbrella** |Data connector, workbooks, analytics rules, playbooks, hunting queries |Security - Cloud Security |Cisco |
|**Cisco Web Security Appliance (WSA)** | Data connector|Security - Network |Cisco |
| | | | |

## Cloudflare

<!--add links to data connectors and back-->

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
| **Cloudflare Solution**|Data connector, workbooks, analytics rules, hunting queries| Security - Network, networking |Cloudflare |
| | | | |


## Contrast Security

<!--add links to data connectors and back-->

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
| **Contrast Protect Azure Sentinel Solution**|Data connector, workbooks, analytics rules |Security - Threat protection |Contrast Security |
| | | | |

## Crowdstrike

<!--add links to data connectors and back-->

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
| **CrowdStrike Falcon Endpoint Protection Solution**| Data connector, workbooks, analytics rules, playbooks| Security - Threat protection| CrowdStrike|
| | | | |

## Digital Guardian

<!--add links to data connectors and back-->

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Digital Guardian** |Data connector |Security - Information Protection |Digital Guardian |
| | | |

## FalconForce

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**FalconForce | Falcon Friday** |Analytics rules |User Behavior (UEBA), Security - Insider threat | <!--missing-->|
| | | |

## FireEye NX (Network Security)

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**FireEye NX (Network Security)** |Data connector |Security - Network| FireEye|
| | | |

## Flare Systems Firework

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Flare Systems Firework** |Data connector |Security - Threat protection | Flare Systems|
| | | |

## Forescout

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Forescout** |Data connector |Security - Network | Forescout|
| | | |

## Fortinet Fortigate

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Fortinet Fortigate** |Data connector, playbooks|Security - Automation (SOAR) | Fortinet|
| | | |
## Google

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Google Cloud Platform DNS Solution** |Data connector |Cloud Provider, Networking |Google |
| **Google Cloud Platform Cloud Monitoring Solution**|Data connector |Cloud Provider | Google|
| **Google Cloud Platform Identity and Access Management Solution**|Data connector, workbook, analytics rules, playbooks, hunting queries|Cloud Provider, Identity |Google |
| | | | |

## HYAS

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
| **HYAS Insight for Azure Sentinel Solutions Gallery**| Playbooks| Security - Threat Intelligence, Security - Automation (SOAR) |HYAS |
| | | | |

## ibos

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**iboss** | | | |
| | | |
## Infoblox

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
| **Infoblox Cloud Data Connector Solution**| Provides built-in, customizable threat detection for [BloxOne DDI](https://www.infoblox.com/products/bloxone-ddi/).| | |
| | | | |


## IronNet CyberSecurity Iron Defense

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**IronNet CyberSecurity Iron Defense** | | | |
| | | |
## jamf

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**jamf** | | | |
| | | |

## Juniper

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Juniper IDP** |Provides built-in, customizable threat detection for [Juniper Intrusion Detection and Prevention](https://www.juniper.net/documentation/us/en/software/junos/idp-policy/topics/topic-map/security-idp-overview.html).| | |
| | | | |

## McAfee

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
| **McAfee ePolicy Orchestrator Solution**| Provides built-in, customizable threat detection for the [McAfee ePO](https://www.mcafee.com/enterprise/en-in/products/epolicy-orchestrator.html).| | |
|**McAfee Network Security Platform Solution** |[McAfee Network Security Platform](https://www.mca.fee.com/enterprise/en-us/products/virtual-network-security-platform.html) | | |

## Microsoft

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Microsoft Sentinel 4 Dynamics 365**     |   Data connector, workbooks, analytics rules, and hunting queries |      Application   |Microsoft         |
|**Microsoft Sentinel for SQL PaaS**     | Provides built-in, customizable threat detection for Azure SQL PaaS, based on SQL Audit logs, and with seamless integration to alerts from Azure Defender for SQL.   <br><br>**Supported by**: Microsoft     |         |         |
|**Microsoft Sentinel for Teams**     | Provides human and automated analysis for logs and real-time meeting monitoring.   <br><br>**Supported by**: Microsoft      | Analytics rules, hunting queries, and playbooks        |         |
| | | |

## Mimecast

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Mimecast** | | | |
| | | |
## Netscope

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**NetScope** | | | |
| | | |

## Nucleus Cyber NC Protect

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Nucleus Cyber NC Protect** | | | |
| | | |

## NXlog

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**NXlog** | | | |
| | | |
## Oracle


|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Oracle Database Audit Solution** | Provides built-in, customizable threat detection for the [Oracle Database](https://www.oracle.com/database/technologies/security/db-auditing.html).| | |
| | | | |

## Palo Alto

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
| **Palo Alto Prisma Solution**|Provides built-in, customizable threat detection for [Prisma Cloud](https://www.paloaltonetworks.com/prisma/cloud). | | |
| | | | |

## PingFederate

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**PingFederate Solution** |Provides built-in, customizable threat detection for [PingFederate®](https://www.pingidentity.com/en/resources/client-library/data-sheets/pingfederate-data-sheet.html).| | |
| | | | |

## Proofpoint

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Proofpoint POD Solution** |Provides built-in, customizable threat detection for [Proofpoint on Demand Email Security](https://www.proofpoint.com/us/products/email-security-and-protection/email-protection).| | |
|**Proofpoint TAP Solution** | Provides built-in, customizable threat detection for [Proofpoint Targeted Attack Protection (TAP)](https://www.proofpoint.com/us/products/advanced-threat-protection/targeted-attack-protection).| | |
| | | |

## Qualys

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Qualys VM Solution** |Provides built-in, customizable threat detection for [Qualys Vulnerability Management (VM)](https://www.qualys.com/apps/vulnerability-management/). | | |
| | | | |

## Rapid7

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Rapid7 InsightVM CloudAPI Solution** |Provides built-in, customizable threat detection for the [Rapid7 Insight platform](https://www.rapid7.com/products/insightvm/). | | |
| | | | |

## RiskIQ

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
| **RiskIQ Security Intelligence Playbooks**|Enriches and adds context to incidents using data from [RiskIQ](https://www.riskiq.com/), including comments that link to further details in RiskIQ's investigative platform. | | |
| | | | |

## Riverbed

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Riverbed** | | | |
| | | |

## Safeguard Cyber

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Safeguard Cyber** | | | |
| | | |
## Sailpoint

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Sailpoint** | | | |
| | | |
## SAP

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
| **Continuous Threat Monitoring for SAP**|Provides built-in, customizable threat detection for [SAP environments](sap-deploy-solution.md).| [Data connector, workbooks, automation rules, and watchlists](sap-solution-security-content.md)  | |
| | | | |


## Senserva

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Senserva Offer for Azure Sentinel** |Provides built-in, customizable threat detection for [Senserva](https://www.senserva.com/product/).|Queries, workbooks, and playbooks | |
| | | | |

## Slack

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
| **Slack Audit Solution**| Enables you to ingest [Slack Audit Records](https://api.slack.com/admins/audit-logs) in to Azure Sentinel via REST. For more information see [Slack Audit](https://slack.com) and [API documentation](https://api.slack.com/admins/audit-logs#the_audit_event).| Data connector| |
| | | | |


## SlashNext

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**SlashNext** | | | |
| | | |
## Sonrai Security

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Sonrai Security** | | | |
| | | |
## Sophos

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Sophos Endpoint Protection Solution** |Provides built-in, customizable threat detection for [Sophos](https://www.sophos.com/en-us/company.aspx). | | |
| **Sophos XG Firewall Solution**| Provides built-in, customizable threat detection for [Sophos](https://www.sophos.com/en-us/company.aspx). | | |
| | | | |


## Symantec

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
| **Symantec Endpoint Protection Solution**|Provides built-in, customizable threat detection for [Symantec Endpoint Protection](https://www.broadcom.com/products/cyber-security/endpoint).| | |
| **Symantec ProxySG  Solution**|Provides built-in, customizable threat detection for [Symantec Secure Web Gateway](https://www.broadcom.com/products/cyber-security/network/gateway/proxy-sg-and-advanced-secure-gateway).| | |
| | | | |


## ReversingLabs

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
| **ReversingLabs TitaniumCloud File Enrichment Solution**|Provides built-in, customizable threat detection for [ReversingLabs TitaniumCloud](https://www.reversinglabs.com/products/file-reputation-service). <br><br>For more information, see [ReversingLabs TitaniumCloud](threat-intelligence-integration.md#reversinglabs-titaniumcloud) threat intelligence. |Playbooks | |
| | | | |


## TrendMicro

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Trend Micro Apex One Solution**  | Provides built-in, customizable threat detection for [Trend Micro Apex One](https://www.trendmicro.com/en_us/business/products/user-protection/sps/endpoint.html).| | |
| | | | |



## Ubiquiti

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
| **Ubiquiti UniFi Solution**|Provides built-in, customizable threat detection for [Ubiquiti Inc.](https://www.ui.com/) services. | | |
| | | | |


## vArmour

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
| **vArmour Application Controller and Azure Sentinel Solution**|Provides built-in, customizable threat detection for [vArmour Application Controller](https://www.varmour.com/). | | |
| | | | |

## VMRay

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**VMRay** | | | |
| | | |
## VMWare

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
| **VMware Carbon Black Solution**|Provides built-in, customizable threat detection for [VMware Carbon Black](https://www.carbonblack.com/products/vmware-carbon-black-cloud-endpoint/).| | |
| | | | |

## Next steps

In this document, you learned about Azure Sentinel solutions and how to find and deploy them.

- Learn more about [Azure Sentinel Solutions](sentinel-solutions.md).
- [Find and deploy Azure Sentinel Solutions](sentinel-solutions-deploy.md).
