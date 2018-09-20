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

## Register your application

There are multiple ways to create an application, please select one of them:

### Option 1: Register your application (Express mode)
Now you need to register your application in the *Microsoft Application Registration Portal*:

1.	Register your application via the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app?appType=singlePageApp&appTech=javascriptSpa&step=configure)
2.	Enter a name for your application and your email
3.	Make sure the option for *Guided Setup* is checked
4.	Follow the instructions to obtain the application ID and paste it into your code

### Option 2: Register your application (Advanced mode)

1. Go to the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app) to register an application
2. Enter a name for your application and your email
3. Make sure the option for *Guided Setup* is unchecked
4.	Click `Add Platform`, then select `Web`
5. Add the `Redirect URL` that correspond to the application's URL based on your web server. See the sections below for instructions on how to set/ obtain the redirect URL in Visual Studio and Python.
6. Click *Save*

> #### Visual Studio instructions for obtaining redirect URL
> Follow the instructions to obtain your redirect URL:
> 1.	In *Solution Explorer*, select the project and look at the `Properties` window (if you don’t see a Properties window, press `F4`)
> 2.	Copy the value from `URL` to the clipboard:<br/> ![Project properties](media/active-directory-develop-guidedsetup-javascriptspa-configure/vs-project-properties-screenshot.png)<br />
> 3.	Switch back to the *Application Registration Portal* and paste the value as a `Redirect URL` and click 'Save'

<p/>

> #### Setting Redirect URL for Node
> For Node.js, you can set the web server port in the *server.js* file. This tutorial uses the port 30662 for reference but feel free to use any other port available. In any case, follow the instructions below to set up a redirect URL in the application registration information:<br/>
> - Switch back to the *Application Registration Portal* and set `http://localhost:30662/` as a `Redirect URL`, or use `http://localhost:[port]/` if you are using a custom TCP port (where *[port]* is the custom TCP port number) and click 'Save'


#### Configure your JavaScript SPA

1.	In the  `index.html` file created during project setup, add the application registration information. Add the following code within `<script></script>` tags in the body of your `index.html` file:

```javascript
var applicationConfig = {
    clientID: "Enter_the_Application_Id_here",
    graphScopes: ["user.read"],
    graphEndpoint: "https://graph.microsoft.com/v1.0/me"
};
```
<ol start="3">
<li>
Replace <code>Enter_the_Application_Id_here</code> with the Application Id you just registered
</li>
</ol>
