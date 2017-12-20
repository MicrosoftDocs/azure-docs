---
title: Add a phrase list to improve accuracy | Microsoft Docs 
description: Learn how to add a phrase list to a LUIS app and see the improvement of the score.
services: cognitive-services
author: v-geberr
manager: kamran.iqbal

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 12/20/2017
ms.author: v-geberr
---

## Phrase List:

The __[Phrase list feature][PhraseListFeatures]__ can help your model by providing semantically related words to the values provided. After selecting the related words and setting the list to active, it will help your model in its predicting of intents and entities. Marking the values of an Phrase list as exchangable will tell LUIS to treat the words as synonyms.

### Example Use Case: Using Phrase Lists for Synonyms

A user tells the chatbot, `"I require a computer replacement"`. The `"Hardware"` intent has been trained with the labeled utterance `"I want a computer replacement"`. The difference between the two utterances is only one word, `"require"`, which is a synonym of the original word `"want"`. What is the scoring of user's utterance?

!["I require a computer replacement" before Phrase list][BeforePhraseList]

It's score was __0.840912044__, which is low when considering that `"require"` and `"want"` are synonyms. For `"I want a computer replacement"`, the `"Hardware"` intent score was __0.98__. Additionally, there are no predicted entities for the user's utterance, though `"computer"` was labeled as a `"Hardware"` entity in `"I want a computer replacement"`.

 Why is `"I require a computer replacement"` score lower than the labeled utterance that uses the word `"want"`? The answer for this is that LUIS provides syntactic analysis which analyzes utterances based on its __*grammatical structure*__. Since the word `"require"` wasn't used in any labeled utterances for the `"Hardware"` intent, the score was lower than 0.98. Syntactic analysis is often compared with semantic analysis, which includes an analysis of the word's __*definitions*__ or __*meanings*__ (e.g. perspiration == sweat).

Creating a Phrase list feature can add some semantic anaylsis to the LUIS model. Phrase lists are found under __`Features`__. After selecting __`Features`__, select __`Add Phrase list`__, then provide a name and a starting value.

![Initializing the "Want" Phrase list][PhraseListStart]

After you provide a starting value, LUIS will provide a series of __`Related Values`__ which feature words similar to the values already existing in your Phrase list.

![Related values to the initial value "Want"][PhraseList_RelatedValues]

Adding the words `"Require"`, `"Requires"` and some of the recommended related values will have the Phrase list ready to be incorporated into your model. As mentioned earlier, we've set `"isExchangable"` and `"isActive"` to __true__. The first property will treat the contents of the list as synonyms and the second property will tell LUIS to use the Feature when recognizing utterances.

![Addings values to the "Want" Phrase list][AddValues]

In the example LUIS Application we have trained our model with no utterances that include the word `"require"`. What we have done is create a Phrase List that has the word `"want"` along with `"require"` and other synonyms.

After saving the Phrase list, training and republishing the model we then test the utterance `"I require a computer replacement"`.

!["I require a computer replacement" after Phrase list][AfterPhraseList]

After activating the Phrase list the score respectably increased to __0.8994222__ from __0.840912044__. Additionally, the word `"computer"` was correctly recognized as a `"Hardware"` entity. 

___

The model used in this example can be found __[here][PhraseListModel]__. Additional reading on __[LUIS Features][LuisFeatures]__ can be found here.

  [PhraseListFeatures]: https://docs.microsoft.com/en-us/azure/cognitive-services/luis/add-features#phrase-list-features
  [AddValues]: ./screenshots/AddingValuestoWantPhraseList.PNG
  [BeforePhraseList]: ./screenshots/IRequireAComputerReplacement_BeforePhraseList.PNG
  [AfterPhraseList]: ./screenshots/IRequireAComputerReplacement_AfterPhraseList.PNG
  [PhraseListStart]: ./screenshots/PhraseListStart.PNG
  [PhraseList_RelatedValues]: ./screenshots/PhraseList_RelatedValues.PNG
  [PhraseListModel]: ./Phrase_List.json
  [LuisFeatures]: https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-concept-feature