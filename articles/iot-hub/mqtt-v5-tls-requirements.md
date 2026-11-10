---
title: TLS and X.509 requirements for Azure IoT Hub with the MQTT v5 connection profile
titleSuffix: Azure IoT Hub
description: Understand TLS-capable endpoints and X.509 device authentication for Azure IoT Hub with the MQTT v5 connection profile.
author: Usha-Rathnavel
ms.author: usrathna
ms.service: azure-iot-hub
ms.topic: concept-article
ms.date: 10/25/2026
---

# TLS and X.509 requirements for Azure IoT Hub with the MQTT v5 connection profile

Azure IoT Hub uses Transport Layer Security (TLS) to secure communication
between devices, service applications, and IoT Hub. This article distinguishes
connection profiles from endpoints and describes certificate-based device
connectivity for Azure IoT Hub with the MQTT v5 connection profile.

> [!IMPORTANT]
> Azure IoT Hub with the MQTT v5 connection profile and its device and service
> endpoints are in preview. General availability of TLS 1.3-capable endpoints
> for the classic connection profile doesn't change this preview status.

## Connection profiles and endpoints

A **connection profile** describes the IoT hub's connectivity configuration.
An **endpoint** is the hostname that a device or service application connects
to. These terms describe different aspects of an IoT hub.

- **IoT hubs with the classic connection profile** support the existing IoT Hub
  connectivity experience, including the classic endpoint and the TLS
  1.3-capable device and service endpoints.
- **IoT hubs with the MQTT v5 connection profile** support MQTT v5 device
  connectivity and provide TLS 1.3-capable device and service endpoints in
  preview.

The word *classic* in **classic connection profile** identifies a connection
configuration. The word *classic* in **classic endpoint** identifies the
existing `<hub>.azure-devices.net` hostname. An IoT hub with the classic
connection profile isn't limited to the classic endpoint.

Changing an endpoint hostname doesn't change the hub's connection profile.
Using a TLS 1.3-capable endpoint doesn't, by itself, enable MQTT v5.

## Endpoint availability by connection profile

| Connection profile | Endpoint | Availability |
| --- | --- | --- |
| Classic | Classic endpoint | Generally available |
| Classic | TLS 1.3-capable device endpoint | Generally available |
| Classic | TLS 1.3-capable service endpoint | Generally available |
| MQTT v5 | TLS 1.3-capable device endpoint | Preview |
| MQTT v5 | TLS 1.3-capable service endpoint | Preview |

Device endpoints are for device connections. Service endpoints are for
backend service applications. Don't use a service endpoint for a device
connection.

For the endpoint hostname formats and general TLS guidance, see
[Azure IoT Hub TLS support](iot-hub-tls-support.md#tls-13-support-preview).

For a provisioned device, use the endpoint returned by Device Provisioning
Service (DPS). Don't build an endpoint by substituting a suffix in a hostname.
If a service tool obtains
a hub connection string with the preview CLI, select `--hostname-type service`;
a service connection string isn't a device onboarding credential.

## TLS version and device protocol

TLS secures the connection. MQTT defines how the device exchanges messages
over that connection. The two protocol versions are independent.

Azure IoT Hub with the MQTT v5 connection profile uses MQTT v5 for device
communication. It doesn't support MQTT v3.1.1, AMQP, or HTTPS device messaging.

**TLS 1.3-capable** means that an endpoint supports TLS 1.3. It doesn't mean
that every connection must use TLS 1.3. The client and endpoint negotiate a
TLS version and cipher suite that both support.

For the classic connection profile, the TLS support article documents:

- TLS 1.2 on the classic endpoint.
- TLS 1.2 with restricted cipher suites and TLS 1.3 on the device and service
  endpoints.
- Server Name Indication (SNI) as a requirement for the device and service
  endpoints.

These endpoint settings describe TLS behavior, not MQTT version support or
device authentication credentials.

## X.509 device authentication

IoT hubs with the MQTT v5 connection profile require X.509 certificates for
device connectivity. The certificate can be issued by Microsoft or a
third-party certificate authority.

Certificate-based TLS authentication has two parts:

- The device validates the IoT Hub server certificate and hostname.
- IoT Hub authenticates the device by using its client certificate.

Configure the device to trust the appropriate server certificate chain and
to present its device certificate. Protect the corresponding private key.
Don't disable server certificate or hostname validation to work around a
connection failure.

Direct SAS authentication isn't supported for Azure IoT Hub with the MQTT v5
connection profile. Don't use SAS tokens or symmetric device keys to
authenticate a device directly to the hub.

## Device Provisioning Service (DPS) onboarding and certificates

DPS onboarding and IoT Hub connectivity use credentials for different
purposes:

- **Onboarding credential:** Authenticates the device to DPS. DPS supports
  symmetric-key (SAS) or X.509 credentials for onboarding to this profile.
  Symmetric-key onboarding requires configured certificate issuance so that
  the device can obtain an X.509 certificate for the hub connection.
- **Operational certificate:** An X.509 certificate that authenticates the
  provisioned device to IoT Hub. IoT Hub doesn't support SAS for this connection.

DPS supports certificate issuance during provisioning when an ADR issuing
certificate authority and policy are configured, the enrollment references
that configuration, and the device submits a certificate signing request.
Alternatively, a device can use an existing X.509 certificate for both DPS
onboarding and hub authentication without requesting a new certificate.

An X.509 certificate can serve an onboarding or operational role. These roles
describe its purpose, not a different certificate format.

SAS support during onboarding doesn't enable direct SAS connectivity to the
hub.

The CLI creation setting `--disable-local-auth false` allows service-side
SAS authentication. It doesn't enable SAS device connections or change the
X.509 requirement. The [setup walkthrough](mqtt-v5-cloud-setup.md) keeps these
service and device credential choices separate.

## Operational certificate management

Azure Device Registry provides the issuing certificate authority and policy
used for operational certificate issuance through DPS. See
[Configure certificate issuance through DPS](mqtt-v5-cloud-setup.md#configure-certificate-issuance-through-dps).

DPS supports operational certificate renewal. The device uses
its onboarding credential and submits a fresh certificate signing request
during provisioning to get a replacement operational certificate.
Direct operational certificate renewal through the MQTT v5 hub isn't
supported in this preview.

## Configure device applications

The unified Azure IoT SDKs for .NET and C are supported for the MQTT v5
connection profile preview.

Configure the application with the assigned device endpoint, its device
identity, the X.509 certificate and private key, and the required certificate
trust configuration. Use the selected SDK's documentation for platform-specific
TLS configuration.

Check the selected SDK version for the APIs and configuration needed for DPS
onboarding, certificate issuance, and repeat issuance for renewal. Don't
assume that an SDK automatically renews operational certificates.

For SDK-specific guidance, see
[Develop with unified Azure IoT SDKs](develop-unified-iot-sdks.md).

## Certificate trust and rollover

Keep the device's trust store current. Avoid pinning IoT Hub server leaf or
intermediate certificates because these certificates can change during
normal certificate rotation.

For server root certificate and rollover guidance, see
[IoT Hub server TLS certificates](iot-hub-tls-support.md#iot-hubs-server-tls-certificate)
and [certificate pinning guidance](iot-hub-tls-support.md#certificate-pinning).

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
or an application operation succeeded.

## Next steps

- Review [Capabilities of Azure IoT Hub with the MQTT v5 connection profile](mqtt-v5-capabilities.md).
- [Compare Azure IoT Hub connectivity options](compare-iot-hub-connectivity.md).
- [Create and connect to an Azure IoT hub with the MQTT v5 connection profile](mqtt-v5-get-started.md).
