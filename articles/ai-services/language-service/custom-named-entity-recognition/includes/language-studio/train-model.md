---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 04/26/2022
ms.author: aahi
---

To start training your model from within the [Language Studio](https://aka.ms/LanguageStudio):

1. Select **Training jobs** from the left side menu.

2. Select **Start a training job** from the top menu.

3. Select **Train a new model** and type in the model name in the text box. You can also **overwrite an existing model** by selecting this option and choosing the model you want to overwrite from the dropdown menu. Overwriting a trained model is irreversible, but it won't affect your deployed models until you deploy the new model.

    :::image type="content" source="../../media/train-model.png" alt-text="Create a new training job" lightbox="../../media/train-model.png":::
    
4. Select data splitting method. You can choose **Automatically splitting the testing set from training data** where the system will split your labeled data between the training and testing sets, according to the specified percentages. Or you can **Use a manual split of training and testing data**, this option is only enabled if you have added documents to your testing set during [data labeling](../../how-to/tag-data.md). See [How to train a model](../../how-to/train-model.md#data-splitting) for information about data splitting.

4. Select the **Train** button.

5. If you select the Training Job ID from the list, a side pane will appear where you can check the **Training progress**, **Job status**, and other details for this job.

    > [!NOTE]
    > * Only successfully completed training jobs will generate models.
    > * Training can take some time between a couple of minutes and several hours based on the size of your labeled data.
    > * You can only have one training job running at a time. You can't start other training job within the same project until the running job is completed.
