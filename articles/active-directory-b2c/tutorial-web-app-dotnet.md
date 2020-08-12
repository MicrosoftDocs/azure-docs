---
title: "Tutorial: Enable authentication in a web application"
titleSuffix: Azure AD B2C
description: Tutorial on how to use Azure Active Directory B2C to provide user login for an ASP.NET web application.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.author: mimart
ms.date: 10/14/2019
ms.custom: mvc
ms.topic: tutorial
ms.service: active-directory
ms.subservice: B2C
---

# Tutorial: Enable authentication in a web application using Azure Active Directory B2C

This tutorial shows you how to use Azure Active Directory B2C (Azure AD B2C) to sign in and sign up users in an ASP.NET web application. Azure AD B2C enables your applications to authenticate to social accounts, enterprise accounts, and Azure Active Directory accounts using open standard protocols.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Update the application in Azure AD B2C
> * Configure the sample to use the application
> * Sign up using the user flow

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* [Create user flows](tutorial-create-user-flows.md) to enable user experiences in your application.
* Install [Visual Studio 2019](https://www.visualstudio.com/downloads/) with the **ASP.NET and web development** workload.

## Update the application registration

In the tutorial that you completed as part of the prerequisites, you registered a web application in Azure AD B2C. To enable communication with the sample in this tutorial, you need to add a redirect URI and create a client secret (key) for the registered application.

### Add a redirect URI (reply URL)

To update an application in your Azure AD B2C tenant, you can use our new unified **App registrations** experience or our legacy  **Applications (Legacy)** experience. [Learn more about the new experience](https://aka.ms/b2cappregtraining).

#### [App registrations](#tab/app-reg-ga/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **App registrations**, select the **Owned applications** tab, and then select the *webapp1* application.
1. Under **Web**, select the **Add URI** link, enter `https://localhost:44316`, and then select **Save**.
1. Select **Overview**.
1. Record the **Application (client) ID** for use in a later step when you configure the web application.

#### [Applications (Legacy)](#tab/applications-legacy/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Applications (Legacy)**, and then select the *webapp1* application.
1. Under **Reply URL**, add `https://localhost:44316`.
1. Select **Save**.
1. On the properties page, record the application ID for use in a later step when you configure the web application.

* * *

### Create a client secret

Next, create a client secret for the registered web application. The web application code sample uses this to prove its identity when requesting tokens.

[!INCLUDE [active-directory-b2c-client-secret](../../includes/active-directory-b2c-client-secret.md)]

## Configure the sample

In this tutorial, you configure a sample that you can download from GitHub. The sample uses ASP.NET to provide a simple to-do list. The sample uses [Microsoft OWIN middleware components](https://docs.microsoft.com/aspnet/aspnet/overview/owin-and-katana/). [Download a zip file](https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi/archive/master.zip) or clone the sample from GitHub. Make sure that you extract the sample file in a folder where the total character length of the path is less than 260.

```
git clone https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi.git
```

The following two projects are in the sample solution:

* **TaskWebApp** - Create and edit a task list. The sample uses the **sign-up or sign-in** user flow to sign up and sign in users.
* **TaskService** - Supports the create, read, update, and delete task list functionality. The API is protected by Azure AD B2C and called by TaskWebApp.

You change the sample to use the application that's registered in your tenant, which includes the application ID and the key that you previously recorded. You also configure the user flows that you created. The sample defines the configuration values as settings in the *Web.config* file.

Update the settings in the Web.config file to work with your user flow:

1. Open the **B2C-WebAPI-DotNet** solution in Visual Studio.
1. In the **TaskWebApp** project, open the **Web.config** file.
    1. Update the value of `ida:Tenant` and `ida:AadInstance` with the name of the Azure AD B2C tenant that you created. For example, replace `fabrikamb2c` with `contoso`.
    1. Replace the value of `ida:TenantId` with the directory ID, which you can find in the properties for your Azure B2C tenant (in the Azure portal under **Azure Active Directory** > **Properties** > **Directory ID**).
    1. Replace the value of `ida:ClientId` with the application ID that you recorded.
    1. Replace the value of `ida:ClientSecret` with the key that you recorded. If the client secret contains any predefined XML entities, for example less than (`<`), greater than (`>`), ampersand (`&`), or double quote (`"`), you must escape those characters by XML-encoding the client secret before adding it to your Web.config.
    1. Replace the value of `ida:SignUpSignInPolicyId` with `b2c_1_signupsignin1`.
    1. Replace the value of `ida:EditProfilePolicyId` with `b2c_1_profileediting1`.
    1. Replace the value of `ida:ResetPasswordPolicyId` with `b2c_1_passwordreset1`.

## Run the sample

1. In Solution Explorer, right-click the **TaskWebApp** project, and then click **Set as StartUp Project**.
1. Press **F5**. The default browser launches to the local web site address `https://localhost:44316/`.

### Sign up using an email address

1. Select **Sign up / Sign in** to sign up as a user of the application. The **b2c_1_signupsignin1** user flow is used.
1. Azure AD B2C presents a sign-in page with a sign-up link. Since you don't have an account yet, select **Sign up now**. The sign-up workflow presents a page to collect and verify the user's identity using an email address. The sign-up workflow also collects the user's password and the requested attributes defined in the user flow.
1. Use a valid email address and validate using the verification code. Set a password. Enter values for the requested attributes.

    ![Sign-up page shown as part of sign-in/sign-up workflow](./media/tutorial-web-app-dotnet/sign-up-workflow.PNG)

1. Select **Create** to create a local account in the Azure AD B2C tenant.

The application user can now use their email address to sign in and use the web application.

However, the **To-Do List** feature won't function until you complete the next tutorial in the series, [Tutorial: Use Azure AD B2C to protect an ASP.NET web API](tutorial-web-api-dotnet.md).

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Update the application in Azure AD B2C
> * Configure the sample to use the application
> * Sign up using the user flow

Now move on to the next tutorial to enable the **To-Do List** feature of the web application. In it, you register a web API application in your own Azure AD B2C tenant, and then modify the code sample to use your tenant for API authentication.

> [!div class="nextstepaction"]
> [Tutorial: Use Azure Active Directory B2C to protect an ASP.NET web API >](tutorial-web-api-dotnet.md)
