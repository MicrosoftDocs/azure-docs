---
title: What is Azure Application Gateway Ingress Controller?
description: This article provides an introduction to what Application Gateway Ingress Controller is. 
services: application-gateway
author: caya
ms.service: application-gateway
ms.topic: article
ms.date: 06/10/2020
ms.author: caya
---

# What is Application Gateway Ingress Controller?
The Application Gateway Ingress Controller (AGIC) is a Kubernetes application, which makes it possible for [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/services/kubernetes-service/) customers to leverage Azure's native [Application Gateway](https://azure.microsoft.com/services/application-gateway/) L7 load-balancer to expose cloud software to the Internet. AGIC monitors the Kubernetes cluster it is hosted on and continuously updates an Application Gateway, so that selected services are exposed to the Internet.

The Ingress Controller runs in its own pod on the customer’s AKS. AGIC monitors a subset of Kubernetes Resources for changes. The state of the AKS cluster is translated to Application Gateway specific configuration and applied to the [Azure Resource Manager (ARM)](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview).

## Benefits of Application Gateway Ingress Controller
AGIC helps eliminate the need to have another load balancer/public IP in front of the AKS cluster and avoids multiple hops in your datapath before requests reach the AKS cluster. Application Gateway talks to pods using their private IP directly and does not require NodePort or KubeProxy services. This also brings better performance to your deployments.

Ingress Controller is supported exclusively by Standard_v2 and WAF_v2 SKUs, which also brings you autoscaling benefits. Application Gateway can react in response to an increase or decrease in traffic load and scale accordingly, without consuming any resources from your AKS cluster.

Using Application Gateway in addition to AGIC also helps protect your AKS cluster by providing TLS policy and Web Application Firewall (WAF) functionality.

![Azure Application Gateway + AKS](./media/application-gateway-ingress-controller-overview/architecture.png)

AGIC is configured via the Kubernetes [Ingress resource](https://kubernetes.io/docs/user-guide/ingress/), along with Service and Deployments/Pods. It provides a number of features, leveraging Azure’s native Application Gateway L7 load balancer. To name a few:
  - URL routing
  - Cookie-based affinity
  - TLS termination
  - End-to-end TLS
  - Support for public, private, and hybrid web sites
  - Integrated web application firewall

## Difference between Helm deployment and AKS Add-On
There are two ways to deploy AGIC for your AKS cluster. The first way is through Helm; the second is through AKS as an add-on. The primary benefit of deploying AGIC as an AKS add-on is that it's much simpler than deploying through Helm. For a new setup, you can deploy a new Application Gateway and a new AKS cluster with AGIC enabled as an add-on in one line in Azure CLI. The add-on is also a fully managed service, which provides added benefits such as automatic updates and increased support. AGIC deployed through Helm is not supported by AKS, however, the AGIC deployed as an AKS add-on is supported by AKS. 

The AGIC add-on is still deployed as a pod in the customer's AKS cluster, however, there are a few differences between the Helm deployment version and the add-on version of AGIC. Below is a list of differences between the two versions: 
  - Helm deployment values cannot be modified on the AKS add-on:
    - `verbosityLevel` will be set to 5 by default
    - `usePrivateIp` will be set to be false by default; this can be overwritten by the [use-private-ip annotation](ingress-controller-annotations.md#use-private-ip)
    - `shared` is not supported on add-on 
    - `reconcilePeriodSeconds` is not supported on add-on
    - `armAuth.type` is not supported on add-on
  - AGIC deployed via Helm supports ProhibitedTargets, which means AGIC can configure the Application Gateway specifically for AKS clusters without affecting other existing backends. AGIC add-on doesn't currently support this. 
  - Since AGIC add-on is a managed service, customers will automatically be updated to the latest version of AGIC add-on, unlike AGIC deployed through Helm where the customer must manually update AGIC. 

> [!NOTE]
> The AGIC AKS add-on method of deployment is currently in preview. We don't recommend running production workloads on features still in preview, so if you're curious to try it out, we'd recommend setting up a new cluster to test it out with. 

The following tables sort which scenarios are currently supported with the Helm deployment version and the AKS add-on version of AGIC. 

### AKS add-on AGIC (single AKS cluster)
|                  |1 Application Gateway |2+ Application Gateways |
|------------------|---------|--------|
|**1 AGIC**|Yes, this is supported |No, this is in our backlog |
|**2+ AGICs**|No, only 1 AGIC supported/cluster |No, only 1 AGIC supported/cluster |

### Helm deployed AGIC (single AKS cluster)
|                  |1 Application Gateway |2+ Application Gateways |
|------------------|---------|--------|
|**1 AGIC**|Yes, this is supported |No, this is in our backlog |
|**2+ AGICs**|Must use shared ProhibitedTarget functionality and watch separate namespaces |Yes, this is supported |

### Helm deployed AGIC (2+ AKS clusters)
|                  |1 Application Gateway |2+ Application Gateways |
|------------------|---------|--------|
|**1 AGIC**|N/A |N/A |
|**2+ AGICs**|Must use shared ProhibitedTarget functionality |N/A |

## Next steps
- [**AKS Add-On Greenfield Deployment**](tutorial-ingress-controller-add-on-new.md): Instructions on installing AGIC add-on, AKS, and Application Gateway on blank-slate infrastructure.
- [**AKS Add-On Brownfield Deployment**](tutorial-ingress-controller-add-on-existing.md): Install AGIC add-on on an AKS cluster with an existing Application Gateway.
- [**Helm Greenfield Deployment**](ingress-controller-install-new.md): Install AGIC through Helm, new AKS cluster, and new Application Gateway on blank-slate infrastructure.
- [**Helm Brownfield Deployment**](ingress-controller-install-existing.md): Deploy AGIC through Helm on an existing AKS cluster and Application Gateway.

