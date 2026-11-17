---
title: Enable and run management actions
description: Enable management actions on an Azure IoT Operations instance so that you can invoke operations on southbound assets from the cloud or edge, and understand the message flow through the system.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 11/06/2026
ai-usage: ai-assisted

#CustomerIntent: As an IT or OT operator, I want to enable management actions on my Azure IoT Operations instance so that I can invoke operations such as method calls, writes, and reads on southbound assets from the cloud or edge.
---

# Enable and run management actions

Management actions let you invoke operations on southbound assets connected to your Azure IoT Operations instance. You can call methods, write values, and read values on assets such as OPC UA servers, ONVIF cameras, HTTP services, and MQTT devices. The connector receives requests on the MQTT request topic resolved for an action and performs the corresponding operation.

You can invoke actions locally by using MQTT, or from the cloud by using the operations experience, Azure CLI, or Azure Resource Manager APIs. Cloud invocation uses Azure Event Grid and data flows to route requests and responses between Azure Device Registry and the internal MQTT broker. Local MQTT invocation doesn't require this cloud routing infrastructure.

Use the operations experience, Azure CLI, Bicep, or ARM templates to define assets, management groups, and actions. Deploying a definition is separate from invoking an action.

Key features of management actions include: 
- **Management groups** that bundle related actions and properties together.
- **Azure Device Registry namespace mapping** to an Event Grid instance for consistent data routing and management operations.
- **Event Grid–based routing** that provides reliable, event-driven messaging between Azure Resource Manager and Azure IoT Operations.
- **Azure Resource Manager-based invocation** for cloud requests, with ARM templates and Bicep available to deploy or replicate asset and action definitions.
- **RBAC control and managed identity** for access  control.
- **Activity logs** for auditing and monitoring.

When you enable cloud management actions, the Azure CLI provisions the infrastructure that connects Event Grid to the MQTT broker. This infrastructure includes an Event Grid data flow endpoint, a request data flow that uses a WebAssembly (WASM) module to process incoming messages, a response data flow that routes replies back through Event Grid, and the required topic spaces and permission bindings. After the infrastructure is in place, you can execute actions on assets whose connectors support the configured actions.

This article explains how to enable management actions, execute actions on assets, and how the message flow works through the system. The management actions CLI commands are protocol-agnostic. The examples in this article use an OPC UA asset, but the same commands work for any protocol that supports management actions.

> [!NOTE]
> Enable cloud management actions through the Azure CLI before invoking them from the operations experience or CLI. Creating a management group and action doesn't enable cloud routing. For connector-specific configuration and payload requirements, see the relevant connector article.

## Prerequisites

To follow the cloud enablement and execution steps in this article, you need:

[!INCLUDE [prereq-deployed-instance](../includes/prereq-deployed-instance.md)]
- An Event Grid namespace with the MQTT broker enabled and `maximumClientSessionsPerAuthenticationName` set to at least 4. Use the quickstart linked in the next section to create and configure the namespace.
- Permissions to configure the IoT Operations and Azure Device Registry resources, Event Grid topic spaces and permission bindings, and the required Azure role assignments. If an administrator preconfigures the role assignments, use `--skip-ra` when enabling management actions.
- The Azure CLI with the `azure-iot-ops` extension installed. To install or update the extension, run:

  ```azurecli
  az extension add --upgrade --name azure-iot-ops
  ```

## Enable management actions

For a complete end-to-end setup script that creates the Event Grid namespace, device, asset, and enables management actions in one step, see the [management actions quickstart](https://github.com/Azure/azure-iot-ops-cli-extension/blob/v2.11.1/scripts/mgmt-actions/README.md) in the CLI extension repository.

The `az iot ops mgmt-actions enable` command in the quickstart script provisions the management actions infrastructure on your Azure IoT Operations instance. The command creates the following resources:

| Resource | Purpose |
|----------|--------|
| Event Grid topic space | Includes the `actions/requests/` and `actions/responses/` topics for message routing. |
| Event Grid permission bindings | Grants the Azure IoT Operations instance publish and subscribe access to the topic space. |
| Event Grid data flow endpoint | Connects the Azure IoT Operations data flow runtime to the Event Grid namespace. |
| Request data flow graph | Routes messages from Event Grid to the MQTT broker, applying a WASM module to rewrite topic paths. |
| Response data flow | Routes responses from the MQTT broker back to Event Grid. |
| Managed identity | By default, the data flow endpoint uses the existing Azure IoT Operations extension's system-assigned managed identity. You can supply a user-assigned managed identity instead. If the Azure Device Registry namespace doesn't have a system-assigned managed identity enabled, the command enables one for authentication with the Event Grid namespace. |
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
| `--mi-user-assigned` | Full resource ID of a user-assigned managed identity to use for the Event Grid data flow endpoint. If omitted, the Azure IoT Operations extension's system-assigned managed identity is used. |
| `--skip-ra` | Skip role assignment creation during enable. Use this flag only after an administrator preconfigures the required role assignments. |
| `--registry-endpoint` | Name of a registry endpoint to use for downloading the WASM data flow graph artifact. Use this flag if you need a non-default container registry. |

> [!TIP]
> The data flow graph and response data flow might take a few seconds to reconcile after the `enable` command finishes. Run `az iot ops mgmt-actions show` to confirm all sub-resources are available before you execute an action.

## Verify the management actions configuration

After you enable management actions, verify that the configuration is correct and all sub-resources are in place:

```azurecli
az iot ops mgmt-actions show \
    --instance <instance-name> \
    --resource-group <resource-group>
```

The output shows the current state of the management actions infrastructure, including the Event Grid endpoint, data flows, and role assignments.

## Execute a management action

After you enable cloud management actions and configure an asset's management group and action, you can invoke the action from the operations experience or Azure CLI. Use the asset, management group, and action names from your configuration. The connector and action definition determine the required input and response format.

# [Operations experience](#tab/portal)

1. In the [operations experience](howto-use-operations-experience.md), select the instance that contains your asset.

1. Select **Assets** and open the asset.

1. Select the **Management groups** tab, open the group that contains the action, and select the action.

1. Use the action execution control to provide the required input, if any, and execute the action. For payload requirements, refer to the relevant connector article.

1. Review the action status, response, and any error details.

# [Azure CLI](#tab/cli)

Use `az iot ops mgmt-actions execute` with the asset, group, and action names and a JSON payload if required. The command waits for completion and returns the action status, response, and any error details. The following example:

- Uses an asset that the [management actions quickstart](https://github.com/Azure/azure-iot-ops-cli-extension/blob/v2.11.1/scripts/mgmt-actions/README.md) script in the CLI extension repository creates.
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
> If an asset reports a request schema in its status object for the target action, the CLI by default validates the request against the schema before sending it. Use `--show-schema` to see the schema if it exists, and `--no-validate` to disable validation.

> [!TIP]
> The `--payload` parameter supports inline JSON or a local file path that contains the JSON payload. For other payload formats, use an SDK MQTT invoker and follow the [MQTT RPC protocol](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/rpc-protocol.md).

Not all call actions require a payload. For example, the ONVIF `GetDeviceInformation` action doesn't require any input parameters, so you can execute it without a payload:

```azurecli
az iot ops mgmt-actions execute \
    --instance <instance-name> \
    --resource-group <resource-group> \
    --asset onvif-asset \
    --group Device \
    --action GetDeviceInformation
```

The `--show-schema` option retrieves a request schema without executing the action. If no schema is published for the action, the following command returns a `Could not resolve the request schema for action 'GetDeviceInformation'...` error. Normal execution doesn't require a published request schema; the CLI validates a payload only when a schema is available.

```azurecli
az iot ops mgmt-actions execute \
    --instance <instance-name> \
    --resource-group <resource-group> \
    --asset onvif-asset \
    --group Device \
    --action GetDeviceInformation \
    --show-schema
```

---

> [!NOTE]
> A timeout or lost response doesn't prove that the target didn't perform the operation. Check the target's state before retrying an operation that can have side effects.

### Action types

The supported action types and payload requirements depend on the connector and the target asset's management group definition:

- **Call** actions invoke a method on the asset. If the method expects input parameters, the payload contains them.
- **Write** actions write a value to the target URI on the asset. The payload contains the value to write.
- **Read** actions read a value from the target URI. Follow the connector's requirements for the request payload.

For example, the [HTTP/REST connector](howto-use-http-connector.md#configure-and-run-management-actions) uses `Call` for HTTP operations, while the [MQTT connector](howto-use-mqtt-connector.md#add-management-groups-and-actions) uses `Write` to publish command messages. These examples illustrate the capabilities and aren't a complete list. Use the connector article for supported types, configuration, payloads, and response behavior.

For an example of management group definitions, see [Control OPC UA servers](howto-control-opc-ua.md).

## How management actions work

Management actions use two data flows and Azure Event Grid to connect a cloud client to a connector running in the Azure IoT Operations cluster. The following sections describe the request and response message flows in detail.

:::image type="content" source="media/howto-use-management-actions/architecture.svg" alt-text="Diagram that shows the architecture of management actions request and response flows through Event Grid, data flows, MQTT broker, and connector to a southbound asset." lightbox="media/howto-use-management-actions/architecture.png" border="false":::

### Request flow

When you execute a management action, the following sequence occurs:

1. The `az iot ops mgmt-actions execute` command calls the `executeAction` endpoint of the asset in the Azure Device Registry namespace. The namespace then publishes the action request as an MQTT message to the Event Grid namespace, under `actions/requests/<instance-name>/`.

1. The **request data flow** subscribes to the `actions/requests/<instance-name>/#` topic on the Event Grid namespace. When a message arrives, the data flow passes it through a WASM graph module that strips the Event Grid topic prefix and rewrites the topic to the internal MQTT broker format.

1. The processed message is published to the internal MQTT broker on the action's resolved request topic. The sample configuration uses the format `azure-iot-operations/asset-operations/<asset-name>/<management-group>/<action-name>`; other configurations can use different request topics.

1. The connector receives the request on that topic, identifies the target action, and performs the operation defined by the connector.

### Response flow

After the connector processes the request, the following sequence occurs. The meaning of a successful result depends on the connector's operation:

1. The connector publishes a correlated action response to the internal MQTT broker by using the request's response topic. For cloud requests, this topic is under `actions/responses/<instance-name>/`.

1. The **response data flow** subscribes to `actions/responses/<instance-name>/#` on the internal broker and forwards the message to the Event Grid namespace.

1. The Azure Device Registry namespace subscribes to the response topic space in the Event Grid namespace. When the namespace receives the response message, it notifies the original `executeAction` caller to complete the request-response cycle.

For action configuration and response behavior, see the relevant connector article.

## Disable management actions

When you no longer need management actions, disable them to remove the provisioned infrastructure. The disable command removes the data flows, Event Grid topic space, permission bindings, and data flow endpoint:

```azurecli
az iot ops mgmt-actions disable \
    --instance <instance-name> \
    --resource-group <resource-group>
```

## Related content

- [Use media connector mRPC management actions](howto-use-media-connector-actions.md)
- [Control OPC UA servers](howto-control-opc-ua.md)
- [Connect to HTTP/REST endpoints](howto-use-http-connector.md)
- [Connect to MQTT endpoints](howto-use-mqtt-connector.md)
- [Connect to ONVIF-compliant cameras](howto-use-onvif-connector.md)
- [Understand assets and devices](concept-assets-devices.md)
- [Management actions quickstart scripts](https://github.com/Azure/azure-iot-ops-cli-extension/blob/v2.11.1/scripts/mgmt-actions/README.md)
