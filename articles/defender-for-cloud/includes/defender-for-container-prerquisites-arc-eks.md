---
ms.service: defender-for-cloud
ms.topic: include
ms.date: 01/25/2022
---

## Prerequisites

Validate the following endpoints are configured for outbound access so that the Defender profile can connect to Microsoft Defender for Cloud to send security data and events:

For Azure public cloud deployments:

| Domain | Port |
|--|--|
| data.policy.core.windows.net | 443 |
| store.policy.core.windows.net | 443 |
| login.microsoftonline.com | 443 |
 
For Azure Government cloud deployments:

| Domain                    | Port |
| ------------------------- | ---- |
| *.ods.opinsights.azure.us | 443  |
| *.oms.opinsights.azure.us | 443  |
| login.microsoftonline.us  | 443  |
