---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 04/22/2022
ms.author: aahi
ms.custom: language-service-custom-classification, event-tier1-build-2022
---

To test your deployed models within [Language Studio](https://aka.ms/LanguageStudio):

1. Select **Test model** from the menu on the left side of the screen.

2. Select the model you want to test. You can only test models that are assigned to deployments. 

3. For multilingual projects, select the language of the text you're testing using the language dropdown.

4. Select the deployment you want to query/test from the dropdown.

5. Enter the text you want to submit in the request, or upload a `.txt` file to use.

6. Click on **Run the test** from the top menu.

7. In the **Result** tab, you can see the predicted classes for your text. You can also view the JSON response under the **JSON** tab. The following example is for a multi label classification project. A single label classification project will only return one class in the result. 

    :::image type="content" source="../../media/test-model-results.png" alt-text="A screenshot showing model test results for a multi label classification project. The example is from CMU Movie Summary, CC BY-SA 3.0, modified by Microsoft" lightbox="../../media/test-model-results.png":::
