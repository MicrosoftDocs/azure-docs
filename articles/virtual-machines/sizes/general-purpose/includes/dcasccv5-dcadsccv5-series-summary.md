---
title: DCas_cc_v5 and DCads_cc_v5-series summary include
description: Include file containing a summary of the DCas_cc_v5 and DCads_cc_v5-series size family.
services: virtual-machines
author: mattmcinnes
ms.topic: include
ms.service: virtual-machines
ms.subservice: sizes
ms.date: 04/11/2024
ms.author: mattmcinnes
ms.custom: include file
---

Confidential child capable VMs allow you to borrow resources from the parent VM you deploy, to create AMD SEV-SNP protected child VMs. The parent VM has almost complete feature parity with any other general purpose Azure VM (for example, [D-series VMs](../d-family.md)). This parent-child deployment model can help you achieve higher levels of isolation from the Azure host and parent VM. These confidential child capable VMs are built on the same hardware that powers our [Azure confidential VMs](../../../../confidential-computing/confidential-vm-overview.md). Azure confidential VMs are now generally available.