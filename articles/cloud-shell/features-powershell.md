---
title: Azure Cloud Shell (Preview) features | Microsoft Docs
description: Overview of features of Azure Cloud Shell
services: 
documentationcenter: ''
author: jluk
manager: timlt
tags: azure-resource-manager
 
ms.assetid: 
ms.service: azure
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 09/05/2017
ms.author: juluk
---

# Features and Tools for PowerShell in Azure Cloud Shell

[!include [features-introblock](<features-introblock.md)]

> [!TIP]
> [Bash in Azure Cloud Shell](features.md) is also available.

## PowerShell in Cloud Shell

The PowerShell experience in Azure Cloud Shell will provide the same benefits as the [Bash shell experience](features.md). Additionally, the PowerShell experience will provide:

- **Azure namespace** capability to let you easily discover and navigate all Azure resources.

> [!NOTE]
> [TODO: replace old gif]

- **Interaction with VMs** to enable seamless management into the guest VMs.

> [!NOTE]
> [TODO: replace old gif]

- **Extensible model** to import additional cmdlets and ability to run any executable.

> [!NOTE]
> [TODO: replace old gif]

## Tools

|**Category**    |**Name**                                 |
|----------------|-----------------------------------------|
|Azure tools     |[Azure PowerShell (4.3.1)](https://docs.microsoft.com/powershell/azure/overview?view=azurermps-4.3.1)<br> [Azure CLI 2.0](https://github.com/Azure/azure-cli) and [1.0](https://github.com/Azure/azure-xplat-cli) |
|Text editors    |vim<br> nano<br> emacs                   |
|Package Manager |PowerShellGet<br> PackageManagement      |
|Source control  |git                                      |
|Test tools      |Pester                                   |

## Language Support

|**Language**|**Version**|
|------------|-----------|
|.NET        |4.6        |
|Node.js     |6.10       |
|Python      |2.7        |
|PowerShell  |5.1        |

## Secure automatic authentication
Cloud Shell securely and automatically authenticates account access for the Azure CLI 2.0.

## Azure Files persistence
Since Cloud Shell is allocated on a per-request basis using a temporary machine, files outside of your $Home and machine state are not persisted across sessions.
To persist files across sessions, Cloud Shell walks you through attaching an Azure file share on first launch.
Once completed Cloud Shell will automatically attach your storage for all future sessions.

[Learn more about attaching Azure file shares to Cloud Shell.](persisting-shell-storage.md)

## Next steps
[Quickstart with PowerShell in Cloud Shell](quickstart-powershell.md) <br>
[Learn about Azure PowerShell](https://docs.microsoft.com/powershell/azure/)
