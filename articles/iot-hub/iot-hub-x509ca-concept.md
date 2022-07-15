---
title: Concepts of Azure IoT Hub X.509 security | Microsoft Docs
description: Concept - understanding the value X.509 certificate authority certificates in IoT device manufacturing, and authentication. 
author: eustacea
manager: arjmands
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 07/15/2022
ms.author: eustacea
---

# Understand how X.509 CA certificates are used in the IoT industry

This article describes the value of using X.509 certificate authority (CA) certificates in IoT device manufacturing and authentication.

An X.509 CA certificate is a digital certificate that can sign other certificates. This digital certificate is X.509 because it conforms to a certificate formatting standard prescribed by IETF's RFC 5280 standard, and is a certificate authority (CA) because its holder can sign other certificates.

[!INCLUDE [iot-hub-include-x509-ca-signed-support-note](../../includes/iot-hub-include-x509-ca-signed-support-note.md)]

## Benefits of X.509 CA certificate authentication

X.509 certificate authority (CA) authentication is an approach for authenticating devices to IoT Hub using a method that dramatically simplifies device identity creation and life-cycle management in the supply chain.

A distinguishing attribute of the X.509 CA authentication is the one-to-many relationship that a CA certificate has with its downstream devices. This relationship enables registration of any number of devices into IoT Hub by registering an X.509 CA certificate once. Otherwise, unique certificates would have to be pre-registered for every device before a device can connect. This one-to-many relationship also simplifies device certificates lifecycle management operations.

Another important attribute of the X.509 CA authentication is simplification of supply chain logistics. Secure authentication of devices requires that each device holds a unique secret like a key as the basis for trust. In certificate-based authentication, this secret is a private key. A typical device manufacturing flow involves multiple steps and custodians. Securely managing device private keys across multiple custodians and maintaining trust is difficult and expensive. Using certificate authorities solves this problem by signing each custodian into a cryptographic chain of trust rather than entrusting them with device private keys. Each custodian signs devices at their respective step of the manufacturing flow. The overall result is an optimal supply chain with built-in accountability through use of the cryptographic chain of trust. It is worth noting that this process yields the most security when devices protect their unique private keys. To this end, we recommend using Hardware Secure Modules (HSM) capable of internally generating private keys that will never see the light of day.

You can also use enrollment groups with the Azure IoT Hub Device Provisioning Service (DPS) to handle provisioning of devices to hubs. For more information, see [Tutorial: Provision multiple X.509 devices using enrollment groups](../iot-dps/tutorial-custom-hsm-enrollment-group-x509.md).

## Example scenario

The use of X.509 CA is best understood in relation to a concrete example. Consider Company-X, a maker of Smart-X-Widgets designed for professional installation. Company-X outsources both manufacturing and installation. It contracts manufacturer Factory-Y to manufacture the Smart-X-Widgets, and service provider Technician-Z to install them. Company-X wants the Smart-X-Widget shipped directly from Factory-Y to Technician-Z for installation and then for it to connect directly to Company-X's instance of IoT Hub. To make this happen, Company-X need to complete a few one-time setup operations to prime Smart-X-Widget for automatic connection. This article discusses the steps involved in that end-to-end scenario:

* Acquire the X.509 CA certificate

* Register the X.509 CA certificate to IoT Hub

* Sign devices into a certificate chain of trust

* Device connection

## Acquire the certificate

Company-X can either purchase an X.509 CA certificate from a public root certificate authority or create one through a self-signed process. For either option, the process entails two fundamental steps: generating a public/private key pair and signing the public key into a certificate.

![Flow for generating an X509CA certificates](./media/iot-hub-x509ca-concept/csr-flow.png)

Details on how to accomplish these steps differ with various service providers.

### Purchase a certificate

Purchasing a CA certificate has the benefit of having a well-known root CA act as a trusted third party to vouch for the legitimacy of IoT devices when the devices connect. Company-X would choose this option if they intend Smart-X-Widget to interact with third-party products or services.

To purchase an X.509 CA certificate, Company-X would choose a root certificates services provider. An internet search for the phrase 'Root CA' will yield good leads. The root CA will guide Company-X on how to create the public/private key pair and how to generate a certificate signing request (CSR) for their services. A CSR is the formal process of applying for a certificate from a certificate authority. The outcome of this purchase is a certificate for use as an authority certificate. Given the ubiquity of X.509 certificates, the certificate is likely to have been properly formatted to IETF's RFC 5280 standard.

### Creating a self-signed certificate

The process to create a self-signed X.509 CA certificate is similar to purchasing one, with the exception of not involving a third-party signer like the root certificate authority. In our example, Company-X will sign its authority certificate instead of a root certificate authority. Company-X may choose this option for testing until they're ready to purchase an authority certificate. Company-X may also use a self-signed X.509 CA certificate in production if Smart-X-Widget is not intended to connect to any third-party services outside of the IoT Hub.

## Register the certificate to IoT Hub

Company-X needs to register the X.509 CA to IoT Hub where it will serve to authenticate Smart-X-Widgets as they connect. This is a one-time process that enables the ability to authenticate and manage any number of Smart-X-Widget devices. This is a one-time process because of the one-to-many relationship between CA certificate and device certificates that are signed by the CA certificate or an intermediate certificate. This relationship constitutes one of the main advantages of using the X.509 CA authentication method. The alternative is to upload individual certificate thumbprints for each and every Smart-X-Widget device thereby adding to operational costs.

Registering the X.509 CA certificate is a two-step process: upload the certificate then provide proof-of-possession.

![Registering an X509CA certificate](./media/iot-hub-x509ca-concept/pop-flow.png)

### Certificate upload

The X.509 CA certificate upload process is just that, upload the CA certificate to IoT Hub. IoT Hub expects the certificate in a file. Company-X simply uploads the certificate file. The certificate file must not under any circumstances contain any private keys. Best practices from standards governing Public Key Infrastructure (PKI) mandates that knowledge of Company-X's private key resides exclusively within Company-X.

### Proof-of-possession

The X.509 CA certificate, just like any digital certificate, is public information that is susceptible to eavesdropping. As such, an eavesdropper may intercept a certificate and try to upload it as their own. In our example, IoT Hub would like to make sure that the CA certificate Company-X is uploading really belongs to Company-X. It does so by challenging Company-X to prove that they in fact possess the certificate through a [proof-of-possession (PoP) flow](https://tools.ietf.org/html/rfc5280#section-3.1). The proof-of-possession flow entails IoT Hub generating a random number to be signed by Company-X using its private key. If Company-X followed PKI best practices and protected their private key, then only they would be in position to correctly respond to the proof-of-possession challenge. IoT Hub proceeds to register the X.509 CA certificate upon a successful response of the proof-of-possession challenge.

A successful response to the proof-of-possession challenge from IoT Hub completes the X.509 CA registration.

## Sign devices into a certificate chain of trust

IoT requires a unique identity for every device that connects. When using certificate-based authentication, these identities are in the form of certificates. In our example, this means that every Smart-X-Widget must possess a unique device certificate.

One way to provide unique certificates on each device is to pre-generate certificates for Smart-X-Widgets and to trust supply chain partners with the corresponding private keys. For Company-X, this means entrusting both Factory-Y and Technician-Z. While this is a valid method, it comes with challenges that must be overcome to ensure trust as follows:

1. Having to share device private keys with supply chain partners, besides ignoring PKI best practices of never sharing private keys, makes building trust in the supply chain expensive. It means systems like secure rooms to house device private keys and processes like periodic security audits. Both add cost to the supply chain.

2. Securely accounting for devices in the supply chain, and later managing them in deployment, becomes a one-to-one task for every key-to-device pair from the point of device unique certificate (and private key) generation to device retirement. This precludes group management of devices unless the concept of groups is explicitly built into the process somehow. Secure accounting and device life-cycle management, therefore, becomes a heavy operations burden. In our example, Company-X would bear this burden.

X.509 CA certificate authentication offers elegant solutions to these challenges through the use of certificate chains. A certificate chain results from a CA signing an intermediate CA that in turn signs another intermediate CA and so goes on until a final intermediate CA signs a device. In our example, Company-X signs Factory-Y, which in turn signs Technician-Z that finally signs Smart-X-Widget. 

![Certificate chain hierarchy](./media/iot-hub-x509ca-concept/cert-chain-hierarchy.png)

This cascade of certificates in the chain represents the logical hand-off of authority. Many supply chains follow this logical hand-off whereby each intermediate CA gets signed into the chain while receiving all upstream CA certificates, and the last intermediate CA finally signs each device and injects all the authority certificates from the chain into the device. This is common when the contracted manufacturing company with a hierarchy of factories commissions a particular factory to do the manufacturing. While the hierarchy may be several levels deep (for example, by geography/product type/manufacturing line), only the factory at the end gets to interact with the device but the chain is maintained from the top of the hierarchy.

Alternate chains may have different intermediate CAs interact with the device in which case the CA interacting with the device injects certificate chain content at that point. Hybrid models are also possible where only some of the CA has physical interaction with the device.

In our example, both Factory-Y and Technician-Z interact with the Smart-X-Widget. While Company-X owns Smart-X-Widget, it actually does not physically interact with it in the entire supply chain. The certificate chain of trust for Smart-X-Widget therefore comprises Company-X signing Factory-Y which in turn signs Technician-Z that will then provide final signature to Smart-X-Widget. The manufacture and installation of Smart-X-Widget comprise Factory-Y and Technician-Z using their respective intermediate CA certificates to sign each and every Smart-X-Widget. The end result of this entire process is Smart-X-Widgets that have their own unique device certificates and also all of the certificates in their chain going up to Company-X CA certificate.

![Chain of trust from the certs of one company to the certs of another company](./media/iot-hub-x509ca-concept/cert-mfr-chain.png)

The CA method of authentication infuses secure accountability into the device manufacturing supply chain. Because of the certificate chain process, the actions of every member in the chain is cryptographically recorded and verifiable.

This process relies on certain assumptions that must be surfaced for completeness. It requires independent creation of device unique public/private key pair and that the private key be protected within the device. Fortunately, secure silicon chips in the form of Hardware Secure Modules (HSM) capable of internally generating keys and protecting private keys exist. Company-X only need to add one of such chips into Smart-X-Widget's component bill of materials.

## Device Connection

Once the CA certificate is registered to IoT Hub and the devices have their unique certificates, how do they connect? By simply registering an X.509 CA certificate to IoT Hub one time, how do potentially millions of devices connect and get authenticated from the first time? Simple; through the same certificate upload and proof-of-possession flow we earlier encountered with registering the X.509 CA certificate.

Devices manufactured for X.509 CA authentication are equipped with unique device certificates and a certificate chain from their respective manufacturing supply chain. Device connection, even for the very first time, happens in a two-step process: certificate chain upload and proof-of-possession.

During the certificate chain upload, the device uploads its unique certificate together with the certificate chain installed within it to IoT Hub. Using the pre-registered X.509 CA certificate, IoT Hub can cryptographically validate that the uploaded certificate chain is internally consistent and that the chain was originated by the valid owner of the X.509 CA certificate. Just as with the X.509 CA registration process, IoT Hub uses a proof-of-possession challenge-response process to ascertain that the chain and therefore the device certificate actually belongs to the device uploading it. It does so by generating a random challenge to be signed by the device using its private key for validation by IoT Hub. A successful response triggers IoT Hub to accept the device as authentic and grant it connection.

In our example, each Smart-X-Widget would upload its device unique certificate together with Factory-Y and Technician-Z X.509 CA certificates and then respond to the proof-of-possession challenge from IoT Hub.

![Flow from one cert to another, pop challenge from hub](./media/iot-hub-x509ca-concept/device-pop-flow.png)

The foundation of trust rests in protecting private keys, including device private keys. We therefore cannot stress enough the importance of secure silicon chips in the form of Hardware Secure Modules (HSM) for protecting device private keys, and the overall best practice of never sharing any private keys, like one factory entrusting another with its private key.
