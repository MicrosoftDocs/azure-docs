---
title: Hide an Enterprise application
titleSuffix: Azure AD
description: How to hide an Enterprise application from user's experience in Azure Active Directory access portals or Microsoft 365 launchers.
services: active-directory
author: lnalepa
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: how-to
ms.date: 09/23/2021
ms.author: lenalepa
ms.reviewer: ergreenl
ms.collection: M365-identity-device-management
#customer intent: As an admin, I want to hide an enterprise application from user's experience so that it is not listed in the user's Active directory access portals or Microsoft 365 launchers
---

# Hide an Enterprise application

Learn how to hide enterprise applications in Azure Active Directory. When an application is hidden, users still have permissions to the application.

## Prerequisites

- Application administrator privileges are required to hide an application from the My Apps portal and Microsoft 365 launcher.

- Global administrator privileges are required to hide all Microsoft 365 applications.

## Hide an application from the end user

Use the following steps to hide an application from My Apps portal and Microsoft 365 application launcher.

1. Sign in to the [Azure portal](https://portal.azure.com) as the global administrator for your directory.
1. Select **Azure Active Directory**.
1. Select **Enterprise applications**.
1. Under **Application Type**, select **Enterprise Applications**, if it isn't already selected.
1. Search for the application you want to hide, and select the application.
1. Select **No** for the **Visible to users?** question.
1. Select **Save**.

> [!NOTE]
> These instructions apply only to Enterprise applications.

## Use Azure AD PowerShell to hide an application

To hide an application from the My Apps portal, you can manually add the HideApp tag to the service principal for the application. Run the following [AzureAD PowerShell](/powershell/module/azuread/#service_principals) commands to set the application's **Visible to Users?** property to **No**.

```PowerShell
Connect-AzureAD

$objectId = "<objectId>"
$servicePrincipal = Get-AzureADServicePrincipal -ObjectId $objectId
$tags = $servicePrincipal.tags
$tags += "HideApp"
Set-AzureADServicePrincipal -ObjectId $objectId -Tags $tags
```

## Hide Microsoft 365 applications from the My Apps portal

Use the following steps to hide all Microsoft 365 applications from the My Apps portal. The applications are still visible in the Office 365 portal.

1. Sign in to the [Azure portal](https://portal.azure.com) as a global administrator for your directory.
1. Select **Azure Active Directory**.
1. Select **Users**.
1. Select **User settings**.
1. Under **Enterprise applications**, select **Manage how end users launch and view their applications.**
1. For **Users can only see Office 365 apps in the Office 365 portal**, select **Yes**.
1. Select **Save**.

## Next steps

- [Remove a user or group assignment from an enterprise app](./assign-user-or-group-access-portal.md)
