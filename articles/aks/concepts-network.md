---
title: Concepts - Networking in Azure Kubernetes Services (AKS)
description: Learn about networking in Azure Kubernetes Service (AKS), including kubenet and Azure CNI networking, ingress controllers, load balancers, and static IP addresses.
ms.topic: conceptual
ms.date: 05/14/2024
author: schaffererin
ms.author: schaffererin
ms.custom: fasttrack-edit
---

# Networking concepts for applications in Azure Kubernetes Service (AKS)

In a container-based, microservices approach to application development, application components work together to process their tasks. Kubernetes provides various resources enabling this cooperation:

- You can connect to and expose applications internally or externally.
- You can build highly available applications by load balancing your applications.
- You can restrict the flow of network traffic into or between pods and nodes to improve security.
- You can configure Ingress traffic for SSL/TLS termination or routing of multiple components for your more complex applications.

This article introduces the core concepts that provide networking to your applications in AKS:

- [Azure virtual networks](#azure-virtual-networks)
- [Ingress controllers](#ingress-controllers)
- [Network policies](#network-policies)

## Kubernetes networking basics

Kubernetes employs a virtual networking layer to manage access within and between your applications or their components:

- **Kubernetes nodes and virtual network**: Kubernetes nodes are connected to a virtual network. This setup enables pods (basic units of deployment in Kubernetes) to have both inbound and outbound connectivity.

- **Kube-proxy component**: kube-proxy runs on each node and is responsible for providing the necessary network features.

Regarding specific Kubernetes functionalities:

- **Load balancer**: You can use a load balancer to distribute network traffic evenly across various resources.
- **Ingress controllers**: These facilitate Layer 7 routing, which is essential for directing application traffic.
- **Egress traffic control**: Kubernetes allows you to manage and control outbound traffic from cluster nodes.
- **Network policies**: These policies enable security measures and filtering for network traffic in pods.

In the context of the Azure platform:

- Azure streamlines virtual networking for AKS (Azure Kubernetes Service) clusters.
- Creating a Kubernetes load balancer on Azure simultaneously sets up the corresponding Azure load balancer resource.
- As you open network ports to pods, Azure automatically configures the necessary network security group rules.
- Azure can also manage external DNS configurations for HTTP application routing as new Ingress routes are established.

## Azure virtual networks

In AKS, you can deploy a cluster that uses one of the following network models:

* **Overlay network model**: Overlay networking is the most common networking model used in Kubernetes. Pods are given an IP address from a private, logically separate CIDR from the Azure virtual network subnet where AKS nodes are deployed. This model enables simpler, improved scalability when compared to the flat network model.
* **Flat network model**: A flat network model in AKS assigns IP addresses to pods from a subnet from the same Azure virtual network as the AKS nodes. Any traffic leaving your clusters isn't SNAT'd, and the pod IP address is directly exposed to the destination. This model can be useful for scenarios like exposing pod IP addresses to external services.


  

For more information on networking models in AKS, see [CNI Networking in AKS][network-cni-overview].

## Ingress controllers

When you create a LoadBalancer-type Service, you also create an underlying Azure load balancer resource. The load balancer is configured to distribute traffic to the pods in your Service on a given port.

The *LoadBalancer* only works at layer 4. At layer 4, the Service is unaware of the actual applications, and can't make any more routing considerations.

*Ingress controllers* work at layer 7 and can use more intelligent rules to distribute application traffic. Ingress controllers typically route HTTP traffic to different applications based on the inbound URL.

![Diagram showing Ingress traffic flow in an AKS cluster][aks-ingress]

### Compare ingress options

The following table lists the feature differences between the different ingress controller options:

| Feature | Application Routing addon | Application Gateway for Containers | Azure Service Mesh/Istio-based service mesh |
|---------|---------------------------|---------------------------------------------|-------|
| **Ingress/Gateway controller** | NGINX ingress controller | Azure Application Gateway for Containers | Istio Ingress Gateway |
| **API** | Ingress API | Ingress API and Gateway API | Gateway API |
| **Hosting** | In-cluster | Azure hosted | In-cluster |
| **Scaling** | Autoscaling | Autoscaling | Autoscaling |
| **Load balancing** | Internal/External | External | Internal/External |
| **SSL termination** | In-cluster | Yes: Offloading and E2E SSL | In-cluster |
| **mTLS** | N/A | Yes to backend | N/A |
| **Static IP Address** | N/A | FQDN | N/A |
| **Azure Key Vault stored SSL certificates** | Yes | Yes | N/A |
| **Azure DNS integration for DNS zone management** | Yes | Yes | N/A |

The following table lists the different scenarios where you might use each ingress controller:

| Ingress option | When to use |
|----------------|-------------|
| **Managed NGINX - Application Routing addon** | • In-cluster hosted, customizable, and scalable NGINX ingress controllers. </br> • Basic load balancing and routing capabilities. </br> • Internal and external load balancer configuration. </br> • Static IP address configuration. </br> • Integration with Azure Key Vault for certificate management. </br> • Integration with Azure DNS Zones for public and private DNS management. </br> • Supports the Ingress API. |
| **Application Gateway for Containers** | • Azure hosted ingress gateway. </br> • Flexible deployment strategies managed by the controller or bring your own Application Gateway for Containers. </br> • Advanced traffic management features such as automatic retries, availability zone resiliency, mutual authentication (mTLS) to backend target, traffic splitting / weighted round robin, and autoscaling. </br> • Integration with Azure Key Vault for certificate management. </br> • Integration with Azure DNS Zones for public and private DNS management. </br> • Supports the Ingress and Gateway APIs. |
| **Istio Ingress Gateway** | • Based on Envoy, when using with Istio for a service mesh. </br> • Advanced traffic management features such as rate limiting and circuit breaking. </br> • Support for mTLS </br> • Supports the Gateway API. |

### Create an Ingress resource

The application routing addon is the recommended way to configure an Ingress controller in AKS. The application routing addon is a fully managed ingress controller for Azure Kubernetes Service (AKS) that provides the following features:

- Easy configuration of managed NGINX Ingress controllers based on Kubernetes NGINX Ingress controller.

- Integration with Azure DNS for public and private zone management.

- SSL termination with certificates stored in Azure Key Vault.

For more information about the application routing addon, see [Managed NGINX ingress with the application routing add-on](app-routing.md).

### Client source IP preservation

Configure your ingress controller to preserve the client source IP on requests to containers in your AKS cluster. When your ingress controller routes a client's request to a container in your AKS cluster, the original source IP of that request is unavailable to the target container. When you enable *client source IP preservation*, the source IP for the client is available in the request header under *X-Forwarded-For*.

If you're using client source IP preservation on your ingress controller, you can't use TLS pass-through. Client source IP preservation and TLS pass-through can be used with other services, such as the *LoadBalancer* type.

To learn more about client source IP preservation, see [How client source IP preservation works for LoadBalancer Services in AKS][ip-preservation].

## Control outbound (egress) traffic

AKS clusters are deployed on a virtual network and have outbound dependencies on services outside of that virtual network. These outbound dependencies are almost entirely defined with fully qualified domain names (FQDNs). By default, AKS clusters have unrestricted outbound (egress) Internet access, which allows the nodes and services you run to access external resources as needed. If desired, you can restrict outbound traffic.

For more information, see [Control egress traffic for cluster nodes in AKS][limit-egress].

## Network security groups

A network security group filters traffic for VMs like the AKS nodes. As you create Services, such as a *LoadBalancer*, the Azure platform automatically configures any necessary network security group rules.

You don't need to manually configure network security group rules to filter traffic for pods in an AKS cluster. You can define any required ports and forwarding as part of your Kubernetes Service manifests and let the Azure platform create or update the appropriate rules.

You can also use network policies to automatically apply traffic filter rules to pods.

For more information, see [How network security groups filter network traffic][nsg-traffic].

## Network policies

By default, all pods in an AKS cluster can send and receive traffic without limitations. For improved security, define rules that control the flow of traffic, like:

- Back-end applications are only exposed to required frontend services.
- Database components are only accessible to the application tiers that connect to them.

Network policy is a Kubernetes feature available in AKS that lets you control the traffic flow between pods. You can allow or deny traffic to the pod based on settings such as assigned labels, namespace, or traffic port. While network security groups are better for AKS nodes, network policies are a more suited, cloud-native way to control the flow of traffic for pods. As pods are dynamically created in an AKS cluster, required network policies can be automatically applied.

For more information, see [Secure traffic between pods using network policies in Azure Kubernetes Service (AKS)][use-network-policies].

## Next steps

To get started with AKS networking, create and configure an AKS cluster with your own IP address ranges using [kubenet][aks-configure-kubenet-networking] or [Azure CNI][aks-configure-advanced-networking].

For associated best practices, see [Best practices for network connectivity and security in AKS][operator-best-practices-network].

For more information on core Kubernetes and AKS concepts, see the following articles:

- [Kubernetes / AKS clusters and workloads][aks-concepts-clusters-workloads]
- [Kubernetes / AKS access and identity][aks-concepts-identity]
- [Kubernetes / AKS security][aks-concepts-security]
- [Kubernetes / AKS storage][aks-concepts-storage]
- [Kubernetes / AKS scale][aks-concepts-scale]

<!-- IMAGES -->
[aks-loadbalancer]: ./media/concepts-network/aks-loadbalancer.png
[advanced-networking-diagram]: ./media/concepts-network/advanced-networking-diagram.png
[aks-ingress]: ./media/concepts-network/aks-ingress.png

<!-- LINKS - External -->
[cni-networking]: https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md

<!-- LINKS - Internal -->
[aks-configure-kubenet-networking]: configure-kubenet.md
[aks-configure-advanced-networking]: configure-azure-cni.md
[aks-concepts-clusters-workloads]: concepts-clusters-workloads.md
[aks-concepts-security]: concepts-security.md
[aks-concepts-scale]: concepts-scale.md
[aks-concepts-storage]: concepts-storage.md
[aks-concepts-identity]: concepts-identity.md
[agic-overview]: ../application-gateway/ingress-controller-overview.md
[network-cni-overview]: concepts-network-cni-overview.md
[configure-azure-cni-dynamic-ip-allocation]: configure-azure-cni-dynamic-ip-allocation.md
[use-network-policies]: use-network-policies.md
[operator-best-practices-network]: operator-best-practices-network.md
[limit-egress]: limit-egress-traffic.md
[k8s-ingress]: https://kubernetes.io/docs/concepts/services-networking/ingress/
[ip-preservation]: https://techcommunity.microsoft.com/t5/fasttrack-for-azure/how-client-source-ip-preservation-works-for-loadbalancer/ba-p/3033722#:~:text=Enable%20Client%20source%20IP%20preservation%201%20Edit%20loadbalancer,is%20the%20same%20as%20the%20source%20IP%20%28srjumpbox%29.
[nsg-traffic]: ../virtual-network/network-security-group-how-it-works.md
[azure-cni-aks]: configure-azure-cni.md
[azure-cni-overlay]: azure-cni-overlay.md
[azure-cni-overlay-limitations]: azure-cni-overlay.md#limitations-with-azure-cni-overlay
[azure-cni-powered-by-cilium]: azure-cni-powered-by-cilium.md
[azure-cni-powered-by-cilium-limitations]: azure-cni-powered-by-cilium.md#limitations
[use-byo-cni]: use-byo-cni.md

