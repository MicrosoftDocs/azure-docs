---
title: Azure virtual machine extensions and features | Microsoft Docs
description: Learn what Azure VM extensions anre how to use them with Azure virtual machines
services: virtual-machines-linux
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 04/26/2017
ms.author: nepeters
---

# Azure virtual machine extensions and features
Azure virtual machine extensions are small applications that provide post-deployment configuration and automation tasks on Azure virtual machines. For example, if a virtual machine requires software installation, anti-virus protection, or Docker configuration, a VM extension can be used to complete these tasks. Azure VM extensions can be run using the Azure CLI, PowerShell, Azure Resource Manager templates, and the Azure portal. Extensions can be bundled with a new virtual machine deployment, or run against any existing system.

This document provides an overview of VM extensions, prerequisites for using Azure VM extensions, and guidance on how to detect, manage, and remove VM extensions. This document provides generalized information because many VM extensions are available, each with a potentially unique configuration. Extension-specific details can be found in each document specific to the individual extension.

# Next steps