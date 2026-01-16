---
title: Key Concepts for Certificate Management (Preview)
titleSuffix: Azure IoT Hub
description: This article discusses the basic concepts of certificate management in Azure IoT Hub.
author: cwatson-cat
ms.author: cwatson
ms.service: azure-iot-hub
services: iot-hub
ms.topic: overview
ms.date: 10/20/2025
#Customer intent: As a developer new to IoT, I want to understand the fundamental concepts of certificate management in Azure IoT Hub, so that I can effectively implement secure device authentication in my IoT solutions.
---

# Key concepts for certificate management (preview)

Certificate management in Azure IoT Hub is designed to simplify the management of X.509 certificates for IoT devices. This article introduces the fundamental concepts related to certificate management and certificate-based authentication in IoT Hub. For more information, see [What is certificate management (preview)?](iot-hub-certificate-management-overview.md).

[!INCLUDE [public-preview-banner](includes/public-preview-banner.md)]

## Public key infrastructure (PKI)

PKI is a system that uses digital certificates to authenticate and encrypt data between devices and services. PKI certificates are essential for securing various scenarios, such as web and device identity. In IoT settings, managing PKI certificates can be challenging, costly, and complex, especially for organizations that have a large number of devices and strict security requirements. You can use certificate management to enhance the security of your devices and accelerate your digital transformation to a fully managed cloud PKI service. 

## Microsoft vs. third-party PKI

While IoT Hub supports two types of PKI providers for X.509 certificate authentication, certificate management currently only supports Microsoft-managed (first-party) PKI. For information about using third-party PKI providers, see [Authenticate devices with X.509 CA certificates](authenticate-authorize-x509.md).

| PKI provider | Integration required | Azure Device Registry required | Device Provisioning Service required |
|--------------|----------------------|-------------------| --------------|
| Microsoft-managed PKI | No. Configure certificate authorities directly in Azure Device Registry.| Yes | Yes |
| Third-party PKI (DigiCert, GlobalSign, etc.) | Yes. Manual integration required.  | No | No |

## X.509 certificates

An X.509 certificate is a digital document that binds a public key to the identity of an entity, such as a device, user, or service. Certificate-based authentication provides several advantages over less secure methods:

- Certificates use public/private key cryptography. The public key is shared freely, while the private key remains on the device and can reside inside Trusted Platform Modules (TPMs) or secure elements. This prevents attackers from impersonating the device.
- Certificates are issued and validated through a certificate authority (CA) hierarchy, allowing organizations to trust millions of devices through a single CA without managing secrets for each device.
- Devices authenticate to the cloud and the cloud authenticates to the device, enabling mutual Transport Layer Security (TLS) authentication.
- Certificates have defined validity periods and can be renewed or revoked centrally.

There are two general categories of X.509 certificates: 

- **CA certificates:** These certificates are issued by a Certificate Authority (CA), and you use them to sign other certificates. CA certificates include root and intermediate certificates. 
    
    - **Root CA:** A root certificate is a top-level, self-signed certificate from a trusted CA that can be used to sign intermediate CAs. 
    
    - **Intermediate or issuing CA:**  An intermediate certificate is a CA certificate that is signed by a trusted root certificate. Intermediate certificates can also be issuing CAs, provided they are used to sign end-entity certificates. 

    > [!NOTE]
    > It might be helpful to use different intermediate certificates for different sets or groups of devices, such as devices from different manufacturers or different models of devices. The reason to use different certificates is to reduce the total security impact if any particular certificate is compromised. 

- **End-entity certificates:** These certificates, which can be individual or leaf device certificates, are signed by CA certificates and are issued to users, servers, or devices. 

## Certificate signing request

A Certificate Signing Request (CSR) is a digitally signed message that a client, such as an IoT device, generates to request a signed certificate from a Certificate Authority (CA). The CSR includes the device’s public key and identifying information, like its registration ID, and is signed with the device’s private key to prove ownership of the key.

A CSR must follow the PKI’s policy requirements, including approved key algorithms, key sizes, and subject field formats. When a device generates a new private key, it also generates a new CSR. After the CA verifies and approves the CSR, it issues an X.509 certificate that binds the device’s identity to its public key. This process ensures that only devices able to demonstrate possession of their private key receive trusted certificates.

### Certificate signing request requirements in Device Provisioning Service

In certificate management, devices submit CSRs during provisioning or reprovisioning. Device Provisioning Service (DPS) expects CSRs in Base64-encoded distinguished encoding rules (DER) format, following the public key cryptography standards (PKCS) #10 specification. The submission excludes privacy-enhanced mail (PEM) headers and footers. The common name (CN) field in the CSR must match the device registration ID exactly.

## Authentication vs. authorization

- *Authentication* means proving identity to IoT Hub. It verifies that a user or device is who it claims to be. This process is often called *AuthN*.

- *Authorization* means confirming what an authenticated user or device can access or do in IoT Hub. It defines permissions for resources and commands. Authorization is sometimes called *AuthZ*.

X.509 certificates are only used for authentication in IoT Hub, not authorization. Unlike with [Microsoft Entra ID](authenticate-authorize-azure-ad.md) and [shared access signatures](authenticate-authorize-sas.md), you can't customize permissions with X.509 certificates.


