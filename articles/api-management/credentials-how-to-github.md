---
title: Create Connection to GitHub API - Azure API Management | Microsoft Docs
description: Learn how to create and use a managed connection to a backend GitHub API using the Azure API Management credential manager.  
services: api-management
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 12/08/2025
ms.author: danlep
ms.custom: sfi-image-nochange
---

# Configure credential manager - GitHub API

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

In this article, you learn how to create a managed [connection](credentials-overview.md) in API Management and call a GitHub API that requires an OAuth 2.0 token. This example uses the authorization code grant type.

You learn how to:

> [!div class="checklist"]
> * Register an application in GitHub
> * Configure a credential provider in API Management
> * Configure a connection
> * Create an API in API Management and configure a policy
> * Test your GitHub API in API Management

## Prerequisites

* A GitHub account.
* A running API Management instance. If you need one, [create an Azure API Management instance](get-started-create-service-instance.md).
* Enable a [system-assigned managed identity](api-management-howto-use-managed-service-identity.md) for API Management in the API Management instance.

## Step 1: Register an application in GitHub

Create a GitHub OAuth app for the API and give it the appropriate permissions for the requests that you want to call.

1. Sign in to GitHub.
1. In your account profile, go to **Settings > Developer Settings > OAuth Apps.** Select **New OAuth app**. 

    :::image type="content" source="media/credentials-how-to-github/register-application.png" alt-text="Screenshot of registering a new OAuth application in GitHub.":::
    1. Enter an **Application name** and **Homepage URL** for the application. For this example, you can supply a placeholder URL such as `http://localhost`.
    1. Optionally, add an **Application description**.
    1. In **Authorization callback URL** (the redirect URL), enter `https://authorization-manager.consent.azure-apim.net/redirect/apim/<YOUR-APIM-SERVICENAME>`, substituting the name of the API Management instance where you configure the credential provider.  
    1. Optionally select **Enable device flow** (not required for this example).
1. Select **Register application**.
1. On the **General** page, copy the **Client ID**, which you use in Step 2.
1. Select **Generate a new client secret**. Copy the secret, which isn't displayed again. You configure the secret in Step 2. 

    :::image type="content" source="media/credentials-how-to-github/generate-secret.png" alt-text="Screenshot showing how to get client ID and client secret for the application in GitHub.":::

## Step 2: Configure a credential provider in API Management

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your API Management instance.
1. On the left menu, select **APIs** > **Credential manager** > **+ Create**.

    :::image type="content" source="media/credentials-how-to-azure-ad/create-credential.png" alt-text="Screenshot of creating an API Management credential in the Azure portal.":::   
1. On **Create credential provider**, enter the following settings:

    |Settings  |Value  |
    |---------|---------|
    |**Credential provider name**     |  A name of your choice, such as *github-01*       |
    |**Identity provider**     |   Select **GitHub**      |
    |**Grant type**     | Select **Authorization code**        |
    |**Client ID**     |   Paste the value you copied earlier from the app registration      |
    |**Client secret**     |    Paste the value you copied earlier from the app registration      |
    |**Scope**     |    For this example, set the scope to *User*      |

1. Select **Create**.
1. When prompted, review the OAuth redirect URL that's displayed, and select **Yes** to confirm that it matches the URL you entered in the GitHub app registration.
  
## Step 3: Configure a connection

On the **Connection** tab, complete the steps for your connection to the provider.

> [!NOTE]
> When you configure a connection, API Management by default sets up an [access policy](credentials-process-flow.md#access-policy) that enables access by the instance's systems-assigned managed identity. This access is sufficient for this example. You can add additional access policies as needed.

[!INCLUDE [api-management-credential-create-connection](../../includes/api-management-credential-create-connection.md)]

> [!TIP]
> Use the Azure portal to add, update, or delete connections to a credential provider at any time. For more information, see [Configure multiple connections](configure-credential-connection.md).

## Step 4: Create an API in API Management and configure a policy

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your API Management instance.
1. On the left menu, select **APIs** > **APIs** > **+ Add API**.
1. Select **HTTP** and enter the following settings, then select **Create**.

    |Setting  |Value  |
    |---------|---------|
    |**Display name**     | *githubuser*        |
    |**Web service URL**     |  `https://api.github.com`       |
    |**API URL suffix**     |  *githubuser*       |

1. Go to the new API and select **Add Operation**. Enter the following settings and select **Save**.

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
1. Copy and paste the following code in the policy editor. Make sure the `provider-id` and `authorization-id` values in the `get-authorization-context` policy correspond to the names of the credential provider and connection, respectively, that you configured in the preceding steps. Select **Save**.

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

* Learn more about [authentication and authorization policies](api-management-policies.md#authentication-and-authorization)
* Learn more about GitHub's [REST API](https://docs.github.com/en/rest?apiVersion=2022-11-28)
