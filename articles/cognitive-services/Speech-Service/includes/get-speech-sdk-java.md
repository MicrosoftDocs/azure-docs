---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 03/27/2020
ms.author: trbye
---

:::row:::
    :::column span="3":::
        The Java SDK for Android is packaged as an <a href="https://developer.android.com/studio/projects/android-library" target="_blank">AAR (Android Library) <span class="docon docon-navigate-external x-hidden-focus"></span></a>, which includes the necessary libraries and required Android permissions. It's hosted in a Maven repository at `https://csspeechstorage.blob.core.windows.net/maven/` as package `com.microsoft.cognitiveservices.speech:client-sdk:1.12.1`.
    :::column-end:::
    :::column:::
        <br>
        <div class="icon is-large">
            <img alt="Java" src="https://docs.microsoft.com/media/logos/logo_java.svg" width="60px">
        </div>
    :::column-end:::
:::row-end:::

To consume the package from your Android Studio project, make the following changes:

1. In the project-level *build.gradle* file, add the following to the `repository` section:
  ```gradle
  maven { url 'https://csspeechstorage.blob.core.windows.net/maven/' }
  ```

2. In the module-level *build.gradle* file, add the following to the `dependencies` section:
  ```gradle
  implementation 'com.microsoft.cognitiveservices.speech:client-sdk:1.12.1'
  ```

The Java SDK is also part of the [Speech Devices SDK](../speech-devices-sdk.md).

#### Additional resources

- <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/java/android" target="_blank">Android specific Java quickstart source code <span class="docon docon-navigate-external x-hidden-focus"></span></a>
- <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/java/jre" target="_blank">Java Runtime (JRE) quickstart source code <span class="docon docon-navigate-external x-hidden-focus"></span></a>