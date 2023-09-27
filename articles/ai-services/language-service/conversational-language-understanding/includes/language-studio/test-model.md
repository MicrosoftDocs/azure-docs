---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 10/26/2022
ms.author: aahi
---

To test your deployed models from within the [Language Studio](https://aka.ms/LanguageStudio):
1. Select **Testing deployments** from the left side menu.

1. For multilingual projects, from the **Select text language** dropdown, select the language of the utterance you're testing.

1. From the **Deployment name** dropdown, select the deployment name corresponding to the model that you want to test. You can only test models that are assigned to deployments.

1. In the text box, enter an utterance to test. For example, if you created an application for email-related utterances you could enter *Delete this email*. 

1. Towards the top of the page, select **Run the test**.

1. After you run the test, you should see the response of the model in the result. You can view the results in entities cards view or view it in JSON format.

    <!--:::image type="content" source="../../media/test-model.png" alt-text="A screenshot showing testing the model." lightbox="../../media/test-model.png":::-->

