---
title: Enable authentication in web apps that call a web API by using Azure Active Directory B2C building blocks
description: This article discusses the building blocks of an ASP.NET web app that calls a web API by using Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG
ms.service: active-directory

ms.topic: reference
ms.date: 11/10/2021
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Enable authentication in web apps that call a web API by using Azure AD B2C

This article shows you how to add Azure Active Directory B2C (Azure AD B2C) authentication to an ASP.NET web application that calls a web API. Learn how to create an ASP.NET Core web application with ASP.NET Core middleware that uses the [OpenID Connect](openid-connect.md) protocol. 

To use this article with [Configure authentication in a sample web app that calls a web API](configure-authentication-sample-web-app-with-api.md), replace the sample web app with your own web app.

This article focuses on the web application project. For instructions on how to create the web API, see the [ToDo list web API sample](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/4-WebApp-your-API/4-2-B2C).

## Prerequisites

Review the prerequisites and integration steps in [Configure authentication in a sample web app that calls a web API](configure-authentication-sample-web-app-with-api.md).

The following sections step you through how to add Azure Active Directory B2C (Azure AD B2C) authentication to an ASP.NET web application.

## Step 1: Create a web app project

You can use an existing ASP.NET Model View Controller (MVC) web app project or create new one. To create a new project, open a command shell, and then run the following command:

```dotnetcli
dotnet new mvc -o mywebapp
```

The preceding command creates a new MVC web app. The `-o mywebapp` parameter creates a directory named *mywebapp* with the source files for the app.

## Step 2: Add the authentication libraries

First, add the Microsoft Identity Web library. This is a set of ASP.NET Core libraries that simplify adding Azure AD B2C authentication and authorization support to your web app. The Microsoft Identity Web library sets up the authentication pipeline with cookie-based authentication. It takes care of sending and receiving HTTP authentication messages, token validation, claims extraction, and more.

To add the Microsoft Identity Web library, install the packages by running the following commands: 

# [Visual Studio](#tab/visual-studio)

```dotnetcli
dotnet add package Microsoft.Identity.Web
dotnet add package Microsoft.Identity.Web.UI
```

# [Visual Studio Code](#tab/visual-studio-code)

```dotnetcli
Install-Package Microsoft.Identity.Web
Install-Package Microsoft.Identity.Web.UI
```

---

## Step 3: Initiate the authentication libraries

The Microsoft Identity Web middleware uses a startup class that runs when the hosting process starts. In this step, you add the necessary code to initiate the authentication libraries.

Open `Startup.cs` and add the following `using` declarations at the beginning of the class:

```csharp
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.UI;
```

Because Microsoft Identity Web uses cookie-based authentication to protect your web app, the following code sets the *SameSite* cookie settings. Then it reads the `AzureADB2C` application settings and initiates the middleware controller with its view. 

Replace the `ConfigureServices(IServiceCollection services)` function with the following code snippet: 

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.Configure<CookiePolicyOptions>(options =>
    {
        // This lambda determines whether user consent for non-essential cookies is needed for a given request.
        options.CheckConsentNeeded = context => true;
        options.MinimumSameSitePolicy = SameSiteMode.Unspecified;
        // Handling SameSite cookie according to https://learn.microsoft.com/aspnet/core/security/samesite?view=aspnetcore-3.1
        options.HandleSameSiteCookieCompatibility();
    });

    // Configuration to sign in users with Azure AD B2C
    services.AddMicrosoftIdentityWebAppAuthentication(Configuration, "AzureAdB2C")
            // Enable token acquisition to call downstream web API
            .EnableTokenAcquisitionToCallDownstreamApi(new string[] { Configuration["TodoList:TodoListScope"] })
            // Add refresh token in-memory cache
            .AddInMemoryTokenCaches();

    services.AddControllersWithViews()
        .AddMicrosoftIdentityUI();

    services.AddRazorPages();

    //Configuring appsettings section AzureAdB2C, into IOptions
    services.AddOptions();
    services.Configure<OpenIdConnectOptions>(Configuration.GetSection("AzureAdB2C"));
}
```

The following code adds the cookie policy, and it uses the authentication model. Replace the `Configure` function with the following code snippet: 

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    else
    {
        app.UseExceptionHandler("/Home/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }

    app.UseHttpsRedirection();
    app.UseStaticFiles();

    // Add the Microsoft Identity Web cookie policy
    app.UseCookiePolicy();
    app.UseRouting();
    // Add the ASP.NET Core authentication service
    app.UseAuthentication();
    app.UseAuthorization();

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");
        
        // Add endpoints for Razor pages
        endpoints.MapRazorPages();
    });
};
```

## Step 4: Add the UI elements

To add user interface elements, use a partial view. The partial view contains logic for checking to see whether a user is signed in. If the user is not signed in, the partial view renders the sign-in button. If the user is signed in, it shows the person's display name and sign-out button.
  
Create a new file `_LoginPartial.cshtml` inside the `Views/Shared` folder with the following code snippet:

```razor
@using System.Security.Principal
@if (User.Identity.IsAuthenticated)
{
    <ul class="nav navbar-nav navbar-right">
        <li class="navbar-text">Hello @User.Identity.Name</li>
        <!-- The Account controller is not defined in this project. Instead, it is part of Microsoft.Identity.Web.UI nuget package, and it defines some well-known actions, such as SignUp/In, SignOut, and EditProfile. -->
        <li class="navbar-btn">
            <form method="get" asp-area="MicrosoftIdentity" asp-controller="Account" asp-action="EditProfile">
                <button type="submit" class="btn btn-primary" style="margin-right:5px">Edit Profile</button>
            </form>
        </li>
        <li class="navbar-btn">
            <form method="get" asp-area="MicrosoftIdentity" asp-controller="Account" asp-action="SignOut">
                <button type="submit" class="btn btn-primary">Sign Out</button>
            </form>
        </li>
    </ul>
}
else
{
    <ul class="nav navbar-nav navbar-right">
        <li class="navbar-btn">
            <form method="get" asp-area="MicrosoftIdentity" asp-controller="Account" asp-action="SignIn">
                <button type="submit" class="btn btn-primary">Sign Up/In</button>
            </form>
        </li>
    </ul>
}
```

Modify your `Views\Shared\_Layout.cshtml` to include the *_LoginPartial.cshtml* file you added. The *_Layout.cshtml* file is a common layout that provides the user with a consistent experience as they navigate from page to page. The layout includes common user interface elements such as the app header and footer.

> [!NOTE]
> Depending on the .NET Core version and whether you're adding sign-in to an existing app, the UI elements might look different. If so, be sure to include *_LoginPartial* in the proper location within the page layout.

Open the */Views/Shared/_Layout.cshtml* and add the following `div` element.

```razor
<div class="navbar-collapse collapse">
...
</div>
```

Replace this element with the following Razor code:

```razor
<div class="navbar-collapse collapse">
  <ul class="nav navbar-nav">
    <li><a asp-area="" asp-controller="Home" asp-action="Index">Home</a></li>
    <li><a asp-area="" asp-controller="Home" asp-action="Claims">Claims</a></li>
    <li><a asp-area="" asp-controller="Home" asp-action="TodoList">To do list</a></li>
  </ul>
  <partial name="_LoginPartial" />
</div>
```

The preceding Razor code includes a link to the `Claims` and `TodoList` actions you'll create in the next steps.

## Step 5: Add the claims view

To view the ID token claims under the `Views/Home` folder, add the `Claims.cshtml` view.

```razor
@using System.Security.Claims

@{
  ViewData["Title"] = "Claims";
}
<h2>@ViewData["Title"].</h2>

<table class="table-hover table-condensed table-striped">
  <tr>
    <th>Claim Type</th>
    <th>Claim Value</th>
  </tr>

  @foreach (Claim claim in User.Claims)
  {
    <tr>
      <td>@claim.Type</td>
      <td>@claim.Value</td>
    </tr>
  }
</table>
```

In this step, you add the `Claims` action that links the *Claims.cshtml* view to the *Home* controller. It uses the `[Authorize]` attribute, which limits access to the Claims action to authenticated users.

In the */Controllers/HomeController.cs* controller, add the following action:

```csharp
[Authorize]
public IActionResult Claims()
{
    return View();
}
```

Add the following `using` declaration at the beginning of the class:

```csharp
using Microsoft.AspNetCore.Authorization;
```

## Step 6: Add the TodoList.cshtml view

To call the TodoList.cshtml web API, you need to have an access token with the right scopes. In this step, you add an action to the `Home` controller. Under the `Views/Home` folder, add the `TodoList.cshtml` view.

```razor
@{
    ViewData["Title"] = "To do list";
}

<div class="text-left">
  <h1 class="display-4">Your access token</h1>
  @* Remove following line in production environments *@
  <code>@ViewData["accessToken"]</code>
</div>
```

After you've added the view, you add the `TodoList` action that links the *TodoList.cshtml* view to the *Home* controller. It uses the `[Authorize]` attribute, which limits access to the TodoList action to authenticated users.  

In the */Controllers/HomeController.cs* controller, add the following action class member and inject the token acquisition service into your controller.

```csharp
public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    // Add the token acquisition service member variable
    private readonly ITokenAcquisition _tokenAcquisition; 
    
    // Inject the acquisition service
    public HomeController(ILogger<HomeController> logger, ITokenAcquisition tokenAcquisition)
    {
        _logger = logger;
        // Set the acquisition service member variable
        _tokenAcquisition = tokenAcquisition;
    }

    // More code...
}
```

Now, add the following action, which shows you how to call a web API along with the bearer token. 

```csharp
[Authorize]
public async Task<IActionResult> TodoListAsync()
{
    // Acquire an access token with the relevant scopes.
    var accessToken = await _tokenAcquisition.GetAccessTokenForUserAsync(new[] { "https://your-tenant.onmicrosoft.com/tasks-api/tasks.read", "https://your-tenant.onmicrosoft.com/tasks-api/tasks.write" });
    
    // Remove this line in production environments    
    ViewData["accessToken"] = accessToken;

    using (HttpClient client = new HttpClient())
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        HttpResponseMessage response = await client.GetAsync("https://path-to-your-web-api");
    }

    return View();
}
```

## Step 7: Add the app settings

Azure AD B2C identity provider settings are stored in the *appsettings.json* file. Open *appsettings.json*, and add the app settings, as described in "Step 5: Configure the sample web app" of [Configure authentication in a sample web app that calls a web API by using Azure AD B2C](configure-authentication-sample-web-app-with-api.md#step-5-configure-the-sample-web-app).

## Step 8: Run your application

1. Build and run the project.
1. Go to https://localhost:5001, and then select **SignIn/Up**.
1. Complete the sign-in or sign-up process.

After you've been successfully authenticated in the app, check your display name in the navigation bar. 

* To view the claims that the Azure AD B2C token returns to your app, select **Claims**.
* To view the access token, select **To do list**.

## Next steps

Learn how to:
* [Customize and enhance the Azure AD B2C authentication experience in your web app](enable-authentication-web-application-options.md)
* [Enable authentication in your own web API](enable-authentication-web-api.md)
