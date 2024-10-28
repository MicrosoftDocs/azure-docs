---
title: Create configurations from existing servers for Azure Automation State Configuration
description: This article tells how to create configurations from existing servers for Azure Automation State Configuration.
keywords: dsc,powershell,configuration,setup
services: automation
ms.subservice: desired-state-config
ms.date: 08/20/2024
ms.custom: engagement-fy23
ms.topic: how-to
ms.service: azure-automation
---

# Create configurations from existing servers

> **Applies to:** :heavy_check_mark: Windows PowerShell 5.1

[!INCLUDE [azure-automation-dsc-end-of-life](~/includes/dsc-automation/azure-automation-dsc-end-of-life.md)]

> [!IMPORTANT]
> The article refers to a solution that is maintained by the Open Source community. Support is only
> available in the form of GitHub collaboration, not from Microsoft.

This article explains how to create configuration from existing servers for an Azure Automation
state configuration. Creating configurations from an existing server is a challenging task. You need
to know the right settings and the order to apply them to ensure that the configuration is
successful.

## Community project: ReverseDSC

 The [ReverseDSC][07] is a community maintained solution created to work in this area beginning with
 the SharePoint. The solution builds on the [SharePointDSC resource][12] and extends it to
 orchestrate by [gathering information][11] from existing servers running SharePoint.

The latest version has multiple [extraction modes][09] to determine the level of information to
include. The result of using the solution is generating [Configuration Data][10] that must be used
with SharePointDSC configuration scripts.

## Create configuration from existing servers for an Azure Automation state configuration

Use the following steps to create a configuration from existing servers:

1. After you generate the data files, use the files with [DSC Configuration scripts][05] to generate
   **MOF** files.
1. Upload the [MOF files to Azure Automation][03].
1. To pull the configurations, register your servers from either [on-premises][02] or
   [in Azure][01].

For more information on ReverseDSC, visit the [PowerShell Gallery][13] and download the solution or
select **Project Site** to view the [documentation][08].

## Next steps

- To understand PowerShell DSC, see [Windows PowerShell Desired State Configuration overview][05].
- To find PowerShell DSC resources, see [DSC Resources][06].
- For details of Local Configuration Manager configuration, see
  [Configuring the Local Configuration Manager][04].

<!-- link references -->
[01]: ./automation-dsc-onboarding.md#enable-azure-vms
[02]: ./automation-dsc-onboarding.md#enable-physicalvirtual-linux-machines
[03]: ./tutorial-configure-servers-desired-state.md#create-and-upload-a-configuration-to-azure-automation
[04]: /powershell/dsc/managing-nodes/metaconfig
[05]: /powershell/dsc/overview
[06]: /powershell/dsc/resources/resources
[07]: https://github.com/microsoft/reversedsc
[08]: https://github.com/Microsoft/sharepointDSC.reverse
[09]: https://github.com/Microsoft/SharePointDSC.Reverse/wiki/Extraction-Modes
[10]: https://github.com/Microsoft/sharepointDSC.reverse#configuration-data
[11]: https://github.com/Microsoft/sharepointDSC.reverse#how-to-use
[12]: https://github.com/powershell/sharepointdsc
[13]: https://www.powershellgallery.com/packages/ReverseDSC/
