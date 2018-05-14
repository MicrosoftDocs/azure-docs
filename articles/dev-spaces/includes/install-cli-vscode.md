---
title: "include file"
description: "include file"
ms.custom: "include file"
services: azure-dev-spaces
ms.service: "azure-dev-spaces"
ms.component: "azds-kubernetes"
author: "ghogen"
ms.author: "ghogen"
ms.date: "05/11/2018"
ms.topic: "include"
manager: "douge"
---
## Install the Azure Dev Spaces CLI

Azure Dev Spaces requires minimal local machine setup. Most of your development environment's configuration gets stored in the cloud, and is shareable with other users.

### Install on Mac
Download and install the Azure Dev Spaces CLI:
    ```cmd
    curl -L https://aka.ms/get-azds-mac | bash
    ```

### Install on Windows
Download and run the [Azure Dev Spaces CLI Installer](https://aka.ms/get-azds-windows). 

## Get Kubernetes debugging for VS Code
While you can use the Azure Dev Spaces CLI as a standalone tool, rich features like Kubernetes debugging are available for .NET Core and Node.js developers using VS Code.

1. If you don't have it, install [VS Code](https://code.visualstudio.com/Download).
1. Download the [VS Azure Dev Spaces extension](https://aka.ms/get-azds-code).
1. Install the extension: 

    ```cmd
    code --install-extension path-to-downloaded-extension/azds-0.1.1.vsix
    ```
