---
title: Manage dataflows
description: How to manage dataflows.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-mqtt-broker
ms.topic: conceptual
ms.date: 07/11/2024

#CustomerIntent: As an operator, I want to understand how to I can use Dataflows to .
---

# Manage dataflows

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

## Configure dataflow profile

By default, when you deploy Azure IoT Operations, a dataflow profile is created with default settings. You can configure the dataflow profile to suit your needs.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowProfile
metadata:
  name: my-dataflow-profile
spec:
  maxInstances: 4
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
| `maxInstances`                                  | Number of instances to spread the dataflows across. Optional; automatically determined if not set. |
| `tolerations`                                   | Node tolerations. Optional; see [Kubernetes Taints and Tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/). |
| `diagnostics`                                   | Diagnostics settings.                                                       |
| `diagnostics.logFormat`                         | Format of the logs, e.g., `text`.                                           |
| `diagnostics.logLevel`                          | Log level, e.g., `info`, `debug`, `error`. Optional; defaults to `info`.    |
| `diagnostics.metrics`                           | Metrics settings.                                                           |
| `diagnostics.metrics.mode`                      | Mode for metrics, e.g., `enabled`.                                          |
| `diagnostics.metrics.cacheTimeoutSeconds`       | Cache timeout for metrics in seconds.                                       |
| `diagnostics.metrics.exportIntervalSeconds`     | Export interval for metrics in seconds.                                     |
| `diagnostics.metrics.prometheusPort`            | Port for Prometheus metrics.                                                |
| `diagnostics.metrics.updateIntervalSeconds`     | Update interval for metrics in seconds.                                     |
| `diagnostics.traces`                            | Traces settings.                                                            |
| `diagnostics.traces.mode`                       | Mode for traces, e.g., `enabled`.                                           |
| `diagnostics.traces.cacheSizeMegabytes`         | Cache size for traces in megabytes.                                         |
| `diagnostics.traces.exportIntervalSeconds`      | Export interval for traces in seconds.                                      |
| `diagnostics.traces.openTelemetryCollectorAddress` | Address for the OpenTelemetry collector.                                   |
| `diagnostics.traces.selfTracing`                | Self-tracing settings.                                                      |
| `diagnostics.traces.selfTracing.mode`           | Mode for self-tracing, e.g., `enabled`.                                     |
| `diagnostics.traces.selfTracing.frequencySeconds`| Frequency for self-tracing in seconds.                                      |
| `diagnostics.traces.spanChannelCapacity`        | Capacity of the span channel.                                               |

### Default settings

The default settings for a dataflow profile are:

* Instances: (null)
* Log level: Info
* Node tolerations: None
* Diagnostic settings: None

### Scaling

To manually scale the dataflow profile, specify the maximum number of instances you want to run.

```yaml
spec:
  maxInstances: 3
```

If not specified, Azure IoT Operations automatically scales the dataflow profile based on the dataflow configuration. The number of instances is determined by the number of dataflows and the shared subscription configuration.

### Configure log level, node tolerations, diagnostic settings, and other deployment-wide settings

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
    ...
```

## Manage dataflows

### Enable or disable dataflow

To enable or disable a dataflow, you can update the Dataflow CR.

```yaml
spec:
  mode: disabled
```

### Delete dataflow

To delete a dataflow, delete the Dataflow CR.

```bash
kubectl delete dataflow my-dataflow
```

### Export dataflow configuration

To export the dataflow configuration, export the Dataflow CR.

```bash
kubectl get dataflow my-dataflow -o yaml > my-dataflow.yaml
```

## Manage endpoints

### Delete

Be cautious if the endpoint is in use by a dataflow.

```bash
kubectl delete endpoint my-endpoint
```
## Next steps

- [Create a dataflow](tutorial-dataflow-asset-event-grid.md)

