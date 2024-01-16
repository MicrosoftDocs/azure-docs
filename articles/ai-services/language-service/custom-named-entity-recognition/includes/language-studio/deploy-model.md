---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
---

To deploy your model from within the [Language Studio](https://aka.ms/LanguageStudio):

1. Select **Deploying a model** from the left side menu.

2. Select **Add deployment** to start a new deployment job.

    :::image type="content" source="../../media/deploy-model.png" alt-text="A screenshot showing the deployment button" lightbox="../../media/deploy-model.png":::

3. Select **Create new deployment** to create a new deployment and assign a trained model from the dropdown below. You can also **Overwrite an existing deployment** by selecting this option and select the trained model you want to assign to it from the dropdown below.

    > [!NOTE]
    > Overwriting an existing deployment doesn't require changes to your [prediction API](https://aka.ms/ct-runtime-swagger) call but the results you get will be based on the newly assigned model.
    
   :::image type="content" source="../../media/add-deployment.png" alt-text="A screenshot showing the deployment screen" lightbox="../../media/add-deployment.png":::
     
4. Select **Deploy** to start the deployment job.

5. After deployment is successful, an expiration date will appear next to it. [Deployment expiration](../../../concepts/model-lifecycle.md#expiration-timeline) is when your deployed model will be unavailable to be used for prediction, which typically happens **twelve** months after a training configuration expires.
