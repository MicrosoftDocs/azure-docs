---
ms.service: defender-for-cloud
ms.topic: include
ms.date: 07/27/2022
ms.author: dacurwin
author: dcurwin
---

## Network requirements

Validate the following endpoints are configured for outbound access so that the Defender sensor can connect to Microsoft Defender for Cloud to send security data and events:

For public cloud deployments:

| Azure Domain  | Azure Government Domain  | Microsoft Azure operated by 21Vianet Domain | Port |
| -------------------------- | -------------------------- | -------------------------- |---- |
| *.ods.opinsights.azure.com | *.ods.opinsights.azure.us | *.ods.opinsights.azure.cn  | 443  |
| *.oms.opinsights.azure.com | *.oms.opinsights.azure.us | *.oms.opinsights.azure.cn | 443 |
| login.microsoftonline.com  | login.microsoftonline.us | login.chinacloudapi.cn  | 443  |

You'll also need to validate the [Azure Arc-enabled Kubernetes network requirements](../../azure-arc/kubernetes/network-requirements.md).
