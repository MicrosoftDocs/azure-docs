---
title: Azure Cloud Console (Preview) Features | Microsoft Docs
description: Overview of features of Azure Cloud Console
services: 
documentationcenter: ''
author: jluk
manager: timlt
tags: azure-resource-manager
 
ms.assetid: 
ms.service: 
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 04/10/2017
ms.author: juluk
---

# Features
Azure Cloud Console offers a browser interactable Bash shell to manage and develop with Azure directly from the Azure portal.
Each Bash shell is held in a container allocated to you on a per-request basis. As a result, you are not guaranteed the same container 
on each request.

## Browser-access to a Bash shell built for Azure
Azure provides a Bash workstation fully customized for Azure. This sandbox is provided to users as a way to manage, test, and deploy 
Azure resources without the overhead of installing, versioning, and maintaining a system.
* Cloud Console runs on a container provisioned on a per-request basis
* Console terminates after 10 minutes of output inactivity wiping machine state

### Tools
|Category   |Name   |
|---|---|
|Linux shell interpreter|Bash<br> sh               |
|Azure tools            |Azure CLI 2.0 and 1.0     |
|Text editors           |vim<br> nano<br> emacs       |
|Source control         |git                    |
|Build tools            |make<br> maven<br> npm<br> pip         |
|Containers             |Kubectl<br> DC/OS CLI         |
|Databases              |MySQL Client<br> PostgreSql Client<br> sqlcmd Utility      |
|Other                  |iPython Client |

### Language support
|Language   |Version   |
|---|---|
|Python     |2.7 and 3.5|
|Node.js    |6.9.4      |
|.NET       |1.01       |
|Go         |1.7        |

## Automatic authentication
Cloud Console immediately authenticates the Azure CLI 2.0 with the same credentials used to login to Azure portal.

## Bring your own storage persistence
Since the Cloud Console is allocated on a per-request basis on a temporary container, files do not persist across sessions by default.

To persist files across sessions, mount an Azure file share in West US.
Once a fileshare is associated with your console, it will be mounted on each subsequent console on start-up.

[Learn how to attach Azure file shares to Cloud Console.](acc-persisting-storage.md).

## Next steps
[ACC Quickstart](acc-quickstart.md) <br>
[Azure CLI 2.0 documentation](https://docs.microsoft.com/en-us/cli/azure/) <br>
