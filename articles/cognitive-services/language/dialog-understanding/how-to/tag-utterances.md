# How to tag utterances
  1. [Overview](#overview)
  2. [Tag Utterances](#tag-utterances)
  3. [Filter Utterances](#filter-utterances)
  4. [APIs](#apis)

## Overview

Once you have your schema in place, it's time to add training utterances to your project. The utterances should be similar to what your users will end up saying. When you add an utterance you have to **assign** which intent it belongs to. After the utterance is added, **label** the words within your utterance with the entities in your project. Your labels for entities should be consistent across the different utterances. 

Tagging is the action in which you assign your utterances to intents and label them with entities. The tag utterance page is where you want to spend most of your time, introducing and refining the data that will train the underlying machine-learning models. The ML models **generalizes** based on the examples you provide it. The more examples you provide, the more data points the model has to make a good generalization.

There's also a tight relationship between intents and entities. The entities that are labelled within utterances that are assigned to a specific intent creates a connection between the intent and entity. The intent is better predicted when the entity is predicted, and the entity is better predicted when the intent is predicted - similar to a feedback loop. You want to make sure you label entities in every intent you expect the entity to be present. 

When you enable **multiple languages** in your project, you must also specify the language of the utterance you are adding. As part of the multilingual capabilities of CLU, you can train your project in the dominating language and then predict in the other available languages straight away. The ability to add examples to other languages is to simply boost the performance of a certain language if you determine it isn't doing well, but it is not intended that you duplicate the data across all the languages you would like to support. 

**_Example_**: The bot developers try to capture how people may interact with their calendar bot through utterances. They add a mix of examples mostly in English, but with a few in Spanish and French as well.

They add utterances such as:
* _Setup a meeting with **Matt** and **Kevin** **tomorrow** at **12 PM**_
* _Reply as **tentative** to the **weekly update** meeting_
* _Cancelar mi **próxima** reunión_

In **Orchestration Workflow** projects, the data used to train the connected intents isn't provided within the project, instead the project pulls the populated data from the connected service (connected LUIS application, CLU project, or Custom Question Answering KB) at training time. However, if you create intents that are not connected to any service, you still need to add utterances to those intents.

**_Example_**: The developers simply create an intent for each of their skills and connect it with the respective calendar project, email project, and company FAQ KB. 

## Tag Utterances

<p align="center">
<kbd><img src="/media/tag-utterances.png" width="750"/></kbd>
</p>

**Section 1** includes the section in which you add your utterances. You must select one of the intents from the drop-down list, the language of the utterance __(if applicable)__ and the utterance itself. Press **Enter** in the utterance's text box to add the utterance.

**Section 2** includes your project's entities. You can select any of the entities and then use it to hover over the text to label the entities within your utterances, shown in section 3. You may also add new entities within section 2 by pressing the "+ Add Entity" button. The eye symbol simply toggles showing and hiding those entity's labels within your utterances. 

**Section 3** includes the utterances you've added. You can drag over the text you want to label and a contextual menu of the entities will be present.


<p align="center">
<kbd><img src="/media/label_utterance_menu.png" width="750"/></kbd>
</p>

<!---One thing to note is, unlike LUIS, you cannot label overlapping entities. The same characters cannot be labelled by more than one entity.-->

## Filter Utterances

When you click on **Filter** you'll all your project's intents and entities. Filtering allows you to only view the intents and entities you select in your project.
When clicking on an intent or entity in the [build schema](./how-to-build-schema.md) page then you'll be navigated to the Tag Utterances page with that intent or entity filtered automatically. 

<p align="center">
<kbd><img src="/media/filter-1.png" width="750"/></kbd>
</p>

## APIs
You can use the [API Reference](./api-reference.md) to configure the CLU APIs for this service. Importing a project that already exists simply overwrites the data, there are no individual APIs per action such as creating, renaming, or deleting an utterance.

- [Import Project](./api-reference.md#Import-Project)
- [Get Import Status](./api-reference.md#Get-Import-Status)
- [Export Project](./api-reference.md#Export-Project) 


## Next Steps
* [Train Model](./how-to-train-model.md)

