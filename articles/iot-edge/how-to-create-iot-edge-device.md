---
title: Create an IoT Edge device - Azure IoT Edge
description: Learn about the platform and provisioning options for creating an IoT Edge device
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-edge
services: iot-edge
ms.topic: concept-article
ms.date: 03/04/2026
---

# Create an IoT Edge device

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

This article provides an overview of the options available for installing and provisioning IoT Edge on your devices. The article provides a look at all of the options for your IoT Edge solution and helps you:

* [Choose a platform](#choose-a-platform)
* [Choose how to provision your devices](#choose-how-to-provision-your-devices)
* [Choose an authentication method](#choose-an-authentication-method)

By the end of this article, you have a clear picture of what platform, provisioning, and authentication options you want to use for your IoT Edge solution.

## Get started

If you know what type of platform, provisioning, and authentication options you want to use to create an IoT Edge device, use the links in the following table to get started.

If you want more information about how to choose the right option for you, continue through this article to learn more.

|    | Linux containers on Linux hosts | Linux containers on Windows hosts |
|--| ----- | ---------------- |
| **Manual provisioning (single device)** | [X.509 certificates](how-to-provision-single-device-linux-x509.md)<br><br>[Symmetric keys](how-to-provision-single-device-linux-symmetric.md) | [X.509 certificates](how-to-provision-single-device-linux-on-windows-x509.md)<br><br>[Symmetric keys](how-to-provision-single-device-linux-on-windows-symmetric.md) |
| **Autoprovisioning (devices at scale)** | [X.509 certificates](how-to-provision-devices-at-scale-linux-x509.md)<br><br>[TPM](how-to-provision-devices-at-scale-linux-tpm.md)<br><br>[Symmetric keys](how-to-provision-devices-at-scale-linux-symmetric.md) | [X.509 certificates](how-to-provision-devices-at-scale-linux-on-windows-x509.md)<br><br>[TPM](how-to-provision-devices-at-scale-linux-on-windows-tpm.md)<br><br>[Symmetric keys](how-to-provision-devices-at-scale-linux-on-windows-symmetric.md) |

## Terms and concepts

If you're not already familiar with IoT Edge terminology, review some key concepts:

**IoT Edge runtime**: The [IoT Edge runtime](iot-edge-runtime.md) is a collection of programs that turn a device into an IoT Edge device. Collectively, the IoT Edge runtime components enable IoT Edge devices to run your IoT Edge modules.

**Provisioning**: You must provision each IoT Edge device. Provisioning is a two-step process. The first step is registering the device in an IoT hub, which creates a cloud identity that the device uses to establish the connection to its hub. The second step is configuring the device with its cloud identity. You can manually provision a device or use the [IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md) to provision devices at scale.

**Authentication**: Your IoT Edge devices need to verify their identity when they connect to IoT Hub. Choose an authentication method, such as symmetric key passwords, certificate thumbprints, or trusted platform modules (TPMs).

## Choose a platform

Platform options are referred to by the container operating system and the host operating system. The container operating system is the operating system used inside your IoT Edge runtime and module containers. The host operating system is the operating system of the device the IoT Edge runtime containers and modules run on.

Your IoT Edge devices have three platform options.

* **Linux containers on Linux hosts**: Run Linux-based IoT Edge containers directly on a Linux host. Throughout the IoT Edge documentation, you see this option referred to as **Linux** and **Linux containers** for simplicity.

* **Linux containers on Windows hosts**: Run Linux-based IoT Edge containers in a Linux virtual machine on a Windows host. Throughout the IoT Edge documentation, you see this option referred to as **Linux on Windows**, **IoT Edge for Linux on Windows**, and **EFLOW**.

* **Windows containers on Windows hosts**: Run Windows-based IoT Edge containers directly on a Windows host. Throughout the IoT Edge documentation, you see this option referred to as **Windows** and **Windows containers** for simplicity.

For the latest information about which operating systems support production scenarios, see the [Operating systems](support.md#operating-systems) section of [Azure IoT Edge supported platforms](support.md).

### Linux containers on Linux

For Linux devices, you install the IoT Edge runtime directly on the host device.

IoT Edge supports x64, ARM32, and ARM64 Linux devices. Microsoft provides official installation packages for various operating systems.

### Linux containers on Windows

IoT Edge for Linux on Windows hosts a Linux virtual machine on your Windows device. The virtual machine comes prebuilt with the IoT Edge runtime, and Microsoft Update manages updates.

IoT Edge for Linux on Windows is the recommended way to run IoT Edge on Windows devices. To learn more, see [What is Azure IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows.md).

### Windows containers on Windows

IoT Edge version 1.2 and later doesn't support Windows containers. Windows containers support ends with version 1.1.

## Choose how to provision your devices

You can provision a single device or multiple devices at scale, depending on the needs of your IoT Edge solution.

The options available for authenticating communications between your IoT Edge devices and your IoT hubs depend on what provisioning method you choose. You can read more about those options in the [Choose an authentication method](#choose-an-authentication-method) section.

### Single device

Single device provisioning refers to provisioning an IoT Edge device without the assistance of the [IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md) (DPS). You see single device provisioning also referred to as **manual provisioning**.

Using single device provisioning, you need to manually enter provisioning information, like a connection string, on your devices. Manual provisioning is quick and easy to set up for only a few devices, but your workload increases with the number of devices. Provisioning helps when you're considering the scalability of your solution.

**Symmetric key** and **X.509 self-signed** authentication methods are available for manual provisioning. You can read more about those options in the [Choose an authentication method](#choose-an-authentication-method) section.

### Devices at scale

Provisioning devices at scale means provisioning one or more IoT Edge devices using the [IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md). You can also call this process **autoprovisioning**.

If your IoT Edge solution needs more than one device, autoprovisioning using DPS saves you from manually entering provisioning information into the configuration files of each device. You can use this automated model to scale to millions of IoT Edge devices.

You can secure your IoT Edge solution using the authentication method that best fits your needs. For provisioning devices at scale, you can use the **symmetric key**, **X.509 certificates**, or **trusted platform module (TPM) attestation** authentication methods. For more information about these options, see the [Choose an authentication method](#choose-an-authentication-method) section.

To learn more about the features of DPS, see the [Features of the Device Provisioning Service](../iot-dps/about-iot-dps.md#features-of-the-device-provisioning-service) section of [What is Azure IoT Hub Device Provisioning Service?](../iot-dps/about-iot-dps.md).

## Choose an authentication method

### X.509 certificate attestation

Use X.509 certificates as an attestation mechanism to scale production and simplify device provisioning. Typically, X.509 certificates are arranged in a certificate chain of trust. Starting with a self-signed or trusted root certificate, each certificate in the chain signs the next lower certificate. This pattern creates a delegated chain of trust from the root certificate down through each intermediate certificate to the final downstream device certificate installed on a device. 

You create two X.509 identity certificates and place them on the device. When you create a new device identity in IoT Hub, you provide thumbprints from both certificates. When the device authenticates to IoT Hub, it presents one certificate and IoT Hub verifies that the certificate matches its thumbprint. The X.509 keys on the device should be stored in a Hardware Security Module (HSM). For example, PKCS#11 modules, ATECC, dTPM, and similar technologies.

This authentication method is more secure than symmetric keys and supports group enrollments that provide a simplified management experience for a high number of devices. Use this authentication method for production scenarios.

### Trusted platform module (TPM) attestation

Use TPM attestation as a method for device provisioning that uses authentication features in both software and hardware. Each TPM chip uses a unique endorsement key to verify its authenticity.

TPM attestation is only available for provisioning at scale with DPS, and it only supports individual enrollments, not group enrollments. Group enrollments aren't available because of the device-specific nature of TPM.

TPM 2.0 is required when you use TPM attestation with the device provisioning service.

This authentication method is more secure than symmetric keys and is recommended for production scenarios.

### Symmetric key attestation

Symmetric key attestation is a simple approach to authenticating a device. This attestation method provides a "Hello world" experience for developers who are new to device provisioning or don't have strict security requirements.

When you create a new device identity in IoT Hub, the service creates two keys. You place one of the keys on the device, and the device presents the key to IoT Hub when authenticating.

This authentication method is faster to get started but not as secure. Device provisioning using a TPM or X.509 certificates is more secure and should be used for solutions with more stringent security requirements.

## Next steps

Use the table of contents to navigate to the appropriate end-to-end guide for creating an IoT Edge device for your IoT Edge solution's platform, provisioning, and authentication requirements.

You can also use the following links to go to the relevant article.

### Linux containers on Linux hosts

**Manually provision a single device**:

* [Create and provision an IoT Edge device on Linux using X.509 certificates](how-to-provision-single-device-linux-x509.md)
* [Create and provision an IoT Edge device on Linux using symmetric keys](how-to-provision-single-device-linux-symmetric.md)

**Provision multiple devices at scale**:

* [Create and provision IoT Edge devices at scale on Linux using X.509 certificates](how-to-provision-devices-at-scale-linux-x509.md)
* [Create and provision IoT Edge devices at scale with a TPM on Linux](how-to-provision-devices-at-scale-linux-tpm.md)
* [Create and provision IoT Edge devices at scale on Linux using symmetric key](how-to-provision-devices-at-scale-linux-symmetric.md)

### Linux containers on Windows hosts

**Manually provision a single device**:

* [Create and provision an IoT Edge for Linux on Windows device using X.509 certificates](how-to-provision-single-device-linux-on-windows-x509.md)
* [Create and provision an IoT Edge for Linux on Windows device using symmetric keys](how-to-provision-single-device-linux-on-windows-symmetric.md)

**Provision multiple devices at scale**:

* [Create and provision IoT Edge for Linux on Windows devices at scale using X.509 certificates](how-to-provision-devices-at-scale-linux-on-windows-x509.md)
* [Create and provision an IoT Edge for Linux on Windows device at scale by using a TPM](how-to-provision-devices-at-scale-linux-on-windows-tpm.md)
* [Create and provision IoT Edge for Linux on Windows devices at scale using symmetric keys](how-to-provision-devices-at-scale-linux-on-windows-symmetric.md)
