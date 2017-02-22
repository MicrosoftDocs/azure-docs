---
title: Connect to Azure Government with Azure CLI | Microsoft Docs
description: Information on managing your subscription in Azure Government by connecting with the Azure CLI
services: azure-government
cloud: gov
documentationcenter: ''
author: zakramer
manager: liki

ms.assetid: c7cbe993-375e-4aed-9aa5-2f4b2111f71c
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 02/13/2017
ms.author: zakramer

---


# Connect to Azure Government with Azure CLI

To use Azure CLI, you need to connect to Azure Government instead of Azure public. The Azure CLI can be used to manage a large subscription through script or to access features that are not currently available in the Azure portal. If you have used Azure CLI in Azure Public, it is mostly the same.  The differences in Azure Government are:

There are multiple ways to [install the Azure CLI](https://docs.microsoft.com/en-us/azure/xplat-cli-install). If you already have Node installed, the easiest way is to install the npm package:

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


Once you have the Azure CLI installed, you need to log in to Azure Government:

```
azure login --username your-user-name@your-gov-tenant.onmicrosoft.com  --environment AzureUSGovernment
```

Once you are logged in, you can run Azure CLI commands as you normally would:

```
azure webapp list my-resource-group
```