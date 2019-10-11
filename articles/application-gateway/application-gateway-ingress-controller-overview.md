---
title: What is Azure Application Gateway Ingress Controller?
description: This article provides an introduction to what Application Gateway Ingress Controller is. 
services: application-gateway
author: caya
ms.service: application-gateway
ms.topic: article
ms.date: 10/11/2019
ms.author: caya
---

# What is Application Gateway Ingress Controller?
The Application Gateway Ingress Controller (AGIC) is a Kubernetes application, which makes it possible for [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/services/kubernetes-service/) customers to leverage Azure's native [Application Gateway](https://azure.microsoft.com/services/application-gateway/) L7 load-balancer to expose cloud software to the Internet. AGIC monitors the Kubernetes cluster it is hosted on and continuously updates an App Gateway, so that selected services are exposed to the Internet.

The Ingress Controller runs in its own pod on the customer’s AKS. AGIC monitors a subset of Kubernetes Resources for changes. The state of the AKS cluster is translated to App Gateway specific configuration and applied to the [Azure Resource Manager (ARM)](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview).

![Azure Application Gateway + AKS](./media/application-gateway-ingress-controller-overview/architecture.png)

AGIC is configured via the Kubernetes [Ingress resource](http://kubernetes.io/docs/user-guide/ingress/), along with Service and Deployments/Pods. It provides a number of features, leveraging Azure’s native App Gateway L7 load balancer. To name a few:
  - URL routing
  - Cookie-based affinity
  - SSL termination
  - End-to-end SSL
  - Support for public, private, and hybrid web sites
  - Integrated web application firewall

## General

### Next Steps

- [**Greenfield Deployment**](docs/setup/install-new.md): Instructions on installing AGIC, AKS and App Gateway on
blank-slate infrastructure.
- [**Brownfield Deployment**](docs/setup/install-existing.md): Install AGIC on an existing AKS and Application Gateway.

