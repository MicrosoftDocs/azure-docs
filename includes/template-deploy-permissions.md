---
title: Permissions for Deploying Bicep Files and ARM Templates | Microsoft Docs
description: Permissions for Bicep File and ARM Template deployment.
ms.author: daphnemamsft
ms.topic: conceptual
ms.date: 1/06/2022
ms.custom: devx-track-azurecli, seo-azure-cli
---

## Required Permissions 

To deploy a Bicep file or ARM template, you need write access on the resources you're deploying and access to all operations on the Microsoft.Resources/deployments resource type. For example, to deploy a virtual machine, you need `Microsoft.Compute/virtualMachines/write` and `Microsoft.Resources/deployments/*` permissions.

For a list of roles and permissions, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).
