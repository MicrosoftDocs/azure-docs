---
title: Extended Security Updates (ESU) for Windows Server with Azure Update Manager
description: Information on enrolling and managing Extended Security Updates (ESU) for Windows Server 2012, 2012 R2, and 2016 using Azure Update Manager.
ms.service: azure-update-manager
author: jyothisuri
ms.author: jsuri
ms.date: 08/05/2026
ms.topic: overview
ms.update-cycle: 1095-days
# Customer intent: "As an IT administrator managing Windows Server environments, I want to enroll in Extended Security Updates for my Azure Arc-enabled machines, so that I can ensure critical security updates are applied and maintain compliance for outdated servers."
---

# Extended Security Updates (ESU) for Windows Server

This article provides information on ESU on Azure VMs and Azure Arc machines.

## What are Extended Security Updates

Extended Security Updates for Windows Server include security updates and bulletins rated _critical_ and _important_ for a maximum period from the end of extended support, depending on the version.

Extended Security Updates doesn't include new features, customer-requested non-security hotfixes, or design change requests. For more information, see [Overview of Extended Security Updates for Windows Server 2012, 2012 R2, and 2016](/windows-server/get-started/extended-security-updates-overview#what-are-extended-security-updates).

### Azure virtual machines

For Windows Server 2012 and 2012 R2, you get ESUs free of charge and by default for servers hosted in Azure.

### Azure Arc enabled machines

You can purchase ESUs for servers that aren't hosted in Azure. By using Azure Update Manager, you can deploy Extended Security Updates for your Azure Arc-enabled Windows Server 2012, 2012 R2, and 2016 machines.

## Enroll Windows Server 2012, 2012 R2, and 2016 ESU on Arc machines

To enroll in Windows Server 2012, 2012 R2, and 2016 Extended Security Updates on Arc-connected machines, follow the guidance on [How to get Extended Security Updates (ESU) for Windows Server 2012, 2012 R2, and 2016 via Azure Arc](/windows-server/get-started/extended-security-updates-deploy#extended-security-updates-enabled-by-azure-arc).

## Next steps

- Learn about the [supported regions for Azure VMs and Arc-enabled servers](supported-regions.md).
- Learn on the [Update sources, types](support-matrix.md) managed by Azure Update Manager.
- Know more on [supported OS and system requirements for machines managed by Azure Update Manager](support-matrix-updates.md).
- Learn on [Automatic VM guest patching](support-matrix-automatic-guest-patching.md).
- Learn more on [unsupported OS and Custom VM images](unsupported-workloads.md).
- Learn more on how to [configure Windows Update settings](configure-wu-agent.md) to work with Azure Update Manager.
- Learn about [security vulnerabilities and Ubuntu Pro support](security-awareness-ubuntu-support.md).
