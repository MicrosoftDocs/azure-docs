---
title: "Quickstart: Speech SDK for Java (Windows, Linux, macOS) platform setup - Speech service"
titleSuffix: Azure AI services
description: Use this guide to set up your platform for using Java (Windows, Linux, macOS) with the Speech SDK.
services: cognitive-services
author: markamos
manager: nitinme
ms.service: azure-ai-speech
ms.topic: include
ms.date: 09/05/2023
ms.custom: devx-track-java
ms.author: eur
---

This guide shows how to install the [Speech SDK](~/articles/ai-services/speech-service/speech-sdk.md) for Java on the Java Runtime.

### Supported operating systems

The Speech SDK for Java package is available for these operating systems:

- Windows: 64-bit only.
- Mac: macOS X version 10.14 or later.
- Linux: See the [supported Linux distributions and target architectures](~/articles/ai-services/speech-service/speech-sdk.md).

# [Maven](#tab/maven)

Follow these steps to install the Speech SDK for Java using Apache Maven:

1. Install [Apache Maven](https://maven.apache.org/install.html).
1. Open a command prompt where you want the new project, and create a new *pom.xml* file.
1. Copy the following XML content into *pom.xml*:

   ```xml
   <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
       <modelVersion>4.0.0</modelVersion>
       <groupId>com.microsoft.cognitiveservices.speech.samples</groupId>
       <artifactId>quickstart-eclipse</artifactId>
       <version>1.0.0-SNAPSHOT</version>
       <build>
           <sourceDirectory>src</sourceDirectory>
           <plugins>
           <plugin>
               <artifactId>maven-compiler-plugin</artifactId>
               <version>3.7.0</version>
               <configuration>
               <source>1.8</source>
               <target>1.8</target>
               </configuration>
           </plugin>
           </plugins>
       </build>
       <dependencies>
           <dependency>
           <groupId>com.microsoft.cognitiveservices.speech</groupId>
           <artifactId>client-sdk</artifactId>
           <version>1.32.1</version>
           </dependency>
       </dependencies>
   </project>
   ```

1. Run the following Maven command to install the Speech SDK and dependencies.

   ```console
   mvn clean dependency:copy-dependencies
   ```

# [Eclipse](#tab/eclipse)

### Create an Eclipse project and install the Speech SDK

1. Install the [Eclipse Java IDE](https://www.eclipse.org/downloads/). This IDE requires Java to already be installed.

1. Start Eclipse.

1. In Eclipse Launcher, in the **Workspace** box, enter the name of a new workspace directory. Then select **Launch**.

   :::image type="content" source="~/articles/ai-services/speech-service/media/sdk/qs-java-jre-01-create-new-eclipse-workspace.png" alt-text="Screenshot of Eclipse Launcher.":::

1. In a moment, the main window of the Eclipse IDE appears. Close the **Welcome** screen if one is present.

1. From the Eclipse menu, create a new project by selecting **File** > **New** > **Project**.

1. The **New Project** dialog box appears. Select **Java Project**, and then select **Next**.

   :::image type="content" source="~/articles/ai-services/speech-service/media/sdk/qs-java-jre-02-select-wizard.png" alt-text="Screenshot of the New Project dialog box, with Java Project highlighted.":::

1. The **New Java Project** wizard starts. In the **Project name** field, enter *quickstart*. Choose **JavaSE-1.8** as the execution environment. Select **Finish**.

   :::image type="content" source="~/articles/ai-services/speech-service/media/sdk/qs-java-jre-03-create-java-project.png" alt-text="Screenshot of the New Java Project wizard, with selections for creating a Java project.":::

1. If the **Open Associated Perspective?** window appears, select **Open Perspective**.

1. In **Package Explorer**, right-click the **quickstart** project. Select **Configure** > **Convert to Maven Project** from the context menu.

   :::image type="content" source="~/articles/ai-services/speech-service/media/sdk/qs-java-jre-04-convert-to-maven-project.png" alt-text="Screenshot of Package Explorer and the commands for converting to a Maven project.":::

1. The **Create new POM** window appears. In the **Group Id** field, enter *com.microsoft.cognitiveservices.speech.samples*. In the **Artifact Id** field, enter *quickstart*. Then select **Finish**.

   :::image type="content" source="~/articles/ai-services/speech-service/media/sdk/qs-java-jre-05-configure-maven-pom.png" alt-text="Screenshot of the window for creating a new POM.":::

1. Open the *pom.xml* file and edit it:

   1. Add a `dependencies` element at the end of the file, before the closing tag `</project>`, with the Speech SDK as a dependency:

   ```xml
   <dependencies>
     <dependency>
       <groupId>com.microsoft.cognitiveservices.speech</groupId>
       <artifactId>client-sdk</artifactId>
       <version>1.32.1</version>
     </dependency>
   </dependencies>
   ```

   1. Save the changes.

# [Gradle](#tab/gradle)

### Gradle configurations

Gradle configurations require an explicit reference to the *.jar* dependency extension:

```gradle
// build.gradle

dependencies {
    implementation group: 'com.microsoft.cognitiveservices.speech', name: 'client-sdk', version: "1.32.1", ext: "jar"
}
```

---
