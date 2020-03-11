---
title: Security practices for manufacturers - Azure IoT Hub Device Provisioning Service
description: Overviews common security practices for OEMs and device manufactures who prepare devices to enroll in Azure IoT Device Provisioning Service (DPS). 
author: timlt
ms.author: timlt
ms.date: 3/02/2020
ms.topic: conceptual
ms.service: iot-dps

# Optional fields. Don't forget to remove # if you need a field.
ms.custom: iot-p0-scenario, iot-devices-deviceOEM
# ms.reviewer: MSFT-alias-of-reviewer
---
# Security practices for Azure IoT device manufacturers
As more manufacturers release IoT devices, the Azure IoT Hub Device Provisioning Service (DPS) team has provided guidance on security practices. This articles overviews recommended security practices to consider when you manufacture devices for use with DPS.  

> [!div class="checklist"]
> * Integrating a Trusted Platform Module (TPM) into the manufacturing process
> * Installing certificates on IoT devices
> * Selecting device authentication options

## Integrating a TPM into the manufacturing process
You can follow a standards-based process to integrate TPM devices during manufacturing. This section addresses the widely used TPM 2.0 devices that have hash-based message authentication code (HMAC) key support. The TPM specification for TPM chips is an ISO standard that's maintained by the Trusted Computing Group. For more on TPM, see the specifications for [TPM 2.0](https://trustedcomputinggroup.org/tpm-library-specification/) and [ISO/IEC 11889](https://www.iso.org/standard/66510.html). 

### Taking ownership of the TPM
A critical step in manufacturing a device with a TPM chip is to take ownership of the TPM. This step is required so that you can provide a key to the device owner. To take ownership, first you extract the endorsement key (EK) from the device, and then you claim ownership. You can extract the EK and claim ownership at different times, which gives added flexibility in the manufacturing process. Many manufacturers are taking advantage of this flexibility by adding a Hardware Security Module (HSM) to enhance the security of their devices. This section provides guidance on when to extract the EK, when to claim ownership of the TPM, and considerations for integrating these steps into a manufacturing timeline. 

> [!IMPORTANT]
> The following guidance assumes you use a discrete, firmware, or integrated TPM. In places where it's applicable, the guidance adds notes on using a non-discrete or software TPM. If you use a software TPM, there may be additional steps that this guidance doesn't include. Software TPMs have a variety of implementations that are beyond the scope of this article.  In general, it's possible to integrate a software TPM into the following general manufacturing timeline. However, while a software emulated TPM is suitable for prototyping and testing, it can't provide the same level of security as a discrete, firmware, or integrated TPM. As a general practice, avoid using a software TPM in production.

### General manufacturing timeline
The following timeline shows how a TPM goes through a production process and ends up in a device. Each manufacturing process is unique and this timeline shows the most common patterns. If you're new to manufacturing devices that use a TPM, the timeline guides you on when to take certain actions with the keys. 

#### Step 1: TPM is manufactured
- If you buy TPMs from a manufacturer for use in your devices, see if they will extract public endorsement keys (EK_pubs) for you. It's helpful if the manufacturer provides the list of EK_pubs with the shipped devices. 
    > [!NOTE]
    > You could give the TPM manufacturer write access to your enrollment list by using shared access policies in your provisioning service.  This lets them add the TPMs to your enrollment list for you.  But that is early in the manufacturing process, and it requires trust in the TPM manufacturer. Do so at your own risk. 
- If you manufacture TPMs to sell to device manufacturers, consider giving your customers a list of EK_pubs along with their physical TPMs.  Providing customers with EK_pubs saves a step in their process. 
- If you manufacture TPMs to use with your own devices, identify which point in your process is the most convenient to extract the EK_pub. You can do this at any of the remaining points in the timeline. 

#### Step 2: TPM is installed into a device
At this point in the production process, you should know which DPS instance the device will be used with. As a result, you can add devices to the enrollment list for automated provisioning. For more information about automatic device provisioning, see the [DPS documentation](about-iot-dps.md).
- If you haven't extracted the EK_pub, now is a good time to do so. 
- Depending on the installation process of the TPM, this can be a good time to take ownership of the TPM. 

#### Step 3: Device has firmware and software installed
At this point in the process, install the DPS client along with the ID scope and global URL for provisioning.
- Now is the last chance to extract the EK_pub. If a third party will install the software on your device, it's a good idea to extract the EK_pub first.
- This point in the manufacturing process is ideal to take ownership of the TPM.  
    > [!NOTE]
    > If you're using a software TPM, you can install it now.  Extract the EK_pub at the same time.

#### Step 4: Device is packaged and sent to the warehouse
A device can sit in a warehouse for 6-12 months before being deployed. 

#### Step 5: Device is installed into the location
After the device arrives at its final location, it goes through automated provisioning with DPS.

For more information, see [Auto-provisioning concepts](concepts-auto-provisioning.md) and [TPM attestation](concepts-tpm-attestation.md). 

## Installing certificates on IoT devices
When you start using certificates on IoT devices in a manufacturing process, you'll need to make several decisions.  These include decisions about common certificate variables, when to generate certificates, and when to install them. 

> [!CAUTION]
> A note on security. If you're used to using passwords, you might ask why you can't use the same certificate in all your devices. In the same way that you'd be able to use the same password in all your devices. First, using the same password everywhere is dangerous and has exposed companies to major DDoS attacks. Including the one that took down DNS on the US East Coast several years ago. Never use the same password everywhere, even with personal accounts. Second, a certificate isn't a password, it's a unique identity. A password is like a secret code that anyone can use to open a door at a secured building.  It's something you know, and you could give the password to anyone to gain entrance.  A certificate is like a driver's license with your photo and other details, which you can show to a guard to get into a secured building. It's tied to who you are.  Provided that the guard accurately matches people with driver's licenses, only you can use your license (identity) to gain entrance. 

### Variables involved in certificate decisions
Consider the following variables, and how each one impacts the overall manufacturing process. 

#### Where the certificate root of trust comes from
Managing a public key infrastructure (PKI) can be costly and complex.  Especially if your company does not have experience doing so. Your options are as follows:
- Use a 3rd party PKI. You can buy intermediate signing certificates from a 3rd party certificate vendor. Or you can use a private Certificate Authority (CA). 
- Use a self-managed PKI. You can maintain your own PKI system and generate your own certificates.
- Use the [Azure Sphere](https://azure.microsoft.com/services/azure-sphere/) security service. This applies only to Azure Sphere devices. 

#### Where certificates are stored
There are a few factors that impact the decision on where certificates are stored. These include the type of device, expected profit margins (whether you can afford secure storage), device capabilities, and existing security technology on the device that you may be able to use. Consider the following options:
- In a hardware security module (HSM). Using an HSM is highly recommended. Check whether your device's control board already has an HSM installed. If you know you don't have an HSM, work with your hardware manufacturer to identify an HSM that meets your needs.
- In a secure place on disk such as a trusted execution environment (TEE).
- In the local file system or a certificate store. For example, the Windows certificate store. 
- Other

#### Connectivity at the factory
Connectivity at the factory determines how and when you'll get the certificates to install on the devices. Connectivity options are as follows:
- Connectivity. This is optimal, because you can generate certificates locally. 
- No connectivity. In this case, you use a signed certificate from a CA to generate device certificates locally and offline. 
- No connectivity. In this case, you obtain certificates that were generated ahead of time, or you use an offline PKI.  

#### Audit requirement
Depending on the type of devices you produce, you might have a regulatory requirement to create an audit trail of how device identities are installed on your devices. Auditing adds significant production cost, so in most cases, only do it if required. If you're unsure whether an audit is required, check with your company's legal department. Auditing options are as follows: 
- Not a sensitive industry. No auditing is required.
- Sensitive industry. Certificates need to be installed in a secure room according to compliance certification requirements. If you need a secure room to install certificates, you are likely already aware of how certificates get installed in your devices. And you probably already have an audit system in place. 

#### Length of certificate validity
Like a driver's license, certificates have an expiration date that is set when they are created. These are the options for length of certificate validity:
- Renewal not required.  This approach uses a very long renewal period, so that you'll never need to renew the certificate during the device's lifetime. While this is convenient, it's also risky.  You can reduce the risk by using secure storage like an HSM on your devices. However, using long-lived certificates is not recommended.
- Renewal required.  You'll need to renew the certificate during the lifetime of the device. The length of the certificate validity depends on context and you'll need a strategy for renewal.  The strategy should include where you're getting certificates, and what type of over-the-air functionality your devices have to use in the renewal process. 

### When to generate certificates

As I mentioned in the previous section, connectivity at the factory plays an important role in determining when you generate the certificates for your devices. Let's talk about that.

Some HSM vendors offer a premium service in which the HSM vendor installs certificates in the HSMs on behalf of the customer. Customers give the HSM vendor access to a signing certificate and the HSM vendor installs certificates signed by that signing certificate on each HSM the customer buys. All the customer has to do is install the HSM on the device. One customer I've talked to who went this route says the process is pretty slick. If you choose to go the "preloaded in HSM" route, when to generate certificates is not your problem! Hooray!

If your devices internally generate their certificates, then you must extract the public X.509 certificate from the device for enrollment.

If your factory has connectivity, you can generate the certs whenever you need them.

If your factory does not have connectivity, and you are using your own PKI with offline support, then you can generate the certs whenever you need them.

If your factory does not have connectivity, and you are using a 3rd party PKI, you have to generate the certs ahead of time from an internet connected location.

### When to install certificates

Now that you've generated certificates for your IoT devices (or know when to generate them), it's time to install them into your device.

If you go the "preloaded in HSM" route, your life is made a little easier. Once the HSM is installed in the device, it is available for the device code to access. You will then use the HSM APIs to use the cert stored within the HSM. It's the easiest option, but it costs a little more.

Otherwise, you need to install the certificate as part of the production process. The easiest way to integrate it into your existing process is to install the certificate with the initial firmware image. Each device has to go through at least one touch on the manufacturing floor to get an image installed and to run the final quality checks, etc, before the device is packaged up to send to its final destination. There's generally a tool used that does the installation and testing in one shot. You can modify the tool to generate a cert or pull a cert from a pre-generated store and then install it wherever the cert needs to be installed. The tool gives you the scale you need for production-level manufacturing.

If you need more help getting certificates in your IoT devices, please reach out to someone from our security auditor program. Once you get set up with certs on your devices, learn how to use certificates and enrollments in the Device Provisioning Service!

## Selecting device authentication options
Picking the right security for the job is a challenging issue. Obviously, everyone wants maximum security for IoT solutions. But issues such as hardware limitations, cost consciousness, lack of security expertise, and more all play into which security option is ultimately chosen for how your IoT devices connect to the cloud. There are many dimensions of IoT security and in my experience authentication type tends to be the first one customers encounter, though all are important.

In this blog post, I'm going to discuss the authentication types supported by the Azure IoT Hub Device Provisioning Service and Azure IoT Hub. There are other authentication methods out there, but these are the ones we have found to be the most widely used.

Azure IoT published a whitepaper about evaluating your IoT security, and we also offer the Security Program for Azure IoT. This security program helps you find the right security auditor for your situation and who can help you figure out how much security you need for your solution. These companies are experts at evaluating IoT security; if you have any in-depth questions around security, I highly recommend you give them a try. You can also learn about how to select secure hardware in this blog post "Whitepaper: Selecting the right secure hardware for your IoT deployment" or in the accompanying whitepaper.

This blog post is not a replacement for a security audit, and it is not meant as a recommendation for any specific form of security. I want you all to be as secure as possible and cannot in good conscience recommend anything less. Take this blog post as a lay of the land to help you understand at a high level what all is possible, and what you should keep in mind as you embark on your IoT security journey. Remember: when in doubt, find an expert.
X.509 certificates

X.509 certificates are a type of digital identity that is standardized in IETF RFC 5280. If you have the time and inclination, I recommend reading the RFC to learn about what makes X.509 certificates useful in IoT scenarios. Learn about installing certs in devices.

There are several ways certificates can be authenticated:

    Thumbprint: A hex string uniquely identifying a cert generated by running a thumbprint algorithm on the cert.
    CA authentication based on a full chain: Ensuring the certificate chain was signed by a trusted signer somewhere in the cert.

Pros

    Most secure key type supported in Azure IoT.
    It allows lots of control around management.
    There are lots of vendor options.

Cons

    Many customers rely on external vendors for certificates.
    Management comes at a price, adding to the overall solution cost.
    Lifecycle management can be a challenge due to the logistical complexities involved.

Trusted Platform Module (TPM)

TPM can refer to a standard for securely storing keys used to authenticate the platform, or it can refer to the I/O interface used to interact with the modules implementing the standard. TPMs can exist as discrete hardware, integrated hardware, firmware-based modules, or software-based modules. Some of the key differences between TPMs and symmetric keys (discussed below) are that:

    TPM chips can also store X.509 certificates.
    TPM attestation in the Device Provisioning Service uses the TPM endorsement key (EK) which is a form of asymmetric authentication, whereas symmetric keys are symmetric authentication.

Pros

    TPMs come standard on many Windows devices, with built-in support in Windows if you're using Windows as your OS.
    TPM attestation is more secure than SAS token-based symmetric key attestation.
    You can also blow away credentials pretty easily, and the Device Provisioning Service auto-rolls the IoT Hub credentials whenever a TPM device comes to re-provision.

Cons

    TPMs are difficult to use in general if you're not familiar with them.
    Difficult to develop for without either a physical TPM or a quality emulator.
    May require board re-design to include in hardware.
    You can't roll the EK without essentially destroying the identity of the chip and giving it a new one. It's like if you had a clone, your clone would have the same physical characteristics as you but they are ultimately a different person. Although the physical chip stays the same, it has a new identity in your IoT solution.

Symmetric key

A symmetric key is known to both the device and the service, and the key is used to both encrypt and decrypt messages sent between parties. Azure IoT supports SAS token-based symmetric key connections. The best way to protect symmetric keys is via a hardware security module.
Pros

    Easiest to get started.
    Nothing extra required to generate.

Cons

    Less secure than X.509 certificates or TPM because the same key is shared between device and cloud, which means the key needs protecting in two places. For certificates, TPM, and PKI in general the challenge is all about proving possession of the key without ever revealing the private portion of the key.
    Easy to have bad security practices. Folks using symmetric keys tend to hardcode the keys in the clear (unencrypted) on devices, leaving the keys vulnerable. It's possible to mitigate some risk by securely storing the symmetric key on the device, but in general, folks using symmetric keys aren't necessarily following best practices around key storage. It's not impossible, just uncommon.

Shared symmetric key

Using the same symmetric key in all your devices. Don't do this ever!
Pros

    Easy to produce at scale.

Cons

    Really, don't use the same symmetric key in all devices. The risks far outweigh the benefit of easy implementation. It would be security malpractice to suggest that shared symmetric key is a serious solution for IoT authentication.
    Very vulnerable to attack.
    Anyone can impersonate your devices if they get a hold of your key.
    You will likely lose control of devices if you rely on shared symmetric key. Just don't do it, you can read more on botnets if you're not convinced that shared symmetric key is a bad idea.

Making the right choice for your devices

You have to evaluate your specific risks and benefits to make your IoT authentication decision. This blog post is too short to cover everything, but Azure IoT offers the Security Program for Azure IoT if you need help making this decision. You can also read our whitepaper about evaluating your IoT security to learn more about your options.

## Next steps
To learn how several manufacturers have implemented security practices into their process for Azure IoT devices, see the case studies at [IoT Hub Device reprovisioning concepts](concepts-device-reprovision.md).
