---
title: Delete a network function deployment and/or ClusterServices in Azure Operator 5G Core
description: Learn the high-level process to delete a network function deployment and/or ClusterServices.
author: HollyCl
ms.author: HollyCl
ms.service: operator-5g-core
ms.topic: quickstart #required; leave this attribute/value as-is
ms.date: 02/13/2024

---
# Quickstart: Delete a network function deployment or ClusterServices in Azure Operator 5G Core

This quickstart shows you the ArmClient commands you can use to delete a network function deployment or ClusterServices.

## ArmClient commands

Use the following ArmClient commands to delete the Azure Operator 5G Core resources:

```
ARMClient.exe DELETE 
/subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/amfDeployments/${ResourceName}?api-version=2023-10-15-preview -verbose
```
```
ARMClient.exe DELETE 
/subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/smfDeployments/${ResourceName}?api-version=2023-10-15-preview -verbose
```
```
ARMClient.exe DELETE 
/subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/nrfDeployments/${ResourceName}?api-version=2023-10-15-preview -verbose
```
```
ARMClient.exe DELETE 
/subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/upfDeployments/${ResourceName}?api-version=2023-10-15-preview -verbose
```
```
ARMClient.exe DELETE 
/subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/nssfDeployments/${ResourceName}?api-version=2023-10-15-preview -verbose
```
```
ARMClient.exe DELETE 
/subscriptions/${SUB}/resourceGroups/${RGName}/providers/Microsoft.MobilePacketCore/clusterServices/${ResourceName}?api-version=2023-10-15-preview -verbose
```

## Related content

- [Deploy a network function on Azure Kubernetes Services (AKS)](quickstart-deploy-network-functions.md)