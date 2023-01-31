---
title: Create and use authorization with Microsoft Graph API - Azure API Management | Microsoft Docs
description: Learn how to create and use an authorization to Azure AD in Azure API Management. An authorization manages authorization tokens to OAuth 2.0 backend services. 
services: api-management
author: dlepow
ms.service: api-management
ms.topic: how-to
ms.date: 01/30/2023
ms.author: danlep
---

# Create an authorization with the Microsoft Graph API

This article guides you through the steps required to create an Authorization with the Microsoft Graph API within Azure API Management.
You learn how to:

> [!div class="checklist"]
> * Create an Azure AD application
> * Create and configure an authorization in API Management
> * Configure an access policy
> * Create a Microsoft Graph API in API Management and configure a policy
> * Test your Microsoft Graph API in API Management

## Prerequisites
 <!-- questions: 1. What AD permissions are needed? 2. What APIM tiers are supported? 3. Limitation to AD v1 endpoint 4. State example is only for auth code grant type?-->

- Access to an Azure Active Directory (Azure AD) tenant where you create an Azure AD application. To create your own developer tenant, you can sign up for the [Microsoft 365 Developer Program](https://developer.microsoft.com/microsoft-365/dev-program).
- A running API Management instance. If you need to, [create an Azure API Management instance](get-started-create-service-instance.md).
- Enable a [managed identity](api-management-howto-use-managed-service-identity.md) for API Management in the API Management instance. 

## Step 1: Create an Azure AD application

Create an Azure Active Directory (Azure AD) application and give it the appropriate permissions for the requests that you want to call.

<!-- What is a valid account? -->
1. Sign into the [Azure portal](https://portal.azure.com/) with a tenant administrator account.
1. Under **Azure Services**, search for **Azure Active Directory**.
1. On the left menu, select **App registrations**, and then select **+ New registration**. 
    :::image type="content" source="media/authorizations-how-to-azure-ad/create-registration.png" alt-text="Screenshot of creating an Azure AD app registration in the portal.":::
    
1. On the **Register an application** page, enter your application registration settings:
    * In **Name**, enter a meaningful name that will be displayed to users of the app, such as *MicrosoftGraphAuth*.
    * In **Supported account types**, select **Accounts in this organizational directory only (Single tenant)**.
    * Set the **Redirect URI** to **Web**,  and enter `https://authorization-manager.consent.azure-apim.net/redirect/apim/<YOUR-APIM-SERVICENAME>`, substituting the API Management service name that will use the authorization provider.
    * Select **Register**.
1. On the left menu, select **API permissions**, and then select **+ Add a permission**.
    :::image type="content" source="./media/authorizations-how-to-azure-ad/add-permission.png" alt-text="Screenshot of adding an API permission in the portal.":::

    * Select **Microsoft Graph**, and then select **Delegated permissions**.
        > [!NOTE]
        > Make sure the permission **User.Read** with the type **Delegated** has already been added.
    * Type **Team**, expand the **Team** options, and then select **Team.ReadBasic.All**. Select **Add permissions**.
    * Next, select **Grant admin consent for Default Directory**. The status of the permissions will change to **Granted for Default Directory**.
1. On the left menu, select **Overview**. On the **Overview** page, find the **Application (client) ID** value and record it for use in Step 2.
1. On the left menu, select **Certificates & secrets**, and then select **+ New client secret**.    
    :::image type="content" source="media/authorizations-how-to-azure-ad/create-secret.png" alt-text="Screenshot of creating an app secret in the portal.":::
    
    * Enter a **Description**.
    * Select any option for **Expires**.
    * Select **Add**.
    * Copy the client secret's **Value** before leaving the page. You will need it in Step 2.

## Step 2: Configure an authorization in API Management

1. Sign into the [portal](https://portal.azure.com) and go to your API Management instance.
1. In the left menu, select **Authorizations**, and then select **+ Create**.    
    :::image type="content" source="media/authorizations-how-to-azure-ad/create-authorization.png" alt-text="Screenshot of creating an API authorization in the portal.":::    
1. In the **Create authorization** window, enter the following settings, and select **Create**:
    
    |Settings  |Value  |
    |---------|---------|
    |**Provider name**     |  A name of your choice, such as *aad-01*       |
    |**Identity provider**     |   Select **Azure Active Directory**      |
    |**Grant type**     | Select **Authorization code**        |
    |**Client id**     |   Paste the value you copied earlier from the app registration      |
    |**Client secret**     |    Paste the value you copied earlier from the app registration      |
    |**Resource URL** | `https://graph.microsoft.com` |
    |**Tenant ID** | Provide Azure AD tenant ID; default is *Common* |
    |**Scopes**     |    *Optional*      |
    |**Authorization name**    | A name of your choice, such as *aad-auth-01*        |

<!-- I found I needed to provide Tenant ID - is this required for a single-tenant org? "needs permission to access resources in your organization that only an admin can grant. Please ask an admin to grant permission to this app before you can use it.">
<!-- How would you choose scopes? -->    
1. After the authorization provider and authorization are created, select **Next**.
1. On the **Login** tab, select **Login with Azure Active Directory**. Before the authorization will work, it needs to be authorized.
    :::image type="content" source="media/authorizations-how-to-azure-ad/login-azure-ad.png" alt-text="Screenshot of login with Azure AD in the portal.":::

## Step 3: Authorize with Azure AD and configure an access policy

1. Sign in to your organizational account.
1. Select **Allow access**.
1. After successful authorization, the browser is redirected to API Management and the window is closed. In API Management, select **Next**.
1. On the **Access policy** page, create an access policy so that API Management has access to use the authorization. Ensure that a managed identity is configured for API Management. [Learn more about managed identities in API Management](api-management-howto-use-managed-service-identity.md#create-a-system-assigned-managed-identity).
1. Select **Managed identity** > **+ Add members** and then select your subscription. 
1. In **Managed identity**, select **API Management service**, and then select the API Management instance that is used. Click **Select** and then **Complete**.
 
     :::image type="content" source="media/authorizations-how-to-azure-ad/create-access-policy.png" alt-text="Screenshot of selecting a managed identity to use the authorization."::: 
> [!NOTE]
> If you update your Microsoft Graph permissions after this step, you will have to repeat Step 2 and 3.

## Step 4: Create a Microsoft Graph API in API Management and configure a policy

1. Sign into the [portal](https://portal.azure.com) and go to your API Management instance.
1. In the left menu, select **APIs > + Add API**.
1. Select **HTTP** and enter the following settings. Then select **Create**.

    |Setting  |Value  |
    |---------|---------|
    |**Display name**     | *msgraph*        |
    |**Web service URL**     |  https://graph.microsoft.com/v1.0       |
    |**API URL suffix**     |  *msgraph*       |

1. Navigate to the newly created API and select **Add Operation**. Enter the following settings and select **Save**.

    |Setting  |Value  |
    |---------|---------|
    |**Display name**     | *getprofile*        |
    |**URL**     |  /me |

1. Follow the preceding steps to add another operation with the following settings.

    |Setting  |Value  |
    |---------|---------|
    |**Display name**     | *getJoinedTeams*        |
    |**URL**     |  /me/joinedTeams |

1. Select **All operations**. In the **Inbound processing** section, select the (**</>**) (code editor) icon.
1. Copy the following, and paste in the policy editor. Make sure the provider-id and authorization-id correspond to the names in step 2.3. Select **Save**. 

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
<!-- explain the policy>
    The policy to be used consists of two parts.

    - Fetch an authorization token.
    - Create an HTTP header with the fetched authorization token.
    


        > [!NOTE]
        > The `get-authorization-context` policy references the authorization provider and authorization that were created earlier. [Learn more](get-authorization-context-policy.md) about how to configure this policy.

-->
1. Test the API. 
    1. On the **Test** tab, select one operation.
    1. Select **Send**. 
    
    :::image type="content" source="media/authorizations-how-to-azure-ad/graph-api-response.png" alt-text="Screenshot of testing the Graph API in the portal.":::

    A successful response returns user data from the Microsoft Graph.

## Next steps

Learn more about [access restriction policies](api-management-access-restriction-policies.md).
