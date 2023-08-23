---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 05/20/2022
ms.author: aahi
ms.custom: language-service-orchestration 
---



1. After the deployment job is completed successfully, select the deployment you want to use and from the top menu select **Get prediction URL**.

    :::image type="content" source="../../media/get-prediction-url.png" alt-text="Screenshot showing how to get a prediction U R L." lightbox="../../media/get-prediction-url.png":::

2. In the window that appears, copy the sample request URL and body into your command line. Replace `<YOUR_QUERY_HERE>` with the actual text you want to send to extract intents and entities from.

4. Submit the `POST` cURL request in your terminal or command prompt. You'll receive a 202 response with the API results if the request was successful.
