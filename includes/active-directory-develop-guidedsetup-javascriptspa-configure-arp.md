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

## Add the application’s registration information to your App

In this step, you need to configure the Redirect URL of your application registration information and then add the Application ID to your JavaScript SPA application.

### Configure redirect URL

Configure the `Redirect URL` field with the URL for your index.html page based on your web server, then click *Update*.


> #### Visual Studio instructions for obtaining the redirect URL
> Follow these steps to obtain the redirect URL:
> 1.	In **Solution Explorer**, select the project and look at the **Properties** window. If you don’t see a **Properties** window, press **F4**.
> 2.	Copy the value from **URL** to the clipboard:<br/> ![Project properties](media/active-directory-develop-guidedsetup-javascriptspa-configure/vs-project-properties-screenshot.png)<br />
> 3.	Paste the value as a **Redirect URL** on the top of this page, then click **Update**

<p/>

> #### Setting redirect URL for Node
> For Node.js, you can set the web server port in the *server.js* file. This tutorial uses the port 30662 for reference but you can use any other available port. Follow the instructions below to set up a redirect URL in the application registration information:<br/>
> Set `http://localhost:30662/` as a **Redirect URL** on the top of this page, or use `http://localhost:[port]/` if you are using a custom TCP port (where *[port]* is the custom TCP port number) and then click **Update**

### Configure your JavaScript SPA application

1.	In the  `index.html` file created during project setup, add the application registration information. Add the following code at the top within the `<script></script>` tags in the body of your `index.html` file:

```javascript
var applicationConfig = {
    clientID: "[Enter the application Id here]",
    graphScopes: ["user.read"],
    graphEndpoint: "https://graph.microsoft.com/v1.0/me"
};
```
