---
title: Create credential to GitHub API - Azure API Management | Microsoft Docs
description: Learn how to create and use a managed connection to a backend GitHub API using the Azure API Management credential manager.  
services: api-management
author: dlepow
ms.service: api-management
ms.topic: how-to
ms.date: 11/14/2023
ms.author: danlep
---

# Configure credential manager - GitHub API

In this article, you learn how to create a managed [connection](credentials-overview.md) in API Management and call a GitHub API that requires an OAuth 2.0 token. The authorization code grant type is used in this example.

You learn how to:

> [!div class="checklist"]
> * Register an application in GitHub
> * Configure a credential provider in API Management.
> * Configure a connection
> * Create an API in API Management and configure a policy.
> * Test your GitHub API in API Management

## Prerequisites

- A GitHub account is required.
- A running API Management instance. If you need to, [create an Azure API Management instance](get-started-create-service-instance.md).
- Enable a [system-assigned managed identity](api-management-howto-use-managed-service-identity.md) for API Management in the API Management instance. 

## Step 1: Register an application in GitHub

1. Sign in to GitHub. 
1. In your account profile, go to **Settings > Developer Settings > OAuth Apps.** Select **New OAuth app**. 

    :::image type="content" source="media/credentials-how-to-github/register-application.png" alt-text="Screenshot of registering a new OAuth application in GitHub.":::
    1. Enter an **Application name** and **Homepage URL** for the application. For this example, you can supply a placeholder URL such as `http://localhost`.
    1. Optionally, add an **Application description**.
    1. In **Authorization callback URL** (the redirect URL), enter `https://authorization-manager.consent.azure-apim.net/redirect/apim/<YOUR-APIM-SERVICENAME>`, substituting the name of the API Management instance where you will configure the credential provider.  
1. Select **Register application**.
1. On the **General** page, copy the **Client ID**, which you'll use in Step 2.
1. Select **Generate a new client secret**. Copy the secret, which won't be displayed again, and which you'll use in Step 2. 

    :::image type="content" source="media/credentials-how-to-github/generate-secret.png" alt-text="Screenshot showing how to get client ID and client secret for the application in GitHub.":::

## Step 2: Configure a credential provider in API Management

1. Sign into the [portal](https://portal.azure.com) and go to your API Management instance.
1. On the left menu, select **Credential manager** > **+ Create**.
    
    :::image type="content" source="media/credentials-how-to-azure-ad/create-credential.png" alt-text="Screenshot of creating an API Management credential in the Azure portal.":::    
1. On the **Create credential provider** page, enter the following settings:
    
    |Settings  |Value  |
    |---------|---------|
    |**Credential provider name**     |  A name of your choice, such as *github-01*       |
    |**Identity provider**     |   Select **GitHub**      |
    |**Grant type**     | Select **Authorization code**        |
    |**Client ID**     |   Paste the value you copied earlier from the app registration      |
    |**Client secret**     |    Paste the value you copied earlier from the app registration      |
    |**Scope**     |    For this example, set the scope to *User*      |

1. Select **Create**.
1. When prompted, review the OAuth redirect URL that's displayed, and select **Yes** to confirm that it matches the URL you entered in the app registration.
  
## Step 3: Configure a connection

On the **Connection** tab, complete the steps for your connection to the provider. 

> [!NOTE]
> When you configure a connection, API Management by default sets up an [access policy](credentials-process-flow.md#access-policy) that enables access by the instance's systems-assigned managed identity. This access is sufficient for this example. You can add additional access policies as needed. 

[!INCLUDE [api-management-credential-create-connection](../../includes/api-management-credential-create-connection.md)]

> [!TIP]
> Use the portal to add, update, or delete connections to a credential provider at any time. For more information, see [Configure multiple connections](configure-credential-connection.md). 

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

    :::image type="content" source="media/credentials-how-to-github/add-operation.png" alt-text="Screenshot of adding a getauthdata operation to the API in the portal."::: 

1. Follow the preceding steps to add another operation with the following settings.

    |Setting  |Value  |
    |---------|---------|
    |**Display name**     | *getauthfollowers*        |
    |**URL** for GET     |  /user/followers |

1. Select **All operations**. In the **Inbound processing** section, select the (**</>**) (code editor) icon.
1. Copy the following, and paste in the policy editor. Make sure the `provider-id` and `authorization-id` values in the `get-authorization-context` policy correspond to the names of the credential provider and connection, respectively, that you configured in the preceding steps. Select **Save**. 

    ```xml
    <policies>
        <inbound>
            <base />
            <get-authorization-context provider-id="github-01" authorization-id="first-connection" context-variable-name="auth-context" identity-type="managed" ignore-error="false" />
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
   
* The [get-authorization-context](get-authorization-context-policy.md) policy fetches an authorization token by referencing the credential provider and connection that you created earlier. 
* The first [set-header](set-header-policy.md) policy creates an HTTP header with the fetched authorization token.
* The second [set-header](set-header-policy.md) policy creates a `User-Agent` header (GitHub API requirement).

## Step 5: Test the API

1. On the **Test** tab, select one operation that you configured.
1. Select **Send**. 
    
    :::image type="content" source="media/credentials-how-to-github/test-api.png" alt-text="Screenshot of testing the API successfully in the portal.":::

    A successful response returns user data from the GitHub API.

## Related content

* Learn more about [access restriction policies](api-management-access-restriction-policies.md).
* Learn more about GitHub's [REST API](https://docs.github.com/en/rest?apiVersion=2022-11-28)
