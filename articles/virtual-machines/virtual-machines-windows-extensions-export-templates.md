---
title: Exporting Resource Groups that contain VM extensions | Microsoft Docs
description: Export Resource Manager templates that include virtual machine extensions.
services: virtual-machines-windows
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 7f4e2ca6-f1c7-4f59-a2cc-8f63132de279
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 11/28/2016
ms.author: nepeters
---

# Exporting Resource Groups that contain VM extensions

Azure Resource Groups can be exported into a Resource Manager template that can then be redeployed. The export process will interpret existing resources and configurations, and create a resource manager template that when deployed will result in a similar Resource Group. When using the Resource Group export option against a Resource Group containing Virtual Machine extensions, several items need to be considered such as extension compatibility, secured settings, and extension dependencies.

This document will detail how the Resource Group export process works regarding virtual machine extensions including a list of supported extension and details on handling secured data.

## Supported Virtual Machine Extensions

Many Virtual Machine extensions are available, however not all of them can be exported into a Resource Manager template using the “Automation Script” feature. If a VM extension is not supported, it will need to be manually placed back into the exported template.

The following extension can be exported with the automation Script feature.

- IaaS Diagnostics
- Iaas Antimalware
- Custom Script Extesion for windows
- Custom Script Extension for Linux
- ..
- ..

## Export the Resource Group

To export a Resource Group into a re-useable template, complete the following:

1. Sign in to the Azure Portal
2. On the Hub Menu, click Resource Groups
3. Select the resource group from the list
4. In the Resource Group blade, click Automation Script

## Configure protected settings

## Extension dependencies


