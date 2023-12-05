---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 06/29/2022
ms.author: aahi
ms.custom: language-service-custom-classification, event-tier1-build-2022
---

To test your deployed models from within the [Language Studio](https://aka.ms/LanguageStudio):
1. Select **Testing deployments** from the left side menu.

2. Select the deployment you want to test. You can only test models that are assigned to deployments. 

3. For multilingual projects, from the language dropdown, select the language of the text you are testing.

3. Select the deployment you want to query/test from the dropdown.

4. You can enter the text you want to submit to the request or upload a `.txt` file to use.

5. Select **Run the test** from the top menu.

6. In the **Result** tab, you can see the extracted entities from your text and their types. You can also view the JSON response under the **JSON** tab.
