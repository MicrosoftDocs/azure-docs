---
title: Azure RTOS Security Guidance for Embedded Devices
description: Learn best practices for developing secure applications on embedded devices with Azure RTOS.
author: v-jbrannian
ms.author: v-jbrannian
ms.service: iot-develop
ms.topic: conceptual 
ms.date: 09/27/2021
---

# Guidelines to develop secure embedded applications with Azure RTOS

Intro text

## How to read this guide

Text about flags when it's decided

Throughout this guide we’ll reference security categories from the following two documents:

- The [IoT Security Maturity Model (SMM)](https://www.iiconsortium.org/smm.htm) proposes a standard set of security domains, subdomains, and practices as well as an iterative process you can use to understand, target, and implement security measures important for your device. This set of standards is targeted to all levels of IoT stakeholders and provides a process framework for considering security in the context of a component’s interactions in an IoT system.  

- The [Seven Properties of Highly Secured Devices](https://www.microsoft.com/research/publication/seven-properties-2nd-edition/) whitepaper published by Microsoft Research provides an overview of security properties that must be addressed to produce highly secure devices: Hardware root of trust, Defense in depth, Small trusted computing base, Dynamic compartments, Password-less authentication, Error reporting, and Renewable security. These properties are applicable, depending on cost constraints and target application and environment, to many embedded devices.
  
Some familiarity with these two documents might be helpful, but it’s not needed to understand the measures proposed in this topic.

## Embedded Security Components - Cryptography

Cryptography is a foundation of security in networked devices. While there exist some cases where cryptography may not be necessary for security, networking protocols like TLS rely on cryptography to protect and authenticate information travelling over a network or the public Internet. A secure IoT device that connects to a server or cloud service using TLS or similar protocols requires strong cryptography with protection for keys and secrets based in hardware. Most other security mechanisms provided by those protocols are built on cryptographic concepts, so having proper cryptographic support is the single most critical consideration in developing a secure connected IoT device.

### True random hardware-based entropy source

Any cryptographic application utilizing TLS or cryptographic operations that require random values for keys or secrets must have an approved random entropy source. Without proper true randomness, statistical methods can be used to derive keys and secrets much faster than brute-force attacks, weakening otherwise strong cryptography. Modern embedded devices should support some form of Cryptographic Random Number Generator (CRNG) or “True” Random Number Generator (TRNG) that can be used to feed the random number generator passed into a TLS application.

Hardware Random Number Generators (HRNG) supply some of the best sources of entropy. HRNGs typically generate values based on statistically random noise signals generated in a physical process rather than from a software algorithm. Many government agencies and standards bodies around the world provide guidelines for random number generators; for example, NIST in the US, ANSSI in France, BSI in Germany, and so on.

**Hardware**: True entropy can only come from hardware sources. There are various methods to obtain cryptographic randomness, but all require physical processes to be considered secure.

**Azure RTOS**: Azure RTOS utilizes random numbers for cryptography and TLS. Refer to the User Guide for each protocol in the [Azure RTOS NetX Duo documentation](/azure/rtos/netx-duo/overview-netx-duo) for more information.

**Application**: A random number function must be provided by the application developer and linked into the application, including Azure RTOS.

> [!IMPORTANT]
> The C library function `rand()` does NOT utilize a hardware-based RNG by default. It's critical to assure that a proper random routine is used. The setup will be specific to your hardware platform.

**7 Properties**: Hardware-based Root of Trust

**SMM Practices**: Implementation of Data Protection Controls, Establishing and Maintaining Identities

### Real-time capability

Real time capability is primarily needed for checking the expiration date of X.509 certificates, but TLS also uses timestamps as part of its session negotiation and certain applications may require accurate time reporting. There are many options for obtaining accurate time such as a Real-Time Clock (RTC) device, NTP to obtain time over a network, and GPS, which includes timekeeping.

> [!IMPORTANT] 
> Having an accurate time is nearly as critical as having a TRNG for secure applications that use TLS and X.509.

Many devices will use a hardware RTC backed by synchronization performed over a network service or GPS. Devices may also rely solely on an RTC or solely on a network service (or GPS). Regardless of the implementation, measures should be taken to prevent drift, protect hardware components from tampering, and guard against spoofing attacks when using network services or GPS. If an attacker can spoof time they can induce your device to accept expired certificates.

**Hardware**: If you implement a hardware RTC and NTP or other network-based solutions are unavailable for synching, the RTC should:

- be accurate enough for certificate expiration checks (hour resolution or better).
- be either updateable or resistant to drift over the lifetime of the device.
- maintain time across power failures or resets.

An invalid time will disrupt all TLS communication, possibly rendering the device unreachable.

**Azure RTOS**: Azure RTOS TLS uses time data for several security-related functions, but the application developer must provide a function for retrieving time data from the RTC or network. See the User Guide for TLS for more information.

**Application**: Depending on the time source used, the application may be required to initialize the functionality so that TLS can properly obtain the time information.

**7 Properties** : Hardware-based Root of Trust, Password-less Authentication, Renewable Security

**SMM Practices**: Implementation of Data Protection Controls

### Use approved cryptographic routines with strong key sizes

There are a wide variety of cryptographic routines available today. Research the cryptographic routines that you'll need and choose the strongest (largest) keys possible when designing your application. Look to NIST or other organizations that provide guidance on appropriate cryptography for different applications.

- Choose key sizes that are appropriate for your application. RSA is still acceptable in some organizations but only if the key is 2048 bits or larger. For AES, minimum key sizes of 128 bits are often required.
- Choose modern, widely-accepted algorithms and choose cipher modes that provide the highest level of security available for your application.
- Avoid using algorithms that are considered obsolete like DES and MDS.
- Consider the lifetime of your application and adjust your choices accordingly to account for continued reduction in the security of current routines and key sizes.
- Consider making key sizes and algorithms updateable to adjust to changing security requirements.
- Constant-time cryptography should be used whenever possible to mitigate timing attack vulnerabilities.

**Hardware**: If you're using hardware-based cryptography (which is recommended), your choices may be limited. Choose hardware that exceeds your minimum cryptographic and security needs and use the strongest routines and keys available on that platform.

**Azure RTOS**: Azure RTOS provides drivers for select cryptographic hardware platforms and software implementations for certain routines. Adding new routines and key sizes is straightforward.

**Application**: Applications that require cryptographic operations should also utilize the strongest approved routines possible.

**7 Properties**: Defense in Depth, Renewable Security

**SMM Practices**: Implementation of Data Protection Controls

### Hardware-based cryptography acceleration

Use of hardware cryptographic peripherals can speed up your application and provide additional security against timing attacks, which exploit the duration of a cryptographic operation to derive information about a secret key, by performing cryptographic operations in constant time regardless of the key or data properties. Every platform will likely be different as there is no accepted standard for cryptographic hardware (other than the accepted cryptographic algorithms like AES and RSA).  

> [!IMPORTANT]
> Hardware cryptographic acceleration does not necessarily equate to enhanced security. For example:
>
> - Some cryptographic accelerators implement only the ECB mode of the cipher, and it's left to the software developer to implement more secure modes like GCM, CCM, or CBC. ECB is not semantically secure.
>
> - Cryptographic accelerators often leave key protection to the software developer.
>

Combining hardware cryptography acceleration that implements secure cipher modes with hardware-based protection for keys provides a higher level of security for cryptographic operations.

**Hardware**: There are few standards for hardware cryptographic acceleration so each platform will vary in available functionality. Consult with your MCU vendor for more information.

**Azure RTOS**: Azure RTOS provides drivers for select cryptographic hardware platforms. Check your Azure RTOS Cryptography documentation for more information on hardware-based cryptography.

**Application**: Applications that require cryptographic operations should utilize all hardware-based cryptography that is available.

**7 Properties**: Hardware-based Root of Trust, Defense in Depth, Compartmentalization, Small Trusted Computing Base

**SMM Practices**: Implementation of Data Protection Controls

## Embedded Security Components – Device Identity

In IoT systems, the notion that each endpoint represents a unique physical device challenges some of the assumptions that are built into the modern Internet. As a result, a secure IoT device must be able to uniquely identify itself or an attacker could imitate a valid device for the purposes of stealing data, sending fraudulent information, or tampering with device functionality. Therefore, it is imperative that each IoT device that connects to a cloud service has a way to identify itself that is not easily bypassed.

### Unique verifiable device identifier

Content coming

### Credentials/certificates

