---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 01/11/2023
ms.author: danlep
---
Rate limit counts in a self-hosted gateway can be configured to synchronize locally (among gateway instances across cluster nodes), for example, through [Helm chart deployment](../articles/api-management/how-to-deploy-self-hosted-gateway-kubernetes-helm.md) for Kubernetes or using the Azure Portal [deployment templates](../articles/api-management/how-to-deploy-self-hosted-gateway-kubernetes.md). However, rate limit counts don't synchronize with other gateways, including the managed gateway in the cloud.
