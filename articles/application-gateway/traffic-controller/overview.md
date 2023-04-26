---

title: What is Traffic Controller
titlesuffix: Azure Application Load Balancer
description: Overview of Azure Application Load Balancer Traffic Controller features, resources, architecture, and implementation. Learn how Traffic Controller works and how to use Traffic Controller resources in Azure.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: traffic-controller
ms.topic: overview
ms.date: 5/1/2023
ms.author: greglin
---

# What is Traffic Controller?

Traffic Controller is the evolution of Application Gateway Ingress Controller (AGIC) offered as a fully managed Azure Service, providing application (layer 7) Load Balancing and Dynamic Traffic Management capabilities for workloads running in a Kubernetes cluster. Traffic Controller extends Azure's Application Load Balancing portfolio and is offered as new SKU under Application Gateway product family.

The existing Application Gateway Ingress Controller (AGIC) is a Kubernetes application, which makes it possible for Azure Kubernetes Service (AKS) customers to leverage Azure's native Application Gateway Application load-balancer. In its current form Application Gateway Ingress Controller (AGIC) monitors a subset of Kubernetes Resources for changes and applies them to the Application Gateway utilizing Azure Resource Manager (ARM).

Traffic Controller offers an elastic and scalable ingress to AKS clusters and comprises of a new data plane as well as control plane with new set of ARM APIs, different from existing Application Gateway. Traffic controller consists of an outside the AKS cluster data plane which is responsible for ingress and is controlled by an LB controller component running inside the AKS cluster adhering to Kubernete's Gateway APIs.

## Features

### Load balancing features

Traffic Controller supports the following features for traffic management:
- Performance improvements
  - Sub-second update times to add/remove pods, routes, probes
- Layer 7 HTTP/HTTPs request forwarding based on prefix/exact match on:
  - Hostname
  - Path
  - Headers
  - Query string match
  - Methods
  - Ports (80/443)
- HTTPs traffic management:
  - SSL termination
  - End to End SSL
- Traffic Splitting / weighted round robin
- Mutual Authentication (mTLS) to backend target
- Health checks: Traffic Controller determines the health of a backend before it registers it as healthy and capable of handling traffic
- Automatic retries
- Autoscaling
- Availability zone resiliency

### Implementation of Gateway API

LB Controller implements version [v1beta1](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1beta1) of the [Gateway API](https://gateway-api.sigs.k8s.io/)

| Gateway API Resource      | Support | Comments     |
| ------------------------- | ------- | ------------ |
| [GatewayClass](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io%2fv1beta1.GatewayClass)          | Yes   |  |
| [Gateway](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io%2fv1beta1.Gateway)                    | Yes   | Support for HTTP and HTTPs protocol on the listener. The only ports allowed on the listener are 80 and 443. |
| [HTTPRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io%2fv1beta1.HTTPRoute)                | Yes   | Currently does not support [HTTPRouteFilter](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1beta1.HTTPRouteFilter) |
| [ReferenceGrant](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io%2fv1alpha2.ReferenceGrant)     | Yes   | Currently supports version v1alpha1 of this api |

### Implementation of custom CRDs in LB Controller 

LB Controller supports a few custom CRDs, details on these can be found [here](api-types-kubernetes.md).

## Reporting Issues

For feedback, or to report incidents please use alias [tcfeedback@microsoft.com](mailto:tcfeedback@microsoft.com). 

## Pricing and SLA

For Traffic Controller pricing information, see [Application Gateway pricing](https://azure.microsoft.com/pricing/details/application-gateway/).

While in Public Preview, Traffic Controller follows [Preview supplemental terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## What's new

To learn what's new with Traffic Controller, see [Azure updates](https://azure.microsoft.com/updates/?category=networking&query=Traffic%20Controller).

## Next steps

- [Concepts: How Traffic Controller works](concepts-how-traffic-controller-works.md)
- [Quickstart: Create a Traffic Controller](quickstart-create-traffic-controller.md)
