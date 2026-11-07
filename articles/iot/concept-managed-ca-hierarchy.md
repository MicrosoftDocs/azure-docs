---
title: Certificate authorities hierarchy
titleSuffix: Azure Device Registry
description: Learn how the root and intermediate certificate authorities establish trust for device certificates in Azure Device Registry.
author: sethmanheim
ms.author: sethm
ms.service: azure-device-registry
ms.topic: concept-article
ai-usage: ai-assisted
ms.date: 09/17/2026

---

# Certificate authorities in Azure Device Registry

Certificate management in Azure Device Registry uses a two-tier certificate authority (CA) hierarchy, consisting of a **root CA** and **intermediate CA**. A root CA acts as the trust anchor for devices in the namespace, while the intermediate CA (ICA), also known as an issuing CA, is responsible for issuing and renewing device certificates on behalf of the root CA. Each intermediate CA manages a single certificate policy, which defines the validity period for certificates that it signs. When you create an intermediate certificate authority, Azure Device Registry:

- Generates and securely stores the intermediate CA certificate and private key in [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview). Hardware-backed protection helps prevent unauthorized access to key material.

- Manages the intermediate CA lifecycle, including monitoring certificate validity and supporting rotation operations. For intermediate CAs created with BYOCA, you must ensure your external CA re-issues a new intermediate CA before expiry.

- Uses the intermediate CA to issue device certificates while the root CA remains the trusted anchor for the hierarchy.

## Deployment options

In a single namespace, you can create up to three intermediate CAs. You have two deployment options for your intermediate certificate authorities: 

- **Use a namespace-level root CA:** Deploy an intermediate CA that a root CA in your namespace signs and issues. This root CA is created in Microsoft cloud PKI.

- **Bring your own certification authority (BYOCA):** Deploy an intermediate CA that your own private CA signs and issues. This option requires you to have access to your private CA for signing.

You can also use a combination of deployment models in a single namespace. 

[!INCLUDE [iot-hub-public-preview-banner](../iot-hub/includes/public-preview-banner.md)]

## Option 1: Use a namespace-level root CA

### Root CA

In an Azure Device Registry, you can create up to one root CA per namespace. Use this root CA to sign intermediate CAs that then issue device certificates:

:::image type="content" source="media/concept-managed-ca-hierarchy/namespace-microsoft-hierarchy.png" alt-text="Diagram showing Microsoft root CA namespace architecture." lightbox="media/concept-managed-ca-hierarchy/namespace-microsoft-hierarchy.png":::

When you create a root CA in a namespace, Azure Device Registry:

- Uses Microsoft cloud PKI to generate and securely store the root CA certificate and private key in [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview). Hardware-backed protection helps prevent unauthorized access to key material.
- Manages the root CA lifecycle, including monitoring certificate validity and supporting rotation operations. The root CA is valid for 10 years.
- Uses the root CA to sign intermediate CAs while keeping the root CA isolated from day-to-day device certificate operations.

### Certificate chain

When Azure Device Registry issues a device certificate, the certificate chains to the namespace root CA through the intermediate CA. The chain consists of:

- **Device certificate**: Identifies a specific IoT device and is signed by the intermediate CA.
- **Intermediate CA certificate**: Signs and manages device certificates and is signed by the namespace root CA.
- **Namespace root CA certificate**: Establishes the root of trust for the namespace.

This hierarchy limits use of the root CA, separates device certificate operations from the trust anchor, and ensures that certificates issued within the namespace chain to a common root of trust.

To get started with a namespace-managed root CA, see [set up a root and intermediate CA](how-to-create-policy.md).

## Option 2: Bring your own CA (BYOCA)

BYOCA allows you to create an intermediate CA in Azure Device Registry (ADR) that is anchored to a CA managed outside of ADR. This CA issues device certificates, but the root of trust remains the external CA. When you create an intermediate CA by using BYOCA, ADR creates a certificate signing request to complete activation.

:::image type="content" source="media/concept-managed-ca-hierarchy/namespace-bring-your-own-hierarchy.png" alt-text="Diagram showing BYO root CA namespace architecture." lightbox="media/concept-managed-ca-hierarchy/namespace-bring-your-own-hierarchy.png":::

When you configure an intermediate CA that an external CA signs, Microsoft:

- Generates and securely stores the intermediate CA certificate and private key in [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview) providing hardware-backed protection for cryptographic operations and helping prevent unauthorized access to key material. 

- Uses a shared responsibility model in which Microsoft manages the intermediate CA lifecycle, including monitoring and rotation, while the organization is responsible for renewing and maintaining the validity of the external certificate that signs the intermediate CA. This intermediate CA has a validity of one year.

- Allows you to issue device certificates that are signed by the intermediate CA, while the external CA remains the trusted anchor for the hierarchy.

### Certificate chain

When a device requests a certificate through Azure Device Registry, the certificate chains to the external CA through the intermediate CA. The chain consists of:

- **The device certificate:** Unique to the specific IoT device.

- **The Microsoft issuing CA (ICA):** The CA managed by Device Registry that signs the device request.

- **The external root CA:** Your organization's trusted root, which signs the Microsoft ICA.

Any service that trusts your corporate root CA automatically trusts the certificates issued to your IoT devices by Azure. 

To get started with BYOCA, see [Bring your own CA](how-to-create-policy-external-certificate.md).

## Related content

- [What is certificate management in Azure Device Registry?](iot-certificate-management-overview.md)

- [PKI fundamentals](iot-certificate-management-concepts.md)

- [Certificate authorities in Azure Device Registry](concept-managed-ca-hierarchy.md)

- [Set up a root and intermediate CA](how-to-create-policy.md)

- [Certificate issuance in Azure Device Registry](concept-certificate-issuance.md)

- [Certificate revocation in Azure Device Registry](concepts-certificate-policy-management.md)

