---
title: 'Tutorial: Create a new Android app'
description: In this tutorial, you learn how to create a new Android app using Azure Spatial Anchors.
author: ramonarguelles
manager: vriveras
services: azure-spatial-anchors

ms.author: rgarcia
ms.date: 04/03/2019
ms.topic: tutorial
ms.service: azure-spatial-anchors
---

# Tutorial: Step-by-step instructions to create a new Android app using Azure Spatial Anchors

This tutorial will show you how to create a new Android app that integrates ARCore functionality with Azure Spatial Anchors.

## Prerequisites

To complete this tutorial, make sure you have:

- A Windows or macOS machine with <a href="https://developer.android.com/studio/" target="_blank">Android Studio 3.4+</a>.
- A <a href="https://developer.android.com/studio/debug/dev-options" target="_blank">developer enabled</a> and <a href="https://developers.google.com/ar/discover/supported-devices" target="_blank">ARCore capable</a> Android device.

## Getting started

Start Android Studio. In the **Welcome to Android Studio** window, click **Start a new Android Studio project**. Or, if you have a project already opened, select **File**->**New Project**.

In the **Create New Project** window, under the **Phone and Tablet** section, choose **Empty Activity**, and click **Next**. Then, under **Minimum API level**, choose `API 26: Android 8.0 (Oreo)`, and ensure the **Language** is set to `Java`. You may want to change the Project Name & Location, and the Package name. Leave the other options as they are. Click **Finish**. The **Component Installer** will run. Once it's done, click **Finish**. After some processing, Android Studio will open the IDE.

## Trying it out

To test out your new app, connect your developer-enabled device to your development machine with a USB cable. Click **Run**->**Run 'app'**. In the **Select Deployment Target** window, select your device, and click **OK**. Android Studio installs the app on your connected device and starts it. You should now see "Hello World!" displayed in the app running on your device. Click **Run**->**Stop 'app'**.

## Integrating _ARCore_

<a href="https://developers.google.com/ar/discover/" target="_blank">_ARCore_</a> is Google's platform for building Augmented Reality experiences, enabling your device to track its position as it moves and builds its own understanding of the real world.

Modify `app\manifests\AndroidManifest.xml` to include the following entries inside the root `<manifest>` node. This code snippet does a few things:

- It will allow your app to access your device camera.
- It will also ensure your app is only visible in the Google Play Store to devices that support ARCore.
- It will configure the Google Play Store to download and install ARCore, if it isn't installed already, when your app is installed.

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera.ar" />

<application>
    ...
    <meta-data android:name="com.google.ar.core" android:value="required" />
    ...
</application>
```

Modify `Gradle Scripts\build.gradle (Module: app)` to include the following entry. This code will ensure that your app targets ARCore version 1.8. After this change, you might get a notification from Gradle asking you to sync: click **Sync now**.

```
dependencies {
    ...
    implementation 'com.google.ar:core:1.11.0'
    ...
}
```

## Integrating _Sceneform_

[_Sceneform_](https://developers.google.com/sceneform/develop/) makes it simple to render realistic 3D scenes in Augmented Reality apps, without having to learn OpenGL.

Modify `Gradle Scripts\build.gradle (Module: app)` to include the following entries. This code will allow your app to use language constructs from Java 8, which `Sceneform` requires. It will also ensure your app targets `Sceneform` version 1.8, since it should match the version of ARCore your app is using. After this change, you might get a notification from Gradle asking you to sync: click **Sync now**.

```
android {
    ...

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    ...
    implementation 'com.google.ar.sceneform.ux:sceneform-ux:1.11.0'
    ...
}
```

Open your `app\res\layout\activity_main.xml`, and replace the existing Hello Wolrd `<TextView>` element with the following ArFragment. This code will cause the camera feed to be displayed on your screen enabling ARCore to track your device position as it moves.

```xml
<fragment android:name="com.google.ar.sceneform.ux.ArFragment"
    android:id="@+id/ux_fragment"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```

[Redeploy](#trying-it-out) your app to your device to validate it once more. This time, you should be asked for camera permissions. Once approved, you should  see your camera feed rendering on your screen.

## Place an object in the real world

Let's create & place an object using your app. First, add the following imports into your `app\java\<PackageName>\MainActivity`:

[!code-java[MainActivity](../../../includes/spatial-anchors-new-android-app-finished.md?range=23-33)]

Then, add the following member variables into your `MainActivity` class:

[!code-java[MainActivity](../../../includes/spatial-anchors-new-android-app-finished.md?range=52-57)]

Next, add the following code into your `app\java\<PackageName>\MainActivity` `onCreate()` method. This code will hook up a listener, called `handleTap()`, that will detect when the user taps the screen on your device. If the tap happens to be on a real world surface that has already been recognized by ARCore's tracking, the listener will run.

[!code-java[MainActivity](../../../includes/spatial-anchors-new-android-app-finished.md?range=68-74,85&highlight=6-7)]

Finally, add the following `handleTap()` method, that will tie everything together. It will create a sphere, and place it on the tapped location. The sphere will initially be black, since `this.recommendedSessionProgress` is set to zero right now. This value will be adjusted later on.

[!code-java[MainActivity](../../../includes/spatial-anchors-new-android-app-finished.md?range=150-158,170-171,174-182,198-199)]

[Redeploy](#trying-it-out) your app to your device to validate it once more. This time, you can move around your device to get ARCore to start recognizing your environment. Then, tap the screen to create & place your black sphere over the surface of your choice.

## Attach a local Azure Spatial Anchor

Modify `Gradle Scripts\build.gradle (Module: app)` to include the following entry. This code will ensure that your app targets Azure Spatial Anchors version 2.2.0. That said, referencing any recent version of Azure Spatial Anchors should work. You can find the release notes [here.](https://github.com/Azure/azure-spatial-anchors-samples/releases)

```
dependencies {
    ...
    implementation "com.microsoft.azure.spatialanchors:spatialanchors_jni:[2.2.0]"
    implementation "com.microsoft.azure.spatialanchors:spatialanchors_java:[2.2.0]"
    ...
}
```

Right-click `app\java\<PackageName>`->**New**->**Java Class**. Set **Name** to _MyFirstApp_, and **Superclass** to _android.app.Application_. Leave the other options as they are. Click **OK**. A file called `MyFirstApp.java` will be created. Add the following import to it:

```java
import com.microsoft.CloudServices;
```

Then, add the following code inside the new `MyFirstApp` class, which will ensure Azure Spatial Anchors is initialized with your application's context.

```java
    @Override
    public void onCreate() {
        super.onCreate();
        CloudServices.initialize(this);
    }
```

Now, modify `app\manifests\AndroidManifest.xml` to include the following entry inside the root `<application>` node. This code will hook up the Application class you created into your app.

```xml
    <application
        android:name=".MyFirstApp"
        ...
    </application>
```

Back in `app\java\<PackageName>\MainActivity`, add the following imports into it:

[!code-java[MainActivity](../../../includes/spatial-anchors-new-android-app-finished.md?range=33-40&highlight=2-8)]

Then, add the following member variables into your `MainActivity` class:

[!code-java[MainActivity](../../../includes/spatial-anchors-new-android-app-finished.md?range=57-60&highlight=3-4)]

Next, let's add the following `initializeSession()` method inside your `mainActivity` class. Once called, it will ensure an Azure Spatial Anchors session is created and properly initialized during the startup of your app.

[!code-java[MainActivity](../../../includes/spatial-anchors-new-android-app-finished.md?range=89-97,146)]

Now, let's hook your `initializeSession()` method into your `onCreate()` method. Also, we'll ensure that frames from your camera feed are sent to Azure Spatial Anchors SDK for processing.

[!code-java[MainActivity](../../../includes/spatial-anchors-new-android-app-finished.md?range=68-85&highlight=9-17)]

Finally, add the following code into your `handleTap()` method. It will attach a local Azure Spatial Anchor to the black sphere that we're placing in the real world.

[!code-java[MainActivity](../../../includes/spatial-anchors-new-android-app-finished.md?range=150-158,170-182,198-199&highlight=12-13)]

[Redeploy](#trying-it-out) your app once more. Move around your device, tap the screen, and place a black sphere. This time, though, your code will be creating and attaching a local Azure Spatial Anchor to your sphere.

Before proceeding any further, you'll need to create an Azure Spatial Anchors account Identifier and Key, if you don't already have them. Follow the following section to obtain them.

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

## Upload your local anchor into the cloud

Once you have your Azure Spatial Anchors account Identifier and Key, we can go back in `app\java\<PackageName>\MainActivity`, add the following imports into it:

[!code-java[MainActivity](../../../includes/spatial-anchors-new-android-app-finished.md?range=40-45&highlight=3-6)]

Then, add the following member variables into your `MainActivity` class:

[!code-java[MainActivity](../../../includes/spatial-anchors-new-android-app-finished.md?range=60-65&highlight=3-6)]

Now, add the following code into your `initializeSession()` method. First, this code will allow your app to monitor the progress that the Azure Spatial Anchors SDK makes as it collects frames from your camera feed. As it does, the color of your sphere will start changing from its original black, into grey. Then, it will turn white once enough frames are collected to submit your anchor to the cloud. Second, this code will provide the credentials needed to communicate with the cloud back-end. Here is where you'll configure your app to use your account Identifier and Key. You copied them into a text editor when [setting up the Spatial Anchors resource](#create-a-spatial-anchors-resource).

[!code-java[MainActivity](../../../includes/spatial-anchors-new-android-app-finished.md?range=89-120,142-146&highlight=11-36)]

Next, add the following `uploadCloudAnchorAsync()` method inside your `mainActivity` class. Once called, this method will asynchronously wait until enough frames are collected from your device. As soon as that happens, it will switch the color of your sphere to yellow, and then it will start uploading your local Azure Spatial Anchor into the cloud. Once the upload finishes, the code will return an anchor identifier.

[!code-java[MainActivity](../../../includes/spatial-anchors-new-android-app-finished.md?name=uploadCloudAnchorAsync)]

Finally, let's hook everything together. In your `handleTap()` method, add the following code. It will invoke your `uploadCloudAnchorAsync()` method as soon as your sphere is created. Once the method returns, the code below will perform one final update to your sphere, changing its color to blue.

[!code-java[MainActivity](../../../includes/spatial-anchors-new-android-app-finished.md?range=150-158,170-199&highlight=24-37)]

[Redeploy](#trying-it-out) your app once more. Move around your device, tap the screen, and place your sphere. This time, though, your sphere will change its color from black towards white, as camera frames are collected. Once we have enough frames, the sphere will turn into yellow, and the cloud upload will start. Once the upload finishes, your sphere will turn blue. Optionally, you could also use the `Logcat` window inside Android Studio to monitor the log messages your app is sending. For example, the session progress during frame captures, and the anchor identifier that the cloud returns once the upload is completed.

## Locate your cloud spatial anchor

One your anchor is uploaded to the cloud, we're ready to attempt locating it again. First, let's add the following imports into your code.

[!code-java[MainActivity](../../../includes/spatial-anchors-new-android-app-finished.md?range=45-48&highlight=3-4)]

Then, let's add the following code into your `handleTap()` method. This code will:

- Remove our existing blue sphere from the screen.
- Initialize our Azure Spatial Anchors session again. This action will ensure that the anchor we're going to locate comes from the cloud instead of the local anchor we created.
- Issue a query for the anchor we uploaded to the cloud.

[!code-java[MainActivity](../../../includes/spatial-anchors-new-android-app-finished.md?name=handleTap&highlight=10-19)]

Now, let's hook the code that will be invoked when the anchor we're querying for is located. Inside your `initializeSession()` method, add the following code. This snippet will create & place a green sphere once the cloud spatial anchor is located. It will also enable screen tapping again, so you can repeat the whole scenario once more: create another local anchor, upload it, and locate it again.

[!code-java[MainActivity](../../../includes/spatial-anchors-new-android-app-finished.md?name=initializeSession&highlight=34-53)]

That's it! [Redeploy](#trying-it-out) your app one last time to try out the whole scenario end to end. Move around your device, and place your black sphere. Then, keep moving your device to capture camera frames until the sphere turns yellow. Your local anchor will be uploaded, and your sphere will turn blue. Finally, tap your screen once more, so that your local anchor is removed, and then we'll query for its cloud counterpart. Continue moving your device around until your cloud spatial anchor is located. A green sphere should appear in the correct location, and you can rinse & repeat the whole scenario again.

[!INCLUDE [Share Anchors Sample Prerequisites](../../../includes/spatial-anchors-new-android-app-finished.md)]
