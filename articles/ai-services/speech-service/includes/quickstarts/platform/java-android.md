---
title: Install the Speech SDK by using Android Studio
titleSuffix: Azure AI services
description: Use this guide to install the Speech SDK for Java in Android Studio.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: include
ms.date: 09/05/2023
ms.custom: devx-track-java
ms.author: eur
---

This guide shows how to install the [Speech SDK](../../../speech-sdk.md) for Java on Android.

The Speech SDK for Android is packaged as an [Android Archive (AAR) file](https://developer.android.com/studio/projects/android-library), which includes the necessary libraries and required Android permissions.

### Install the Speech SDK by using Android Studio

Create a new project in Android Studio and add the Speech SDK for Java as a library dependency. The setup is based on the Speech SDK Maven Package and Android Studio Chipmunk 2021.2.1.

#### Create an empty project

1. Open Android Studio, and select **New project**.

   :::image type="content" source="../../../media/sdk/android-studio/new-project-1.png" alt-text="Screenshot showing options to open or create new projects.":::

1. In the **New project** window that appears, select **Phone and Tablet** > **Empty Activity**, and then select **Next**.

   :::image type="content" source="../../../media/sdk/android-studio/new-project-2.png" alt-text="Screenshot showing project types that you can select.":::

1. Enter **SpeechQuickstart** in the **Name** text box.

   :::image type="content" source="../../../media/sdk/android-studio/new-project-3.png" alt-text="Screenshot showing project properties that you must set.":::

1. Enter *samples.speech.cognitiveservices.microsoft.com* in the **Package name** text box.
1. Select a project directory in the **Save location** selection box.
1. Select **Java** in the **Language** selection box.
1. Select **API 23: Android 6.0 (Marshmallow)** in the **Minimum API level** selection box.
1. Select **Finish**.

Android Studio takes some time to prepare your new project. For your first time using Android Studio, it might take a few minutes to set preferences, accept licenses, and complete the wizard.

#### Install the Speech SDK for Java on Android

Add the Speech SDK as a dependency in your project.

1. Select **File** > **Project structure** > **Dependencies** > **app**.
1. Select the plus symbol (**+**) to add a dependency under **Declared Dependencies**. Then select **Library dependency** from the dropdown menu.

   :::image type="content" source="../../../media/sdk/android-studio/sdk-install-3-zoom.png" alt-text="Screenshot that shows how to add a library dependency in Android Studio." lightbox="../../../media/sdk/android-studio/sdk-install-3.png":::

1. In the **Add Library Dependency** window that appears, enter the name and version of the Speech SDK for Java: *com.microsoft.cognitiveservices.speech:client-sdk:1.32.1*. Then select **Search**.
1. Make sure that the selected **Group ID** is **com.microsoft.cognitiveservices.speech**, and then select **OK**.
1. Select **OK** to close the **Project Structure** window and apply your changes to the project.
