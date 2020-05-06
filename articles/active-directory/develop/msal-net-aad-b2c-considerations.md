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
# Azure AD B2C and MSAL.NET so I can decide if this platform meets my application development needs and requirements.
---

# Use MSAL.NET to sign in users with social identities

You can use MSAL.NET to sign in users with social identities by using [Azure Active Directory B2C (Azure AD B2C)](https://aka.ms/aadb2c). Azure AD B2C is built around the notion of policies. In MSAL.NET, specifying a policy translates to providing an authority.

- When you instantiate the public client application, you need to specify the policy in authority.
- When you want to apply a policy, you need to call an override of `AcquireTokenInteractive` containing an `authority` parameter.

This page is for MSAL 3.x. If you are interested in MSAL 2.x, please see [Azure AD B2C specifics in MSAL 2.x](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/AAD-B2C-Specifics-MSAL-2.x).

## Authority for a Azure AD B2C tenant and policy

The authority to use is `https://{azureADB2CHostname}/tfp/{tenant}/{policyName}` where:

- `azureADB2CHostname` is the name of the Azure AD B2C tenant plus the host (for example `{your-tenant-name}.b2clogin.com`),
- `tenant` is the full name of the Azure AD B2C tenant (for example, `{your-tenant-name}.onmicrosoft.com`) or the GUID for the tenant,
- `policyName` the name of the policy or user flow to apply (for instance "b2c_1_susi" for sign-up/sign-in).

For more information on the Azure AD B2C authorities, see this [documentation](/azure/active-directory-b2c/b2clogin).

## Instantiating the application

When building the application, you need to provide the authority.

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

Acquiring a token for an Azure AD B2C protected API in a public client application requires you to use the overrides with an authority:

```csharp
IEnumerable<IAccount> accounts = await application.GetAccountsAsync();
AuthenticationResult ar = await application .AcquireTokenInteractive(scopes)
                                            .WithAccount(GetAccountByPolicy(accounts, policy))
                                            .WithParentActivityOrWindow(ParentActivityOrWindow)
                                            .ExecuteAsync();
```

with:

- `policy` being one of the previous strings (for instance `PolicySignUpSignIn`).
- `ParentActivityOrWindow` is required for Android (the Activity), and optional for other platforms which support the parent UI, such as windows in Windows and UIViewController in iOS. See more information [here on the UI dialog](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Acquiring-tokens-interactively#withparentactivityorwindow).
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

Applying a policy or user flow (for example, letting the end user edit their profile or reset their password) is currently done by calling `AcquireTokenInteractive`. In the case of these two policies, you don't use the returned token / authentication result.

## Special case of EditProfile and ResetPassword policies

When you want to provide an experience where your end users sign in with a social identity and then edit their profile, you want to apply the Azure AD B2C Edit Profile policy. The way to do this is by calling `AcquireTokenInteractive` with
the specific authority for that policy, and a Prompt set to `Prompt.NoPrompt` to prevent the account selection dialog from being displayed (as the user is already signed-in and has an active cookie session).

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
  . . .
 }
}
```
## Resource owner password credentials (ROPC) with Azure AD B2C
For more details on the ROPC flow, please see this [documentation](v2-oauth-ropc.md).

This flow is **not recommended** because your application asking a user for their password is not secure. For more information about this problem, see [this article](https://news.microsoft.com/features/whats-solution-growing-problem-passwords-says-microsoft/).

By using username/password, you are giving up a number of things:
- Core tenets of modern identity: password gets fished, replayed. Because we have this concept of a share secret that can be intercepted. This is incompatible with passwordless.
- Users who need to do MFA won't be able to sign in (as there is no interaction).
- Users won't be able to do single sign-on.

### Configure the ROPC flow in Azure AD B2C
In your Azure AD B2C tenant, create a new user flow and select **Sign in using ROPC**. This will enable the ROPC policy for your tenant. See [Configure the resource owner password credentials flow](/azure/active-directory-b2c/configure-ropc) for more details.

`IPublicClientApplication` contains a method:
```csharp
AcquireTokenByUsernamePassword(
            IEnumerable<string> scopes,
            string username,
            SecureString password)
```

This method takes as parameters:
- The *scopes* to request an access token for.
- A *username*.
- A SecureString *password* for the user.

Remember to use the authority that contains the ROPC policy.

### Limitations of the ROPC flow
 - The ROPC flow **only works for local accounts** (where you register with Azure AD B2C using an email or username). This flow does not work if federating to any of the identity providers supported by Azure AD B2C (Facebook, Google, etc.).

## Google Auth and Embedded Webview

If you are a Azure AD B2C developer using Google as an identity provider we recommand you use the system browser, as Google does not allow [authentication from embedded webviews](https://developers.googleblog.com/2016/08/modernizing-oauth-interactions-in-native-apps.html). Currently, `login.microsoftonline.com` is a trusted authority with Google. Using this authority will work with embedded webview. However using `b2clogin.com` is not a trusted authority with Google, so users will not be able to authenticate.

We will provide an update to this [issue](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/issues/688) if things change.

## Caching with Azure AD B2C in MSAL.NET

### Known issue with Azure AD B2C

MSAL.NET supports a [token cache](/dotnet/api/microsoft.identity.client.tokencache?view=azure-dotnet). The token caching key is based on the claims returned by the Identity Provider. Currently MSAL.NET needs two claims to build a token cache key:

- `tid` which is the Azure AD Tenant ID, and
- `preferred_username`

Both of these claims may be missing in Azure AD B2C scenarios because not all social identity providers (IdPs) return them in the tokens they return to Azure AD B2C.

A symptom of such a scenario is that MSAL.NET returns `Missing from the token response` when you access the `preferred_username` claim value in tokens issued by Azure AD B2C. MSAL uses the `Missing from the token response` value for `preferred_username` to maintain cache cross-compatibility between libraries.

### Workarounds

#### Mitigation for the missing tenant ID

The suggested workaround is to use [caching by policy](#acquire-a-token-to-apply-a-policy) described earlier.

Alternatively, you can use the `tid` claim if you're using [custom policies](../../active-directory-b2c/custom-policy-get-started.md) in Azure AD B2C. Custom policies can return additional claims to your application by using [claims transformation](/azure/active-directory-b2c/claims-transformation-technical-profile).

#### Mitigation for "Missing from the token response"

One option is to use the `name` claim as the preferred username. To include the `name` claim in ID tokens issued by Azure AD B2C, select **Display Name** when you configure your user flow.

For more information about specifying the claims returned by your user flows, see [Tutorial: Create user flows in Azure AD B2C](../../active-directory-b2c/tutorial-create-user-flows.md).

## Next steps

More details about acquiring tokens interactively with MSAL.NET for Azure AD B2C applications are provided in the following sample.

| Sample | Platform | Description|
|------ | -------- | -----------|
|[active-directory-b2c-xamarin-native](https://github.com/Azure-Samples/active-directory-b2c-xamarin-native) | Xamarin iOS, Xamarin Android, UWP | A Xamarin Forms app tha tuses MSAL.NET to authenticate users via Azure AD B2C and then access a web API with the tokens returned.|
