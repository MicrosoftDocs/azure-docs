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
ms.date: 04/17/2019
ms.author: shthowse
---

# Quickstart: Using Node.js to call the Text Analytics Cognitive Service
<a name="HOLTop"></a>

Use this quickstart to begin analyzing language with the Text Analytics SDK for Node.js. While the [Text Analytics](//go.microsoft.com/fwlink/?LinkID=759711) REST API is compatible with most programming languages, the SDK provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples/blob/master/Samples/textAnalytics.js).

Refer to the [API definitions](//go.microsoft.com/fwlink/?LinkID=759346) for technical documentation for the APIs.

## Prerequisites

[!INCLUDE [cognitive-services-text-analytics-signup-requirements](../../../../includes/cognitive-services-text-analytics-signup-requirements.md)]

You must also have the [endpoint and access key](../How-tos/text-analytics-how-to-access-key.md) that was generated for you during sign-up.

> [!Tip]
>  While you could call the [HTTP endpoints](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v2-1/operations/56f30ceeeda5650db055a3c9) directly from Javascript, the Microsoft.Azure.CognitiveServices.Language SDK makes it much easier to call the service without having to worry about serializing and deserializing JSON.
>
> A few useful links:
> - [SDK npm package](https://www.npmjs.com/package/azure-cognitiveservices-textanalytics)
> - [SDK code](https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/cognitiveServicesTextAnalytics)

## Create the solution and install the SDK

- Create node project.
    - ```mkdir myapp && cd myapp```
    - Run ```npm init``` and follow the steps
    - This will create a node application with a packaje.json file
- Install the `ms-rest-azure` and `azure-cognitiveservices-textanalytics` NPM packages
    - ```npm install azure-cognitiveservices-textanalytics ms-rest-azure```
    - This will update the package.json with the dependencies.

## Authenticate your credentials

1. Create a new file `index.js` in the project root and import the installed libraries

    ```javascript
    const CognitiveServicesCredentials = require("ms-rest-azure").CognitiveServicesCredentials;
    const TextAnalyticsAPIClient = require("azure-cognitiveservices-textanalytics");
    ```

2. Create a variable for your Text Analytics subscription key.

    ```javascript
    let credentials = new CognitiveServicesCredentials(
      "enter-your-key-here"
    );
    ```
> [!Tip]
> For secure deployment of secrets in production systems we recommend using [Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/quick-create-net)
>

## Create a Text Analytics client

Create a new `TextAnalyticsClient` object with `credentials` as a parameter. Use the correct Azure region for your Text Analytics subscription.

   ```javascript
        let client = new TextAnalyticsAPIClient(
          credentials,
          "https://westus.api.cognitive.microsoft.com/"
        );
   ```

## Sentiment analysis

1. Create a new function called `sentimentAnalysisExample()` that takes the client created earlier. Create a list of objects, containing the documents you want to analyze.

    ```javascript
    sentimentAnalysisExample(){

        const inputDocuments = {documents:[
            {language:"en", id:"1", text:"I had the best day of my life."},
            {language:"en", id:"2", text:"This was a waste of my time. The speaker put me to sleep."},
            {language:"es", id:"3", text:"No tengo dinero ni nada que dar..."},
            {language:"it", id:"4", text:"L'hotel veneziano era meraviglioso. È un bellissimo pezzo di architettura."}
          ]}
    }
    ```

2. In the same function, call `client.sentiment` and get the result. Then iterate through the results, and print each document's ID, and sentiment score. A score closer to 0 indicates a negative sentiment, while a score closer to 1 indicates a positive sentiment.

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

3. Call your function `sentimentAnalysisExample()` and run your the app by executing `node index.js`
### Output

```console
id: 1, score: 0.87
id: 2, score: 0.11
id: 3, score: 0.44
id: 4, score: 1.00
```

## Language detection

1. Create a new function called `detectLanguageExample()` that takes the client created earlier. Create a list of Input objects, containing your documents.

    ```javascript
    static async Task DetectLanguageExample(TextAnalyticsClient client)
    {
        // The documents to be submitted for language detection. The ID can be any value.
            const inputDocuments = [
                { id: "1", text: "This is a document written in English." },
                { id: "2", text: "Este es un document escrito en Español." },
                { id: "3", text: "这是一个用中文写的文件" }
            ];
    }
    ```

2. In the same function, call `client.detectLanguage()` and get the result. Then iterate through the results, and print each document's ID, and the first returned language.

    ```javascript
        const operation = client.detectLanguage({
          languageBatchInput: inputDocuments
        });
        operation
          .then(result => {
            result.documents.forEach(document => {
              console.log(
                `ID: ${document.id}`,
                `Language ${document.detectedLanguages}`
              );
            });
          })
          .catch(err => {
            throw err;
          });
    ```

4. Call your function `detectLanguageExample()` and run the app by executing `node index.js`

### Output

```console
===== LANGUAGE EXTRACTION ======
ID: 1 Language English
ID: 2 Language Spanish
ID: 3 Language Chinese_Simplified
```

## Entity recognition

1. Create a new function called `recognizeEntitiesExample()` that takes the client created earlier. Create a list of objects, containing your documents.

    ```javascript
    'TODO: code here'
    "en", "1", "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800.
    "es", "2", "La sede principal de Microsoft se encuentra en la ciudad de Redmond, a 21 kilómetros de Seattle."
    }
    ```

2. In the same function, call `client.EntitiesAsync() TODO:check` and get the result. Then iterate through the results, and print each document's ID. For each detected entity, print it's wikipedia name, the type and sub-types (if exists) as well as the locations in the original text.

    ```javascript
    'code here'
    ```

4. Call your function `recognizeEntitiesExample()` and run your the app by executing `node index.js`

### Output

```console
Document ID: 1
         Entities:
                Name: Microsoft,        Type: Organization,     Sub-Type: N/A
                        Offset: 0,      Length: 9,      Score: 1.000
                Name: Bill Gates,       Type: Person,   Sub-Type: N/A
                        Offset: 25,     Length: 10,     Score: 1.000
                Name: Paul Allen,       Type: Person,   Sub-Type: N/A
                        Offset: 40,     Length: 10,     Score: 0.999
                Name: April 4,  Type: Other,    Sub-Type: N/A
                        Offset: 54,     Length: 7,      Score: 0.800
                Name: April 4, 1975,    Type: DateTime, Sub-Type: Date
                        Offset: 54,     Length: 13,     Score: 0.800
                Name: BASIC,    Type: Other,    Sub-Type: N/A
                        Offset: 89,     Length: 5,      Score: 0.800
                Name: Altair 8800,      Type: Other,    Sub-Type: N/A
                        Offset: 116,    Length: 11,     Score: 0.800
Document ID: 2
         Entities:
                Name: Microsoft,        Type: Organization,     Sub-Type: N/A
                        Offset: 21,     Length: 9,      Score: 1.000
                Name: Redmond (Washington),     Type: Location, Sub-Type: N/A
                        Offset: 60,     Length: 7,      Score: 0.991
                Name: 21 kilómetros,    Type: Quantity, Sub-Type: Dimension
                        Offset: 71,     Length: 13,     Score: 0.800
                Name: Seattle,  Type: Location, Sub-Type: N/A
                        Offset: 88,     Length: 7,      Score: 1.000
```

## Key phrase extraction

1. Create a new function called `keyPhraseExtractionExample()` that takes the client created earlier. Create a list of objects, containing your documents.

    ```javascript
    TODO: 
                        "ja", "1", "猫は幸せ"
                        "de", "2", "Fahrt nach Stuttgart und dann zum Hotel zu Fu."
                        "en", "3", "My cat might need to see a veterinarian."
                        "es", "4", "A mi me encanta el fútbol!"
    }
    ```

2. In the same function, call `client.KeyPhrasesAsync() TODO:check` and get the result. Then iterate through the results, and print each document's ID, and any detected key phrases.

    ```javascript
        'code here'
    ```

4. Call your function `keyPhraseExtractionExample()` and run your the app by executing `node index.js`

### Output

```console
Document ID: 1
         Key phrases:
                幸せ
Document ID: 2
         Key phrases:
                Stuttgart
                Hotel
                Fahrt
                Fu
Document ID: 3
         Key phrases:
                cat
                rock
Document ID: 4
         Key phrases:
                fútbol
```

## Next steps

> [!div class="nextstepaction"]
> [Text Analytics With Power BI](../tutorials/tutorial-power-bi-key-phrases.md)

## See also

 [Text Analytics overview](../overview.md)
 [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)
