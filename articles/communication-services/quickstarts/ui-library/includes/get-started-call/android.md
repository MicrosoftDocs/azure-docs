---
title: Quickstart - Add Mobile calling composite over an Android app using the Mobile UI library for Android
description: In this tutorial, you learn how to use the Mobile UI library for Android
author: jorgegarc
ms.author: pprystinka
ms.date: 10/10/2021
ms.topic: quickstart
ms.service: azure-communication-services
---


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An OS running [Android Studio](https://developer.android.com/studio).
- A deployed Communication Services resource. [Create a Communication Services resource](https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).
- Azure Communication Services Token. See [example](https://docs.microsoft.com/azure/communication-services/quickstarts/identity/quick-create-identity) 

## Setting up

### Creating an Android app with an empty activity

In Android Studio, create a new project and select the `Empty Activity`.

![Start a new Android Studio Project](../../media/composite-android-new-project.png)

Click the `Next` button and name the project `UILibraryQuickStart`, set language to `Java/Kotlin` and select Minimum SDK "API 23: Android 6.0 (Marshmallow)" or greater.

![Screenshot showing the 'Finish' button selected in Android Studio.](../../media/composite-android-new-project-finish.png)

Click `Finish`.

## Install the packages

In your app level (**app folder**) `build.gradle`, add the following lines to the dependencies and android sections.

```groovy
android {
    packagingOptions {
        pickFirst  'META-INF/*'
    }
}
```

```groovy
dependencies {
    implementation 'com.azure.android:azure-communication-calling-ui-library:1.0.0-alpha.0'
}
```


In your project setting level (**app folder**) `settings.gradle`, add the following lines to the repositories.

```groovy
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        maven {
            url "https://pkgs.dev.azure.com/MicrosoftDeviceSDK/DuoSDK-Public/_packaging/Duo-SDK-Feed/maven/v1"
        }
        maven {
            name='github'
            url = 'https://maven.pkg.github.com/{repository owner}/{repository}'
            credentials {
                username '<you user name>'
                password '<you personal access token>'
            }
        }
    }
}
```

Sync project with gradle files. (Android Studio -> File -> Sync Project With Gradle Files)

## Add a button to the activity_main

Go to the layout file (`app/src/main/res/layout/activity_main.xml`). Here we'll drop the following code to create a button to start composite.

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <Button
        android:id="@+id/startUILibraryButton"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Launch"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

## Initialize composite 

Go to `MainActivity`. Here we'll drop the following code to initialize our Composite Components for Calling. Replace `"GROUP_CALL_ID"` with your group id for your call, `"DISPLAY_NAME"` with your name, and  `"<USER_ACCESS_TOKEN>"` with your token.

#### [Kotlin](#tab/kotlin1)

```kotlin
package com.example.uilibraryquickstart

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import com.azure.android.communication.common.CommunicationTokenCredential
import com.azure.android.communication.common.CommunicationTokenRefreshOptions
import com.azure.android.communication.toolkit.CallCompositeBuilder
import com.azure.android.communication.toolkit.CallComposite
import com.azure.android.communication.toolkit.GroupCallOptions
import java.util.UUID

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        val startCallCompositeButton: Button = findViewById(R.id.startUILibraryButton)
        startCallCompositeButton.setOnClickListener { l -> startCallComposite() }
    }

    private fun startCallComposite() {
        val communicationTokenRefreshOptions = CommunicationTokenRefreshOptions({ fetchToken() }, true)
        val communicationTokenCredential = CommunicationTokenCredential(communicationTokenRefreshOptions)
        val options = GroupCallOptions(
            this,
            communicationTokenCredential,
            "DISPLAY_NAME",
            UUID.fromString("GROUP_CALL_ID")
        )

        val callComposite: CallComposite = CallCompositeBuilder().build()
        callComposite.launch(options)
    }

    private fun fetchToken(): String? {
        return "USER_ACCESS_TOKEN"
    }
}
```

#### [Java](#tab/java1)

```java
package com.example.uilibraryquickstart;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Button;
import com.azure.android.communication.common.CommunicationTokenCredential;
import com.azure.android.communication.common.CommunicationTokenRefreshOptions;
import com.azure.android.communication.toolkit.CallCompositeBuilder;
import com.azure.android.communication.toolkit.CallComposite;
import com.azure.android.communication.toolkit.GroupCallOptions;
import java.util.UUID;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button startCallCompositeButton = findViewById(R.id.startUILibraryButton);

        startCallCompositeButton.setOnClickListener(l -> {
            startCallComposite();
        });
    }

    private void startCallComposite() {
        CallComposite callComposite = new CallCompositeBuilder().build();

        CommunicationTokenRefreshOptions communicationTokenRefreshOptions =
                new CommunicationTokenRefreshOptions(this::fetchToken, true);
        CommunicationTokenCredential communicationTokenCredential = new CommunicationTokenCredential(communicationTokenRefreshOptions);

        GroupCallOptions options = new GroupCallOptions(this,
                communicationTokenCredential,
                "DISPLAY_NAME",
                UUID.fromString("GROUP_CALL_ID"));

        callComposite.launch(options);
    }

    private String fetchToken() {
        return "USER_ACCESS_TOKEN";
    }
}
```

## Run the code

Build and start application from Android Studio.

- Click `Launch`.
- Accept audio permissions and select device, mic, and video settings.
- Click `Join Call`.

![Launch Toolkit](../../media/composite-android.gif)

## Object Model

The following classes and interfaces handle some of the major features of the Azure Communication Services UI client library:

| Name                                                               | Description                                                                                  |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| [CallComposite](#create-call-composite)                            | Composite component that renders a call experience with participant gallery and controls.    |
| [CallCompositeBuilder](#create-call-composite)                     | Builder to build CallComposite with options.                                                 |
| [CallingEventHandler](#subscribe-events-from-ui-library)           | Injected as optional in CallingEventHandler to receive events from CallComposite.             |
| [GroupCallOptions](#group-call)                                    | Passed in CallComposite launch to start group call.                              |
| [TeamsMeetingOptions](#teams-meeting)                              | Passed to CallComposite launch to join Teams meeting meeting.                           |
| [ThemeConfiguration](#apply-theme-configuration)                   | Injected as optional in CallCompositeBuilder to change primary color of composite.             |

## [Create Call Composite](#create-call-composite)

Initialize a `CallCompositeBuilder` instance and a `CallComposite` instance inside the `startCallComposite` function.

#### [Kotlin](#tab/kotlin2)

```kotlin
val callComposite: CallComposite = CallCompositeBuilder().build()
```
#### [Java](#tab/java2)

```java
CallComposite callComposite = new CallCompositeBuilder().build();
```

## Create CommunicationTokenCredential

Initialize a `CommunicationTokenCredential` instance inside the `startCallComposite` function. Replace `"<USER_ACCESS_TOKEN>"` with your token.

#### [Kotlin](#tab/kotlin3)

```kotlin
val callComposite: CallComposite = CallCompositeBuilder().build()

val communicationTokenRefreshOptions = CommunicationTokenRefreshOptions(this::fetchToken, true)

val communicationTokenCredential = CommunicationTokenCredential(communicationTokenRefreshOptions)
```

#### [Java](#tab/java3)

```java
CallComposite callComposite = new CallCompositeBuilder().build();

CommunicationTokenRefreshOptions communicationTokenRefreshOptions =
                new CommunicationTokenRefreshOptions(this::fetchToken, true);

CommunicationTokenCredential communicationTokenCredential = new CommunicationTokenCredential(communicationTokenRefreshOptions);

```

Refer to the [user access token](https://docs.microsoft.com/azure/communication-services/quickstarts/identity/quick-create-identity) documentation if you don't already have a token available.

## Setup Group Call or Teams Meeting Options

Depending on what type of Call/Meeting you would like to setup, use the appropriate options object.

### [Group Call](#group-call)

Initialize a `GroupCallOptions` instance inside the `startCallComposite` function.
Replace `"GROUP_CALL_ID"` with your group id for your call.
Replace `"DISPLAY_NAME"` with your name.

#### [Kotlin](#tab/kotlin4)

```kotlin
val options = GroupCallOptions(
            this,
            communicationTokenCredential,
            "DISPLAY_NAME",
            UUID.fromString("GROUP_CALL_ID")
        )
```

#### [Java](#tab/java4)

```java
GroupCallOptions options = new GroupCallOptions(
    this,
    communicationTokenCredential,
    "DISPLAY_NAME",
    UUID.fromString("GROUP_CALL_ID")
);
```

### [Teams Meeting](#teams-meeting)

Initialize a `TeamsMeetingOptions` instance inside the `startCallComposite` function.
Replace `"TEAMS_MEETING_LINK"` with your group id for your call.
Replace `"DISPLAY_NAME"` with your name.

#### [Kotlin](#tab/kotlin5)

```kotlin
val options = TeamsMeetingOptions(
            this,
            communicationTokenCredential,
            "DISPLAY_NAME",
           "TEAMS_MEETING_LINK"
        )
```

#### [Java](#tab/java5)

```java
TeamsMeetingOptions options = new TeamsMeetingOptions(
    this,
    communicationTokenCredential,
    "DISPLAY_NAME",
    "TEAMS_MEETING_LINK"
);
```

### Get a Microsoft Teams meeting link

A Microsoft Teams meeting link can be retrieved using Graph APIs. This process is detailed in [Graph documentation](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true).
The Communication Services Call SDK accepts a full Microsoft Teams meeting link. This link is returned as part of the `onlineMeeting` resource, accessible under the [`joinWebUrl` property](/graph/api/resources/onlinemeeting?view=graph-rest-beta&preserve-view=true)
You can also get the required meeting information from the **Join Meeting** URL in the Teams meeting invite itself.

## [Launch](#launch)

Call `launch` on the `CallComposite` instance inside the `startCallComposite` function

#### [Kotlin](#tab/kotlin6)

```kotlin
callComposite.launch(options)
```

#### [Java](#tab/java6)

```java
callComposite.launch(options);
```

## [Subscribe events from UI Library](#subscribe-events-from-ui-library)

To receive events, inject a handler to `CallCompositeBuilder`.

#### [Kotlin](#tab/kotlin7)

```kotlin
val communicationCallComposite: CallComposite =
            CallCompositeBuilder()
                .onException { 
                    //...
                }
                .build()

```

#### [Java](#tab/java7)

```java
CallComposite communicationCallComposite =
                new CallCompositeBuilder()
                        onException(eventArgs -> {
                            //...
                        })
                        .build();

```

## [Apply theme configuration](#apply-theme-configuration)

To change the primary color of composite, create a new theme style in `src/main/res/values/themes.xml` and `src/main/res/values-night/themes.xml` by considering `AzureCommunicationUI.Theme.Calling` as parent theme. To apply theme, inject the theme id in `CallCompositeBuilder`.

```xml
<style name="MyCompany.CallComposite" parent="AzureCommunicationUI.Theme.Calling">
    <item name="azure_communication_ui_calling_primary_color">@color/purple_500</item>
</style>
```

#### [Kotlin](#tab/kotlin8)

```kotlin
val communicationCallComposite: CallComposite =
        CallCompositeBuilder()
            .onException { 
                //...
            }
            .theme(ThemeConfiguration(R.style.MyCompany_CallComposite))
            .build()
```

#### [Java](#tab/java8)

```java
CallComposite callComposite = 
    new CallCompositeBuilder()
        .onException(eventArgs -> {
            //...
        })
        .theme(new ThemeConfiguration(R.style.MyCompany_CallComposite))
        .build();
```
