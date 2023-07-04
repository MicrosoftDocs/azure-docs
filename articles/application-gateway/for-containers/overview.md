---

title: What is Application Gateway for Containers
titlesuffix: Azure Application Load Balancer
description: Overview of Azure Application Load Balancer Application Gateway for Containers features, resources, architecture, and implementation. Learn how Application Gateway for Containers works and how to use Application Gateway for Containers resources in Azure.
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: traffic-controller
ms.topic: overview
ms.date: 7/7/2023
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

### Deployment strategies
There are two deployment strategies for management of Application Gateway for Containers:

- **Referenced:** In this deployment strategy, deployment and lifecycle of the Application Gateway for Containers resource, Association and Frontend resource is assumed via Azure Portal, CLI, PowerShell, Terraform, etc. and referenced in configuration within Kubernetes.
   - **In Gateway API:** Every time you wish to create a new Gateway object in Kuberenetes, a Frontend resource should be provisioned in Azure prior and referenced by the Gateway object. Deletion of the Frontend resource is responsible by the Azure administrator and will not be deleted when the Gateway object in Kubernetes is deleted.
- **Managed:** In this deployment strategy ALB Controller deployed in Kubernetes will be responsible for the lifecycle of the Application Gateway for Containers resource and its sub resources. ALB Controller will create Application Gateway for Containers resource when an ApplicationLoadBalancer custom resource is defined on the cluster and its lifecycle will be based on the lifecycle of the custom resource.
  - **In Gateway API:** Every time a Gateway object is created referencing the ApplicationLoadBalancer resource, ALB Controller will provision a new Frontend resource and manage its lifecycle based on the lifecycle of the Gateway object.

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

For feedback, post a new idea in [feedback.azure.com](https://feedback.azure.com/)
For issues, raise a support request via the Azure portal on your Application Gateway for Containers resource.

## Pricing and SLA

For Application Gateway for Containers pricing information, see [Application Gateway pricing](https://azure.microsoft.com/pricing/details/application-gateway/).

While in Public Preview, Application Gateway for Containers follows [Preview supplemental terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## What's new

To learn what's new with Application Gateway for Containers, see [Azure updates](https://azure.microsoft.com/updates/?category=networking&query=Traffic%20Controller).

## Next steps

- [Concepts: How Application Gateway for Containers works](concepts-how-traffic-controller-works.md)
- [Quickstart: Create an Application Gateway for Containers - Referenced deployment](quickstart-create-application-gateway-for-containers-referenced.md)
- [Quickstart: Create an Application Gateway for Containers - Managed deployment](quickstart-create-application-gateway-for-containers-managed.md)
