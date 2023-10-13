---
title: Create authorization with Microsoft Graph API - Azure API Management | Microsoft Docs
description: Learn how to create and use an authorization to the Microsoft Graph API in Azure API Management. An authorization manages authorization tokens to an OAuth 2.0 backend service. 
services: api-management
author: dlepow
ms.service: api-management
ms.topic: how-to
ms.date: 04/10/2023
ms.author: danlep
---

# Create an authorization with the Microsoft Graph API

This article guides you through the steps required to create an [authorization](authorizations-overview.md) with the Microsoft Graph API within Azure API Management. The authorization code grant type is used in this example.

You learn how to:

> [!div class="checklist"]
> * Create a Microsoft Entra application
> * Create and configure an authorization in API Management
> * Configure an access policy
> * Create a Microsoft Graph API in API Management and configure a policy
> * Test your Microsoft Graph API in API Management

## Prerequisites

- Access to a Microsoft Entra tenant where you have permissions to create an app registration and to grant admin consent for the app's permissions. [Learn more](../active-directory/roles/delegate-app-roles.md#restrict-who-can-create-applications)

    If you want to create your own developer tenant, you can sign up for the [Microsoft 365 Developer Program](https://developer.microsoft.com/microsoft-365/dev-program).
- A running API Management instance. If you need to, [create an Azure API Management instance](get-started-create-service-instance.md).
- Enable a [system-assigned managed identity](api-management-howto-use-managed-service-identity.md) for API Management in the API Management instance. 

<a name='step-1-create-an-azure-ad-application'></a>

## Step 1: Create a Microsoft Entra application

Create a Microsoft Entra application for the API and give it the appropriate permissions for the requests that you want to call.

1. Sign in to the [Azure portal](https://portal.azure.com) with an account with sufficient permissions in the tenant.
1. Under **Azure Services**, search for **Microsoft Entra ID**.
1. On the left menu, select **App registrations**, and then select **+ New registration**. 
    :::image type="content" source="media/authorizations-how-to-azure-ad/create-registration.png" alt-text="Screenshot of creating a Microsoft Entra app registration in the portal.":::
    
1. On the **Register an application** page, enter your application registration settings:
    1. In **Name**, enter a meaningful name that will be displayed to users of the app, such as *MicrosoftGraphAuth*.
    1. In **Supported account types**, select an option that suits your scenario, for example, **Accounts in this organizational directory only (Single tenant)**.
    1. Set the **Redirect URI** to **Web**,  and enter `https://authorization-manager.consent.azure-apim.net/redirect/apim/<YOUR-APIM-SERVICENAME>`, substituting the name of the API Management service where you will configure the authorization provider.
    1. Select **Register**.
1. On the left menu, select **API permissions**, and then select **+ Add a permission**.
    :::image type="content" source="./media/authorizations-how-to-azure-ad/add-permission.png" alt-text="Screenshot of adding an API permission in the portal.":::

    1. Select **Microsoft Graph**, and then select **Delegated permissions**.
        > [!NOTE]
        > Make sure the permission **User.Read** with the type **Delegated** has already been added.
    1. Type **Team**, expand the **Team** options, and then select **Team.ReadBasic.All**. Select **Add permissions**.
    1. Next, select **Grant admin consent for Default Directory**. The status of the permissions will change to **Granted for Default Directory**.
1. On the left menu, select **Overview**. On the **Overview** page, find the **Application (client) ID** value and record it for use in Step 2.
1. On the left menu, select **Certificates & secrets**, and then select **+ New client secret**.    
    :::image type="content" source="media/authorizations-how-to-azure-ad/create-secret.png" alt-text="Screenshot of creating an app secret in the portal.":::
    
    1. Enter a **Description**.
    1. Select any option for **Expires**.
    1. Select **Add**.
    1. Copy the client secret's **Value** before leaving the page. You will need it in Step 2.

## Step 2: Configure an authorization in API Management

1. Sign into the [portal](https://portal.azure.com) and go to your API Management instance.
1. On the left menu, select **Authorizations**, and then select **+ Create**.    
    :::image type="content" source="media/authorizations-how-to-azure-ad/create-authorization.png" alt-text="Screenshot of creating an API authorization in the portal.":::    
1. On the **Create authorization** page, enter the following settings, and select **Create**:
    
    |Settings  |Value  |
    |---------|---------|
    |**Provider name**     |  A name of your choice, such as *Microsoft Entra ID-01*       |
    |**Identity provider**     |   Select **Azure Active Directory v1**      |
    |**Grant type**     | Select **Authorization code**        |
    |**Client id**     |   Paste the value you copied earlier from the app registration      |
    |**Client secret**     |    Paste the value you copied earlier from the app registration      |
    |**Resource URL** | `https://graph.microsoft.com` |
    |**Tenant ID** | Optional for Microsoft Entra identity provider. Default is *Common* |
    |**Scopes**     |    Optional for Microsoft Entra identity provider. Automatically configured from AD app's API permissions.      |
    |**Authorization name**    | A name of your choice, such as *Microsoft Entra auth-01*        |
  
1. After the authorization provider and authorization are created, select **Next**.

<a name='step-3-authorize-with-azure-ad-and-configure-an-access-policy'></a>

## Step 3: Authorize with Microsoft Entra ID and configure an access policy

1. On the **Login** tab, select **Login with Microsoft Entra ID**. Before the authorization will work, it needs to be authorized.
    :::image type="content" source="media/authorizations-how-to-azure-ad/login-azure-ad.png" alt-text="Screenshot of login with Microsoft Entra ID in the portal.":::

1. When prompted, sign in to your organizational account.
1. On the confirmation page, select **Allow access**.
1. After successful authorization, the browser is redirected to API Management and the window is closed. In API Management, select **Next**.
1. On the **Access policy** page, create an access policy so that API Management has access to use the authorization. Ensure that a managed identity is configured for API Management. [Learn more about managed identities in API Management](api-management-howto-use-managed-service-identity.md#create-a-system-assigned-managed-identity).
1. For this example, select **API Management service `<service name>`**, and then click "+ Add members". You should see your access policy in the Members table below.

    :::image type="content" source="media/authorizations-how-to-azure-ad/create-access-policy.png" alt-text="Screenshot of selecting a managed identity to use the authorization."::: 
 
1. Select **Complete**.

> [!NOTE]
> If you update your Microsoft Graph permissions after this step, you will have to repeat Steps 2 and 3.

## Step 4: Create a Microsoft Graph API in API Management and configure a policy

1. Sign into the [portal](https://portal.azure.com) and go to your API Management instance.
1. On the left menu, select **APIs > + Add API**.
1. Select **HTTP** and enter the following settings. Then select **Create**.

    |Setting  |Value  |
    |---------|---------|
    |**Display name**     | *msgraph*        |
    |**Web service URL**     |  `https://graph.microsoft.com/v1.0`       |
    |**API URL suffix**     |  *msgraph*       |

1. Navigate to the newly created API and select **Add Operation**. Enter the following settings and select **Save**.

    |Setting  |Value  |
    |---------|---------|
    |**Display name**     | *getprofile*        |
    |**URL** for GET    |  /me |

1. Follow the preceding steps to add another operation with the following settings.

    |Setting  |Value  |
    |---------|---------|
    |**Display name**     | *getJoinedTeams*        |
    |**URL** for GET    |  /me/joinedTeams |

1. Select **All operations**. In the **Inbound processing** section, select the (**</>**) (code editor) icon.
1. Copy the following, and paste in the policy editor. Make sure the `provider-id` and `authorization-id` correspond to the values you configured in Step 2. Select **Save**. 

    ```xml
    <policies>
        <inbound>
            <base />
            <get-authorization-context provider-id="aad-01" authorization-id="aad-auth-01" context-variable-name="auth-context" identity-type="managed" ignore-error="false" />
           <set-header name="authorization" exists-action="override">
               <value>@("Bearer " + ((Authorization)context.Variables.GetValueOrDefault("auth-context"))?.AccessToken)</value>
           </set-header>
        </inbound>
        <backend>
            <base />
        </backend>
        <outbound>
            <base />
        </outbound>
        <on-error>
            <base />
        </on-error>
    </policies>
    ```
The preceding policy definition consists of two parts:

* The [get-authorization-context](get-authorization-context-policy.md) policy fetches an authorization token by referencing the authorization provider and authorization that were created earlier. 
* The [set-header](set-header-policy.md) policy creates an HTTP header with the fetched authorization token.

## Step 5: Test the API 
1. On the **Test** tab, select one operation that you configured.
1. Select **Send**. 
    
    :::image type="content" source="media/authorizations-how-to-azure-ad/graph-api-response.png" alt-text="Screenshot of testing the Graph API in the portal.":::

    A successful response returns user data from the Microsoft Graph.

## Next steps

* Learn more about [access restriction policies](api-management-access-restriction-policies.md)
* Learn more about [scopes and permissions](../active-directory/develop/scopes-oidc.md) in Microsoft Entra ID.
