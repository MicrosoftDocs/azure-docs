---
author: pavelprystinka
ms.author: pprystinka
ms.date: 10/10/2021
ms.topic: include
ms.service: azure-communication-services
---

> [!VIDEO https://www.youtube.com/embed/8hOKCHgSNsg]

Get the sample Android application for this [quickstart](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-calling) in the open source Azure Communication Services [UI Library for Android](https://github.com/Azure/communication-ui-library-android).

## Prerequisites

- An Azure account and an active Azure subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An OS running [Android Studio](https://developer.android.com/studio).
- A deployed [Azure Communication Services resource](../../../create-communication-resource.md).
- An Azure Communication Services [access token](../../../identity/quick-create-identity.md).

## Set up the project

Complete the following sections to set up the quickstart project.

### Create a new Android project

In Android Studio, create a new project:

1. In the **File** menu, select **New** > **New Project**.

1. In **New Project**, select the **Empty Activity** project template.

   :::image type="content" source="../../media/composite-android-new-project.png" alt-text="Screenshot that shows the New Project dialog in Android Studio with Empty Activity selected.":::

1. Select **Next**.

1. In **Empty Activity**, name the project **UILibraryQuickStart**. For language, select **Java/Kotlin**. For the minimum SDK, select **API 26: Android 8.0 (Oreo)** or later.

1. Select **Finish**.

   :::image type="content" source="../../media/composite-android-new-project-finish.png" alt-text="Screenshot that shows new project options and the Finish button selected.":::

## Install the packages

Complete the following sections to install the required application packages.

### Add a dependency

In your app-level *UILibraryQuickStart/app/build.gradle* file (in the app folder), add the following dependency:

```groovy
dependencies {
    ...
    implementation 'com.azure.android:azure-communication-ui-calling:+'
    ...
}
```

### Add Maven repositories

Two Maven repositories are required to integrate the library:

- MavenCentral
- The Azure package repository

To add the repositories:

1. In your project Gradle scripts, ensure that the following repositories are added. For Android Studio (2020.\*), `repositories` is in `settings.gradle`, under `dependencyResolutionManagement(Gradle version 6.8 or greater)`.  For earlier versions of Android Studio (4.\*), `repositories` is in the project-level `build.gradle`, under `allprojects{}`.

    ```groovy
    // dependencyResolutionManagement
    repositories {
        ...
        mavenCentral()
        maven {
            url "https://pkgs.dev.azure.com/MicrosoftDeviceSDK/DuoSDK-Public/_packaging/Duo-SDK-Feed/maven/v1"
        }
        ...
    }
    ```

1. Sync your project with the Gradle files. To sync the project, on the **File** menu, select **Sync Project With Gradle Files**.

## Add a button to Activity_main.xml

In the *app/src/main/res/layout/activity_main.xml* layout file, add the following code to create a button to start the composite:

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <Button
        android:id="@+id/startButton"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Launch"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

## Initialize the composite

To initialize the composite:

1. Go to `MainActivity`.

1. Add the following code to initialize your composite components for calling. Replace `"GROUP_CALL_ID"` with the group ID for your call. Replace `"DISPLAY_NAME"` with your name. Replace `"USER_ACCESS_TOKEN"` with your token.

#### [Kotlin](#tab/kotlin)

```kotlin
package com.example.uilibraryquickstart

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import com.azure.android.communication.common.CommunicationTokenCredential
import com.azure.android.communication.common.CommunicationTokenRefreshOptions
import com.azure.android.communication.ui.calling.CallComposite
import com.azure.android.communication.ui.calling.CallCompositeBuilder
import com.azure.android.communication.ui.calling.models.CallCompositeGroupCallLocator
import com.azure.android.communication.ui.calling.models.CallCompositeJoinLocator
import java.util.UUID

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        val startButton: Button = findViewById(R.id.startButton)
        startButton.setOnClickListener { l -> startCallComposite() }
    }

    private fun startCallComposite() {
        val communicationTokenRefreshOptions = CommunicationTokenRefreshOptions({ fetchToken() }, true)
        val communicationTokenCredential = CommunicationTokenCredential(communicationTokenRefreshOptions)

        val locator: CallCompositeJoinLocator = CallCompositeGroupCallLocator(UUID.fromString("GROUP_CALL_ID"))
        val callComposite: CallComposite = CallCompositeBuilder()
            .applicationContext(this.applicationContext)
            .credential(communicationTokenCredential)
            .displayName("DISPLAY_NAME").build()
        
        callComposite.launch(this, locator)
    }

    private fun fetchToken(): String? {
        return "USER_ACCESS_TOKEN"
    }
}
```

#### [Java](#tab/java)

```java
package com.example.uilibraryquickstart;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Button;
import com.azure.android.communication.common.CommunicationTokenCredential;
import com.azure.android.communication.common.CommunicationTokenRefreshOptions;
import com.azure.android.communication.ui.calling.CallComposite;
import com.azure.android.communication.ui.calling.CallCompositeBuilder;
import com.azure.android.communication.ui.calling.models.CallCompositeGroupCallLocator;
import com.azure.android.communication.ui.calling.models.CallCompositeJoinLocator;
import java.util.UUID;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button startButton = findViewById(R.id.startButton);

        startButton.setOnClickListener(l -> {
            startCallComposite();
        });
    }

    private void startCallComposite() {
        CommunicationTokenRefreshOptions communicationTokenRefreshOptions =
                new CommunicationTokenRefreshOptions(this::fetchToken, true);
        CommunicationTokenCredential communicationTokenCredential =
                new CommunicationTokenCredential(communicationTokenRefreshOptions);

        final CallCompositeJoinLocator locator = new CallCompositeGroupCallLocator(UUID.fromString("GROUP_CALL_ID"));

        CallComposite callComposite = new CallCompositeBuilder()
                .applicationContext(this.getApplicationContext())
                .credential(communicationTokenCredential)
                .displayName("DISPLAY_NAME").build();
        callComposite.launch(this, locator);
    }

    private String fetchToken() {
        return "USER_ACCESS_TOKEN";
    }
}
```

---

## Run the code

In Android Studio, build and start the application:

1. Select **Launch**.
1. Accept permissions, and then select device, microphone, and video settings.
1. Select **Join call**.

:::image type="content" source="../../media/composite-android.gif" alt-text="GIF animation that shows an example of how the project runs on an Android device.":::

## Object model

The following classes and interfaces handle some key features of the Azure Communication Services Android UI:

| Name                                                                  | Description                                                                                  |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [CallComposite](#create-callcomposite)                               | Composite component that renders a call experience with participant gallery and controls   |
| [CallCompositeBuilder](#create-callcomposite)                        | Builder that builds `CallComposite` with options                                                |
| [CallCompositeJoinMeetingLocator](#set-up-a-group-call)                        | Passed-in `CallComposite` launch to start a group call                                         |
| [CallCompositeTeamsMeetingLinkLocator](#join-a-teams-meeting)                | Passed to `CallComposite` launch to join a Microsoft Teams meeting                                     |
| [CallCompositeLocalizationOptions](#apply-a-localization-configuration) | Injected as optional in `CallCompositeBuilder` to set the language of the composite      |

## UI Library functionality

Get the code to create key communication features for your Android application.

### Set up authentication

To set up authentication, inside the `startCallComposite` function, initialize a `CommunicationTokenCredential` instance. Replace `"USER_ACCESS_TOKEN"` with your access token.

#### [Kotlin](#tab/kotlin)

```kotlin
val callComposite: CallComposite = CallCompositeBuilder().build()

val communicationTokenRefreshOptions = CommunicationTokenRefreshOptions(this::fetchToken, true)

val communicationTokenCredential = CommunicationTokenCredential(communicationTokenRefreshOptions)
```

#### [Java](#tab/java)

```java
CallComposite callComposite = new CallCompositeBuilder().build();

CommunicationTokenRefreshOptions communicationTokenRefreshOptions =
        new CommunicationTokenRefreshOptions(this::fetchToken, true);

CommunicationTokenCredential communicationTokenCredential = 
        new CommunicationTokenCredential(communicationTokenRefreshOptions);

```

If you don't already have an access token, [create an Azure Communication Services access token](../../../identity/quick-create-identity.md).

---

### Create CallComposite

To create `CallComposite`, inside the `startCallComposite` function, initialize a `CallCompositeBuilder` instance with application context, credentials and a display name.

#### [Kotlin](#tab/kotlin)

```kotlin
val callComposite: CallComposite = CallCompositeBuilder()
            .applicationContext(this.applicationContext)
            .credential(communicationTokenCredential)
            .displayName("DISPLAY_NAME").build()
```

#### [Java](#tab/java)

```java
CallComposite callComposite = new CallCompositeBuilder()
                .applicationContext(this.getApplicationContext())
                .credential(communicationTokenCredential)
                .displayName("DISPLAY_NAME").build();
```

---

### Set up a group call

To set up a group call, initialize a `CallCompositeGroupCallLocator`.

#### [Kotlin](#tab/kotlin)

```kotlin
val locator = CallCompositeGroupCallLocator(UUID.fromString("GROUP_CALL_ID"))
```

#### [Java](#tab/java)

```java
CallCompositeJoinLocator locator = new CallCompositeGroupCallLocator(UUID.fromString("GROUP_CALL_ID"));
```
---

### Join a Teams meeting

You can join to a Teams meeting using two mechanisms:

- Teams meeting URL or Teams meeting short URL
- Teams Meeting ID and Passcode

The Teams meeting link can be retrieved using Graph APIs, which is detailed in [Graph documentation](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true).

The Communication Services Calling SDK accepts a full Teams meeting link. This link is returned as part of the `onlineMeeting` resource, accessible under the [`joinWebUrl` property](/graph/api/resources/onlinemeeting?view=graph-rest-beta&preserve-view=true)
You can also get the required meeting information from the **Join Meeting** URL in the Teams meeting invite itself.

#### Join via Teams meeting URL

To join a Microsoft Teams meeting, initialize a `CallCompositeTeamsMeetingLinkLocator`.

#### [Kotlin](#tab/kotlin)

```kotlin
val locator = CallCompositeTeamsMeetingLinkLocator("TEAMS_MEETING_LINK")
```

#### [Java](#tab/java)

```java
CallCompositeJoinLocator locator = new CallCompositeTeamsMeetingLinkLocator("TEAMS_MEETING_LINK");
```

---

#### Join via Teams Meeting ID and Passcode

The `CallCompositeTeamsMeetingLinkLocator` locates a meeting using a meeting ID and passcode. These can be found under a Teams meeting's join info.
A Teams meeting ID is 12 characters long and consists of numeric digits grouped in threes (i.e. `000 000 000 000`).
A passcode consists of 6 alphabet characters (i.e. `aBcDeF`). The passcode is case sensitive.

#### [Kotlin](#tab/kotlin)

```kotlin
val locator = CallCompositeTeamsMeetingIdLocator("TEAMS_MEETING_ID", "TEAMS_MEETING_PASSCODE")
```

#### [Java](#tab/java)

```java
CallCompositeJoinLocator locator = new CallCompositeTeamsMeetingLinkLocator("TEAMS_MEETING_ID", "TEAMS_MEETING_PASSCODE");
```

---

### Set up a Rooms call

To set up an Azure Communication Services Rooms call, initialize a `CallCompositeRoomLocator` with a room ID.
While on the setup screen, `CallComposite` enables camera and microphone to all participants with any room role. Actual up-to-date participant role and capabilities are retrieved from Azure Communication Services once call is connected.

For more information about Rooms, how to create and manage one see [Rooms Quickstart](../../../rooms/get-started-rooms.md)

#### [Kotlin](#tab/kotlin)

```kotlin
val locator = CallCompositeRoomLocator("<ROOM_ID>")
```

#### [Java](#tab/java)

```java
CallCompositeJoinLocator locator = new CallCompositeRoomLocator("<ROOM_ID>");
```
---

### Set up a 1:N Outgoing call and incoming call push notifications 

UI Library supports one-to-one VoIP call to dial users by communication identifier. To receive incoming call UI Library also supports registering for PUSH notifications. To learn more about the integration for Android and iOS platform and usage of the API, see [How to make one-to-one call and receive PUSH notifications.](../../../../how-tos/ui-library-sdk/one-to-one-calling.md)

### Launch the composite

To launch the call UI, inside the `startCallComposite` function, call `launch` on the `CallComposite` instance.

#### [Kotlin](#tab/kotlin)

```kotlin
callComposite.launch(activityContext, locator)
```

#### [Java](#tab/java)

```java
callComposite.launch(activityContext, locator);
```

---
### Subscribe to CallComposite error events

To receive error events, call `setOnErrorHandler` with `CallComposite`.

The following `errorCode` values might be sent to the error handler:

- `CallCompositeErrorCode.CALL_JOIN_FAILED`
- `CallCompositeErrorCode.CALL_END_FAILED`
- `CallCompositeErrorCode.TOKEN_EXPIRED`
- `CallCompositeErrorCode.CAMERA_FAILURE`
- `CallCompositeErrorCode.MICROPHONE_PERMISSION_NOT_GRANTED`
- `CallCompositeErrorCode.NETWORK_CONNECTION_NOT_AVAILABLE`

The following example shows an error event for a failed composite event.

#### [Kotlin](#tab/kotlin)

```kotlin
callComposite.addOnErrorEventHandler { callCompositeErrorEvent ->
    println(callCompositeErrorEvent.errorCode)
}
```

#### [Java](#tab/java)

```java
callComposite.addOnErrorEventHandler(callCompositeErrorEvent -> {
    System.out.println(callCompositeErrorEvent.getErrorCode());
});
```

---
### Apply a theme configuration

To change the primary color of the composite, create a new theme style in *src/main/res/values/themes.xml* and *src/main/res/values-night/themes.xml* by using `AzureCommunicationUICalling.Theme` as the parent theme. To apply the theme, inject the theme ID in `CallCompositeBuilder`:

```xml
<style name="MyCompany.CallComposite" parent="AzureCommunicationUICalling.Theme">
    <item name="azure_communication_ui_calling_primary_color">#27AC22</item>
    <item name="azure_communication_ui_calling_primary_color_tint10">#5EC65A</item>
    <item name="azure_communication_ui_calling_primary_color_tint20">#A7E3A5</item>
    <item name="azure_communication_ui_calling_primary_color_tint30">#CEF0CD</item>
</style>
```

#### [Kotlin](#tab/kotlin)

```kotlin
val callComposite: CallComposite =
        CallCompositeBuilder()
            .theme(R.style.MyCompany_CallComposite)
            .build()
```

#### [Java](#tab/java)

```java
CallComposite callComposite = 
    new CallCompositeBuilder()
        .theme(R.style.MyCompany_CallComposite)
        .build();
```

---
### Apply a localization configuration

To change the language of the composite, use `CallCompositeSupportedLocale` to create `CallCompositeLocalizationOptions` with `Locale`. To apply language, inject the localization configuration in `CallCompositeBuilder`. By default, all text labels use English (`en`) strings. You can use `CallCompositeLocalizationOptions` to set a different value for `language`. By default, UI Library includes a set of `language` values that you can use with UI components. `CallCompositeSupportedLocale` provides the supported locales. For example, to access the English locale, you can use `CallCompositeSupportedLocale.EN`. `CallCompositeSupportedLocale.getSupportedLocales()` provides a list of locale objects for supported languages.

#### [Kotlin](#tab/kotlin)

```kotlin
import com.azure.android.communication.ui.calling.models.CallCompositeLocalizationOptions
import com.azure.android.communication.ui.calling.models.CallCompositeSupportedLocale

// CallCompositeSupportedLocale provides list of supported locale
val callComposite: CallComposite =
            CallCompositeBuilder().localization(
                CallCompositeLocalizationOptions(CallCompositeSupportedLocale.EN)
            ).build()
```

#### [Java](#tab/java)

```java
import com.azure.android.communication.ui.calling.models.CallCompositeLocalizationOptions;
import com.azure.android.communication.ui.calling.models.CallCompositeSupportedLocale;

// CallCompositeSupportedLocale provides a list of supported locales.
CallComposite callComposite = 
    new CallCompositeBuilder()
        .localization(new CallCompositeLocalizationOptions(CallCompositeSupportedLocale.EN))
        .build();
```

---
### Subscribe to CallComposite call state changed event

To receive call state changed events, call `addOnCallStateChangedEventHandler` with `CallComposite`.

The following example shows an event for a call state changed.

#### [Kotlin](#tab/kotlin)

```kotlin
callComposite.addOnCallStateChangedEventHandler { callStateChangedEvent ->
    println(callStateChangedEvent.code)
}
```

#### [Java](#tab/java)

```java
callComposite.addOnCallStateChangedEventHandler(callStateChangedEvent -> {
    System.out.println(callStateChangedEvent.getCode());
});
```

---
### Dismiss CallComposite and subscribe to dismissed event

To receive dismiss, call `addOnDismissedEventHandler` with `CallComposite`. To dismiss CallComposite, call `dismiss`.

The following example shows an event for a call state changed.

#### [Kotlin](#tab/kotlin)

```kotlin
callComposite.addOnDismissedEventHandler { callCompositeDismissedEvent ->
    println(callCompositeDismissedEvent.errorCode)
}

callComposite.dismiss()
```

#### [Java](#tab/java)

```java
callComposite.addOnDismissedEventHandler(callCompositeDismissedEvent -> {
    System.out.println(callCompositeDismissedEvent.getErrorCode());
});

callComposite.dismiss();
```

---
### More features

The list of [use cases](../../../../concepts/ui-library/ui-library-use-cases.md) has detailed information about more features.

### Add notifications to your mobile app

Azure Communication Services integrates with [Azure Event Grid](../../../../../event-grid/overview.md) and [Azure Notification Hubs](../../../../../notification-hubs/notification-hubs-push-notification-overview.md), so you can [add push notifications](../../../../concepts/notifications.md) to your apps in Azure. You can use push notifications to send information from your application to users' mobile devices. A push notification can show a dialog, play a sound, or display an incoming call UI.
