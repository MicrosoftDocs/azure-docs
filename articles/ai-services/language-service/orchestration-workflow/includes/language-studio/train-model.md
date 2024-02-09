---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 03/15/2022
ms.author: aahi
ms.custom: ignite-fall-2021
---

To start training your model from within the [Language Studio](https://aka.ms/languageStudio):

1. Select **Training jobs** from the left side menu.

2. Select **Start a training job** from the top menu.

3. Select **Train a new model** and type in the model name in the text box. You can also **overwrite an existing model** by selecting this option and choosing the model you want to overwrite from the dropdown menu. Overwriting a trained model is irreversible, but it won't affect your deployed models until you deploy the new model.

    If you have enabled [your project to manually split your data](../../how-to/tag-utterances.md) when tagging your utterances, you will see two data splitting options:
    
    * **Automatically splitting the testing set from training data**: Your tagged utterances will be randomly split between the training and testing sets, according to the percentages you choose. The default percentage split is 80% for training and 20% for testing. To change these values, choose which set you want to change and type in the new value.
        
    > [!NOTE]
    > If you choose the **Automatically splitting the testing set from training data** option, only the utterances in your training set will be split according to the percentages provided.
        
    * **Use a manual split of training and testing data**: Assign each utterance to either the training or testing set during the [tagging](../../how-to/tag-utterances.md) step of the project.
        
    > [!NOTE]
    > **Use a manual split of training and testing data** option will only be enabled if you add utterances to the testing set in the tag data page. Otherwise, it will be disabled.
        
    :::image type="content" source="../../media/train-model.png" alt-text="A screenshot showing the train model page for conversational language understanding projects." lightbox="../../media/train-model.png":::

5. Select the **Train** button.

> [!NOTE]
> * Only successfully completed training jobs will generate models.
> * Training can take some time between a couple of minutes and couple of hours based on the size of your tagged data.
> * You can only have one training job running at a time. You cannot start other training job wihtin the same project until the running job is completed.
