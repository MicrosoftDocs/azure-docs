---
titleSuffix: Azure AI services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 05/09/2022
ms.author: aahi
---

1. After the deployment job is completed successfully, select the deployment you want to use and from the top menu select **Get prediction URL**.

    :::image type="content" source="../../../media/custom/get-prediction-url-1.png" alt-text="A screenshot showing the button to get a prediction URL." lightbox="../../../media/custom/get-prediction-url-1.png":::

2. In the window that appears, under the **Submit** pivot, copy the sample request URL and body. Replace the placeholder values such as `YOUR_DOCUMENT_HERE` and `YOUR_DOCUMENT_LANGUAGE_HERE` with the actual text and language you want to process.

4. Submit the `POST` cURL request in your terminal or command prompt. You'll receive a 202 response with the API results if the request was successful.

5. In the response header you receive extract `{JOB-ID}` from `operation-location`, which has the format: `{ENDPOINT}/language/analyze-text/jobs/<JOB-ID}>`

6. Back to Language Studio; select **Retrieve** pivot from the same window you got the example request you got earlier and copy the sample request into a text editor. 

7. Add your job ID after `/jobs/` to the URL, using the ID you extracted from the previous step. 

8. Submit the `GET` cURL request in your terminal or command prompt.
