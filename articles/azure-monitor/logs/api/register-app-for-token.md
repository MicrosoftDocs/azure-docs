---
title: Register an App to request authorization tokens and work with APIs
description: How to register an app and assign a role so it can access request a token and work with APIs
author: EdB-MSFT
ms.author: edbaynash
ms.date: 01/04/2023
ms.topic: article
---

# Register an App to request authorization tokens and work with APIs

To access Azure REST APIs such as the Log analytics API, or to send custom metrics, you can generate an authorization token based on a client ID and secret. The token is then passed in your REST API request. This article shows you how to register a client app and create a client secret so that you can generate a token.

## Register an App

1. To register an app, open the Active Directory Overview page in the Azure portal.

1. Select **App registrations** from the side bar.
:::image type="content" source="../media/api-register-app/active-directory-overview-page.png" alt-text="A screenshot showing the Azure Active Directory overview page.":::  

1. Select **New registration**
1. On the Register an application page, enter a **Name** for the application. 
1. Select **Register**

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


## Next steps

Before you can generate a token using your app, client ID, and secret, assign the app to a role using Access control (IAM) for resource that you want to access.
The role will depend on the resource type and the API that you want to use.  
For example,
- To grant your app read from a Log Analytics Workspace, add your app as a member to the **Reader** role using Access control (IAM) for your Log Analytics Workspace. For more information, see [Access the API](./access-api.md)

- To grant access to send custom metrics for a resource,  add your app as a member to the **Monitoring Metrics Publisher** role using Access control (IAM) for your resource. For more information, see [ Send metrics to the Azure Monitor metric database using REST API](../../essentials/metrics-store-custom-rest-api.md)

For more information see [Assign Azure roles using the Azure portal](https://learn.microsoft.com/azure/role-based-access-control/role-assignments-portal)  

Once you have assigned a role you can use your app, client ID, and client secret to generate a bearer token to access the REST API.

> [!NOTE]
> When using Azure AD authentication, it may take up to 60 minutes for the Azure Application Insights REST API to recognize new role-based access control (RBAC) permissions. While permissions are propagating, REST API calls may fail with error code 403.