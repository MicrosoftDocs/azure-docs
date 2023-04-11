---
title: "Quickstart: Add authentication to a Node.js web app with MSAL Node"
description: In this quickstart, you learn how to implement authentication with a Node.js web app and the Microsoft Authentication Library (MSAL) for Node.js.
services: active-directory
author: cilwerner
manager: celested
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 11/22/2021
ROBOTS: NOINDEX
ms.author: cwerner
ms.custom: aaddev, "scenarios:getting-started", "languages:js", devx-track-js, mode-api
#Customer intent: As an application developer, I want to know how to set up authentication in a web application built using Node.js and MSAL Node.
---

# Quickstart: Sign in users and get an access token in a Node.js web app using the auth code flow


> [!div renderon="docs"]
> Welcome! This probably isn't the page you were expecting. While we work on a fix, this link should take you to the right article:
>
> > [Quickstart: Node.js web app that signs in users with MSAL Node](web-app-quickstart.md?pivots=devlang-nodejs-msal)
> 
> We apologize for the inconvenience and appreciate your patience while we work to get this resolved.

> [!div renderon="portal" class="sxs-lookup"]
> In this quickstart, you download and run a code sample that demonstrates how a Node.js web app can sign in users by using the authorization code flow. The code sample also demonstrates how to get an access token to call Microsoft Graph API.
> 
> See [How the sample works](#how-the-sample-works) for an illustration.
> 
> This quickstart uses the Microsoft Authentication Library for Node.js (MSAL Node) with the authorization code flow.
> 
> ## Prerequisites
> 
> * An Azure subscription. [Create an Azure subscription for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
> * [Node.js](https://nodejs.org/en/download/)
> * [Visual Studio Code](https://code.visualstudio.com/download) or another code editor
> 
> #### Step 1: Configure the application in Azure portal
> For the code sample for this quickstart to work, you need to create a client secret and add the following reply URL: `http:/> /localhost:3000/redirect`.
> > [!div class="nextstepaction"]
> > [Make this change for me]()
> 
> > [!div class="alert alert-info"]
> > ![Already configured](media/quickstart-v2-windows-desktop/green-check.png) Your application is configured with these > attributes.
> 
> #### Step 2: Download the project
> 
> Run the project with a web server by using Node.js.
> 
> > [!div class="nextstepaction"]
> > [Download the code sample](https://github.com/Azure-Samples/ms-identity-node/archive/main.zip)
> 
> #### Step 3: Your app is configured and ready to run
> 
> Run the project by using Node.js.
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
> 1. Select **Sign In** to start the sign-in process.
> 
>     The first time you sign in, you're prompted to provide your consent to allow the application to access your profile and sign you in. After you're signed in successfully, you will see a log message in the command line.
> 
> ## More information
> 
> ### How the sample works
> 
> The sample hosts a web server on localhost, port 3000. When a web browser accesses this site, the sample immediately redirects the user to a Microsoft authentication page. Because of this, the sample does not contain any HTML or display elements. Authentication success displays the message "OK".
> 
> ### MSAL Node
> 
> The MSAL Node library signs in users and requests the tokens that are used to access an API that's protected by Microsoft identity platform. You can download the latest version by using the Node.js Package Manager (npm):
> 
> ```console
> npm install @azure/msal-node
> ```
> 
> ## Next steps
> 
> > [!div class="nextstepaction"]
> > [Adding Auth to an existing web app - GitHub code sample >](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/auth-code)
