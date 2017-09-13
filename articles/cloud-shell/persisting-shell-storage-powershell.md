---
title: Persist files in Azure Cloud Shell (Preview) | Microsoft Docs
description: Walkthrough of how Azure Cloud Shell persists files.
services: 
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
ms.date: 07/17/2017
ms.author: damaerte
---
[!include [features-introblock](persisting-shell-storage-introblock.md)]

## How Cloud Shell works
Cloud Shell persists files through the following method: 
* Mounting your specified file share as `clouddrive` in your `$Home` directory for direct file-share interaction. `/Home/<User>/clouddrive` is mapped to `$home\clouddrive`.
 
## Supported storage regions
The Azure files must reside in the same region as the Cloud Shell machine that you're mounting them to. Cloud Shell machines exist in the following regions:
|Area|Region|
|---|---|
|Americas|East US, South Central US, West US|
|Europe|North Europe, West Europe|
|Asia Pacific|India Central, Southeast Asia|

## `Get-Clouddrive`
The `Get-Clouddrive` command retrieves the file share information currently mounted by the cloud drive in the Cloud Shell. <br>
![Running Get-Clouddrive](media/persisting-shell-storage-powershell/Get-Clouddrive.png)

## Unmount `clouddrive`
You can unmount a file share that's mounted to Cloud Shell at any time. If the file share has been removed, you will be prompted to create and mount a new file share at the next session.

### `Dismount-Clouddrive`
The `Dismount-Clouddrive` command unmounts a file share from the current storage account. Dismounting the cloud drive will terminate the current session. The user will be prompted to create and mount a new file share during the next session.
![Running Dismount-Clouddrive](media/persisting-shell-storage-powershell/Dismount-Clouddrive.png)

[!include [features-endblock](persisting-shell-storage-endblock.md)]

## Next steps
[Quickstart for PowerShell](quickstart-powershell.md) <br>
[Learn about Azure File storage](https://docs.microsoft.com/azure/storage/storage-introduction#file-storage) <br>
[Learn about storage tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags) <br>
