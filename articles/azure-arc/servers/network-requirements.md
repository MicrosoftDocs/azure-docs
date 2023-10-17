---
title: Connected Machine agent network requirements
description: Learn about the networking requirements for using the Connected Machine agent for Azure Arc-enabled servers.
ms.date: 10/05/2023
ms.topic: conceptual 
---

# Connected Machine agent network requirements

This topic describes the networking requirements for using the Connected Machine agent to onboard a physical server or virtual machine to Azure Arc-enabled servers.

## Details

[!INCLUDE [network-requirement-principles](../includes/network-requirement-principles.md)]

[!INCLUDE [network-requirements](./includes/network-requirements.md)]

## Subset of endpoints for ESU only

[!INCLUDE [esu-network-requirements](./includes/esu-network-requirements.md)]

## Next steps

* Review additional [prerequisites for deploying the Connected Machine agent](prerequisites.md).
* Before you deploy the Azure Connected Machine agent and integrate with other Azure management and monitoring services, review the [Planning and deployment guide](plan-at-scale-deployment.md).
* To resolve problems, review the [agent connection issues troubleshooting guide](troubleshoot-agent-onboard.md).
* For a complete list of network requirements for Azure Arc features and Azure Arc-enabled services, see [Azure Arc network requirements (Consolidated)](../network-requirements-consolidated.md).
