---
title: Use API Management with Microservices Deployed in AKS | Microsoft Docs
description: Learn about options for using Azure API Management to publish microservices-based architectures that are deployed in AKS as APIs.
services: api-management
author: dlepow
manager: cfowler
 
ms.service: azure-api-management
ms.topic: concept-article
ms.date: 05/15/2025
ms.author: danlep

#customer intent: As an API developer, I want to learn about using API Management to publish microservices-based architecures as APIs.
---

# Use Azure API Management with microservices deployed in Azure Kubernetes Service

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Microservices are perfect for building APIs. You can use [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/services/kubernetes-service/) to quickly deploy and operate a [microservices-based architecture](/azure/architecture/guide/architecture-styles/microservices) in the cloud. You can then use [Azure API Management](https://aka.ms/apimrocks) to publish your microservices as APIs for internal and external consumption. This article describes the options for using API Management to publish AKS microservices-based architectures as APIs. It assumes a basic knowledge of Kubernetes, API Management, and Azure networking. 

## Background

When you publish microservices as APIs for consumption, it can be challenging to manage the communication between the microservices and the clients that consume them. Cross-cutting concerns include authentication, authorization, throttling, caching, transformation, and monitoring. These concerns apply regardless of whether the microservices are exposed to internal or external clients. 

The [API Gateway](/dotnet/architecture/microservices/architect-microservice-container-applications/direct-client-to-microservice-communication-versus-the-api-gateway-pattern) pattern addresses these concerns. An API gateway serves as a front door to the microservices, decouples clients from your microservices, adds another layer of security, and decreases the complexity of your microservices by removing the burden of handling cross-cutting concerns. 

[API Management](https://aka.ms/apimrocks) is a turnkey solution to solve your API gateway needs. You can quickly create a consistent and modern gateway for your microservices and publish them as APIs. As a full-lifecycle API management solution, it also provides additional capabilities, including a self-service developer portal for API discovery, API lifecycle management, and API analytics.

When used together, AKS and API Management provide a platform for deploying, publishing, securing, monitoring, and managing your microservices-based APIs. This article describes a few options for deploying AKS in conjunction with API Management. 

## Kubernetes Services and APIs

In a Kubernetes cluster, containers are deployed in [Pods](https://kubernetes.io/docs/concepts/workloads/pods/pod/), which are ephemeral and have a lifecycle. When a worker node fails, the Pods running on the node are lost. Therefore, the IP address of a Pod can change at any time. You can't rely on it to communicate with the pod. 

To solve this problem, Kubernetes introduced the concept of [Services](https://kubernetes.io/docs/concepts/services-networking/service/). A Kubernetes Service is an abstraction layer that defines a logical group of Pods and enables external traffic exposure, load balancing, and service discovery for those Pods. 

When you're ready to publish your microservices as APIs by using API Management, you need to think about how to map your Services in Kubernetes to APIs in API Management. There are no set rules for this mapping. It depends on how you designed and partitioned your business capabilities or domains into microservices at the beginning. For instance, if the Pods behind a Service are responsible for all operations on a given resource (for example, Customer), you might map the Service to one API. If operations on a resource are partitioned into multiple microservices (for example, GetOrder and PlaceOrder), you might aggregate multiple Services into a single API in API Management. (See the following diagram.) 

The mappings can also evolve. Because API Management creates a facade in front of the microservices, it allows you to refactor and right-size your microservices over time. 

:::image type="content" source="./media/api-management-aks/service-api-mapping.png" alt-text="Diagram that shows different mappings of services to APIs." border="false":::

## Deploy API Management in front of AKS

There are a few options for deploying API Management in front of an AKS cluster. 

An AKS cluster is always deployed in a virtual network, but an API Management instance isn't necessarily deployed in a virtual network. When API Management doesn't reside within the cluster virtual network, the AKS cluster needs to publish public endpoints for API Management to connect to. In that case, you need to secure the connection between API Management and AKS. In other words, you need to ensure that the cluster can be accessed only through API Management. The following sections describe the options for deploying API Management in front of AKS. 

### Option 1: Expose Services publicly

You can publicly expose Services in an AKS cluster by using the NodePort, LoadBalancer, or ExternalName [Service types](/azure/aks/concepts-network-services). When you do, Services are accessible directly from the public internet. After deploying API Management in front of the cluster, you need to ensure that all inbound traffic goes through API Management by applying authentication in the microservices. For instance, API Management can include an access token in each request made to the cluster. Each microservice must validate the token before processing the request. 

This option might provide the easiest way to deploy API Management in front of AKS, especially if you already have authentication logic implemented in your microservices. 

:::image type="content" source="./media/api-management-aks/direct.png" alt-text="Diagram that shows an architecture for publishing services directly." border="false" lightbox="./media/api-management-aks/direct.png":::

Pros:
* Easy configuration on the API Management side because API Management doesn't need to be injected into the cluster virtual network
* No change on the AKS side if Services are already exposed publicly and authentication logic already exists in microservices

Cons:
* Creates potential security risk because of public visibility of endpoints
* Doesn't create a single entry point for inbound cluster traffic
* Complicates microservices with duplicate authentication logic

### Option 2: Install an ingress controller

Although option 1 might be easier, it has notable drawbacks, as noted earlier. If an API Management instance doesn't reside in the cluster virtual network, mutual TLS authentication (mTLS) is a robust way of ensuring that traffic is secure and trusted in both directions between an API Management instance and an AKS cluster. 

Mutual TLS authentication is [natively supported](./api-management-howto-mutual-certificates.md) by API Management. You can enable it in Kubernetes by [installing an ingress controller](/azure/aks/ingress-own-tls). (See the following diagram.) As a result, authentication is performed in the ingress controller, which simplifies the microservices. Additionally, in service tiers that support dedicated IP addresses, you can add the IP addresses of API Management to the ingress allowlist to ensure that only API Management has access to the cluster. 
 
:::image type="content" source="./media/api-management-aks/ingress-controller.png" alt-text="Diagram that shows an architecture for publishing via an ingress controller." border="false" lightbox="./media/api-management-aks/ingress-controller.png":::

Pros:
* Enables easy configuration on the API Management side because API Management doesn't need to be injected into the cluster virtual network and mTLS is natively supported
* Centralizes protection for inbound cluster traffic at the ingress controller layer
* Reduces security risk by minimizing publicly visible cluster endpoints

Cons:
* Increases complexity of cluster configuration because you need to install, configure, and maintain the ingress controller and manage certificates used for mTLS
* Adds security risk because of public visibility of ingress controller endpoints, unless you use API Management Standard v2 or Premium tier

When you publish APIs via API Management, it's easy and typical to secure access to those APIs by using subscription keys. Developers who need to consume the published APIs must include a valid subscription key in HTTP requests when they make calls to those APIs. Otherwise, the calls are rejected immediately by the API Management gateway. They aren't forwarded to the backend services.

To get a subscription key for accessing APIs, developers need a subscription. A subscription is essentially a named container for a pair of subscription keys. Developers who need to consume the published APIs can get subscriptions. They don't need approval from API publishers. API publishers can also create subscriptions directly for API consumers.

### Option 3: Deploy API Management inside the cluster virtual network

In some cases, customers that have regulatory constraints or strict security requirements might find Options 1 and 2 nonviable because of the publicly exposed endpoints. In others, the AKS cluster and the applications that consume the microservices might reside within the same virtual network, so there's no reason to expose the cluster publicly because all API traffic remains within the virtual network. In these scenarios, you can deploy API Management into the cluster virtual network. [API Management Developer, Premium, and Premium v2 (preview) tiers](https://aka.ms/apimpricing) support injection into the cluster virtual network. 

There are two modes of [deploying API Management into a virtual network](./virtual-network-concepts.md): external and internal. Currently, the external mode is only available in the classic tiers of API Management.

If API consumers don't reside in the cluster virtual network, you should use the external mode. (See the following diagram.) In this mode, the API Management gateway is injected into the cluster virtual network but accessible from the public internet via an external load balancer. This architecture helps to hide the cluster completely while still allowing external clients to consume the microservices. Additionally, you can use Azure networking capabilities like Network Security Groups (NSG) to restrict network traffic.

:::image type="content" source="./media/api-management-aks/vnet-external.png" alt-text="Diagram that shows an architecture that uses external virtual network mode." border="false" lightbox="./media/api-management-aks/vnet-external.png":::

If all API consumers reside within the cluster virtual network, you can use the internal mode. (See the following diagram.) In this mode, the API Management gateway is injected into the cluster virtual network and accessible only from within this virtual network via an internal load balancer. There's no way to reach the API Management gateway or the AKS cluster from the public internet. 

:::image type="content" source="./media/api-management-aks/vnet-internal.png" alt-text="Diagram that shows an architecture that uses internal virtual network mode." border="false" lightbox="./media/api-management-aks/vnet-internal.png":::

The AKS cluster isn't publicly visible in either case. In contrast to Option 2, the ingress controller might not be necessary. Depending on your scenario and configuration, authentication might still be required between API Management and your microservices. For instance, if you use a service mesh, you always need mutual TLS authentication. 

Pros:
* Provides the most secure option because the AKS cluster has no public endpoint
* Simplifies cluster configuration because there's no public endpoint
* Provides the ability to hide both API Management and AKS inside the virtual network by using the internal mode
* Provides the ability to control network traffic by using Azure networking capabilities like NSG

Cons:
* Increases the complexity of deploying and configuring API Management to work inside the virtual network

## Related content

* [Network concepts for applications in AKS](/azure/aks/concepts-network)
* [How to use API Management with virtual networks](./virtual-network-concepts.md)
