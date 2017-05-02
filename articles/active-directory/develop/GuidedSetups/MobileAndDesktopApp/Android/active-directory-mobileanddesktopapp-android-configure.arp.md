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

<div id="RedirectURLUX"/>

# Add the application’s registration information to your app
In this step, you need to add the Application ID to your project.

1.	Open `MainActivity` (under `app` > `java` > *`{host}.{namespace}`*)
2.	Replace the line starting with `final static String CLIENT_ID` to:
```java
final static String CLIENT_ID = "[Enter the application Id here]";
```
3. Open: `app` > `manifests` > `AndroidManifest.xml`
4. Add the following activity to `manifest\application` node. This register a BrowserTabActivity to allow the OS to come back to your application after completing the authentication:

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

### What is Next

[Test and Validate](active-directory-mobileanddesktopapp-android-testvalidate.md)
