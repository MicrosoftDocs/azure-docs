---
title: Connect to Azure Germany by using Azure CLI | Microsoft Docs
description: Information on managing your subscription in Azure Germany by using Azure CLI
ms.topic: article
ms.date: 10/16/2020
author: gitralf
ms.author: ralfwi 
ms.service: germany
ms.custom: bfdocs, devx-track-azurecli
---

# Connect to Azure Germany by using Azure CLI

[!INCLUDE [closureinfo](../../includes/germany-closure-info.md)]

To use the Azure command-line interface (Azure CLI), you need to connect to Azure Germany instead of global Azure. You can use Azure CLI to manage a large subscription through scripts or to access features that are not currently available in the Azure portal. If you have used Azure CLI in global Azure, it's mostly the same.  

## Azure CLI
There are multiple ways to [install the Azure CLI](/cli/azure/install-az-cli2).  

To connect to Azure Germany, set the cloud:

```azurecli
az cloud set --name AzureGermanCloud
```

After the cloud is set, you can log in:

```azurecli
az login --username your-user-name@your-tenant.onmicrosoft.de
```

To confirm that the cloud is correctly set to AzureGermanCloud, run either of the following commands and then verify that the `isActive` flag is set to `true` for the AzureGermanCloud item:

```azurecli
az cloud list
```

```azurecli
az cloud list --output table
```

## Azure classic CLI
There are multiple ways to [install Azure classic CLI](/cli/azure/install-azure-cli). If you already have Node installed, the easiest way is to install the npm package.

To install CLI from an npm package, make sure you have downloaded and installed the [latest Node.js and npm](https://nodejs.org/en/download/package-manager/). Then, run **npm install** to install the **azure-cli** package:

```bash
npm install -g azure-cli
```

On Linux distributions, you might need to use **sudo** to successfully run the **npm** command, as follows:

```bash
sudo npm install -g azure-cli
```

> [!NOTE]
> If you need to install or update Node.js and npm on your Linux distribution or OS, we recommend that you install the most recent Node.js LTS version (4.x). If you use an older version, you might get installation errors.


After Azure CLI is installed, log in to Azure Germany:

```console
azure login --username your-user-name@your-tenant.onmicrosoft.de  --environment AzureGermanCloud
```

After you're logged in, you can run Azure CLI commands as you normally would:

```console
azure webapp list my-resource-group
```

## Next steps
For more information about connecting to Azure Germany, see the following resources:

* [Connect to Azure Germany by using PowerShell](./germany-get-started-connect-with-ps.md)
* [Connect to Azure Germany by using Visual Studio](./germany-get-started-connect-with-vs.md)
* [Connect to Azure Germany by using the Azure portal](./germany-get-started-connect-with-portal.md)