---
title: Operator best practices - Network connectivity in Azure Kubernetes Services (AKS)
description: Learn the cluster operator best practices for virtual network resources and connectivity in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: conceptual
ms.date: 11/27/2018
ms.author: iainfou
---

# Best practices for network and connectivity and security in Azure Kubernetes Service (AKS)

As you create and manage clusters in Azure Kubernetes Service (AKS), you need to provide network connectivity for your nodes and application traffic. These network resources include IP address ranges, load balancers, and ingress controllers. To maintain a high quality of service for your applications, these resources need to be appropriately configured. Before you start running workloads in AKS, plan and choose the appropriate network deployment model, address ranges, and traffic routing methods.

This best practices article focuses on network connectivity and security for cluster operators. In this article, you learn how to:

> [!div class="checklist"]
> * Compare the basic and advanced network modes in AKS
> * Plan for required IP addressing and connectivity
> * Distribute traffic using load balancers, ingress controllers, or a web application firewalls (WAF)
> * Securely connect to cluster nodes

## Choose the appropriate network model

### Basic networking with Kubenet

## Distribute application traffic using ingress resources and controllers

## Secure traffic to your applications with a web application firewall (WAF)

## Securely connect to your nodes through a bastion host

## Next steps

This article focused on network connectivity and security. For more information about network basics in Kubernetes, see [Network concepts for applications in Azure Kubernetes Service (AKS)][aks-concepts-network]

<!-- EXTERNAL LINKS -->

<!-- INTERNAL LINKS -->
[aks-concepts-network]: concepts-network.md
