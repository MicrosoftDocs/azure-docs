---
title: Example user scenarios for the Text Analytics API
titleSuffix: Azure Cognitive Services
description: Use this article to see some common scenarios for integrating the Text Analytics API into your services and processes. 
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 05/13/2020
ms.author: aahi
---

# Example user scenarios for the Text Analytics API

The Text Analytics API is a cloud-based service that provides advanced natural language processing over text. This article describes some example use cases for integrating the API into your business solutions and processes. 

## Analyze Survey results​

Draw insights from customer and employee survey results by processing the raw text responses using Sentiment Analysis. Aggregate the findings for analysis, follow up, and driving engagements.​

![An image describing how to perform sentiment analysis on customer and employee surveys.](media/use-cases/survey-results.svg)

## Analyze recorded inbound customer calls​

Extract insights from customer services calls using Text to Speech, Sentiment Analysis, and Key Phrase Extraction. Display the results in Power BI dashboard or a portal to better understand customers, highlight customer service trends, and drive customer engagement.​ Send API requests as a batch for reporting, or in real-time for intervention. See the sample code [on GitHub](https://github.com/rlagh2/callcenteranalytics).​

![An image describing how to automate getting insights from customer service calls using sentiment analysis](media/use-cases/azure-inbound.svg)

## Process and categorize support incidents​

Use Key Phrase Extraction and Entity Recognition to process support requests submitted in unstructured textual format. Use the extracted phrases and entities to categorize the requests for resource planning and trend analysis.

![An image describing how to use key phrase extraction and entity recognition to categorize incident reports and trends](media/use-cases/support-incidents.svg)

## Monitor your product's social media feeds​

Monitor user product feedback on your product's twitter or Facebook page. Use the data to analyze customer sentiment toward new products launches, extract key phrases about features and feature requests, or address customer complaints  as they happen. See the example [Microsoft Flow template](https://flow.microsoft.com/galleries/public/templates/2680d2227d074c4d901e36c66e68f6f9/run-sentiment-analysis-on-tweets-and-push-results-to-a-power-bi-dataset/)​.

![An image describing how to monitor your product and company feedback on social media using key phrase extraction](media/use-cases/social-feed.svg)

## Classify and redact documents that have sensitive information​

Use Named Entity Recognition to identify personal and sensitive information in documents. Use the data to classify documents or redact them so they can be shared safely.​

![An image describing how to use NER to detect personal info and classify and redact documents](media/use-cases/sensitive-docs.jpg)

## Perform opinion mining

Group opinions related to specific aspects of a product or service in surveys, customer feedback, or wherever text holds an opinion about an aspect. Use it to help guide product launches and improvements, marketing efforts, or highlight how your product or service is performing. 

> [!div class="mx-imgBorder"] 
> :::image type="content" source="media/use-cases/aspect-based-sentiment.png" alt-text="Example opinions about a hotel.":::

## Next steps

* [What is the Text Analytics API?](overview.md)
* [Send a request to the Text Analytics API using the client library](quickstarts/text-analytics-sdk.md)
