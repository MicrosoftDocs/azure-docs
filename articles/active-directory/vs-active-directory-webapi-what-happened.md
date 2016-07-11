<properties
	pageTitle="What happened to my WebApi project (Visual Studio Azure Active Directory connected service) | Microsoft Azure "
	description="Describes what happens to your MVC project WebApi you connect to Azure AD by using Visual Studio"
  services="active-directory"
	documentationCenter=""
	authors="TomArcher"
	manager="douge"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="web"
	ms.tgt_pltfrm="vs-what-happened"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/01/2016"
	ms.author="tarcher"/>

# What happened to my WebApi project (Visual Studio Azure Active Directory connected service)

> [AZURE.SELECTOR]
> - [Getting Started](vs-active-directory-webapi-getting-started.md)
> - [What Happened](vs-active-directory-webapi-what-happened.md)

##References have been added

###NuGet package references

- `Microsoft.Owin`
- `Microsoft.Owin.Host.SystemWeb`
- `Microsoft.Owin.Security`
- `Microsoft.Owin.Security.ActiveDirectory`
- `Microsoft.Owin.Security.Jwt`
- `Microsoft.Owin.Security.OAuth`
- `Owin`
- `System.IdentityModel.Tokens.Jwt`

###.NET references

- `Microsoft.Owin`
- `Microsoft.Owin.Host.SystemWeb`
- `Microsoft.Owin.Security`
- `Microsoft.Owin.Security.ActiveDirectory`
- `Microsoft.Owin.Security.Jwt`
- `Microsoft.Owin.Security.OAuth`
- `Owin`
- `System.IdentityModel.Tokens.Jwt`

##Code changes

###Code files were added to your project

An authentication startup class, **App_Start/Startup.Auth.cs** was added to your project containing startup logic for Azure AD authentication.

###Startup code was added to your project

If you already had a Startup class in your project, the **Configuration** method was updated to include a call to `ConfigureAuth(app)`. Otherwise, a Startup class was added to your project.


###Your app.config or web.config file has new configuration values.

The following configuration entries have been added.
```
	`<appSettings>
    		<add key="ida:ClientId" value="ClientId from the new Azure AD App" />
    		<add key="ida:Tenant" value="Your selected Azure AD Tenant" />
    		<add key="ida:Audience" value="The App ID Uri from the wizard" />
	</appSettings>`
```

###An Azure AD App was created

An Azure AD Application was created in the directory that you selected in the wizard.

[Learn more about Azure Active Directory](https://azure.microsoft.com/services/active-directory/)

##If I checked *disable Individual User Accounts authentication*, what additional changes were made to my project?
NuGet package references were removed, and files were removed and backed up. Depending on the state of your project, you may have to manually remove additional references or files, or modify code as appropriate.

###NuGet package references removed (for those present)

- `Microsoft.AspNet.Identity.Core`
- `Microsoft.AspNet.Identity.EntityFramework`
- `Microsoft.AspNet.Identity.Owin`

###Code files backed up and removed (for those present)

Each of following files was backed up and removed from the project. Backup files are located in a 'Backup' folder at the root of the project's directory.

- `App_Start\IdentityConfig.cs`
- `Controllers\AccountController.cs`
- `Controllers\ManageController.cs`
- `Models\IdentityModels.cs`
- `Providers\ApplicationOAuthProvider.cs`

###Code files backed up (for those present)

Each of following files was backed up before being replaced. Backup files are located in a 'Backup' folder at the root of the project's directory.

- `Startup.cs`
- `App_Start\Startup.Auth.cs`

##If I checked *Read directory data*, what additional changes were made to my project?

###Additional changes were made to your app.config or web.config

The following additional configuration entries have been added.

```
	`<appSettings>
	    <add key="ida:Password" value="Your Azure AD App's new password" />
	</appSettings>`
```

###Your Azure Active Directory App was updated
Your Azure Active Directory App was updated to include the *Read directory data* permission and an additional key was created which was then used as the *ida:Password* in the `web.config` file.

[Learn more about Azure Active Directory](https://azure.microsoft.com/services/active-directory/)
