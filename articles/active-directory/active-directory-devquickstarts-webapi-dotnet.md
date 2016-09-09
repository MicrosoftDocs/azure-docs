<properties
	pageTitle="Azure AD .NET Getting Started | Microsoft Azure"
	description="How to build a .NET MVC Web API that integrates with Azure AD for authentication and authorization."
	services="active-directory"
	documentationCenter=".net"
	authors="dstrockis"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="05/16/2016"
	ms.author="dastrock"/>


# Protect a Web API using Bearer tokens from Azure AD

[AZURE.INCLUDE [active-directory-devguide](../../includes/active-directory-devguide.md)]

If you’re building an application that provides access to protected resources you will need to know how to protect those resources from unwarranted access.
Azure AD makes it simple and straightforward to protect a web API using OAuth Bearer 2.0 Access Tokens with only a few lines of code.

In Asp.NET web apps, you can accomplish this using Microsoft’s implementation of the community-driven OWIN middleware included in .NET Framework 4.5.  Here we’ll use OWIN to build a "To Do List" web API that:
-	Designates which API's are protected.
-	Validates that the Web API calls contain a valid Access Token.

In order to do this, you’ll need to:

1. Register an application with Azure AD
2. Set up your app to use the OWIN authentication pipeline.
3. Configure a client application to call the To Do List Web API

To get started, [download the app skeleton](https://github.com/AzureADQuickStarts/WebAPI-Bearer-DotNet/archive/skeleton.zip) or [download the completed sample](https://github.com/AzureADQuickStarts/WebAPI-Bearer-DotNet/archive/complete.zip).  Each is a Visual Studio 2013 solution.  You'll also need an Azure AD tenant in which to register your application.  If you don't have one already, [learn how to get one](active-directory-howto-tenant.md).


## *1.	Register an Application with Azure AD*
To secure your application, you’ll first need to create an application in your tenant and provide Azure AD with a few key pieces of information.

-	Sign into the [Azure Management Portal](https://manage.windowsazure.com)
-	In the left hand nav, click on **Active Directory**
-	Select a tenant in which to register the application.
-	Click the **Applications** tab, and click **Add** in the bottom drawer.
-	Follow the prompts and create a new **Web Application and/or WebAPI**.
    -	The **Name** of the application will describe your application to end-users.  Enter "To Do List Service".
    -	The **Redirect Uri** is a scheme and string combination that Azure AD would use to return any tokens your app requested. Enter `https://localhost:44321/` for this value.
-	Once you’ve completed registration, navigate to **Configure** tab and locate the **App ID URI** field.  Enter a tenant-specific identifier for this value, e.g. `https://contoso.onmicrosoft.com/TodoListService`
- Save the configuration.  Leave the portal open - you'll also need to register your client application shortly.

## *2. Set up your app to use the OWIN authentication pipeline*

Now that you’ve registered an application with Azure AD, you need to set up your application to communicate with Azure AD in order to validate incoming requests & tokens.

-	To begin, open the solution and add the OWIN middleware NuGet packages to the TodoListService project using the Package Manager Console.

```
PM> Install-Package Microsoft.Owin.Security.ActiveDirectory -ProjectName TodoListService
PM> Install-Package Microsoft.Owin.Host.SystemWeb -ProjectName TodoListService
```

-	Add an OWIN Startup class to the TodoListService project called `Startup.cs`.  Right click on the project --> **Add** --> **New Item** --> Search for “OWIN”.  The OWIN middleware will invoke the `Configuration(…)` method when your app starts.
-	Change the class declaration to `public partial class Startup` - we’ve already implemented part of this class for you in another file.  In the `Configuration(…)` method, make a call to ConfgureAuth(…) to set up authentication for your web app.

```C#
public partial class Startup
{
    public void Configuration(IAppBuilder app)
    {
        ConfigureAuth(app);
    }
}
```

-	Open the file `App_Start\Startup.Auth.cs` and implement the `ConfigureAuth(…)` method.  The parameters you provide in `WindowsAzureActiveDirectoryBearerAuthenticationOptions` will serve as coordinates for your app to communicate with Azure AD.

```C#
public void ConfigureAuth(IAppBuilder app)
{
    app.UseWindowsAzureActiveDirectoryBearerAuthentication(
        new WindowsAzureActiveDirectoryBearerAuthenticationOptions
        {
            Audience = ConfigurationManager.AppSettings["ida:Audience"],
            Tenant = ConfigurationManager.AppSettings["ida:Tenant"]
        });
}
```

-	Now you can use `[Authorize]` attributes to protect your controllers and actions with JWT bearer authentication.  Decorate the `Controllers\TodoListController.cs` class with an authorize tag.  This will force the user to sign in before accessing that page.

```C#
[Authorize]
public class TodoListController : ApiController
{
```

- When an authorized caller successfully invokes one of the `TodoListController` APIs, the action might need access to information about the caller.  OWIN provides access to the claims inside the bearer token via the `ClaimsPrincpal` object.  
- A common requirement for web APIs is to validate the "scopes" present in the token - this ensures that the end user has consented to the permissions required to access the Todo List Service:

```C#
public IEnumerable<TodoItem> Get()
{
    // user_impersonation is the default permission exposed by applications in AAD
    if (ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/scope").Value != "user_impersonation")
    {
        throw new HttpResponseException(new HttpResponseMessage {
          StatusCode = HttpStatusCode.Unauthorized,
          ReasonPhrase = "The Scope claim does not contain 'user_impersonation' or scope claim not found"
        });
    }
    ...
}
```

-	Finally, open the `web.config` file in the root of the TodoListService project, and enter your configuration values in the `<appSettings>` section.
  -	The `ida:Tenant` is the name of your Azure AD tenant, e.g. "contoso.onmicrosoft.com".
  -	Your `ida:Audience` is the App ID URI of the application that you entered in the Azure Portal.

## *3.	Configure a client application & Run the service*
Before you can see the Todo List Service in action, you need to configure the Todo List Client so it can get tokens from AAD and make calls to the service.

- Navigate back to the [Azure Management Portal](https://manage.windowsazure.com)
- Create a new application in your Azure AD tenant, and select **Native Client Application** in the resulting prompt.
    -	The **Name** of the application will describe your application to end-users
    -	Enter `http://TodoListClient/` for the **Redirect Uri** value.
- Once you’ve completed registration, AAD will assign your app a unique **Client Id**. You’ll need this value in the next steps, so copy it from the Configure tab.
- Also in **Configure** tab, locate the "Permissions to Other Applications" section. Click "Add Application." Select "All Apps" in the "Show" dropdown, and click the upper check mark. Locate & click on your To Do List Service, and click the bottom check mark to add the application. Select "Access To Do List Service" from the "Delegated Permissions" dropdown, and save the configuration.


- In Visual Studio, open `App.config` in the TodoListClient project and enter your configuration values in the `<appSettings>` section.
  -	The `ida:Tenant` is the name of your Azure AD tenant, e.g. "contoso.onmicrosoft.com".
  -	Your `ida:ClientId` app ID you copied from the Azure Portal.
  -	Your `todo:TodoListResourceId` is the App ID URI of the To Do List Service application that you entered in the Azure Portal.

Finally, clean, build and run each project!  If you haven’t already, now is the time to create a new user in your tenant with a *.onmicrosoft.com domain.  Sign in to the To Do List client with that user, and add some tasks to the user's To Do List.

For reference, the completed sample (without your configuration values) is provided [here](https://github.com/AzureADQuickStarts/WebAPI-Bearer-DotNet/archive/complete.zip).  You can now move on to more additional identity scenarios.

[AZURE.INCLUDE [active-directory-devquickstarts-additional-resources](../../includes/active-directory-devquickstarts-additional-resources.md)]
