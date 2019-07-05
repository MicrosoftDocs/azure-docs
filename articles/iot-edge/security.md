---
title: Security framework - Azure IoT Edge | Microsoft Docs 
description: Learn about the security, authentication, and authorization standards that were used to develop Azure IoT Edge and should be considered as you design your solution
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 02/25/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom: seodec18
---

# Security standards for Azure IoT Edge

Azure IoT Edge is designed to address the risk scenarios that are inherent when moving your data and analytics to the intelligent edge. The IoT Edge security standards provide flexibility for different risk profiles and deployment scenarios while still offering the protection that you expect from all Azure services. 

Azure IoT Edge runs on various hardware makes and models, supports several operating systems, and applies to diverse deployment scenarios. Assessing the risk of a deployment scenario depends on many considerations including solution ownership, deployment geography, data sensitivity, privacy, application vertical, and regulatory requirements. Rather than offering concrete solutions for specific scenarios, IoT Edge is an extensible security framework based on well-grounded principles that are designed for scale. 
 
This article provides an overview of the IoT Edge security framework. For more information, see [Securing the intelligent edge](https://azure.microsoft.com/blog/securing-the-intelligent-edge/).

## Standards

Standards promote ease of scrutiny and ease of implementation, both of which are hallmarks of security. A security solution should lend itself to scrutiny under evaluation to build trust and shouldn't be a hurdle to deployment. The design of the framework to secure Azure IoT Edge is based on time-tested and industry proven security protocols for familiarity and reuse. 

## Authentication

When you deploy an IoT solution, you need to know that only trusted actors, devices, and modules have access to your solution. Such knowledge offers secure accountability of participants. Azure IoT Edge attains this knowledge through authentication. Certificate-based authentication is the primary mechanism for authentication for the Azure IoT Edge platform. This mechanism derives from a set of standards governing Public Key Infrastructure (PKiX) by the Internet Engineering Task Force (IETF).     

All devices, modules, and actors interacting with the Azure IoT Edge device, whether physically or through a network connection, should have unique certificate identities. However, not every scenario or component may lend itself to certificate-based authentication. In those scenarios, the extensibility of the security framework offers secure alternatives. 

## Authorization

The principle of least privilege says that users and components of a system should have access only to the minimum set of resources and data needed to perform their roles. Devices, modules, and actors should access only the resources and data within their permission scope, and only when it is architecturally allowable. Some permissions are configurable with sufficient privileges and others are architecturally enforced.  For example, a module may be authorized through privileged configuration to initiate a connection to Azure IoT Hub. However, there is no reason why a module in one Azure IoT Edge device should access the twin of a module in another Azure IoT Edge device.

Other authorization schemes include certificate signing rights and role-based access control (RBAC). 

## Attestation

Attestation ensures the integrity of software bits.  It is important for the detection and prevention of malware.  The Azure IoT Edge security framework classifies attestation under three main categories:

* Static attestation
* Runtime attestation
* Software attestation

### Static attestation

Static attestation verifies the integrity of all software on a device, including the operating system, all runtimes, and configuration information at device power-up. It is often referred to as secure boot. The security framework for Azure IoT Edge devices extends to manufacturers and incorporates secure hardware capabilities that assure static attestation processes. These processes include secure boot and secure firmware upgrade.  Working in close collaboration with silicon vendors eliminates superfluous firmware layers, so minimizes the threat surface. 

### Runtime attestation

Once a system has completed a secure boot process and is up and running, well-designed systems would detect attempts to inject malware and take proper countermeasures. Malware attacks may target the system's ports and interfaces to access the system. Or, if malicious actors have physical access to a device they may tamper with the device itself or use side-channel attacks to gain access. Such malcontent, which can be in the form of malware or unauthorized configuration changes, can't be detected by static attestation because it is injected after the boot process. Countermeasures offered or enforced by the device’s hardware help to ward off such threats.  The security framework for Azure IoT Edge explicitly calls for extensions that combat runtime threats.  

### Software attestation

All healthy systems, including intelligent edge systems, must accept patches and upgrades.  Security is important for update processes otherwise they can be potential threat vectors.  The security framework for Azure IoT Edge calls for updates through measured and signed packages to assure the integrity of and authenticate the source of the packages.  This standard applies to all operating systems and application software bits. 

## Hardware root of trust

For many intelligent edge devices, especially devices in places where potential malicious actors have physical access to the device, device hardware security is the last defense for protection. Tamper resistant hardware is crucial for such deployments. Azure IoT Edge encourages secure silicon hardware vendors to offer different flavors of hardware root of trust to accommodate various risk profiles and deployment scenarios. Hardware trust may come from common security protocol standards like Trusted Platform Module (ISO/IEC 11889) and Trusted Computing Group’s Device Identifier Composition Engine (DICE). Secure enclave technologies like TrustZones and Software Guard Extensions (SGX) also provide hardware trust. 

## Certification

To help customers make informed decisions when procuring Azure IoT Edge devices for their deployment, the Azure IoT Edge framework includes certification requirements.  Foundational to these requirements are certifications pertaining to security claims and certifications pertaining to validation of the security implementation.  For example, a security claim certification would inform that the IoT Edge device uses secure hardware known to resist boot attacks. A validation certification would inform that the secure hardware was properly implemented to offer this value in the device.  In keeping with the principle of simplicity, the framework tries to keep the burden of certification minimal.   

## Extensibility

With IoT technology driving different types of business transformations, it stands to reason that security should evolve in parallel to address emerging scenarios.  The Azure IoT Edge security framework starts with a solid foundation on which it builds in extensibility into different dimensions to include: 

* First party security services like the Device Provisioning Service for Azure IoT Hub.
* Third-party services like managed security services for different application verticals (like industrial or healthcare) or technology focus (like security monitoring in mesh networks or silicon hardware attestation services) through a rich network of partners.
* Legacy systems to include retrofitting with alternate security strategies, like using secure technology other than certificates for authentication and identity management.
* Secure hardware for adoption of emerging secure hardware technologies and silicon partner contributions.

In the end, the highest success in securing the intelligent edge results from collaborative contributions from an open community driven by the common interest in securing IoT.  These contributions might be in the form of secure technologies or services.  The Azure IoT Edge security framework offers a solid foundation for security that is extensible for the maximum coverage to offer the same level of trust and integrity in the intelligent edge as with Azure cloud.  

## Next steps

Read more about how Azure IoT Edge is [Securing the intelligent edge](https://azure.microsoft.com/blog/securing-the-intelligent-edge/).
