---
title: Load balance Kubernetes containers in Azure | Microsoft Docs
description: Load balance across multiple containers in a Kubernetes cluster in Azure Container Service.
services: container-service
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: acs, azure-container-service
keywords: Containers, Micro-services, Kubernetes, Azure

ms.assetid: 
ms.service: container-service
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/13/2016
ms.author: danlep

---
# Load balance containers in a Kubernetes cluster in Azure Container Service 
In this article, we'll explore how to load balance container workloads in a Kubernetes cluster in Azure Container Service. 

## Prerequisites
* [Deploy a Kubernetes cluster](container-service-kubernetes-walkthrough.md) in Azure Container Service
* [Connect your client](container-service-connect.md) to your cluster

## Azure load balancer

A Kubernetes cluster deployed in Azure Container Service includes an [Azure load balancer](../load-balancer/load-balancer-overview.md), a Layer 4 (TCP, UDP) load balancer, for the agent VMs. (A separate load balancer resource is configured for the master VMs.) 

You can dynamically configure the the load balancer for container workloads running on the agent VMs. Azure load balancer maps the public IP address and port number of incoming traffic to the private IP addresses and port numbers of the agent VMs and vice versa for the response traffic from the VMs. 

As shown in the [Kubernetes walkthrough](container-service-kubernetes-walkthrough.md), you configure the Azure load balancer by exposing a service with the `kubectl expose` command and its `--type=LoadBalancer` flag.




## Ingress controller

If you want to load-balance HTTP or HTTPS traffic to container workloads, you can configure a Kubernetes [Ingress controller](https://kubernetes.io/docs/user-guide/ingress/). An Ingress is a collection of rules that allow inbound connections to reach the cluster services.

For example you can use the [Nginx ingress controller](https://github.com/kubernetes/contrib/blob/master/ingress/controllers/nginx/README.md) to configure Ingress rules for HTTP and HTTPS traffic. For more information, see the [Nginx ingress controller](https://github.com/kubernetes/contrib/blob/master/ingress/controllers/nginx/README.md) documentation.

## Next steps


* [Kubernetes examples](https://github.com/kubernetes/kubernetes/tree/master/examples)