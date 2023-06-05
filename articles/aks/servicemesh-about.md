---
title: About service meshes
description: Obtain an overview of service meshes, supported scenarios, selection criteria, and next steps to explore.
author: pgibson
ms.topic: article
ms.date: 04/18/2023
ms.author: pgibson
---

# About service meshes

A service mesh is an infrastructure layer in your application that facilitates communication between services. Service meshes provide capabilities like traffic management, resiliency, policy, security, strong identity, and observability to your workloads. Your application is decoupled from these operational capabilities, while the service mesh moves them out of the application layer and down to the infrastructure layer.

## Scenarios

When you use a service mesh, you can enable scenarios such as:

- **Encrypting all traffic in cluster**: Enable mutual TLS between specified services in the cluster. This can be extended to ingress and egress at the network perimeter and provides a secure-by-default option with no changes needed for application code and infrastructure.

- **Canary and phased rollouts**: Specify conditions for a subset of traffic to be routed to a set of new services in the cluster. On successful test of canary release, remove conditional routing and phase gradually increasing % of all traffic to a new service. Eventually, all traffic will be directed to the new service.

- **Traffic management and manipulation**: Create a policy on a service that rate limits all traffic to a version of a service from a specific origin, or a policy that applies a retry strategy to classes of failures between specified services. Mirror live traffic to new versions of services during a migration or to debug issues. Inject faults between services in a test environment to test resiliency.

- **Observability**: Gain insight into how your services are connected and the traffic that flows between them. Gather metrics, logs, and traces for all traffic in the cluster, including ingress/egress. Add distributed tracing abilities to applications.

## Selection criteria

Before you select a service mesh, make sure you understand your requirements and reasoning for installing a service mesh. Ask the following questions:

- **Is an ingress controller sufficient for my needs?**: Sometimes having a capability like A/B testing or traffic splitting at the ingress is sufficient to support the required scenario. Don't add complexity to your environment with no upside.

- **Can my workloads and environment tolerate the additional overheads?**: All the components required to support the service mesh require resources like CPU and memory. All the proxies and their associated policy checks add latency to your traffic. If you have workloads that are very sensitive to latency or can't provide extra resources to cover service mesh components, you should reconsider using a service mesh.

- **Is this adding unnecessary complexity?**: If you want to install a service mesh to use a capability that isn't critical to the business or operational teams, then consider whether the added complexity of installation, maintenance, and configuration is worth it.

- **Can this be adopted in an incremental approach?**: Some of the service meshes that provide a lot of capabilities can be adopted in a more incremental approach. Install just the components you need to ensure your success. If you later find that more capabilities are required, explore them at a later time. Resist the urge to install *everything* from the start.

## Next steps

Azure Kubernetes Service (AKS) offers officially supported add-ons for Istio and Open Service Mesh:

> [!div class="nextstepaction"]
> [Learn more about Istio][istio-about]
> [Learn more about OSM][osm-about]

There are also service meshes provided by open-source projects and third parties that are commonly used with AKS. These service meshes aren't covered by the [AKS support policy][aks-support-policy].

- [Linkerd][linkerd]
- [Consul Connect][consul]

For more details on the service mesh landscape, see [Layer 5's Service Mesh Landscape][service-mesh-landscape].

For more details on service mesh standardization efforts, see:

- [Service Mesh Interface (SMI)][smi]
- [Service Mesh Federation][smf]
- [Service Mesh Performance (SMP)][smp]

<!-- LINKS - external -->
[linkerd]: https://linkerd.io/getting-started/
[consul]: https://learn.hashicorp.com/tutorials/consul/service-mesh-deploy
[service-mesh-landscape]: https://layer5.io/service-mesh-landscape
[smi]: https://smi-spec.io/
[smf]: https://github.com/vmware/hamlet
[smp]: https://github.com/service-mesh-performance/service-mesh-performance

<!-- LINKS - internal -->
[osm-about]: ./open-service-mesh-about.md
[istio-about]: ./istio-about.md
[aks-support-policy]: support-policies.md
