---
title: Use Azure Active Directory B2C to protect a ASP.NET Web API tutorial
description: Tutorial on hout to use Active Directory B2C to protect an ASP.NET web api and call it from an ASP.NET web app.
services: active-directory-b2c
author: patricka

ms.author: patricka
ms.reviewer: saraford
ms.date: 1/23/2017
ms.custom: mvc
ms.topic: tutorial
ms.service: active-directory-b2c
---

# Tutorial: Use Azure Active Directory B2C to protect an ASP.NET web API

This tutorial shows you through how to call a Azure Active Directory (AD) B2C protected web API resource from an ASP.NET web app.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Register a web API in your Azure AD B2C tenant
> * Define and configure scopes for a web API
> * Grant app permissions to the web API
> * Update sample code to use Azure AD B2C to protect a web API

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* Complete the [Use Azure Active Directory B2C for User Authentication in an ASP.NET Web App tutorial](active-directory-b2c-tutorials-web-app.md).
* Install [Visual Studio 2017](https://www.visualstudio.com/downloads/) with the **ASP.NET and web development** workload.

## Register web API

Web API resources need to be [registered](../active-directory/develop/active-directory-dev-glossary.md#application-registration) in your [tenant](../active-directory/develop/active-directory-dev-glossary.md#tenant) before they can accept and respond to [protected resource requests](../active-directory/develop/active-directory-dev-glossary.md#resource-server) by [client applications](../active-directory/develop/active-directory-dev-glossary.md#client-application) that present an [access token](../active-directory/develop/active-directory-dev-glossary.md#access-token) from Azure Active Directory. Registration establishes the [application and service principal object](../active-directory/develop/active-directory-dev-glossary.md#application-object) in your tenant. 

Log in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.

[!INCLUDE [active-directory-b2c-switch-b2c-tenant](../../includes/active-directory-b2c-switch-b2c-tenant.md)]

1. Select **Azure AD B2C** from the services list in the Azure portal.

2. In the B2C settings, click **Applications** and then click **+ Add**.

    To register the sample web API in your tenant, use the following settings.
    
    ![Add a new API](media/active-directory-b2c-tutorials-web-api/web-api-registration.png)
    
    | Setting      | Sample value  | Description                                        |
    | ------------ | ------- | -------------------------------------------------- |
    | **Name** | `My Sample Web API` | Enter a **Name** that describes your web API to developers. |
    | **Include web app / web API** | Yes | Select **Yes** for a web API. |
    | **Allow implicit flow** | Yes | Select **Yes** since the API uses [OpenID Connect sign-in](active-directory-b2c-reference-oidc.md). |
    | **Reply URL** | `https://localhost:44332` | Reply URLs are endpoints where Azure AD B2C returns any tokens that your API requests. In this tutorial, the sample web API runs locally (localhost) and listens on port 44332. |
    | **App ID URI** | `myAPISample` | The URI uniquely identifies the API in the tenant. This allows you to register multiple APIs per tenant. [Scopes](../active-directory/develop/active-directory-dev-glossary.md#scopes) govern access to the protected API resource and are defined per App ID URI. |
    | **Native client** | No | Since this is a web API and not a native client, select No. |
    
3. Click **Create** to register your API.

Registering your web API with Azure AD B2C defines a trust relationship. Since the API is registered with B2C, the API can now trust the B2C access tokens it receives from other applications.

## Define and configure scopes

[Scopes](../active-directory/develop/active-directory-dev-glossary.md#scopes) provide a way to govern access to protected resources. Scopes are used by the web API to implement scope-based access control. For example, some users could have both read and write access, whereas other users might have read-only permissions. In this tutorial, you define read and write permissions for the web API.

### Define scopes for the web API

Registered APIs are displayed in the applications list for the Azure AD B2C tenant. Select your web API from the list. The web API's property pane is displayed.

Click **Published scopes (Preview)**.

To configure scopes for the API, add the following entries. 

![scopes defined in web api](media/active-directory-b2c-tutorials-web-api/scopes-defined-in-web-api.png)

| Setting      | Sample value  | Description                                        |
| ------------ | ------- | -------------------------------------------------- |
| **Scope** | `Hello.Read` | Read access to hello |
| **Scope** | `Hello.Write` | Write access to hello |

The published scopes can be used to grant a client app permissions to the web API.

### Grant app permissions to web API

If you want to call a protected web API from an app, you need to grant your app permissions to the API. 

1. In the Azure portal, select **Azure AD B2C** from the services list and click **Applications** to view the registered app list.

2. Select `My Sample Web App` from the app list and click **API access (Preview)** then **+ Add**.

3. In the **Select API** dropdown, select your registered web API `My Sample Web API`.

4. In the **Select Scopes** dropdown, select the scopes you defined in the web API registration.

![selecting scopes for app](media/active-directory-b2c-tutorials-web-api/selecting-scopes-for-app.png)

5. Click **OK**.

Your `My Sample Web App` is registered to call the protected `My Sample Web API`. A user [authenticates](../active-directory/develop/active-directory-dev-glossary.md#authentication) with Azure AD B2C to use the web app. The web app obtains an [authorization grant](../active-directory/develop/active-directory-dev-glossary.md#authorization-grant) from Azure AD B2C to access the protected web API.

## Update web API code

Now that the web app and web API are registered and you have a policy, you need to configure your apps to use your B2C tenant.

Open the B2C-WebAPI-DotNet solution in Visual Studio.

> [!Note]
> By default, the samples are configured to talk to a demo tenant called `fabrikamb2c.onmicrosoft.com` To have these samples talk to your specific tenant, you need to update the Web.config for both projects.

> [!Note]
> You can go to Tools – Options – Projects and Solutions – General page and check the Track Active Item in Solution Explorer to keep track of which Web.config you are editing.

Comment out the aadb2cplayground site and uncomment the `locahost:44332` for the TaskServiceUrl where the Web API will run. The resulting code looks as follows: 

```C#
<!--<add key="api:TaskServiceUrl" value="https://aadb2cplayground.azurewebsites.net/" />-->

<add key="api:TaskServiceUrl" value="https://localhost:44332/"/>
```

Provide the App ID URI of the API to the Web App. The Web App uses the App ID URI to tell B2C which API it wants permissions to call. Comment out the fabrikamb2c tenant and updating your scopes as follows:

```C#
<!--<add key="api:ApiIdentifier" value="https://fabrikamb2c.onmicrosoft.com/api/" />—>

<add key="api:ApiIdentifier" value="https://dorfarasB2CTenant.onmicrosoft.com/api/" />

<add key="api:ReadScope" value="HelloRead" />

<add key="api:WriteScope" value="HelloWrite" />
```

Next, in the TaskService project, open the Web.config and make the following changes:

```C#
<add key="ida:Tenant" value="<Your Fictitious Test Company Name>.onmicrosoft.com" />

<add key="ida:ClientId" value="<The Application ID for your Web API as seen in portal>"/>
```

Update the value with the value you used to create your policy. If you’re following along this example, use the following value

```C#
<add key="ida:SignUpSignInPolicyId" value="b2c_1_SiUpIn" />
```

Update your scopes as follows:

```C#
<add key="api:ReadScope" value="HelloRead" />

<add key="api:WriteScope" value="HelloWrite" />
```

Now your samples are ready to run.

## Step 4 - Run and test the sample web application and web API

The Visual Studio solution contains two projects:

- **TaskWebApp** – A web application where you can view and modify your TODOs. 
- **TaskService** – A web API representing your TODO list. All CRUD operations are performed by this web API

You will need to run both the `TaskWebApp` and `TaskService` projects at the same time. 

1. In Solution Explorer, right-click on the solution and open the **Common Properties - Startup Project** window. 
2. Select **Multiple startup projects**.
3. Change the **Action** for both projects from **None** to **Start** as shown in the image below.

![Set Startup Page in Visual Studio](media/active-directory-b2c-tutorials-web-app/SetupStartupProjects.png)

Press **F5** to start both applications. Each application opens in its own tab browser as follows:

* `https://localhost:44316/` - This page is the ASP.NET Web Application. You interact directly with this page. 
* `https://localhost:44332/` - This page is the web API. For this walkthrough, you do not interact with this page.

Click the sign up / sign in link to sign up for the Web Application. Once signed in, click the **To-do list** link. Now you can create todo items. 

## Clean up resources

You can use your Azure AD B2C tenant if you plan to try other Azure AD B2C tutorials. When no longer needed, you can [delete your Azure AD B2C tenant](active-directory-b2c-faqs.md#how-do-i-delete-my-azure-ad-b2c-tenant).

## Next Steps

This article walked you through creating a Sign Up or Sign In policy. There are other built-in policies for resetting passwords, editing a profile, and so forth, which you can find more information about in the article [reference policies.](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-reference-policies)