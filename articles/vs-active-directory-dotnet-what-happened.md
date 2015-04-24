<properties 
	pageTitle="Getting Started with Active Directory Authentication - What Happened" 
	description="Describes what happened to your Azure Active Directory project in Visual Studio" 
	services="active-directory" 
	documentationCenter="" 
	authors="kempb" 
	manager="douge" 
	editor="tglee"/>
  
<tags 
	ms.service="active-directory" 
	ms.workload="web" 
	ms.tgt_pltfrm="vs-what-happened" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/02/2015" 
	ms.author="kempb"/>

# What happened to my project?

> [AZURE.SELECTOR]
> - [Getting Started](vs-active-directory-dotnet-getting-started.md)
> - [What Happened](vs-active-directory-dotnet-what-happened.md)

###<span id="whathappened">What happened to my project?</span>
 
References have been added.

#####NuGet package references

- `Microsoft.IdentityModel.Protocol.Extensions`
- `Microsoft.Owin`
- `Microsoft.Owin.Host.SystemWeb`
- `Microsoft.Owin.Security`
- `Microsoft.Owin.Security.Cookies`
- `Microsoft.Owin.Security.OpenIdConnect`
- `Owin`
- `System.IdentityModel.Tokens.Jwt`

#####.NET references

- `Microsoft.IdentityModel.Protocol.Extensions`
- `Microsoft.Owin`
- `Microsoft.Owin.Host.SystemWeb`
- `Microsoft.Owin.Security`
- `Microsoft.Owin.Security.Cookies`
- `Microsoft.Owin.Security.OpenIdConnect`
- `Owin`
- `System.IdentityModel`
- `System.IdentityModel.Tokens.Jwt`
- `System.Runtime.Serialization`

#####Code files were added to your project 

An authentication startup class, `App_Start/Startup.Auth.cs` was added to your project containing startup logic for Azure AD authentication. Also, a controller class, Controllers/AccountController.cs was added which contains `SignIn()` and `SignOut()` methods. Finally, a partial view, `Views/Shared/_LoginPartial.cshtml` was added containing an action link for SignIn/SignOut. 

#####Startup code was added to your project
 
If you already had a Startup class in your project, the **Configuration** method was updated to include a call to `ConfigureAuth(app)`. Otherwise, a Startup class was added to your project. 

#####Your app.config or web.config has new configuration values 

The following configuration entries have been added. 
	<pre>
	`<appSettings>
	    <add key="ida:ClientId" value="ClientId from the new Azure AD App" /> 
	    <add key="ida:AADInstance" value="https://login.windows.net/" /> 
	    <add key="ida:Domain" value="The selected Azure AD Domain" />
	    <add key="ida:TenantId" value="The Id of your selected Azure AD Tenant" />
	    <add key="Ida:PostLogoutRedirectURI" value="Your project start page" /> 
	</appSettings>` </pre>

#####An Azure Active Directory (AD) App was created 
An Azure AD Application was created in the directory that you selected in the wizard. 

[Learn more about Azure Active Directory](http://azure.microsoft.com/services/active-directory/)
