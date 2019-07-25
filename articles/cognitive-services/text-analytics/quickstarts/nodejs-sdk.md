---
title: 'Quickstart: Using Node.js to call the Text Analytics API'
titleSuffix: Azure Cognitive Services
description: Get information and code samples to help you quickly get started with using the Text Analytics API.
services: cognitive-services
author: raymondl
manager: nitinme

ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: quickstart
ms.date: 06/11/2019
ms.author: shthowse
---

# Quickstart: Using Node.js to call the Text Analytics Cognitive Service
<a name="HOLTop"></a>

Use this quickstart to begin analyzing language with the Text Analytics SDK for Node.js. While the [Text Analytics](//go.microsoft.com/fwlink/?LinkID=759711) REST API is compatible with most programming languages, the SDK provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples/blob/master/Samples/textAnalytics.js).

Refer to the [API definitions](//go.microsoft.com/fwlink/?LinkID=759346) for technical documentation for the APIs.

## Prerequisites

* [Node.js](https://nodejs.org/)
* The Text Analytics [SDK for Node.js](https://www.npmjs.com/package/azure-cognitiveservices-textanalytics)
    You can install the SDK with:

    `npm install azure-cognitiveservices-textanalytics`

[!INCLUDE [cognitive-services-text-analytics-signup-requirements](../../../../includes/cognitive-services-text-analytics-signup-requirements.md)]

You must also have the [endpoint and access key](../How-tos/text-analytics-how-to-access-key.md) that was generated for you during sign-up.

## Create a Node.js application and install the SDK

After installing Node.js, create a node project. Create a new directory for your app, and navigate to its directory.

```mkdir myapp && cd myapp```

Run ```npm init``` to create a node application with a package.json file. Install the `ms-rest-azure` and `azure-cognitiveservices-textanalytics` NPM packages:

```npm install azure-cognitiveservices-textanalytics ms-rest-azure```

Your app's package.json file will be updated with the dependencies.

## Authenticate your credentials

Create a new file `index.js` in the project root and import the installed libraries

```javascript
const CognitiveServicesCredentials = require("ms-rest-azure").CognitiveServicesCredentials;
const TextAnalyticsAPIClient = require("azure-cognitiveservices-textanalytics");
```

Create a variable for your Text Analytics subscription key.

```javascript
let credentials = new CognitiveServicesCredentials(
    "enter-your-key-here"
);
```

> [!Tip]
> For secure deployment of secrets in production systems we recommend using [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/quick-create-net).
>

## Create a Text Analytics client

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

## Next steps

> [!div class="nextstepaction"]
> [Text Analytics With Power BI](../tutorials/tutorial-power-bi-key-phrases.md)

## See also

 [Text Analytics overview](../overview.md)
 [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)
