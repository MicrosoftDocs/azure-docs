---
title: Persist files for PowerShell in Azure Cloud Shell (Preview) | Microsoft Docs
description: Walkthrough of how PowerShell in Azure Cloud Shell persists files.
services: azure
documentationcenter: ''
author: maertendmsft
manager: timlt
tags: azure-resource-manager
 
ms.assetid: 
ms.service: azure
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 09/25/2017
ms.author: damaerte
---
[!include [features-introblock](../../includes/cloud-shell-persisting-shell-storage-introblock.md)]

## How to get to clouddrive
TODO: cd into $Home to see clouddrive
TODO: What folders are inside of clouddrive (.pscloudshell, .module, etc.) automatically, where do modules get saved?

## How Cloud Shell works
Cloud Shell persists files through the following method: 
* Mounting your specified file share as `clouddrive` in your `$Home` directory for direct file-share interaction.

## List `clouddrive`
The `Get-CloudDrive` command retrieves the file share information currently mounted by the Cloud Drive in the Cloud Shell. <br>
![Running Get-CloudDrive](media/persisting-shell-storage-powershell/Get-Clouddrive.png)

## Unmount `clouddrive`
You can unmount a file share that's mounted to Cloud Shell at any time. If the file share has been removed, you will be prompted to create and mount a new file share at the next session.

The `Dismount-CloudDrive` command unmounts a file share from the current storage account. Dismounting the Cloud Drive terminates the current session. The user will be prompted to create and mount another file share during the next session.
![Running Dismount-CloudDrive](media/persisting-shell-storage-powershell/Dismount-Clouddrive.png)

[!include [features-endblock](../../includes/cloud-shell-persisting-shell-storage-endblock.md)]

## Next steps
[Quickstart for PowerShell](quickstart-powershell.md) <br>
[Learn about Azure File storage](https://docs.microsoft.com/azure/storage/storage-introduction#file-storage) <br>
[Learn about storage tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags) <br>
