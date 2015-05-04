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

###What additional changes were made to my project because I checked *Read directory data*?
Additional references have been added.

#####Additional NuGet package references

- `EntityFramework`
- `Microsoft.Azure.ActiveDirectory.GraphClient`
- `Microsoft.Data.Edm`
- `Microsoft.Data.OData`
- `Microsoft.Data.Services.Client`
- `Microsoft.IdentityModel.Clients.ActiveDirectory`
- `System.Spatial`

#####Additional .NET references

- `EntityFramework`
- `EntityFramework.SqlServer`
- `Microsoft.Azure.ActiveDirectory.GraphClient`
- `Microsoft.Data.Edm`
- `Microsoft.Data.OData`
- `Microsoft.Data.Services.Client`
- `Microsoft.IdentityModel.Clients.ActiveDirectory`
- `Microsoft.IdentityModel.Clients.ActiveDirectory.WindowsForms`
- `System.Spatial`

#####Additional Code files were added to your project 

Two files were added to support token caching: `Models\ADALTokenCache.cs` and `Models\ApplicationDbContext.cs`.  An additional controller and view were added to illustrate accessing user profile information using Azure graph APIs.  These files are `Controllers\UserProfileController.cs` and `Views\UserProfile\Index.cshtml`.

#####Additional Startup code was added to your project
 
In the `startup.auth.cs` file, a new `OpenIdConnectAuthenticationNotifications` object was added to the `Notifications` member of the `OpenIdConnectAuthenticationOptions`.  This is to enable receiving the OAuth code and exchange it for an access token.

#####Additional changes were made to your app.config or web.config

The following additional configuration entries have been added. 
	<pre>
	`<appSettings>
	    <add key="Ida:ClientSecret" value="Your Azure AD App's new client secret" /> 
	</appSettings>` </pre>

The following configuration sections and connection string have been added.
	<pre>
 	`<configSections>
	    <!-- For more information on Entity Framework configuration, visit http://go.microsoft.com/fwlink/?LinkID=237468 -->
	    <section name="entityFramework" type="System.Data.Entity.Internal.ConfigFile.EntityFrameworkSection, EntityFramework, Version=6.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" requirePermission="false" />
	</configSections>
	<connectionStrings>
	    <add name="DefaultConnection" connectionString="Data Source=(localdb)\MSSQLLocalDB;AttachDbFilename=|DataDirectory|\aspnet-[AppName + Generated Id].mdf;Initial Catalog=aspnet-[AppName + Generated Id];Integrated Security=True" providerName="System.Data.SqlClient" />
	</connectionStrings>
	<entityFramework>
	    <defaultConnectionFactory type="System.Data.Entity.Infrastructure.LocalDbConnectionFactory, EntityFramework">
	      <parameters>
	        <parameter value="mssqllocaldb" />
	      </parameters>
	    </defaultConnectionFactory>
	    <providers>
	      <provider invariantName="System.Data.SqlClient" type="System.Data.Entity.SqlServer.SqlProviderServices, EntityFramework.SqlServer" />
	    </providers>
	</entityFramework>`</pre>


#####Your Azure Active Directory App was updated
Your Azure Active Directory App was updated to include the *Read directory data* permission and an additional key was created which was then used as the *ClientSecret* in the `web.config` file.

[Learn more about Azure Active Directory](http://azure.microsoft.com/services/active-directory/)
