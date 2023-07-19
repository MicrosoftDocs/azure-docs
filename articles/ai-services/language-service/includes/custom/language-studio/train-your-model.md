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

To start training your model from within the [Language Studio](https://aka.ms/LanguageStudio):

1. Select **Training jobs** from the left side menu.

2. Select **Start a training job** from the top menu.

3. Select **Train a new model** and type in the model name in the text box. You can also **overwrite an existing model** by selecting this option and choosing the model you want to overwrite from the dropdown menu. Overwriting a trained model is irreversible, but it won't affect your deployed models until you deploy the new model.

    :::image type="content" source="../../../media/custom/language-studio/train-model.png" alt-text="Create a new training job" lightbox="../../../media/custom/language-studio/train-model.png":::
    
4. By default, the system will split your labeled data between the training and testing sets, according to specified percentages. If you have documents in your testing set, you can manually split the training and testing data.

4. Select the **Train** button.

5. If you select the Training Job ID from the list, a side pane will appear where you can check the **Training progress**, **Job status**, and other details for this job.

    > [!NOTE]
    > * Only successfully completed training jobs will generate models.
    > * Training can take some time between a couple of minutes and several hours based on the size of your labeled data.
    > * You can only have one training job running at a time. You can't start other training job within the same project until the running job is completed.
