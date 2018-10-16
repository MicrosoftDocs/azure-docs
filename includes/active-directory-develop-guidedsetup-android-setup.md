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

## Set up your project

Do you want to download this sample's Android Studio project instead? [Download a project](https://github.com/Azure-Samples/active-directory-android-native-v2/archive/master.zip), and skip to the [Configuration step](#register-your-application) to configure the code sample before you execute it.

### Create a new project 
1.	Open Android Studio, and then select **File** > **New** > **New Project**.
2.	Name your application, and then select **Next**.
3.	Select **API 21 or newer (Android 5.0)**, and then select **Next**.
4.	Leave **Empty Activity** as it is, select **Next**, and then select **Finish**.


### Add MSAL to your project
1.	In Android Studio, select **Gradle Scripts** > **build.gradle (Module: app)**.
2.	Under **Dependencies**, paste the following code:

    ```gradle  
    compile ('com.microsoft.identity.client:msal:0.1.+') {
        exclude group: 'com.android.support', module: 'appcompat-v7'
    }
    compile 'com.android.volley:volley:1.0.0'
    ```

<!--start-collapse-->
### About this package

The package in the preceding code installs Microsoft Authentication Library. MSAL handles all token operations including acquiring, caching, refreshing, and deleting.  The tokens are needed to access the APIs protected by Microsoft identity platform.
<!--end-collapse-->

## Create the app's UI

1. Go to **res** > **layout**, and then open **activity_main.xml**. 
2. Change the activity layout from `android.support.constraint.ConstraintLayout` or other to `LinearLayout`.
3. Add the `android:orientation="vertical"` property to the `LinearLayout` node.
4. Paste the following code into the `LinearLayout` node, replacing the current content:

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
