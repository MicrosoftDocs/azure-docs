---
title: Incorporer Azure Cloud Shell | Microsoft Docs
description: Apprendre à Incorporer Azure Cloud Shell.
services: cloud-shell
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
ms.date: 11/12/2017
ms.author: juluk
---
# Incorporer Azure Cloud Shell

Incorporer Cloud Shell permet aux développeurs et aux rédacteurs de contenus, d'ouvrir directement Cloud Shell depuis une URL dédiée, [shell.azure.com](https://shell.azure.com). Cela apporte immédiatement toute la puissance de l'authentification, de l'outillage et des outils à jour Azure PowerShell Azure CLI / Azure, pour vos utilisateurs.

[![](https://shell.azure.com/images/launchcloudshell.png "Lancer Azure Cloud Shell")](https://shell.azure.com)

## Comment faire ?

Incorporer le bouton de lancement Cloud Shell dans les fichiers markdown en copiant l'élément suivant :

```markdown
[![Launch Cloud Shell](https://shell.azure.com/images/launchcloudshell.png "Lancer Cloud Shell")](https://shell.azure.com)
```

Le code HTML pour incorporer une fenêtre Cloud Shell est le suivant :
```html
<a style="cursor:pointer" onclick='javascript:window.open("https://shell.azure.com", "_blank", "toolbar=no,scrollbars=yes,resizable=yes,menubar=no,location=no,status=no")'><image src="https://shell.azure.com/images/launchcloudshell.png" /></a>
```

## Personnalisez l'expérience

Définissez une expérience shell spécifique en personnalisant votre URL.
|Experience   |URL   |
|---|---|
|Shell le plus utilisé récemment   |shell.azure.com           |
|Bash                              |shell.azure.com/bash       |
|PowerShell                        |shell.azure.com/powershell |

## Etapes suivantes
[Bash dans Cloud Shell démarrage rapide](quickstart.md)<br>
[PowerShell dans Cloud Shell démarrage rapide](quickstart-powershell.md)
