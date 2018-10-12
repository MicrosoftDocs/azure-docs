---
title: Update an applications registered with Microsoft’s identity platform
description: Learn how to update an application registered with Microsoft’s identity platform.
services: active-directory
documentationcenter: ''
author: CelesteDG
manager: mtillman
editor: ''

ms.service: active-directory
ms.component: develop
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/24/2018
ms.author: celested
ms.custom: aaddev
ms.reviewer: lenalepa, sureshja
#Customer intent: As an application developer, I need to know how to update my applications in Azure Active Directory.
---

# Quickstart: Update an application registered with Microsoft’s identity platform

Enterprise developers and software-as-a-service (SaaS) providers who have registered applications with Microsoft's identity platform may need to update an application's registration to access other resources such as web APIs, make their applications available to other organizations, and more.

In this quickstart, you'll learn the various ways you can configure or update your application to meet yours and other organizations' requirements or needs.

## Prerequisites

To get started, make sure you've completed these steps:

* Read the overview of the [Azure AD consent framework](consent-framework.md), which is important to understand when building applications that need to be used by other users or applications.
* Have an account that has applications registered to it.
  * If you don't have apps registered, [learn how to register applications with Microsoft's identity platform](quickstart-integrate-apps-with-azure-ad.md).

## Configure a client application to access web APIs

For a web/confidential client application to be able to participate in an authorization grant flow that requires authentication (and obtain an access token), it must establish secure credentials. The default authentication method supported by the Azure portal is Client ID + secret key. This section covers the configuration steps required to provide the secret key with your client's credentials.

Additionally, before a client can access a web API exposed by a resource application (such as Microsoft Graph API), the consent framework ensures the client obtains the permission grant required, based on the permissions requested. By default, all applications can choose permissions from the Microsoft Graph API. The [Graph API “Sign-in and read user profile” permission](https://developer.microsoft.com/graph/docs/concepts/permissions_reference#user-permissions) is selected by default. You can select from [two types of permissions](active-directory-dev-glossary.md#permissions) for each desired web API:

- Application Permissions: Your client application needs to access the web API directly as itself (no user context). This type of permission requires administrator consent and is also not available for public (desktop and mobile) client applications.

- Delegated Permissions: Your client application needs to access the web API as the signed-in user, but with access limited by the selected permission. This type of permission can be granted by a user unless the permission requires administrator consent. 

  > [!NOTE]
  > Adding a delegated permission to an application does not automatically grant consent to the users within the tenant. Users must still manually consent for the added delegated permissions at runtime, unless the administrator grants consent on behalf of all users.

### Add Redirect URIs, application credentials, or permissions to access web APIs

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account or a personal Microsoft account.
2. If your account gives you access to more than one tenant, click your account in the top right corner, and set your portal session to the desired Azure AD tenant.
3. In the left-hand navigation pane, click the **Azure Active Directory** service, click **App registrations**, then find/click the application you want to configure.

4. You are taken to the application's main registration page, which opens the **Overview** page for the application. 

#### Add Redirect URIs
To add Redirect URI(s) to your application:
  - Select the **Authentication** section.
  - To add a custom Redirect URI for web and public client applications:
    - Locate the **Redirect URI** section.
    - Select the type of application you're building:  **Web** or **Public client (mobile & desktop)**.
    - Enter the Redirect URI for your application:
      - For web applications, provide the base URL of your application.  For example, http://localhost:31544 might be the URL for a web application running on your local machine.  Users would use this URL to sign into a web client application.
      - For public applications, provide the URI used by Azure AD to return token responses.  Enter a value specific to your application, for example http://MyFirstApp. 
  - To choose from suggested Redirect URIs for public clients (mobile, desktop):
    - Locate the Suggested **Redirect URIs for public clients (mobile, desktop)** section.
    - Select the appropriate Redirect URI(s) for your application using the checkboxes.

#### Add application credentials
To add a credential for your web application:
  - Select the **Certificates & secrets** section. 
  - To add a certificate:
    - Select **Upload certificate**
    - Select the file you'd like to upload. It must be one of the following file types: .cer, .pem, .crt.
    - Select **Add**.
  - To add a client secret:
     - Select **New client secret**
    - Add a description for your client secret.
    - Select a duration.
    - Select **Add**. The right-most column will contain the client secret value, after you save the configuration changes. **Be sure to copy the value** for use in your client application code as it is not accessible once you leave this page.

#### Add permissions to access web APIs

To add permission(s) to access resource APIs from your client
  - Select the **API permissions** section. 
  - Select the **Add a permission** button.
  - By default, the view allows you to select from **Microsoft APIs**. Select the section of APIs that you're interested in:
    - Select **Microsoft APIs** to select permissions for Microsoft APIs such as Microsoft Graph 
    - Select **APIs my organization uses** to select permissions for APIs that have been exposed by your organization, or APIs that your organization has integrated with.
    - Select **My APIs** to select permissions for APIs that you have exposed.
  - Select the API you're interested in.
  - You're taken to the **Request API Permissions** page. If the API exposes both delegated and application permissions, select which type of permission your application needs.
  - Select the permission(s) your application needs.
  - When finished, select **Add permissions**. You are returned to the **API permissions** page, where the permissions have been saved and added to the table.

## Configuring a resource application to expose web APIs

You can develop a web API and make it available to client applications by exposing [scopes](active-directory-dev-glossary.md#scopes) and [roles](active-directory-dev-glossary.md#roles). A correctly configured web API is made available just like the other Microsoft web APIs, including the Graph API and the Office 365 APIs. 

### Add access scopes to your resource application

In this example, we will expose a new scope called `Employees.Read.All` on our resource/API.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account or a personal Microsoft account.
2. If your account gives you access to more than one tenant, click your account in the top right corner, and set your portal session to the desired Azure AD tenant.
3. In the left-hand navigation pane, click the **Azure Active Directory** service, click **App registrations**, then find/click the application you want to configure.
4. You are taken to the application's main registration page, which opens the application's **Overview** page. 
5. Select the **Expose an API** section.
6. Select **Add a scope**.
7. If you have not set an **Application ID URI**, you will see a prompt to enter one. Enter your Application ID URI or use the one provided and select **Save and continue**.
8. When the **Add a scope** page appears, enter your scope's information: 
  - **Scope name:** Enter a meaningful name for your scope. For this example, we'll use `Employees.Read.All`.
  - **Who can consent:** Select whether this scope can be consented to by users, or if admin consent is required. Select **Admins only** for higher-privileged permissions.
  
  - **Admin consent display name:** Enter a meaningful description for your scope which admins will see.
    - For example: "Read-only access to Employee records"

  - **Admin consent description:** Enter a meaningful description for your scope which admins will see. 
    - For example: "Allow the application to have read-only access to all Employee data."

  If users can consent to your scope, also provide:
  - **User consent display name:** Enter a meaningful name for your scope which users will see.
    - For example: "Read-only access to your Employee records".

  - **User consent description:** Enter a meaningful description for your scope which users will see.
    - For example: "Allow the application to have read-only access to your Employee data."

Alternatively, you can expose scopes or roles by modifying the resource application's manifest.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account or a personal Microsoft account.
2. If your account gives you access to more than one tenant, click your account in the top right corner, and set your portal session to the desired Azure AD tenant.

3. In the left-hand navigation pane, click the **Azure Active Directory** service, click **App registrations**, then find/click the application you want to configure.


4. You are taken to the application's main registration page, which opens the application's **Overview** page. Select the **Manifest** section. A web-based manifest editor opens, allowing you to **Edit** the manifest within the portal. Optionally, you can click **Download** and edit locally, then use **Upload** to reapply it to your application.

5. In this example, we will expose a new scope called `Employees.Read.All` on our resource/API, by adding the following JSON element to the `oauth2Permissions` collection.

  ```json
  {
    "adminConsentDescription": "Allow the application to have read-only access to all Employee data.",
    "adminConsentDisplayName": "Read-only access to Employee records",
    "id": "2b351394-d7a7-4a84-841e-08a6a17e4cb8",
    "isEnabled": true,
    "type": "User",
    "userConsentDescription": "Allow the application to have read-only access to your Employee data.",
    "userConsentDisplayName": "Read-only access to your Employee records",
    "value": "Employees.Read.All"
  }
  ```
  > [!NOTE]
  > The "id" value must be generated using a GUID generation tool such as [guidgen](https://msdn.microsoft.com/library/ms241442%28v=vs.80%29.aspx) or programmatically. It represents a unique identifier for the scope as exposed by the web API. Once a client is appropriately configured with permissions to access your web API, it is issued an OAuth2.0 access token by Azure AD. When the client calls the web API, it presents the access token that has the scope (scp) claim set to the permissions requested in its application registration.
  >
  > You can expose additional scopes later as necessary. Consider that your web API might expose multiple scopes associated with a variety of different functions. Your resource can control access to the web API at runtime, by evaluating the scope (`scp`) claim(s) in the received OAuth 2.0 access token.
  > 

6. When finished, click **Save**. Now your web API is configured for use by other applications in your directory.  


### Verify the web API is exposed to other applications

1. Go back to your Azure AD tenant, select **App registrations** again, then find/select the client application you want to configure.


2. Repeat the steps outlined in [Configure a client application to access web APIs](#configure-a-client-application-to-access-web-apis). When you get to the **Select an API** step, select your resource.

3. You should see the new scope, available for client permission requests.


### More on the application manifest

The application manifest serves as a mechanism for updating the Application entity, which defines all attributes of an Azure AD application's identity configuration. For more information on the Application entity and its schema, see the [Graph API Application entity documentation](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#application-entity). The article contains complete reference information on the Application entity members used to specify permissions for your API, including:  

- The appRoles member, which is a collection of [AppRole](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#approle-type) entities, used to define [application permissions](active-directory-dev-glossary.md#permissions) for a web API. 
- The oauth2Permissions member, which is a collection of [OAuth2Permission](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#oauth2permission-type) entities, used to define [delegated permissions](active-directory-dev-glossary.md#permissions) for a web API.

For more information on application manifest concepts in general, see [Understanding the Azure Active Directory application manifest](active-directory-application-manifest.md).

## Configuring supported accounts

When registering an application in Azure AD, you may want your application to be accessed only by users in your organization. Alternatively, you may also want your application to be accessible by users in external organizations, or by users in external organizations as well as users that are not necessarily part of an organization (personal accounts).

This section discusses how to modify the configuration of an application to change who the application can be accessed by. 

It’s important to note the differences between the options for supported accounts:  

- An application that supports only accounts from one organization (referred to as a single-tenant application) is typically a line-of-business (LoB) application written by an enterprise developer. A single-tenant application can only be accessed by users with accounts in the same tenant as the application registration. As a result, it only needs to be provisioned in one directory.
- A multi-tenant application is intended for use in many organizations. Referred to as a software-as-a-service (SaaS) web application, it's typically written by an independent software vendor (ISV). Multi-tenant applications must be provisioned in each tenant where users need access. For tenants other than the one where the application is registered, user or administrator consent is required to register them. 

Note that native client applications are multi-tenant by default as they are installed on the resource owner's device. See the preceding [Overview of the consent framework](#overview-of-the-consent-framework) section for details on the consent framework.

Making an application multi-tenant requires both application registration changes, as well as changes to the web application itself. The following sections cover both.

#### Changing the application registration to support different accounts 

If you are writing an application that you want to make available to your customers or partners outside of your organization, you need to update the application definition in the Azure portal.

> [!IMPORTANT]
> Azure AD requires the Application ID URI of multi-tenant applications to be globally unique. The App ID URI is one of the ways an application is identified in protocol messages. For a single tenant application, it is sufficient for the App ID URI to be unique within that tenant. For a multi-tenant application, it must be globally unique so Azure AD can find the application across all tenants. 
> Global uniqueness is enforced by requiring the App ID URI to have a host name that matches a verified domain of the Azure AD tenant. For example, if the name of your tenant is contoso.onmicrosoft.com then a valid App ID URI would be https://contoso.onmicrosoft.com/myapp. If your tenant has a verified domain of contoso.com, then a valid App ID URI would also be https://contoso.com/myapp. If the App ID URI doesn’t follow this pattern, setting an application as multi-tenant fails.
> 
#### Changing the application to support different accounts
To change who can access your application: 

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account or a personal Microsoft account.
2. If your account gives you access to more than one tenant, click your account in the top right corner, and set your portal session to the desired Azure AD tenant.
3. In the left-hand navigation pane, click the **Azure Active Directory** service, click **App registrations**, then find/click the application you want to configure. You are taken to the application's main registration page, which opens the application's **Overview** page.
4. Select the **Authentication** section and change the value selected under **Supported account types**.
    - Select **Accounts in this directory only** if you are building a line-of-business (LOB) application. This option is not available if the application is not registered in a directory.
    - Select **Accounts in any organizational directory** if you would like to target all business and educational customers.
    - Select  **Accounts in any organizational directory and personal Microsoft accounts** to target the widest set of customers.
5. Select **Save**.


### Enabling OAuth 2.0 implicit grant for Single Page Applications

Single Page Application’s (SPAs) are typically structured with a JavaScript-heavy front end that runs in the browser, which calls the application’s web API back-end to perform its business logic. For SPAs hosted in Azure AD, you use OAuth 2.0 Implicit Grant to authenticate the user with Azure AD and obtain a token that you can use to secure calls from the application's JavaScript client to its back-end web API. 

After the user has granted consent, this same authentication protocol can be used to obtain tokens to secure calls between the client and other web API resources configured for the application. To learn more about the implicit authorization grant, and help you decide whether it's right for your application scenario, see [Understanding the OAuth2 implicit grant flow in Azure Active Directory](active-directory-dev-understanding-oauth2-implicit-grant.md).

By default, OAuth 2.0 implicit Grant is disabled for applications. You can enable OAuth 2.0 Implicit Grant for your application by following the steps outlined below.

#### To enable OAuth 2.0 implicit grant

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account or a personal Microsoft account.
2. If your account gives you access to more than one tenant, click your account in the top right corner, and set your portal session to the desired Azure AD tenant.
3. In the left-hand navigation pane, click the **Azure Active Directory** service, click **App registrations**, then find/click the application you want to configure. You are taken to the application's main registration page, which opens the **Overview** page for the application.
4. Select the **Authentication** section and locate the **Implicit grant** section under **Advanced settings**.
5. Select **ID tokens**, **Access tokens**, or both and select **Save**.

## Next steps

Learn about these other related app management quickstarts for apps:
- [Register an application with Microsoft's identity platform](quickstart-v1-integrate-apps-with-azure-ad.md)
- [Remove an application register with Microsoft's identity platform](quickstart-v1-remove-azure-ad-app.md)

To learn more about the two Azure AD objects that represent a registered application and the relationship between them, see [Application objects and service principal objects](app-objects-and-service-principals.md).

To learn more about the branding guidelines you should use when developing applications with Azure Active Directory, see [Branding guidelines for applications](howto-add-branding-in-azure-ad-apps.md).