---
title: Run automated integration tests against Microsoft identity-protected APIs
titleSuffix: Microsoft identity platform
description: Learn how to run automated integration tests against APIs protected by the Microsoft identity platform
services: active-directory
author: arcrowe
manager: dastrock

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 10/22/2021
ms.author: arcrowe
ms.reviewer: 
ms.custom: aaddev
#Customer intent: As a developer, I want to run automated integration tests against APIs protected by Microsoft identity platform
---

# Running automated integration tests

As a developer, you'll likely want to run automated integration tests on the apps you develop.  This can be challenging if you want to run integration tests on your own API you've protected with Azure AD, or you want to call other Azure AD protected APIs (like Microsoft Graph) in your integration tests, because Azure AD often requires an interactive user sign in that is difficult to automate.  This article describes how you can use a non-interactive flow, called Resource Owner Password Credential Grant (ROPC) to automatically sign in users for testing.

> [!WARNING]
> Microsoft recommends you do _not_ use the ROPC flow in production. In most production scenarios, more secure alternatives are available and recommended. This flow requires a very high degree of trust in the application, and carries risks which are not present in other flows. You should only use this flow for testing purposes, and only with test users.

> [!IMPORTANT]
>
> * The Microsoft identity platform only supports ROPC within Azure AD tenants, not personal accounts. This means that you must use a tenant-specific endpoint (`https://login.microsoftonline.com/{TenantId_or_Name}`) or the `organizations` endpoint.
> * Personal accounts that are invited to an Azure AD tenant can't use ROPC.
> * Accounts that don't have passwords can't sign in with ROPC, which means features like SMS sign-in, FIDO, and the Authenticator app won't work with that flow.
> * If users need to use [multi-factor authentication (MFA)](../authentication/concept-mfa-howitworks.md) to log in to the application, they will be blocked instead.
> * ROPC is not supported in [hybrid identity federation](../hybrid/whatis-fed.md) scenarios (for example, Azure AD and ADFS used to authenticate on-premises accounts). If users are full-page redirected to an on-premises identity providers, Azure AD is not able to test the username and password against that identity provider. [Pass-through authentication](../hybrid/how-to-connect-pta.md) is supported with ROPC, however.
> * An exception to a hybrid identity federation scenario would be the following: Home Realm Discovery policy with AllowCloudPasswordValidation set to TRUE will enable ROPC flow to work for federated users when on-premises password is synced to cloud. For more information, see [Enable direct ROPC authentication of federated users for legacy applications](../manage-apps/home-realm-discovery-policy.md#enable-direct-ropc-authentication-of-federated-users-for-legacy-applications).

You can read more about how the ROPC flow works in our [protocol documentation](v2-oauth-ropc.md).

## Getting set up 
To prepare for your automated integration tests, you'll need to create some test users, acquire and configure an app registration, and potentially make some configuration changes to your tenant.  Some of these steps will require admin privileges, and you'll likely want to create a separate test tenant that you are an administrator of so you can safely and effectively perform these tasks.

### Create some test users
Lorem ipsum

### Create and configure an app registration
You'll need to register an application that will act as your client app when calling APIs.  This should **not** be the same application you may already have in production.  You should have a separate app to use only for testing purposes.

1. Register an application.  You can follow the first few steps of this [quickstart](quickstart-register-app.md) if you don't know how to register an app.  You won't need to add a redirect URI or add credentials, so you can skip those sections.
2. Enable your app for public client flows, since ROPC is a public client flow.  From your app registration in the Azure portal, go to Authentication > Advanced settings > Allow public client flows.  Set the toggle to 'Yes'.
3. Consent to the permissions you want to use while testing.  Since ROPC is not an interactive flow, you won't be prompted with a consent screen to consent to these at runtime.  So, you'll need to pre-consent to them to avoid errors when acquiring tokens. First, add the permissions to your app. From your app registration in the Azure portal, go to the API Permissions page > Add a permission.  Add the permissions you need to call the APIs you'll be using. Once the permissions are added, you'll need to consent to them.  This can be done two different ways.

        - If you plan on testing your app in the same tenant you registered it in, and you are an administrator in that tenant, you can consent to the permissions from the Azure portal. Simply click the 'Grant admin consent for <your_tenant_name>' button, next to the 'Add a permission' button on the API Permissions page.
     
        - If you do not plan on testing your app in the same tenant you registered it in, or you are not an administrator in your tenant, you can still pre-consent to some permissions.  Perform these steps:
                1.  From your app registration in the Azure portal, go to Authentication > Add a platform > Web.  Add the redirect URI "https://localhost".
                2.  Send the below request in a browser, and consent to the permissions you are prompted with.  You may need to repeat this step for each API you want to call.

```HTTP
// Line breaks for legibility only

https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?
client_id={your_client_ID}
&response_type=code
&redirect_uri=https://localhost
&response_mode=query
&scope={resource_you_want_to_call}/.default
&state=12345
```

Replace {tenant} with your tenant ID, {your_client_ID} with the client ID of your application, and {resource_you_want_to_call} with the identifier URI or app ID of the API you are trying to access.

### Configure your tenant
Your tenant likely has some security settings that require multi-factor authentication for all users, as recommended by Microsoft.  Multifactor authentication won't work with ROPC, so you'll need to exempt your test application/test users from this requirement.

Ryan TODO

## Write your tests
        
Now that you're set up, you can write your automated tests!  The following example code uses MSAL and xUnit, a common testing framework.
        
### Set up your appsettings.json file

```json
{
  "Authentication": {
    "AzureCloudInstance": "AzurePublic", //Will be different for different Azure clouds, like US Gov
    "AadAuthorityAudience": "AzureAdMultipleOrgs", //Possible values include "AzureAdMyOrg" and "AzureAdMultipleOrgs"
    "ClientId": <your_client_ID>
  }
}
```

### Set up your client for use across all your test classes.  

```csharp
    public class ClientFixture : IAsyncLifetime
    {
        public HttpClient httpClient;

        public async Task InitializeAsync()
        {
            // These need to be put in config file eventually
            string[] scopes = new string[] { "User.Read", "User.ReadBasic.All" };
            string username = <test_user_username>;
            string password = <test_user_password>;
            SecureString securePassword = new NetworkCredential("", password).SecurePassword;

         SampleConfiguration config = SampleConfiguration.ReadFromJsonFile("appsettings.json");
            var appConfig = config.PublicClientApplicationOptions;
            var app = PublicClientApplicationBuilder.CreateWithApplicationOptions(appConfig)
                                                    .Build();

            AuthenticationResult result = null;
            httpClient = new HttpClient();

            try
            {
                result = await app.AcquireTokenByUsernamePassword(scopes, username, securePassword)
                    .ExecuteAsync();
            }
            catch (MsalException) { }

            string accessToken = result.AccessToken;
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", accessToken);
        }

        public Task DisposeAsync() => Task.CompletedTask;
    }
```

### Use in your test classes.  

A dummy test that calls Microsoft Graph is included as an example, but you should replace this test with whatever you'd like to test on your own application or API.

```csharp
    public class ApiTests : IClassFixture<ClientFixture>
    {
        ClientFixture clientFixture;

        public ApiTests(ClientFixture clientFixture)
        {
            this.clientFixture = clientFixture;
        }


        [Fact]
        public async Task GetRequestTest()
        {
            var testClient = clientFixture.httpClient;
            HttpResponseMessage response = await testClient.GetAsync("https://graph.microsoft.com/v1.0/me");
            var responseCode = response.StatusCode.ToString();
            Assert.Equal("OK", responseCode);
        }
    }
```
