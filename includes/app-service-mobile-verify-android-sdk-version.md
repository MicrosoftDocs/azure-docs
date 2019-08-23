---
author: conceptdev
ms.service: app-service-mobile
ms.topic: include
ms.date: 08/23/2018
ms.author: crdun
---
Because of ongoing development, the Android SDK version installed in Android Studio might not match the version in the code. The Android SDK referenced in this tutorial is version 26, the latest at the time of writing. The version number may increase as new releases of the SDK appear, and we recommend using the latest version available.

Two symptoms of version mismatch are:

- When you build or rebuild the project, you may get Gradle error messages like `Gradle sync failed: Failed to find target with hash string 'android-XX'`.
- Standard Android objects in code that should resolve based on `import` statements may be generating error messages.

If either of these appears, the version of the Android SDK installed in Android Studio might not match the SDK target of the downloaded project. To verify the version, make the following changes:

1. In Android Studio, click **Tools** > **Android** > **SDK Manager**. If you have not installed the latest version of the SDK Platform, then click to install it. Make a note of the version number.

2. On the **Project Explorer** tab, under **Gradle Scripts**, open the file **build.gradle (Module: app)**. Ensure that the **compileSdkVersion** and **targetSdkVersion** are set to the latest SDK version installed. The `build.gradle` might look like this:

    ```gradle
    android {
        compileSdkVersion 26
        defaultConfig {
            targetSdkVersion 26
        }
    }
    ```
