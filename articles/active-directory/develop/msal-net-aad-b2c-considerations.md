---
title: Azure AD B2C and MSAL.NET
titleSuffix: Microsoft identity platform
description: Considerations when using Azure AD B2C with the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/07/2020
ms.author: jeferrie
ms.reviewer: saeeda
ms.custom: aaddev
# Customer intent: As an application developer, I want to learn about specific considerations when using
#                  Azure AD B2C and MSAL.NET so I can decide if this platform meets my application development
#                  needs and requirements.
---

# Use MSAL.NET to sign in users with social identities

You can use MSAL.NET to sign in users with social identities by using [Azure Active Directory B2C (Azure AD B2C)](https://aka.ms/aadb2c). Azure AD B2C is built around the notion of policies. In MSAL.NET, specifying a policy translates to providing an authority.

- When you instantiate the public client application, you need to specify the policy as part of the authority.
- When you want to apply a policy, call an override of `AcquireTokenInteractive` that accepts the `authority` parameter.

This article applies to MSAL.NET 3.x. For MSAL.NET 2.x, see [Azure AD B2C specifics in MSAL 2.x](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/AAD-B2C-Specifics-MSAL-2.x) in the MSAL.NET Wiki on GitHub.

## Authority for an Azure AD B2C tenant and policy

The authority format for Azure AD B2C is: `https://{azureADB2CHostname}/tfp/{tenant}/{policyName}`

- `azureADB2CHostname` - The name of the Azure AD B2C tenant plus the host. For example, *contosob2c.b2clogin.com*.
- `tenant` - The domain name or the directory (tenant) ID of the Azure AD B2C tenant. For example, *contosob2c.onmicrosoft.com* or a GUID, respectively.
- `policyName` - The name of the user flow or custom policy to apply. For example, a sign-up/sign-in policy like *b2c_1_susi*.

For more information about Azure AD B2C authorities, see [Set redirect URLs to b2clogin.com](../../active-directory-b2c/b2clogin.md).

## Instantiating the application

Provide the authority by calling `WithB2CAuthority()` when you create the application object:

```csharp
// Azure AD B2C Coordinates
public static string Tenant = "fabrikamb2c.onmicrosoft.com";
public static string AzureADB2CHostname = "fabrikamb2c.b2clogin.com";
public static string ClientID = "90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6";
public static string PolicySignUpSignIn = "b2c_1_susi";
public static string PolicyEditProfile = "b2c_1_edit_profile";
public static string PolicyResetPassword = "b2c_1_reset";

public static string AuthorityBase = $"https://{AzureADB2CHostname}/tfp/{Tenant}/";
public static string Authority = $"{AuthorityBase}{PolicySignUpSignIn}";
public static string AuthorityEditProfile = $"{AuthorityBase}{PolicyEditProfile}";
public static string AuthorityPasswordReset = $"{AuthorityBase}{PolicyResetPassword}";

application = PublicClientApplicationBuilder.Create(ClientID)
               .WithB2CAuthority(Authority)
               .Build();
```

## Acquire a token to apply a policy

Acquiring a token for an Azure AD B2C-protected API in a public client application requires you to use the overrides with an authority:

```csharp
IEnumerable<IAccount> accounts = await application.GetAccountsAsync();
AuthenticationResult ar = await application.AcquireTokenInteractive(scopes)
                                           .WithAccount(GetAccountByPolicy(accounts, policy))
                                           .WithParentActivityOrWindow(ParentActivityOrWindow)
                                           .ExecuteAsync();
```

In the preceding code snippet:

- `policy` is a string containing the name of your Azure AD B2C user flow or custom policy (for example, `PolicySignUpSignIn`).
- `ParentActivityOrWindow` is required for Android (the Activity) and is optional for other platforms that support a parent UI like windows on Microsoft Windows and UIViewController in iOS. For more information on the UI dialog, see [WithParentActivityOrWindow](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Acquiring-tokens-interactively#withparentactivityorwindow) on the MSAL Wiki.
- `GetAccountByPolicy(IEnumerable<IAccount>, string)` is a method that finds an account for a given policy. For example:

  ```csharp
  private IAccount GetAccountByPolicy(IEnumerable<IAccount> accounts, string policy)
  {
      foreach (var account in accounts)
      {
          string userIdentifier = account.HomeAccountId.ObjectId.Split('.')[0];
          if (userIdentifier.EndsWith(policy.ToLower()))
              return account;
      }
      return null;
  }
  ```

Applying a user flow or custom policy (for example, letting the user edit their profile or reset their password) is currently done by calling `AcquireTokenInteractive`. For these two policies, you don't use the returned token/authentication result.

## Profile edit policies

To enable your users to sign in with a social identity and then edit their profile, apply the Azure AD B2C edit profile policy.

Do so by calling `AcquireTokenInteractive` with the authority for that policy. Because the user is already signed in and has an active cookie session, use `Prompt.NoPrompt` to prevent the account selection dialog from being displayed.

```csharp
private async void EditProfileButton_Click(object sender, RoutedEventArgs e)
{
    IEnumerable<IAccount> accounts = await app.GetAccountsAsync();
    try
    {
        var authResult = await app.AcquireToken(scopes:App.ApiScopes)
                            .WithAccount(GetUserByPolicy(accounts, App.PolicyEditProfile)),
                            .WithPrompt(Prompt.NoPrompt),
                            .WithB2CAuthority(App.AuthorityEditProfile)
                            .ExecuteAsync();
        DisplayBasicTokenInfo(authResult);
    }
    catch
    {
    }
}
```

## Resource owner password credentials (ROPC)

For more information on the ROPC flow, see [Sign in with resource owner password credentials grant](v2-oauth-ropc.md).

The ROPC flow is **not recommended** because asking a user for their password in your application is not secure. For more information about this problem, see [What’s the solution to the growing problem of passwords?](https://news.microsoft.com/features/whats-solution-growing-problem-passwords-says-microsoft/).

By using username/password in an ROPC flow, you sacrifice several things:

- Core tenets of modern identity: The password can be fished or replayed because the shared secret can be intercepted. By definition, ROPC is incompatible with passwordless flows.
- Users who need to do MFA won't be able to sign in (as there is no interaction).
- Users won't be able to use single sign-on (SSO).

### Configure the ROPC flow in Azure AD B2C

In your Azure AD B2C tenant, create a new user flow and select **Sign in using ROPC** to enable ROPC for the user flow. For more information, see [Configure the resource owner password credentials flow](/azure/active-directory-b2c/configure-ropc).

`IPublicClientApplication` contains the `AcquireTokenByUsernamePassword` method:

```csharp
AcquireTokenByUsernamePassword(
            IEnumerable<string> scopes,
            string username,
            SecureString password)
```

This `AcquireTokenByUsernamePassword` method takes the following parameters:

- The *scopes* for which to obtain an access token.
- A *username*.
- A SecureString *password* for the user.

### Limitations of the ROPC flow

The ROPC flow **only works for local accounts**, where your users have registered with Azure AD B2C using an email address or username. This flow doesn't work when federating to an external identity provider supported by Azure AD B2C (Facebook, Google, etc.).

## Google auth and embedded webview

If you're using Google as an identity provider, we recommend you use the system browser as Google doesn't allow [authentication from embedded webviews](https://developers.googleblog.com/2016/08/modernizing-oauth-interactions-in-native-apps.html). Currently, `login.microsoftonline.com` is a trusted authority with Google and will work with embedded webview. However, `b2clogin.com` is not a trusted authority with Google, so users will not be able to authenticate.

We'll provide an update to this [issue](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/issues/688) if things change.

## Token caching in MSAL.NET

### Known issue with Azure AD B2C

MSAL.NET supports a [token cache](/dotnet/api/microsoft.identity.client.tokencache?view=azure-dotnet). The token caching key is based on the claims returned by the identity provider (IdP).

Currently, MSAL.NET needs two claims to build a token cache key:

- `tid` (the Azure AD tenant ID)
- `preferred_username`

Both of these claims may be missing in Azure AD B2C scenarios because not all social identity providers (Facebook, Google, and others) return them in the tokens they return to Azure AD B2C.

A symptom of such a scenario is that MSAL.NET returns `Missing from the token response` when you access the `preferred_username` claim value in tokens issued by Azure AD B2C. MSAL uses the `Missing from the token response` value for `preferred_username` to maintain cache cross-compatibility between libraries.

### Workarounds

#### Mitigation for missing tenant ID

The suggested workaround is to use [caching by policy](#acquire-a-token-to-apply-a-policy) described earlier.

Alternatively, you can use the `tid` claim if you're using [custom policies](../../active-directory-b2c/custom-policy-get-started.md) in Azure AD B2C. Custom policies can return additional claims to your application by using [claims transformation](/azure/active-directory-b2c/claims-transformation-technical-profile).

#### Mitigation for "Missing from the token response"

One option is to use the `name` claim instead of `preferred_username`. To include the `name` claim in ID tokens issued by Azure AD B2C, select **Display Name** when you configure your user flow.

For more information about specifying which claims are returned by your user flows, see [Tutorial: Create user flows in Azure AD B2C](../../active-directory-b2c/tutorial-create-user-flows.md).

## Next steps

More details about acquiring tokens interactively with MSAL.NET for Azure AD B2C applications are provided in the following sample.

| Sample | Platform | Description|
|------ | -------- | -----------|
|[active-directory-b2c-xamarin-native](https://github.com/Azure-Samples/active-directory-b2c-xamarin-native) | Xamarin iOS, Xamarin Android, UWP | A Xamarin Forms app that uses MSAL.NET to authenticate users via Azure AD B2C and then access a web API with the tokens returned.|
