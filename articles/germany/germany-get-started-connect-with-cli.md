---
title: Connect to Azure Germany with Azure CLI | Microsoft Docs
description: Information on managing your subscription in Azure Germany by connecting with the Azure CLI
services: germany
cloud: na
documentationcenter: na
author: gitralf
manager: rainerst

ms.assetid: na
ms.service: germany
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/13/2017
ms.author: ralfwi
---


# Connect to Azure Germany with Azure Command Line Interface (CLI)
To use Azure CLI, you need to connect to Azure Germany instead of global Azure. The Azure CLI can be used to manage a large subscription through script or to access features that are not currently available in the Azure portal. If you have used Azure CLI in global Azure, it is mostly the same.  

## Azure CLI 2.0
There are multiple ways to [install the Azure CLI v2](https://docs.microsoft.com/cli/azure/install-az-cli2).  

To connect to Azure Germany, you set the cloud:

```
az cloud set --name AzureGermanCloud
```

After the cloud has been set, you can continue logging in:

```
az login --username your-user-name@your-tenant.onmicrosoft.de
```

To confirm the cloud has correctly been set to AzureGermanCloud, run this command:

```
az cloud list
```

or

```
az cloud list --output table
```

and verify that the `isActive` flag is set to `true` for the AzureGermanCloud item.

## Azure CLI 1.0
There are multiple ways to [install the Azure CLI v1](../xplat-cli-install.md). If you already have Node installed, the easiest way is to install the npm package:

To install the CLI from an npm package, make sure you have downloaded and installed the [latest Node.js and npm](https://nodejs.org/en/download/package-manager/). Then, run **npm install** to install the azure-cli package:

```bash
npm install -g azure-cli
```

On Linux distributions, you might need to use **sudo** to successfully run the **npm** command, as follows:

```bash
sudo npm install -g azure-cli
```

> [!NOTE]
> If you need to install or update Node.js and npm on your Linux distribution or OS, we recommend that you install the most recent Node.js LTS version (4.x). If you use an older version, you might get installation errors.


Once you have the Azure CLI installed, you need to log in to Azure Germany:

```
azure login --username your-user-name@your-tenant.onmicrosoft.de  --environment AzureGermanCloud
```

Once you are logged in, you can run Azure CLI commands as you normally would:

```
azure webapp list my-resource-group
```

### Next steps
For more information about connecting to Azure Germany, see the following resources:

* [Connect to Azure Germany with PowerShell](./germany-get-started-connect-with-ps.md)
* [Connect to Azure Germany with Visual Studio](./germany-get-started-connect-with-vs.md)
* [Connect to Azure Germany with Portal](./germany-get-started-connect-with-portal.md)




