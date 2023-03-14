---
title: Tutorial - Use X.509 certificates with Azure IoT Hub | Microsoft Docs
description: Tutorial - Use X.509 certificates with Azure IoT Hub
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 01/09/2023
ms.author: kgremban
ms.custom: [mvc, 'Role: Cloud Development', 'Role: Data Analytics']
#Customer intent: As a developer, I want to be able to use X.509 certificates to authenticate devices to an IoT hub. This introductory article helps me decide which subsequent articles to read for my scenario.
---

# Tutorial: Use X.509 certificates to authenticate devices with Azure IoT Hub

You can use X.509 certificates to authenticate devices to an Azure IoT Hub.

This multi-part tutorial includes several articles that:

- Show you how to create X.509 certificates and certificate chains using [OpenSSL](https://www.openssl.org/). OpenSSL is an open-source tool that is used broadly across the industry for cryptography and to create X.509 certificates.

- Show you how to use utilities packaged with the Azure IoT SDKs that can help you quickly create test certificates to use with Azure IoT Hub. Many of these utilities wrap OpenSSL calls.

- Provide instructions for how to authenticate a device with IoT Hub using a certificate chain.

Depending on your familiarity with X.509 certificates and the stage of development of your IoT solution, one or more of the tutorials in this section may be helpful. This introductory article will help you choose the best path through the other articles in this tutorial for your scenario.

## X.509 certificate concepts

Before starting any of the articles in this tutorial, you should be familiar with X.509 certificates and X.509 certificate chains. The following articles can help bring you up to speed.

- To understand X.509 certificate chains and how they're used with IoT Hub, see [X.509 CA certificates for IoT Hub](iot-hub-x509ca-concept.md). Make sure you have a clear understanding of this article before you proceed.

- For an introduction to concepts that underlie the use of X.509 certificates, see [Understand public key cryptography and X.509 public key infrastructure](iot-hub-x509-certificate-concepts.md).

- For a quick review of the fields that can be present in an X.509 certificate, see the [Certificate fields](reference-x509-certificates.md#certificate-fields) section of [Understand X.509 public key certificates](reference-x509-certificates.md).

## X.509 certificate scenario paths

Using a CA-signed certificate chain backed by a PKI to authenticate a device provides the best level of security for your devices:

- In production, we recommend you get your X.509 CA certificates from a public root certificate authority. Purchasing a CA certificate has the benefit of the root CA acting as a trusted third party to vouch for the legitimacy of your devices. If you already have an X.509 CA certificate, and you know how to create and sign device certificates into a certificate chain, follow the instructions in [Tutorial: Upload and verify a CA certificate to IoT Hub](tutorial-x509-prove-possession.md) to upload your CA certificate to your IoT hub. Then, follow the instructions in [Tutorial: Test certificate authentication](tutorial-x509-test-certificate.md) to authenticate a device with your IoT hub.

- For testing purposes, we recommend using OpenSSL to create an X.509 certificate chain. OpenSSL is used widely across the industry to work with X.509 certificates. You can follow the steps in [Tutorial: Use OpenSSL to create test certificates](tutorial-x509-openssl.md) to create a root CA and intermediate CA certificate with which to create and sign device certificates. The tutorial also shows how to upload and verify a CA certificate. Then, follow the instructions in [Tutorial: Test certificate authentication](tutorial-x509-test-certificate.md) to authenticate a device with your IoT hub.

## Next steps

To learn more about the fields that make up an X.509 certificate, see [X.509 certificates](reference-x509-certificates.md).

If you're already familiar with X.509 certificates, and you want to generate test versions that you can use to authenticate to your IoT hub, see the following articles:

* [Tutorial: Use OpenSSL to create test certificates](tutorial-x509-openssl.md)
* If you want to use self-signed certificates for testing, see the [Create a self-signed certificate](reference-x509-certificates.md#create-a-self-signed-certificate) section of [X.509 certificates](reference-x509-certificates.md).

    >[!IMPORTANT]
    >We recommend that you use certificates signed by an issuing Certificate Authority (CA), even for testing purposes. Never use self-signed certificates in production.

If you have a root CA certificate or subordinate CA certificate and you want to upload it to your IoT hub, you must verify that you own that certificate. For more information, see [Tutorial: Upload and verify a CA certificate to IoT Hub](tutorial-x509-prove-possession.md).
