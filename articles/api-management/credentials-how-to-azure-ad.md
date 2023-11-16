---
title: Create connection to Microsoft Graph API - Azure API Management | Microsoft Docs
description: Learn how to create and use a managed connection to a backend Microsoft Graph API using the Azure API Management credential manager. 
services: api-management
author: dlepow
ms.service: api-management
ms.topic: how-to
ms.date: 11/14/2023
ms.author: danlep
---

# Configure credential manager - Microsoft Graph API

This article guides you through the steps required to create a managed [connection](credentials-overview.md) to the Microsoft Graph API within Azure API Management. The authorization code grant type is used in this example.

You learn how to:

> [!div class="checklist"]
> * Create a Microsoft Entra application
> * Create and configure a credential provider in API Management
> * Configure a connection
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
1. On the **Register an application** page, enter your application registration settings:
    1. In **Name**, enter a meaningful name that will be displayed to users of the app, such as *MicrosoftGraphAuth*.
    1. In **Supported account types**, select an option that suits your scenario, for example, **Accounts in this organizational directory only (Single tenant)**.
    1. Set the **Redirect URI** to **Web**,  and enter `https://authorization-manager.consent.azure-apim.net/redirect/apim/<YOUR-APIM-SERVICENAME>`, substituting the name of the API Management service where you will configure the credential provider.
    1. Select **Register**.

        :::image type="content" source="media/credentials-how-to-azure-ad/create-registration.png" alt-text="Screenshot of creating a Microsoft Entra app registration in the portal.":::
1. On the left menu, select **API permissions**, and then select **+ Add a permission**.
    :::image type="content" source="./media/credentials-how-to-azure-ad/add-permission.png" alt-text="Screenshot of adding an API permission in the portal.":::

    1. Select **Microsoft Graph**, and then select **Delegated permissions**.
        > [!NOTE]
        > Make sure the permission **User.Read** with the type **Delegated** has already been added.
    1. Type **Team**, expand the **Team** options, and then select **Team.ReadBasic.All**. Select **Add permissions**.
    1. Next, select **Grant admin consent for Default Directory**. The status of the permissions changes to **Granted for Default Directory**.
1. On the left menu, select **Overview**. On the **Overview** page, find the **Application (client) ID** value and record it for use in Step 2.
1. On the left menu, select **Certificates & secrets**, and then select **+ New client secret**.    
    :::image type="content" source="media/credentials-how-to-azure-ad/create-secret.png" alt-text="Screenshot of creating an app secret in the portal.":::
    
    1. Enter a **Description**.
    1. Select an option for **Expires**.
    1. Select **Add**.
    1. Copy the client secret's **Value** before leaving the page. You will need it in Step 2.

## Step 2: Configure a credential provider in API Management

1. Sign into the [portal](https://portal.azure.com) and go to your API Management instance.
1. On the left menu, select **Credential manager**, and then select **+ Create**.    
    :::image type="content" source="media/credentials-how-to-azure-ad/create-credential.png" alt-text="Screenshot of creating an API credential in the portal.":::    
1. On the **Create credential provider** page, enter the following settings, and select **Create**:
    
    |Settings  |Value  |
    |---------|---------|
    |**Credential provider name**     |  A name of your choice, such as *MicrosoftEntraID-01*       |
    |**Identity provider**     |   Select **Azure Active Directory v1**      |
    |**Grant type**     | Select **Authorization code**        |
    |**Authorization URL** | Optional for Microsoft Entra identity provider. Default is `https://login.microsoftonline.com`. |
    |**Client ID**     |   Paste the value you copied earlier from the app registration      |
    |**Client secret**     |    Paste the value you copied earlier from the app registration      |
    |**Resource URL** | `https://graph.microsoft.com` |    
    |**Tenant ID** | Optional for Microsoft Entra identity provider. Default is *Common*. |
    |**Scopes**     |    Optional for Microsoft Entra identity provider. Automatically configured from Microsoft Entra app's API permissions.      |

## Step 3: Configure a connection

On the **Connection** tab, complete the steps for your connection to the provider. 

> [!NOTE]
> When you configure a connection, API Management by default sets up an [access policy](credentials-process-flow.md#access-policy) that enables access by the instance's systems-assigned managed identity. This access is sufficient for this example. You can add additional access policies as needed. 


[!INCLUDE [api-management-credential-create-connection](../../includes/api-management-credential-create-connection.md)]

> [!TIP]
> Use the portal to add, update, or delete connections to a credential provider at any time. For more information, see [Configure multiple connections](configure-credential-connection.md). 

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
1. Make sure the `provider-id` and `authorization-id` values in the `get-authorization-context` policy correspond to the names of the credential provider and connection, respectively, that you configured in the preceding steps. Select **Save**. 

    ```xml
    <policies>
        <inbound>
            <base />
            <get-authorization-context provider-id="MicrosoftEntraID-01" authorization-id="first-connection" context-variable-name="auth-context" identity-type="managed" ignore-error="false" />
           <set-header name="credential" exists-action="override">
               <value>@("Bearer " + ((credential)context.Variables.GetValueOrDefault("auth-context"))?.AccessToken)</value>
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

* The [get-authorization-context](get-authorization-context-policy.md) policy fetches an authorization token by referencing the credential provider and connection that were created earlier. 
* The [set-header](set-header-policy.md) policy creates an HTTP header with the fetched access token.

## Step 5: Test the API 

1. On the **Test** tab, select one operation that you configured.
1. Select **Send**. 
    
    :::image type="content" source="media/credentials-how-to-azure-ad/graph-api-response.png" alt-text="Screenshot of testing the Graph API in the portal.":::

    A successful response returns user data from the Microsoft Graph.

## Related content

* Learn more about [access restriction policies](api-management-access-restriction-policies.md)
* Learn more about [scopes and permissions](../active-directory/develop/scopes-oidc.md) in Microsoft Entra ID.
