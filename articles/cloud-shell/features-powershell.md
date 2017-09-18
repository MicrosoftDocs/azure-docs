---
title: PowerShell in Azure Cloud Shell (Preview) features | Microsoft Docs
description: Overview of features of PowerShell in Azure Cloud Shell
services: 
documentationcenter: ''
author: maertendMSFT
manager: timlt
tags: azure-resource-manager
 
ms.assetid: 
ms.service: azure
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 09/12/2017
ms.author: damaerte
---

# Features and tools for PowerShell in Azure Cloud Shell

[!include [features-introblock](<features-introblock.md)]

> [!TIP]
> [Bash in Azure Cloud Shell](features.md) is also available.

PowerShell in Cloud Shell runs on `Windows Server 2016`.

## Features

### Secure automatic authentication

PowerShell in Cloud Shell securely and automatically authenticates account access for the Azure PowerShell.

### Azure Files persistence

To persist files across sessions, Cloud Shell walks you through attaching an Azure file share on first launch.
Once completed, Cloud Shell will automatically attach your storage (mount as `$home\clouddrive`) for all future sessions.
Since Cloud Shell is allocated on a per-request basis using a temporary machine, files outside of your `$home\clouddrive` and machine state are not persisted across sessions.

[Learn more about attaching Azure file shares to Cloud Shell.](persisting-shell-storage.md)

### Azure namespace

Capability to let you easily discover and navigate all Azure resources.

> [!NOTE]
> [TODO: replace old gif]
> [TODO: note limitations of file writing etc. in Azure drive]

### Interaction with VMs

To enable seamless management into the guest VMs.

> [!NOTE]
> [TODO: replace old gif]

### Extensible model

To import additional cmdlets and ability to run any executable.

> [!NOTE]
> [TODO: replace old gif]

## Tools

|**Category**    |**Name**                                 |
|----------------|-----------------------------------------|
|Azure tools     |[Azure PowerShell (4.3.1)](https://docs.microsoft.com/powershell/azure/overview?view=azurermps-4.3.1) |
|Text editors    |vim<br> nano                   |
|Package Manager |PowerShellGet<br> PackageManagement      |
|Source control  |git                                      |
|Test tools      |Pester                                   |

## Language support

|**Language**|**Version**|
|------------|-----------|
|.NET        |4.6        |
|Node.js     |6.10       |
|Python      |2.7        |
|PowerShell  |5.1        |

## Next steps

[Quickstart with PowerShell in Cloud Shell](quickstart-powershell.md) <br>
[Learn about Azure PowerShell](https://docs.microsoft.com/powershell/azure/)
