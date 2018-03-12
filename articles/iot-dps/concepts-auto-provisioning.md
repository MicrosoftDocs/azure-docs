---
title: IoT Hub Device Provisioning Service - Auto-provisioning concepts
description: This article provides a conceptual overview of auto-provisioning a device, using IoT Device Provisioning Service and IoT Hub.
services: iot-dps 
keywords: 
author: BryanLa
ms.author: bryanla
ms.date: 03/13/2018
ms.topic: conceptual
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Auto-provisioning concepts

As described in the [Overview](about-iot-dps.md), the Device Provisioning Service is a helper service that enables just-in-time provisioning of devices to an IoT hub, without requiring human intervention. After successful provisioning, devices connect directly with their designated IoT Hub. This process is referred to as device auto-provisioning. 

## Overview

Azure IoT auto-provisioning can be separated into three phases:

1. **Service configuration** - This is a one-time configuration of the Device Provisioning Service and IoT Hub, establishing the Azure service instances and creating linkage between them.

   > [!NOTE]
   > Regardless of the size of your IoT solution, even if you plan to support millions of devices, this is a **one-time configuration**.

2. **Device enrollment** - the process of enrollment makes the Device Provisioning Service instance aware of the devices that will attempt to register in the future. Enrollment is accomplished by configuring device identity information in the provisioning service, as either an "individual enrollment" for a single device, or a "group enrollment" for multiple devices. Identity is based on the [attestation mechanism](concepts-security.md#attestation-mechanism) the device is designed to use, which allows the provisioning service to attest to the device's authenticity during registration:

   - **TPM**: configured as an "individual enrollment", the device identity is based on the TPM registration ID and the public endorsement key. Given that TPM is a [specification]((https://trustedcomputinggroup.org/work-groups/trusted-platform-module/)), the service only expects to attest per the specification, regardless of implementation (hardware or software). See [Device provisioning: Identity attestation with TPM](https://azure.microsoft.com/blog/device-provisioning-identity-attestation-with-tpm/) for details on TPM-based attestation. 

   - **X509**: configured as either an "individual enrollment" or "group enrollment", the device identity is based on an X.509 digital certificate, which is uploaded to the enrollment as a .pem or .cer file.

   > [!IMPORTANT]  
   > Although not a prerequisite for using Device Provisioning Services, we strongly recommend that your device use a Hardware Security Module (HSM) to store sensitive device identity information, such as keys and X.509 certificates.

3. **Device registration** - registration is the final phase, initiated by device registration software upon boot up. Registration software is built using a Device Provisioning Service client SDK, appropriate for the device and attestation method. The software triggers the connection to the provisioning service for authentication of the device and subsequent registration in IoT Hub, providing an "out-of-box" registration experience. In production environments, this phase can occur weeks or months after the previous two phases.

## Roles and operations

The following diagram provides a general overview of the roles and sequencing of operations required for auto-provisioning of a device:

![Auto-provisioning sequence for a device](./media/concepts-auto-provisioning/sequence-auto-provision-device-vs.png) 

> [!NOTE]
> Optionally, the manufacturer can also perform the "Enroll device identity" operation via Device Provisioning Service APIs (instead of via the Operator). For a detailed discussion of this sequencing and more, see the [Zero touch device registration with Azure IoT video](https://myignite.microsoft.com/sessions/55087) (starting at marker 41:00)

## Auto-provisioning Quickstarts

A series of Quickstarts are provided in the table of contents to the left, to help you understand the auto-provisioning process. In order to simplify the learning process, software is used in place of a physical device, to simulate the device used for enrollment and registration. 

As such, some of the auto-provisioning role/operation definitions are slightly modified:

| Role | Operation | Description |
|------| --------- | ------------|
| Manufacturer | Encode identity and registration URL | Not applicable for Quickstarts. See the Developer role for details on how you get this information, for encoding into a sample registration application. |
| | Provide device identity | Not applicable for Quickstarts. See the Operator role for details on how you get this information, used for enrolling a simulated device. |
| Device | Bootup and register | The Device role is performed by the sample registration application, built by the Developer role. Upon first boot: <br><br>1) the registration application connects with the Device Provisioning Service instance, per the global URL and service "ID Scope" specified during development<br>2) Once connected to the provisioning service, the registration application is authenticated against the attestation method and identity provided during enrollment:<br><br>- **TPM attestation**: verifies enrollment of device ID/key, then uses a SAS token for service authentication.<br>- **X.509 certificate attestation**: verifies enrollment of certificate representing the device, then uses SSL/TLS for service authentication.<br><br>3) The simulated device is then registered with the IoT Hub instance specified by the provisioning service instance.<br>4) Upon successful registration, a unique device ID, and IoT Hub endpoint are returned to the registration application for communicating with IoT Hub.<br>5) From there, the simulated device can pull down its initial [device twin](~/articles/iot-hub/iot-hub-devguide-device-twins.md) state for configuration, and begin the process of reporting telemetry data.|
| Operator | Configure auto-provisioning | You perform configuration of your Device Provisioning Service and IoT Hub instances in your Azure subscription. |
|  | Enroll device identity | You perform enrollment of your simulated device, in your Device Provisioning Service instance. The device identity is determined by the simulated attestation method provided in the Quickstart (TPM or X.509). See the Developer role for details. |
| Developer | Build/Deploy registration app | The sample registration application you build runs on your workstation, simulating a real device, instead of deploying it to a physical device. The application you build is for your platform/language of choice, and coded with credentials for a simulated attestation type (TPM or X.509 certificate), and the registration URL and "ID Scope" for your Device Provisioning Service instance. <br><br>The sample application performs the same operations as a registration application deployed to a physical device.  The device identity is determined by the attestation method demonstrated in the Quickstart: <br><br>- **TPM attestation** - your development workstation also runs a [TPM simulator application](how-to-use-sdk-tools.md#trusted-platform-module-tpm-simulator). Once running, a separate application is used to extract the TPM's "Endorsement Key" and "Registration ID" for use in enrollment and registration.<br>- **X509 attestation** - you use a tool to [generate a certificate](how-to-use-sdk-tools.md#x509-certificate-generator). Once generated, you create the certificate files required for use in enrollment and registration.  |
| Device Provisioning Service,<br>IoT Hub | <> | Just as a production implementation with real devices, these roles are fulfilled via the corresponding services that you configured in your Azure subscription. The operations function exactly the same, as the IoT services are indifferent to enrollment/registration of physical vs. simulated devices.|


## Next steps

You may find it helpful to bookmark this article as a point of reference, as you work your way through the corresponding auto-provisioning Quickstarts. 

Begin by completing a "Set up auto-provisioning" Quickstart that best suits your management tool preference, which walks you through the "Service configuration" phase:

- [Set up auto-provisioning using Azure CLI](quick-setup-auto-provision-cli.md)
- [Set up auto-provisioning using the Azure Portal](quick-setup-auto-provision.md)
- [Set up auto-provisioning using a Resource Manager template](quick-setup-auto-provision-rm.md)

Then continue with an "Auto-provision a simulated device" Quickstart that suits your device attestation type and language preference. In this Quickstart, you walk through the "Device enrollment" and "Device registration" phases: 

| Simulated device attestation type | Device Provisioning Service SDK used to build simulated device |
|---------------------------|----------------------------------------------------------------|
| Trusted Platform Module (TPM) | [C](quick-create-simulated-device.md)<br>[Java](quick-create-simulated-device-tpm-java.md)<br>[C#](quick-create-simulated-device-tpm-csharp.md)<br>[Python](quick-create-simulated-device-tpm-python.md) |
| X.509 certificate | [C](quick-create-simulated-device-x509.md)<br>[Java](quick-create-simulated-device-x509-java.md)<br>[C#](quick-create-simulated-device-x509-csharp.md)<br>[Node.js](quick-create-simulated-device-x509-node.md)<br>[Python](quick-create-simulated-device-x509-python.md) |




