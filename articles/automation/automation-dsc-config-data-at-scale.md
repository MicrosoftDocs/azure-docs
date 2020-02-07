---
title: Configuration data at scale - Azure Automation
description: Learn how to configure data at scale for state configuration in Azure Automation.
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

# Configuration data at scale

> Applies To: Windows PowerShell 5.1

Managing hundreds or thousands of servers can be a challenge.
Customers have provided feedback that the most difficult aspect is actually managing
[configuration data](/powershell/scripting/dsc/configurations/configdata).
Organizing information across logical constructs like location, type, and environment.

> [!NOTE]
> This article refers to a solution that is maintained by the Open Source community.
> Support is only available in the form of GitHub collaboration, not from Microsoft.

## Community project: Datum

A community maintained solution named
[Datum](https://github.com/gaelcolas/Datum)
has been created to resolve this challenge.
Datum builds on great ideas from other configuration management platforms
and implements the same type of solution for PowerShell DSC.
Information is
[organized in to text files](https://github.com/gaelcolas/Datum#3-intended-usage)
based on logical ideas.
Examples would be:

- Settings that should apply globally
- Settings that should apply to all servers in a location
- Settings that should apply to all database servers
- Individual server settings

This information is organized in the file format you prefer (JSON, Yaml, or PSD1).
Then cmdlets are provided to generate configuration data files by
[consolidating the information](https://github.com/gaelcolas/Datum#datum-tree)
from each file in to single view of a server or server role.

Once the data files have been generated,
you can use them with
[DSC Configuration scripts](/powershell/scripting/dsc/configurations/write-compile-apply-configuration)
to generate MOF files
and
[upload the MOF files to Azure Automation](/azure/automation/tutorial-configure-servers-desired-state#create-and-upload-a-configuration-to-azure-automation).
Then register your servers from either
[on-premises](/azure/automation/automation-dsc-onboarding#physicalvirtual-windows-machines-on-premises-or-in-a-cloud-other-than-azure-including-aws-ec2-instances)
or [in Azure](/azure/automation/automation-dsc-onboarding#azure-virtual-machines)
to pull configurations.

To try out Datum, visit the
[PowerShell Gallery](https://www.powershellgallery.com/packages/datum/)
and download the solution or click "Project Site"
to view the
[documentation](https://github.com/gaelcolas/Datum#2-getting-started--concepts).

## Next steps

- [Windows PowerShell Desired State Configuration Overview](/powershell/scripting/dsc/overview/overview)
- [DSC Resources](/powershell/scripting/dsc/resources/resources)
- [Configuring The Local Configuration Manager](/powershell/scripting/dsc/managing-nodes/metaconfig)
