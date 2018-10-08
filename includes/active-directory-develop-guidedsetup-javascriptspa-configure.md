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

## Register your application

There are multiple ways to create an application, please select one of them:

### Option 1: Register your application (Express mode)
Now you need to register your application in the *Microsoft Application Registration Portal*:

1.	Register your application through the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app?appType=singlePageApp&appTech=javascriptSpa&step=configure).
2.	Enter a name for your application and your email.
3.	Make sure the option for **Guided Setup** is checked.
4.	Follow the instructions to obtain the application ID and paste it into your code.

### Option 2: Register your application (Advanced mode)

1. Go to the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app) to register an application.
2. Enter a name for your application and your email.
3. Make sure the option for **Guided Setup** is unchecked.
4.	Click **Add Platform**, then select **Web**.
5. Add the **Redirect URL** that corresponds to the application's URL based on your web server. See the sections below for instructions on how to set and obtain the redirect URL in Visual Studio and Node.
6. Select **Save**.

> #### Setting Redirect URL for Node
> For Node.js, you can set the web server port in the *server.js* file. This tutorial uses the port 30662 for reference but feel free to use any other port available. In any case, follow the instructions below to set up a redirect URL in the application registration information:<br/>
> - Switch back to the *Application Registration Portal* and set `http://localhost:30662/` as a `Redirect URL`, or use `http://localhost:[port]/` if you are using a custom TCP port (where *[port]* is the custom TCP port number) and click 'Save'

<p/>

> #### Visual Studio instructions for obtaining the redirect URL
> Follow these steps to obtain the redirect URL:
> 1.	In **Solution Explorer**, select the project and look at the **Properties** window. If you don’t see a **Properties** window, press **F4**.
> 2.	Copy the value from **URL** to the clipboard:<br/> ![Project properties](media/active-directory-develop-guidedsetup-javascriptspa-configure/vs-project-properties-screenshot.png)<br />
> 3.	Switch back to the *Application Registration Portal* and paste the value as a **Redirect URL** and select **Save**


#### Configure your JavaScript SPA

1.	In the  `index.html` file created during project setup, add the application registration information. Add the following code at the top within the `<script></script>` tags in the body of your `index.html` file:

```javascript
var applicationConfig = {
    clientID: "[Enter the application Id here]",
    graphScopes: ["user.read"],
    graphEndpoint: "https://graph.microsoft.com/v1.0/me"
};
```
<ol start="3">
<li>
Replace <code>Enter the application Id here</code> with the Application Id you just registered.
</li>
</ol>
