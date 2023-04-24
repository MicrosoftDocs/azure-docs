---
title: 'Delete an enterprise application'
description: Delete an enterprise application in Azure Active Directory.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 07/28/2022
ms.author: jomondi
ms.reviewer: sureshja
zone_pivot_groups: enterprise-apps-all

#Customer intent: As an administrator of an Azure AD tenant, I want to delete an enterprise application.
---

# Delete an enterprise application

In this article, you learn how to delete an enterprise application that was added to your Azure Active Directory (Azure AD) tenant. 

When you delete and enterprise application, it will be held in a suspended state in the recycle bin for 30 days. During the 30 days, you can [Restore the application](restore-application.md). Deleted items are automatically hard deleted after the 30-day period. For more information on frequently asked questions about deletion and recovery of applications, see [Deleting and recovering applications FAQs](delete-recover-faq.yml).


## Prerequisites

To delete an enterprise application, you need:

- An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
- An [enterprise application added to your tenant](add-application-portal.md)

## Delete an enterprise application

:::zone pivot="portal"

1. Sign in to the [Azure portal](https://portal.azure.com) and sign in using one of the roles listed in the prerequisites.
1. In the left menu, select **Enterprise applications**. The **All applications** pane opens and displays a list of the applications in your Azure AD tenant. Search for and select the application that you want to delete. For example, **Azure AD SAML Toolkit 1**.
1. In the **Manage** section of the left menu, select **Properties**.
1. At the top of the **Properties** pane, select **Delete**, and then select **Yes** to confirm you want to delete the application from your Azure AD tenant.

    :::image type="content" source="media/delete-application-portal/delete-application.png" alt-text="Delete an enterprise application.":::

:::zone-end

:::zone pivot="aad-powershell"

> [!IMPORTANT]
> Make sure you're using the AzureAD module. This is important if you've installed both the [AzureAD](/powershell/module/azuread/?preserve-view=true&view=azureadps-2.0) module and the AzureADPreview module.
1. Run the following commands:

    ```powershell
    Remove-Module AzureADPreview
    Import-Module AzureAD
    ```

1. Connect to Azure AD PowerShell:

   ```powershell
   Connect-AzureAD
   ```
1. Get the list of enterprise applications in your tenant.
   
   ```powershell
   Get-AzureADServicePrincipal
   ```
1. Record the object ID of the enterprise app you want to delete.
1. Delete the enterprise application.
   
   ```powershell
   Remove-AzureADServicePrincipal -ObjectId 'd4142c52-179b-4d31-b5b9-08940873507b'
   ```
:::zone-end

:::zone pivot="ms-powershell"

1. Connect to Microsoft Graph PowerShell:

   ```powershell
   Connect-MgGraph -Scopes 'Application.Read.All'
   ```

1. Get the list of enterprise applications in your tenant.
   
   ```powershell
   Get-MgServicePrincipal
   ```

1. Record the object ID of the enterprise app you want to delete.

1. Delete the enterprise application.
   
   ```powershell
   Remove-MgServicePrincipal -ServicePrincipalId 'd4142c52-179b-4d31-b5b9-08940873507b'
   ```

:::zone-end

:::zone pivot="ms-graph"

Delete an enterprise application using [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer).
1. To get the list of service principals in your tenant, run the following query.

   # [HTTP](#tab/http)
   ```http
   GET https://graph.microsoft.com/v1.0/servicePrincipals
   ```

   # [C#](#tab/csharp)
   [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/csharp/list-serviceprincipal-csharp-snippets.md)]

   # [JavaScript](#tab/javascript)
   [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/javascript/list-serviceprincipal-javascript-snippets.md)]

   # [Java](#tab/java)
   [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/java/list-serviceprincipal-java-snippets.md)]

   # [Go](#tab/go)
   [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/go/list-serviceprincipal-go-snippets.md)]

   # [PowerShell](#tab/powershell)
   [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/powershell/list-serviceprincipal-powershell-snippets.md)]

   # [PHP](#tab/php)
   [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/php/list-serviceprincipal-php-snippets.md)]

   ---

1. Record the ID of the enterprise app you want to delete.
1. Delete the enterprise application.
   
   # [HTTP](#tab/http)
   ```http
   DELETE https://graph.microsoft.com/v1.0/servicePrincipals/{servicePrincipal-id}
   ```

   # [C#](#tab/csharp)
   [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/csharp/delete-serviceprincipal-csharp-snippets.md)]

   # [JavaScript](#tab/javascript)
   [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/javascript/delete-serviceprincipal-javascript-snippets.md)]

   # [Java](#tab/java)
   [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/java/delete-serviceprincipal-java-snippets.md)]

   # [Go](#tab/go)
   [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/go/delete-serviceprincipal-go-snippets.md)]

   # [PowerShell](#tab/powershell)
   [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/powershell/delete-serviceprincipal-powershell-snippets.md)]

   # [PHP](#tab/php)
   [!INCLUDE [sample-code](~/microsoft-graph/api-reference/v1.0/includes/snippets/php/delete-serviceprincipal-php-snippets.md)]

   ---

:::zone-end

## Next steps

- [Restore a deleted enterprise application](restore-application.md)
