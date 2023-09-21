---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 05/04/2022
ms.author: aahi
---

1. After the deployment job is completed successfully, select the deployment you want to use and from the top menu select **Get prediction URL**.

    :::image type="content" source="../../media/get-prediction-url-1.png" alt-text="A screenshot showing the button to get the prediction URL." lightbox="../../media/get-prediction-url-1.png":::

2. In the window that appears, under the **Submit** pivot, copy the sample request URL and body into your command line.

3. Replace `<YOUR_DOCUMENT_HERE>` with the actual text you want to extract entities from.

    :::image type="content" source="../../media/get-prediction-url-2.png" alt-text="A screenshot showing the prediction URL and sample J SON request." lightbox="../../media/get-prediction-url-2.png":::

4. Submit the `POST` cURL request in your terminal or command prompt. You'll receive a 202 response with the API results if the request was successful.

5. In the response header you receive extract `{JOB-ID}` from `operation-location`, which has the format: `{ENDPOINT}/text/analytics/v3.2-preview.2/analyze/jobs/<JOB-ID}>`

6. Back to Language Studio; select **Retrieve** pivot from the same window you got the example request you got earlier and copy the sample request into a text editor. 

    :::image type="content" source="../../media/get-prediction-url-3.png" alt-text="A screenshot showing the button to retrieval URL." lightbox="../../media/get-prediction-url-3.png":::

7. Replace `<JOB-ID>` with the `{JOB-ID}` you extracted from the previous step. 

8. Submit the `GET` cURL request in your terminal or command prompt.
