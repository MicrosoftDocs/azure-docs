---
title: Configure declarative OPC UA WoT onboarding
description: Configure declarative Web of Things (WoT) onboarding by using Thing Descriptions referenced in OPC UA device endpoint configuration.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-opcua-connector
ms.topic: how-to
ms.date: 11/04/2026
ai-usage: ai-assisted

#CustomerIntent: As an OT user, I want to configure declarative OPC UA WoT onboarding so that Azure IoT Operations maintains my server-side assets from device configuration.
---

# Configure declarative OPC UA WoT onboarding

Declarative Web of Things (WoT) onboarding uses Thing Descriptions (TDs) configured on a device's `Microsoft.OpcUa.WoT` inbound endpoint to create assets on an OPC 10100-1 server. The OPC UA Commander applies the TDs when the endpoint is processed. With periodic checks enabled, it reapplies a TD if the server loses the asset or the TD changes.

This article shows you how to configure inline TDs, enable discovery, and manage automatic reapplication. It also describes how to reference a TD stored in Edge Registry [Preview]. For an introduction to WoT connectivity and the alternative on-demand mRPC workflow, see [Configure OPC UA WoT connectivity](howto-configure-opc-ua-web-of-things-connectivity.md).

Declarative onboarding creates assets on the OPC UA server and, optionally, discovery records. It doesn't automatically import those records as Azure IoT Operations assets or start telemetry collection.

## Prerequisites

[!INCLUDE [prereq-deployed-instance](../includes/prereq-deployed-instance.md)]

- Azure IoT Operations 2610 or later, with the connector for OPC UA enabled.
- An OPC UA server that implements OPC 10100-1 v1.00, v1.01, or v1.02 and is reachable from your cluster. The server must support the protocol bindings and TD content that you use. For evaluation, the [OPC PLC simulator](https://github.com/Azure-Samples/iot-edge-opc-plc) supports mock WoT connectivity when started with `--wotcon`; it doesn't connect to physical assets.
- A TD for each asset to onboard. Review [supported TD content](howto-configure-opc-ua-web-of-things-connectivity.md#supported-thing-description-content).
- Certificate trust and authentication configured for the OPC UA server connections. See [Configure OPC UA application authentication](howto-configure-opc-ua-certificates-infrastructure.md).
- `kubectl` configured to access the intended cluster, for checking endpoint health and discovery records.
- For the Azure CLI examples, PowerShell 7 and an `azure-iot-ops` extension version that provides the `az iot ops ns` commands.

[!INCLUDE [prereq-azure-cli](../includes/prereq-azure-cli.md)]

You don't need an MQTT client to apply declarative configuration. An MQTT client is needed only if you later verify telemetry or use mRPC to manage server-side assets.

## Prepare a Thing Description and device endpoints

Use the shared instructions to [prepare a Thing Description](howto-configure-opc-ua-web-of-things-connectivity.md#prepare-a-thing-description) and [configure the device endpoints](howto-configure-opc-ua-web-of-things-connectivity.md#configure-the-device-endpoints). Stop after configuring the endpoints; don't send the mRPC `createAsset` request for the same asset.

The following names are used in the examples in this article:

| Resource | Name |
| --- | --- |
| Device | `line1-opcua-server` |
| WoT configuration endpoint | `wot-endpoint` |
| OPC UA telemetry endpoint | `opcua-telemetry` |
| Server-side WoT asset | `line1-coolant-pump-07` |
| TD file | `coolant-pump.td.json` |

Both endpoints must be on the same device with matching address, authentication, and security settings. The WoT endpoint's `endpointRef` explicitly identifies `opcua-telemetry` as the endpoint to bind discovered assets to. Keep those connection settings when adding declarative configuration.

Run the following commands in the same local PowerShell 7 session. Read the existing endpoint configuration so the examples preserve its security settings and other configuration properties:

```powershell
$resourceGroup = "<RESOURCE_GROUP>"
$instance = "<AIO_INSTANCE_NAME>"
$device = "line1-opcua-server"

$deviceJson = az iot ops ns device show `
  --name $device --instance $instance --resource-group $resourceGroup --output json
if ($LASTEXITCODE -ne 0) { throw "Device read-back failed." }

$savedDevice = $deviceJson | ConvertFrom-Json -AsHashtable
$wotEndpoint = $savedDevice.properties.endpoints.inbound.'wot-endpoint'
if ($null -eq $wotEndpoint -or $wotEndpoint.endpointType -ne 'Microsoft.OpcUa.WoT') {
  throw "Configure the wot-endpoint inbound endpoint before continuing."
}

$wotConfig = $wotEndpoint.additionalConfiguration | ConvertFrom-Json -AsHashtable
if ($null -eq $wotConfig -or $wotConfig.endpointRef -ne 'opcua-telemetry') {
  throw "The WoT endpoint must reference the opcua-telemetry endpoint."
}
```

The `wot` array is supported only on `Microsoft.OpcUa.WoT` endpoints. Adding it to the telemetry endpoint doesn't enable declarative onboarding.

## Choose a Thing Description storage option

| Option | Configuration | Use when | Availability |
| --- | --- | --- | --- |
| Inline TD | Embed the base64-encoded TD in `thingDescriptionRef.inline`. | The TD fits in the endpoint configuration and you want to manage it with the device. | Azure IoT Operations 2610 GA. |
| Edge Registry [Preview] reference | Set `thingDescriptionRef.kind` to `edgeRegistry` and identify a stored TD. | You need to share or version TDs separately from endpoint configuration. | Azure IoT Operations 2610 preview only. |

> [!IMPORTANT]
> Edge Registry integration [Preview] isn't available in the Azure IoT Operations 2610 GA release. Use inline TDs for that release.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Configure declarative onboarding with an inline Thing Description

### Check configuration-size constraints

Inline TDs consume space in the WoT endpoint's `additionalConfiguration`, which is a string containing JSON. Base64 encoding uses approximately one-third more space than the original UTF-8 bytes. Include the JSON structure, all TDs in the `wot` array, and security and discovery settings when estimating the size.

The device resource, including the WoT endpoint's `additionalConfiguration`, must stay within the Azure Resource Manager request limit of about 2 MB and the Kubernetes object-size limit of about 2 MiB. Other device properties and metadata count toward these limits, so keep the configuration well below them.

Encode the TD without line breaks:

```powershell
$tdPath = Join-Path $PWD 'coolant-pump.td.json'
$td = [Convert]::ToBase64String([IO.File]::ReadAllBytes($tdPath))
```

Don't truncate a TD to fit a configuration limit. If the combined configuration is too large, use [on-demand mRPC onboarding](howto-configure-opc-ua-web-of-things-connectivity.md#onboard-an-asset-by-using-mrpc), or use Edge Registry [Preview] references on a release that supports them. mRPC has its own message-size and execution-time limits.

### Embed the Thing Description in the endpoint configuration

Each `wot` entry describes one server-side asset:

| Property | Value |
| --- | --- |
| `assetName` | A valid OPC UA browse name, 1 to 512 characters, unique on the server. |
| `materialize` | `true` to create the asset and upload its TD. The default is `false`, which resolves the reference without creating the asset. |
| `thingDescriptionRef.kind` | `inline`, with this exact casing. |
| `thingDescriptionRef.inline.td` | The base64-encoded UTF-8 JSON TD. |
| `thingDescriptionRef.inline.tdContentType` | `application/td+json`. This is also the default. |

# [Azure CLI](#tab/cli)

Extend the configuration you read earlier. This example replaces the `wot` array with one entry. If the endpoint already manages other assets, keep their entries in the array.

```powershell
$wotConfig.runAssetDiscovery = $true
$wotConfig.wotReapplyInterval = 5
$wotConfig.wot = @(
  @{
    assetName = 'line1-coolant-pump-07'
    materialize = $true
    thingDescriptionRef = @{
      kind = 'inline'
      inline = @{
        td = $td
        tdContentType = 'application/td+json'
      }
    }
  }
)

$config = $wotConfig | ConvertTo-Json -Depth 20 -Compress
[Text.Encoding]::UTF8.GetByteCount($config)
```

The last command reports the UTF-8 byte count of the complete additional configuration, before command-line escaping. Apply it in the next step.

---

### Apply and verify the configuration

# [Azure CLI](#tab/cli)

Update only the WoT endpoint's additional configuration. `--force-string` keeps the value as a JSON-encoded string rather than an object. The example uses the device resource API version used by the OPC UA device template.

```powershell
$escapedConfig = $config -replace '"', '\"'
az resource update `
  --ids $savedDevice.id `
  --api-version 2026-04-01 `
  --set "properties.endpoints.inbound.wot-endpoint.additionalConfiguration=$escapedConfig" `
  --force-string
if ($LASTEXITCODE -ne 0) { throw "WoT endpoint configuration update failed." }
```

The quote escaping is for Azure CLI on Windows. Read back the saved configuration before continuing:

```powershell
$deviceJson = az iot ops ns device show `
  --name $device --instance $instance --resource-group $resourceGroup --output json
if ($LASTEXITCODE -ne 0) { throw "Device read-back failed." }

$savedDevice = $deviceJson | ConvertFrom-Json -AsHashtable
$savedConfig = $savedDevice.properties.endpoints.inbound.'wot-endpoint'.additionalConfiguration | ConvertFrom-Json -AsHashtable
$savedConfig | ConvertTo-Json -Depth 20
```

Check that the `wot` entry, `endpointRef`, discovery settings, and security settings match the intended configuration. Avoid concurrent changes to the device while applying these examples; read it again before making subsequent updates.

---

Cloud-to-cluster synchronization and endpoint processing are asynchronous. In the intended Kubernetes context, check the device's inbound endpoint status:

```powershell
kubectl get devices.namespaces.deviceregistry.microsoft.com line1-opcua-server `
  --namespace azure-iot-operations --output 'jsonpath={.status.endpoints.inbound}'
if ($LASTEXITCODE -ne 0) { throw "Device status read failed." }
```

Verify that both endpoints report `Available`. If the WoT endpoint reports an error or `Degraded`, inspect its message before proceeding. The status can take a few minutes to reflect the latest configuration, and can briefly show a message from an earlier configuration or from discovery. Check it again before acting on it. When `runAssetDiscovery` is `true`, list discovery records:

```powershell
kubectl get discoveredassets.namespaces.deviceregistry.microsoft.com `
  --namespace azure-iot-operations
if ($LASTEXITCODE -ne 0) { throw "Discovered asset listing failed." }
```

Inspect the discovered asset for this device and server-side asset. Confirm that its `deviceRef.endpointName` is `opcua-telemetry` and that the expected TD properties appear as data points. Don't assume that the record contains only those properties; a server can expose additional variables. Discovery records don't by themselves prove telemetry delivery.

## Configure declarative onboarding with Edge Registry [Preview]

> [!IMPORTANT]
> Edge Registry integration is available only in the Azure IoT Operations 2610 preview release. It isn't available in the 2610 GA release.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Instead of embedding a TD, a `wot` entry can reference a TD that's stored in Edge Registry [Preview]. The device configuration then carries a small reference, and the same TD can be shared and versioned centrally. This article covers only the reference in the WoT endpoint configuration. It doesn't describe how to publish a TD to Edge Registry [Preview]; the TD must already exist and be accessible to the Commander.

### Reference a stored Thing Description [Preview]

Set `thingDescriptionRef.kind` to `edgeRegistry` and add an `edgeRegistry` object:

| Property | Type | Behavior |
| --- | --- | --- |
| `thingDescriptionRef.kind` | String | Set to `edgeRegistry`, with this exact casing. |
| `thingDescriptionRef.edgeRegistry.id` | String | Required. The ID of the stored TD. |
| `thingDescriptionRef.edgeRegistry.version` | Integer | Optional. The TD version. Omit to use the latest version. |
| `thingDescriptionRef.edgeRegistry.groupId` | String | Optional. The Edge Registry group that contains the TD. Omit to use the default group of the Azure IoT Operations instance. |

The following `wot` entry references version `1` of a stored TD. The stored TD ID identifies the TD in Edge Registry [Preview], whereas `assetName` identifies the asset to create on the OPC UA server. They aren't interchangeable.

```json
{
  "assetName": "line1-coolant-pump-07",
  "materialize": true,
  "thingDescriptionRef": {
    "kind": "edgeRegistry",
    "edgeRegistry": {
      "id": "urn:contoso:line1:coolant-pump-07",
      "version": 1
    }
  }
}
```

Use this entry in place of the inline entry in the `wot` array, then apply and verify the configuration by using the same steps as for [inline TDs](#embed-the-thing-description-in-the-endpoint-configuration). Keep the endpoint's connection settings, `endpointRef`, and discovery settings unchanged. You can mix inline and Edge Registry [Preview] entries in the same `wot` array.

### Choose a fixed version or the latest version [Preview]

Set `version` to an integer to keep the asset on that version until you change the configuration. Omit `version` to track the latest stored version. Don't use the string `latest`.

When periodic checks are enabled, the Commander resolves the reference again on each check and applies a changed TD. An entry that tracks the latest version can therefore change the server-side asset when a new TD version is published, without a device configuration update. Validate new TD versions before publishing them for assets that track the latest version.

### Verify the reference [Preview]

Check the endpoint health and discovery records as described in [Apply and verify the configuration](#apply-and-verify-the-configuration). Transient Edge Registry [Preview] failures are retried on the next periodic check. A persistent failure sets the WoT endpoint to `Degraded` with reason code `OpcUaConnectorWotThingDescriptionResolveFailed`.

To validate a reference before creating the asset, set `materialize` to `false`. The Commander checks that the referenced TD can be resolved but doesn't create an asset. If no entry has `materialize: true`, resolution runs only when the endpoint is created or updated.

On the GA release, an `edgeRegistry` entry isn't applied, and the WoT endpoint reports `Degraded` with a message that the TD couldn't be resolved from the AIO Edge Registry. Use inline TDs for that release.

## Import the discovered asset and verify telemetry

After discovery, use the shared instructions to [import the discovered asset](howto-configure-opc-ua-web-of-things-connectivity.md#import-the-discovered-asset) and [verify telemetry](howto-configure-opc-ua-web-of-things-connectivity.md#verify-telemetry). The imported asset must use the `Microsoft.OpcUa` telemetry endpoint, not the WoT endpoint.

An `Available` endpoint or asset health state isn't proof of telemetry delivery. Check the configured MQTT dataset destination for the expected property names and values.

## Manage declaratively configured assets

### Configure automatic reapplication

The following properties belong in the WoT endpoint's additional configuration:

| Property | Default | Behavior |
| --- | --- | --- |
| `wotReapplyInterval` | `5` minutes | Interval for checking materialized entries and reapplying a missing asset or changed TD. Set to `0` to check once without repeating. |
| `runAssetDiscovery` | `false` | When `true`, discover materialized assets after application and during periodic checks. |
| `assetDiscoveryInterval` | `0` minutes | When greater than `0` and discovery is enabled, the periodic check uses the shorter of this value and `wotReapplyInterval`. |

Periodic checks require at least one `wot` entry with `materialize: true`. Use a positive `wotReapplyInterval` for automatic recovery, and leave `assetDiscoveryInterval` at `0` unless you need a shorter discovery interval. To request one-time application, set both interval properties to `0`.

> [!IMPORTANT]
> A server can assign new NodeIds whenever the Commander applies a TD. The Commander applies every `materialize: true` entry each time you update the WoT endpoint's configuration, even if that entry's TD hasn't changed. It also applies an entry when a periodic check recreates a missing asset. Periodic checks don't reapply an unchanged TD to an existing asset. The OPC PLC simulator assigns new NodeIds every time it applies a TD. Discovery refreshes the discovered definitions, but an already imported Azure IoT Operations asset keeps its existing `dataSource` values. Its telemetry for those data points stops, while its health can still report `Available`. After each configuration update, compare the discovered asset's `dataSource` values with the imported asset's data points and update stale data points, or use a server that keeps NodeIds stable.

### Update a Thing Description

For an inline TD, edit the source JSON, encode it again, and update the matching `wot` entry. To do so, repeat the steps from reading the endpoint configuration through [applying and verifying it](#apply-and-verify-the-configuration). Preserve the `assetName` to update the same server-side asset. Check endpoint health and the discovery records again.

For Edge Registry [Preview], a pinned reference stays on its version until you update `version` in the endpoint configuration. A reference that tracks the latest version picks up a newly published TD on a subsequent periodic check.

When properties or NodeIds change, review the discovery records and update the data points on any already imported assets. Discovery doesn't automatically change the imported asset's dataset definition. For example, to point an existing data point at a new NodeId, or to add a data point for a new property, run the following command for each data point, using the `dataSource` value from the discovered asset:

```powershell
az iot ops ns asset opcua datapoint add `
  --asset line1-coolant-pump-07 --dataset dataset-0 `
  --instance $instance --resource-group $resourceGroup `
  --name flowRate --data-source "<NEW_NODE_ID>" --replace
if ($LASTEXITCODE -ne 0) { throw "Data point update failed." }
```

### Stop managing or remove an asset

Removing a `wot` entry, setting `materialize` to `false`, or deleting the device doesn't delete the server-side asset. These operations stop declarative materialization, not server-side ownership or telemetry collection for an already imported asset.

To remove an asset completely:

1. Remove its `wot` entry, apply the configuration, and verify that the entry is no longer present in the synchronized device configuration. Otherwise, a periodic check can recreate it.
1. Use the [mRPC `deleteAsset` request](howto-configure-opc-ua-web-of-things-connectivity.md#delete-an-asset-and-clean-up-related-resources) to delete the asset on the server.
1. If no longer needed, delete the imported Azure IoT Operations asset through Azure CLI or the operations experience, and review remaining discovery records. Deleting only Kubernetes copies doesn't establish cleanup of cloud-managed resources.

Manage each server-side asset through one flow. Don't use on-demand updates to maintain a different TD for an asset that is also declaratively managed.

## Troubleshoot declarative onboarding

| Symptom | Check or action |
| --- | --- |
| Azure provisioning succeeded, but no asset appears on the server. | Wait for cloud-to-cluster synchronization and inspect the WoT endpoint's status. Confirm `materialize: true` and a valid `wot` entry on the WoT endpoint, not the telemetry endpoint. |
| The WoT endpoint's status contains an `error` with the message `Invalid Asset Endpoint Profile configuration`. | The configuration doesn't match the schema, so the endpoint isn't processed. Any `healthState` shown with the error is from the previous configuration. The error `details` name the failing property. Check required fields such as `assetName` and `thingDescriptionRef.kind`, their types, and the exact casing of `inline` or `edgeRegistry`. |
| The WoT endpoint is `Degraded` with `OpcUaConnectorWotThingDescriptionResolveFailed`. | Read the message for the failing asset. For example, `Failed to decode the inline WoT Thing Description for asset '<name>'` indicates invalid base64, and `Failed to materialize WoT asset '<name>': BadDecodingError` indicates that the server can't parse the TD. Check base64 encoding, JSON content, server-supported protocol bindings, authentication, certificate trust, and server diagnostics. |
| A reference to Edge Registry [Preview] fails. | Confirm a supported preview release, the TD ID, the integer version if pinned, the group, and that the stored TD is available. In the GA release, use inline TDs instead. |
| No discovery record is created. | Check `runAssetDiscovery: true`, successful materialization, and `endpointRef`. The sibling telemetry endpoint must use matching connection settings. |
| The asset isn't recreated after a server restart. | Check for a `materialize: true` entry and a positive reapplication interval. A one-time configuration doesn't repeat checks. |
| An asset deleted with mRPC reappears. | Remove its declarative entry before deleting the server-side asset. |
| Telemetry stops after an asset is recreated. | Compare the server's current NodeIds and discovery records with the imported asset's `dataSource` values. Update stale data points. |
| The server rejects the TD, but an empty asset remains. | Creation precedes TD upload. Correct and reapply the TD, or remove the declarative entry and explicitly delete the server-side asset. |

Declarative resolution and application failures are reported on the WoT endpoint. The health state clears when all entries resolve and apply successfully, or when the `wot` configuration is removed. Don't interpret clearing the configuration as proof that the server-side assets were deleted.

## Related content

- [Configure OPC UA WoT connectivity](howto-configure-opc-ua-web-of-things-connectivity.md)
- [Configure the connector for OPC UA](howto-configure-opc-ua.md)
- [Configure OPC UA application authentication](howto-configure-opc-ua-certificates-infrastructure.md)
