---
title: Project Cerberus
description: Learn how Project Cerberus provides a hardware root of trust to help validate firmware integrity for Azure infrastructure hosts.
author: yosharm
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: mbaldwin
ms.date: 08/29/2024
ai-usage: ai-assisted
---

# Project Cerberus

Cerberus is a NIST 800-193 compliant hardware root of trust with an identity that no one can clone. Cerberus is designed to further raise the security posture of Azure infrastructure by providing a strong anchor of trust for firmware integrity.

## Enabling an anchor of trust
Every Cerberus chip has a unique cryptographic identity established by using a signed certificate chain rooted to a Microsoft certificate authority (CA). Azure can use measurements obtained from Cerberus to validate the integrity of components such as:

- Host
- Baseboard Management Controller (BMC)
- All peripherals, including network interface card and [system-on-a-chip](https://en.wikipedia.org/wiki/System_on_a_chip) (SoC)

This anchor of trust helps defend platform firmware from:

- Compromised firmware binaries running on the platform
- Malware and attackers that exploit bugs in the operating system, application, or hypervisor
- Certain types of supply chain attacks (manufacturing, assembly, transit)
- Malicious insiders with administrative privileges or access to hardware

## Cerberus attestation
Cerberus authenticates firmware integrity for server components by using a Platform Firmware Manifest (PFM). PFM defines a list of authorized firmware versions and provides a platform measurement to the Azure [Host Attestation Service](measured-boot-host-attestation.md). The Host Attestation Service validates the measurements and determines whether to allow only trusted hosts to join the Azure fleet and host customer workloads.

In conjunction with the Host Attestation Service, Cerberus capabilities enhance and promote a highly secure Azure production infrastructure.

> [!NOTE]
> To learn more, see the [Project Cerberus](https://github.com/opencomputeproject/Project_Olympus/tree/master/Project_Cerberus) information on GitHub.

## Next steps
To learn more about what Microsoft does to drive platform integrity and security, see:

- [Firmware security](firmware.md)
- [Platform code integrity](code-integrity.md)
- [Secure boot](secure-boot.md)
- [Measured boot and host attestation](measured-boot-host-attestation.md)
- [Encryption at rest](encryption-atrest.md)
- [Hypervisor security](hypervisor.md)