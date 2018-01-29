---
title: Use Azure Active Directory B2C for User Authentication in an ASP.NET Web App
description: Tutorial on how to use Azure Active Directory B2C to sign-in and sign-up users in an ASP.NET web app.
services: active-directory-b2c
author: PatAltimore

ms.author: patricka
ms.reviewer: saraford
ms.date: 1/23/2017
ms.custom: mvc
ms.topic: tutorial
ms.service: active-directory-b2c
---

# Use Azure Active Directory B2C for User Authentication in an ASP.NET Web App

This tutorial shows you how to use Azure Active Directory B2C to sign-in and sign-up users in an ASP.NET web app. Azure Active Directory (AD) B2C enables your apps to authenticate to:

* Social accounts such as Facebook, Google, LinkedIn, and more.
* Enterprise accounts using open standard protocols such as OpenID Connect or SAML.
* Azure Active Directory accounts 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Register the sample ASP.NET web app in your Azure AD B2C tenant.
> * Create a user sign-up or sign-in policy using an email address and password.
> * Configure the sample web app to use your Azure AD B2C tenant. 

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* Create your own [Azure AD B2C Tenant](active-directory-b2c-get-started)
* Install [Visual Studio 2017](https://www.visualstudio.com/downloads/) with the **ASP.NET and web development** workload.

## Register web app

Applications need to be [registered](../active-directory/develop/active-directory-dev-glossary.md#application-registration) in your [tenant](../active-directory/develop/active-directory-dev-glossary.md#tenant) before they can receive [access tokens](../active-directory/develop/active-directory-dev-glossary.md#access-token) from Azure Active Directory. App registration creates an [application id](../active-directory/develop/active-directory-dev-glossary.md#application-id-client-id) for the app in your tenant. 

Log in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.

[!INCLUDE [active-directory-b2c-switch-b2c-tenant](../../includes/active-directory-b2c-switch-b2c-tenant.md)]

1. Select **Azure AD B2C** from the services list in the Azure portal

2. In the B2C settings, click **Applications** and then click **+ Add**.

    To register the sample web app in your tenant, use the following settings.

    ![Add a new app](media/active-directory-b2c-tutorials-web-app/web-app-registration.png)

    | Setting      | Sample value  | Description                                        |
    | ------------ | ------- | -------------------------------------------------- |
    | **Name** | `My Sample Web App` | Enter a **Name** that describes your app to consumers. | 
    | **Include web app / web API** | Yes | Select **Yes** for a web app. |
    | **Allow implicit flow** | Yes | Select **Yes** since the app uses [OpenID Connect sign-in](active-directory-b2c-reference-oidc.md). |
    | **Reply URL** | `https://localhost:44316` | Reply URLs are endpoints where Azure AD B2C returns any tokens that your app requests. In this tutorial, the sample is runs locally (localhost) and listens on port 44316. |
    | **Native client** | No | Since this is a web app and not a native client, select No. |

3. Click **Create** to register your app.

Registered apps are displayed in the applications list for the Azure AD B2C tenant. Select your web app from the list. The web app's property pane is displayed.

![Web app properties](./media/active-directory-b2c-tutorials-web-app/b2c-web-app-properties.png)

Make note of the **Application Client ID**. The ID uniquely identifies the app and is needed when configuring the app later in the tutorial.

### Create a client password

Azure AD B2C uses [OAuth2 authorization for client applications](../active-directory/develop/active-directory-dev-glossary.md#client-application). [Web apps are confidential clients](../active-directory/develop/active-directory-dev-glossary.md#web-client) and require a client secret (password). The application client id and client secret are used when the web app [authenticates with Azure Active Directory](../active-directory/develop/active-directory-dev-glossary.md#authorization-server). 

1. Select the Keys page for the registered web app and click **Generate key**.

2. Click **Save** to display the key.

    ![app general keys page](media/active-directory-b2c-tutorials-web-app/app-general-keys-page.png)

The key is displayed once in the portal. It's important to copy and save the key value. You need this value for configuring your app. Keep the key secure. You shouldn't share the key publicly.

## Create a sign-up or sign-in policy

An Azure AD B2C policy defines user workflows. For example, signing in, signing up, or changing passwords are common workflows. To sign up users to access then sign in to the web app, create a **sign-up or sign-in** policy.

1. From the Azure AD B2C portal page, select **Sign-up or sign-in policies** and click **Add**.

    To configure your policy, use the following settings.

    ![Add a sign-up or sign-in policy](media/active-directory-b2c-tutorials-web-app/add-susi-policy.png)

    | Setting      | Sample value  | Description                                        |
    | ------------ | ------- | -------------------------------------------------- |
    | **Name** | `b2c_1_SiUpIn` | Enter a **Name** for the policy. `b2c_1_SiUpIn` is policy name used in the sample code. | 
    | **Identity provider** | `email signup` | This is the identity provider used to uniquely identify the user. |
    | **Sign up attributes** | `Display Name` and `Postal Code` | Select attributes to be collected from the user during signup. |
    | **Application claims** | `Display Name`, `Postal Code`, `User is new`, `User's Object ID` | Select [claims](../active-directory/develop/active-directory-dev-glossary.md#claim) you want to be included in the [access token](../active-directory/develop/active-directory-dev-glossary.md#access-token). |

2. Click **Create** to create your policy. 

## Update web app code

Now that you have a web app registered and a policy created, you need to configure your app to use your Azure AD B2C tenant. In this tutorial, you configure a sample web app. 

[Download a zip file](https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi/archive/master.zip) or clone the sample web app from GitHub.

    ```
    git clone https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi.git
    ```

The sample ASP.NET web app is a simple task list app for creating and updating a to-do list. The app uses [Microsoft OWIN middleware components](https://docs.microsoft.com/en-us/aspnet/aspnet/overview/owin-and-katana/) to let users sign up to use the app in your Azure AD B2C tenant. By creating a Azure AD B2C policy, users can use a social account or create an account to use as their identity to access the app. 

There are two projects in the sample solution:

**Web app sample app (TaskWebApp):** Web app to create and edit a task list. The web app uses the **sign-up or sign-in** policy to sign up or sign in users with an email address.

**Web API sample app (TaskService):** Web API that supports the create, read,  update, and delete task list functionality. The web API is secured by Azure AD B2C and called by the web app.

The sample is configured to use a demo tenant `fabrikamb2c.onmicrosoft.com`. You need to change the app to use the app registration in your tenant. You also need to configure the policy. The sample web app defines these values as app settings in the Web.config file. To change the app settings:

1. Open the `B2C-WebAPI-DotNet` solution in Visual Studio.

2. In the `TaskWebApp` web app project, open the **Web.config** file and make the following updates:

    ```C#
    <add key="ida:Tenant" value="<Your tenant name>.onmicrosoft.com" />
    
    <add key="ida:ClientId" value="The Application ID for your web app registered in your tenant" />
    
    <add key="ida:ClientSecret" value="Client password (client secret)" />
    ```
3. Update the value with the value you used to create your policy. The value for this walkthrough is **b2c_1_SiUpIn**

    ```C#
    <add key="ida:SignUpSignInPolicyId" value="b2c_1_SiUpIn" />
    ```

## Run the sample web app

In Solution Explorer, right-click on the **TaskWebApp** project and click **Set as StartUp Project**

Press **F5** to start the web app. The default browser launches to the local web site address `https://localhost:44316/`. 

### Sign up using an email address

1. Click the **Sign up / Sign in** link in the top banner to sign up as a user of the web app. This uses the **b2c_1_SiUpIn** policy you defined in a previous step.

2. Azure AD B2C presents a sign-in page with a sign-up link. Since you don't have an account yet, click the **Sign up now** link. 

3. The sign-up workflow presents a page to collect and verify the user's identity using an email address. The sign-up workflow also collects the user's password and the requested attributes defined in the policy.

    Use a valid email address and validate using the verification code. Set a password. Enter values for the requested attributes. 

    ![Sign-up workflow](media/active-directory-b2c-tutorials-web-app/sign-up-workflow.png)

4. Click **Create** to create a local account in the Azure AD B2C tenant.



## Next Steps

In this tutorial, you learned how to create an Azure AD B2C tenant, create a sign-up or sign-in policy, and update the sample web app to use your Azure AD B2C tenant. Continue to the next tutorial to learn how to register, configure, and call a ASP.NET web API secured by your Azure AD B2C tenant.

> [!div class="nextstepaction"]
> [Access a B2C-secured ASP.NET Web API resource](active-directory-b2c-tutorials-web-api.md)
