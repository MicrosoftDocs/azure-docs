<properties title="" pageTitle="Getting Started with Active Directory Authentication - What Happened" metaKeywords="Azure, Getting Started, Active Directory" description="" services="active-directory" documentationCenter="" authors="kempb" manager="douge" editor=""/>
  
<tags ms.service="active-directory" ms.workload="web" ms.tgt_pltfrm="vs-what-happened" ms.devlang="na" ms.topic="article" ms.date="10/8/2014" ms.author="kempb" />

> [AZURE.SELECTOR]
> - [Getting Started](/documentation/articles/vs-active-directory-dotnet-getting-started/)
> - [What Happened](/documentation/articles/vs-active-directory-dotnet-what-happened/)

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
- `System`
- `System.Data`
- `System.Drawing`
- `System.IdentityModel`
- `System.IdentityModel.Tokens.Jwt`
- `System.Runtime.Serialization`

#####Code files were added to your project 

An authentication startup class, `App_Start/Startup.Auth.cs` was added to your project containing startup logic for Azure AD authentication. Also, a controller class, Controllers/AccountController.cs was added which contains `SignIn()` and `SignOut()` methods. Finally, a partial view, `Views/Shared/_LoginPartial.cshtml` was added containing an action link for SignIn/SignOut. 

#####Startup code was added to your project
 
If you already had a Startup class in your project, the **Configuration** method was updated to include a call to `ConfigureAuth(app)` was added to that method. Otherwise, a Startup class was added to your project. 

#####Your app.config or web.config has new configuration values 

The following configuration entries have been added. 
	<pre>
	`<appSettings>
	    <add key="ida:ClientId" value="ClientId from the new Azure AD App" /> 
	    <add key="ida:Tenant" value="Your selected Azure AD Tenant" /> 
	    <add key="ida:AADInstance" value="https://login.windows.net/{0}" /> 
	    <add key="Ida:PostLogoutRedirectURI" value="Your project start page" /> 
	</appSettings>` </pre>

#####An Azure Active Directory (AD) App was created 
An Azure AD Application was created in the directory that you selected in the wizard. 

[Learn more about Azure Active Directory](http://azure.microsoft.com/services/active-directory/)