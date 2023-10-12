---
title: "Quickstart: Document Translation Java"
description: 'Document Translation processing using the REST API and Java programming language'
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: include
ms.date: 07/18/2023
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD051 -->

## Set up your Java environment

For this quickstart, we use the Gradle build automation tool to create and run the application.

* You should have the latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. _See_ [Java in Visual Studio Code](https://code.visualstudio.com/docs/languages/java).

  > [!TIP]
  >
  > * Visual Studio Code offers a **Coding Pack for Java** for Windows and macOS.The coding pack is a bundle of VS Code, the Java Development Kit (JDK), and a collection of suggested extensions by Microsoft. The Coding Pack can also be used to fix an existing development environment.
  > * If you are using VS Code and the Coding Pack For Java, install the [**Gradle for Java**](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-gradle) extension.

* If you aren't using Visual Studio Code, make sure you have the following installed in your development environment:

  * A [**Java Development Kit** (OpenJDK)](/java/openjdk/download#openjdk-17) version 8 or later.

  * [**Gradle**](https://docs.gradle.org/current/userguide/installation.html), version 6.8 or later.

<!-- > [!div class="nextstepaction"]
> [I ran into an issue setting up my environment.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=Language&Product=Document-translation&Page=quickstart&Section=Translate-documents) -->

## Create a new Gradle project

1. In console window (such as cmd, PowerShell, or Bash), create a new directory for your app called **document-translation**, and navigate to it.

    ```console
    mkdir document-translation && document-translation
    ```

   ```powershell
   mkdir document-translation; cd document-translation
   ```

1. Run the `gradle init` command from the document-translation directory. This command creates essential build files for Gradle, including _build.gradle.kts_, which is used at runtime to create and configure your application.

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

<!-- > [!div class="nextstepaction"]
> [I ran into creating a Gradle project.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=Language&Product=Document-translation&Page=quickstart&Section=Create-gradle-project) -->

## Translate all documents in a storage container

1. From the document-translation directory, run the following command:

    ```console
    mkdir -p src/main/java
    ```

   The command creates the following directory structure:

    :::image type="content" source="../../../media/java-directories.png" alt-text="Screenshot: Java directory structure.":::

1. Navigate to the `java` directory and create a file named **`DocumentTranslation.java`**.

    > [!TIP]
    >
    > * You can create a new file using PowerShell.
    > * Open a PowerShell window in your project directory by holding down the Shift key and right-clicking the folder.
    > * Enter the following command **New-Item DocumentTranslation.java**.
    >
    > * You can also create a new file in your IDE named `DocumentTranslation.java`  and save it to the `java` directory.

1. Copy and paste the document translation [code sample](#code-sample) into your **DocumentTranslation.java** file.

    * Update **`{your-document-translation-endpoint}`** and **`{your-key}`** with values from your Azure portal Translator instance.

    * Update the **`{your-source-container-SAS-URL}`** and **`{your-target-container-SAS-URL}`** with values from your Azure portal Storage account containers instance.

## Code sample

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../../key-vault/general/overview.md). For more information, _see_ Azure AI services [security](../../../../../../ai-services/security-features.md).

```java
import java.io.*;
import java.net.*;
import java.util.*;
import okhttp3.*;

public class DocumentTranslation {
    String key = "{your-key}";

    String endpoint = "{your-document-translation-endpoint}/translator/text/batch/v1.1";

    String path = endpoint + "/batches";

    String sourceSASUrl = "{your-source-container-SAS-URL}";

    String targetSASUrl = "{your-target-container-SAS-URL}";

    String jsonInputString = (String.format("{\"inputs\":[{\"source\":{\"sourceUrl\":\"%s\"},\"targets\":[{\"targetUrl\":\"%s\",\"language\":\"fr\"}]}]}", sourceSASUrl, targetSASUrl));

    OkHttpClient client = new OkHttpClient();

    public void post() throws IOException {
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType,  jsonInputString);
        Request request = new Request.Builder()
                .url(path).post(body)
                .addHeader("Ocp-Apim-Subscription-Key", key)
                .addHeader("Content-type", "application/json")
                .build();
        Response response = client.newCall(request).execute();
        System.out.println(response.code());
        System.out.println(response.headers());
    }

  public static void main(String[] args) {
        try {
            DocumentTranslation sampleRequest = new DocumentTranslation();
            sampleRequest.post();
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
```

## Build and run your Java application

* Once you've added a code sample to your application, navigate back to your main project directory, **document-translation**, open a console window, and enter the following commands:

  1. Build your application with the `build` command:

      ```console
      gradle build
      ```

  1. Run your application with the `run` command:

      ```console
      gradle run
      ```

Upon successful completion: 

* The translated documents can be found in your target container.
* The successful POST method returns a `202 Accepted` response code indicating that the service created the batch request.
* The POST request also returns response headers including `Operation-Location` that provides a value used in subsequent GET requests.

> [!div class="nextstepaction"]
> [I successfully translated my document.](#next-steps)  [I ran into an issue.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVA&Pillar=Language&Product=Document-translation&Page=quickstart&Section=Translate-documents)
