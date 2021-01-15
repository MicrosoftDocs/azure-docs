---
title: Convert portal template to template spec
description: Describes how to convert an existing template in the Azure portal gallery to a template specs.
ms.topic: conceptual
ms.date: 01/14/2021
ms.author: tomfitz
author: tfitzmac
---
# Convert template gallery in portal to template specs

The Azure portal provides a way to store Azure Resource Manager templates (ARM templates) in your account. This feature is called **Templates (Preview)** in the portal. It is being deprecated. Instead of using this feature, use [template specs](template-specs.md).

This article shows how to convert existing templates in the portal gallery to template specs.

## Deprecation of portal feature

The template gallery in the portal is being deprecated on January 21, 2021. You can continue using it without change until February 21st. Starting on February 22nd, you can't create new templates in the portal gallery but you can continue deploying existing templates.

On June 22nd, the feature will be removed from the portal and all API operations will be blocked. You'll not be able to deploy or get any templates from the gallery.

Prior to June 22nd, you should migrate any templates that you want to continue using with one of the methods shown in this article. After the feature has been removed, you'll need to open a support case to get any templates that you've not migrated.

## Convert with PowerShell script

