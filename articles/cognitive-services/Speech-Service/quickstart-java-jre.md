---
title: 'Quickstart: Recognize speech in Java (Windows or Linux)'
titleSuffix: "Microsoft Cognitive Services"
description: Learn how to recognize speech in Java (Windows or Linux)
services: cognitive-services
author: fmegen

ms.service: cognitive-services
ms.technology: Speech
ms.topic: quickstart
ms.date: 08/28/2018
ms.author: fmegen
---

# Quickstart: Recognize speech in Java on Windows or Linux using the Speech SDK

[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

In this article, you create a Java console application using the [Speech SDK](speech-sdk.md) to transcribe speech to text in real time from your PC's microphone. The application is built with the Speech SDK Maven package and the Eclipse Java IDE (v4.8) on 64-bit Windows or Ubuntu Linux 16.04. It runs on a 64-bit Java 8 runtime environment (JRE).

> [!NOTE]
> For the Speech Devices SDK and the Roobo device, see [Speech Devices SDK](speech-devices-sdk.md).

## Prerequisites

You need a Speech service subscription key to complete this Quickstart. You can get one for free. See [Try the speech service for free](get-started.md) for details.


## Create and configure project

If you are using Ubuntu 16.04, before starting Eclipse, run the following commands ta make sure that required packages are installed.

  ```sh
  sudo apt-get update
  sudo apt-get install build-essential libssl1.0.0 libcurl3 libasound2 wget
  ```

1. Start Eclipse.

1. In the Eclipse Launcher, enter the name of a new workspace directory into the **Workspace** field. Then click **Launch**.

   ![Create Eclipse workspace](media/sdk/qs-java-jre-01-create-new-eclipse-workspace.png)

1. In a moment, the main window of the Eclipse IDE appears. Close the Welcome screen if one is present.

1. Create a new project by choosing **File** \> **New** \> **Project** from the Eclipse menu bar.

1. The **New Project** dialog appears. In this window, select **Java Project**, and click **Next**.

   ![Select a wizard](media/sdk/qs-java-jre-02-select-wizard.png)

1. The New Java Project wizard starts. Enter **quickstart** as a project name and choose **JavaSE-1.8** as the execution environment. Click **Finish**.

   ![New Java Project wizard](media/sdk/qs-java-jre-03-create-java-project.png)

1. If the **Open Associated Perspective?** window appears, click **Open Perspective**.

1. In the **Package explorer**, right-click the **quickstart** project and choose **Configure** \> **Convert to Maven Project** from the context menu.

   ![Convert to Maven project](media/sdk/qs-java-jre-04-convert-to-maven-project.png)

1. The **Create New Maven POM** window appears. Enter **com.microsoft.cognitiveservices.speech.samples** as **Group Id** and **quickstart** as **Artifact Id**. Then click **Finish**.

   ![Configure Maven POM](media/sdk/qs-java-jre-05-configure-maven-pom.png)

1. Open the **pom.xml** file and edit it.

  * At the end of the file, before the closing tag `</project>`, create a repositories section with a reference to the Maven repository for the Speech SDK, as shown here.

    [!code-xml[POM Repositories](~/samples-cognitive-services-speech-sdk/quickstart/java-jre/pom.xml#repositories)]

  * Also, add a dependencies section with the Speech SDK version 0.6.0.

    [!code-xml[POM Dependencies](~/samples-cognitive-services-speech-sdk/quickstart/java-jre/pom.xml#dependencies)]

  * Save the changes.

## Add sample code

1. Select **File** \> **New** \> **Class** to add a new empty class to your Java project.

1. In the window **New Java Class** enter **speechsdk.quickstart** into the **Package** field, and **Main** into the **Name** field.

   ![Creating a Main class](media/sdk/qs-java-jre-06-create-main-java.png)

1. Replace all code in `Main.java` with the following snippet:

   [!code-java[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/java-jre/src/speechsdk/quickstart/Main.java#code)]

1. Replace the string `YourSubscriptionKey` with your subscription key.

1. Replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. Save changes to the project.

## Build and run the app

Press F11, or select **Run** \> **Debug**.
The next 15 seconds of speech input from your microphone will be recognized and logged in the console window.

![Console output after successful recognition](media/sdk/qs-java-jre-07-console-output.png)

[!INCLUDE [Download this sample](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]
Look for this sample in the `quickstart/java-jre` folder.

## Next steps

> [!div class="nextstepaction"]
> [Recognize intents from speech by using the Speech SDK for C#](how-to-recognize-intents-from-speech-csharp.md)

## See also

- [Translate speech](how-to-translate-speech-csharp.md)
- [Customize acoustic models](how-to-customize-acoustic-models.md)
- [Customize language models](how-to-customize-language-model.md)
