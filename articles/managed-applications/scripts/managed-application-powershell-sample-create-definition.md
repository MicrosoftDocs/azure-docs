---
title: Azure PowerShell script sample - Create a managed application definition | Microsoft Docs
description: Azure PowerShell script sample - Create a managed application definition
services: managed-applications
documentationcenter: na
author: tfitzmac
manager: timlt

ms.service: managed-applications
ms.devlang: powershell
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/27/2017
ms.author: tomfitz
---

# Create a managed application definition with PowerShell

This script publishes a managed application definition to a service catalog.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!code-powershell[main](../../../powershell_scripts/managed-applications/create-definition/create-definition.ps1 "Create definition")]


## Script explanation

This script uses the following command to create the managed application definition. Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [New-AzManagedApplicationDefinition](https://docs.microsoft.com/powershell/module/az.resources/new-azmanagedapplicationdefinition) | Create a managed application definition. Provide the package that contains the required files. |


## Next steps

* For an introduction to managed applications, see [Azure Managed Application overview](../overview.md).
* For more information on PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/azure/get-started-azureps).
