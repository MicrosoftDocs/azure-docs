---
title: Configure MQ diagnostics service
description: How to configure the Azure IoT MQ diagnostics service to create a Prometheus endpoint, and monitor the health of the system.
author: kgremban
ms.author: kgremban
ms.subservice: mq
ms.topic: concept-article
ms.custom:
  - ignite-2023
ms.date: 04/22/2024

#CustomerIntent: As an operator, I want to understand how to use observability and diagnostics 
#to monitor the health of the MQ service.
---

# Configure Azure IoT MQ Preview diagnostic service settings

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Azure IoT MQ Preview includes a diagnostics service that periodically self tests Azure IoT MQ components and emits metrics. Operators can use these metrics to monitor the health of the system. The diagnostics service provides a Prometheus endpoint for metrics from all IoT MQ components including Broker self-test metrics.


## Diagnostics service configuration

The diagnostics service processes and collates diagnostic signals from various Azure IoT MQ core components. You can configure it using a custom resource definition (CRD). The following table lists its properties.

| Name | Required | Format | Default | Description |
| --- | --- | --- | --- | --- |
| dataExportFrequencySeconds | false | Int32 | `10` | Frequency in seconds for data export |
| enableTls | false | Boolean | false | Enable TLS for the diagnostics service |
| image.repository | true | String | N/A | Docker image name |
| image.tag | true | String | N/A | Docker image tag |
| image.pullPolicy | false | String | N/A | Image pull policy to use |
| image.pullSecrets | false | String | N/A | Kubernetes secret containing docker authentication details |
| logFormat | false | String | `json` | Log format. `json` or `text` |
| logLevel | false | String | `info` | Log level. `trace`, `debug`, `info`, `warn`, or `error`. |
| maxDataStorageSize | false | Unsigned integer | `16` | Maximum data storage size in MiB |
| metricsPort | false | Int32 | `9600` | Port for metrics |
| openTelemetryTracesCollectorAddr | false | String | `null` | Endpoint URL of the OpenTelemetry collector |
| staleDataTimeoutSeconds | false | Int32 | `600` | Data timeouts in seconds |

## Example of a diagnostics service resource

Here's an example of a diagnostics service resource with basic configuration:

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: DiagnosticService
metadata:
  name: diagnostics
  namespace: azure-iot-operations
spec:
  enableTls: false
  image:
    repository: mcr.microsoft.com/azureiotoperations/diagnostics-service
    tag: 0.4.0-preview
  logLevel: info
  logFormat: text
```

## Related content

- [Configure MQ broker diagnostic settings](../manage-mqtt-connectivity/howto-configure-availability-scale.md#configure-mq-broker-diagnostic-settings)
- [Configure observability](../monitor/howto-configure-observability.md)
