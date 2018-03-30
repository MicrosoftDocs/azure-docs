---
title: Azure virtual machine extensions and features | Microsoft Docs
description: Learn what Azure VM extensions anre how to use them with Azure virtual machines
services: virtual-machines-linux
documentationcenter: ''
author: danielsollondon
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 03/09/2018
ms.author: danis
---

# Azure virtual machine extensions and features
Azure virtual machine extensions are small applications that provide post-deployment configuration and automation tasks on Azure virtual machines. This means you can use existing images and then customize them as part of your deployments, getting you out of the business of image publishing.

The Azure Platform hosts many extensions that range from VM configuration, monitoring, secuirty and utility applications. If the application in the extension repositry does not exist, then you can use the Custom Script extensions and configure your VM with your own scripts and commands.

Azure VM extensions can be managed using either the Azure CLI, PowerShell, Azure Resource Manager templates, and the Azure portal, meaning that you never need to connect to a VM directly to install or delete the extension. As Azure Extension application lifecycle is managed outside of the VM and integrated into the Azure platform, you also get integrated status of the extension.

Extensions can be bundled with a new virtual machine deployment, for example, they can be part of a larger deployment, configuring applications on VM provision, or run against any supported extension operated systems post deployment.

In order to use extensions on Windows and Linux OS's, you need to have the Azure VM Agents installed and the induvidual extension applications may have their own environmental prequities. 

This document provides an overview of VM extensions, prerequisites for using Azure VM extensions, and guidance on how to detect, manage, and remove VM extensions. This document provides generalized information because many VM extensions are available, each with a potentially unique configuration. Extension-specific details can be found in each document specific to the individual extension.
