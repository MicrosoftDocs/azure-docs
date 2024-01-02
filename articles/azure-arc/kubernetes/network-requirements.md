---
title: Azure Arc-enabled Kubernetes network requirements
description: Learn about the networking requirements to connect Kubernetes clusters to Azure Arc.
ms.date: 09/28/2023
ms.topic: conceptual 
ms.custom: references-regions
---

# Azure Arc-enabled Kubernetes network requirements

This topic describes the networking requirements for connecting a Kubernetes cluster to Azure Arc and supporting various Arc-enabled Kubernetes scenarios.

## Details

[!INCLUDE [network-requirement-principles](../includes/network-requirement-principles.md)]

[!INCLUDE [network-requirements](includes/network-requirements.md)]

## Additional endpoints

Depending on your scenario, you may need connectivity to other URLs, such as those used by the Azure portal, management tools, or other Azure services. In particular, review these lists to ensure that you allow connectivity to any necessary endpoints:

- [Azure portal URLs](../../azure-portal/azure-portal-safelist-urls.md)
- [Azure CLI endpoints for proxy bypass](/cli/azure/azure-cli-endpoints)

For a complete list of network requirements for Azure Arc features and Azure Arc-enabled services, see [Azure Arc network requirements](../network-requirements-consolidated.md).

## Next steps

- Understand [system requirements for Arc-enabled Kubernetes](system-requirements.md).
- Use our [quickstart](quickstart-connect-cluster.md) to connect your cluster.
- Review [frequently asked questions](faq.md) about Arc-enabled Kubernetes.
