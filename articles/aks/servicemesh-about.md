---
title: About service meshes
description: Obtain an overview of service meshes, supported scenarios, selection criteria, and next steps to explore.
author: pgibson
ms.topic: article
ms.date: 01/04/2022
ms.author: pgibson
---

# About service meshes

A service mesh provides capabilities like traffic management, resiliency, policy, security, strong identity, and observability to your workloads. Your application is decoupled from these operational capabilities and the service mesh moves them out of the application layer, and down to the infrastructure layer.

## Scenarios

These are some of the scenarios that can be enabled for your workloads when you use a service mesh:

- **Encrypt all traffic in cluster** - Enable mutual TLS between specified services in the cluster. This can be extended to ingress and egress at the network perimeter, and provides a secure by default option with no changes needed for application code and infrastructure.

- **Canary and phased rollouts** - Specify conditions for a subset of traffic to be routed to a set of new services in the cluster. On successful test of canary release, remove conditional routing and phase gradually increasing % of all traffic to new service. Eventually all traffic will be directed to new service.

- **Traffic management and manipulation** - Create a policy on a service that will rate limit all traffic to a version of a service from a specific origin, or a policy that applies a retry strategy to classes of failures between specified services. Mirror live traffic to new versions of services during a migration or to debug issues. Inject faults between services in a test environment to test resiliency.

- **Observability** - Gain insight into how your services are connected and the traffic that flows between them. Obtain metrics, logs, and traces for all traffic in cluster, including ingress/egress. Add distributed tracing abilities to your applications.

## Selection criteria

Before you select a service mesh, ensure that you understand your requirements and the reasons for installing a service mesh. Ask the following questions:

- **Is an Ingress Controller sufficient for my needs?** - Sometimes having a capability like A/B testing or traffic splitting at the ingress is sufficient to support the required scenario. Don't add complexity to your environment with no upside.

- **Can my workloads and environment tolerate the additional overheads?** - All the additional components required to support the service mesh require additional resources like CPU and memory. In addition, all the proxies and their associated policy checks add latency to your traffic. If you have workloads that are very sensitive to latency or cannot provide the additional resources to cover the service mesh components, then re-consider.

- **Is this adding additional complexity unnecessarily?** - If the reason for installing a service mesh is to gain a capability that is not necessarily critical to the business or operational teams, then consider whether the additional complexity of installation, maintenance, and configuration is worth it.

- **Can this be adopted in an incremental approach?** - Some of the service meshes that provide a lot of capabilities can be adopted in a more incremental approach. Install just the components you need to ensure your success. Once you are more confident and additional capabilities are required, then explore those. Resist the urge to install *everything* from the start.

## Next steps

Open Service Mesh (OSM) is a supported service mesh that runs Azure Kubernetes Service (AKS):

> [!div class="nextstepaction"]
> [Learn more about OSM ...][osm-about]

There are also service meshes provided by open-source projects and third parties that are commonly used with AKS. These open-source and third-party service meshes are not covered by the [AKS support policy][aks-support-policy].

- [Istio][istio]
- [Linkerd][linkerd]
- [Consul Connect][consul]

For more details on the service mesh landscape, see [Layer 5's Service Mesh Landscape][service-mesh-landscape].

For more details service mesh standardization efforts:

- [Service Mesh Interface (SMI)][smi]
- [Service Mesh Federation][smf]
- [Service Mesh Performance (SMP)][smp]


<!-- LINKS - external -->
[istio]: https://istio.io/latest/docs/setup/install/
[linkerd]: https://linkerd.io/getting-started/
[consul]: https://learn.hashicorp.com/tutorials/consul/service-mesh-deploy
[service-mesh-landscape]: https://layer5.io/service-mesh-landscape
[smi]: https://smi-spec.io/
[smf]: https://github.com/vmware/hamlet
[smp]: https://github.com/service-mesh-performance/service-mesh-performance

<!-- LINKS - internal -->
[osm-about]: ./open-service-mesh-about.md
[aks-support-policy]: support-policies.md
