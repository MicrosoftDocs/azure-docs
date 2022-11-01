---
title: "How to use the read model with JavaScript programming language"
description: Use the Form Recognizer prebuilt-read model and JavaScript to extract printed (typeface) and handwritten text from documents.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 04/13/2022
ms.author: lajanuar
recommendations: false
---

[SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/javascript/azure-ai-form-recognizer/4.0.0/index.html) | [API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-form-recognizer) | [Samples](https://github.com/witemple-msft/azure-sdk-for-js/tree/7e3196f7e529212a6bc329f5f06b0831bf4cc174/sdk/formrecognizer/ai-form-recognizer/samples/v4) |[Supported REST API versions](../../sdk-overview.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

* The latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. For more information, *see* [Node.js in Visual Studio Code](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial)

* The latest LTS version of [Node.js](https://nodejs.org/about/releases/)

* A Cognitive Services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Form Recognizer resource in the Azure portal to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

    > [!TIP]
    > Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'll  need a single-service resource if you intend to use [Azure Active Directory authentication](../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart:

  :::image type="content" source="../../media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

## Set up

1. Create a new Node.js Express application: In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app named `form-recognizer-app`, and navigate to it.

    ```console
    mkdir form-recognizer-app && cd form-recognizer-app
    ```

1. Run the `npm init` command to initialize the application and scaffold your project.

    ```console
    npm init
    ```

1. Specify your project's attributes using the prompts presented in the terminal.

    * The most important attributes are name, version number, and entry point.
    * We recommend keeping `index.js` for the entry point name. The description, test command, GitHub repository, keywords, author, and license information are optional attributes—they can be skipped for this project.
    * Accept the suggestions in parentheses by selecting **Return** or **Enter**.
    * After you've completed the prompts, a `package.json` file will be created in your form-recognizer-app directory.

1. Install the `ai-form-recognizer` client library and `azure/identity` npm packages:

    ```console
    npm i @azure/ai-form-recognizer @azure/identity
    ```

    * Your app's `package.json` file will be updated with the dependencies.

1. Create a file named `index.js` in the application directory.

    > [!TIP]
    >
    > * You can create a new file using PowerShell.
    > * Open a PowerShell window in your project directory by holding down the Shift key and right-clicking the folder.
    > * Type the following command **New-Item index.js**.

## Read Model

To interact with the Form Recognizer service, you'll need to create an instance of the `DocumentAnalysisClient` class. To do so, you'll create an `AzureKeyCredential` with your `key` from the Azure portal and a `DocumentAnalysisClient` instance with the `AzureKeyCredential` and your Form Recognizer `endpoint`.

> [!div class="checklist"]
>
> * For this example, you'll need a **form document file from a URL**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png) for this quickstart.
> * We've added the file URL value to the `formUrl` variable near the top of the file.
> * To analyze a given file from a URL, you'll use the `beginAnalyzeDocuments` method and pass in `prebuilt-read` as the model Id.

1. Open the `index.js` file in Visual Studio Code or your favorite IDE and copy the following code sample to paste into your application. **Make sure you update the key and endpoint variables with values from your Azure portal Form Recognizer instance**:

```javascript
const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");
 
function* getTextOfSpans(content, spans) {
  for (const span of spans) {
    yield content.slice(span.offset, span.offset + span.length);
  }
}

// set `<your-endpoint>` and `<your-key>` variables with the values from the Azure portal
const endpoint = "<your-endpoint>";
const key = "<your-key>";

// sample document
const formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png"

async function main() {
  // create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
  const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
  const poller = await client.beginAnalyzeDocument("prebuilt-read", formUrlRead);

  const { content, pages, languages, styles } = await poller.pollUntilDone();

  if (pages.length <= 0) {
    console.log("No pages were extracted from the document.");
  } else {
    console.log("Pages:");
    for (const page of pages) {
      console.log("- Page", page.pageNumber, `(unit: ${page.unit})`);
      console.log(`  ${page.width}x${page.height}, angle: ${page.angle}`);
      console.log(`  ${page.lines.length} lines, ${page.words.length} words`);

      if (page.lines.length > 0) {
        console.log("  Lines:");

        for (const line of page.lines) {
          console.log(`  - "${line.content}"`);

          // The words of the line can also be iterated independently. The words are computed based on their
          // corresponding spans.
          for (const word of line.words()) {
            console.log(`    - "${word.content}"`);
          }
        }
      }
    }
  }

  if (languages.length <= 0) {
    console.log("No language spans were extracted from the document.");
  } else {
    console.log("Languages:");
    for (const languageEntry of languages) {
      console.log(
        `- Found language: ${languageEntry.languageCode} (confidence: ${languageEntry.confidence})`
      );
      for (const text of getTextOfSpans(content, languageEntry.spans)) {
        const escapedText = text.replace(/\r?\n/g, "\\n").replace(/"/g, '\\"');
        console.log(`  - "${escapedText}"`);
      }
    }
  }

  if (styles.length <= 0) {
    console.log("No text styles were extracted from the document.");
  } else {
    console.log("Styles:");
    for (const style of styles) {
      console.log(
        `- Handwritten: ${style.isHandwritten ? "yes" : "no"} (confidence=${style.confidence})`
      );

      for (const word of getTextOfSpans(content, style.spans)) {
        console.log(`  - "${word}"`);
      }
    }
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
```

> [!IMPORTANT]
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use secure methods to store and access your credentials. For more information, see* the Cognitive Services [security](../../../../cognitive-services/cognitive-services-security.md).

<!-- markdownlint-disable MD036 -->

1. Once you've added a code sample to your application, navigate to the folder where you have your form recognizer application (form-recognizer-app).

1. Type the following command in your terminal:

    ```console
    node index.js
    ```

### Read Model Output

Here's a snippet of the expected output:

```console
Pages:
- Page 1 (unit: pixel)
  915x1190, angle: 0
  86 lines, 697 words
  Lines:
  - "While healthcare is still in the early stages of its Al journey, we"
    - "While"
    - "healthcare"
    - "is"
.
.
.
Languages:
- Found language: en (confidence: 0.95)
  - "While healthcare is still in the early stages of its Al journey, we\nare seeing pharmaceutical and other life sciences organizations"
  - "As pharmaceutical and other life sciences organizations invest\nin and deploy advanced technologies, they are beginning to see"
  - "are looking to incorporate automation and continuing smart"
.
.
.
No text styles were extracted from the document.
```

To view the entire output, visit the Azure samples repository on GitHub to view the [read model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/FormRecognizer/v3-javascript-sdk-read-output.md)

## Next step
Try the layout model, which can extract selection marks and table structures in addition to what the read model offers.

> [!div class="nextstepaction"]
> [Use the Layout Model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)
