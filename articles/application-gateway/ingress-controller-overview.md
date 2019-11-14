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
The Application Gateway Ingress Controller (AGIC) is a Kubernetes application, which makes it possible for [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/services/kubernetes-service/) customers to leverage Azure's native [Application Gateway](https://azure.microsoft.com/services/application-gateway/) L7 load-balancer to expose cloud software to the Internet. AGIC monitors the Kubernetes cluster it is hosted on and continuously updates an Application Gateway, so that selected services are exposed to the Internet.

The Ingress Controller runs in its own pod on the customer’s AKS. AGIC monitors a subset of Kubernetes Resources for changes. The state of the AKS cluster is translated to Application Gateway specific configuration and applied to the [Azure Resource Manager (ARM)](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview).

## Benefits of Application Gateway Ingress Controller
AGIC allows your deployment to control multiple AKS clusters with a single Application Gateway Ingress Controller. AGIC also helps eliminate the need to have another load balancer/public IP in front of AKS cluster and avoids multiple hops in your datapath before requests reach the AKS cluster. Application Gateway talks to pods using their private IP directly and does not require NodePort or KubeProxy services. This also brings better performance to your deployments.

Ingress Controller is supported exclusively by Standard_v2 and WAF_v2 SKUs, which also brings you autoscaling benefits. Application Gateway can react in response to an increase or decrease in traffic load and scale accordingly, without consuming any resources from your AKS cluster.

Using Application Gateway in addition to AGIC also helps protect your AKS cluster by providing TLS policy and Web Application Firewall (WAF) functionality.

![Azure Application Gateway + AKS](./media/application-gateway-ingress-controller-overview/architecture.png)

AGIC is configured via the Kubernetes [Ingress resource](http://kubernetes.io/docs/user-guide/ingress/), along with Service and Deployments/Pods. It provides a number of features, leveraging Azure’s native Application Gateway L7 load balancer. To name a few:
  - URL routing
  - Cookie-based affinity
  - SSL termination
  - End-to-end SSL
  - Support for public, private, and hybrid web sites
  - Integrated web application firewall

AGIC is able to handle multiple namespaces and has ProhibitedTargets, which means AGIC can configure the Application Gateway specifically for AKS clusters without affecting other existing backends. 

## Next Steps

- [**Greenfield Deployment**](ingress-controller-install-new.md): Instructions on installing AGIC, AKS, and Application Gateway on
blank-slate infrastructure.
- [**Brownfield Deployment**](ingress-controller-install-existing.md): Install AGIC on an existing AKS and Application Gateway.

