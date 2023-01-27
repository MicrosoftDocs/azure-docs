---
title: Configure data at scale for Azure Automation State Configuration
description: This article tells how to configure data at scale for Azure Automation State Configuration.
keywords: dsc,powershell,configuration,setup
services: automation
ms.subservice: dsc
ms.date: 10/21/2022
ms.custom: engagement-fy23
ms.topic: conceptual
---

# Configure data at scale for Azure Automation State Configuration

**Applies to:** :heavy_check_mark: Windows PowerShell 5.1

> [!NOTE]
> Before you enable Automation State Configuration, we would like you to know that a newer version of DSC is now generally available, managed by a feature of Azure Policy named [guest configuration](../governance/machine-configuration/overview.md). The guest configuration service combines features of DSC Extension, Azure Automation State Configuration, and the most commonly requested features from customer feedback. Guest configuration also includes hybrid machine support through [Arc-enabled servers](../azure-arc/servers/overview.md).

> [!IMPORTANT]
> This article refers to a solution that is maintained by the Open Source community. Support is only available in the form of GitHub collaboration, and not from Microsoft.

Managing many servers is a challenge and difficulty lies in managing [configuration data](/powershell/dsc/configurations/configdata) as it involves organizing information across logical constructs like location, type, and environment. 

## Community project: Datum

[Datum](https://github.com/gaelcolas/Datum) is a community maintained solution that has been created to resolve this challenge. Datum builds on great ideas from other configuration management platforms and implements the same type of solution for PowerShell DSC. Information is [organized in to text files](https://github.com/gaelcolas/Datum#3-intended-usage) based on logical ideas.

Listed below are few examples:

- Settings that should apply globally
- Settings that should apply to all servers in a location
- Settings that should apply to all database servers
- Individual server settings


## Configure data at scale

Follow the below steps to configure data at scale for Azure Automation State Configuration:

1. The information is organized in your preferred file format. For example, *JSON*, *Yaml*, or *PSD1*.
1. The cmdlets are provided to generate configuration data files by [consolidating the information](https://github.com/gaelcolas/Datum#datum-tree) from each file in to single view of a server or server role.
1. After you generate the data files, you can use them with [DSC Configuration scripts](/powershell/dsc/configurations/write-compile-apply-configuration) to generate *MOF* files and [upload the MOF files to Azure Automation](./tutorial-configure-servers-desired-state.md#create-and-upload-a-configuration-to-azure-automation).
1. Register your servers from either [on-premises](./automation-dsc-onboarding.md#enable-physicalvirtual-linux-machines)
or [in Azure](./automation-dsc-onboarding.md#enable-azure-vms) to pull configurations.

To download the solution, go to [PowerShell Gallery](https://www.powershellgallery.com/packages/datum/) or select **Project site** to view the [documentation](https://github.com/gaelcolas/Datum#2-getting-started--concepts).


## Next steps

- To understand PowerShell DSC, see [Windows PowerShell Desired State Configuration overview](/powershell/dsc/overview).
- Find out about PowerShell DSC resources in [DSC Resources](/powershell/dsc/resources/resources).
- For details of Local Configuration Manager configuration, see [Configuring the Local Configuration Manager](/powershell/dsc/managing-nodes/metaconfig).
