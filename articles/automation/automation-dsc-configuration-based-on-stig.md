---
title: Configuration based on STIG to use in state configuration - Azure Automation
description: Learn about configurations based on STIG for state configuration in Azure Automation.
keywords: dsc,powershell,configuration,setup
services: automation
ms.service: automation
ms.subservice: dsc
author: mgreenegit
ms.author: migreene
ms.date: 08/08/2019
ms.topic: conceptual
manager: carmonm
---
# Configuration based on STIG

> Applies To: Windows PowerShell 5.1

Creating configuration content for the first time can be challenging.
In many cases,
the goal is to automate configuration of servers
following a "baseline" that hopefully aligns to an industry recommendation.

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
[DSC Configuration scripts](/powershell/scripting/dsc/configurations/configurations)
to generate MOF files
and
[upload the MOF files to Azure Automation](/azure/automation/tutorial-configure-servers-desired-state#create-and-upload-a-configuration-to-azure-automation).
Then register your servers from either
[on-premises](/azure/automation/automation-dsc-onboarding#physicalvirtual-windows-machines-on-premises-or-in-a-cloud-other-than-azure-including-aws-ec2-instances)
or [in Azure](/azure/automation/automation-dsc-onboarding#azure-virtual-machines)
to pull configurations.

To try out PowerSTIG, visit the
[PowerShell Gallery](https://www.powershellgallery.com)
and download the solution or click "Project Site"
to view the
[documentation](https://github.com/microsoft/powerstig).

## Next steps

- [Windows PowerShell Desired State Configuration Overview](/powershell/scripting/dsc/overview/overview)
- [DSC Resources](/powershell/scripting/dsc/resources/resources)
- [Configuring The Local Configuration Manager](/powershell/scripting/dsc/managing-nodes/metaconfig)
