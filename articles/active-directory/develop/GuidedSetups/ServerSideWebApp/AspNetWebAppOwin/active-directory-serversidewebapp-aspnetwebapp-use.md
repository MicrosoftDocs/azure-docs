---
title: Implementing Microsoft Sign-in on ASP.NET Web Server - Sign-In
description: How to  implement Microsoft Sign-In on a Visual Studio ASP.NET solution with a traditional web browser based application using OpenID Connect standard. | Microsoft Azure
services: active-directory
documentationcenter: dev-center-name
author: andretms
manager: mbaldwin
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date:
ms.author: andret

---

# Add a controller to handle sign-in requests

Create a new controller to expose sign-in and sign-out methods.

1.	Right click the `Controllers` folder: `Add` > `Controller`
2.	Select `MVC {version} Controller – Empty`.
3.	Click *Add*
4.	Name it `HomeController`
5.	Add *OWIN* references to the class:
```csharp
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
```
6.	Add the two methods below to handle sign in and sign out to your controller by initiating an authentication challenge via code:

```csharp
 /// <summary>
/// Send an OpenID Connect sign-in request.
/// Alternatively, you can just decorate the SignIn method with the [Authorize] attribute
/// </summary>
public void SignIn()
{
    if (!Request.IsAuthenticated)
    {
        HttpContext.GetOwinContext().Authentication.Challenge(
            new AuthenticationProperties{ RedirectUri = "/" },
            OpenIdConnectAuthenticationDefaults.AuthenticationType);
    }
}

/// <summary>
/// Send an OpenID Connect sign-out request.
/// </summary>
public void SignOut()
{
    HttpContext.GetOwinContext().Authentication.SignOut(
            OpenIdConnectAuthenticationDefaults.AuthenticationType,
            CookieAuthenticationDefaults.AuthenticationType);
}
```

# Create the app's home page to sign in users via a sign-in button

In Visual Studio, create a new view to add the sign-in button and display user information after authentication:

1.	Right click the `Views\Home` folder and select `Add View`
2.	Name it `Index`.
3.	Add the following HTML, which includes the sign-in button, to the file:

```html
<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <title>Sign-In with Microsoft Sample</title>
</head>
<body>
    <div>
        @if (!Request.IsAuthenticated)
        {
            //If the user is not authenticated, display the sign-in button
            <a href="@Url.Action("SignIn", "Home")">
                <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="300px" height="50px" viewBox="0 0 3278 522" class="SignInButton">
                <defs><style type="text/css">
                          .fil0:hover {fill: #4B4B4B;}
                          .fnt0 {font-size: 260px;font-family: 'Segoe UI Semibold', 'Segoe UI';}
                          </style></defs>
                <g>
                <rect class="fil0" x="2" y="2" width="3174" height="517" fill="black" />
                <rect x="150" y="129" width="122" height="122" fill="#F35325" />
                <rect x="284" y="129" width="122" height="122" fill="#81BC06" />
                <rect x="150" y="263" width="122" height="122" fill="#05A6F0" />
                <rect x="284" y="263" width="122" height="122" fill="#FFBA08" />
                <text x="470" y="357" fill="white" class="fnt0">Sign in with Microsoft</text>
                </g>
            </svg>
            </a>
        }
        else
        {
            <span><br/>Hello @System.Security.Claims.ClaimsPrincipal.Current.FindFirst("name").Value;</span>
            <br /><br />
            @Html.ActionLink("See Your Claims", "Index", "Claims")
            <br /><br />
            @Html.ActionLink("Sign out", "SignOut", "Home")
        }
        @if (!string.IsNullOrWhiteSpace(Request.QueryString["errormessage"]))
        {
            <div style="background-color:red;color:white;font-weight: bold;">Error: @Request.QueryString["errormessage"]</div>
        }
    </div>
</body>
</html>
```
<!--start-collapse-->
### More Information
> This page adds a sign-in button in SVG format with a black background:<br/>![Sign-in with Microsoft](../../media/active-directory-serversidewebapp-aspnetwebapp-use/aspnetsigninbuttonsample.png)<br/> For more sign-in buttons, please go to the [this page](https://docs.microsoft.com/azure/active-directory/develop/active-directory-branding-guidelines).

# Add a controller to display user claims
This controller demonstrates the uses of the `[Authorize]`s attribute to protect a controller. This attribute restricts access to the controller by only allowing authenticated users. The code below makes use of the attribute to display user claims that were retrieved as part of the sign-in.

1.	Right click the `Controllers` folder: `Add` > `Controller`
2.	Select `MVC {version} Controller – Empty`.
3.	Click *Add*
4.	Name it `ClaimsController`
5.	Copy and paste the code below, which adds the `[Authorize]` attribute to the class, into the file:

```csharp
[Authorize]
public class ClaimsController : Controller
{
    /// <summary>
    /// Add user's claims to viewbag
    /// </summary>
    /// <returns></returns>
    public ActionResult Index()
    {
        var claimsPrincipalCurrent = System.Security.Claims.ClaimsPrincipal.Current;
        //You get the user’s first and last name below:
        ViewBag.Name = claimsPrincipalCurrent.FindFirst("name").Value;

        // The 'preferred_username' claim can be used for showing the user's logon
        ViewBag.Username = claimsPrincipalCurrent.FindFirst("preferred_username").Value;

        // The subject claim can be used to uniquely identify the user logon across the web
        ViewBag.Subject = claimsPrincipalCurrent.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value;

        // TenantId is the unique Tenant Id - which represents an organization in Azure AD
        ViewBag.TenantId = claimsPrincipalCurrent.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid").Value;

        return View();
    }
}
```


### More Information
> Because of the use of the `[Authorize]` attribute, all methods of this controller can only be executed if the user is authenticated. If the user is not authenticated and tries to access the controller, OWIN will initiate an authentication challenge and force the user to authenticate. The code above looks at the claims collection of the `ClaimsPrincipal.Current` instance for specific user attributes included in the user’s token. These attributes include the user’s full name and username, as well as the global user identifier subject. It also contains the *Tenant ID*, which represents the ID for the user’s organization. 

# Create a view to display the user's claims

In Visual Studio, create a new view to display the user's claims in a web page:

1.	Right click the `Views\Home` folder and: `Add View`
2.	Name it `Index`.
3.	Add the following HTML to the file:
```html
<html>
<head>
    <meta name="viewport" content="width=device-width" />
    <title>Sign-In with Microsoft Sample</title>
</head>
<body>
    <style type="text/css">
        body {font-size: small;font-family: Segoe UI, Arial, sans-serif;}
        table, th, td {border: 1px solid #ccc;padding: 5px;border-collapse: collapse;text-align: left;table-layout: fixed;max-width: 100%;}
        th {background-color: #f0f0f0;}
    </style>
    <p>Main Claims:</p>
    <table>
        <tr><td>Name</td><td>@ViewBag.Name</td></tr>
        <tr><td>Username</td><td>@ViewBag.Username</td></tr>
        <tr><td>Subject</td><td>@ViewBag.Subject</td></tr>
        <tr><td>TenantId</td><td>@ViewBag.TenantId</td></tr>
    </table>
    <br />
    <p>All Claims:</p>
    <table style="font-size: xx-small">
    @foreach (var claim in System.Security.Claims.ClaimsPrincipal.Current.Claims)
    {
        <tr><td>@claim.Type</td><td>@claim.Value</td></tr>
    }
</table>
    <br />
    <br />
    @Html.ActionLink("Sign out", "SignOut", "Home")
</body>
</html>
```

### What is Next

[Configure](active-directory-serversidewebapp-aspnetwebapp-configure.md)
