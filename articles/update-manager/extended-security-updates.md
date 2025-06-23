---
title: Extended Security Updates (ESU) for Windows Server with Azure Update Manager
description: Information on enrolling and managing Extended Security Updates (ESU) for Windows Server 2012 and 2012 R2 using Azure Update Manager.
ms.service: azure-update-manager
author: habibaum
ms.author: v-uhabiba
ms.date: 03/23/2025
ms.topic: overview
---

# Extended Security Updates (ESU) for Windows Server

This article provides information on ESU on Azure VMs and Azure Arc machines.

## What are Extended Security Updates 

Extended Security Updates for Windows Server include security updates and bulletins rated *critical* and *important* for a maximum period from the end of extended support, depending on the version.  

Extended Security Updates doesn't include new features, customer-requested non-security hotfixes, or design change requests. For more information, see [Overview of Extended Security Updates for Windows Server 2008, 2008 R2, 2012, 2012 R2](/windows-server/get-started/extended-security-updates-overview#what-are-extended-security-updates).

### Azure virtual machines

ESUs are available free of charge and by default for servers hosted in Azure.

### Azure Arc enabled machines

ESUs are available to purchase for servers not hosted in Azure. Using Azure Update Manager, you can deploy Extended Security Updates for your Azure Arc-enabled Windows Server 2012 / R2 machines. 


## Enroll Windows Server 2012 ESU on Arc machines

To enroll in Windows Server 2012 Extended Security Updates on Arc connected machines, follow the guidance on [How to get Extended Security Updates (ESU) for Windows Server 2012 and 2012 R2 via Azure Arc](/windows-server/get-started/extended-security-updates-deploy#extended-security-updates-enabled-by-azure-arc).


## Next steps

- Learn about the [supported regions for Azure VMs and Arc-enabled servers](supported-regions.md).
- Learn on the [Update sources, types](support-matrix.md) managed by Azure Update Manager.
- Know more on [supported OS and system requirements for machines managed by Azure Update Manager](support-matrix-updates.md).
- Learn on [Automatic VM guest patching](support-matrix-automatic-guest-patching.md).
- Learn more on [unsupported OS and Custom VM images](unsupported-workloads.md).
- Learn more on how to [configure Windows Update settings](configure-wu-agent.md) to work with Azure Update Manager.
- Learn about [security vulnerabilities and Ubuntu Pro support](security-awareness-ubuntu-support.md).

