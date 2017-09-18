---
title: Understand Azure IoT Hub security | Microsoft Docs
description: Overview - how to authenticate devices to IoT Hub using X.509 Certificate Authorities. 
services: iot-hub
documentationcenter: .net
author: eustacea
manager: arjmands
editor: ''

ms.assetid: 
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/18/2017
ms.author: eustacea

---
# Device Authentication using X.509 Certificate Authorities

This article describes how to use X.509 certificate authorities to authenticate devices to IoT Hub.  It includes information for supply chain setup for this method of authentication. 

This article describes:

* xx.
* yy.
* How to scope credentials to limit access to specific resources.
* IoT Hub support for X.509 certificates.
* Custom device authentication mechanisms that use existing device identity registries or authentication schemes.

### Overview

The X.509 Certificate Authority (CA) feature offers a way to mutually authenticate devices as they connect to IoT Hub. It has the benefit of simplifying supply chain logistics as well as post deployment device certificates management.

A distinguishing attribute of the X.509 CA mutual authentication method is a one-to-many relationship a CA certificate has with it's downstream devices.  This relationship enables autotomatic registration of any number of devices into IoT Hub by simply registring an X.509 CA certificate once.  This process would otherwise require pre-registration of device authentication information for each and every device before it ever connects. The benefit of this one-to-many relationship between X.509 CA certificate and devices flows through to device certificates management operations.

Another important attribute of the X.509 CA feature is simplication of supply chain logistics.  Secure authentication of devices requires that each device holds a unique secret like a key as basis for trust. In certificates based authentication, this secret is a private key. A typical device manufacturing flow involves multiple steps and custodians.  Securely managing device private keys across multiple custodians and maintaining trust is difficult and expensive.  Using certificate authorities solves this problem by signing each custodian into a crypgographic chain of trust rather than entrusting them with device private keys.  Each custodian in turn signs devices at their respective process step of the manufacutring flow.  The overall result is an optimal supply chain with built-in accountability through use of the crypgographic chain of trust.  It is worth mentioning that this process yields the most security when devices protect their unique private keys.  We therefore recommend use of Hardware Secure Modules (HSM) capable of internally generating private keys that will never see the light of day.

### How to setup and use X.509 CA Authentication

Setting up and using X.509 CA device authentication entails four steps:

* Purchase or create an X.509 CA certificate

* Register X.509 CA certificate to IoT Hub

* Sign devices into a certificate chain of trust

* Device connection

### Prerequisite

Using the X.509 CA feature requires an IoT Hub account.  Learn how to create one if you don't already have it <<todo: link how to create IoT Hub document>> 

## Purchase or create an X.509 CA certificate

The X.509 CA certificate is at the top of your IoT devices certificate chain.  You may elect to purchase or create your own CA certificate.

You can purchase an X.509 CA certificate from a public root certificate authority. Purchasing a CA certificate has the benefit of the root CA acting as a trusted third party to vouch for the legitimacy of your devices. Consider this option if you intend your devices to be part of an open IoT network where they are expected to interact with third party products or services.

You can create a self-signed X.509 CA for experimentation or for use in closed IoT networks.

Regardless of how you obtain your X.509 CA certifcate, make sure to keep it's corresponding private key secret and protected at all times.

Learn how to create a self-signed CA certificate which you can use for experimentation throughout this feature description. <<todo: link to tutorial on creating CA cert>>

## Register X.509 certificate to IoT Hub

Register your X.509 CA certificate to IoT Hub where it will be used to authenticate your devices for registration and connection.  This is a two-step process that comprise certificate file upload and proof of possesion.

The upload process entails uploading a file that contains your certificate.  This file should never contain any private keys.

The proof of possession step involves a cryptographic challenge and response process between you and IoT Hub.  Given that digital certificate contents are public and therefore susceptible to eavesdropping, IoT Hub would like to ascertain that you really own the CA certificate.  It shall do so by generating a random challenge that you must sign with the CA certificate's corresponding private key.  If you kept the private key secret and protected as earlier advised, then only you will possess the knoweldge to complete this step. After sigining the challenge, complete this step by uploading a file containing the results. 

Learn here how to register your CA certificate.  <<todo: link to tutorial on uploading CA>>

## Sign devices into the certificate chain of trust

The owner of an X.509 CA certificate can cryptographically sign an intermediary who can in turn sign another intermediary and so on until the last intermediary terminates this process by signing devices. The result is a cascaded chain of certificates known as a certificate chain of trust. In real life this plays out as delegation of trust towards signing devices. This delegation is important because it establishes a cryptographically veriable chain of custody and avoids sharing of signing keys.

X.509 CA authentication enables Company-X to setup this supply chain scenario at minimal operational cost.

The X.509 CA certificate is a digital certificate whose holder can sign other certificates.  This digital certificate is X.509 because it is formatted to comply with IETF's RFC 5280 format standard, and is a certificate authority (CA) because it's holder can sign other certificates.

Let's use an example to clarify.  Company-X is a maker of Smart-X-Widget designed for professional installation. Company-X outsources both manufacturing and installation.  It contracts manufacturer Factory-Y to manufacture the Smart-X-Widgets, and service provider Technician-Z to install. Company-X desires that Smart-X-Widget directly ships from Factory-Y to Technician-Z for installation and that it connects directly to Company-X's instance of IoT Hub after installation without further intervention from Company-X. To make this happen, Company-X need to complete a few one-time setup operations as follows:

* Acquire the X.509 CA certificate

* Register X.509 CA certificate to IoT Hub

* Sign devices into a certificate chain of trust

* Device connection

## Acquire the X.509 CA certificate

Company-X has the option of purchasing an X.509 CA certificate from a public root certificate authority or creating one through a self-signed process.  One option would be optimal over the other depending on the application scenario.  Regardless of the option, the process entails two fundamental steps, generating a public/private key pair and signing the public key into a certificate.

[img-csr-flow]: ./media/csr-flow.png

Details on how to accomplish these steps differ with various service providers.

### Purchasing an X.509 CA certificate

Purchasing a CA certificate has the benefit of having a well-known root CA act as a trusted third party to vouch for the legitimacy of IoT devices when the devices connect. Company-X would choose this option if they intend Smart-X-Widget to interact with third party products or services after initial connection to IoT Hub.

To purchase an X.509 CA certificate, Company-X would choose a root certificates services provider. An internet search for the phrase 'Root CA' will yield good leads.  The root CA will guide Company-X on how to create the public/private key pair and how to generate a Certificate Signing Request (CSR) for their services.  A CSR is the formal process of applying for a certificate from a certificate authority.  The outcome of this purchase is a certificate for use as an authority certificate.  Given the ubiquity of X.509 certificates, the certificate is likely to have been properly formatted to IETF's RFC 5280 standard.

### Creating a Self-Signed X.509 CA certificate

The process to create a Self-Signed X.509 CA certificate is similar to purchasing with the exception of involving a third party signer like the root certificate authority.  In our example, Company-X will sign it's authority certificate instead of a root certificate authority.  Company-X may choose this option for testing until they're ready to purchase an authority certificate.  Company-X may also decide to use a self-signed X.509 CA certificate in production if Smart-X-Widget is not intended to connect to third party services outside of IoT Hub, services that may need to validate the identity of Smart-X-Widget.

## Register the X.509 certificate to IoT Hub

Company-X needs to register the X.509 CA to IoT Hub where it will serve to authenticate Smart-X-Widgets as they connect.  This is a one-time process that enables the ability to authenticate and manage any number of Smart-X-Widget devices.  This process is one-time because of a one-to-many relationship between authority certificate and devices and also constitutes one of the main advantages of using the X.509 CA authentication method.  The alternative is to upload individual certificates for each and every Smart-X-Widget device thereby adding to operational costs.

Registring the X.509 CA certificate is a two step process, the certificate upload and certificate proof-of-possession.

[img-pop-flow]: ./media/pop-flow.png

### X.509 CA Certificate Upload

The X.509 CA certificate upload process is just that, upload the CA certificate to IoT Hub.  IoT Hub expects the certificate in a file. Company-X simply uploads the certificate file. The certifcate file MUST NOT under any circumstances contain any private keys.  Best practices from standards governing Public Key Infrastructure (PKI) mandates that knowledge of Company-X's private in this case resides exclusively within Company-X.

### Proof-of-Possession of the Certificate

The X.509 CA certificate, just like any digital certificate, is public information that is susceptible to eavesdropping.  As such, an eavesdropper may intercept a certificate and try to upload it as their own.  In our example, IoT Hub would like to make sure that the CA certificate Company-X is uploading really belongs to Company-X. It does so by challenging Company-X to proof that they in fact possess the certificate through a proof-of-possession (PoP) flow. The proof-of-possession flow entails IoT Hub generating a random number to be signed by Company-X using it's private key.  If Company-X followed PKI best practices and protected their private key then only they would be in position to correctly respond to the proof-of-possession challenge.  IoT Hub proceeds to register the X.509 CA certificate upon a successful response of the proof-of-possession challenge.

A successful response to the proof-of-possession challenge from IoT Hub completes completes the X.509 CA registration.

## Sign Devices into a Certificate Chain of Trust

IoT requires every device to possess a unique identity.  These identities are in the form certificates for certificate based authentication schemes.  In our example, this means every Smart-X-Widget must possess a unique device certificate.  How does Company-X setup for this in it's supply chain?

One way to go about this is to pre-generate certificates for Smart-X-Widgets and entrusting knowledge of corresponding unique device private keys with supply chain partners.  For Company-X, this means entrusting Factory-Y and Technician-Z.  While this is a valid method, it comes with challenges that must be overcome to ensure trust as follows:

1. Having to share device private keys with supply chain partners, besides ignoring PKI best practicies of never sharing private keys, makes building trust in the supply chain expensive.  It means capital systems like secure rooms to house device private keys, and processes like periodic security audits need to be installed.  Both add cost to the supply chain.

2. Securely accounting for devices in the supply chain and later managing them in deployment becomes a one-to-one task for every key-to-device pair from the point of device unique certificate (hence private key) generation to device retirement. This precludes group management of devices unless the concept of groups is explicitely built into the process somehow. Secure accounting and device life-cycle management, therefore, becomes a heavy operations burden.  In our example, Company-X would bear this burden.

X.509 CA certificate authentication offers elegant solutions to afore listed challenges through the use of certificate chains.  A certificate chain results from a CA signing an intermediate CA that in turn signs another intermediate CA and so goes on until a final intermediate CA signs a device.  In our example, Company-X signs Factory-Y which in turn signs Technician-Z that finally signs Smart-X-Widget.

[img-cert-mfr-chain]: ./media/cert-mfr-chain.png

Above cascade of certificates in the chain presents the logical hand-off of authority.  Many supply chains follow this logical hand-off whereby each intermediate CA gets signed into the chain while receiving all upstream CA certificates, and the last intermediate CA finally signs each device and inject all the authority certificates from the chain into the device. This is common when the contract manufacturing company with a hierarchy of factories commissions a particular factory to do the manufacturing.  While the hirarchy may may be several levels deep (e.g. by geography/product type/manufacturing line), only the factory at the end gets to interact with the device but the chain is maintained from the top of the hierarchy.

Alternate chains may have different intermediate CA interact with the device in which case the CA interacting with the device injects certificate chain content at that point.  Hybrid models are also possible where only some of the CA have physical interaction with the device.

In our example, both Factory-Y and Technician-Z interact with the Smart-X-Widget.  While Company-X owns Smart-X-Widget, it actually does not physically interact with it in the entire supply chain.  The certificate chain of trust for Smart-X-Widget therefore comprise Company-X signing Factory-Y which in turn signs Technician-Z that will then provide final signature to Smart-X-Widget. The manufacture and installation of Smart-X-Widget comprise Factory-Y and Technician-Z using their respective intermediate CA certificates to sign each and every Smart-X-Widgets. The end result of this entire process are Smart-X-Widgets with unique device certificates and certificate chain of trust going up to Company-X CA certificate.

[img-cert-chain-hierarchy]: ./media/cert-chain-hierarchy.png

This is a good point to review teh value of the X.509 CA method.  Instead of pre-generating and handing off certificates for every Smart-X-Widget into the supply chain, Company-X only hand to sign Factory-Y once.  Instead of having to track every device throughout the devices life-cycle, Company-X may not track and manage devices through groups that naturally emergy from the supply chain process e.g. devices installed by Technician-Z after July of some year.

Last but not least, the CA method of authentication infuses secure accountability into the device manufacturing supply chain. Because of the certificate chain process, the actions of every member in the chain is cryptographically recorded and verifiable.

This process relies on certain assumptions that must be surfaced for completeness.  It requires independent creation of device unique public/private key pair and that the private key be protected within the device.  Fortunately, secure silicon chips in the form of Hardware Secure Modules (HSM) capable of internally generating keys and protecting private keys exist.  Company-X only need to add one of such chips into Smart-X-Widget's component bill of materials.

## Device Connection

Previous sections above have been building up to device connection.  By simply registring an X.509 CA certificate to IoT Hub one time, how do potentially millions of devices connect and get authenticated from the very first time?  Simple.  Through the same certificate upload and proof-of-possession flow we earlier encountered with registering the X.509 CA certificate.

Devices manufactured for X.509 CA authentication are equiped with device unique certificates and a certificate chain from their respective manufacturing supply chain.  Device connection, even for the very first time, happens in a two step process: certificate chain upload and proof-of-possession.

During the certificate chain upload, the device uploads its device unique certificate together with the certificate chain installed within it to IoT Hub.  Using the pre-registered X.509 CA certificate, IoT Hub can cryptographically validate a couple of things, that the uploaded certificate chain is internally consistent, and that the chain was originated by the valid owner of the X.509 CA certificate.  Just was with the X.509 CA registration process, IoT Hub would initiate a proof-of-possession challenge-reponse process to ascertain that the chain and hence device certificate actually belongs to the device uploading it.  It does so by generating a random challenge to be signed by the device using its private key for validation by IoT Hub.   A successful response triggers IoT Hub to accept the device as authentic and grant it connection.

In our example, each Smart-X-Widget would upload its device unique certificate together with Factory-Y and Technician-Z X.509 CA certificates and then respond to the proof-of-possession challenge from IoT Hub.

[img-device-pop-flow]: ./media/device-pop-flow.png

Notice that the foundation of trust rests in protecting private keys including device private keys.  We therefore cannot stress enough the importance of secure silicon chips in the form of Hardware Secure Modules (HSM) for protecting device private keys, and the overall best practice of never sharing any private keys, like one factory entrusting another with its private key.






Without X.509 CA method...


[img-CertificateChain]: ./media/CertificateChain.png






<ea add a note about mutual authentication>
<!-- links and images -->

[img-tokenservice]: ./media/iot-hub-devguide-security/tokenservice.png
[lnk-endpoints]: iot-hub-devguide-endpoints.md
[lnk-quotas]: iot-hub-devguide-quotas-throttling.md
[lnk-sdks]: iot-hub-devguide-sdks.md
[lnk-query]: iot-hub-devguide-query-language.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md
[lnk-openssl]: https://www.openssl.org/
[lnk-selfsigned]: https://technet.microsoft.com/library/hh848633

[lnk-resource-provider-apis]: https://docs.microsoft.com/rest/api/iothub/iothubresource
[lnk-sas-tokens]: iot-hub-devguide-security.md#security-tokens
[lnk-amqp]: https://www.amqp.org/
[lnk-azure-resource-manager]: ../azure-resource-manager/resource-group-overview.md
[lnk-cbs]: https://www.oasis-open.org/committees/download.php/50506/amqp-cbs-v1%200-wd02%202013-08-12.doc
[lnk-event-hubs-publisher-policy]: https://code.msdn.microsoft.com/Service-Bus-Event-Hub-99ce67ab
[lnk-management-portal]: https://portal.azure.com
[lnk-sasl-plain]: http://tools.ietf.org/html/rfc4616
[lnk-identity-registry]: iot-hub-devguide-identity-registry.md
[lnk-dotnet-sas]: https://msdn.microsoft.com/library/microsoft.azure.devices.common.security.sharedaccesssignaturebuilder.aspx
[lnk-java-sas]: https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.service.auth._iot_hub_service_sas_token
[lnk-tls-psk]: https://tools.ietf.org/html/rfc4279
[lnk-protocols]: iot-hub-protocol-gateway.md
[lnk-custom-auth]: iot-hub-devguide-security.md#custom-device-authentication
[lnk-x509]: iot-hub-devguide-security.md#supported-x509-certificates
[lnk-devguide-device-twins]: iot-hub-devguide-device-twins.md
[lnk-devguide-directmethods]: iot-hub-devguide-direct-methods.md
[lnk-devguide-jobs]: iot-hub-devguide-jobs.md
[lnk-service-sdk]: https://github.com/Azure/azure-iot-sdk-csharp/tree/master/service
[lnk-client-sdk]: https://github.com/Azure/azure-iot-sdk-csharp/tree/master/device
[lnk-device-explorer]: https://github.com/Azure/azure-iot-sdk-csharp/blob/master/tools/DeviceExplorer
[lnk-iothub-explorer]: https://github.com/azure/iothub-explorer

[lnk-getstarted-tutorial]: iot-hub-csharp-csharp-getstarted.md
[lnk-c2d-tutorial]: iot-hub-csharp-csharp-c2d.md
[lnk-d2c-tutorial]: iot-hub-csharp-csharp-process-d2c.md
