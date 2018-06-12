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

The Azure IoT Edge Security Manager (ESM) is the portion of the IoT Edge device dedicated to defending integrity of the IoT Edge device platform and operations.  It transitions trust from an underlying hardware root of trust where available to securely boostrap the Edge runtime to a trusted operational state, and continuously monitors the integrity of device operations.  The IoT Edge Security Manager is therefore comprises software working in conjunction with secure silicon hardware where applicable to help deliver the highest security assurances possible.  The IoT Edge Device Security Promises explains secure hardware protection coverage given the choice of underlying root of trust hardware.

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
3. Secure silicon root of trust hardware (optional).

### The IoT Edge Security Daemon

IoT Edge security daemon is the software responsible for the logical operations of Edge Security Manager (ESM).  It comprises a significant portion of the trusted computing base of the edge device. To adequately and practically perform its responsibilities, it is designed to comply with the following core principles:

#### Maximize Operational Integrity

The Edge Security Daemon is designed to operate with the highest integrity for any given choice of root of trust hardware. As such, it is designed to be measured and monitored statically and at runtime for tampering and hardware.  For devices using secure enclaves as hardware root of trust, the Edge Security Daemon will ideally reside inside of the enclave.

#### Minimize Churn

For the hihghest trust, the Edge Security Daemon is designed to couple tightly with the device hardware root of trust where available, and operate as native code.  It is common for these types of realizations to update the daemon software through the hardware root of trust's secure update paths, which can be challenging depending on specific hardware and deployment scenario.  It stands to reason that frequent update requirements can expand the threat surface as in greater opportunities for tampering or greater motivation to elude updates.  For these reasons, the Edge Security Daemon is designed with just the necessary essetials to keep the footprint and hence the trusted computing base small and minimize opportunities for updates.  This should minimize the burden of security maintenance to key IoT roles like  Original Equipment Manufacturers (OEM) and System Integrators (SI).

### The Hardware Security Module Platform Abstraction Layer (HSM PAL)

The HSM PAL abstracts all root of trust hardware to isolate the developer or user of IoT Edge from their complexities.  It comprises a combination of Application User Interface (API) and trans domain communications procedures e.g. communication between a standard execution environment and a secure enclave.  The actual implementation of the HSM PAL depends on the specific secure hardware in use.  Its existence enables the use of virtually any secure silicon hardware across the IoT ecosystem.

### The Secure Silicon Root of Trust Hardware

This is the secure silicon that provides the hardware root of trust for the silicon device.  This includes Trusted Platform Module (TPM), embedded Secure Element (eSM), ARM Trustzone, Intel SGX, and custom secure silicon technologies.  The use of secure silicon root of trust in devices is optional with potential rational explained by Device Security Promises, but is highly recommended as the IoT threat surface continues to expand with growth in computation analytical technologies.

#======================================================================



## Next steps

Read the blog on [Securing the intelligent edge](https://azure.microsoft.com/en-us/blog/securing-the-intelligent-edge/)

<!-- Links -->
[lnk-edge-blog]: https://azure.microsoft.com/blog/securing-the-intelligent-edge/ 