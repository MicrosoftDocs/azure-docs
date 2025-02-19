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
> This setting requires that you modify the Broker resource. It's configured only at initial deployment by using the Azure CLI or the Azure portal. A new deployment is required if Broker configuration changes are needed. To learn more, see [Customize default Broker](./overview-broker.md#customize-default-broker).

By using diagnostic settings, you can configure metrics, logs, and self-check for the MQTT broker.

## Metrics

Metrics provide information about the current and past health and status of the MQTT broker. These metrics are emitted in OpenTelemetry Protocol (OTLP) format. You can convert them to Prometheus format by using an OpenTelemetry Collector and route them to Azure Managed Grafana dashboards by using Azure Monitor managed service for Prometheus. To learn more, see [Configure observability and monitoring](../configure-observability-monitoring/howto-configure-observability.md).

For the full list of metrics available, see [MQTT broker metrics](../reference/observability-metrics-mqtt-broker.md).

## Logs

Logs provide information about the operations performed by the MQTT broker. These logs are available in the Kubernetes cluster as container logs. You can configure them to be sent to Azure Monitor Logs with Container Insights.

To learn more, see [Configure observability and monitoring](../configure-observability-monitoring/howto-configure-observability.md).

## Self-check

The MQTT broker's self-check mechanism is enabled by default. It uses a diagnostics probe and OpenTelemetry (OTel) traces to monitor the broker. The probe sends test messages to check the system's behavior and timing.

The validation process checks if the system works correctly by comparing the test results with expected outcomes. These outcomes include:

- The paths that messages take through the system.
- The system's timing behavior.

The diagnostics probe periodically runs MQTT operations (PING, CONNECT, PUBLISH, SUBSCRIBE, UNSUBSCRIBE) on the MQTT broker and monitors the corresponding ACKs and traces to check for latency, message loss, and correctness of the replication protocol.

> [!IMPORTANT]
> The self-check diagnostics probe publishes messages to the `azedge/dmqtt/selftest` topic. Don't publish or subscribe to diagnostic probe topics that start with `azedge/dmqtt/selftest`. Publishing or subscribing to these topics might affect the probe or self-test checks and result in invalid results. Invalid results might be listed in diagnostic probe logs, metrics, or dashboards. For example, you might see the issue "Path verification failed for probe event with operation type 'Publish'" in the diagnostics-probe logs. For more information, see [Known issues](../troubleshoot/known-issues.md#mqtt-broker).

## Change diagnostics settings

In most scenarios, the default diagnostics settings are sufficient. To override default diagnostics settings for the MQTT broker, edit the `diagnostics` section in the Broker resource. Currently, changing settings is supported only by using the `--broker-config-file` flag when you deploy Azure IoT Operations by using the `az iot ops create` command.

To override, first prepare a Broker configuration file by following the [BrokerDiagnostics](/rest/api/iotoperations/broker/create-or-update#brokerdiagnostics) API reference. For example:

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

Then, deploy IoT Operations by using the `az iot ops create` command with the `--broker-config-file` flag, like the following command. (Other parameters are omitted for brevity.)

```azurecli
az iot ops create ... --broker-config-file <FILE>.json
```

To learn more, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config) and [Broker examples](/rest/api/iotoperations/broker/create-or-update#examples).

## Related content

- [Deploy observability resources and set up logs](../configure-observability-monitoring/howto-configure-observability.md)