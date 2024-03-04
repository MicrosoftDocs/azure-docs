---
title: 'Configure enterprise application properties'
description: Configure the properties of an enterprise application in Azure Active Directory.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 01/26/2023
ms.author: jomondi
ms.reviewer: ergreenl
zone_pivot_groups: enterprise-apps-minus-former-powershell
ms.custom: enterprise-apps

#Customer intent: As an administrator of an Azure AD tenant, I want to configure the properties of an enterprise application.
---

# Configure enterprise application properties

This article shows you where you can configure the properties of an enterprise application in your Azure Active Directory (Azure AD) tenant. For more information about the properties that you can configure, see [Properties of an enterprise application](application-properties.md).

## Prerequisites

To configure the properties of an enterprise application, you need:

- An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.

## Configure application properties

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Application properties control how the application is represented and how the application is accessed.

:::zone pivot="portal"

To configure the application properties:

1. Sign in to the [Azure portal](https://portal.azure.com) and sign in using one of the roles listed in the prerequisites.
1. Browse to **Azure Active Directory** > **Enterprise applications**. The **All applications** pane opens and displays a list of the applications in your Azure AD tenant. Search for and select the application that you want to use.
1. In the **Manage** section, select **Properties** to open the **Properties** pane for editing.
1. On the **Properties** pane, you may want to configure the following properties for your application:
   - Logo
   - User sign in options
   - App visibility to users
   - Set available URL options
   - Choose whether app assignment is required
   
:::zone-end

:::zone pivot="ms-powershell"

Use the following Microsoft Graph PowerShell script to configure basic application properties.

You'll need to consent to the `Application.ReadWrite.All` permission.

```powershell

Import-Module Microsoft.Graph.Applications

$params = @{
    Tags = @(
        "HR"
        "Payroll"
        "HideApp"
    )
    Info = @{
        LogoUrl = "https://cdn.pixabay.com/photo/2016/03/21/23/25/link-1271843_1280.png"
        MarketingUrl = "https://www.contoso.com/app/marketing"
        PrivacyStatementUrl = "https://www.contoso.com/app/privacy"
        SupportUrl = "https://www.contoso.com/app/support"
        TermsOfServiceUrl = "https://www.contoso.com/app/termsofservice"
    }
    Web = @{
        HomePageUrl = "https://www.contoso.com/"
        LogoutUrl = "https://www.contoso.com/frontchannel_logout"
        RedirectUris = @(
            "https://localhost"
        )
    }
    ServiceManagementReference = "Owners aliases: Finance @ contosofinance@contoso.com; The Phone Company HR consulting @ hronsite@thephone-company.com;"
}

Update-MgApplication -ApplicationId $applicationId -BodyParameter $params
```
:::zone-end

:::zone pivot="ms-graph"

To configure the basic properties of an application, sign in to [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) with one of the roles listed in the prerequisite section.

You'll need to consent to the `Application.ReadWrite.All` permission.

Run the following Microsoft Graph query to configure basic application properties.

```http
PATCH https://graph.microsoft.com/v1.0/applications/0d0021e2-eaab-4b9f-a5ad-38c55337d63e/
Content-type: application/json

{
    "tags": [
        "HR",
        "Payroll",
        "HideApp"
    ],
    "info": {
        "logoUrl": "https://cdn.pixabay.com/photo/2016/03/21/23/25/link-1271843_1280.png",
        "marketingUrl": "https://www.contoso.com/app/marketing",
        "privacyStatementUrl": "https://www.contoso.com/app/privacy",
        "supportUrl": "https://www.contoso.com/app/support",
        "termsOfServiceUrl": "https://www.contoso.com/app/termsofservice"
    },
    "web": {
        "homePageUrl": "https://www.contoso.com/",
        "logoutUrl": "https://www.contoso.com/frontchannel_logout",
        "redirectUris": [
            "https://localhost"
        ]
    },
    "serviceManagementReference": "Owners aliases: Finance @ contosofinance@contoso.com; The Phone Company HR consulting @ hronsite@thephone-company.com;"
}
```
:::zone-end

## Use Microsoft Graph to configure application properties

You can also configure other advanced properties of both app registrations and enterprise applications (service principals) through Microsoft Graph. These include properties such as permissions, and role assignments. For more information, see [Create and manage an Azure AD application using Microsoft Graph](/graph/tutorial-applications-basics#configure-other-basic-properties-for-your-app).

## Next steps

Learn more about how to manage enterprise applications.
> [!div class="nextstepaction"]
> [What is application management in Azure Active Directory?](what-is-application-management.md)
