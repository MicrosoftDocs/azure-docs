---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
---

To deploy your model from within the [Language Studio](https://aka.ms/LanguageStudio):

1. Select **Deploying a model** from the left side menu.

2. Select **Add deployment** to start a new deployment job.

    :::image type="content" source="../../media/add-deployment-model.png" alt-text="A screenshot showing the model deployment button in Language Studio." lightbox="../../media/add-deployment-model.png":::

3. Select **Create new deployment** to create a new deployment and assign a trained model from the dropdown below. You can also **Overwrite an existing deployment** by selecting this option and select the trained model you want to assign to it from the dropdown below.

    > [!NOTE]
    > Overwriting an existing deployment doesn't require changes to your [prediction API](https://aka.ms/clu-apis) call, but the results you get will be based on the newly assigned model.
    
    :::image type="content" source="../../media/create-deployment-job.png" alt-text="A screenshot showing the screen for adding a new deployment in Language Studio." lightbox="../../media/create-deployment-job.png":::

4. If you're connecting one or more [LUIS](https://aka.ms/luis-docs) applications or [conversational language understanding](https://aka.ms/clu-docs) projects, you have to specify the deployment name.
    
    * No configurations are required for custom question answering or unlinked intents.
    
    * LUIS projects **must be published** to the slot configured during the Orchestration deployment, and custom question answering KBs must also be published to their Production slots.

5. Select **Deploy** to submit your deployment job

6. After deployment is successful, an expiration date will appear next to it. [Deployment expiration](../../../concepts/model-lifecycle.md#expiration-timeline) is when your deployed model will be unavailable to be used for prediction, which typically happens **twelve** months after a training configuration expires.
