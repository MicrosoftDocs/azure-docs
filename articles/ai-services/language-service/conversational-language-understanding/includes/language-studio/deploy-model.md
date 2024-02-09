---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 06/29/2022
ms.author: aahi
---


To deploy your model from within the [Language Studio](https://aka.ms/LanguageStudio):

1. Select **Deploying a model** from the left side menu.

1. Select **Add deployment** to start the **Add deployment** wizard.

    :::image type="content" source="../../media/add-deployment-model.png" alt-text="A screenshot showing the model deployment button in Language Studio." lightbox="../../media/add-deployment-model.png":::

1. Select **Create a new deployment name** to create a new deployment and assign a trained model from the dropdown below. You can otherwise select **Overwrite an existing deployment name** to effectively replace the model that's used by an existing deployment.

    > [!NOTE]
    > Overwriting an existing deployment doesn't require changes to your [Prediction API](https://aka.ms/clu-runtime-api) call but the results you get will be based on the newly assigned model.
    
    :::image type="content" source="../../media/create-deployment-job.png" alt-text="A screenshot showing the screen for adding a new deployment in Language Studio." lightbox="../../media/create-deployment-job.png":::

1. Select a trained model from the **Model** dropdown. 

1. Select **Deploy** to start the deployment job.

1. After deployment is successful, an expiration date will appear next to it. [Deployment expiration](../../../concepts/model-lifecycle.md#expiration-timeline) is when your deployed model will be unavailable to be used for prediction, which typically happens **twelve** months after a training configuration expires.
