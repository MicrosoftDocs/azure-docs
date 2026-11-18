---
title: Connect a device using MQTT v5
titleSuffix: Azure IoT Hub
description: Connect a device to Azure IoT Hub with the MQTT v5 connection profile using X.509 onboarding and the unified .NET or C SDK, then send telemetry.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 11/18/2026
---

# Connect a device using MQTT v5

<a id="configure-a-device-with-the-unified-azure-iot-sdks"></a>

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

Don't disable server certificate or hostname validation. For endpoint selection
and shared TLS requirements, see
[IoT Hub endpoints](iot-hub-devguide-endpoints.md#tls-13-enabled-endpoints).

Keep private keys and certificate passwords out of source control. File-based
credentials are useful for a local evaluation. Use the key protection supported
by your device platform for production design.

### Device Provisioning Service (DPS) onboarding and certificates

DPS onboarding and hub authentication are separate. A symmetric-key onboarding
credential doesn't enable SAS authentication to an MQTT v5 hub; the device must
obtain an operational X.509 certificate through a supported DPS issuance path.
The examples here instead use an existing X.509 certificate for both connections.
For language- and version-specific support, see
[Provisioning and authentication](../iot/device-registry/concept-unified-iot-sdks.md#provisioning-and-authentication).

The CLI creation setting `--disable-local-auth false` allows service-side
SAS authentication. It doesn't enable SAS device connections or change the
X.509 requirement. The [setup walkthrough](mqtt-v5-cloud-setup.md) keeps these
service and device credential choices separate.

<a id="operational-certificate-management"></a>

### Operational certificate issuance and renewal through DPS

For MQTT v5, operational certificate issuance and renewal go through DPS,
not directly through the hub. ADR provides the issuing CA and certificate policy.
Renewal requires the onboarding credential
and a new certificate signing request. SDK support varies by language,
version, and API surface; don't assume automatic renewal.
See [SDK certificate-management support](../iot/device-registry/concept-unified-iot-sdks.md#certificate-management)
and [Configure certificate issuance through DPS](mqtt-v5-cloud-setup.md#configure-certificate-issuance-through-dps).
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

Follow the shared [server certificate](iot-hub-tls-support.md#iot-hubs-server-tls-certificate)
and [certificate pinning guidance](iot-hub-tls-support.md#certificate-pinning)
to maintain the device trust store.

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

Confirm the linked resources by using [Verify readiness](mqtt-v5-cloud-setup.md#verify-readiness).
Cloud configuration alone doesn't prove provisioning or message delivery;
the device SDK and destination reader provide those checkpoints.

### [ARM REST](#tab/arm)

Use [Inspect resource and link states through ARM REST](mqtt-v5-cloud-setup.md#inspect-resource-and-link-states-through-arm-rest)
to check resource readiness. Obtain the DPS ID scope and complete the X.509
enrollment steps in [Configure the linked resources](mqtt-v5-cloud-setup.md#configure-the-linked-resources).
Enrollments aren't ARM child resources. Use the ID scope, not the resource ID
or service hostname, as `DPS_ID_SCOPE`.

---

## Choose a payload for the first test

Use UTF-8 JSON with an explicit content type. Include a unique test identifier
so that you can distinguish a current message from old destination data.

For shared payload and content-metadata guidance, see
[Create and read IoT Hub messages](iot-hub-devguide-messages-construct.md).
The routing endpoint's **Message format** is a separate setting; see
[Verify the result](#verify-the-result).

The initial .NET and C examples use the standard telemetry client. A
custom-topic publisher is a separate SDK operation; see
[Publish a custom-topic test message with .NET](mqtt-v5-custom-topics.md#publish-a-custom-topic-test-message-with-net)
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

After the standard telemetry test succeeds, continue with
[Publish a custom-topic test message with .NET](mqtt-v5-custom-topics.md#publish-a-custom-topic-test-message-with-net).
That example reuses this application's certificate loading and connection setup.

## Verify the result

For either SDK:

1. Confirm assignment to the intended hub.
1. Inspect connection and publish outcomes.
1. Read the configured destination during the test interval.
1. For the .NET example, locate the printed `testId`. For the C sample, identify
   the test device and JSON payload in that interval.
1. Compare the received data with the sent payload and inspect required metadata.

These SDK payload APIs don't require base64 conversion. Interpret the received
payload according to the destination and its configured
[Message format](iot-hub-agent-ready-data.md#select-the-endpoints-message-format).
MQTT v5 hubs have no built-in telemetry endpoint or fallback route.

<a id="verify-actual-delivery-in-fabric"></a>

### Verify actual delivery at the destination

A successful publish acknowledgment isn't proof of destination receipt.
Follow [Monitor a test run](monitor-iot-hub.md#monitor-a-test-run) and
[Verify readiness with the receiving application](iot-hub-agent-ready-data.md#verify-readiness-with-the-receiving-application)
to correlate the message with routing and destination evidence.

### Verify the selective route

For the custom-topic example and its positive and negative routing checks, see
[Verify the selective route](mqtt-v5-custom-topics.md#verify-the-selective-route).

## Troubleshoot provisioning and delivery

Before testing, [configure diagnostic collection](monitor-iot-hub.md#collect-and-route-monitoring-data).
Record the UTC interval, assigned device ID, and message identifier, but not
credentials. To correlate provisioning, connection, ingress, routing, and destination receipt, follow [Monitor a test run](monitor-iot-hub.md#monitor-a-test-run).

Use this checklist for MQTT v5-specific requirements:

| Symptom | MQTT v5-specific checks |
| --- | --- |
| Provisioning or authentication fails | Hub connections require X.509, not SAS. Symmetric-key onboarding requires configured DPS certificate issuance and a device certificate signing request; existing X.509 onboarding doesn't require new issuance. See [Hub configuration troubleshooting](mqtt-v5-cloud-setup.md#troubleshoot-cli-setup) and [Troubleshoot a secure connection](#troubleshoot-a-secure-connection). |
| Custom-topic publish is refused | Check the configured templates, concrete publish topic, assigned hub device ID, and SDK acknowledgment. See [Troubleshoot custom-topic publishing](mqtt-v5-custom-topics.md#troubleshoot-custom-topic-publishing). |
| Publish succeeds but no data arrives | MQTT v5 hubs have no built-in telemetry endpoint or fallback route. Configure and enable an explicit route to a supported destination, then verify receipt there. |

For checks shared across connection profiles, use:

- [Monitor a test run](monitor-iot-hub.md#monitor-a-test-run) for provisioning, connection, ingress, routing, and consumption checkpoints.
- [Troubleshoot message routing](troubleshoot-message-routing.md#messages-from-my-devices-are-not-being-routed-as-expected) for routing metrics, resource logs, and endpoint health. Built-in-endpoint and fallback-route instructions apply only to the classic profile. For the custom-topic example's positive and negative checks, see [Verify the selective route](mqtt-v5-custom-topics.md#verify-the-selective-route).
- [Verify readiness with the receiving application](iot-hub-agent-ready-data.md#verify-readiness-with-the-receiving-application) for payload format, schema interpretation, and consumer field mapping.
- [Message enrichments](iot-hub-message-enrichments-overview.md) for enrichment keys, values, and target endpoints, and [Fabric enrichment restrictions](iot-hub-devguide-endpoints.md#enrichment-property-restrictions) when using a Fabric destination.

## Troubleshoot a secure connection

Use the assigned **device endpoint**, not a service endpoint. Check the device
clock, certificate and private key, server trust, and network access against
the shared [TLS requirements](iot-hub-devguide-endpoints.md#tls-13-enabled-endpoints).
If TLS succeeds but MQTT connection fails, inspect the MQTT v5 `CONNACK`
reason code and device registration. A successful TLS handshake doesn't prove
MQTT session establishment or application success.

## Next steps

- [Configure custom topic groups](mqtt-v5-custom-topics.md).
- [Monitor Azure IoT Hub](monitor-iot-hub.md#monitoring-the-mqtt-v5-connection-profile).
- Review the [shared SDK capability and lifecycle guide](../iot/device-registry/concept-unified-iot-sdks.md).
