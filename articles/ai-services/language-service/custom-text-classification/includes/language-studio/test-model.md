---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 06/29/2022
ms.author: aahi
ms.custom: language-service-custom-classification, event-tier1-build-2022
---

To test your deployed models within [Language Studio](https://aka.ms/LanguageStudio):

1. Select **Testing deployments** from the menu on the left side of the screen.

2. Select the deployment you want to test. You can only test models that are assigned to deployments. 

3. For multilingual projects, select the language of the text you're testing using the language dropdown.

4. Select the deployment you want to query/test from the dropdown.

5. Enter the text you want to submit in the request, or upload a `.txt` document to use. If you’re using one of the example datasets, you can use one of the included .txt files.

6. Select **Run the test** from the top menu.

7. In the **Result** tab, you can see the predicted classes for your text. You can also view the JSON response under the **JSON** tab. The following example is for a single label classification project. A multi label classification project can return more than one class in the result. 

    :::image type="content" source="../../media/test-model-results.png" alt-text="A screenshot showing model test results for a single label classification project." lightbox="../../media/test-model-results.png":::
