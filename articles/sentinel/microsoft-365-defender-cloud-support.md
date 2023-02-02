---
title: Support for Microsoft 365 Defender connector data types in Microsoft Sentinel for different clouds (GCC environments)
description: This article describes support for different Microsoft 365 Defender connector data types in Microsoft Sentinel across different clouds, including Commercial, GCC, GCC-High, and DoD.
author: limwainstein
ms.author: lwainstein
ms.topic: reference
ms.date: 02/01/2023
---

# Support for Microsoft 365 Defender connector data types in different clouds

The type of cloud your environment uses affects Microsoft Sentinel's ability to ingest and display data from these connectors, like logs, alerts, device events, and more. This article describes support for different Microsoft 365 Defender connector data types in Microsoft Sentinel across different clouds, including Commercial, GCC, GCC-High, and DoD.

Read more about [data type support for different clouds in Microsoft Sentinel](data-type-cloud-support.md).

## Connector data

### Incidents

| Data type | Commercial / GCC<br>(Azure Commercial) | GCC-High / DoD<br>(Azure Government) |
| ----------------- | ------------------- | -------------- |
| **Incidents** | Generally available | Generally available |

### Alerts

#### From Microsoft 365 Defender

| Data type | Commercial / GCC<br>(Azure Commercial) | GCC-High / DoD<br>(Azure Government) |
| ----------------- | ------------------- | -------------- |
| **Microsoft 365 Defender alerts: *SecurityAlert*** | Generally available | Public preview |

#### From standalone component connectors

| Data type         | Commercial | GCC | GCC-High / DoD            |
| ----------------- | ---------- | --- | ------------------------- |
| **Microsoft Defender for Endpoint: *SecurityAlert (MDATP)*** | Generally available | Generally available | Generally available |
| **Microsoft Defender for Office 365: *SecurityAlert (OATP)*** | Public preview | Public preview | Public preview |
| **Microsoft Defender for Identity: *SecurityAlert (AATP)*** | Generally available | Unsupported | Unsupported |
| **Microsoft Defender for Cloud Apps: *SecurityAlert (MCAS)*** | Generally available | Generally available | Unsupported |
| **Microsoft Defender for Cloud Apps: *McasShadowItReporting*** | Generally available | Generally available | Unsupported |

## Raw event data

### Microsoft Defender for Endpoint

| Data type | Commercial / GCC<br>(Azure Commercial) | GCC-High / DoD<br>(Azure Government) |
| --------- | ---------------- | -------------- |
| **DeviceInfo** | Generally available | Microsoft 365 Defender: Generally available<br>Microsoft Sentinel: Public preview |
| **DeviceNetworkInfo** | Generally available | Microsoft 365 Defender: Generally available<br>Microsoft Sentinel: Public preview |
| **DeviceProcessEvents** | Generally available | Microsoft 365 Defender: Generally available<br>Microsoft Sentinel: Public preview |
| **DeviceNetworkEvents** | Generally available | Microsoft 365 Defender: Generally available<br>Microsoft Sentinel: Public preview |
| **DeviceFileEvents** | Generally available | Microsoft 365 Defender: Generally available<br>Microsoft Sentinel: Public preview |
| **DeviceRegistryEvents** | Generally available | Microsoft 365 Defender: Generally available<br>Microsoft Sentinel: Public preview |
| **DeviceLogonEvents** | Generally available | Microsoft 365 Defender: Generally available<br>Microsoft Sentinel: Public preview |
| **DeviceImageLoadEvents** | Generally available | Microsoft 365 Defender: Generally available<br>Microsoft Sentinel: Public preview |
| **DeviceEvents** | Generally available | Microsoft 365 Defender: Generally available<br>Microsoft Sentinel: Public preview |
| **DeviceFileCertificateInfo** | Generally available | Microsoft 365 Defender: Generally available<br>Microsoft Sentinel: Public preview |

### Microsoft Defender for Identity

| Data type | Commercial / GCC<br>(Azure Commercial) | GCC-High / DoD<br>(Azure Government) |
| --------------------------- | ------------------- | ----------- |
| **IdentityDirectoryEvents** | Generally available | Unsupported |
| **IdentityLogonEvents**     | Generally available | Unsupported |
| **IdentityQueryEvents**     | Generally available | Unsupported |

### Microsoft Defender for Cloud Apps

| Data type | Commercial / GCC<br>(Azure Commercial) | GCC-High / DoD<br>(Azure Government) |
| ------------------ | ------------------- | ----------- |
| **CloudAppEvents** | Generally available | Unsupported |

### Microsoft Defender for Office 365

| Data type | Commercial / GCC<br>(Azure Commercial) | GCC-High / DoD<br>(Azure Government) |
| --------------------------- | ------------------- | -------------- |
| **EmailEvents**             | Generally available | Public preview |
| **EmailAttachmentInfo**     | Generally available | Public preview |
| **EmailUrlInfo**            | Generally available | Public preview |
| **EmailPostDeliveryEvents** | Generally available | Public preview |
| **UrlClickEvents**          | Generally available | Public preview |

### Alerts

| Data type | Commercial / GCC<br>(Azure Commercial) | GCC-High / DoD<br>(Azure Government) |
| ----------------- | ------------------- | -------------- |
| **AlertInfo**     | Generally available | Public preview |
| **AlertEvidence** | Generally available | Public preview |



## Next steps

In this article, you learned which Microsoft 365 Defender connector data types are supported in Microsoft Sentinel for different cloud environments.

- Read more about [GCC environments in Microsoft Sentinel](data-type-cloud-support.md).
- Learn about [Microsoft 365 Defender integration with Microsoft Sentinel](microsoft-365-defender-sentinel-integration.md).
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.