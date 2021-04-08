---
title: Disable managed identity for Automation
description: This article explains how to disable managed identity services for an Automation account.
services: automation
ms.subservice: process-automation
ms.date: 04/04/2021
ms.topic: conceptual
---

# Disable managed identity for Automation

There are two ways to disable a system-assigned identity in Azure Automation. You can do so via the Azure portal, or by using the Azure Resource Manager (ARM) template that was used to create it.

## Disable managed identity in the Azure portal

Disabling managed identity via the portal works no matter how the managed identity was originally set up.

1. In the Azure portal, go to the Automation account that you want to change.

1. Under **Account Settings**, select **Identity**.

1. Set the **System assigned** switch to **Off** and press **Save**. When you're prompted to confirm, press **Yes**.

The managed identity is removed and no longer has access to the target resource.

## Disable managed identity in Azure Resource Manager template

If you created the automation account managed identity by using an Azure Resource Manager (ARM) template, you can disable MID by setting the identity object's type child property to **None** and re-running the script.

```json
"identity": { 
   "type": "None" 
} 
```

Removing a system-assigned identity in this way will also delete it from Azure AD. System-assigned identities are also automatically removed from Azure AD when the app resource that they are assigned to is deleted.
