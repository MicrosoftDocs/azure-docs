---
title: Known Issues 
description: Known issues for Model Context Protocol (MCP), the MQTT broker, connector for OPC UA, OPC PLC simulator, data flows, and operations experience web UI.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: troubleshooting-known-issue
ms.custom: sfi-ropc-nochange
ms.date: 11/11/2026
---

# Known issues for Azure IoT Operations

This article lists the current known issues you might encounter when using Azure IoT Operations. The guidance helps you identify these issues and provides workarounds where available.

For general troubleshooting guidance, see [Troubleshoot Azure IoT Operations](troubleshoot.md).

## MQTT broker issues

This section lists current known issues for the MQTT broker.

### MQTT broker resources aren't visible in the Azure portal

---

Issue ID: 4257

---

Log signature: N/A

---

MQTT broker resources created in your cluster using Kubernetes aren't visible in the Azure portal. This result is expected because [managing Azure IoT Operations components using Kubernetes](tips-tools.md#manage-components-using-kubernetes-deployment-manifests) is for debugging and testing only, and synchronizing resources from the edge to the cloud isn't currently supported.

There's currently no workaround for this issue.


## General connector issues

This section lists current known issues that affect all connectors.

### Uppercase inbound endpoint names prevent device health synchronization

---

Issue ID: 0202

---

Applies to: Azure IoT Operations 2610 public preview, reported on v1.6.0-preview.57 with the connector for ONVIF.

---

Fix planned for release 2612.

---

Log signature: In the Azure portal Activity Log, `Microsoft.DeviceRegistry/namespaces/devices/write` fails with `InvalidRequestContent`:

```output
The request body contains a duplicate JSON key '<endpoint name in lowercase>'. Each property name may appear at most once.
```

---

You can create a device with an inbound endpoint name that contains uppercase letters, but subsequent device status writes fail. Configuration status uses a lowercase endpoint name while runtime status preserves the original casing. Azure rejects the resulting duplicate keys.  

The operations experience can report that the device was created and synchronized while its health remains Unknown. The endpoint's actual health and connectivity errors aren't visible in Azure.

Workaround: Use lowercase letters, digits, and hyphens in inbound endpoint names. For an existing affected device, save its configuration, identify dependent assets and workloads, and plan for interruption before deleting and recreating the device with a lowercase endpoint name. Verify that status writes succeed and health is reported after recreation.

### Connector doesn't detect updates to device credentials in Azure Key Vault

---

Issue ID: 6514

---

N/A

---

Fixed in release 2605 and later

---

The connector doesn't receive a notification when device credentials stored in Azure Key Vault are updated. As a result, the connector continues to use the old credentials until it's restarted.

Workaround: Restart the connector to force it to retrieve the updated credentials from Azure Key Vault.

## Connector for OPC UA issues

This section lists current known issues for the connector for OPC UA.

### Can't use special characters in event names

---

Issue ID: 1532

---

Fixed in version 1.3.36 (2603) and later

---

Log signature: `2025-10-22T14:51:59.338Z aio-opc-opc.tcp-1-68ff6d4c59-nj2s4 - Updated schema information for Boiler#1Notifier skipped!`

---

Schema generation fails if event names contain special characters such as `#`, `%`, or `&`. Avoid using these characters in event names to prevent schema generation issues.

### OPC connector template missing

---

Issue ID: 1330

---

Fixed in version 1.4.73 (2608) and later

---

Log signature: N/A

---

Azure IoT Operations instance deployment should install an **OPC ConnectorTemplate** by default. Following the deployment, the connector template is missing from the Azure portal and the `ConnectorTemplate` resource isn't present in the cluster.

## Connector for media and connector for ONVIF issues

This section lists current known issues for the connector for media and the connector for ONVIF.

### ContinuousMove reports success without moving a camera

---

Issue ID: 0205

---

Applies to: The pre-production operations experience used with Azure IoT Operations public preview. Impact in the production operations experience hasn't been confirmed.

---

Fix planned for release 2612.

---

Log signature: The `PTZ` > `ContinuousMove` action returns `Succeeded` with an empty result:

```json
{"Result": {}}
```

---

The execution form requires **Zoom** > **X** even though `Velocity.Zoom` is optional in the action's request schema. On an affected pan-tilt camera without optical zoom, submitting the form reports success but the camera doesn't move.

Workaround: Invoke the asset's `PTZ` > `ContinuousMove` action through Azure Resource Manager `executeAction` with a payload that includes `PanTilt` but omits `Zoom`. For example, use the following request body, replacing `<media-profile-token>` with a token returned by the camera's `Media` > `GetProfiles` action:

```json
{
  "managementGroupName": "PTZ",
  "managementActionName": "ContinuousMove",
  "payload": {
    "ContinuousMove": {
      "ProfileToken": "<media-profile-token>",
      "Velocity": {
        "PanTilt": {
          "x": 0.3,
          "y": 0
        }
      },
      "Timeout": "PT1S"
    }
  }
}
```

Send `payload` as a JSON object, not as a JSON-encoded string. Use movement values supported by your camera and verify the outcome with `PTZ` > `GetStatus`; an empty successful result alone doesn't confirm movement.

### Media discovery exceeds the discovered-device endpoint limit

---

Issue ID: 5382

---

Applies to: Azure IoT Operations 2610 public preview, reported on v1.6.0-preview.57 with connector for ONVIF v1.6.5.

---

Fix planned for release 2612.

---

Log signature: In the Azure portal Activity Log, `Microsoft.DeviceRegistry/namespaces/discoveredDevices/write` fails with `InvalidRequestContent`, with `MaxProperties` targeting `properties.endpoints.inbound`:

```output
The object must not contain more than 10 properties.
```

---

The connector for ONVIF generates media endpoints for multiple transports per media profile. Azure Device Registry rejects discovered devices that exceed 10 inbound endpoints. A camera with three media profiles can exceed this limit.

The camera's ONVIF endpoint can report Available and its ONVIF discovered asset can appear, but the discovered device containing its media endpoints doesn't appear in Azure. You can't import those endpoints to configure the media connector through discovery.

Workaround: Create a device manually with a `Microsoft.Media` inbound endpoint using the camera's RTSP stream URL from the manufacturer's documentation, such as `rtsp://<camera-ip>:554/<stream-path>`. Configure credentials through the supported secret references, then create the media asset and the snapshot or clip streams that you need. See [Configure the connector for media](../discover-manage-assets/howto-use-media-connector.md).

### Secret sync conflict

---

Issue ID: 0606

---

Log signature: N/A

---

When using secret sync, ensure that secret names are globally unique. If a local secret with the same name exists, connectors might fail to retrieve the intended secret.

## Connector for MQTT issues

### MQTT connector template version mismatch during update

---

Issue ID: 1533

---

Log signature: N/A

---

Fixed in release 2606 and later

---

When updating to version 2605, existing MQTT connector templates may display mismatched metadata versions in the portal. To resolve, delete and recreate the connector template. Alternatively, use the Azure CLI to update the connector.

### MQTT connector can't connect to external MQTT brokers that have private IP addresses

---

Issue ID: 7791

---

Log signature: N/A

---

Fixed in release 2607 and later

---

Starting in release 2605, the MQTT connector can't connect to external MQTT brokers that use private IP addresses.  


## Data flows issues

This section lists current known issues for data flows.

### Upgrade fails with an ACR registry endpoint audience mismatch

---

Issue ID: 3245

---

Log signature: N/A

---

An Azure IoT Operations upgrade can fail and roll back if a data flow graph uses an Azure Container Registry (ACR) registry endpoint with an explicitly configured Azure Resource Manager (ARM) audience or scope. Earlier documentation examples used the ARM audience, so an existing configuration that worked before the upgrade can be affected.

The Dataflows operator logs an audience mismatch error similar to:

```output
audience 'https://management.azure.com/' does not match the expected audience 'https://containerregistry.azure.net'
```

Workaround: Update the existing registry endpoint Azure resource through Azure Resource Manager before retrying the upgrade:

- For system-assigned managed identity authentication, change `properties.authentication.systemAssignedManagedIdentitySettings.audience` from `https://management.azure.com/` to `https://containerregistry.azure.net`.
- For user-assigned managed identity authentication, change `properties.authentication.userAssignedManagedIdentitySettings.scope` from `https://management.azure.com/.default` to `https://containerregistry.azure.net/.default`.

Preserve the other registry endpoint properties and authentication settings. Update the existing resource rather than only changing a local deployment file or omitting an argument from an update command. After the Azure resource and its corresponding cluster configuration reflect the new value, retry the upgrade.

For registry endpoint configuration examples, see [Configure registry endpoints](../develop-edge-apps/howto-configure-registry-endpoint.md).

### Operations experience web UI only displays data flow graph artifacts sourced from Azure Container Registry (ACR) and mcr.microsoft.com

---

Issue ID: 8895

---

Log signature: N/A

---

Even if you configure a container registry endpoint for a non-ACR container registry, like GHCR:

- Data flow graph artifacts from the non-ACR registry don't appear in the operations experience web UI, so you can't create a data flow graph that uses them.

- Selecting a data flow graph from the list of data flows in the operations experience web UI that contains elements from a non-ACR registry produces an error similar to: `Can't load data flow graph. The contents of this data flow graph are unavailable. Please ensure that it still exists, then work with your administrator to get 'AcrPull' access to required registry endpoints.`

Workaround: You have two options:

- If you don't need to use the operations experience UI, use the Azure CLI to perform CRUD operations on data flow graphs defined in JSON or Bicep files that contain artifacts sourced from non-ACR registries.

- If you want to use the operations experience web UI, import data flow artifacts and graphs from non-ACR registries into an ACR registry. To learn more, see [Push modules to your registry](../develop-edge-apps/howto-deploy-wasm-graph-definitions.md#push-modules-to-your-registry).

### Data flow resources created using Kubernetes aren't visible in the operations experience web UI

---

Issue ID: 8724

---

Log signature: N/A

---

Data flow custom resources created in your cluster using Kubernetes aren't visible in the operations experience web UI. This result is expected because [managing Azure IoT Operations components using Kubernetes](tips-tools.md#manage-components-using-kubernetes-deployment-manifests) is for debugging and testing only, and synchronizing resources from the edge to the cloud isn't currently supported.

There's currently no workaround for this issue.

### Can't use the same graph definition multiple times in a chained graph scenario

---

Issue ID: 1352

---

Fixed in version 1.3.36 (2603) and later

---

Failed to send config

---

You create a chained graph scenario by using the output of one data flow graph as the input to another data flow graph. However, if you try to use the same graph definition multiple times in this scenario, it currently doesn't work as expected. For example, the following code fails when using the same graph definition (`graph-passthrough:1.3.6`) for both `graph-1` and `graph-2`.

```bicep
      {
          nodeType: 'Graph'
          name: 'graph-1'
          graphSettings: {
            registryEndpointRef: dataflowRegistryEndpoint.name
            artifact: 'graph-passthrough:1.3.6'
            configuration: []
            }
      }
      {
          nodeType: 'Graph'
          name: 'graph-2'
          graphSettings: {
            registryEndpointRef: dataflowRegistryEndpoint.name
            artifact: 'graph-passthrough:1.3.6'
            configuration: graphConfiguration
            }
      }
  nodeConnections: [
      {
          from: {name: 'source'}
          to: {name: 'graph-1'}
      }
      {
          from: {name: 'graph-1'}
          to: {name: 'graph-2'}
      }
      {
          from: {name: 'graph-2'}
          to: {name: 'destination'}
      }
  ]
```

To solve this error, push the graph definition to the ACR as many times as needed with the scenario with a different name or tag each time. For example, in the scenario described, the graph definition need to be pushed twice with either a different name or a different tag, such as `graph-passthrough-one:1.3.6` and `graph-passthrough-two:1.3.6`.

## Edge registry issues

This section lists current known issues for the edge registry.

### User-assigned identity configuration uses the wrong registry service account

---

Issue ID: 3467

---

Applies to: Azure IoT Operations 2610 public preview. Reported on v1.6.0-preview.57; the CLI mismatch also exists in CLI extension v2.11.2, whose preview deployment profile uses v1.6.0-preview.60.

---

Fix planned for release 2612.

---

Log signature: N/A

---

When you run `az iot ops identity assign --usage schema` on an affected preview instance, the CLI creates a federated credential with the subject `system:serviceaccount:azure-iot-operations:adr-schema-registry`. The preview edge registry runs as service account `aio-edge-registry`, so the credential doesn't match the workload.

The command can report success even though the edge registry's service account has no matching federated credential. The registry can continue using its existing system-assigned identity, masking the configuration mismatch.

Workaround:

1. On the user-assigned managed identity intended for the edge registry, add a federated credential with these values:
   - **Issuer:** The connected cluster's OIDC issuer URL.
   - **Subject:** `system:serviceaccount:azure-iot-operations:aio-edge-registry` for the default namespace. If you use another namespace, substitute the actual namespace.
   - **Audience:** `api://AzureADTokenExchange`.
1. Verify that the credential matches the service account used by the edge registry pod. If you need to restart the preview registry, its StatefulSet is `aio-edge-registry`, not `adr-schema-registry`.

Adding this credential corrects the trust mismatch, but adoption of an identity change by the running registry is separately under investigation. Adding the credential doesn't confirm that the registry has switched identities. Selection among multiple user-assigned identities is also under investigation.

## Management action issues

This section lists current known issues for management actions.

### Event Grid subscription isn't ready immediately after management actions are enabled

---

Issue ID: 0208

---

Applies to: CLI extension v2.11.0 on Azure IoT Operations 2610 public preview, reported on v1.6.0-preview.57.

---

Fix planned for release 2612.

---

Log signature: The data flow pod logs subscription failures, and the Event Grid namespace metric `Mqtt.FailedSubscriptionOperations` reports `Error=AuthorizationError`.

---

The `az iot ops mgmt-actions enable` command creates the request data flow graph before assigning the Event Grid TopicSpaces Publisher and Subscriber roles. The graph can attempt to subscribe before it is authorized. It retries with backoff, and authorization failures can continue briefly after the CLI reports success.

Management actions might not reach the edge until the request graph's subscription succeeds.

Workaround: Wait about a minute after `az iot ops mgmt-actions enable` returns before sending the first action. Check the request graph's logs to confirm that its subscription succeeds. If authorization failures continue, verify the required role assignments and allow extra time for role propagation. Don't automatically replay non-idempotent actions whose execution outcome is unknown.

## Federated identity issues

This section lists current known issues for federated identity.

### Federated identity credential issuer mismatch can cause secret sync authentication failures

---

Issue ID: 1190

---

Fixed in release 2607 and later

---

Log signature: Similar to `AADSTS700211: No matching federated identity record found for presented assertion issuer 'https://northamerica.oic.prod-arc.azure.com/1f5f7baf-633d-4eb5-9be1-8cf1e9c6fcc9/f512e8f6-0c47-48a1-91f3-aeb5422dd766'. Please check your federated identity credential Subject, Audience and Issuer against the presented assertion.`

---

Azure IoT Operations encounters 401 Unauthorized errors when retrieving secrets from Azure Key Vault.

Root cause: The error occurs because the federated identity credential issuer URL doesn't match the issuer (iss) claim in the Kubernetes service account token.

When the `az iot ops secretsync enable` command creates a federated identity credential (FIC) on the user-assigned managed identity that Azure IoT Operations uses to access Azure Key Vault, it sets the FIC issuer URL to the cluster's OIDC issuer URL. In some deployments, this URL includes a trailing slash ('/') that the cluster-issued service account token's iss (issuer) claim omits.

Because the issue affects token exchange during secret retrieval, the failure typically doesn't occur when you run `az iot ops secretsync enable`. Instead, it surfaces later when Azure IoT Operations attempts to access a secret, which can make the root cause difficult to identify.

Workaround: Verify that the issuer URL configured on the federated identity credential doesn't end with a slash. If it does, update the federated identity credential to remove the trailing slash.

You can use the Azure CLI [az identity federated-credential](/cli/azure/identity/federated-credential) commands to view and, if necessary, update the federated identity credential issuer value, for example:

```azurecli
az identity federated-credential show --name <fic-name> --identity-name <managed-identity-name> --resource-group <resource-group-name>

az identity federated-credential update --name <fic-name> --identity-name <managed-identity-name> --resource-group <resource-group> --issuer <new-issuer-url-without-trailing-slash>
```

As a best practice, perform this validation during setup after you run the `az iot ops secretsync enable` command to help avoid potentially difficult-to-diagnose authentication failures later.

## Model Context Protocol (MCP) issues

This section lists current known issues for MCP.

### Deployment with customer-managed certificates fails when MCP is enabled

---

Issue ID: 3314

---

Applies to: Azure IoT Operations 2610 public preview.

---

Fix planned for release 2612.

---

Log signature: N/A

---

When you [bring your own certificate issuer](../deploy-iot-ops/howto-bring-your-own-issuer.md), Azure IoT Operations deployment fails if MCP is enabled. MCP components reference the default certificate issuer and trust bundle instead of your configured resources.

Workaround: To evaluate other Azure IoT Operations features with customer-managed certificates, explicitly set `features.mcp.mode` to `Disabled` in your deployment configuration **before deploying**. MCP is enabled by default. See [Disable MCP](../manage-model-context-protocol/howto-deploy-mcp.md#disable-mcp-optional) for the configuration setting.
