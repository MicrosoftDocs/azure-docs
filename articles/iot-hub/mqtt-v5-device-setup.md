---
title: Configure a device with the unified Azure IoT SDKs
titleSuffix: Azure IoT Hub
description: Connect a device to Azure IoT Hub with the MQTT v5 connection profile using X.509 onboarding and the unified .NET or C SDK, then send telemetry.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 10/26/2026
---

# Configure a device with the unified Azure IoT SDKs

Use the unified Azure IoT SDK for .NET or C to provision a device, connect it
to Azure IoT Hub with the MQTT v5 connection profile, and send telemetry.
Start with a small JSON message and verify it at your downstream destination
before adding custom topics or more complex payloads.

This article uses Device Provisioning Service (DPS) to provision the device
with an existing X.509 certificate and get its assigned IoT Hub connection
details. The device then connects to that hub and publishes telemetry over
MQTT v5; telemetry doesn't pass through DPS.

## Prerequisites

- Complete [hub setup](mqtt-v5-cloud-setup.md) and
  [routing setup](mqtt-v5-route-messages.md), including an enabled all-messages route.
- An enabled X.509 enrollment in DPS that assigns the device to the intended hub.
- The DPS ID scope and a device certificate with its matching private key.
- A device clock and certificate trust configuration suitable for TLS.
- A destination reader ready to locate the test message.

The following examples use an existing device certificate for DPS onboarding
and the subsequent hub connection. Certificate issuance during onboarding is
a separate setup path. These examples don't create an
enrollment or obtain a certificate for the device.

For the optional issuance path, DPS can use symmetric-key or X.509 onboarding
credentials and return an ADR-issued operational X.509 certificate when
issuance is configured and the device submits a certificate signing request.
Symmetric-key onboarding for this profile requires that issuance path;
devices authenticate to the MQTT v5 hub with X.509 certificates, not SAS tokens.
See [Configure certificate issuance through DPS](mqtt-v5-cloud-setup.md#configure-certificate-issuance-through-dps).

Use DPS for operational certificate renewal. Direct renewal through the
MQTT v5 hub isn't supported in this preview. The examples in this article
don't implement certificate issuance or renewal.

Keep private keys and certificate passwords out of source control. File-based
credentials are useful for a local evaluation. Use the key protection supported
by your device platform for production design.

## Confirm the cloud configuration

### [Azure CLI](#tab/cli)

Use the preview extension from [hub setup](mqtt-v5-cloud-setup.md?tabs=cli#create-azure-iot-hub-with-the-mqtt-v5-connection-profile).
Before running the device application, read the DPS ID scope and enrollment:

```azurecli
az iot dps show --name "<DPS_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --query properties.idScope --output tsv
```

```azurecli
az iot dps enrollment show --dps-name "<DPS_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --enrollment-id "<REGISTRATION_ID>" --query "{registrationId:registrationId,status:provisioningStatus}" --output json
```

Use the returned ID scope as `DPS_ID_SCOPE` in the device configuration.
The enrollment must be enabled and match the certificate's onboarding identity.
An ID scope isn't the DPS resource ID or the hub hostname.

After the SDK provisions and connects the device, inspect the device record in
the linked Azure Device Registry (ADR) namespace:

```azurecli
az iot adr ns device list --ns "<ADR_NAMESPACE_NAME>" --resource-group "<RESOURCE_GROUP_NAME>" --query "[].{name:name,enablementState:properties.enablementState,provisioningState:properties.provisioningState}" --output json
```

Locate the device represented by the provisioning result and check its state.
The registry record is one checkpoint; it doesn't prove that telemetry reached
the routing destination. The CLI manages and inspects cloud configuration; the
supported device SDK still performs provisioning and MQTT v5 publishing.

### [ARM REST](#tab/arm)

Read the DPS resource's ID scope through Azure Resource Manager after signing
in to Azure CLI. `<DPS_RESOURCE_ID>` is the full resource ID saved during
setup, beginning with `/subscriptions/`.

```azurecli
az rest --method get --uri "https://management.azure.com<DPS_RESOURCE_ID>?api-version=2026-11-01" --query "{idScope:properties.idScope,state:properties.state}" --output json
```

Confirm that DPS is `Active` and use its `idScope` value as `DPS_ID_SCOPE`
for the device. Don't substitute the DPS resource ID or service hostname.

This ARM request reads the provisioning service resource; it doesn't create
or verify an individual enrollment. Complete the X.509 enrollment steps in
[hub setup](mqtt-v5-cloud-setup.md#configure-the-linked-resources), using the
CLI or the DPS service API. Enrollments aren't ARM child resources.
The device examples still require the existing certificate and private key.

---

## Choose a payload for the first test

Use UTF-8 JSON with an explicit content type. Include a unique test identifier
so that you can distinguish a current message from old destination data.

The initial .NET and C examples use the standard telemetry client. A
custom-topic publisher is a separate SDK operation; see
[Publish a custom-topic test message with .NET](#publish-a-custom-topic-test-message-with-net)
for an example that also sets MQTT v5 user properties.

## .NET

This example targets `Microsoft.Azure.Iot.Device` **2.0.0-preview3** and .NET 10.
It sends one JSON message through the unified telemetry client.

> [!NOTE]
> In this package version, the MQTT v5 telemetry helper labels its payload as
> UTF-8 character data. Use this example for UTF-8 JSON, not as an arbitrary
> binary-payload example. A later source change corrects the indicator, but
> that change isn't included in this pinned package.

### Create the application

Run these commands in PowerShell:

```powershell
dotnet new console --name HubTelemetry --framework net10.0
Set-Location HubTelemetry
dotnet add package Microsoft.Azure.Iot.Device --version 2.0.0-preview3
```

Replace `Program.cs` with:

```csharp
using System.Security.Cryptography.X509Certificates;
using System.Text.Json;
using Microsoft.Azure.Iot.Device;
using Microsoft.Azure.Iot.Device.Models;
using Microsoft.Azure.Iot.Device.Models.Telemetry;
using Microsoft.Azure.Iot.Device.Unified.Connection;
using Microsoft.Azure.Iot.Device.Unified.Telemetry;

static string RequiredEnvironment(string name)
{
    string? value = Environment.GetEnvironmentVariable(name);
    return !string.IsNullOrWhiteSpace(value)
        ? value
        : throw new InvalidOperationException($"Set {name} before running.");
}

using var certificate = X509CertificateLoader.LoadPkcs12FromFile(
    RequiredEnvironment("DPS_DEVICE_PFX"),
    RequiredEnvironment("DPS_DEVICE_PFX_PASSWORD"));

if (!certificate.HasPrivateKey)
{
    throw new InvalidOperationException("The device certificate must include its private key.");
}

using var timeout = new CancellationTokenSource(TimeSpan.FromMinutes(2));
using var connection = new ConnectionClient();
var telemetry = new TelemetryClient(connection);
var authentication = new X509AuthenticationProvider(certificate);
var provisioning = new ProvisioningSettings(RequiredEnvironment("DPS_ID_SCOPE"));

await connection.ProvisionAndConnectAsync(
    provisioning, authentication, cancellationToken: timeout.Token);

string testId = Guid.NewGuid().ToString();
var message = new DeviceToCloudTelemetry
{
    Payload = JsonSerializer.SerializeToUtf8Bytes(new
    {
        testId,
        temperature = 21.5,
        observedAt = DateTimeOffset.UtcNow
    }),
    ContentType = "application/json",
    ContentEncoding = "utf-8",
    MessageId = testId
};

await telemetry.SendTelemetryAsync(message, timeout.Token);
Console.WriteLine($"Publish completed for testId={testId}. Verify this ID at the destination.");
await connection.DisconnectAsync();
```

The SDK derives the provisioning registration identity from the certificate.
Ensure it matches the enrollment. Let the platform validate the server
certificate; don't disable validation to make a test connect.

### Configure and run

Set `DPS_ID_SCOPE` and `DPS_DEVICE_PFX` in the current PowerShell session:

```powershell
$env:DPS_ID_SCOPE = "<id-scope>"
$env:DPS_DEVICE_PFX = "<absolute-path-to-device.pfx>"
```

Supply `DPS_DEVICE_PFX_PASSWORD` through your local secret-handling mechanism
without recording it in a script or command history. Then run:

```powershell
dotnet run
```

Inspect failures reported by the application instead of treating a timeout
as successful publishing. After the test, remove credential environment
variables from the session when no longer needed.

## C

The C SDK is built from source. The following commands pin the preview source to
commit `1d5c0eeedfac3b81aca492d2dbcdea5531c91176`; its changelog identifies
`1.0.0-preview` as unreleased.

Install the toolchain, CMake, and OpenSSL prerequisites in the
[C samples guide](https://github.com/Azure/azure-iot-sdk/blob/1d5c0eeedfac3b81aca492d2dbcdea5531c91176/c/samples/README.md).
For Windows, use Developer PowerShell for Visual Studio 2022.

### Get the sample

```powershell
git clone --branch releases/public-preview https://github.com/Azure/azure-iot-sdk.git
Set-Location azure-iot-sdk
git checkout 1d5c0eeedfac3b81aca492d2dbcdea5531c91176
git submodule update --init --recursive
Set-Location c
```

### Configure the device

```powershell
$env:AZ_IOT_DPS_ID_SCOPE = "<id-scope>"
$env:AZ_IOT_DPS_REGISTRATION_ID = "<registration-id>"
$env:AZ_IOT_CLIENT_CERT = "<absolute-path-to-device-certificate-chain.pem>"
$env:AZ_IOT_CLIENT_KEY = "<absolute-path-to-device-private-key.pem>"
$env:AZ_IOT_TRUSTED_CA = "<absolute-path-to-trusted-server-ca-bundle.pem>"
```

The sample requires a registration ID that matches the device certificate's common
name. The certificate chain file is in leaf-first order. The trusted CA bundle validates
the DPS and IoT Hub servers. It isn't the device's private key or a replacement
for the client certificate chain.

### Build and run

```powershell
cmake --preset windows-msvc-debug
cmake --build --preset windows-msvc-debug --target az_iot_sample_unified_telemetry
.\build\windows-msvc-debug\samples\unified\Debug\az_iot_sample_telemetry.exe
```

The [unified telemetry sample](https://github.com/Azure/azure-iot-sdk/blob/1d5c0eeedfac3b81aca492d2dbcdea5531c91176/c/samples/unified/telemetry/README.md)
sends JSON periodically for about a minute. Confirm that the DPS assignment
uses MQTT v5. The sample can rebuild its telemetry client when the assigned
profile differs from its initial assumption.

The C telemetry message accepts bytes and an explicit length. Its MQTT v5
telemetry helper defaults Content Type to `application/json`; don't reuse
that default for arbitrary binary. Content Type is overridden through
`AZ_IOT_MSG_PROP_CONTENT_TYPE` (`$.ct`).

## Publish a custom-topic test message with .NET

Before running this example, follow
[custom topic group configuration](mqtt-v5-custom-topics.md). Configure
`fleet/vehicles/{deviceId}/telemetry` and `fleet/vehicles/{deviceId}/faults`,
or a template such as `fleet/vehicles/{deviceId}/#` that covers both.
Retain any other templates needed by existing devices.

Configure a destination and route through [routing setup](mqtt-v5-route-messages.md).
The Fabric verification steps use that walkthrough's `fleet-telemetry`
eventstream and `vehicle-telemetry` IoT Hub endpoint. The publishing steps
also apply when you choose another supported routing destination.

Use the .NET application and pinned SDK package from
[Create the application](#create-the-application).
Keep its certificate loading, provisioning, connection, timeout, and disconnect
steps. Don't add a custom-topic subscription; this workflow publishes only.

1. Remove the `Microsoft.Azure.Iot.Device.Unified.Connection` and
   `Microsoft.Azure.Iot.Device.Unified.Telemetry` using directives from
   `Program.cs`. Add these namespaces to use the MQTT v5 custom publishing path:

   ```csharp
   using Microsoft.Azure.Iot.Device.Mqtt;
   using Microsoft.Azure.Iot.Device.MQTTv5.Connection;
   using Microsoft.Azure.Iot.Device.MQTTv5.CustomTopics;
   ```

1. Replace `var telemetry = new TelemetryClient(connection);` with
   `using var customTopics = new CustomTopicsClient(connection);`.
1. After `ProvisionAndConnectAsync`, replace the block from
   `string testId = ...` through `await telemetry.SendTelemetryAsync(...)`
   with the following. Keep the existing completion message and disconnect
   after this block.

   ```csharp
   string testId = Guid.NewGuid().ToString();
   string category = "faults";
   string? severity = "critical";
   var message = new MqttPublish
   {
       Topic = $"fleet/vehicles/{customTopics.GetDeviceId()}/{category}",
       Payload = JsonSerializer.SerializeToUtf8Bytes(new
       {
           testId,
           temperature = 21.5,
           observedAt = DateTimeOffset.UtcNow
       }),
       ContentType = "application/json",
       PayloadFormatIndicator = MqttPayloadFormatIndicator.CharacterData,
       QualityOfServiceLevel = MqttQualityOfServiceLevel.AtLeastOnce
   };
   if (severity is not null)
   {
       message.AddUserProperty("severity", severity);
   }
   var acknowledgement = await customTopics.PublishAsync(message, timeout.Token);
   Console.WriteLine($"PUBACK: {acknowledgement.ReasonCode}");
   if ((int)acknowledgement.ReasonCode >= 0x80)
   {
       throw new InvalidOperationException(
           $"Publish failed: {acknowledgement.ReasonCode}. {acknowledgement.ReasonString}");
   }
   ```

   `GetDeviceId()` supplies the assigned hub device ID after provisioning.
   The concrete topic matches the configured template. The `severity` user
   property is MQTT message metadata; it isn't a field in the JSON payload.
   MQTT acknowledgment reason codes of `0x80` or greater indicate failure.
   Even a nonfailure acknowledgment doesn't establish arrival in Fabric.

1. Configure the certificate and DPS environment variables as described in
   [Configure and run](#configure-and-run), then run:

   ```powershell
   dotnet run
   ```

   Record the printed `testId` and UTC send time. Resolve any SDK failure
   before checking Fabric. A completed publish isn't proof of delivery.

## Verify the result

For either SDK:

1. Confirm assignment to the intended hub.
1. Inspect connection and publish outcomes.
1. Read the configured destination during the test interval.
1. For the .NET example, locate the printed `testId`. For the C sample, identify
   the test device and JSON payload in that interval.
1. Compare the received data with the sent payload and inspect required metadata.

These SDK payload APIs don't require base64 conversion. However, routing
destinations don't all store or expose payloads identically.
Choose and validate payload handling with the destination you use.

Check the endpoint's **Message format** before comparing bodies. **Device
format** preserves the original payload, subject to the destination's
encoding and envelope. **Standardized** wraps the original JSON value under
`payload.value` in an observation array. It doesn't rename the device's
fields or convert units. See [Message format on an endpoint](mqtt-v5-route-messages.md#message-format-on-an-endpoint).

### Verify actual delivery in Fabric

If you configured the [Fabric routing walkthrough](mqtt-v5-route-messages.md),
use these steps to verify a .NET test message by its `testId`. For the C
sample, identify the test device and JSON payload during the test interval
instead.

1. In the Fabric portal, open `fleet-telemetry` in live view and select the
   **eventstream** node.
1. In the lower pane, select **Data preview**, choose the JSON data format,
   and select **Refresh** to see recent events.
1. Inspect the CloudEvents data according to the endpoint's **Message format**:
   - **Device format:** locate `testId` in the original device payload.
   - **Standardized:** locate the observation array, then find `testId` in
     the observation's `payload.value`.
   Inspect the CloudEvents envelope separately; don't assume the device's
   fields are top-level event fields.
1. Compare the payload and device/event metadata with what the device sent.
   If you followed the routing example, also check the delivered metadata
   for `fleetregion = west`. Don't look for that enrichment inside the device
   payload. See [Verify the Fabric message format and enrichment](mqtt-v5-route-messages.md#verify-the-fabric-message-format-and-enrichment)
   and the [Fabric enrichment property restrictions](iot-hub-devguide-endpoints.md#enrichment-property-restrictions).
1. Check IoT Hub routing metrics and logs for `vehicle-telemetry` during the
   same interval. Investigate authentication or delivery errors rather than
   treating an empty Fabric preview as a successful test.

See [Preview data in an eventstream](/fabric/real-time-intelligence/event-streams/preview-data#preview-an-eventstream)
for the Fabric controls. A data preview is a snapshot, not a durable or
complete record of every message. Configure a persistent Fabric destination
when you need retained data or definitive negative-test evidence.

These checks answer different questions:

| Evidence | What it establishes |
| --- | --- |
| Device provisioning succeeds | Device Provisioning Service (DPS) assigned the device |
| SDK connects | The device established its connection |
| Publish is acknowledged | The publish received an acknowledgment, not a destination receipt |
| Routing reports delivery | The service reports its routing outcome |
| Fabric data preview contains the test message | The test message reached the eventstream |

Allow for destination batching and ingestion latency when choosing the test
window. Don't claim a fixed delay for every destination.

### Verify the selective route

First, configure the [separate filtered delivery path](mqtt-v5-route-messages.md#create-a-separate-filtered-delivery-path).
Rerun the custom-topic publishing sample for each case in the
[expected filter behavior table](mqtt-v5-route-messages.md#expected-filter-behavior),
changing `category` and `severity`. Each run generates a new `testId`.
Set `severity` to `null` for the absent-property case so that no severity
user property is sent.

First, establish successful delivery of the matching case to both eventstreams.
For every nonmatching case, verify the same test ID on the all-messages path.
Use a complete, queryable record over a bounded test window to verify exclusion
from the selective path; absence from a sampled data preview alone isn't proof.
For example, [add an Eventhouse destination](/fabric/real-time-intelligence/event-streams/add-destination-kql-database)
to each eventstream and compare the received test IDs. Keep the streams
separate so that an all-messages copy can't be mistaken for selective delivery.

## Next steps

- [Configure custom topic groups](mqtt-v5-custom-topics.md).
- [Monitor and troubleshoot](mqtt-v5-monitor-troubleshoot.md).
- Review the [SDK capability and lifecycle guide](develop-unified-iot-sdks.md).
