---
title: IoT Hub Device Provisioning Service - Auto-provisioning concepts
description: This article provides a conceptual overview of auto-provisioning a device, using IoT Device Provisioning Service and IoT Hub.
services: iot-dps 
keywords: 
author: BryanLa
ms.author: bryanla
ms.date: 03/19/2018
ms.topic: conceptual
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Auto-provisioning concepts

As described in the [Overview](about-iot-dps.md), the Device Provisioning Service is a helper service that enables just-in-time provisioning of devices to an IoT hub, without requiring human intervention. After successful provisioning, devices connect directly with their designated IoT Hub. This process is referred to as auto-provisioning, and provides an out-of-the-box registration and initial configuration experience for devices.

## Overview

Azure IoT auto-provisioning can be understood into three phases:

1. **Service configuration** - a one-time configuration of the Azure IoT Hub and IoT Hub Device Provisioning Service instances, establishing them and creating linkage between them.

   > [!NOTE]
   > Regardless of the size of your IoT solution, even if you plan to support millions of devices, this is a **one-time configuration**.

2. **Device enrollment** - the process of making the Device Provisioning Service instance aware of the devices that will attempt to register in the future. Enrollment is accomplished by configuring device identity information in the provisioning service, as either an "individual enrollment" for a single device, or a "group enrollment" for multiple devices. Identity is based on the [attestation mechanism](concepts-security.md#attestation-mechanism) the device is designed to use, which allows the provisioning service to attest to the device's authenticity during registration:

   - **TPM**: configured as an "individual enrollment", the device identity is based on the TPM registration ID and the public endorsement key. Given that TPM is a [specification]((https://trustedcomputinggroup.org/work-groups/trusted-platform-module/)), the service only expects to attest per the specification, regardless of TPM implementation (hardware or software). See [Device provisioning: Identity attestation with TPM](https://azure.microsoft.com/blog/device-provisioning-identity-attestation-with-tpm/) for details on TPM-based attestation. 

   - **X509**: configured as either an "individual enrollment" or "group enrollment", the device identity is based on an X.509 digital certificate, which is uploaded to the enrollment as a .pem or .cer file.

   > [!IMPORTANT]  
   > Although not a prerequisite for using Device Provisioning Services, we strongly recommend that your device use a Hardware Security Module (HSM) to store sensitive device identity information, such as keys and X.509 certificates.

3. **Device registration and configuration** - initiated upon boot up by registration software, which is built using a Device Provisioning Service client SDK appropriate for the device and attestation mechanism. The software establishes a connection to the provisioning service for authentication of the device, and subsequent registration in the IoT Hub. Upon successful registration, the device is provided with its IoT Hub unique device ID and connection information, allowing it to pull its initial configuration and begin the telemetry process. In production environments, this phase can occur weeks or months after the previous two phases.

## Roles and operations

In addition to spanning weeks or months in time, the phases discussed in the previous section also span multiple roles. And in order for auto-provisioning to work, requirements are also placed on the manufacturer, specific to enabling the attestation mechanism. This means the phases may even occur in different orders, due to the asynchronous nature of the operations performed by the related roles.

This section takes takes a deeper look at the various roles and operations related to each, then illustrates the flow in a sequence diagram.

In addition, a series of Quickstarts are provided in the table of contents to the left, to help explain auto-provisioning through hands-on experience. In order to facilitate/simplify the learning process, software is used to simulate a physical device for enrollment and registration. As noted earlier, the Quickstarts may also require you to fulfill operations for multiple roles, including roles that are not applicable due to the simulated nature of the Quickstarts.



| Role | Operation | Description | Related Quickstart |
|------| --------- | ------------| -------------------|
| Manufacturer | Encode identity and registration URL | As the Quickstarts use a simulated device, there is no Manufacturer role. See the Developer role for details on how you get this information, which is used in coding a sample registration application. |  Auto-provision a simulated device (TPM/X.509)|
| | Provide device identity | As the Quickstarts use a simulated device, there is no Manufacturer role. See the Operator role for details on how you get the device identity, which is used to enroll a simulated device in your Device Provisioning Service instance. | Auto-provision a simulated device (TPM/X.509) |
| Device | Bootup and register | As the Quickstarts use a simulated device, the physical Device role is fulfilled by software built by the Developer, which runs on a workstation. Upon first boot: <ol><li>The application connects with the Device Provisioning Service instance, per the global URL and service "ID Scope" specified during development</li><li>Once connected, the simulated device is authenticated against the attestation method and identity specified during enrollment. See the Developer role for details.</li><li>Once authenticated, the simulated device is registered with the IoT Hub instance specified by the provisioning service instance.</li><li>Upon successful registration, a unique device ID and IoT Hub endpoint are returned to the registration application for communicating with IoT Hub.</li><li> From there, the simulated device can pull down its initial [device twin](~/articles/iot-hub/iot-hub-devguide-device-twins.md) state for configuration, and begin the process of reporting telemetry data.</li></ol>| Auto-provision a simulated device (TPM/X.509) |
| Operator | Configure auto-provisioning | You perform the Operator role, configuring the Device Provisioning Service and IoT Hub instances in your Azure subscription. | Set-up auto-provisioning |
|  | Enroll device identity | You perform the Operator role, enrolling your simulated device in your Device Provisioning Service instance. The device identity is determined by the attestation method being simulated in the Quickstart (TPM or X.509). See the Developer role for attestation details. | Auto-provision a simulated device (TPM/X.509) |
| Developer | Build/Deploy registration software | You build a sample registration application to simulate a real device, for your platform/language of choice, which runs on your workstation (instead of deploying it to a physical device). <br><br>The registration application performs the same operations one deployed to a physical device. You specify the attestation method (TPM or X.509 certificate), plus the registration URL and "ID Scope" of your Device Provisioning Service instance. The device identity is determined by the SDK attestation logic at runtime, based on the method you specify: <ul><li>**TPM attestation** - your development workstation runs a [TPM simulator application](how-to-use-sdk-tools.md#trusted-platform-module-tpm-simulator). Once running, a separate application is used to extract the TPM's "Endorsement Key" and "Registration ID" for use in enrolling the device identity. The SDK attestation logic also uses the simulator during registration, to present a signed SAS token for authentication and enrollment verification.</li><li>**X509 attestation** - you use a tool to [generate a certificate](how-to-use-sdk-tools.md#x509-certificate-generator). Once generated, you create the certificate file required for use in enrollment. The SDK attestation logic also uses the certificate during registration, to present for authentication and enrollment verification.</li></ul> | Auto-provision a simulated device (TPM/X.509) |
| Device Provisioning Service,<br>IoT Hub | \<all operations\> | Just like a production implementation with physical devices, these roles are fulfilled via the IoT services you configure in your Azure subscription. The roles/operations function exactly the same for the Quickstarts, as the IoT services are indifferent to provisioning of physical vs. simulated devices. | Set up auto-provisioning,<br><br>Auto-provision a simulated device (TPM/X.509) |

The following diagram provides a general overview of the roles and sequencing of operations required for auto-provisioning of a device:

![Auto-provisioning sequence for a device](./media/concepts-auto-provisioning/sequence-auto-provision-device-vs.png) 

> [!NOTE]
> Optionally, the manufacturer can also perform the "Enroll device identity" operation using Device Provisioning Service APIs (instead of via the Operator). For a detailed discussion of this sequencing and more, see the [Zero touch device registration with Azure IoT video](https://myignite.microsoft.com/sessions/55087) (starting at marker 41:00)

## Next steps

You may find it helpful to bookmark this article as a point of reference, as you work your way through the corresponding auto-provisioning Quickstarts. 

Begin by completing a "Set up auto-provisioning" Quickstart that best suits your management tool preference, which walks you through the "Service configuration" phase:

- [Set up auto-provisioning using Azure CLI](quick-setup-auto-provision-cli.md)
- [Set up auto-provisioning using the Azure Portal](quick-setup-auto-provision.md)
- [Set up auto-provisioning using a Resource Manager template](quick-setup-auto-provision-rm.md)

Then continue with an "Auto-provision a simulated device" Quickstart that suits your device attestation mechanism and Device Provisioning Service SDK/language preference. In this Quickstart, you walk through the "Device enrollment" and "Device registration and configuration" phases: 

|  | Simulated device attestation mechanism | Quickstart SDK/Language |  |
|--|--|--|--|
|  | Trusted Platform Module (TPM) | [C](quick-create-simulated-device.md)<br>[Java](quick-create-simulated-device-tpm-java.md)<br>[C#](quick-create-simulated-device-tpm-csharp.md)<br>[Python](quick-create-simulated-device-tpm-python.md) |  |
|  | X.509 certificate | [C](quick-create-simulated-device-x509.md)<br>[Java](quick-create-simulated-device-x509-java.md)<br>[C#](quick-create-simulated-device-x509-csharp.md)<br>[Node.js](quick-create-simulated-device-x509-node.md)<br>[Python](quick-create-simulated-device-x509-python.md) |  |




