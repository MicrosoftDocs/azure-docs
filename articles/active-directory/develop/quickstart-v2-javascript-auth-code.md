---
title: "Quickstart: Sign in users in JavaScript single-page apps (SPA) with auth code"
description: In this quickstart, learn how a JavaScript single-page application (SPA) can sign in users of personal accounts, work accounts, and school accounts by using the authorization code flow.
services: active-directory
author: OwenRichards1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 11/12/2021
ROBOTS: NOINDEX
ms.author: owenrichards
ms.custom: aaddev, "scenarios:getting-started", "languages:JavaScript", devx-track-js, mode-other
#Customer intent: As an app developer, I want to learn how to get access tokens and refresh tokens by using the Microsoft identity platform so that my JavaScript app can sign in users of personal accounts, work accounts, and school accounts.
---

# Quickstart: Sign in users and get an access token in a JavaScript SPA using the auth code flow with PKCE

> [!div renderon="docs"]
> Welcome! This probably isn't the page you were expecting. While we work on a fix, this link should take you to the right article:
>
> > [Quickstart: Sign in users in single-page apps (SPA) via the authorization code flow with Proof Key for Code Exchange (PKCE) using JavaScript](quickstart-single-page-app-javascript-sign-in.md)
> 
> We apologize for the inconvenience and appreciate your patience while we work to get this resolved.

> [!div renderon="portal" class="sxs-lookup"]
> In this quickstart, you download and run a code sample that demonstrates how a JavaScript single-page application (SPA) can sign in users and call Microsoft Graph using the authorization code flow with Proof Key for Code Exchange (PKCE). The code sample demonstrates how to get an access token to call the Microsoft Graph API or any web API.
> 
> See [How the sample works](#how-the-sample-works) for an illustration.
> 
> ## Prerequisites
> 
> * Azure subscription - [Create an Azure subscription for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
> * [Node.js](https://nodejs.org/en/download/)
> * [Visual Studio Code](https://code.visualstudio.com/download) or another code editor
> 
> 
> #### Step 1: Configure your application in the Azure portal
> For the code sample in this quickstart to work, add a **Redirect URI** of `http://localhost:3000/`.
> > [!div class="nextstepaction"]
> > [Make these changes for me]()
> 
> > [!div class="alert alert-info"]
> > ![Already configured](media/quickstart-v2-javascript/green-check.png) Your application is configured with these attributes.
> 
> #### Step 2: Download the project
> 
> Run the project with a web server by using Node.js
> 
> > [!div class="nextstepaction"]
> > [Download the code sample](https://github.com/Azure-Samples/ms-identity-javascript-v2/archive/master.zip)
> 
> > [!div class="sxs-lookup"]
> > > [!NOTE]
> > > `Enter_the_Supported_Account_Info_Here`
> 
> #### Step 3: Your app is configured and ready to run
> 
> We have configured your project with values of your app's properties.
> 
> Run the project with a web server by using Node.js.
> 
> 1. To start the server, run the following commands from within the project directory:
> 
>     ```console
>     npm install
>     npm start
>     ```
> 
> 1. Go to `http://localhost:3000/`.
> 
> 1. Select **Sign In** to start the sign-in process and then call the Microsoft Graph API.
> 
>     The first time you sign in, you're prompted to provide your consent to allow the application to access your profile and sign you in. After you're signed in successfully, your user profile information is displayed on the page.
> 
> ## More information
> 
> ### How the sample works
> 
> ![Diagram showing the authorization code flow for a single-page application.](media/quickstart-v2-javascript-auth-code/diagram-01-auth-code-flow.png)
> 
> ### MSAL.js
> 
> The MSAL.js library signs in users and requests the tokens that are used to access an API that's protected by Microsoft > identity platform. The sample's *index.html* file contains a reference to the library:
> 
> ```html
> <script type="text/javascript" src="https://alcdn.msauth.net/browser/2.0.0-beta.0/js/msal-browser.js" integrity=
> "sha384-r7Qxfs6PYHyfoBR6zG62DGzptfLBxnREThAlcJyEfzJ4dq5rqExc1Xj3TPFE/9TH" crossorigin="anonymous"></script>
> ```
> 
> If you have Node.js installed, you can download the latest version by using the Node.js Package Manager (npm):
> 
> ```console
> npm install @azure/msal-browser
> ```
> 
> ## Next steps
> 
> For a more detailed step-by-step guide on building the application used in this quickstart, see the following tutorial:
> 
> > [!div class="nextstepaction"]
> > [Tutorial to sign in and call MS Graph](./tutorial-v2-javascript-auth-code.md)
