---
title: Acquire a token to call a web API using integrated Windows authentication (desktop app)
description: Learn how to build a desktop app that calls web APIs to acquire a token for the app using integrated Windows authentication
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 10/07/2022
ms.author: dmwendia
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a desktop app that calls web APIs by using the Microsoft identity platform.
---

# Desktop app that calls web APIs: Acquire a token using integrated Windows authentication

To sign in a domain user on a domain or Microsoft Entra joined machine, use integrated Windows authentication (IWA).

## Constraints

- Integrated Windows authentication is available for *federated+* users only, that is, users created in Active Directory and backed by Microsoft Entra ID. Users created directly in Microsoft Entra ID without Active Directory backing, known as *managed* users, can't use this authentication flow. This limitation doesn't affect the username and password flow.
- IWA doesn't bypass [multi-factor authentication (MFA)](../authentication/concept-mfa-howitworks.md). If MFA is configured, IWA might fail if an MFA challenge is required, because MFA requires user interaction.

    IWA is non-interactive, but MFA requires user interactivity. You don't control when the identity provider requests MFA to be performed, the tenant admin does. From our observations, MFA is required when you sign in from a different country/region, when not connected via VPN to a corporate network, and sometimes even when connected via VPN. Don't expect a deterministic set of rules. Microsoft Entra ID uses AI to continuously learn if MFA is required. Fall back to a user prompt like interactive authentication or device code flow if IWA fails.

- The authority passed in `PublicClientApplicationBuilder` needs to be:
  - Tenanted of the form `https://login.microsoftonline.com/{tenant}/`, where `tenant` is either the GUID that represents the tenant ID or a domain associated with the tenant.
  - For any work and school accounts: `https://login.microsoftonline.com/organizations/`.
  - Microsoft personal accounts aren't supported. You can't use /common or /consumers tenants.

- Because integrated Windows authentication is a silent flow:
  - The user of your application must have previously consented to use the application.
  - Or, the tenant admin must have previously consented to all users in the tenant to use the application.
  - In other words:
    - Either you as a developer selected the **Grant** button in the Azure portal for yourself.
    - Or, a tenant admin selected the **Grant/revoke admin consent for {tenant domain}** button on the **API permissions** tab of the registration for the application. For more information, see [Add permissions to access your web API](quickstart-configure-app-access-web-apis.md#add-permissions-to-access-your-web-api).
    - Or, you've provided a way for users to consent to the application. For more information, see [Requesting individual user consent](./permissions-consent-overview.md#requesting-individual-user-consent).
    - Or, you've provided a way for the tenant admin to consent to the application. For more information, see [Admin consent](./permissions-consent-overview.md#requesting-consent-for-an-entire-tenant).

- This flow is enabled for .NET desktop, .NET Core, and UWP apps.

For more information on consent, see the [Microsoft identity platform permissions and consent](./permissions-consent-overview.md).

## Learn how to use it

# [.NET](#tab/dotnet)

In MSAL.NET, use:

```csharp
AcquireTokenByIntegratedWindowsAuth(IEnumerable<string> scopes)
```

You normally need only one parameter (`scopes`). Depending on the way your Windows administrator set up the policies, applications on your Windows machine might not be allowed to look up the signed-in user. In that case, use a second method, `.WithUsername()`, and pass in the username of the signed-in user as a UPN format, for example, `joe@contoso.com`.

The following sample presents the most current case, with explanations of the kind of exceptions you can get and their mitigations.

```csharp
static async Task GetATokenForGraph()
{
 string authority = "https://login.microsoftonline.com/contoso.com";
 string[] scopes = new string[] { "user.read" };
 IPublicClientApplication app = PublicClientApplicationBuilder
      .Create(clientId)
      .WithAuthority(authority)
      .Build();

 var accounts = await app.GetAccountsAsync();

 AuthenticationResult result = null;
 if (accounts.Any())
 {
  result = await app.AcquireTokenSilent(scopes, accounts.FirstOrDefault())
      .ExecuteAsync();
 }
 else
 {
  try
  {
   result = await app.AcquireTokenByIntegratedWindowsAuth(scopes)
      .ExecuteAsync(CancellationToken.None);
  }
  catch (MsalUiRequiredException ex)
  {
   // MsalUiRequiredException: AADSTS65001: The user or administrator has not consented to use the application
   // with ID '{appId}' named '{appName}'.Send an interactive authorization request for this user and resource.

   // you need to get user consent first. This can be done, if you are not using .NET Core (which does not have any Web UI)
   // by doing (once only) an AcquireToken interactive.

   // If you are using .NET core or don't want to do an AcquireTokenInteractive, you might want to suggest the user to navigate
   // to a URL to consent: https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id={clientId}&response_type=code&scope=user.read

   // AADSTS50079: The user is required to use multi-factor authentication.
   // There is no mitigation - if MFA is configured for your tenant and AAD decides to enforce it,
   // you need to fallback to an interactive flows such as AcquireTokenInteractive or AcquireTokenByDeviceCode
   }
   catch (MsalServiceException ex)
   {
    // Kind of errors you could have (in ex.Message)

    // MsalServiceException: AADSTS90010: The grant type is not supported over the /common or /consumers endpoints. Please use the /organizations or tenant-specific endpoint.
    // you used common.
    // Mitigation: as explained in the message from Azure AD, the authority needs to be tenanted or otherwise organizations

    // MsalServiceException: AADSTS70002: The request body must contain the following parameter: 'client_secret or client_assertion'.
    // Explanation: this can happen if your application was not registered as a public client application in Azure AD
    // Mitigation: in the Azure portal, edit the manifest for your application and set the `allowPublicClient` to `true`
   }
   catch (MsalClientException ex)
   {
      // Error Code: unknown_user Message: Could not identify logged in user
      // Explanation: the library was unable to query the current Windows logged-in user or this user is not AD or AAD
      // joined (work-place joined users are not supported).

      // Mitigation 1: on UWP, check that the application has the following capabilities: Enterprise Authentication,
      // Private Networks (Client and Server), User Account Information

      // Mitigation 2: Implement your own logic to fetch the username (e.g. john@contoso.com) and use the
      // AcquireTokenByIntegratedWindowsAuth form that takes in the username

      // Error Code: integrated_windows_auth_not_supported_managed_user
      // Explanation: This method relies on a protocol exposed by Active Directory (AD). If a user was created in Azure
      // Active Directory without AD backing ("managed" user), this method will fail. Users created in AD and backed by
      // AAD ("federated" users) can benefit from this non-interactive method of authentication.
      // Mitigation: Use interactive authentication
   }
 }

 Console.WriteLine(result.Account.Username);
}
```

For the list of possible modifiers on AcquireTokenByIntegratedWindowsAuthentication, see [AcquireTokenByIntegratedWindowsAuthParameterBuilder](/dotnet/api/microsoft.identity.client.acquiretokenbyintegratedwindowsauthparameterbuilder#methods).

# [Java](#tab/java)

This extract is from the [MSAL Java code samples](https://github.com/AzureAD/microsoft-authentication-library-for-java/blob/dev/msal4j-sdk/src/samples/public-client/IntegratedWindowsAuthenticationFlow.java).

```java
   PublicClientApplication pca = PublicClientApplication.builder(clientId)
                .authority(authority)
                .build();

        Set<IAccount> accountsInCache = pca.getAccounts().join();
        IAccount account = getAccountByUsername(accountsInCache, username);

        //Attempt to acquire token when user's account is not in the application's token cache
        IAuthenticationResult result = acquireTokenIntegratedWindowsAuth(pca, scope, account, username);
        System.out.println("Account username: " + result.account().username());
        System.out.println("Access token:     " + result.accessToken());
        System.out.println("Id token:         " + result.idToken());
        System.out.println();

        //Get list of accounts from the application's token cache, and search them for the configured username
        //getAccounts() will be empty on this first call, as accounts are added to the cache when acquiring a token
        accountsInCache = pca.getAccounts().join();
        account = getAccountByUsername(accountsInCache, username);

        //Attempt to acquire token again, now that the user's account and a token are in the application's token cache
        result = acquireTokenIntegratedWindowsAuth(pca, scope, account, username);
        System.out.println("Account username: " + result.account().username());
        System.out.println("Access token:     " + result.accessToken());
        System.out.println("Id token:         " + result.idToken());
    }

    private static IAuthenticationResult acquireTokenIntegratedWindowsAuth( PublicClientApplication pca,
                                                                            Set<String> scope,
                                                                            IAccount account,
                                                                            String username) throws Exception {

        IAuthenticationResult result;
        try {
            SilentParameters silentParameters =
                    SilentParameters
                            .builder(scope)
                            .account(account)
                            .build();
            // Try to acquire token silently. This will fail on the first acquireTokenIntegratedWindowsAuth() call
            // because the token cache does not have any data for the user you are trying to acquire a token for
            result = pca.acquireTokenSilently(silentParameters).join();
            System.out.println("==acquireTokenSilently call succeeded");
        } catch (Exception ex) {
            if (ex.getCause() instanceof MsalException) {
                System.out.println("==acquireTokenSilently call failed: " + ex.getCause());
                IntegratedWindowsAuthenticationParameters parameters =
                        IntegratedWindowsAuthenticationParameters
                                .builder(scope, username)
                                .build();

                // Try to acquire a token using Integrated Windows Authentication (IWA). You will need to generate a Kerberos ticket.
                // If successful, you should see the token and account information printed out to console
                result = pca.acquireToken(parameters).join();
                System.out.println("==Integrated Windows Authentication flow succeeded");
            } else {
                // Handle other exceptions accordingly
                throw ex;
            }
        }
        return result;
    }
```

# [macOS](#tab/macOS)

This flow doesn't apply to macOS.

# [Node.js](#tab/nodejs)

This flow isn't yet supported in MSAL Node.

# [Python](#tab/python)

This flow isn't yet supported in MSAL Python.

---
## Next steps

Move on to the next article in this scenario,
[Call a web API from the desktop app](scenario-desktop-call-api.md).
