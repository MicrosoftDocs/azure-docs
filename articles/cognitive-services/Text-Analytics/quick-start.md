---
title: 'Analyze keywords and phrases, sentiment and language in 10 minutes (Microsoft Cognitive Services on Azure) | Microsoft Docs'
description: Learn the Text Analytics REST API in Microsoft Cognitive Services on Azure in this ten minute walkthrough tutorial.
services: cognitive-services
author: luisca
manager: 

ms.service: cognitive-services
ms.technology: text-analytics
ms.topic: article
ms.date: 08/24/2017
ms.author: luisca

---

# Analyze keywords, sentiment, and language in 10 minutes

In this Quickstart, learn how to call the [**Text Analytics REST APIs**](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c7) to perform key phrase extraction, sentiment analysis, and language detection on text provided in requests to [Microsoft Cognitive Services](https://azure.microsoft.com/services/cognitive-services/).

To complete this Quickstart, you need an interactive tool for sending HTTP requests. 

+ [Chrome Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop), [Telerik Fiddler](https://www.telerik.com/download/fiddler), or other Web API testing tool, if you have one. 
+ You can also use the built-in console app in our REST API documentation pages to interact with each API individually. To use the console, click **Open API testing console** on any [doc page](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/56f30ceeeda5650db055a3c6).

> [!Tip]
> For one-off interactions, we recommend the built-in console. There is no setup and user requirements consist only of the access key and the JSON documents you paste into the request. 
>
> For ongoing experimentation, we suggest a web API testing tool like Postman or Fiddler. A tool persists your request headers and content. You can make incremental changes, including switching to another operation, without having to start over with each new request.

## Before you begin

To use Microsoft Cognitive Service APIs, create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) in the Azure portal. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

> [!Note]
> Cognitive Services has many APIs. Billing, policies, and release cycles vary for each API, so we ask you to sign up for each one individually. To find out if your subscription already has Text Analytics, enter "text analytics" in the portal's search box.

## Set up a request in Postman

In this first exercise, structure the request, using key phrase extraction as the first analysis.

Text Analytics APIs invoke operations against pretrained models and machine learning algorithms running in Azure data centers. You need your own key to access the operations, which is generated for you when you sign up. 

Endpoints for each operation include the resource providing the underlying algorithms used for a particular analysis: **sentiment analysis**, **key phrase extraction**, and **language detection**. Each request must specify which resource to use. We list them in the next step.

1. In the [Azure portal](https://portal.azure.com), open the Text Analytics page. If it's not pinned to dashboard, search for "text analytics" to find the page. Leave the page open so that you can copy an access key and endpoint.

   ![Portal page with endpoint and keys](../media/text-analytics/portal-keys-endpoint.png)

3. Set up the request:

   + Choose **Post** as the request type.
   + Paste in the endpoint you copied from the portal page.
   + Append a resource. In this exercise, start with **/keyPhrases**.

  Endpoints for each available resource are as follows (your region may vary):

   + `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment`
   + `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases`
   + `https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/languages`

4. Set three request headers:

   + `Ocp-Apim-Subscription-Key` set to your access key, obtained from Azure portal.
   + `Content-Type` set to application/json.
   + `Accept` set to application/json.

  Your request should look similar to the following screenshot:

   ![Request screenshot with endpoint and headers](../media/text-analytics/postman-request-keyphrase-1.png)

* **Sentiment** - Is text positive or negative?
* **Key phrases** - What are people discussing in a single article?
* **Languages** - What language is text written in?

   ![Request screenshot with body settings](../media/text-analytics/postman-request-body-raw.png)

5. Paste in some JSON documents: 

   ```
    {
        "documents": [
            {
                "language": "en",
                "id": "1",
                "text": "We love this trail and make the trip every year. The views are breathtaking and well worth the hike!"
            },
            {
                "language": "en",
                "id": "2",
                "text": "Poorly marked trails! I thought we were goners. Worst hike ever."
            },
            {
                "language": "en",
                "id": "3",
                "text": "Everyone in my family liked the trail but thought it was too challenging for the less athletic among us. Not necessarily recommended for small children."
            },
            {
                "language": "en",
                "id": "4",
                "text": "It was foggy so we missed the spectacular views, but the trail was ok. Worth checking out if you are in the area."
            },                
            {
                "language": "en",
                "id": "5",
                "text": "Me encanta este sendero. Tiene hermosas vistas y muchos lugares para detenerse y descansar"
            }
        ]
    }
```

> [!Note]
> A Spanish string is included to demonstrate [language detection](#detect-language) and other behaviors, described in a following section. It is incorrectly tagged as `en` to demonstrate the effects of setting the wrong language.

### About the request body

Input rows must be JSON in raw unstructured text. XML is not supported. The schema is simple, consisting of the elements described in the following list. You can use the same documents for all three operations: sentiment, key phrase, and language detection.

+ `id` is required. The data type is string, but in practice document IDs tend to be integers. The system uses the IDs you provide to structure the output. Language codes, keywords, and sentiment scores are generated for each ID.

+ `text` field is requred and contains unstructured raw text, up to 10 KB. For more information about limits, see [Text Analytics Overview > Data limits](overview.md#data-limits). 

+ `language` is used only in sentiment analysis and key phrase extraction. It is ignored in language detection. 

> [!Note]
> For both sentiment analysis and key phrase extraction, `language` is an optional parameter. If `language` is wrong, results of the analysis might be incorrect or suboptimal. If `language` is missing, the system performs language detection prior to sentiment or key phrase analysis. This can slow down operations. For this reason, we recommend including an accurate language code in the request, assuming you know what it is. For more information about which languages are supported, see [Text Analytics Overview > Supported Languages](overview.md#supported-languages).

## Key phrase extraction

1. Compare the screenshots against your tool to verify the request is configured correctly.

2. Click **Send** to submit the request.

All POST requests return a JSON formatted response with the IDs and detected properties. An example of the output for key phrase extraction is shown next:

```
{
    "documents": [
        {
            "keyPhrases": [
                "year",
                "trail",
                "trip",
                "views"
            ],
            "id": "1"
        },
        {
            "keyPhrases": [
                "Worst hike",
                "trails",
                "goners"
            ],
            "id": "2"
        },
        {
            "keyPhrases": [
                "family",
                "trail",
                "us",
                "small children"
            ],
            "id": "3"
        },
        {
            "keyPhrases": [
                "spectacular views",
                "trail",
                "Worth",
                "area"
            ],
            "id": "4"
        },
        {
            "keyPhrases": [
                "Tiene hermosas vistas y muchos lugares para detenerse y descansar",
                "encanta este sendero"
            ],
            "id": "5"
        }
    ],
    "errors": []
}
```

### Review the output

Comparing inputs and outputs side by side helps us understand key phrase extraction operations. The analyzer finds and discards non-essential words, and keeps single terms or phrases that appear to be the subject or object of a sentence. 

| ID | Input | key phrase output | 
|----|-------|------|
| 1 | "We love this trail and make the trip every year. The views are breathtaking and well worth the hike!" | "year", "trail", "trip", "views"" |
| 2 | "Poorly marked trails! I thought we were goners. Worst hike ever." | "Worst hike",  "trails", "goners" |
| 3 | "Everyone in my family liked the trail but thought it was too challenging for the less athletic among us. Not necessarily recommended for small children." | "family", "trail", "us", "small children"|
| 4 | "It was foggy so we missed the spectacular views, but the trail was ok. Worth checking out if you are in the area." | "spectacular views", "trail", "Worth", "area" |
| 5 | ""Me encanta este sendero. Tiene hermosas vistas y muchos lugares para detenerse y descansar" | "Tiene hermosas vistas y muchos lugares para detenerse y descansar", "encanta este sendero"|


## Next steps

+ [Visit the product page](//go.microsoft.com/fwlink/?LinkID=759712) to try out an interactive demo of the APIs. Submit text, choose an analysis, and view results without writing any code.

+ [Visit API reference documentation](//go.microsoft.com/fwlink/?LinkID=759346) for technical documentation for the APIs. Documentation embeds interactive requests so that you can call the API from each documentation page.

+ To see how the Text Analytics API can be used as part of a bot, see the [Emotional Bot](http://docs.botframework.com/bot-intelligence/language/#example-emotional-bot) example on the Bot Framework site.

+ [Visit this page](text-analytics-resource-external-community.md) for a list of blog posts and videos demonstrating how to use Text Analytics with other tools and technologies.

## See also 

 [Welcome to Text Analytics in Microsoft Cognitive Services on Azure](overview.md)  
 [Frequently asked questions (FAQ)](text-analytics-resource-faq.md)