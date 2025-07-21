---
title: Configure Azure IoT Operations MQTT broker diagnostics settings
description: Learn how to configure diagnostics settings for the Azure IoT Operations MQTT broker, like logs, metrics, self-check, and tracing.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.service: azure-iot-operations
ms.subservice: azure-mqtt-broker
ms.date: 05/15/2025

#CustomerIntent: As an operator, I want to configure diagnostics so that I can monitor MQTT broker communications.
ms.custom:
  - build-2025
---

# Configure MQTT broker diagnostics settings
Set up diagnostic settings to configure metrics, logs, and self-check for the MQTT broker.

> [!IMPORTANT]
> The diagnostics are set on the Broker resource. Configure diagnostics during initial deployment by using the Azure CLI or the Azure portal. If you want to change broker settings, deploy a new broker resource. To learn more, see [Customize default Broker](./overview-broker.md#customize-default-broker).
## Metrics

Metrics show the current and past health and status of the MQTT broker. These metrics use the OpenTelemetry Protocol (OTLP) format. Convert them to Prometheus format with an OpenTelemetry Collector, and route them to Azure Managed Grafana dashboards by using Azure Monitor managed service for Prometheus. To learn more, see [Configure observability and monitoring](../configure-observability-monitoring/howto-configure-observability.md).

For a full list of available metrics, see [MQTT broker metrics](../reference/observability-metrics-mqtt-broker.md).

## Logs

Logs show information about actions the MQTT broker performs. These logs are in the Kubernetes cluster as container logs. Set them up to send to Azure Monitor Logs with Container Insights.

To learn more, see [Configure observability and monitoring](../configure-observability-monitoring/howto-configure-observability.md).

## Self-check

The MQTT broker's self-check mechanism is on by default. It uses a diagnostics probe and OpenTelemetry (OTel) traces to monitor the broker. The probe sends test messages to check system behavior and timing.

The validation process checks if the system works correctly by comparing test results with expected outcomes. These outcomes include:

- The paths messages take through the system.
- System timing behavior.

The diagnostics probe regularly runs MQTT operations (PING, CONNECT, PUBLISH, SUBSCRIBE, UNSUBSCRIBE) on the MQTT broker and monitors the corresponding ACKs and traces to check for latency, message loss, and correctness of the replication protocol.

> [!IMPORTANT]
> The self-check diagnostics probe publishes messages to the `azedge/dmqtt/selftest` topic. Don't publish or subscribe to diagnostic probe topics that start with `azedge/dmqtt/selftest`. Publishing or subscribing to these topics can affect the probe or self-test checks and result in invalid results. Invalid results can be listed in diagnostic probe logs, metrics, or dashboards. For example, you might see the issue "Path verification failed for probe event with operation type 'Publish'" in the diagnostics-probe logs. For more information, see [Known issues](../troubleshoot/known-issues.md#mqtt-broker-issues).
>
> Even though the MQTT broker's [diagnostics](../manage-mqtt-broker/howto-broker-diagnostics.md) produces diagnostics messages on its own topic, you can still get messages from the self-test when you subscribe to the `#` topic. This is a limitation and expected behavior.

## Change diagnostics settings

In most scenarios, the default diagnostics settings are enough. To override the default diagnostics settings for the MQTT broker, edit the `diagnostics` section in the Broker resource. Currently, you can change settings only by using the `--broker-config-file` flag when you deploy Azure IoT Operations with the `az iot ops create` command.

To override, prepare a broker configuration file by following the [BrokerDiagnostics](/rest/api/iotoperations/broker/create-or-update#brokerdiagnostics) API reference. For example:

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

Then, deploy IoT Operations with the `az iot ops create` command and the `--broker-config-file` flag, as shown in the following example. (Other parameters are omitted for brevity.)

```azurecli
az iot ops create ... --broker-config-file <FILE>.json
```

Learn more in [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config) and [Broker examples](/rest/api/iotoperations/broker/create-or-update#examples).

## Related content

- [Deploy observability resources and set up logs](../configure-observability-monitoring/howto-configure-observability.md)