---
title: What is Microsoft-backed X.509 Certificate Management (Preview)?
titleSuffix: Azure IoT Hub
description: This article discusses the basic concepts of how certificate management in Azure IoT Hub helps users manage device certificates.
author: cwatson-cat
ms.author: cwatson
ms.service: azure-iot-hub
services: iot-hub
ms.topic: overview
ms.date: 11/07/2025
#Customer intent: As a developer new to IoT, I want to understand what certificate management is and how it can help me manage my IoT device certificates.
---

# What is Microsoft-backed X.509 certificate management (preview)?

Certificate management is an optional feature of Azure Device Registry (ADR) that enables you to issue and manage X.509 certificates for your IoT devices. It configures a dedicated, cloud-based public key infrastructure (PKI) for each ADR namespace, without requiring any on-premises servers, connectors, or hardware. It manages the certificate of issuance and renewal for all IoT devices that have been provisioned to that ADR namespace. These X.509 certificates can be used for your IoT devices to authenticate with IoT Hub.

Using certificate management requires you to also use IoT Hub, [Azure Device Registry (ADR)](iot-hub-device-registry-setup.md), and [Device Provisioning Service (DPS)](../iot-dps/index.yml). Certificate management is currently in public preview.

[!INCLUDE [iot-hub-public-preview-banner](includes/public-preview-banner.md)]

## Overview of features

The following features are supported with certificate management for IoT Hub devices in preview:

| Feature | Description |
|---------|-------------|
| Create multiple certificate authorities (CA) in an ADR namespace | Create two-tier PKI hierarchy with root and issuing CA in the cloud. |
| Create a unique root certificate authority (CA) per ADR namespace | Create up to 1 root CA, also known as a credential, in your ADR namespace |
| Create up to one issuing CA per policy | Create up to 1 issuing CA, also known as a policy, in your ADR namespace and customize validity periods for issued certificates. |
| Signing and Encryption algorithms | Certificate management supports ECC (ECDSA) and curve NIST P-384|
| Hash algorithms | Certificate management supports SHA-384 |
| HSM keys (signing and encryption) | Keys are provisioned using [Azure Managed Hardware Security Module (Azure Managed HSM)](/azure/key-vault/managed-hsm/overview). CAs created within your ADR namespace automatically use HSM signing and encryption keys. No Azure subscription is required for Azure HSM. |
| End-entity certificate issuance and renewal | End-entity certificates, also known as leaf certificates or device certificates, are signed by the issuing CA and delivered to the device. Leaf certificates can also be renewed by the issuing CA.|
| At-scale provisioning of leaf certificates | The policies defined in your ADR namespace are directly linked to a Device Provisioning Service enrollment to be used at the time of certificate provisioning.|
| Syncing of CA certificates with IoT Hubs | The policies defined in your ADR namespace will be synced to the appropriate IoT Hub. This will enable IoT Hub to trust any devices authenticating with an end-entity certificate. |

## Onboarding vs. operational credentials

Today, certificate management supports issuance and renewal for end-entity **operational certificates**.

- **Onboarding credential:** To use certificate management, devices must be provisioned via Device Provisioning Service (DPS). For a device to provision with DPS, it must onboard and authenticate using one of the supported types of [onboarding credentials](../iot-dps/concepts-service.md#attestation-mechanism), which includes X.509 certificates (procured from a third-party CA), symmetric keys, and Trusted Platform Modules (TPM). These credentials are conventionally installed onto the device before it is shipped.

- **Operational certificate:** An end-entity operational certificate is a type of operational credential. This certificate is issued to the device by an issuing CA once the device has been provisioned by DPS. Unlike onboarding credentials, these certificates are typically short-lived and renewed frequently or as needed during device operation. The device can use its operational certificate chain to authenticate directly with IoT Hub and perform typical operations. Today, certificate management only provides the operational certificate.

## How certificate management works

Certificate management consists of several integrated components that work together to streamline the deployment of public key infrastructure (PKI) across IoT devices. To use certificate management, you must set up:

- IoT Hub (preview)
- Azure Device Registry (ADR) namespace
- Device Provisioning Service (DPS) instance

### IoT Hub (preview) integration

IoT Hubs that are linked to an ADR namespace can take advantage of certificate management capabilities. You can sync your CA certificates from ADR namespace to all of your IoT Hubs, so that each IoT Hub can authenticate any IoT device that attempts to connect with issued certificate chain.

### Azure Device Registry integration

Certificate management uses [Azure Device Registry (ADR)](iot-hub-device-registry-overview.md) to manage CA certificates. It integrates with IoT Hub and Device Provisioning Service (DPS) to provide a seamless experience for managing device identities and CA certificates.

The following image illustrates the X.509 certificate hierarchy used to authenticate IoT devices in Azure IoT Hub through the ADR namespace.

- Each ADR namespace that has an enabled certificate management will have a unique credential (root CA) managed by Microsoft. This credential represents the top-most certificate authority in the chain.
- Each policy within the ADR namespace defines one issuing CA (ICA) that is signed by the root CA. Each policy can only share its CA certificate with Hubs linked to the namespace. And, each policy can only issue leaf certificates to devices registered within that namespace. You can configure the validity period of the issued certificates for each policy. The minimum validity period is 1 day and the maximum validity period is 90 days.
- Once you have created your credential and policies, you can sync these CA certificates directly with IoT Hub. IoT Hub will now be able to authenticate devices that present this certificate chain.

:::image type="content" source="media/certificate-management/device-registry-certificate-management.png" alt-text="Diagram showing how Azure Device Registry integrates with IoT Hub and DPS for certificate management." lightbox="media/certificate-management/device-registry-certificate-management.png":::

### Device Provisioning Service integration

For devices to receive leaf certificates, devices must be provisioned through [Device Provisioning Service (DPS)](../iot-dps/index.yml). You need to configure either an [individual or group enrollment](../iot-dps/concepts-service.md#enrollment), which includes defining:

- The specific type of [onboarding credential](../iot-dps/concepts-service.md#attestation-mechanism) for that enrollment. Supported methods are Trusted Platform Module (TPM), symmetric keys, or X.509 certificates.
- The specific policy that was created within your ADR namespace. This policy signs and issues leaf certificates to devices provisioned by this enrollment.

Device Provisioning Service now accepts [Certificate Signing Request (CSR)](iot-hub-certificate-management-concepts.md) during provisioning. The CSR is sent to DPS and the PKI, which validates the request and forwards it to the appropriate issuing CA (ICA) to issue signed X.509 certificate. 

Certificate management currently supports the following protocols during provisioning: HTTP and MQTT.
For more information on DPS Certificate Signing Request, check out some of the [DPS Device SDKs samples](../iot-dps/libraries-sdks.md#device-sdks).

> [!NOTE]
> While a PKI is configured for each of your ADR namespaces, it's not exposed as an external Azure resource.

### End-to-end device provisioning with certificate management (runtime experience)

The following diagram illustrates the end-to-end process of device provisioning with certificate management:

1. The IoT device connects to the DPS endpoint and authenticates with the service using its pre-configured onboarding credential. As part of this registration call, the device sends a certificate signing request (CSR). The CSR contains information about the device, such as its public key and other identifying details.
1. DPS assigns the IoT device to an IoT Hub based on the linked Hubs in its DPS enrollment.
1. The device identity is created in IoT Hub and registered to the appropriate ADR namespace.
1. DPS uses the CSR to request an operational certificate from the PKI. The PKI validates the CSR and forwards it to the policy (issuing CA) linked to the DPS enrollment.
1. The policy signs the operational certificate and issues it.
1. DPS sends the operational certificate and IoT Hub connection details back to the device.
1. The device can now authenticate with IoT Hub by sending the full issuing certificate chain to IoT Hub.

:::image type="content" source="media/certificate-management/operational-diagram.png" alt-text="Diagram showing how Azure Device Registry integrates with IoT Hub and DPS for certificate management during provisioning." lightbox="media/certificate-management/operational-diagram.png":::

## Renewal of leaf certificates

End-entity leaf certificates can be renewed using the same mechanism as first-time certificate issuance. When the device detects a need to renew its operational certificate, it must initiate another registration call to DPS, submitting a new Certificate Signing Request (CSR). Once again, the CSR is sent to the appropriate issuing certificate authority (ICA) to request a renewed leaf certificate. Once approved, the renewed operational certificate is returned to the device to be used for secure communications.

Each device is responsible for monitoring the expiration date of its operational certificate and initiating a certificate renewal when needed. As a best practice, we recommend renewing a certificate before its expiration date to ensure uninterrupted communications. The operational certificate includes its `Valid from` and `Valid until` dates, which the device can monitor to determine when a renewal is needed. During this preview, we recommend that devices use their [Device Twin reported properties](iot-hub-devguide-device-twins.md#device-twins) for reporting the certificate issuance and certificate expiration dates. These properties can then be used for observability, like building dashboards.

## Disable a device

Certificate management doesn't support certificate revocation during public preview. To remove the connection of a device that uses an X.509 operational certificate, you can disable the device in the IoT Hub. To disable a device, see [Disable or delete a device](create-connect-device.md#disable-or-delete-a-device).

## Limits and quotas

See [Azure subscription and service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-iot-hub-limits) for the latest information about limits and quotas for certificate management with IoT Hub.

