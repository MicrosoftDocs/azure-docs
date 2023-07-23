---
services: cognitive-services
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 05/15/2023
ms.author: jboback
---

To test your deployed models from within the [Language Studio](https://aka.ms/LanguageStudio):
1. Select **Testing deployments** from the left side menu.

2. Select the deployment you want to test. You can only test models that are assigned to deployments. 

3. For multilingual projects, from the language dropdown, select the language of the text you are testing.

3. Select the deployment you want to query/test from the dropdown.

4. You can enter the text you want to submit to the request or upload a `.txt` file to use.

5. Select **Run the test** from the top menu.

6. In the **Result** tab, you can see the extracted entities from your text and their types. You can also view the JSON response under the **JSON** tab.

    :::image type="content" source="../../../media/custom/language-studio/test-model-results.png" alt-text="View the test results"../../../media/custom/language-studio/test-model-results.png":::
