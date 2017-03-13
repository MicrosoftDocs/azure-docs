---
title: Azure Cloud Console Features | Microsoft Docs
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
ms.date: 03/09/2017
ms.author: juluk
---

# Features (Preview)
Azure Cloud Console offers a full Bash shell to manage resources and develop applications on Azure directly from the Azure Portal.
Each Bash shell is housed in a container allocated to you on a per-request basis. As a result, you are not guaranteed the same container 
on each request.

## Browser-access to a Bash shell built for Azure
Azure provides a Bash workstation fully customized for Azure. This sandbox is provided to users as a way to manage, test, and deploy 
Azure resources without the overhead of installing, versioning, and maintaining a system.

The container includes:
### Pre-installed tools
* bash, sh 
* Azure CLI 1.0 and 2.0
* less, jq
* vim, nano
* npm, pip
* git

### Language support
* Node.js
* Python

## Automatic authentication
Cloud Console immediately authenticates the Azure CLI 2.0 by repurposing the credentials used to login to Azure Portal.
No additional authorization is needed offering single-click access, everytime.

## Bring your own storage persistence
Since the Cloud Console is allocated on a per-session basis on an ephemeral container, files will not persist across sessions by default.
You may mount your own fileshares in Azure Files to persist files across sessions.

This enables file persistence across sessions and having a central file share to utilize with others.
Once a fileshare is associated with your console, it will be mounted on each subsequent console on start up.

To learn more visit [Attaching file storage](../How-to/acc-persisting-storage.md).

## Next steps
[ACC Quickstart](../Get-started/acc-quickstart.md) <br>
[Azure CLI 2.0 documentation](https://docs.microsoft.com/en-us/cli/azure/) <br>
