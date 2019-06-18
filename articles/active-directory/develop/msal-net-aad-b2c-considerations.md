---
title: Azure AD B2C (Microsoft Authentication Library for .NET) | Azure
description: Learn about specific considerations when using Azure AD B2C with the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/24/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about specific considerations when using Azure AD B2C and MSAL.NET so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Use MSAL.NET to sign in users with social identities

You can use MSAL.NET to sign in users with social identities by using [Azure Active Directory B2C (Azure AD B2C)](https://aka.ms/aadb2c). Azure AD B2C is built around the notion of policies. In MSAL.NET, specifying a policy translates to providing an authority.

- When you instantiate the public client application, you need to specify the policy in authority.
- When you want to apply a policy, you need to call an override of `AcquireTokenInteractive` containing an `authority` parameter.

This page is for MSAL 3.x. If you are interested in MSAL 2.x, please see [Azure AD B2C specifics in MSAL 2.x](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/AAD-B2C-Specifics-MSAL-2.x).

## Authority for a Azure AD B2C tenant and policy

The authority to use is `https://login.microsoftonline.com/tfp/{tenant}/{policyName}` where:

- `tenant` is the name of the Azure AD B2C tenant, 
- `policyName` the name of the policy to apply (for instance "b2c_1_susi" for sign-in/sign-up).

The current guidance from Azure AD B2C is to use `b2clogin.com` as the authority. For example, `$"https://{your-tenant-name}.b2clogin.com/tfp/{your-tenant-ID}/{policyname}"`. For more information, see this [documentation](/azure/active-directory-b2c/b2clogin).

## Instantiating the application

When building the application, you need to provide the authority.

```csharp
// Azure AD B2C Coordinates
public static string Tenant = "fabrikamb2c.onmicrosoft.com";
public static string ClientID = "90c0fe63-bcf2-44d5-8fb7-b8bbc0b29dc6";
public static string PolicySignUpSignIn = "b2c_1_susi";
public static string PolicyEditProfile = "b2c_1_edit_profile";
public static string PolicyResetPassword = "b2c_1_reset";

public static string AuthorityBase = $"https://fabrikamb2c.b2clogin.com/tfp/{Tenant}/";
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
AuthenticationResult ar = await application .AcquireToken(scopes, parentWindow)
                                            .WithAccount(GetAccountByPolicy(accounts, policy))
                                            .ExecuteAsync();
```

with:

- `policy` being one of the previous strings (for instance `PolicySignUpSignIn`).
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

Applying a policy (for example letting the end user edit their profile or reset their password) is currently done by calling `AcquireTokenInteractive`. In the case of these two policies you don't use the returned token / authentication result.

## Special case of EditProfile and ResetPassword policies

When you want to provide an experience where your end-users sign in with a social identity, and then edit their profile you want to apply the Azure AD B2C EditProfile policy. The way to do this, is by calling `AcquireTokenInteractive` with
the specific authority for that policy and a Prompt set to `Prompt.NoPrompt` to avoid the account selection dialog to be displayed (as the user is already signed-in)

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

By using username/password, you are giving-up a number of things:
- core tenants of modern identity: password gets fished, replayed. Because we have this concept of a share secret that can be intercepted. This is incompatible with passwordless.
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
 - Currently, there is **no id_token returned from Azure AD B2C** when implementing the ROPC flow from MSAL. This means an Account object cannot be created, so in the cache, there will be no Account and no user. The AcquireTokenSilent flow will not work in this scenario. However, ROPC does not show a UI, so there will no impact to the user experience.

## Google Auth and Embedded Webview

If you are a Azure AD B2C developer using Google as an identity provider we recommand you use the system browser, as Google does not allow [authentication from embedded webviews](https://developers.googleblog.com/2016/08/modernizing-oauth-interactions-in-native-apps.html). Currently, `login.microsoftonline.com` is a trusted authority with Google. Using this authority will work with embedded webview. However using `b2clogin.com` is not a trusted authority with Google, so users will not be able to authenticate.

We will provide an update to the wiki and this [issue](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/issues/688) if things change.

## Caching with Azure AD B2C in MSAL.Net 

### Known issue with Azure AD B2C

MSAL.Net supports a [token cache](/dotnet/api/microsoft.identity.client.tokencache?view=azure-dotnet). The token caching key is based on the claims returned by the Identity Provider. Currently MSAL.Net needs two claims to build a token cache key:  
- `tid` which is the Azure AD Tenant ID, and 
- `preferred_username` 

Both these claims are missing in many of the Azure AD B2C scenarios. 

The customer impact is that when trying to display the username field, are you getting "Missing from the token response" as the value? If so, this is because Azure AD B2C does not return a value in the IdToken for the preferred_username because of limitations with the social accounts and external identity providers (IdPs). Azure AD returns a value for preferred_username because it knows who the user is, but for Azure AD B2C, because the user can sign in with a local account, Facebook, Google, GitHub, etc. there is not a consistent value for Azure AD B2C to use for preferred_username. To unblock MSAL from rolling out cache compatibility with ADAL, we decided to use "Missing from the token response" on our end when dealing with the Azure AD B2C accounts when the IdToken returns nothing for preferred_username. MSAL must return a value for preferred_username to maintain cache compatibility across libraries.

### Workarounds

#### Mitigation for the missing tenant ID

The suggested workaround is to use the [Caching by Policy](#acquire-a-token-to-apply-a-policy)

Alternatively, you can use the `tid` claim, if you are using the [B2C custom policies](https://aka.ms/ief), because it provides the capability to return additional claims to the application. To learn more about [Claims Transformation](/azure/active-directory-b2c/claims-transformation-technical-profile)

#### Mitigation for "Missing from the token response"
One option is to use the "name" claim as the preferred username. The process is mentioned in this [B2C doc](../../active-directory-b2c/active-directory-b2c-reference-policies.md) -> "In the Return claim column, choose the claims you want returned in the authorization tokens sent back to your application after a successful profile editing experience. For example, select Display Name, Postal Code.”

## Next steps 

More details about acquiring tokens interactively with MSAL.NET for Azure AD B2C applications are provided in the following sample.

| Sample | Platform | Description|
|------ | -------- | -----------|
|[active-directory-b2c-xamarin-native](https://github.com/Azure-Samples/active-directory-b2c-xamarin-native) | Xamarin iOS, Xamarin Android, UWP | A simple Xamarin Forms app showcasing how to use MSAL.NET to authenticate users via Azure AD B2C, and access a Web API with the resulting tokens.|
