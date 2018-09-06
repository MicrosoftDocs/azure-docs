---
title: 'Quickstart: Recognize speech in Java (Windows or Linux)'
titleSuffix: "Microsoft Cognitive Services"
description: Learn how to recognize speech in Java (Windows or Linux)
services: cognitive-services
author: fmegen

ms.service: cognitive-services
ms.technology: Speech
ms.topic: article
ms.date: 08/16/2018
ms.author: fmegen
---

# Quickstart: Recognize speech in Java (Windows or Linux)

[!INCLUDE [Selector](../../../includes/cognitive-services-speech-service-quickstart-selector.md)]

This document describes how to create a Java-based console application for the Java Run-Time Environment (JRE) that makes use of the Speech SDK.
The application is based on the Microsoft Cognitive Services SDK Maven Package.
We use Eclipse as an Integrated Development Environment (IDE).

## Prerequisites

* A subscription key for the Speech service. See [Try the speech service for free](get-started.md).
* A PC (Windows x64, Ubuntu 16.04 x64) capable to run Eclipse, with a working microphone.
* 64-bit JRE/JDK for Java 8.
* Version 4.8 of [Eclipse](https://www.eclipse.org), 64-bit version.
* On Ubuntu 16.04, run the following commands for the installation of required packages:

  ```sh
  sudo apt-get update
  sudo apt-get install build-essential libssl1.0.0 libcurl3 libasound2 wget
  ```

## Create and configure your project

1. Start Eclipse.

1. In the Eclipse Launcher, enter the name of a new directory into the **Workspace** field.
   Then click **Launch**.

   ![Create Eclipse workspace](media/sdk/qs-java-jre-01-create-new-eclipse-workspace.png)

1. After a while, the main window of the Eclipse IDE shows up.
   If there's a Welcome screen in it, close it.

1. Select **File** \> **New** \> **Project**.

1. In the **New Project** wizard that appears select **Java Project**, and click **Next**.

   ![Select a wizard](media/sdk/qs-java-jre-02-select-wizard.png)

1. In the next window, enter **quickstart** as a project name and choose **JavaSE-1.8** (or up) as execution environment.
   Click **Finish**.

   ![Select a wizard](media/sdk/qs-java-jre-03-create-java-project.png)

1. If a window titled **Open Associated Perspective?** pops up, select **Open Perspective**.

1. In the **Package explorer**, right-click the **quickstart** project, and select **Configure** \> **Convert to Maven Project**.

   ![Convert to Maven project](media/sdk/qs-java-jre-04-convert-to-maven-project.png)

1. In the window that pops up, enter **com.microsoft.cognitiveservices.speech.samples** as **Group Id** and **quickstart** as **Artifact Id**.
   Select **Finish**.

   ![Configure Maven POM](media/sdk/qs-java-jre-05-configure-maven-pom.png)

1. Edit the **pom.xml** file.

  * At the end of the file, before the closing tag `</project>`, create a repositories section with a reference to the Maven repository for the Speech SDK:

    [!code-xml[POM Repositories](~/samples-cognitive-services-speech-sdk/quickstart/java-jre/pom.xml#repositories)]

  * Also, add afterwards a dependencies section with the Speech SDK version 0.6.0 as a dependency:

    [!code-xml[POM Dependencies](~/samples-cognitive-services-speech-sdk/quickstart/java-jre/pom.xml#dependencies)]

  * Save the changes.

## Add the sample code

1. Select **File** \> **New** \> **Class** to add a new empty class to your Java project.

1. In the window **New Java Class** enter **speechsdk.quickstart** into the **Package** field, and **Main** into the **Name** field.

   ![Creating a Main class](media/sdk/qs-java-jre-06-create-main-java.png)

1. Replace all code in `Main.java` with the following snippet:

   [!code-java[Quickstart Code](~/samples-cognitive-services-speech-sdk/quickstart/java-jre/src/speechsdk/quickstart/Main.java#code)]

1. Replace the string `YourSubscriptionKey` with your subscription key.

1. Replace the string `YourServiceRegion` with the [region](regions.md) associated with your subscription (for example, `westus` for the free trial subscription).

1. Save changes to the project.

## Build and run the sample

Press F11, or select **Run** \> **Debug**.
The next 15 seconds of speech input from your microphone will be recognized and logged in the console window.

![Console output after successful recognition](media/sdk/qs-java-jre-07-console-output.png)

[!INCLUDE [Download the sample](../../../includes/cognitive-services-speech-service-speech-sdk-sample-download-h2.md)]
Look for this sample in the `quickstart/java-jre` folder.

## Next steps

* [Get our samples](speech-sdk.md#get-the-samples)
