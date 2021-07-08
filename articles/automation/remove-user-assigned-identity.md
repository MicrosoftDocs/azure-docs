---
title: Remove user-assigned managed identity for Azure Automation account (preview)
description: This article explains how to remove a user-assigned managed identity for an Azure Automation account.
services: automation
ms.subservice: process-automation
ms.date: 07/07/2021
ms.topic: conceptual
---

# Remove user-assigned managed identity for Azure Automation account (preview)

You can remove a user-assigned managed identity in Azure Automation by using the Azure portal, or using an Azure Resource Manager (ARM) template.

## Using the Azure portal

You can remove the user-assigned managed identity from the Azure portal no matter how the user-assigned managed identity was originally set up.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Automation account and under **Account Settings**, select **Identity**.

1. Select the **User assigned** tab.

1. Select the user-assigned managed identity to be removed from the list.

1. Select **Remove**. When you're prompted to confirm, select **Yes**.

The user-assigned managed identity is removed and no longer has access to the target resource.

## Using Azure Resource Manager template

If you added the user-assigned managed identity for your Automation account using an Azure Resource Manager template, you can remove the user-assigned managed identity by reusing that template and modifying its settings. Set the type of the identity object's child property `userAssignedIdentities` to `null` as shown in the following example, and then re-run the template.

```json
TBD
```


## Next steps

- For more information about enabling managed identities in Azure Automation, see [Enable and use managed identity for Automation (preview)](enable-managed-identity-for-automation.md).

- For an overview of Automation account security, see [Automation account authentication overview](automation-security-overview.md).