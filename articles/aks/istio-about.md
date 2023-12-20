---
title: Istio-based service mesh add-on for Azure Kubernetes Service (preview)
description: Istio-based service mesh add-on for Azure Kubernetes Service.
ms.topic: article
ms.date: 04/09/2023
ms.author: shasb
---

# Istio-based service mesh add-on for Azure Kubernetes Service (preview)

[Istio][istio-overview] addresses the challenges developers and operators face with a distributed or microservices architecture. The Istio-based service mesh add-on provides an officially supported and tested integration for Azure Kubernetes Service (AKS).

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## What is a Service Mesh?

Modern applications are typically architected as distributed collections of microservices, with each collection of microservices performing some discrete business function. A service mesh is a dedicated infrastructure layer that you can add to your applications. It allows you to transparently add capabilities like observability, traffic management, and security, without adding them to your own code. The term **service mesh** describes both the type of software you use to implement this pattern, and the security or network domain that is created when you use that software.

As the deployment of distributed services, such as in a Kubernetes-based system, grows in size and complexity, it can become harder to understand and manage. You may need to implement capabilities such as discovery, load balancing, failure recovery, metrics, and monitoring. A service mesh can also address more complex operational requirements like A/B testing, canary deployments, rate limiting, access control, encryption, and end-to-end authentication.

Service-to-service communication is what makes a distributed application possible. Routing this communication, both within and across application clusters, becomes increasingly complex as the number of services grow. Istio helps reduce this complexity while easing the strain on development teams.

## What is Istio?

Istio is an open-source service mesh that layers transparently onto existing distributed applications. Istio’s powerful features provide a uniform and more efficient way to secure, connect, and monitor services. Istio enables load balancing, service-to-service authentication, and monitoring – with few or no service code changes. Its powerful control plane brings vital features, including:

* Secure service-to-service communication in a cluster with TLS encryption, strong identity-based authentication and authorization.
* Automatic load balancing for HTTP, gRPC, WebSocket, and TCP traffic.
* Fine-grained control of traffic behavior with rich routing rules, retries, failovers, and fault injection.
* A pluggable policy layer and configuration API supporting access controls, rate limits and quotas.
* Automatic metrics, logs, and traces for all traffic within a cluster, including cluster ingress and egress.

## How is the add-on different from open-source Istio?

This service mesh add-on uses and builds on top of open-source Istio. The add-on flavor provides the following extra benefits:

* Istio versions are tested and verified to be compatible with supported versions of Azure Kubernetes Service.
* Microsoft handles scaling and configuration of Istio control plane
* Microsoft adjusts scaling of AKS components like `coredns` when Istio is enabled.
* Microsoft provides managed lifecycle (upgrades) for Istio components when triggered by user.
* Verified external and internal ingress set-up.
* Verified to work with [Azure Monitor managed service for Prometheus][managed-prometheus-overview] and [Azure Managed Grafana][managed-grafana-overview].
* Official Azure support provided for the add-on.

## Limitations

Istio-based service mesh add-on for AKS has the following limitations:
* The add-on doesn't work on AKS clusters that are using [Open Service Mesh addon for AKS][open-service-mesh-about].
* The add-on doesn't work on AKS clusters that have Istio installed on them already outside the add-on installation.
* Managed lifecycle of mesh on how Istio versions are installed and later made available for upgrades.
* Istio doesn't support Windows Server containers.
* Customization of mesh based on the following custom resources is blocked for now - `EnvoyFilter, ProxyConfig, WorkloadEntry, WorkloadGroup, Telemetry, IstioOperator, WasmPlugin`

## Next steps

* [Deploy Istio-based service mesh add-on][istio-deploy-addon]

[istio-overview]: https://istio.io/latest/
[managed-prometheus-overview]: ../azure-monitor/essentials/prometheus-metrics-overview.md
[managed-grafana-overview]: ../managed-grafana/overview.md
[azure-cni-cilium]: azure-cni-powered-by-cilium.md
[open-service-mesh-about]: open-service-mesh-about.md

[istio-deploy-addon]: istio-deploy-addon.md