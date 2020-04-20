---
title: Get started with Azure AD in .NET MVC projects | Azure
description: How to get started using Azure Active Directory in .NET MVC projects after connecting to or creating an Azure AD using Visual Studio connected services
author: ghogen
manager: jillfra
ms.prod: visual-studio-windows
ms.technology: vs-azure
ms.workload: azure-vs
ms.topic: conceptual
ms.date: 03/12/2018
ms.author: ghogen
ms.custom: aaddev, vs-azure

---
# Getting Started with Azure Active Directory (ASP.NET MVC Projects)

> [!div class="op_single_selector"]
> - [Getting Started](vs-active-directory-dotnet-getting-started.md)
> - [What Happened](vs-active-directory-dotnet-what-happened.md)

This article provides additional guidance after you've added Active Directory to an ASP.NET MVC project through the **Project > Connected Services** command of Visual Studio. If you've not already added the service to your project, you can do so at any time.

See [What happened to my MVC project?](vs-active-directory-dotnet-what-happened.md) for the changes made to your project when adding the connected service.

## Requiring authentication to access controllers

All controllers in your project were adorned with the `[Authorize]` attribute. This attribute requires the user to be authenticated before accessing these controllers. To allow the controller to be accessed anonymously, remove this attribute from the controller. If you want to set the permissions at a more granular level, apply the attribute to each method that requires authorization instead of applying it to the controller class.

## Adding SignIn / SignOut Controls

To add the SignIn/SignOut controls to your view, you can use the `_LoginPartial.cshtml` partial view to add the functionality to one of your views. Here is an example of the functionality added to the standard `_Layout.cshtml` view. (Note the last element in the div with class navbar-collapse):

```html
<!DOCTYPE html>
 <html>
 <head>
     <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@ViewBag.Title - My ASP.NET Application</title>
    @Styles.Render("~/Content/css")
    @Scripts.Render("~/bundles/modernizr")
</head>
<body>
    <div class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                @Html.ActionLink("Application name", "Index", "Home", new { area = "" }, new { @class = "navbar-brand" })
            </div>
            <div class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
                    <li>@Html.ActionLink("Home", "Index", "Home")</li>
                    <li>@Html.ActionLink("About", "About", "Home")</li>
                    <li>@Html.ActionLink("Contact", "Contact", "Home")</li>
                </ul>
                @Html.Partial("_LoginPartial")
            </div>
        </div>
    </div>
    <div class="container body-content">
        @RenderBody() 
        <hr />
        <footer>
            <p>&copy; @DateTime.Now.Year - My ASP.NET Application</p>
        </footer>
    </div>
    @Scripts.Render("~/bundles/jquery")
    @Scripts.Render("~/bundles/bootstrap")
    @RenderSection("scripts", required: false)
</body>
</html>
```

## Next steps

- [Authentication scenarios for Azure Active Directory](authentication-scenarios.md)
- [Add sign-in with Microsoft to an ASP.NET web app](quickstart-v2-aspnet-webapp.md)
