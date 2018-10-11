---
title: include file
description: include file
services: active-directory
documentationcenter: dev-center-name
author: brandwe
manager: mtillman
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: include
ms.tgt_pltfrm: ios
ms.workload: identity
ms.date: 09/19/2018
ms.author: brandwe
ms.custom: include file 
---

## Register your application
You can register your application in either of two ways, as described in the next two sections.

### Option 1: Express mode
Now you need to register your application in the *Microsoft Application Registration Portal*:
1. Register your application via the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app?appType=mobileAndDesktopApp&appTech=ios&step=configure)
2.	Enter a name for your application and your email
3.	Make sure the option for Guided Setup is checked
4.	Follow the instructions to obtain the application ID and paste it into your code

### Option 2: Advanced mode

1.	Go to [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app)
2.	Enter a name for your application
3.	Make sure the option for Guided Setup is unchecked
4.	Click `Add Platform`, then select `Native Application` and click `Save`
5.	Go back to Xcode. In `ViewController.swift`, replace the line starting with '`let kClientID`' with the application ID you just registered:

```swift
let kClientID = "Your_Application_Id_Here"
```

<!-- Workaround for Docs conversion bug -->
<ol start="6">
<li>
Control+click <code>Info.plist</code> to bring up the contextual menu, and then click: <code>Open As</code> > <code>Source Code</code>
</li>
<li>
Under the <code>dict</code> root node, add the following:
</li>
</ol>

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLName</key>
        <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>msal[Your_Application_Id_Here]</string>
        </array>
    </dict>
</array>
```
<ol start="8">
<li>
Replace <i><code>[Your_Application_Id_Here]</code></i> with the Application Id you just registered
</li>
</ol>
