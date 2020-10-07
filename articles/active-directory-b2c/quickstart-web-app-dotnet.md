---
title: "Quickstart: Set up sign-in for an ASP.NET web app"
titleSuffix: Azure AD B2C
description: In this Quickstart, run a sample ASP.NET web app that uses Azure Active Directory B2C to provide account sign-in.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.topic: quickstart
ms.custom: "devx-track-csharp, mvc"
ms.date: 10/07/2020
ms.author: mimart
ms.subservice: B2C
---

# Quickstart: Set up sign in for an ASP.NET application using Azure Active Directory B2C

Azure Active Directory B2C (Azure AD B2C) provides cloud identity management to keep your application, business, and customers protected. Azure AD B2C enables your applications to authenticate to social accounts and enterprise accounts using open standard protocols. In this quickstart, you use an ASP.NET application to sign in using a social identity provider and call an Azure AD B2C protected web API.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- [Visual Studio 2019](https://www.visualstudio.com/downloads/) with the **ASP.NET and web development** workload.
- A social account from Facebook, Google, or Microsoft.
- [Download a zip file](https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi/archive/master.zip) or clone the sample web application from GitHub.

    ```
    git clone https://github.com/Azure-Samples/active-directory-b2c-dotnet-webapp-and-webapi.git
    ```

    There are two projects are in the sample solution:

    - **TaskWebApp** - A web application that creates and edits a task list. The web application uses the **sign-up or sign-in** user flow to sign up or sign in users.
    - **TaskService** - A web API that supports the create, read, update, and delete task list functionality. The web API is protected by Azure AD B2C and called by the web application.

- An Azure AD B2C Tenant (if you don't have one, follow the steps in the next section to configure it)

### Configure Azure AD B2C tenant and update project configuration

To follow this guide, you need an Azure AD B2C tenant. Following steps outline the necessary configuration steps. After configuring your Azure AD B2C tenant, you will need to update the project files to reference your Azure AD B2C tenant.

#### Step 1: Get your own Azure AD B2C tenant

First, you'll need an Azure AD B2C tenant. If you don't have an existing Azure AD B2C tenant that you can use for testing purposes, you can create your own by following these [instructions](https://azure.microsoft.com/documentation/articles/active-directory-b2c-get-started/).

#### Step 2: Create your own policies

This sample uses three types of policies: a unified sign-up/sign-in policy, a profile editing policy, and a password reset policy. Create one policy of each type by following [the built-in policy instructions](https://azure.microsoft.com/documentation/articles/active-directory-b2c-reference-policies). You may choose to include as many or as few identity providers as you wish.

If you already have existing policies in your Azure AD B2C tenant, feel free to re-use those policies in this sample.

Make sure that all the three policies return **User's Object ID** and **Display Name** on **Application Claims**. To do that, on Azure Portal, go to your B2C Directory then click **User flows (policies)** on the left menu and select your policy. Then click on **Application claims** and make sure that **User's Object ID** and **Display Name** is checked.

#### Step 3: Register your ASP.NET Web API with Azure AD B2C

Follow the instructions at [register a Web API with Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-app-registration#register-a-web-api) to register the ASP.NET Web API sample with your tenant. Registering your Web API allows you to define the scopes that your ASP.NET Web Application will request access tokens for.

Provide the following values for the ASP.NET Web API registration:

- Provide a descriptive Name for the ASP.NET Web API, for example, `My Test ASP.NET Web API`. You will identify this application by its Name whenever working in the Azure portal.
- Set the **Reply URL** to `https://localhost:44332/`. This is the port number that this ASP.NET Web API sample is configured to run on.
- Set the **AppID URI** to `demoapi`. This AppID URI is a unique identifier representing this particular ASP.NET Web API. The AppID URI is used to construct the scopes that are configured in your ASP.NET Web Application. For example, in this ASP.NET Web API sample, the scope will have the value `https://<your-tenant-name>.onmicrosoft.com/demoapi/read`
- Create the application.
- Once the application is created, open your `My Test ASP.NET Web API` application and then open the **Published Scopes** window (in the left nav menu). Add the following 2 scopes:
  - **Scope** named `read` followed by a description `demoing a read scenario`.
  - **Scope** named `write` followed by a description `demoing a write scenario`.
- Click **Save**.

#### Step 4: Register your ASP.NET Web Application with Azure AD B2C

Follow the instructions at [register a Web Application with Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-devquickstarts-web-dotnet-susi)

Your web application registration should include the following information:

- Provide a descriptive Name for your web application, for example, `My Test ASP.NET Web Application`. You can identify this application by its Name within the Azure portal.
- Set the Reply URL to `https://localhost:44316/` This is the port number that this ASP.NET Web Application sample is configured to run on.
- Create your application.
- Once the application is created, from the menu select **Authentication**. In the **Implict grant** section, select **Access tokens**.
- Next, create a Web App client secret. In the Azure portal go to your **Azure AD B2C** instance. From the menu select **App registration**. Select the registration for your Web Application. From the menu select **Certificates & secrets** and click **New client secret**. Note: You will only see the secret once. Make sure you copy it.
- From the menu choose **API permissions**. Click **Add a permission**, switch to the **My APIs** tab, and select the name of the Web API you registered previously, for example `My Test ASP.NET Web API`. Select the scope(s) you defined previously, for example, `read` and `write` and select **Add permissions**.

#### Step 5: Configure your Visual Studio project with your Azure AD B2C app registrations

In this section, you will change the code in both projects to use your tenant. 

:warning: Since both projects have a `Web.config` file, pay close attention which `Web.config` file you are modifying.

##### Step 5a: Modify the `TaskWebApp` project

1. Open the `Web.config` file for the `TaskWebApp` project.
1. Find the key `ida:Tenant` and replace the value with your `<your-tenant-name>.onmicrosoft.com`.
1. Find the key `ida:AadInstance` and replace the value with your `<your-tenant-name>.b2clogin.com`.
1. Find the key `ida:TenantId` and replace the value with your Directory ID. You can get it by navigating to the registration information of one of your apps and copying the value of the **Directory (tenant) ID** property.
1. Find the key `ida:ClientId` and replace the value with the Application ID from your web application `My Test ASP.NET Web Application` registration in the Azure portal.
1. Find the key `ida:ClientSecret` and replace the value with the Client secret from your web application in in the Azure portal.
1. Find the keys representing the policies, e.g. `ida:SignUpSignInPolicyId` and replace the values with the corresponding policy names you created, e.g. `b2c_1_SiUpIn`
1. Change the `api:ApiIdentifier` key value to the App ID URI of the API you specified in the Web API registration. This App ID URI tells B2C which API your Web Application wants permissions to.

    ```csharp
    <!--<add key="api:ApiIdentifier" value="https://fabrikamb2c.onmicrosoft.com/api/" />—>

    <add key="api:ApiIdentifier" value="https://<your-tenant-name>.onmicrosoft.com/demoapi/" />
    ```

    :memo: Make sure to include the trailing '/' at the end of your `ApiIdentifier` value. 

1. Find the keys representing the scopes, e.g. `api:ReadScope` and replace the values with the corresponding scope names you created, e.g. `read`


##### Step 5b: Modify the `TaskService` project

1. Open the `Web.config` file for the `TaskService` project.
1. Find the key `ida:Tenant` and replace the value with your `<your-tenant-name>.onmicrosoft.com`.
1. Find the key `ida:AadInstance` and replace the value with your `<your-tenant-name>.b2clogin.com`.
1. Find the key `ida:ClientId` and replace the value with the Application ID from your web API `My Test ASP.NET Web API` registration in the Azure portal.
1. Find the key `ida:SignUpSignInPolicyId` and replace the value with the policy name you created, e.g. `b2c_1_SiUpIn`
1. Find the keys representing the scopes, e.g. `api:ReadScope` and `api:WriteScope` and replace the values with the corresponding scope names you created if needed, e.g. `read` and `write`

## Run the application in Visual Studio

1. In the sample application project folder, open the **B2C-WebAPI-DotNet.sln** solution in Visual Studio.
2. For this quickstart, you run both the **TaskWebApp** and **TaskService** projects at the same time. Right-click the **B2C-WebAPI-DotNet** solution in Solution Explorer, and then select **Set StartUp Projects**.
3. Select **Multiple startup projects** and change the **Action** for both projects to **Start**.
4. Click **OK**.
5. Press **F5** to debug both applications. Each application opens in its own browser tab:

    - `https://localhost:44316/` - The ASP.NET web application. You interact directly with this application in the quickstart.
    - `https://localhost:44332/` - The web API that's called by the ASP.NET web application.

## Sign in using your account

1. Click **Sign up / Sign in** in the ASP.NET web application to start the workflow.

    ![Sample ASP.NET web app in browser with sign up/sign link highlighted](./media/quickstart-web-app-dotnet/web-app-sign-in.png)

    The sample supports several sign-up options including using a social identity provider or creating a local account using an email address. For this quickstart, use a social identity provider account from either Facebook, Google, or Microsoft.

2. Azure AD B2C presents a sign-in page for a fictitious company called Fabrikam for the sample web application. To sign up using a social identity provider, click the button of the identity provider you want to use.

    ![Sign In or Sign Up page showing identity provider buttons](./media/quickstart-web-app-dotnet/sign-in-or-sign-up-web.png)

    You authenticate (sign in) using your social account credentials and authorize the application to read information from your social account. By granting access, the application can retrieve profile information from the social account such as your name and city.

3. Finish the sign-in process for the identity provider.

## Edit your profile

Azure Active Directory B2C provides functionality to allow users to update their profiles. The sample web app uses an Azure AD B2C edit profile user flow for the workflow.

1. In the application menu bar, click your profile name and select **Edit profile** to edit the profile you created.

    ![Sample web app in browser with Edit profile link highlighted](./media/quickstart-web-app-dotnet/edit-profile-web.png)

2. Change your **Display name** or **City**, and then click **Continue** to update your profile.

    The changed is displayed in the upper right portion of the web application's home page.

## Access a protected API resource

1. Click **To-Do List** to enter and modify your to-do list items.

2. Enter text in the **New Item** text box. Click **Add** to call the Azure AD B2C protected web API that adds a to-do list item.

    ![Sample web app in browser with Add a to-do list item](./media/quickstart-web-app-dotnet/add-todo-item-web.png)

    The ASP.NET web application includes an Azure AD access token in the request to the protected web API resource to perform operations on the user's to-do list items.

You've successfully used your Azure AD B2C user account to make an authorized call an Azure AD B2C protected web API.

## Clean up resources

You can use your Azure AD B2C tenant if you plan to try other Azure AD B2C quickstarts or tutorials. When no longer needed, you can [delete your Azure AD B2C tenant](faq.md#how-do-i-delete-my-azure-ad-b2c-tenant).

## Next steps

In this quickstart, you used a sample ASP.NET application to:

* Sign in with a custom login page
* Sign in with a social identity provider
* Create an Azure AD B2C account
* Call a web API protected by Azure AD B2C

Get started creating your own Azure AD B2C tenant.

> [!div class="nextstepaction"]
> [Create an Azure Active Directory B2C tenant in the Azure portal](tutorial-create-tenant.md)
