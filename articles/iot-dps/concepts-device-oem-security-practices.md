---
title: Security practices for manufacturers - Azure IoT Hub Device Provisioning Service
description: Overviews common security practices for OEMs and device manufactures who prepare devices to enroll in Azure IoT DPS. 
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
As more manufacturers release IoT devices, the Azure IoT Hub Device Provisioning Service (DPS) team has provided guidance on security practices for the manufacturing process. This article overviews key security practices to consider when you manufacture devices for DPS enrollment. 

> [!div class="checklist"]
> * Integrating a Trusted Platform Module (TPM) into the manufacturing process
> * Installing certificates on IoT devices
> * Selecting device authentication options

## Integrating a TPM into the manufacturing process
This article is only relevant for devices using TPM 2.0 with HMAC key support and their endorsement keys and not for devices using X.509 certificates for authentication. Check out this blog post to learn more about secure hardware with the Device Provisioning Service using X.509 certificates. TPM is an industry-wide, ISO standard from the Trusted Computing Group, and you can read more about TPM at the complete TPM 2.0 spec or the ISO/IEC 11889 spec.

At some point in the manufacturing process, you have to extract the endorsement key (EK) from the device and take ownership of the TPM so there's an owner key available to the device. The EK extraction and ownership claim can occur at different times in the manufacturing process, which is great because it provides a lot of flexibility for customers! However, a lot of folks are taking this opportunity to increase the security of their IoT devices by using an HSM (yay!), and so the TPM lifecycle is new to them (especially since a lot of the manufacturing process might still be in the design phase at this point). This post provides general guidance around when to extract the EK and when to claim ownership of the TPM so the owner key is produced.

A couple of notes on software TPMs:

    I'm assuming you're using a discrete, firmware, or integrated TPM, and I've included notes on using a software, or non-discrete, TPM where applicable. If you're using a software TPM, there may be additional steps that I don't call out. That's because software TPMs can have different implementations and I can't cover them all, but you should be able to figure out how it works for your particular software TPM based on the timeline below.
    Software emulated TPMs are well-suited for prototyping or testing, but they do not provide the same level of security as discrete, firmware, or integrated TPMs do. Please don't use software TPMs in production. Learn more about the types of TPMs.

The following is a general timeline of how the TPM goes through the production process and ends up in a device; each manufacturing process is a little different and this post only talks about the most common patterns. If you're new to manufacturing devices using a TPM, the below serves as guidance about when to do certain things with the keys. If you have been manufacturing devices using TPMs for a while, feel free to disregard if your current process is working well for you.
Step 1: TPM is manufactured

    If you are purchasing TPMs from a TPM manufacturer for use in your devices, see if they will extract the EK_pubs for you and provide you the list of EK_pubs in addition to the physical shipment. You may also give the TPM manufacturer write access to your enrollment list via the provisioning service's shared access policies and let them add the TPMs to your enrollment list for you, but this might be a little early in the production process and requires a certain amount of trust in the TPM manufacturer. Do so at your own risk.
    If you are manufacturing TPMs to sell to device manufacturers, consider providing your customers with a list of EK_pubs with their physical TPMs to save them a step.
    If you are manufacturing TPMs to use with your own devices, identify where in the manufacturing process is the most convenient to extract the EK_pub. This could occur at any of the later steps presented, and I trust you to understand your manufacturing process and when this could happen.

Step 2: TPM is installed into a device

At this point in the production process, you should know which Device Provisioning Service the device should talk to, and you can add devices to the enrollment list for automated provisioning. Learn more about automatic device provisioning with the Device Provisioning Service in documentation.

    If you haven't already, this may be a time to extract the EK_pub.
    Depending on the installation process, you can take ownership of the TPM at this time.

Step 3: Device has firmware and software installed

This is when the Device Provisioning Service client is installed with the ID scope and global URL for provisioning.

    This is the last chance to extract the EK_pub. If a third party is installing the software on your device, you probably want to have already extracted the EK_pub.
    This is when you want to take ownership of the TPM, because you're running things on the device anyway.
    Software TPM note: this may be when the software TPM is installed as well. You should extract the EK_pub at the time the software TPM is installed.

Step 4: Device is boxed-up and sent to the warehouse, awaiting final installation

The device might sit in a warehouse for 6-12 months before it is deployed in the field.
Step 5: Device is installed into the location

Once the device arrives at its final location, it goes through automated provisioning with the Device Provisioning Service.


Of course, every manufacturing process has its own unique characteristics and the above timeline may not exactly match your process. Use your best judgment, and contact Microsoft Support if you're having trouble.

Learn more about the TPM attestation in the Device Provisioning Service in this blog post.

This is an image:

## Installing certificates on IoT devices
One note before I begin, if you already have a system in place for installing certificates on your IoT devices and its working out for you, great! Feel free to stop reading and check out some of our other content. This blog post is for folks who are just making the switch to using certificates on IoT devices and are struggling with figuring out what works best.
Mandatory security rant

If you're coming from the land of passwords and want a quick fix, you might be asking yourself why you can't use the same certificate in all your devices like you would be able to use the same password in all your devices. First, using the same password everywhere is really bad practice and has already caused several major DDoS attacks, including the one that took down DNS on the US East Coast a few years back. So don't ever do this, even with your own personal accounts. Second, certificates are not passwords they are complete identities. A password is like knowing the secret phrase to get into the clubhouse, a certificate is the bouncer asking to see your driver's license. It's like if I got multiple copies made of my passport and gave you one to use for identification. Either you give my name and my passport and impersonate me (AKA spoof my identity), or you give your name and my passport and the border control agent kicks you out for not having an ID matching your name.
Variables involved in certificate decisions

There are several variables that come into play when you decide to use certificates in your IoT devices. The heavy hitters are as follows.

Where the certificate root of trust comes from. Make this decision based on your own cost tolerances and masochism levels – managing a public key infrastructure (PKI), especially if your company does not have experience doing so, is not for the faint of heart. Your options are:

    3rd party PKI in which you buy intermediate signing certificates (or a private CA) from a 3rd party cert vendor.
    Self-managed PKI in which you maintain your own PKI system and generate your own certificates.
    Azure Sphere's security service (only for Azure Sphere devices).

Where certificates are stored. This depends on the type of device you're building, the expected device margins (whether you can afford secure storage), the device's capabilities, and existing security technology on the device that may be leveraged. Your options are:

    In a hardware security module (HSM) (recommended!). Check whether your device's control board already has an HSM installed. I've talked to a couple customers who were surprised to find they had an HSM already installed in their devices that they just weren't using. If you know you don't have an HSM, work with your hardware manufacturer to identify an HSM that meets your needs.
    In a secure place on disk such as a trusted execution environment (TEE).
    Local file system or cert store, e.g. the Windows certificate store.
    Other

Connectivity at the factory. This determines how and when you get the certificates that will be installed on the devices. Your options are:

    Yes connectivity (can generate certs locally).
    No connectivity (factory has a signed CA cert it uses to generate device certs locally offline).
    No connectivity (certs need to be generated ahead of time, OR offline PKI).

Audit requirement. Depending on the type of devices you are producing, you may be required by regulations to have an auditable trail of how device identities are installed in your devices. Only do this if you need to since it can add significant costs to production. If you're not sure if this applies to you, check with your company's legal department. Your options are:

    Not a sensitive industry, no auditing required.
    Sensitive industry, certs need to be installed in a secure room according to various compliance certification requirements. If you need a secure room to install certificates, you probably already are aware of how certs get installed in your devices and already have a system in place. This post is probably not for you.

Length of cert validity. Like a driver's license, certificates have an expiration date that is set when they are created. Your options are:

    Very long, never will need to roll it. A very risky approach. Risk can be reduced using very secure storage like an HSM etc. However, the long-lived certificate approach is not recommended.
    Will need to roll during the lifetime of the device. This is context dependent and requires a strategy for how to roll certificates, where you're getting certificates from, and what type of over the air functionality exists for your devices.

When to generate certificates

As I mentioned in the previous section, connectivity at the factory plays an important role in determining when you generate the certificates for your devices. Let's talk about that.

Some HSM vendors offer a premium service in which the HSM vendor installs certificates in the HSMs on behalf of the customer. Customers give the HSM vendor access to a signing certificate and the HSM vendor installs certificates signed by that signing certificate on each HSM the customer buys. All the customer has to do is install the HSM on the device. One customer I've talked to who went this route says the process is pretty slick. If you choose to go the "preloaded in HSM" route, when to generate certificates is not your problem! Hooray!

If your devices internally generate their certificates, then you must extract the public X.509 certificate from the device for enrollment.

If your factory has connectivity, you can generate the certs whenever you need them.

If your factory does not have connectivity, and you are using your own PKI with offline support, then you can generate the certs whenever you need them.

If your factory does not have connectivity, and you are using a 3rd party PKI, you have to generate the certs ahead of time from an internet connected location.
When to install certificates

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
