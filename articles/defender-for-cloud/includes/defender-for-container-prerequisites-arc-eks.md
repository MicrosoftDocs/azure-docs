---
ms.service: defender-for-cloud
ms.topic: include
ms.date: 01/25/2022
---

## Prerequisites

Validate the following endpoints are configured for outbound access so that the Defender extension can connect to Microsoft Defender for Cloud to send security data and events:

For Azure public cloud deployments:

| Domain                     | Port |
| -------------------------- | ---- |
| *.ods.opinsights.azure.com | 443  |
| *.oms.opinsights.azure.com | 443  |
| login.microsoftonline.com  | 443  |
