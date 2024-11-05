---
title: Configure data based on STIG for Azure Automation State Configuration
description: This article tells how to configure data based on DoD STIG for Azure Automation State Configuration.
keywords: dsc,powershell,configuration,setup
services: automation
ms.subservice: desired-state-config
ms.date: 08/08/2019
ms.topic: conceptual
ms.service: azure-automation
---

# Configure data based on Security Technical Information Guide (STIG)

> Applies To: Windows PowerShell 5.1

[!INCLUDE [azure-automation-dsc-end-of-life](~/includes/dsc-automation/azure-automation-dsc-end-of-life.md)]

Creating configuration content for the first time can be challenging. In many cases, the goal is to
automate configuration of servers following a "baseline" that hopefully aligns to an industry
recommendation.

> [!NOTE]
> This article refers to a solution that's maintained by the Open Source community. Support is only
> available in the form of GitHub collaboration, not from Microsoft.

## Community project: PowerSTIG

A community project named [PowerSTIG][08] aims to resolve this issue by generating DSC content based
on [public information][11] provided about STIG (Security Technical Implementation Guide),

Dealing with baselines is more complicated than it sounds. Many organizations need to
[document exceptions][09] to rules and manage that data at scale. PowerSTIG addresses the problem by
providing [Composite Resources][10] to address each area of the configuration rather than trying to
address the entire range of settings in one large file.

After you create the configurations, you can use the [DSC Configuration scripts][04] to generate MOF
files and [upload the MOF files to Azure Automation][03]. To pull configurations, register your
servers from either [on-premises][02] or [in Azure][01].

To try out PowerSTIG, visit the [PowerShell Gallery][12] and download the solution or select
**Project Site** to view the [documentation][08].

## Next steps

- To understand PowerShell DSC, see [Windows PowerShell Desired State Configuration overview][06].
- To find PowerShell DSC resources, see [DSC Resources][07].
- For details of Local Configuration Manager configuration, see [Configuring the Local Configuration Manager][05].

<!-- link references -->
[01]: ./automation-dsc-onboarding.md#enable-azure-vms
[02]: ./automation-dsc-onboarding.md#enable-physicalvirtual-linux-machines
[03]: ./tutorial-configure-servers-desired-state.md#create-and-upload-a-configuration-to-azure-automation
[04]: /powershell/dsc/configurations/configurations
[05]: /powershell/dsc/managing-nodes/metaconfig
[06]: /powershell/dsc/overview
[07]: /powershell/dsc/resources/resources
[08]: https://github.com/microsoft/powerstig
[09]: https://github.com/microsoft/powerstig#powerstigdata
[10]: https://github.com/microsoft/powerstig#powerstigdsc
[11]: https://public.cyber.mil/stigs/
[12]: https://www.powershellgallery.com
