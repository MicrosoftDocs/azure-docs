---
author: aahill
ms.service: cognitive-services
ms.topic: include
ms.date: 10/28/2019
ms.author: aahi
---

<a name="HOLTop"></a>

<!-- these links are for v2. Make sure to update them to the correct v3 content -->
[Reference documentation](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics) | [Library source code](https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/cognitiveServicesTextAnalytics) | [Package (NPM)](https://www.npmjs.com/package/azure-cognitiveservices-textanalytics) | [Samples](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples/)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of [Node.js](https://nodejs.org/).

## Setting up

<!--
Add any extra steps preparing an environment for working with the client library. 
-->

### Create a Text Analytics Azure resource
<!-- NOTE
The below is an "include" file, which is a text file that will be referenced, and rendered on the docs site.
These files are used to display text across multiple articles at once. Consider keeping them in-place for consistency with other articles.
 -->
[!INCLUDE [text-analytics-resource-creation](../resource-creation.md)]

### Create a new Node.js application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp && cd myapp
```

Run the `npm init` command to create a node application with a `package.json` file. 

```console
npm init
```

Create a file named `index.js` and add the following libraries:

```javascript
"use strict";

const os = require("os");
const CognitiveServicesCredentials = require("@azure/ms-rest-js");
const TextAnalyticsAPIClient = require("@azure/cognitiveservices-textanalytics");
```

Create variables for your resource's Azure endpoint and subscription key.

[!INCLUDE [text-analytics-find-resource-information](../../find-azure-resource-info.md)]

<!-- Use the below example variable names and example strings, for consistency with the other quickstart variables -->
```javascript
const subscription_key = '<paste-your-text-analytics-key-here>';
const endpoint = `<paste-your-text-analytics-endpoint-here>`;
```

### Install the client library

Install the `@azure/ms-rest-js` and `@azure/cognitiveservices-textanalytics` NPM packages:

```console
npm install @azure/cognitiveservices-textanalytics @azure/ms-rest-js
```

Your app's `package.json` file will be updated with the dependencies.

## Object model

<!-- 
    Briefly introduce and describe the functionality of the library's main classes. Include links to their reference pages. If needed, briefly explain the object hierarchy and how the classes work together to manipulate resources in the service.
-->

The Text Analytics client is a [TextAnalyticsClient](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/textanalyticsclient) object that authenticates to Azure using your key. The client provides several methods for analyzing text, as a single string, or a batch.

Text is sent to the API as a list of `documents`, which are `dictionary` objects containing a combination of `id`, `text`, and `language` attributes depending on the method used. The `text` attribute stores the text to be analyzed in the origin `language`, and the `id` can be any value. 

The response object is a list containing the analysis information for each document. 

## Code examples
<!-- If you add more code examples, add a link to them here-->
* [Authenticate the client](#authenticate-the-client)
* [Sentiment Analysis](#sentiment-analysis)
* [Language detection](#language-detection)
* [Entity recognition](#entity-recognition)
* [Key phrase extraction](#key-phrase-extraction)


## Authenticate the client

Create a new [TextAnalyticsClient](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/textanalyticsclient) object with `credentials` and `endpoint` as a parameter.

```javascript
const creds = new CognitiveServicesCredentials.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': subscription_key } });
const textAnalyticsClient = new TextAnalyticsAPIClient.TextAnalyticsClient(creds, endpoint);
```


## Sentiment analysis

Create a list of dictionary objects, containing the documents you want to analyze. Call the client's [sentiment()](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/textanalyticsclient#sentiment-models-textanalyticsclientsentimentoptionalparams-) method and get the returned [SentimentBatchResult](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/sentimentbatchresult). Iterate through the list of results, and print each document's ID and sentiment score. A score closer to 0 indicates a negative sentiment, while a score closer to 1 indicates a positive sentiment.

```javascript
async function sentimentAnalysis(client){

    console.log("3. This will perform sentiment analysis on the sentences.");

    const sentimentInput = {
        documents: [
            { language: "en", id: "1", text: "I had the best day of my life." },
            {
                language: "en",
                id: "2",
                text: "This was a waste of my time. The speaker put me to sleep."
            },
            {
                language: "es",
                id: "3",
                text: "No tengo dinero ni nada que dar..."
            },
            {
                language: "it",
                id: "4",
                text:
                    "L'hotel veneziano era meraviglioso. È un bellissimo pezzo di architettura."
            }
        ]
    };

    const sentimentResult = await client.sentiment({
        multiLanguageBatchInput: sentimentInput
    });
    console.log(sentimentResult.documents);
    console.log(os.EOL);
}
sentimentAnalysis(textAnalyticsClient)
```

Run your code with `node index.js` in your console window.

### Output

```console
[ { id: '1', score: 0.87 } ]
[ { id: '2', score: 0.11 } ]
[ { id: '3', score: 0.44 } ]
[ { id: '4', score: 1.00 } ]
```

## Language detection

Create a list of dictionary objects containing your documents. Call the client's [detectLanguage()](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/textanalyticsclient#detectlanguage-models-textanalyticsclientdetectlanguageoptionalparams-) method and get the returned [LanguageBatchResult](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/languagebatchresult). Then iterate through the results, and print each document's ID, and language.

```javascript
async function languageDetection(client) {

    console.log("1. This will detect the languages of the inputs.");
    const languageInput = {
        documents: [
            { id: "1", text: "This is a document written in English." },
            { id: "2", text: "Este es un document escrito en Español." },
            { id: "3", text: "这是一个用中文写的文件" }
        ]
    };

    const languageResult = await client.detectLanguage({
        languageBatchInput: languageInput
    });

    languageResult.documents.forEach(document => {
        console.log(`ID: ${document.id}`);
        document.detectedLanguages.forEach(language =>
            console.log(`\tLanguage ${language.name}`)
        );
    });
    console.log(os.EOL);
}
languageDetection(textAnalyticsClient);
```

Run your code with `node index.js` in your console window.

### Output

```console
Document ID: 1 , Language: English
Document ID: 2 , Language: Spanish
Document ID: 3 , Language: Chinese_Simplified
```

## Entity recognition

Create a list of objects, containing your documents. Call the client's [entities()](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/textanalyticsclient#entities-models-textanalyticscliententitiesoptionalparams-) method and get the [EntitiesBatchResult](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/entitiesbatchresult) object. Iterate through the list of results, and print each document's ID. For each detected entity, print its wikipedia name, the type and sub-types (if exists) as well as the locations in the original text.

```javascript
async function entityRecognition(client){
    console.log("3. This will perform Entity recognition on the sentences.");

    const entityInputs = {
        documents: [
            {
                language: "en",
                id: "1",
                text:
                    "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800"
            },
            {
                language: "es",
                id: "2",
                text:
                    "La sede principal de Microsoft se encuentra en la ciudad de Redmond, a 21 kilómetros de Seattle."
            }
        ]
    };

    const entityResults = await client.entities({
        multiLanguageBatchInput: entityInputs
    });

    entityResults.documents.forEach(document => {
        console.log(`Document ID: ${document.id}`);
        document.entities.forEach(e => {
            console.log(`\tName: ${e.name} Type: ${e.type} Sub Type: ${e.type}`);
            e.matches.forEach(match =>
                console.log(
                    `\t\tOffset: ${match.offset} Length: ${match.length} Score: ${
                    match.entityTypeScore
                    }`
                )
            );
        });
    });

    console.log(os.EOL);
}
entityRecognition(textAnalyticsClient);
```

Run your code with `node index.js` in your console window.

### Output

```console
Document ID: 1
    Name: Microsoft,        Type: Organization,     Sub-Type: N/A
    Offset: 0, Length: 9,   Score: 1.0
    Name: Bill Gates,       Type: Person,   Sub-Type: N/A
    Offset: 25, Length: 10, Score: 0.999847412109375
    Name: Paul Allen,       Type: Person,   Sub-Type: N/A
    Offset: 40, Length: 10, Score: 0.9988409876823425
    Name: April 4,  Type: Other,    Sub-Type: N/A
    Offset: 54, Length: 7,  Score: 0.8
    Name: April 4, 1975,    Type: DateTime, Sub-Type: Date
    Offset: 54, Length: 13, Score: 0.8
    Name: BASIC,    Type: Other,    Sub-Type: N/A
    Offset: 89, Length: 5,  Score: 0.8
    Name: Altair 8800,      Type: Other,    Sub-Type: N/A
    Offset: 116, Length: 11,        Score: 0.8

Document ID: 2
    Name: Microsoft,        Type: Organization,     Sub-Type: N/A
    Offset: 21, Length: 9,  Score: 0.999755859375
    Name: Redmond (Washington),     Type: Location, Sub-Type: N/A
    Offset: 60, Length: 7,  Score: 0.9911284446716309
    Name: 21 kilómetros,    Type: Quantity, Sub-Type: Dimension
    Offset: 71, Length: 13, Score: 0.8
    Name: Seattle,  Type: Location, Sub-Type: N/A
    Offset: 88, Length: 7,  Score: 0.9998779296875
```

## Key phrase extraction

Create a list of objects, containing your documents. Call the client's [keyPhrases()](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/textanalyticsclient#keyphrases-models-textanalyticsclientkeyphrasesoptionalparams-) method and get the returned     [KeyPhraseBatchResult](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/keyphrasebatchresult) object. Iterate through the results and print each document's ID, and any detected key phrases.

```javascript
async function keyPhraseExtraction(client){

    console.log("2. This will extract key phrases from the sentences.");
    const keyPhrasesInput = {
        documents: [
            { language: "ja", id: "1", text: "猫は幸せ" },
            {
                language: "de",
                id: "2",
                text: "Fahrt nach Stuttgart und dann zum Hotel zu Fu."
            },
            {
                language: "en",
                id: "3",
                text: "My cat might need to see a veterinarian."
            },
            { language: "es", id: "4", text: "A mi me encanta el fútbol!" }
        ]
    };

    const keyPhraseResult = await client.keyPhrases({
        multiLanguageBatchInput: keyPhrasesInput
    });
    console.log(keyPhraseResult.documents);
    console.log(os.EOL);
}
keyPhraseExtraction(textAnalyticsClient);
```

Run your code with `node index.js` in your console window.

### Output

```console
[
    { id: '1', keyPhrases: [ '幸せ' ] }
    { id: '2', keyPhrases: [ 'Stuttgart', "hotel", "Fahrt", "Fu" ] }
    { id: '3', keyPhrases: [ 'cat', 'veterinarian' ] }
    { id: '3', keyPhrases: [ 'fútbol' ] }
]
```

## Run the application

Run the application with the `node` command on your quickstart file.

```console
node index.js
```
