---
title: Azure AD v2 ASP.NET Web Server Getting Started - Config | Microsoft Docs
description: Implementing Microsoft Sign-In on an ASP.NET solution with a traditional web browser based application using OpenID Connect standard
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
ms.date: 05/09/2017
ms.author: andret

---

## Create an application (Express)
Now you need to register your application in the *Microsoft Application Registration Portal*:
1. Register your application via the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app?appType=serverSideWebApp&appTech=aspNetWebAppOwin&step=configure)
2.	Enter a name for your application and your email
3.	Make sure the option for Guided Setup is checked
4.	Follow the instructions to add a Redirect URL to your application

## Add your application registration information to your solution (Advanced)
Now you need to register your application in the *Microsoft Application Registration Portal*:
1. Go to the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app) to register an application
2. Enter a name for your application and your email 
3.	Make sure the option for Guided Setup is unchecked
4.	Click `Add Platforms`, then select `Web`
5.	Go back to Visual Studio and, in Solution Explorer, select the project and look at the Properties window (if you don’t see a Properties window, press F4)
6.	Change SSL Enabled to `True`:<br/><br/>![Project properties](media/active-directory-serversidewebapp-aspnetwebappowin-configure/vsprojectproperties.png)<br />

7.	Copy the SSL URL and add this URL to the list of Redirect URLs in the Registration Portal’s list of Redirect URLs
8.	Add the following in `web.config` located in the root folder under the section `configuration\appSettings`:

```xml
<add key="ClientId" value="Enter_the_Application_Id_here" />
<add key="redirectUri" value="Enter_the_Redirect_URL_here" />
<add key="Tenant" value="common" />
<add key="Authority" value="https://login.microsoftonline.com/{0}/v2.0" /> 
```
9. Replace `ClientId` with the Application Id you just registered
10. Replace `redirectUri` with the SSL URL of your project 
<!-- End Docs -->

> Note
> ### Restricting users from only one organization to sign in to your application
> By default, personal accounts (including outlook.com, live.com, and others) as well as work and school accounts from any company or organization that has integrated with Azure Active Directory can sign in to your application. If you want your application to accept sign-ins only from one organization, replace the `Tenant` parameter in `web.config` from `Common` to the tenant name of the organization – example, `contoso.onmicrosoft.com`. After that, change the *ValidateIssuer* argument in your OWIN Startup class to `true`.
To allow users from only a list of specific organizations, set `ValidateIssuer` to `true` and use the `ValidIssuers` parameter to specify a list of organizations.
Another option is to implement a custom method to validate the issuers using `IssuerValidator parameter`. For more information about `TokenValidationParameters`, please see [this](https://msdn.microsoft.com/en-us/library/system.identitymodel.tokens.tokenvalidationparameters(v=vs.114).aspx) MSDN article.

