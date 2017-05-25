---
title: Azure AD v2 ASP.NET Web Server Getting Started - Test | Microsoft Docs
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
ms.custom: aaddev

---
## Test your code

Press `F5` to run your project in Visual Studio. The browser will open and direct you to *http://localhost:{port}* where you’ll see the *Sign in with Microsoft* button. Go ahead and click it to sign in.

When you're ready to test, use a work or school (Azure Active Directory), or a personal (live.com, outlook.com) account to sign in. 

![Sign-in with Microsoft browser window](media/active-directory-serversidewebapp-aspnetwebappowin-test/aspnetbrowsersignin.png)

![Sign-in with Microsoft browser window](media/active-directory-serversidewebapp-aspnetwebappowin-test/aspnetbrowsersignin2.png)

#### Expected results
After sign-in, the user is redirected to the home page of your web site which is the HTTPS URL specified in your application registration information in the Microsoft Application Registration Portal. This page now shows *Hello {User}* and a link to sign-out, and a link to see the user’s claims – which is a link to the Authorize controller created earlier.

### See user's claims
Select the hyperlink to see the user's claims. This leads you to the controller and view that is only available to users that are authenticated.

#### Expected results
 You should see a table containing the basic properties of the logged user:

| Property | Value | Description|
|---|---|---|
| Name | {User Full Name} | The user’s first and last name
|Username | <span>user@domain.com</span>| The username used to identify the logged user
| Subject| {Subject}|A string to uniquely identify the user logon across the web|
| Tenant ID| {Guid}| A *guid* to uniquely represent the user’s Azure Active Directory organization.|

In addition, you will see a table including all user claims included in authentication request. For a list of all claims in an Id Token and explanation please see this [article](https://docs.microsoft.com/azure/active-directory/develop/active-directory-token-and-claims "List of Claims in Id Token").


### Test accessing a method that has an *[Authorize]* attribute (Optional)
In this step, you will test accessing the Authenticated controller as an anonymous user:<br/>
Select the link to sign-out the user and complete the sign-out process.<br/>
Now in your browser, type http://localhost:{port}/authenticated to access your controller that is protected with the `[Authorize]` attribute

#### Expected results
You should receive the prompt requiring you to authenticate to see the view.

## Additional information

<!--start-collapse-->
### Protect your entire web site
To protect your entire web site, add the `AuthorizeAttribute` to `GlobalFilters` in `Global.asax` `Application_Start` method:

```csharp
GlobalFilters.Filters.Add(new AuthorizeAttribute());
```
<!--end-collapse-->

<div></div>
<br/>

> [!NOTE]
> **How to restrict users from only one organization to sign in to your application**

> By default, personal accounts (including outlook.com, live.com, and others) as well as work and school accounts from any company or organization that has integrated with Azure Active Directory can sign-in to your application. 

> If you want your application to accept sign-ins from only one Azure Active Directory organization, replace the `Tenant` parameter in *web.config* from `Common` to the tenant name of the organization – example, *contoso.onmicrosoft.com*. After that, change the `ValidateIssuer` argument in your *OWIN Startup class* to `true`.

> To allow users from only a list of specific organizations, set `ValidateIssuer` to true and use the `ValidIssuers` parameter to specify a list of organizations.

> Another option is to implement a custom method to validate the issuers using IssuerValidator parameter. For more information about `TokenValidationParameters`, please see [this](https://msdn.microsoft.com/library/system.identitymodel.tokens.tokenvalidationparameters.aspx "TokenValidationParameters MSDN article") MSDN article.

