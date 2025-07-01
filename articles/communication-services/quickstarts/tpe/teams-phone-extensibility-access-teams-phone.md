---
title: Access a user's Teams Phone separate from their Teams client
titleSuffix: An Azure Communication Services article
description: This article describes how to use Teams Phone Extensibility features with Azure Communication Services.
author: sofiar
manager: miguelher
services: azure-communication-services
ms.author: sofiar
ms.date: 05/19/2025
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: identity
---

# Access Teams Phone without going through the Teams client

[!INCLUDE [public-preview-notice.md](../../includes/public-preview-include-document.md)]

This article describes how to grant consent to a server to receive calls directed to a Teams Resource Account. Following sections also describe how to use a client to answer and place calls on behalf of Teams Resource Accounts.

## Prerequisites

- An Azure account with an active subscription. [Create a free account](https://azure.microsoft.com/free/).

- A Communication Services resource, see [Create a Communication Services resource](../create-communication-resource.md).

- A Microsoft Entra ID tenant with users that have a Teams license. For more information, see [Teams license requirements](../eligible-teams-licenses.md).

- Users must be enabled for Teams. To enable a user for Teams, open the Microsoft 365 admin center > **Users** > **Active Users**. Then search for the affected user account. Click on **Edit** to change their details. Go to **License and Apps**, then select the drop-down arrow from **Apps** and select **Enable Microsoft Teams**.

## Provide server consent

The Azure Communication Services Resource Owner needs to run the following API operations. The resource owner need to provide consent for authorizing calls to the Azure Communication Services Resource from the Teams Resource Account. You can call the API using any REST tool or programmatically. The API supports GET, PUT, PATCH, and DELETE operations.  


1. The `{YOUR-ACS-RESOURCE-ENDPOINT}` in the request URI (RURI) path is the Azure Communication Services Resource fully qualified domain name (FQDN) from Azure.
1. The `{YOUR-RESOURCE-ACCOUNT-GUID}` parameter in the RURI is the oid value returned by the Graph API from the previous step. Alternatively for one off manual provisioning, the [Get-CsOnlineApplicationInstance (MicrosoftTeamsPowerShell)](/powershell/module/teams/get-csonlineapplicationinstance) cmdlet returns the `ObjectId` and that ID is the `YOUR-RESOURCE-ACCOUNT-GUID`. 
1. The `{TENANT-GUID}` in the RURI path is the Teams Tenant GUID.
1. The `{principalType}` in the body is `teamsResourceAccount` because we're consenting to a Teams Resource Account for Teams Phone Extensibility.

This API supports Azure Communication Services hash-based message authentication code (HMAC) with a Connection String or Microsoft Entra ID Managed Identity. 

Query definition: 

```http
https://{YOUR-ACS-RESOURCE-ENDPOINT}/access/teamsExtension/tenants/{TENANT-GUID}/assignments/{YOUR-RESOURCE-ACCOUNT-GUID}?api-version=2025-03-02-preview 
```

Example to set consent: 

```rest
PUT https://myacsresource.unitedstates.communication.azure.com/access/teamsExtension/tenants/zz123456-1234-1234-1234-zzz123456789/assignments/cc123456-5678-5678-1234-ccc123456789?api-version=2025-03-02-preview

{
   "principalType": "teamsResourceAccount"
}
```

Example response:

```http
HTTP/1.1 201 Created
Content-type: application/json
```

Not allowed response:

If you receive a 403 Error with the following response, send the Azure Subscription GUID to your Azure Communication Services Product Manager (PM) to add you to the preview list.

```rest
{
   "error": {
   "code": "SubscriptionNotAllowed",
   "message": "API is not allowed to be accessed with your subscription."
}
}
```

## Provide Client Consent 

Use the Azure Communication Services calling SDK to extend your Teams Phone system, enabling calls to be made and received independently of the Teams application.

## Set up your application

### Step 1: Create or select a Microsoft Entra ID application registration

Users must be authenticated through a Microsoft Entra ID application with the Azure Communication Service `TeamsExtension.ManageCalls` permission. If you don't have an existing application for this quickstart, you can create a new application registration.

Configure the following application setting:

- The _Supported account types_ property defines whether the application is single-tenant (Accounts in this organizational directory only) or multitenant (Accounts in any organizational directory). Choose the option that fits your scenario.

- _Redirect URI_ defines the URI where the authentication request is redirected after authentication. For our web app scenario, choose **Single-page application** and enter **`http://localhost`** as the URI.

For more detailed information, see [Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app?tabs=certificate#register-an-application).

When the application is registered, look for the [identifier in the overview](/azure/communication-services/concepts/troubleshooting-info#get-an-application-id). Use the identifier  _Application (client) ID_ in the next steps.

### Step 2: Add the `TeamsExtension.ManageCalls` permission to your application

You must register your application for `TeamsExtension.ManageCalls` permission from the `Azure Communication Services` application. You need this permission for the Teams user to access the Teams Phone extensibility flows through Azure Communication Services.

1. Navigate to your Microsoft Entra ID app in the Azure portal and select **API permissions**.
2. Select **Add Permissions**.
3. From the **Add Permissions** menu, select **Azure Communication Services**.
4. Select the permission `TeamsExtension.ManageCalls`, then select **Add permissions**.

   :::image type="content" source="media/active-directory-permissions.png" alt-text="Screen capture showing how to add TeamsExtension.ManageCalls permission to the Microsoft Entra ID application you just created."  lightbox="media/active-directory-permissions.png":::

5. Grant admin consent for `TeamsExtension.ManageCalls` permission.

## Grant a Teams user access to your Azure Communication Services resource

Send a request to the Microsoft Teams Phone access assignments API to give a Teams user access through Communication Services resource. For more information about how to authenticate the web request, see [Authentication](/rest/api/communication/authentication).

The following example shows a request for a user with identifier `e5b7f628-ea94-4fdc-b3d9-1af1fe231111`.

```http
PUT {endpoint}/access/teamsExtension/tenants/87d349ed-44d7-43e1-9a83-5f2406dee5bd/assignments/e5b7f628-ea94-4fdc-b3d9-1af1fe231111?api-version=2025-03-02-preview

{
    "principalType" : "user",
    "clientIds" : ["1bfa671a-dc6b-47f3-8940-45c0f1af0fa6"]
}
```

### Response

The following example shows the response.

```http
HTTP/1.1 201 Created
Content-type: application/json

{
    "objectId": "e5b7f628-ea94-4fdc-b3d9-1af1fe231111",
    "tenantId": "87d349ed-44d7-43e1-9a83-5f2406dee5bd",
    "principalType" : "user",
    "clientIds" : ["1bfa671a-dc6b-47f3-8940-45c0f1af0fa6"]
}
```

## Sign-in flow

Complete this section to set up a sign-in flow for your application.

### Create a credential capable of obtaining a Microsoft Entra user token

To create a credential, use the [@azure/communication-common](https://www.npmjs.com/package/@azure/communication-common) SDK with version 2.3.2-beta.1. First, you need to initialize any implementation of [TokenCredential interface](/javascript/api/@azure/core-auth/tokencredential) and provide it to the `EntraCommunicationTokenCredentialOptions`.

Along with the token, you must provide the URI of the Azure Communication Services resource and the scopes required for the Microsoft Entra user token. These scopes determine the permissions granted to the token:

```javascript
const entraTokenCredential = new InteractiveBrowserCredential({
  tenantId: "<your-tenant-id>",
  clientId: "<your-client-id>",
  redirectUri: "<your-redirect-uri>",
});

const entraTokenCredentialOptions = {
  resourceEndpoint: "https://<your-resource>.communication.azure.com",
  tokenCredential: entraTokenCredential,
  scopes: [
    "https://auth.msft.communication.azure.com/TeamsExtension.ManageCalls",
  ],
};

const credential = new AzureCommunicationTokenCredential(
  entraTokenCredentialOptions
);
```

### Pass AzureCommunicationUserCredential into CallClient.CreateCallAgent

Once you have your credential ready, you can pass it to the CallingClient.

```javascript
const client = new CallingClient();
const callAgent = await client.createCallAgent(credential);
```

## Remove Teams user access

Send a request to the Microsoft Teams Phone access assignments API to delete the access for your Teams user to your Azure Communication Services resource.

```http
DELETE {endpoint}/access/teamsExtension/tenants/87d349ed-44d7-43e1-9a83-5f2406dee5bd/assignments/e5b7f628-ea94-4fdc-b3d9-1af1fe231111?api-version=2025-03-02-preview
```

### Response

```http
HTTP/1.1 204 NoContent
Content-type: application/json

{}
```

To verify that the Teams user is no longer linked with the Communication Services resource, send a GET request to the Microsoft Teams Phone access assignments API. Verify that its response status code is 404.

```http
GET {endpoint}/access/teamsExtension/tenants/87d349ed-44d7-43e1-9a83-5f2406dee5bd/assignments/e5b7f628-ea94-4fdc-b3d9-1af1fe231111?api-version=2025-03-02-preview
```

## Next steps
  
> [!div class="nextstepaction"]
> [REST API for Teams Phone extensibility](./teams-phone-extensiblity-rest-api.md)

## Related articles

- [Teams Phone extensibility overview](../../concepts/interop/tpe/teams-phone-extensibility-overview.md)
- [Teams Phone System extensibility quick start](./teams-phone-extensibility-quickstart.md)
