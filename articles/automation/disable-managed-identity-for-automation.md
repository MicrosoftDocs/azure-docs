---
title: Disable your Azure Automation account user assigned managed identity (preview)
description: This article explains how to disable and remove a managed identity for an Azure Automation account.
services: automation
ms.subservice: process-automation
ms.date: 06/28/2021
ms.topic: conceptual
---

# Disable Azure Automation account's user assigned managed identity (preview)

You can disable a user assigned managed identity in Azure Automation from the Azure portal or with an Azure Resource Manager (ARM) template.

## Disable user assigned managed identity from the Azure portal

You can disable the user assigned managed identity from the Azure portal no matter how the managed identity was originally set up.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Automation account and under **Account Settings**, select **Identity** .

1. Select the **User assigned** tab.

1. Select the identity to be removed. Then select **Remove**, and then **Yes** at the pop-up window.

The managed identity is removed and no longer has access to the target resource.

## Disable user assigned managed identity with Azure Resource Manager template

If you created the user assigned managed identity for your Automation account using an Azure Resource Manager template, you can disable the user assigned managed identity by reusing that template and modifying its settings. Set the type of the identity object's child property `userAssignedIdentities` to `null` as shown in the following example, and then re-run the template.

```json
"identity" :    { 

    "type": "SystemAssigned, UserAssigned", 

    "userAssignedIdentities": { 

    "/subscriptions/12345/resourceGroups/msi/providers/Microsoft.ManagedIdentity/userAssignedIdentities/second": null 

} 
```

Removing a system assigned identity using this method also deletes it from Azure AD. System assigned identities are also automatically removed from Azure AD when the app resource that they are assigned to is deleted.

> [!NOTE]
> Identity `type` must be specified as `SystemAssigned, UserAssigned` since you need a system assigned managed identity to use the user assigned managed identity.

## Next steps

- For more information about enabling managed identity in Azure Automation, see [Enable and use managed identity for Automation (preview)](enable-managed-identity-for-automation.md).

- For an overview of Automation account security, see [Automation account authentication overview](automation-security-overview.md).
