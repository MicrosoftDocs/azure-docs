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
ms.date: 03/19/2017
ms.author: zakramer

---


# Connect to Azure Government with Azure Command Line Interface (CLI)
To use Azure CLI, you need to connect to Azure Government instead of Azure public. The Azure CLI can be used to manage a large subscription through script or to access features that are not currently available in the Azure portal. If you have used Azure CLI in Azure Public, it is mostly the same.  

## Azure CLI 2.0
There are multiple ways to [install the Azure CLI v2](https://docs.microsoft.com/cli/azure/install-az-cli2).  

To connect to Azure Government, you set the cloud:

```
az cloud set --name AzureUSGovernment
```

After the cloud has been set, you can continue logging in:

```
az login
```

> [!NOTE]
> You can use the `az login --username your-user-name@your-gov-tenant.onmicrosoft.com` and optionally the `--password` parameter for simple Azure AD setups/scenarios. However, if you have configured Azure AD for federation you'll need to use `az login` and go through the device login flow.

To confirm the cloud has correctly been set to AzureUSGovernment, run this command:

```
az cloud list
```

or

```
az cloud list --output table
```

and verify that the `isActive` flag is set to `true` for the AzureUSGovernment item.

## Azure CLI 1.0
There are multiple ways to [install the Azure CLI v1](https://docs.microsoft.com/azure/xplat-cli-install). If you already have Node installed, the easiest way is to install the npm package:

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
azure login --environment AzureUSGovernment
```

> [!NOTE]
> You can use the `az login --username your-user-name@your-gov-tenant.onmicrosoft.com` and optionally the `--password` parameter for simple Azure AD setups/scenarios. However, if you have configured Azure AD for federation you'll need to use `az login` and go through the device login flow.

Once you are logged in, you can run Azure CLI commands as you normally would:

```
azure webapp list my-resource-group
```
