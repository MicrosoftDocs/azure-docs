---
title: What is certificate management (preview)?
titleSuffix: Azure Device Registry
description: This article discusses the basic concepts of how certificate management in Azure IoT Hub helps users manage device certificates.
author: sethmanheim
ms.author: sethm
ms.service: azure-device-registry
ms.topic: overview
ms.date: 09/17/2026
ai-usage: ai-assisted
#Customer intent: As a developer new to IoT, I want to understand what certificate management is and how it can help me manage my IoT device certificates.
---

# What is certificate management (preview) in Azure Device Registry?

Certificate Management in **Azure Device Registry (ADR)** simplifies the issuance and lifecycle management of X.509 certificates, enabling IoT devices to establish and maintain secure, certificate-based identities. You can create and manage certificate authorities (CAs), issue device certificates, and establish trust with Azure IoT services. Instead of managing your own PKI environment, certificate authorities are automatically provisioned within a private cloud PKI dedicated to your namespace, providing an isolated, hardware-backed trust boundary.

Certificate Management supports device certificate issuance and renewal through standard device workflows, establishes trust by synchronizing CAs with trusted Azure IoT services, and enables ongoing governance through revocation and lifecycle controls. 

To use certificate management, you must use [IoT Hub](../iot-hub/iot-hub-what-is-new.md) and [Device Provisioning Service (DPS)](../iot-dps/index.yml). 

## Overview of features

The following features are supported with certificate management for IoT Hub devices:

| Feature | Description |
| --- | --- |
| Create multiple certificate authorities (CA) in a single ADR namespace | Create a two-tier PKI hierarchy with root and intermediate CAs in the cloud. You can create up to one root CA and up to three intermediate CAs in a single namespace. |
| Bring your own CA|If you have an existing PKI environment, you can maintain the same root CA and create an intermediate CA in ADR that chains to your external root.|
| Cryptographic algorithms| Certificate authorities managed in ADR support ECC (ECDSA), NIST P-384, and SHA-384.|
| HSM keys (signing and encryption) | Keys are provisioned by using [Azure Key Vault Managed Hardware Security Module (Azure Managed HSM)](/azure/key-vault/managed-hsm/overview). CAs created within your ADR namespace automatically use HSM signing and encryption keys. No Azure subscription is required for Azure HSM. |
|Create a certificate policy|Each intermediate CA supports a single certificate policy. A certificate policy defines the lifespan for device certificates issued by that intermediate CA. |
|Device certificate issuance and renewal | Device certificates are issued and renewed by the intermediate CA. Certificate issuance and renewal are performed through Azure IoT device APIs, including DPS and IoT Hub device workflows. |
| Device certificate revocation | Revoke individual device certificates to block device connections until a new certificate is issued to the device. Revoked certificates are added to the intermediate CA's Certificate Revocation List (CRL). |
| Intermediate CA revocation |Revoke an intermediate CA to remove the associated CA certificate from IoT Hub and add the CA to the root CA's Certificate Revocation List (CRL). Revocation isn't supported for intermediate CAs that are signed by an external CA.|
|Certificate Revocation List (CRL) distribution points|Azure hosts the CRL distribution point (CDP) for each CA. The CDP URL is embedded on each certificate. The CRL validity period is seven days. Publishing and refresh happen every 3.5 days. The CRL is updated with every certificate revocation.|
|Authority Information Access (AIA) end points|Azure hosts the AIA endpoint for each intermediate CA. The AIA URL is embedded on each certificate. The AIA endpoint can be used by relying parties to retrieve parent certificates.|
| Sync CA certificates with IoT Hubs | Automatically sync CA certificates with linked IoT Hubs and enable device connectivity.|

## Onboarding vs. operational credentials for devices

A credential is an artifact that a device uses to prove its identity, such as an X.509 certificate or symmetric key. In Azure IoT, there are **two types** of device credentials: an **onboarding** credential and an **operational** credential. Onboarding and operational credentials serve different purposes and have different lifecycles:

- **Onboarding credential:** Provides a durable device identity that is typically provisioned during manufacturing and remains stable throughout the device's lifetime. A device uses this credential to authenticate with [Device Provisioning Service (DPS)](../iot-dps/about-iot-dps.md) during provisioning. Supported onboarding credential types include X.509 certificates from a third-party certificate authority (CA), symmetric keys, and Trusted Platform Modules (TPM).
- **Operational credential:** These are X.509 certificates issued by Azure Device Registry, typically short-lived, renewed throughout the device lifecycle, and are used to authenticate to cloud services like IoT Hub. This credential can be revoked without replacing the device's foundational identity, improving security while reducing operational complexity at scale. 

Certificate management in Azure Device Registry supports issuance, renewal, and revocation for device **operational credentials.** It does not issue or manage device **onboarding credentials**. 

## Architecture

Certificate management combines **Azure Device Registry (ADR)**, **Device Provisioning Service (DPS)**, and **Azure IoT Hub** to provide issuance, trust distribution, and lifecycle management of device operational certificates.

:::image type="content" source="media/iot-certificate-management-overview/certificate-management.png" alt-text="Conceptual diagram showing certificate management system in IoT Hub." lightbox="media/iot-certificate-management-overview/certificate-management.png":::

### How certificate management uses Azure IoT services

**Azure Device Registry (ADR)** acts as the certificate management control plane. You use ADR to create and manage root and intermediate certificate authorities (CAs), configure certificate policies, and revoke device certificates. ADR hosts the cloud PKI for your namespace and manages the lifecycle of certificate management resources. For more information, see [Set up a root and intermediate CA](how-to-create-policy.md).

**Device Provisioning Service (DPS)** performs at-runtime device onboarding and certificate issuance. During provisioning, DPS validates the device's onboarding credential and determines which certificate policy should be applied based on enrollment configuration. The device must submit a certificate signing request (CSR) as part of the provisioning transaction, allowing ADR to issue an operational certificate for the device. For more information, see [Certificate issuance in Azure Device Registry certificate management](concept-certificate-issuance.md).

**Azure IoT Hub** is the runtime service that devices connect to after provisioning. ADR synchronizes CA certificates to linked IoT Hubs so that IoT Hub can trust and validate device operational certificates during authentication. IoT Hub also supports operational certificate renewal without requiring the device to reprovision. For more information, see [Certificate renewal in Azure Device Registry certificate management](concept-certificate-renewal.md).

### Certificate authority options

Certificate management in Azure Device Registry supports two types of intermediate certificate authorities:

**Microsoft cloud root CA-signed** ADR creates and manages an intermediate CA that chains to a unique Microsoft-managed root CA for your namespace. Microsoft manages the lifecycle of both the namespace root CA and the intermediate CA.

**External CA-signed** ADR creates and manages an intermediate CA that is signed by an external CA owned by your organization. Your organization retains ownership and governance of the external CA, while Microsoft manages the intermediate CA and operational certificate issuance workflow. This option is useful when devices must chain to an enterprise PKI or a common corporate trust anchor.

For more information, see [Certificate Authorities in Azure Device Registry](concept-managed-ca-hierarchy.md).

## Limits and quotas

For the latest information about limits and quotas for certificate management in Azure Device Registry, see [Azure subscription and service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-iot-hub-limits).

## Related content

- [PKI fundamentals](iot-certificate-management-concepts.md)

- [Certificate Authorities in Azure Device Registry](concept-managed-ca-hierarchy.md)

- [Set up a root and intermediate CA](how-to-create-policy.md)

- [Certificate issuance in Azure Device Registry](concept-certificate-issuance.md)

- [Certificate revocation in Azure Device Registry](concepts-certificate-policy-management.md)

