---
title: Enable backup during Azure virtual machine creation | Microsoft Docs
description: Learn how to enable backup while creating a virtual machine in portal
services: backup, virtual-machines
documentationcenter: ''
author: trinadhk  
manager: shreeshd
editor:''
tags: azure-resource-manager, virtual-machine-backup

ms.assetid: ee7e60b7-b6bb-4712-965f-640a236416ea
ms.service: backup, virtual-machines
ms.devlang: na
ms.topic: article
ms.workload: storage-backup-recovery
ms.date: 11/24/2017
ms.author: trinadhk
---

# Enable backup during Azure virtual machine creation
Azure Backup provides a browser-based user interface to create and configure Azure backups and all related resources. You can protect your data by taking backups at regular intervals. Azure Backup creates recovery points that can be stored in geo-redundant recovery vaults. This article details how to enable backup whil ecreating the virtual machine in portal. 

## Log in to Azure

Log in to the Azure portal at http://portal.azure.com.

## Create a virtual machine 
1. Click the **New** button found on the upper left-hand corner of the Azure portal.

2. Select **Compute**, and then select an image of the virtual machine.  

3. Enter the virtual machine information. The user name and password entered here is used to log in to the virtual machine. When complete, click **OK**.

4. Select a size for the VM. 

5. Under **Settings**, keep the defaults and click **OK**. 
