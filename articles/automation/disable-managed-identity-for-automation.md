---
title: Disable Azure Automation account's system-assigned managed identity (preview)
description: This article explains how to disable and remove a system-assigned managed identity for an Azure Automation account.
services: automation
ms.subservice: process-automation
ms.date: 07/07/2021
ms.topic: conceptual
---

# Disable Azure Automation account's system-assigned managed identity (preview)

You can disable a system-assigned managed identity in Azure Automation by using the Azure portal, or using an Azure Resource Manager (ARM) template.

## Using the Azure portal

You can disable the system-assigned managed identity from the Azure portal no matter how the system-assigned managed identity was originally set up.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Automation account and under **Account Settings**, select **Identity**.

1. From the **System assigned** tab, under the **Status** button, select **Off** and then select **Save**. When you're prompted to confirm, select **Yes**.

The system-assigned managed identity is removed and no longer has access to the target resource.

## Using Azure Resource Manager template

If you created the system-assigned managed identity for your Automation account using an Azure Resource Manager template, you can disable the system-assigned managed identity by reusing that template and modifying its settings. Set the type of the `identity` object's child property to `None` as shown in the following example, and then re-run the template.

```json
"identity": { 
   "type": "None" 
} 
```

Removing a system-assigned managed identity with this method also deletes it from Azure AD. System-assigned managed identities are also automatically removed from Azure AD when the app resource that they are assigned to is deleted.

## Next steps

- For more information about enabling managed identities in Azure Automation, see [Enable and use managed identity for Automation (preview)](enable-managed-identity-for-automation.md).

- For an overview of Automation account security, see [Automation account authentication overview](automation-security-overview.md).