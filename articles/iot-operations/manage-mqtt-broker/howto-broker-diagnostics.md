---
title: Configure Azure IoT Operations MQTT broker diagnostic settings
description: Learn how to configure diagnostic settings for the Azure IoT Operations MQTT broker, like logs, metrics, self-check, and tracing.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.service: azure-iot-operations
ms.subservice: azure-mqtt-broker
ms.date: 11/07/2024

#CustomerIntent: As an operator, I want to configure diagnostics so that I can monitor MQTT broker communications.
---

# Configure MQTT broker diagnostic settings

> [!IMPORTANT]
> This setting requires modifying the Broker resource and can only be configured at initial deployment time using the Azure CLI or Azure Portal. A new deployment is required if Broker configuration changes are needed. To learn more, see [Customize default Broker](./overview-broker.md#customize-default-broker).

Diagnostic settings allow you to enable metrics and tracing for MQTT broker.

- Logs provide information about the operations performed by MQTT broker.
- Metrics provide information about the resource utilization and throughput of MQTT broker.
- Self-check periodically checks the health of MQTT broker by running a set of diagnostic tests.
- Tracing provides detailed information about the requests and responses handled by MQTT broker.

## Change diagnostic settings

In most scenarios, the default diagnostic settings are sufficient. To override default diagnostic settings for MQTT broker, edit the `diagnostics` section in the Broker resource. Currently, changing settings is only supported using the `--broker-config-file` flag when you deploy the Azure IoT Operations using the `az iot ops create` command. 

To override, first prepare a Broker config file following the [BrokerDiagnostics](/rest/api/iotoperations/broker/create-or-update#brokerdiagnostics) API reference. For example:

```json
{
  "diagnostics": {
    "logs": {
      "level": "debug"
    },
    "metrics": {
      "prometheusPort": 9600
    },
    "selfCheck": {
      "mode": "Enabled",
      "intervalSeconds": 30,
      "timeoutSeconds": 15
    },
    "traces": {
      "mode": "Enabled",
      "cacheSizeMegabytes": 16,
      "selfTracing": {
        "mode": "Enabled",
        "intervalSeconds": 30
      },
      "spanChannelCapacity": 1000
    }
  }
}
```

Then, deploy Azure IoT Operations using the `az iot ops create` command with the `--broker-config-file` flag, like the following command (other parameters omitted for brevity):

```azurecli
az iot ops create ... --broker-config-file <FILE>.json
```

The self-test diagnostics probe publishes messages to the `azedge/dmqtt/selftest` topic. You shouldn't publish or subscribe to this topic as it's used for internal diagnostics. For more information, see [Known Issues](../troubleshoot/known-issues.md#mqtt-broker).

To learn more, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config) and [Broker examples](/rest/api/iotoperations/broker/create-or-update#examples).

## Next steps

- [Deploy observability resources and set up logs](../configure-observability-monitoring/howto-configure-observability.md)