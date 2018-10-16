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

## Register your application
You can register your application in either of two ways, as described in the next two sections.

### Option 1: Express
1. Go to the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app?appType=mobileAndDesktopApp&appTech=android&step=configure).
2.	In **Application Name**, enter a name for your application.

3. Ensure that the **Guided Setup** check box is selected, and then select **Create**.

4. Follow the instructions for obtaining the application ID, and paste it into your code.

### Option 2: Advanced 
1. Go to the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app).
2. In the **Application Name** box, enter a name for your application. 

3. Ensure that the **Guided Setup** check box is cleared, and then select **Create**.

4. Select **Add Platform**, select **Native Application**, and then select **Save**.

5. Under **app** > **java** > **{host}.{namespace}**, open `MainActivity`. 

6.	Replace *[Enter the application Id here]* with your Application / Client ID:

    ```java
    final static String CLIENT_ID = "[Enter the application Id here]";
    ```
<!-- Workaround for Docs conversion bug -->
7. Under **app** > **manifests**, open the *AndroidManifest.xml* file.

8. In the `manifest\application`, add the following activity. The `BrowserTabActivity` activity that allows Microsoft to call back to your application after it completes the authentication:

    ```xml
    <!--Intent filter to capture System Browser calling back to our app after sign-in-->
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
<!-- Workaround for Docs conversion bug -->
9. In the `BrowserTabActivity`, replace `[Enter the application Id here]` with the Application / Client ID.
