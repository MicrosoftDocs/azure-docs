---
title: Delete a network function deployment and/or ClusterServices in Azure Operator 5G Core Preview
description: Learn the high-level process to delete a network function deployment and/or ClusterServices.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.custom: devx-track-azurecli
ms.topic: quickstart #required; leave this attribute/value as-is
ms.date: 02/21/2024
---
# Quickstart: Delete a network function deployment or ClusterServices in Azure Operator 5G Core Preview

This quickstart shows you the Azure CLI commands you can use to delete a network function deployment or ClusterServices.

## Azure CLI commands

Use the following Azure CLI commands to delete the Azure Operator 5G Core (preview) resources:

`$ az resource delete --ids /subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/amfDeployments/${ResourceName}`

`$ az resource delete --ids /subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/smfDeployments/${ResourceName}`

`$ az resource delete --ids /subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/nrfDeployments/${ResourceName}`

`$ az resource delete --ids /subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/upfDeployments/${ResourceName}`

`$ az resource delete --ids /subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/nssfDeployments/${ResourceName}`

`$ az resource delete --ids /subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/clusterServices/${ResourceName}`

 
## Related content

- [Deploy a network function](quickstart-deploy-network-functions.md)
