---
title: Connect to Azure Germany by using Azure CLI | Microsoft Docs
description: Information on managing your subscription in Azure Germany by using Azure CLI
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
ms.date: 12/12/2019
ms.author: ralfwi
---

# Connect to Azure Germany by using Azure CLI

> [!IMPORTANT]
> Since [August 2018](https://news.microsoft.com/europe/2018/08/31/microsoft-to-deliver-cloud-services-from-new-datacentres-in-germany-in-2019-to-meet-evolving-customer-needs/), we have not been accepting new customers or deploying any new features and services into the original Microsoft Cloud Germany locations.
>
> Based on the evolution in customers’ needs, we recently [launched](https://azure.microsoft.com/blog/microsoft-azure-available-from-new-cloud-regions-in-germany/) two new datacenter regions in Germany, offering customer data residency, full connectivity to Microsoft’s global cloud network, as well as market competitive pricing. 
>
> Take advantage of the breadth of functionality, enterprise-grade security, and comprehensive features available in our new German datacenter regions by [migrating](germany-migration-main.md) today.

To use the Azure command-line interface (Azure CLI), you need to connect to Azure Germany instead of global Azure. You can use Azure CLI to manage a large subscription through scripts or to access features that are not currently available in the Azure portal. If you have used Azure CLI in global Azure, it's mostly the same.  

## Azure CLI
There are multiple ways to [install the Azure CLI](https://docs.microsoft.com/cli/azure/install-az-cli2).  

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
There are multiple ways to [install Azure classic CLI](../xplat-cli-install.md). If you already have Node installed, the easiest way is to install the npm package.

To install CLI from an npm package, make sure you have downloaded and installed the [latest Node.js and npm](https://nodejs.org/en/download/package-manager/). Then, run **npm install** to install the azure-cli package:

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




