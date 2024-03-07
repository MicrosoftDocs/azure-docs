---
title: Azure Operator 5G Core Preview Deployment ordering for clusters, network functions, and observability 
description: Outlines the deployment order for components on Azure Kubernetes Services or Nexus Azure Kubernetes Services
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.custom: devx-track-azurecli
ms.topic: concept-article #required; leave this attribute/value as-is.
ms.date: 02/21/2024

#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---

# Deployment order for clusters, network functions, and observability 

Mobile Packet Core resources have minimal ordering constraints. To bring up network functions, the cluster services must be already running successfully. The same set of cluster services can be reused for multiple network functions and the cluster services must be deployed on every cluster that hosts the network functions.

## Azure CLI commands used to deploy resources

Use the following Azure CLI commands to deploy resources.
  
```azurecli
{ 
   [ 
    Microsoft.MobilePacketCore/clusterServices 
   ], 
   [ 
    Microsoft.MobilePacketCore/amfDeployments 
    Microsoft.MobilePacketCore/smfDeployments 
    Microsoft.MobilePacketCore/nrfDeployments 
    Microsoft.MobilePacketCore/nssfDeployments 
    Microsoft.MobilePacketCore/upfDeployments 
    Microsoft.MobilePacketCore/observabilityServices 
   ]
```

## Related content

- [Complete the prerequisites to deploy Azure Operator 5G Core Preview on Azure Kubernetes Service](how-to-complete-prerequisites-deploy-azure-kubernetes-service.md)
- [Complete the prerequisites to deploy Azure Operator 5G Core Preview on Nexus Azure Kubernetes Service](how-to-complete-prerequisites-deploy-nexus-azure-kubernetes-service.md)
