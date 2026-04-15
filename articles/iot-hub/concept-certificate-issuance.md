---
title: Certificate Issuance in Azure IoT Hub Certificate Management (Preview)
titleSuffix: Azure IoT Hub
description: Learn how Azure Device Registry issues X.509 certificates to IoT devices during provisioning, including the certificate hierarchy, issuance flow, and how IoT Hub trusts issued certificates.
author: cwatson-cat
ms.author: cwatson
ms.service: azure-iot-hub
services: iot-hub
ms.topic: concept-article
ai-usage: ai-generated
ms.date: 03/16/2026
#Customer intent: As an IoT developer or administrator, I want to understand how certificate issuance works in Azure IoT Hub certificate management so I can design a secure device provisioning workflow.
---

# Device certificate issuance in Azure IoT Hub certificate management (preview)

Device certificate issuance is the process by which devices request and receive a certificate as part of provisioning. Azure Device Registry (ADR) generates and issues a new X.509 certificate to your IoT devices during provisioning. This article explains the responsibility of a device to send a Certificate Signing Request (CSR), how ADR and Device Provisioning Service (DPS) work together to issue certificates at scale, and how IoT Hub trusts the issued certificates.

[!INCLUDE [iot-hub-public-preview-banner](includes/public-preview-banner.md)]

## How device certificate issuance works

The following steps describe the end-to-end issuance flow:

1. The IoT device connects to the DPS endpoint and authenticates by using its pre-configured onboarding credential, such as a symmetric key, X.509 certificate, or Trusted Platform Module (TPM). As part of this registration call, the device sends a certificate signing request (CSR) that includes the device's public key and its registration ID.
1. DPS assigns the IoT device to an IoT Hub based on the enrollment configuration.
1. The device identity is created in IoT Hub and registered to the ADR namespace.
 The CSR is forwarded to the unique PKI assigned to the ADR Namespace. The PKI validates the request and forwards it to the policy linked to the DPS enrollment.
1. The policy's issuing CA signs and issues the operational certificate.
1. DPS returns the issued certificate and IoT Hub connection details to the device.
1. The device authenticates with IoT Hub by presenting its full certificate chain.

:::image type="content" source="media/concept-certificate-issuance/operational-diagram.png" alt-text="Diagram that shows how Azure Device Registry integrates with IoT Hub and DPS for certificate management during provisioning." lightbox="media/concept-certificate-issuance/operational-diagram.png" border="false":::

## Certificate signing request requirements

When a device provisions or reprovisions, it sends a CSR to DPS. DPS expects the CSR to meet the following requirements:

- **Format:** Base64-encoded distinguished encoding rules (DER) following the public key cryptography standards (PKCS) #10 specification. Privacy-enhanced mail (PEM) headers and footers can't be included.
- **Common name (CN):** The CN field must exactly match the device's DPS registration ID.
- **Key algorithm:** Elliptic curve (EC) key using the NIST P-384 curve. RSA keys aren't supported in the current preview.

For implementation examples, see [DPS device SDK samples](../iot-dps/libraries-sdks.md#device-sdks).

## Cryptographic algorithms

Certificate management uses the following cryptographic standards for all certificates issued by a policy:

| Property | Value |
|----------|-------|
| Key algorithm | ECC (ECDSA) |
| Curve | NIST P-384 (secp384r1) |
| Hash algorithm | SHA-384 |
| Key storage | Azure Managed HSM |

ECC with P-384 offers equivalent security to RSA at much smaller key sizes. This algorithm produces smaller certificates, faster TLS handshakes, and lower power consumption on constrained IoT devices.

## IoT Hub trust and credential sync

For a device to authenticate with IoT Hub by using its issued certificate, IoT Hub must trust the issuing CA that signed the device certificate. ADR manages this trust through credential sync, which pushes the issuing CA certificate from ADR to your linked IoT Hubs.

To run credential sync manually, use the following Azure CLI command:

```azurecli
az iot adr ns credential sync --namespace <namespace> -g <resource-group>
```

IoT Hub stores the issuing CA certificate and uses it to validate the certificate chain that your devices present during TLS authentication.

## Related content

- [Certificate renewal in Azure IoT Hub certificate management](concept-certificate-renewal.md)
- [Key concepts for certificate management](iot-hub-certificate-management-concepts.md)
- [What is certificate management (preview)?](iot-hub-certificate-management-overview.md)
- [Deploy Azure IoT Hub with ADR integration and certificate management](iot-hub-device-registry-setup.md)
- [DPS device SDK samples](../iot-dps/libraries-sdks.md#device-sdks)
