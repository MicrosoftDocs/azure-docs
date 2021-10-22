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

# Run automated integration tests

As a developer...

## Use ROPC
Why use ROPC
Explanation of why you should use ROPC ONLY for integration testing
Limitations of ROPC

## Create a client app 
Should not be an app used in production...
Get app...
Enable public client flows...
Copy client ID...

## Code snippets with xUnit
Set up your appsettings.json file

```json
{
  "Authentication": {
    "AzureCloudInstance": "AzurePublic", //Will be different for different Azure clouds, like US Gov
    "AadAuthorityAudience": "AzureAdMultipleOrgs", //Possible values include "AzureAdMyOrg" and "AzureAdMultipleOrgs"
    "ClientId": <Client_ID_from_previous_step>
  }
}
```

Set up your client for use across all your test classes.  

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

Use in your test classes.

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
