---

title: Create an Azure notification hub using PowerShell | Microsoft Docs
description: Learn how to use a PowerShell script to create an Azure notification hub. 
author: dimazaid
manager: femila
services: notification-hubs
editor: sethmanheim

ms.service: notification-hubs
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/14/2020
ms.author: dimazaid

---

# Use PowerShell to create an Azure notification hub

This sample PowerShell script creates a sample Azure notification hub. 

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

## Prerequisites

* **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Sample script

[!code-powershell[main](../../../powershell_scripts/notification-hubs/create-notification-hub/create-notification-hub.ps1 "Create a notification hub")]

## Clean up deployment

After you run the sample script, you can use the following command to remove the resource group and all resources associated with it:

```powershell
Remove-AzResourceGroup -ResourceGroupName $resourceGroupName
```

## Script explanation

This script uses the following commands:

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzNotificationHubsNamespace](/powershell/module/az.notificationhubs/new-aznotificationhubsnamespace) | Creates a namespace for the notification hub. |
| [New-AzNotificationHub](/powershell/module/az.notificationhubs/new-aznotificationhub) | Creates a notification hub. |
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).
