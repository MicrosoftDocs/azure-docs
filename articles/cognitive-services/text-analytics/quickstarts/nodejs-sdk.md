---
title: 'Quickstart: Text Analytics client library for Node.js | Microsoft Docs'
titleSuffix: Azure Cognitive Services
description: Get information and code samples to help you quickly get started with using the Text Analytics API.
services: cognitive-services
author: raymondl
manager: nitinme

ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 07/30/2019
ms.author: shthowse
---

# Quickstart: Text analytics client library for Node.js
<a name="HOLTop"></a>

Get started with the Text Analytics client library for .Node.js. Follow these steps to install the package and try out the example code for basic tasks. 

Use the Text Analytics client library for Node.js to perform:

* Sentiment analysis
* Language detection
* Entity recognition
* Key phrase extraction

[Reference documentation](https://docs.microsoft.com/javascript/api/overview/azure/cognitiveservices/textanalytics?view=azure-node-latest) | [Library source code](https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/cognitiveServicesTextAnalytics) | [Package (NPM)](https://www.npmjs.com/package/azure-cognitiveservices-textanalytics) | [Samples](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples/)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of the [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core).

## Setting up

### Create a Text Analytics Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for [Product name] using the [Azure portal](../../cognitive-services-apis-create-account.md) or [Azure CLI](../../cognitive-services-apis-create-account-cli.md) on your local machine. You can also:

* Get a [trial key](https://azure.microsoft.com/try/cognitive-services/#decision) valid for 7 days for free. After signing up it will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).  
* View your resource on the [Azure Portal](https://portal.azure.com/)

After you get a key from your trial subscription or resource, [create an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key, named `TEXTANALYTICS_SUBSCRIPTION_KEY`.

### Create a new Node.js application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp && cd myapp
```

Run the `npm init` command to create a node application with a `package.json` file. 

```console
npm init
```

Create a file named `index.js` and import the following libraries:

```javascript
const CognitiveServicesCredentials = require("ms-rest-azure").CognitiveServicesCredentials;
const TextAnalyticsAPIClient = require("azure-cognitiveservices-textanalytics");
```

Create variables for your resource's Azure endpoint and key. If you created the environment variable after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variable.

```javascript
let credentials = new CognitiveServicesCredentials(
    "enter-your-key-here"
);
```

### Install the client library

Install the `ms-rest-azure` and `azure-cognitiveservices-textanalytics` NPM packages:

```console
npm install azure-cognitiveservices-textanalytics ms-rest-azure
```

Your app's `package.json` file will be updated with the dependencies.

## Object model

The Text Analytics client is a [TextAnalyticsClient](https://docs.microsoft.com/javascript/api/azure-cognitiveservices-textanalytics/textanalyticsclient?view=azure-node-latest) object that authenticates to Azure using your key. The client provides several methods for analyzing text, as a single string, or a batch. 

Text is sent to the API as a list of `documents`, which are `dictionary` objects containing an `id` and a `text` attribute. The `text` attribute stores the text to be analyzed, and the `id` can be any value. 

The response object is a list containing the analysis information for each document. 

## Code examples

* [Authenticate the client](#authenticate-the-client)
* [Sentiment Analysis](#sentiment-analysis)
* [Language detection](#language-detection)
* [Entity recognition](#entity-recognition)
* [Key phrase extraction](#key-phrase-extraction)


## Authenticate the client

Create a new `TextAnalyticsClient` object with `credentials` as a parameter. Use the correct Azure region for your Text Analytics subscription.

```javascript
//Replace 'westus' with the correct region for your Text Analytics subscription
let client = new TextAnalyticsAPIClient(
    credentials,
    "https://westus.api.cognitive.microsoft.com/"
);
```

## Sentiment analysis

Create a list of objects, containing the documents you want to analyze. The payload to the API consists of a list of `documents`, which contain an `id`, `language`, and `text` attribute. The `text` attribute stores the text to be analyzed, `language` is the language of the document, and the `id` can be any value. 

```javascript
const inputDocuments = {documents:[
    {language:"en", id:"1", text:"I had the best day of my life."},
    {language:"en", id:"2", text:"This was a waste of my time. The speaker put me to sleep."},
    {language:"es", id:"3", text:"No tengo dinero ni nada que dar..."},
    {language:"it", id:"4", text:"L'hotel veneziano era meraviglioso. È un bellissimo pezzo di architettura."}
]}
```

Call `client.sentiment` and get the result. Then iterate through the results, and print each document's ID, and sentiment score. A score closer to 0 indicates a negative sentiment, while a score closer to 1 indicates a positive sentiment.

```javascript
const operation = client.sentiment({multiLanguageBatchInput: inputDocuments})
operation
.then(result => {
    console.log(result.documents);
})
.catch(err => {
    throw err;
});
```

Run your code with `node index.js` in your console window.

### Output

```console
[ { id: '1', score: 0.8723785877227783 },
  { id: '2', score: 0.1059873104095459 },
  { id: '3', score: 0.43635445833206177 },
  { id: '4', score: 1 } ]
```

## Language detection

Create a list of objects containing your documents. The payload to the API consists of a list of `documents`, which contain an `id` and `text` attribute. The `text` attribute stores the text to be analyzed, and the `id` can be any value.

```javascript
// The documents to be submitted for language detection. The ID can be any value.
const inputDocuments = {
    documents: [
        { id: "1", text: "This is a document written in English." },
        { id: "2", text: "Este es un document escrito en Español." },
        { id: "3", text: "这是一个用中文写的文件" }
    ]
    };
```

Call `client.detectLanguage()` and get the result. Then iterate through the results, and print each document's ID, and the first returned language.

```javascript
const operation = client.detectLanguage({
    languageBatchInput: inputDocuments
});
operation
    .then(result => {
    result.documents.forEach(document => {
        console.log(`ID: ${document.id}`);
        document.detectedLanguages.forEach(language =>
        console.log(`\tLanguage: ${language.name}`)
        );
    });
    })
    .catch(err => {
    throw err;
    });
```

Run your code with `node index.js` in your console window.

### Output

```console
===== LANGUAGE EXTRACTION ======
ID: 1 Language English
ID: 2 Language Spanish
ID: 3 Language Chinese_Simplified
```

## Entity recognition

Create a list of objects, containing your documents. The payload to the API consists of a list of `documents`, which contain an `id`, `language`, and `text` attribute. The `text` attribute stores the text to be analyzed, `language` is the language of the document, and the `id` can be any value.

```javascript

    const inputDocuments = {documents:[
        {language:"en", id:"1", text:"Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800"},
        {language:"es", id:"2", text:"La sede principal de Microsoft se encuentra en la ciudad de Redmond, a 21 kilómetros de Seattle."},
        ]}

}
```

Call `client.entities()` and get the result. Then iterate through the results, and print each document's ID. For each detected entity, print its wikipedia name, the type and sub-types (if exists) as well as the locations in the original text.

```javascript
const operation = client.entities({
    multiLanguageBatchInput: inputDocuments
});
operation
    .then(result => {
    result.documents.forEach(document => {
        console.log(`Document ID: ${document.id}`)
        document.entities.forEach(e =>{
        console.log(`\tName: ${e.name} Type: ${e.type} Sub Type: ${e.type}`)
        e.matches.forEach(match => (
            console.log(`\t\tOffset: ${match.offset} Length: ${match.length} Score: ${match.entityTypeScore}`)
        ))
        })
    });
    })
    .catch(err => {
    throw err;
    });
```

Run your code with `node index.js` in your console window.

### Output

```console
Document ID: 1
    Name: Microsoft Type: Organization Sub Type: Organization
            Offset: 0 Length: 9 Score: 1
    Name: Bill Gates Type: Person Sub Type: Person
            Offset: 25 Length: 10 Score: 0.999786376953125
    Name: Paul Allen Type: Person Sub Type: Person
            Offset: 40 Length: 10 Score: 0.9988105297088623
    Name: April 4 Type: Other Sub Type: Other
            Offset: 54 Length: 7 Score: 0.8
    Name: April 4, 1975 Type: DateTime Sub Type: DateTime
            Offset: 54 Length: 13 Score: 0.8
    Name: BASIC Type: Other Sub Type: Other
            Offset: 89 Length: 5 Score: 0.8
    Name: Altair 8800 Type: Other Sub Type: Other
            Offset: 116 Length: 11 Score: 0.8
Document ID: 2
    Name: Microsoft Type: Organization Sub Type: Organization
            Offset: 21 Length: 9 Score: 0.999755859375
    Name: Redmond (Washington) Type: Location Sub Type: Location
            Offset: 60 Length: 7 Score: 0.9911284446716309
    Name: 21 kilómetros Type: Quantity Sub Type: Quantity
            Offset: 71 Length: 13 Score: 0.8
    Name: Seattle Type: Location Sub Type: Location
            Offset: 88 Length: 7 Score: 0.9998779296875
```

## Key phrase extraction

Create a list of objects, containing your documents. The payload to the API consists of a list of `documents`, which contain an `id`, `language`, and `text` attribute. The `text` attribute stores the text to be analyzed, `language` is the language of the document, and the `id` can be any value.

```javascript
    let inputLanguage = {
    documents: [
        {language:"ja", id:"1", text:"猫は幸せ"},
        {language:"de", id:"2", text:"Fahrt nach Stuttgart und dann zum Hotel zu Fu."},
        {language:"en", id:"3", text:"My cat might need to see a veterinarian."},
        {language:"es", id:"4", text:"A mi me encanta el fútbol!"}
    ]
    };
```

Call `client.keyPhrases()` and get the result. Then iterate through the results and print each document's ID, and any detected key phrases.

```javascript
    let operation = client.keyPhrases({
    multiLanguageBatchInput: inputLanguage
    });
    operation
    .then(result => {
        console.log(result.documents);
    })
    .catch(err => {
        throw err;
    });
```

Run your code with `node index.js` in your console window.

### Output

```console
[ 
    { id: '1', keyPhrases: [ '幸せ' ] },
    { id: '2', keyPhrases: [ 'Stuttgart', 'Hotel', 'Fahrt', 'Fu' ] },
    { id: '3', keyPhrases: [ 'cat', 'veterinarian' ] },
    { id: '4', keyPhrases: [ 'fútbol' ] } 
]
```

## Run the application

Run the application with the `node` command on your quickstart file.

```console
node index.js
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

> [!div class="nextstepaction"]
> [Text Analytics With Power BI](../tutorials/tutorial-power-bi-key-phrases.md)

## See also

 [Text Analytics overview](../overview.md)
 [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)
