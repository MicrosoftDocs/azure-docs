---
title: Azure AD v2 JS SPA Guided Setup - Test | Microsoft Docs
description: How JavaScript SPA applications can call an API that require access tokens by Azure Active Directory v2 endpoint
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
## Test your code

> ### Testing with Visual Studio
> If you are using Visual Studio, press `F5` to run your project: the browser opens and directs you to *http://localhost:{port}* where you see the *Call Microsoft Graph API* button.

<p/><!-- -->

> ### Testing with Python or another web server
> If you are not using Visual Studio, make sure your web server is started and it is configured to listen to a TCP port based on the folder containing your *index.html* file. For Python, you can start listening to the port by running the in the command prompt/ terminal, from the app's folder:
> 
> ```bash
> python -m http.server 8080
> ```
>  Then, open the browser and type *http://localhost:8080* or *http://localhost:{port}* - where the *port* corresponds to the port that your web server is listening to. You should see the contents of your index.html page with the *Call Microsoft Graph API* button.

## Test your application

After the browser loads your *index.html*, click the *Call Microsoft Graph API* button. If this is the first time, the browser redirects you to the Microsoft Azure Active Directory v2 endpoint, where you are  prompted to sign in.
 
![Sample screen shot](media/active-directory-singlepageapp-javascriptspa-test/javascriptspascreenshot1.png)


### Consent
The very first time you sign in to your application, you are presented with a consent screen similar to the following, where you need to accept:

 ![Consent screen](media/active-directory-singlepageapp-javascriptspa-test/javascriptspaconsent.png)


### Expected results
You should see user profile information returned by the Microsoft Graph API call response.
 
 ![Results](media/active-directory-singlepageapp-javascriptspa-test/javascriptsparesults.png)

You also see basic information about the token acquired in the *Access Token* and *ID Token Claims* boxes.

<!--start-collapse-->
### More information about scopes and delegated permissions

The Microsoft Graph API requires the `user.read` scope to read the user's profile. This scope is automatically added by default in every application being registered on our registration portal. Some other APIs for Microsoft Graph as well as custom APIs for your backend server may require additional scopes. For example, for Microsoft Graph, the scope `Calendars.Read` is required to list the user’s calendars. In order to access the user’s calendar in the context of an application, you need to add the `Calendars.Read` delegated permission to the application registration’s information and then add the `Calendars.Read` scope to the `acquireTokenSilent` call. The user may be prompted for additional consents as you increase the number of scopes.

If a backend API does not require a scope (not recommended), you can use the `clientId` as the scope in the `acquireTokenSilent` and/or `acquireTokenRedirect` calls.

<!--end-collapse-->
