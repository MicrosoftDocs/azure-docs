---
title: Configure OPC UA sessions and high availability
description: Configure shared sessions and high availability for endpoints that use the connector for OPC UA, and plan capacity and failover behavior.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-opcua-connector
ms.topic: how-to
ms.date: 08/05/2026
ai-usage: ai-assisted

#CustomerIntent: As an industrial operations administrator, I want to configure OPC UA session sharing and connector redundancy so that I can balance server resource use, failure isolation, and telemetry availability.
---

# Configure OPC UA sessions and high availability

The connector for OPC UA opens sessions with OPC UA servers to collect data for your assets. You can configure how assets share these sessions and whether a redundant connector instance is available to take over after a failure.

High availability for the connector for OPC UA is available starting with Azure IoT Operations release 2607.

> [!NOTE]
> Session sharing and high availability control how the connector opens and fails over data sessions. To monitor whether an OPC UA server is alive, use [server heartbeat monitoring](concept-opc-ua-server-heartbeat-monitoring.md), which uses a separate monitoring session and reports inbound endpoint health independently of session sharing and high availability.

This article shows you how to:

- Choose between dedicated and shared OPC UA sessions.
- Enable high availability for an OPC UA inbound endpoint.
- Plan connector capacity and OPC UA server sessions.
- Verify failover by using health information and metrics.

For the basic device, endpoint, and asset configuration workflow, see [Configure OPC UA assets and devices](howto-configure-opc-ua.md).

## Prerequisites

[!INCLUDE [prereq-deployed-instance](../includes/prereq-deployed-instance.md)]

- Your Azure IoT Operations instance has the connector for OPC UA enabled.
- A namespaced device with an OPC UA inbound endpoint. To create one, see [Create a device](howto-configure-opc-ua.md#create-a-device).
- An OPC UA server that the connector can reach.
- To enable high availability with the fastest failover, the OPC UA server must support two concurrent sessions per active and passive pair: two sessions per asset in dedicated mode or two sessions per endpoint in shared mode.

## Choose a session and availability mode

Session sharing and high availability control different aspects of an inbound endpoint:

- The `shared` setting controls whether assets that reference the endpoint use separate sessions or one shared session.
- The `highAvailability` setting controls whether one connector instance or an active and passive pair serves the endpoint.

Both settings are `false` by default. Choose a mode based on your OPC UA server limits and availability requirements:

| Mode | Endpoint settings | OPC UA sessions | Use when |
| --- | --- | --- | --- |
| Dedicated | `shared: false`, `highAvailability: false` | One session per asset | You want failure isolation between assets and don't need connector redundancy. |
| Shared | `shared: true`, `highAvailability: false` | One session per endpoint | The server has a low session limit or you want to reduce connection resource use. A session failure affects all assets on the endpoint. |
| Dedicated with high availability | `shared: false`, `highAvailability: true` | An active and passive session per asset | Telemetry availability and asset isolation are more important than minimizing server sessions and connector resources. |
| Shared with high availability | `shared: true`, `highAvailability: true` | An active and passive session per endpoint | You need connector redundancy and must limit server sessions. A shared-session failure affects all assets on the endpoint. |

> [!IMPORTANT]
> You can combine shared sessions and high availability, but the connector logs a warning because sharing increases the impact of a session failure. Use separate shared and dedicated endpoints when different assets have different availability or isolation requirements.

## Configure dedicated or shared sessions

By default, every asset opens a dedicated OPC UA session. Dedicated sessions isolate asset connection failures, but they consume more sessions and other resources on the OPC UA server.

When you set `shared` to `true` on an inbound endpoint, all assets that reference that endpoint use one OPC UA session. Telemetry payloads, MQTT topics, and message schemas don't change.

When you create an OPC UA inbound endpoint in the operations experience, select **Shared** on the **Advanced** page of the endpoint configuration to use shared mode.

To enable a shared session by using Bicep, add the `shared` property to the inbound endpoint's `additionalConfiguration`. The following example shows the relevant device endpoint configuration:

```bicep
inbound: {
  'my-opcua-endpoint': {
    endpointType: 'Microsoft.OpcUa'
    address: 'opc.tcp://my-plc.my-namespace:4840'
    authentication: {
      method: 'Anonymous'
    }
    additionalConfiguration: string({
      shared: true
    })
  }
}
```

You can also set shared mode when you create an endpoint by using the Azure CLI:

```azurecli
az iot ops ns device endpoint inbound add opcua \
  --device my-opcua-device \
  --instance {your instance name} \
  --resource-group {your resource group name} \
  --name my-opcua-endpoint \
  --endpoint-address "opc.tcp://my-plc.my-namespace:4840" \
  --shared true
```

To return to dedicated sessions, set `shared` to `false` and update the device. The connector closes the shared session, requeues the affected assets, and opens a dedicated session for each asset. Expect a brief interruption in telemetry.

You can use separate inbound endpoints for different session modes, even when the endpoints connect to the same OPC UA server. Set `shared` independently on each endpoint, and use the asset's `deviceRef.endpointName` property to select an endpoint.

> [!NOTE]
> The `shared` setting is supported on legacy `AssetEndpointProfile` resources. For new deployments, use namespaced device and asset resources.

## Configure high availability

High availability runs two connector instances for an inbound endpoint:

- The active instance establishes sessions, subscriptions, and monitored items, publishes telemetry, and reports health.
- The passive instance establishes standby sessions and receives session and subscription information from the active instance. It doesn't create subscriptions or monitored items, publish telemetry, or report asset, device, and inbound endpoint health while it remains passive.

The instances use the [leader election client from the Azure IoT Operations SDK](https://azure.github.io/iot-operations-sdks/dotnet/api/Azure.Iot.Operations.Services.LeaderElection.html) to select the active instance. The active instance renews a two-second leadership lease every second. A graceful shutdown releases the lease immediately. If the active instance becomes unavailable without releasing the lease, the passive instance can become active after the lease expires.

Configure high availability for each inbound endpoint. Assets inherit the availability behavior of the endpoint that they reference. There's no asset-level high-availability setting.

> [!NOTE]
> Azure IoT Operations CLI extension version 2.8.0 for release 2607 doesn't expose a dedicated high-availability argument. Use the device resource's `additionalConfiguration` to set this property.

Set `highAvailability` to `true` in the inbound endpoint's `additionalConfiguration`. For example:

```bicep
inbound: {
  'my-opcua-endpoint': {
    endpointType: 'Microsoft.OpcUa'
    address: 'opc.tcp://my-plc.my-namespace:4840'
    authentication: {
      method: 'Anonymous'
    }
    additionalConfiguration: string({
      highAvailability: true
    })
  }
}
```

The equivalent Kubernetes device resource looks like the following example:

```yaml
apiVersion: namespaces.deviceregistry.microsoft.com/v1
kind: Device
metadata:
  name: my-ha-plc
  namespace: azure-iot-operations
spec:
  enabled: true
  endpoints:
    inbound:
      my-opcua-endpoint:
        address: opc.tcp://my-plc.my-namespace:4840
        endpointType: Microsoft.OpcUa
        authentication:
          method: Anonymous
        additionalConfiguration: |
          {
            "highAvailability": true
          }
```

To combine shared sessions and high availability, set both properties:

```bicep
additionalConfiguration: string({
  shared: true
  highAvailability: true
})
```

As described in [Choose a session and availability mode](#choose-a-session-and-availability-mode), this combination reduces server session use but increases the effect of a shared-session failure.

> [!IMPORTANT]
> The `highAvailability` setting is supported only on namespaced device inbound endpoints. If you add the setting to a legacy `AssetEndpointProfile` resource, the connector ignores it.

## Plan connector and server capacity

High availability uses twice the connector compute, memory, and OPC UA session resources for the selected endpoints. The passive instance establishes sessions before failover so that the server allocates the connection resources in advance.

The connector supervisor uses the following connector deployment settings to distribute endpoint load. These settings aren't properties of the device resource:

| Setting | Applies to | Behavior |
| --- | --- | --- |
| `MaxDataPointsPerSecond` | Endpoints without high availability | Limits the data-point rate assigned to each nonredundant connector instance. |
| `MaxHighAvailableDataPointsPerSecond` | Endpoints with high availability | Limits the data-point rate assigned to each high-availability connector pair. |
| `MaxNumberOfDeployments` | All connector deployments | Sets the maximum number of deployments that the supervisor can create. The supervisor doesn't create more deployments after it reaches this limit, even when more capacity is required. |

The `highAvailability` endpoint setting opts the endpoint into high availability. It doesn't set connector capacity. The supervisor selects the appropriate data-point limit and creates connector deployments as load increases, up to `MaxNumberOfDeployments`.

Before you enable high availability:

1. Confirm that the OPC UA server has enough sessions for both active and passive instances.
1. Account for twice the connector compute and memory resources for high-availability endpoints.
1. Account for the deployment limit when you estimate how many connector pairs the supervisor can create.
1. Size each OPC UA subscription queue to buffer at least the failover window. As a starting point, make the combination of queue size and publishing interval cover approximately five seconds.

If the server supports only one session, the passive connector can't establish its session in advance. The passive instance connects after it becomes active, which increases recovery time and can cause data loss. The inbound endpoint health reports `Degraded` while the redundant session isn't available.

## Understand failover behavior

When the passive connector becomes the leader, it tries to resume publishing in this order:

1. Transfer the previous active instance's complete OPC UA session, including subscriptions and monitored items, to the new active instance.
1. If session transfer isn't possible, transfer the subscriptions to the session that the passive instance established earlier.
1. If neither transfer succeeds, create new subscriptions and monitored items.

The connector requests the OPC UA server to resend buffered subscription data after a successful transfer. If the connector must create new subscriptions, or if the server queue can't hold all samples during the failover window, telemetry data can be lost.

If a connector loses leadership while its process is still running, it exits instead of returning to passive operation. The deployment replaces it with a new passive instance.

## Verify high availability

Verify the configuration during a planned maintenance window before you rely on it in production:

1. Confirm that the endpoint and its assets report healthy states and that asset telemetry reaches the configured MQTT topic.
1. Confirm that two connector instances serve the high-availability endpoint and both can establish the required OPC UA server sessions.
1. Cause a planned restart of the active connector instance by using your standard Kubernetes maintenance procedure.
1. Confirm that telemetry resumes within the expected failover window and that the endpoint and asset health return to healthy states.
1. Check the failover metrics to determine which recovery path the connector used and whether leadership was lost unexpectedly.

Only the active connector reports asset, device, and inbound endpoint health. The passive connector's lack of health reports doesn't indicate that the endpoint is unavailable.

Use the following metrics to monitor failover:

| Metric | Meaning |
| --- | --- |
| `aio.opc.connector.failover.duration` | Time from detecting the missing connector until the passive instance confirms activation. |
| `aio.opc.session.transfer.count` | Number of successful OPC UA session transfers. |
| `aio.opc.subscription.transfer.count` | Number of successful subscription transfers. |
| `aio.opc.leaderelection.leadership.lost.count` | Number of times an instance lost leadership without a graceful shutdown. |

For the general connector metric reference, see [Metrics for the connector for OPC UA](../reference/observability-metrics-opcua-broker.md).

## Disable high availability

To disable high availability for an endpoint, set `highAvailability` to `false` in `additionalConfiguration` and update the device:

```bicep
additionalConfiguration: string({
  highAvailability: false
})
```

When no inbound endpoints in the Azure IoT Operations instance use high availability, the supervisor removes the redundant connector deployment.

## Related content

- [Understand the connector for OPC UA](overview-opc-ua-connector.md)
- [Configure OPC UA assets and devices](howto-configure-opc-ua.md)
- [Metrics for the connector for OPC UA](../reference/observability-metrics-opcua-broker.md)