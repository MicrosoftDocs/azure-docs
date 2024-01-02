---
title: Enable web app authentication options using Azure Active Directory B2C
description:  This article discusses several ways to enable web app authentication options.

author: kengaderdus
manager: CelesteDG
ms.service: active-directory

ms.topic: reference
ms.date: 08/12/2021
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Enable authentication options in a web app by using Azure AD B2C 

This article describes how to enable, customize, and enhance the Azure Active Directory B2C (Azure AD B2C) authentication experience for your web application. 

Before you start, it's important to familiarize yourself with the following articles: 
* [Configure authentication in a sample web app](configure-authentication-sample-web-app.md)
* [Enable authentication in your own web app](enable-authentication-web-application.md).

[!INCLUDE [active-directory-b2c-app-integration-custom-domain](../../includes/active-directory-b2c-app-integration-custom-domain.md)]

To use a custom domain and your tenant ID in the authentication URL, follow the guidance in [Enable custom domains](custom-domain.md). Under the project root folder, open the *appsettings.json* file. This file contains information about your Azure AD B2C identity provider.

In the *appsettings.json* file, do the following:

- Update the `Instance` entry with your custom domain.
- Update the `Domain` entry with your [tenant ID]( tenant-management-read-tenant-name.md#get-your-tenant-id). For more information, see [Use tenant ID](custom-domain.md#optional-use-tenant-id).

The following JSON shows the app settings before the change: 

```JSON
"AzureAdB2C": {
  "Instance": "https://contoso.b2clogin.com",
  "Domain": "tenant-name.onmicrosoft.com",
  ...
}
```  

The following JSON shows the app settings after the change: 

```JSON
"AzureAdB2C": {
  "Instance": "https://login.contoso.com",
  "Domain": "00000000-0000-0000-0000-000000000000",
  ...
}
``` 

## Support advanced scenarios

The `AddMicrosoftIdentityWebAppAuthentication` method in the Microsoft identity platform API lets developers add code for advanced authentication scenarios or subscribe to OpenIdConnect events. For example, you can subscribe to OnRedirectToIdentityProvider, which allows you to customize the authentication request your app sends to Azure AD B2C.

To support advanced scenarios, open the *Startup.cs* file and, in the `ConfigureServices` function, replace `AddMicrosoftIdentityWebAppAuthentication` with the following code snippet: 

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

The preceding code adds the OnRedirectToIdentityProvider event with a reference to the `OnRedirectToIdentityProviderFunc` method. Add the following code snippet to the `Startup.cs` class.

```csharp
private async Task OnRedirectToIdentityProviderFunc(RedirectContext context)
{
    // Custom code here
    
    // Don't remove this line
    await Task.CompletedTask.ConfigureAwait(false);
}
```

You can pass parameters between your controller and the `OnRedirectToIdentityProvider` function by using context parameters. 

[!INCLUDE [active-directory-b2c-app-integration-login-hint](../../includes/active-directory-b2c-app-integration-login-hint.md)]

1. If you're using a custom policy, add the required input claim, as described in [Set up direct sign-in](direct-signin.md#prepopulate-the-sign-in-name). 
1. Complete the [Support advanced scenarios](#support-advanced-scenarios) procedure.
1. Add the following line of code to the `OnRedirectToIdentityProvider` function:
    
    ```csharp
    private async Task OnRedirectToIdentityProviderFunc(RedirectContext context)
    {
      context.ProtocolMessage.LoginHint = "emily@contoso.com";
      
      // More code
      await Task.CompletedTask.ConfigureAwait(false);
    }
    ```

[!INCLUDE [active-directory-b2c-app-integration-domain-hint](../../includes/active-directory-b2c-app-integration-domain-hint.md)]

1. Check the domain name of your external identity provider. For more information, see [Redirect sign-in to a social provider](direct-signin.md#redirect-sign-in-to-a-social-provider). 
1. Complete the [Support advanced scenarios](#support-advanced-scenarios) procedure.
1. In the `OnRedirectToIdentityProviderFunc` function, add the following line of code to the `OnRedirectToIdentityProvider` function:
    
    ```csharp
    private async Task OnRedirectToIdentityProviderFunc(RedirectContext context)
    {
      context.ProtocolMessage.DomainHint = "facebook.com";
      
      // More code
      await Task.CompletedTask.ConfigureAwait(false);
    }
    ```


[!INCLUDE [active-directory-b2c-app-integration-ui-locales](../../includes/active-directory-b2c-app-integration-ui-locales.md)]

1. [Configure language customization](language-customization.md).
1. Complete the [Support advanced scenarios](#support-advanced-scenarios) procedure.
1. Add the following line of code to the `OnRedirectToIdentityProvider` function:

    ```csharp
    private async Task OnRedirectToIdentityProviderFunc(RedirectContext context)
    {
      context.ProtocolMessage.UiLocales = "es";

      // More code
      await Task.CompletedTask.ConfigureAwait(false);
    }
    ```

[!INCLUDE [active-directory-b2c-app-integration-custom-parameters](../../includes/active-directory-b2c-app-integration-custom-parameters.md)]

1. Configure the [ContentDefinitionParameters](customize-ui-with-html.md#configure-dynamic-custom-page-content-uri) element.
1. Complete the [Support advanced scenarios](#support-advanced-scenarios) procedure.
1. Add the following line of code to the `OnRedirectToIdentityProvider` function:
    
    ```csharp
    private async Task OnRedirectToIdentityProviderFunc(RedirectContext context)
    {
      context.ProtocolMessage.Parameters.Add("campaignId", "123");

      // More code
      await Task.CompletedTask.ConfigureAwait(false);
    }
    ```


[!INCLUDE [active-directory-b2c-app-integration-id-token-hint](../../includes/active-directory-b2c-app-integration-id-token-hint.md)]

1. Complete the [Support advanced scenarios](#support-advanced-scenarios) procedure.
1. In your custom policy, define an [ID token hint technical profile](id-token-hint.md).
1. Add the following line of code to the `OnRedirectToIdentityProvider` function:
    
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

If you want to customize the *SignIn*, *SignUp*, or *SignOut* actions, we encourage you to create your own controller. Having your own controller allows you to pass parameters between your controller and the authentication library. `AccountController` is part of `Microsoft.Identity.Web.UI` NuGet package, which handles the sign-in and sign-out actions. You can find its implementation in the [Microsoft Identity Web library](https://github.com/AzureAD/microsoft-identity-web/blob/master/src/Microsoft.Identity.Web.UI/Areas/MicrosoftIdentity/Controllers/AccountController.cs). 

### Add the Account controller

In your Visual Studio project, right-click the *Controllers* folder, and then add a new **Controller**. Select **MVC - Empty Controller**, and then provide the name **MyAccountController.cs**.

The following code snippet demonstrates a custom `MyAccountController` with the *SignIn* action.

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
            return Challenge(properties, scheme);
        }

    }
}
```

In the *_LoginPartial.cshtml* view, change the sign-in link to your controller.

```html
<form method="get" asp-area="MicrosoftIdentity" asp-controller="MyAccount" asp-action="SignIn">
```

### Pass the Azure AD B2C policy ID

The following code snippet demonstrates a custom `MyAccountController` with the **SignIn** and **SignUp** action. The action passes a parameter named `policy` to the authentication library. This allows you to provide the correct Azure AD B2C policy ID for the specific action.

```csharp
public IActionResult SignIn([FromRoute] string scheme)
{
    scheme ??= OpenIdConnectDefaults.AuthenticationScheme;
    var redirectUrl = Url.Content("~/");
    var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
    properties.Items["policy"] = "B2C_1_SignIn";
    return Challenge(properties, scheme);
}

public IActionResult SignUp([FromRoute] string scheme)
{
    scheme ??= OpenIdConnectDefaults.AuthenticationScheme;
    var redirectUrl = Url.Content("~/");
    var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
    properties.Items["policy"] = "B2C_1_SignUp";
    return Challenge(properties, scheme);
}
```

In the *_LoginPartial.cshtml* view, change the `asp-controller` value to `MyAccountController` for any other authentication links, such as sign-up or edit profile.

### Pass custom parameters

The following code snippet demonstrates a custom `MyAccountController` with the **SignIn** action. The action passes a parameter named `campaign_id` to the authentication library.

```csharp
public IActionResult SignIn([FromRoute] string scheme)
{
    scheme ??= OpenIdConnectDefaults.AuthenticationScheme;
    var redirectUrl = Url.Content("~/");
    var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
    properties.Items["policy"] = "B2C_1_SignIn";
    properties.Items["campaign_id"] = "1234";
    return Challenge(properties, scheme);
}
```

Complete the [Support advanced scenarios](#support-advanced-scenarios) procedure and then, in the `OnRedirectToIdentityProvider` method, read the custom parameter:

```csharp
private async Task OnRedirectToIdentityProviderFunc(RedirectContext context)
{
    // Read the custom parameter
    var campaign_id = context.Properties.Items.FirstOrDefault(x => x.Key == "campaign_id").Value;

    // Add your custom code here
    if (campaign_id != null)
    {
        // Send parameter to authentication request
        context.ProtocolMessage.SetParameter("campaign_id", campaign_id);
    }
    
    await Task.CompletedTask.ConfigureAwait(false);
}
```

## Secure your logout redirect

After logout, the user is redirected to the URI specified in the `post_logout_redirect_uri` parameter, regardless of the reply URLs that have been specified for the application. However, if a valid `id_token_hint` is passed and the [Require ID Token in logout requests](session-behavior.md#secure-your-logout-redirect) is turned on, Azure AD B2C verifies that the value of `post_logout_redirect_uri` matches one of the application's configured redirect URIs before performing the redirect. If no matching reply URL was configured for the application, an error message is displayed and the user is not redirected.

To support a secured logout redirect in your application, first follow the steps in the [Account controller](enable-authentication-web-application-options.md#add-the-account-controller) and [Support advanced scenarios](#support-advanced-scenarios) sections. Then follow the steps below:

1. In `MyAccountController.cs` controller, add a **SignOut** action using the following code snippet:

    ```csharp
    [HttpGet("{scheme?}")]
    public async Task<IActionResult> SignOutAsync([FromRoute] string scheme)
    {
        scheme ??= OpenIdConnectDefaults.AuthenticationScheme;

        //obtain the id_token
        var idToken = await HttpContext.GetTokenAsync("id_token");
        //send the id_token value to the authentication middleware
        properties.Items["id_token_hint"] = idToken;            

        return SignOut(properties,CookieAuthenticationDefaults.AuthenticationScheme,scheme);
    }
    ```

1. In the **Startup.cs** class, parse the `id_token_hint` value and append the value to the authentication request. The following code snippet demonstrates how to pass the `id_token_hint` value to the authentication request:

    ```csharp
    private async Task OnRedirectToIdentityProviderForSignOutFunc(RedirectContext context)
    {
        var id_token_hint = context.Properties.Items.FirstOrDefault(x => x.Key == "id_token_hint").Value;
        if (id_token_hint != null)
        {
            // Send parameter to authentication request
            context.ProtocolMessage.SetParameter("id_token_hint", id_token_hint);
        }

        await Task.CompletedTask.ConfigureAwait(false);
    }
    ```

1. In the `ConfigureServices` function, add the `SaveTokens` option for **Controllers** have access to the `id_token` value: 

    ```csharp
    services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
        .AddMicrosoftIdentityWebApp(options =>
        {
            Configuration.Bind("AzureAdB2C", options);
            options.Events ??= new OpenIdConnectEvents();        
            options.Events.OnRedirectToIdentityProviderForSignOut += OnRedirectToIdentityProviderForSignOutFunc;
            options.SaveTokens = true;
        });
    ```

1. In the **appsettings.json** configuration file, add your logout redirect URI path to `SignedOutCallbackPath` key.

    ```json
    "AzureAdB2C": {
      "Instance": "https://<your-tenant-name>.b2clogin.com",
      "ClientId": "<web-app-application-id>",
      "Domain": "<your-b2c-domain>",
      "SignedOutCallbackPath": "/signout/<your-sign-up-in-policy>",
      "SignUpSignInPolicyId": "<your-sign-up-in-policy>"
    }
    ```

In the above example, the **post_logout_redirect_uri** passed into the logout request will be in the format: `https://your-app.com/signout/<your-sign-up-in-policy>`. This URL must be added to the Application Registration's reply URL's.

## Role-based access control

With [authorization in ASP.NET Core](/aspnet/core/security/authorization/introduction) you can check to see whether users are authorized to access a protected resource by using one of the following methods: 
* [Role-based authorization](/aspnet/core/security/authorization/roles) 
* [Claims-based authorization](/aspnet/core/security/authorization/claims) 
* [Policy-based authorization](/aspnet/core/security/authorization/policies)

In the `ConfigureServices` method, add the `AddAuthorization` method, which adds the authorization model. The following example creates a policy named `EmployeeOnly`. The policy checks to verify that a claim `EmployeeNumber` exists. The value of the claim must be one of the following IDs: 1, 2, 3, 4, or 5.

```csharp
services.AddAuthorization(options =>
    {
        options.AddPolicy("EmployeeOnly", policy =>
              policy.RequireClaim("EmployeeNumber", "1", "2", "3", "4", "5"));
    });
```

You control authorization in ASP.NET Core by using [AuthorizeAttribute](/aspnet/core/security/authorization/simple) and its various parameters. In its most basic form, applying the `Authorize` attribute to a controller, action, or Razor Page limits access to that component's authenticated users.

You apply policies to controllers by using the `Authorize` attribute with the policy name. The following code limits access to the `Claims` action to users who are authorized by the `EmployeeOnly` policy:

```csharp
[Authorize(Policy = "EmployeeOnly")]
public IActionResult Claims()
{
    return View();
}
```

## Next steps

- To learn more about authorization, see [Introduction to authorization in ASP.NET Core](/aspnet/core/security/authorization/introduction).
