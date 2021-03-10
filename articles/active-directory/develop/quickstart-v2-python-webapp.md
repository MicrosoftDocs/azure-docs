---
title: "Quickstart: Add sign-in with Microsoft to a Python web app | Azure"
titleSuffix: Microsoft identity platform
description: In this quickstart, learn how a Python web app can sign in users, get an access token from the Microsoft identity platform, and call the Microsoft Graph API.
services: active-directory
author: abhidnya13
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 09/25/2019
ms.author: abpati
ms.custom: aaddev, devx-track-python, scenarios:getting-started, languages:Python
---

# Quickstart: Add sign-in with Microsoft to a Python web app

In this quickstart, you download and run a code sample that demonstrates how a Python web application can sign in users and get an access token to call the Microsoft Graph API. Users with a personal Microsoft Account or an account in any Azure Active Directory (Azure AD) organization can sign into the application.

See [How the sample works](#how-the-sample-works) for an illustration.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python 2.7+](https://www.python.org/downloads/release/python-2713) or [Python 3+](https://www.python.org/downloads/release/python-364/)
- [Flask](http://flask.pocoo.org/), [Flask-Session](https://pypi.org/project/Flask-Session/), [requests](https://requests.kennethreitz.org/en/master/)
- [MSAL Python](https://github.com/AzureAD/microsoft-authentication-library-for-python)

> [!div renderon="docs"]
>
> ## Register and download your quickstart app
>
> You have two options to start your quickstart application: express (Option 1), and manual (Option 2)
>
> ### Option 1: Register and auto configure your app and then download your code sample
>
> 1. Go to the <a href="https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/applicationsListBlade/quickStartType/PythonQuickstartPage/sourceType/docs" target="_blank">Azure portal - App registrations</a> quickstart experience.
> 1. Enter a name for your application and select **Register**.
> 1. Follow the instructions to download and automatically configure your new application.
>
> ### Option 2: Register and manually configure your application and code sample
>
> #### Step 1: Register your application
>
> To register your application and add the app's registration information to your solution manually, follow these steps:
>
> 1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
> 1. If you have access to multiple tenants, use the **Directory + subscription** filter :::image type="icon" source="./media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to select the tenant in which you want to register an application.
> 1. Under **Manage**, select **App registrations** > **New registration**.
> 1. Enter a **Name** for your application, for example `python-webapp` . Users of your app might see this name, and you can change it later.
> 1. Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
> 1. Select **Register**.
> 1. On the app **Overview** page, note the **Application (client) ID** value for later use.
> 1. Under **Manage**, select **Authentication**.
> 1. Select **Add a platform** > **Web**.
> 1. Add `http://localhost:5000/getAToken` as **Redirect URIs**.
> 1. Select **Configure**.
> 1. Under **Manage**, select the **Certificates & secrets**  and from the **Client secrets** section, select **New client secret**.
> 1. Type a key description (for instance app secret), leave the default expiration, and select **Add**.
> 1. Note the **Value** of the **Client Secret** for later use.
> 1. Under **Manage**, select **API permissions** > **Add a permission**.
> 1. Ensure that the **Microsoft APIs** tab is selected.
> 1. From the *Commonly used Microsoft APIs* section, select **Microsoft Graph**.
> 1. From the **Delegated permissions** section, ensure that the right permissions are checked: **User.ReadBasic.All**. Use the search box if necessary.
> 1. Select the **Add permissions** button.
>
> [!div class="sxs-lookup" renderon="portal"]
>
> #### Step 1: Configure your application in Azure portal
>
> For the code sample in this quickstart to work:
>
> 1. Add a reply URL as `http://localhost:5000/getAToken`.
> 1. Create a Client Secret.
> 1. Add Microsoft Graph API's User.ReadBasic.All delegated permission.
>
> > [!div renderon="portal" id="makechanges" class="nextstepaction"]
> > [Make these changes for me]()
> > [!div id="appconfigured" class="alert alert-info"]
> > ![Already configured](media/quickstart-v2-aspnet-webapp/green-check.png) Your application is configured with this attribute

#### Step 2: Download your project
> [!div renderon="docs"]
> [Download the Code Sample](https://github.com/Azure-Samples/ms-identity-python-webapp/archive/master.zip)

> [!div class="sxs-lookup" renderon="portal"]
> Download the project and extract the zip file to a local folder closer to the root folder - for example, **C:\Azure-Samples**
> [!div class="sxs-lookup" renderon="portal" id="autoupdate" class="nextstepaction"]
> [Download the code sample](https://github.com/Azure-Samples/ms-identity-python-webapp/archive/master.zip)

> [!div class="sxs-lookup" renderon="portal"]
> > [!NOTE]
> > `Enter_the_Supported_Account_Info_Here`

> [!div renderon="docs"]
> #### Step 3: Configure the Application
>
> 1. Extract the zip file to a local folder closer to the root folder - for example, **C:\Azure-Samples**
> 1. If you use an integrated development environment, open the sample in your favorite IDE (optional).
> 1. Open the **app_config.py** file, which can be found in the root folder and replace with the following code snippet:
>
> ```python
> CLIENT_ID = "Enter_the_Application_Id_here"
> CLIENT_SECRET = "Enter_the_Client_Secret_Here"
> AUTHORITY = "https://login.microsoftonline.com/Enter_the_Tenant_Name_Here"
> ```
> Where:
>
> - `Enter_the_Application_Id_here` - is the Application Id for the application you registered.
> - `Enter_the_Client_Secret_Here` - is the **Client Secret** you created in **Certificates & Secrets**  for the application you registered.
> - `Enter_the_Tenant_Name_Here` - is the **Directory (tenant) ID** value of the application you registered.

> [!div class="sxs-lookup" renderon="portal"]
> #### Step 3: Run the code sample

> [!div renderon="docs"]
> #### Step 4: Run the code sample

1. You will need to install MSAL Python library, Flask framework, Flask-Sessions for server-side session management and requests using pip as follows:

    ```Shell
    pip install -r requirements.txt
    ```

2. Run app.py from shell or command line:

    ```Shell
    python app.py
    ```
   > [!IMPORTANT]
   > This quickstart application uses a client secret to identify itself as confidential client. Because the client secret is added as a plain-text to your project files, for security reasons, it is recommended that you use a certificate instead of a client secret before considering the application as production application. For more information on how to use a certificate, see [these instructions](./active-directory-certificate-credentials.md).

## More information

### How the sample works
![Shows how the sample app generated by this quickstart works](media/quickstart-v2-python-webapp/python-quickstart.svg)

### Getting MSAL
MSAL is the library used to sign in users and request tokens used to access an API protected by the Microsoft identity Platform.
You can add MSAL Python to your application using Pip.

```Shell
pip install msal
```

### MSAL initialization
You can add the reference to MSAL Python by adding the following code to the top of the file where you will be using MSAL:

```Python
import msal
```

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]

## Next steps

Learn more about web apps that sign in users in our multi-part scenario series.

> [!div class="nextstepaction"]
> [Scenario: Web app that signs in users](scenario-web-app-sign-user-overview.md)
