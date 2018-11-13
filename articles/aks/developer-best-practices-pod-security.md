---
title: Developer best practices - Pod security in Azure Kubernetes Services (AKS)
description: Learn the developer best practices for how to secure pods in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: conceptual
ms.date: 11/13/2018
ms.author: iainfou
---

# Best practices for pod security in Azure Kubernetes Service (AKS)

As you develop and run applications in Azure Kubernetes Service (AKS), there are a few key areas to consider. How you manage your cluster and application deployments can negatively impact the end-user experience of services that you provide. To help you succeed, there are some best practices you can follow as you design and run AKS clusters.

This best practices article focuses on how secure pods in AKS. You learn how to:

> [!div class="checklist"]
> *
> *

You can also read the [best practices for cluster security][best-practices-cluster-security] and the [best practices for container security][best-practices-container-security].

## Pod security context

**Best practice guidance** - 

## Pod security policies

**Best practice guidance** - 

## Limit credential exposure

**Best practice guidance** - 

Use pod identities
Key Vault with FlexVol

## Next steps

This best practices article focused on how to manage identity and authentication. To implement some of these best practices, see the following articles:

* [Use managed identities for Azure resources with AKS][aad-pod-identity]
* [Integrate Azure Key Vault with AKS][aks-keyvault-flexvol]

<!-- EXTERNAL LINKS -->
[aad-pod-identity]: https://github.com/Azure/aad-pod-identity
[aks-keyvault-flexvol]: https://github.com/Azure/kubernetes-keyvault-flexvol

<!-- INTERNAL LINKS -->
[best-practices-cluster-security]: operator-best-practices-cluster-security.md
[best-practices-container-security]: operator-best-practices-container-security.md
