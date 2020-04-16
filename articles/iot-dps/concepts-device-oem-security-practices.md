---
title: Security practices for manufacturers - Azure IoT Device Provisioning Service
description: Overviews common security practices for OEMs and device manufactures who prepare devices to enroll in Azure IoT Device Provisioning Service (DPS). 
author: timlt
ms.author: timlt
ms.date: 3/02/2020
ms.topic: conceptual
ms.service: iot-dps
ms.custom: iot-p0-scenario, iot-devices-deviceOEM
ms.reviewer: nberdy
---
# Security practices for Azure IoT device manufacturers
As more manufacturers release IoT devices, it's helpful to identify guidance around common practices. This article summarizes recommended security practices to consider when you manufacture devices for use with Azure IoT Device Provisioning Service (DPS).  

> [!div class="checklist"]
> * Selecting device authentication options
> * Installing certificates on IoT devices
> * Integrating a Trusted Platform Module (TPM) into the manufacturing process

## Selecting device authentication options
The ultimate aim of any IoT device security measure is to create a secure IoT solution. But issues such as hardware limitations, cost, and level of security expertise all impact which options you choose. Further, your approach to security impacts how your IoT devices connect to the cloud. While there are [several elements of IoT security](https://www.microsoft.com/research/publication/seven-properties-highly-secure-devices/) to consider, a key element that every customer encounters is what authentication type to use. 

Three widely used authentication types are X.509 certificates, Trusted Platform Modules (TPM), and symmetric keys. While other authentication types exist, most customers who build solutions on Azure IoT use one of these three types. The rest of this article surveys pros and cons of using each authentication type.

### X.509 certificate
X.509 certificates are a type of digital identity you can use for authentication. The X.509 certificate standard is documented in [IETF RFC 5280](https://tools.ietf.org/html/rfc5280). In Azure IoT, there are two ways to authenticate certificates:
- Thumbprint. A thumbprint algorithm is run on a certificate to generate a hexadecimal string. The generated string is a unique identifer for the certificate. 
- CA authentication based on a full chain. A certificate chain is a hierarchical list of all certificates needed to authenticate an end-entity (EE) certificate. To authenticate an EE certificate, it's necessary to authenticate each certificate in the chain including a trusted root CA. 

Pros for X.509:
- X.509 is the most secure authentication type supported in Azure IoT.
- X.509 allows a high level of control for purposes of certificate management.
- Many vendors are available to provide X.509 based authentication solutions.

Cons for X.509:
- Many customers may need to rely on external vendors for their certificates.
- Certificate management can be costly and adds to total solution cost.
- Certificate life-cycle management can be difficult if logistics are not well thought out. 

### Trusted Platform Module (TPM)
TPM, also known as [ISO/IEC 11889](https://www.iso.org/standard/66510.html), is a standard for securely generating and storing cryptographic keys. TPM also refers to a virtual or physical I/O device that interacts with modules that implement the standard. A TPM device can exist as discrete hardware, integrated hardware, a firmware-based module, or a software-based module. 

There are two key differences between TPMs and symmetric keys: 
- TPM chips can also store X.509 certificates.
- TPM attestation in DPS uses the TPM endorsement key (EK), a form of asymmetric authentication. With asymmetric authentication, a public key is used for encryption, and a separate private key is used for decryption. In contrast, symmetric keys use symmetric authentication, where the private key is used for both encryption and decryption. 

Pros for TPM:
- TPMs are included as standard hardware on many Windows devices, with built-in support for the operating system. 
- TPM attestation is easier to secure than shared access signature (SAS) token-based symmetric key attestation.
- You can easily expire and renew, or roll, device credentials. DPS automatically rolls the IoT Hub credentials whenever a TPM device is due for reprovisioning.

Cons for TPM: 
- TPMs are complex and can be difficult to use. 
- Application development with TPMs is difficult unless you have a physical TPM or a quality emulator.
- You may have to redesign the board of your device to include a TPM in the hardware. 
- If you roll the EK on a TPM, it destroys the identity of the TPM and creates a new one. Although the physical chip stays the same, it has a new identity in your IoT solution.

### Symmetric key
With symmetric keys, the same key is used to encrypt and decrypt messages. As a result, the same key is known to both the device and the service that authenticates it. Azure IoT supports SAS token-based symmetric key connections. Symmetric key authentication requires significant owner responsibility to secure the keys and achieve an equal level of security with X.509 authentication. If you use symmetric keys, the recommended practice is to protect the keys by using a hardware security module (HSM).

Pros for symmetric key:
- Using symmetric keys is the simplest, lowest cost way to get started with authentication.
- Using symmetric keys streamlines your process because there's nothing extra to generate. 

Cons for symmetric key: 
- Symmetric keys take a significant degree of effort to secure the keys. The same key is shared between device and cloud, which means the key must be protected in two places. In contrast, the challenge with TPM and X.509 certificates is proving possession of the public key without revealing the private key.
- Symmetric keys make it easy to follow poor security practices. A common tendency with symmetric keys is to hard code the unencrypted keys on devices. While this practice is convenient, it leaves the keys vulnerable. You can mitigate some risk by securely storing the symmetric key on the device. However, if your priority is ultimately security rather than convenience, use X.509 certificates or TPM for authentication. 

### Shared symmetric key
There's a variation of symmetric key authentication known as shared symmetric key. This approach involves using the same symmetric key in all devices. The recommendation is to avoid using shared symmetric keys on your devices. 

Pro for shared symmetric key:
- Simple to implement and inexpensive to produce at scale. 

Cons for shared symmetric key: 
- Highly vulnerable to attack. The benefit of easy implementation is far outweighed by the risk. 
- Anyone can impersonate your devices if they obtain the shared key.
- If you rely on a shared symmetric key that becomes compromised, you will likely lose control of the devices. 

### Making the right choice for your devices
To choose an authentication method, make sure you consider the benefits and costs of each approach for your unique manufacturing process.  For device authentication, usually there's an inverse relationship between how secure a given approach is, and how convenient it is.  

## Installing certificates on IoT devices
If you use X.509 certificates to authenticate your IoT devices, this section offers guidance on how to integrate certificates into your manufacturing process. You'll need to make several decisions.  These include decisions about common certificate variables, when to generate certificates, and when to install them. 

If you're used to using passwords, you might ask why you can't use the same certificate in all your devices, in the same way that you'd be able to use the same password in all your devices. First, using the same password everywhere is dangerous. The practice has exposed companies to major DDoS attacks, including the one that took down DNS on the US East Coast several years ago. Never use the same password everywhere, even with personal accounts. Second, a certificate isn't a password, it's a unique identity. A password is like a secret code that anyone can use to open a door at a secured building.  It's something you know, and you could give the password to anyone to gain entrance.  A certificate is like a driver's license with your photo and other details, which you can show to a guard to get into a secured building. It's tied to who you are.  Provided that the guard accurately matches people with driver's licenses, only you can use your license (identity) to gain entrance. 

### Variables involved in certificate decisions
Consider the following variables, and how each one impacts the overall manufacturing process. 

#### Where the certificate root of trust comes from
It can be costly and complex to manage a public key infrastructure (PKI).  Especially if your company doesn't have any experience managing a PKI. Your options are:
- Use a third-party PKI. You can buy intermediate signing certificates from a third-party certificate vendor. Or you can use a private Certificate Authority (CA). 
- Use a self-managed PKI. You can maintain your own PKI system and generate your own certificates.
- Use the [Azure Sphere](https://azure.microsoft.com/services/azure-sphere/) security service. This option  applies only to Azure Sphere devices. 

#### Where certificates are stored
There are a few factors that impact the decision on where certificates are stored. These factors include the type of device, expected profit margins (whether you can afford secure storage), device capabilities, and existing security technology on the device that you may be able to use. Consider the following options:
- In a hardware security module (HSM). Using an HSM is highly recommended. Check whether your device's control board already has an HSM installed. If you know you don't have an HSM, work with your hardware manufacturer to identify an HSM that meets your needs.
- In a secure place on disk such as a trusted execution environment (TEE).
- In the local file system or a certificate store. For example, the Windows certificate store. 

#### Connectivity at the factory
Connectivity at the factory determines how and when you'll get the certificates to install on the devices. Connectivity options are as follows:
- Connectivity. Having connectivity is optimal, it streamlines the process of generating certificates locally. 
- No connectivity. In this case, you use a signed certificate from a CA to generate device certificates locally and offline. 
- No connectivity. In this case, you can obtain certificates that were generated ahead of time. Or you can use an offline PKI to generate certificates locally.

#### Audit requirement
Depending on the type of devices you produce, you might have a regulatory requirement to create an audit trail of how device identities are installed on your devices. Auditing adds significant production cost. So in most cases, only do it if necessary. If you're unsure whether an audit is required, check with your company's legal department. Auditing options are: 
- Not a sensitive industry. No auditing is required.
- Sensitive industry. Certificates should be installed in a secure room according to compliance certification requirements. If you need a secure room to install certificates, you are likely already aware of how certificates get installed in your devices. And you probably already have an audit system in place. 

#### Length of certificate validity
Like a driver's license, certificates have an expiration date that is set when they are created. Here are the options for length of certificate validity:
- Renewal not required.  This approach uses a long renewal period, so you'll never need to renew the certificate during the device's lifetime. While such an approach is convenient, it's also risky.  You can reduce the risk by using secure storage like an HSM on your devices. However, the recommended practice is to avoid using long-lived certificates.
- Renewal required.  You'll need to renew the certificate during the lifetime of the device. The length of the certificate validity depends on context, and you'll need a strategy for renewal.  The strategy should include where you're getting certificates, and what type of over-the-air functionality your devices have to use in the renewal process. 

### When to generate certificates
The internet connectivity capabilities at your factory will impact your process for generating certificates. You have several options for when to generate certificates: 

- Pre-loaded certificates.  Some HSM vendors offer a premium service in which the HSM vendor installs certificates for the customer. First, customers give the HSM vendor access to a signing certificate. Then the HSM vendor installs certificates signed by that signing certificate onto each HSM the customer buys. All the customer has to do is install the HSM on the device. While this service adds cost, it helps to streamline your manufacturing process.  And it resolves the question of when to install certificates.
- Device-generated certificates.  If your devices generate certificates internally, then you must extract the public X.509 certificate from the device to enroll it in DPS. 
- Connected factory.  If your factory has connectivity, you can generate device certificates whenever you need them.
- Offline factory with your own PKI. If your factory does not have connectivity, and you are using your own PKI with offline support, you can generate the certificates when you need them.
- Offline factory with third-party PKI. If your factory does not have connectivity, and you are using a third-party PKI, you must generate the certificates ahead of time. And it will be necessary to generate the certificates from a location that has connectivity. 

### When to install certificates
After you generate certificates for your IoT devices, you can install them in the devices. 

If you use pre-loaded certificates with an HSM, the process is simplified. After the HSM is installed in the device, the device code can access it. Then you'll call the HSM APIs to access the certificate that's stored in the HSM. This approach is the most convenient for your manufacturing process. 

If you don't use a pre-loaded certificate, you must install the certificate as part of your production process. The simplest approach is to install the certificate in the HSM at the same time that you flash the initial firmware image. Your process must add a step to install the image on each device. After this step, you can run final quality checks and any other steps, before you package and ship the device. 

There are software tools available that let you run the installation process and final quality check in a single step. You can modify these tools to generate a certificate, or to pull a certificate from a pre-generated certificate store. Then the software can install the certificate where you need to install it. Software tools of this type enable you to run production quality manufacturing at scale. 

After you have certificates installed on your devices, the next step is to learn how to enroll the devices with [DPS](about-iot-dps.md). 

## Integrating a TPM into the manufacturing process
If you use a TPM to authenticate your IoT devices, this section offers guidance. The guidance covers the widely used TPM 2.0 devices that have hash-based message authentication code (HMAC) key support. The TPM specification for TPM chips is an ISO standard that's maintained by the Trusted Computing Group. For more on TPM, see the specifications for [TPM 2.0](https://trustedcomputinggroup.org/tpm-library-specification/) and [ISO/IEC 11889](https://www.iso.org/standard/66510.html). 

### Taking ownership of the TPM
A critical step in manufacturing a device with a TPM chip is to take ownership of the TPM. This step is required so that you can provide a key to the device owner. The first step is to extract the endorsement key (EK) from the device. The next step is to actually claim ownership. How you accomplish this depends on which TPM and operating system you use. If needed, contact the TPM manufacturer or the developer of the device operating system to determine how to claim ownership. 

In your manufacturing process, you can extract the EK and claim ownership at different times, which adds flexibility. Many manufacturers take advantage of this flexibility by adding a hardware security module (HSM) to enhance the security of their devices. This section provides guidance on when to extract the EK, when to claim ownership of the TPM, and considerations for integrating these steps into a manufacturing timeline. 

> [!IMPORTANT]
> The following guidance assumes you use a discrete, firmware, or integrated TPM. In places where it's applicable, the guidance adds notes on using a non-discrete or software TPM. If you use a software TPM, there may be additional steps that this guidance doesn't include. Software TPMs have a variety of implementations that are beyond the scope of this article.  In general, it's possible to integrate a software TPM into the following general manufacturing timeline. However, while a software emulated TPM is suitable for prototyping and testing, it can't provide the same level of security as a discrete, firmware, or integrated TPM. As a general practice, avoid using a software TPM in production.

### General manufacturing timeline
The following timeline shows how a TPM goes through a production process and ends up in a device. Each manufacturing process is unique, and this timeline shows the most common patterns. The timeline offers guidance on when to take certain actions with the keys. 

#### Step 1: TPM is manufactured
- If you buy TPMs from a manufacturer for use in your devices, see if they'll extract public endorsement keys (EK_pubs) for you. It's helpful if the manufacturer provides the list of EK_pubs with the shipped devices. 
    > [!NOTE]
    > You could give the TPM manufacturer write access to your enrollment list by using shared access policies in your provisioning service.  This approach lets them add the TPMs to your enrollment list for you.  But that is early in the manufacturing process, and it requires trust in the TPM manufacturer. Do so at your own risk. 

- If you manufacture TPMs to sell to device manufacturers, consider giving your customers a list of EK_pubs along with their physical TPMs.  Providing customers with EK_pubs saves a step in their process. 
- If you manufacture TPMs to use with your own devices, identify which point in your process is the most convenient to extract the EK_pub. You can extract the EK_pub at any of the remaining points in the timeline. 

#### Step 2: TPM is installed into a device
At this point in the production process, you should know which DPS instance the device will be used with. As a result, you can add devices to the enrollment list for automated provisioning. For more information about automatic device provisioning, see the [DPS documentation](about-iot-dps.md).
- If you haven't extracted the EK_pub, now is a good time to do so. 
- Depending on the installation process of the TPM, this step is also a good time to take ownership of the TPM. 

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

For more information, see [Autoprovisioning concepts](concepts-auto-provisioning.md) and [TPM attestation](concepts-tpm-attestation.md). 

## Resources

In addition to the recommended security practices in this article, Azure IoT provides resources to help with selecting secure hardware and creating secure IoT deployments: 
- Azure IoT [security recommendations](../iot-fundamentals/security-recommendations.md) to guide the deployment process. 
- The [Azure Security Center](https://azure.microsoft.com/services/security-center/) offers a service to help create secure IoT deployments. 
- For help with evaluating your hardware environment, see the whitepaper [Evaluating your IoT Security](https://download.microsoft.com/download/D/3/9/D3948E3C-D5DC-474E-B22F-81BA8ED7A446/Evaluating_Your_IOT_Security_whitepaper_EN_US.pdf). 
- For help with selecting secure hardware, see [The Right Secure Hardware for your IoT Deployment](https://download.microsoft.com/download/C/0/5/C05276D6-E602-4BB1-98A4-C29C88E57566/The_right_secure_hardware_for_your_IoT_deployment_EN_US.pdf). 