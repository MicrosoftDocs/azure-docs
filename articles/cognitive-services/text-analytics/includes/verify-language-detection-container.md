---
title: Verify the Language Detection container instance
titleSuffix: Azure Cognitive Services
description: Learn how to verify the Language Detection container instance.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 04/01/2020
ms.author: aahi
---

### Verify the Language Detection container instance

1. Select the **Overview** tab, and copy the IP address.
1. Open a new browser tab, and enter the IP address. For example, enter `http://<IP-address>:5000 (http://55.55.55.55:5000`). The container's home page is displayed, which lets you know the container is running.

    ![View the container home page to verify that it's running](../media/how-tos/container-instance/swagger-docs-on-container.png)

1. Select the **Service API Description** link to go to the container's Swagger page.

1. Choose any of the **POST** APIs, and select **Try it out**. The parameters are displayed, which includes this example input:

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

1. Set **showStats** to `true`.

1. Select **Execute** to determine the sentiment of the text.

    The model that's packaged in the container generates a score that ranges from 0 to 1, where 0 is negative sentiment and 1 is positive sentiment.

    The JSON response that's returned includes sentiment for the updated text input:

    ```json
    {
      "documents": [
        {
          "id": "1",
          "detectedLanguages": [
            {
              "name": "English",
              "iso6391Name": "en",
              "score": 1
            }
          ],
          "statistics": {
            "charactersCount": 11,
            "transactionsCount": 1
          }
        },
        {
          "id": "2",
          "detectedLanguages": [
            {
              "name": "French",
              "iso6391Name": "fr",
              "score": 1
            }
          ],
          "statistics": {
            "charactersCount": 21,
            "transactionsCount": 1
          }
        },
        {
          "id": "3",
          "detectedLanguages": [
            {
              "name": "Spanish",
              "iso6391Name": "es",
              "score": 1
            }
          ],
          "statistics": {
            "charactersCount": 65,
            "transactionsCount": 1
          }
        },
        {
          "id": "4",
          "detectedLanguages": [
            {
              "name": "French",
              "iso6391Name": "fr",
              "score": 1
            }
          ],
          "statistics": {
            "charactersCount": 8,
            "transactionsCount": 1
          }
        }
      ],
      "errors": [],
      "statistics": {
        "documentsCount": 4,
        "validDocumentsCount": 4,
        "erroneousDocumentsCount": 0,
        "transactionsCount": 4
      }
    }
    ```

We can now correlate the documents of the response payload's JSON data to the original request payload documents by their corresponding `id`. Each document is treated independently containing various statistics such as `characterCount` and `transactionCount`. Additionally, each resulting document has the `detectedLanguages` array with the `name`, `iso6391Name`, and `score` for each language detected. When multiple languages are detected, the `score` is used to determine the most probable language.