---
title: Azure IoT Edge Security Manager | Microsoft Docs 
description: Manages the IoT Edge device security stance and the integrity of security services.
services: iot-edge
keywords: Security, Element, Enclave
author: eustacea
manager: timlt

ms.author: eustacea
ms.date: 06/05/2018
ms.topic: article
ms.service: iot-edge

---
# Azure IoT Edge Security Manager

The Azure IoT Edge Security Manager (ESM) is the portion of the IoT Edge device dedicated to defending integrity of IoT Edge operations.  It transitions trust from an underlying hardware root of trust where available to securely boostrap the Edge runtime to a trusted operational state, and continuously monitors the integrity of device operations.  The IoT Edge Security Manager is therefore a comprises software working in conjunction with secure silicon hardware where applicable to help deliver the highest security assurance possible with the operation of the Edge device.  The IoT Edge Device Security Promises explains threats perception and management strategies for IoT Edge devices with or without secure hardware root of trust.

The responsibilities of the Edge Security Manager includes (but not limited to):

1. Secured and measured bootstrapping of the Azure IoT Edge device.
2. Device identity provisioning and transition of trust where applicable.
3. Host and protect device components of cloud services like Device Provisioning Service.
4. Securely provision IoT Edge modules with module unique identity.
5. Device platform gatekeeper to hardware root of trust through notary services.
6. Monitor the runtime integrity of IoT Edge operational environment.

## Components of the IoT Edge Security Manager

IoT Edge Security Manager comprises three major components:

1. IoT Edge security daemon.
2. Hardware security module platform abstraction Layer (HSM PAL).
3. Optional root of trust hardware.

### The IoT Edge Security Daemon

IoT Edge security daemon is software that executes the logic operations of the ESM.  It is the brains and workhorse delivering functional requirements of ESM.


#======================================================================

The architecture and development of Azure IoT Edge conforms with security best practices to offer the most assurance. However, physical accessibility to edge devices by potentially malicious actors introduces a class of risks better mitigated by rooting trust and integrity in secure silicon sometimes also known as Hardware Secure Modules(HSM). However, adding secure silicon to an IoT device's bill of materials (BOM) is a sore point to many because it adds to device cost.  Given secure silicon comes in different flavors and cost point, over engineering security with high-end secure silicon is undesirable while underengineering will miss the security target.  This natural tension between cost and security engineering creates the need to optimally balance cost with security goals.

Azure IoT Edge defines security promises to assist stakeholders to quickly make optimal choices for IoT devices.  A security promise defines the maximum protection achievable by the device with proper diligence. Said another way, a security promise defines the maximum risk the device can cover.  Diligence in the engineering of the security of the edge device itself is measurable and messaged through security certifications.

It is important to note what a security promise is not:

- It is not a guarantee of security.  There are no guarantees for security, only identification and mitigation of risks.
- It is not a measure of the strength of security.  Strength is measurable and communicated through security certifications.

>[!NOTE]
>A security promise is a promise of what risks are within the devices mitigation capabilities.  It is neither a security guarantee nor a statement of the strength of security.

Azure IoT Edge security promises are best appreciated through various [stakeholder roles](#Azure-IoT-Edge-Security-Promises-and-IoT-Stakeholder-Roles) provided towards the end of this article.

## Security Promise Offerings

Azure IoT Edge currently defines three security promises, Standard, Element, and Enclave promises.  The development of all three follows security best practices in the use of cryptography and security protocols thereby helping to offer the most assurance as could be expected from a software-only security implementation.  The promises categorizes the use of secure silicon technology for security hardening.

### The Standard Promise

Azure IoT Edge devices with the standard promise are devices lacking of hardening by secure silicon or HSM.  These include all devices without secure silicon and devices with secure silicon but for which the secure silicon has not been applied towards the protection of Azure IoT Edge device.  The latter case, devices with secure silicon not used towards protection of the device, exists in cases where the Original Equipment Manufacturer (OEM) decides to include the secure silicon as part of a future proofing strategy, or just has not gotten applying the capabilities of the secure silicon for device protection.  It is generally assumed standard promise devices lack secure silicon for cost benefits.

Azure IoT Edge devices with the standard promise will offer security as long as they are operated in secured perimeters with proper personnel access control mechanisms in place. A breach of the secured perimeter puts the entire device at risk.  For these devices, risks from physical access can never be mitigated outside of the trusted custody drived from the secured perimeter and personnel access control.

We do not recommend use of devices with the standard security promise but leave the judgement to IoT deployment owner who can decide based on their specific threats and risk assessment.

### The Secure Element Promise

Azure IoT Edge devices with the secure element promise are devices hardened with secure silicon for the protection of secrets like cryptographic keys. These includes devices utilizing secure element technologies like Trusted Platform Modules(TPM) and embedded Secure Elements (eSE) for the protection of secrets.  These also include devices that utilize secure enclave technologies like ARM TrustZone and Intel SGX but limit the application of these technologies only to the protection of keys.  A plausible explanation for the latter case is future proofing by the OEM or differential feature enablement by silicon provider.  It is generally assumed devices designed to protect just secrets will utilize only secure element technologies as they typically are less costlier secure silicon.

Azure IoT Edge devices with the element promise will offer protection to secrets like cryptographic keys but not the execution . They therefore offer a higher level of assurance for secrets protection, but not the execution environment, should they fall into malicious custody.  Put another way, they promise to limit the risks from malicious physical access to the protection of keys and makes no pretense to protecting the execution environment. The level of protection shall depend on the strength of security offered by the underlying secure silicon technology. The strength of security is measurable and messaged through security certifications.

An example of deployments where secure element promise are optimal for are those with security goal limited to the protection of endpoint identity.

### The Secure Enclave Promise

Azure IoT Edge devices with the secure enclave promise are devices hardened with secure silicon for the protection of secrets like cryptographic keys as well as for the protection of the execution environment. These include devices that utilize secure enclave technologies like ARM TrustZone, Intel SGX, or custom secure Microcontrollers as the underlying secure silicon.  Secure enclave technologies are generally more costly than secure element technologies.

Azure IoT Edge devices with the enclave promise will offer protection to secrets like cryptographic keys as well as a trusted execution environments. Put another way, they promise to protect secrets and the execution environment should the device falls in malicious custody.  The level of protection shall depend on strength of security offered by teh underlying silicon technology. The strength of security is measurable and messaged through security certifications.

Devices with the secure enclave promise are most applicable for use with deployments that, in addition to endpoint identity protection, also have transactions such as policy enforcements, metering, monetization, secure logging, and secure I/O as secure goals.

![Azure IoT Edge Security Promises](./media/1804_Security_Promises.png)

## Security Promise and Certifications

Azure IoT Edge security promises conveys information about the risks that are within the device's scope of mitigation capabilities.  A logical next question is how well does the device mitigate these risks.  Assuming a good overall security hygiene, this is a question of the strength of security of the device.  The this strength is measurable and communicable though security certifications.  For more information see [Azure IoT Edge Security Certifications (coming)](#hold-off *todo* link to security certification page).

## Security Promise and Signed Attestations

Achieving Azure IoT Edge certifications requires submission for testing and claims validation by one of many third party certification laboratories.  These labs will sign secure element and secure enclave promise devices and provide openly available attestation certificates.  Trust in the attestation will be rooted in the secure silicon contained in these devices on the device side and in the public root certificate authority the attestation certificate roots to on the cloud side.  Signed attestations provides ability to validate the security promise offered by the device.

>[!NOTE]
>Signed attestations are coming soon.

## Azure IoT Edge Security Promises and IoT Stakeholder Roles

The value of Azure IoT Edge device security promises can be appreciated through some stakeholder roles in the IoT value chain.

### The Original Equipment Manufacturer

The Original Equipment Manufacturer (OEM) decides on what secure silicon technology to embed into their devices and on how much engineering to invest in availing various capabilities of the secure silicon.  Targeting a security promise tantamounts to targeting a market segment.  For example, availing secure enclave devices enables adoption of their devices by system integrators that require trusted execution environment in their deployments.

### The Systems Integrator

The System Integrator (SI) can quickly decide on the optimal IoT Edge devices to procure for their deployment based on solution needs trusted execution environment or their risk assessment.  The best part is that they don't have to understand the underlying secure silicon technology or have to verify diligence put forth by the OEM in applying the secure silicon technology.  The security promise will convey information on risk coverage while security certification conveys information on diligence thereby enabling the optimal choice.

### The IoT Edge Module Developer

Some Azure IoT Edge module developers with modules in the Azure IoT Edge modules marketplace may want to restrict deployment of their modules to devices that meet certain security criteria.  There are many plausible reasons for this choice.  One reason may be the need to control the number of nodes that run module.  Another reason may be to protect intellectual property inherent in the module like machile learning model parameters.  With signed attestations, the developer can programmatically detect the security promise offered by the target device.

To control node count, the developer can detect and enable deployment only to secure element and secure enclave promise devices. To protect sensitive intellectual property, the developer may enable deployment only to secure enclave promise devices.  In either case, the developer will not need to actually know the device or much less the underlying secure silicon technology and how well the technology was applied.  Azure IoT Edge security promises spares the developer this pain.

### The IoT Operator

Ideally, all deployments should be secure and all security details transparent to the IoT operator.  However, some risks shall determine amount of diligence required in vetting operator personnel and the depth of access control policies.  It stands to reason that standard promise devices will demand the most stringent vetting and controls, followed by secure element and secure enclave promise devices in that order.  The security promises of the Azure IoT Edge devices quickly conveys the information on the depth of personnel controls.
 
### The Independent Solutions Vendor

Independent Solutions Vendors (ISV) seeking to deliver solutions in the form of extensions to secure enclave applications. An example could be a secure enclave extension that solves a problem for a particular industry veritical like protecting the confidentiality and use of lighting parameters in the lighting industry.  Azure IoT Edge security promises will provide them with information on what devices to target their solutions for, which in essence is identification of respective OEM's commitment to security engineering.

Azure IoT Edge security promise exists to facility decisions for various stakeholders in the IoT value chain.  It conveys information beyond the underlying secure silicon technology embedded in the IoT Edge device to include proper applicability of the secure silicon technology and the classes of risks subsumed under coverage.  It dovetails well with the security cerficiation program for Azure IoT Edge to convey information regarding assurance in coverage.

## Next steps

Read the blog on [Securing the intelligent edge](https://azure.microsoft.com/en-us/blog/securing-the-intelligent-edge/)

<!-- Links -->
[lnk-edge-blog]: https://azure.microsoft.com/blog/securing-the-intelligent-edge/ 