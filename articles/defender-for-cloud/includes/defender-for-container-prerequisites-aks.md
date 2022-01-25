---
ms.service: defender-for-cloud
ms.topic: include
ms.date: 01/25/2022
---

## Prerequisites

Validate the following endpoints are configured for outbound access so that the Defender profile can connect to Microsoft Defender for Cloud to send security data and events:

See the [required FQDN/application rules for Azure policy](../../aks/limit-egress-traffic.md#microsoft-defender-for-containers) for Microsoft Defender for Containers.

By default, AKS clusters have unrestricted outbound (egress) internet access. 
