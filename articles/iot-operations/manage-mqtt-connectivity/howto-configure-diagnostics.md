---
title: Configure Azure IoT MQ diagnostics
# titleSuffix: Azure IoT MQ
description: How to configure Azure IoT MQ diagnostics service.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/27/2023

#CustomerIntent: As an operator, I want to understand availability and scale options for MQTT broker.
---

# Configure Azure IoT MQ diagnostic settings

Azure IoT MQ includes a diagnostics service that periodically self tests Azure IoT MQ components and emits metrics. Operators can use these metrics to monitor the health of the system. The diagnostics service provides a Prometheus endpoint for metrics from all IoT MQ components including Broker self-test metrics.


## Diagnostics service configuration

The diagnostics service processes and collates diagnostic signals from various Azure IoT MQ core components. You can configure it using a custom resource definition (CRD). The following table lists its properties.

| Name | Required | Format | Default | Description |
| --- | --- | --- | --- | --- |
| dataExportFrequencySeconds | false | Int32 | `10` | Frequency in seconds for data export |
| image.repository | true | String | N/A | Docker image name |
| image.tag | true | String | N/A | Docker image tag |
| image.pullPolicy | false | String | N/A | Image pull policy to use |
| image.pullSecrets | false | String | N/A | Kubernetes secret containing docker authentication details |
| logFormat | false | String | `json` | Log format. `json` or `text` |
| logLevel | false | String | `info` | Log level. `trace`, `debug`, `info`, `warn`, or `error`. |
| maxDataStorageSize | false | Unsigned integer | `16` | Maximum data storage size in MiB |
| metricsPort | false | Int32 | `9600` | Port for metrics |
| openTelemetryCollectorAddr | false | String | `null` | Endpoint URL of the OpenTelemetry collector |
| staleDataTimeoutSeconds | false | Int32 | `600` | Data timeouts in seconds |

Here's an example of a Diagnostics service resource with basic configuration:

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: DiagnosticService
metadata:
  name: "broker"
  namespace: azure-iot-operations
spec:
  image:
    repository: mcr.microsoft.com/azureiotoperations/diagnostics-service
    tag: 0.1.0-preview
  logLevel: info
  logFormat: text
```

## Related content

[Configure observability](../monitor/howto-configure-observability.md)
