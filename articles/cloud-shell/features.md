---
title: Azure Cloud Shell (Preview) features | Microsoft Docs
description: Overview of features of Azure Cloud Shell
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
ms.date: 05/10/2017
ms.author: juluk
---

# Features & Tools for Azure Cloud Shell
Azure Cloud Shell is a browser-based shell experience to manage and develop Azure resources.

Cloud Shell offers a browser-accessible, pre-configured shell experience for managing Azure resources without the overhead of installing, versioning, and maintaining a machine yourself.

Cloud Shell provisions machines on a per-request basis and as a result machine state will not persist across sessions. 
Since Cloud Shell is built for interactive sessions, shells automatically terminate after 10 minutes of shell inactivity.

## Tools
|Category   |Name   |
|---|---|
|Linux shell interpreter|Bash<br> sh               |
|Azure tools            |Azure CLI 2.0 and 1.0<br> AzCopy     |
|Text editors           |vim<br> nano<br> emacs       |
|Source control         |git                    |
|Build tools            |make<br> maven<br> npm<br> pip         |
|Containers             |Docker<br> Kubectl<br> DC/OS CLI         |
|Databases              |MySQL client<br> PostgreSql client<br> sqlcmd Utility      |
|Other                  |iPython Client<br> |

## Language support
|Language   |Version   |
|---|---|
|.NET       |1.01       |
|Go         |1.7        |
|Node.js    |6.9.4      |
|Python     |2.7 and 3.5|

## Secure automatic authentication
Cloud Shell securely and automatically authenticates account access for the Azure CLI 2.0.

## Azure Files persistence
Since Cloud Shell is allocated on a per-request basis using a temporary machine, local files outside of $Home and machine state are not persisted across sessions.
To persist files across sessions, Cloud Shell walks you through attaching an Azure file share on first launch.
Once completed Cloud Shell will automatically attach your storage for all future sessions.

[Learn more about attaching Azure file shares to Cloud Shell.](persisting-shell-storage.md).

## Next steps
[Cloud Shell Quickstart](quickstart.md) 
[Learn about Azure CLI 2.0](https://docs.microsoft.com/cli/azure/)