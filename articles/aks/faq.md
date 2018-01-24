---
title: Frequently asked questions for Azure Container Service
description: Provides answers to some of the common questions about Azure Container Service.
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 1/24/2018
ms.author: nepeters
---

# Frequently asked question about Azure Container Service

## Which regions will AKS be available at GA? 

- Canada Central 
- Canada East 
- Central US 
- East US 
- South East Asia 
- West Europe 
- West US 2 

## When will additional regions be added? 

Additional regions will be added as demand increases.

## Are security updates applied to AKS nodes? 

OS security patches are applied to the nodes in your cluster on a nightly schedule, however a reboot is not performed. If needed, nodes may be rebooted through the portal or the AZ CLI. When upgrading a cluster the latest Ubuntu image is used and all security patches are applied (with a reboot).

## When will AKS be supported on Azure Stack?  

We are currently working to bring Kubernetes to Azure Stack via acs-engine, followed later by AKS. 

## Will the AKS team provide support for migration of clusters from ACS-AKS? 

We are currently evaluating Heptio-ARK as a migration tool from ACS -> AKS. There are dependencies with ARK including clusters > k8s 1.7, managed disks, and completeness of stateful workload migration. The goal is to go through a couple of hackfests with top ACS customers and document the learning for all customers to use. 

## Do you recommend customers to use ACS while AKS GA’s? 

Given that AKS will GA at a later date, we recommend that you build PoC’s, dev and test clusters in AKS but production clusters in ACS-Kubernetes.  

## When will ACS be deprecated and what about ACS support after that? 

ACS will be deprecated around the time AKS becomes GA. Customers will have 12 months after that date to migrate clusters to AKS. During the 12-month period, customers will be able to run all ACS operations.

## Does AKS support node auto scaling? 

In cluster, node auto scaling is not supported but is on the roadmap. You might want to take a look at this open sourced [autoscaling implementation][auto-scaler].

## How does AKS compare to EKS, GKE in terms of feature set and functionality? 

Kubernetes is merely commodity infrastructure on which containers can be run and orchestrated. There is practically no difference between open source kubernetes clusters deployed on any public cloud platform. Azure Container Service (AKS) has differentiated itself from AWS and GKE with thought leadership and innovation with a bunch of Cloud Native services and tools such as, Azure Container Instance (ACI), Virtual Kubelet, Azure Service Broker, Helm, Draft, Brigade, and Kashti. GKE has none of these available today. 

## Why do we have 2 resource groups created in AKS? 

The second resource group is auto-created for easy deletion of all resources associated with an AKS deployment. It could also be used in case we wanted to hide the resources created as a part of the AKS deployment. 

We are looking to change this behavior POST GA. 

## Is Azure Key Vault integrated with AKS? 

No, it is not but it is in the roadmap. In the meantime, you can try out the following solution from [Hexadite][hexadite]. 

## How does AAD and Kubernetes RBAC work on AKS? 
 
AAD and Kubernetes RBAC is scheduled to be included in the AKS around the GA release time.

<!-- LINKS - external -->
[auto-scaler]: https://github.com/kubernetes/autoscaler
[hexadite]: https://github.com/Hexadite/acs-keyvault-agent  