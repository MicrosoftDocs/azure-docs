---
title: Security in Azure IoT Edge | Microsoft Docs 
description: Security, authentication, and authorization of IoT Edge devices
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 10/05/2017
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Securing Azure IoT Edge

Securing the intelligent edge is necessary to confer confidence in the operation of an end to end IoT solution. Azure IoT Edge is designed for security that is extensible to different risk profiles, deployment scenarios, and offers the same protection that you expect from all Azure services.

Azure IoT Edge runs on different hardware, supports both Linux and Windows, and is applicable to diverse deployment scenarios.  Assessed risk depends on many considerations including solution ownership, deployment geography, data sensitivity, privacy, application vertical, and regulatory requirements.  Rather than offering concrete solutions to specific scenarios, it makes sense to design an extensible security framework based on well-grounded principles designed for scale. 
 
This article provides an overview of the security framework. For more information, see [Securing the intelligent edge][lnk-edge-blog].

## Standards

Standards promote ease of scrutiny and ease of implementation, which are the hallmark of security.  A well architected security solution should lend itself to scrutiny under evaluation to build trust and should not be a hurdle to deployment.  The design of the framework to secure Azure IoT Edge emanates from time-tested and industry proven security protocols to leverage familiarity and reuse. 

## Authentication

Knowing without a doubt what actors, devices, and components are participating in the delivery of value through an end to end IoT solution is paramount in building trust.  Such knowledge offers secure accountability of participants to enabling basis for admission.  Azure IoT Edge attains this knowledge through authentication.  The primary mechanism for authentication for the Azure IoT Edge platform is certificate-based authentication.  This mechanism derives from a set of standards governing Public Key Infrastructure (PKiX) by the Internet Engineering Task Force (IETF).     

The Azure IoT Edge security framework calls for unique certificate identities for all devices, modules (containers that encapsulate logic within the device), and actors interacting with the Azure IoT Edge device be it physically or through a network connection.  Not every scenario or component may lend itself to certificate-based authentication for which the extensibility of the security framework offers secure avenues for accommodation. 

## Authorization

The ability to delegate authority and control access is crucial towards achieving a fundamental security principle – the principle of least privilege.  Devices, modules, and actors may gain access only to resources and data within their permission scope and only when it is architecturally allowable.  This means some permissions are configurable with sufficient privileges and others architecturally enforced.  For example, while a module may be authorized through privileged configuration to initiate a connection to Azure IoT Hub, there is no reason why a module in one Azure IoT Edge device should access the twin of a module in another Azure IoT Edge device.  For this reason, the latter would be architecturally precluded. 

Other authorization schemes include certificate signing rights, and role-based access control (RBAC).  The extensibility of the security framework permits adoption of other mature authorization schemes. 

## Attestation

Attestation ensures the integrity of software bits.  It is important for the detection and prevention of malware.  The Azure IoT Edge security framework classifies attestation under three main categories:

* Static attestation
* Runtime attestation
* Software attestation

### Static attestation

Static attestation is the verification of the integrity of all software bits including the operating systems, all runtimes, and configuration information at device power-up.  It is often referred to as secure boot.  The security framework for Azure IoT Edge devices extends to silicon vendors and incorporates secure hardware ingrained capabilities to assure static attestation processes. These processes include secure boot and secure firmware upgrade processes.  Working in close collaboration with silicon vendors eliminates superfluous firmware layers thereby minimizing the threat surface. 

### Runtime attestation

Once a system has completed a validated boot process and is up and running, well designed secure systems would detect attempts to inject malware through the systems ports and interfaces and take proper countermeasures.  For intelligent edge devices in physical custody of malicious actors, it is possible to inject malcontent through means other than device interfaces like tampering and side-channel attacks.   Such malcontent, which can be in the form of malware or unauthorized configuration changes, would normally not be detected by the secure boot process because they happen after the boot process.  Countermeasures offered or enforced by the device’s hardware greatly contributes towards warding off such threats.  The security framework for Azure IoT Edge explicitly calls out for extensions for combatting runtime threats.     

### Software attestation

All healthy systems including intelligent edge systems must be amenable to patches and upgrades.  Security is important for the update processes otherwise they can be potential threat vectors.  The security framework for Azure IoT Edge calls for updates through measured and signed packages to assure the integrity and authenticate the source of the packages.  This is applicable to all operating systems and application software bits. 

## Hardware root of trust

For many deployments of intelligent edge devices, especially those deployed in places where potential malicious actors have physical access to the device, security offered by the device hardware is the last defense for protection.  For this reason, anchoring trust in tamper resistant hardware is most crucial for such deployments.  The security framework for Azure IoT Edge entails collaboration of secure silicon hardware vendors to offer different flavors of hardware root of trust to accommodate various risk profiles and deployment scenarios. These include use of secure silicon adhering to common security protocol standards like Trusted Platform Module (ISO/IEC 11889) and Trusted Computing Group’s Device Identifier Composition Engine (DICE).  These also include secure enclave technologies like TrustZones and Software Guard Extensions (SGX). 

## Certification

To help customers make informed decisions when procuring Azure IoT Edge devices for their deployment, the Azure IoT Edge framework includes certification requirements.  Foundational to these requirements are certifications pertaining to security claims and certifications pertaining to validation of the security implementation.  For example, a security claim certification would inform that the IoT Edge device uses secure hardware known to resist boot attacks. A validation certification would inform that the secure hardware was properly implemented to offer this value in the device.  In keeping with the principle of simplicity, the framework offers the vision of keeping the burden of certification minimal.   

## Extensibility

Extensibility is a first-class citizen in the Azure IoT Edge security framework.  With IoT technology driving different types of business transformations, it stands to reason that security should seamlessly evolve in lockstep to address emerging scenarios.  The Azure IoT Edge security framework starts with a solid foundation on which it builds in extensibility into different dimensions to include: 

* First party security services like the Device Provisioning Service for Azure IoT Hub.
* Third-party services like managed security services for different application verticals (like industrial or healthcare) or technology focus (like security monitoring in mesh networks or silicon hardware attestation services) through a rich network of partners.
* Legacy systems to include retrofitting with alternate security strategies, like using secure technology other than certificates for authentication and identity management.
* Secure hardware for seamless adoption of emerging secure hardware technologies and silicon partner contributions.

These are just a few examples of dimensions for extensibility and Azure IoT Edge security framework is designed to be secure from the ground up to support this extensibility. 

In the end, the highest success in securing the intelligent edge results from collaborative contributions from an open community driven by the common interest in securing IoT.  These contributions might be in the form of secure technologies or services.  The Azure IoT Edge security framework offers a solid foundation for security that is extensible for the maximum coverage to offer the same level of trust and integrity in the intelligent edge as with Azure cloud.  

## Next steps

Read more about how Azure IoT Edge is [Securing the intelligent edge][lnk-edge-blog].

<!-- Links -->
[lnk-edge-blog]: https://azure.microsoft.com/blog/securing-the-intelligent-edge/ 