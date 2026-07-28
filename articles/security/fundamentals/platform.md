---
title: Azure platform integrity and security
description: Learn how Microsoft verifies Azure platform integrity across hardware, firmware, boot sequence components, and host lifecycle operations.
author: yosharm
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.author: mbaldwin
ms.date: 05/05/2026
ai-usage: ai-assisted
---

# Platform integrity and security overview
The Azure fleet is composed of millions of servers (hosts) with thousands more added daily. Thousands of hosts also undergo maintenance daily through reboots, operating system refreshes, or repairs. Before a host can join the fleet and begin accepting customer workloads, Microsoft verifies that the host is in a secure and trustworthy state. This verification process ensures that malicious or inadvertent changes didn't occur on boot sequence components during the supply chain or maintenance workflows.

## Securing Azure hardware and firmware
This series of articles describes how Microsoft ensures the integrity and security of hosts through various stages in their lifecycle, from manufacturing to retirement. The articles address:

- [Firmware security](firmware.md)
- [Platform code integrity](code-integrity.md)
- [UEFI Secure Boot](secure-boot.md)
- [Measured boot and host attestation](measured-boot-host-attestation.md)
- [Project Cerberus](project-cerberus.md)
- [Encryption at rest](encryption-atrest.md)
- [Hypervisor security](hypervisor.md)

## Next steps

- Learn how Microsoft actively partners within the cloud hardware ecosystem to drive continuous [firmware security improvements](firmware.md).

- Understand your [shared responsibility in the cloud](shared-responsibility.md).