---
title: How to get V3 prediction endpoint
titleSuffix: Azure AI services
services: cognitive-services

manager: nitinme
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.topic: include
ms.date: 05/05/2020

---


1. In the LUIS portal, in the **Manage** section (top-right menu), on the **Azure Resources** page (left menu), on the **Prediction Resources** tab, copy the **Example Query** at the bottom of the page. The URL has your app ID, key, and slot name. The V3 prediction endpoint URL has the form of: `https://YOUR-RESOURCE-NAME.api.cognitive.microsoft.com/luis/prediction/v3.0/apps/APP-ID/slots/SLOT-NAME/predict?subscription-key=YOUR-PREDICTION-KEY&<optional-name-value-pairs>&query=YOUR_QUERY_HERE`

    :::image type="content" source="../media/prediction-resources-example-query.png" alt-text="example query in the prediction resources section" lightbox="../media/prediction-resources-example-query.png":::
    
    Paste the URL into a new browser tab. If you don't see the URL, you don't have a prediction resource and will need to create one. 

    

    

