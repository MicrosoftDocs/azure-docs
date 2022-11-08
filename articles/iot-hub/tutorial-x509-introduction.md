---
title: Tutorial - Use X.509 certificates with Azure IoT Hub | Microsoft Docs
description: Tutorial - Use X.509 certificates with Azure IoT Hub
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 11/08/2022
ms.author: kgremban
ms.custom: [mvc, 'Role: Cloud Development', 'Role: Data Analytics']
#Customer intent: As a developer, I want to be able to use X.509 certificates to authenticate devices to an IoT hub. This introductory article helps me decide which subsequent articles to read for my scenario.
---

# Tutorial: Use X.509 certificates to authenticate devices with Azure IoT Hub

You can use X.509 certificates to authenticate devices to an Azure IoT Hub.

This multi-part tutorial includes several articles that:

- Show you how to create X.509 certificates and certificate chains using [OpenSSL](https://www.openssl.org/), an open-source tool used broadly across the industry for cryptography and to create X.509 certificates.

- Show you how to use utilities packaged with the Azure IoT SDKs that can help you quickly create test certificates to use with Azure IoT Hub. Many of these utilities wrap OpenSSL calls.

- Provide instructions for how to authenticate a device with IoT Hub using a certificate chain.

Depending on your familiarity with X.509 certificates and the stage of development of your IoT solution, one or more of the tutorials in this section may be helpful. This introductory article will help you choose the best path through the other articles in this tutorial for your scenario.

## X.509 certificate concepts

Before starting any of the articles in this tutorial, you should be familiar with X.509 certificates and X.509 certificate chains. The following articles can help bring you up to speed.

- To understand X.509 certificate chains and how they're used with IoT Hub, see [X.509 CA certificates for IoT Hub](iot-hub-x509ca-concept.md). Make sure you have a clear understanding of this article before you proceed.

- For an introduction to concepts that underlie the use of X.509 certificates, see [Understand Public Key Cryptography and X.509 Public Key Infrastructure](iot-hub-x509-certificate-concepts.md).

- For a quick review of the fields that can be present in an X.509 certificate, see [Certificate fields](tutorial-x509-certificates.md).

## X.509 certificate scenario paths

Using a self-signed certificate to authenticate a device provides a quick and easy way to test IoT hub features. Self-signed certificates shouldn't be used in production as they provide significantly less security than a certificate chain anchored with a CA-signed certificate backed by a PKI. To learn more about creating and using a self-signed X.509 certificate to authenticate with IoT Hub, see [Creating self-signed certificates](tutorial-x509-self-sign.md).

Using a CA-signed certificate chain backed by a PKI to authenticate a device provides the best level of security for your devices:

- In production, we recommend you get your X.509 CA certificates from a public root certificate authority. Purchasing a CA certificate has the benefit of the root CA acting as a trusted third party to vouch for the legitimacy of your devices. If you already have an X.509 CA certificate and know how to create certificates for your devices and sign them into a certificate chain, follow the instructions in [Upload and verify a CA certificate](/tutorial-x509-prove-possession.md) to upload your CA certificate to your IoT hub. Then follow the instructions in [Tutorial: Testing certificate authentication](tutorial-x509-test-certificate.md) to authenticate a device with your IoT hub.

- For testing purposes, we recommend using OpenSSL to create an X.509 certificate chain. OpenSSL is used widely across the industry to work with X.509 certificates. You can follow the steps in [Tutorial: Using OpenSSL to create test certificates](tutorial-x509-openssl.md) to create a Root CA and subordinate (intermediate) CA certificate and use these to sign device certificates. The tutorial also shows how to upload and verify a CA certificate. Then follow the instructions in [Tutorial: Testing certificate authentication](tutorial-x509-test-certificate.md) to authenticate a device with your IoT hub.

- Several of the Azure IoT SDKs provide convenience scripts to help you create test certificate chains. For instructions about how to create certificate chains in PowerShell or Bash using scripts provided in the Azure IoT C SDK, see [Tutorial: Using Microsoft-supplied scripts to create test certificates](tutorial-x509-scripts.md). The tutorial also shows how to upload and verify a CA certificate. Then follow the instructions in [Tutorial: Testing certificate authentication](tutorial-x509-test-certificate.md) to authenticate a device with your IoT hub.

## Next steps

To learn more about the fields that make up a certificate, see [Understanding X.509 Public Key Certificates](tutorial-x509-certificates.md).

If you already know a lot about X.509 certificates, and you want to generate test versions that you can use to authenticate to your IoT Hub, see the following topics:

* [Using Microsoft-Supplied Scripts to Create Test Certificates](tutorial-x509-scripts.md)
* [Using OpenSSL to Create Test Certificates](tutorial-x509-openssl.md)
* [Using OpenSSL to Create Self-Signed Test Certificates](tutorial-x509-self-sign.md)

If you have a certification authority (CA) certificate or subordinate CA certificate and you want to upload it to your IoT hub and prove that you own it, see [Upload and verify a CA Certificate](tutorial-x509-prove-possession.md).
