---
title: Configure Azure IoT Operations MQTT broker diagnostics settings
description: Learn how to configure diagnostics settings for the Azure IoT Operations MQTT broker, like logs, metrics, self-check, and tracing.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.service: azure-iot-operations
ms.subservice: azure-mqtt-broker
ms.date: 11/14/2024

#CustomerIntent: As an operator, I want to configure diagnostics so that I can monitor MQTT broker communications.
---

# Configure MQTT broker diagnostics settings

> [!IMPORTANT]
> This setting requires modifying the Broker resource and can only be configured at initial deployment time using the Azure CLI or Azure Portal. A new deployment is required if Broker configuration changes are needed. To learn more, see [Customize default Broker](./overview-broker.md#customize-default-broker).

Diagnostic settings allow you to configure metrics, logs, and self-check for the MQTT broker.

## Metrics

Metrics provide information about the current and past health and status of the MQTT broker. These metrics are emitted in OpenTelemetry format (OTLP). They can be converted to Prometheus format using an OpenTelemetry Collector and routed to Azure Managed Grafana Dashboards using Azure Monitor Managed Service for Prometheus. To learn more, see [Configure observability and monitoring](../configure-observability-monitoring/howto-configure-observability.md).

For the full list of metrics available, see [MQTT broker metrics](../reference/observability-metrics-mqtt-broker.md).

## Logs

Logs provide information about the operations performed by MQTT broker. These logs are available in the Kubernetes cluster as container logs. They can be configured to be sent to Azure Monitor Logs with Container Insights.

To learn more, see [Configure observability and monitoring](../configure-observability-monitoring/howto-configure-observability.md).

## Self-check

The MQTT broker's self-check mechanism is enabled by default. It uses a diagnostics probe and OpenTelemetry (OTel) traces to monitor the broker. The probe sends test messages to check the system's behavior and timing.

The validation process checks if the system works correctly by comparing the test results with expected outcomes. These outcomes include:

1. The paths messages take through the system.
2. The system's timing behavior.

The diagnostics probe periodically executes MQTT operations (PING, CONNECT, PUBLISH, SUBSCRIBE, UNSUBSCRIBE) on the MQTT broker and monitors the corresponding ACKs and traces to check for latency, message loss, and correctness of the replication protocol.

> [!IMPORTANT]
> The self-check diagnostics probe publishes messages to the `azedge/dmqtt/selftest` topic. Don't publish or subscribe to diagnostic probe topics that start with `azedge/dmqtt/selftest`. Publishing or subscribing to these topics might affect the probe or self-test checks resulting in invalid results. Invalid results might be listed in diagnostic probe logs, metrics, or dashboards. For example, you might see the issue *Path verification failed for probe event with operation type 'Publish'* in the diagnostics-probe logs. For more information, see [Known Issues](../troubleshoot/known-issues.md#mqtt-broker).

## Change diagnostics settings

In most scenarios, the default diagnostics settings are sufficient. To override default diagnostics settings for MQTT broker, edit the `diagnostics` section in the Broker resource. Currently, changing settings is only supported using the `--broker-config-file` flag when you deploy the Azure IoT Operations using the `az iot ops create` command. 

To override, first prepare a Broker config file following the [BrokerDiagnostics](/rest/api/iotoperations/broker/create-or-update#brokerdiagnostics) API reference. For example:

```json
{
  "diagnostics": {
    "metrics": {
      "prometheusPort": 9600
    },
      "logs": {
        "level": "debug"
      },
    "traces": {
      "mode": "Enabled",
      "cacheSizeMegabytes": 16,
      "selfTracing": {
        "mode": "Enabled",
        "intervalSeconds": 30
      },
      "spanChannelCapacity": 1000
    },
    "selfCheck": {
      "mode": "Enabled",
      "intervalSeconds": 30,
      "timeoutSeconds": 15
    }
  }
}
```

Then, deploy Azure IoT Operations using the `az iot ops create` command with the `--broker-config-file` flag, like the following command (other parameters omitted for brevity):

```azurecli
az iot ops create ... --broker-config-file <FILE>.json
```

To learn more, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config) and [Broker examples](/rest/api/iotoperations/broker/create-or-update#examples).

## Next steps

- [Deploy observability resources and set up logs](../configure-observability-monitoring/howto-configure-observability.md)