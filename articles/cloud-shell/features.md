---
title: Bash in Azure Cloud Shell (Preview) features | Microsoft Docs
description: Overview of features of Bash in Azure Cloud Shell
services: Azure
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
ms.date: 09/25/2017
ms.author: juluk
---

# Features and tools for Bash in Azure Cloud Shell

[!include [features-introblock](../../includes/cloud-shell-features-introblock.md)]

> [!TIP]
> [PowerShell in Azure Cloud Shell](features-powershell.md) is also available.

Bash in Cloud Shell runs on `Ubuntu 16.04 LTS`.

## Features

### Secure automatic authentication

Bash in Cloud Shell securely and automatically authenticates account access for the Azure CLI 2.0.

### SSH into Azure Linux virtual machines

Creating a Linux VM from Azure CLI 2.0 can create a default SSH key and place it in your `$Home` directory. Placing SSH keys in `$Home`  enables direct SSH connections to Azure Linux VMs directly from Cloud Shell. Keys are held in acc_<user>.img in your file share, use best practices when using or sharing access to your file share or keys.

### $Home persistence

To persist files across sessions, Cloud Shell walks you through attaching an Azure file share on first launch.
Once completed, Cloud Shell will automatically attach your storage (mounted as `$Home\clouddrive`) for all future sessions.
Additionally, in Bash in Cloud Shell your `$Home` directory is persisted as an .img in your Azure File share.
Files outside of `$Home` and machine state are not persisted across sessions.

[Learn more about persisting files in Bash in Cloud Shell.](persisting-shell-storage.md)

## Tools

|Category   |Name   |
|---|---|
|Linux shell interpreter|Bash<br> sh               |
|Azure tools            |[Azure CLI 2.0](https://github.com/Azure/azure-cli) and [1.0](https://github.com/Azure/azure-xplat-cli)<br> [AzCopy](https://docs.microsoft.com/azure/storage/storage-use-azcopy)<br> [Batch Shipyard](https://github.com/Azure/batch-shipyard)     |
|Text editors           |vim<br> nano<br> emacs       |
|Source control         |git                    |
|Build tools            |make<br> maven<br> npm<br> pip         |
|Containers             |[Docker CLI](https://github.com/docker/cli)/[Docker Machine](https://github.com/docker/machine)<br> [Kubectl](https://kubernetes.io/docs/user-guide/kubectl-overview/)<br> [Draft](https://github.com/Azure/draft)<br> [DC/OS CLI](https://github.com/dcos/dcos-cli)         |
|Databases              |MySQL client<br> PostgreSql client<br> [sqlcmd Utility](https://docs.microsoft.com/sql/tools/sqlcmd-utility)<br> [mssql-scripter](https://github.com/Microsoft/sql-xplat-cli) |
|Other                  |iPython Client<br> [Cloud Foundry CLI](https://github.com/cloudfoundry/cli)<br> [Terraform](https://www.terraform.io/docs/providers/azurerm/)<br> |

## Language support

|Language   |Version   |
|---|---|
|.NET       |1.01       |
|Go         |1.7        |
|Java       |1.8        |
|Node.js    |6.9.4      |
|Python     |2.7 and 3.5 (default)|

## Next steps

[Bash in Cloud Shell Quickstart](quickstart.md) <br>
[Learn about Azure CLI 2.0](https://docs.microsoft.com/cli/azure/)
