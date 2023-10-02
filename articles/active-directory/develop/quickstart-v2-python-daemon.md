---
title: "Quickstart: Call Microsoft Graph from a Python daemon"
description: In this quickstart, you learn how a Python process can get an access token and call an API protected by Microsoft identity platform, using the app's own identity
services: active-directory
author: OwenRichards1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 01/10/2022
ROBOTS: NOINDEX
ms.author: owenrichards
ms.reviewer: jmprieur
ms.custom: aaddev, identityplatformtop40, devx-track-python, "scenarios:getting-started", "languages:Python", mode-api
#Customer intent: As an application developer, I want to learn how my Python app can get an access token and call an API that's protected by the Microsoft identity platform using client credentials flow.
---

# Quickstart: Acquire a token and call Microsoft Graph API from a Python console app using app's identity

> [!div renderon="docs"]
> Welcome! This probably isn't the page you were expecting. While we work on a fix, this link should take you to the right article:
> 
> > [Quickstart: Acquire a token and call Microsoft Graph from a Python daemon app](quickstart-daemon-app-python-acquire-token.md)
> 
> We apologize for the inconvenience and appreciate your patience while we work to get this resolved.

> [!div renderon="portal" class="sxs-lookup"]
> In this quickstart, you download and run a code sample that demonstrates how a Python application can get an access token using the app's identity to call the Microsoft Graph API and display a [list of users](/graph/api/user-list) in the directory. The code sample demonstrates how an unattended job or Windows service can run with an application identity, instead of a user's identity. 
> 
> ## Prerequisites
> 
> To run this sample, you need:
> 
> - [Python 2.7+](https://www.python.org/downloads/release/python-2713) or [Python 3+](https://www.python.org/downloads/release/python-364/)
> - [MSAL Python](https://github.com/AzureAD/microsoft-authentication-library-for-python)
> 
> > [!div class="sxs-lookup"]
> ### Download and configure the quickstart app
> 
> #### Step 1: Configure your application in Azure portal
> For the code sample in this quickstart to work, create a client secret and add Graph API's **User.Read.All** application permission.
> > [!div class="nextstepaction"]
> > [Make these changes for me]()
> 
> > [!div class="alert alert-info"]
> > ![Already configured](media/quickstart-v2-netcore-daemon/green-check.png) Your application is configured with these attributes.
> 
> #### Step 2: Download the Python project
> 
> > [!div class="sxs-lookup nextstepaction"]
> > [Download the code sample](https://github.com/Azure-Samples/ms-identity-python-daemon/archive/master.zip)
> 
> > [!div class="sxs-lookup"]
> > > [!NOTE]
> > > `Enter_the_Supported_Account_Info_Here`
> 
> #### Step 3: Admin consent
> 
> If you try to run the application at this point, you'll receive *HTTP 403 - Forbidden* error: `Insufficient privileges to complete the operation`. This error happens because any *app-only permission* requires Admin consent: a global administrator of your directory must give consent to your application. Select one of the options below depending on your role:
> 
> ##### Global tenant administrator
> 
> If you are a global administrator, go to **API Permissions** page select **Grant admin consent for Enter_the_Tenant_Name_Here**.
> > [!div id="apipermissionspage"]
> > [Go to the API Permissions page]()
> 
> ##### Standard user
> 
> If you're a standard user of your tenant, ask a global administrator to grant admin consent for your application. To do this, give the following URL to your administrator:
> 
> ```url
> https://login.microsoftonline.com/Enter_the_Tenant_Id_Here/adminconsent?client_id=Enter_the_Application_Id_Here
> ```
> 
> 
> #### Step 4: Run the application
> 
> You'll need to install the dependencies of this sample once.
> 
> ```console
> pip install -r requirements.txt
> ```
> 
> Then, run the application via command prompt or console:
> 
> ```console
> python confidential_client_secret_sample.py parameters.json
> ```
> 
> You should see on the console output some Json fragment representing a list of users in your Microsoft Entra directory.
> 
> > [!IMPORTANT]
> > This quickstart application uses a client secret to identify itself as confidential client. Because the client secret is added as a plain-text to your project files, for security reasons, it is recommended that you use a certificate instead of a client secret before considering the application as production application. For more information on how to use a certificate, see [these instructions](https://github.com/Azure-Samples/ms-identity-python-daemon/blob/master/2-Call-MsGraph-WithCertificate/README.md) in the same GitHub repository for this sample, but in the second folder **2-Call-MsGraph-WithCertificate**.
> 
> ## More information
> 
> ### MSAL Python
> 
> [MSAL Python](https://github.com/AzureAD/microsoft-authentication-library-for-python) is the library used to sign in users and request tokens used to access an API protected by Microsoft identity platform. As described, this quickstart requests tokens by using the application own identity instead of delegated permissions. The authentication flow used in this case is known as *[client credentials oauth flow](v2-oauth2-client-creds-grant-flow.md)*. For more information on how to use MSAL Python with daemon apps, see [this article](scenario-daemon-overview.md).
> 
>  You can install MSAL Python by running the following pip command.
> 
> ```powershell
> pip install msal
> ```
> 
> ### MSAL initialization
> 
> You can add the reference for MSAL by adding the following code:
> 
> ```Python
> import msal
> ```
> 
> Then, initialize MSAL using the following code:
> 
> ```Python
> app = msal.ConfidentialClientApplication(
>     config["client_id"], authority=config["authority"],
>     client_credential=config["secret"])
> ```
> 
> > | Where: |Description |
> > |---------|---------|
> > | `config["secret"]` | Is the client secret created for the application in Azure portal. |
> > | `config["client_id"]` | Is the **Application (client) ID** for the application registered in the Azure portal. You can find this value in the app's **Overview** page in the Azure portal. |
> > | `config["authority"]`    | The STS endpoint for user to authenticate. Usually `https://login.microsoftonline.com/{tenant}` for public cloud, where {tenant} is the name of your tenant or your tenant Id.|
> 
> For more information, please see the [reference documentation for `ConfidentialClientApplication`](https://msal-python.readthedocs.io/en/latest/#confidentialclientapplication).
> 
> ### Requesting tokens
> 
> To request a token using app's identity, use `AcquireTokenForClient` method:
> 
> ```Python
> result = None
> result = app.acquire_token_silent(config["scope"], account=None)
> 
> if not result:
>     logging.info("No suitable token exists in cache. Let's get a new one from Azure AD.")
>     result = app.acquire_token_for_client(scopes=config["scope"])
> ```
> 
> > |Where:| Description |
> > |---------|---------|
> > | `config["scope"]` | Contains the scopes requested. For confidential clients, this should use the format similar to `{Application ID URI}/.default` to indicate that the scopes being requested are the ones statically defined in the app object set in the Azure portal (for Microsoft Graph, `{Application ID URI}` points to `https://graph.microsoft.com`). For custom web APIs, `{Application ID URI}` is defined under the **Expose an API** section in **App registrations** in the Azure portal.|
> 
> For more information, please see the [reference documentation for `AcquireTokenForClient`](https://msal-python.readthedocs.io/en/latest/#msal.ConfidentialClientApplication.acquire_token_for_client).
> 
> [!INCLUDE [Help and support](./includes/error-handling-and-tips/help-support-include.md)]
> 
> ## Next steps
> 
> To learn more about daemon applications, see the scenario landing page.
> 
> > [!div class="nextstepaction"]
> > [Daemon application that calls web APIs](scenario-daemon-overview.md)
