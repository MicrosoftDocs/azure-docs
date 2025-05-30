---
title: What is Azure Application Gateway Ingress Controller?
description: This article provides an introduction to what Application Gateway Ingress Controller is. 
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 3/31/2025
ms.author: mbender
---

# What is Application Gateway Ingress Controller?
The Application Gateway Ingress Controller (AGIC) is a Kubernetes application, which makes it possible for [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/services/kubernetes-service/) customers to leverage Azure's native [Application Gateway](https://azure.microsoft.com/services/application-gateway/) L7 load-balancer to expose cloud software to the Internet. AGIC monitors the Kubernetes cluster it's hosted on and continuously updates an Application Gateway, so that selected services are exposed to the Internet.

The Ingress Controller runs in its own pod on the customer’s AKS. AGIC monitors a subset of Kubernetes Resources for changes. The state of the AKS cluster is translated to Application Gateway specific configuration and applied to the [Azure Resource Manager (ARM)](../azure-resource-manager/management/overview.md).

> [!TIP]
> Consider [Application Gateway for Containers](for-containers/overview.md) for your Kubernetes ingress solution. For more information, see [Quickstart: Deploy Application Gateway for Containers ALB Controller](for-containers/quickstart-deploy-application-gateway-for-containers-alb-controller.md).

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

## Container networking and AGIC

Application Gateway Ingress Controller supports the following AKS network offerings:

- Kubenet
- CNI
- CNI Overlay

Azure CNI and Azure CNI Overlay are the two recommended options for Application Gateway Ingress Controller.  When choosing a networking model, consider the use cases for each CNI plugin and the type of network model it uses:

| CNI plugin | Networking model | Use case highlights |
|-------------|----------------------|-----------------------|
| **Azure CNI Overlay** | Overlay | - Best for VNET IP conservation<br/>- Max node count supported by API Server + 250 pods per node<br/>- Simpler configuration<br/> -No direct external pod IP access |
| **Azure CNI Pod Subnet** | Flat | - Direct external pod access<br/>- Modes for efficient VNet IP usage _or_ large cluster scale support(Preview) |
| **Azure CNI Node Subnet** | Flat | - Direct external pod access<br/>- Simpler configuration <br/>- Limited scale <br/>- Inefficient use of VNet IPs |

When provisioning Application Gateway for Containers into a cluster that has CNI Overlay or CNI enabled, Application Gateway for Containers automatically detects the intended network configuration. There are no changes needed in Gateway or Ingress API configuration to specify CNI Overlay or CNI.

With Azure CNI Overlay, please consider the following limitations:

* AGIC Controller: You must be running version 1.8.0 or greater to take advantage of CNI Overlay.
* Subnet Size: The Application Gateway subnet must be a maximum /24 prefix; only one deployment is supported per subnet.
* Regional VNet Peering: Application Gateway deployed in a virtual network in region A and the AKS cluster nodes in a virtual network in region A is not supported.
* Global VNet Peering: Application Gateway deployed in a virtual network in region A and the AKS cluster nodes in a virtual network in region B is not supported.
* Azure CNI Overlay with Application Gateway Ingress Controller is not supported in Azure Government cloud or Microsoft Azure operated by 21Vianet (Azure in China).

>[!Note]
>Upgrade of the AKS cluster from Kubnet or CNI to CNI Overlay is automatically detected by Application Gateway Ingress Controller. It's recommended to schedule the upgrade during a maintenance window as traffic disruption can occur. The controller may take a few minutes post-cluster upgrade to detect and configure support for CNI Overlay.

>[!WARNING]
> Ensure the Application Gateway subnet is a /24 or smaller subnet prior to upgrading. Upgrading from CNI to CNI Overlay with a larger subnet (i.e. /23) will lead to an outage and require the Application Gateway subnet to be recreated with a supported subnet size.

## Next steps
- [**AKS Add-On Greenfield Deployment**](tutorial-ingress-controller-add-on-new.md): Instructions on installing AGIC add-on, AKS, and Application Gateway on blank-slate infrastructure.
- [**AKS Add-On Brownfield Deployment**](tutorial-ingress-controller-add-on-existing.md): Install AGIC add-on on an AKS cluster with an existing Application Gateway.
- [**Helm Greenfield Deployment**](ingress-controller-install-new.md): Install AGIC through Helm, new AKS cluster, and new Application Gateway on blank-slate infrastructure.
- [**Helm Brownfield Deployment**](ingress-controller-install-existing.md): Deploy AGIC through Helm on an existing AKS cluster and Application Gateway.
