---

title: What is Application Gateway for Containers
titlesuffix: Azure Application Load Balancer
description: Overview of Azure Application Load Balancer Application Gateway for Containers features, resources, architecture, and implementation. Learn how Application Gateway for Containers works and how to use Application Gateway for Containers resources in Azure.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: traffic-controller
ms.topic: overview
ms.date: 5/1/2023
ms.author: greglin
---

# What is Application Gateway for Containers?

Application Gateway for Containers is the evolution of Application Gateway Ingress Controller (AGIC) offered as a fully managed Azure Service, providing application (layer 7) Load Balancing and Dynamic Traffic Management capabilities for workloads running in a Kubernetes cluster. Application Gateway for Containers extends Azure's Application Load Balancing portfolio and is offered as new SKU under Application Gateway product family.

The existing Application Gateway Ingress Controller (AGIC) is a Kubernetes application, which makes it possible for Azure Kubernetes Service (AKS) customers to use Azure's native Application Gateway Application load-balancer. In its current form Application Gateway Ingress Controller (AGIC) monitors a subset of Kubernetes Resources for changes and applies them to the Application Gateway utilizing Azure Resource Manager (ARM).

Application Gateway for Containers offers an elastic and scalable ingress to AKS clusters and comprises a new data plane as well as control plane with new set of ARM APIs, different from existing Application Gateway. Application Gateway for Containers is outside the AKS cluster data plane and is responsible for ingress. It's controlled by an ALB controller component that runs inside the AKS cluster and adheres Kubernetes' Gateway APIs.

## Features

### Load balancing features

Application Gateway for Containers supports the following features for traffic management:
- Performance improvements
  - Subsecond update times to add/remove pods, routes, probes
- Layer 7 HTTP/HTTPS request forwarding based on prefix/exact match on:
  - Hostname
  - Path
  - Headers
  - Query string match
  - Methods
  - Ports (80/443)
- HTTPS traffic management:
  - SSL termination
  - End to End SSL
- Ingress and Gateway API support
- Traffic Splitting / weighted round robin
- Mutual Authentication (mTLS) to backend target
- Health checks: Application Gateway for Containers determines the health of a backend before it registers it as healthy and capable of handling traffic
- Automatic retries
- TLS Policies
- Autoscaling
- Availability zone resiliency

### Supported Regions
Application Gateway for Containers is currently offered in the following regions:
- North Central US
- North Europe

### Implementation of Gateway API

ALB Controller implements version [v1beta1](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1beta1) of the [Gateway API](https://gateway-api.sigs.k8s.io/)

| Gateway API Resource      | Support | Comments     |
| ------------------------- | ------- | ------------ |
| [GatewayClass](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io%2fv1beta1.GatewayClass)          | Yes   |  |
| [Gateway](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io%2fv1beta1.Gateway)                    | Yes   | Support for HTTP and HTTPS protocol on the listener. The only ports allowed on the listener are 80 and 443. |
| [HTTPRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io%2fv1beta1.HTTPRoute)                | Yes   | Currently doesn't support [HTTPRouteFilter](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1beta1.HTTPRouteFilter) |
| [ReferenceGrant](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io%2fv1alpha2.ReferenceGrant)     | Yes   | Currently supports version v1alpha1 of this api |

### Implementation of custom CRDs in ALB Controller 

ALB Controller supports a few custom CRDs, details on these can be found [here](api-types-kubernetes.md).

## Reporting Issues

For feedback or to report incidents, use the alias [tcfeedback@microsoft.com](mailto:tcfeedback@microsoft.com). 

## Pricing and SLA

For Application Gateway for Containers pricing information, see [Application Gateway pricing](https://azure.microsoft.com/pricing/details/application-gateway/).

While in Public Preview, Application Gateway for Containers follows [Preview supplemental terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## What's new

To learn what's new with Application Gateway for Containers, see [Azure updates](https://azure.microsoft.com/updates/?category=networking&query=Traffic%20Controller).

## Next steps

- [Concepts: How Application Gateway for Containers works](concepts-how-traffic-controller-works.md)
- [Quickstart: Create an Application Gateway for Containers](quickstart-create-traffic-controller.md)
