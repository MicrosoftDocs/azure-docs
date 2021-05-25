---
title: Enable web application options using Azure Active Directory B2C
description:  Enable the use of web application options by using several ways.
services: active-directory-b2c
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 05/25/2021
ms.author: mimart
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Configure authentication in a sample web application using Azure Active Directory B2C options

This article describes ways you can customize and enhance the Azure Active Directory B2C (Azure AD B2C) authentication experience for your web application. Before you start, familiarize yourself with the following articles: [Configure authentication in a sample web application](configure-authentication-sample-web-app.md) or [Enable authentication in your own web application](enable-authentication-web-application.md).

## Use a custom domain

Using a [custom domain](custom-domain.md) in your application's redirect URL provides a more seamless user experience. From the user's perspective, the user remains in your domain during the sign-in process rather than redirecting to the Azure AD B2C default domain .b2clogin.com.

To use a custom domain, follow the guidance in [Enable custom domains](custom-domain.md). Under the project root folder, open the `appsettings.json` file. This file contains information about your Azure AD B2C identity provider. Update the `Instance` entry with your custom domain.

The following JSON shows the app settings before the change: 

```JSon
"AzureAdB2C": {
  "Instance": "https://contoso.b2clogin.com",
  ...
}
```  

The following JSON shows the app settings after the change: 

```JSon
"AzureAdB2C": {
  "Instance": "https://login.contoso.com",
  ...
}
``` 

## Use your tenant ID

You can replace your B2C tenant name in the URL with your tenant ID GUID to remove all references to “b2c” in the URL.  For example, you can change `https://account.contosobank.co.uk/contosobank.onmicrosoft.com/` to `https://account.contosobank.co.uk/<tenant ID GUID>/`

To use the tenant ID, follow the guidance [Enable custom domains](custom-domain.md#optional-use-tenant-id). Under the project root folder, open the `appsettings.json` file. This file contains information about your Azure AD B2C identity provider. Update the `Domain` entry with your custom domain.

The following JSON demonstrates the app settings before the change: 

```JSon
"AzureAdB2C": {
  "Domain": "tenant-name.onmicrosoft.com",
  ...
}
```  

The following JSON demonstrates the app settings after the change:

```JSon
"AzureAdB2C": {
  "Domain": "00000000-0000-0000-0000-000000000000",
  ...
}
``` 

## Support advanced scenarios

The `AddMicrosoftIdentityWebAppAuthentication` method in the Microsoft identity platform API lets developers add code for advanced authentication scenarios or subscribe to OpenIdConnect events. For example, you can subscribe to OnRedirectToIdentityProvider, which allows you to customize the authentication request your app sends to Azure AD B2C.

To support advanced scenarios, open the `Startup.cs`, and in the `ConfigureServices` function, replace the `AddMicrosoftIdentityWebAppAuthentication` with the following code snippet: 

```csharp
// Configuration to sign-in users with Azure AD B2C

//services.AddMicrosoftIdentityWebAppAuthentication(Configuration, "AzureAdB2C");

services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
        .AddMicrosoftIdentityWebApp(options =>
{
    Configuration.Bind("AzureAdB2C", options);
    options.Events ??= new OpenIdConnectEvents();
    options.Events.OnRedirectToIdentityProvider += OnRedirectToIdentityProviderFunc;
});
```

The code above adds the OnRedirectToIdentityProvider event with a reference to the *OnRedirectToIdentityProviderFunc* method. Add the following code snippet to the `Startup.cs` class.

```csharp
private async Task OnRedirectToIdentityProviderFunc(RedirectContext context)
{
    // Custom code here
    
    // Don't remove this line
    await Task.CompletedTask.ConfigureAwait(false);
}
```

You can pass parameters between your controller and the *OnRedirectToIdentityProvider* function using context parameters. 


## Prepopulate the sign-in name

During a sign-in user journey, your app may target a specific user. When targeting a user, an application can specify in the authorization request, the `login_hint` query parameter with the user sign-in name. Azure AD B2C automatically populates the sign-in name, and the user only needs to provide the password. 

To prepopulate the sign-in name, follow these steps:

1. Complete the [Support advanced scenarios](#support-advanced-scenarios) procedure.
1. If you're using a custom policy, add the required input claim as described in [Set up direct sign-in](direct-signin.md#prepopulate-the-sign-in-name). 
1. Add the following line of code to the *OnRedirectToIdentityProvider* function:
    
    ```csharp
    private async Task OnRedirectToIdentityProviderFunc(RedirectContext context)
    {
      context.ProtocolMessage.LoginHint = "emily@contoso.com";
      
      // More code
      await Task.CompletedTask.ConfigureAwait(false);
    }
    ```

## Redirect sign-in to an external identity provider

If you configured the sign-in journey for your application to include social accounts, such as Facebook, LinkedIn, or Google, you can specify the `domain_hint` parameter. This query parameter provides a hint to Azure AD B2C about the social identity provider that should be used for sign-in. For example, if the application specifies `domain_hint=facebook.com`, the sign-in flow goes directly to the Facebook sign-in page. 

To redirect sign-in to an external identity provider, follow these steps:

1. Complete the [Support advanced scenarios](#support-advanced-scenarios) procedure.
1. Check the domain name of your external identity provider. For more information, see [Redirect sign-in to a social provider](direct-signin.md#redirect-sign-in-to-a-social-provider). 
1. In the *OnRedirectToIdentityProviderFunc* function, add the following line of code to the *OnRedirectToIdentityProvider* function:
    
    ```csharp
    private async Task OnRedirectToIdentityProviderFunc(RedirectContext context)
    {
      context.ProtocolMessage.DomainHint = "facebook.com";
      
      // More code
      await Task.CompletedTask.ConfigureAwait(false);
    }
    ```

## Specify the UI language

Language customization in Azure AD B2C allows your user flow to accommodate different languages to suit your customer needs. For more information, see [Language customization](language-customization.md).

To set the preferred language, follow these steps:

1. Complete the [Support advanced scenarios](#support-advanced-scenarios) procedure.
1. Add the following line of code to the *OnRedirectToIdentityProvider* function:

    ```csharp
    private async Task OnRedirectToIdentityProviderFunc(RedirectContext context)
    {
      context.ProtocolMessage.UiLocales = "es";

      // More code
      await Task.CompletedTask.ConfigureAwait(false);
    }
    ```

## Pass a custom query string parameter

With custom policies you can pass a custom query string parameter, for example when you want to [dynamically change the page content](customize-ui-with-html.md?pivots=b2c-custom-policy#configure-dynamic-custom-page-content-uri).


To pass a custom query string parameter, follow these steps:

1. Complete the [Support advanced scenarios](#support-advanced-scenarios) procedure.
1. Add the following line of code to the *OnRedirectToIdentityProvider* function:
    
    ```csharp
    private async Task OnRedirectToIdentityProviderFunc(RedirectContext context)
    {
      context.ProtocolMessage.Parameters.Add("campaignId", "123");

      // More code
      await Task.CompletedTask.ConfigureAwait(false);
    }
    ```

## Pass ID token hint

Azure AD B2C allows relying party applications to send an inbound JWT as part of the OAuth2 authorization request. The JWT token can be issued by a relying party application or an identity provider, and it can pass a hint about the user or the authorization request. Azure AD B2C validates the signature, issuer name, and token audience, and extracts the claim from the inbound token.

To include an ID token hint in the authentication request, follow these steps: 

1. Complete the [Support advanced scenarios](#support-advanced-scenarios) procedure.
1. In your custom policy, define an [ID token hint technical profile](id-token-hint.md).
1. Add the following line of code to the *OnRedirectToIdentityProvider* function:
    
    ```csharp
    private async Task OnRedirectToIdentityProviderFunc(RedirectContext context)
    {
      // The idTokenHint variable holds your ID token 
      context.ProtocolMessage.IdTokenHint = idTokenHint

      // More code
      await Task.CompletedTask.ConfigureAwait(false);
    }
    ```
    
## Account controller

If you want to customize the **Sign-in**, **Sign-up** or **Sign-out** actions, you are encouraged to create your own controller. Having your own controller allows you to pass parameters between your controller and the authentication library. The `AccountController` is part of `Microsoft.Identity.Web.UI`  NuGet package, which handles the sign-in and sign-out actions. You can find its implementation in the [Microsoft Identity Web library](https://github.com/AzureAD/microsoft-identity-web/blob/master/src/Microsoft.Identity.Web.UI/Areas/MicrosoftIdentity/Controllers/AccountController.cs). 

The following code snippet demonstrates a custom `MyAccountController` with the **SignIn** action. The action passes a parameter named `campaign_id` to the authentication library.

```csharp
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace mywebapp.Controllers
{
    [AllowAnonymous]
    [Area("MicrosoftIdentity")]
    [Route("[area]/[controller]/[action]")]
    public class MyAccountController : Controller
    {

        [HttpGet("{scheme?}")]
        public IActionResult SignIn([FromRoute] string scheme)
        {
            scheme ??= OpenIdConnectDefaults.AuthenticationScheme;
            var redirectUrl = Url.Content("~/");
            var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
            properties.Items["campaign_id"] = "1234";
            return Challenge(properties, scheme);
        }

    }
}

```

In the `_LoginPartial.cshtml` view, change the sign-in link to your controller

```
<form method="get" asp-area="MicrosoftIdentity" asp-controller="MyAccount" asp-action="SignIn">
```

In the `OnRedirectToIdentityProvider` in the `Startup.cs` calls, you can read the custom parameter:

```csharp
private async Task OnRedirectToIdentityProviderFunc(RedirectContext context)
{
    // Read the custom parameter
    var campaign_id = (context.Properties.Items.ContainsKey("campaign_id"))
    
    // Add your custom code here
    
    await Task.CompletedTask.ConfigureAwait(false);
}
```

## Role-based access control

With [authorization in ASP.NET Core](/aspnet/core/security/authorization/introduction) you can use [role-based authorization](/aspnet/core/security/authorization/roles), [claims-based authorization](/aspnet/core/security/authorization/claims), or [policy-based authorization](/aspnet/core/security/authorization/policies) to check if the user is authorized to access a protected resource.

In the *ConfigureServices* method, add the *AddAuthorization* method, which adds the authorization model. The following example creates a policy named `EmployeeOnly`. The policy checks that a claim `EmployeeNumber` exists. The value of the claim must be one of the following IDs: 1, 2, 3, 4 or 5.

```csharp
services.AddAuthorization(options =>
    {
        options.AddPolicy("EmployeeOnly", policy =>
              policy.RequireClaim("EmployeeNumber", "1", "2", "3", "4", "5"));
    });
```

Authorization in ASP.NET Core is controlled with [AuthorizeAttribute](/aspnet/core/security/authorization/simple) and its various parameters. In its most basic form, applying the `[Authorize]` attribute to a controller, action, or Razor Page, limits access to that component's authenticated users.

Policies are applied to controllers by using the `[Authorize]` attribute with the policy name. The following code limits access to the `Claims` action to  users authorized by the `EmployeeOnly` policy:

```csharp
[Authorize(Policy = "EmployeeOnly")]
public IActionResult Claims()
{
    return View();
}
```

## Next steps

- Learn more: [Introduction to authorization in ASP.NET Core](/aspnet/core/security/authorization/introduction)