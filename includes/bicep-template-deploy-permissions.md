---
title: Permissions for Deploying Bicep Files and ARM Templates | Microsoft Docs
description: Permissions for Bicep File and ARM Template deployment.
author: mumian
ms.author: dma
ms.topic: conceptual
ms.date: 1/06/2022
ms.custom: devx-track-azurecli, seo-azure-cli
---

## Permissions Needed for Bicep File and Arm Template Deployment

This article defines the permissions the user needs to deploy Bicep Files and ARM Templates. 

When deploying Bicep files and ARM Template files, the user would need the following permissions in order to deploy successfully: 

`Microsoft.Resources/deployments/*`

For resource specific permissions, the user will need permissions that directly pertain to the exact resource. For example, a user deploying a virtual machine resource would look like this:

`Microsoft.Compute/virtualMachines/write.`