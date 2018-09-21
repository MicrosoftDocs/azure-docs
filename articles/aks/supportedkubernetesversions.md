---
title: Supported Kubernetes versions in AKS
description: Outline of the supported kubernetes version support policy in Azure Kubernetes Service (AKS)
services: container-service
author: sauryadas

ms.service: container-service
ms.topic: supportedkubernetesversions
ms.date: 09/21/2018
ms.author: saudas
---

# Supported Kubernetes versions in Azure Kubernetes Service (AKS)

The Kubernetes community releases minor versions roughly every three months, which include net new features and/or improvements to 
existing features. Patch releases are more frequent(sometimes weekly) and are only intended for critical bug fixes in a minor version 
including security vulnerabilities, major bugs impacting a large number of customers and products running in production based on Kubernetes. 

A new Kubernetes minor version is made available in acs-engine on day one with the AKS Service Level Objective(SLO) being 30 days subject to the stability of the release.

AKS will support four minor versions of kubernetes at any time; the current minor version (n) (which is the latest version released) and three previous minor versions. Each supported minor version will also support two stable patches. For example, if AKS introduces 1.11.x today, it will support 1.11.x, 1.10.a/b, 1.9.c/d, 1.8.e/f where x,a,b,c,d,e,f are patch versions. 
When a new minor version is introduced, the oldest minor version supported will be retired. 15 days before the release of the new minor version an announcement will be made through Azure updates. In the example above, the retired versions will be 1.7.g/h.
The default AKS in the portal and the Azure CLI will always be set to the n-1 minor version and its latest patch. For example, if we support 1.11.x, 1.10.a/b,1.9.c/d,1.8.e/f then the default will be set to 1.10.b.

### FAQ

1)	What happens when a customer upgrades a kubernetes cluster with a minor version that is not supported?

If you are on the n-4 version, you are out of the SLO but if your upgrade from version n-4 to n-3 succeeds then you are back in the SLO. For example, if the supported AKS versions are 1.11.x, 1.10.a/b, 1.9.c/d, 1.8.e/f and you are on 1.7.g/h then you are out of the SLO but if the upgrade from 1.7.g/h to 1.8.e/f succeeds then you are back in the SLO. Upgrade to versions < n-4 will not be supported. In such cases, we recommend customers to create new AKS clusters and redeploy their workloads.

2)	What happens when a customer scales a kubernetes cluster with a minor version that is not supported?

For minor versions not supported by AKS, scaling in/out will continue to work without any issues. 

3)	Can a customer stay on a kubernetes version forever?

Absolutely, but if the cluster is not on one of the versions supported by AKS, the customers’ cluster is out of the AKS SLO. We will not auto upgrade your cluster or delete it.

4)	What version will the master support if the agent cluster is not in one of the supported AKS versions?

We will automatically upgrade the masters to the latest supported version. 
