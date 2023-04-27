---
title: Overview of Azure IoT Hub X.509 CA security
description: Overview - how to authenticate devices to IoT Hub using X.509 Certificate Authorities. 
author: eustacea
manager: arjmands
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 07/14/2022
ms.author: eustacea
ms.custom: ['Role: Cloud Development', 'Role: IoT Device', 'Role: System Architecture']
---

# Authenticate devices using X.509 CA certificates

This article describes how to use X.509 certificate authority (CA) certificates to authenticate devices connecting to IoT Hub. In this article you will learn:

* How to get an X.509 CA certificate
* How to register the X.509 CA certificate to IoT Hub
* How to sign devices using X.509 CA certificates
* How devices signed with X.509 CA are authenticated

[!INCLUDE [iot-hub-include-x509-ca-signed-support-note](../../includes/iot-hub-include-x509-ca-signed-support-note.md)]

The X.509 CA feature enables device authentication to IoT Hub using a certificate authority (CA). It simplifies the initial device enrollment process and supply chain logistics during device manufacturing. If you aren't familiar with X.509 CA certificates, see [Understand how X.509 CA certificates are used in the IoT industry](iot-hub-x509ca-concept.md) for more information.

## Get an X.509 CA certificate

The X.509 CA certificate is at the top of the chain of certificates for each of your devices.  You may purchase or create one depending on how you intend to use it.

For production environments, we recommend that you purchase an X.509 CA certificate from a professional certificate services provider. Purchasing a CA certificate has the benefit of the root CA acting as a trusted third party to vouch for the legitimacy of your devices. Consider this option if your devices are part of an open IoT network where they interact with third-party products or services.

You may also create a self-signed X.509 CA certificate for testing purposes. For more information about creating certificates for testing, see [Create and upload certificates for testing](tutorial-x509-test-certs.md).

>[!NOTE]
>We do not recommend the use of self-signed certificates for production environments.

Regardless of how you obtain your X.509 CA certificate, make sure to keep its corresponding private key secret and protected always. This precaution is necessary for building trust in the X.509 CA authentication.

## Sign devices into the certificate chain of trust

The owner of an X.509 CA certificate can cryptographically sign an intermediate CA that can in turn sign another intermediate CA, and so on, until the last intermediate CA terminates this process by signing a device certificate. The result is a cascaded chain of certificates known as a *certificate chain of trust*. In real life this plays out as delegation of trust towards signing devices. This delegation is important because it establishes a cryptographically variable chain of custody and avoids sharing of signing keys.

![Diagram that shows the certificates in a chain of trust.](./media/generic-cert-chain-of-trust.png)

The device certificate (also called a leaf certificate) must have the *subject name* set to the **device ID** (`CN=deviceId`) that was used when registering the IoT device in Azure IoT Hub. This setting is required for authentication.

Learn how to [create a certificate chain](https://github.com/Azure/azure-iot-sdk-c/blob/master/tools/CACertificates/CACertificateOverview.md) as done when signing devices.

## Register the X.509 CA certificate to IoT Hub

Register your X.509 CA certificate to IoT Hub, which uses it to authenticate your devices during registration and connection.  Registering the X.509 CA certificate is a two-step process that includes uploading the certificate file and then establishing proof of possession.

The upload process entails uploading a file that contains your certificate.  This file should never contain any private keys.

The proof of possession step involves a cryptographic challenge and response process between you and IoT Hub.  Given that digital certificate contents are public and therefore susceptible to eavesdropping, IoT Hub has to verify that you really own the CA certificate.  You can choose to either automatically or manually verify ownership. For manual verification, Azure IoT Hub generates a random challenge that you sign with the CA certificate's corresponding private key.  If you kept the private key secret and protected as recommended, then only you possess the knowledge to complete this step. Secrecy of private keys is the source of trust in this method.  After signing the challenge, you complete this step and manually verify your certificate by uploading a file containing the results.

Learn how to [register your CA certificate](tutorial-x509-test-certs.md#register-your-subordinate-ca-certificate-to-your-iot-hub).

## Create a device on IoT Hub

To prevent device impersonation, IoT Hub requires that you let it know what devices to expect. You do this by creating a device entry in the IoT hub's device registry. This process is automated when using [IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md).

Learn how to [manually create a device in IoT Hub](./iot-hub-create-through-portal.md#register-a-new-device-in-the-iot-hub).

## Authenticate devices signed with X.509 CA certificates

With your X.509 CA certificate registered and devices signed into a certificate chain of trust, the final step is device authentication when the device connects.  When an X.509 CA-signed device connects, it uploads its certificate chain for validation. The chain includes all intermediate CA and device certificates.  With this information, IoT Hub authenticates the device in a two-step process.  IoT Hub cryptographically validates the certificate chain for internal consistency, and then issues a proof-of-possession challenge to the device.  IoT Hub declares the device authentic on a successful proof-of-possession response from the device.  This declaration assumes that the device's private key is protected and that only the device can successfully respond to this challenge.  We recommend using secure chips like Hardware Secure Modules (HSM) in devices to protect private keys.

A successful device connection to IoT Hub completes the authentication process and is also indicative of a proper setup. Every time a device connects, IoT Hub renegotiates the TLS session and verifies the device’s X.509 certificate.

## Revoke a device certificate

IoT Hub doesn't check certificate revocation lists from the certificate authority when authenticating devices with certificate-based authentication. If you have a device that needs to be blocked from connecting to IoT Hub because of a potentially compromised certificate, you should disable the device in the identity registry. For more information, see [Disable or delete a device in an IoT hub](./iot-hub-create-through-portal.md#disable-or-delete-a-device-in-an-iot-hub).

## Next Steps

Learn about [the value of X.509 CA authentication](iot-hub-x509ca-concept.md) in IoT.

Get started with [IoT Hub Device Provisioning Service](../iot-dps/index.yml).
