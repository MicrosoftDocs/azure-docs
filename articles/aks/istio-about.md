---
title: Istio-based service mesh add-on for Azure Kubernetes Service
description: Istio-based service mesh add-on for Azure Kubernetes Service.
ms.topic: article
ms.service: azure-kubernetes-service
ms.date: 04/09/2023
ms.author: shasb
author: shashankbarsin
---

# Istio-based service mesh add-on for Azure Kubernetes Service

[Istio][istio-overview] addresses the challenges developers and operators face with a distributed or microservices architecture. The Istio-based service mesh add-on provides an officially supported and tested integration for Azure Kubernetes Service (AKS).

## What is a Service Mesh?

Modern applications are typically architected as distributed collections of microservices, with each collection of microservices performing some discrete business function. A service mesh is a dedicated infrastructure layer that you can add to your applications. It allows you to transparently add capabilities like observability, traffic management, and security, without adding them to your own code. The term **service mesh** describes both the type of software you use to implement this pattern, and the security or network domain that is created when you use that software.

As the deployment of distributed services, such as in a Kubernetes-based system, grows in size and complexity, it can become harder to understand and manage. You may need to implement capabilities such as discovery, load balancing, failure recovery, metrics, and monitoring. A service mesh can also address more complex operational requirements like A/B testing, canary deployments, rate limiting, access control, encryption, and end-to-end authentication.

Service-to-service communication is what makes a distributed application possible. Routing this communication, both within and across application clusters, becomes increasingly complex as the number of services grow. Istio helps reduce this complexity while easing the strain on development teams.

## What is Istio?

Istio is an open-source service mesh that layers transparently onto existing distributed applications. Istio’s powerful features provide a uniform and more efficient way to secure, connect, and monitor services. Istio enables load balancing, service-to-service authentication, and monitoring – with few or no service code changes. Its powerful control plane brings vital features, including:

* Secure service-to-service communication in a cluster with TLS (Transport Layer Security) encryption, strong identity-based authentication and authorization.
* Automatic load balancing for HTTP, gRPC, WebSocket, and TCP traffic.
* Fine-grained control of traffic behavior with rich routing rules, retries, failovers, and fault injection.
* A pluggable policy layer and configuration API supporting access controls, rate limits, and quotas.
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
* The add-on doesn't work on AKS clusters with self-managed installations of Istio.
* The add-on doesn't support adding pods associated with virtual nodes to be added under the mesh.
* The add-on doesn't yet support egress gateways for outbound traffic control.
* The add-on doesn't yet support the sidecar-less Ambient mode. Microsoft is currently contributing to Ambient workstream under Istio open source. Product integration for Ambient mode is on the roadmap and is being continuously evaluated as the Ambient workstream evolves.
* The add-on doesn't yet support multi-cluster deployments.
* The add-on doesn't yet support Windows Server containers as this is not available in open source Istio right now. Issue tracking this feature ask can be found [here][istio-oss-windows-issue].
* Customization of mesh through the following custom resources is blocked for now - `ProxyConfig, WorkloadEntry, WorkloadGroup, Telemetry, IstioOperator, WasmPlugin, EnvoyFilter`. 
* For `EnvoyFilter`, the add-on only supports filter of the type Lua for now (`type.googleapis.com/envoy.extensions.filters.http.lua.v3.Lua`). While this EnvoyFilter is allowed, any issue arising from the Lua script itself is not supported. Other `EnvoyFilter` types are currently blocked.
* Gateway API for Istio ingress gateway or managing mesh traffic (GAMMA) are currently not yet supported with Istio addon. It's planned to allow customizations such as ingress static IP address configuration as part of the Gateway API implementation for the add-on in future.

## Feedback and feature asks

Feedback and feature asks for the Istio add-on can be provided by creating [issues with label 'service-mesh' on AKS GitHub repository][aks-github-service-mesh-issues].

## Next steps

* [Deploy Istio-based service mesh add-on][istio-deploy-addon]
* [Troubleshoot Istio-based service mesh add-on][istio-troubleshooting]

[istio-overview]: https://istio.io/latest/
[managed-prometheus-overview]: ../azure-monitor/essentials/prometheus-metrics-overview.md
[managed-grafana-overview]: ../managed-grafana/overview.md
[azure-cni-cilium]: azure-cni-powered-by-cilium.md
[open-service-mesh-about]: open-service-mesh-about.md
[istio-meshconfig]: ./istio-meshconfig.md
[istio-ingress]: ./istio-deploy-ingress.md
[istio-troubleshooting]: /troubleshoot/azure/azure-kubernetes/extensions/istio-add-on-general-troubleshooting
[istio-meshconfig-support]: ./istio-meshconfig.md#allowed-supported-and-blocked-values
[istio-deploy-addon]: istio-deploy-addon.md

[istio-oss-windows-issue]: https://github.com/istio/istio/issues/27893
[aks-github-service-mesh-issues]: https://github.com/Azure/AKS/issues?q=is%3Aopen+is%3Aissue+label%3Aservice-mesh