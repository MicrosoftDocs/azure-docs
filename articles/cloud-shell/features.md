---
title: Azure Cloud Shell (Preview) Features | Microsoft Docs
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

# Features
Azure Cloud Shell is a browser-based shell experience to manage and develop Azure resources.

## Browser-accessible shell experience for Azure
Cloud Shell offers a pre-configured shell experience for managing Azure resources without the overhead of installing, versioning, and maintaining a machine yourself.
Cloud Shell provisions machines on a per-request basis and as a result machine state will not persist across sessions. 
Since Cloud Shell is built for interactive sessions, shells automatically terminate after 10 minutes of shell inactivity.

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
|Java       |JRE/JDK 1.8|

## Secure automatic authentication
Cloud Shell securely and automatically authenticates account access for the Azure CLI 2.0.

## Azure Files persistence
Since Cloud Shell is allocated on a per-request basis using a temporary machine, local files and machine state are not persisted.
To persist files across sessions, Cloud Shell walks you through attaching an Azure file share on first launch.
Once completed Cloud Shell will automatically attach your storage for all future sessions.

[Learn more about attaching Azure file shares to Cloud Shell.](persisting-shell-storage.md).

## Next steps
[Get Started with Quickstart](quickstart.md) <br>
[Learn more about Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/) <br>