---
author: IEvangelist
ms.service: cognitive-services
ms.topic: include
ms.date: 03/26/2020
ms.author: dapine
---

The Android Speech SDK is available natively, or with the Xamarin.Android and the .NET Standard SDK.

# [Android Studio](#tab/android-studio)

<div class="icon is-large">
    <img alt="Android" src="https://docs.microsoft.com/media/logos/logo_android.svg">
</div>

The Java SDK for Android is packaged as an [AAR (Android Library)](https://developer.android.com/studio/projects/android-library), which includes the necessary libraries and required Android permissions. It's hosted in a Maven repository at `https://csspeechstorage.blob.core.windows.net/maven/` as package `com.microsoft.cognitiveservices.speech:client-sdk:1.7.0`.

To consume the package from your Android Studio project, make the following changes:

* In the project-level build.gradle file, add the following to the `repository` section:

  ```gradle
  maven { url 'https://csspeechstorage.blob.core.windows.net/maven/' }
  ```

* In the module-level build.gradle file, add the following to the `dependencies` section:

  ```gradle
  implementation 'com.microsoft.cognitiveservices.speech:client-sdk:1.10.0'
  ```

The Java SDK is also part of the [Speech Devices SDK](../speech-devices-sdk.md).

# [Xamarin.Android](#tab/xamarin)

<div class="icon is-large">
    <img alt="Xamarin" src="https://docs.microsoft.com/media/logos/logo_xamarin.svg">
</div>

Xamarin.Android

---
