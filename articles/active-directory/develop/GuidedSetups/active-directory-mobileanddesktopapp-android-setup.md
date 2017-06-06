---
title: Azure AD v2 Android Getting Started - Setup | Microsoft Docs
description: How an Android ap can get an access token and call Microsoft Graph API or APIs that require access tokens from Azure Active Directory v2 endpoint
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

## Set up your project

> Prefer to download this sample's Android Studio project instead? [Download a project](https://github.com/Azure-Samples/active-directory-android-native-v2/archive/master.zip) and skip to the [Configuration](#create-an-application-express "Configuration Step") step to configure the code sample before executing    .


### Create a new project 
1.	Open Android Studio, go to: `File` > `New` > `New Project`
2.	Name your application and click `Next`
3.	Make sure to select *API 21 or newer (Android 5.0)* and click `Next`
4.	Leave `Empty Activity`, click `Next`, then `Finish`


### Add the Microsoft Authentication Library (MSAL) to your project
1.	In Android Studio, go to: `Gradle Scripts` > `build.gradle (Module: app)`
2.	Copy and paste the following code under `Dependencies`:

```ruby  
compile ('com.microsoft.identity.client:msal:0.1.+') {
    exclude group: 'com.android.support', module: 'appcompat-v7'
}
compile 'com.android.volley:volley:1.0.0'
```

<!--start-collapse-->
### About this package

The package above installs the Microsoft Authentication Library (MSAL). MSAL handles acquiring, caching and refreshing user tokens used to access APIs protected by Azure Active Directory v2 endpoint.
<!--end-collapse-->

## Create your application’s UI

1.	Open: `activity_main.xml` under `res` > `layout`
2.	Change the activity layout from `android.support.constraint.ConstraintLayout` or other to `LinearLayout`
3.	Add `android:orientation="vertical"` property to `LinearLayout` node
4.	Copy and paste the following code into the `LinearLayout` node, replacing the current content:

```xml
<TextView
    android:text="Welcome, "
    android:textColor="#3f3f3f"
    android:textSize="50px"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_marginLeft="10dp"
    android:layout_marginTop="15dp"
    android:id="@+id/welcome"
    android:visibility="invisible"/>

<Button
    android:id="@+id/callGraph"
    android:text="Call Microsoft Graph"
    android:textColor="#FFFFFF"
    android:background="#00a1f1"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginTop="200dp"
    android:textAllCaps="false" />

<TextView
    android:text="Getting Graph Data..."
    android:textColor="#3f3f3f"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginLeft="5dp"
    android:id="@+id/graphData"
    android:visibility="invisible"/>

<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="0dip"
    android:layout_weight="1"
    android:gravity="center|bottom"
    android:orientation="vertical" >

    <Button
        android:text="Sign Out"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginBottom="15dp"
        android:textColor="#FFFFFF"
        android:background="#00a1f1"
        android:textAllCaps="false"
        android:id="@+id/clearCache"
        android:visibility="invisible" />
</LinearLayout>
```

