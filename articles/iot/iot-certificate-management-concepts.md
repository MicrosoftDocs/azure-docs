---
title: Key Concepts for Certificate Management (preview)
titleSuffix: Azure Device Registry
description: This article discusses the basic concepts of certificate management in Azure IoT Hub.
author: sethmanheim
ms.author: sethm
ms.service: azure-device-registry
ms.topic: overview
ms.date: 09/17/2026

#Customer intent: As a developer new to IoT, I want to understand the fundamental concepts of certificate management in Azure Device Registry, so that I can effectively implement secure device authentication in my IoT solutions.
---

# Key concepts for certificate management (preview)

Certificate management in Azure Device Registry simplifies the management of X.509 certificates for IoT devices. This article introduces the fundamental concepts related to certificate management and certificate-based authentication. For more information, see [What is certificate management (preview)?](iot-certificate-management-overview.md)

[!INCLUDE [iot-hub-public-preview-banner](../iot-hub/includes/public-preview-banner.md)]

## Cloud public key infrastructure (PKI)

Public Key Infrastructure (PKI) is the framework of certificate authorities, cryptographic keys, policies, and processes used to issue, manage, renew, and revoke digital certificates. Certificates are essential for securing various scenarios, such as web and device identity.  Historically, organizations build and operate their own PKI environment, which often includes hardware security modules (HSMs), certificate authority software, and operational procedures that can be particularly complex for IoT fleets.

A cloud PKI provides the same certificate authority capabilities as traditional PKI but delivers them as a managed cloud service. Instead of deploying and operating the PKI infrastructure themselves, organizations consume certificate services through cloud-managed APIs, lifecycle workflows, and automated operations. You can use certificate management in Azure Device Registry to enhance the security of your devices and accelerate your digital transformation to a fully managed cloud PKI service. 

## Microsoft cloud PKI vs. third-party PKI

While IoT Hub supports two types of PKI providers for X.509 certificate authentication, certificate management in Azure Device Registry currently only supports Microsoft cloud PKI and bring your own CA. For information about using third-party PKI providers, see [Authenticate devices with X.509 CA certificates](../iot-hub/authenticate-authorize-x509.md).

| PKI provider | Integration required | Azure Device Registry required | Device Provisioning Service required |
|--------------|----------------------|-------------------| --------------|
| Microsoft cloud PKI | Configure certificate authorities directly in Azure Device Registry or bring your own CA.| Yes | Yes |
| Third-party PKI (DigiCert, GlobalSign, etc.) | Yes. Manual integration required.  | No | No |

Each namespace receives its own logically isolated cloud PKI environment, ensuring certificate operations are restricted to resources within that namespace.  Customers don't manage the cloud PKI as a separate Azure resource. Instead, the cloud PKI is automatically provisioned, scoped, and managed as part of an Azure Device Registry namespace.

## X.509 certificates

An X.509 certificate is a digital document that binds a public key to the identity of an entity, such as a device, user, or service. Certificate-based authentication provides several advantages over less secure methods:

- Certificates use public/private key cryptography. The public key is shared freely, while the private key remains on the device and can reside inside Trusted Platform Modules (TPMs) or secure elements. This prevents attackers from impersonating the device.
- Certificates are issued and validated through a certificate authority (CA) hierarchy, allowing organizations to trust millions of devices through a single CA without managing secrets for each device.
- Devices authenticate to the cloud and the cloud authenticates to the device, enabling mutual Transport Layer Security (mTLS) authentication.

#### Types of certificates

There are two general categories of X.509 certificates: 

- **CA certificates:** These certificates are issued by a Certificate Authority (CA), and you use them to sign other certificates. CA certificates include root and intermediate certificates. 

  - **Root CA:** A root certificate is a top-level, self-signed certificate from a trusted CA that can be used to sign intermediate CAs. 
    
  - **Intermediate or issuing CA:**  An intermediate certificate is a CA certificate that a trusted root certificate signs. It might be helpful to use different intermediate certificates for different sets or groups of devices, such as devices from different manufacturers or different models of devices. 
    
- **End-entity certificates or device certificates:** CA certificates sign these certificates, which can be individual or device certificates. The CA then issues them to users, servers, or devices.

### Certificate lifecycle operations

Certificate management supports the full lifecycle of certificate authorities and device certificates. Understanding the different lifecycle operations helps ensure devices maintain secure, uninterrupted connectivity throughout their operational lifetime.

- **Issuance**: The process of generating and signing a new certificate for a certificate authority or device. This process starts with a certificate signing request.

- **Renewal**: The process of extending a device certificate's validity by issuing a replacement certificate before the current certificate expires. Device certificates can be renewed without requiring the device to be reprovisioned.

- **Rotation**: The process of replacing a certificate authority with a new certificate authority while preserving the trust relationship. Rotation is commonly performed when an intermediate CA approaches expiration or when cryptographic requirements change.

- **Revocation**: The process of invalidating a certificate before its expiration date if it's no longer trusted, compromised, or no longer authorized for use.

- **Expiration**: The end of a certificate's validity period. Certificates that have expired can no longer be used for authentication and must be renewed or replaced.

### Certificate signing request

A Certificate Signing Request (CSR) is a digitally signed message that a client, such as an IoT device, generates to request a signed certificate from a Certificate Authority (CA). The CSR includes the device's public key and identifying information, like its registration ID, and is signed with the device's private key to prove ownership of the key. A CSR must follow the PKI's policy requirements, including approved key algorithms, key sizes, and subject field formats. When a device generates a new private key, it also generates a new CSR. After the CA verifies and approves the CSR, it issues an X.509 certificate that binds the device's identity to its public key. This process ensures that only devices able to demonstrate possession of their private key receive trusted certificates.

For more information on certificate signing request requirements in Azure Device Registry, see [Certificate issuance in Azure Device Registry](concept-certificate-issuance.md).

### Certificate authority rotations

Certificate authority rotation is the scheduled or emergency process of replacing an existing root or intermediate CA certificate with a new one before the old certificate expires or becomes compromised. Because the CA is the trust anchor and signs all downstream certificates, replacing it updates the cryptographic foundation of every device. 

In Azure Device Registry, certificate authorities are automatically rotated before expiry:

1. __New CA Generation:__ Before a CA expires, ADR automatically provisions a replacement CA. This step initiates a transition period where IoT services trust both the old and new CAs. Device certificates that ADR issues can't have an expiry date later than the expiry date of their intermediate CA, so you never need to worry about ghost certificates.

1. __Device Certificate Renewal:__ During this window, the device should migrate to use its replacement CA. Devices can simply request a new certificate as per the device's regularly scheduled certificate renewal process. ADR automatically forwards device certificate signing requests to the new intermediate CA.

1. __Old CA Deprecation:__ Once the transition window closes, ADR retires the old CA. Any device that doesn't retrieve a new certificate fails the mutual TLS (mTLS) and loses connectivity. These devices can request a new certificate to connect to IoT Hub.

## Cryptographic algorithms and key types

Certificates use public key cryptography to establish trust between devices and services. Each certificate contains a public key and is signed by a certificate authority (CA) using a cryptographic signing algorithm. The strength, performance, and compatibility of a certificate depend on the key algorithm, key size, and hashing algorithm you use during certificate creation and signing.

#### Key algorithms

Certificate management uses asymmetric cryptography to establish trusted digital identities. In asymmetric cryptography, a mathematically related public and private key pair is used for authentication, digital signatures, and encryption. The choice of cryptographic algorithm influences security strength, performance characteristics, interoperability, and resource requirements. Certificate management in Azure Device Registry uses Elliptic Curve Cryptography (ECC) to sign certificates.

#### Key size and key curve

The key size or key curve determines the cryptographic strength of a certificate's public/private key pair. Larger key sizes or stronger curves generally provide greater cryptographic strength, but can also affect certificate size, processing requirements, and performance. For example, certificate management in Azure Device Registry issues ECC certificates using the P-384 curve.

#### Hashing algorithms

Certificate authorities use cryptographic hash functions when signing certificates. A hash function generates a fixed-length digest of certificate contents, which the issuing CA then digitally signs. Hashing algorithms help ensure certificate integrity, tamper detection, trust chain validation, and digital signature verification. Certificate management in Azure Device Registry uses SHA-384.

#### Digital signatures

When a certificate authority issues a certificate, it digitally signs the certificate by using its private key and chosen signing algorithm.

During certificate validation:

1. The certificate's hash is recalculated.

1. The CA's public key verifies the digital signature.

1. The certificate chain is validated up to a trusted root CA.

If you modify any certificate in the chain, signature validation fails and the certificate can't be trusted.

## Hardware-protected keys vs. software-protected keys

Certificate Authorities (CAs) rely on private keys to issue and sign certificates. The security of a CA depends heavily on how you generate, store, and use these private keys.

**Software-protected keys** are stored in software and rely on operating system protections to prevent unauthorized access. While simpler to deploy, software keys are generally more vulnerable to compromise through malware, credential theft, misconfiguration, or unauthorized administrative access.

**Hardware-protected keys** are generated and stored within a Hardware Security Module (HSM), a dedicated cryptographic device designed to protect sensitive key material. Private keys stored in an HSM never leave the hardware boundary, and all cryptographic signing operations are performed within the device. This significantly reduces the risk of key exposure and helps organizations meet stringent security and compliance requirements.

Azure Device Registry uses **hardware-protected keys** for certificate authorities. Certificate Authority private keys are protected by using [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview), ensuring that signing operations occur within a FIPS-validated hardware security boundary and that private key material can't be exported.

## Online CAs vs. offline CAs

You can also classify Certificate Authorities by their network accessibility and operational model.

An **offline CA** stays disconnected from production networks for most of its lifetime. Use offline CAs as high-assurance root CAs because the private key is isolated from network-based threats. Administrative actions typically require manual processes, making offline CAs highly secure but operationally intensive.

An **online CA** connects to a network and can automatically perform certificate issuance, renewal, and lifecycle operations. Online CAs enable scalable certificate management and automation but require strong controls to protect signing keys and CA infrastructure.

Azure Device Registry uses **online certificate authorities** to support automated certificate issuance, renewal, revocation, and rotation at cloud scale. Azure Managed HSM protects these online CAs by using hardware-backed key storage, combining the operational benefits of online CAs with strong key protection controls. Customers who use the **Bring Your Own CA (BYOCA)** trust model commonly maintain their root CA offline and use it only to establish trust for online issuing certificate authorities. This approach combines the security benefits of an offline trust anchor with the scalability of cloud-managed online CAs.

## Authentication vs. authorization

- *Authentication* means proving identity to IoT Hub. It verifies that a user or device is who it claims to be. This process is often called *AuthN*.

- *Authorization* means confirming what an authenticated user or device can access or do in IoT Hub. It defines permissions for resources and commands. Authorization is sometimes called *AuthZ*.

IoT Hub uses X.509 certificates only for authentication, not authorization. Unlike [Microsoft Entra ID](../iot-hub/authenticate-authorize-azure-ad.md) and [shared access signatures](../iot-hub/authenticate-authorize-sas.md), X.509 certificates don't support customizable permissions.

## Related content

- [Deploy Azure IoT Hub with ADR integration and certificate management](../iot-hub/iot-hub-device-registry-setup.md)
- [What is Microsoft-backed X.509 certificate management?](iot-certificate-management-overview.md)

- [Integration with Azure Device Registry](../iot-hub/iot-hub-device-registry-overview.md)
