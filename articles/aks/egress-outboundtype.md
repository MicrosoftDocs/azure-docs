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

By default, AKS clusters will be provisioned with a Standard Load Balancer setup to provide egress connectivity to the cluster. This connectivity is required for cluster health, such as pulling images for system pods held or security patches. To learn more about the required endpoints that clusters must be able to access read about [controlling egress traffic for cluster nodes](limit-egress-traffic.md). 

The Standard Load Balancer SKU requires a public IP address to be assigned for egress connectivity and as a result, AKS clusters deployed with Standard Load Balancer will also be assigned a public IP address. To learn more [read documentation about Standard Load Balancers on AKS](load-balancer-standard.md).

However, a corporate policy may disallow public IP address creation or allocation to the cluster. An alternative cluster setup can be defined to skip public IP address assignment by AKS. This can be achieved by deploying an AKS cluster into an existing Virtual Network with a custom user defined route tables (UDRs) setup.

This article details how to configure custom egress to bypass public IP provisioning for Standard SKU load balancers.

## Before you begin

You need the Azure CLI version 2.0.78 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Configure outboundType on a cluster

An AKS cluster can define it's outboundType as `loadBalancer` or `UDR`. This impacts only the outbound traffic for your cluster.
* If `loadBalancer` is set, a public IP address is provisioned when using Standard SKU Load Balancers and automatically assigned to the load balancer resource. Backend pools are also setup for nodes in the cluster and the load balancer is used for egress through that load balancer's assigned public IP. This is built for services of type loadBalancer in Kubernetes which expect to egress out of the cloud provider load balancer.
* If `UDR` is set, AKS will require a custom user route table to have been defined by using a UDR on the subnet the cluster is being deployed into. If this is set, it is critical to double check the UDR has valid outbound connectivity for your cluster to function. In this configuration,  AKS will not automatically provision or configure the load balancer on your behalf.

The following limitations apply.
* `outboundType` can only be defined at cluster create time and cannot be updated
* Clusters must use Azure CNI networking, this does not work with Kubenet

Below is an ARM template example of how to deploy this cluster.