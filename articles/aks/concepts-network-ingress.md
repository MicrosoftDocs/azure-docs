---
title: Concepts - Ingress Networking in Azure Kubernetes Service (AKS)
description: Learn about ingress networking in Azure Kubernetes Service (AKS) including ingress controllers 
ms.topic: conceptual
ms.date: 06/03/2024
author: schaffererin
ms.author: schaffererin
---
# Ingress in Azure Kubernetes Service (AKS)

Ingress in AKS is a Kubernetes resource that manages external HTTP-like traffic access to [services][services] within a cluster. An AKS ingress may provide services like load balancing, SSL termination, and name-based virtual hosting. For more information about Kubernetes Ingress, see the [Kubernetes Ingress documentation][k8s-ingress].

## Ingress controllers

When managing application traffic, Ingress controllers provide advanced capabilities by operating at layer 7. They can route HTTP traffic to different applications based on the inbound URL, allowing for more intelligent and flexible traffic distribution rules. For example, an ingress controller can direct traffic to different microservices depending on the URL path, enhancing the efficiency and organization of your services.

On the other hand, a LoadBalancer-type Service, when created, sets up an underlying Azure load balancer resource. This load balancer works at layer 4, distributing traffic to the pods in your Service on a specified port. However, layer 4 services are unaware of the actual applications and can't implement these types of complex routing rules.

Understanding the distinction between these two approaches helps in selecting the right tool for your traffic management needs.

![Diagram showing Ingress traffic flow in an AKS cluster][aks-ingress]

## Compare ingress options

The following table lists the feature differences between the different ingress controller options:

| Feature                                           | Application Routing addon | Application Gateway for Containers       | Azure Service Mesh/Istio-based service mesh |
|---------------------------------------------------|---------------------------|------------------------------------------|---------------------------------------------|
| **Ingress/Gateway controller**                    | NGINX ingress controller  | Azure Application Gateway for Containers | Istio Ingress Gateway                       |
| **API**                                           | Ingress API               | Ingress API and Gateway API              | Gateway API                                 |
| **Hosting**                                       | In-cluster                | Azure hosted                             | In-cluster                                  |
| **Scaling**                                       | Autoscaling               | Autoscaling                              | Autoscaling                                 |
| **Load balancing**                                | Internal/External         | External                                 | Internal/External                           |
| **SSL termination**                               | In-cluster                | Yes: Offloading and E2E SSL              | In-cluster                                  |
| **mTLS**                                          | N/A                       | Yes to backend                           | N/A                                         |
| **Static IP Address**                             | N/A                       | FQDN                                     | N/A                                         |
| **Azure Key Vault stored SSL certificates**       | Yes                       | Yes                                      | N/A                                         |
| **Azure DNS integration for DNS zone management** | Yes                       | Yes                                      | N/A                                         |

The following table lists the different scenarios where you might use each ingress controller:

| Ingress option | When to use |
|----------------|-------------|
| **Managed NGINX - Application Routing addon** | • In-cluster hosted, customizable, and scalable NGINX ingress controllers. </br> • Basic load balancing and routing capabilities. </br> • Internal and external load balancer configuration. </br> • Static IP address configuration. </br> • Integration with Azure Key Vault for certificate management. </br> • Integration with Azure DNS Zones for public and private DNS management. </br> • Supports the Ingress API. |
| **Application Gateway for Containers** | • Azure hosted ingress gateway. </br> • Flexible deployment strategies managed by the controller or bring your own Application Gateway for Containers. </br> • Advanced traffic management features such as automatic retries, availability zone resiliency, mutual authentication (mTLS) to backend target, traffic splitting / weighted round robin, and autoscaling. </br> • Integration with Azure Key Vault for certificate management. </br> • Integration with Azure DNS Zones for public and private DNS management. </br> • Supports the Ingress and Gateway APIs. |
| **Istio Ingress Gateway** | • Based on Envoy, when using with Istio for a service mesh. </br> • Advanced traffic management features such as rate limiting and circuit breaking. </br> • Support for mTLS </br> • Supports the Gateway API. |

## Create an Ingress resource

The application routing addon is the recommended way to configure an Ingress controller in AKS. The application routing addon is a fully managed ingress controller for Azure Kubernetes Service (AKS) that provides the following features:

- Easy configuration of managed NGINX Ingress controllers based on Kubernetes NGINX Ingress controller.

- Integration with Azure DNS for public and private zone management.

- SSL termination with certificates stored in Azure Key Vault.

For more information about the application routing addon, see [Managed NGINX ingress with the application routing add-on](app-routing.md).

## Client source IP preservation

Configure your ingress controller to preserve the client source IP on requests to containers in your AKS cluster. When your ingress controller routes a client's request to a container in your AKS cluster, the original source IP of that request is unavailable to the target container. When you enable _client source IP preservation_, the source IP for the client is available in the request header under _X-Forwarded-For_.

If you're using client source IP preservation on your ingress controller, you can't use TLS pass-through. Client source IP preservation and TLS pass-through can be used with other services, such as the _LoadBalancer_ type.

To learn more about client source IP preservation, see [How client source IP preservation works for LoadBalancer Services in AKS][ip-preservation].

<!-- IMAGES -->
[aks-ingress]: ./media/concepts-network/aks-ingress.png

<!-- LINKS - External -->
[k8s-ingress]: https://kubernetes.io/docs/concepts/services-networking/ingress/

<!-- LINKS - Internal -->
[ip-preservation]: https://techcommunity.microsoft.com/t5/fasttrack-for-azure/how-client-source-ip-preservation-works-for-loadbalancer/ba-p/3033722#:~:text=Enable%20Client%20source%20IP%20preservation%201%20Edit%20loadbalancer,is%20the%20same%20as%20the%20source%20IP%20%28srjumpbox%29.
[services]: concepts-network-services.md