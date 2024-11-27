---
title: Convert configurations to composite resources for Azure Automation State Configuration
description: This article tells how to convert configurations to composite resources for Azure Automation State Configuration.
keywords: dsc,powershell,configuration,setup
services: automation
ms.subservice: desired-state-config
ms.date: 08/20/2024
ms.custom: engagement-fy23
ms.topic: how-to
ms.service: azure-automation
---

# Convert configurations to composite resources

> **Applies to:** :heavy_check_mark: Windows PowerShell 5.1

[!INCLUDE [azure-automation-dsc-end-of-life](~/includes/dsc-automation/azure-automation-dsc-end-of-life.md)]

> [!IMPORTANT]
> This article refers to a solution that is maintained by the Open Source community and support is
> only available in the form of GitHub collaboration, not from Microsoft.

This article explains how to create configurations to manage the following scenarios:

- Create a web server
- Create a DNS server
- Create a server that runs SharePoint
- Configure a SQL cluster
- Manage firewall settings
- Manage password settings

We recommend that you package the configuration as a [Composite Resource][08] before you share it
with others as creating composite resources for the first time can be a tedious effort.

## Community project - CompositeResource

A [CompositeResource][11] is a community maintained solution that automates the process of creating
a new module from your configuration.

## Create a composite resource module

Follow the steps to create a composite resource module:

1. Ensure the configuration script is loaded in your PowerShell session by [dot sourcing][10] the
   script.
1. Rather than running the configuration to generate a **MOF** file, use the command provided by the
   **CompositeResource** module to automate a conversion. The command loads the contents of your
   configuration, gets the list of parameters, and generates a new module. After you generate a
   module, you can increment the version and add release notes each time you make changes and
   publish it to your own [PowerShellGet repository][12].
1. Use the module in the [Composable Authoring Experience][03] in Azure, or add them to
   [DSC Configuration scripts][05] to generate MOF files and
   [upload the MOF files to Azure Automation][04].
1. Register your servers from either [on-premises][02] or [in Azure][01]to pull configurations.

> [!NOTE]
> The latest update to the project has also published [runbooks][13] for Azure Automation to
> automate the process of importing configurations from the PowerShell Gallery.

For more information on how to automate the creation of composite resources for DSC, see
[PowerShell Gallery][14] and download the solution or select **Project Site** to view the
[documentation][11].

## Next steps

- To understand PowerShell DSC, see [Windows PowerShell Desired State Configuration overview][07].
- For more information about PowerShell DSC resources, see [DSC Resources][09].
- For information about Local Configuration Manager configuration, see
  [Configuring the Local Configuration Manager][06].

<!-- link references -->
[01]: ./automation-dsc-onboarding.md#enable-azure-vms
[02]: ./automation-dsc-onboarding.md#enable-physicalvirtual-linux-machines
[03]: ./compose-configurationwithcompositeresources.md
[04]: ./tutorial-configure-servers-desired-state.md#create-and-upload-a-configuration-to-azure-automation
[05]: /powershell/dsc/configurations/configurations
[06]: /powershell/dsc/managing-nodes/metaconfig
[07]: /powershell/dsc/overview
[08]: /powershell/dsc/resources/authoringresourcecomposite
[09]: /powershell/dsc/resources/resources
[10]: https://devblogs.microsoft.com/scripting/how-to-reuse-windows-powershell-functions-in-scripts/
[11]: https://github.com/microsoft/compositeresource
[12]: https://powershellexplained.com/2018-03-03-Powershell-Using-a-NuGet-server-for-a-PSRepository/?utm_source=blog&utm_medium=blog&utm_content=psscriptrepo
[13]: https://www.powershellgallery.com/packages?q=DscGallerySamples
[14]: https://www.powershellgallery.com/packages/compositeresource/
