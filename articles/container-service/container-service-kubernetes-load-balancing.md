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

You can dynamically configure the the load balancer for container workloads running on the agent VMs. Azure load balancer creates rules that map the public IP address and port number of incoming traffic to the private IP addresses and port numbers of the agent VMs and vice versa for the response traffic from the VMs. 

As shown in the [Kubernetes walkthrough](container-service-kubernetes-walkthrough.md), you configure the Azure load balancer by exposing a service with the `kubectl expose` command and its `--type=LoadBalancer` flag.

### Nginx example
The following command starts a new deployment called `mynginx` consisting of three containers based on the Docker `nginx` image.

```
kubectl run mynginx --replicas=3 --image nginx
```
To query for the running containers, type `kubectl get pods`. Output is similar to the following:

![Get Nginx containers](./media/container-service-kubernetes-load-balancing/nginx-get-pods.png)

To configure the load balancer to accept external traffic on port 80, run the following command to expose the service:

```
kubectl expose deployments mynginx --port=80 --type=LoadBalancer
```

Type `kubectl get svc` to see the state of the services in the cluster. While the load balancer configures the rule, the **EXTERNAL-IP** of the service appears as `<pending>`. After a few minutes, the external IP address is configured: 

![Configure Azure load balancer](./media/container-service-kubernetes-load-balancing/kubectl-expose.png).

You can open a web browser to the IP address shown to see the Nginx web server running in one of the containers. Or, if you prefer, run the `curl` or `wget` command.

To see the configuration of the Azure load balancer:
1. Go to the [Azure portal](https://portal.azure.com), and browse for the load balancer resource for the agent VMs in the cluster. Its name should be the same as the container service. (Don't choose the load balancer for the master nodes, the one whose name includes **master-lb**). 
2. Click **Load balancing rules**

### Guestbook example



## Ingress controller

If you want to load-balance HTTP or HTTPS traffic to container workloads, you can configure a Kubernetes [Ingress controller](https://kubernetes.io/docs/user-guide/ingress/). An Ingress is a collection of rules that allow inbound connections to reach the cluster services.

For example you can use the [Nginx ingress controller](https://github.com/kubernetes/contrib/blob/master/ingress/controllers/nginx/README.md) to configure Ingress rules for HTTP and HTTPS traffic. For more information, see the [Nginx ingress controller](https://github.com/kubernetes/contrib/blob/master/ingress/controllers/nginx/README.md) documentation.

## Next steps


* [Kubernetes examples](https://github.com/kubernetes/kubernetes/tree/master/examples)

* More about the [Azure load balancer]()