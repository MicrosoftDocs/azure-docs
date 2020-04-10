---
title: Add and remove administrative units (preview) - Azure Active Directory | Microsoft Docs
description: Use administrative units to restrict scope of role permissions in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.topic: article
ms.subservice: users-groups-roles
ms.workload: identity
ms.date: 04/09/2020
ms.author: curtand
ms.reviewer: anandy
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---

# Manage administrative units in Azure Active Directory

For more granular administrative control in Azure Active Directory (Azure AD), you can assign users to an Azure AD role with a scope limited to one or more administrative units (AUs).

## Getting started

1. To run queries from the following instructions via [Graph Explorer](https://aka.ms/ge), please ensure the following:

    1. Go to Azure AD in the portal, and then in the applications select Graph Explorer and provide admin consent to Graph Explorer.

        ![select Graph Explorer and provide admin consent on this page](./media/roles-aus-manage-admin-units/select-graph-explorer.png)

    1. In the Graph Explorer, ensure that you select the beta version.

        ![select the beta version before the POST operation](./media/roles-aus-manage-admin-units/select-beta-version.png)

1. Please use the preview version of Azure AD PowerShell. Detailed instructions are here.

## Add an administrative unit

### Azure portal

1. Go to Active Directory in the portal and select Administrative Units in the left panel.

    ![navigate to Administrative units in Azure Active Directory](./media/roles-aus-manage-admin-units/nav-to-admin-units.png)

1. Select **Add*** and provide the name of the administrative unit and optionally can add a description for the administrative unit.

    ![select Add and then enter a name for the administrative unit](./media/roles-aus-manage-admin-units/add-new-admin-unit.png)

1. Select **Add** to finalize the administrative unit.

### PowerShell

Install Azure AD PowerShell (preview version) before trying to perform the actions below:

    Connect-AzureAD
    New-AzureADAdministrativeUnit -Description "West Coast region" -DisplayName "West Coast"

The values highlighted above can be modified as required.

### The Microsoft Graph

    Http Request
    POST /administrativeUnits
    Request body
    {
        "displayName": "North America Operations",
        "description": "North America Operations administration"
    }

## Remove an administrative unit

In Azure Active Directory (Azure AD), you can remove an admin unit that you no longer need as a unit of scope for administrative roles.

### Azure portal

Go to **Azure AD > Administrative units** in the portal. Select the administrative unit to be deleted and then select **Delete**. After confirming **Yes**, the administrative unit will be deleted.

![Select an administrative unit to delete](./media/roles-aus-manage-admin-units/select-admin-unit-to-delete.png)

### PowerShell

    $delau = Get-AzureADAdministrativeUnit -Filter "displayname eq 'DeleteMe Admin Unit'"
    Remove-AzureADAdministrativeUnit -ObjectId $delau.ObjectId

The highlighted section may be changed as required for the specific environment.

### Graph API

    HTTP request
    DELETE /administrativeUnits/{Admin id}
    Request body
    {}

## Next steps

[Managing users in administrative unit](roles-aus-add-manage-users.md)
[Managing groups in administrative unit](roles-aus-add-manage-groups.md)
