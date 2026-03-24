---
title: Metrics for the connector for OPC UA
description: Available observability metrics for the connector for OPC UA to monitor the health and performance of your solution.
author: sethmanheim
ms.author: sethm
ms.topic: reference
ms.custom:
  - ignite-2023
ms.date: 10/22/2024

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data
# on the health of my industrial assets and edge environment.
---

# Metrics for the connector for OPC UA

The connector for OPC UA provides a set of observability metrics that you can use to monitor and analyze the health of your solution. This article lists the available metrics for the connector for OPC UA. The following sections group related sets of metrics, and list the name, type, and description for each metric.

## Crosscutting

Emitted by all components: Supervisor, OPC UA Connector, and OPC UA Commander.

> [!div class="mx-tdBreakAll"]
> | Metric name                                                 | Type      | Definition                                                                                |
> | ----------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------- |
> | aio.opc.heartbeat.count                                     | Counter   | The number of heartbeat signals emitted by the component instance.                        |
> | aio.opc.instance.count                                      | Gauge     | The current number of active component instances.                                         |
> | aio.opc.mqtt.message.publishing.retry.count                 | Counter   | The number of times publishing a MQTT message had to be retried.                          |
> | aio.opc.mqtt.message.publishing.failure.count               | Counter   | The number of failed attempts to publish an MQTT message.                                 |
> | aio.opc.mqtt.message.publishing.duration                    | Histogram | The duration of publishing a message to the MQTT broker and receiving an acknowledgement. |
> | aio.opc.mqtt.client.connect.count                           | Counter   | The number of times the MQTT client tried to connect.                                     |
> | aio.opc.mqtt.client.connect.failure.count                   | Counter   | The number of times the MQTT client failed to connect.                                    |
> | aio.opc.mqtt.client.subscription.failure.count              | Counter   | The number of times the MQTT client failed to subscribe to a topic.                       |
> | aio.opc.mqtt.client.disconnect.count                        | Counter   | The number of times the MQTT client disconnected.                                         |
> | aio.opc.mqtt.client.publish.attempt.when.disconnected.count | Counter   | The number of times a publish attempt was made when the MQTT client was disconnected.     |
> | aio.opc.component.shutdown.count                            | Counter   | The number of times the component has shut down.                                          |


## Supervisor

> [!div class="mx-tdBreakAll"]
> | Metric name                         | Type            | Definition                                                                                                                                                              |
> | ----------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | aio.opc.asset.count                 | ObservableGauge | The number of assets that are currently deployed.                                                                                                                       |
> | aio.opc.endpoint.count              | ObservableGauge | The number of asset endpoint profiles that are deployed.                                                                                                                |
> | aio.opc.asset.datapoint.count       | ObservableGauge | The number of datapoints that are defined across all assets.                                                                                                            |
> | aio.opc.asset.event.count           | ObservableGauge | The number of events that are defined across all assets.                                                                                                                |
> | aio.opc.connector.failover.duration | Histogram       | The duration of a connector instance failover. This spans from when the connector was detected as missing until the passive connector instance confirms its activation. |
> | aio.opc.connector.asset.count       | Histogram       | The number of assets assigned per connector instance.                                                                                                                   |
> | aio.opc.connector.endpoint.count    | Histogram       | The number of endpoints assigned per connector instance.                                                                                                                |
> | aio.opc.connector.load              | Histogram       | A number that indicates the load per connector instance.                                                                                                                |
> | aio.opc.schema.connector.count      | Histogram       | The number of connector instances per schema.                                                                                                                           |


## Connector for OPC UA

> [!div class="mx-tdBreakAll"]
> | Metric name                                         | Type            | Definition                                                                                                                                                                                    |
> | --------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | aio.opc.subscription.transfer.count                 | Counter         | The number of times a subscription was transferred.                                                                                                                                           |
> | aio.opc.asset.telemetry.data_change.count           | Counter         | The number of asset data changes that were received.                                                                                                                                          |
> | aio.opc.asset.telemetry.event.count                 | Counter         | The number of asset events that were received.                                                                                                                                                |
> | aio.opc.asset.telemetry.value_change.count          | Counter         | The number of asset value changes that were received.                                                                                                                                         |
> | aio.opc.asset.session.connect.count                 | Counter         | The number of asset session connect events.                                                                                                                                                   |
> | aio.opc.asset.session.disconnect.count              | Counter         | The number of asset session disconnect events.                                                                                                                                                |
> | aio.opc.session.connect.duration                    | Histogram       | The OPC UA session connect duration.                                                                                                                                                          |
> | aio.opc.data_change.processing.duration             | Histogram       | The processing duration of data changes received from an asset. This spans from when the event was received by the connector until a publish acknowledgment is received from the MQTT broker. |
> | aio.opc.event.processing.duration                   | Histogram       | The processing duration of events received from an asset. This spans from when the event was received by the connector until a publish acknowledgment is received from the MQTT broker.       |
> | aio.opc.data_change.delivery_time.duration          | Histogram       | The data changes delivery latency. This is the time between the OPC UA server publishing time and the connector.                                                                              |
> | aio.opc.event_delivery_time.duration                | Histogram       | The event delivery latency. This is the time between the OPC UA server publishing time and the connector.                                                                                     |
> | aio.opc.message.egress.size                         | Histogram       | The number of bytes for telemetry sent by the assets.                                                                                                                                         |
> | aio.opc.method.request.count                        | Counter         | The number of method invocations received.                                                                                                                                                    |
> | aio.opc.method.response.count                       | Counter         | The number of method invocations that have been answered.                                                                                                                                     |
> | aio.opc.mqtt.message.processing.duration            | Histogram       | The duration for the processing of messages received from the MQTT broker (method invocations, writes).                                                                                       |
> | aio.opc.mqtt.queue.ack.size                         | ObservableGauge | The number of incoming MQTT messages with QoS higher than 0 for which the delivery acknowledgement is yet to be sent to the MQTT broker.                                                      |
> | aio.opc.mqtt.queue.notack.size                      | ObservableGauge | The number of incoming MQTT messages with QoS higher than 0 in the acknowledgement queue for which the acknowledgement period timed out due to a delay in acknowledging previous messages.    |
> | aio.opc.output_queue.count                          | ObservableGauge | The number of asset telemetry items (data changes or events) that are queued for publish to the MQTT broker.                                                                                  |


## OPC UA Commander

> [!div class="mx-tdBreakAll"]
> | Metric name                      | Type          | Definition                                                                                |
> | -------------------------------- | ------------- | ----------------------------------------------------------------------------------------- |
> | aio.opc.browse.count             | Counter       | The number of browse calls executed.                                                      |
> | aio.opc.browse.succeeded         | Counter       | The number of browse calls that succeeded.                                                |
> | aio.opc.browse.failed            | Counter       | The number of browse calls that failed.                                                   |
> | aio.opc.browse.nodes.count       | Gauge         | The total number of OPC UA nodes browsed.                                                 |
> | aio.opc.asset.call.count         | Counter       | The number of asset action calls attempted.                                               |
> | aio.opc.method.call.count        | Counter       | The number of OPC UA method calls attempted.                                              |
> | aio.opc.action.count             | Counter       | The number of dataset action calls executed.                                              |
> | aio.opc.action.succeeded         | Counter       | The number of dataset action calls that succeeded fully.                                  |
> | aio.opc.action.failed            | Counter       | The number of dataset action calls that failed at least partially.                        |
> | aio.opc.node.read.count          | Counter       | The number of OPC UA node read calls attempted.                                           |
> | aio.opc.node.read.succeeded      | Counter       | The number of OPC UA node read calls that succeeded.                                      |
> | aio.opc.node.read.failed         | Counter       | The number of OPC UA node read calls that failed.                                         |
> | aio.opc.node.write.count         | Counter       | The number of OPC UA node write calls attempted.                                          |
> | aio.opc.node.write.succeeded     | Counter       | The number of OPC UA node write calls that succeeded.                                     |
> | aio.opc.write.count              | Counter       | The number of explicit write calls executed.                                              |
> | aio.opc.write.succeeded          | Counter       | The number of explicit write calls that succeeded fully.                                  |
> | aio.opc.read.count               | Counter       | The number of dataset read calls executed.                                                |
> | aio.opc.read.succeeded           | Counter       | The number of dataset read calls that succeeded fully.                                    |
> | aio.opc.read.failed              | Counter       | The number of dataset read calls that failed at least partially.                          |
> | aio.opc.syncprops.count          | Counter       | The number of sync properties calls executed.                                             |
> | aio.opc.syncprops.succeeded      | Counter       | The number of sync properties calls that succeeded fully.                                 |
> | aio.opc.syncprops.failed         | Counter       | The number of sync properties calls that failed at least partially.                       |
> | aio.opc.syncprops.total          | Counter       | The total number of properties read from OPC UA and written into Distributed State Store. |
> | aio.opc.managed_service.running  | UpDownCounter | The number of currently running managed services.                                         |
> | aio.opc.managed_service.crashes  | Counter       | The number of managed service crashes.                                                    |
> | aio.opc.managed_service.restarts | Counter       | The number of managed service restarts.                                                   |


## Related content

- [Configure observability](../configure-observability-monitoring/howto-configure-observability.md)
