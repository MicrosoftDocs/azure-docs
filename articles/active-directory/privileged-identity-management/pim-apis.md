---
title: Microsoft Graph APIs for PIM (Preview) - Azure Active Directory | Microsoft Docs
description: Provides information about using the Microsoft Graph APIs for Azure AD Privileged Identity Management (PIM) (Preview).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: ''
ms.service: active-directory
ms.workload: identity
ms.subservice: pim
ms.topic: overview
ms.date: 11/13/2018
ms.author: rolyon
ms.custom: pim 
ms.collection: M365-identity-device-management
---
# Microsoft Graph APIs for PIM (Preview)

For most of the tasks you can perform in Azure Active Directory (Azure AD) Privileged Identity Management (PIM) using the Azure portal, you can also perform using the [Microsoft Graph APIs](https://developer.microsoft.com/graph/docs/concepts/overview). This article describes some important concepts when using the Microsoft Graph APIs for PIM. For details about the Microsoft Graph APIs, check out the [Azure AD Privileged Identity Management API reference](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/privilegedidentitymanagement_root).

> [!IMPORTANT]
> APIs under the /beta version in Microsoft Graph are in preview and are subject to change. Use of these APIs in production applications is not supported.

## Required permissions

To call the Microsoft Graph APIs for PIM, you must have **one or more** of the following permissions:

- `Directory.AccessAsUser.All`
- `Directory.Read.All`
- `Directory.ReadWrite.All`
- `PrivilegedAccess.ReadWrite.AzureAD`

### Set permissions

For applications to call the Microsoft Graph APIs for PIM, they must have the required permissions. The easiest way to specify the required permissions is to use the [Azure AD consent framework](../develop/consent-framework.md).

### Set permissions in Graph Explorer

If you are using the Graph Explorer to test your calls, you can specify the permissions in the tool.

1. Sign in to [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) as a Global Administrator.

1. Click **modify permissions**.

    ![Graph Explorer - modify permissions](./media/pim-apis/graph-explorer.png)

1. Add checkmarks next to the permissions you want to include. `PrivilegedAccess.ReadWrite.AzureAD` is not yet available in Graph Explorer.

    ![Graph Explorer - modify permissions](./media/pim-apis/graph-explorer-modify-permissions.png)

1. Click **Modify Permissions** to apply the permission changes.

## Next steps

- [Azure AD Privileged Identity Management API reference](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/privilegedidentitymanagement_root)
