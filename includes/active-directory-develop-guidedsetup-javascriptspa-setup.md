---
title: include file
description: include file
services: active-directory
documentationcenter: dev-center-name
author: navyasric
manager: mtillman
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

## Setting up your web server or project

> Prefer to download this sample's project instead?
> - [Download the project files](https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2/archive/quickstart.zip) for a local web server, such as Node
>
> or
> - [Download the Visual Studio project](https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2/archive/vsquickstart.zip)
>
> And then  skip to the [Configuration step](#register-your-application) to configure the code sample before executing it.

## Prerequisites
A local web server such as [Node.js](https://nodejs.org/en/download/), [.NET Core](https://www.microsoft.com/net/core), or IIS Express integration with [Visual Studio 2017](https://www.visualstudio.com/downloads/) is required to run this tutorial.

Instructions in this guide are based on both Node.js and Visual Studio 2017, but feel free to use any other development environment or Web Server.

## Create your project

> ### Option 1: Node/ other web servers
> Make sure you have installed [Node.js](https://nodejs.org/en/download/), then follow the step below:
> -	Create a folder to host your application.

<p/><!-- -->

> ### Option 2: Visual Studio
> If you are using Visual Studio and are creating a new project, follow the steps below to create a new Visual Studio solution:
> 1.	In Visual Studio:  **File > New > Project**
> 2.	Under **Visual C#\Web**, select **ASP.NET Web Application (.NET Framework)**
> 3.	Enter a name for your application and select **OK**
> 4.	Under **New ASP.NET Web Application**, select **Empty**


## Create your single page application’s UI
1.	Create an `index.html` file for your JavaScript SPA. If you are using Visual Studio, select the project (project root folder), right click and select: **Add > New Item > HTML page** and name it index.html.

2.	Add the following code to your page:
```html
<!DOCTYPE html>
<html>
<head>
        <title>Quickstart for MSAL JS</title>
    	<script src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js"></script>
        <script src="https://secure.aadcdn.microsoftonline-p.com/lib/0.2.3/js/msal.js"></script>
        <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
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
