---
title: Configure a device with the unified Azure IoT SDKs
titleSuffix: Azure IoT Hub
description: Connect a device to Azure IoT Hub with the MQTT v5 connection profile using X.509 onboarding and the unified .NET or C SDK, then send telemetry.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 11/12/2026
---

# Configure a device with the unified Azure IoT SDKs

Use the unified Azure IoT SDK for .NET or C to provision a device, connect it
to Azure IoT Hub with the MQTT v5 connection profile, and send telemetry.
Start with a small JSON message and verify it at your downstream destination
before adding custom topics or more complex payloads.

The inline examples use Device Provisioning Service (DPS) to provision the device
with an existing X.509 certificate and get its assigned IoT Hub connection
details. The device then connects to that hub and publishes telemetry over
MQTT v5; telemetry doesn't pass through DPS.

For SDK selection and the shared connection model, see
[Unified Azure IoT SDKs](../iot/device-registry/concept-unified-iot-sdks.md).
Use an MQTT v5-compatible preview release from
[Available SDKs](/azure/iot/device-registry/concept-unified-iot-sdks#available-sdks).
The following examples pin specific versions so that their APIs and commands are reproducible.

## Prerequisites

- Complete [hub setup](mqtt-v5-cloud-setup.md) and
  [routing setup](iot-hub-devguide-messages-d2c.md#connection-profile-differences), including an enabled all-messages route.
  See [routing endpoint requirements](iot-hub-devguide-endpoints.md#custom-endpoints-for-message-routing)
  for your destination.
- An enabled X.509 enrollment in DPS that assigns the device to the intended hub.
- The DPS ID scope and a device certificate with its matching private key.
- A device clock and certificate trust configuration suitable for TLS.
- A destination reader ready to locate the test message.

The following examples use an existing device certificate for DPS onboarding
and the subsequent hub connection. Certificate issuance during onboarding is
a separate setup path. These examples don't create an
enrollment or obtain a certificate for the device.

## X.509 device authentication

IoT hubs with the MQTT v5 connection profile require X.509 certificates for
device connectivity. The certificate can be issued by Microsoft or a
third-party certificate authority. Direct SAS authentication isn't supported
for these hub connections.

The device validates the IoT Hub server certificate and hostname, and IoT Hub
authenticates the device by using its client certificate. Configure the
device to trust the appropriate server certificate chain and present its
device certificate. Don't disable server certificate or hostname validation.
For endpoint selection and TLS requirements, see
[IoT Hub endpoints](iot-hub-devguide-endpoints.md#tls-13-enabled-endpoints).

Keep private keys and certificate passwords out of source control. File-based
credentials are useful for a local evaluation. Use the key protection supported
by your device platform for production design.

### Device Provisioning Service (DPS) onboarding and certificates

DPS onboarding and IoT Hub connectivity use credentials for different purposes:

- **Onboarding credential:** Authenticates the device to DPS. DPS supports
  symmetric-key (SAS) or X.509 credentials for onboarding to this profile.
  Symmetric-key onboarding requires configured certificate issuance so that
  the device can obtain an X.509 certificate for the hub connection.
- **Operational certificate:** An X.509 certificate that authenticates the
  provisioned device to IoT Hub. IoT Hub doesn't support SAS for this connection.

DPS supports certificate issuance during provisioning when an Azure Device
Registry (ADR) issuing certificate authority and policy are configured, the
enrollment references that configuration, and the device submits a certificate
signing request. Alternatively, a device can use an existing X.509 certificate
for both DPS onboarding and hub authentication without requesting a new certificate,
as the examples in this article do.

An X.509 certificate can serve an onboarding or operational role. These roles
describe its purpose, not a different certificate format.

The CLI creation setting `--disable-local-auth false` allows service-side
SAS authentication. It doesn't enable SAS device connections or change the
X.509 requirement. The [setup walkthrough](mqtt-v5-cloud-setup.md) keeps these
service and device credential choices separate.

### Operational certificate management

ADR provides the issuing certificate authority and policy for operational
certificate issuance through DPS. See
[Configure certificate issuance through DPS](mqtt-v5-cloud-setup.md#configure-certificate-issuance-through-dps).

DPS supports operational certificate renewal. The device uses its onboarding
credential and submits a new certificate signing request during provisioning
to get a replacement operational certificate. Direct operational certificate
renewal through the MQTT v5 hub isn't supported in this preview.

Check the selected SDK version for the APIs needed for issuance and renewal;
don't assume that an SDK automatically renews operational certificates.
The inline examples in this article don't implement certificate issuance or renewal.

### Certificate issuance samples

For sample code that requests an operational certificate during DPS provisioning,
see the [C and .NET samples](https://github.com/Azure-Samples/iot-hub-adr-mqtt5-preview).
Each device uses an individual-enrollment symmetric key to authenticate to DPS,
generates a private key and CSR, and requests an operational certificate.
The subsequent MQTT v5 hub connection uses X.509; the symmetric key is only
an onboarding credential.

Follow the repository's setup instructions before running its
[standard telemetry, direct methods, and twins scenario](https://github.com/Azure-Samples/iot-hub-adr-mqtt5-preview#2-standard-telemetry-direct-methods-and-twins).
The shared verifier checks direct-method responses, desired-to-reported property
updates, and telemetry receipt at a standalone Event Hubs destination.
See the [.NET sample](https://github.com/Azure-Samples/iot-hub-adr-mqtt5-preview/tree/main/device-dotnet)
and [C build and run instructions](https://github.com/Azure-Samples/iot-hub-adr-mqtt5-preview/tree/main/device-c).
These samples demonstrate initial issuance, not automatic certificate renewal.

The samples passed local builds and offline checks. Live Azure scenarios
and clean-machine setup still require validation. Review the repository's
prerequisites and validation limitations before running them.

### Certificate trust and rollover

Keep the device's trust store current. Avoid pinning IoT Hub server leaf or
intermediate certificates because these certificates can change during
normal certificate rotation. See
[IoT Hub server TLS certificates](iot-hub-tls-support.md#iot-hubs-server-tls-certificate)
and [certificate pinning guidance](iot-hub-tls-support.md#certificate-pinning).

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

The SDK payload APIs accept bytes. Set content metadata that describes those
bytes, and check the selected API's controls before using a different format.
Device payload metadata is separate from the routing endpoint's **Message format**;
see [Verify the result](#verify-the-result) for destination handling.

The initial .NET and C examples use the standard telemetry client. A
custom-topic publisher is a separate SDK operation; see
[Publish a custom-topic test message with .NET](#publish-a-custom-topic-test-message-with-net)
for an example that also sets MQTT v5 user properties.

## .NET

This example targets `Microsoft.Azure.Iot.Device` **2.0.0-preview4** and .NET 10.
It sends one JSON message through the unified telemetry client.

### Create the application

Run these commands in PowerShell:

```powershell
dotnet new console --name HubTelemetry --framework net10.0
Set-Location HubTelemetry
dotnet add package Microsoft.Azure.Iot.Device --version 2.0.0-preview4
```

Replace `Program.cs` with:

```csharp
using System.Security.Cryptography.X509Certificates;
using System.Text.Json;
using Microsoft.Azure.Iot.Device;
using Microsoft.Azure.Iot.Device.Authentication;
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
var authentication = new X509AuthenticationProvider(certificate, secondaryClientCertificate: null);
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

The C SDK is built from source. The following commands use release
**2.0.0-preview.2**, pinned to the `c/2.0.0-preview.2` tag.

Install the toolchain, CMake, and OpenSSL prerequisites in the
[C samples guide](https://github.com/Azure/azure-iot-sdk/blob/c/2.0.0-preview.2/c/samples/README.md).
For Windows, use Developer PowerShell for Visual Studio 2022.

### Get the sample

```powershell
git clone --branch c/2.0.0-preview.2 --depth 1 https://github.com/Azure/azure-iot-sdk.git
Set-Location azure-iot-sdk
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

The [unified telemetry sample](https://github.com/Azure/azure-iot-sdk/blob/c/2.0.0-preview.2/c/samples/unified/telemetry/README.md)
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

Configure a destination and route through [shared routing guidance](iot-hub-devguide-messages-d2c.md).
Use a supported destination with a reader that can identify the test
messages. The publishing steps don't depend on a particular destination.

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
       Topic = $"fleet/vehicles/{IConnectionClient.DeviceIdPlaceholder}/{category}",
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

   `IConnectionClient.DeviceIdPlaceholder` represents `{deviceId}`. The SDK
   replaces it with the current assigned hub device ID when sending, including
   after reprovisioning changes that ID. The concrete topic matches the
   configured template. The SDK's
   [custom-topic sample](https://github.com/Azure/azure-iot-sdk/blob/c2568eae58cd1235ea2e961eb29e77b02dfe70f9/dotnet/samples/MQTTv5/CustomTopicSample/Program.cs)
   uses the same placeholder pattern. The `severity` user
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
fields or convert units. See [Select the endpoint's message format](iot-hub-agent-ready-data.md#select-the-endpoints-message-format).

<a id="verify-actual-delivery-in-fabric"></a>

### Verify actual delivery at the destination

Use your destination's reader to locate the .NET message by its printed
`testId`. For the C sample, identify the device and known JSON payload
within the test interval. Check the original payload, configured enrichments,
and any destination-specific envelope against the endpoint's message format.
See [Payload interpretation and validation](iot-hub-agent-ready-data.md).
A successful publish acknowledgment isn't proof of destination receipt.

### Verify the selective route

First, configure independent all-messages and selective paths as described in
[Topic and user-property queries](iot-hub-devguide-routing-query-syntax.md#filter-by-mqtt-topic-and-user-properties).
Rerun the custom-topic publishing sample for each case in the
[expected filter behavior table](iot-hub-devguide-routing-query-syntax.md#expected-filter-behavior),
changing `category` and `severity`. Each run generates a new `testId`.
Set `severity` to `null` for the absent-property case so that no severity
user property is sent.

First, establish successful delivery of the matching case to both destinations.
For every nonmatching case, verify the same test ID on the all-messages path.
Use a complete, queryable record over a bounded test window to verify exclusion
from the selective path; absence from a sampled data preview alone isn't proof.
Compare the received test IDs in each destination's record. Keep the paths
separate so that an all-messages copy can't be mistaken for selective delivery.

## Troubleshoot provisioning and delivery

Before testing, [configure diagnostic collection](monitor-iot-hub.md#collect-and-route-monitoring-data).
Record the UTC interval, assigned device ID, and message identifier, but not
credentials. To correlate provisioning, connection, ingress, routing, and destination receipt, follow [Monitor a test run](monitor-iot-hub.md#monitor-a-test-run).

| Symptom | First checks |
| --- | --- |
| Provisioning fails | Check the DPS ID scope, enrollment state, onboarding credential, and linked hub. Symmetric-key onboarding requires configured DPS certificate issuance and a device certificate signing request; existing X.509 onboarding doesn't require new issuance. For link failures, see [Hub configuration troubleshooting](mqtt-v5-cloud-setup.md#troubleshoot-cli-setup). |
| TLS or connection fails | Check the assigned device endpoint, device clock, certificate and private key, trusted server roots, and network access. Follow [Troubleshoot a secure connection](#troubleshoot-a-secure-connection). |
| Custom-topic publish is refused | Check the configured templates, concrete publish topic, assigned hub device ID, and SDK acknowledgment. See [Troubleshoot custom-topic publishing](mqtt-v5-custom-topics.md#troubleshoot-custom-topic-publishing). |
| Publish succeeds but no data arrives | Check the enabled route, source, query, endpoint access, and destination reader. MQTT v5 hubs have no built-in telemetry endpoint or fallback route. |
| Some messages don't arrive | Check selective query behavior, content metadata, throttling, and destination health. Use [Verify the selective route](#verify-the-selective-route) to distinguish excluded messages from failed delivery. |
| Payload arrives but columns are empty | Check the endpoint's message format, destination envelope, and consumer field mapping. For Fabric, inspect CloudEvents data; with standardized output, locate the original JSON under the observation's `payload.value`. |
| Expected enrichment is missing | Check the enrichment key and value, target endpoint, and received metadata. For Fabric, check its [enrichment naming restrictions](iot-hub-devguide-endpoints.md#enrichment-property-restrictions). Don't look for the enrichment inside the device payload. |

A route's schema reference doesn't validate or transform the payload. For
schema and format interpretation, see
[Prepare IoT Hub telemetry for agents and analytics](iot-hub-agent-ready-data.md).

## Troubleshoot a secure connection

Check the following when a device can't connect:

- Verify that the application uses the assigned device endpoint rather than
  a service endpoint.
- Verify that the device clock is correct and that its certificate is valid.
- Verify the server certificate chain and hostname validation.
- Verify that the device certificate and private key match and that the
  application can access the key.
- Check the client's TLS error for certificate, protocol-version, or
  cipher-negotiation failures.
- If TLS succeeds but MQTT connection fails, inspect the MQTT v5 `CONNACK`
  reason code and the device registration.

A successful TLS handshake doesn't by itself establish that the MQTT session
or an application operation succeeded. See
[IoT Hub endpoints](iot-hub-devguide-endpoints.md#tls-13-enabled-endpoints)
for the shared TLS requirements.

## Next steps

- [Configure custom topic groups](mqtt-v5-custom-topics.md).
- [Monitor Azure IoT Hub](monitor-iot-hub.md#monitoring-the-mqtt-v5-connection-profile).
- Review the [shared SDK capability and lifecycle guide](../iot/device-registry/concept-unified-iot-sdks.md).
