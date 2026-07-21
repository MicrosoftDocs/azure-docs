---
title: Firmware security
description: Learn how Microsoft secures Azure hardware and firmware through ecosystem partnerships, supply chain requirements, and security development lifecycle processes.
author: yosharm
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: mbaldwin
ms.date: 11/10/2022
ai-usage: ai-assisted
---

# Firmware security
This article describes how Microsoft secures the cloud hardware ecosystem and supply chains.

## Securing the cloud hardware ecosystem
Microsoft actively partners within the cloud hardware ecosystem to drive continuous security improvements by:

- Collaborating with Azure hardware and firmware partners (such as component manufacturers and system integrators) to meet Azure hardware and firmware security requirements.

- Enabling partners to continuously assess and improve their products’ security posture by using Microsoft-defined requirements in areas such as:

  - Firmware secure boot
  - Firmware secure recovery
  - Firmware secure update
  - Firmware cryptography
  - Locked down hardware
  - Granular debug telemetry
  - System support for TPM 2.0 hardware to enable measured boot

- Engaging in and contributing to the [Open Compute Project (OCP)](https://www.opencompute.org/wiki/Security) security project through the development of specifications. Specifications promote consistency and clarity for secure design and architecture in the ecosystem.

   > [!NOTE]
   > An example of Microsoft's contribution to the OCP Security Project is the [Hardware Secure Boot](https://docs.google.com/document/d/1Se1Dd-raIZhl_xV3MnECeuu_I0nF-keg4kqXyK4k4Wc/edit#heading=h.5z2d7x9gbhk0) specification.

## Securing hardware and firmware supply chains
Microsoft requires cloud hardware suppliers and vendors for Azure to follow supply chain security processes and requirements. Microsoft also requires hardware and firmware development and deployment processes to follow the Microsoft [Security Development Lifecycle (SDL)](https://www.microsoft.com/securityengineering/sdl) processes, such as:

- Threat modeling
- Secure design reviews
- Firmware reviews and penetration testing
- Secure build and test environments
- Security vulnerability management and incident response

## Next steps
To learn more about Microsoft's work to drive platform integrity and security, see:

- [Platform code integrity](code-integrity.md)
- [Secure boot](secure-boot.md)
- [Measured boot and host attestation](measured-boot-host-attestation.md)
- [Project Cerberus](project-cerberus.md)
- [Encryption at rest](encryption-atrest.md)
- [Hypervisor security](hypervisor.md)
