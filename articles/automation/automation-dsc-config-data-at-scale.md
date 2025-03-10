---
title: Configure data at scale for Azure Automation State Configuration
description: This article tells how to configure data at scale for Azure Automation State Configuration.
keywords: dsc,powershell,configuration,setup
services: automation
ms.subservice: desired-state-config
ms.date: 08/20/2024
ms.custom: engagement-fy23
ms.topic: how-to
ms.service: azure-automation
---

# Configure data at scale for Azure Automation State Configuration

**Applies to:** :heavy_check_mark: Windows PowerShell 5.1

[!INCLUDE [azure-automation-dsc-end-of-life](~/includes/dsc-automation/azure-automation-dsc-end-of-life.md)]

> [!IMPORTANT]
> This article refers to a solution that is maintained by the Open Source community. Support is only
> available in the form of GitHub collaboration, and not from Microsoft.

Managing many servers is a challenge and difficulty lies in managing [configuration data][04] as it
involves organizing information across logical constructs like location, type, and environment.

## Community project: Datum

[Datum][09] is a community maintained solution created to resolve this challenge. Datum builds on
great ideas from other configuration management platforms and implements the same type of solution
for PowerShell DSC. Information is [organized in to text files][11] based on the following logical
ideas.

- Settings that should apply globally
- Settings that should apply to all servers in a location
- Settings that should apply to all database servers
- Individual server settings


## Configure data at scale

Use the following steps to configure data at scale for Azure Automation State Configuration:

1. Organize the information in your preferred file format. For example, *JSON*, *Yaml*, or *PSD1*.
1. Use the cmdlets to generate configuration data files by [consolidating the information][12] from
   each file in to single view of a server or server role.
1. Use the generated files with [DSC Configuration scripts][05] to generate *MOF* files and
   [upload the MOF files to Azure Automation][03].
1. To pull configurations, register your servers from either [on-premises][02] or [in Azure][01].

To download the solution, go to [PowerShell Gallery][13] or select **Project site** to view the
[documentation][10].


## Next steps

- To understand PowerShell DSC, see [Windows PowerShell Desired State Configuration overview][07].
- To find PowerShell DSC resources, see [DSC Resources][08].
- For details of Local Configuration Manager configuration, see
  [Configuring the Local Configuration Manager][06].

<!-- link references -->
[01]: ./automation-dsc-onboarding.md#enable-azure-vms
[02]: ./automation-dsc-onboarding.md#enable-physicalvirtual-linux-machines
[03]: ./tutorial-configure-servers-desired-state.md#create-and-upload-a-configuration-to-azure-automation
[04]: /powershell/dsc/configurations/configdata
[05]: /powershell/dsc/configurations/write-compile-apply-configuration
[06]: /powershell/dsc/managing-nodes/metaconfig
[07]: /powershell/dsc/overview
[08]: /powershell/dsc/resources/resources
[09]: https://github.com/gaelcolas/Datum
[10]: https://github.com/gaelcolas/Datum#2-getting-started--concepts
[11]: https://github.com/gaelcolas/Datum#3-intended-usage
[12]: https://github.com/gaelcolas/Datum#datum-tree
[13]: https://www.powershellgallery.com/packages/datum/
