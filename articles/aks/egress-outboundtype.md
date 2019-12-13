---
title: Customize egress routes in Azure Kubernetes Service (AKS)
description: Learn how to define a custom egress route in Azure Kubernetes Service (AKS)
services: container-service
author: mlearned

ms.service: container-service
ms.topic: article
ms.date: 12/12/2019
ms.author: mlearned

#Customer intent: As a cluster operator, I want to define my own egress paths with user defined routes. Since I define this up front I do not want AKS provided load balancer configurations.
---

# Customize egress routes for cluster nodes in Azure Kubernetes Service (AKS)

By default, AKS clusters provision with a Standard Load Balancer setup to provide egress connectivity to the cluster. External connectivity is required for regular cluster operations, such as pulling images for system pods or security patches. To learn more about why clusters require external connectivity and the required endpoints that clusters must be able to access, visit documentation on [controlling egress traffic for cluster nodes](limit-egress-traffic.md).

The Standard SKU Load Balancer requires a public IP address for egress connectivity due to the Standard SKU not providing egress setup by default. AKS clusters deployed with Standard Load Balancer will be assigned a public IP address and configure this egress on behalf of users. To learn more [read documentation about Standard Load Balancers on AKS](load-balancer-standard.md).

Often, a policy may disallow public IP address creation or allocation to the cluster. Due to the above requirements by Standard SKU load balancers, AKS enables alternative setup of egress to not rely on a public IP address assigned to the Standard SKU load balancer.

This article details how to deploy an AKS cluster into an existing Virtual Network with a custom user defined route tables (UDRs) setup instead to skip load balancer setups.

## Before you begin

You need to opt-in for access to canary regions for AKS. To do this register the following feature flags and refresh the corresponding providers.
```
az feature register -n ACS-EUAP --namespace Microsoft.ContainerService
az feature register -n EUAPParticipation --namespace Microsoft.Resources

az provider register -n Microsoft.ContainerService
az provider register -n Microsoft.Resources
```

While in preview, setting outboundType is only available through ARM templates or REST API calls. Azure CLI preview support is coming in the future.

## Configure outboundType on a cluster

An AKS cluster can define it's outboundType as `loadBalancer` or `UDR` on the load balancer profile defined in a managed cluster resource. This impacts only the outbound traffic of your cluster, to learn about ingress read documentation on setting up [ingress controllers](ingress-basic.md).
* If `loadBalancer` is set, a public IP address is provisioned when using Standard SKU Load Balancers and automatically assigned to the load balancer resource. Backend pools are also setup for nodes in the cluster and the load balancer is used for egress through that load balancer's assigned public IP. This is built for services of type loadBalancer in Kubernetes which expect to egress out of the cloud provider load balancer.
* If `UDR` is set, AKS will require a custom user route table to have been defined by using a UDR on the subnet the cluster is being deployed into. If this is set, it is critical to double check the UDR has valid outbound connectivity for your cluster to function. In this configuration,  AKS will not automatically provision or configure the load balancer on your behalf.

The following limitations apply.
* `outboundType` can only be defined at cluster create time and cannot be updated
* Clusters must use Azure CNI networking, this does not work with Kubenet

Below is an ARM template example of how to deploy a cluster into an existing VNet and define the outbound path as a custom user defined route.