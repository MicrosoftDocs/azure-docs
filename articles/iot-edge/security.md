---
title: Security framework for Azure IoT Edge
description: Learn about the security, authentication, and authorization standards used to develop Azure IoT Edge for you to consider in your solution design.
author: PatAltimore

ms.author: patricka
ms.date: 05/08/2025
ms.topic: concept-article
ms.service: azure-iot-edge
services: iot-edge
---

# Security standards for Azure IoT Edge

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Azure IoT Edge addresses risks inherent in moving your data and analytics to the intelligent edge. IoT Edge security standards balance flexibility for different deployment scenarios with the protection customers expect from Azure services.

IoT Edge runs on various makes and models of hardware, supports several operating systems, and applies to diverse deployment scenarios. Rather than offering concrete solutions for specific scenarios, IoT Edge is an extensible security framework based on well-grounded principles designed for scale. The risk of a deployment scenario depends on many factors, including:

* Solution ownership
* Deployment geography
* Data sensitivity
* Privacy
* Application vertical
* Regulatory requirements

This article provides an overview of the IoT Edge security framework. For more information, see [Securing the intelligent edge](https://azure.microsoft.com/blog/securing-the-intelligent-edge/).

## Standards

Standards make scrutiny and implementation easier, which are hallmarks of security. A security solution must be easy to evaluate for trust and not hinder deployment. The framework for securing Azure IoT Edge uses proven security protocols for familiarity and reuse.

## Authentication

When you deploy an IoT solution, you need to know that only trusted actors, devices, and modules have access to your solution. Certificate-based authentication is the primary mechanism for authentication for the Azure IoT Edge platform. This mechanism is derived from a set of standards governing Public Key Infrastructure (PKiX) by the Internet Engineering Task Force (IETF).

All devices, modules, and actors that interact with the Azure IoT Edge device should have unique certificate identities. This guidance applies whether the interactions are physical or through a network connection. Not every scenario or component might lend itself to certificate-based authentication, so the extensibility of the security framework provides secure alternatives.

For more information, see [Azure IoT Edge certificate usage](iot-edge-certs.md).

## Authorization

The principle of least privilege says that users and components of a system should have access only to the minimum set of resources and data needed to perform their roles. Devices, modules, and actors should access only the resources and data within their permission scope and only when it's architecturally allowed. Some permissions are configurable with sufficient privileges, while others are architecturally enforced. For example, some modules may be authorized to connect to Azure IoT Hub. However, there's no reason why a module in one IoT Edge device should access the twin of a module in another IoT Edge device.

Other authorization schemes include certificate signing rights and role-based access control, or RBAC.

## Attestation

Attestation ensures the integrity of software bits, which is important for detecting and preventing malware. The Azure IoT Edge security framework classifies attestation under three main categories:

* Static attestation
* Runtime attestation
* Software attestation

### Static attestation

Static attestation verifies the integrity of all software on a device during power-up, including the operating system, all runtimes, and configuration information. Because static attestation occurs during power-up, it's often referred to as secure boot. The security framework for IoT Edge devices extends to manufacturers and incorporates secure hardware capabilities that assure static attestation processes. These processes include secure boot and secure firmware upgrade. Collaborating with silicon vendors eliminates unnecessary firmware layers and minimizes the threat surface.

### Runtime attestation

Once a system has completed a secure boot process, well-designed systems should detect attempts to inject malware and take proper countermeasures. Malware attacks may target the system's ports and interfaces. If malicious actors have physical access to a device, they may tamper with the device itself or use side-channel attacks to gain access. Such malcontent, whether malware or unauthorized configuration changes, can't be detected by static attestation because it's injected after the boot process. Hardware-based countermeasures help prevent such threats. The security framework for IoT Edge explicitly calls for extensions that combat runtime threats.  

### Software attestation

All healthy systems, including intelligent edge systems, need patches and upgrades. Security is important for update processes, otherwise they can be potential threat vectors. The IoT Edge security framework requires updates through measured and signed packages to ensure package integrity and authenticate their source. This standard applies to all operating systems and application software bits.

## Hardware root of trust

For many intelligent edge devices, especially devices that can be physically accessed by potential malicious actors, hardware security is the last defense for protection. Tamper resistant hardware is crucial for such deployments. Azure IoT Edge encourages secure silicon hardware vendors to offer different flavors of hardware root of trust to accommodate various risk profiles and deployment scenarios. Hardware trust may come from common security protocol standards like Trusted Platform Module (ISO/IEC 11889) and Trusted Computing Group's Device Identifier Composition Engine (DICE). Secure enclave technologies like TrustZones and Software Guard Extensions (SGX) also provide hardware trust.

## Certification

To help customers make informed decisions when procuring Azure IoT Edge devices for their deployment, the IoT Edge framework includes certification requirements. Foundational to these requirements are certifications pertaining to security claims and certifications pertaining to validation of the security implementation. For example, a security claim certification means that the IoT Edge device uses secure hardware known to resist boot attacks. A validation certification means that the secure hardware was properly implemented to offer this value in the device. The framework keeps the burden of certification minimal to align with the principle of simplicity.

## Encryption at rest

Encryption at rest provides data protection for stored data. Attacks against data at-rest include attempts to get physical access to the hardware where the data is stored, and then compromise the contained data. You can use storage encryption to protect data stored on the device. Linux has several options for encryption at rest. Choose the option that best fits your needs. For Windows, [Windows BitLocker](/windows/security/operating-system-security/data-protection/bitlocker) is the recommended option for encryption at rest.

## Extensibility

With IoT technology driving different types of business transformations, security should evolve in parallel to address emerging scenarios. The Azure IoT Edge security framework starts with a solid foundation and builds extensibility into different dimensions, including:

* First-party security services, like the Device Provisioning Service for Azure IoT Hub.
* Third-party services like managed security services for different application verticals (like industrial or healthcare) or technology focus (like security monitoring in mesh networks, or silicon hardware attestation services) through a rich network of partners.
* Legacy systems, including retrofitting with alternate security strategies like using secure technology other than certificates for authentication and identity management.
* Secure hardware for adoption of emerging secure hardware technologies and silicon partner contributions.

Securing the intelligent edge requires collaborative contributions from an open community driven by a shared interest in securing IoT. These contributions might be in the form of secure technologies or services. The Azure IoT Edge security framework offers a solid foundation for security that is extensible for the maximum coverage to offer the same level of trust and integrity in the intelligent edge as with Azure cloud.  

## Next steps

Read more about how Azure IoT Edge is [Securing the intelligent edge](https://azure.microsoft.com/blog/securing-the-intelligent-edge/).
