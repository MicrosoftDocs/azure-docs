---
title: Frequently asked questions for Azure Container Service
description: Provides answers to some of the common questions about Azure Container Service.
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 2/01/2018
ms.author: nepeters
---

# Frequently asked questions about Azure Container Service (AKS)

This article addresses frequent questions about Azure Container Service (AKS).

## Which Azure regions will have Azure Container Service (AKS)? 

- Canada Central 
- Canada East 
- Central US 
- East US 
- South East Asia 
- West Europe 
- West US 2 

## When will additional regions be added? 

Additional regions are added as demand increases.

## Are security updates applied to AKS nodes? 

OS security patches are applied to the nodes in your cluster on a nightly schedule, however a reboot is not performed. If needed, nodes may be rebooted through the portal or the Azure CLI. When upgrading a cluster, the latest Ubuntu image is used and all security patches are applied (with a reboot).

## Do you recommend customers use ACS or AKSs? 

Given that Azure Container Service (AKS) will GA at a later date, we recommend that you build PoC’s, dev and test clusters in AKS but production clusters in ACS-Kubernetes.  

## When will ACS be deprecated? 

ACS will be deprecated around the time AKS becomes GA. You will have 12 months after that date to migrate clusters to AKS. During the 12-month period, you can run all ACS operations.

## Does AKS support node autoscaling? 

Node autoscaling is not supported but is on the roadmap. You might want to take a look at this open-sourced [autoscaling implementation][auto-scaler].

## Why are two resource groups created with AKS? 

Each Azure Container Service (AKS) cluster is contained in two resource groups. The first is created by you and contains only the AKS resource. The second resource group is auto created during deployment and contains all cluster infrastructural resources such as VMs, networking, and storage resources. This resource group is created for easy resource cleanup. 

The auto-created resource group has a name similar to:

```
MC_myResourceGRoup_myAKSCluster_eastus
```

When adding Azure resources to be used with the Kubernetes cluster such as storage accounts or reserved public IP address, these resources need to be created in the auto created resource group.   

## Is Azure Key Vault integrated with AKS? 

No, it is not but this integration is planned. In the meantime, you can try out the following solution from [Hexadite][hexadite]. 

<!-- LINKS - external -->
[auto-scaler]: https://github.com/kubernetes/autoscaler
[hexadite]: https://github.com/Hexadite/acs-keyvault-agent  