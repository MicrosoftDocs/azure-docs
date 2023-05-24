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

Generally after training a model you would review its evaluation details and make improvements if necessary. In this quickstart, you will just deploy your model, and make it available for you to try in Language studio, or you can call the prediction API.

To deploy your model from within the Language Studio:

1. Select Deploying a model from the left side menu.

2. Click on Add deployment to start a new deployment job.

    :::image type="content" source="../../../media/custom/quickstart/deploy-model.png" alt-text="A screenshot showing the deployment button"../../../media/custom/quickstart/deploy-model.png":::

3. Select Create new deployment to create a new deployment and assign a trained model from the dropdown below. You can also Overwrite an existing deployment by selecting this option and select the trained model you want to assign to it from the dropdown below.

    > [!NOTE]
    > Overwriting an existing deployment doesn't require changes to your [prediction API](https://aka.ms/ct-runtime-swagger) call but the results you get will be based on the newly assigned model.

    :::image type="content" source="../../../media/custom/quickstart/add-deployment.png" alt-text="A screenshot showing the deployment screen"../../../media/custom/quickstart/add-deployment.png":::

4. Click on Deploy to start the deployment job.

5. After deployment is successful, an expiration date will appear next to it. [Deployment expiration](../../../concepts/model-lifecycle.md) is when your deployed model will be unavailable to be used for prediction, which typically happens twelve months after a training configuration expires.