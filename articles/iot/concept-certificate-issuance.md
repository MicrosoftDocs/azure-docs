---
title: Certificate Issuance in Azure IoT Hub Certificate Management (Preview)
titleSuffix: Azure IoT Hub
description: Learn how Azure Device Registry issues X.509 certificates to IoT devices during provisioning, including the certificate hierarchy, issuance flow, and how IoT Hub trusts issued certificates.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-hub
services: iot-hub
ms.topic: concept-article
ai-usage: ai-generated
ms.date: 10/01/2026
#Customer intent: As an IoT developer or administrator, I want to understand how certificate issuance works in Azure IoT Hub certificate management so I can design a secure device provisioning workflow.
---

# Device certificate issuance in Azure Device Registry (preview)

Device certificate issuance is the process by which devices request and receive a certificate as part of provisioning. This article explains the responsibility of a device to send a certificate signing request (CSR), how Azure Device Registry (ADR) and Device Provisioning Service (DPS) work together to issue certificates at scale, and how IoT Hub trusts the issued certificates.

[!INCLUDE [iot-hub-public-preview-banner](../iot-hub/includes/public-preview-banner.md)]

## How device certificate issuance works

The following steps describe the end-to-end issuance flow:

1. The IoT device connects to the DPS endpoint and authenticates by using its onboarding credential, such as a symmetric key, X.509 certificate, or Trusted Platform Module (TPM). As part of this registration call, the device sends a certificate signing request (CSR) that includes the device's public key and its registration ID.

1. Upon successful validation of the onboarding credential, the device identity is created in ADR and is allocated to the appropriate IoT Hub based on the enrollment configuration. 

1. DPS forwards the CSR to the certificate authority (CA) that you created in ADR and referenced in the DPS enrollment. The CA validates the request and then issues a signed X.509 certificate.

1. DPS returns the issued certificate and IoT Hub connection details to the device.
1. The device authenticates with IoT Hub by presenting its full certificate chain.

:::image type="content" source="media/concept-certificate-issuance/operational-diagram.png" alt-text="Diagram that shows how Azure Device Registry integrates with IoT Hub and DPS for certificate management during provisioning." lightbox="media/concept-certificate-issuance/operational-diagram.png" border="false":::

## Certificate signing request requirements

When a device provisions or reprovisions, it sends a CSR to DPS. DPS expects the CSR to meet the following requirements:

- **Format:** Base64-encoded distinguished encoding rules (DER) following the public key cryptography standards (PKCS) #10 specification. Privacy-enhanced mail (PEM) headers and footers can't be included.
- **Common name (CN):** The CN field must exactly match the device's DPS registration ID.
For implementation guidance, see [Unified Azure IoT SDKs (preview) for IoT Hub and Azure Device Registry](device-registry/concept-unified-iot-sdks.md).

## Cryptographic algorithms

Certificate authorities you create in Azure Device Registry use the following cryptographic standards for all certificates they issue:

| Property | Value |
|----------|-------|
| Key algorithm | ECC (ECDSA) |
| Curve | NIST P-384 (secp384r1) |
| Hash algorithm | SHA-384 |
| Key storage | Azure Managed HSM |

ECC with P-384 offers equivalent security to RSA at much smaller key sizes. This algorithm produces smaller certificates, faster TLS handshakes, and lower power consumption on constrained IoT devices.

## IoT Hub trust and CA sync

For a device to authenticate with IoT Hub using its issued certificate, IoT Hub must trust the intermediate CA that signed the device certificate. When you create the CA, ADR automatically pushes the public CA certificate to your linked IoT Hubs. IoT Hub stores the intermediate CA certificate and uses it to validate the certificate chain that your devices present during TLS authentication.

## Get started with device certificate issuance

IoT devices can request device certificates from ADR by using standard device workflows. To get started, see [Unified Azure IoT SDKs (preview) for IoT Hub and Azure Device Registry](device-registry/concept-unified-iot-sdks.md).

## Related content

- [Certificate renewal in Azure IoT Hub certificate management](concept-certificate-renewal.md)
- [Key concepts for certificate management](iot-certificate-management-concepts.md)
- [What is certificate management (preview)?](iot-certificate-management-overview.md)
