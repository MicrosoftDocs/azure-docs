---
title: Create configurations from existing servers for Azure Automation State Configuration
description: This article tells how to create configurations from existing servers for Azure Automation State Configuration.
keywords: dsc,powershell,configuration,setup
services: automation
ms.subservice: dsc
ms.date: 10/25/2022
ms.custom: engagement-fy23
ms.topic: conceptual
---

# Create configurations from existing servers

> **Applies to:** :heavy_check_mark: Windows PowerShell 5.1

> [!NOTE]
> Before you enable Automation State Configuration, we would like you to know that a newer version of DSC is now generally available, managed by a feature of Azure Policy named [guest configuration](../governance/machine-configuration/overview.md). The guest configuration service combines features of DSC Extension, Azure Automation State Configuration, and the most commonly requested features from customer feedback. Guest configuration also includes hybrid machine support through [Arc-enabled servers](../azure-arc/servers/overview.md).

> [!IMPORTANT]
>  The article refers to a solution that is maintained by the Open Source community. Support is only available in the form of GitHub collaboration, not from Microsoft.

This article explains how to create configuration from existing servers for an Azure Automation state configuration. To create configurations from an existing servers is a challenging task as you need to know the right settings and the order they must be applied to ensure that configuration is successful.  

## Community project: ReverseDSC 

 The [ReverseDSC](https://github.com/microsoft/reversedsc) is a community maintained solution created to work in this area beginning with the SharePoint. The solution builds on the [SharePointDSC resource](https://github.com/powershell/sharepointdsc) and extends it to orchestrate by [gathering information](https://github.com/Microsoft/sharepointDSC.reverse#how-to-use) from existing servers running SharePoint.

The latest version has multiple [extraction modes](https://github.com/Microsoft/SharePointDSC.Reverse/wiki/Extraction-Modes) to determine the level of information to include. The result of using the solution is generating
[Configuration Data](https://github.com/Microsoft/sharepointDSC.reverse#configuration-data) that must be used with SharePointDSC configuration scripts.


## Create configuration from existing servers for an Azure Automation state configuration

Follow the steps to create a configuration from existing servers for an Azure Automation state configuration:

1. After you generate the data files, you can use them with [DSC Configuration scripts](/powershell/dsc/overview) to generate *MOF* files.
1. upload the [MOF files to Azure Automation](./tutorial-configure-servers-desired-state.md#create-and-upload-a-configuration-to-azure-automation).
1. Register your servers from either [on-premises](./automation-dsc-onboarding.md#enable-physicalvirtual-linux-machines)
or [in Azure](./automation-dsc-onboarding.md#enable-azure-vms) to pull configurations.

For more information on ReverseDSC, visit the [PowerShell Gallery](https://www.powershellgallery.com/packages/ReverseDSC/) and download the solution or select **Project Site** to view the [documentation](https://github.com/Microsoft/sharepointDSC.reverse).

## Next steps

- To understand PowerShell DSC, see [Windows PowerShell Desired State Configuration overview](/powershell/dsc/overview).
- Find out about PowerShell DSC resources in [DSC Resources](/powershell/dsc/resources/resources).
- For details of Local Configuration Manager configuration, see [Configuring the Local Configuration Manager](/powershell/dsc/managing-nodes/metaconfig).
