---
title: Use Prometheus Remote Write in Azure Health Models
description: Learn how to use Prometheus Remote Write to overcome the lack of direct network access to self-hosted Prometheus servers.
ms.topic: conceptual
ms.date: 12/12/2023
---

# Use Prometheus Remote Write

Azure Health Models (AHM) offers native support for Azure Monitor's managed service for Prometheus, but not for self-hosted Prometheus servers. Technically, both managed and self-hosted Prometheus servers use the same APIs and query language, making them similar in functionality. However, the challenge arises as AHM, being a managed service in Azure, lacks direct network access to self-hosted Prometheus servers.

To overcome the limitation of direct network access and enable the integration of self-hosted Prometheus with AHM, the proposed solution is to use remote write. With remote write, Prometheus can push metrics to a remote storage system, rather than relying on the traditional pull-based data collection approach.

:::image type="content" source="./media/health-model-prometheus-remote-write/prometheus-remote-write-diagram.png" lightbox="./media/health-model-prometheus-remote-write/prometheus-remote-write-diagram.png" alt-text="Diagram that shows Prometheus remote write.":::

<!--

This is the mermaid definition for the above diagram. Use this to edit and regenerate the graph.
Important: Arrows have been split with a / to prevent this comment block from breaking.

```mermaid
graph LR
    subgraph Prometheus
    P[Prometheus Self-hosted]
    end

    subgraph "Remote Storage"
    RS[Azure Monitor Workspace]
    end

    subgraph "Azure"
    AHM[Azure Health Model]
    end

    P --push-/-> RS
    RS --pull-/-> AHM
```
-->

Remote write empowers users to seamlessly integrate Prometheus with various storage systems or monitoring platforms supporting the remote write API. This approach ensures more efficient and centralized storage of metrics, making it advantageous for large-scale deployments and seamless integration with existing monitoring solutions.

## Next steps

Read more about [configuring remote write for Azure Monitor managed service for Prometheus using managed identity authentication](../containers/prometheus-remote-write-managed-identity.md).

