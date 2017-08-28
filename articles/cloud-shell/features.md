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
ms.date: 08/28/2017
ms.author: juluk
---

# Features and Tools for Azure Cloud Shell
Azure Cloud Shell is a browser-based shell experience to manage and develop Azure resources.

Cloud Shell offers a browser-accessible, pre-configured shell experience for managing Azure resources without the overhead of installing, versioning, and maintaining a machine yourself.

Cloud Shell provisions machines on a per-request basis and as a result machine state will not persist across sessions. 
Since Cloud Shell is built for interactive sessions, shells automatically terminate after 20 minutes of shell inactivity.

[TODO] Additionally, the PowerShell experience will provide:

- **Azure namespace** capability to let you easily discover and navigate all Azure resources.

- **Interaction with VMs** to enable seamless management into the guest VMs.

- **Extensible model** to import additional cmdlets and ability to run any executable.

### Tools
|**Category**   |**Bash**   | **PowerShell** |
|---|---|---|
|Shell interpreter|Bash<br> sh               | |
|Azure tools            |[Azure CLI 2.0](https://github.com/Azure/azure-cli) and [1.0](https://github.com/Azure/azure-xplat-cli)<br> [AzCopy](https://docs.microsoft.com/azure/storage/storage-use-azcopy)<br> [Batch Shipyard](https://github.com/Azure/batch-shipyard)     | AzureRM (3.8) modules<br> Azure CLI 2.0  |
|Text editors           |vim<br> nano<br> emacs       | vim                                      |
|Package Manager | | PowerShellGet<br> PackageManagement      |
|Source control         |git                    | git |
|Build tools            |make<br> maven<br> npm<br> pip         |
|Containers             |[Docker CLI](https://github.com/docker/cli)/[Docker Machine](https://github.com/docker/machine)<br> [Kubectl](https://kubernetes.io/docs/user-guide/kubectl-overview/)<br> [Draft](https://github.com/Azure/draft)<br> [DC/OS CLI](https://github.com/dcos/dcos-cli)         |
|Databases              |MySQL client<br> PostgreSql client<br> [sqlcmd Utility](https://docs.microsoft.com/sql/tools/sqlcmd-utility)<br> [mssql-scripter](https://github.com/Microsoft/sql-xplat-cli)      |
|Test tools      | | Pester                                   |
|Other                  |iPython Client<br> [Cloud Foundry CLI](https://github.com/cloudfoundry/cli)<br> |

### Language support
|**Language**   |**Bash**   | **PowerShell** |
|---|---|---|
|.NET       |1.01       | 4.6        |
|Go         |1.7        | |
|Java       |1.8        | |
|Node.js    |6.9.4      | 6.10       |
|PowerShell |           |5.1        |
|Python     |2.7 and 3.5 (default)| 2.7        |

## Secure automatic authentication
Cloud Shell securely and automatically authenticates account access for the Azure CLI 2.0.

## Azure Files persistence
Since Cloud Shell is allocated on a per-request basis using a temporary machine, files outside of your $Home and machine state are not persisted across sessions.
To persist files across sessions, Cloud Shell walks you through attaching an Azure file share on first launch.
Once completed Cloud Shell will automatically attach your storage for all future sessions.

[Learn more about attaching Azure file shares to Cloud Shell.](persisting-shell-storage.md)

## Next steps
[Cloud Shell Quickstart](quickstart.md) <br>
[Learn about Azure CLI 2.0](https://docs.microsoft.com/cli/azure/) <br>