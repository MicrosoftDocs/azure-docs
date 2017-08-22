---
title: Security concepts in device provisioning | Microsoft Docs
description: Describes security provisioning concepts specific to devices with DPS and IoT Hub
services: iot-dps
keywords: 
author: nberdy
ms.author: nberdy
ms.date: 08/22/2017
ms.topic: article
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc

---

# Security concepts in device provisioning

IoT Hub Device Provisioning Service is a helper service for IoT Hub that you use to configure zero-touch device provisioning to a specified IoT hub. With IoT DPS you can provision millions of devices in a secure and scalable manner.

Device provisioning  is a two part process. The first part is establishing the initial connection between the device and the IoT solution by *registering* the device. The second part is applying the proper *configuration* to the device based on the specific requirements of the solution it was registered to. Only once both those two steps have been completed can I say that the device has been fully *provisioned*. IoT DPS automates these both steps to provide a seamless provisioning experience for the device.

This article gives an overview of the *security* concepts involved in device provisioning. This article is relevant to all personas involved in getting a device ready for deployment.

### Attestation

See [attestation mechanism](#attestation-mechanism).

### Hardware security module

See [hardware security module](#hardware-security-module).

### Trusted Platform Module (TPM)

TPM can refer to a standard for securely storing keys used to authenticate the platform, or it can refer to the I/O interface used to interact with the modules implementing the standard. TPMs can exist as discrete hardware, integrated hardware, firmware-based, or software-based. Learn more about [TPMs and TPM attestation](https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/manage/component-updates/tpm-key-attestation). DPS only supports TPM 2.0.

## TODO: waiting for Eustace for the following, this header will be removed at a later date!!!
### Endorsement key

The endorsement key (EK) is an asymmetric key contained inside the TPM which was injected at manufacturing time. The EK is unique for every TPM and can identify it. The EK cannot be changed or removed.

### Storage root key

### Signing certificate

### Intermediate certificate

### Root certificate

### Leaf certificate
