---
description: Learn to embed Azure Cloud Shell.
ms.contributor: jahelmic
ms.date: 11/14/2022
ms.topic: article
tags: azure-resource-manager
title: Embed Azure Cloud Shell
---
# Embed Azure Cloud Shell

Embedding Cloud Shell enables developers and content writers to directly open Cloud Shell from a
dedicated URL, `shell.azure.com`. This link brings the full power of Cloud Shell's authentication,
tooling, and up-to-date Azure CLI and Azure PowerShell tools to your users.

You can use the following images in your own webpages and app as buttons to start a Cloud Shell
session.

Regular sized button

![Regular launch](media/embed-cloud-shell/launch-cloud-shell-1.png "Launch Azure Cloud Shell")

Large sized button

![Large launch](media/embed-cloud-shell/launch-cloud-shell-2.png "Launch Azure Cloud Shell")

## How-to

To integrate Cloud Shell's launch button into markdown files by copying the following code:

Regular sized button

```markdown
[![Launch Cloud Shell](https://learn.microsoft.com/azure/cloud-shell/media/embed-cloud-shell/launch-cloud-shell-1.png)](https://shell.azure.com)
```

Large sized button

```markdown
[![Launch Cloud Shell](https://learn.microsoft.com/azure/cloud-shell/media/embed-cloud-shell/launch-cloud-shell-2.png)](https://shell.azure.com)
```

The location of these image files is subject to change. We recommend that you download the files for
use in your applications.

## Customize experience

Set a specific shell experience by augmenting your URL.

|        Experience        |                 URL                  |
| ------------------------ | ------------------------------------ |
| Most recently used shell | `https://shell.azure.com`            |
| Bash                     | `https://shell.azure.com/bash`       |
| PowerShell               | `https://shell.azure.com/powershell` |

## Next steps

- [Bash in Cloud Shell quickstart][07]
- [PowerShell in Cloud Shell quickstart][06]

<!-- updated link references -->
[01]: https://shell.azure.com
[06]: quickstart-powershell.md
[07]: quickstart.md
