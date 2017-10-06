---
title: Azure AD v2 JS SPA Guided Setup - Configure (ARP) | Microsoft Docs
description: How JavaScript SPA applications can call an API that require access tokens by Azure Active Directory v2 endpoint (ARP)
services: active-directory
documentationcenter: dev-center-name
author: andretms
manager: mbaldwin
editor: ''

ms.service: active-directory 
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/01/2017
ms.author: andret

---
## Add the application’s registration information to your App

In this step, you need to configure the Redirect URL of your application registration information and then add the Application Id to your JavaScript SPA application.

### Configure redirect URL

Configure the `Redirect URL` field above with the URL for your index.html page based on your web server, then click *Update*.


> #### Visual Studio instructions for obtaining redirect URL
> To obtain your redirect URL, follow the instructions below:
> 1.	In *Solution Explorer*, select the project and look at the `Properties` window (if you don’t see a Properties window, press `F4`)
> 2.	Copy the value from `URL` to the clipboard:<br/> ![Project properties](media/active-directory-singlepageapp-javascriptspa-configure/vs-project-properties-screenshot.png)<br />
> 3.	Paste the value as a `Redirect URL` on the top of this page, then click `Update`

<p/>

> #### Setting Redirect URL for Python
> For Python, you can set the web server port via command line. This guided setup uses the port 8080 for reference but feel free to use any other port available. In any case, follow the instructions below to set up a redirect URL in the application registration information:<br/>
> Set `http://localhost:8080/` as a `Redirect URL` on the top of this page, or use `http://localhost:[port]/` if you are using a custom TCP port (where *[port]* is the custom TCP port number), and then click 'Update'

### Configure your JavaScript SPA application

1.	Create a file named `msalconfig.js` containing the application registration information. If you are using Visual Studio, select the project (project root folder), right-click and select: `Add` > `New Item` > `JavaScript File`. Name it `msalconfig.js`
2.	Add the following code to your `msalconfig.js` file:

```javascript
var msalconfig = {
    clientID: "[Enter the application Id here]",
    redirectUri: location.origin
};
``` 
