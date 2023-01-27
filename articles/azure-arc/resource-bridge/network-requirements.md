---
title: Azure Arc resource bridge (preview) network requirements
description: Learn about network requirements for Azure Arc resource bridge (preview) including URLs that must be allowlisted.
ms.topic: conceptual
ms.date: 01/27/2023
---

# Azure Arc resource bridge (preview) network requirements

This article describes the networking requirements for deploying Azure Arc resource bridge (preview) in your enterprise.

[!INCLUDE [network-requirement-principles](../includes/network-requirement-principles.md)]

[!INCLUDE [network-requirements](includes/network-requirements.md)]

## Additional network requirements

In addition, resource bridge (preview) requires [Arc-enabled Kubernetes endpoints](../network-requirements-consolidated.md#azure-arc-enabled-kubernetes-endpoints).

> [!NOTE]
> The URLs listed here are required for Arc resource bridge only. Other Arc products (such as Arc-enabled VMware vSphere) may have additional required URLs. For details, see [Azure Arc network requirements](../network-requirements-consolidated.md).

## Next steps

- Review the [Azure Arc resource bridge (preview) overview](overview.md) to understand more about requirements and technical details.
- Learn about [security configuration and considerations for Azure Arc resource bridge (preview)](security-overview.md).
