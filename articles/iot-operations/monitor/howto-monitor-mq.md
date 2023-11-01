---
title: Monitor Azure IoT MQ
# titleSuffix: Azure IoT MQ
description: Monitor and set alerts for Azure IoT MQ
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 11/01/2023

#CustomerIntent: As an operator, I want to set up TLS so that I have secure communication between the MQTT broker and clients.
---

# Monitor Azure IoT MQ

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Azure IoT MQ includes a diagnostics service that periodically self tests IoT MQ components and emits metrics. These metrics can be used by operators to monitor the health of the system. The diagnostics service has a Prometheus endpoint for metrics.

## What's supported

| Feature | Supported |
| --- | --- |
| Metrics | Supported |
| Traces | Supported |
| Logs | Supported |
| SLI metrics | Supported |
| Prometheus endpoint | Supported |
| Grafana dashboard for metrics, traces and logs | Supported |

## Glossary

| Name | Definition |
| --- | --- |
| Service level indicator (SLI) | The indicators or actual metric values that are from Azure IoT MQ measurements. |
| Service level objectives (SLO) | The objectives or targets to meet. The SLIs are used to assess if meeting SLOs. You can define SLOs based on SLI metrics.|
| Diagnostics service | IoT MQ component that processes and collates diagnostic signals from various IoT MQ core components. |

## Diagnostics service configuration

The diagnostics service processes and collates diagnostic signals from various IoT MQ core components. You can configure it using a custom resource definition (CRD). The following table lists its properties.

| Name | Required | Format | Default | Description |
| --- | --- | --- | --- | --- |
| dataExportFrequencySeconds | false | Int32 | `10` | Frequency in seconds for data export |
| repository | true | String | N/A | Docker image name |
| tag | true | String | N/A | Docker image tag |
| pullPolicy | false | String | N/A | Image pull policy to use |
| pullSecrets | false | String | N/A | Kubernetes secret containing docker authentication details |
| logFormat | false | String | `json` | Log format. `json` or `text` |
| logLevel | false | String | `info` | Log level. `trace`, `debug`, `info`, `warn`, or `error`. |
| maxDataStorageSize | false | Unsigned integer | `16` | Maximum data storage size in MiB |
| metricsPort | false | Int32 | `9600` | Port for metrics |
| openTelemetryCollectorAddr | false | String | `null` | Endpoint URL of the OpenTelemetry collector |
| staleDataTimeoutSeconds | false | Int32 | `600` | Data timeouts in seconds |

## Related content

[Configure observability](howto-config-observability.md)
