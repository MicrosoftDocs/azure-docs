---
title: Disable managed identity for Automation
description: This article explains how to disable managed identity services for an Automation account.
services: automation
ms.subservice: process-automation
ms.date: 04/04/2021
ms.topic: conceptual
---

# Disable managed identity for Automation

There are two ways to disable a system-assigned identity in Azure Automation. You can complete this tasd from the Azure portal, or by using an Azure Resource Manager (ARM) template.

## Disable managed identity in the Azure portal

You can disable the managed identity from the Azure portal no matter how the managed identity was originally set up.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Automation account and select **Identity** under **Account Settings**.

1. Set the **System assigned** switch to **Off** and press **Save**. When you're prompted to confirm, press **Yes**.

The managed identity is removed and no longer has access to the target resource.

## Disable managed identity in Azure Resource Manager template

If you created the automation account managed identity by using an Azure Resource Manager (ARM) template, you can disable managed identity by re-running the script. First, set the type of the identity object's child property to **None**, then run the script again.

```json
"identity": { 
   "type": "None" 
} 
```

Removing a system-assigned identity in this way will also delete it from Azure AD. System-assigned identities are also automatically removed from Azure AD when the app resource that they are assigned to is deleted.

## Next steps

- For more about enabling managed identity in Automation, see [Enable and use managed identity for Automation](enable-managed-identity-for-automation.md).

- For an overview of Automation account security, see [Automation account authentication overview](automation-security-overview.md).
