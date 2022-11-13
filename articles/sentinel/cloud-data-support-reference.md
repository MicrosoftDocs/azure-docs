---
title: Cloud data support for Microsoft 365 Defender connectors in Microsoft Sentinel - Microsoft 365 Commercial, GCC, and more 
description: This article describes the types of clouds that affect data streaming from the different connectors that Microsoft Sentinel supports.  
author: limwainstein
ms.topic: reference
ms.date: 11/14/2022
ms.author: lwainstein
---

# Cloud data support for Microsoft 365 Defender connectors in Microsoft Sentinel - Microsoft 365 Commercial, GCC, and more

The type of cloud your environment uses affects Microsoft Sentinel's ability to ingest and display data from these connectors, like logs, alerts, device events, and more. This article describes support for different data tables in Microsoft Sentinel for different cloud types.

Read more about [cloud data support in Microsoft Sentinel](cloud-data-support.md).

## Microsoft Defender for Endpoint

|Data table  |Commercial  |GCC  |GCC-High |DoD |
|---------|---------|---------|---------|---------|
|DeviceInfo     |• M365D: GA<br> • Microsoft Sentinel: PP |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP |
|DeviceNetworkInfo     |• M365D: GA<br> • Microsoft Sentinel: PP |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP |
|DeviceProcessEvents     |• M365D: GA<br> • Microsoft Sentinel: PP |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP |
|DeviceNetworkEvents     |• M365D: GA<br> • Microsoft Sentinel: PP |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP |
|DeviceFileEvents     |• M365D: GA<br> • Microsoft Sentinel: PP |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP |
|DeviceRegistryEvents     |• M365D: GA<br> • Microsoft Sentinel: PP |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP |
|DeviceLogonEvents     |• M365D: GA<br> • Microsoft Sentinel: PP |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP |
|DeviceImageLoadEvents     |• M365D: GA<br> • Microsoft Sentinel: PP |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP |
|DeviceEvents     |• M365D: GA<br> • Microsoft Sentinel: PP |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP |
|DeviceFileCertificateInfo     |• M365D: GA<br> • Microsoft Sentinel: PP |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP         |• M365D: GA<br> • Microsoft Sentinel: PP |

## Microsoft Defender for Identity

|Data table  |Commercial  |GCC  |GCC-High |DoD |
|---------|---------|---------|---------|---------|
|IdentityDirectoryEvents |• M365D: GA<br> • Microsoft Sentinel: PP |Unsupported |Unsupported |Unsupported |Unsupported |
IdentityLogonEvents|• M365D: GA<br> • Microsoft Sentinel: PP |Unsupported |Unsupported |Unsupported |Unsupported |
IdentityQueryEvents|• M365D: GA<br> • Microsoft Sentinel: PP |Unsupported |Unsupported |Unsupported |Unsupported |

## Microsoft Defender for Cloud Apps

|Data table  |Commercial  |GCC  |GCC-High |DoD |
|---------|---------|---------|---------|---------|
|CloudAppEvents |• M365D: GA<br> • Microsoft Sentinel: PP |Unsupported |Unsupported |Unsupported |Unsupported |

## Microsoft 365 Defender incidents

|Data table  |Commercial  |GCC  |GCC-High |DoD |
|---------|---------|---------|---------|---------|
|SecurityIncident |Microsoft Sentinel: PP|Microsoft Sentinel: PP |Microsoft Sentinel: PP |Microsoft Sentinel: PP |

## Alerts

|Connector/Data table  |Commercial  |GCC  |GCC-High |DoD |
|---------|---------|---------|---------|---------|
|Microsoft 365 Defender Alerts: SecurityAlert |PP |PP |PP |PP |
|Microsoft Defender for Endpoint Alerts (standalone connector): SecurityAlert (MDATP) |PP |PP |PP |PP |
| Microsoft Defender for Office 365 Alerts (standalone connector):	SecurityAlert (OATP) |PP |PP |PP |PP |
Microsoft Defender for Identity Alerts (standalone connector):	SecurityAlert (AATP) |PP |Unsupported |Unsupported |Unsupported |
Micorosft Defender for Cloud Apps Alerts (standalone connector): 	SecurityAlert (MCAS), |PP |Unsupported |Unsupported |Unsupported |
|Micorosft Defender for Cloud Apps Alerts (standalone connector):	McasShadowItReporting |PP |Unsupported |Unsupported |Unsupported |

## Azure Active Directory Identity Protection

|Data table  |Commercial  |GCC  |GCC-High |DoD |
|---------|---------|---------|---------|---------|
|SecurityAlert (IPC) |PP/GA | |Supported |Supported |
|AlertEvidence |PP |Unsupported |Unsupported |Unsupported |