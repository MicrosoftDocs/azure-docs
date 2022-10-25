---
title: Configure data based on STIG for Azure Automation State Configuration
description: This article tells how to configure data based on DoD STIG for Azure Automation State Configuration.
keywords: dsc,powershell,configuration,setup
services: automation
ms.subservice: dsc
ms.date: 08/08/2019
ms.topic: conceptual
---

# Configure data based on Security Technical Information Guide (STIG)

> Applies To: Windows PowerShell 5.1

> [!NOTE]
> Before you enable Automation State Configuration, we would like you to know that a newer version of DSC is now generally available, managed by a feature of Azure Policy named [guest configuration](../governance/machine-configuration/overview.md). The guest configuration service combines features of DSC Extension, Azure Automation State Configuration, and the most commonly requested features from customer feedback. Guest configuration also includes hybrid machine support through [Arc-enabled servers](../azure-arc/servers/overview.md).

Creating configuration content for the first time can be challenging.
In many cases, the goal is to automate configuration of servers following a "baseline" that hopefully aligns to an industry recommendation.

> [!NOTE]
> This article refers to a solution that is maintained by the Open Source community.
> Support is only available in the form of GitHub collaboration, not from Microsoft.

## Community project: PowerSTIG

A community project named
[PowerSTIG](https://github.com/microsoft/powerstig)
aims to resolve this issue by generating DSC content based on
[public information](https://public.cyber.mil/stigs/)
provided about STIG (Security Technical Implementation Guide),

Dealing with baselines is more complicated than it sounds.
Many organizations need to
[document exceptions](https://github.com/microsoft/powerstig#powerstigdata)
to rules and manage that data at scale.
PowerSTIG addresses the problem by providing
[Composite Resources](https://github.com/microsoft/powerstig#powerstigdsc)
to address each area of the configuration
rather than trying to address the entire range of settings
in one large file.

Once the configurations have been generated,
you can use the
[DSC Configuration scripts](/powershell/dsc/configurations/configurations)
to generate MOF files
and
[upload the MOF files to Azure Automation](./tutorial-configure-servers-desired-state.md#create-and-upload-a-configuration-to-azure-automation).
Then register your servers from either
[on-premises](./automation-dsc-onboarding.md#enable-physicalvirtual-linux-machines)
or [in Azure](./automation-dsc-onboarding.md#enable-azure-vms)
to pull configurations.

To try out PowerSTIG, visit the
[PowerShell Gallery](https://www.powershellgallery.com)
and download the solution or click "Project Site"
to view the
[documentation](https://github.com/microsoft/powerstig).

## Next steps

- To understand PowerShell DSC, see [Windows PowerShell Desired State Configuration overview](/powershell/dsc/overview).
- Find out about PowerShell DSC resources in [DSC Resources](/powershell/dsc/resources/resources).
- For details of Local Configuration Manager configuration, see [Configuring the Local Configuration Manager](/powershell/dsc/managing-nodes/metaconfig).
