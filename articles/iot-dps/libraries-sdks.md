---
title: IoT Hub Device Provisioning Service libraries and SDKs
description: Information about the device and service libraries available for developing solutions with Device Provisioning Service (CPS).
author: cwatson-cat
ms.author: cwatson
ms.date: 02/12/2026
ms.topic: reference
ms.service: azure-iot-hub
services: iot-dps
ms.custom: mvc
ms.subservice: azure-iot-hub-dps
ai-usage: ai-assisted
---

# Microsoft SDKs for IoT Hub Device Provisioning Service

The Microsoft SDKs for IoT Hub Device Provisioning Service (DPS) help you build device and backend applications that provision IoT devices to one or more IoT hubs. The SDKs handle the underlying transport and security protocols between your devices or backend apps and DPS, freeing you to focus on application development. By using the SDKs, you get support for future updates to DPS, including security updates. This article describes the three categories of SDKs, lists the DPS SDKs published in popular languages, and provides links to SDK references, samples, and quickstarts.

> [!IMPORTANT]
> Certificate management in IoT Hub is in **preview** and is supported only in the following DPS Device SDKs: Embedded C (Bare metal, Free RTOS), C, and Python. IoT Hub SDKs don't support it. For more information, see the [What is Certificate Management?](../iot-hub/iot-hub-certificate-management-overview.md)

## SDK categories

Three categories of software development kits (SDKs) work with DPS:

- [DPS device SDKs](#device-sdks) provide data plane operations for devices. Use the device SDK to provision a device through DPS.

- [DPS service SDKs](#service-sdks) provide data plane operations for backend apps. Use the service SDKs to create and manage individual enrollments and enrollment groups, and to query and manage device registration records.

- [DPS management SDKs](#management-sdks) provide control plane operations for backend apps. Use the management SDKs to create and manage DPS instances and metadata. For example, use them to create and manage DPS instances in your subscription, to upload and verify certificates with a DPS instance, or to create and manage authorization policies or allocation policies in a DPS instance.

The DPS SDKs help to provision devices to your IoT hubs. Microsoft also provides a set of SDKs to help you build device apps and backend apps that communicate directly with Azure IoT Hub. For example, to help your provisioned devices send telemetry to your IoT hub, and, optionally, to receive messages and job, method, or twin updates from your IoT hub. To learn more, see [Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md).

## Device SDKs

The DPS device SDKs enable your devices to register with DPS and receive their IoT hub assignment. Use the device SDKs to implement device-side provisioning with symmetric key, X.509 certificate, or TPM attestation. Platform device SDKs are available for devices that run a full operating system, and embedded device SDKs are available for resource-constrained and microcontroller-based devices.

### Platform device SDKs

[!INCLUDE [iot-dps-sdks-device](../../includes/iot-dps-sdks-device.md)]

### Certificate management device SDKs (preview)

For SDKs that support Microsoft-backed X.509 certificate management in preview, use the following instructions and samples.

| Platform | Instructions | Sample |
| ----- | ----- | ----- |
| C | [Instructions](https://github.com/Azure/azure-iot-sdk-c/tree/feature/dps-csr-preview/provisioning_client/samples/prov_dev_client_ll_x509_csr_sample) | [Sample](https://github.com/Azure/azure-iot-sdk-c/tree/feature/dps-csr-preview/provisioning_client/samples/prov_dev_client_ll_x509_csr_sample) |
| Python | [Instructions](https://github.com/Azure/azure-iot-sdk-python/blob/feature/dps-csr-preview/azure-iot-device/samples/dps-cert-mgmt/dps_certificate_management.md) | [Sample](https://github.com/Azure/azure-iot-sdk-python/blob/feature/dps-csr-preview/azure-iot-device/samples/dps-cert-mgmt/provisioning_client_certificate_issuance.py) |

### Embedded device SDKs

[!INCLUDE [iot-dps-sdks-embedded](../../includes/iot-dps-sdks-embedded.md)]

### Certificate management embedded device SDKs (preview)

For embedded SDKs that support Microsoft-backed X.509 certificate management in preview, use the following instructions and samples:

| RTOS | SDK | Instructions | Sample |
| :-- | :-- | :-- | :-- |
| **FreeRTOS** | FreeRTOS Middleware | [Instructions](https://github.com/Azure-Samples/iot-middleware-freertos-samples/blob/feature/dps-csr-preview/demos/projects/PC/linux/README.md) | [Sample](https://github.com/Azure-Samples/iot-middleware-freertos-samples/tree/feature/dps-csr-preview/demos/projects/PC/linux) |
| **Bare Metal** | Azure SDK for Embedded C | [Instructions](https://github.com/Azure/azure-sdk-for-c/blob/feature/dps-csr-preview/sdk/samples/iot/README.md) | [Sample](https://github.com/Azure/azure-sdk-for-c/blob/feature/dps-csr-preview/sdk/samples/iot/paho_iot_provisioning_csr_sample.c) |

## Service SDKs

[!INCLUDE [iot-dps-sdks-service](../../includes/iot-dps-sdks-service.md)]

## Management SDKs

[!INCLUDE [iot-dps-sdks-management](../../includes/iot-dps-sdks-management.md)]

## Next steps

The Device Provisioning Service documentation provides [tutorials](how-to-legacy-device-symm-key.md) and [additional samples](quick-create-simulated-device-tpm.md) that you can use to try out the SDKs and libraries.
