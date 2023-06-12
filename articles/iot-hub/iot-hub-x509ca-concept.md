---
title: Concepts of Azure IoT Hub X.509 security | Microsoft Docs
description: Concept - understanding the value X.509 certificate authority certificates in IoT device manufacturing, and authentication. 
author: eustacea
manager: arjmands
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 08/26/2022
ms.author: eustacea
---

# Understand how X.509 CA certificates are used in IoT

This article describes the value of using X.509 certificate authority (CA) certificates in IoT device manufacturing and authentication.

An X.509 CA certificate is a digital certificate that can sign other certificates. A digital certificate is considered an X.509 certificate if it conforms to the certificate formatting standard prescribed by IETF's RFC 5280 standard. A certificate authority (CA) means that its holder can sign other certificates.

[!INCLUDE [iot-hub-include-x509-ca-signed-support-note](../../includes/iot-hub-include-x509-ca-signed-support-note.md)]

## Benefits of X.509 CA certificate authentication

X.509 certificate authority (CA) authentication is an approach for authenticating devices to IoT Hub using a method that dramatically simplifies device identity creation and life-cycle management in the supply chain.

A distinguishing attribute of X.509 CA authentication is the one-to-many relationship that a CA certificate has with its downstream devices. This relationship enables registration of any number of devices into IoT Hub by registering an X.509 CA certificate once. Otherwise, unique certificates would have to be pre-registered for every device before a device can connect. This one-to-many relationship also simplifies device certificates lifecycle management operations.

Another important attribute of X.509 CA authentication is simplification of supply chain logistics. Secure authentication of devices requires that each device holds a unique secret like a key as the basis for trust. In certificate-based authentication, this secret is a private key. A typical device manufacturing flow involves multiple steps and custodians. Securely managing device private keys across multiple custodians and maintaining trust is difficult and expensive. Using certificate authorities solves this problem by signing each custodian into a cryptographic chain of trust rather than entrusting them with device private keys. Each custodian signs devices at their respective step of the manufacturing flow. The overall result is an optimal supply chain with built-in accountability through use of the cryptographic chain of trust.

This process yields the most security when devices protect their unique private keys. To this end, we recommend using Hardware Secure Modules (HSM) capable of internally generating private keys.

The Azure IoT Hub Device Provisioning Service (DPS) makes it easy to provision groups of devices to hubs. For more information, see [Tutorial: Provision multiple X.509 devices using enrollment groups](../iot-dps/tutorial-custom-hsm-enrollment-group-x509.md).

## Example scenario

Company-X makes Smart-X-Widgets that are designed for professional installation. Company-X outsources both manufacturing and installation. Factory-Y manufactures the Smart-X-Widgets and Technician-Z installs them. Company-X wants the Smart-X-Widget shipped directly from Factory-Y to Technician-Z for installation and then for it to connect directly to Company-X's instance of IoT Hub. To make this happen, Company-X need to complete a few one-time setup operations to prime Smart-X-Widget for automatic connection. This article discusses the steps involved in that end-to-end scenario:

1. Acquire the X.509 CA certificate

2. Register the X.509 CA certificate to IoT Hub

3. Sign devices into a certificate chain of trust

4. Connect the devices

## Acquire the certificate

Company-X can either purchase an X.509 CA certificate from a public root certificate authority or create one through a self-signed process. Either option entails two basic steps: generating a public/private key pair and signing the public key into a certificate.

Details on how to accomplish these steps differ with various service providers.

:::image type="content" source="./media/iot-hub-x509ca-concept/csr-flow.png" alt-text="Diagram showing the flow for generating an X.509 CA certificate." lightbox="./media/iot-hub-x509ca-concept/csr-flow.png":::

### Purchasing a certificate

Purchasing a CA certificate has the benefit of having a well-known root CA act as a trusted third party to vouch for the legitimacy of IoT devices when the devices connect. Choose this option if your devices will interact with third-party products or services.

To purchase an X.509 CA certificate, choose a root certificate service provider. An internet search for the phrase 'Root CA' will yield good leads. The root CA provider will guide you on how to create the public/private key pair and how to generate a certificate signing request (CSR) for their services. A CSR is the formal process of applying for a certificate from a certificate authority. The outcome of this purchase is a certificate for use as an authority certificate. Given the ubiquity of X.509 certificates, the certificate is likely to have been properly formatted to IETF's RFC 5280 standard.

### Creating a self-signed certificate

The process to create a self-signed X.509 CA certificate is similar to purchasing one, except that it doesn't involve a third-party signer like the root certificate authority. In our example, Company-X would sign its authority certificate instead of a root certificate authority.

You might choose this option for testing until you're ready to purchase an authority certificate. You could also use a self-signed X.509 CA certificate in production if your devices won't connect to any third-party services outside of IoT Hub.

## Register the certificate to IoT Hub

Company-X needs to register the X.509 CA to IoT Hub where it will serve to authenticate Smart-X-Widgets as they connect. This one-time process enables the ability to authenticate and manage any number of Smart-X-Widget devices. This is a one-time process because of the one-to-many relationship between CA certificate and device certificates that are signed by the CA certificate or an intermediate certificate. This relationship is one of the main advantages of using the X.509 CA authentication method. The alternative would be to upload individual certificate thumbprints for each and every Smart-X-Widget device, thereby adding to operational costs.

Registering the X.509 CA certificate is a two-step process: upload the certificate then provide proof-of-possession.

:::image type="content" source="./media/iot-hub-x509ca-concept/pop-flow.png" alt-text="Diagram showing the process flow for registering an X.509 CA certificate." lightbox="./media/iot-hub-x509ca-concept/pop-flow.png":::

### Certificate upload

The X.509 CA certificate upload process is just that: uploading the CA certificate to IoT Hub. IoT Hub expects the certificate in a file.

The certificate file must not under any circumstances contain any private keys. Best practices from standards governing Public Key Infrastructure (PKI) mandates that knowledge of Company-X's private key resides exclusively within Company-X.

### Proof of possession

The X.509 CA certificate, just like any digital certificate, is public information that is susceptible to eavesdropping. As such, an eavesdropper may intercept a certificate and try to upload it as their own. In our example, IoT Hub has to make sure that the CA certificate Company-X uploaded really belongs to Company-X. It does so by challenging Company-X to prove that they possess the certificate through a [proof-of-possession (PoP) flow](https://tools.ietf.org/html/rfc5280#section-3.1).

For the proof-of-possession flow, IoT Hub generates a random number to be signed by Company-X using its private key. If Company-X followed PKI best practices and protected their private key, then only they would be able to correctly respond to the proof-of-possession challenge. IoT Hub proceeds to register the X.509 CA certificate upon a successful response of the proof-of-possession challenge.

A successful response to the proof-of-possession challenge from IoT Hub completes the X.509 CA registration.

## Sign devices into a certificate chain of trust

IoT requires a unique identity for every device that connects. For certificate-based authentication, these identities are in the form of certificates. In our example, certificate-based authentication means that every Smart-X-Widget must possess a unique device certificate.

One way to provide unique certificates on each device is to pre-generate certificates for Smart-X-Widgets and to trust supply chain partners with the corresponding private keys. For Company-X, this means entrusting both Factory-Y and Technician-Z. While this is a valid method, it comes with challenges that must be overcome to ensure trust, as follows:

* Having to share device private keys with supply chain partners, besides ignoring PKI best practices of never sharing private keys, makes building trust in the supply chain expensive. It requires systems like secure rooms to house device private keys and processes like periodic security audits. Both add cost to the supply chain.

* Securely accounting for devices in the supply chain, and later managing them in deployment, becomes a one-to-one task for every key-to-device pair from the point of device unique certificate (and private key) generation to device retirement. This precludes group management of devices unless the concept of groups is explicitly built into the process somehow. Secure accounting and device life-cycle management, therefore, becomes a heavy operations burden.

X.509 CA certificate authentication offers elegant solutions to these challenges by using certificate chains. A certificate chain results from a CA signing an intermediate CA that in turn signs another intermediate CA, and so on, until a final intermediate CA signs a device. In our example, Company-X signs Factory-Y, which in turn signs Technician-Z that finally signs Smart-X-Widget.

:::image type="content" source="./media/iot-hub-x509ca-concept/cert-chain-hierarchy.png" alt-text="Diagram showing an example of a certificate chain hierarchy." lightbox="./media/iot-hub-x509ca-concept/cert-chain-hierarchy.png":::

This cascade of certificates in the chain represents the logical hand-off of authority. Many supply chains follow this logical hand-off whereby each intermediate CA gets signed into the chain while receiving all upstream CA certificates, and the last intermediate CA finally signs each device and injects all the authority certificates from the chain into the device. This is common when the contracted manufacturing company with a hierarchy of factories commissions a particular factory to do the manufacturing. While the hierarchy may be several levels deep (for example, by geography/product type/manufacturing line), only the factory at the end gets to interact with the device but the chain is maintained from the top of the hierarchy.

Alternate chains may have different intermediate CAs interact with the device in which case the CA interacting with the device injects certificate chain content at that point. Hybrid models are also possible where only some of the CA has physical interaction with the device.

The following diagram shows how the certificate chain of trust comes together in our Smart-X-Widget example.

:::image type="content" source="./media/iot-hub-x509ca-concept/cert-mfr-chain.png" alt-text="Diagram showing the certificate chain of trust from the certificates of one company to the certificates of another company." lightbox="./media/iot-hub-x509ca-concept/cert-mfr-chain.png":::

1. Company-X never physically interacts with any of the Smart-X-Widgets. It initiates the certificate chain of trust by signing Factory-Y's intermediate CA certificate.
1. Factory-Y now has its own intermediate CA certificate and a signature from Company-X. It passes copies of these items to the device. It also uses its intermediate CA certificate to sign Technician-Z's intermediate CA certificate and the Smart-X-Widget device certificate.
1. Technician-Z now has its own intermediate CA certificate and a signature from Factory-Y. It passes copies of these items to the device. It also uses its intermediate CA certificate to sign the Smart-X-Widget device certificate.
1. Every Smart-X-Widget device now has its own unique device certificate and copies of the public keys and signatures from each intermediate CA certificate that it interacted with throughout the supply chain. These certificates and signatures can be traced back to the original Company-X root.

The CA method of authentication infuses secure accountability into the device manufacturing supply chain. Because of the certificate chain process, the actions of every member in the chain are cryptographically recorded and verifiable.

This process relies on the assumption that the unique device public/private key pair is created independently and that the private key is protected within the device always. Fortunately, secure silicon chips exist in the form of Hardware Secure Modules (HSM) that are capable of internally generating keys and protecting private keys. Company-X only needs to add one such secure chip into Smart-X-Widget's component bill of materials.

## Device connection

Once the top level CA certificate is registered to IoT Hub and the devices have their unique certificates, how do they connect? By registering an X.509 CA certificate to IoT Hub one time, how do potentially millions of devices connect and get authenticated from the first time? Through the same certificate upload and proof-of-possession flow we earlier encountered with registering the X.509 CA certificate.

Devices manufactured for X.509 CA authentication are equipped with unique device certificates and a certificate chain from their respective manufacturing supply chain. Device connection, even for the first time, happens in a two-step process: certificate chain upload and proof-of-possession.

During the certificate chain upload, the device uploads its unique certificate and its certificate chain to IoT Hub. Using the pre-registered X.509 CA certificate, IoT Hub validates that the uploaded certificate chain is internally consistent and that the chain was originated by the valid owner of the X.509 CA certificate. As with the X.509 CA registration process, IoT Hub uses a proof-of-possession challenge-response process to ascertain that the chain, and therefore the device certificate, belongs to the device uploading it. A successful response triggers IoT Hub to accept the device as authentic and grant it connection.

In our example, each Smart-X-Widget would upload its device unique certificate together with Factory-Y and Technician-Z X.509 CA certificates and then respond to the proof-of-possession challenge from IoT Hub.

:::image type="content" source="./media/iot-hub-x509ca-concept/device-pop-flow.png" alt-text="Diagram showing the flow for validating a device certificate." lightbox="./media/iot-hub-x509ca-concept/device-pop-flow.png":::

The foundation of trust rests in protecting private keys, including device private keys. We therefore can't stress enough the importance of secure silicon chips in the form of Hardware Secure Modules (HSM) for protecting device private keys, and the overall best practice of never sharing any private keys, like one factory entrusting another with its private key.

## Next steps

Use the Device Provisioning Service to [Provision multiple X.509 devices using enrollment groups](../iot-dps/tutorial-custom-hsm-enrollment-group-x509.md).
