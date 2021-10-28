---
title: Create an IoT Edge device - Azure IoT Edge | Microsoft Docs
description: Learn about the platform and provisioning options for creating an IoT Edge device
author: kgremban
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 10/28/2021
ms.author: kgremban
---

# Create an IoT Edge device

[!INCLUDE [iot-edge-version-all-supported](../../includes/iot-edge-version-all-supported.md)]

This article provides an overview of the options available to you for your IoT Edge solution.

First, familiarize yourself with some important terminology if you're not already:

**IoT Edge device**: IoT Edge devices are your cloud-enabled devices running the IoT Edge runtime.

**IoT Edge runtime** The [IoT Edge runtime](iot-edge-runtime.md) is a collection of programs that turn a device into an IoT Edge device. Collectively, the IoT Edge runtime components enable IoT Edge devices to run your modules.

**Modules**: Modules are the workloads your IoT Edge devices run. Modules are containerized processes and services. They can be Azure services, third-party services, or your own code.

**IoT Hub**: Every IoT Edge device needs to connect to an IoT hub. An IoT hub serves as a secure, central, bidirectional message hub for communication between your devices and their IoT applications. If you want to learn more about IoT Hub, see the [IoT Hub documentation](../iot-hub/about-iot-hub.md).

**Provisioning**: Each IoT Edge device must be provisioned. Provisioning is a two-step process. Step one is registering the device in an IoT hub, which creates a cloud identity that the device uses to establish the connection to its hub. The second step is configuring the device with its cloud identity. Provisioning can be done manually on a per-device basis, or it can be done at-scale using the [IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md).

**Authentication**: Your IoT Edge devices need to verify its identity when it connects to IoT Hub. You can choose which authentication method to use, like symmetric key passwords, certificate thumbprints, or trusted platform modules (TPMs).

This article provides a look at all of the options for your IoT Edge solution and helps you:

* [Choose a platform](#Choose-a-platform)
* [Choose how to provision your devices](#Choose-how-to-provision-your-devices)
* [Choose an authentication method](#Choose-an-authentication-method)

By the end of this article, you'll have a clear picture of what platform, provisioning, and authentication options you want to use for your IoT Edge solution. Links to the available end-to-end how-to guides are provided so you can get started.

## Get started

If you know what type of platform, provisioning, and authentication options you want to use to create an IoT Edge device, use the links in the following table to get started.

If you want more information about how to choose the right option for you, continue through this article to learn more.

*Table 1 option:*

|    | Linux | Linux on Windows | Windows |
| -- | ----- | ---------------- | ------- |
| **Manual provisioning (single device)** | [Symmetric keys](how-to-provision-single-device-linux-symmetric.md) | [Symmetric keys](how-to-provision-single-device-linux-on-windows-symmetric.md) | [Symmetric keys](how-to-provision-single-device-windows-symmetric.md) |
|    | [X.509 certificates](how-to-provision-single-device-linux-x509.md) | [X.509 certificates](how-to-provision-single-device-linux-on-windows-x509.md) | [X.509 certificates](how-to-provision-single-device-windows-x509.md) |
| **Autoprovisioning (devices at scale)** | [Symmetric keys](how-to-provision-devices-at-scale-linux-symmetric.md) | [Symmetric keys](how-to-provision-devices-at-scale-linux-on-windows-symmetric.md) | [Symmetric keys](how-to-provision-devices-at-scale-windows-symmetric.md) |
|    | [X.509 certificates](how-to-provision-devices-at-scale-linux-x509.md) | [X.509 certificates](how-to-provision-devices-at-scale-linux-on-windows-x509.md) | [X.509 certificates](how-to-provision-devices-at-scale-windows-x509.md) |
|    | [TPM](how-to-provision-devices-at-scale-linux-tpm.md) | [TPM](how-to-provision-devices-at-scale-linux-on-windows-tpm.md) | [TPM](how-to-provision-devices-at-scale-windows-tpm.md) |

*Table 2 option:*

|    | Linux | Linux on Windows | Windows |
| -- | ----- | ---------------- | ------- |
| **Manual provisioning (single device)** | [Symmetric keys](how-to-provision-single-device-linux-symmetric.md)<br><br>[X.509 certificates](how-to-provision-single-device-linux-x509.md) | [Symmetric keys](how-to-provision-single-device-linux-on-windows-symmetric.md)<br><br>[X.509 certificates](how-to-provision-single-device-linux-on-windows-x509.md) | [Symmetric keys](how-to-provision-single-device-windows-symmetric.md)<br><br>[X.509 certificates](how-to-provision-single-device-windows-x509.md) |
| **Autoprovisioning (devices at scale)** | [Symmetric keys](how-to-provision-devices-at-scale-linux-symmetric.md)<br><br>[X.509 certificates](how-to-provision-devices-at-scale-linux-x509.md)<br><br>[TPM](how-to-provision-devices-at-scale-linux-tpm.md) | [Symmetric keys](how-to-provision-devices-at-scale-linux-on-windows-symmetric.md)<br><br>[X.509 certificates](how-to-provision-devices-at-scale-linux-on-windows-x509.md)<br><br>[TPM](how-to-provision-devices-at-scale-linux-on-windows-tpm.md) | [Symmetric keys](how-to-provision-devices-at-scale-windows-symmetric.md)<br><br>[X.509 certificates](how-to-provision-devices-at-scale-windows-x509.md)<br><br>[TPM](how-to-provision-devices-at-scale-windows-tpm.md) |

## Choose a platform

Platform options are referred to by the container operating system and the host operating system. The container operating system is the operating system used inside your IoT Edge runtime and module containers. The host operating system is the operating system of the device the IoT Edge runtime containers and modules are running on.

There are three platform options for your IoT Edge devices.

* **Linux containers on Linux**: Run Linux-based IoT Edge containers directly on a Linux host. Throughout the IoT Edge docs, you'll also see this option referred to as **Linux** and **Linux containers** for simplicity.

* **Linux containers on Windows**: Run Linux-based IoT Edge containers in a Linux virtual machine on a Windows host. Throughout the IoT Edge docs, you'll also see this option referred to as **Linux on Windows**, **IoT Edge for Linux on Windows**, and **EFLOW**. IoT Edge for Linux on Windows is the recommended solution for running IoT Edge on Windows devices. Currently, IoT Edge for Linux on Windows is only supported for version 1.1 of Azure IoT Edge.

* **Windows containers on Windows**: Run Windows-based IoT Edge containers directly on a Windows host. Throughout the IoT Edge docs, you'll also see this option referred to as **Windows** and **Windows containers** for simplicity. Windows containers are not the recommended way to run IoT Edge on Windows devices, as they are only supported for version 1.1 of Azure IoT Edge and will not be supported in future versions. We recommend using IoT Edge for Linux on Windows if you want to run IoT Edge on Windows devices.

For the latest information about which operating systems are currently supported for production scenarios, see [Azure IoT Edge supported systems](support.md#operating-systems).

### Linux containers on Linux

For Linux devices, the IoT Edge runtime is installed directly on the host device. IoT Edge supports X64, ARM32, and ARM64 Linux devices. Microsoft provides installation packages for Ubuntu Server 18.04 and Raspberry Pi OS Stretch operating systems.

   > [!NOTE]
   > Support for ARM64 devies is in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

### Linux containers on Windows

IoT Edge for Linux on Windows hosts a Linux virtual machine on your Windows device. The virtual machine comes prebuilt with the IoT Edge runtime and updates are managed through Microsoft Update.

IoT Edge for Linux on Windows is the recommended way to run IoT Edge on Windows devices.

You can learn more about IoT Edge for Linux on Windows on its [concepts page](iot-edge-for-linux-on-windows.md).

   > [!NOTE]
   > Currently, IoT Edge for Linux on Windows does not support version 1.2 of Azure IoT Edge.

### Windows containers on Windows

For Windows devices, the IoT Edge runtime is installed directly on the host device. This platform allows you to build, deploy, and run your IoT Edge modules as Windows containers.

   > [!NOTE]
   > Windows containers are not the recommended way to run IoT Edge on Windows devices, as they are not supported beyond version 1.1 of Azure IoT Edge.
   >
   > Consider using IoT Edge for Linux on Windows if you want to run IoT Edge on Windows devices.

## Choose how to provision your devices

You can provision a single device or multiple devices at-scale, depending on the needs of your IoT Edge solution.

The options available for authenticating communications between your IoT Edge devices and your IoT hubs depend on what provisioning method you choose. You can read more about those options in the [Choose an authentication method section](#choose-an-authentication-method).

### Single device

Single device provisioning refers to provisioning an IoT Edge device without the assistance of the [IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md) (DPS). You'll see single device provisioning also referred to as **manual provisioning**.

Using single device provisioning, you will need to manually enter provisioning information, like a connection string, on your devices. Manual provisioning is quick and easy to set up for only a few devices, but your workload will increase with the number of devices. Keep this is mind when you are considering the scalability of your solution.

**Symmetric key** and **X.509 self-signed** authentication methods are available for manual provisioning. You can read more about those options in the [Choose an authentication method section](#choose-an-authentication-method).

### Devices at scale

Provisioning devices at-scale refers to provisioning one or more IoT Edge devices with the assistance of the [IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md). You'll see provisioning at-scale also referred to as **autoprovisioning**.

If your IoT Edge solution requires more than one device, autoprovisioning using DPS saves you the effort of manually entering provisioning information into the configuration files of each device you want to use. This automated model can be scaled to millions of IoT Edge devices. You can see the automated provisioning flow in the [Behind the scenes section of IoT Hub DPS overview page](../iot-dps/about-iot-dps.md#behind-the-scenes).

You can secure your IoT Edge solution with the authentication method of your choice. **Symmetric key**, **X.509 certificates**, and **trusted platform module (TPM) attestation** authentication methods are available for provisioning devices at-scale. You can read more about those options in the [Choose an authentication method section](#choose-an-authentication-method).

To see more of the features of DPS, see the [Features section of the overview page](../iot-dps/about-iot-dps.md#features-of-the-device-provisioning-service).

## Choose an authentication method

### Symmetric keys attestation

Symmetric key attestation is a simple approach to authenticating a device. This attestation method represents a "Hello world" experience for developers who are new to device provisioning, or do not have strict security requirements.

When you create a new device identity in IoT Hub, the service creates two keys. You place one of the keys on the device, and it presents the key to IoT Hub when authenticating.

This authentication method is faster to get started but not as secure. Device provisioning using a TPM or X.509 certificates is more secure and should be used for solutions with more stringent security requirements.

### X.509 certificate attestation

Using X.509 certificates as an attestation mechanism is an excellent way to scale production and simplify device provisioning. Typically, X.509 certificates are arranged in a certificate chain of trust. Starting with a self-signed or trusted root certificate, each certificate in the chain signs the next lower certificate. This pattern creates a delegated chain of trust from the root certificate down through each intermediate certificate to the final "leaf" certificate installed on a device.

You create two X.509 identity certificates and place them on the device. When you create a new device identity in IoT Hub, you provide thumbprints from both certificates. When the device authenticates to IoT Hub, it presents one certificate and IoT Hub verifies that the certificate matches its thumbprint.

This authentication method is more secure and recommendation for production scenarios.

### Trusted platform module (TPM) attestation

Using TPM attestation is the most secure method for device provisioning, as it provides authentication features in both software and hardware. Each TPM chip uses a unique endorsement key to verify its authenticity.

TPM attestation is only available for provisioning at-scale with DPS, and only support individual enrollment not group enrollments. Group enrollments are not available because of the device-specific nature of TPM.

TPM 2.0 is required when you use TPM attestation with the device provisioning service.

This authentication method is more secure and recommendation for production scenarios.

## Next steps

You can use the table of contents to navigate to the appropriate end-to-end guide for creating an IoT Edge device for your IoT Edge solution's platform, provisioning, and authentication requirements.

You can also use the links below to go to the relevant article.

### Linux

**Manually provision a single device**:

* [Provision a single device using X.509 certificates](how-to-provision-single-device-linux-x509.md)
* [Provision a single device using symmetric keys](how-to-provision-single-device-linux-symmetric.md)

**Provision multiple devices at-scale**:

* [Provision devices at-scale using TPM attestation](how-to-provision-devices-at-scale-linux-tpm.md)
* [Provision devices at-scale using X.509 certificates](how-to-provision-devices-at-scale-linux-x509.md)
* [Provision devices at-scale using symmetric keys](how-to-provision-devices-at-scale-linux-symmetric.md)

### Linux on Windows

**Manually provision a single device**:

* [Provision a single device using X.509 certificates](how-to-provision-single-device-linux-on-windows-x509.md)
* [Provision a single device using symmetric keys](how-to-provision-single-device-linux-on-windows-symmetric.md)

**Provision multiple devices at-scale**:

* [Provision devices at-scale using TPM attestation](how-to-provision-devices-at-scale-linux-on-windows-tpm.md)
* [Provision devices at-scale using X.509 certificates](how-to-provision-devices-at-scale-linux-on-windows-x509.md)
* [Provision devices at-scale using symmetric keys](how-to-provision-devices-at-scale-linux-on-windows-symmetric.md)

### Windows

**Manually provision a single device**:

* [Provision a single device using X.509 certificates](how-to-provision-single-device-windows-x509.md)
* [Provision a single device using symmetric keys](how-to-provision-single-device-windows-symmetric.md)

**Provision multiple devices at-scale**:

* [Provision devices at-scale using TPM attestation](how-to-provision-devices-at-scale-windows-tpm.md)
* [Provision devices at-scale using X.509 certificates](how-to-provision-devices-at-scale-windows-x509.md)
* [Provision devices at-scale using symmetric keys](how-to-provision-devices-at-scale-windows-symmetric.md)
