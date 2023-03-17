---
author: tomkerkhove

ms.service: azure-kubernetes-service
ms.topic: include
ms.date: 05/24/2022
ms.author: tomkerkhove
---

> [!IMPORTANT]
> The KEDA add-on installs version *2.7.0* of KEDA on your cluster.
> 
> Due to [KEDA's Kubernetes Compatibility policy](https://keda.sh/docs/latest/operate/cluster/#kubernetes-compatibility), the managed KEDA addon is will only be supported in Kubernetes versions <= 1.25 when generally available. Please follow the [release notes](https://github.com/Azure/AKS/releases) to be notified for additional Kubernetes version support.