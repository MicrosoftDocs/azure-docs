---
title: Configure dataflow profile in Azure IoT Operations
description: How to configure a dataflow profile in Azure IoT Operations to change a dataflow behavior.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 08/03/2024

#CustomerIntent: As an operator, I want to understand how to I can configure a a dataflow profile to control a dataflow behavior.
---

# Configure dataflow profile

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

By default, when you deploy Azure IoT Operations, a dataflow profile is created with default settings. You can configure the dataflow profile to suit your needs.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowProfile
metadata:
  name: my-dataflow-profile
spec:
  instanceCount: 1
  tolerations:
    ...
  diagnostics:
    logFormat: text
    logLevel: info
    metrics:
      mode: enabled
      cacheTimeoutSeconds: 600
      exportIntervalSeconds: 10
      prometheusPort: 9600
      updateIntervalSeconds: 30
    traces:
      mode: enabled
      cacheSizeMegabytes: 16
      exportIntervalSeconds: 10
      openTelemetryCollectorAddress: null
      selfTracing:
        mode: enabled
        frequencySeconds: 30
      spanChannelCapacity: 100
```

| Field Name                                      | Description                                                                 |
|-------------------------------------------------|-----------------------------------------------------------------------------|
| `instanceCount`                                  | Number of instances to spread the dataflow across. Optional; automatically determined if not set. Currently in the preview release, set the value to `1`. |
| `tolerations`                                   | Node tolerations. Optional; see [Kubernetes Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/). |
| `diagnostics`                                   | Diagnostics settings.                                                       |
| `diagnostics.logFormat`                         | Format of the logs. For example, `text`.                                           |
| `diagnostics.logLevel`                          | Log level. For example, `info`, `debug`, `error`. Optional; defaults to `info`.    |
| `diagnostics.metrics`                           | Metrics settings.                                                           |
| `diagnostics.metrics.mode`                      | Mode for metrics. For example, `enabled`.                                          |
| `diagnostics.metrics.cacheTimeoutSeconds`       | Cache timeout for metrics in seconds.                                       |
| `diagnostics.metrics.exportIntervalSeconds`     | Export interval for metrics in seconds.                                     |
| `diagnostics.metrics.prometheusPort`            | Port for Prometheus metrics.                                                |
| `diagnostics.metrics.updateIntervalSeconds`     | Update interval for metrics in seconds.                                     |
| `diagnostics.traces`                            | Traces settings.                                                            |
| `diagnostics.traces.mode`                       | Mode for traces. For example, `enabled`.                                           |
| `diagnostics.traces.cacheSizeMegabytes`         | Cache size for traces in megabytes.                                         |
| `diagnostics.traces.exportIntervalSeconds`      | Export interval for traces in seconds.                                      |
| `diagnostics.traces.openTelemetryCollectorAddress` | Address for the OpenTelemetry collector.                                   |
| `diagnostics.traces.selfTracing`                | Self-tracing settings.                                                      |
| `diagnostics.traces.selfTracing.mode`           | Mode for self-tracing. For example, `enabled`.                                     |
| `diagnostics.traces.selfTracing.frequencySeconds`| Frequency for self-tracing in seconds.                                      |
| `diagnostics.traces.spanChannelCapacity`        | Capacity of the span channel.                                               |

## Default settings

The default settings for a dataflow profile are:

* Instances: (null)
* Log level: Info
* Node tolerations: None
* Diagnostic settings: None

## Scaling

To manually scale the dataflow profile, specify the maximum number of instances you want to run.

```yaml
spec:
  maxInstances: 3
```

If not specified, Azure IoT Operations automatically scales the dataflow profile based on the dataflow configuration. The number of instances is determined by the number of dataflows and the shared subscription configuration.

## Configure log level, node tolerations, diagnostic settings, and other deployment-wide settings

You can configure other deployment-wide settings such as log level, node tolerations, and diagnostic settings.

```yaml
spec:
  logLevel: debug
  tolerations:
    - key: "node-role.kubernetes.io/edge"
      operator: "Equal"
      value: "true"
      effect: "NoSchedule"
  diagnostics:
    # ...
```
