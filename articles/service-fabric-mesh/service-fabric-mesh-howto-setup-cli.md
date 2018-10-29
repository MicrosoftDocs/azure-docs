---
title: Set up the Azure Service Fabric Mesh CLI | Microsoft Docs
description: Learn how to set up the Azure Service Fabric Mesh CLI.
services: service-fabric-mesh
keywords:  
author: tylermsft
ms.author: twhitney
ms.date: 07/26/2018
ms.topic: get-started-article
ms.service: service-fabric-mesh
manager: timlt  
#Customer intent: As a developer, I need to prepare install the prerequisites to enable deployment to service fabric mesh.
---

# Set up the Service Fabric Mesh CLI
The Service Fabric Mesh Command Line Interface (CLI) is required to deploy and manage resources in Service Fabric Mesh. 

For the preview, Azure Service Fabric Mesh CLI is written as an extension to Azure CLI. You can install it in the Azure Cloud Shell or a local installation of Azure CLI. 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)] 

## Install the Service Fabric Mesh CLI locally
If you choose to install and use the CLI locally, you must install the Azure CLI version 2.0.43 or later. Run `az --version` to find the version. To install or upgrade to the latest version of the CLI, see [Install the Azure CLI][azure-cli-install].

Install the Azure Service Fabric Mesh CLI extension module using following command. 

```azurecli-interactive
az extension add --name mesh
```

To update an existing Azure Service Fabric Mesh CLI module, run the following command.

```azurecli-interactive
az extension update --name mesh
```

You can also set up your [Windows development environment](service-fabric-mesh-howto-setup-developer-environment-sdk.md).

[azure-cli-install]: /cli/azure/install-azure-cli
