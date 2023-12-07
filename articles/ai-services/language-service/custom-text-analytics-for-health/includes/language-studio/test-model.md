---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 04/14/2023
ms.author: aahi
ms.custom: language-service-custom-text-analytics-for-health-model-testing
---

To test your deployed models from within the [Language Studio](https://aka.ms/LanguageStudio):
1. Select **Testing deployments** from the left side menu.

2. Select the deployment you want to test. You can only test models that are assigned to deployments. 

3. Select the deployment you want to query/test from the dropdown.

4. You can enter the text you want to submit to the request or upload a `.txt` file to use.

5. Select **Run the test** from the top menu.

6. In the **Result** tab, you can see the extracted entities from your text and their types. You can also view the [JSON response](../../how-to/call-api.md#get-task-results) under the **JSON** tab.

    :::image type="content" source="../../media/test-model-results.png" alt-text="A screenshot showing the deployment testing screen in Language Studio." lightbox="../../media/test-model-results.png":::

