---
title: Configure OPC UA WoT connectivity
description: Configure Web of Things (WoT) connectivity for the connector for OPC UA in Azure IoT Operations.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-opcua-connector
ms.topic: how-to
ms.date: 11/05/2026
ai-usage: ai-assisted

#CustomerIntent: As an OT user, I want to configure OPC UA WoT connectivity so that applications can interact with my OPC UA assets.
---

# Configure OPC UA WoT connectivity

Web of Things (WoT) connectivity lets you onboard assets that don't natively support OPC UA, such as Modbus pumps or S7 PLCs, through an OPC UA server that implements the [OPC 10100-1 WoT Connectivity API](https://reference.opcfoundation.org/specs/OPC-10100-1/v1.02/6.3). You describe each asset in a [W3C WoT Thing Description (TD)](https://www.w3.org/TR/wot-thing-description11/). Azure IoT Operations sends the TD to the server, which configures connectivity to the physical asset and exposes its properties as OPC UA variables.

WoT connectivity uses two inbound endpoints on a device:

- A `Microsoft.OpcUa.WoT` endpoint for configuration. The OPC UA Commander uses this endpoint to create and manage assets on the server.
- A `Microsoft.OpcUa` endpoint for telemetry. After you import a discovered asset, the connector for OPC UA uses this endpoint to read its variables and publish telemetry to the MQTT broker. The WoT endpoint itself doesn't carry telemetry.

This article starts with an on-demand workflow that uses MQTT remote procedure calls (mRPC) to:

- Send a TD to the server and create or update an asset.
- Discover the asset's variables and import the discovered asset into Azure IoT Operations.
- Verify telemetry and manage the server-side asset.

You can also configure declarative onboarding, which applies TDs from the device endpoint configuration and periodically reapplies them when needed. For TD storage options and the declarative workflow, see [Configure declarative OPC UA WoT onboarding](howto-configure-opc-ua-web-of-things-declarative-onboarding.md).

If your assets already expose OPC UA, you don't need WoT connectivity. Instead, see [Configure the connector for OPC UA](howto-configure-opc-ua.md).

## Prerequisites

[!INCLUDE [prereq-deployed-instance](../includes/prereq-deployed-instance.md)]

- Your instance runs Azure IoT Operations 2610 or later and has the connector for OPC UA enabled.
- An OPC UA server that implements OPC 10100-1 v1.00, v1.01, or v1.02 and is reachable from your cluster. The server must support the protocol bindings used in your TDs. To use the `connectionTest` mRPC method, the server must also implement the optional `ConnectionTest` method introduced in v1.01.
  - For evaluation, you can use the [OPC PLC simulator](https://github.com/Azure-Samples/iot-edge-opc-plc) with the `--wotcon` option. Its mock WoT Connectivity implementation exposes TD properties as simulated OPC UA variables; it doesn't connect to physical assets.
- A TD for each asset that you want to onboard. For supported content and encoding instructions, see [Prepare a Thing Description](#prepare-a-thing-description).
- An in-cluster MQTT client that supports MQTT v5, can authenticate to the Azure IoT Operations MQTT broker, and has permission to publish requests and subscribe to responses. For client setup, see [Test connectivity to the MQTT broker with MQTT clients](../manage-mqtt-broker/howto-test-connection.md).
- To inspect device and asset status in the cluster, `kubectl` installed and configured to access the cluster.

[!INCLUDE [prereq-azure-cli](../includes/prereq-azure-cli.md)]

For the Azure CLI examples, use an `azure-iot-ops` extension version that provides the `az iot ops ns` commands. To check your installed extension version, run:

```azurecli
az extension show --name azure-iot-ops --query version -o tsv
```

## Choose an onboarding approach

Choose how to deliver the TD to the OPC UA Commander and whether Azure IoT Operations should automatically reapply it. Both on-demand and declarative onboarding create assets on the OPC UA server. You then import the discovered assets into Azure IoT Operations to collect telemetry.

| Approach | How the TD is delivered | Use when | Availability |
| --- | --- | --- | --- |
| [On-demand mRPC](#onboard-an-asset-by-using-mrpc) | Each `createAsset` request carries the base64-encoded TD in its payload. | Tooling or automation controls when assets are created or updated, or the TD doesn't fit in the endpoint configuration. | Azure IoT Operations 2610 GA. |
| [Declarative with an inline TD](howto-configure-opc-ua-web-of-things-declarative-onboarding.md#configure-declarative-onboarding-with-an-inline-thing-description) | The base64-encoded TD is embedded in the WoT endpoint's `additionalConfiguration`. | The TD fits within the configuration-size limits and you want Azure IoT Operations to maintain the server-side asset from device configuration. | Azure IoT Operations 2610 GA. |
| [Declarative with Edge Registry [Preview]](howto-configure-opc-ua-web-of-things-declarative-onboarding.md#configure-declarative-onboarding-with-edge-registry-preview) | The TD is stored separately in Edge Registry [Preview]; the endpoint configuration contains a reference to it. | You want declarative onboarding without embedding the TD in endpoint configuration, or need to share and version TDs centrally. | Azure IoT Operations 2610 preview only. |

> [!IMPORTANT]
> Edge Registry integration [Preview] isn't available in the Azure IoT Operations 2610 GA release.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

For 2610 GA, start with the mRPC walkthrough in this article. It sends the TD in an MQTT request rather than storing it in the device endpoint's additional configuration, so the TD doesn't consume that configuration's size budget. MQTT message-size limits and request timeouts still apply. The mRPC `createAsset` request always carries the TD itself; it doesn't resolve Edge Registry references [Preview].

Use declarative onboarding when automatic reapplication is required. With periodic checks enabled, the Commander can reapply a configured TD if the server loses the asset. For inline TDs, account for base64 encoding overhead and the other endpoint settings when checking whether the configuration fits.

Manage each server-side asset through one approach. If you delete an asset through mRPC while it's still configured for declarative materialization, the Commander can recreate it on a subsequent periodic check.

## Prepare a Thing Description

A TD is a JSON-LD document that describes an asset's interface and how to communicate with it. Its `properties` describe the values to expose, and their `forms` specify protocol operations and addresses. The OPC UA Commander forwards the TD to the OPC UA server, which must support the protocol bindings and content that the TD uses.

### Supported Thing Description content

The following table describes support for the end-to-end flow in Azure IoT Operations 2610, from creating the asset on the server to discovery and telemetry collection:

| TD content | OPC UA mapping | Support |
| --- | --- | --- |
| Primitive property (`boolean`, `integer`, `number`, or `string`) | OPC UA variable | Supported. Discovered as a data point. |
| Array of primitive values | OPC UA variable with an array value | Supported when materialized by the server as a one-dimensional array using the OPC 10100-1 v1.02 primitive-type mapping. |
| Object-valued property | No standardized mapping | Not supported. OPC 10100-1 v1.02 doesn't define a mapping for objects. |
| Array of objects | No standardized mapping | Not supported. OPC 10100-1 v1.02 doesn't define a mapping for arrays of objects. |
| Action | OPC UA method | Can be created on the server if the server supports it, but isn't discovered as an Azure IoT Operations management action. |
| Event | No standardized mapping | Not supported. OPC 10100-1 v1.02 doesn't define a mapping for events. |

Primitive properties map to OPC UA data types as follows: `boolean` to `Boolean`, `integer` to `Int64`, `number` to `Double`, and `string` to `String`. For details, see [OPC 10100-1 v1.02, Thing Description mapping](https://reference.opcfoundation.org/specs/OPC-10100-1/v1.02/6.3.8).

For an array property, set `type` to `array` and specify the primitive element type in `items.type`: `boolean`, `integer`, `number`, or `string`. When the server exposes the property as a one-dimensional array of the corresponding OPC UA primitive type, the variable can be discovered, onboarded, and published as array telemetry.

> [!NOTE]
> This feature uses the OPC 10100-1 WoT Connectivity API, not the W3C WoT Binding for OPC UA defined in OPC 10101.

The following example describes a Modbus TCP coolant pump with two primitive properties: `flowRate` and `running`. Save it as `coolant-pump.td.json` in your working directory, using UTF-8 encoding.

For a physical asset, replace `base` with the asset's address and adjust the register addresses, data types, and polling settings to match your device and server's supported Modbus binding. The OPC PLC simulator exposes simulated values and doesn't use these settings to connect to a physical pump.

```json
{
  "@context": [
    "https://www.w3.org/2022/wot/td/v1.1",
    {
      "modv": "https://www.w3.org/2019/wot/modbus#"
    }
  ],
  "@type": "Thing",
  "id": "urn:contoso:line1:coolant-pump-07",
  "title": "Line 1 coolant pump 07",
  "description": "Modbus TCP coolant pump on production line 1.",
  "securityDefinitions": {
    "nosec_sc": {
      "scheme": "nosec"
    }
  },
  "security": [
    "nosec_sc"
  ],
  "base": "modbus+tcp://192.0.2.41:502/1",
  "properties": {
    "flowRate": {
      "title": "Coolant flow rate (L/min)",
      "type": "number",
      "readOnly": true,
      "observable": true,
      "forms": [
        {
          "href": "0?quantity=2",
          "op": [
            "readproperty",
            "observeproperty"
          ],
          "modv:entity": "InputRegister",
          "modv:type": "xsd:float",
          "modv:pollingTime": 1000
        }
      ]
    },
    "running": {
      "title": "Pump running",
      "type": "boolean",
      "readOnly": true,
      "observable": true,
      "forms": [
        {
          "href": "0?quantity=1",
          "op": [
            "readproperty",
            "observeproperty"
          ],
          "modv:entity": "DiscreteInput",
          "modv:type": "xsd:boolean",
          "modv:pollingTime": 1000
        }
      ]
    }
  }
}
```

The `nosec` scheme describes the example's Modbus connection, not the security of the OPC UA endpoints or MQTT broker. Configure authentication and certificate trust for those connections separately.

### Encode the Thing Description

The mRPC `createAsset` request and inline declarative configuration both carry the TD as a base64-encoded string. Encode the file's contents, not its path, and use an encoded value without line breaks.

In PowerShell:

```powershell
$tdPath = Join-Path $PWD 'coolant-pump.td.json'
$td = [Convert]::ToBase64String([IO.File]::ReadAllBytes($tdPath))
```

In Bash:

```bash
td=$(base64 < coolant-pump.td.json | tr -d '\r\n')
```

Keep the encoded value in `$td` (PowerShell) or `td` (Bash) for the onboarding steps. The decoded content is JSON, and its content type is `application/td+json`. Base64 encoding doesn't encrypt the TD.

## Configure the device endpoints

A WoT-enabled device uses two inbound endpoints:

- A `Microsoft.OpcUa.WoT` endpoint that points to the OPC 10100-1 server and is used by the OPC UA Commander to create and manage the WoT asset.
- A regular `Microsoft.OpcUa` endpoint that points to the server hosting the materialized variable nodes and is used by the OPC UA Connector to read the asset's variables and publish telemetry.

Create both endpoints on the same device so the Commander can materialize the asset on the server, browse the created variables, and bind the discovered asset to the connector endpoint for data collection.

Run the following Azure CLI examples in PowerShell, using the same session so the variables remain available.

### Create a device

# [Azure CLI](#tab/cli)

Set the resource group, Azure IoT Operations instance, device name, and server address for your environment. Create the device before adding its endpoints:

```powershell
$resourceGroup = "<RESOURCE_GROUP>"
$instance = "<AIO_INSTANCE_NAME>"
$device = "line1-opcua-server"
$address = "opc.tcp://opcua-server.contoso.local:4840"

az iot ops ns device create `
  --name $device `
  --instance $instance `
  --resource-group $resourceGroup
if ($LASTEXITCODE -ne 0) { throw "Device creation failed." }
```

---

### Configure the OPC UA telemetry endpoint

The telemetry endpoint is the standard OPC UA inbound endpoint that Azure IoT Operations uses to read data after discovery. Configure it the same way that you configure any other OPC UA endpoint for an Azure IoT Operations instance.

Use the address, authentication, and certificate settings that match the server where the materialized variables are exposed. The endpoint isn't responsible for creating or managing the WoT asset. Its purpose is to collect telemetry from the discovered OPC UA variables and deliver it to the MQTT broker.

The example uses anonymous user authentication. For other authentication methods, see [Configure the connector for OPC UA](howto-configure-opc-ua.md).

# [Azure CLI](#tab/cli)

Add an OPC UA endpoint named `opcua-telemetry`. The example disables automatic acceptance of untrusted server certificates. Establish certificate trust before connecting, as described in [Configure OPC UA application authentication](howto-configure-opc-ua-certificates-infrastructure.md).

```powershell
az iot ops ns device endpoint inbound add opcua `
  --device $device `
  --instance $instance `
  --resource-group $resourceGroup `
  --name opcua-telemetry `
  --endpoint-address $address `
  --accept-certs false
if ($LASTEXITCODE -ne 0) { throw "OPC UA endpoint creation failed." }
```

---

### Configure the WoT endpoint

Create a `Microsoft.OpcUa.WoT` endpoint on the same device. The OPC UA Commander uses this endpoint to connect to the OPC 10100-1 server and handle mRPC requests. For this on-demand workflow, the TD is supplied in the `createAsset` request, not in the endpoint configuration.

Set `endpointRef` in the WoT endpoint's `additionalConfiguration` to `opcua-telemetry`, the name of the OPC UA telemetry endpoint created earlier. Although `endpointRef` is optional, explicitly setting it is strongly recommended so discovery binds assets to the intended telemetry endpoint rather than relying on automatic sibling-endpoint selection.

# [Azure CLI](#tab/cli)

Read back the telemetry endpoint's saved security settings and reuse them for the WoT endpoint. The `additionalConfiguration` value is a string containing JSON.

```powershell
$deviceJson = az iot ops ns device show `
  --name $device `
  --instance $instance `
  --resource-group $resourceGroup `
  --output json
if ($LASTEXITCODE -ne 0) { throw "Device read-back failed." }

$savedDevice = $deviceJson | ConvertFrom-Json
$opcuaConfig = $savedDevice.properties.endpoints.inbound.'opcua-telemetry'.additionalConfiguration | ConvertFrom-Json
if ($null -eq $opcuaConfig.security -or $opcuaConfig.security.autoAcceptUntrustedServerCertificates -ne $false) {
  throw "The saved OPC UA security settings don't match the expected certificate trust configuration."
}

$config = @{
  runAssetDiscovery = $true
  endpointRef = "opcua-telemetry"
  security = $opcuaConfig.security
} | ConvertTo-Json -Depth 6 -Compress

az iot ops ns device endpoint inbound add custom `
  --device $device `
  --instance $instance `
  --resource-group $resourceGroup `
  --name wot-endpoint `
  --endpoint-type Microsoft.OpcUa.WoT `
  --endpoint-address $address `
  --additional-config ($config -replace '"', '\"')
if ($LASTEXITCODE -ne 0) { throw "WoT endpoint creation failed." }
```

> [!NOTE]
> The example escapes double quotes in the JSON passed to `--additional-config` for Azure CLI on Windows.

---

The referenced endpoint must be on the same device, have the type `Microsoft.OpcUa`, and use the same address, authentication, and security settings as the WoT endpoint. Configure certificate trust for the OPC UA connections even when using anonymous user authentication. For instructions, see [Configure OPC UA application authentication](howto-configure-opc-ua-certificates-infrastructure.md).

If you omit `endpointRef`, the Commander searches for a single sibling `Microsoft.OpcUa` endpoint with matching connection settings. Discovery fails if no endpoint matches or more than one matches. Reserve automatic selection for cases where you intentionally rely on that behavior.

Set `runAssetDiscovery` to `true` in the endpoint configuration to enable discovery by default for mRPC `createAsset` requests. A request can also set `runAssetDiscovery` explicitly to override the endpoint default. The walkthrough sets it to `true` in the request as well to make the discovery behavior explicit. You only need the `wot` array and reapplication settings for [declarative onboarding](howto-configure-opc-ua-web-of-things-declarative-onboarding.md).

### Validate the endpoint configuration

After you configure the endpoints, verify that:

- Both endpoints use the intended server address and matching authentication and security settings.
- `endpointRef` names the `opcua-telemetry` endpoint on the same device.
- The OPC UA Commander and connector can connect to the server with the configured certificate trust.

Creating the endpoints doesn't create a server-side WoT asset. Continue with the mRPC request to create the asset and run discovery, then import the discovered asset and verify telemetry.

## Onboard an asset by using mRPC

Send a `createAsset` request to the WoT endpoint to create the asset on the OPC UA server, upload its TD, and discover its variables. This step creates the server-side asset and discovery records, not the Azure IoT Operations asset used to collect telemetry. You import the discovered asset in the next section.

The Azure CLI commands in the preceding section configure Azure resources. The following steps use `kubectl` and the Mosquitto MQTT client to send an MQTT v5 request directly to the Commander. They don't require cloud-initiated management actions or Event Grid routing.

### Connect an MQTT client

1. Follow [Connect to the default listener inside the cluster](../manage-mqtt-broker/howto-test-connection.md#connect-to-the-default-listener-inside-the-cluster) to deploy the evaluation `mqtt-client` pod. Wait for its package installation to finish successfully.

1. From your local PowerShell session, install `mosquitto_rr` in the Alpine-based client pod. The `mosquitto-clients` package alone doesn't include this request-response client:

   ```powershell
   kubectl exec --namespace azure-iot-operations mqtt-client -- apk add --no-cache mosquitto
   if ($LASTEXITCODE -ne 0) { throw "Mosquitto installation failed." }
   ```

1. Copy the TD file prepared earlier into the client pod:

   ```powershell
   kubectl cp ./coolant-pump.td.json azure-iot-operations/mqtt-client:/tmp/coolant-pump.td.json
   if ($LASTEXITCODE -ne 0) { throw "Thing Description copy failed." }
   ```

1. Open a shell in the client pod:

   ```powershell
   kubectl exec --stdin --tty --namespace azure-iot-operations mqtt-client -- sh
   ```

Run the following `sh` commands inside the pod, not in your local PowerShell session. Keep the same pod shell open through the request steps. The commands use the default broker listener, its mounted CA certificate, and the pod's service account token. If you use another namespace or client setup, adjust the namespace, broker address, port, and mounted paths accordingly.

> [!IMPORTANT]
> The sample MQTT client is for evaluation, not production. Its identity must be authorized to publish to the request topic and subscribe to the response topic.

### Prepare the request and response topics

Requests target a device inbound endpoint, not an existing Azure IoT Operations asset. The request topic uses the following format:

```text
{AioNamespace}/endpoint-operations/{Device}/{InboundEndpoint}/createAsset
```

For the device and endpoint you created earlier, set these values inside the client pod:

```sh
aio_namespace="azure-iot-operations"
device="line1-opcua-server"
endpoint="wot-endpoint"
request_topic="$aio_namespace/endpoint-operations/$device/$endpoint/createAsset"
```

`AioNamespace` is the Kubernetes namespace, not the Azure Device Registry namespace. Change `device` if you used a different device name in the Azure CLI steps.

The request follows the [Azure IoT Operations RPC protocol](https://github.com/Azure/iot-operations-sdks/blob/main/doc/reference/rpc-protocol.md). Set the following MQTT v5 properties:

| Property | Value |
| --- | --- |
| Response topic | A unique topic on which the client receives this request's response. |
| Correlation data | A new 16-byte value for every request. The response echoes this value. |
| Message expiry interval | `60` seconds for the Commander's default execution timeout. |
| Payload format indicator | `1`, for UTF-8 text. |
| Content type | `application/json`, for the request envelope. |
| User property `__protVer` | `1.0`. |

Use QoS 1 and don't retain the request. The command in the next step supplies these properties. `mosquitto_rr` subscribes to the response topic before publishing the request.

> [!IMPORTANT]
> Generate new correlation data for each request. Reusing correlation data before an earlier request expires can return its cached response instead of executing a new operation.

### Create the asset and run discovery

Include the encoded TD and `"runAssetDiscovery": true` in the `createAsset` request payload:

```json
{
  "assetName": "line1-coolant-pump-07",
  "td": "<base64-encoded-thing-description>",
  "tdContentType": "application/td+json",
  "runAssetDiscovery": true
}
```

Replace `<base64-encoded-thing-description>` with the value encoded earlier. Discovery uses the `endpointRef` configured on the WoT endpoint to bind discovered assets to `opcua-telemetry`.

Inside the pod, encode the copied TD and send the request:

```sh
td=$(base64 < /tmp/coolant-pump.td.json | tr -d '\r\n')
correlation=$(head -c 8 /dev/urandom | od -An -tx1 | tr -d ' \n')
response_topic="clients/wot-demo/$correlation/createAsset"

mosquitto_rr \
  -h aio-broker -p 18883 \
  --cafile /var/run/certs/ca.crt \
  -D connect authentication-method K8S-SAT \
  -D connect authentication-data "$(cat /var/run/secrets/tokens/broker-sat)" \
  -V mqttv5 -q 1 \
  -D publish correlation-data "$correlation" \
  -D publish message-expiry-interval 60 \
  -D publish payload-format-indicator 1 \
  -D publish content-type application/json \
  -D publish user-property __protVer 1.0 \
  -W 75 -F '%P | %p' \
  -t "$request_topic" \
  -e "$response_topic" \
  -m "{\"assetName\":\"line1-coolant-pump-07\",\"td\":\"$td\",\"tdContentType\":\"application/td+json\",\"runAssetDiscovery\":true}"
```

The correlation value is 16 hexadecimal characters sent as 16 ASCII bytes, not a hexadecimal encoding to decode before sending. Regenerate it, and the response topic, each time you send a request.

The client waits up to 75 seconds for a response. If the Commander's execution timeout has been changed, adjust both the message expiry and client wait accordingly. Increasing message expiry alone doesn't extend the server's execution timeout.

`createAsset` also updates an existing server-side asset with the same `assetName`. Each call uploads the TD, even if its content hasn't changed.

### Check the response and discovered asset

The command prints MQTT user properties followed by the JSON response body. Check the properties for `AppErrCode` before treating the operation as successful. A successful client exit or the protocol status `__stat:200` alone doesn't mean the asset was created successfully.

- If `AppErrCode` is present, inspect `AppErrPayload` for the error's `code`, `subCode`, `message`, and `retryable` fields. Ignore the default-valued response body. Correct invalid input or connection settings before retrying; retry an unchanged request only when `retryable` is `true`.
- If no application error is reported, check the response body:

  | Field | Expected result |
  | --- | --- |
  | `status` | `Created` for a new server-side asset, or `Updated` for an existing asset. |
  | `assetName` | `line1-coolant-pump-07`. |
  | `assetNodeId` | The NodeId assigned by the server to the WoT asset. |
  | `tdSha256` | The SHA-256 hash of the uploaded TD. |
  | `discovery.discoveredDeviceName` | `line1-opcua-server`, or your configured device name. |
  | `discovery.discoveredAssetNames` | The names of the discovery records created for the asset's variables. |

If the client times out without a response, check the broker connection, request and response topic permissions, device and endpoint names, and required MQTT v5 properties. Don't assume that the server-side operation wasn't executed.

> [!NOTE]
> The server-side asset is created before the TD is uploaded. If the server rejects the TD, an empty asset can remain. Send a corrected TD with the same `assetName`, or remove the server-side asset by using `deleteAsset`.

Exit the pod shell to return to your local PowerShell session:

```sh
exit
```

List the existing discovered assets, then inspect the one named in the response:

```powershell
kubectl get discoveredassets.namespaces.deviceregistry.microsoft.com `
  --namespace azure-iot-operations
if ($LASTEXITCODE -ne 0) { throw "Discovered asset listing failed." }

$discoveredAsset = "<DISCOVERED_ASSET_NAME>"
kubectl get discoveredassets.namespaces.deviceregistry.microsoft.com $discoveredAsset `
  --namespace azure-iot-operations --output yaml
if ($LASTEXITCODE -ne 0) { throw "Discovered asset read-back failed." }
```

Verify that `spec.deviceRef.deviceName` matches your device and `spec.deviceRef.endpointName` is `opcua-telemetry`. Check that the discovered datasets contain the expected TD properties, such as `flowRate` and `running`, with the server's actual NodeIds as their `dataSource` values. The record can contain additional properties, depending on the variables exposed by the server. Don't assume that it contains only the properties shown here.

Continue with [Import the discovered asset](#import-the-discovered-asset). Discovery alone doesn't start telemetry collection.

## Import the discovered asset

Create an Azure IoT Operations asset from the discovered variables to start collecting telemetry. Use the `Microsoft.OpcUa` telemetry endpoint, not the WoT endpoint.

### Import by using the operations experience

Use the operations experience to review and import the discovered asset. Select the discovered asset from the previous step, and then select **Import and create asset**. To review its details and data points and finish creating the asset, see [Import an asset from a discovered asset](howto-detect-opc-ua-assets.md#import-an-asset-from-a-discovered-asset).

### Alternative: create an asset programmatically

If you prefer a scripted workflow, create an asset from the discovery information instead of importing it through the operations experience.

# [Azure CLI](#tab/cli)

Read the definition selected in the previous step and copy its dataset names, data point names, and NodeIds into a new asset. This example uses Azure CLI creation commands, not a dedicated import command. Run it in the same local PowerShell session.

```powershell
$asset = "line1-coolant-pump-07"
$discoveredJson = kubectl get discoveredassets.namespaces.deviceregistry.microsoft.com $discoveredAsset `
  --namespace azure-iot-operations --output json
if ($LASTEXITCODE -ne 0) { throw "Discovered asset read-back failed." }

$source = ($discoveredJson | ConvertFrom-Json).spec
if ($source.deviceRef.deviceName -ne $device -or $source.deviceRef.endpointName -ne "opcua-telemetry") {
  throw "The discovered asset doesn't reference the expected device and telemetry endpoint."
}
if (-not $source.datasets.dataPoints) { throw "The discovered asset has no data points to copy." }

az iot ops ns asset opcua create `
  --name $asset --device $source.deviceRef.deviceName --endpoint $source.deviceRef.endpointName `
  --instance $instance --resource-group $resourceGroup
if ($LASTEXITCODE -ne 0) { throw "Asset creation failed." }

foreach ($dataset in $source.datasets) {
  az iot ops ns asset opcua dataset add `
    --asset $asset --name $dataset.name `
    --instance $instance --resource-group $resourceGroup `
    --dest topic="azure-iot-operations/data/$asset/$($dataset.name)" retain=Never qos=Qos1 ttl=3600
  if ($LASTEXITCODE -ne 0) { throw "Dataset creation failed: $($dataset.name)" }

  foreach ($point in $dataset.dataPoints) {
    az iot ops ns asset opcua datapoint add `
      --asset $asset --dataset $dataset.name `
      --instance $instance --resource-group $resourceGroup `
      --name $point.name --data-source $point.dataSource
    if ($LASTEXITCODE -ne 0) { throw "Data point creation failed: $($point.name)" }
  }
}
```

The example copies every discovered data point, including variables that aren't TD properties, so remove data points that you don't need. It copies dataset and data point names and NodeIds, and publishes each dataset to `azure-iot-operations/data/<asset>/<dataset>`. It doesn't copy other discovered metadata or collection settings. Each Azure CLI call can take about a minute, so importing an asset with several data points takes several minutes. If you need to review those settings, use the operations experience import workflow.

---

Choose one method for each asset to avoid duplicate subscriptions and telemetry. Create assets through Azure, not by applying Kubernetes asset resources directly.

## Verify telemetry

In your local PowerShell session, set `$asset` to the Azure IoT Operations asset name you chose during import. Check that its runtime health reports `Available`:

```powershell
$asset = "<IMPORTED_ASSET_NAME>"
kubectl get assets.namespaces.deviceregistry.microsoft.com $asset `
  --namespace azure-iot-operations --output jsonpath='{.status.healthState.status}'
if ($LASTEXITCODE -ne 0) { throw "Asset health read-back failed." }
```

# [Azure CLI](#tab/cli)

Inspect the dataset destinations and asset-level defaults to identify the MQTT topic used for telemetry:

```powershell
az iot ops ns asset show `
  --name $asset --instance $instance --resource-group $resourceGroup `
  --query "properties.{datasets:datasets,defaultDestinations:defaultDatasetsDestinations}" `
  --output json
if ($LASTEXITCODE -ne 0) { throw "Asset configuration read-back failed." }
```

---

Use the dataset's MQTT destination, or its inherited default, rather than assuming a topic based on the asset name. If neither the dataset nor the asset defines a destination, the connector publishes to `<AioNamespace>/data/<asset>/<dataset>`, for example `azure-iot-operations/data/line1-coolant-pump-07/dataset-0`. You can also review the destination in the operations experience.

Open the MQTT client pod shell as described earlier. Replace the topic placeholder and subscribe:

```sh
mosquitto_sub \
  -h aio-broker -p 18883 \
  --cafile /var/run/certs/ca.crt \
  -D connect authentication-method K8S-SAT \
  -D connect authentication-data "$(cat /var/run/secrets/tokens/broker-sat)" \
  -V mqttv5 -q 1 -C 3 -W 90 -v \
  -t '<DATASET_MQTT_TOPIC>'
```

Check that messages contain the expected properties, such as `flowRate` and `running`, their values, and source timestamps. For array properties, check the array values. An `Available` health state alone doesn't prove telemetry delivery.

If the subscription times out, check the topic, subscription permissions, asset health, and publishing settings. Unchanged values might not generate new messages; a timeout alone doesn't establish a failure.

## Manage assets by using mRPC

These methods manage assets on the OPC UA server, not Azure IoT Operations asset resources. Run the following commands inside the MQTT client pod shell. Set the request topic prefix, adjusting the namespace, device, and endpoint names if you changed them:

```sh
prefix="azure-iot-operations/endpoint-operations/line1-opcua-server/wot-endpoint"
```

Each example generates fresh correlation data and a response topic. Regenerate both each time you send a request. Check `AppErrCode` and `AppErrPayload` as described in [Check the response and discovered asset](#check-the-response-and-discovered-asset) before interpreting the response body.

### Test a connection

Ask the OPC UA server to test connectivity to the physical asset. Replace the address with your asset's endpoint:

```sh
correlation=$(head -c 8 /dev/urandom | od -An -tx1 | tr -d ' \n')
response_topic="clients/wot-demo/$correlation/connectionTest"

mosquitto_rr \
  -h aio-broker -p 18883 \
  --cafile /var/run/certs/ca.crt \
  -D connect authentication-method K8S-SAT \
  -D connect authentication-data "$(cat /var/run/secrets/tokens/broker-sat)" \
  -V mqttv5 -q 1 \
  -D publish correlation-data "$correlation" \
  -D publish message-expiry-interval 60 \
  -D publish payload-format-indicator 1 \
  -D publish content-type application/json \
  -D publish user-property __protVer 1.0 \
  -W 75 -F '%P | %p' \
  -t "$prefix/connectionTest" \
  -e "$response_topic" \
  -m '{"assetEndpoint":"modbus+tcp://192.0.2.41:502/1"}'
```

The response reports `Reachable` or `Unreachable`, with diagnostic text in `serverStatus`. This test doesn't create an asset. The OPC PLC simulator doesn't test the address; it reports `Reachable` with `serverStatus` set to `Simulated`. This test requires the optional OPC 10100-1 `ConnectionTest` method introduced in v1.01; a server without it returns `BadNotSupported`.

### List assets

List server-side WoT assets and their NodeIds:

```sh
correlation=$(head -c 8 /dev/urandom | od -An -tx1 | tr -d ' \n')
response_topic="clients/wot-demo/$correlation/listAssets"

mosquitto_rr \
  -h aio-broker -p 18883 \
  --cafile /var/run/certs/ca.crt \
  -D connect authentication-method K8S-SAT \
  -D connect authentication-data "$(cat /var/run/secrets/tokens/broker-sat)" \
  -V mqttv5 -q 1 \
  -D publish correlation-data "$correlation" \
  -D publish message-expiry-interval 60 \
  -D publish payload-format-indicator 1 \
  -D publish content-type application/json \
  -D publish user-property __protVer 1.0 \
  -W 75 -F '%P | %p' \
  -t "$prefix/listAssets" \
  -e "$response_topic" \
  -m '{}'
```

The response contains an `assets` array. An empty array is a valid result.

### Update an asset

Revise the TD and copy it into the client pod again. Send `createAsset` with the same server-side `assetName`:

```sh
td=$(base64 < /tmp/coolant-pump.td.json | tr -d '\r\n')
correlation=$(head -c 8 /dev/urandom | od -An -tx1 | tr -d ' \n')
response_topic="clients/wot-demo/$correlation/createAsset"

mosquitto_rr \
  -h aio-broker -p 18883 \
  --cafile /var/run/certs/ca.crt \
  -D connect authentication-method K8S-SAT \
  -D connect authentication-data "$(cat /var/run/secrets/tokens/broker-sat)" \
  -V mqttv5 -q 1 \
  -D publish correlation-data "$correlation" \
  -D publish message-expiry-interval 60 \
  -D publish payload-format-indicator 1 \
  -D publish content-type application/json \
  -D publish user-property __protVer 1.0 \
  -W 75 -F '%P | %p' \
  -t "$prefix/createAsset" \
  -e "$response_topic" \
  -m "{\"assetName\":\"line1-coolant-pump-07\",\"td\":\"$td\",\"tdContentType\":\"application/td+json\",\"runAssetDiscovery\":true}"
```

An existing asset returns `status: Updated`. When the server applies a TD, it can assign new NodeIds to the asset's variables, even if the TD hasn't changed. The OPC PLC simulator does this on every `createAsset` call. Discovery refreshes the discovered definitions, but doesn't update an already imported Azure IoT Operations asset. Data points that reference replaced NodeIds stop producing telemetry, while the asset's health can still report `Available`. After each update, compare the `dataSource` values in the discovered asset with the data points of the imported asset, and update any stale data points.

### Delete an asset and clean up related resources

Delete the server-side asset:

```sh
correlation=$(head -c 8 /dev/urandom | od -An -tx1 | tr -d ' \n')
response_topic="clients/wot-demo/$correlation/deleteAsset"

mosquitto_rr \
  -h aio-broker -p 18883 \
  --cafile /var/run/certs/ca.crt \
  -D connect authentication-method K8S-SAT \
  -D connect authentication-data "$(cat /var/run/secrets/tokens/broker-sat)" \
  -V mqttv5 -q 1 \
  -D publish correlation-data "$correlation" \
  -D publish message-expiry-interval 60 \
  -D publish payload-format-indicator 1 \
  -D publish content-type application/json \
  -D publish user-property __protVer 1.0 \
  -W 75 -F '%P | %p' \
  -t "$prefix/deleteAsset" \
  -e "$response_topic" \
  -m '{"assetName":"line1-coolant-pump-07"}'
```

The response reports `Deleted`, or `NotFound` if the asset is already absent. If the asset is also declaratively managed, remove its declarative entry first to prevent automatic recreation.

This call doesn't delete the Azure IoT Operations asset, device, or discovery records. If you no longer need the imported asset, exit the pod shell and delete it through Azure:

# [Azure CLI](#tab/cli)

```powershell
az iot ops ns asset delete `
  --name $asset --instance $instance --resource-group $resourceGroup --yes
if ($LASTEXITCODE -ne 0) { throw "Azure IoT Operations asset deletion failed." }
```

---

Review remaining discovery records in the operations experience. Don't delete a shared device or rely on deleting Kubernetes copies to clean up cloud-managed resources.

## Troubleshoot WoT connectivity

This section covers endpoint, mRPC, and discovery problems. For problems with the `wot` array, `edgeRegistry` references, or automatic reapplication, see [Troubleshoot declarative onboarding](howto-configure-opc-ua-web-of-things-declarative-onboarding.md#troubleshoot-declarative-onboarding).

### Interpret mRPC errors

A failed mRPC request still gets a response from the Commander on the response topic, with the protocol status `__stat` set to `200`. The response includes two extra MQTT v5 user properties:

- `AppErrCode`: `CreateAssetError`, `DeleteAssetError`, `ListAssetsError`, or `ConnectionTestError`.
- `AppErrPayload`: a JSON object that describes the error.

Always check for `AppErrCode` first. When it's present, ignore the response body because it contains only default values. For example, a `createAsset` request with a TD that the server can't parse returns:

```text
AppErrCode:CreateAssetError AppErrPayload:{"code":"OpcUaError","subCode":"BadDecodingError","message":"BadDecodingError","retryable":false,"detail":null}
```

`AppErrPayload` has the following fields:

| Field | Description |
| --- | --- |
| `code` | The error category. See the following table. |
| `subCode` | Details for the category, such as the validation problem or the OPC UA status code. |
| `message` | A human-readable description of the error. |
| `retryable` | `true` if you can send the same request again later. |
| `detail` | Optional additional information. |

| `code` | Retryable | Meaning |
| --- | --- | --- |
| `ValidationError` | No | The request is invalid. `subCode` names the problem: `assetNameMissing`, `assetNameTooLong`, `tdMissing`, `tdNotBase64`, `assetEndpointMissing`, or `assetEndpointTooLong`. |
| `DiscoveredAssetEndpointError` | No | `endpointRef` doesn't resolve to a matching sibling `Microsoft.OpcUa` endpoint, or the Commander couldn't select a single endpoint automatically. |
| `OpcUaError` | Depends | The server rejected the operation. `subCode` is the OPC UA status code, such as `BadDecodingError` (the TD isn't valid JSON) or `BadNotSupported` (the server doesn't support a binding or feature in the TD). Only `BadNotFound` (the asset was deleted concurrently) and `BadInvalidState` (the server can't apply the TD right now) are retryable. |
| `BridgeUnreachableError` | Yes | The Commander can't establish or keep an OPC UA session to the server. |
| `BridgeProtocolError` | No | The server doesn't implement OPC 10100-1 as expected, for example because the WoT Connectivity namespace is missing. |
| `TimeoutError` | Yes | An OPC UA call to the server timed out. |
| `RoutingError` | No | The method in the request topic doesn't match the method handler that received the request. A request to an unknown method name gets no response, and the client times out. |
| `InternalError` | No | An unexpected error occurred in the Commander. Check the Commander logs. |

Retry only when `retryable` is `true`.

### Resolve common problems

| Symptom | Cause | Resolution |
| --- | --- | --- |
| The OPC UA endpoint is `Unavailable` and the logs report `BadCertificateUntrusted`. | The connector doesn't trust the OPC UA server certificate. | Configure trust for the server certificate. See [Configure OPC UA application authentication](howto-configure-opc-ua-certificates-infrastructure.md). |
| The WoT endpoint reports that `endpointRef` doesn't match by address, authentication, and security. | The WoT endpoint and the referenced `Microsoft.OpcUa` endpoint have different connection settings. | Configure both endpoints with the same address, authentication, and security settings, including certificate acceptance, security policy, and security mode. |
| The device status shows an error with `Invalid Asset Endpoint Profile configuration` for the WoT endpoint. | `additionalConfiguration` doesn't match the schema. The details list the failing property. | Fix the property named in the error details. |
| `createAsset` fails with `OpcUaError` and `BadDecodingError`. | The decoded TD isn't valid JSON, or the server can't parse it. | Validate the TD. Make sure that you base64-encode the file's content, not its path. Send a corrected TD with the same `assetName`, or delete the empty server-side asset. |
| `createAsset` fails with `OpcUaError` and `BadNotSupported`. | The server doesn't support a protocol binding or another feature that the TD uses. | Check which bindings the server supports, and update the TD to use them. |
| `createAsset` fails with `ValidationError` and `tdNotBase64`. | `td` isn't valid base64. | Encode the TD as base64 without line breaks. |
| A request fails with `BridgeProtocolError`. | The server doesn't expose the OPC 10100-1 WoT Connectivity namespace. | Check that the WoT endpoint address points to an OPC 10100-1 server and that WoT Connectivity is enabled on it. For the OPC PLC simulator, use the `--wotcon` option. |
| A request fails with `BridgeUnreachableError`. | The Commander can't connect to the server. | Check the endpoint address, authentication, and security settings, and that the server trusts the Commander's certificate. |
| `mosquitto_rr` times out without a response. | The request is missing a required MQTT v5 property, the topic doesn't match an existing device and `Microsoft.OpcUa.WoT` endpoint, the client lacks publish or subscribe permissions, or the request expired. | Check the topic tokens, the properties in [Prepare the request and response topics](#prepare-the-request-and-response-topics), and the client's broker authorization. |
| A request returns the result of an earlier request. | The request reused the correlation data of an earlier request that hasn't expired. | Generate new correlation data for every request. |
| No discovered asset appears after `createAsset`. | `runAssetDiscovery` is `false`, or no sibling endpoint matched `endpointRef`. | Set `runAssetDiscovery` to `true` in the request or endpoint configuration, and check `endpointRef`. |

### Find more information

For `InternalError` and unexplained failures, check the logs of the OPC UA Commander. For general guidance on health status, reason codes, and OPC UA server connections, see [Troubleshoot Azure IoT Operations](../troubleshoot/troubleshoot.md).

## Related content

- [Configure declarative OPC UA WoT onboarding](howto-configure-opc-ua-web-of-things-declarative-onboarding.md)
