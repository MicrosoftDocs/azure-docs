---
title: Administrative unit scope for roles (preview) - Azure Active Directory | Microsoft Docs
description: Using administrative units for more granular delegation of permissions in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.topic: article
ms.subservice: users-groups-roles
ms.workload: identity
ms.date: 03/05/2020
ms.author: curtand
ms.reviewer: elkuzmen
ms.custom: oldportal;it-pro;
ms.collection: M365-identity-device-management
---

# Delete an administrative unit in Azure Active Drectory

In Azure Active Directory (Azure AD), you can delete an admin unit that you no longer need as a unit of scope for administrative roles.

## Getting started

1. To run queries from the following instructions via [Graph Explorer](https://aka.ms/ge), please ensure the following:

    1. Go to Azure AD in the portal, and then in the applications select Graph Explorer and provide admin consent to Graph Explorer.

        ![select Graph Explorer and provide admin consent on this page](./media/roles-administrative-units-scope/select-graph-explorer.png)

    1. In the Graph Explorer, ensure that you select the beta version.

        ![select the beta version before the POST operation](./media/roles-administrative-units-scope/select-beta-version.png)

1. Please use the preview version of Azure AD PowerShell. Detailed instructions are here.

### Azure portal

Go to **Azure AD > Administrative units** in the portal. Select the administrative unit to be deleted and then select **Delete**. After confirming **Yes**, the administrative unit will be deleted.

![Select an administrative unit to delete](./media/roles-administrative-units-scope/select-admin-unit-to-delete.png)

### PowerShell

    $delau = Get-AzureADAdministrativeUnit -Filter "displayname eq 'DeleteMe Admin Unit'"
    Remove-AzureADAdministrativeUnit -ObjectId $delau.ObjectId

The highlighted section may be changed as required for the specific environment.

### Graph API

    HTTP request
    DELETE /administrativeUnits/{Admin id}
    Request body
    {}

