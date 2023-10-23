---
title: "Quickstart: Translator Text JavaScript SDK"
description: 'Text translation processing using the JavaScript programming language'
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

## Set up your Node.js environment

For this quickstart, we use the Node.js JavaScript runtime environment to create and run the application.

1. If you haven't done so already, install the latest version of [Node.js](https://nodejs.org/en/download/). Node Package Manager (npm) is included with the Node.js installation.

    > [!TIP]
    > If you're new to Node.js, try the [Introduction to Node.js](/training/modules/intro-to-nodejs/) Learn module.

1. In a console window (such as cmd, PowerShell, or Bash), create and navigate to a new directory for your app named `text-translation-app`.

    ```console
    mkdir text-translation-app && cd text-translation-app
    ```

   ```powershell
   mkdir text-translation-app; cd text-translation-app
   ```

1. Run the npm init command to initialize the application and scaffold your project.

    ```console
    npm init
    ```

1. Specify your project's attributes by accepting the prompts presented in the terminal.

    * The most important attributes are name, version number, and entry point.
    * We recommend keeping `index.js` for the entry point name. The description, test command, GitHub repository, keywords, author, and license information are optional attributes—they can be skipped for this project.
    * Accept the suggestions in parentheses by selecting **Return** or **Enter**.
    * After you've completed the prompts, a `package.json` file will be created in your text-translation-app directory.

## Install the client library

Open a terminal window and install the `Azure Text Translation` client library for JavaScript with `npm`:

```console
npm i @azure-rest/ai-translation-text@1.0.0-beta.1
```

## Build your application

To interact with the Translator service using the client library, you need to create an instance of the `TextTranslationClient`class. To do so, create a `TranslateCredential` with your `key` and `<region>` from the Azure portal and a `TextTranslationClient`  instance. For more information, *see* [Translator text sdks](../../text-sdk-overview.md#3-authenticate-the-client).

1. Create the `index.js` file in the app directory.

    > [!TIP]
    >
    > * You can create a new file using PowerShell.
    > * Open a PowerShell window in your project directory by holding down the Shift key and right-clicking the folder.
    > * Enter the following command **New-Item index.js**.
    >
    > * You can also create a new file named `index.js` in your IDE and save it to the `text-translation-app` directory.

1. Copy and paste the following text translation code sample into your `index.js` file. Update **`<your-endpoint>`** and **`<your-key>`** with values from your Azure portal Translator instance.

## Code sample

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). For more information, see Azure AI services [security](../../../../ai-services/security-features.md).

**Translate text**

  > [!NOTE]
  > In this example we are using a regional endpoint. If you're using the global endpoint, see [Create a Text Translation client](../../create-translator-resource.md#create-a-text-translation-client).

```javascript
const TextTranslationClient = require("@azure-rest/ai-translation-text").default

const apiKey = "<your-key>";
const endpoint = "<your-endpoint>";
const region = "<region>";

async function main() {

  console.log("== Text translation sample ==");

  const translateCredential = {
    key: apiKey,
    region,
  };
  const translationClient = new TextTranslationClient(endpoint,translateCredential);

  const inputText = [{ text: "This is a test." }];
  const translateResponse = await translationClient.path("/translate").post({
    body: inputText,
    queryParameters: {
      to: "fr",
      from: "en",
    },
  });

  const translations = translateResponse.body;
  for (const translation of translations) {
    console.log(
      `Text was translated to: '${translation?.translations[0]?.to}' and the result is: '${translation?.translations[0]?.text}'.`
    );
  }
}

main().catch((err) => {
    console.error("An error occured:", err);
    process.exit(1);
  });

  module.exports = { main };
```

## Run your application

Once you've added the code sample to your application, run your program:

1. Navigate to the folder where you have your text translation application (text-translation-app).

1. Type the following command in your terminal:

    ```console
    node index.js
    ```

Here's a snippet of the expected output:

  :::image type="content" source="../../media/quickstarts/javascript-output.png" alt-text="Screenshot of JavaScript output in the terminal window.":::
