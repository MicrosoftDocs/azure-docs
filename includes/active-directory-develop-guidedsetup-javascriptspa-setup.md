---
title: include file
description: include file
services: active-directory
documentationcenter: dev-center-name
author: navyasric
manager: mtillman
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
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
> - [Download the Visual Studio project](https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2/archive/VisualStudio.zip)
>
> or
> - [Download the project files](https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2/archive/core.zip) for a local web server, such as Node
>
> And then  skip to the [Configuration step](#register-your-application) to configure the code sample before executing it.

## Prerequisites
A local web server such as [Node.js](https://nodejs.org/en/download/), [.NET Core](https://www.microsoft.com/net/core), or IIS Express integration with [Visual Studio 2017](https://www.visualstudio.com/downloads/) is required to run this tutorial.

Instructions in this guide are based on both Node.js and Visual Studio 2017, but feel free to use any other development environment or Web Server.

## Create your project

> ### Option 1: Visual Studio
> If you are using Visual Studio and are creating a new project, follow the steps below to create a new Visual Studio solution:
> 1.	In Visual Studio:  `File` > `New` > `Project`
> 2.	Under `Visual C#\Web`, select `ASP.NET Web Application (.NET Framework)`
> 3.	Name your application and click *OK*
> 4.	Under `New ASP.NET Web Application`, select `Empty`

<p/><!-- -->

> ### Option 2: Node/ other web servers
> Make sure you have installed [Node.js](https://nodejs.org/en/download/), then follow the step below:
> -	Create a folder to host your application.


## Create your single page application’s UI
1.	Create an *index.html* file for your JavaScript SPA. If you are using Visual Studio, select the project (project root folder), right click and select: `Add` > `New Item` > `HTML page` and name it index.html
2.	Add the following code to your page:
```html
<!DOCTYPE html>
<html>
<head>
    <!-- bootstrap reference used for styling the page -->
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <title>JavaScript SPA Guided Setup</title>
</head>
<body style="margin: 40px">
    <button id="callGraphButton" type="button" class="btn btn-primary" onclick="callGraphApi()">Call Microsoft Graph API</button>
    <div id="errorMessage" class="text-danger"></div>
    <div class="hidden">
        <h3>Graph API Call Response</h3>
        <pre class="well" id="graphResponse"></pre>
    </div>
    <div class="hidden">
        <h3>Access Token</h3>
        <pre class="well" id="accessToken"></pre>
    </div>
    <div class="hidden">
        <h3>ID Token Claims</h3>
        <pre class="well" id="userInfo"></pre>
    </div>
    <button id="signOutButton" type="button" class="btn btn-primary hidden" onclick="signOut()">Sign out</button>

    <!-- This app uses cdn to reference msal.js (recommended). 
         You can also download it from: https://github.com/AzureAD/microsoft-authentication-library-for-js -->
    <script src="https://secure.aadcdn.microsoftonline-p.com/lib/0.1.3/js/msal.min.js"></script>

    <!-- The 'bluebird' and 'fetch' references below are required if you need to run this application on Internet Explorer -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js"></script>

    <script type="text/javascript" src="msalconfig.js"></script>
    <script type="text/javascript" src="app.js"></script>
</body>
</html>
````
