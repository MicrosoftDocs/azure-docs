---
title: Azure CycleCloud Tutorial - Cluster Templates and Persistent Storage | Microsoft Docs
description: In this tutorial, you will modify a cluster template to add storage to the cluster's NFS server.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: tutorial
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Azure CycleCloud Tutorial: Modify a Cluster Template to Add Persistent Storage

This tutorial shows how to modify a standard HPC cluster to add persistent storage to the file system. At the end of this exercise, you will have:

* Installed and configured the Azure CycleCloud CLI
* Created a new CycleCloud [project](~/projects.md)
* Modified a cluster template to add storage to the cluster's NFS Server
* Added a new cluster type in CycleCloud

Azure CycleCloud's cluster types are great for standard use cases, but users often find themselves needing to customize the clusters for more advanced or differently configured deployments. In default Azure CycleCloud clusters, the master nodes are also NFS servers that provide a shared filesystem for other nodes in the cluster. Adding managed disks to a VM in a compute cluster is a very easy and commonly used customization in Azure CycleCloud.

## Prerequisites

For this tutorial, you will need:

1. An active Azure subscription.
  * If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
2. A Shell session in a terminal.
  * If you are using a Windows machine, use the [browser-based Bash shell](https://shell.azure.com).
  * For non-Windows machines, install and use Azure CLI v2.0.20 or later. Run `az --version` to find your current version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

### Open a Terminal Window


[!INCLUDE [cloud-shell-try-it.md](/azure-docs/master/includes/cloud-shell-try-it.md)]


Open a [Shell session](https://shell.azure.com) in a new browser window. You can also use the green "Try It" button below to open Cloud Shell in your current browser window:

```azurecli-interactive
Click the "Try It" button to open Cloud Shell
```

## Install Azure CycleCloud CLI

Download the CycleCloud CLI installer with this command in your cloud shell:

```azurecli-interactive
wget https://cyclecloudarm.blob.core.windows.net/cyclecloudrelease/7.5.0/cyclecloud-cli.zip
```

The cloud shell will show you the progress of the download. When it is complete, unzip the file:

```azurecli-interactive
unzip cyclecloud-cli.zip
```

After all the files have been unpacked, navigate to the install directory with `cd cyclecloud-cli-installer` then run the script:

```azurecli-interactive
./install.sh
```

> [!NOTE]
> If you receive an error stating `/home/your-name/bin`
