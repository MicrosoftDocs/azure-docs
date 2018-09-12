---
title: Azure CycleCloud Manual Installation | Microsoft Docs
description: Manually install and configure Azure CycleCloud.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Manual Installation

Azure CycleCloud can be installed using an [ARM template](quickstart-install-cyclecloud.md), via [Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azurecyclecloud.azure-cyclecloud-vm?tab=Overview) or using a container in the [Azure Container Registry](https://hub.docker.com/r/microsoft/azure-cyclecloud/). For production instances of CycleCloud, we recommend installing the product manually as outlined below.

> [!NOTE]
> The CycleCloud product encompasses many pieces, including a command line transfer tool called [pogo](pogo-overview.md), node configuration software known as [Jetpack](jetpack.md), and a installable webserver platform called CycleServer. Because of this, you will find CycleServer referenced in many commands and directory names on the machine where the CycleCloud server is installed.

## System Requirements

To install CycleCloud, you must have administrator rights. In addition, your system needs to meet the following minimum requirements:

* A 64-bit Linux distribution
* Java Runtime Environment version 8
* At least 8GB of RAM
* Four or more CPU cores
* At least 50GB of free disk space
* Administrator (root) privileges
* Active Microsoft Azure Subscription

> [!NOTE]
> CycleCloud may be installed on physical or virtualized hardware.

## SSH Key

The default SSH key used in CycleCloud is */opt/cycle_server/.ssh/cyclecloud.pem*. If this does not already exist, it will be automatically generated upon startup (or restart) of CycleCloud.

## Installation

Download the [Azure CycleCloud install file](https://www.microsoft.com/en-us/download/details.aspx?id=57182) from the Microsoft Download Center and install using a package manager.

For the .rpm install file:

```CMD
yum install <filename.rpm>
```

For the .deb install file:

```CMD
dpkg -i <filename.deb>
```

> [!NOTE]
>You must have write permission to the _/opt_ directory. The CycleCloud installer will create a `cycle_server` user and unix group, install into the */opt/cycle_server* directory by default, and assign `cycle_server:cycle_server` ownership to the directory.

Once the installer has finished running, you will be provided a link to complete the installation from your browser. Copy the link provided into your web browser and follow the configuration steps.

### Notes on Security

The default installation of CycleCloud uses non-encrypted HTTP running on port 8080. We strongly recommend [configuring SSL](ssl-configuration.md) for all installations.

Do not install CycleCloud on a shared drive, or any drive in which non-admin users have access. Anyone with access to the CycleCloud group will gain access to unencrypted data. We recommend that non-admin users not be added to this group.

## Configuration

After CycleCloud is installed, it is configured through your web browser. The login screen will load after the webserver has fully initialized, which can take several minutes.

### Step 1: Welcome

![Welcome Screen](~/images/setup-step1.png)

Enter a **Site Name** then click **Next**.

### Step 2: License Agreement

![License Screen](~/images/setup-step2.png)

Accept the license agreement and then click **Next**.

### Step 3: Administrator Account

![Administrator Account setup](~/images/setup-step3.png)

You will now set up the local administrator account for CycleCloud. This account is used to administer the CycleCloud application - it is NOT an operating system account. Enter a **User ID**, **Name** and **Password**, then click **Done** to continue.

> [!NOTE]
> All CycleCloud account passwords must be between 8 and 123 characters long, and meet at least 3 of the following 4 conditions:
> * Contain at least one upper case letter
> * Contain at least one lower case letter
> * Contain at least one number
> * Contain at least one special character: @ # $ % ^ & * - _ ! + = [ ] { } | \ : ' , . ?

## Update CycleCloud

See the [Update Azure CycleCloud](~/cyclecloud-references/upgrade-and-migrate.md) page.