---
ms.service: defender-for-cloud
ms.topic: include
ms.date: 07/19/2022
ms.author: benmansheim
author: bmansheim
---

## Network requirements - AKS

Validate the following endpoints are configured for outbound access so that the Defender profile can connect to Microsoft Defender for Cloud to send security data and events:

See the [required FQDN/application rules for Microsoft Defender for Containers](../../aks/limit-egress-traffic.md#microsoft-defender-for-containers).

By default, AKS clusters have unrestricted outbound (egress) internet access. 
