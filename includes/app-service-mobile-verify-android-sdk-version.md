Because of ongoing development, the Android SDK version installed in Android Studio might not match the version in the code. The Android SDK referenced in this tutorial is version 23, the latest at the time of writing. The version number may increase as new releases of the SDK appear, and we recommend using the latest version available.

Two symptoms of version mismatch are:

- When you build or rebuild the project, you may get Gradle error messages like "**failed to find target Google Inc.:Google APIs:n**".
- Standard Android objects in code that should resolve based on `import` statements may be generating error messages.

If either of these appears, the version of the Android SDK installed in Android Studio might not match the SDK target of the downloaded project. To verify the version, make the following changes:

1. In Android Studio, click **Tools** > **Android** > **SDK Manager**. If you have not installed the latest version of the SDK Platform, then click to install it. Make a note of the version number.
2. On the **Project Explorer** tab, under **Gradle Scripts**, open the file **build.gradle (modeule: app)**. Ensure that the **compileSdkVersion** and **buildToolsVersion** are set to the latest SDK version installed. The tags might look like this:

             compileSdkVersion 'Google Inc.:Google APIs:23'
            buildToolsVersion "23.0.2"
3. In the Android Studio Project Explorer, right-click the project node, choose **Properties**, and in the left column choose **Android**. Ensure that the **Project Build Target** is set to the same SDK version as the **targetSdkVersion**.

In Android Studio, the manifest file is no longer used to specify the target SDK and minimum SDK version, unlike the case with Eclipse.
