---
title: Verify the Key Phrase Extraction container instance
titleSuffix: Azure Cognitive Services
description: Learn how to verify the Key Phrase Extraction container instance.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 04/01/2020
ms.author: aahi
---

### Verify the Key Phrase Extraction container instance

1. Select the **Overview** tab, and copy the IP address.
1. Open a new browser tab, and enter the IP address. For example, enter `http://<IP-address>:5000 (http://55.55.55.55:5000`). The container's home page is displayed, which lets you know the container is running.

    ![View the container home page to verify that it's running](../media/how-tos/container-instance/swagger-docs-on-container.png)

1. Select the **Service API Description** link to go to the container's Swagger page.

1. Choose any of the **POST** APIs, and select **Try it out**. The parameters are displayed, which includes this example input:

    ```json
    {
      "documents": [
        {
          "id": "1",
          "text": "Hello world"
        },
        {
          "id": "2",
          "text": "Bonjour tout le monde"
        },
        {
          "id": "3",
          "text": "La carretera estaba atascada. Había mucho tráfico el día de ayer."
        },
        {
          "id": "4",
          "text": ":) :( :D"
        }
      ]
    }
    ```

1. Replace the input with the following JSON content:

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

1. Set **showStats** to `true`.

1. Select **Execute** to determine the sentiment of the text.

    The model that's packaged in the container generates a score that ranges from 0 to 1, where 0 is negative and 1 is positive.

    The JSON response that's returned includes sentiment for the updated text input:

    ```json
    {
      "documents": [
        {
          "id": "7",
          "keyPhrases": [
            "Great people",
            "great sessions",
            "KubeCon Conference",
            "Barcelona",
            "best conferences"
          ],
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

We can now correlate the document `id` of the response payload's JSON data to the original request payload document `id`. The resulting document has a `keyPhrases` array, which contains the list of key phrases that have been extracted from the corresponding input document. Additionally, there are various statistics such as `characterCount` and `transactionCount` for each resulting document.