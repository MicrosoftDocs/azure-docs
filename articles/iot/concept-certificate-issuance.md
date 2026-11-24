---
title: Certificate Issuance in Azure IoT Hub Certificate Management
titleSuffix: Azure IoT Hub
description: Learn how Azure Device Registry issues X.509 certificates to IoT devices during provisioning, including the certificate hierarchy, issuance flow, and how IoT Hub trusts issued certificates.
author: dimatx
ms.author: dimatokar
ms.service: azure-iot-hub
services: iot-hub
ms.topic: concept-article
ai-usage: ai-generated
ms.date: 10/01/2026
#Customer intent: As an IoT developer or administrator, I want to understand how certificate issuance works in Azure IoT Hub certificate management so I can design a secure device provisioning workflow.
---

# Device certificate issuance in Azure Device Registry

Device certificate issuance is the process by which devices request and receive a certificate as part of provisioning. This article explains the responsibility of a device to send a certificate signing request (CSR), how Azure Device Registry (ADR) and Device Provisioning Service (DPS) work together to issue certificates at scale, and how IoT Hub trusts the issued certificates.

## How device certificate issuance works

Certificate issuance is integrated with device provisioning through DPS. The device uses an onboarding credential to provision and then obtains an operational X.509 certificate, which it then uses to authenticate with IoT Hub. You can implement this flow by using the [unified Azure IoT SDKs](/azure/iot/device-registry/concept-unified-iot-sdks).

1. The device connects to DPS and authenticates by using its onboarding credential, such as a symmetric key, X.509 certificate, or Trusted Platform Module (TPM). During registration, it submits a certificate signing request (CSR) containing its public key. The corresponding private key remains on the device and isn't sent to DPS or the certificate authority.

2. After validating the onboarding credential, DPS creates the device identity in Azure Device Registry and allocates the device to an IoT Hub based on the enrollment configuration.

3. DPS submits the CSR to the intermediate certificate authority (CA) configured in the DPS enrollment. The intermediate CA issues a signed operational X.509 certificate.

4. DPS returns the operational certificate and the assigned IoT Hub connection details to the device.

5. The device connects to its assigned IoT Hub, presents its operational certificate chain, and proves possession of the corresponding private key. During setup, ADR had synchronized the intermediate CA certificate to the linked IoT Hub, enabling the hub to validate the chain.

The device uses its operational certificate for routine IoT Hub connectivity until it expires or is revoked.

:::image type="content" source="media/concept-certificate-issuance/certificate-issuance-runtime-flow-hub-devices.png" alt-text="Conceptual diagram showing how devices acquire the first operational certificate." lightbox="media/concept-certificate-issuance/certificate-issuance-runtime-flow-hub-devices.png":::


## Certificate signing request requirements

When a device provisions or reprovisions, it sends a CSR to DPS. DPS expects the CSR to meet the following requirements:

- **Format:** Base64-encoded distinguished encoding rules (DER) following the public key cryptography standards (PKCS) #10 specification. Privacy-enhanced mail (PEM) headers and footers can't be included.
- **Common name (CN):** The CN field must exactly match the device's DPS registration ID.

For implementation guidance, see [Unified Azure IoT SDKs for IoT Hub and Azure Device Registry](device-registry/concept-unified-iot-sdks.md).

## Certificate validity and expiration

The certificate policy defines the validity period of device certificates issued by the intermediate CA. However, each issued device certificate's expiration date (`ValidNotAfter`) includes a randomly generated extra buffer of 0-24 hours beyond that period. For example, a policy with a 30-day validity period produces certificates that expire 30 days plus 0-24 hours after their `ValidFrom` date. Device applications can read the `ValidNotAfter` value to schedule renewal before expiration.

## How IoT Hub trusts issued certificates

For a device to authenticate with IoT Hub using its issued certificate, IoT Hub must trust the intermediate CA that signed the device certificate. When you create the CA, ADR automatically pushes the public CA certificate to your linked IoT Hubs. IoT Hub stores the intermediate CA certificate and uses it to validate the certificate chain that your devices present during TLS authentication.

## Get started with device certificate issuance

IoT devices can request device certificates from ADR by using standard device workflows. To get started, see [Unified Azure IoT SDKs for IoT Hub and Azure Device Registry](device-registry/concept-unified-iot-sdks.md).

## Related content

- [Certificate renewal in Azure IoT Hub certificate management](concept-certificate-renewal.md)
- [Key concepts for certificate management](iot-certificate-management-concepts.md)

- [Certificate management in Azure Device Registry](iot-certificate-management-overview.md)
