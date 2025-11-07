---
title: Azure platform integrity and security - Azure Security
description: Technical overview of Azure platform integrity and security.
author: yosharm
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: mbaldwin
ms.date: 11/04/2025
---

# Platform integrity and security overview
The Azure fleet is composed of millions of servers (hosts) with thousands more added on a daily basis. Thousands of hosts also undergo maintenance on a daily basis through reboots, operating system refreshes, or repairs. Before a host can join the fleet and begin accepting customer workloads, Microsoft verifies that the host is in a secure and trustworthy state. This verification ensures that malicious or inadvertent changes have not occurred on boot sequence components during the supply chain or maintenance workflows.

## Securing Azure hardware and firmware
This series of articles describe how Microsoft ensures integrity and security of hosts through various stages in their lifecycle, from manufacturing to sunset. The articles address:
 
- [Firmware security](/azure/security/fundamentals/firmware)
- [Platform code integrity](/azure/security/fundamentals/code-integrity)
- [UEFI Secure Boot](/azure/security/fundamentals/secure-boot)
- [Measured boot and host attestation](/azure/security/fundamentals/measured-boot-host-attestation)
- [Project Cerberus](/azure/security/fundamentals/project-cerberus)
- [Encryption at rest](/azure/security/fundamentals/encryption-atrest)
- [Hypervisor security](/azure/security/fundamentals/hypervisor)
 
## Next steps

- Learn how Microsoft actively partners within the cloud hardware ecosystem to drive continuous [firmware security improvements](/azure/security/fundamentals/firmware).

- Understand your [shared responsibility in the cloud](/azure/security/fundamentals/shared-responsibility).