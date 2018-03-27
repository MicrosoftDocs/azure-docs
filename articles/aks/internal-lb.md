---
title: Create an Azure Container Service (AKS) internal load balancer
description: Use an internal load balancer with Azure Container Service (AKS).
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 3/28/2018
ms.author: nepeters
ms.custom: mvc
---

# Use an internal load balancer with Azure Container Service (AKS)

This document details using an internal load balancer with Azure Container Service (AKS).

## Create internal load balance

```yaml
apiVersion: v1
kind: Service
metadata:
  name: azure-vote-front
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-internal: "true"
spec:
  type: LoadBalancer
  ports:
  - port: 80
  selector:
    app: azure-vote-front
```

![Image of AKS internal load balancer](media/internal-lb/internal-lb.png)

<!-- LINKS - External -->

<!-- LINKS - Internal -->