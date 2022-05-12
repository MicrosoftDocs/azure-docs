---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 03/16/2022
ms.author: aahi
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).

## Sign in to Language Studio

1. Go to the [Language Studio](https://aka.ms/languageStudio) and sign in with your Azure account. 

2. In the **Choose a language resource** window that appears, find your Azure subscription, and choose your Language resource. If you don't have a resource, you can create a new one.

    > [!NOTE]
    > Currently only resources with the standard (**S**) pricing tier can be used with the Conversational Language Understanding service.
    
    :::image type="content" source="../../../conversational-language-understanding/media/quickstart-language-resource.png" alt-text="A screenshot showing the resource selection screen in Language Studio." lightbox="../../../conversational-language-understanding/media/quickstart-language-resource.png":::

## Create an orchestration project

Once you have a Language resource associated with your account, create an orchestration workflow project. In this quickstart, you'll create a project that connects between different Conversation Language Understanding projects and Custom Question Answering projects.

1. In [Language Studio](https://aka.ms/languageStudio), find the section labeled **Understand questions and conversational language** and select **Orchestration Workflow**.  
   
   :::image type="content" source="../../media/select-orchestration.png" alt-text="A screenshot showing the location of the orchestration workflow section in the Language Studio landing page." lightbox="../../media/select-orchestration.png"::: 
    

2. This will bring you to the **Orchestration workflow project** page. Select **+ Create new project**. To create a project, you will need to provide the following details:

|Value  | Description  |
|---------|---------|
|Name     | A name for your project.        |
|Description    | Optional project description.        |
|Utterances primary language | The primary language of your project. Your training data should primarily be in this language. For this quickstart, choose **English**.        |

Once you're done, select **Next** and review the details. Select **create project** to complete the process. You should now see the **Build Schema** screen in your project.

## Build schema

1. Click on *+Add* button to add your intent.
2. Give your intent a name and choose to connect the intent to an existing project.
3. Click on *Add intent* button. 
4. Enter **Greeting** as an intent. For this quickstart, select **No, I don't want to connect to a project**.


    :::image type="content" source="../../media/quickstart-intent.png" alt-text="A screenshot showing the schema page in Language studio." lightbox="../../media/quickstart-intent.png":::

When you select the intent, you will see the [tag utterances](../../how-to/tag-utterances.md) page, where you can add examples for intents.


## Tag utterances

In the tag utterances page, let's add a few examples to the intents. Select the **Greeting** intent from the drop-down box that says **Select Intent**.

In the text box that says **Write your example utterance and press enter**, write the sentence "*Good evening*" and press enter to add it as an example utterance. 

Add the rest of these utterances to the **Greeting** intent to the Training set. 

|Utterance|
|--|
|*Good evening*|
|*Good morning*|
|*Hey*|
|*What's up*|

When you're done, select **Save Changes** to save the utterances and labels to the project. The icon next to the button will turn green when the changes are saved. Next, go to the **Train Model** page.

:::image type="content" source="../../media/tagged-utterances.png" alt-text="A screenshot showing the intents tagging screen in Language Studio." lightbox="../../media/tagged-utterances.png":::

## Train your model and view its details

Select **train model** on the left of the screen. Select **Start a training job**. To train your model, you need to provide a name for the model. Write a name like "*v1*" and press the enter key. 

You should see the **View model details** page. Wait until training completes, which may take about 5 minutes. When training succeeds, Select **Deploy Model** on the left of the screen.

## Deploy your model

From the **Deploy model** page on the left of te screen, Select **Add deployment**. To deploy your model, you need to create a new deployment name. Write a name like "*staging*" and press the next button. 

Once you're done, select **Next** and review the details. For the connected projects, select which deployment name from the drop-down menu and press *Submit*.

## Test your model

Select **Test model** on the left of the screen, and select the deployment name from the drop-down menu. Add your test, for example *Good morning* in the text field and click on **Run the test**. 

You now see the top intent is **Greeting**.