---
title: include file
description: include file
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: include
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/19/2018
ms.author: jmprieur
ms.custom: include file 

---

## Test your code

To test your application in Visual Studio, press **F5** to run your project. The browser opens to the http://<span></span>localhost:{port} location and you see the **Sign in with Microsoft** button. Select the button to start the sign-in process.

When you're ready to run your test, use a Microsoft Azure Active Directory (Azure AD) account (work or school account) or a personal Microsoft account (<span>live.</span>com or <span>outlook.</span>com) to sign in.

![Sign in with Microsoft](media/active-directory-develop-guidedsetup-aspnetwebapp-test/aspnetbrowsersignin.png)
<br/><br/>
![Sign in to your Microsoft account](media/active-directory-develop-guidedsetup-aspnetwebapp-test/aspnetbrowsersignin2.png)

#### View application results

After you sign in, the user is redirected to the home page of your website. The home page is the HTTPS URL that is specified in your application registration information in the Microsoft Application Registration Portal. The home page includes a welcome message *"Hello \<User>,"* a link to sign out, and a link to view the user’s claims. The link for the user's claims browses to the *Claims* controller that you created earlier.

### Browse to see the user's claims

To see the user's claims, select the link to browse to the controller view that is available only to authenticated users.

#### View the claims results

After you browse to the controller view, you should see a table that contains the basic properties for the user:

|Property |Value |Description |
|---|---|---|
|**Name** |User's full name | The user’s first and last name.
|**Username** |user<span>@domain.com</span> | The username that is used to identify the user.
|**Subject** |Subject |A string that uniquely identifies the user across the web.|
|**Tenant ID** |Guid | A **guid** that uniquely represents the user’s Azure AD organization.|

In addition, you should see a table of all claims that are in the authentication request. For more information, see the [list of claims that are in an Azure AD ID Token](https://docs.microsoft.com/azure/active-directory/develop/active-directory-token-and-claims).

### Test access to a method that has an Authorize attribute (optional)

To test access as an anonymous user to a controller protected with the `Authorize` attribute, follow these steps:

1. Select the link to sign out the user and complete the sign-out process.
2. In your browser, type http://<span></span>localhost:{port}/claims to access your controller that is protected with the `Authorize` attribute.

#### Expected results after access to a protected controller

You're prompted to authenticate to use the protected controller view.

## Advanced options

<!--start-collapse-->
### Protect your entire website
To protect your entire website, in the **Global.asax** file, add the `AuthorizeAttribute` attribute to the `GlobalFilters` filter in the `Application_Start` method:

```csharp
GlobalFilters.Filters.Add(new AuthorizeAttribute());
```
<!--end-collapse-->

### Restrict who can sign in to your application

By default when you build the application created by this guide, your application will accept sign-ins of personal accounts (including outlook.com, live.com, and others) as well as work and school accounts from any company or organization that has integrated with Azure Active Directory. This is a recommended option for SaaS applications.

To restrict user sign-in access for your application, multiple options are available:

#### Option 1: Restrict users from only one organization's Active Directory instance to sign in to your application (single-tenant)

This option is a common scenario for *LOB applications*: If you want your application to accept sign-ins only from accounts that belong to a specific Azure Active Directory instance (including *guest accounts* of that instance) do the following:

1. In the **web.config** file, change the value for the `Tenant` parameter from `Common` to the tenant name of the organization, such as `contoso.onmicrosoft.com`.
2. In your [OWIN Startup class](#configure-the-authentication-pipeline), set the `ValidateIssuer` argument to `true`.

#### Option 2: Restrict access to your application to users in a specific list of organizations

You can restrict sign-in access to only user accounts that are in an Azure AD organization that is in the list of allowed organizations:
1. In your [OWIN Startup class](#configure-the-authentication-pipeline), set the `ValidateIssuer` argument to `true`.
2. Set the value of the `ValidIssuers` parameter to the list of allowed organizations.

#### Option 3: Use a custom method to validate issuers

You can implement a custom method to validate issuers by using the **IssuerValidator** parameter. For more information about how to use this parameter, read about the [TokenValidationParameters class](/previous-versions/visualstudio/dn464192(v=vs.114)).
