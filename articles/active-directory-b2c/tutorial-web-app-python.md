---
title: "Tutorial: Enable authentication in a Python web application"
titleSuffix: Azure AD B2C
description: In this tutorial, learn how to use Azure Active Directory B2C to provide user login for a Python Flask web application.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.author: mimart
ms.date: 06/12/2020
ms.topic: tutorial
ms.service: active-directory
ms.subservice: B2C
ms.custom: tracking-python
---

# Tutorial: Enable authentication in a Python web application with Azure AD B2C

This tutorial shows you how to use Azure Active Directory B2C (Azure AD B2C) to sign up and sign in users in a Python Flask web application.

In this tutorial:

> [!div class="checklist"]
> * Add a reply URL to an application registered in your Azure AD B2C tenant
> * Download a code sample from GitHub
> * Modify the sample application's code to work with your tenant
> * Sign up using your sign-up/sign-in user flow

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

You need the following Azure AD B2C resources in place before continuing with the steps in this tutorial:

* [Azure AD B2C tenant](tutorial-create-tenant.md)
* [Application registered](tutorial-register-applications.md) in your tenant, and its *Application (client) ID* and *client secret*
* [User flows created](tutorial-create-user-flows.md) in your tenant

Additionally, you need the following in your local development environment:

* [Visual Studio Code](https://code.visualstudio.com/) or another code editor
* [Python](https://nodejs.org/en/download/) 2.7+ or 3+

## Add a redirect URI

In the second tutorial that you completed as part of the prerequisites, you registered a web application in Azure AD B2C. To enable communication with the code sample in this tutorial, add a reply URL (also called a redirect URI) to the application registration.

To update an application in your Azure AD B2C tenant, you can use our new unified **App registrations** experience or our legacy  **Applications (Legacy)** experience. [Learn more about the new experience](https://aka.ms/b2cappregtraining).

#### [App registrations](#tab/app-reg-ga/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **App registrations**, select the **Owned applications** tab, and then select the *webapp1* application.
1. Under **Manage**, select **Authentication**.
1. Under **Web**, select the **Add URI** link, and then enter `http://localhost:5000/getAToken` in the text box.
1. Select **Save**.

#### [Applications (Legacy)](#tab/applications-legacy/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Select **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Applications (Legacy)**, and then select the *webapp1* application.
1. Under **Reply URL**, add `http://localhost:5000/getAToken`.
1. Select **Save**.
* * *

## Get the sample code

In this tutorial, you configure a code sample that you download from GitHub to work with your B2C tenant. The sample demonstrates how a Python Flask web application can use Azure AD B2C for user sign-up and sign-in.

[Download a .ZIP archive](https://github.com/Azure-Samples/ms-identity-python-webapp/archive/master.zip) or clone the [code sample repository](https://github.com/Azure-Samples/ms-identity-python-webapp) from GitHub.

```console
git clone https://github.com/Azure-Samples/ms-identity-python-webapp.git
```

## Update the sample

Once you've obtained the sample, configure the application to use your Azure AD B2C tenant, application registration, and user flows.

In the project's root directory:

1. Rename the *app_config.py* file to *app_config.py.OLD*
1. Rename the *app_config_b2c.py* to *app_config.py*

Update the newly renamed *app_config.py* with values for your Azure AD B2C tenant and application registration you created as part of the prerequisites.

1. Open the *app_config.py* file in your editor.
1. Update the `b2c_tenant` value with the name of your Azure AD B2C tenant, for example *contosob2c*.
1. Update each of the `*_user_flow` values to match the names of the user flows you created as part of the prerequisites.
1. Update the `CLIENT_ID` value with the **Application (client) ID** of the web application you registered as part of the prerequisites.
1. Update the `CLIENT_SECRET` value with the value of the **client secret** you created in the prerequisites. For increased security, considering storing it instead in an **environment variable** as recommended in the comments.

The top section of *app_config.py* should now look similar to the following code snippet:

```python
import os

b2c_tenant = "contosob2c"
signupsignin_user_flow = "B2C_1_signupsignin1"
editprofile_user_flow = "B2C_1_profileediting1"
resetpassword_user_flow = "B2C_1_passwordreset1"
authority_template = "https://{tenant}.b2clogin.com/{tenant}.onmicrosoft.com/{user_flow}"

CLIENT_ID = "11111111-1111-1111-1111-111111111111" # Application (client) ID of app registration

CLIENT_SECRET = "22222222-2222-2222-2222-222222222222" # Placeholder - for use ONLY during testing.
# In a production app, we recommend you use a more secure method of storing your secret,
# like Azure Key Vault. Or, use an environment variable as described in Flask's documentation:
# https://flask.palletsprojects.com/en/1.1.x/config/#configuring-from-environment-variables
# CLIENT_SECRET = os.getenv("CLIENT_SECRET")
# if not CLIENT_SECRET:
#     raise ValueError("Need to define CLIENT_SECRET environment variable")
```

> [!WARNING]
> As noted in the code snippet comments, we recommend you **do not store secrets in plaintext** in your application code. The hardcoded variable is used in the code sample for *convenience only*. Consider using an environment variable or a secret store like Azure Key Vault.

## Run the sample

1. In your console or terminal, switch to the directory containing the sample. For example:

    ```console
    cd ms-identity-python-webapp
    ```
1. Run the following commands to install the required packages from PyPi and run the web app on your local machine:

    ```console
    pip install -r requirements.txt
    flask run --host localhost --port 5000
    ```

    The console window displays the port number of the locally running application:

    ```console
     * Serving Flask app "app" (lazy loading)
     * Environment: production
       WARNING: This is a development server. Do not use it in a production deployment.
       Use a production WSGI server instead.
     * Debug mode: off
     * Running on http://localhost:5000/ (Press CTRL+C to quit)
    ```

1. Browse to `http://localhost:5000` to view the web application running on your local machine.

    :::image type="content" source="media/tutorial-web-app-python/python-flask-web-app-01.png" alt-text="Web browser showing Python Flask web application running locally":::

### Sign up using an email address

This sample application supports sign up, sign in, and password reset. In this tutorial, you sign up using an email address.

1. Select **Sign In** to initiate the *B2C_1_signupsignin1* user flow you specified in an earlier step.
1. Azure AD B2C presents a sign-in page that includes a sign up link. Since you don't yet have an account, select the **Sign up now** link.
1. The sign up workflow presents a page to collect and verify the user's identity using an email address. The sign up workflow also collects the user's password and the requested attributes defined in the user flow.

    Use a valid email address and validate using the verification code. Set a password. Enter values for the requested attributes.

    :::image type="content" source="media/tutorial-web-app-python/python-flask-web-app-02.png" alt-text="Sign up page displayed by Azure AD B2C user flow":::

1. Select **Create** to create a local account in the Azure AD B2C directory.

When you select **Create**, the application shows the name of the signed in user.

:::image type="content" source="media/tutorial-web-app-python/python-flask-web-app-03.png" alt-text="Web browser showing Python Flask web application with logged in user":::

If you'd like to test sign-in, select the **Logout** link, then select **Sign In** and sign in with the email address and password you entered when you signed up.

## Next steps

In this tutorial, you configured a Python Flask web application to work with a user flow in your Azure AD B2C tenant to provide sign up and sign in capability. You completed these steps:

> [!div class="checklist"]
> * Added a reply URL to an application registered in your Azure AD B2C tenant
> * Downloaded a code sample from GitHub
> * Modified the sample application's code to work with your tenant
> * Signed up using your sign-up/sign-in user flow

Next, learn how to customize the UI of the user flow pages displayed to your users by Azure AD B2C:

> [!div class="nextstepaction"]
> [Tutorial: Customize the interface of user experiences in Azure AD B2C >](tutorial-customize-ui.md)
