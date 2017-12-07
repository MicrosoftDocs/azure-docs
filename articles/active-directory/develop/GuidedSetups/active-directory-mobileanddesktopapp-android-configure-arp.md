---
title: Azure AD v2 Android Getting Started - Configure | Microsoft Docs
description: How an Android app can get an access token and call Microsoft Graph API or APIs that require access tokens from Azure Active Directory v2 endpoint
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
ms.date: 05/09/2017
ms.author: andret
ms.custom: aaddev

---

## Add the application’s registration information to your app

In this step, you need to add the Client ID to your project.

1.	Open `MainActivity` (under `app` > `java` > *`{host}.{namespace}`*)
2.	Replace the line starting with `final static String CLIENT_ID` with:
```java
final static String CLIENT_ID = "[Enter the application Id here]";
```
3. Open: `app` > `manifests` > `AndroidManifest.xml`
4. Add the following activity to `manifest\application` node. This register a `BrowserTabActivity` to allow the OS to resume your application after completing the authentication:

```xml
<!--Intent filter to capture System Browser calling back to our app after Sign In-->
<activity
    android:name="com.microsoft.identity.client.BrowserTabActivity">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />

        <!--Add in your scheme/host from registered redirect URI-->
        <!--By default, the scheme should be similar to 'msal[appId]' -->
        <data android:scheme="msal[Enter the application Id here]"
            android:host="auth" />
    </intent-filter>
</activity>
```

### What is Next

[Test and Validate](active-directory-mobileanddesktopapp-android-test.md)
