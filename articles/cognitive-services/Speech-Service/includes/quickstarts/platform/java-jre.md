---
title: "Quickstart: Speech SDK for Java (Windows, Linux, macOS) platform setup - Speech service"
titleSuffix: Azure Cognitive Services
description: Use this guide to set up your platform for using Java (Windows, Linux, macOS) with the Speech SDK.
services: cognitive-services
author: markamos
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: include
ms.date: 10/15/2020
ms.custom: devx-track-java
ms.author: eur
---

This guide shows how to install the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) for Java. If you just want the package name to get started on your own, the Java SDK is not available in the Maven central repository. Whether you're using Gradle or a *pom.xml* dependency file, you need to add a custom repository that points to `https://azureai.azureedge.net/maven/`. (See below for the package name.)

### Supported operating systems

The Java Speech SDK package is available for these operating systems:

- Windows: 64-bit only.
- Mac: macOS X version 10.14 or later.
- Linux: See the list of [supported Linux distributions and target architectures](~/articles/cognitive-services/speech-service/speech-sdk.md).

### Prerequisites

- [Azul Zulu OpenJDK](https://www.azul.com/downloads/?package=jdk). The [Microsoft Build of OpenJDK](https://www.microsoft.com/openjdk) or your preferred JDK should also work. 

- [Eclipse Java IDE](https://www.eclipse.org/downloads/). This IDE requires Java to already be installed.

- [Microsoft Visual C++ Redistributable for Visual Studio 2019](https://support.microsoft.com/topic/the-latest-supported-visual-c-downloads-2647da03-1eea-4433-9aff-95f26a218cc0) for the Windows platform. Installing it for the first time might require a restart.

- For Linux, see the [system requirements and setup instructions](~/articles/cognitive-services/speech-service/speech-sdk.md#platform-requirements).

### Gradle configurations

Gradle configurations require both a custom repository and an explicit reference to the .jar dependency extension:

```groovy
// build.gradle

repositories {
    maven {
        url "https://azureai.azureedge.net/maven/"
    }
}

dependencies {
    implementation group: 'com.microsoft.cognitiveservices.speech', name: 'client-sdk', version: "1.22.0", ext: "jar"
}
```

### Create an Eclipse project and install the Speech SDK

1. Start Eclipse.

1. In Eclipse Launcher, in the **Workspace** box, enter the name of a new workspace directory. Then select **Launch**.

   ![Screenshot of Eclipse Launcher.](~/articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-01-create-new-eclipse-workspace.png)

1. In a moment, the main window of the Eclipse IDE appears. Close the **Welcome** screen if one is present.

1. From the Eclipse menu bar, create a new project by selecting **File** > **New** > **Project**.

1. The **New Project** dialog appears. Select **Java Project**, and then select **Next**.

   ![Screenshot of the New Project dialog, with Java Project highlighted.](~/articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-02-select-wizard.png)

1. The **New Java Project** wizard starts. In the **Project name** field, enter **quickstart**. Choose **JavaSE-1.8** as the execution environment. Select **Finish**.

   ![Screenshot of the New Java Project wizard, with selections for creating a Java project.](~/articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-03-create-java-project.png)

1. If the **Open Associated Perspective?** window appears, select **Open Perspective**.

1. In **Package Explorer**, right-click the **quickstart** project. Select **Configure** > **Convert to Maven Project** from the shortcut menu.

   ![Screenshot of Package Explorer and the commands for converting to a Maven project.](~/articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-04-convert-to-maven-project.png)

1. The **Create new POM** window appears. In the **Group Id** field, enter **com.microsoft.cognitiveservices.speech.samples**. In the **Artifact Id** field, enter **quickstart**. Then select **Finish**.

   ![Screenshot of the window for creating a new POM.](~/articles/cognitive-services/Speech-Service/media/sdk/qs-java-jre-05-configure-maven-pom.png)

1. Open the *pom.xml* file and edit it:

   * At the end of the file, before the closing tag `</project>`, create a `repositories` element with a reference to the Maven repository for the Speech SDK:

     [!code-xml[POM Repositories](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/from-microphone/pom.xml#repositories)]

   * Add a `dependencies` element, with Speech SDK version 1.21.0 as a dependency:

     [!code-xml[POM Dependencies](~/samples-cognitive-services-speech-sdk/quickstart/java/jre/from-microphone/pom.xml#dependencies)]

   * Save the changes.
