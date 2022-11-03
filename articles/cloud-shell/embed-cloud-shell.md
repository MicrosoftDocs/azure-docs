---
author: sdwheeler
description: Learn to embed Azure Cloud Shell.
manager: mkluck
ms.author: sewhee
ms.contributor: jahelmic
ms.date: 11/04/2022
ms.service: cloud-shell
ms.tgt_pltfrm: vm-linux
ms.topic: article
ms.workload: infrastructure-services
services: cloud-shell
tags: azure-resource-manager
title: Embed Azure Cloud Shell
---
# Embed Azure Cloud Shell

Embedding Cloud Shell enables developers and content writers to directly open Cloud Shell from a
dedicated URL, `shell.azure.com`. This immediately brings the full power of Cloud Shell's
authentication, tooling, and up-to-date Azure CLI and Azure PowerShell tools to your users.

[![Regular launch](media/embed-cloud-shell/LaunchCloudShell.png "Launch Azure Cloud Shell")][01]

Large sized button

[![Large launch](media/embed-cloud-shell/LaunchCloudShell2x.png "Launch Azure Cloud Shell")][01]

## How-to

Integrate Cloud Shell's launch button into markdown files by copying the following:

Regular sized button

```markdown
[![Launch Cloud Shell](https://learn.microsoft.com/azure/cloud-shell/media/embed-cloudshell/launchcloudshell.png](https://shell.azure.com)
```

Large sized button

```markdown
[![Launch Cloud Shell](https://learn.microsoft.com/azure/cloud-shell/media/embed-cloudshelllaunchcloudshell@2x.png](https://shell.azure.com)
```

The location of these image files is subject to change. We recommend that you download the files for
use in your applications.

## Customize experience

Set a specific shell experience by augmenting your URL.

|        Experience        |             URL              |
| ------------------------ | ---------------------------- |
| Most recently used shell | `shell.azure.com`            |
| Bash                     | `shell.azure.com/bash`       |
| PowerShell               | `shell.azure.com/powershell` |

## Next steps

- [Bash in Cloud Shell quickstart][07]
- [PowerShell in Cloud Shell quickstart][06]

<!-- updated link references -->
[01]: https://shell.azure.com
[06]: quickstart-powershell.md
[07]: quickstart.md
