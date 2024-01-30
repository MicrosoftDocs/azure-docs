---
title: Azure Operator 5G Core Deployment ordering on Azure Kubernetes Services
description: Outlines the deployment order for components on Azure Kubernetes Services
author: HollyCl
ms.author: HollyCl
ms.service: azure
ms.topic: concept-article #required; leave this attribute/value as-is.
ms.date: 01/30/2024

#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---

# Deployment order on Azure Kubernetes Services

Mobile Packet Core resources have minimal ordering constraints. The only restriction is you MUST deploy the ClusterServices resource before any network function or observability resources are deployed. Azure Operator 5G Core's Resource Provider doesn't allow network functions or observability to be deployed until ClusterServices successfully completes. Once ClusterServices is deployed, the network functions and observability resources can be deployed in any order and in parallel. 

  ```
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

- [Complete the prerequisites to deploy Azure Operator 5G Core on Advanced Kubernetes Service](how-to-complete-prerequisites-deploy-azure-kubernetes-service.md)

