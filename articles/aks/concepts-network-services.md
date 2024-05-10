---
title: Concepts - Services in Azure Kubernetes Services (AKS)
description: Learn about networking Services in Azure Kubernetes Service (AKS), including what services are in Kubernetes and what types of Services are available in AKS.
ms.topic: conceptual
ms.date: 04/08/2024
ms.custom: fasttrack-edit
---

# Kubernetes Services in AKS

Kubernetes Services are used to logically group pods and provide network connectivity by allowing direct access to them through a specific IP address or DNS name on a designated port. This allows you to expose your application workloads to other services within the cluster or to external clients without having to manually manage the network configuration for each pod hosting a workload.

You can specify a Kubernetes _ServiceType_ to define the type of Service you want, e.g., if you want to expose a Service on an external IP address outside of your cluster. For more information, see the Kubernetes documentation on [Publishing Services (ServiceTypes)][service-types].

The following ServiceTypes are available in AKS:

## ClusterIP
  
  ClusterIP creates an internal IP address for use within the AKS cluster. The ClusterIP Service is good for _internal-only applications_ that support other workloads within the cluster. ClusterIP is used by default if you don't explicitly specify a type for a Service.

  ![Diagram showing ClusterIP traffic flow in an AKS cluster.][aks-clusterip]

## NodePort

  NodePort creates a port mapping on the underlying node that allows the application to be accessed directly with the node IP address and port.

  ![Diagram showing NodePort traffic flow in an AKS cluster.][aks-nodeport]

## LoadBalancer

  LoadBalancer creates an Azure load balancer resource, configures an external IP address, and connects the requested pods to the load balancer backend pool. To allow customers' traffic to reach the application, load balancing rules are created on the desired ports.

  ![Diagram showing Load Balancer traffic flow in an AKS cluster.][aks-loadbalancer]

  For HTTP load balancing of inbound traffic, another option is to use an [Ingress controller][ingress-controllers].

## ExternalName

  Creates a specific DNS entry for easier application access.

Either the load balancers and services IP address can be dynamically assigned, or you can specify an existing static IP address. You can assign both internal and external static IP addresses. Existing static IP addresses are often tied to a DNS entry.

You can create both _internal_ and _external_ load balancers. Internal load balancers are only assigned a private IP address, so they can't be accessed from the Internet.

Learn more about Services in the [Kubernetes docs][k8s-service].

<!-- IMAGES -->
[aks-clusterip]: media/concepts-network/aks-clusterip.png
[aks-nodeport]: media/concepts-network/aks-nodeport.png
[aks-loadbalancer]: media/concepts-network/aks-loadbalancer.png

<!-- LINKS - External -->
[k8s-service]: https://kubernetes.io/docs/concepts/services-networking/service/
[service-types]: https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types

<!-- LINKS - Internal -->
[ingress-controllers]:concepts-network.md#ingress-controllers
