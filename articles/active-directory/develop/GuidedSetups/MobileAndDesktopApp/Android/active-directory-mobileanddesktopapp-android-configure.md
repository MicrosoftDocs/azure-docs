---
title: Implementing Sign-in with Microsoft on an Android application - Configure
description: How to  implement demonstrates how to implement Sign-In with Microsoft on a native Android application using the OpenID Connect standard | Microsoft Azure
services: active-directory
documentationcenter: dev-center-name
author: andretms
manager: mbaldwin
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date:
ms.author: andret

---
<!-- Docs -->
# Create an application (Express)
Now you need to register your application in the *Microsoft Application Registration Portal*:
1. Register your application via the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app?appType=mobileAndDesktopApp&appTech=android&page=configure)
2.	Enter a name for your application and your email
3.	Make sure the option for Guided Setup is checked
4.	Follow the instructions to obtain the application ID and paste it into your code

# Add your application registration information to your solution (Advanced)
Now you need to register your application in the *Microsoft Application Registration Portal*:
1. Go to the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app) to register an application
2. Enter a name for your application and your email 
3. Make sure the option for Guided Setup is unchecked
4. Click `Add Platforms`, then select `Native Application` and hit Save
5.	Open `MainActivity` (under `app` > `java` > *`{host}.{namespace}`*)
6.	Replace the *[Enter the application Id here]* in the line starting with `final static String CLIENT_ID` with the application Id you just registered:
```java
final static String CLIENT_ID = "[Enter the application Id here]";
```
7. Open `AndroidManifest.xml` (under `app` > `manifests`)
8. Add the following activity to `manifest\application` node. This register a BrowserTabActivity to allow the OS to resume your application after completing the authentication:

```xml
<!--Intent filter to capture System Browser calling back to our app after Sign In-->
<activity
    android:name="com.microsoft.identity.client.BrowserTabActivity">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />

        <!--Add in your scheme/host from registered redirect URI-->
        <data android:scheme="msal[Enter the application Id here]"
            android:host="auth" />
    </intent-filter>
</activity>
```
9. Replace *[Enter the application Id here]* with the the application Id for the application you just registered the the Application Registration Portal

<!-- End Docs -->

### What is Next

[Test and Validate](active-directory-mobileanddesktopapp-android-testvalidate.md)
