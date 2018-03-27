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

Internal load balancing makes a Kubernetes service accessible to applications running in the same virtual network as the Kubernetes cluster. This document details creating an internal load balancer with Azure Container Service (AKS).

## Create internal load balance

To create an internal load balancer, build a service manifest with the service type `LoadBalancer` and `service.beta.kubernetes.io/azure-load-balancer-internal: "true"` as an annotation.

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

Once deployed, an Azure load balancer is created and made available on the same virtual network as the AKS cluster. 

![Image of AKS internal load balancer](media/internal-lb/internal-lb.png)

When retrieving the service details, the IP address in the `EXTERNAL-IP` column is the IP address of the internal load balancer. 

```console
NAME               TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
azure-vote-front   LoadBalancer   10.0.184.168   10.240.0.7    80:30225/TCP   2m
```

<!-- LINKS - External -->

<!-- LINKS - Internal -->