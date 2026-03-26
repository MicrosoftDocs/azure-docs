---
title: Enable and run management actions
description: Enable management actions on an Azure IoT Operations instance so that you can invoke operations on southbound assets from the cloud or edge, and understand the message flow through the system.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 03/26/2026
ai-usage: ai-assisted

#CustomerIntent: As an IT or OT operator, I want to enable management actions on my Azure IoT Operations instance so that I can invoke operations such as method calls, writes, and reads on southbound assets from the cloud or edge.
---

# Enable and run management actions

Management actions let you invoke operations on southbound assets connected to your Azure IoT Operations instance. You can call methods, write values, and read values on assets such as OPC UA servers, ONVIF cameras, and MQTT devices. Management actions use Azure Event Grid to route requests and responses between the cloud and the internal MQTT broker. The connector subscribes to a known topic on the internal MQTT broker and then executes the operation on the target asset.

When you enable management actions, the Azure CLI provisions the infrastructure that connects Event Grid to the MQTT broker. This infrastructure includes an Event Grid data flow endpoint, a request data flow that uses a WebAssembly (WASM) module to process incoming messages, a response data flow that routes replies back through Event Grid, and the required topic spaces and permission bindings. After the infrastructure is in place, you can execute actions on any asset that has a management group and action defined.

This article explains how to enable management actions, execute actions on assets, and how the message flow works through the system. The management actions CLI commands are protocol-agnostic. The examples in this article use an OPC UA asset, but the same commands work for any protocol that supports management actions.

## Prerequisites

- A deployed [Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md) instance on an Arc-connected cluster.
- The Azure CLI with the `azure-iot-ops` extension installed. To install or update the extension, run:

  ```azurecli
  az extension add --upgrade -n azure-iot-ops
  ```

## Enable management actions

For a complete end-to-end setup script that creates the Event Grid namespace, device, asset, and enables management actions in one step, see the [management actions quickstart](https://github.com/Azure/azure-iot-ops-cli-extension/blob/v2.4.0/scripts/mgmt-actions/README.md) in the CLI extension repository.

The `az iot ops mgmt-actions enable` command in the quickstart script provisions the management actions infrastructure on your Azure IoT Operations instance. The command creates the following resources:

| Resource | Purpose |
|----------|--------|
| Event Grid topic space | Includes the `actions/requests/` and `actions/responses/` topics for message routing. |
| Event Grid permission bindings | Grants the Azure IoT Operations instance publish and subscribe access to the topic space. |
| Event Grid data flow endpoint | Connects the Azure IoT Operations data flow runtime to the Event Grid namespace. |
| Request data flow graph | Routes messages from Event Grid to the MQTT broker, applying a WASM module to rewrite topic paths. |
| Response data flow | Routes responses from the MQTT broker back to Event Grid. |
| Managed identity | If you don't specify a user-assigned managed identity, the command creates a system-assigned managed identity for the data flow endpoint and Azure Device Registry namespace. If the Azure Device Registry namespace doesn't have a system-assigned managed identity enabled, the `az iot ops mgmt-actions enable` command enables one to allow authentication with the Event Grid namespace. |
| Role assignments | Grants the data flow identity and the Azure Device Registry namespace the required permissions. |
| Management endpoint | A management endpoint for the Azure Device Registry namespace linking it to the Event Grid namespace. |

```azurecli
az iot ops mgmt-actions enable \
    --instance <instance-name> \
    --resource-group <resource-group> \
    --eg-resource-id <event-grid-namespace-resource-id>
```

The following table describes the optional parameters:

| Parameter | Description |
|-----------|-------------|
| `--mi-user-assigned` | Full resource ID of a user-assigned managed identity to use for the Event Grid data flow endpoint. If omitted, the system-assigned managed identity is used. |
| `--skip-ra` | Skip role assignment creation during enable. Use this flag if role assignments were preconfigured or you lack permissions to create them. |
| `--registry-endpoint` | Name of a registry endpoint to use for downloading the WASM data flow graph artifact. Use this flag if you need a non-default container registry. |

> [!TIP]
> The data flow graph and response data flow may take a few seconds to reconcile after the `enable` command completes. Run `az iot ops mgmt-actions show` to confirm all sub-resources are available before you execute an action.

## Verify the management actions configuration

After you enable management actions, verify that the configuration is correct and all sub-resources are in place:

```azurecli
az iot ops mgmt-actions show \
    --instance <instance-name> \
    --resource-group <resource-group>
```

The output shows the current state of the management actions infrastructure, including the Event Grid endpoint, data flows, and role assignments.

## Execute a management action

Run an action on an asset that has a management group and action defined. You specify the asset name, management group, action name, and a JSON payload. The following example:

- Uses an asset that was created by the [management actions quickstart](https://github.com/Azure/azure-iot-ops-cli-extension/blob/mgmt_actions_quickstart/scripts/mgmt-actions/README.md) script in the CLI extension repository.
- Invokes the `Switch` action on the `method-call-asset` asset in the `managementGroup` management group, which calls a method on an OPC UA server to switch a boiler on:

```azurecli
az iot ops mgmt-actions execute \
    --instance <instance-name> \
    --resource-group <resource-group> \
    --asset method-call-asset \
    --group managementGroup \
    --action Switch \
    --payload '{"On": true}'
```

> [!TIP]
> If an asset reports a request schema in its status object for the target action, by default the CLI validates the request against the schema before sending it. Use `--show-schema` to see the schema if it exists, and `--no-validate` to disable validation.

> [!TIP]
> The `--payload` parameter supports inline JSON or a local file path that contains the JSON payload.

Not all call actions require a payload. For example, the ONVIF `GetDeviceInformation` action doesn't require any input parameters, so you can execute it without a payload:

```azurecli
az iot ops mgmt-actions execute \
    --instance <instance-name> \
    --resource-group <resource-group> \
    --asset onvif-asset \
    --group Device \
    --action GetDeviceInformation
```

In this scenario, the following command returns a `Could not resolve the request schema for action 'GetDeviceInformation'...` error because the CLI attempts to validate the request against a non-existent schema:

```azurecli
az iot ops mgmt-actions execute \
    --instance <instance-name> \
    --resource-group <resource-group> \
    --asset onvif-asset \
    --group Device \
    --action GetDeviceInformation \
    --show-schema
```

### Action types

The payload depends on the action type and the target asset's management group definition:

- **Call** actions invoke a method on the asset. If the method expects input parameters, the payload contains them.
- **Write** actions write a value to the target URI on the asset. The payload contains the value to write.
- **Read** actions read a value from the target URI. Use an empty payload `'{}'` for read actions.

For more information about how to define action types in an asset's management group, see [Control OPC UA servers](howto-control-opc-ua.md).

## How management actions work

Management actions use two data flows and Azure Event Grid to connect a cloud client to a connector running in the Azure IoT Operations cluster. The following sections describe the request and response message flows in detail.

:::image type="content" source="media/howto-use-management-actions/architecture.svg" alt-text="Diagram that shows the architecture of management actions request and response flows through Event Grid, data flows, MQTT broker, and connector to a southbound asset." lightbox="media/howto-use-management-actions/architecture.png" border="false":::

### Request flow

When you execute a management action, the following sequence occurs:

1. The `az iot ops mgmt-actions execute` command calls the `executeAction` endpoint of the asset in the Azure Device Registry namespace. The namespace then publishes the action request for the asset as an MQTT message to the Event Grid namespace. The message is published to a topic in the topic space created by the quickstart script, with the asset name, management group, and action name as subtopics.

1. The **request data flow** subscribes to the `actions/requests/<instance-name>/#` topic on the Event Grid namespace. When a message arrives, the data flow passes it through a WASM graph module that strips the Event Grid topic prefix and rewrites the topic to the internal MQTT broker format.

1. The processed message is published to the internal MQTT broker on the topic `azure-iot-operations/asset-operations/<asset-name>/<management-group>/<action-name>`.

1. The connector subscribes to the `azure-iot-operations/asset-operations/` topics on the internal MQTT broker. When it receives the request, it identifies the target asset and executes the operation (call, write, or read) on the southbound asset.

### Response flow

After the southbound asset executes the operation and returns a response to the connector, the following sequence occurs:

1. The connector publishes the action response to the internal MQTT broker on a topic under `actions/responses/<instance-name>/`.

1. The **response data flow** subscribes to `actions/responses/<instance-name>/#` on the internal broker and forwards the message to the Event Grid namespace.

1. The Azure Device Registry namespace subscribes to the response topic space in the Event Grid namespace. When the namespace receives the response message, it notifies the original `executeAction` caller to complete the request-response cycle.

For details on how the connector interacts with OPC UA servers and the supported action types, see [Control OPC UA servers](howto-control-opc-ua.md).

## Disable management actions

When you no longer need management actions, disable them to tear down the provisioned infrastructure. The disable command removes the data flows, Event Grid topic space, permission bindings, and data flow endpoint:

```azurecli
az iot ops mgmt-actions disable \
    --instance <instance-name> \
    --resource-group <resource-group>
```

## Related content

- [Control OPC UA servers](howto-control-opc-ua.md)
- [Connect to MQTT endpoints](howto-use-mqtt-connector.md)
- [Connect to ONVIF-compliant cameras](howto-use-onvif-connector.md)
- [Understand assets and devices](concept-assets-devices.md)
- [Management actions quickstart scripts](https://github.com/Azure/azure-iot-ops-cli-extension/blob/v2.4.0/scripts/mgmt-actions/README.md)
