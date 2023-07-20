---
title: "Quickstart: Document Translation JavaScript"
description: 'Document Translation processing using the REST API and JavaScript programming language'
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: include
ms.date: 07/18/2023
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD051 -->

## Set up your Node.js environment

For this quickstart, we use the Node.js JavaScript runtime environment to create and run the application.

1. If you haven't done so already, install the latest version of [Node.js](https://nodejs.org/en/download/). Node Package Manager (npm) is included with the Node.js installation.

    > [!TIP]
    > If you're new to Node.js, try the [Introduction to Node.js](/training/modules/intro-to-nodejs/) Learn module.

1. In a console window (such as cmd, PowerShell, or Bash), create and navigate to a new directory for your app named `document-translation`.

    ```console
    mkdir document-translation && cd document-translation
    ```

   ```powershell
   mkdir document-translation; cd document-translation
   ```

1. Run the npm init command to initialize the application and scaffold your project.

    ```console
    npm init
    ```

1. Specify your project's attributes by accepting the prompts presented in the terminal.

    * The most important attributes are name, version number, and entry point.
    * We recommend keeping `index.js` for the entry point name. The description, test command, GitHub repository, keywords, author, and license information are optional attributes—they can be skipped for this project.
    * Accept the suggestions in parentheses by selecting **Return** or **Enter**.
    * After you've completed the prompts, a `package.json` file will be created in your document-translation directory.

1. Use npm to install the `axios` HTTP library and `uuid` package in your document-translation app directory:

    ```console
    npm install axios uuid
    ```

 <!-- > [!div class="nextstepaction"]
  > [I ran into an issue setting up my environment.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=Language&Product=Document-translation&Page=quickstart&Section=Set-up-the-environment) -->

## Translate all documents in a storage container

1. Create the `index.js` file in the app directory.

    > [!TIP]
    >
    > * You can create a new file using PowerShell.
    > * Open a PowerShell window in your project directory by holding down the Shift key and right-clicking the folder.
    > * Enter the following command **New-Item index.js**.
    >
    > * You can also create a new file named `index.js` in your IDE and save it to the `document-translation` directory.

1. Copy and paste the document translation [code sample](#code-sample) into your `index.js` file.

    * Update **`{your-document-translation-endpoint}`** and **`{your-key}`** with values from your Azure portal Translator instance.

    * Update the **`{your-source-container-SAS-URL}`** and **`{your-target-container-SAS-URL}`** with values from your Azure portal Storage account containers instance.

## Code sample

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../../key-vault/general/overview.md). For more information, see Azure AI services [security](../../../../../../ai-services/security-features.md).

```javascript
const axios = require('axios').default;

let endpoint = '{your-document-translation-endpoint}/translator/text/batch/v1.1';
let route = '/batches';
let key = '{your-key}';
let sourceSASUrl = "{your-source-container-SAS-URL}";
let targetSASUrl = "{your-target-container-SAS-URL}"

let data = JSON.stringify({"inputs": [
  {
      "source": {
          "sourceUrl": sourceSASUrl,
          "storageSource": "AzureBlob",
          "language": "en"
      },
      "targets": [
          {
              "targetUrl": targetSASUrl,
              "storageSource": "AzureBlob",
              "category": "general",
              "language": "es"}]}]});

let config = {
  method: 'post',
  baseURL: endpoint,
  url: route,
  headers: {
    'Ocp-Apim-Subscription-Key': key,
    'Content-Type': 'application/json'
  },
  data: data
};

axios(config)
.then(function (response) {
  let result = { statusText: response.statusText, statusCode: response.status, headers: response.headers };
  console.log()
  console.log(JSON.stringify(result, null, 2));
})
.catch(function (error) {
  console.log(error);
});
```

## Run your JavaScript application

Once you've added the code sample to your application, run your program:

  1. Navigate to your application directory (document-translation).

  1. Enter and run the following command in your terminal:

      ```console
      node index.js
      ```

Upon successful completion: 

* The translated documents can be found in your target container.
* The successful POST method returns a `202 Accepted` response code indicating that the service created the batch request.
* The POST request also returns response headers including `Operation-Location` that provides a value used in subsequent GET requests.

> [!div class="nextstepaction"]
> [I successfully translated my document.](#next-steps)  [I ran into an issue.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=Language&Product=Document-translation&Page=quickstart&Section=Translate-documents)
