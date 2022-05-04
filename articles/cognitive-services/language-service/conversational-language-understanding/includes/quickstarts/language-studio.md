---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 03/15/2022
ms.author: aahi
ms.custom: ignite-fall-2021
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).

## Sign in to Language Studio

1. Go to the [Language Studio](https://aka.ms/languageStudio) and sign in with your Azure account. 

2. In the **Choose a language resource** window that appears, find your Azure subscription, and choose your Language resource. If you don't have a resource, you can create a new one.

    > [!NOTE]
    > Currently only resources with the standard (**S**) pricing tier can be used with the Conversational Language Understanding service.
    
    :::image type="content" source="../../media/quickstart-language-resource.png" alt-text="A screenshot showing the resource selection screen in Language Studio." lightbox="../../media/quickstart-language-resource.png":::

## Create a conversation project

Once you have a Language resource associated with your account, create a Conversational Language Understanding project. In this quickstart, you'll create a project that can identify commands for email, such as: reading emails by certain people, deleting emails, and attaching a document to an email.

1. In [Language Studio](https://aka.ms/languageStudio), find the section named **Understand conversational language** and select **Conversational language understanding**.  
    :::image type="content" source="../../media/select-custom-clu.png" alt-text="A screenshot showing the location of Custom Language Understanding in the Language Studio landing page." lightbox="../../media/select-custom-clu.png"::: 
    

2. This will bring you to the **Conversations project** page. Select **Create new project**. Select **Conversation project**, then select **Next**.

    :::image type="content" source="../../media/projects-page.png" alt-text="A screenshot showing the conversation project page in Language Studio." lightbox="../../media/projects-page.png":::


You then need to provide the following details:

|Value  | Description  |
|---------|---------|
|Name     | A name for your project.        |
|Description    | Optional project description.        |
|Text primary language     | The primary language of your project. Your training data should primarily be in this language. For this quickstart, choose **English**.        |
|Enable multiple languages     |  Whether you would like to enable your project to support multiple languages at once. For this quickstart, enable this option.       |

Once you're done, select **Next** and review the details. Select **create project** to complete the process. You should now see the **Build Schema** screen in your project.

## Build schema

1. Select the **Intents** or **Entities** tab in the **Build Schema** page, and select **Add**. You will be prompted for a name before completing the creation of the intent or entity.

2. Create three intents with the following names:
    - **Read**
    - **Delete**
    - **Attach**

3. Create three entities with the following names. Once you create the entity, go back to the **Build Schema** page without adding details to the entity:
    - **Sender**
    - **FileName**
    - **FileType**


When you select the intent, you will see the [tag utterances](../../how-to/tag-utterances.md) page, where you can add examples for intents and label them with entities.


:::image type="content" source="../../media/quickstart-intents.png" alt-text="A screenshot showing the schema page in Language studio." lightbox="../../media/quickstart-intents.png":::

## Tag utterances

In the tag utterances page, let's add a few examples to the intents. Select the **Read** intent from the drop-down box that says **Select Intent**.

In the text box that says **Write your example utterance and press enter**, write the sentence "*read the email from Carol*" and press enter to add it as an example utterance.

Drag your cursor over the word "*Carol*" and select the **Sender** entity, to label "*Carol*" as the entity.

Add the rest of these utterances with the following intents and entities.

|Utterance|Intent|Entities|
|--|--|--|
|*Read John's email for me*|**Read**|"John": **Sender**|
|*What did the email from Matt say*|**Read**|"Matt": **Sender**|
|*Open Blake's email*|**Read**|"Blake": **Sender**|
|*Delete my last email from Martha*|**Delete**|"Martha": **Sender**|
|*Delete this*|**Delete**|_No entities_|
|*Remove this one*|**Delete**|_No entities_|
|*Move this to the deleted folder*|**Delete**|_No entities_|
|*Attach the excel file called reports q1*|**Attach**|"excel": **FileType**, <br> "reports q1" -> **FileName**|
|*Attach the PowerPoint file*|**Attach**|"PowerPoint": **FileType**|
|*Add the PDF file with the name signed contract* |**Attach**|"PDF": **FileType**, <br> "signed contract": **FileName**|


When you're done, select **Save Changes** to save the utterances and labels to the project. The icon next to the button will turn green when the changes are saved. Next, go to the **Train Model** page.

:::image type="content" source="../../media/quickstart-utterances.png" alt-text="A screenshot showing the intents tagging screen in Language Studio." lightbox="../../media/quickstart-utterances.png":::

## Train your model and view its details

Select **train model** on the left of the screen. Select **Start a training job**. To train your model, you need to provide a name for the model. Write a name like "*v1*" and press the enter key.

> [!NOTE]
> If you did not [tag utterances](#tag-utterances) you will only be allowed to train using the **Automatically split the testing set from all data** option. See [Add utterances to testing set](../../how-to/tag-utterances.md#tag-utterances) for more information.

When the training job is complete, which may take some time, you should see the output model performance in the **View model details** page.

## Deploy your model

From the **Deploy model** page on the left of the screen, select **Add deployment**.

In the window that appears, give your deployment a **deployment name** and then assign your trained model to this deployment name and then select **Submit**.

## Test your model

Select **Test model** on the left of the screen, and select the model link. Write the utterance "*trash this one*", and select **Run the test**. 

You now see the top intent as **Delete** with no entities.

You can test other utterances such as:
* "*attach my docx file*", 
* "*read the email by Jason*", 
* "*attach the ppt file named CLU demo*".

You can also test out utterances in other languages such as the following phrases:

* "*Joindre le fichier PDF*" (in French: "*Attach the PDF file*"), 
* "*Lesen Sie die E-mail von Macy*" (in German: "*Read Macy's e-mail*")
