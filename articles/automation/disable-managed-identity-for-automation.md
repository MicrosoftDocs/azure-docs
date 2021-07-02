---
title: Disable your Azure Automation account managed identity (preview)
description: This article explains how to disable and remove a managed identity for an Azure Automation account.
services: automation
ms.subservice: process-automation
ms.date: 04/14/2021
ms.topic: conceptual
---

# Disable your Azure Automation account managed identity (preview)

There are two ways to disable a system-assigned identity in Azure Automation. You can complete this task from the Azure portal, or by using an Azure Resource Manager (ARM) template.

## Disable managed identity in the Azure portal

You can disable the managed identity from the Azure portal no matter how the managed identity was originally set up.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Automation account and select **Identity** under **Account Settings**.

1. Set the **System assigned** option to **Off** and press **Save**. When you're prompted to confirm, press **Yes**.

The managed identity is removed and no longer has access to the target resource.

## Disable using Azure Resource Manager template

If you created the managed identity for your Automation account using an Azure Resource Manager template, you can disable the managed identity by reusing that template and modifying its settings. Set the type of the identity object's child property to **None** as shown in the following example, and then re-run the template.

```json
"identity": { 
   "type": "None" 
} 
```

Removing a system-assigned identity using this method also deletes it from Azure AD. System-assigned identities are also automatically removed from Azure AD when the app resource that they are assigned to is deleted.

## Next steps

- For more information about enabling managed identity in Azure Automation, see [Enable and use managed identity for Automation (preview)](enable-managed-identity-for-automation.md).

- For an overview of Automation account security, see [Automation account authentication overview](automation-security-overview.md).
