---
title: What is Azure Application Gateway Ingress Controller?
description: This article provides an introduction to what Application Gateway Ingress Controller is. 
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: article
ms.date: 07/28/2023
ms.author: greglin
---

# What is Application Gateway Ingress Controller?
The Application Gateway Ingress Controller (AGIC) is a Kubernetes application, which makes it possible for [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/services/kubernetes-service/) customers to leverage Azure's native [Application Gateway](https://azure.microsoft.com/services/application-gateway/) L7 load-balancer to expose cloud software to the Internet. AGIC monitors the Kubernetes cluster it's hosted on and continuously updates an Application Gateway, so that selected services are exposed to the Internet.

The Ingress Controller runs in its own pod on the customer’s AKS. AGIC monitors a subset of Kubernetes Resources for changes. The state of the AKS cluster is translated to Application Gateway specific configuration and applied to the [Azure Resource Manager (ARM)](../azure-resource-manager/management/overview.md).

> [!TIP]
> Also see [What is Application Gateway for Containers?](for-containers/overview.md) currently in public preview.

## Benefits of Application Gateway Ingress Controller
AGIC helps eliminate the need to have another load balancer/public IP address in front of the AKS cluster and avoids multiple hops in your datapath before requests reach the AKS cluster. Application Gateway talks to pods using their private IP address directly and doesn't require NodePort or KubeProxy services. This capability also brings better performance to your deployments.

Ingress Controller is supported exclusively by Standard_v2 and WAF_v2 SKUs, which also enable autoscaling benefits. Application Gateway can react in response to an increase or decrease in traffic load and scale accordingly, without consuming any resources from your AKS cluster.

Using Application Gateway in addition to AGIC also helps protect your AKS cluster by providing TLS policy and Web Application Firewall (WAF) functionality.

![Azure Application Gateway + AKS](./media/application-gateway-ingress-controller-overview/architecture.png)

AGIC is configured via the Kubernetes [Ingress resource](https://kubernetes.io/docs/concepts/services-networking/ingress/), along with Service and Deployments/Pods. It provides many features, using Azure’s native Application Gateway L7 load balancer. To name a few:
  - URL routing
  - Cookie-based affinity
  - TLS termination
  - End-to-end TLS
  - Support for public, private, and hybrid web sites
  - Integrated web application firewall

## Difference between Helm deployment and AKS Add-On
There are two ways to deploy AGIC for your AKS cluster. The first way is through Helm; the second is through AKS as an add-on. The primary benefit of deploying AGIC as an AKS add-on is that it's simpler than deploying through Helm. For a new setup, you can deploy a new Application Gateway and a new AKS cluster with AGIC enabled as an add-on in one line in Azure CLI. The add-on is also a fully managed service, which provides added benefits such as automatic updates and increased support. Both ways of deploying AGIC (Helm and AKS add-on) are fully supported by Microsoft. Additionally, the add-on allows for better integration with AKS as a first class add-on.

The AGIC add-on is still deployed as a pod in the customer's AKS cluster, however, there are a few differences between the Helm deployment version and the add-on version of AGIC. The following is a list of differences between the two versions: 
  - Helm deployment values can't be modified on the AKS add-on:
    - `verbosityLevel` is set to 5 by default
    - `usePrivateIp` is set to be false by default; this setting can be overwritten by the [use-private-ip annotation](ingress-controller-annotations.md#use-private-ip)
    - `shared` isn't supported on add-on 
    - `reconcilePeriodSeconds` isn't supported on add-on
    - `armAuth.type` isn't supported on add-on
  - AGIC deployed via Helm supports ProhibitedTargets, which means AGIC can configure the Application Gateway specifically for AKS clusters without affecting other existing backends. AGIC add-on doesn't currently support this capability. 
  - Since AGIC add-on is a managed service, customers are automatically updated to the latest version of AGIC add-on, unlike AGIC deployed through Helm where the customer must manually update AGIC. 

> [!NOTE]
> Customers can only deploy one AGIC add-on per AKS cluster, and each AGIC add-on currently can only target one Application Gateway. For deployments that require more than one AGIC per cluster or multiple AGICs targeting one Application Gateway, please continue to use AGIC deployed through Helm. 

## Next steps
- [**AKS Add-On Greenfield Deployment**](tutorial-ingress-controller-add-on-new.md): Instructions on installing AGIC add-on, AKS, and Application Gateway on blank-slate infrastructure.
- [**AKS Add-On Brownfield Deployment**](tutorial-ingress-controller-add-on-existing.md): Install AGIC add-on on an AKS cluster with an existing Application Gateway.
- [**Helm Greenfield Deployment**](ingress-controller-install-new.md): Install AGIC through Helm, new AKS cluster, and new Application Gateway on blank-slate infrastructure.
- [**Helm Brownfield Deployment**](ingress-controller-install-existing.md): Deploy AGIC through Helm on an existing AKS cluster and Application Gateway.
