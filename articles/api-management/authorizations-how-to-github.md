---
title: Create authorization with GitHub API - Azure API Management | Microsoft Docs
description: Learn how to create and use an authorization to the GitHub API in Azure API Management. An authorization manages authorization tokens to an OAuth 2.0 backend service. 
services: api-management
author: dlepow
ms.service: api-management
ms.topic: how-to
ms.date: 04/10/2023
ms.author: danlep
---

# Create an authorization with the GitHub API

In this article, you learn how to create an [authorization](authorizations-overview.md) in API Management and call a GitHub API that requires an authorization token. The authorization code grant type is used in this example.

You learn how to:

> [!div class="checklist"]
> * Register an application in GitHub
> * Configure an authorization in API Management.
> * Authorize with GitHub and configure access policies.
> * Create an API in API Management and configure a policy.
> * Test your GitHub API in API Management

## Prerequisites

- A GitHub account is required.
 A running API Management instance. If you need to, [create an Azure API Management instance](get-started-create-service-instance.md).
- Enable a [system-assigned managed identity](api-management-howto-use-managed-service-identity.md) for API Management in the API Management instance. 

## Step 1: Register an application in GitHub

1. Sign in to GitHub. 
1. In your account profile, go to **Settings > Developer Settings > OAuth Apps > New OAuth app**. 

    
    :::image type="content" source="media/authorizations-how-to-github/register-application.png" alt-text="Screenshot of registering a new OAuth application in GitHub.":::
    1. Enter an **Application name** and **Homepage URL** for the application. For this example, you can supply a placeholder URL such as `http://localhost`.
    1. Optionally, add an **Application description**.
    1. In **Authorization callback URL** (the redirect URL), enter `https://authorization-manager.consent.azure-apim.net/redirect/apim/<YOUR-APIM-SERVICENAME>`, substituting the name of the API Management instance where you will configure the authorization provider.  
1. Select **Register application**.
1. On the **General** page, copy the **Client ID**, which you'll use in Step 2.
1. Select **Generate a new client secret**. Copy the secret, which won't be displayed again, and which you'll use in Step 2. 

    :::image type="content" source="media/authorizations-how-to-github/generate-secret.png" alt-text="Screenshot showing how to get client ID and client secret for the application in GitHub.":::

## Step 2: Configure an authorization in API Management

1. Sign into the [portal](https://portal.azure.com) and go to your API Management instance.
1. On the left menu, select **Authorizations** > **+ Create**.
    
    :::image type="content" source="media/authorizations-how-to-azure-ad/create-authorization.png" alt-text="Screenshot of creating an API Management authorization in the Azure portal.":::    
1. On the **Create authorization** page, enter the following settings, and select **Create**:
    
    |Settings  |Value  |
    |---------|---------|
    |**Provider name**     |  A name of your choice, such as *github-01*       |
    |**Identity provider**     |   Select **GitHub**      |
    |**Grant type**     | Select **Authorization code**        |
    |**Client ID**     |   Paste the value you copied earlier from the app registration      |
    |**Client secret**     |    Paste the value you copied earlier from the app registration      |
    |**Scope**     |    For this example, set the scope to *User*      |
    |**Authorization name**    | A name of your choice, such as *github-auth-01*        |

1. After the authorization provider and authorization are created, select **Next**.

## Step 3: Authorize with GitHub and configure access policies

1. On the **Login** tab, select **Login with GitHub**. Before the authorization will work, it needs to be authorized at GitHub.

    :::image type="content" source="media/authorizations-how-to-github/authorize-with-github.png" alt-text="Screenshot of logging into the GitHub authorization from the portal.":::  

1. If prompted, sign in to your GitHub account.
1. Select **Authorize** so that the application can access the signed-in user’s account. 
1. On the confirmation page, select **Allow access**.
1. After successful authorization, the browser is redirected to API Management and the window is closed. In API Management, select **Next**.
1. After successful authorization, the browser is redirected to API Management and the window is closed. When prompted during redirection, select **Allow access**. In API Management, select **Next**.
1. On the **Access policy** page, create an access policy so that API Management has access to use the authorization. Ensure that a managed identity is configured for API Management. [Learn more about managed identities in API Management](api-management-howto-use-managed-service-identity.md#create-a-system-assigned-managed-identity).

1. For this example, select **API Management service `<service name>`**, and then click "+ Add members". You should see your access policy in the Members table below.

    :::image type="content" source="media/authorizations-how-to-azure-ad/create-access-policy.png" alt-text="Screenshot of selecting a managed identity to use the authorization."::: 
1. Select **Complete**.

     
## Step 4: Create an API in API Management and configure a policy

1. Sign into the [portal](https://portal.azure.com) and go to your API Management instance.
1. On the left menu, select **APIs > + Add API**.
1. Select **HTTP** and enter the following settings. Then select **Create**.

    |Setting  |Value  |
    |---------|---------|
    |**Display name**     | *githubuser*        |
    |**Web service URL**     |  `https://api.github.com`       |
    |**API URL suffix**     |  *githubuser*       |

2. Navigate to the newly created API and select **Add Operation**. Enter the following settings and select **Save**.

    |Setting  |Value  |
    |---------|---------|
    |**Display name**     | *getauthdata*        |
    |**URL** for GET    |  /user |

    :::image type="content" source="media/authorizations-how-to-github/add-operation.png" alt-text="Screenshot of adding a getauthdata operation to the API in the portal."::: 

1. Follow the preceding steps to add another operation with the following settings.

    |Setting  |Value  |
    |---------|---------|
    |**Display name**     | *getauthfollowers*        |
    |**URL** for GET     |  /user/followers |

1. Select **All operations**. In the **Inbound processing** section, select the (**</>**) (code editor) icon.
1. Copy the following, and paste in the policy editor. Make sure the provider-id and authorization-id correspond to the names in Step 2. Select **Save**. 

    ```xml
    <policies>
        <inbound>
            <base />
            <get-authorization-context provider-id="github-01" authorization-id="github-auth-01" context-variable-name="auth-context" identity-type="managed" ignore-error="false" />
            <set-header name="Authorization" exists-action="override">
                <value>@("Bearer " + ((Authorization)context.Variables.GetValueOrDefault("auth-context"))?.AccessToken)</value>
            </set-header>
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

The preceding policy definition consists of three parts:
   
* The [get-authorization-context](get-authorization-context-policy.md) policy fetches an authorization token by referencing the authorization provider and authorization that were created earlier. 
* The first [set-header](set-header-policy.md) policy creates an HTTP header with the fetched authorization token.
* The second [set-header](set-header-policy.md) policy creates a `User-Agent` header (GitHub API requirement).

## Step 5: Test the API

1. On the **Test** tab, select one operation that you configured.
1. Select **Send**. 
    
    :::image type="content" source="media/authorizations-how-to-github/test-api.png" alt-text="Screenshot of testing the API successfully in the portal.":::

    A successful response returns user data from the GitHub API.

## Next steps

* Learn more about [access restriction policies](api-management-access-restriction-policies.md).
* Learn more about GitHub's [REST API](https://docs.github.com/en/rest?apiVersion=2022-11-28)
