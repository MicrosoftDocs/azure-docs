---
title: Configure Azure IoT MQ diagnostic settings
# titleSuffix: Azure IoT MQ
description: How to configure Azure IoT MQ diagnostic settings.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 10/27/2023

#CustomerIntent: As an operator, I want to understand availability and scale options for MQTT broker.
---

# Configure Azure IoT MQ diagnostic settings

Diagnostic settings allow you to enable metrics and tracing for Azure IoT MQ broker.

- Metrics provide information about the resource utilization and throughput of IoT MQ broker.
- Tracing provides detailed information about the requests and responses handled by IoT MQ broker.

To override default diagnostic settings for IoT MQ broker, update the `spec.diagnostics` section in  the Broker CR. You also need to specify the diagnostic service endpoint, which is the address of the service that collects and stores the metrics and traces. The default endpoint is `azedge-diagnostics-service:9700`.

You can also adjust the log level of IoT MQ broker to control the amount and detail of information that's logged. The log level can be set for different components of IoT MQ broker. The default log level is `info`.

If not specified, default values are used. The following table shows the properties of the broker diagnostic settings and all default values.

| Name                                       | Required | Format           | Default| Description                                              |
| ------------------------------------------ | -------- | ---------------- | -------|----------------------------------------------------------|
| brokerRef                                | true     | String           |N/A     |The associated broker                          |
| diagnosticServiceEndpoint                | true     | String           |N/A     |An endpoint to send metrics/ traces to                    |
| enableMetrics                            | false    | Boolean          |true    |Enable/ disable broker metrics                            |
| enableTracing                            | false    | Boolean          |true    |Enable/ disable tracing in broker                         |
| logLevel                                 | false    | String           | `info` |Log level. `trace`, `debug`, `info`, `warn`, or `error`   |
| enableSelfCheck                          | false    | Boolean          |true    |Component that periodically probes the health of broker   |
| enableSelfTracing                        | false    | Boolean          |true    |Automatically trace incoming messages at a frequency of 1 every `selfTraceFrequencySeconds`  |
| logFormat                                | false    | String           | `text` |log format in `json` or `text`                         |
|metricUpdateFrequencySeconds              |false     | Integer          | 30   |The frequency metrics are sent to the diagnostics service endpoint in seconds. |
|selfCheckFrequencySeconds                 |false    | Integer          | 30  |How often the probe sends test messages|
|selfCheckTimeoutSeconds                  |false    | Integer          |  15    |Timeout for probe messages  |
|selfTraceFrequencySeconds                 |false    |Integer          |30      |How often external messages are automatically traced if `enableSelfTracing` is true |  
|spanChannelCapacity                      |false    |Integer          |1000    |Maximum number of spans that selftest stores before sending to diagnostics service     |  
|probeImage                                |true      |String            | e4kpreview.azurecr.io/diagnostics-probe:0.1.0| Image used for self check |

<!-- Optionally, you can enable self-check for IoT MQ broker, which is a mechanism that periodically probes the health and readiness of IoT MQ broker. If self-check is enabled, IoT MQ broker doesn't start serving requests until it passes the probe. However, self-check is currently unstable and may cause IoT MQ broker deployment to hang indefinitely. Therefore, it is recommended to disable self-check by setting `enableSelfCheck: false`. -->

Here's an example of a *Broker* CR with metrics and tracing enabled and self-check disabled:

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: Broker
metadata:
  name: "my-broker"
  namespace: default
spec:
  mode: auto
  diagnostics:
    diagnosticServiceEndpoint: azedge-diagnostics-service:9700
    enableMetrics: true  
    enableTracing: true
    enableSelfCheck: false
    logLevel: debug,hyper=off,kube_client=off,tower=off,conhash=off,h2=off
```

## Diagnostics service

Azure IoT MQ includes a diagnostics service that periodically self tests Azure IoT MQ components and emits metrics. Operators can use these metrics to monitor the health of the system. The diagnostics service has a Prometheus endpoint for metrics.

The diagnostics service emits service level indicators (SLI) that are the actual metric values from Azure IoT MQ measurements. You can use these SLIs to define service level objectives (SLO) that are the targets to meet. The SLIs are used to assess if meeting SLOs. You can define SLOs based on SLI metrics.

### What's supported

| Feature | Supported |
| --- | --- |
| Metrics | Supported |
| Traces | Supported |
| Logs | Supported |
| SLI metrics | Supported |
| Prometheus endpoint | Supported |
| Grafana dashboard for metrics, traces and logs | Supported |

### Diagnostics service configuration

The diagnostics service processes and collates diagnostic signals from various Azure IoT MQ core components. You can configure it using a custom resource definition (CRD). The following table lists its properties.

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

[Configure observability](../monitor/howto-configure-observability.md)