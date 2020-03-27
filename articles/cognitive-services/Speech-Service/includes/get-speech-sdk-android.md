---
author: IEvangelist
ms.service: cognitive-services
ms.topic: include
ms.date: 03/26/2020
ms.author: dapine
---

When developing for Android, there are two Speech SDKs available. The Java Speech SDK is available natively as an Android package, or the .NET Speech SDK could be used with Xamarin.Android.

# [Android Studio](#tab/android-studio)

:::row:::
    :::column span="3":::
        The Java SDK for Android is packaged as an <a href="https://developer.android.com/studio/projects/android-library" target="_blank">AAR (Android Library) <span class="docon docon-navigate-external x-hidden-focus"></span></a>, which includes the necessary libraries and required Android permissions. It's hosted in a Maven repository at `https://csspeechstorage.blob.core.windows.net/maven/` as package `com.microsoft.cognitiveservices.speech:client-sdk:1.7.0`.
    :::column-end:::
    :::column:::
        <br>
        <div class="icon is-large">
            <img alt="Android" src="https://docs.microsoft.com/media/logos/logo_android.svg"  width="60px">
        </div>
    :::column-end:::
:::row-end:::

To consume the package from your Android Studio project, make the following changes:

* In the project-level *build.gradle* file, add the following to the `repository` section:

  ```gradle
  maven { url 'https://csspeechstorage.blob.core.windows.net/maven/' }
  ```

* In the module-level *build.gradle* file, add the following to the `dependencies` section:

  ```gradle
  implementation 'com.microsoft.cognitiveservices.speech:client-sdk:1.10.0'
  ```

The Java SDK is also part of the [Speech Devices SDK](../speech-devices-sdk.md).

# [Xamarin.Android](#tab/android-xamarin)

:::row:::
    :::column span="3":::
        For more information, see <a href="https://docs.microsoft.com/xamarin/android/" target="_blank">Xamarin.Android <span class="docon docon-navigate-external x-hidden-focus"></span></a>
    :::column-end:::
    :::column:::
        <div class="icon is-large">
            <img alt="Xcode" src="https://docs.microsoft.com/media/logos/logo_xamarin.svg">
            &nbsp; ❤️ &nbsp;
            <img alt="Xcode" src="https://docs.microsoft.com/media/logos/logo_android.svg">
        </div>
    :::column-end:::
:::row-end:::

[!INCLUDE [get-speech-sdk-dotnet](get-speech-sdk-dotnet.md)]

---
