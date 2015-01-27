<properties 
	pageTitle="" 
	description="" 
	services="active-directory" 
	documentationCenter="" 
	authors="kempb" 
	manager="douge" 
	editor=""/>
 
<tags 
	ms.service="active-directory" 
	ms.workload="web" 
	ms.tgt_pltfrm="vs-what-happened" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/8/2014" 
	ms.author="kempb"/>

> [AZURE.SELECTOR]
> - [Getting Started](/documentation/articles/vs-active-directory-webapi-getting-started/)
> - [What Happened](/documentation/articles/vs-active-directory-webapi-what-happened/)

###<span id="whathappened">What happened to my project?</span>

References have been added. 

#####NuGet package references 

- `Microsoft.Owin`
- `Microsoft.Owin.Host.SystemWeb`
- `Microsoft.Owin.Security`
- `Microsoft.Owin.Security.ActiveDirectory`
- `Microsoft.Owin.Security.Jwt`
- `Microsoft.Owin.Security.OAuth`
- `Newtonsoft.Json`
- `Owin`
- `System.IdentityModel.Tokens.Jwt`

#####.NET references 

- `Microsoft.Owin`
- `Microsoft.Owin.Host.SystemWeb`
- `Microsoft.Owin.Security`
- `Microsoft.Owin.Security.ActiveDirectory`
- `Microsoft.Owin.Security.Jwt`
- `Microsoft.Owin.Security.OAuth`
- `Newtonsoft.Json`
- `Owin`
- `System.IdentityModel.Tokens.Jwt` 

#####Code files were added to your project 

An authentication startup class, **App_Start/Startup.Auth.cs** was added to your project containing startup logic for Azure AD authentication. 

#####Startup code was added to your project 

If you already had a Startup class in your project, the **Configuration** method was updated to include a call to `ConfigureAuth(app)` was added to that method. Otherwise, a Startup class was added to your project. 


#####Your app.config or web.config file has new configuration values.

The following configuration entries have been added. 
	<pre>
	`<appSettings> 
    		<add key="ida:ClientId" value="ClientId from the new Azure AD App" /> 
    		<add key="ida:Tenant" value="Your selected Azure AD Tenant" /> 
    		<add key="ida:Audience" value="The App ID Uri from the wizard" /> 
	</appSettings>` </pre>

###An Azure Azure AD App was created 

An Azure AD Application was created in the directory that you selected in the wizard.


[Learn more about Azure Active Directory](http://azure.microsoft.com/services/active-directory/)
