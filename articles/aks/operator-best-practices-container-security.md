---
title: Operator best practices - Container security in Azure Kubernetes Services (AKS)
description: Learn the cluster operator best practices for how to secure containers in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: conceptual
ms.date: 10/29/2018
ms.author: iainfou
---

# Best practices for container security in Azure Kubernetes Service (AKS)

As you develop and run applications in Azure Kubernetes Service (AKS), there are a few key areas to consider. How you manage your cluster and application deployments can negatively impact the end-user experience of services that you provide. To help you succeed, there are some best practices you can follow as you design and run AKS clusters.

This best practices article focuses on how to secure your containers in AKS. You learn how to:

> [!div class="checklist"]
> *
> *

## Secure the images and run time

Trusted registry
Apply security images - ACR can automatically on base image updates
Scan for issues with Aqua or Twistlock

## Secure container access

Avoid access to HOST IPC and HOST PID namespace
Avoid root / privileged access

### Use App Armor

### Use Seccomp

## Next steps

This best practices article focused on how to manage identity and authentication. To implement some of these best practices, see the following articles:

*
*

<!-- EXTERNAL LINKS -->

<!-- INTERNAL LINKS -->
> [!NOTE]
> Information the user should notice even if skimming