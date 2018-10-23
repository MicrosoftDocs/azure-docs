---
title: include file
description: include file
services: active-directory
documentationcenter: dev-center-name
author: andretms
manager: mtillman
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: include
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/13/2018
ms.author: andret
ms.custom: include file 

---

## Add the application’s registration to your code

In this step, you need to add the Application / Client ID to your project.

1.	Open `MainActivity` (under `app` > `java` > *`{host}.{namespace}`*)
2.	Replace the line starting with `final static String CLIENT_ID` with:
```java
final static String CLIENT_ID = "[Enter the application Id here]";
```
3. Open: `app` > `manifests` > `AndroidManifest.xml`
4. Add the following activity to `manifest\application`. The`BrowserTabActivity` allows the Microsoft to call back to your application after completing the authentication:

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

