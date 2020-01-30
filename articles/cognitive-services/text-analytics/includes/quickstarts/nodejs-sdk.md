---
title: "Quickstart: Text Analytics v3 client library for Node.js | Microsoft Docs"
description: Get started with the v3 Text Analytics client library for Node.js.
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: include
ms.date: 01/13/2020
ms.author: aahi
ms.reviewer: sumeh, assafi
---

<a name="HOLTop"></a>

#### [Version 3.0-preview](#tab/version-3)

[v3 Reference documentation](https://aka.ms/azsdk-js-textanalytics-ref-docs) | [v3 Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/textanalytics/ai-text-analytics) | [v3 Package (NPM)](https://www.npmjs.com/package/@azure/ai-text-analytics) | [v3 Samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/textanalytics/ai-text-analytics/samples)


#### [Version 2.1](#tab/version-2)

[v2 Reference documentation](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics) | [v2 Library source code](https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/cognitiveServicesTextAnalytics) | [v2 Package (NPM)](https://www.npmjs.com/package/@azure/cognitiveservices-textanalytics) | [v2 Samples](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples/)

---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of [Node.js](https://nodejs.org/).

[!INCLUDE [text-analytics-resource-creation](resource-creation.md)]

## Setting up

### Create a new Node.js application

> [!NOTE]
> You can also run this version of the Text Analytics client library [in your browser](https://github.com/Azure/azure-sdk-for-js/blob/master/documentation/Bundling.md).

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp && cd myapp
```

Run the `npm init` command to create a node application with a `package.json` file. 

```console
npm init
```
### Install the client library

Install the `@azure/cognitiveservices-textanalytics` NPM packages:

```console
npm install --save @azure/cognitiveservices-textanalytics
```

Your app's `package.json` file will be updated with the dependencies.

Create a file named `index.js` and add the following libraries:

```javascript
"use strict";

const { TextAnalyticsClient, CognitiveServicesCredential } = require("@azure/cognitiveservices-textanalytics");
```

Create variables for your resource's Azure endpoint and key.

[!INCLUDE [text-analytics-find-resource-information](../find-azure-resource-info.md)]

```javascript
const key = '<paste-your-text-analytics-key-here>';
const endpoint = `<paste-your-text-analytics-endpoint-here>`;
```

## Object model

The Text Analytics client is a `TextAnalyticsClient` object that authenticates to Azure using your key. The client provides several methods for analyzing text, as a single string, or a batch.

Text is sent to the API as a list of `documents`, which are `dictionary` objects containing a combination of `id`, `text`, and `language` attributes depending on the method used. The `text` attribute stores the text to be analyzed in the origin `language`, and the `id` can be any value. 

The response object is a list containing the analysis information for each document. 

## Code examples

* [Client Authentication](#client-authentication)
* [Sentiment Analysis](#sentiment-analysis) 
* [Language detection](#language-detection)
* [Named Entity recognition](#named-entity-recognition-ner)
* [Entity linking](#entity-linking)
* [Key phrase extraction](#key-phrase-extraction)

## Client Authentication

#### [Version 3.0-preview](#tab/version-3)

Create a new `TextAnalyticsClient` object with your key and endpoint as parameters.

```javascript
const client = new TextAnalyticsClient(endpoint,  new CognitiveServicesCredential(key));
```

#### [Version 2.1](#tab/version-2)

Create a new [TextAnalyticsClient](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/textanalyticsclient) object with `credentials` and `endpoint` as a parameter.

[!code-javascript[Authentication and client creation](~/cognitive-services-node-sdk-samples/Samples/textAnalytics.js?name=authentication)]

---

## Sentiment analysis

#### [Version 3.0-preview](#tab/version-3)

Create an array of strings containing the document you want to analyze. Call the client's `analyzeSentiment()` method and get the returned `SentimentBatchResult` object. Iterate through the list of results, and print each document's ID, document level sentiment with confidence scores. For each document, result contains sentence level sentiment along with offsets, length, and confidence scores.

```javascript
async function sentimentAnalysis(client){

    const sentimentInput = [
        "I had the best day of my life. I wish you were there with me."
    ]

    const sentimentResult = await client.analyzeSentiment(sentimentInput);
    result.forEach(document => {
        console.log(`ID: ${document.id}`);
        console.log(`\tDocument Sentiment: ${document.sentiment}`);
        console.log(`\tDocument Scores:`);
        console.log(`\t\tPositive: ${document.documentScores.positive.toFixed(2)} \tNegative: ${document.documentScores.negative.toFixed(2)} \tNeutral: ${document.documentScores.neutral.toFixed(2)}`);
        console.log(`\tSentences Sentiment(${document.sentences.length}):`);
        document.sentences.forEach(sentence => {
            console.log(`\t\tSentence sentiment: ${sentence.sentiment}`)
            console.log(`\t\tSentences Scores:`);
            console.log(`\t\tPositive: ${sentence.sentenceScores.positive.toFixed(2)} \tNegative: ${sentence.sentenceScores.negative.toFixed(2)} \tNeutral: ${sentence.sentenceScores.neutral.toFixed(2)}`);
            console.log(`\t\tLength: ${sentence.length}, Offset: ${sentence.offset}`);
        })
    });
}
sentimentAnalysis(textAnalyticsClient)
```

Run your code with `node index.js` in your console window.

### Output

```console
ID: 0
        Document Sentiment: positive
        Document Scores:
                Positive: 0.61  Negative: 0.01  Neutral: 0.39
        Sentences Sentiment(2):
                Sentence sentiment: positive
                Sentences Scores:
                Positive: 1.00  Negative: 0.00  Neutral: 0.00
                Length: 30, Offset: 0
                Sentence sentiment: neutral
                Sentences Scores:
                Positive: 0.21  Negative: 0.02  Neutral: 0.77
                Length: 30, Offset: 31
```

#### [Version 2.1](#tab/version-2)

Create a list of dictionary objects, containing the documents you want to analyze. Call the client's [sentiment()](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/textanalyticsclient#sentiment-models-textanalyticsclientsentimentoptionalparams-) method and get the returned [SentimentBatchResult](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/sentimentbatchresult). Iterate through the list of results, and print each document's ID and sentiment score. A score closer to 0 indicates a negative sentiment, while a score closer to 1 indicates a positive sentiment.

[!code-javascript[Sentiment analysis](~/cognitive-services-node-sdk-samples/Samples/textAnalytics.js?name=sentimentAnalysis)]

Run your code with `node index.js` in your console window.

### Output

```console
[ { id: '1', score: 0.87 } ]
[ { id: '2', score: 0.11 } ]
[ { id: '3', score: 0.44 } ]
[ { id: '4', score: 1.00 } ]
```

---

## Language detection

#### [Version 3.0-preview](#tab/version-3)

Create an array of strings containing the document you want to analyze. Call the client's `detectLanguages()` method and get the returned `DetectLanguageResult`. Then iterate through the results, and print each document's ID, with respective primary and detected language.

```javascript
async function languageDetection(client) {

    const languageInputArray = [
        "Ce document est rédigé en Français."
    ]

    const languageResult = await client.detectLanguages(languageInputArray);

    result.forEach(document => {
        console.log(`ID: ${document.id}`);
        document.detectedLanguages.forEach(language =>
        console.log(`\tDetected Language ${language.name}`)
        );
        console.log(`\tPrimary Language ${document.primaryLanguage.name}`)
    });
}
languageDetection(textAnalyticsClient);
```

Run your code with `node index.js` in your console window.

### Output

```console
ID: 0
        Detected Language French
        Primary Language French
```

#### [Version 2.1](#tab/version-2)

Create a list of dictionary objects containing your documents. Call the client's [detectLanguage()](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/textanalyticsclient#detectlanguage-models-textanalyticsclientdetectlanguageoptionalparams-) method and get the returned [LanguageBatchResult](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/languagebatchresult). Then iterate through the results, and print each document's ID, and language.

[!code-javascript[Language detection](~/cognitive-services-node-sdk-samples/Samples/textAnalytics.js?name=languageDetection)]

Run your code with `node index.js` in your console window.

### Output

```console
Document ID: 1 , Language: English
Document ID: 2 , Language: Spanish
Document ID: 3 , Language: Chinese_Simplified
```

---

## Named Entity Recognition (NER)

#### [Version 3.0-preview](#tab/version-3)

> [!NOTE]
> In version `3.0-preview`:
> * NER includes separate methods for detecting personal information. 
> * Entity linking is a separate request than NER.

Create an array of strings containing the document you want to analyze. Call the client's `recognizeEntities()` method and get the `RecognizeEntitiesResult` object. Iterate through the list of results, and print the entity name, type, subtype, offset, length, and score.

```javascript
async function entityRecognition(client){

    const entityInputs = [
        "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800",
        "La sede principal de Microsoft se encuentra en la ciudad de Redmond, a 21 kilómetros de Seattle."
    ];

    const entityResults = await client.recognizeEntities(entityInputs);

    entityResults.forEach(document => {
        console.log(`Document ID: ${document.id}`);
        document.entities.forEach(entity => {
            console.log(`\tName: ${entity.text} \tType: ${entity.type} \tSub Type: ${entity.subtype != "" ? entity.subtype : "N/A"}`);
            console.log(`\tOffset: ${entity.offset}, Length: ${entity.length} \tScore: ${entity.score}`);
        });
    });
}
entityRecognition(textAnalyticsClient);
```

Run your code with `node index.js` in your console window.

### Output

```console
Document ID: 0
        Name: Microsoft         Type: Organization      Sub Type: N/A
        Offset: 0, Length: 9    Score: 1
        Name: Bill Gates        Type: Person    Sub Type: N/A
        Offset: 25, Length: 10  Score: 0.999786376953125
        Name: Paul Allen        Type: Person    Sub Type: N/A
        Offset: 40, Length: 10  Score: 0.9988105297088623
        Name: April 4, 1975     Type: DateTime  Sub Type: Date
        Offset: 54, Length: 13  Score: 0.8
        Name: Altair    Type: Organization      Sub Type: N/A
        Offset: 116, Length: 6  Score: 0.7996330857276917
        Name: 8800      Type: Quantity  Sub Type: Number
        Offset: 123, Length: 4  Score: 0.8
Document ID: 1
        Name: Microsoft         Type: Organization      Sub Type: N/A
        Offset: 21, Length: 9   Score: 0.9837456345558167
        Name: 21        Type: Quantity  Sub Type: Number
        Offset: 71, Length: 2   Score: 0.8
```

## Using NER to detect personal information

Create an array of strings containing the document you want to analyze. Call the client's `recognizePiiEntities()` method and get the `EntitiesBatchResult` object. Iterate through the list of results, and print the entity name, type, subtype, offset, length, and score.


```javascript
async function entityPiiRecognition(client){

    const entityPiiInput = [
        "Insurance policy for SSN on file 123-12-1234 is here by approved."
    ]
    const entityResults = await client.recognizePiiEntities(entityPiiInput);

    result.forEach(document => {
        console.log(`Document ID: ${document.id}`);
        document.entities.forEach(entity => {
            console.log(`\tName: ${entity.text} \tType: ${entity.type} \tSub Type: ${entity.subtype != "" ? entity.subtype : "N/A"}`);
            console.log(`\tOffset: ${entity.offset}, Length: ${entity.length} \tScore: ${entity.score}`);
        });
    });
}
entityPiiRecognition(textAnalyticsClient);
```

Run your code with `node index.js` in your console window.

### Output

```console
Document ID: 0
        Name: 123-12-1234       Type: U.S. Social Security Number (SSN)         Sub Type: N/A
        Offset: 33, Length: 11  Score: 0.85
```

## Entity Linking

Create an array of strings containing the document you want to analyze. Call the client's `recognizeLinkedEntities()` method and get the `RecognizeLinkedEntitiesResult` object. Iterate through the list of results, and print the entity name, ID, data source, url, and matches. Every object in `matches` array will contain offset, length, and score for that match.

```javascript
async function linkedEntityRecognition(client){

    const linkedEntityInput = [
        "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800. During his career at Microsoft, Gates held the positions of chairman, chief executive officer, president and chief software architect, while also being the largest individual shareholder until May 2014."
    ]
    const entityResults = await client.recognizeLinkedEntities(linkedEntityInput);

    entityResults.forEach(document => {
        console.log(`Document ID: ${document.id}`);
        document.entities.forEach(entity => {
            console.log(`\tName: ${entity.name} \tID: ${entity.id} \tURL: ${entity.url} \tData Source: ${entity.dataSource}`);
            console.log(`\tMatches:`)
            entity.matches.forEach(match => {
                console.log(`\t\tText: ${match.text}`);
                console.log(`\t\tOffset: ${match.offset}, Length: ${match.length} \tScore: ${match.score.toFixed(3)}`);
            })
        });
    });
}
linkedEntityRecognition(textAnalyticsClient);
```

Run your code with `node index.js` in your console window.

### Output

```console
Document ID: 0
        Name: Altair 8800       ID: Altair 8800         URL: https://en.wikipedia.org/wiki/Altair_8800  Data Source: Wikipedia
        Matches:
                Text: Altair 8800
                Offset: 116, Length: 11         Score: 0.650
        Name: Bill Gates        ID: Bill Gates  URL: https://en.wikipedia.org/wiki/Bill_Gates   Data Source: Wikipedia
        Matches:
                Text: Bill Gates
                Offset: 25, Length: 10  Score: 0.243
                Text: Gates
                Offset: 161, Length: 5  Score: 0.243
        Name: Paul Allen        ID: Paul Allen  URL: https://en.wikipedia.org/wiki/Paul_Allen   Data Source: Wikipedia
        Matches:
                Text: Paul Allen
                Offset: 40, Length: 10  Score: 0.174
        Name: Microsoft         ID: Microsoft   URL: https://en.wikipedia.org/wiki/Microsoft    Data Source: Wikipedia
        Matches:
                Text: Microsoft
                Offset: 0, Length: 9    Score: 0.196
                Text: Microsoft
                Offset: 150, Length: 9  Score: 0.196
        Name: April 4   ID: April 4     URL: https://en.wikipedia.org/wiki/April_4      Data Source: Wikipedia
        Matches:
                Text: April 4
                Offset: 54, Length: 7   Score: 0.137
        Name: BASIC     ID: BASIC       URL: https://en.wikipedia.org/wiki/BASIC        Data Source: Wikipedia
        Matches:
                Text: BASIC
                Offset: 89, Length: 5   Score: 0.052
```

#### [Version 2.1](#tab/version-2)

> [!NOTE]
> In version 2.1, entity linking is included in the NER response.

Create a list of objects, containing your documents. Call the client's [entities()](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/textanalyticsclient#entities-models-textanalyticscliententitiesoptionalparams-) method and get the [EntitiesBatchResult](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/entitiesbatchresult) object. Iterate through the list of results, and print each document's ID. For each detected entity, print its wikipedia name, the type and sub-types (if exists) as well as the locations in the original text.

[!code-javascript[Entity recognition](~/cognitive-services-node-sdk-samples/Samples/textAnalytics.js?name=entityRecognition)]

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

---

## Key phrase extraction

#### [Version 3.0-preview](#tab/version-3)

Create an array of strings containing the document you want to analyze. Call the client's `extractKeyPhrases()` method and get the returned `ExtractKeyPhrasesResult` object. Iterate through the results and print each document's ID, and any detected key phrases.

```javascript
async function keyPhraseExtraction(client){

    const keyPhrasesInput = [
        "My cat might need to see a veterinarian.",
    ]

    const result = await client.extractKeyPhrases(keyPhrasesInput)


    result.forEach(document => {
        console.log(`ID: ${document.id}`);
        console.log(`\tDocument Key Phrases: ${document.keyPhrases}`);
    });
}
keyPhraseExtraction(textAnalyticsClient);
```

Run your code with `node index.js` in your console window.

### Output

```console
ID: 0
        Document Key Phrases: cat,veterinarian
```

#### [Version 2.1](#tab/version-2)

Create a list of objects, containing your documents. Call the client's [keyPhrases()](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/textanalyticsclient#keyphrases-models-textanalyticsclientkeyphrasesoptionalparams-) method and get the returned     [KeyPhraseBatchResult](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/keyphrasebatchresult) object. Iterate through the results and print each document's ID, and any detected key phrases.

[!code-javascript[Key phrase extraction](~/cognitive-services-node-sdk-samples/Samples/textAnalytics.js?name=keyPhraseExtraction)]

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

---

## Run the application

Run the application with the `node` command on your quickstart file.

```console
node index.js
```
