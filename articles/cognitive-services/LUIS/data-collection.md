---
title: Data collection
description: Learn what example data to collect while developing your app
ms.topic: conceptual
ms.date: 05/06/2020
---

# Data collection for your app

A Language Understanding (LUIS) app needs data as part of app development.

## Data used in LUIS

LUIS uses text as data to train and test your LUIS app for classification for [intents](luis-concept-intent.md) and for extraction of [entities](luis-concept-entity-types.md). You need a large enough data set that you have sufficient data to create separate data sets for both training and test that have the diversity and distribution called out specifically below.  The data in each of these sets should not overlap.

## Training data selection for example utterances

Select utterances for your training set based on the following criteria:

* **Real data is best**:
    * **Real data from client application**: Select utterances that are real data from your client application.  If the customer sends a web form with their inquiry today, and you’re building a bot, you can start by using the web form data.
    * **Crowd-sourced data**: If you don’t have any existing data, consider crowd sourcing utterances.  Try to crowd-source utterances from your actual user population for your scenario to get the best approximation of the real data your application will see. Crowd-sourced human utterances are better than computer-generated utterances.  When you build a data set of synthetic utterances generated on specific patterns, it will lack much of the natural variation you’ll see with people creating the utterances and won’t end up generalizing well in production.
* **Data diversity**:
    * **Region diversity**: Make sure the data for each intent is as diverse as possible including _phrasing_ (word choice), and _grammar_.  If you are teaching an intent about HR policies about vacation days, make sure you have utterances that represent the terms that are used for all regions you’re serving.  For example, in Europe people might ask about `taking a holiday` and in the US people might ask about `taking vacation days`.
    * **Language diversity**: If you have users with various native languages that are communicating in a second language, make sure to have utterances that represent non-native speakers.
    * **Input diversity**: Consider your data input path. If you are collecting data from one person, department or input device (microphone) you are likely missing diversity that will be important for your app to learn about all input paths.
    * **Punctuation diversity**: Consider that people use varying levels of punctuation in text applications and make sure you have a diversity of how punctuation is used. If you're using data that comes from speech, it won't have any punctuation, so your data shouldn't either.
* **Data distribution**: Make sure the data spread across intents represents the same spread of data your client application receives. If your LUIS app will classify utterances that are requests to schedule a leave (50%), but it will also see utterances about inquiring about leave days left (20%), approving leaves (20%) and some out of scope and chit chat (10%) then your data set should have the sample percentages of each type of utterance.
* **Use all data forms**: If your LUIS app will take data in multiple forms, make sure to include those forms in your training utterances. For example, if your client application takes both speech and typed text input, you need to have speech-to-text generated utterances as well as typed utterances.  You will see different variations in how people speak from how they type as well as different errors in speech recognition and typos.  All of this variation should be represented in your training data.
* **Positive and negative examples**: To teach a LUIS app, it must learn about what the intent is (positive) and what it is not (negative). In LUIS, utterances can only be positive for a single intent. When an utterance is added to an intent, LUIS automatically makes that same example utterance a negative example for all the other intents.
* **Data outside of application scope**: If your application will see utterances that fall outside of your defined intents, make sure to provide those. The examples that aren’t assigned to a particular defined intent will be labeled with the **None** intent.  It’s important to have realistic examples for the **None** intent to properly predict utterances that are outside the scope of the defined intents.

    For example, if you are creating an HR bot focused on leave time and you have three intents:
    * schedule or edit a leave
    * inquire about available leave days
    * approve/disapprove leave

    You want to make sure you have utterances that cover both of those intents, but also that cover potential utterances outside that scope that the application should serve like these:
    * `What are my medical benefits?`
    * `Who is my HR rep?`
    * `tell me a joke`
* **Rare examples**: Your app will need to have rare examples as well as common examples.  If your app has never seen rare examples, it won’t be able to identify them in production. If you’re using real data, you will be able to more accurately predict how your LUIS app will work in production.

### Quality instead of quantity

Consider the quality of your existing data before you add more data.  With LUIS, you’re using Machine Teaching.  The combination of your labels and the machine learning features you define is what your LUIS app uses.  It doesn’t simply rely on the quantity of labels to make the best prediction.  The diversity of examples and their representation of what your LUIS app will see in production is the most important part.

### Preprocessing data

The following preprocessing steps will help build a better LUIS app:

* **Remove duplicates**: Duplicate utterances won't hurt, but they don't help either, so removing them will save labeling time.
* **Apply same client-app preprocess**: If your client application, which calls the LUIS prediction endpoint, applies data processing at runtime before sending the text to LUIS, you should train the LUIS app on data that is processed in the same way. For example, if your client application uses [Bing Spell Check](../bing-spell-check/overview.md) to correct spelling on inputs to LUIS, correct your training and test utterances before adding to LUIS.
* **Don't apply new cleanup processes that the client app doesn't use**: If your client app accepts speech-generated text directly without any cleanup such as grammar or punctuation, your utterances need to reflect the same including any missing punctuation and any other misrecognition you’ll need to account for.
* **Don't clean up data**: Don’t get rid of malformed input that you might get from garbled speech recognition, accidental keypresses, or mistyped/misspelled text. If your app will see inputs like these, it’s important for it to be trained and tested on them. Add a _malformed input_ intent if you wouldn’t expect your app to understand it. Label this data to help your LUIS app predict the correct response at runtime. Your client application can choose an appropriate response to unintelligible utterances such as `Please try again`.

### Labeling data

* **Label text as if it was correct**: The example utterances should have all forms of an entity labeled. This includes text that is misspelled, mistyped, and mistranslated.

### Data review after LUIS app is in production

[Review endpoint utterances](luis-concept-review-endpoint-utterances.md) to monitor real utterance traffic once you have deployed an app to production.  This allows you to update your training utterances with real data, which will improve your app. Any app built with crowd-sourced or non-real scenario data will need to be improved based on its real use.

## Test data selection for batch testing

All of the principles listed above for training utterances apply to utterances you should use for your [test set](luis-concept-batch-test.md). Ensure the distribution across intents and entities mirror the real distribution as closely as possible.

Don’t reuse utterances from your training set in your test set. This improperly biases your results and won’t give you the right indication of how your LUIS app will perform in production.

Once the first version of your app is published, you should update your test set with utterances from real traffic to ensure your test set reflects your production distribution and you can monitor realistic performance over time.

## Next steps

> [!div class="nextstepaction"]
> [Learn how LUIS alters your data before prediction](luis-concept-data-alteration.md)
