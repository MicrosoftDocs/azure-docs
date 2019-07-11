---
title: Container support
titleSuffix: Azure Cognitive Services
description: Learn how to verify the sentiment analysis container instance.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 06/26/2019
ms.author: dapine
---

## Verify the Sentiment Analysis container instance

1. Select the **Overview** tab and copy the IP address.
1. Open a new browser tab and use the IP address, for example, `http://<IP-address>:5000 (http://55.55.55.55:5000`). The container's home page is presented, letting you know the container is running.

    ![View the Container homepage to verify it is running](../media/how-tos/container-instance/swagger-docs-on-container.png)

1. Select the **Service API Description** link to navigate to the containers swagger page.

1. Choose any of the **POST** APIs and select **Try it out**.  The parameters are displayed including the example input:

    ```json
    {
      "documents": [
        {
          "language": "en",
          "id": "1",
          "text": "Hello world. This is some input text that I love."
        },
        {
          "language": "fr",
          "id": "2",
          "text": "Bonjour tout le monde"
        },
        {
          "language": "es",
          "id": "3",
          "text": "La carretera estaba atascada. Había mucho tráfico el día de ayer."
        }
      ]
    }
    ```

1. Replace the input with the following JSON:

    ```json
    {
      "documents": [
        {
          "language": "en",
          "id": "7",
          "text": "I was fortunate to attend the KubeCon Conference in Barcelona, it is one of the best conferences I have ever attended. Great people, great sessions and I thoroughly enjoyed it!"
        }
      ]
    }
    ```

1. Set **showStats** to true.

1. Select **Execute** to determine the sentiment of the text.

    The model packaged in the container generates a score ranging from 0 to 1, where 0 is negative and 1 is positive.

    The JSON response returned includes sentiment for the updated text input:

    ```json
    {
      "documents": [
      {
        "id": "7",
        "score": 0.9826303720474243,
        "statistics": {
          "charactersCount": 176,
            "transactionsCount": 1
          }
        }
      ],
      "errors": [],
      "statistics": {
        "documentsCount": 1,
        "validDocumentsCount": 1,
        "erroneousDocumentsCount": 0,
        "transactionsCount": 1
      }
    }
    ```

We can now correlate the document `id` of the response payloads JSON to the original request payload document `id`, and see that there was a score of over `.98` indicating a very positive sentiment.