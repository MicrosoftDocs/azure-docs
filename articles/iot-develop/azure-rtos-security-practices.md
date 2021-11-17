---
title: Azure RTOS Security Guidance for Embedded Devices
description: Learn best practices for developing secure applications on embedded devices with Azure RTOS.
author: JimacoMS4
ms.author: v-jbrannian
ms.service: iot-develop
ms.topic: conceptual
ms.date: 11/11/2021
---

# Guidelines to develop secure embedded applications with Azure RTOS

**INTRO TEXT COMING**

## Embedded Security Components - Cryptography

Cryptography is a foundation of security in networked devices. While there exist some cases where cryptography may not be necessary for security, networking protocols like TLS rely on cryptography to protect and authenticate information traveling over a network or the public Internet. A secure IoT device that connects to a server or cloud service using TLS or similar protocols requires strong cryptography with protection for keys and secrets based in hardware. Most other security mechanisms provided by those protocols are built on cryptographic concepts, so having proper cryptographic support is the single most critical consideration in developing a secure connected IoT device.

### True random hardware-based entropy source

Any cryptographic application using TLS or cryptographic operations that require random values for keys or secrets must have an approved random entropy source. Without proper true randomness, statistical methods can be used to derive keys and secrets much faster than brute-force attacks, weakening otherwise strong cryptography. Modern embedded devices should support some form of Cryptographic Random Number Generator (CRNG) or “True” Random Number Generator (TRNG) that can be used to feed the random number generator passed into a TLS application.

Hardware Random Number Generators (HRNG) supply some of the best sources of entropy. HRNGs typically generate values based on statistically random noise signals generated in a physical process rather than from a software algorithm. Many government agencies and standards bodies around the world provide guidelines for random number generators. Some examples include the National Institute of Standards and Technology (NIST) in the US, the National Cypersecurity Agency of France (ANSSI) in France, and the Federal Office for Information Security (BSI) in Germany.

**Hardware**: True entropy can only come from hardware sources. There are various methods to obtain cryptographic randomness, but all require physical processes to be considered secure.

**Azure RTOS**: Azure RTOS uses random numbers for cryptography and TLS. For more information, see the User Guide for each protocol in the [Azure RTOS NetX Duo documentation](/azure/rtos/netx-duo/overview-netx-duo).

**Application**: A random number function must be provided by the application developer and linked into the application, including Azure RTOS.

> [!IMPORTANT]
> The C library function `rand()` does NOT utilize a hardware-based RNG by default. It's critical to assure that a proper random routine is used. The setup will be specific to your hardware platform.

### Real-time capability

Real-time capability is primarily needed for checking the expiration date of X.509 certificates. TLS also uses timestamps as part of its session negotiation, and certain applications may require accurate time reporting. There are many options for obtaining accurate time such as a Real-Time Clock (RTC) device, NTP to obtain time over a network, and GPS, which includes timekeeping.

> [!IMPORTANT]
> Having an accurate time is nearly as critical as having a TRNG for secure applications that use TLS and X.509.

Many devices will use a hardware RTC backed by synchronization over a network service or GPS. Devices may also rely solely on an RTC or solely on a network service (or GPS). Regardless of the implementation, measures should be taken to prevent drift, protect hardware components from tampering, and guard against spoofing attacks when using network services or GPS. If an attacker can spoof time, they can induce your device to accept expired certificates.

**Hardware**: If you implement a hardware RTC and NTP or other network-based solutions are unavailable for synching, the RTC should:

- Be accurate enough for certificate expiration checks (hour resolution or better).
- Be either updateable or resistant to drift over the lifetime of the device.
- Maintain time across power failures or resets.

An invalid time will disrupt all TLS communication, possibly rendering the device unreachable.

**Azure RTOS**: Azure RTOS TLS uses time data for several security-related functions, but the application developer must provide a function for retrieving time data from the RTC or network. For more information, see the [NetX Secure TLS user guide](/azure/rtos/netx-duo/netx-secure-tls/chapter1).

**Application**: Depending on the time source used, the application may be required to initialize the functionality so that TLS can properly obtain the time information.

### Use approved cryptographic routines with strong key sizes

There are a wide variety of cryptographic routines available today. When designing your application, research the cryptographic routines that you'll need and choose the strongest (largest) keys possible. Look to NIST or other organizations that provide guidance on appropriate cryptography for different applications.

- Choose key sizes that are appropriate for your application. RSA is still acceptable in some organizations but only if the key is 2048 bits or larger. For AES, minimum key sizes of 128 bits are often required.
- Choose modern, widely accepted algorithms and choose cipher modes that provide the highest level of security available for your application.
- Avoid using algorithms that are considered obsolete like DES and MDS.
- Consider the lifetime of your application and adjust your choices to account for continued reduction in the security of current routines and key sizes.
- Consider making key sizes and algorithms updatable to adjust to changing security requirements.
- Constant-time cryptography should be used whenever possible to mitigate timing attack vulnerabilities.

**Hardware**: If you're using hardware-based cryptography (which is recommended), your choices may be limited. Choose hardware that exceeds your minimum cryptographic and security needs and use the strongest routines and keys available on that platform.

**Azure RTOS**: Azure RTOS provides drivers for select cryptographic hardware platforms and software implementations for certain routines. Adding new routines and key sizes is straightforward.

**Application**: Applications that require cryptographic operations should also use the strongest approved routines possible.

### Hardware-based cryptography acceleration

Use of hardware cryptographic peripherals can speed up your application and provide additional security against timing attacks. Timing attacks exploit the duration of a cryptographic operation to derive information about a secret key. By performing cryptographic operations in constant time regardless of the key or data properties, hardware cryptographic peripherals prevent this kind of attack. Every platform will likely be different as there is no accepted standard for cryptographic hardware (other than the accepted cryptographic algorithms like AES and RSA).

> [!IMPORTANT]
> Hardware cryptographic acceleration doesn't necessarily equate to enhanced security. For example:
>
> - Some cryptographic accelerators implement only the ECB mode of the cipher, and it's left to the software developer to implement more secure modes like GCM, CCM, or CBC. ECB is not semantically secure.
>
> - Cryptographic accelerators often leave key protection to the software developer.
>

Combining hardware cryptography acceleration that implements secure cipher modes with hardware-based protection for keys provides a higher level of security for cryptographic operations.

**Hardware**: There are few standards for hardware cryptographic acceleration so each platform will vary in available functionality. Consult with your MCU vendor for more information.

**Azure RTOS**: Azure RTOS provides drivers for select cryptographic hardware platforms. Check your Azure RTOS Cryptography documentation for more information on hardware-based cryptography.

**Application**: Applications that require cryptographic operations should make use of all hardware-based cryptography that is available.

## Embedded Security Components – Device Identity

In IoT systems, the notion that each endpoint represents a unique physical device challenges some of the assumptions that are built into the modern Internet. As a result, a secure IoT device must be able to uniquely identify itself or an attacker could imitate a valid device for the purposes of stealing data, sending fraudulent information, or tampering with device functionality. Therefore, it is imperative that each IoT device that connects to a cloud service has a way to identify itself that is not easily bypassed.

### Unique verifiable device identifier

A unique device identifier (device ID) allows a cloud service to verify the identity of a specific physical device and to verify that the device belongs to a particular group. It's the digital equivalent of a physical serial number, but it must be globally unique and protected. If the device ID is compromised, there's no way to distinguish between the physical device it represents and a fraudulent client.

In most modern connected devices, the device ID will be tied to cryptography. For example:

- It may be a private-public key pair, where the private key is globally unique and associated only with the device.
- It may be a private-public key pair, where the private key is associated with a set of devices and is used in combination with another identifier that is unique to the device.
- It may be cryptographic material that is used to derive private keys unique to the device.

Regardless of implementation, the device ID and any associated cryptographic material must be hardware-protected, for example by using an HSM.

While the device ID can be used for client authentication with a cloud service or server, it is highly advisable to split the device ID from operational certificates typically used for such purposes. To lessen the attack surface, operational certificates should be relatively short-lived, and the public portion of the device ID shouldn't be widely distributed. Instead, the device ID can be used to sign and/or derive private keys associated with operational certificates.

> [!NOTE]
> This recommendation is very closely related to the “Attestation” recommendation below, with slightly different semantics.

**Hardware**: A device ID must be tied to the hardware and must not be easily replicated. This requires hardware-based cryptographic features such as those found in an HSM. Some MCU devices may provide similar functionality.

**Azure RTOS**: No specific Azure RTOS features use device IDs. However, communication to cloud services via TLS may require an X.509 certificate that is tied to the device ID.

**Application**:  No specific features required for user applications, but a unique device ID may be required for certain applications.

### Certificate management

If your device utilizes a certificate from a Public Key Infrastructure (PKI), your application will need the ability to update those certificates periodically (both for the device and any trusted certificates used for verifying servers). The more frequent the update, the more secure your application will be.

**Hardware**:  All certificate private keys should be tied to your device. Ideally, the key should be generated internally by the hardware and never exposed to your application. This would require the ability to generate X.509 certificate requests on the device.

**Azure RTOS**: Azure RTOS TLS provides basic X.509 certificate support. Certificate Revocation Lists (CRLs) and policy parsing are supported but require manual management in your application without a supporting SDK.

**Application**: Make use of CRLs or Online Certificate Status Protocol (OCSP) to validate that certificates haven't been revoked by your PKI. Make sure to enforce X.509 policies, including validity periods and expiration dates, as required by your PKI.

### Attestation

Some devices provide a secret key or value that is uniquely loaded (usually using permanent fuses) into each specific device for the purposes of checking ownership or status of the device. Whenever possible, this hardware-based value should be utilized, though not necessarily directly, as part of any process where the device needs to identify itself to a remote host.

This should be coupled with a secure boot mechanism to prevent fraudulent use of the secret ID. Depending on the cloud services being used and their PKI, the device ID may be tied to an X.509 certificate. However, whenever possible the attestation device ID should be separate from "operational" certificates used to authenticate a device.

Device status in attestation scenarios can include information like firmware version, life-cycle state (for example, running vs. debug), component health, or any number of other factors that will help a service determine the device's state. For example, device attestation is often involved in OTA firmware update protocols to ensure that the correct updates are delivered to the intended device.  

> [!NOTE]
> “Attestation” is distinct from “authentication”. Attestation uses an external authority to determine whether a device belongs to a particular group using cryptography. “Authentication” uses cryptography to verify that a host (device) owns a private key in a challenge-response process, such as the TLS handshake.

**Hardware**: The selected hardware must provide functionality to provide a secret unique identifier. This functionality is usually tied into cryptographic hardware like a TPM or HSM and requires a specific API for attestation services.

**Azure RTOS**: No specific Azure RTOS functionality is required.

**Application**: The user application may be required to implement logic to tie the hardware features to whatever attestation the chosen cloud service(s) requires.

## Embedded Security Components – Memory Protection

Many successful hacking attacks utilize buffer overflow errors to gain access to privileged information or even to execute arbitrary code on a device. Numerous technologies and languages have been created to battle overflow problems, but the fact remains that system-level embedded development requires low-level programming. As a result, most embedded development is done using C or assembly language. These languages lack modern memory protection schemes but allow for less restrictive memory manipulation. Given the lack of built-in protection, the Azure RTOS developer must be vigilant about memory corruption. The following recommendations leverage functionality provided by some MCU platforms and Azure RTOS itself to help mitigate the impact of overflow errors on security.

### Protection against reading/writing memory

An MCU may provide a latching mechanism to enable a tamper-resistant state, either by preventing reading of sensitive data or by locking areas of memory from being overwritten. This may be part of, or in addition to, a Memory Protection Unit (MPU) or a Memory Management Unit (MMU).

**Hardware**: The MCU must provide the appropriate hardware and interface to use memory protection.

**Azure RTOS**: If the memory protection mechanism is not an MMU or MPU, Azure RTOS doesn't require any specific support. For more advanced memory protection, Azure RTOS ThreadX Modules may be used to provide detailed control over memory spaces for threads and other RTOS control structures.

**Application**: The application developer may be required to enable memory protection when the device is first booted – refer to secure boot documentation. For simple mechanisms (not MMU or MPU), the application may place sensitive data (for example, certificates) into the protected memory region and access it using the hardware platform APIs.

### Application Memory Isolation

If your hardware platform has a Memory Management Unit (MMU) or Memory Protection Unit (MPU), then those features can be utilized to isolate the memory spaces used by individual threads or processes. More sophisticated mechanisms also exist, such as TrustZone that provide additional protections above and beyond what a simple MPU can do. This isolation can thwart attackers from using a hijacked thread or process to corrupt or view memory in another thread or process.

**Hardware**: The MCU must provide the appropriate hardware and interface to use memory protection.

**Azure RTOS**: Azure RTOS allows for ‘ThreadX Modules’ that are built independently/separately and are provided with their own instruction and data area addresses at run-time. Memory protection can then be enabled such that a context switch to a thread in a module will disallow code from accessing memory outside of the assigned area.

> [!NOTE]
> TLS and MQTT aren’t yet supported from ThreadX Modules.

**Application**: The application developer may be required to enable memory protection when the device is first booted – refer to secure boot and ThreadX Modules documentation. Note: Use of ThreadX Modules may introduce additional memory and CPU overhead.

### Protection against execution from RAM

Many MCU devices contain an internal “program flash” where the application firmware is stored. The application code is sometimes run directly from the flash hardware, using the RAM only for data. If the MCU allows execution of code from RAM, look for a way to disable that feature. Many attacks will try to modify the application code in some way, but if the attacker can't execute code from RAM it becomes more difficult to compromise the device. Placing your application in flash makes it more difficult to change because of the nature of flash technology (unlock/erase/write process) and increases the challenge for an attacker. It's not a perfect solution, but, to provide for renewable security, the flash needs to be updatable. A completely read-only code section would be better at preventing attacks on executable code but would prevent updating.

**Hardware**: Presence of a program flash used for code storage and execution. If running in RAM is required, then consider leveraging an MMU or MPU (if available) to protect from writing to the executable memory space.

**Azure RTOS**: No specific features.

**Application**: Application may need to disable flash writing during secure boot depending on the hardware.

### Memory buffer checking

Avoiding buffer overflow problems is a primary concern for code running on connected devices. Applications written in unmanaged languages like C are particularly susceptible to buffer overflow issues. Safe coding practices can alleviate some of the problem but whenever possible try to incorporate buffer checking into your application. You may be able to make use of built-in features of the selected hardware platform, third-party libraries, tools, and, in some cases, features in the hardware itself that provide a mechanism for detecting or preventing overflow conditions.

**Hardware**: Some platforms may provide memory checking functionality. Consult with your MCU vendor for more information.

**Azure RTOS**: No specific Azure RTOS functionality provided.

**Application**: Follow good coding practice by requiring applications to always supply buffer size or the number of elements in an operation. Avoid relying on implicit terminators such as NULL. With a known buffer size, the program can check bounds during memory or array operations, such as when calling APIs like `memcpy`. Try to use safe versions of APIs like `memcpy_s`.

### Enable run-time stack checking

Preventing stack overflow is a primary security concern for any application. Azure RTOS has some stack checking features that should be utilized whenever possible. These features are covered in the Azure RTOS ThreadX User Guide.

**Hardware**: Some MCU platform vendors may provide hardware-based stack checking. Use any functionality that is available.

**Azure RTOS**: Azure RTOS ThreadX provides some stack checking functionality that can be optionally enabled at compile time. For more information, see the [Azure RTOS ThreadX documentation](/azure/rtos/threadx/).

**Application**:  Certain compilers such as IAR also have “stack canary” support that helps to catch stack overflow conditions. Check your tools to see what options are available and enable them if possible.

## Embedded Security Components – Secure Boot and Firmware Update

 An IoT device, unlike a traditional embedded device, will often be connected over the Internet to a cloud service for monitoring and data gathering. As a result, it's nearly certain that the device will be probed in some way, which could lead to an attack if a vulnerability is found. A successful attack may result in the discovery of an unknown vulnerability that further compromises the device and, more importantly, other devices of the same kind. For this reason, it's critical that an IoT device can be updated quickly and easily. This means that the firmware image itself must be verified, because if an attacker can load a compromised image onto a device then that device is lost. The solution is to pair a secure boot mechanism with remote firmware update (also called Over the Air, or OTA, update) capability. Secure boot verifies that a firmware image is valid and trusted, while an OTA update mechanism allows updates to be quickly and securely deployed to the device.

### Secure boot

It is vital that a device can be proven to be running valid firmware upon reset. Secure boot prevents the device from running untrusted or modified firmware images. Secure boot mechanisms are tied to the hardware platform and validate the firmware image against internally protected measurements before loading the application. If validation fails, the device will refuse to boot the corrupted image.

**Hardware**: MCU vendors may provide their own proprietary secure boot mechanisms as secure boot is tied to the hardware.

**Azure RTOS**: No specific Azure RTOS functionality is required for secure boot. There are 3rd-party commercial vendors that offer secure boot products.

**Application**: The application may be affected by secure boot if over-the-air updates are enabled because the application itself may need to be responsible for retrieving and loading new firmware images (OTA update is tied to secure boot). The application will also need to be built with versioning and code-signing to support updates with secure boot.

### Firmware or OTA update

Over-the-Air (OTA) update, sometimes referred to as “firmware update”, involves updating the firmware image on your device to a new version to add features or fix bugs. OTA update is important for security because any vulnerabilities that are discovered must be patched as soon as possible.

> [!NOTE]
> OTA updates MUST be tied to secure boot and code signing, or it is impossible to validate that new images aren’t compromised.

**Hardware**: Various implementations for OTA update exist, and some MCU vendors provide OTA update solutions that are tied to their hardware. Some OTA update mechanisms can also utilize extra storage space (for example, flash) for rollback protection and to provide uninterrupted application functionality during update downloads.

**Azure RTOS**: No specific Azure RTOS functionality is required for OTA updates.

**Application**: Some third-party software solutions for OTA update also exist and may be utilized by an Azure RTOS application. The application will also need to be built with versioning and code-signing to support updates with secure boot.

### Rollback or downgrade protection

Secure boot and OTA update must work together to provide an effective firmware update mechanism. Secure boot must be able to ingest a new firmware image from the OTA mechanism and mark the new version as being trusted. The OTA/Secure boot mechanism must also protect against downgrade attacks. If an attacker can force a rollback to an earlier trusted version that has known vulnerabilities, then the OTA/secure boot fails to provide proper security.

Downgrade protection also applies to revoked certificates or credentials.

**Hardware**: No specific hardware functionality required (except as part of secure boot, OTA, or certificate management).

**Azure RTOS**: No specific Azure RTOS functionality required.

**Application**: No specific application support required, depends on requirements for OTA, secure boot, and certificate management.

### Code signing

Make use of any features for signing and verifying code or credential updates. Code signing involves generating a cryptographic hash of the firmware or application image. That hash is used to verify the integrity of the image received by the device, usually using a trusted root X.509 certificate to verify the hash signature. This process is usually tied into secure boot and OTA update mechanisms.

**Hardware**: No specific hardware functionality required (except as part of OTA update or secure boot). Using hardware-based signature verification is recommended if available.

**Azure RTOS**: No specific Azure RTOS functionality required

**Application** : Code signing can be is tied to secure boot and OTA update mechanisms to verify the integrity of downloaded firmware images.

## Embedded Security Components – Protocols

### Use the latest version of TLS possible for connectivity

Support current TLS versions:

- TLS 1.2 is currently (as of 2020) the most widely used TLS version.

- TLS 1.3 is the latest TLS version. Finalized in 2018, it adds many security and performance enhancements, but is not yet widely deployed. However, if your application can support TLS 1.3 it's recommended for new applications.

> [!NOTE]
> TLS 1.0 and TLS 1.1 are obsolete protocols and shouldn't be used for new application development. They're disabled by default in Azure RTOS.

**Hardware**: No specific hardware requirements.

**Azure RTOS**: TLS 1.2 is enabled by default. TLS 1.3 support must be explicitly enabled in Azure RTOS as TLS 1.2 is still the de-facto standard.

**Application**: To use TLS with cloud services, a certificate will be required. The certificate must be managed by the application.

### Use X.509 Certificates for TLS authentication

X.509 certificates are used to authenticate a device to a server and a server to a device. A device certificate is used to prove the identity of a device to a server. Trusted root CA certificates are used by a device to authenticate a server or service to which it connects. The ability to update these certificates is critical as certificates can be compromised and have limited lifespans.

Using hardware-based X.509 certificates with TLS mutual authentication and a PKI with active monitoring of certificate status provides the highest level of security.

**Hardware**: No specific hardware requirements.

**Azure RTOS**: Azure RTOS TLS provides basic X.509 authentication through TLS and some user APIs for further processing.

**Application**: Depending on requirements, the application may have to enforce X.509 policies. CRLs should be enforced to ensure revoked certificates are rejected.

### Use strongest cryptographic options and cipher suites for TLS

Use the strongest cryptography and cipher suites available for TLS. Having the ability to update TLS and cryptography is also important because over time certain cipher suites and TLS versions may become compromised or discontinued.

**Hardware**: If cryptographic acceleration is available, use it.

**Azure RTOS**:  Azure RTOS TLS provides hardware drivers for select devices that support cryptography in hardware. For routines not supported in hardware, the [Azure RTOS cryptography library](/azure/rtos/netx/netx-crypto/chapter1) is designed specifically for embedded systems. A FIPS 140-2 certified library that uses the same code base is also available.

**Application**: Applications using TLS should choose cipher suites that utilize hardware-based cryptography (when available) and the strongest keys available.

### TLS mutual certificate authentication

When using X.509 authentication in TLS, opt for mutual certificate authentication. With mutual authentication, both the server and client must provide a verifiable certificate for identification.

Using hardware-based X.509 certificates with TLS mutual authentication and a PKI with active monitoring of certificate status provides the highest level of security.

**Hardware**: No specific hardware requirements.

**Azure RTOS**: Azure RTOS TLS provides support for mutual certificate authentication in both TLS Server and Client applications. For more information, see the [Azure RTOS NetX Secure TLS documentation](/netx-secure-tls/chapter1#netx-secure-unique-features).

**Application**: Applications using TLS should always default to mutual certificate authentication whenever possible. Mutual authentication requires TLS clients to have a device certificate. Mutual authentication is an optional TLS feature but is highly recommended when possible.

### Only use TLS-based MQTT

If your device uses MQTT for cloud communication, only use MQTT over TLS.

**Hardware**: No specific hardware requirements.

**Azure RTOS**: Azure RTOS provides MQTT over TLS as a default configuration.

**Application**: Applications using MQTT should only use TLS-based MQTT with mutual certificate authentication.

## Embedded Security Components – Application Design and Development

### Disable debugging features

For development, most MCU devices use a JTAG interface or similar interface to provide information to debuggers or other applications. Leaving a debugging interface enabled on your device gives an attacker an easy door into your application. Make sure to disable all debugging interfaces and remove associated debugging code from your application before deployment.

**Hardware**: Some devices may have hardware support to disable debugging interfaces permanently or the interface may be able to be removed physically from the device. (Note that removing the interface physically from the device does NOT mean the interface is disabled.) You may need to disable the interface on boot (for example, during a secure boot process), but it should always be disabled in production devices.

**Azure RTOS**: Not applicable.

**Application**: If the device doesn't have a feature to permanently disable debugging interfaces, the application may have to disable those interfaces on boot. Disabling debugging interfaces should be done as early as possible in the boot process, preferably during a secure boot before the application is running.

### Watchdog timers

When available, an IoT device should use a watchdog timer to reset an unresponsive application. Having the watchdog timer reset the device when time runs out will limit the amount of time an attacker may have to execute an exploit. The watchdog can be reinitialized by the application and some basic integrity checks can also be done such as looking for code executing in RAM, checksums on data, identity checks, and so on. If an attacker doesn't account for the watchdog timer reset while trying to compromise the device, then the device would reboot into a (theoretically) clean state. Note that this would require a secure boot mechanism to verify the identity of the application image.

**Hardware**: Watchdog timer support in hardware, secure boot functionality.

**Azure RTOS**: No specific Azure RTOS functionality required.

**Application**: Watchdog timer management – refer to device hardware platform documentation for more information.

### Remote error logging

Use cloud resources to record and analyze device failures remotely. Aggregate errors to find patterns that indicate possible vulnerabilities or attacks.

**Hardware**: No specific hardware requirements.

**Azure RTOS**: No specific Azure RTOS requirements but consider logging Azure RTOS API return codes to look for specific problems with lower-level protocols (for example,  TLS alert causes, TCP failures) that may indicate problems.

**Application**: Make use of logging libraries and your cloud service's client SDK to push error logs to the cloud where they can be stored and analyzed safely without using valuable device storage space. Integration with [Microsoft Defender for IoT](https://azure.microsoft.com/services/azure-defender-for-iot/) would provide this functionality and more. Microsoft Defender for IoT provides agent-less monitoring of devices in an IoT solution. Monitoring can be enhanced by including the [Microsoft Defender for IOT micro-agent for Azure RTOS](/azure/defender-for-iot/device-builders/iot-security-azure-rtos) on your device. For more information, see the [Runtime security monitoring and threat detection](#runtime-security-monitoring-and-threat-detection) recommendation.

### Disable unused protocols and features

RTOS and MCU-based applications will typically have a few dedicated functions. This is in sharp contrast to general-purpose computing machines running higher-level operating systems, such as Windows and Linux, that enable dozens or hundreds of protocols and features by default. When designing an RTOS MCU application, look closely at what networking protocols are actually required. Every protocol that is enabled represents a different avenue for attackers to gain a foothold within the device. If you don’t need a feature or protocol, don’t enable it.

**Hardware**: No specific hardware requirements, but if the platform allows unused peripherals and ports to be disabled, use that functionality to reduce your attack surface.

**Azure RTOS**: Azure RTOS has a “disabled by default” philosophy. Only enable protocols and features that are required for your application. Resist the temptation to enable features “just in case”.

**Application**: When designing your application, try to reduce the feature set to the bare minimum. Fewer features make an application easier to analyze for security vulnerabilities and reduce your application attack surface.

### Use all possible complier and linker security features when building your application

Modern compilers and linkers provide numerous options for additional security at build time. Utilize as many compiler- and linker-based options as possible to improve your application with proven security mitigations. Some options may affect size, performance, or RTOS functionality, so care is required when enabling certain features.

**Hardware**: No specific hardware requirements but your hardware platform may support security features that can be enabled during the compiling or linking processes.

**Azure RTOS**: As an RTOS, some compiler-based security features may interfere with the real-time guarantees of Azure RTOS. Consider your RTOS needs when selecting compiler options and test them thoroughly.

**Application**: If using GCC, the following list of options should be considered. For more information, see the GCC documentation.

- -Wconversion, -Wsign-conversion,​ -Wformat-security,​ -fstack-protector, -fstack-protector-all, -Wstack-protector​ -fpie -Wl,-pie, -ftrapv , -D_FORTIFY_SOURCE=2​, -Wl,-z,relro,-z,now​

If using other development tools, consult your documentation for appropriate options. In general, the following guidelines should help in building a more secure configuration:

- All builds should have maximum error and warning levels enabled. Production code should compile and link cleanly with no errors or warnings.

- Enable all runtime checking that is available. Examples include stack checking, buffer overflow detection, Address Space Layout Randomization (ASLR), and integer overflow detection.

- Some tools and devices may provide options to place code in protected or read-only areas of memory. Make use of any available protection mechanisms to prevent an attacker from being able to run arbitrary code on your device. Simply protecting code by making it read-only doesn't completely protect against arbitrary code execution, but it does help.

### Make sure memory access alignment is correct

Some MCU devices permit unaligned memory accesses, but others do not. Consider the properties of your specific device when developing your application.

**Hardware**: The memory access alignment behavior will be specific to your selected device.

**Azure RTOS**: For processors that do NOT support unaligned access, ensure that the macro `NX_CRYPTO_DISABLE_UNALIGNED_ACCESS` is defined. Failure to do so will result in possible CPU faults during certain cryptographic operations.

**Application**: In any memory operation (for example, copy or move) consider the memory alignment behavior of your hardware platform.

### Runtime security monitoring and threat detection

Connected IoT devices may not have the necessary resources to implement all security features locally. However, with connection to the cloud, there are remote security options that can be utilized to improve the security of your application without adding significant overhead to the embedded device.

**Hardware**: No specific hardware features required (other than a network interface).

**Azure RTOS**: Azure RTOS supports [Microsoft Defender for IoT](https://azure.microsoft.com/services/azure-defender-for-iot/).

**Application**: The [Microsoft Defender for IOT micro-agent for Azure RTOS](/azure/defender-for-iot/device-builders/iot-security-azure-rtos) provides a comprehensive security solution for Azure RTOS devices. The module provides security services via a small software agent that is built into your device’s firmware and comes as part of Azure RTOS. The service includes detection of malicious network activities, device behavior baselining based on custom alerts, and recommendations that will help to improve the security hygiene of your devices. Whether you're using Azure RTOS in combination with Azure Sphere or not, the Microsoft Defender for IoT micro-agent provides an additional layer of security that is built right into the RTOS by default.

## Azure RTOS IoT Application Security Checklist

The previous sections detailed specific design considerations with descriptions of the necessary hardware, operating system, and application requirements to help mitigate security threats. This section provides a basic checklist of security-related issues to consider when designing and implementing IoT applications with Azure RTOS. This shortlist of measures is meant as a complement to, not a replacement for, the more detailed discussion in previous sections. Ultimately, a comprehensive analysis of the physical and cyber security threats posed by the environment your device will be deployed into coupled with careful consideration and rigorous implementation of the measures needed to mitigate those threats must be done to provide the highest possible level of security for your device.

### Security DOs

- DO ALWAYS use a hardware source of entropy (CRNG, TRNG based in hardware). Azure RTOS uses a macro (`NX_RAND`) that allows you to define your random function.

- DO Always supply a Real-Time Clock for calendar date/time to check certificate expiration.

- DO use Certificate Revocation Lists (CRL) to validate certificate status. With Azure RTOS TLS, a CRL is retrieved by the application and passed via a callback to the TLS implementation. For more information, see the [NetX Secure TLS User Guide](/azure/rtos/netx-duo/netx-secure-tls/chapter1).

- DO use the X.509 “Key Usage” extension when possible to check for certificate acceptable uses. In Azure RTOS, the use of a callback to access the X.509 extension information is required.

- DO use X.509 policies in your certificates that are consistent with the services to which your device will connect (for example, ExtendedKeyUsage).

- DO use approved cipher suites in the Azure RTOS Crypto library

  - Supplied examples provide the required cipher suites to be compatible with TLS RFCs, but stronger cipher suites may be more suitable.  Cipher suites include multiple ciphers for different TLS operations, so choose carefully. For example, using ECDHE may be preferable to RSA for key exchange, but the benefits can be lost if the cipher suite also uses RC4 for application data. Make sure every cipher in a cipher suite meets your security needs.

  - Remove cipher suites that aren't needed. Doing so saves space and provides extra protection against attack.

  - Use hardware drivers when applicable. Azure RTOS provides hardware cryptography drivers for select platforms. For more information, see the [NetX Crypto documentation](/azure/rtos/netx/netx-crypto/chapter1).

- DO favor ephemeral public-key algorithms (like ECDHE) over static algorithms (like classic RSA) when possible as these provide forward secrecy. Note that TLS 1.3 ONLY supports ephemeral cipher modes so moving to TLS 1.3 (when possible) will satisfy this goal.

- DO make use of memory checking functionality provided by your tools (for example, compiler and 3rd-party memory checking tools) and libraries (for example, Azure RTOS ThreadX stack checking).

- DO scrutinize all input data for length/buffer overflow conditions. Any data coming from outside a functional block (the device, thread, and even each function/method) should be considered suspect and checked thoroughly with application logic. Some of the easiest vulnerabilities to exploit come from unchecked input data causing buffer overflows.

- DO make sure code builds cleanly. All warnings and errors should be accounted for and scrutinized for vulnerabilities.

- DO use static code analysis tools to determine if there are any errors in logic or pointer arithmetic – all errors can be potential vulnerabilities.

- DO research fuzz testing (or “fuzzing”) for your application. Fuzzing is a security-focused process where message parsing for incoming data is subjected to large quantities of random or semi-random data to observe the behavior when invalid data is processed. It's based on techniques used by hackers to discover buffer overflow and other errors that may be used in an exploit to attack a system.

- DO perform code walk-through audits to look for confusing logic and other errors. If you can’t understand a piece of code, it’s possible that code contains vulnerabilities.

- DO use an MPU/MMU (when available and overhead is acceptable) to prevent code from executing from RAM and prevent threads from accessing memory outside their own memory space. Azure RTOS ThreadX Modules can be used to isolate application threads from each other to prevent access across memory boundaries.

- DO use watchdogs to prevent run-away code and to make attacks more difficult by limiting the window during which an attack can be executed.

- DO consider Safety and Security certified code. Using certified code and certifying your own applications will subject your application to higher scrutiny and increase the likelihood of discovering vulnerabilities before the application is deployed. Formal certification may not be required for your device, but following the rigorous testing and review processes required for certification can provide enormous benefit.

### Security DON'Ts

- DO NOT use the standard C-library `rand()` function as it doesn't provide cryptographic randomness. Consult your hardware documentation for a proper source of cryptographic entropy.

- DO NOT hard-code private keys or credentials (certificates, passwords, usernames, etc.) in your application. Private keys should be updated regularly (the actual schedule depends on several factors) to provide a higher level of security. In addition, hard-coded values may be readable in memory or even in transit over a network if the firmware image is not encrypted. The actual mechanism for updating keys and certificates will depend heavily on your application and the PKI being used.

- DO NOT use self-signed device certificates and instead use a proper PKI for device identification. (Some exceptions may apply, but generally this is a rule for most organizations and systems.)

- DO NOT use any TLS extensions that aren't needed. Azure RTOS TLS disables many features by default. Only enable features you need.

- DO NOT try to implement “Security by obscurity”. It is NOT SECURE. The industry is littered with examples where a developer tried to be clever by obscuring or hiding code or algorithms. Obscuring your code or secret information like keys or passwords may prevent some intruders but it won't stop a dedicated attacker. Obscured code provides a false sense of security.

- DO NOT leave unnecessary functionality enabled or unused network or hardware ports open. If your application doesn’t need a feature, disable it. Don’t fall into the trap of leaving a TCP port open “just in case”. The more functionality that is enabled, the higher the risk that an exploit will go undetected and the interaction between different features can introduce new vulnerabilities.

- DO NOT leave debugging enabled in production code. If an attacker can just plug in a JTAG debugger and dump the contents of RAM on your device, there's very little that can be done to secure your application. Leaving a debugging port open is the equivalent of leaving your front door open with your valuables lying in plain sight. Don’t do it.

- DO NOT allow buffer overflows in your application. Many remote attacks start with a buffer overflow that is used to probe the contents of memory or inject malicious code to be executed. The best defense is to write defensive code. Double check any input that comes from or is derived from sources outside the device (network stack, display/GUI interface, external interrupts, etc.) and handle the error gracefully. Use compiler, linker, and runtime system tools to detect and mitigate overflow problems.

- DO NOT put network packets on local thread stacks where an overflow can affect return addresses, leading to Return-Oriented Programming vulnerabilities.

- DO NOT put buffers in program stacks. Allocate them statically whenever possible.

- DO NOT use dynamic memory and heap operations when possible. Heap overflows can be problematic since the layout of dynamically allocated memory, for example, from functions like `malloc()`, is difficult to predict. Static buffers can be more easily managed and protected.

- DO NOT embed function pointers in data packets where overflow can overwrite function pointers.

- DO NOT try to implement your own cryptography. Accepted cryptographic routines like ECC and AES have been developed by experts in cryptography and have gone through rigorous analysis over many years (sometimes decades) to prove their security. It's highly unlikely that any algorithm you develop on your own will have the security required to protect sensitive communications and data.

- DO NOT implement roll-your-own cryptography schemes. Simply using AES doesn't mean your application is secure. Protocols like TLS use various methods to mitigate well-known attacks. For example:

  - Known plaintext attacks, which use known, unencrypted data to derive information about encrypted data.
  - Padding oracles, which use modified cryptographic padding to gain access to secret data.
  - Predictable secrets, which can be used to break encryption.

  Whenever possible, try to use accepted security protocols like TLS when securing your application.

## Next steps

- The [IoT Security Maturity Model (SMM)](https://www.iiconsortium.org/smm.htm) proposes a standard set of security domains, subdomains, and practices as well as an iterative process you can use to understand, target, and implement security measures important for your device. This set of standards is targeted to all levels of IoT stakeholders and provides a process framework for considering security in the context of a component’s interactions in an IoT system.

- The [Seven Properties of Highly Secured Devices](https://www.microsoft.com/research/publication/seven-properties-2nd-edition/) whitepaper published by Microsoft Research provides an overview of security properties that must be addressed to produce highly secure devices: Hardware root of trust, Defense in depth, Small trusted computing base, Dynamic compartments, Password-less authentication, Error reporting, and Renewable security. These properties are applicable, depending on cost constraints and target application and environment, too many embedded devices.

- **MORE LINKS COMING**
