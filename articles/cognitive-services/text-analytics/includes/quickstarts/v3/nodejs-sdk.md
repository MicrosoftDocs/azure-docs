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
[!INCLUDE [text-analytics-resource-creation](resource-creation.md)]

### Create a new Node.js application

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

Create variables for your resource's Azure endpoint and subscription key.

[!INCLUDE [text-analytics-find-resource-information](../find-azure-resource-info.md)]

<!-- Use the below example variable names and example strings, for consistency with the other quickstart variables -->
```javascript
const subscription_key = '<paste-your-text-analytics-key-here>';
const endpoint = `<paste-your-text-analytics-endpoint-here>`;
```

The `subscription_key` and `endpoint` variables are generated when the text analytics resource is created and can be found in **Quick Start** section of the resource.

## Object model

<!-- 
    Briefly introduce and describe the functionality of the library's main classes. Include links to their reference pages. If needed, briefly explain the object hierarchy and how the classes work together to manipulate resources in the service.
-->

The Text Analytics client is a [TextAnalyticsClient](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/textanalyticsclient) object that authenticates to Azure using your key. The client provides several methods for analyzing text, as a single string, or a batch.

Text is sent to the API as a list of `documents`, which are `dictionary` objects containing a combination of `id`, `text`, and `language` attributes depending on the method used. The `text` attribute stores the text to be analyzed in the origin `language`, and the `id` can be any value. 

The response object is a list containing the analysis information for each document. 

## Code examples
<!-- If you add more code examples, add a link to them here-->
* [Client Authentication](#client-authentication)
* [Language Detection](#language-detection)
* [Sentiment Analysis](#sentiment-analysis)
* [Key Phrase Extraction](#key-phrase-extraction)
* [Named Entity Recognition](#named-entity-recognition)
* [Recognition of Personally Identifiable Information](#recognition-of-personally-identifiable-information)
* [Linked Entity Recognition](#linked-entity-recognition)

## Client Authentication

Create a new [TextAnalyticsClient](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-textanalytics/textanalyticsclient) object with `credentials` and `endpoint` as a parameter.

```javascript
const client = new TextAnalyticsClient(endpoint,  new CognitiveServicesCredential(subscription_key));
```

## Language detection
<!-- TODO: Change description pointing to the latest methods and classes -->

```javascript
async function languageDetection(client) {

    const languageInputArray = [
        "This is a document written in English.",
        "Este es un document escrito en Español.",
        "这是一个用中文写的文件"
    ]

    const languageResult = await client.detectLanguages(languageInputArray);

    result.forEach(document => {
        console.log(`ID: ${document.id}`);
        document.detectedLanguages.forEach(language =>
        console.log(`\tDetected Language ${language.name}`) // Q: Do we need to show both of the languages ? (Detected vs Primary)
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
        Detected Language English
        Primary Language English
ID: 1
        Detected Language Spanish
        Primary Language Spanish
ID: 2
        Detected Language Chinese_Simplified
        Primary Language Chinese_Simplified
```

## Sentiment analysis

<!-- TODO: Change description pointing to the latest methods and classes -->

```javascript
async function sentimentAnalysis(client){

    const sentimentInput = [
        "I had the best day of my life.",
        "This was a waste of my time. The speaker put me to sleep.",
        "No tengo dinero ni nada que dar...",
        "I am happy for my friend. But I am sad for myself."
    ]

    const sentimentResult = await client.analyseSentiment(sentimentInput);
    result.forEach(document => {
        console.log(`ID: ${document.id}`);
        console.log(`\tDocument Sentiment: ${document.sentiment}`);
        console.log(`\tDocument Scores:`);
        console.log(`\t\tPositive: ${document.documentScores.positive} \tNegative: ${document.documentScores.negative} \tNeutral: ${document.documentScores.neutral}`);
        console.log(`\tSentences Sentiment(${document.sentences.length}):`);
        document.sentences.forEach(sentence => {
            console.log(`\t\tSentence sentiment: ${sentence.sentiment}`)
            console.log(`\t\tSentences Scores:`);
            console.log(`\t\tPositive: ${sentence.sentenceScores.positive} \tNegative: ${sentence.sentenceScores.negative} \tNeutral: ${sentence.sentenceScores.neutral}`);
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
                Positive: 0.9992358684539795    Negative: 0.0001150449024863    Neutral: 0.0006491420208476
        Sentences Sentiment(1):
                Sentence sentiment: positive
                Sentences Scores:
                Positive: 0.9992358684539795    Negative: 0.0001150449024863    Neutral: 0.0006491420208476
                Length: 30, Offset: 0
ID: 1
        Document Sentiment: negative
        Document Scores:
                Positive: 0.0611404217779636    Negative: 0.513175904750824     Neutral: 0.4256836175918579
        Sentences Sentiment(2):
                Sentence sentiment: negative
                Sentences Scores:
                Positive: 0.0000168700626091    Negative: 0.999976396560669     Neutral: 0.0000066324328145
                Length: 28, Offset: 0
                Sentence sentiment: neutral
                Sentences Scores:
                Positive: 0.1222639754414558    Negative: 0.0263753551989794    Neutral: 0.8513606190681458
                Length: 28, Offset: 29
ID: 2
        Document Sentiment: negative
        Document Scores:
                Positive: 0.0255409516394138    Negative: 0.9430333375930786    Neutral: 0.0314255990087986
        Sentences Sentiment(1):
                Sentence sentiment: negative
                Sentences Scores:
                Positive: 0.0255409516394138    Negative: 0.9430333375930786    Neutral: 0.0314255990087986
                Length: 34, Offset: 0
ID: 3
        Document Sentiment: mixed
        Document Scores:
                Positive: 0.484170526266098     Negative: 0.4965281188488007    Neutral: 0.0193013790994883
        Sentences Sentiment(2):
                Sentence sentiment: positive
                Sentences Scores:
                Positive: 0.9675248861312866    Negative: 0.0011864280095324    Neutral: 0.0312887355685234
                Length: 25, Offset: 0
                Sentence sentiment: negative
                Sentences Scores:
                Positive: 0.0008161555742845    Negative: 0.9918698072433472    Neutral: 0.0073140212334692
                Length: 24, Offset: 26
```

## Key phrase extraction
<!-- TODO: Change description pointing to the latest methods and classes -->

```javascript
async function keyPhraseExtraction(client){

    const keyPhrasesInput = [
        "猫は幸せ",
        "Fahrt nach Stuttgart und dann zum Hotel zu Fu.",
        "My cat might need to see a veterinarian.",
        "A mi me encanta el fútbol!"
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
<!-- Q- When compared with V2 the extracted key phrases are different. Is this a good example ?
[
    { id: '1', keyPhrases: [ '幸せ' ] }
    { id: '2', keyPhrases: [ 'Stuttgart', "hotel", "Fahrt", "Fu" ] }
    { id: '3', keyPhrases: [ 'cat', 'veterinarian' ] }
    { id: '3', keyPhrases: [ 'fútbol' ] }
] -->

```console
ID: 0
        Document Key Phrases: 猫は幸せ
ID: 1
        Document Key Phrases: Fahrt nach Stuttgart und dann zum Hotel zu Fu
ID: 2
        Document Key Phrases: cat,veterinarian
ID: 3
        Document Key Phrases: mi,encanta,fútbol
```

## Named Entity Recognition

<!-- TODO: Change description pointing to the latest methods and classes -->

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

## Recognition of Personally Identifiable Information
<!-- TODO: Add description for PII and updated links-->

```javascript
async function entityPiiRecognition(client){

    const entityPiiInput = [
        "Insurance policy for SSN on file 123-12-1234 is here by approved.",
        "Your ABA number - 111000025 - is the first 9 digits in the lower left hand corner of your personal check.",
        "Is 998.214.865-68 your Brazilian CPF number?"
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
Document ID: 1
        Name: 111000025         Type: ABA Routing Number        Sub Type: N/A
        Offset: 18, Length: 9   Score: 0.75
Document ID: 2
        Name: 998.214.865-68    Type: Brazil CPF Number         Sub Type: N/A
        Offset: 3, Length: 14   Score: 0.85
```

## Linked Entity Recognition
<!-- TODO: Add description for Linked Entity Recognition and updated links-->

```javascript
async function linkedEntityRecognition(client){

    const linkedEntityInput = [
        "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800. During his career at Microsoft, Gates held the positions of chairman, chief executive officer, president and chief software architect, while also being the largest individual shareholder until May 2014."
    ]
    const entityResults = await client.recognizeLinkedEntities(linkedEntityInput);

    result.forEach(document => {
        console.log(`Document ID: ${document.id}`);
        document.entities.forEach(entity => {
            console.log(`\tName: ${entity.name} \tID: ${entity.id} \tURL: ${entity.url} \tData Source: ${entity.dataSource}`);
            console.log(`\tMatches:`)
            entity.matches.forEach(match => {
                console.log(`\t\tText: ${match.text}`);
                console.log(`\t\tOffset: ${match.offset}, Length: ${match.length} \tScore: ${match.score}`);
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
                Name: Altair 8800
                Offset: 116, Length: 11         Score: 0.6497076686568852
        Name: Bill Gates        ID: Bill Gates  URL: https://en.wikipedia.org/wiki/Bill_Gates   Data Source: Wikipedia
        Matches:
                Name: Bill Gates
                Offset: 25, Length: 10  Score: 0.24316751200861875
                Name: Gates
                Offset: 161, Length: 5  Score: 0.24316751200861875
        Name: Paul Allen        ID: Paul Allen  URL: https://en.wikipedia.org/wiki/Paul_Allen   Data Source: Wikipedia
        Matches:
                Name: Paul Allen
                Offset: 40, Length: 10  Score: 0.1741547531559975
        Name: Microsoft         ID: Microsoft   URL: https://en.wikipedia.org/wiki/Microsoft    Data Source: Wikipedia
        Matches:
                Name: Microsoft
                Offset: 0, Length: 9    Score: 0.1958064065029148
                Name: Microsoft
                Offset: 150, Length: 9  Score: 0.1958064065029148
        Name: April 4   ID: April 4     URL: https://en.wikipedia.org/wiki/April_4      Data Source: Wikipedia
        Matches:
                Name: April 4
                Offset: 54, Length: 7   Score: 0.1372928982221484
        Name: BASIC     ID: BASIC       URL: https://en.wikipedia.org/wiki/BASIC        Data Source: Wikipedia
        Matches:
                Name: BASIC
```

## Run the application

Run the application with the `node` command on your quickstart file.

```console
node index.js
```
