---
title: Microsoft identity web - Handling incremental consent and conditional access 
titleSuffix: Microsoft identity platform
description: Learn how to handle incremental consent and conditional access in web apps and web APIs using Microsoft identity web.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 09/28/2020
ms.author: jmprieur
ms.reviewer: marsma
ms.custom: "devx-track-csharp, aaddev"
#Customer intent: As an application developer, I want to learn how to build ASP.NET Core web apps and web api calling or not downstream apis.
---

# Handling incremental consent and conditional access in web apps and web APIs using MIcrosoft.Identity.Web

Incremental consent and conditional access have something in common, they require user interaction. This article describes what the experience is for incremental consent and conditional access. It also explains how Microsoft.Identity.Web exposes mechanisms to handle these requests for interaction.

### Incremental consent and static permissions

This first paragraph is about incremental consent versus static permissions granted by the tenant admin.

#### Incremental consent

The Microsoft identity platform allows users to incrementally consent to your application access to more resources (more web APIs) on their behalf. The platform allows users to consent to more scopes as they're needed. This mechanism is called incremental [consent](https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent). This mechanism supposes that, in a web app, a controller / Razor or Blazor page action could require some scopes. Then another controller action could require more scopes. This additional requirement will trigger an interaction with the user of the web application so that the user can consent for these new scopes. In web APIs, this interaction can't happen. That's why web APIs should pre-authorize scopes (admin consent) or forward back the request to their client.

#### Case of user flow in B2C

If you're building an Azure AD B2C application and use several user flows, you'll also need to handle incremental consent. Indeed, interaction will be required with the user.

#### Static permissions

You can also decide to not handle incremental consent. In that case, you define the permissions at app registration, and have the tenant administrator consent to them all (admin consent). Then, as you request tokens, you'll use the `{resource}/.default` [syntax](https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#the-default-scope) to get an access token for all pre-approved scopes for this given resource. You can also request specific pre-approved scopes if you wish.

If at some point, your app requests more scopes than what the admin has consented, you'll receive an `MsalUiRequiredException`, and you'll know that you need to have more scopes pre-approved by the tenant admin.

If you're a Microsoft employee building a first party application, static permissions (also named pre-authorization) are the way to go.

### Conditional access

When your web app or web API requests a token to call a (downstream) web API, it could receive, back from Azure AD, a claims challenge exception. This exception instructs the app that the user needs to provide more claims (for instance the user needs to perform multi-factor authentication). This challenge happens for some specific web APIs for which the tenant administrator has added [conditional access](https://docs.microsoft.com/azure/active-directory/develop/v2-conditional-access-dev-guide) policies. From your point of view, as an application developer, handling conditional access looks the same as handing incremental consent: the user needs will get through a consent screen, which will trigger more user flows, such as performing multi-factor authentication.

You can choose to not handle incremental consent. However, you should handle conditional access, as your web app / API could be non-functional if installed in tenants where the tenant admins decide to enable conditional access. And given incremental consent and conditional access is handled similarly Microsoft recommends that you handle these scenarios in your applications.

### How to handle conditional access and incremental consent: depends on your type of app / technology

The way for your app to handle conditional access and incremental consent is different depending on if you're building:

- a [web app](#handling-incremental-consent-or-conditional-access-in-web-apps) (where interaction is possible with the user),
- or a [web API](#handling-incremental-consent-or-conditional-access-in-web-apis) (where interaction isn't possible, and therefore where the information needs to be propagated back to the client).

For web apps, it's also different depending on the technology you use:

- ASP.NET Core [MVC controller](#in-mvc-controllers),
- [Razor page](#in-razor-pages)
- [Blazor page](#in-blazor-server).

## Handling incremental consent or conditional access in web apps

### Startup.cs

In web apps, handling conditional access and incremental consent requires an `AccountController` in the **MicrosoftIdentity** area. Microsoft.Identity.Web provides a default account controller [AccountController](https://github.com/AzureAD/microsoft-identity-web/blob/master/src/Microsoft.Identity.Web.UI/Areas/MicrosoftIdentity/Controllers/AccountController.cs) in **Microsoft.Identity.Web.UI**, as well as default Razor [pages](https://github.com/AzureAD/microsoft-identity-web/tree/master/src/Microsoft.Identity.Web.UI/Areas/MicrosoftIdentity/Pages/Account). You can [override](https://docs.microsoft.com/aspnet/core/razor-pages/ui-class?tabs=visual-studio#override-views-partial-views-and-pages) the Razor pages in your application if you want to provide a different user interface. To use this account controller, you'll need to add `.AddMicrosoftIdentityUI()` to `AddControllersWithViews` in the `ConfigureServices(IServiceCollection services)` method in your **startup.cs** file:

```CSharp
public void ConfigureServices(IServiceCollection services)
{
 services.AddMicrosoftIdentityWebAppAuthentication(Configuration, "AzureAd")
           .EnableTokenAcquisitionToCallDownstreamApi(scopes)
             .AddInMemoryTokenCaches();

 // more here
 services.AddControllersWithViews()
         .AddMicrosoftIdentityUI();
}
```

You'll also need to make sure that routes are mapped to the controller, which might not be the case by default if you create a Blazor application and don't use the Microsoft.Identity.Web templates. Make sure that in the `app.UseEndPoints` delegate in the `Configure(IApplicationBuilder app, IWebHostEnvironment env)` method, you call `endpoints.MapControllers()`.

```CSharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
  app.UseAuthentication();
  app.UseAuthorization();

  // more here
  app.UseEndpoints(endpoints =>
  {
   endpoints.MapControllers();
   // More here
  });
}
```

### In MVC controllers

To let Microsoft.Identity.Web handle incremental consent and conditional access automatically, in MVC controllers, you'll need to use the `[AuthorizeForScopes]` attribute. This attribute can be set:

- on the controller, itself, providing the default scope for all actions in the controller, unless you add an `[AuthorizeForScopes]` attribute on a particular action
- on controller actions when you want an action to have a different (probably more granular) scope.

The code snippet shows the Authorize for scopes attribute using "user.read" on all actions but `{"user.read", "user.write"}` on the `Write` controller action:

```CSharp
[Authorize]
[AuthorizeForScopes(Scopes = new string[] {"user.read"})]
public class HomeController : Controller
{
 private readonly ITokenAcquisition _tokenAcquisition;

 public HomeController(ITokenAcquisition tokenAcquisition)
 {
  _tokenAcquisition = tokenAcquisition;
 }

 public async Task<IActionResult> Index()
 {
  var accessToken = tokenAcquisition.GetAccessTokenForUserAsync(new string[] {"user.read"});
  // Call API
  return View();
 }

 [AuthorizeForScopes(Scopes = new string[] {"user.read", "user.write"})]
 public async Task<IActionResult> Write()
 {
  var accessToken = tokenAcquisition.GetAccessTokenForUserAsync(new string[] {"user.read", "user.write"});
  // Call API
  return View();
 }
}
```

Alternatively to hard coding the scopes in the code, you can specify the scopes in the appsetttings.json file as a space separated strings, and reference the corresponding configuration section/key in the code using the `ScopeKeySection` property of the `AuthorizeForScopes` attribute.

```JSON
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    /* more here*/
  },
  "CalledApi": {
    "CalledApiScopes": "user.read mail.read",
    "CalledApiUrl": "https://graph.microsoft.com/v1.0"
  },
```

In the controller:

```CSharp
 [AuthorizeForScopes(ScopeKeySection = "CalledApi:CalledApiScopes")]
 public async Task<IActionResult> Index()
 {
  var accessToken = tokenAcquisition.GetAccessTokenForUserAsync(scopesFromResources);
  // Call API
  return View();
 }
```

### In Razor pages

In Razor pages, you'll need to use the [AuthorizeForScopes] attribute on the class representing the Razor page (inheriting from **PageModel**)

```CSharp
namespace RazorSample.Pages
{
    [AuthorizeForScopes(ScopeKeySection = "CalledApi:CalledApiScopes")]
    public class IndexModel : PageModel
    {
        private readonly GraphServiceClient _graphServiceClient;

        public IndexModel(GraphServiceClient graphServiceClient)
        {
            _graphServiceClient = graphServiceClient;
        }

        public async Task OnGet()
        {
            var user = await _graphServiceClient.Me.Request().GetAsync();

            ViewData["ApiResult"] = user.DisplayName;
        }
    }
```

### In Blazor server

In Blazor server, you'll need to inject a service, and catch the exceptions so that the user is re-signed-in, consents and performs conditional access. The code below presents a Blazor page named **callwebapi** in a Blazor server assembly.

#### In the Startup.cs file

You'll need to register the Microsoft Identity consent and conditional access handler service in **startup.cs**:

Replace

```CSharp
 services.AddServerSideBlazor();
```

by

```CSharp
 services.AddServerSideBlazor()
         .AddMicrosoftIdentityConsentHandler();
```

#### In the Blazor page itself

In each Blazor page acquiring tokens, you'll use the Microsoft Identity consent and conditional access handler service to handle the exception:

You need to:

- add a using for Microsoft.Identity.Web
- inject the `MicrosoftIdentityConsentAndConditionalAccessHandler` service.

  ```CSharp
  @using Microsoft.Identity.Web
  @inject MicrosoftIdentityConsentAndConditionalAccessHandler ConsentHandler
  ```

- When you acquire your token (or call a method that acquires a token), if you get an exception, you'll need to process it with the `MicrosoftIdentityConsentAndConditionalAccessHandler`:

  ```CSharp
    catch (Exception ex)
    {
     ConsentHandler.HandleException(ex);
    }
  ```

For instance:

```CSharp
@page "/callwebapi"

@using MySample
@using Microsoft.Identity.Web
@inject MicrosoftIdentityConsentAndConditionalAccessHandler ConsentHandler
@inject IDownstreamWebApi downstreamAPI

<h1>Call an API</h1>

<p>This component demonstrates fetching data from a Web API.</p>

@if (apiResult == null)
{
    <p><em>Loading...</em></p>
}
else
{
    <h2>API Result</h2>
    @apiResult
}

@code {
    private string apiResult;

    protected override async Task OnInitializedAsync()
    {
        try
        {
            // downstreamAPI.CallWebApiAsync calls ITokenAcquisition.GetAccessTokenForUserAsync
            apiResult = await downstreamAPI.CallWebApiAsync("me");
        }
        catch (Exception ex)
        {
            ConsentHandler.HandleException(ex);
        }
    }
}
```

## Handling incremental consent or conditional access in web APIs

Web APIs can't have an interaction with the user (they have no UI). That's why they need to propagate back the request for interaction to the client. Therefore, in a web API, your controller action will need to explicitly call `ITokenAcquisition.ReplyForbiddenWithWwwAuthenticateHeaderAsync` so that the web API replies to the client with a wwwAuthenticate header containing information about missing claims.

```CSharp
public async Task<string> CallGraphApiOnBehalfOfUser()
{
 string[] scopes = { "user.read" };

 // we use MSAL.NET to get a token to call the API On Behalf Of the current user
 try
 {
  string accessToken = await _tokenAcquisition.GetAccessTokenForUserAsync(scopes);
  dynamic me = await CallGraphApiOnBehalfOfUser(accessToken);
  return me.UserPrincipalName;
 }
 catch (MicrosoftIdentityWebChallengeUserException ex)
 {
  await _tokenAcquisition.ReplyForbiddenWithWwwAuthenticateHeaderAsync(scopes, ex.MsalUiRequiredException);
  return string.Empty;
 }
 catch (MsalUiRequiredException ex)
 {
  await _tokenAcquisition.ReplyForbiddenWithWwwAuthenticateHeaderAsync(scopes, ex);
  return string.Empty;
 }
}
```

In some cases (Blazor applications, SignalR), `ReplyForbiddenWithWwwAuthenticateHeaderAsync` can't access the HttpContext, and you'll get an InvalidOperationException with the following message: "IDW10002: Current HttpContext and HttpResponse argument are null. Pass an HttpResponse argument. ". If that's the case, you can pass the `HttpResponse` as the last argument:

```CSharp
 catch (MsalUiRequiredException ex)
 {
  await _tokenAcquisition.ReplyForbiddenWithWwwAuthenticateHeaderAsync(scopes, ex, HttpContext.Reponse);
  return string.Empty;
 }
}
```
