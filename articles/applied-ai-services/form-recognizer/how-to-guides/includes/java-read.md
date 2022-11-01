---
title: "How to use the read model with Java programming language"
description: Use the Form Recognizer prebuilt-read model and Java to extract printed (typeface) and handwritten text from documents.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 09/09/2022
ms.author: lajanuar
recommendations: false
---

[SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-ai-formrecognizer/4.0.0/index.html) | [API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) | [Package (Maven)](https://oss.sonatype.org/#nexus-search;quick~azure-ai-formrecognizer) | [Samples](https://github.com/Azure/azure-sdk-for-java/blob/azure-ai-formrecognizer_4.0.0/sdk/formrecognizer/azure-ai-formrecognizer/src/samples/README.md)| [Supported REST API versions](../../sdk-overview.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

* The latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. *See* [Java in Visual Studio Code](https://code.visualstudio.com/docs/languages/java).

  >[!TIP]
  >
  > * Visual Studio Code offers a **Coding Pack for Java** for Windows and macOS.The coding pack is a bundle of VS Code, the Java Development Kit (JDK), and a collection of suggested extensions by Microsoft. The Coding Pack can also be used to fix an existing development environment.
  > * If you are using VS Code and the Coding Pack For Java, install the [**Gradle for Java**](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-gradle) extension.

* If you aren't using VS Code, make sure you have the following installed in your development environment:

  * A [**Java Development Kit** (JDK)](https://www.oracle.com/java/technologies/downloads/) version 8 or later.

  * [**Gradle**](https://gradle.org/), version 6.8 or later.

* A Cognitive Services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Form Recognizer resource in the Azure portal to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

    > [!TIP]
    > Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'll  need a single-service resource if you intend to use [Azure Active Directory authentication](../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. Later, you'll paste your key and endpoint into the code below:

  :::image type="content" source="../../media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

## Set up

### Create a new Gradle project

1. In console window (such as cmd, PowerShell, or Bash), create a new directory for your app called **form-recognizer-app**, and navigate to it.

    ```console
    mkdir form-recognizer-app && form-recognizer-app
    ```

1. Run the `gradle init` command from your working directory. This command will create essential build files for Gradle, including *build.gradle.kts*, which is used at runtime to create and configure your application.

    ```console
    gradle init --type basic
    ```

1. When prompted to choose a **DSL**, select **Kotlin**.

1. Accept the default project name (form-recognizer-app)

### Install the client library

This quickstart uses the Gradle dependency manager. You can find the client library and information for other dependency managers on the [Maven Central Repository](https://mvnrepository.com/artifact/com.azure/azure-ai-formrecognizer).

1. Open the project's *build.gradle.kts* file in your IDE. Copay and past the following code to include the client library as an `implementation` statement, along with the required plugins and settings.

    ```kotlin
    plugins {
        java
        application
    }
    application {
        mainClass.set("FormRecognizer")
    }
    repositories {
        mavenCentral()
    }
    dependencies {
        implementation(group = "com.azure", name = "azure-ai-formrecognizer", version = "4.0.0")
    }
    ```

### Create a Java application

To interact with the Form Recognizer service, you'll need to create an instance of the `DocumentAnalysisClient` class. To do so, you'll create an `AzureKeyCredential` with your `key` from the Azure portal and a `DocumentAnalysisClient` instance with the `AzureKeyCredential` and your Form Recognizer `endpoint`.

1. From the form-recognizer-app directory, run the following command:

    ```console
    mkdir -p src/main/java
    ```

    You'll create the following directory structure:

    :::image type="content" source="../../media/quickstarts/java-directories-2.png" alt-text="Screenshot: Java directory structure":::

2. Navigate to the `java` directory and create a file named **`FormRecognizer.java`**.

    > [!TIP]
    >
    > * You can create a new file using PowerShell.
    > * Open a PowerShell window in your project directory by holding down the Shift key and right-clicking the folder.
    > * Type the following command **New-Item FormRecognizer.java**.

## Read Model

> [!div class="checklist"]
>
> * For this example, you'll need a **form document file at a URI**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png) for this quickstart.
> * To analyze a given file at a URI, you'll use the `beginAnalyzeDocumentFromUrl` method and pass `prebuilt-read` as the model Id. The returned value is an `AnalyzeResult` object containing data about the submitted document.
> * We've added the file URI value to the `documentUrl` variable in the main method.

1. Open the `FormRecognizer.java` file and copy the following code sample to paste into your application. **Make sure you update the key and endpoint variables with values from your Azure portal Form Recognizer instance**.

```java
import com.azure.ai.formrecognizer.*;

import com.azure.ai.formrecognizer.documentanalysis.models.*;
import com.azure.ai.formrecognizer.documentanalysis.DocumentAnalysisClient;
import com.azure.ai.formrecognizer.documentanalysis.DocumentAnalysisClientBuilder;

import com.azure.core.credential.AzureKeyCredential;
import com.azure.core.util.polling.SyncPoller;

import java.io.IOException;
import java.util.List;
import java.util.Arrays;
import java.time.LocalDate;
import java.util.Map;
import java.util.stream.Collectors;

public class FormRecognizer {

    // set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal
    private static final String endpoint = "<your-endpoint>";
    private static final String key = "<your-key>";

        public static void main(String[] args) {

        // create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
        DocumentAnalysisClient client = new DocumentAnalysisClientBuilder()
            .credential(new AzureKeyCredential(key))
            .endpoint(endpoint)
            .buildClient();

        // sample document
        String documentUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png";

        String modelId = "prebuilt-read";

            SyncPoller < OperationResult, AnalyzeResult > analyzeLayoutResultPoller =
                client.beginAnalyzeDocumentFromUrl(modelId, documentUrl);

            AnalyzeResult analyzeLayoutResult = analyzeLayoutResultPoller.getFinalResult();

                // pages
                analyzeLayoutResult.getPages().forEach(documentPage -> {
                    System.out.printf("Page has width: %.2f and height: %.2f, measured with unit: %s%n",
                        documentPage.getWidth(),
                        documentPage.getHeight(),
                        documentPage.getUnit());

                // lines
                documentPage.getLines().forEach(documentLine ->
                    System.out.printf("Line %s is within a bounding polygon %s.%n",
                        documentLine.getContent(),
                        documentLine.getBoundingPolygon().toString()));

                // words
                documentPage.getWords().forEach(documentWord ->
                    System.out.printf("Word '%s' has a confidence score of %.2f.%n",
                        documentWord.getContent(),
                        documentWord.getConfidence()));
            });
        }
    }
```

> [!IMPORTANT]
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use secure methods to store and access your credentials. For more information, see* the Cognitive Services [security](../../../../cognitive-services/cognitive-services-security.md).

2. Navigate back to your main project directory—**form-recognizer-app**.
3. Build your application with the `build` command:

    ```console
    gradle build
    ```
4. Run your application with the `run` command:

    ```console
    gradle run
    ```

### Read Model Output

Here's a snippet of the expected output:

```console
Page has width: 915.00 and height: 1190.00, measured with unit: pixel
Line While healthcare is still in the early stages of its Al journey, we is within a bounding box [259.0, 55.0, 816.0, 56.0, 816.0, 79.0, 259.0, 77.0].
Line are seeing pharmaceutical and other life sciences organizations is within a bounding box [258.0, 83.0, 825.0, 83.0, 825.0, 106.0, 258.0, 106.0].
Line making major investments in Al and related technologies." is within a bounding box [259.0, 112.0, 784.0, 112.0, 784.0, 136.0, 259.0, 136.0].
.
.
.
Word 'While' has a confidence score of 1.00.
Word 'healthcare' has a confidence score of 1.00.
Word 'is' has a confidence score of 1.00.
```

To view the entire output,visit the Azure samples repository on GitHub to view the [read model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/java/FormRecognizer/v3-java-sdk-read-output.md).

## Next step
Try the layout model, which can extract selection marks and table structures in addition to what the read model offers.

> [!div class="nextstepaction"]
> [Use the Layout Model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)
