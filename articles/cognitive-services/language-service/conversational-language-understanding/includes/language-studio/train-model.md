---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 09/19/2022
ms.author: aahi
---

To start training your model from within the [Language Studio](https://aka.ms/languageStudio):

1. Select **Train model** from the left side menu.

2. Select **Start a training job** from the top menu.

3. Select **Train a new model** and type in the model name in the text box. You can also **overwrite an existing model** by selecting this option and choosing the model you want to overwrite from the dropdown menu. Overwriting a trained model is irreversible, but it won't affect your deployed models until you deploy the new model.

4. Select training mode. You can choose **Standard training** for faster training, but it is only available for English. Or you can choose **Advanced training** which is supported for other languages and multilingual projects, but it involves longer training times. Learn more about [training modes](../../how-to/train-model.md#training-modes).
    

5. Select a [data splitting](../../how-to/train-model.md#data-splitting) method. You can choose **Automatically splitting the testing set from training data** where the system will split your utterances between the training and testing sets, according to the specified percentages. Or you can **Use a manual split of training and testing data**, this option is only enabled if you have added utterances to your testing set when you [labeled your utterances](../../how-to/tag-utterances.md). 

6. Click on the **Train** button.

    :::image type="content" source="../../media/train-model.png" alt-text="A screenshot showing the training page in Language Studio." lightbox="../../media/train-model.png":::

7. Click on the training job ID from the list. a panel will appear where you can check the **Training progress**, **Job status** and other details for this job.

    > [!NOTE]
    > * Only successfully completed training jobs will generate models.
    > * Training can take some time between a couple of minutes and couple of hours based on the count of utterances.
    > * You can only have one training job running at a time. You can't start other training job within the same project until the running job is completed.
    > * The machine learning used to train models is regularly updated. If you would like to train on a previous configuration, select **Click here to change** and choose a previous [training configuration version](../../../concepts/model-lifecycle.md).
