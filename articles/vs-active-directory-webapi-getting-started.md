<properties title="Getting Started with Active Directory Authentication" pageTitle="" metaKeywords="Azure, Getting Started, Active Directory" description="" services="active-directory" documentationCenter="" authors="ghogen, kempb" />
  
<tags ms.service="active-directory" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/8/2014" ms.author="ghogen, kempb" />

##Getting Started with Azure Active Directory (AD)
###What Happened?

References have been added to your project 

#####NuGet package references 

`Microsoft.Owin`, `Microsoft.Owin.Host.SystemWeb`, `Microsoft.Owin.Security`, `Microsoft.Owin.Security.ActiveDirectory`, `Microsoft.Owin.Security.Jwt`, `Microsoft.Owin.Security.OAuth`, `Newtonsoft.Json`, `Owin`, `System.IdentityModel.Tokens.Jwt`

#####.NET references 

`Microsoft.Owin`, `Microsoft.Owin.Host.SystemWeb`, `Microsoft.Owin.Security`, `Microsoft.Owin.Security.ActiveDirectory`, `Microsoft.Owin.Security.Jwt`, `Microsoft.Owin.Security.OAuth`, `Newtonsoft.Json`, `Owin`, `System.IdentityModel.Tokens.Jwt` 

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

###An Azure Active Directory (AD) App was created 

An Azure AD Application was created in the directory that you selected in the wizard.

###Getting Started

Here is what you can do with the code that was added.

#####Requiring authentication to access controllers
 
All controllers in your project were adorned with the **Authorize** attribute. This attribute will require the user to be authenticated before accessing the APIs defined by these controllers. To allow the controller to be accessed anonymously, remove this attribute from the controller. If you want to set the permissions at a more granular level, apply the attribute to each method that requires authorization instead of applying it to the controller class.

[Learn more about Azure Active Directory](http://azure.microsoft.com/services/active-directory/)
