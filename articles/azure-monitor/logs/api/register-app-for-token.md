---
title: Register an App for API Access
description: How to register an app and assign a role so it can access a log analytics workspace using the API
author: EdB-MSFT
ms.author: edbaynash
ms.date: 11/18/2021
ms.topic: article
---

# Register an App to work with Log Analytics APIs

To access the log analytics API, you can generate a token based on a client ID and secret. This article shows you how to register a client app and assign permissions to access a Log Analytics Workspace.

## Register an App

1. To register an app, open the Active Directory Overview page in the Azure portal.

1. Select **App registrations** from the side bar.
:::image type="content" source="../media/api-register-app/active-directory-overview-page.png" alt-text="A screenshot showing the Azure Active Directory overview page.":::  

1. Select **New registration**
1. On the Register an application page, enter a **Name** for the application. 
1. Select **Register**
1. On the app's overview page, select **API permissions**  
1. Select **Add a permission**
1. In the **APIs my organization uses** tab search for *log analytics* and select **Log Analytics API** from the list.  
:::image type="content" source="../media/api-register-app/request-api-permissions.png" alt-text="A screenshot showing the Request API permissions page.":::

1. Select **Delegated permissions**
1. Check the checkbox for **Data.Read**
1. Select **Add permissions**
:::image type="content" source="../media/api-register-app/add-requested-permissions.png" alt-text="A screenshot showing the continuation of the Request API permissions page.":::  

1. On the app's overview page, select **Certificates and Secrets**
1. Note the **Application (client) ID**. It's used in the HTTP request for a token.
:::image type="content" source="../media/api-register-app/app-registration-overview.png" alt-text="A screenshot showing the App registrations overview page in Azure Active Directory.":::
  
1. In the **Client secrets tab** Select **New client secret**
1. Enter a **Description** and select **Add**
 :::image type="content" source="../media/api-register-app/add-a-client-secret.png" alt-text="A screenshot showing the Add client secret page.":::
  
1. Copy and save the client secret **Value**. 

   > [!NOTE]
   > Client secret values can only be viewed immediately after creation. Be sure to save the secret before leaving the page.  

     :::image type="content" source="../media/api-register-app/client-secret.png" alt-text="A screenshot showing the client secrets page.":::

## Grant your app access to a Log Analytics Workspace

1. From your Log analytics Workspace overview page, select **Access control (IAM)**.
1. Select **Add role assignment**.

    :::image type="content" source="../media/api-register-app/workspace-access-control.png" alt-text="A screenshot showing the access control page for a log analytics workspace.":::

1. Select the **Reader** role then select **Members**
    
    :::image type="content" source="../media/api-register-app/add-role-assignment.png" alt-text="A screenshot showing the add role assignment page for a log analytics workspace.":::

1. In the Members tab, select **Select members**
1. Enter the name of your app in the **Select** field.
1. Choose your app and select **Select**
1. Select **Review and assign**
     
    :::image type="content" source="../media/api-register-app/select-members.png" alt-text="A screenshot showing the select members blade on the role assignment page for a log analytics workspace.":::

## Next steps

You can use your client ID and client secret to generate a bearer token to access the Log Analytics API. For more information, see [Access the API](./access-api.md)

> [!NOTE]
> When using Azure AD authentication, it may take up to 60 minutes for the Azure Application Insights REST API to recognize new role-based access control (RBAC) permissions. While permissions are propagating, REST API calls may fail with error code 403.