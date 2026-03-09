---
title: Terminology and glossary for Azure DPS
titleSuffix: Azure IoT Hub Device Provisioning Service
description: This article describes common terminology used with the Device Provisioning Service (DPS) and IoT Hub.
author: cwatson-cat
ms.author: cwatson
ms.date: 08/07/2025
ms.topic: concept-article
ms.service: azure-iot-hub
ms.subservice: azure-iot-hub-dps
---

# IoT Hub Device Provisioning Service terminology

IoT Hub Device Provisioning Service (DPS) is a helper service for IoT Hub that enables zero-touch device provisioning to IoT hubs. With the Device Provisioning Service, you can provision millions of devices in a secure and scalable manner.

Device provisioning is a two part process.

1. The first part establishes the initial connection between the device and the IoT solution by *registering* the device.
1. The second part applies the proper *configuration* to the device based on the specific requirements of the solution.

Once both steps are completed, the device is fully *provisioned*. Device Provisioning Service automates both steps to provide a seamless provisioning experience for the device.

This article gives an overview of the provisioning concepts applicable to managing the *service*. This article is most relevant to personas involved in the [cloud setup step](about-iot-dps.md#cloud-setup-step) of getting a device ready for deployment.

## Service operations endpoint

The service operations endpoint is the endpoint for managing the service settings and maintaining the enrollment list. This endpoint is only used by the service administrator; it isn't used by devices.

## Device provisioning endpoint

The device provisioning endpoint is the endpoint that devices use for provisioning. While all DPS instances use the same global endpoint hostname (`global.azure-devices-provisioning.net`), each device must also provide the unique [ID scope](#id-scope) that identifies the specific DPS instance during the provisioning process. This means that devices provisioning to different DPS instances will use different ID scope values, requiring device configuration or firmware updates when moving devices between different DPS instances in scenarios involving multiple provisioning services (such as deployments with more than 1 million devices).

## Linked IoT hubs

The Device Provisioning Service can only provision devices to IoT hubs that are linked to it. Linking an IoT hub to an instance of the Device Provisioning Service gives the service read/write permissions to the IoT hub's device registry. With the link, a Device Provisioning Service can register a device ID and set the initial configuration in the device twin. Linked IoT hubs can be in any Azure region. You can link hubs in other subscriptions to your provisioning service.

For more information, see [How to link and manage IoT hubs](./how-to-manage-linked-iot-hubs.md)

## Allocation policy

The allocation policy is a service-level setting that determines how Device Provisioning Service assigns devices to an IoT hub. There are four supported allocation policies:

* **Evenly weighted distribution**: linked IoT hubs are equally likely to have devices provisioned to them. The default setting. If you're provisioning devices to only one IoT hub, you can keep this setting.

* **Lowest latency**: devices are provisioned to an IoT hub with the lowest latency to the device. If multiple linked IoT hubs would provide the same lowest latency, the provisioning service hashes devices across those hubs

* **Static configuration via the enrollment list**: specification of the desired IoT hub in the enrollment list takes priority over the service-level allocation policy.

* **Custom (Use Azure Function)**: A custom allocation policy gives you more control over how devices are assigned to an IoT hub. Custom allocation policies use an Azure Function to assign devices to an IoT hub. The device provisioning service calls your Azure Function code providing all relevant information about the device and the enrollment to your code. Your function code is executed and returns the IoT hub information used to provisioning the device. For more information, see [Tutorial: Use custom allocation policies with Device Provisioning Service (DPS)](how-to-use-custom-allocation-policies.md).

For more information, see [How to use allocation policies to provision devices across IoT hubs](./how-to-use-allocation-policies.md).

## Enrollment

An enrollment is the record of devices or groups of devices that might register through autoprovisioning. The enrollment record contains information about the device or group of devices, including:

* The [attestation mechanism](#attestation-mechanism) used by the device
* The optional initial desired configuration
* The desired IoT hub
* The desired device ID

There are two types of enrollments supported by Device Provisioning Service: enrollment groups and individual enrollments.

### Enrollment group

An enrollment group is a group of devices that share a specific attestation mechanism. Enrollment groups support X.509 certificate or symmetric key attestation.

The name of the enrollment group and the registration IDs presented by devices must be case-insensitive strings of alphanumeric characters plus the special characters: `- . _ :`. The last character must be alphanumeric or dash (`-`). The enrollment group name can be up to 128 characters long. In symmetric key enrollment groups, the registration IDs presented by devices can be up to 128 characters long. However, in X.509 enrollment groups, because the maximum length of the subject common name in an X.509 certificate is 64 characters, the registration IDs are limited to 64 characters.

Devices in an X.509 enrollment group present X.509 certificates that are signed by the same root or intermediate Certificate Authority (CA). The subject common name (CN) of each device's end-entity (leaf) certificate becomes the registration ID for that device. Devices in a symmetric key enrollment group present SAS tokens derived from the group symmetric key.

For devices in an enrollment group, the registration ID is also used as the device ID that is registered to IoT Hub.

> [!TIP]
> We recommend using an enrollment group for a large number of devices that share a desired initial configuration, or for devices all going to the same tenant.

### Individual enrollment

An individual enrollment is an entry for a single device that might register. Individual enrollments can use either X.509 leaf certificates or SAS tokens (from a physical or virtual TPM) as the attestation mechanisms.

The registration ID in an individual enrollment is a case-insensitive string of alphanumeric characters plus the special characters: `- . _ :`. The last character must be alphanumeric or dash (`-`). DPS supports registration IDs up to 128 characters long.

For X.509 individual enrollments, the subject common name (CN) of the certificate must match the registration ID, so the common name must adhere to the registration ID string format. The subject common name has a maximum length of 64 characters, so the registration ID is limited to 64 characters for X.509 enrollments.

Individual enrollments might have the desired IoT hub device ID specified in the enrollment entry. If it isn't specified, the registration ID becomes the device ID that's registered to IoT Hub.

> [!TIP]
> We recommend using individual enrollments for devices that require unique initial configurations, or for devices that can only authenticate using SAS tokens via TPM attestation.

## Attestation mechanism

An attestation mechanism is the method used for confirming a device's identity. The attestation mechanism is configured on an enrollment entry and tells the provisioning service which method to use when verifying the identity of a device during registration.

> [!NOTE]
> IoT Hub uses "authentication scheme" for a similar concept in that service.

The Device Provisioning Service supports the following forms of attestation:

* **X.509 certificates** based on the standard X.509 certificate authentication flow. For more information, see [X.509 certificate attestation](concepts-x509-attestation.md).
* **Trusted Platform Module (TPM)** based on a nonce challenge, using the TPM standard for keys to present a signed Shared Access Signature (SAS) token. This doesn't require a physical TPM on the device, but the service expects to attest using the endorsement key per the [TPM spec](https://trustedcomputinggroup.org/work-groups/trusted-platform-module/). For more information, see [TPM attestation](concepts-tpm-attestation.md).
* **Symmetric Key** based on shared access signature (SAS) [SAS tokens](../iot-hub/iot-hub-dev-guide-sas.md#sas-tokens), which include a hashed signature and an embedded expiration. For more information, see [Symmetric key attestation](concepts-symmetric-key-attestation.md).

## Hardware security module

A hardware security module, or HSM, is used for secure, hardware-based storage of device secrets, and is the most secure form of secret storage. Both X.509 certificates and SAS tokens can be stored in an HSM.

> [!TIP]
> We strongly recommend using an HSM with devices to securely store secrets on your devices.

Device secrets can also be stored in software (memory), but it's a less secure form of storage than an HSM.

## ID scope

The ID scope is assigned to a Device Provisioning Service when it's created and is used to uniquely identify the specific provisioning service. The service generates the ID scope, which is immutable and guarantees uniqueness. ID scope uniqueness is important for long-running deployment operations and merger and acquisition scenarios.

## Registration Record

A registration record is the record of a device successfully registering/provisioning to an IoT hub via the Device Provisioning Service. Registration records are created automatically; they can be deleted, but they can't be updated.

## Registration ID

The registration ID is used to uniquely identify a device registration with the Device Provisioning Service. The registration ID must be unique in the provisioning service ID scope. Each device must have a registration ID. The registration ID is a case-insensitive string of alphanumeric characters plus the special characters: `- . _ :`. The last character must be alphanumeric or dash (`-`). DPS supports registration IDs up to 128 characters long.

* With TPM attestation, the registration ID is provided by the TPM itself.
* With X.509-based attestation, the registration ID is set to the subject common name (CN) of the device certificate. For this reason, the common name must adhere to the registration ID string format. However, the registration ID is limited to 64 characters because that's the maximum length of the subject common name in an X.509 certificate.

## Device ID

The device ID is the ID as it appears in IoT Hub. The desired device ID can be set in the enrollment entry, but it isn't required to be set. Setting the desired device ID is only supported in individual enrollments. If no desired device ID is specified in the enrollment list, the registration ID is used as the device ID when registering the device. For more information about device IDs in IoT Hub, see [Understand the identity registry in your IoT hub](../iot-hub/iot-hub-devguide-identity-registry.md).

## Operations

Operations are the billing unit of the Device Provisioning Service. One operation is the successful completion of one instruction to the service. Operations can include device registrations and re-registrations as well as service-side changes like adding and updating enrollment list entries.
