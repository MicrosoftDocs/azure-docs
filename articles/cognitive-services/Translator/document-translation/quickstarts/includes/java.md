---
title: "Quickstart: Document Translation Java"
description: 'Document translation processing using the REST API and Java programming language'
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: include
ms.date: 12/08/2022
ms.author: lajanuar
recommendations: false
---

For this quickstart, we'll use the Gradle build automation tool to create and run the application.

## Set up your Java environment

* You should have the latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. _See_ [Java in Visual Studio Code](https://code.visualstudio.com/docs/languages/java).

  >[!TIP]
  >
  > * Visual Studio Code offers a **Coding Pack for Java** for Windows and macOS.The coding pack is a bundle of VS Code, the Java Development Kit (JDK), and a collection of suggested extensions by Microsoft. The Coding Pack can also be used to fix an existing development environment.
  > * If you are using VS Code and the Coding Pack For Java, install the [**Gradle for Java**](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-gradle) extension.

* If you aren't using VS Code, make sure you have the following installed in your development environment:

  * A [**Java Development Kit** (OpenJDK)](/java/openjdk/download#openjdk-17) version 8 or later.

  * [**Gradle**](https://docs.gradle.org/current/userguide/installation.html), version 6.8 or later.

## Create a new Gradle project

1. In console window (such as cmd, PowerShell, or Bash), create a new directory for your app called **document-translation**, and navigate to it.

    ```console
    mkdir document-translation && document-translation
    ```

   ```powershell
    mkdir document-translation; cd document-translation
   ```

1. Run the `gradle init` command from the document-translation directory. This command will create essential build files for Gradle, including _build.gradle.kts_, which is used at runtime to create and configure your application.

    ```console
    gradle init --type basic
    ```

1. When prompted to choose a **DSL**, select **Kotlin**.

1. Accept the default project name (document-translation) by selecting **Return** or **Enter**.

> [!NOTE]
> It may take a few minutes for the entire application to be created, but soon you should see several folders and files including `build-gradle.kts`.

1. Update `build.gradle.kts` with the following code:

  ```kotlin
  plugins {
    java
    application
  }
  application {
    mainClass.set("DocumentTranslation")
  }
  repositories {
    mavenCentral()
  }
  dependencies {
    implementation("com.squareup.okhttp3:okhttp:4.10.0")
    implementation("com.google.code.gson:gson:2.9.0")
  }
  ```

## Create your Java Application

1. From the document-translation directory, run the following command:

    ```console
    mkdir -p src/main/java
    ```

   You'll create the following directory structure:

    :::image type="content" source="../../media/java-directories.png" alt-text="Screenshot: Java directory structure.":::

1. Navigate to the `java` directory and create a file named **`DocumentTranslation.java`**.

    > [!TIP]
    >
    > * You can create a new file using PowerShell.
    > * Open a PowerShell window in your project directory by holding down the Shift key and right-clicking the folder.
    > * Type the following command **New-Item DocumentTranslation.java**.
    >
    > * You can also create a new file in your IDE named `DocumentTranslation.java`  and save it to the `java` directory.

1. Open the `DocumentTranslation.java` file in your IDE and copy then paste the following code sample into your application. **Make sure you update the key with one of the key values from your Azure portal Translator instance:**

## Build and run your Java application

Once you've added a code sample to your application, navigate back to your main project directory—**document-translation**, open a console window, and enter the following commands:

1. Build your application with the `build` command:

    ```console
    gradle build
    ```

1. Run your application with the `run` command:

    ```console
    gradle run
    ```
