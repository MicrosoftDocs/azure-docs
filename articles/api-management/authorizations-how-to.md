---
title: Create and use authorization in Azure API Management | Microsoft Docs
description: Learn how to create and use an authorization in Azure API Management. An authorization manages authorization tokens to OAuth 2.0 backend services. The example uses GitHub as an identity provider.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: how-to
ms.date: 06/03/2022
ms.author: danlep
---

# Configure and use an authorization

In this article, you learn how to create an [authorization](authorizations-overview.md) (preview) in API Management and call a GitHub API that requires an authorization token. The authorization code grant type will be used.  

Four steps are needed to set up an authorization with the authorization code grant type:
  
1. Register an application in the identity provider (in this case, GitHub).
1. Configure an authorization in API Management.
1. Authorize with GitHub and configure access policies.
1. Create an API in API Management and configure a policy.

## Prerequisites

- A GitHub account is required.
- Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
- Enable a [managed identity](api-management-howto-use-managed-service-identity.md) for API Management in the API Management instance. 

## Step 1: Register an application in GitHub

1. Sign in to GitHub. 
1. In your account profile, go to **Settings > Developer Settings > OAuth Apps > Register a new application**. 

    
    :::image type="content" source="media/authorizations-how-to/register-application.png" alt-text="Screenshot of registering a new OAuth application in GitHub.":::
    1. Enter an **Application name** and **Homepage URL** for the application. 
    1. Optionally, add an **Application description**.
    1. In **Authorization callback URL** (the redirect URL), enter `https://authorization-manager.consent.azure-apim.net/redirect/apim/<YOUR-APIM-SERVICENAME>`, substituting the API Management service name that is used.  
1. Select **Register application**.
1. In the **General** page, copy the **Client ID**, which you'll use in a later step.
1. Select **Generate a new client secret**. Copy the secret, which won't be displayed again, and which you'll use in a later step. 

    :::image type="content" source="media/authorizations-how-to/generate-secret.png" alt-text="Screenshot showing how to get client ID and client secret for the application in GitHub.":::

## Step 2: Configure an authorization in API Management

1. Sign into Azure portal and go to your API Management instance.
1. In the left menu, select **Authorizations** > **+ Create**.
    
    :::image type="content" source="media/authorizations-how-to/create-authorization.png" alt-text="Screenshot of creating an API Management authorization in the Azure portal.":::    
1. In the **Create authorization** window, enter the following settings, and select **Create**:
    
    |Settings  |Value  |
    |---------|---------|
    |**Provider name**     |  A name of your choice, such as *github-01*       |
    |**Identity provider**     |   Select **GitHub**      |
    |**Grant type**     | Select **Authorization code**        |
    |**Client id**     |   Paste the value you copied earlier from the app registration      |
    |**Client secret**     |    Paste the value you copied earlier from the app registration      |
    |**Scope**     |    Set the scope to `User`      |
    |**Authorization name**    | A name of your choice, such as *auth-01*        |

    

1. After the authorization provider and authorization are created, select **Next**.

1. On the **Login** tab, select **Login with GitHub**. Before the authorization will work, it needs to be authorized at GitHub.

    :::image type="content" source="media/authorizations-how-to/authorize-with-github.png" alt-text="Screenshot of logging into the GitHub authorization from the portal.":::  

## Step 3: Authorize with GitHub and configure access policies

1. Sign in to your GitHub account if you're prompted to do so.
1. Select **Authorize** so that the application can access the signed-in user’s account. 
    
     :::image type="content" source="media/authorizations-how-to/consent-to-authorization.png" alt-text="Screenshot of consenting to authorize with GitHub."::: 

    After authorization, the browser is redirected to API Management and the window is closed. If prompted during redirection, select **Allow access**. In API Management, select **Next**.
1. On the **Access policy** page, create an access policy so that API Management has access to use the authorization. Ensure that a managed identity is configured for API Management. [Learn more about managed identities in API Management](api-management-howto-use-managed-service-identity.md#create-a-system-assigned-managed-identity).

1. Select **Managed identity** **+ Add members** and then select your subscription. 
1. In **Managed identity**, select **API Management service**, and then select the API Management instance that is used. Click **Select** and then **Complete**.
 
     :::image type="content" source="media/authorizations-how-to/select-managed-identity.png" alt-text="Screenshot of selecting a managed identity to use the authorization."::: 
     
## Step 4: Create an API in API Management and configure a policy

1. Sign into Azure portal and go to your API Management instance.
1. In the left menu, select **APIs > + Add API**.
1. Select **HTTP** and enter the following settings. Then select **Create**.

    |Setting  |Value  |
    |---------|---------|
    |**Display name**     | *github*        |
    |**Web service URL**     |  https://api.github.com/users       |
    |**API URL suffix**     |  *github*       |

2. Navigate to the newly created API and select **Add Operation**. Enter the following settings and select **Save**.

    |Setting  |Value  |
    |---------|---------|
    |**Display name**     | *getdata*        |
    |**URL**     |  /data |

    :::image type="content" source="media/authorizations-how-to/add-operation.png" alt-text="Screenshot of adding a getdata operation to the API in the portal."::: 

1. In the **Inbound processing** section, select the (**</>**) (code editor) icon.
1. Copy the following, and paste in the policy editor. Make sure the provider-id and authorization-id correspond to the names in step 2.3. Select **Save**. 

    ```xml
    <policies>
        <inbound>
            <base />
            <get-authorization-context provider-id="github-01" authorization-id="auth-01" context-variable-name="auth-context" identity-type="managed" ignore-error="false" />
            <set-header name="Authorization" exists-action="override">
                <value>@("Bearer " + ((Authorization)context.Variables.GetValueOrDefault("auth-context"))?.AccessToken)</value>
            </set-header>
            <rewrite-uri template="@(context.Request.Url.Query.GetValueOrDefault("username",""))" copy-unmatched-params="false" />
            <set-header name="User-Agent" exists-action="override">
                <value>API Management</value>
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

    The policy to be used consists of four parts.

    - Fetch an authorization token.
    - Create an HTTP header with the fetched authorization token.
    - Create an HTTP header with a `User-Agent` header (GitHub requirement). [Learn more](https://docs.github.com/rest/overview/resources-in-the-rest-api#user-agent-required)
    - Because the incoming request to API Management will consist of a query parameter called *username*, add the username to the backend call.

        > [!NOTE]
        > The `get-authorization-context` policy references the authorization provider and authorization that were created earlier. [Learn more](api-management-access-restriction-policies.md#GetAuthorizationContext) about how to configure this policy.

        :::image type="content" source="media/authorizations-how-to/policy-configuration-cropped.png" lightbox="media/authorizations-how-to/policy-configuration.png" alt-text="Screenshot of configuring policy in the portal.":::
1. Test the API. 
    1. On the **Test** tab, enter a query parameter with the name *username*.
    1. As value, enter the username that was used to sign into GitHub, or another valid GitHub username. 
    1. Select **Send**. 
    :::image type="content" source="media/authorizations-how-to/test-api.png" alt-text="Screenshot of testing the API successfully in the portal.":::

    A successful response returns user data from the GitHub API.

## Next steps

Learn more about [access restriction policies](api-management-access-restriction-policies.md).
