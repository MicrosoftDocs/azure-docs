---
title: Hide an Enterprise application
description: How to hide an Enterprise application from user's experience in Microsoft Entra ID access portals or Microsoft 365 launchers.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 09/07/2023
ms.author: jomondi
ms.reviewer: ergreenl, lenalepa
ms.collection: M365-identity-device-management
zone_pivot_groups: enterprise-apps-all
ms.custom: enterprise-apps, has-azure-ad-ps-ref
#customer intent: As an admin, I want to hide an enterprise application from user's experience so that it is not listed in the user's Active directory access portals or Microsoft 365 launchers
---

# Hide an Enterprise application

Learn how to hide enterprise applications in Microsoft Entra ID. When an application is hidden, users still have permissions to the application.

## Prerequisites

To hide an application from the My Apps portal and Microsoft 365 launcher, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator.
- Global administrator is required to hide all Microsoft 365 applications.

## Hide an application from the end user

:::zone pivot="portal"

Use the following steps to hide an application from My Apps portal and Microsoft 365 application launcher.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [cloud application administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **All applications**.
1. Search for the application you want to hide, and select the application.
1. In the left navigation pane, select **Properties**.
1. Select **No** for the **Visible to users?** question.
1. Select **Save**.

:::zone-end

> [!NOTE]
> These instructions apply only to Enterprise applications.

:::zone pivot="aad-powershell"


To hide an application from the My Apps portal, using Azure AD PowerShell, you need to connect to Azure AD PowerShell and sign in as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). You can manually add the **HideApp** tag to the service principal for the application. Run the following Azure AD PowerShell commands to set the application's **Visible to Users?** property to **No**.

```PowerShell
Connect-AzureAD

$objectId = "<objectId>"
$servicePrincipal = Get-AzureADServicePrincipal -ObjectId $objectId
$tags = $servicePrincipal.tags
$tags += "HideApp"
Set-AzureADServicePrincipal -ObjectId $objectId -Tags $tags
```
:::zone-end

:::zone pivot="ms-powershell"

To hide an application from the My Apps portal, using Microsoft Graph PowerShell, you need to connect to Microsoft Graph PowerShell and sign in as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). You can manually add the HideApp tag to the service principal for the application. Run the following Microsoft Graph PowerShell commands to set the application's **Visible to Users?** property to **No**.

```PowerShell
Connect-MgGraph

$servicePrincipal = Get-MgServicePrincipal -ServicePrincipalId $objectId
$tags = $servicePrincipal.tags
$tags += "HideApp"
Update-MgServicePrincipal -ServicePrincipalID  $objectId -Tags $tags
```
:::zone-end

:::zone pivot="ms-graph"

To hide an enterprise application using [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer), you need to sign in as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 

Run the following queries.

1. Get the application you want to hide.

   ```http
   GET https://graph.microsoft.com/v1.0/servicePrincipals/5f214ccd-3f74-41d7-b683-9a6d845eea4d
   ```
1. Update the application to hide it from users.

   ```http
   PATCH https://graph.microsoft.com/v1.0/servicePrincipals/5f214ccd-3f74-41d7-b683-9a6d845eea4d/
   ```

    Supply the following request body.

    ```json
    {
        "tags": [
        "HideApp"
        ]
    }
    ```
   
   >[!WARNING]
   >If the application has other tags, you must include them in the request body. Otherwise, the query will overwrite them.

:::zone-end

:::zone pivot="portal"

## Hide Microsoft 365 applications from the My Apps portal

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Use the following steps to hide all Microsoft 365 applications from the My Apps portal. The applications are still visible in the Office 365 portal.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a [global administrator](../roles/permissions-reference.md#global-administrator). 
1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. Select **App launchers**.
2. Select **Settings**.
3. Enable the option of **Users can only see Microsoft 365 apps in the Microsoft 365 portal**.
4. Select **Save**.

:::zone-end
## Next steps

- [Remove a user or group assignment from an enterprise app](./assign-user-or-group-access-portal.md)
