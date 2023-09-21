---
title: Firmware security - Azure Security
description: Learn how Microsoft secures Azure hardware and firmware.
author: yosharm
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: terrylan
manager: rkarlin
ms.date: 11/10/2022
---

# Firmware security
This article describes how Microsoft secures the cloud hardware ecosystem and supply chains.

## Securing the cloud hardware ecosystem
Microsoft actively partners within the cloud hardware ecosystem to drive continuous security improvements by:

- Collaborating with Azure hardware and firmware partners (such as component manufacturers and system integrators) to meet Azure hardware and firmware security requirements.

- Enabling partners to perform continuous assessment and improvement of their products’ security posture using Microsoft-defined requirements in areas such as:

  - Firmware secure boot
  - Firmware secure recovery
  - Firmware secure update
  - Firmware cryptography
  - Locked down hardware
  - Granular debug telemetry
  - System support for TPM 2.0 hardware to enable measured boot

- Engaging in and contributing to the [Open Compute Project (OCP)](https://www.opencompute.org/wiki/Security) security project through the development of specifications. Specifications promote consistency and clarity for secure design and architecture in the ecosystem.

   > [!NOTE]
   > An example of our contribution to the OCP Security Project is the [Hardware Secure Boot](https://docs.google.com/document/d/1Se1Dd-raIZhl_xV3MnECeuu_I0nF-keg4kqXyK4k4Wc/edit#heading=h.5z2d7x9gbhk0) specification.

## Securing hardware and firmware supply chains
Cloud hardware suppliers and vendors for Azure are also required to adhere to supply chain security processes and requirements developed by Microsoft. Hardware and firmware development and deployment processes are required to follow the Microsoft [Security Development Lifecycle](https://www.microsoft.com/securityengineering/sdl) (SDL) processes such as:

- Threat modeling
- Secure design reviews
- Firmware reviews and penetration testing
- Secure build and test environments
- Security vulnerability management and incident response

## Next steps
To learn more about what we do to drive platform integrity and security, see:

- [Platform code integrity](code-integrity.md)
- [Secure boot](secure-boot.md)
- [Measured boot and host attestation](measured-boot-host-attestation.md)
- [Project Cerberus](project-cerberus.md)
- [Encryption at rest](encryption-atrest.md)
- [Hypervisor security](hypervisor.md)