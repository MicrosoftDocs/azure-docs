---
title: Operator best practices - Security in Azure Kubernetes Services (AKS)
description: Learn the cluster operator best practices for how to manage security and upgrades in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: conceptual
ms.date: 10/29/2018
ms.author: iainfou
---

# Best practices for cluster operators to manage security and upgrades in Azure Kubernetes Service (AKS)

As you develop and run applications in Azure Kubernetes Service (AKS), there are a few key areas to consider. How you manage your cluster and application deployments can negatively impact the end-user experience of services that you provide. To help you succeed, there are some best practices you can follow as you design and run AKS clusters.

This best practices article focuses on how to manage identity and authentication. You learn:

> [!div class="checklist"]
> *
> *

## Use Kured to keep hosts updated with latest security patches

## Secure container images

Trust registry
Apply security images - ACR can automatically on base image updates
Scan for issues with Aqua or Twistlock

## Secure container access

Avoid access to HOST IPC and HOST PID namespace
Avoid root / privileged access
Use App Armor or Seccomp

## Pod security context and policies

## Key Vault with FlexVol

## Next steps

This best practices article focused on how to manage identity and authentication. To implement some of these best practices, see the following articles:

*
*

<!-- EXTERNAL LINKS -->

<!-- INTERNAL LINKS -->
> [!NOTE]
> Information the user should notice even if skimming