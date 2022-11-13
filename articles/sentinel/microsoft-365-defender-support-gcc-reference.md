---
title: Support for Microsoft 365 Defender connector data types in Microsoft Sentinel for different GCC environments 
description: This article describes support for Microsoft 365 Defender connector data types in Microsoft Sentinel for different GCC environments.
author: limwainstein
ms.topic: reference
ms.date: 11/14/2022
ms.author: lwainstein
---

# Support for Microsoft 365 Defender connector data types in Microsoft Sentinel for different GCC environments

The type of cloud your environment uses affects Microsoft Sentinel's ability to ingest and display data from these connectors, like logs, alerts, device events, and more. This article describes support for different data tables in Microsoft Sentinel for different cloud types.

Read more about [cloud data support in Microsoft Sentinel](cloud-data-support.md).

## Microsoft Defender for Endpoint

Option 1:

|Data type  |Microsoft Defender 365 |Microsoft Sentinel |
|---------|---------|---------|
|DeviceInfo |GA for all cloud types* |Public Preview for all cloud types* |

*Supported on Azure Commercial, GCC, GCC-High, DoD 

Option 2:

|Data type  |Commercial  |GCC  |GCC-High |DoD |
|---------|---------|---------|---------|---------|
|DeviceInfo     |• Microsoft 365 Defender: GA<br>Microsoft Sentinel: Public Preview |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |
|DeviceNetworkInfo     |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |
|DeviceProcessEvents     |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |
|DeviceNetworkEvents     |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |
|DeviceFileEvents     |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Pubic Preview |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |
|DeviceRegistryEvents     |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |
|DeviceLogonEvents     |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |
|DeviceImageLoadEvents     |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |
|DeviceEvents     |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |
|DeviceFileCertificateInfo     |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview         |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |

## Microsoft Defender for Identity

|Data type  |Commercial  |GCC  |GCC-High |DoD |
|---------|---------|---------|---------|---------|
|IdentityDirectoryEvents |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |Unsupported |Unsupported |Unsupported |
IdentityLogonEvents|• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |Unsupported |Unsupported |Unsupported |
IdentityQueryEvents|• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |Unsupported |Unsupported |Unsupported |

## Microsoft Defender for Cloud Apps

|Data type  |Commercial  |GCC  |GCC-High |DoD |
|---------|---------|---------|---------|---------|
|CloudAppEvents |• Microsoft 365 Defender: GA<br> • Microsoft Sentinel: Public Preview |Unsupported |Unsupported |Unsupported |

## Microsoft 365 Defender incidents

|Data type  |Commercial  |GCC  |GCC-High |DoD |
|---------|---------|---------|---------|---------|
|SecurityIncident |Microsoft Sentinel: Public Preview |Microsoft Sentinel: Public Preview |Microsoft Sentinel: Public Preview |Microsoft Sentinel: Public Preview |

## Alerts

|Connector/Data type  |Commercial  |GCC  |GCC-High |DoD |
|---------|---------|---------|---------|---------|
|Microsoft 365 Defender Alerts: SecurityAlert |Public Preview |Public Preview |Public Preview |Public Preview |
|Microsoft Defender for Endpoint Alerts (standalone connector): SecurityAlert (MDATP) |Public Preview |Public Preview |Public Preview |Public Preview |
| Microsoft Defender for Office 365 Alerts (standalone connector):	SecurityAlert (OATP) |Public Preview |Public Preview |Public Preview |Public Preview |
Microsoft Defender for Identity Alerts (standalone connector):	SecurityAlert (AATP) |Public Preview |Unsupported |Unsupported |Unsupported |
Micorosft Defender for Cloud Apps Alerts (standalone connector): 	SecurityAlert (MCAS), |Public Preview |Unsupported |Unsupported |Unsupported |
|Micorosft Defender for Cloud Apps Alerts (standalone connector):	McasShadowItReporting |Public Preview |Unsupported |Unsupported |Unsupported |

## Azure Active Directory Identity Protection

|Data type  |Commercial  |GCC  |GCC-High |DoD |
|---------|---------|---------|---------|---------|
|SecurityAlert (IPC) |Public Preview/GA | |Supported |Supported |
|AlertEvidence |Public Preview |Unsupported |Unsupported |Unsupported |