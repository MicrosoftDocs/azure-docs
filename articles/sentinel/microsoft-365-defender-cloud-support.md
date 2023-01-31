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

| Data type | Commercial | GCC       | GCC-High  | DoD       |
| --------- | ---------- | --------- | --------- | --------- |
| **DeviceInfo**                | GA | GA | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview |
| **DeviceNetworkInfo**         | GA | GA | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview |
| **DeviceProcessEvents**       | GA | GA | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview |
| **DeviceNetworkEvents**       | GA | GA | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview |
| **DeviceFileEvents**          | GA | GA | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview |
| **DeviceRegistryEvents**      | GA | GA | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview |
| **DeviceLogonEvents**         | GA | GA | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview |
| **DeviceImageLoadEvents**     | GA | GA | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview |
| **DeviceEvents**              | GA | GA | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview |
| **DeviceFileCertificateInfo** | GA | GA | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview | <li>**Microsoft 365 Defender:** GA<li>**Microsoft Sentinel:** Public preview |

## Microsoft Defender for Identity

| Data type                   | Commercial | GCC | GCC-High    | DoD         |
| --------------------------- | ---------- | --- | ----------- | ----------- |
| **IdentityDirectoryEvents** | GA         | GA  | Unsupported | Unsupported |
| **IdentityLogonEvents**     | GA         | GA  | Unsupported | Unsupported |
| **IdentityQueryEvents**     | GA         | GA  | Unsupported | Unsupported |

## Microsoft Defender for Cloud Apps

| Data type          | Commercial | GCC | GCC-High    | DoD         |
| ------------------ | ---------- | --- | ----------- | ----------- |
| **CloudAppEvents** | GA         | GA  | Unsupported | Unsupported |

## Microsoft Defender for Office 365

| Data type                   | Commercial | GCC | GCC-High       | DoD            |
| --------------------------- | ---------- | --- | -------------- | -------------- |
| **EmailEvents**             | GA         | GA  | Public preview | Public preview |
| **EmailAttachmentInfo**     | GA         | GA  | Public preview | Public preview |
| **EmailUrlInfo**            | GA         | GA  | Public preview | Public preview |
| **EmailPostDeliveryEvents** | GA         | GA  | Public preview | Public preview |
| **UrlClickEvents**          | GA         | GA  | Public preview | Public preview |

## Microsoft 365 Defender incidents

| Data type        | Commercial     | GCC            | GCC-High       | DoD            |
| ---------------- | -------------- | -------------- | -------------- | -------------- |
| SecurityIncident | Public preview | Public preview | Public preview | Public preview |

## Alerts

| Data type         | Commercial | GCC | GCC-High       | DoD            |
| ----------------- | ---------- | --- | -------------- | -------------- |
| **AlertInfo**     | GA         | GA  | Public preview | Public preview |
| **AlertEvidence** | GA         | GA  | Public preview | Public preview |
|
| Microsoft 365 Defender Alerts:<br>SecurityAlert |Public preview |Public preview |Public preview |Public preview |
| Microsoft Defender for Endpoint Alerts (standalone connector):<br>SecurityAlert (MDATP) |Public preview |Public preview |Public preview |Public preview |
| Microsoft Defender for Office 365 Alerts (standalone connector):<br>SecurityAlert (OATP) |Public preview |Public preview |Public preview |Public preview |
| Microsoft Defender for Identity Alerts (standalone connector):<br>SecurityAlert (AATP) |Public preview |Unsupported |Unsupported |Unsupported |
| Microsoft Defender for Cloud Apps Alerts (standalone connector):<br>SecurityAlert (MCAS), |Public preview |Unsupported |Unsupported |Unsupported |
| Microsoft Defender for Cloud Apps Alerts (standalone connector):<br>McasShadowItReporting |Public preview |Unsupported |Unsupported |Unsupported |

## Azure Active Directory Identity Protection

|Data type  |Commercial  |GCC  |GCC-High |DoD |
|---------|---------|---------|---------|---------|
|SecurityAlert (IPC) |Public preview/GA |Supported |Supported |Supported |
|AlertEvidence |Public preview |Unsupported |Unsupported |Unsupported |

## Next steps

In this article, you learned which Microsoft 365 Defender connector data types are supported in Microsoft Sentinel for different cloud environments.

- Read more about [GCC environments in Microsoft Sentinel](data-type-cloud-support.md).
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.