---
title: include file
description: include file
services: active-directory
documentationcenter: dev-center-name
author: navyasric
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: include
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/17/2018
ms.author: nacanuma
ms.custom: include file

---

## Set up your web server or project

> Prefer to download this sample's project instead? Do either of the following:
> 
> - To run the project with a local web server, such as Node.js, [download the project files](https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2/archive/quickstart.zip).
>
> - (Optional) To run the project with the IIS server, [download the Visual Studio project](https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2/archive/vsquickstart.zip).
>
> And then, to configure the code sample before you execute it, skip to the [configuration step](#register-your-application).

## Prerequisites

* To run this tutorial, you need a local web server, such as [Node.js](https://nodejs.org/en/download/), [.NET Core](https://www.microsoft.com/net/core), or IIS Express integration with [Visual Studio 2017](https://www.visualstudio.com/downloads/).

* If you're using Node.js to run the project, install an integrated development environment (IDE), such as [Visual Studio Code](https://code.visualstudio.com/download), to edit the project files.

* Instructions in this guide are based on both Node.js and Visual Studio 2017, but you can use any other development environment or web server.

## Create your project

> ### Option 1: Node.js or other web servers
> Make sure you have installed [Node.js](https://nodejs.org/en/download/), and then do the following:
> -	Create a folder to host your application.
>
> ### Option 2: Visual Studio
> If you're using Visual Studio and are creating a new project, do the following:
> 1. In Visual Studio, select **File** > **New** > **Project**.
> 1. Under **Visual C#\Web**, select **ASP.NET Web Application (.NET Framework)**.
> 1. Enter a name for your application, and then select **OK**.
> 1. Under **New ASP.NET Web Application**, select **Empty**.

## Create the SPA UI
1. Create an *index.html* file for your JavaScript SPA. If you're using Visual Studio, select the project (project root folder), right-click and select **Add** > **New Item** > **HTML page**, and name the file *index.html*.

1. In the *index.html* file, add the following code:

   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>Quickstart for MSAL JS</title>
       <script src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js"></script>
       <script src="https://secure.aadcdn.microsoftonline-p.com/lib/1.0.0/js/msal.js"></script>
   </head>
   <body>
       <h2>Welcome to MSAL.js Quickstart</h2><br/>
       <h4 id="WelcomeMessage"></h4>
       <button id="SignIn" onclick="signIn()">Sign In</button><br/><br/>
       <pre id="json"></pre>
       <script>
           //JS code
       </script>
   </body>
   </html>
   ```

   > [!TIP]
   > You can replace the version of MSAL.js in the preceding script with the latest released version under [MSAL.js releases](https://github.com/AzureAD/microsoft-authentication-library-for-js/releases).
