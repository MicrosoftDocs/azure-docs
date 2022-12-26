---
title: Support for Microsoft 365 Defender connector data types in Microsoft Sentinel for different clouds (GCC environments)
description: This article describes support for different Microsoft 365 Defender connector data types in Microsoft Sentinel across different clouds, including Commercial, GCC, GCC-High, and DoD.
author: limwainstein
ms.topic: reference
ms.date: 11/14/2022
ms.author: lwainstein
---

# Support for Microsoft 365 Defender connector data types in different clouds

The type of cloud your environment uses affects Microsoft Sentinel's ability to ingest and display data from these connectors, like logs, alerts, device events, and more. This article describes support for different Microsoft 365 Defender connector data types in Microsoft Sentinel across different clouds, including Commercial, GCC, GCC-High, and DoD.

Read more about [data type support for different clouds in Microsoft Sentinel](data-type-cloud-support.md).

## Microsoft Defender for Endpoint

|Data type  |Commercial  |GCC  |GCC-High |DoD |
|---------|---------|---------|---------|---------|
|DeviceInfo     |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |
|DeviceNetworkInfo     |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li> |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |
|DeviceProcessEvents     |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</ul></li>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |
|DeviceNetworkEvents     |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li> |
|DeviceFileEvents     |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |
|DeviceRegistryEvents     |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |
|DeviceLogonEvents     |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |
|DeviceImageLoadEvents     |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |
|DeviceEvents     |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |
|DeviceFileCertificateInfo     |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li> |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul>         |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |

## Microsoft Defender for Identity

|Data type  |Commercial  |GCC  |GCC-High |DoD |
|---------|---------|---------|---------|---------|
|IdentityDirectoryEvents |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |Unsupported |Unsupported |Unsupported |
IdentityLogonEvents|<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |Unsupported |Unsupported |Unsupported |
IdentityQueryEvents|<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li> |Unsupported |Unsupported |Unsupported |

## Microsoft Defender for Cloud Apps

|Data type  |Commercial  |GCC  |GCC-High |DoD |
|---------|---------|---------|---------|---------|
|CloudAppEvents |<ul><li>Microsoft 365 Defender: GA</li><li>Microsoft Sentinel: Public Preview</li></ul> |Unsupported |Unsupported |Unsupported |

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
Microsoft Defender for Cloud Apps Alerts (standalone connector): 	SecurityAlert (MCAS), |Public Preview |Unsupported |Unsupported |Unsupported |
|Microsoft Defender for Cloud Apps Alerts (standalone connector):	McasShadowItReporting |Public Preview |Unsupported |Unsupported |Unsupported |

## Azure Active Directory Identity Protection

|Data type  |Commercial  |GCC  |GCC-High |DoD |
|---------|---------|---------|---------|---------|
|SecurityAlert (IPC) |Public Preview/GA |Supported |Supported |Supported |
|AlertEvidence |Public Preview |Unsupported |Unsupported |Unsupported |

## Next steps

In this article, you learned which Microsoft 365 Defender connector data types are supported in Microsoft Sentinel for different cloud environments.

- Read more about [GCC environments in Microsoft Sentinel](data-type-cloud-support.md).
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.