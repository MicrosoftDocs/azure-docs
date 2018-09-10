---
title: Concepts - Networking in Azure Kubernetes Services (AKS)
description: Learn about networking in Azure Kubernetes Service (AKS), including basic and advanced networking, ingress controllers, load balancers, and static IP addresses.
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: conceptual
ms.date: 9/24/2018
ms.author: iainfou
---

# Network concepts for applications in Azure Kubernetes Service (AKS)

In a container-based microservices approach to application development, application components must work together to process their tasks. Kubernetes provides various resources that enable this application communication. You can connect to and expose applications internally or externally. To build highly available applications, you can load balance your applications. More complex applications may require configuration of ingress traffic for SSL/TLS termination or routing of multiple components. For security reasons, you may also need to restrict the flow of network traffic into or between pods and nodes.

This article introduces the core concepts that provide networking to your applications in AKS:

- [Services](#services)
- [Azure virtual networks](#azure-virtual-networks)
- [Ingress controllers](#ingress-controllers)
- [Network policies](#network-policies)

## Kubernetes basics

To allow access to your applications, or for application components to communicate with each other, Kubernetes provides an abstraction layer to virtual networking. Kubernetes nodes are connected to a virtual network, and can provide inbound and outbound connectivity for pods. The *kube-proxy* component runs on each node to provide these network features.

In Kubernetes, *Services* logically group pods to allow for direct access via an IP address or DNS name and on a specific port. You can also distribute traffic using a *load balancer*. More complex routing of application traffic can also be achieved with *Ingress Controllers*. Security and filtering of the network traffic for pods is possible with Kubernetes *network policies*.

The Azure platform also helps to simplify virtual networking for AKS clusters. When you create a Kubernetes load balancer, the underlying Azure load balancer resource is created and configured. As you open network ports to pods, the corresponding Azure network security group rules are configured. For HTTP application routing, Azure can also configure *external DNS* as new ingress routes are configured.

## Services

To simplify the network configuration for application workloads, Kubernetes uses *Services* to logically group a set of pods together and provide network connectivity. The following Service types are available:

- *Cluster IP* - Creates an internal IP address for use within the AKS cluster. Good for internal-only applications that support other workloads within the cluster.
- *NodePort* - Creates a port mapping on the underlying node that allows the application to be accessed directly with the node IP address and port.
- *LoadBalancer* - Creates an Azure load balancer resource, configures an external IP address, and connects the requested pods to the load balancer backend pool. To allow customers traffic to reach the application, load balancing rules are created on the desired ports.
    - For additional control and routing of the inbound traffic, you may instead use an [Ingress controller](#ingress-controllers).
- *ExternalName* - Creates a specific DNS entry for easier application access.

The IP address for load balancers and services can be dynamically assigned, or you can specify an existing static IP address to use. Both internal and external static IP addresses can be assigned. This existing static IP address is often tied to a DNS entry.

Both *internal* and *external* load balancers can be created. Internal load balancers are only assigned a private IP address, so can't be accessed from the Internet.

## Azure virtual networks

In AKS, you can deploy a cluster that uses one of the following two network models:

- *Basic* networking - The network resources are created and configured as the AKS cluster is deployed.
- *Advanced* networking - The AKS cluster is connected to existing virtual network resources and configurations.

### Basic networking

The *basic* networking option is the default configuration for AKS cluster creation. The Azure platform manages the network configuration of the cluster and pods. Basic networking is appropriate for deployments that do not require custom virtual network configuration. With basic networking, you can't define network configuration such as subnet names or the IP address ranges assigned to the AKS cluster.

Nodes in an AKS cluster configured for basic networking use the [kubenet][kubenet] Kubernetes plugin.

Basic networking provides the following features:

- Expose a Kubernetes service externally or internally through the Azure Load Balancer.
- Pods can access resources on the public Internet.

### Advanced networking

*Advanced* networking places your pods in an Azure virtual network that you configure. This virtual network provides automatic connectivity to other Azure resources and integration with a rich set of capabilities. Advanced networking is appropriate for deployments that require specific virtual network configurations, such as to use an existing subnet and connectivity. With advanced networking, you can define these subnet names and IP address ranges.

Nodes in an AKS cluster configured for advanced networking use the [Azure Container Networking Interface (CNI)][cni-networking] Kubernetes plugin.

![Diagram showing two nodes with bridges connecting each to a single Azure VNet][advanced-networking-diagram]

Advanced networking provides the following features over basic networking:

- Deploy your AKS cluster into an existing Azure virtual network, or create a new virtual network and subnet for your cluster.
- Every pod in the cluster is assigned an IP address in the virtual network. The pods can directly communicate with other pods in the cluster, and other nodes in the virtual network.
- A pod can connect to other services in a peered virtual network, including to on-premises networks over ExpressRoute and site-to-site (S2S) VPN connections. Pods are also reachable from on-premises.
- Pods in a subnet that have service endpoints enabled can securely connect to Azure services, such as Azure Storage and SQL DB.
- You can create user-defined routes (UDR) to route traffic from pods to a Network Virtual Appliance.

For more information, see [Configure advanced network for an AKS cluster][aks-configure-advanced-networking].

## Ingress controllers

When you create a LoadBalancer type Service, an underlying Azure load balancer resource is created. The load balancer is configured to distribute traffic to the pods in your Service on a given port. The LoadBalancer only works at layer 4 - the Service is unaware of the actual applications, and can't make any additional routing considerations.

*Ingress controllers* work at layer 7, and can use more intelligent rules to distribute application traffic. A common use of an Ingress controller is to route HTTP traffic to different applications based on the inbound URL.

In AKS, you can create an Ingress resource using something like NGINX, or use the AKS HTTP application routing feature. When you enable HTTP application routing for an AKS cluster, the Azure platform creates the Ingress controller and an *External-DNS* controller. As new Ingress resources are created in Kubernetes, the required DNS A records are created in a cluster-specific DNS zone. For more information, see [deploy HTTP application routing][aks-http-routing].

Another common feature of Ingress is SSL/TLS termination. On large web applications accessed via HTTPS, the TLS termination can be handled by the Ingress resource rather than within the application itself. To provide automatic TLS certification generation and configuration, you can configure the Ingress resource to use providers such as Let's Encrypt. For more information on configuring an NGINX Ingress controller with Let's Encrypt, see [Ingress and TLS][aks-ingress-tls].

Ingress controllers only currently work for external services. You can't configure an Ingress resource that uses an internal private IP address.

## Network policies

By default, pods can send and receive traffic from any source. There are no restrictions applied. To improve security, you may want to limit this traffic flow in and out of pods. A *NetworkPolicy* defines the ingress and egress network ranges and ports that are allowed. Labels are used to identify which pods the policy applies to. You can also apply a NetworkPolicy only to a given namespace.

Separate to a NetworkPolicy, Azure includes a higher-level resource called network security groups. A network security group isn't specific to AKS clusters, and filters traffic for VMs, such as the Kubernetes nodes. As you create Services, such as a LoadBalancer, the Azure platform automatically configures any network security group rules that are needed. Don't manually configure network security group rules to filter traffic for pods in an AKS cluster. Network security groups can add complexity in troubleshooting scenarios if traffic is filtered in multiple places. Instead, use the Kubernetes approach of network policies.

## Next steps

To get started with AKS networking, see [Create and configure advanced networking for an AKS cluster][aks-configure-advanced-networking].

For additional information on core Kubernetes and AKS concepts, see the following articles:

- [Kubernetes / AKS clusters and workloads][aks-concepts-clusters-workloads]
- [Kubernetes / AKS access and identity][aks-concepts-identity]
- [Kubernetes / AKS security][aks-concepts-security]
- [Kubernetes / AKS storage][aks-concepts-storage]
- [Kubernetes / AKS scale][aks-concepts-scale]

<!-- IMAGES -->
[advanced-networking-diagram]: ./media/concepts-network/advanced-networking-diagram.png

<!-- LINKS - External -->
[cni-networking]: https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md
[kubenet]: https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/#kubenet

<!-- LINKS - Internal -->
[aks-http-routing]: http-application-routing.md
[aks-ingress-tls]: ingress.md
[aks-configure-advanced-networking]: configure-advanced-networking.md
[aks-concepts-clusters-workloads]: concepts-clusters-workloads.md
[aks-concepts-security]: concepts-security.md
[aks-concepts-scale]: concepts-scale.md
[aks-concepts-storage]: concepts-storage.md
[aks-concepts-identity]: concepts-identity.md