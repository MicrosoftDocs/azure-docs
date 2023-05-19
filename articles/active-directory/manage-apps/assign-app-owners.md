---
title: Assign enterprise application owners
description: Learn how to assign owners to applications in Azure Active Directory
services: active-directory
documentationcenter: ''
author: omondiatieno
manager: celesteDG
ms.service: active-directory
ms.workload: identity
ms.subservice: app-mgmt
ms.topic: how-to
ms.date: 01/26/2023
ms.author: jomondi
ms.reviewer: saibandaru
zone_pivot_groups: enterprise-apps-minus-aad-powershell
ms.custom: enterprise-apps

#Customer intent: As an Azure AD administrator, I want to assign owners to enterprise applications.
---

# Assign enterprise application owners

An [owner of an enterprise application](overview-assign-app-owners.md) in Azure Active Directory (Azure AD) can manage the organization-specific configuration of the application, such as single sign-on, provisioning, and user assignments. An owner can also add or remove other owners. Unlike Global Administrators, owners can manage only the enterprise applications they own. In this article, you learn how to assign an owner of an application.

## Assign an owner

:::zone pivot="portal"

To assign an owner to an enterprise application:

1. Sign in to [your Azure AD organization](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with an account that is eligible for the **Application Administrator** role or the **Cloud Application Administrator** role for the organization.
2. Select **Enterprise applications**, and then select the application that you want to add an owner to.
3. Select **Owners**, and then select **Add** to get a list of user accounts that you can choose an owner from.
4. Search for and select the user account that you want to be an owner of the application.
5. Click **Select** to add the user account that you chose as an owner of the application.

:::zone-end

:::zone pivot="ms-powershell"

Use the following Microsoft Graph PowerShell cmdlet to add an owner to an enterprise application.

You'll need to consent to the `Application.ReadWrite.All` permission.

In the following example, the user's object ID is 8afc02cb-4d62-4dba-b536-9f6d73e9be26 and the applicationId is 46e6adf4-a9cf-4b60-9390-0ba6fb00bf6b.

```powershell
Import-Module Microsoft.Graph.Applications

$params = @{
    "@odata.id" = "https://graph.microsoft.com/v1.0/directoryObjects/8afc02cb-4d62-4dba-b536-9f6d73e9be26"
}

New-MgServicePrincipalOwnerByRef -ServicePrincipalId '46e6adf4-a9cf-4b60-9390-0ba6fb00bf6b' -BodyParameter $params
```
:::zone-end

:::zone pivot="ms-graph"

To assign an owner to an application, sign in to [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) with one of the roles listed in the prerequisite section.

You'll need to consent to the `Application.ReadWrite.All` permission.

Run the following Microsoft Graph query to assign an owner to an application. You need the object ID of the user you want to assign the application to. In the following example, the user's object ID is 8afc02cb-4d62-4dba-b536-9f6d73e9be26 and the appId is 46e6adf4-a9cf-4b60-9390-0ba6fb00bf6b.

```http
POST https://graph.microsoft.com/v1.0/servicePrincipals(appId='46e6adf4-a9cf-4b60-9390-0ba6fb00bf6b')/owners/$ref
Content-Type: application/json

{
    "@odata.id": "https://graph.microsoft.com/v1.0/directoryObjects/8afc02cb-4d62-4dba-b536-9f6d73e9be26"
}
```

:::zone-end

> [!NOTE]
> If the user setting **Restrict access to Azure AD administration portal** is set to `Yes`, non-admin users will not be able to use the Azure portal to manage the applications they own. For more information about the actions that can be performed on owned enterprise applications, see [Owned enterprise applications](../fundamentals/users-default-permissions.md#owned-enterprise-applications). 

## Next steps

- [Delegate app registration permissions in Azure Active Directory](../roles/delegate-app-roles.md)
