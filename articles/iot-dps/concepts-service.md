---
title: Terminology used with Azure IoT Hub Device Provisioning Service | Microsoft Docs
description: Describes common terminology used with the Device Provisioning Service (DPS) and IoT Hub
author: kgremban
ms.author: kgremban
ms.date: 10/24/2022
ms.topic: conceptual
ms.service: iot-dps
services: iot-dps
manager: eliotga
---

# IoT Hub Device Provisioning Service (DPS) terminology

IoT Hub Device Provisioning Service is a helper service for IoT Hub that you use to configure zero-touch device provisioning to a specified IoT hub. With the Device Provisioning Service, you can [provision](about-iot-dps.md#provisioning-process) millions of devices in a secure and scalable manner.

Device provisioning is a two part process. The first part is establishing the initial connection between the device and the IoT solution by *registering* the device. The second part is applying the proper *configuration* to the device based on the specific requirements of the solution. Once both steps have been completed, the device has been fully *provisioned*. Device Provisioning Service automates both steps to provide a seamless provisioning experience for the device.

This article gives an overview of the provisioning concepts most applicable to managing the *service*. This article is most relevant to personas involved in the [cloud setup step](about-iot-dps.md#cloud-setup-step) of getting a device ready for deployment.

## Service operations endpoint

The service operations endpoint is the endpoint for managing the service settings and maintaining the enrollment list. This endpoint is only used by the service administrator; it isn't used by devices.

## Device provisioning endpoint

The device provisioning endpoint is the single endpoint all devices use for auto-provisioning. The URL is the same for all provisioning service instances, to eliminate the need to reflash devices with new connection information in supply chain scenarios. The ID scope ensures tenant isolation.

## Linked IoT hubs

DPS can only provision devices to IoT hubs that have been linked to it. Linking an IoT hub to a DPS instance gives the service read/write permissions to the IoT hub's device registry. With these permissions, DPS can register a device ID and set the initial configuration in the device twin. Linked IoT hubs may be in any Azure region. You may link hubs in other subscriptions to your DPS instance. Settings on a linked IoT hub, for example, the allocation weight setting, determine how it participates in allocation policies.

## Allocation policy

Allocation policies determine how DPS assigns devices to an IoT hub. Each DPS instance has a default allocation policy, but this policy can be overridden by an allocation policy set on an enrollment. Only IoT hubs [linked](#linked-iot-hubs) to the DPS instance can participate in allocation.

There are four supported allocation policies:

* **Evenly weighted distribution**: devices are provisioned to an IoT hub using a weighted hash. By default, linked IoT hubs have the same allocation weight setting, so they're equally likely to have devices provisioned to them. The allocation weight of an IoT hub may be adjusted to increase or decrease its likelihood of being assigned. This is the default allocation policy for a DPS instance. If you're provisioning devices to only one IoT Hub, we recommend using this policy.

* **Lowest latency**: devices are provisioned to an IoT hub with the lowest latency to the device. If multiple linked IoT hubs would provide the same lowest latency, DPS hashes devices across those IoT hubs based on their configured allocation weight.

* **Static configuration**: devices are provisioned to a single IoT hub, which must be specified on the enrollment.

* **Custom (Use Azure Function)**: A [custom allocation policy](concepts-custom-allocation.md) gives you more control over how devices are assigned to an IoT hub. This is accomplished by using a custom webhook hosted in Azure Functions to assign devices to an IoT hub. DPS calls your webhook providing all relevant information about the device and the enrollment. Your webhook returns the IoT hub and initial device twin (optional) used to provision the device. Can't be set as the DPS instance default policy.

## Enrollment

An enrollment is the record of devices or groups of devices that may register through auto-provisioning. The enrollment record contains information about the device or group of devices, including:

* the [attestation mechanism](#attestation-mechanism) used by the device
* the optional initial desired configuration
* the [allocation policy](#allocation-policy) to use to assign devices to an IoT hub; if not specified on the enrollment, the DPS instance default allocation policy is used.
* the [linked IoT hub(s)](#linked-iot-hubs) to apply the allocation policy to. For the *Static configuration* allocation policy, a single IoT hub must be specified. For all other allocation policies, one or more IoT hubs may be specified; if no IoT hubs are specified on the enrollment, all the IoT hubs linked to the DPS instance are used.
* the desired device ID (individual enrollments only)

There are two types of enrollments supported by Device Provisioning Service:

### Enrollment group

An enrollment group is a group of devices that share a specific attestation mechanism. Enrollment groups support X.509 certificate or symmetric key attestation. Devices in an X.509 enrollment group present X.509 certificates that have been signed by the same root or intermediate Certificate Authority (CA). The subject common name (CN) of each device's end-entity (leaf) certificate becomes the registration ID for that device. Devices in a symmetric key enrollment group present SAS tokens derived from the group symmetric key.

The name of the enrollment group and the registration IDs presented by devices must be case-insensitive strings of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). The enrollment group name can be up to 128 characters long. In symmetric key enrollment groups, the registration IDs presented by devices can be up to 128 characters long. However, in X.509 enrollment groups, because the maximum length of the subject common name in an X.509 certificate is 64 characters, the registration IDs are limited to 64 characters.

For devices in an enrollment group, the registration ID is also used as the device ID that is registered to IoT Hub.

> [!TIP]
> We recommend using an enrollment group for a large number of devices that share a desired initial configuration, or for devices all going to the same tenant.

### Individual enrollment

An individual enrollment is an entry for a single device that may register. Individual enrollments may use either X.509 leaf certificates or SAS tokens (from a physical or virtual TPM) as the attestation mechanisms. The registration ID in an individual enrollment is a case-insensitive string of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). DPS supports registration IDs up to 128 characters long.

For X.509 individual enrollments, the subject common name (CN) of the certificate becomes the registration ID, so the common name must adhere to the registration ID string format. The subject common name has a maximum length of 64 characters, so the registration ID is limited to 64 characters for X.509 enrollments.

Individual enrollments may have the desired IoT hub device ID specified in the enrollment entry. If it's not specified, the registration ID becomes the device ID that's registered to IoT Hub.

> [!TIP]
> We recommend using individual enrollments for devices that require unique initial configurations, or for devices that can only authenticate using SAS tokens via TPM attestation.

## Attestation mechanism

An attestation mechanism is the method used for confirming a device's identity. The attestation mechanism is configured on an enrollment entry and tells the provisioning service which method to use when verifying the identity of a device during registration.

> [!NOTE]
> IoT Hub uses "authentication scheme" for a similar concept in that service.

The Device Provisioning Service supports the following forms of attestation:
* **X.509 certificates** based on the standard X.509 certificate authentication flow. For more information, see [X.509 attestation](concepts-x509-attestation.md).
* **Trusted Platform Module (TPM)** based on a nonce challenge, using the TPM standard for keys to present a signed Shared Access Signature (SAS) token. This doesn't require a physical TPM on the device, but the service expects to attest using the endorsement key per the [TPM spec](https://trustedcomputinggroup.org/work-groups/trusted-platform-module/). For more information, see [TPM attestation](concepts-tpm-attestation.md).
* **Symmetric Key** based on shared access signature (SAS) [SAS tokens](../iot-hub/iot-hub-dev-guide-sas.md#sas-tokens), which include a hashed signature and an embedded expiration. For more information, see [Symmetric key attestation](concepts-symmetric-key-attestation.md).

## Hardware security module

The hardware security module, or HSM, is used for secure, hardware-based storage of device secrets, and is the most secure form of secret storage. Both X.509 certificates and SAS tokens can be stored in the HSM. HSMs can be used with both attestation mechanisms the provisioning service supports.

> [!TIP]
> We strongly recommend using an HSM with devices to securely store secrets on your devices.

Device secrets may also be stored in software (memory), but it's a less secure form of storage than an HSM.

## ID scope

The ID scope is assigned to a Device Provisioning Service when it's created by the user and is used to uniquely identify the specific provisioning service the device will register through. The ID scope is generated by the service and is immutable, which guarantees uniqueness.

> [!NOTE]
> Uniqueness is important for long-running deployment operations and merger and acquisition scenarios.

## Registration

A registration is the record of a device successfully registering/provisioning to an IoT Hub via the Device Provisioning Service. Registration records are created automatically; they can be deleted, but they can't be updated.

## Registration ID

The registration ID is used to uniquely identify a device registration with the Device Provisioning Service. The registration ID must be unique in the provisioning service [ID scope](#id-scope). Each device must have a registration ID. The registration ID is a case-insensitive string of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). DPS supports registration IDs up to 128 characters long.

* With TPM attestation, the registration ID is provided by the TPM itself.
* With X.509-based attestation, the registration ID is set to the subject common name (CN) of the device certificate. For this reason, the common name must adhere to the registration ID string format. However, the registration ID is limited to 64 characters because that's the maximum length of the subject common name in an X.509 certificate.

## Device ID

The device ID is the ID as it appears in IoT Hub. The desired device ID may be set in the enrollment entry, but it isn't required to be set. Setting the desired device ID is only supported in individual enrollments. If no desired device ID is specified in the enrollment list, the registration ID is used as the device ID when registering the device. Learn more about [device IDs in IoT Hub](../iot-hub/iot-hub-devguide-identity-registry.md).

## Operations

Operations are the billing unit of the Device Provisioning Service. One operation is the successful completion of one instruction to the service. Operations include device registrations and re-registrations; operations also include service-side changes such as adding enrollment list entries, and updating enrollment list entries.
