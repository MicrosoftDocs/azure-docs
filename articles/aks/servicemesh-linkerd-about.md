---
title: Overview of Linkerd
description: Obtain an overview of Linkerd
author: paulbouwer
ms.topic: article
ms.date: 10/09/2019
ms.author: pabouwer
---

# Linkerd

## Overview

[Linkerd][linkerd] is an easy to use and lightweight service mesh.

## Architecture

Linkerd provides a data plane that is composed of ultralight [Linkerd][linkerd-proxy] specialised proxy sidecars. These intelligent proxies control all network traffic in and out of your meshed apps and workloads. The proxies also expose metrics via [Prometheus][prometheus] metrics endpoints.

The control plane manages the configuration and aggregated telemetry via the following [components][linkerd-architecture]:

- **Controller** - Provides api that drives the Linkerd CLI and Dashboard. Provides configuration for proxies.

- **Tap** - Establish real-time watches on requests and responses.

- **Identity** - Provides identity and security capabilities that allow for mTLS between services.

- **Web** - Provides the Linkerd dashboard.


The following architecture diagram demonstrates how the various components within the data plane and control plane interact.


![Overview of Linkerd components and architecture.](media/servicemesh/linkerd/about-architecture.png)


## Selection criteria

It's important to understand and consider the following areas when evaluating Linkerd for your workloads:

- [Design Principles](#design-principles)
- [Capabilities](#capabilities)
- [Scenarios](#scenarios)


### Design principles

The following design principles [guide][design-principles] the Linkerd project:

- **Keep it Simple** - Must be easy to use and understand.

- **Minimize Resource Requirements** - Impose minimal performance and resource cost.

- **Just Work** - Don't break existing applications and don't require complex configuration.


### Capabilities

Linkerd provides the following set of capabilities:

- **Mesh** – built in debugging option

- **Traffic Management** – splitting, timeouts, retries, ingress

- **Security** – encryption (mTLS), certificates autorotated every 24 hours

- **Observability** – golden metrics, tap, tracing, service profiles and per route metrics, web dashboard with topology graphs, prometheus, grafana


### Scenarios

Linkerd is well suited to and suggested for the following scenarios:

- Simple to use with just the essential set of capability requirements

- Low latency, low overhead, with focus on observability and simple traffic management


## Next steps

The following documentation describes how you can install Linkerd on Azure Kubernetes Service (AKS):

> [!div class="nextstepaction"]
> [Install Linkerd in Azure Kubernetes Service (AKS)][linkerd-install]

You can also further explore Linkerd features and architecture:

- [Linkerd Features][linkerd-features]
- [Linkerd Architecture][linkerd-architecture]

<!-- LINKS - external -->
[linkerd]: https://linkerd.io/2/overview/
[linkerd-architecture]: https://linkerd.io/2/reference/architecture/
[linkerd-features]: https://linkerd.io/2/features/
[design-principles]: https://linkerd.io/2/design-principles/
[linkerd-proxy]: https://github.com/linkerd/linkerd2-proxy

[grafana]: https://grafana.com/
[prometheus]: https://prometheus.io/

<!-- LINKS - internal -->
[linkerd-install]: ./servicemesh-linkerd-install.md