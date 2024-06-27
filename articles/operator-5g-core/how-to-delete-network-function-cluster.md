---
title: Delete a network function deployment and/or ClusterServices in Azure Operator 5G Core Preview
description: Learn the high-level process to delete a network function deployment and/or ClusterServices.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.custom: devx-track-azurecli
ms.topic: how-to #required; leave this attribute/value as-is
ms.date: 03/07/2024
---
# Delete a network function deployment or ClusterServices in Azure Operator 5G Core Preview

This article shows you the Azure CLI commands you can use to delete a network function deployment or ClusterServices.

## Azure CLI commands

Use the following Azure CLI commands to show and delete the Azure Operator 5G Core (preview) resources:


**AMF**
```azurecli
$ az resource show --ids /subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/amfDeployments/${ResourceName}  

$ az resource delete --ids /subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/amfDeployments/${ResourceName}
```

**SMF**
```azurecli
$ az resource show --ids /subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/smfDeployments/${ResourceName}

$ az resource delete --ids /subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/smfDeployments/${ResourceName}
```

**NRF**
```azurecli
$ az resource show --ids /subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/nrfDeployments/${ResourceName}  

$ az resource delete --ids /subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/nrfDeployments/${ResourceName}
```

**UPF**
```azurecli
$ az resource show --ids /subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/upfDeployments/${ResourceName}  

$ az resource delete --ids /subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/upfDeployments/${ResourceName}
```
**NSSF**
```azurecli
$ az resource show --ids /subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/nssfDeployments/${ResourceName}  

$ az resource delete --ids /subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/nssfDeployments/${ResourceName}
```

**clusterServices**
```azurecli
$ az resource show --ids /subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/clusterServices/${ResourceName}  

$ az resource delete --ids /subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/clusterServices/${ResourceName}
```
 
## Related content

- [Deploy a network function](how-to-deploy-network-functions.md)
