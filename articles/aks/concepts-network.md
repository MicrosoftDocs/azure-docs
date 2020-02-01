---
title: Concepts - Networking in Azure Kubernetes Services (AKS)
description: Learn about networking in Azure Kubernetes Service (AKS), including kubenet and Azure CNI networking, ingress controllers, load balancers, and static IP addresses.
services: container-service
author: mlearned 

ms.service: container-service
ms.topic: conceptual
ms.date: 02/28/2019
ms.author: mlearned
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

- **Cluster IP** - Creates an internal IP address for use within the AKS cluster. Good for internal-only applications that support other workloads within the cluster.

    ![Diagram showing Cluster IP traffic flow in an AKS cluster][aks-clusterip]

- **NodePort** - Creates a port mapping on the underlying node that allows the application to be accessed directly with the node IP address and port.

    ![Diagram showing NodePort traffic flow in an AKS cluster][aks-nodeport]

- **LoadBalancer** - Creates an Azure load balancer resource, configures an external IP address, and connects the requested pods to the load balancer backend pool. To allow customers' traffic to reach the application, load balancing rules are created on the desired ports. 

    ![Diagram showing Load Balancer traffic flow in an AKS cluster][aks-loadbalancer]

    For additional control and routing of the inbound traffic, you may instead use an [Ingress controller](#ingress-controllers).

- **ExternalName** - Creates a specific DNS entry for easier application access.

The IP address for load balancers and services can be dynamically assigned, or you can specify an existing static IP address to use. Both internal and external static IP addresses can be assigned. This existing static IP address is often tied to a DNS entry.

Both *internal* and *external* load balancers can be created. Internal load balancers are only assigned a private IP address, so they can't be accessed from the Internet.

## Azure virtual networks

In AKS, you can deploy a cluster that uses one of the following two network models:

- *Kubenet* networking - The network resources are typically created and configured as the AKS cluster is deployed.
- *Azure Container Networking Interface (CNI)* networking - The AKS cluster is connected to existing virtual network resources and configurations.

### Kubenet (basic) networking

The *kubenet* networking option is the default configuration for AKS cluster creation. With *kubenet*, nodes get an IP address from the Azure virtual network subnet. Pods receive an IP address from a logically different address space to the Azure virtual network subnet of the nodes. Network address translation (NAT) is then configured so that the pods can reach resources on the Azure virtual network. The source IP address of the traffic is NAT'd to the node's primary IP address.

Nodes use the [kubenet][kubenet] Kubernetes plugin. You can let the Azure platform create and configure the virtual networks for you, or choose to deploy your AKS cluster into an existing virtual network subnet. Again, only the nodes receive a routable IP address, and the pods use NAT to communicate with other resources outside the AKS cluster. This approach greatly reduces the number of IP addresses that you need to reserve in your network space for pods to use.

For more information, see [Configure kubenet networking for an AKS cluster][aks-configure-kubenet-networking].

### Azure CNI (advanced) networking

With Azure CNI, every pod gets an IP address from the subnet and can be accessed directly. These IP addresses must be unique across your network space, and must be planned in advance. Each node has a configuration parameter for the maximum number of pods that it supports. The equivalent number of IP addresses per node are then reserved up front for that node. This approach requires more planning, as can otherwise lead to IP address exhaustion or the need to rebuild clusters in a larger subnet as your application demands grow.

Nodes use the [Azure Container Networking Interface (CNI)][cni-networking] Kubernetes plugin.

![Diagram showing two nodes with bridges connecting each to a single Azure VNet][advanced-networking-diagram]

For more information, see [Configure Azure CNI for an AKS cluster][aks-configure-advanced-networking].

### Compare network models

Both kubenet and Azure CNI provide network connectivity for your AKS clusters. However, there are advantages and disadvantages to each. At a high level, the following considerations apply:

* **kubenet**
    * Conserves IP address space.
    * Uses Kubernetes internal or external load balancer to reach pods from outside of the cluster.
    * You must manually manage and maintain user-defined routes (UDRs).
    * Maximum of 400 nodes per cluster.
* **Azure CNI**
    * Pods get full virtual network connectivity and can be directly reached via their private IP address from connected networks.
    * Requires more IP address space.

The following behavior differences exist between kubenet and Azure CNI:

| Capability                                                                                   | Kubenet   | Azure CNI |
|----------------------------------------------------------------------------------------------|-----------|-----------|
| Deploy cluster in existing or new virtual network                                            | Supported - UDRs manually applied | Supported |
| Pod-pod connectivity                                                                         | Supported | Supported |
| Pod-VM connectivity; VM in the same virtual network                                          | Works when initiated by pod | Works both ways |
| Pod-VM connectivity; VM in peered virtual network                                            | Works when initiated by pod | Works both ways |
| On-premises access using VPN or Express Route                                                | Works when initiated by pod | Works both ways |
| Access to resources secured by service endpoints                                             | Supported | Supported |
| Expose Kubernetes services using a load balancer service, App Gateway, or ingress controller | Supported | Supported |
| Default Azure DNS and Private Zones                                                          | Supported | Supported |

### Support scope between network models

Regardless of the network model you use, both kubenet and Azure CNI can be deployed in one of the following ways:

* The Azure platform can automatically create and configure the virtual network resources when you create an AKS cluster.
* You can manually create and configure the virtual network resources and attach to those resources when you create your AKS cluster.

Although capabilities like service endpoints or UDRs are supported with both kubenet and Azure CNI, the [support policies for AKS][support-policies] define what changes you can make. For example:

* If you manually create the virtual network resources for an AKS cluster, you are supported when configuring your own UDRs or service endpoints.
* If the Azure platform automatically creates the virtual network resources for your AKS cluster, it is not supported to manually change those AKS-managed resources to configure your own UDRs or service endpoints.

## Ingress controllers

When you create a LoadBalancer type Service, an underlying Azure load balancer resource is created. The load balancer is configured to distribute traffic to the pods in your Service on a given port. The LoadBalancer only works at layer 4 - the Service is unaware of the actual applications, and can't make any additional routing considerations.

*Ingress controllers* work at layer 7, and can use more intelligent rules to distribute application traffic. A common use of an Ingress controller is to route HTTP traffic to different applications based on the inbound URL.

![Diagram showing Ingress traffic flow in an AKS cluster][aks-ingress]

In AKS, you can create an Ingress resource using something like NGINX, or use the AKS HTTP application routing feature. When you enable HTTP application routing for an AKS cluster, the Azure platform creates the Ingress controller and an *External-DNS* controller. As new Ingress resources are created in Kubernetes, the required DNS A records are created in a cluster-specific DNS zone. For more information, see [deploy HTTP application routing][aks-http-routing].

Another common feature of Ingress is SSL/TLS termination. On large web applications accessed via HTTPS, the TLS termination can be handled by the Ingress resource rather than within the application itself. To provide automatic TLS certification generation and configuration, you can configure the Ingress resource to use providers such as Let's Encrypt. For more information on configuring an NGINX Ingress controller with Let's Encrypt, see [Ingress and TLS][aks-ingress-tls].

You can also configure your ingress controller to preserve the client source IP on requests to containers in your AKS cluster. When a client's request is routed to a container in your AKS cluster via your ingress controller, the original source IP of that request will not be available to the target container. When you enable *client source IP preservation*, the source IP for the client is available in the request header under *X-Forwarded-For*. If you are using client source IP preservation on your ingress controller, you cannot use SSL pass-through. Client source IP preservation and SSL pass-through can be used with other services, such as the *LoadBalancer* type.

## Network security groups

A network security group filters traffic for VMs, such as the AKS nodes. As you create Services, such as a LoadBalancer, the Azure platform automatically configures any network security group rules that are needed. Don't manually configure network security group rules to filter traffic for pods in an AKS cluster. Define any required ports and forwarding as part of your Kubernetes Service manifests, and let the Azure platform create or update the appropriate rules. You can also use network policies, as discussed in the next section, to automatically apply traffic filter rules to pods.

## Network policies

By default, all pods in an AKS cluster can send and receive traffic without limitations. For improved security, you may want to define rules that control the flow of traffic. Backend applications are often only exposed to required frontend services, or database components are only accessible to the application tiers that connect to them.

Network policy is a Kubernetes feature available in AKS that lets you control the traffic flow between pods. You can choose to allow or deny traffic based on settings such as assigned labels, namespace, or traffic port. Network security groups are more for the AKS nodes, not pods. The use of network policies is a more suitable, cloud-native way to control the flow of traffic. As pods are dynamically created in an AKS cluster, the required network policies can be automatically applied.

For more information, see [Secure traffic between pods using network policies in Azure Kubernetes Service (AKS)][use-network-policies].

## Next steps

To get started with AKS networking, create and configure an AKS cluster with your own IP address ranges using [kubenet][aks-configure-kubenet-networking] or [Azure CNI][aks-configure-advanced-networking].

For associated best practices, see [Best practices for network connectivity and security in AKS][operator-best-practices-network].

For additional information on core Kubernetes and AKS concepts, see the following articles:

- [Kubernetes / AKS clusters and workloads][aks-concepts-clusters-workloads]
- [Kubernetes / AKS access and identity][aks-concepts-identity]
- [Kubernetes / AKS security][aks-concepts-security]
- [Kubernetes / AKS storage][aks-concepts-storage]
- [Kubernetes / AKS scale][aks-concepts-scale]

<!-- IMAGES -->
[aks-clusterip]: ./media/concepts-network/aks-clusterip.png
[aks-nodeport]: ./media/concepts-network/aks-nodeport.png
[aks-loadbalancer]: ./media/concepts-network/aks-loadbalancer.png
[advanced-networking-diagram]: ./media/concepts-network/advanced-networking-diagram.png
[aks-ingress]: ./media/concepts-network/aks-ingress.png

<!-- LINKS - External -->
[cni-networking]: https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md
[kubenet]: https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/#kubenet

<!-- LINKS - Internal -->
[aks-http-routing]: http-application-routing.md
[aks-ingress-tls]: ingress.md
[aks-configure-kubenet-networking]: configure-kubenet.md
[aks-configure-advanced-networking]: configure-azure-cni.md
[aks-concepts-clusters-workloads]: concepts-clusters-workloads.md
[aks-concepts-security]: concepts-security.md
[aks-concepts-scale]: concepts-scale.md
[aks-concepts-storage]: concepts-storage.md
[aks-concepts-identity]: concepts-identity.md
[use-network-policies]: use-network-policies.md
[operator-best-practices-network]: operator-best-practices-network.md
[support-policies]: support-policies.md
