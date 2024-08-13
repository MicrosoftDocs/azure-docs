---
title: Reset access to an Azure Windows VM 
description: Learn how to manage administrative users and reset access on Windows VMs by using the VMAccess Windows extension and the Azure CLI.
ms.topic: conceptual
ms.service: virtual-machines
ms.subservice: extensions
ms.author: gabsta
author: GabstaMSFT
ms.collection: windows
ms.date: 11/28/2023
ms.custom: GGAL-freshness822, devx-track-azurecli
---

# VMAccess Extension for Windows

The VMAccess Extension is used to manage administrative users, configure SSH, and check or repair disks on Azure Linux virtual machines. The extension integrates with Azure Resource Manager templates. It can also be invoked using Azure CLI, Azure PowerShell, the Azure portal, and the Azure Virtual Machines REST API.

This article describes how to run the VMAccess Extension from the Azure CLI, Azure PowerShell, and through an Azure Resource Manager template. This article also provides troubleshooting steps for Linux systems.

> [!NOTE]
> If you use the VMAccess extension to reset the password of your VM after you install the Microsoft Entra Login extension, rerun the Microsoft Entra Login extension to re-enable Microsoft Entra Login for your VM.