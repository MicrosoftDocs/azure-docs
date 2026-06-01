---
title: What is Microsoft-backed X.509 Certificate Management (Preview)?
titleSuffix: Azure IoT Hub
description: This article discusses the basic concepts of how certificate management in Azure IoT Hub helps users manage device certificates.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-hub
services: iot-hub
ms.topic: overview
ms.date: 04/15/2026
ai-usage: ai-assisted
#Customer intent: As a developer new to IoT, I want to understand what certificate management is and how it can help me manage my IoT device certificates.
---

# What is certificate management (preview) in Azure Device Registry?

__Certificate management__ is an optional feature of __Azure Device Registry (ADR)__ that simplifies the issuance and lifecycle management of X.509 certificates for IoT devices. This feature configures a unique, cloud Public Key Infrastructure (PKI) for each ADR namespace, eliminating the need for on-prem servers, complex connectors, or dedicated hardware. By automating certificate issuance and renewal, ADR ensures that provisioned devices maintain a secure, seamless connection when authenticating with __Azure IoT Hub__.

To use certificate management, you must use IoT Hub, [Azure Device Registry (ADR)](iot-hub-device-registry-setup.md), and [Device Provisioning Service (DPS)](../iot-dps/index.yml). Certificate management is currently in public preview.

[!INCLUDE [iot-hub-public-preview-banner](includes/public-preview-banner.md)]

## Overview of features

The following features are supported with certificate management for IoT Hub devices in preview:

| Feature | Description |
| --- | --- |
| Create multiple certificate authorities (CA) in an ADR namespace | Create two-tier PKI hierarchy with root and issuing CA in the cloud. |
| Create a unique root CA per ADR namespace | Create up to 1 credential resource per ADR namespace. A single credential manages one, unique, root CA in your dedicated cloud PKI. |
| Create up to one issuing CA per ADR namespace| Create up to 1 policy per ADR namespace. A single policy manages one, unique, issuing CA, and allows you to customize the validity period for issued device certificates. You can choose to have your issuing CA be signed by your namespace-level root CA or an external root CA that your organization owns. |
| Signing and encryption algorithms| Certificate management supports ECC (ECDSA) and the NIST P-384 curve.|
| Hash algorithms | Certificate management supports SHA-384. |
| HSM keys (signing and encryption) | Keys are provisioned by using [Azure Key Vault Managed Hardware Security Module (Azure Managed HSM)](/azure/key-vault/managed-hsm/overview). CAs created within your ADR namespace automatically use HSM signing and encryption keys. No Azure subscription is required for Azure HSM. |
|Device certificate issuance and renewal | Device certificates, also known as leaf certificates, are signed by the issuing CA and delivered to the device via device APIs. Leaf certificates can also be renewed by the issuing CA. |
| Device certificate revocation | Revoke individual device certificates to block device connections until a new certificate is issued to the device. Revoked certificates are added to the parent CA's Certificate Revocation List (CRL). |
| Policy revocation |Revoke a policy to remove the associated CA certificate from IoT Hub and add the CA to the parent CA’s Certificate Revocation List (CRL). This will block all devices from connecting to IoT Hub with a certificate issued by that CA. Revocation is not supported for policies that are signed by an external CA.|
|Certificate Revocation List (CRL) distribution points|Azure hosts the CRL distribution point (CDP) for each CA. The CDP URL is embedded on each certificate. The CRL is updated with every certificate revocation.|
|Authority Information Access (AIA) end points|Azure hosts the AIA endpoint for each Issuing CA. The AIA URL is embedded on each certificate. The AIA endpoint can be used by relying parties to retrieve parent certificates.|
| Sync CA certificates with IoT Hubs | Sync the CA certificate managed by your policy to the IoT Hubs linked to your namespace. This allows IoT Hub to trust device certificates that have been signed by one of your issuing CAs.|

## Onboarding vs. operational credentials

Certificate management supports issuance and renewal for device **operational certificates**. It doesn't manage onboarding credentials.

- **Onboarding credential:** A device uses this credential to authenticate with [Device Provisioning Service (DPS)](../iot-dps/about-iot-dps.md) during provisioning. Supported onboarding credential types include X.509 certificates from a third-party certificate authority (CA), symmetric keys, and Trusted Platform Modules (TPM).
- **Operational certificate:** After the device provisions through DPS, Azure Device Registry (ADR) issues a short-lived X.509 certificate that the device uses to authenticate directly with IoT Hub.

## How certificate management works

Certificate management uses IoT Hub, ADR, and DPS together to provide a managed public key infrastructure (PKI) experience for IoT devices.

**At a high level:**

- You create certificate management resources in ADR, including a namespace, credential, and policy. 

- You configure DPS enrollments to use that ADR policy during provisioning.
- Devices provision through DPS and receive operational certificates signed by the policy's issuing CA.
- IoT Hub trusts those device certificates after ADR syncs the issuing CA certificate to linked hubs.

For details, see [Certificate issuance in Azure IoT Hub certificate management](concept-certificate-issuance.md).

**Certificate management in Azure Device Registry supports two policy types:**

- **Microsoft Root CA-signed:** Create a policy that manages an issuing CA that is signed by the unique root CA of your namespace. Microsoft manages the lifecycle for both the issuing and root CAs in the cloud PKI. 

- **External CA-signed:** Create a policy that manages an issuing CA that is signed by your organization's __external root CA__. You retain complete ownership of the external CA, while Microsoft manages the issuing CA in the cloud PKI. Use this policy type if your organization maintains a private Public Key Infrastructure (PKI) and requires all IoT devices to chain up to a common trusted root.

The following diagram shows the end-to-end certificate management architecture, including how IoT Hub, Azure Device Registry, and Device Provisioning Service integrate with PKI to manage device certificates.

:::image type="content" source="media/iot-hub-certificate-management-overview/certificate-management-high-level-diagram.svg" alt-text="Diagram that shows ADR Namespace linking IoT hubs, registry, credential policies, PKI, DPS, and X.509 devices across cloud and field." lightbox="media/iot-hub-certificate-management-overview/certificate-management-high-level-diagram.svg" border="false":::

For more information, see [Certificate issuance in Azure IoT Hub certificate management](concept-certificate-issuance.md).

## Certificate renewal

Each credential supports one policy, and policy validity ranges from 7 to 90 days. When a device detects that its operational certificate is close to expiration, it can renew in one of two ways:

- Repeat certificate issuance through DPS and submit a new certificate signing request (CSR) during reprovisioning.
- Submit a new CSR directly to IoT Hub for renewal.

Each device must track its certificate validity period and start renewal before expiration to avoid connection interruptions.

For more information, see [Certificate renewal in Azure IoT Hub certificate management](concept-certificate-renewal.md).

## Limits and quotas

For the latest information about limits and quotas for certificate management with IoT Hub, see [Azure subscription and service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-iot-hub-limits).

## Related content

- [Deploy Azure IoT Hub with ADR integration and certificate management](iot-hub-device-registry-setup.md)
- [FAQ: What is new in Azure IoT Hub?](iot-hub-faq.md)
- [Certificate issuance in Azure IoT Hub certificate management](concept-certificate-issuance.md)
- [Certificate renewal in Azure IoT Hub certificate management](concept-certificate-renewal.md)
- [Certificate revocation and policy management concepts (preview)](concepts-certificate-policy-management.md)
- [Revoke certificates and delete policies (preview)](how-to-revoke-certificate-delete-policy.md)
- [Disable or enable a device (preview)](how-to-disable-enable-device.md)
- [Key concepts for certificate management](iot-hub-certificate-management-concepts.md)
- [Integration with Azure Device Registry](iot-hub-device-registry-overview.md)
