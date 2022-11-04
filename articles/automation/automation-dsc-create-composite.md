---
title: Convert configurations to composite resources for Azure Automation State Configuration
description: This article tells how to convert configurations to composite resources for Azure Automation State Configuration.
keywords: dsc,powershell,configuration,setup
services: automation
ms.subservice: dsc
ms.date: 10/21/2022
ms.custom: engagement-fy23
ms.topic: conceptual
---

# Convert configurations to composite resources

> **Applies to:** :heavy_check_mark: Windows PowerShell 5.1

> [!NOTE]
> Before you enable Automation State Configuration, we would like you to know that a newer version of DSC is now generally available, managed by a feature of Azure Policy named [guest configuration](../governance/machine-configuration/overview.md). The guest configuration service combines features of DSC Extension, Azure Automation State Configuration, and the most commonly requested features from customer feedback. Guest configuration also includes hybrid machine support through [Arc-enabled servers](../azure-arc/servers/overview.md).

> [!IMPORTANT]
> This article refers to a solution that is maintained by the Open Source community and support is only available in the form of GitHub collaboration, not from Microsoft.

This article, explains on creating **scenarios** that manage groups of settings, after you get started with authoring configurations. Listed below are few examples:

- Create a web server
- Create a DNS server
- Create a server that runs SharePoint
- Configure a SQL cluster
- Manage firewall settings
- Manage password settings

We recommend that you package the configuration as a [Composite Resource](/powershell/dsc/resources/authoringresourcecomposite) before you share it with others as creating composite resources for the first time can be a tedious effort. 
 
## Community project - CompositeResource

A [CompositeResource](https://github.com/microsoft/compositeresource) is a community maintained solution that 
has been created to resolve this challenge. Composite Resource automates the process of creating a new module from your configuration.


## Create a composite resource module 

Follow the steps to create a composite resource module:

1. Begin by [dot sourcing](https://devblogs.microsoft.com/scripting/how-to-reuse-windows-powershell-functions-in-scripts/) the configuration script on your workstation (or build server) to ensure that it is loaded in memory.
1. Use the function provided by the *CompositeResource* module to automate a conversion instead of running the configuration to generate a *MOF* file.
   Here, the cmdlet will load the contents of your configuration, gets the list of parameters, and generates a new module.
1. After you generate a module, you can increment the version and add release notes each time you make changes and publish it to your own
[PowerShellGet repository](https://powershellexplained.com/2018-03-03-Powershell-Using-a-NuGet-server-for-a-PSRepository/?utm_source=blog&utm_medium=blog&utm_content=psscriptrepo).
1. Use the module in the [Composable Authoring Experience](./compose-configurationwithcompositeresources.md) in Azure, or add them to [DSC Configuration scripts](/powershell/dsc/configurations/configurations) to generate MOF files and [upload the MOF files to Azure Automation](./tutorial-configure-servers-desired-state.md#create-and-upload-a-configuration-to-azure-automation).
1. Register your servers from either [on-premises](./automation-dsc-onboarding.md#enable-physicalvirtual-linux-machines) or [in Azure](./automation-dsc-onboarding.md#enable-azure-vms)to pull configurations.

> [!NOTE]
> The latest update to the project has also published [runbooks](https://www.powershellgallery.com/packages?q=DscGallerySamples) for Azure Automation to automate the process of importing configurations from the PowerShell Gallery.

For more information on how to automate the creation of composite resources for DSC, see [PowerShell Gallery](https://www.powershellgallery.com/packages/compositeresource/) and download the solution or select **Project Site** to view the [documentation](https://github.com/microsoft/compositeresource).

## Next steps

- To understand PowerShell DSC, see [Windows PowerShell Desired State Configuration overview](/powershell/dsc/overview).
- Find out about PowerShell DSC resources in [DSC Resources](/powershell/dsc/resources/resources).
- For details of Local Configuration Manager configuration, see [Configuring the Local Configuration Manager](/powershell/dsc/managing-nodes/metaconfig).
