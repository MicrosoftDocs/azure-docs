---
title: "Quickstart: Translator Text Java SDK"
description: 'Text translation processing using the Java programming language'
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: include
ms.date: 07/18/2023
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD036 -->

## Set up your Java environment

> [!NOTE]
>
> The Azure Text Translation SDK for Java is tested and supported on Windows, Linux, and macOS platforms. It is not tested on other platforms and doesn't support Android deployments.

For this quickstart, we use the Gradle build automation tool to create and run the application.

* You should have the latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. _See_ [Java in Visual Studio Code](https://code.visualstudio.com/docs/languages/java).

  > [!TIP]
  >
  > * Visual Studio Code offers a **Coding Pack for Java** for Windows and macOS.The coding pack is a bundle of VS Code, the Java Development Kit (JDK), and a collection of suggested extensions by Microsoft. The Coding Pack can also be used to fix an existing development environment.
  > * If you are using VS Code and the Coding Pack For Java, install the [**Gradle for Java**](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-gradle) extension.

* If you aren't using Visual Studio Code, make sure you have the following installed in your development environment:

  * A [**Java Development Kit** (OpenJDK)](/java/openjdk/download#openjdk-17) version 8 or later.

  * [**Gradle**](https://docs.gradle.org/current/userguide/installation.html), version 6.8 or later.

## Create a new Gradle project

1. In console window (such as cmd, PowerShell, or Bash), create a new directory for your app called **text-translation-app**, and navigate to it.

    ```console
    mkdir text-translation-app && text-translation-app
    ```

   ```powershell
   mkdir text-translation-app; cd text-translation-app
   ```

1. Run the `gradle init` command from the text-translation-app directory. This command creates essential build files for Gradle, including _build.gradle.kts_, which is used at runtime to create and configure your application.

    ```console
    gradle init --type basic
    ```

1. When prompted to choose a **DSL**, select **Kotlin**.

1. Accept the default project name (text-translation-app) by selecting **Return** or **Enter**.

    > [!NOTE]
    > It may take a few minutes for the entire application to be created, but soon you should see several folders and files including `build-gradle.kts`.

1. Update `build.gradle.kts` with the following code. The main class is **Translate**:

   ```kotlin
     plugins {
     java
     application
   }
   application {
     mainClass.set("Translate")
   }
   repositories {
     mavenCentral()
   }
   dependencies {
     implementation("com.azure:azure-ai-translation-text:1.0.0-beta.1")
   }
   ```

## Create your Java application

1. From the text-translation-app directory, run the following command:

    ```console
    mkdir -p src/main/java
    ```

   The command creates the following directory structure:

    :::image type="content" source="../../media/quickstarts/java-directories.png" alt-text="Screenshot: Java directory structure.":::

1. Navigate to the `java` directory and create a file named **`Translate.java`**.

    > [!TIP]
    >
    > * You can create a new file using PowerShell.
    > * Open a PowerShell window in your project directory by holding down the Shift key and right-clicking the folder.
    > * Enter the following command **New-Item Translate.java**.
    >
    > * You can also create a new file in your IDE named `Translate.java` and save it to the `java` directory.

1. Copy and paste the following text translation code sample into your **Translate.java** file.

    * Update **`"<your-key>"`**, **`"<your-endpoint>"`** and  **`"<region>"`** with values from your Azure portal Translator instance.

## Code sample

**Translate text**

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). For more information, _see_ Azure AI services [security](../../../../ai-services/security-features.md).

To interact with the Translator service using the client library, you need to create an instance of the `TextTranslationClient`class. To do so, create an `AzureKeyCredential` with your `key` from the Azure portal and a `TextTranslationClient` instance with the `AzureKeyCredential`. The authentication varies slightly depending on whether your resource uses the regional or global endpoint. For this project, authenticate using the global endpoint. For more information about using a regional endpoint, _see_ [Translator text sdks](../../text-sdk-overview.md#3-authenticate-the-client).

  > [!NOTE]
  > In this example we are using the global endpoint. If you're using a regional endpoint, see [Create a Text Translation client](../../create-translator-resource.md#create-a-text-translation-client).

```java
import java.util.List;
import java.util.ArrayList;
import com.azure.ai.translation.text.models.*;
import com.azure.ai.translation.text.TextTranslationClientBuilder;
import com.azure.ai.translation.text.TextTranslationClient;

import com.azure.core.credential.AzureKeyCredential;
/**
 * Translate text from known source language to target language.
 */
public class Translate {

    public static void main(String[] args) {
        String apiKey = "<your-key>";
        AzureKeyCredential credential = new AzureKeyCredential(apiKey);

        TextTranslationClient client = new TextTranslationClientBuilder()
                .credential(credential)
                .buildClient();

        String from = "en";
        List<String> targetLanguages = new ArrayList<>();
        targetLanguages.add("es");
        List<InputTextItem> content = new ArrayList<>();
        content.add(new InputTextItem("This is a test."));

        List<TranslatedTextItem> translations = client.translate(targetLanguages, content, null, from, TextType.PLAIN, null, null, null, false, false, null, null, null, false);

        for (TranslatedTextItem translation : translations) {
            for (Translation textTranslation : translation.getTranslations()) {
                System.out.println("Text was translated to: '" + textTranslation.getTo() + "' and the result is: '" + textTranslation.getText() + "'.");
            }
        }
    }
}
```

## Build and run the application**

Once you've added the code sample to your application, navigate back to your main project directory—**text-translation-app**.

1. Build your application with the `build` command (you should receive a **BUILD SUCCESSFUL** message):

    ```console
    gradle build
    ```

1. Run your application with the `run` command (you should receive a **BUILD SUCCESSFUL** message):

    ```console
    gradle run
    ```

Here's a snippet of the expected output:

:::image type="content" source="../../media/quickstarts/java-output.png" alt-text="Screenshot of the Java output in the terminal window. ":::
