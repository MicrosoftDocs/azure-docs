---
title: Azure RTOS security guidance for embedded devices
description: Learn best practices for developing secure applications on embedded devices with Azure RTOS.
author: edlamie80
ms.author: v-edlamie
ms.service: iot-develop
ms.topic: conceptual
ms.date: 11/29/2022
---

# Develop secure embedded applications with Azure RTOS

This article offers guidance on implementing security for IoT devices that run Azure RTOS and connect to Azure IoT services. Azure RTOS is a real-time operating system (RTOS) for embedded devices. It includes a networking stack and middleware and helps you securely connect your application to the cloud.

The security of an IoT application depends on your choice of hardware and how your application implements and uses security features. Use this article as a starting point to understand the main issues for further investigation.

## Microsoft security principles

When you design IoT devices, we recommend an approach based on the principle of *Zero Trust*. As a prerequisite to this article, read [Zero Trust: Cyber security for IoT](https://azure.microsoft.com/mediahandler/files/resourcefiles/zero-trust-cybersecurity-for-the-internet-of-things/Zero%20Trust%20Security%20Whitepaper_4.30_3pm.pdf). This brief paper outlines categories to consider when you implement security across an IoT ecosystem. Device security is emphasized.

The following sections discuss the key components for cryptographic security.

- **Strong identity:** Devices need a strong identity that includes the following technology solutions:

  - **Hardware root of trust**: This strong hardware-based identity should be immutable and backed by hardware isolation and protection mechanisms.
  - **Passwordless authentication**: This type of authentication is often achieved by using X.509 certificates and asymmetric cryptography, where private keys are secured and isolated in hardware. Use passwordless authentication for the device identity in onboarding or attestation scenarios and the device's operational identity with other cloud services.
  - **Renewable credentials**: Secure the device's operational identity by using renewable, short-lived credentials. X.509 certificates backed by a secure public key infrastructure (PKI) with a renewal period appropriate for the device's security posture provide an excellent solution.

- **Least-privileged access:** Devices should enforce least-privileged access control on local resources across workloads. For example, a firmware component that reports battery level shouldn't be able to access a camera component.
- **Continual updates**: A device should enable the over-the-air (OTA) feature, such as the [Device Update for IoT Hub](../iot-hub-device-update/device-update-azure-real-time-operating-system.md) to push the firmware that contains the patches or bug fixes.
- **Security monitoring and responses**: A device should be able to proactively report the security postures for the solution builder to monitor the potential threats for a large number of devices. You can use [Microsoft Defender for IoT](../defender-for-iot/device-builders/concept-rtos-security-module.md) for that purpose.

## Embedded security components: Cryptography

Cryptography is a foundation of security in networked devices. Networking protocols such as Transport Layer Security (TLS) rely on cryptography to protect and authenticate information that travels over a network or the public internet.

A secure IoT device that connects to a server or cloud service by using TLS or similar protocols requires strong cryptography with protection for keys and secrets that are based in hardware. Most other security mechanisms provided by those protocols are built on cryptographic concepts. Proper cryptographic support is the most critical consideration when you develop a secure connected IoT device.

The following sections discuss the key components for cryptographic security.

### True random hardware-based entropy source

Any cryptographic application using TLS or cryptographic operations that require random values for keys or secrets must have an approved random entropy source. Without proper true randomness, statistical methods can be used to derive keys and secrets much faster than brute-force attacks, weakening otherwise strong cryptography.

Modern embedded devices should support some form of cryptographic random number generator (CRNG) or "true" random number generator (TRNG). CRNGs and TRNGs are used to feed the random number generator that's passed into a TLS application.

Hardware random number generators (HRNGs) supply some of the best sources of entropy. HRNGs typically generate values based on statistically random noise signals generated in a physical process rather than from a software algorithm.

Government agencies and standards bodies around the world provide guidelines for random number generators. Some examples are the National Institute of Standards and Technology (NIST) in the US, the National Cybersecurity Agency of France, and the Federal Office for Information Security in Germany.

**Hardware**: True entropy can only come from hardware sources. There are various methods to obtain cryptographic randomness, but all require physical processes to be considered secure.

**Azure RTOS**: Azure RTOS uses random numbers for cryptography and TLS. For more information, see the user guide for each protocol in the [Azure RTOS NetX Duo documentation](/azure/rtos/netx-duo/overview-netx-duo).

**Application**: You must provide a random number function and link it into your application, including Azure RTOS.  

> [!IMPORTANT]
> The C library function `rand()` does *not* use a hardware-based RNG by default. It's critical to assure that a proper random routine is used. The setup is specific to your hardware platform.

### Real-time capability

Real-time capability is primarily needed for checking the expiration date of X.509 certificates. TLS also uses timestamps as part of its session negotiation. Certain applications might require accurate time reporting. Options for obtaining accurate time include:

- A real-time clock (RTC) device.
- The Network Time Protocol (NTP) to obtain time over a network.
- A Global Positioning System (GPS), which includes timekeeping.

> [!IMPORTANT]
> Accurate time is nearly as critical as a TRNG for secure applications that use TLS and X.509.

Many devices use a hardware RTC backed by synchronization over a network service or GPS. Devices might also rely solely on an RTC or on a network service or GPS. Regardless of the implementation, take measures to prevent drift.

You also need to protect hardware components from tampering. And you need to guard against spoofing attacks when you use network services or GPS. If an attacker can spoof time, they can induce your device to accept expired certificates.

**Hardware**: If you implement a hardware RTC and NTP or other network-based solutions are unavailable for syncing, the RTC should:

- Be accurate enough for certificate expiration checks of an hour resolution or better.
- Be securely updatable or resistant to drift over the lifetime of the device.
- Maintain time across power failures or resets.

An invalid time disrupts all TLS communication. The device might even be rendered unreachable.

**Azure RTOS**: Azure RTOS TLS uses time data for several security-related functions. You must provide a function for retrieving time data from the RTC or network. For more information, see the [NetX secure TLS user guide](/azure/rtos/netx-duo/netx-secure-tls/chapter1).

**Application**: Depending on the time source used, your application might be required to initialize the functionality so that TLS can properly obtain the time information.

### Use approved cryptographic routines with strong key sizes

Many cryptographic routines are available today. When you design an application, research the cryptographic routines that you'll need. Choose the strongest and largest keys possible. Look to NIST or other organizations that provide guidance on appropriate cryptography for different applications. Consider these factors:

- Choose key sizes that are appropriate for your application. Rivest-Shamir-Adleman (RSA) encryption is still acceptable in some organizations, but only if the key is 2048 bits or larger. For the Advanced Encryption Standard (AES), minimum key sizes of 128 bits are often required.
- Choose modern, widely accepted algorithms. Choose cipher modes that provide the highest level of security available for your application.
- Avoid using algorithms that are considered obsolete like the Data Encryption Standard and the Message Digest Algorithm 5.
- Consider the lifetime of your application. Adjust your choices to account for continued reduction in the security of current routines and key sizes.
- Consider making key sizes and algorithms updatable to adjust to changing security requirements.
- Use constant-time cryptographic techniques whenever possible to mitigate timing attack vulnerabilities.

**Hardware**: If you use hardware-based cryptography, your choices might be limited. Choose hardware that exceeds your minimum cryptographic and security needs. Use the strongest routines and keys available on that platform.

**Azure RTOS**: Azure RTOS provides drivers for select cryptographic hardware platforms and software implementations for certain routines. Adding new routines and key sizes is straightforward.

**Application**: If your application requires cryptographic operations, use the strongest approved routines possible.

### Hardware-based cryptography acceleration

Cryptography implemented in hardware for acceleration is there to unburden CPU cycles. It almost always requires software that applies it to achieve security goals. Timing attacks exploit the duration of a cryptographic operation to derive information about a secret key.

When you perform cryptographic operations in constant time, regardless of the key or data properties, hardware cryptographic peripherals prevent this kind of attack. Every platform is likely to be different. There's no accepted standard for cryptographic hardware. Exceptions are the accepted cryptographic algorithms like AES and RSA.

> [!IMPORTANT]
> Hardware cryptographic acceleration doesn't necessarily equate to enhanced security. For example:
>
> - Some cryptographic accelerators implement only the Electronic Codebook (ECB) mode of the cipher. You must implement more secure modes like Galois/Counter Mode, Counter with CBC-MAC, or Cipher Block Chaining (CBC). ECB isn't semantically secure.
>
> - Cryptographic accelerators often leave key protection to the developer.
>

Combine hardware cryptography acceleration that implements secure cipher modes with hardware-based protection for keys. The combination provides a higher level of security for cryptographic operations.

**Hardware**: There are few standards for hardware cryptographic acceleration, so each platform varies in available functionality. For more information, see with your microcontroller unit (MCU) vendor.

**Azure RTOS**: Azure RTOS provides drivers for select cryptographic hardware platforms. For more information on hardware-based cryptography, check your Azure RTOS cryptography documentation.

**Application**: If your application requires cryptographic operations, make use of all hardware-based cryptography that's available.

## Embedded security components: Device identity

In IoT systems, the notion that each endpoint represents a unique physical device challenges some of the assumptions that are built into the modern internet. As a result, a secure IoT device must be able to uniquely identify itself. If not, an attacker could imitate a valid device to steal data, send fraudulent information, or tamper with device functionality.

Confirm that each IoT device that connects to a cloud service identifies itself in a way that can't be easily bypassed.

The following sections discuss the key security components for device identity.

### Unique verifiable device identifier

A unique device identifier is known as a device ID. It allows a cloud service to verify the identity of a specific physical device. It also verifies that the device belongs to a particular group. A device ID is the digital equivalent of a physical serial number. It must be globally unique and protected. If the device ID is compromised, there's no way to distinguish between the physical device it represents and a fraudulent client.

In most modern connected devices, the device ID is tied to cryptography. For example:

- It might be a private-public key pair, where the private key is globally unique and associated only with the device.
- It might be a private-public key pair, where the private key is associated with a set of devices and is used in combination with another identifier that's unique to the device.
- It might be cryptographic material that's used to derive private keys unique to the device.

Regardless of implementation, the device ID and any associated cryptographic material must be hardware protected. For example, use a hardware security module (HSM).

The device ID can be used for client authentication with a cloud service or server. It's best to split the device ID from operational certificates typically used for such purposes. To lessen the attack surface, operational certificates should be short-lived. The public portion of the device ID shouldn't be widely distributed. Instead, the device ID can be used to sign or derive private keys associated with operational certificates.

> [!NOTE]
> A device ID is tied to a physical device, usually in a cryptographic manner. It provides a root of trust. It can be thought of as a "birth certificate" for the device. A device ID represents a unique identity that applies to the entire lifespan of the device.
>
> Other forms of IDs, such as for attestation or operational identification, are updated periodically, like a driver's license. They frequently identify the owner. Security is maintained by requiring periodic updates or renewals.
>
> Just like a birth certificate is used to get a driver's license, the device ID is used to get an operational ID. Within IoT, both the device ID and operational ID are frequently provided as X.509 certificates. They use the associated private keys to cryptographically tie the IDs to the specific hardware.

**Hardware**: Tie a device ID to the hardware. It must not be easily replicated. Require hardware-based cryptographic features like those found in an HSM. Some MCU devices might provide similar functionality.

**Azure RTOS**: No specific Azure RTOS features use device IDs. Communication to cloud services via TLS might require an X.509 certificate that's tied to the device ID.

**Application**: No specific features are required for user applications. A unique device ID might be required for certain applications.

### Certificate management

If your device uses a certificate from a PKI, your application needs to update those certificates periodically. The need to update is true for the device and any trusted certificates used for verifying servers. More frequent updates improve the overall security of your application.

**Hardware**: Tie all certificate private keys to your device. Ideally, the key is generated internally by the hardware and is never exposed to your application. Mandate the ability to generate X.509 certificate requests on the device.

**Azure RTOS**: Azure RTOS TLS provides basic X.509 certificate support. Certificate revocation lists (CRLs) and policy parsing are supported. They require manual management in your application without a supporting SDK.

**Application**: Make use of CRLs or Online Certificate Status Protocol to validate that certificates haven't been revoked by your PKI. Make sure to enforce X.509 policies, validity periods, and expiration dates required by your PKI.

### Attestation

Some devices provide a secret key or value that's uniquely loaded into each specific device. Usually,  permanent fuses are used. The secret key or value is used to check the ownership or status of the device. Whenever possible, it's best to use this hardware-based value, though not necessarily directly. Use it as part of any process where the device needs to identify itself to a remote host.

This value is coupled with a secure boot mechanism to prevent fraudulent use of the secret ID. Depending on the cloud services being used and their PKI, the device ID might be tied to an X.509 certificate. Whenever possible, the attestation device ID should be separate from "operational" certificates used to authenticate a device.

Device status in attestation scenarios can include information to help a service determine the device's state. Information can include firmware version and component health. It can also include life-cycle state, for example, running versus debugging. Device attestation is often involved in OTA firmware update protocols to ensure that the correct updates are delivered to the intended device.

> [!NOTE]
> "Attestation" is distinct from "authentication." Attestation uses an external authority to determine whether a device belongs to a particular group by using cryptography. Authentication uses cryptography to verify that a host (device) owns a private key in a challenge-response process, such as the TLS handshake.

**Hardware**: The selected hardware must provide functionality to provide a secret unique identifier. This functionality is tied into cryptographic hardware like a TPM or HSM. A specific API is required for attestation services.

**Azure RTOS**: No specific Azure RTOS functionality is required.

**Application**: The user application might be required to implement logic to tie the hardware features to whatever attestation the chosen cloud service requires.

## Embedded security components: Memory protection

Many successful hacking attacks use buffer overflow errors to gain access to privileged information or even to execute arbitrary code on a device. Numerous technologies and languages have been created to battle overflow problems. Because system-level embedded development requires low-level programming, most embedded development is done by using C or assembly language.

These languages lack modern memory protection schemes but allow for less restrictive memory manipulation. Because built-in protection is lacking, you must be vigilant about memory corruption. The following recommendations make use of functionality provided by some MCU platforms and Azure RTOS itself to help mitigate the effect of overflow errors on security.

The following sections discuss the key security components for memory protection.

### Protection against reading or writing memory

An MCU might provide a latching mechanism that enables a tamper-resistant state. It works either by preventing reading of sensitive data or by locking areas of memory from being overwritten. This technology might be part of, or in addition to, a Memory Protection Unit (MPU) or a Memory Management Unit (MMU).

**Hardware**: The MCU must provide the appropriate hardware and interface to use memory protection.

**Azure RTOS**: If the memory protection mechanism isn't an MMU or MPU, Azure RTOS doesn't require any specific support. For more advanced memory protection, you can use Azure RTOS ThreadX Modules for detailed control over memory spaces for threads and other RTOS control structures.

**Application**: Application developers might be required to enable memory protection when the device is first booted. For more information, see secure boot documentation. For simple mechanisms that aren't MMU or MPU, the application might place sensitive data like certificates into the protected memory region. The application can then access the data by using the hardware platform APIs.

### Application memory isolation

If your hardware platform has an MMU or MPU, those features can be used to isolate the memory spaces used by individual threads or processes. Sophisticated mechanisms like Trust Zone also provide protections beyond what a simple MPU can do. This isolation can thwart attackers from using a hijacked thread or process to corrupt or view memory in another thread or process.

**Hardware**: The MCU must provide the appropriate hardware and interface to use memory protection.

**Azure RTOS**: Azure RTOS allows for ThreadX Modules that are built independently or separately and are provided with their own instruction and data area addresses at runtime. Memory protection can then be enabled so that a context switch to a thread in a module disallows code from accessing memory outside of the assigned area.

> [!NOTE]
> TLS and Message Queuing Telemetry Transport (MQTT) aren't yet supported from ThreadX Modules.

**Application**: You might be required to enable memory protection when the device is first booted. For more information, see secure boot and ThreadX Modules documentation. Use of ThreadX Modules might introduce more memory and CPU overhead.

### Protection against execution from RAM

Many MCU devices contain an internal "program flash" where the application firmware is stored. The application code is sometimes run directly from the flash hardware and uses the RAM only for data.

If the MCU allows execution of code from RAM, look for a way to disable that feature. Many attacks try to modify the application code in some way. If the attacker can't execute code from RAM, it's more difficult to compromise the device.

Placing your application in flash makes it more difficult to change. Flash technology requires an unlock, erase, and write process. Although flash increases the challenge for an attacker, it's not a perfect solution. To provide for renewable security, the flash needs to be updatable. A read-only code section is better at preventing attacks on executable code, but it prevents updating.

**Hardware**: Presence of a program flash used for code storage and execution. If running in RAM is required, consider using an MMU or MPU, if available. Use of an MMU or MPU protects from writing to the executable memory space.

**Azure RTOS**: No specific features.

**Application**: The application might need to disable flash writing during secure boot depending on the hardware.

### Memory buffer checking

Avoiding buffer overflow problems is a primary concern for code running on connected devices. Applications written in unmanaged languages like C are susceptible to buffer overflow issues. Safe coding practices can alleviate some of the problems.

Whenever possible, try to incorporate buffer checking into your application. You might be able to make use of built-in features of the selected hardware platform, third-party libraries, and tools. Even features in the hardware itself can provide a mechanism for detecting or preventing overflow conditions.

**Hardware**: Some platforms might provide memory checking functionality. Consult with your MCU vendor for more information.

**Azure RTOS**: No specific Azure RTOS functionality is provided.

**Application**: Follow good coding practice by requiring applications to always supply buffer size or the number of elements in an operation. Avoid relying on implicit terminators such as NULL. With a known buffer size, the program can check bounds during memory or array operations, such as when calling APIs like `memcpy`. Try to use safe versions of APIs like `memcpy_s`.

### Enable runtime stack checking

Preventing stack overflow is a primary security concern for any application. Whenever possible, use Azure RTOS stack checking features. These features are covered in the Azure RTOS ThreadX user guide.

**Hardware**: Some MCU platform vendors might provide hardware-based stack checking. Use any functionality that's available.

**Azure RTOS**: Azure RTOS ThreadX provides some stack checking functionality that can be optionally enabled at compile time. For more information, see the [Azure RTOS ThreadX documentation](/azure/rtos/threadx/).

**Application**: Certain compilers such as IAR also have "stack canary" support that helps to catch stack overflow conditions. Check your tools to see what options are available and enable them if possible.

## Embedded security components: Secure boot and firmware update

 An IoT device, unlike a traditional embedded device, is often connected over the internet to a cloud service for monitoring and data gathering. As a result, it's nearly certain that the device will be probed in some way. Probing can lead to an attack if a vulnerability is found.

A successful attack might result in the discovery of an unknown vulnerability that compromises the device. Other devices of the same kind could also be compromised. For this reason, it's critical that an IoT device can be updated quickly and easily. The firmware image itself must be verified because if an attacker can load a compromised image onto a device, that device is lost.

The solution is to pair a secure boot mechanism with remote firmware update capability. This capability is also called an OTA update. Secure boot verifies that a firmware image is valid and trusted. An OTA update mechanism allows updates to be quickly and securely deployed to the device.

The following sections discuss the key security components for secure boot and firmware update.

### Secure boot

It's vital that a device can prove it's running valid firmware upon reset. Secure boot prevents the device from running untrusted or modified firmware images. Secure boot mechanisms are tied to the hardware platform. They validate the firmware image against internally protected measurements before loading the application. If validation fails, the device refuses to boot the corrupted image.

**Hardware**: MCU vendors might provide their own proprietary secure boot mechanisms because secure boot is tied to the hardware.

**Azure RTOS**: No specific Azure RTOS functionality is required for secure boot. Third-party commercial vendors offer secure boot products.

**Application**: The application might be affected by secure boot if OTA updates are enabled. The application itself might need to be responsible for retrieving and loading new firmware images. OTA update is tied to secure boot. You need to build the application with versioning and code-signing to support updates with secure boot.

### Firmware or OTA update

An OTA update, sometimes referred to as a firmware update, involves updating the firmware image on your device to a new version to add features or fix bugs. OTA update is important for security because vulnerabilities that are discovered must be patched as soon as possible.

> [!NOTE]
> OTA updates *must* be tied to secure boot and code signing. Otherwise, it's impossible to validate that new images aren't compromised.

**Hardware**: Various implementations for OTA update exist. Some MCU vendors provide OTA update solutions that are tied to their hardware. Some OTA update mechanisms can also use extra storage space, for example, flash. The storage space is used for rollback protection and to provide uninterrupted application functionality during update downloads.

**Azure RTOS**: No specific Azure RTOS functionality is required for OTA updates.

**Application**: Third-party software solutions for OTA update also exist and might be used by an Azure RTOS application. You need to build the application with versioning and code-signing to support updates with secure boot.

### Roll back or downgrade protection

Secure boot and OTA update must work together to provide an effective firmware update mechanism. Secure boot must be able to ingest a new firmware image from the OTA mechanism and mark the new version as being trusted.

The OTA and secure boot mechanism must also protect against downgrade attacks. If an attacker can force a rollback to an earlier trusted version that has known vulnerabilities, the OTA and secure boot fails to provide proper security.

Downgrade protection also applies to revoked certificates or credentials.

**Hardware**: No specific hardware functionality is required, except as part of secure boot, OTA, or certificate management.

**Azure RTOS**: No specific Azure RTOS functionality is required.

**Application**: No specific application support is required, depending on requirements for OTA, secure boot, and certificate management.

### Code signing

Make use of any features for signing and verifying code or credential updates. Code signing involves generating a cryptographic hash of the firmware or application image. That hash is used to verify the integrity of the image received by the device. Typically, a trusted root X.509 certificate is used to verify the hash signature. This process is tied into secure boot and OTA update mechanisms.

**Hardware**: No specific hardware functionality is required except as part of OTA update or secure boot. Use hardware-based signature verification if it's available.

**Azure RTOS**: No specific Azure RTOS functionality is required.

**Application**: Code signing is tied to secure boot and OTA update mechanisms to verify the integrity of downloaded firmware images.

## Embedded security components: Protocols

The following sections discuss the key security components for protocols.

### Use the latest version of TLS possible for connectivity

Support current TLS versions:

- TLS 1.2 is currently (as of 2022) the most widely used TLS version.
- TLS 1.3 is the latest TLS version. Finalized in 2018, TLS 1.3 adds many security and performance enhancements. It isn't widely deployed. If your application can support TLS 1.3, we recommend it for new applications.

> [!NOTE]
> TLS 1.0 and TLS 1.1 are obsolete protocols. Don't use them for new application development. They're disabled by default in Azure RTOS.

**Hardware**: No specific hardware requirements.

**Azure RTOS**: TLS 1.2 is enabled by default. TLS 1.3 support must be explicitly enabled in Azure RTOS because TLS 1.2 is still the de-facto standard.

Also ensure the below corresponding NetX Secure configurations are set. Refer to the [list of configurations](/azure/rtos/netx-duo/netx-secure-tls/chapter2#configuration-options) for details.

```c
/* Enables secure session renegotiation extension */
#define NX_SECURE_TLS_DISABLE_SECURE_RENEGOTIATION 0

/* Disables protocol version downgrade for TLS client. */
#define NX_SECURE_TLS_DISABLE_PROTOCOL_VERSION_DOWNGRADE
```

When setting up NetX TLS, use [`nx_secure_tls_session_time_function_set()`](/azure/rtos/netx-duo/netx-secure-tls/chapter4#nx_secure_tls_session_time_function_set) to set a timing function that returns the current GMT in UNIX 32-bit format to enable checking of the certification expirations.

**Application**: To use TLS with cloud services, a certificate is required. The certificate must be managed by the application.

### Use X.509 certificates for TLS authentication

X.509 certificates are used to authenticate a device to a server and a server to a device. A device certificate is used to prove the identity of a device to a server.

Trusted root CA certificates are used by a device to authenticate a server or service to which it connects. The ability to update these certificates is critical. Certificates can be compromised and have limited lifespans.

Use hardware-based X.509 certificates with TLS mutual authentication and a PKI with active monitoring of certificate status for the highest level of security.

**Hardware**: No specific hardware requirements.

**Azure RTOS**: Azure RTOS TLS provides basic X.509 authentication through TLS and some user APIs for further processing.

**Application**: Depending on requirements, the application might have to enforce X.509 policies. CRLs should be enforced to ensure revoked certificates are rejected.

### Use the strongest cryptographic options and cipher suites for TLS

Use the strongest cryptography and cipher suites available for TLS. You need the ability to update TLS and cryptography. Over time, certain cipher suites and TLS versions might become compromised or discontinued.

**Hardware**: If cryptographic acceleration is available, use it.

**Azure RTOS**: Azure RTOS TLS provides hardware drivers for select devices that support cryptography in hardware. For routines not supported in hardware, the [Azure RTOS cryptography library](/azure/rtos/netx/netx-crypto/chapter1) is designed specifically for embedded systems. A FIPS 140-2 certified library that uses the same code base is also available.

**Application**: Applications that use TLS should choose cipher suites that use hardware-based cryptography when it's available. They should also use the strongest keys available. Note the following TLS Cipher Suites, supported in TLS 1.2, don't provide forward secrecy:

- **TLS_RSA_WITH_AES_128_CBC_SHA256**
- **TLS_RSA_WITH_AES_256_CBC_SHA256**

Consider using **TLS_RSA_WITH_AES_128_GCM_SHA256** if available.

SHA1 (128-bit) is no longer considered cryptographically secure. Avoid using cipher suites that engage SHA1 (such as **TLS_RSA_WITH_AES_128_CBC_SHA**) if possible.  

AES/CBC mode is susceptible to Lucky-13 attacks. Application shall use AES-GCM (such as **TLS_RSA_WITH_AES_128_GCM_SHA256**). 

### TLS mutual certificate authentication

When you use X.509 authentication in TLS, opt for mutual certificate authentication. With mutual authentication, both the server and client must provide a verifiable certificate for identification.

Use hardware-based X.509 certificates with TLS mutual authentication and a PKI with active monitoring of certificate status for the highest level of security.

**Hardware**: No specific hardware requirements.

**Azure RTOS**: Azure RTOS TLS provides support for mutual certificate authentication in both TLS server and client applications. For more information, see the [Azure RTOS NetX secure TLS documentation](/azure/rtos/netx-duo/netx-secure-tls/chapter1#netx-secure-unique-features).

**Application**: Applications that use TLS should always default to mutual certificate authentication whenever possible. Mutual authentication requires TLS clients to have a device certificate. Mutual authentication is an optional TLS feature, but you should use it when possible.

### Only use TLS-based MQTT

If your device uses MQTT for cloud communication, only use MQTT over TLS.

**Hardware**: No specific hardware requirements.

**Azure RTOS**: Azure RTOS provides MQTT over TLS as a default configuration.

**Application**: Applications that use MQTT should only use TLS-based MQTT with mutual certificate authentication.

## Embedded security components: Application design and development

The following sections discuss the key security components for application design and development.

### Disable debugging features

For development, most MCU devices use a JTAG interface or similar interface to provide information to debuggers or other applications. If you leave a debugging interface enabled on your device, you give an attacker an easy door into your application. Make sure to disable all debugging interfaces. Also remove associated debugging code from your application before deployment.

**Hardware**: Some devices might have hardware support to disable debugging interfaces permanently or the interface might be able to be removed physically from the device. Removing the interface physically from the device does *not* mean the interface is disabled. You might need to disable the interface on boot, for example, during a secure boot process. Always disable the debugging interface in production devices.

**Azure RTOS**: Not applicable.

**Application**: If the device doesn't have a feature to permanently disable debugging interfaces, the application might have to disable those interfaces on boot. Disable debugging interfaces as early as possible in the boot process. Preferably, disable those interfaces during a secure boot before the application is running.

### Watchdog timers

When available, an IoT device should use a watchdog timer to reset an unresponsive application. Resetting the device when time runs out limits the amount of time an attacker might have to execute an exploit.

The watchdog can be reinitialized by the application. Some basic integrity checks can also be done like looking for code executing in RAM, checksums on data, and identity checks. If an attacker doesn't account for the watchdog timer reset while trying to compromise the device, the device would reboot into a (theoretically) clean state. A secure boot mechanism would be required to verify the identity of the application image.

**Hardware**: Watchdog timer support in hardware, secure boot functionality.

**Azure RTOS**: No specific Azure RTOS functionality is required.

**Application**: Watchdog timer management. For more information, see the device hardware platform documentation.

### Remote error logging

Use cloud resources to record and analyze device failures remotely. Aggregate errors to find patterns that indicate possible vulnerabilities or attacks.

**Hardware**: No specific hardware requirements.

**Azure RTOS**: No specific Azure RTOS requirements. Consider logging Azure RTOS API return codes to look for specific problems with lower-level protocols that might indicate problems. Examples include TLS alert causes and TCP failures.

**Application**: Use logging libraries and your cloud service's client SDK to push error logs to the cloud. In the cloud, logs can be stored and analyzed safely without using valuable device storage space. Integration with [Microsoft Defender for IoT](https://azure.microsoft.com/services/azure-defender-for-iot/) provides this functionality and more. Microsoft Defender for IoT provides agentless monitoring of devices in an IoT solution. Monitoring can be enhanced by including the [Microsoft Defender for IOT micro-agent for Azure RTOS](../defender-for-iot/device-builders/iot-security-azure-rtos.md) on your device. For more information, see the [Runtime security monitoring and threat detection](#runtime-security-monitoring-and-threat-detection) recommendation.

Microsoft Defender for IoT provides agentless monitoring of devices in an IoT solution. Monitoring can be enhanced by including the [Microsoft Defender for IOT micro-agent for Azure RTOS](../defender-for-iot/device-builders/iot-security-azure-rtos.md) on your device. For more information, see the [Runtime security monitoring and threat detection](#runtime-security-monitoring-and-threat-detection) recommendation.

### Disable unused protocols and features

RTOS and MCU-based applications typically have a few dedicated functions. This feature is in sharp contrast to general-purpose computing machines running higher-level operating systems, such as Windows and Linux. These machines enable dozens or hundreds of protocols and features by default.

When you design an RTOS MCU application, look closely at what networking protocols are required. Every protocol that's enabled represents a different avenue for attackers to gain a foothold within the device. If you don’t need a feature or protocol, don't enable it.

**Hardware**: No specific hardware requirements. If the platform allows unused peripherals and ports to be disabled, use that functionality to reduce your attack surface.

**Azure RTOS**: Azure RTOS has a "disabled by default" philosophy. Only enable protocols and features that are required for your application. Resist the temptation to enable features "just in case."

**Application**: When you design your application, try to reduce the feature set to the bare minimum. Fewer features make an application easier to analyze for security vulnerabilities. Fewer features also reduce your application attack surface.

### Use all possible compiler and linker security features

Modern compilers and linkers provide many options for more security at build time. When you build your application, use as many compiler- and linker-based options as possible. They'll improve your application with proven security mitigations. Some options might affect size, performance, or RTOS functionality. Be careful when you enable certain features.

**Hardware**: No specific hardware requirements. Your hardware platform might support security features that can be enabled during the compiling or linking processes.

**Azure RTOS**: As an RTOS, some compiler-based security features might interfere with the real-time guarantees of Azure RTOS. Consider your RTOS needs when you select compiler options and test them thoroughly.

**Application**: If you use other development tools, consult your documentation for appropriate options. In general, the following guidelines should help you build a more secure configuration:

- Enable maximum error and warning levels for all builds. Production code should compile and link cleanly with no errors or warnings.
- Enable all runtime checking that's available. Examples include stack checking, buffer overflow detection, Address Space Layout Randomization (ASLR), and integer overflow detection.
- Some tools and devices might provide options to place code in protected or read-only areas of memory. Make use of any available protection mechanisms to prevent an attacker from being able to run arbitrary code on your device. Making code read-only doesn't completely protect against arbitrary code execution, but it does help.

### Make sure memory access alignment is correct

Some MCU devices permit unaligned memory access, but others don't. Consider the properties of your specific device when you develop your application.

**Hardware**: Memory access alignment behavior is specific to your selected device.

**Azure RTOS**: For processors that do *not* support unaligned access, ensure that the macro `NX_CRYPTO_DISABLE_UNALIGNED_ACCESS` is defined. Failure to do so results in possible CPU faults during certain cryptographic operations.

**Application**: In any memory operation like copy or move, consider the memory alignment behavior of your hardware platform.

### Runtime security monitoring and threat detection

Connected IoT devices might not have the necessary resources to implement all security features locally. With connection to the cloud, you can use remote security options to improve the security of your application. These options don't add significant overhead to the embedded device.

**Hardware**: No specific hardware features required other than a network interface.

**Azure RTOS**: Azure RTOS supports [Microsoft Defender for IoT](https://azure.microsoft.com/services/azure-defender-for-iot/).

**Application**: The [Microsoft Defender for IOT micro-agent for Azure RTOS](../defender-for-iot/device-builders/iot-security-azure-rtos.md) provides a comprehensive security solution for Azure RTOS devices. The module provides security services via a small software agent that's built into your device's firmware and comes as part of Azure RTOS. The service includes detection of malicious network activities, device behavior baselining based on custom alerts, and recommendations that will help to improve the security hygiene of your devices. Whether you're using Azure RTOS in combination with Azure Sphere or not, the Microsoft Defender for IoT micro-agent provides an extra layer of security that's built into the RTOS by default.

## Azure RTOS IoT application security checklist

The previous sections detailed specific design considerations with descriptions of the necessary hardware, operating system, and application requirements to help mitigate security threats. This section provides a basic checklist of security-related issues to consider when you design and implement IoT applications with Azure RTOS.

This short list of measures is meant as a complement to, not a replacement for, the more detailed discussion in previous sections. You must perform a comprehensive analysis of the physical and cybersecurity threats posed by the environment your device will be deployed into. You also need to carefully consider and rigorously implement measures to mitigate those threats. The goal is to provide the highest possible level of security for your device.

The service includes detection of malicious network activities, device behavior baselining based on custom alerts, and recommendations to help improve the security hygiene of your devices.

Whether you're using Azure RTOS in combination with Azure Sphere or not, the Microsoft Defender for IoT micro-agent provides another layer of security that's built into the RTOS by default.

### Security measures to take

- Always use a hardware source of entropy (CRNG, TRNG based in hardware). Azure RTOS uses a macro (`NX_RAND`) that allows you to define your random function.
- Always supply a real-time clock for calendar date and time to check certificate expiration.
- Use CRLs to validate certificate status. With Azure RTOS TLS, a CRL is retrieved by the application and passed via a callback to the TLS implementation. For more information, see the [NetX secure TLS user guide](/azure/rtos/netx-duo/netx-secure-tls/chapter1).
- Use the X.509 "Key Usage" extension when possible to check for certificate acceptable uses. In Azure RTOS, the use of a callback to access the X.509 extension information is required.
- Use X.509 policies in your certificates that are consistent with the services to which your device will connect. An example is ExtendedKeyUsage.
- Use approved cipher suites in the Azure RTOS Crypto library:

  - Supplied examples provide the required cipher suites to be compatible with TLS RFCs, but stronger cipher suites might be more suitable. Cipher suites include multiple ciphers for different TLS operations, so choose carefully. For example, using Elliptic-Curve Diffie-Hellman Ephemeral (ECDHE) might be preferable to RSA for key exchange, but the benefits can be lost if the cipher suite also uses RC4 for application data. Make sure every cipher in a cipher suite meets your security needs.
  - Remove cipher suites that aren't needed. Doing so saves space and provides extra protection against attack.
  - Use hardware drivers when applicable. Azure RTOS provides hardware cryptography drivers for select platforms. For more information, see the [NetX crypto documentation](/azure/rtos/netx/netx-crypto/chapter1).

- Favor ephemeral public-key algorithms like ECDHE over static algorithms like classic RSA when possible. Public-key algorithms provide forward secrecy. TLS 1.3 *only* supports ephemeral cipher modes, so moving to TLS 1.3 when possible satisfies this goal.
- Make use of memory checking functionality like compiler and third-party memory checking tools and libraries like Azure RTOS ThreadX stack checking.
- Scrutinize all input data for length/buffer overflow conditions. Be suspicious of any data that comes from outside a functional block like the device, thread, and even each function or method. Check it thoroughly with application logic. Some of the easiest vulnerabilities to exploit come from unchecked input data causing buffer overflows.
- Make sure code builds cleanly. All warnings and errors should be accounted for and scrutinized for vulnerabilities.
- Use static code analysis tools to determine if there are any errors in logic or pointer arithmetic. All errors can be potential vulnerabilities.
- Research fuzz testing, also known as "fuzzing," for your application. Fuzzing is a security-focused process where message parsing for incoming data is subjected to large quantities of random or semi-random data. The purpose is to observe the behavior when invalid data is processed. It's based on techniques used by hackers to discover buffer overflow and other errors that might be used in an exploit to attack a system.
- Perform code walk-through audits to look for confusing logic and other errors. If you can't understand a piece of code, it's possible that code contains vulnerabilities.
- Use an MPU or MMU when available and overhead is acceptable. An MPU or MMU helps to prevent code from executing from RAM and threads from accessing memory outside their own memory space. Use Azure RTOS ThreadX Modules to isolate application threads from each other to prevent access across memory boundaries.
- Use watchdogs to prevent runaway code and to make attacks more difficult. They limit the window during which an attack can be executed.
- Consider safety and security certified code. Using certified code and certifying your own applications subjects your application to higher scrutiny and increases the likelihood of discovering vulnerabilities before the application is deployed. Formal certification might not be required for your device. Following the rigorous testing and review processes required for certification can provide enormous benefit.

### Security measures to avoid

- Don't use the standard C-library `rand()` function because it doesn't provide cryptographic randomness. Consult your hardware documentation for a proper source of cryptographic entropy.
- Don't hard-code private keys or credentials like certificates, passwords, or usernames in your application. To provide a higher level of security, update private keys regularly. The actual schedule depends on several factors. Also, hard-coded values might be readable in memory or even in transit over a network if the firmware image isn't encrypted. The actual mechanism for updating keys and certificates depends on your application and the PKI being used.
- Don't use self-signed device certificates. Instead, use a proper PKI for device identification. Some exceptions might apply, but this rule is for most organizations and systems.
- Don't use any TLS extensions that aren't needed. Azure RTOS TLS disables many features by default. Only enable features you need.
- Don't try to implement "security by obscurity." It's *not secure*. The industry is plagued with examples where a developer tried to be clever by obscuring or hiding code or algorithms. Obscuring your code or secret information like keys or passwords might prevent some intruders, but it won't stop a dedicated attacker. Obscured code provides a false sense of security.
- Don't leave unnecessary functionality enabled or unused network or hardware ports open. If your application doesn't need a feature, disable it. Don't fall into the trap of leaving a TCP port open just in case. When more ports are left open, it raises the risk that an exploit will go undetected. The interaction between different features can introduce new vulnerabilities.
- Don't leave debugging enabled in production code. If an attacker can plug in a JTAG debugger and dump the contents of RAM on your device, not much can be done to secure your application. Leaving a debugging port open is like leaving your front door open with your valuables lying in plain sight. Don't do it.
- Don't allow buffer overflows in your application. Many remote attacks start with a buffer overflow that's used to probe the contents of memory or inject malicious code to be executed. The best defense is to write defensive code. Double-check any input that comes from, or is derived from, sources outside the device like the network stack, display or GUI interface, and external interrupts. Handle the error gracefully. Use compiler, linker, and runtime system tools to detect and mitigate overflow problems.
- Don't put network packets on local thread stacks where an overflow can affect return addresses. This practice can lead to return-oriented programming vulnerabilities.
- Don't put buffers in program stacks. Allocate them statically whenever possible.
- Don't use dynamic memory and heap operations when possible. Heap overflows can be problematic because the layout of dynamically allocated memory, for example, from functions like `malloc()`, is difficult to predict. Static buffers can be more easily managed and protected.
- Don't embed function pointers in data packets where overflow can overwrite function pointers.
- Don't try to implement your own cryptography. Accepted cryptographic routines like elliptic curve cryptography (ECC) and AES were developed by experts in cryptography. These routines went through rigorous analysis over many years to prove their security. It's unlikely that any algorithm you develop on your own will have the security required to protect sensitive communications and data.
- Don't implement roll-your-own cryptography schemes. Simply using AES doesn't mean your application is secure. Protocols like TLS use various methods to mitigate well-known attacks, for example:

  - Known plain-text attacks, which use known unencrypted data to derive information about encrypted data.
  - Padding oracles, which use modified cryptographic padding to gain access to secret data.
  - Predictable secrets, which can be used to break encryption.

  Whenever possible, try to use accepted security protocols like TLS when you secure your application.

## Recommended security resources

- [Zero Trust: Cyber security for IoT](https://azure.microsoft.com/mediahandler/files/resourcefiles/zero-trust-cybersecurity-for-the-internet-of-things/Zero%20Trust%20Security%20Whitepaper_4.30_3pm.pdf)  provides an overview of Microsoft's approach to security across all aspects of an IoT ecosystem, with an emphasis on devices.
- [IoT Security Maturity Model](https://www.iiconsortium.org/smm.htm) proposes a standard set of security domains, subdomains, and practices and an iterative process you can use to understand, target, and implement security measures important for your device. This set of standards is directed to all levels of IoT stakeholders and provides a process framework for considering security in the context of a component's interactions in an IoT system.
- [Seven properties of highly secured devices](https://www.microsoft.com/research/publication/seven-properties-2nd-edition/), published by Microsoft Research, provides an overview of security properties that must be addressed to produce highly secure devices. The seven properties are hardware root of trust, defense in depth, small trusted computing base, dynamic compartments, passwordless authentication, error reporting, and renewable security. These properties are applicable to many embedded devices, depending on cost constraints, target application and environment.
- [PSA Certified 10 security goals explained](https://www.psacertified.org/blog/psa-certified-10-security-goals-explained/) discusses the Azure Resource Manager Platform Security Architecture (PSA). It provides a standardized framework for building secure embedded devices by using Resource Manager TrustZone technology. Microcontroller manufacturers can certify designs with the Resource Manager PSA Certified program giving a level of confidence about the security of applications built on Resource Manager technologies.
- [Common Criteria](https://www.commoncriteriaportal.org/) is an international agreement that provides standardized guidelines and an authorized laboratory program to evaluate products for IT security. Certification provides a level of confidence in the security posture of applications using devices that were evaluated by using the program guidelines.
- [Security Evaluation Standard for IoT Platforms (SESIP)](https://globalplatform.org/sesip/) is a standardized methodology for evaluating the security of connected IoT products and components.
- [FIPS 140-2/3](https://csrc.nist.gov/publications/detail/fips/140/3/final) is a US government program that standardizes cryptographic algorithms and implementations used in US government and military applications. Along with documented standards, certified laboratories provide FIPS certification to guarantee specific cryptographic implementations adhere to regulations.
