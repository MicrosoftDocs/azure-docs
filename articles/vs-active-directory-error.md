<properties 
	pageTitle="Error During Authentication Detection" 
	description="The active directory connection wizard detected an incompatible authentication type" 
	services="active-directory" 
	documentationCenter="" 
	authors="kempb" 
	manager="douge" 
	editor="tglee"/>
  
<tags 
	ms.service="active-directory" 
	ms.workload="web" 
	ms.tgt_pltfrm="vs-getting-started" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/02/2015" 
	ms.author="kempb"/>

# Error During Authentication Detection

While detecting previous authentication code, the wizard detected an incompatible authentication type.   

###What is being checked?

####Project Types

The wizard checks which type of project you’re developing so it can inject the right authentication logic into the project.  If there is any controller that derives from `ApiController` in the project, it will be considered a WebAPI project.  If there are only controllers that derive from `MVC.Controller` in the project, it will be considered an MVC project.  Anything else is considered not supported by the wizard.  WebForms projects are not currently supported.

#####Compatible Authentication Code

The wizard also checks for authentication settings that have been previously configured with the wizard or are compatible with the wizard.  If all of the settings are present, it is considered a re-entrant case and the wizard will open and display the settings.  If only some of the settings are present, it is considered an error case.

In an MVC project, the wizard checks for any of the following settings, which result from previous use of the wizard:

	<add key="ida:ClientId" value="" />
	<add key="ida:Tenant" value="" />
	<add key="ida:AADInstance" value="" />
	<add key="ida:PostLogoutRedirectUri" value="" />

In addition, the wizard checks for any of the following settings in a Web API project, which result from previous use of the wizard:

	<add key="ida:ClientId" value="" />
	<add key="ida:Tenant" value="" />
	<add key="ida:Audience" value="" />

#####Incompatible Authentication Code

Finally, the wizard attempts to detect versions of authentication code that have been configured with previous versions of Visual Studio. If you received this error, it means your project contains an incompatible authentication type. The wizard detects the following types of authentication from previous versions of Visual Studio:

* Windows Authentication 
* Individual User Accounts 
* Organizational Accounts 
 

To detect Windows Authentication in an MVC project, the wizard looks for the `authentication` element from your **web.config** file.

<PRE class="prettyprint">
	&lt;configuration&gt;
	    &lt;system.web&gt;
	        <span style="background-color: yellow">&lt;authentication mode="Windows" /&gt;</span>
	    &lt;/system.web&gt;
	&lt;/configuration&gt;
</pre>

To detect Windows Authentication in a Web API project, the wizard looks for the `IISExpressWindowsAuthentication` element from your project's **.csproj** file:

<PRE class="prettyprint">
	&lt;Project&gt;
	    &lt;PropertyGroup&gt;
	        <span style="background-color: yellow">&lt;IISExpressWindowsAuthentication&gt;enabled&lt;/IISExpressWindowsAuthentication&gt;</span>
	    &lt;/PropertyGroup>
	&lt;/Project&gt;
</PRE>

To detect Individual User Accounts authentication, the wizard looks for the package element from your **Packages.config** file.

<PRE class="prettyprint">
	&lt;packages&gt;
	    <span style="background-color: yellow">&lt;package id="Microsoft.AspNet.Identity.EntityFramework" version="2.1.0" targetFramework="net45" /&gt;</span>
	&lt;/packages&gt;
</PRE>

To detect an old form of Organizational Account authentication, the wizard looks for the following element from **web.config**:

<PRE class="prettyprint">
	&lt;configuration*gt;
	    &lt;appSettings&gt;
	        <span style="background-color: yellow">&lt;add key="ida:Realm" value="***" /&gt;</span>
	    &lt;/appSettings&gt;
	&lt;/configuration&gt;
</PRE>

To change the authentication type, remove the incompatible authentication type and run the wizard again.

For more information, see [Authentication Scenarios for Azure AD](http://msdn.microsoft.com/library/azure/dn499820.aspx).