---
title: Run automated integration tests
description: Learn how to run automated integration tests as a user against APIs protected by the Microsoft identity platform. Use the Resource Owner Password Credential Grant (ROPC) auth flow to sign in as a user instead of automating the interactive sign-in prompt UI.
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 11/30/2021
ms.author: cwerner
ms.reviewer: sahmalik, arcrowe
ms.custom: aaddev
# Customer intent: As a developer, I want to use ROPC in automated integration tests against APIs protected by Microsoft identity platform so I don't have to automate the interactive sign-in prompts.
---

# Run automated integration tests

As a developer, you want to run automated integration tests on the apps you develop. Calling your API protected by Microsoft identity platform (or other protected APIs such as [Microsoft Graph](/graph/)) in automated integration tests is a challenge.  Microsoft Entra ID often requires an interactive user sign-in prompt, which is difficult to automate. This article describes how you can use a non-interactive flow, called [Resource Owner Password Credential Grant (ROPC)](v2-oauth-ropc.md), to automatically sign in users for testing.

To prepare for your automated integration tests, create some test users, create and configure an app registration, and potentially make some configuration changes to your tenant.  Some of these steps require admin privileges.  Also, Microsoft recommends that you _do not_ use the ROPC flow in a production environment.  [Create a separate test tenant](test-setup-environment.md) that you are an administrator of so you can safely and effectively run your automated integration tests.

> [!WARNING]
> Microsoft recommends you do _not_ use the ROPC flow in a production environment. In most production scenarios, more secure alternatives are available and recommended. The ROPC flow requires a very high degree of trust in the application, and carries risks which are not present in other authentication flows. You should only use this flow for testing purposes in a [separate test tenant](test-setup-environment.md), and only with test users.

> [!IMPORTANT]
>
> * The Microsoft identity platform only supports ROPC within Microsoft Entra tenants, not personal accounts. This means that you must use a tenant-specific endpoint (`https://login.microsoftonline.com/{TenantId_or_Name}`) or the `organizations` endpoint.
> * Personal accounts that are invited to a Microsoft Entra tenant can't use ROPC.
> * Accounts that don't have passwords can't sign in with ROPC, which means features like SMS sign-in, FIDO, and the Authenticator app won't work with that flow.
> * If users need to use [multi-factor authentication (MFA)](../authentication/concept-mfa-howitworks.md) to log in to the application, they will be blocked instead.
> * ROPC is not supported in [hybrid identity federation](../hybrid/connect/whatis-fed.md) scenarios (for example, Microsoft Entra ID and Active Directory Federation Services (AD FS) used to authenticate on-premises accounts). If users are full-page redirected to an on-premises identity provider, Microsoft Entra ID is not able to test the username and password against that identity provider. [Pass-through authentication](../hybrid/connect/how-to-connect-pta.md) is supported with ROPC, however.
> * An exception to a hybrid identity federation scenario would be the following: Home Realm Discovery policy with *AllowCloudPasswordValidation* set to TRUE will enable ROPC flow to work for federated users when on-premises password is synced to cloud. For more information, see [Enable direct ROPC authentication of federated users for legacy applications](../manage-apps/home-realm-discovery-policy.md#enable-direct-ropc-authentication-of-federated-users-for-legacy-applications).

## Create a separate test tenant

Using the ROPC authentication flow is risky in a production environment, so [create a separate tenant](test-setup-environment.md#set-up-a-test-environment-in-a-separate-tenant) to test your applications. You can use an existing test tenant, but you need to be an admin in the tenant since some of the following steps require admin privileges.

## Create and configure a key vault

We recommend you securely store the test usernames and passwords as [secrets](/azure/key-vault/secrets/about-secrets) in Azure Key Vault.  When you run the tests later, the tests run in the context of a security principal.  The security principal is a Microsoft Entra user if you're running tests locally (for example, in Visual Studio or Visual Studio Code), or a service principal or managed identity if you're running tests in Azure Pipelines or another Azure resource. The security principal must have **Read** and **List** secrets permissions so the test runner can get the test usernames and passwords from your key vault. For more information, read [Authentication in Azure Key Vault](/azure/key-vault/general/authentication).

1. [Create a new key vault](/azure/key-vault/general/quick-create-portal) if you don't have one already.
1. Take note of the **Vault URI** property value (similar to `https://<your-unique-keyvault-name>.vault.azure.net/`) which is used in the example test later in this article.
1. [Assign an access policy](/azure/key-vault/general/assign-access-policy) for the security principal running the tests. Grant the user, service principal, or managed identity **Get** and **List** secrets permissions in the key vault.

## Create test users

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Create some test users in your tenant for testing. Since the test users are not actual humans, we recommend you assign complex passwords and securely store these passwords as [secrets](/azure/key-vault/secrets/about-secrets) in Azure Key Vault.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** and create one or more test user accounts in your directory.
1. The example test later in this article uses a single test user.  [Add the test username and password as secrets](/azure/key-vault/secrets/quick-create-portal) in the key vault you created previously. Add the username as a secret named "TestUserName" and the password as a secret named "TestPassword".

## Create and configure an app registration
Register an application that acts as your client app when calling APIs during testing.  This should *not* be the same application you may already have in production.  You should have a separate app to use only for testing purposes.

### Register an application

Create an app registration. You can follow the steps in the [app registration quickstart](quickstart-register-app.md#register-an-application).  You don't need to add a redirect URI or add credentials, so you can skip those sections.

Take note of the **Application (client) ID**, which is used in the example test later in this article.

### Enable your app for public client flows

ROPC is a public client flow, so you need to enable your app for public client flows.  From your app registration in the [Microsoft Entra admin center](https://entra.microsoft.com), go to **Authentication** > **Advanced settings** > **Allow public client flows**.  Set the toggle to **Yes**.

### Consent to the permissions you want to use while testing

Since ROPC is not an interactive flow, you won't be prompted with a consent screen to consent to these at runtime.  Pre-consent to the permissions to avoid errors when acquiring tokens.

Add the permissions to your app. Do not add any sensitive or high-privilege permissions to the app, we recommend you scope your testing scenarios to basic integration scenarios around integrating with Microsoft Entra ID.

From your app registration in the [Microsoft Entra admin center](https://entra.microsoft.com), go to **API Permissions** > **Add a permission**.  Add the permissions you need to call the APIs you'll be using. A test example further in this article uses the `https://graph.microsoft.com/User.Read` and `https://graph.microsoft.com/User.ReadBasic.All` permissions.

Once the permissions are added, you'll need to consent to them.  The way you consent to the permissions depends on if your test app is in the same tenant as the app registration and whether you're an admin in the tenant.

#### App and app registration are in the same tenant and you're an admin
If you plan on testing your app in the same tenant you registered it in and you are an administrator in that tenant, you can consent to the permissions from the [Microsoft Entra admin center](https://entra.microsoft.com). In your app registration in the Azure portal, go to **API Permissions** and select the **Grant admin consent for <your_tenant_name>** button next to the **Add a permission** button and then **Yes** to confirm.

#### App and app registration are in different tenants, or you're not an admin
If you do not plan on testing your app in the same tenant you registered it in, or you are not an administrator in your tenant, you cannot consent to the permissions from the [Microsoft Entra admin center](https://entra.microsoft.com).  You can still consent to some permissions, however, by triggering a sign-in prompt in a web browser.

In your app registration in the [Microsoft Entra admin center](https://entra.microsoft.com), go to **Authentication** > **Platform configurations** > **Add a platform** > **Web**.  Add the redirect URI "https://localhost" and select **Configure**.

There is no way for non-admin users to pre-consent through the Azure portal, so send the following request in a browser.  When you are prompted with the login screen, sign in with a test account you created in a previous step.  Consent to the permissions you are prompted with.  You may need to repeat this step for each API you want to call and test user you want to use.

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

Replace *{tenant}* with your tenant ID, *{your_client_ID}* with the client ID of your application, and *{resource_you_want_to_call}* with the identifier URI (for example, "https://graph.microsoft.com") or app ID of the API you are trying to access.

## Exclude test apps and users from your MFA policy

Your tenant likely has a Conditional Access policy that [requires multifactor authentication (MFA) for all users](../conditional-access/howto-conditional-access-policy-all-users-mfa.md), as recommended by Microsoft.  MFA won't work with ROPC, so you'll need to exempt your test applications and test users from this requirement.

To exclude user accounts:
1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).   
1. Browse to **Identity** > **Security Center** in the left navigation pane and then select **Conditional Access**.
1. In **Policies**, select the Conditional Access policy that requires MFA.
1. Select **Users or workload identities**.
1. Select the **Exclude** tab and then the **Users and groups** checkbox.
1. Select the user account(s) to exclude in **Select excluded users**.
1. Select the **Select** button and then **Save**.

To exclude a test application:
1. In **Policies**, select the Conditional Access policy that requires MFA.
1. Select **Cloud apps or actions**.
1. Select the **Exclude** tab and then **Select excluded cloud apps**.
1. Select the app(s) you want to exclude in **Select excluded cloud apps**.
1. Select the **Select** button and then **Save**.

## Write your application tests

Now that you're set up, you can write your automated tests. The following are tests for:
1. .NET example code uses [Microsoft Authentication Library (MSAL)](msal-overview.md) and [xUnit](https://xunit.net/), a common testing framework.
1. JavaScript example code uses [Microsoft Authentication Library (MSAL)](msal-overview.md) and [Playwright](https://playwright.dev/), a common testing framework.

## [.NET](#tab/dotnet)

### Set up your appsettings.json file

Add the client ID of the test app you previously created, the necessary scopes, and the key vault URI to the *appsettings.json* file of your test project.

```json
{
  "Authentication": {
    "AzureCloudInstance": "AzurePublic", //Will be different for different Azure clouds, like US Gov
    "AadAuthorityAudience": "AzureAdMultipleOrgs",
    "ClientId": <your_client_ID>
  },

  "WebAPI": {
    "Scopes": [
      //For this Microsoft Graph example.  Your value(s) will be different depending on the API you're calling
      "https://graph.microsoft.com/User.Read",
      //For this Microsoft Graph example.  Your value(s) will be different depending on the API you're calling
      "https://graph.microsoft.com/User.ReadBasic.All"
    ]
  },

  "KeyVault": {
    "KeyVaultUri": "https://<your-unique-keyvault-name>.vault.azure.net//"
  }
}
```

### Set up your client for use across all your test classes

Use [SecretClient()](/dotnet/api/azure.security.keyvault.secrets.secretclient) to get the test username and password secrets from Azure Key Vault. The code uses exponential back-off for retries in case Key Vault is being throttled.

[DefaultAzureCredential()](/dotnet/api/azure.identity.defaultazurecredential) authenticates with Azure Key Vault by getting an access token from a service principal configured by environment variables or a managed identity (if the code is running on an Azure resource with a managed identity).  If the code is running locally, `DefaultAzureCredential` uses the local user's credentials. Read more in the [Azure Identity client library](/dotnet/api/overview/azure/identity-readme#defaultazurecredential) content.

Use Microsoft Authentication Library (MSAL) to authenticate using the ROPC flow and get an access token.  The access token is passed along as a bearer token in the HTTP request.

```csharp
using Xunit;
using System.Threading.Tasks;
using Microsoft.Identity.Client;
using System.Security;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.Extensions.Configuration;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Azure.Core;
using System;

public class ClientFixture : IAsyncLifetime
{
    public HttpClient httpClient;

    public async Task InitializeAsync()
    {
        var builder = new ConfigurationBuilder().AddJsonFile("<path-to-json-file>");

        IConfigurationRoot Configuration = builder.Build();

        var PublicClientApplicationOptions = new PublicClientApplicationOptions();
        Configuration.Bind("Authentication", PublicClientApplicationOptions);
        var app = PublicClientApplicationBuilder.CreateWithApplicationOptions(PublicClientApplicationOptions)
            .Build();

        SecretClientOptions options = new SecretClientOptions()
        {
            Retry =
                {
                    Delay= TimeSpan.FromSeconds(2),
                    MaxDelay = TimeSpan.FromSeconds(16),
                    MaxRetries = 5,
                    Mode = RetryMode.Exponential
                 }
        };

        string keyVaultUri = Configuration.GetValue<string>("KeyVault:KeyVaultUri");
        var client = new SecretClient(new Uri(keyVaultUri), new DefaultAzureCredential(), options);

        KeyVaultSecret userNameSecret = client.GetSecret("TestUserName");
        KeyVaultSecret passwordSecret = client.GetSecret("TestPassword");

        string password = passwordSecret.Value;
        string username = userNameSecret.Value;
        string[] scopes = Configuration.GetSection("WebAPI:Scopes").Get<string[]>();
        SecureString securePassword = new NetworkCredential("", password).SecurePassword;

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

### Use in your test classes

The following example is a test that calls Microsoft Graph.  Replace this test with whatever you'd like to test on your own application or API.

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

## [JavaScript](#tab/JavaScript)

### Set up your authConfig.json file

Add the client ID and the tenant ID of the test app you previously created, the key vault URI and the secret name to the authConfig.js file of your test project.

```javascript
export const msalConfig = {
    auth: {
        clientId: 'Enter_the_Application_Id_Here',
        authority: 'https://login.microsoftonline.com/Enter_the_Tenant_Id_Here',
    },
};

export const keyVaultConfig = {
    keyVaultUri: 'https://<your-unique-keyvault-name>.vault.azure.net',
    secretName: 'Enter_the_Secret_Name',
};
```

### Initialize MSAL.js and fetch the user credentials from Key Vault

Initialize the MSAL.js authentication context by instantiating a [PublicClientApplication](/javascript/api/%40azure/msal-node/publicclientapplication) with a [Configuration](/javascript/api/%40azure/msal-node/publicclientapplication#@azure-msal-node-publicclientapplication-constructor) object. The minimum required configuration property is the `clientID` of the application.

Use [SecretClient()](/javascript/api/%40azure/keyvault-secrets/secretclient) to get the test username and password secrets from Azure Key Vault.

[DefaultAzureCredential()](/javascript/api/@azure/identity/defaultazurecredential) authenticates with Azure Key Vault by getting an access token from a service principal configured by environment variables or a managed identity (if the code is running on an Azure resource with a managed identity).  If the code is running locally, `DefaultAzureCredential` uses the local user's credentials. Read more in the [Azure Identity client library](/javascript/api/%40azure/identity/defaultazurecredential) content.

Use Microsoft Authentication Library (MSAL) to authenticate using the ROPC flow and get an access token.  The access token is passed along as a bearer token in the HTTP request.


```javascript
import { test, expect } from '@playwright/test';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import { PublicClientApplication, CacheKVStore } from '@azure/msal-node';
import { msalConfig, keyVaultConfig } from '../authConfig';

let tokenCache;
const KVUri = keyVaultConfig.keyVaultUri;
const secretName = keyVaultConfig.secretName;

async function getCredentials() {
    try {
        const credential = new DefaultAzureCredential();
        const secretClient = new SecretClient(KVUri, credential);
        const secret = await secretClient.getSecret(keyVaultConfig.secretName);
        const password = secret.value;
        return [secretName, password];
    } catch (error) {
        console.log(error);
    }
}

test.beforeAll(async () => {
    const pca = new PublicClientApplication(msalConfig);
    const [username, password] = await getCredentials();
    const usernamePasswordRequest = {
        scopes: ['user.read', 'User.ReadBasic.All'],
        username: username,
        password: password,
    };
    await pca.acquireTokenByUsernamePassword(usernamePasswordRequest);
    tokenCache = pca.getTokenCache().getKVStore();
});
```

### Run the test suite

In the same file, add the tests as shown below: 

```javascript
/**
 * Stores the token in the session storage and reloads the page
 */
async function setSessionStorage(page, tokens) {
    const cacheKeys = Object.keys(tokens);
    for (let key of cacheKeys) {
        const value = JSON.stringify(tokenCache[key]);
        await page.context().addInitScript(
            (arr) => {
                window.sessionStorage.setItem(arr[0], arr[1]);
            },
            [key, value]
        );
    }
    await page.reload();
}

test.describe('Testing Authentication with MSAL.js ', () => {
    test('Test user has signed in successfully', async ({ page }) => {
        await page.goto('http://localhost:<port>/');
        let signInButton = page.getByRole('button', { name: /Sign In/i });
        let signOutButton = page.getByRole('button', { name: /Sign Out/i });
        let welcomeDev = page.getByTestId('WelcomeMessage');
        expect(await signInButton.count()).toBeGreaterThan(0);
        expect(await signOutButton.count()).toBeLessThanOrEqual(0);
        expect(await welcomeDev.innerHTML()).toEqual('Please sign-in to see your profile and read your mails');
        await setSessionStorage(page, tokenCache);
        expect(await signInButton.count()).toBeLessThanOrEqual(0);
        expect(await signOutButton.count()).toBeGreaterThan(0);
        expect(await welcomeDev.innerHTML()).toContain(`Welcome`);
    });
});

```

For more information, please check the following code sample [MSAL.js Testing Example](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-browser-samples/TestingSample).
