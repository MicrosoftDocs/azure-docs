---
title: Security concepts in Azure IoT Hub Device Provisioning Service | Microsoft Docs
description: Describes security provisioning concepts specific to devices with Device Provisioning Service and IoT Hub
services: iot-dps
keywords: 
author: nberdy
ms.author: nberdy
ms.date: 09/05/2017
ms.topic: article
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc

---

# IoT Hub Device Provisioning Service security concepts 

IoT Hub Device Provisioning Service is a helper service for IoT Hub that you use to configure zero-touch device provisioning to a specified IoT hub. With the Device Provisioning Service you can provision millions of devices in a secure and scalable manner. This article gives an overview of the *security* concepts involved in device provisioning. This article is relevant to all personas involved in getting a device ready for deployment.

## Attestation mechanism

The attestation mechanism is the method used for confirming a device's identity. The attestation mechanism is also relevant to the enrollment list, which tells the provisioning service which method of attestation to use with a given device.

> [!NOTE]
> IoT Hub uses "authentication scheme" for a similar concept in that service.

Device Provisioning Service supports two forms of attestation:
* **X.509 certificates** based on the standard X.509 certificate authentication flow.
* **SAS tokens** based on a nonce challenge using the TPM standard for keys. This does not require a physical TPM on the device, but the service expects to attest using the endorsement key per the [TPM spec](https://trustedcomputinggroup.org/work-groups/trusted-platform-module/).

## Hardware security module

The hardware security module, or HSM, is used for secure, hardware-based storage of device secrets, and is the most secure form of secret storage. Both X.509 certificates and SAS tokens can be stored in the HSM. HSMs can be used with both attestation mechanisms the provisioning supports.

> [!TIP]
> We strongly recommend using an HSM with devices to securely store secrets on your devices.

Device secrets may also be stored in software (memory), but it is a less secure form of storage than an HSM.

## Trusted Platform Module (TPM)

TPM can refer to a standard for securely storing keys used to authenticate the platform, or it can refer to the I/O interface used to interact with the modules implementing the standard. TPMs can exist as discrete hardware, integrated hardware, firmware-based, or software-based. Learn more about [TPMs and TPM attestation](/windows-server/identity/ad-ds/manage/component-updates/tpm-key-attestation). Device Provisioning Service only supports TPM 2.0.

## Endorsement key

The endorsement key is an asymmetric key contained inside the TPM which was injected at manufacturing time and is unique for every TPM. The endorsement key cannot be changed or removed. The private portion of the endorsement key is never released outside of the TPM, while the public portion of the endorsement key is used to recognize a genuine TPM. Learn more about the [endorsement key](https://technet.microsoft.com/library/cc770443(v=ws.11).aspx).

## Storage root key

The storage root key is stored in the TPM and is used to protect TPM keys created by applications, so that these keys cannot be used without the TPM. The storage root key is generated when you take ownership of the TPM; when you clear the TPM so a new user can take ownership, a new storage root key is generated. Learn more about the [storage root key](https://technet.microsoft.com/library/cc753560(v=ws.11).aspx).

## Root certificate

A root certificate is a type of X.509 certificate representing a certificate authority and is self-signed. It is the terminus of the certificate chain.

## Intermediate certificate

An intermediate certificate is an X.509 certificate which has been signed by the root certificate (or by another certificate with the root certificate in its chain) and which is used to sign the leaf certificate.

## Leaf certificate

A leaf certificate, or end-entity certificate, is used to identify the certificate holder and it has the root certificate in its certificate chain. The leaf certificate is not used to sign any other certificates.
