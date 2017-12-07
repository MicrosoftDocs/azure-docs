---
title: Create a language model with Custom Speech Service on Azure| Microsoft Docs
description: Learn how to create a language model with the Custom Speech Service in Cognitive Services.
services: cognitive-services
author: PanosPeriorellis
manager: onano

ms.service: cognitive-services
ms.technology: custom-speech-service
ms.topic: article
ms.date: 02/08/2017
ms.author: panosper
---

# Creating a custom language model
The procedure for creating a custom language model is similar to creating an acoustic model except there is no audio data, only text. The text should consist of many examples of queries or utterances you expect users to say or have logged users saying (or typing) in your application.

## Preparing the data for a custom language model

In order to create a custom language model for your application, you need to provide a list of example utterances to the system, for example:

*   "He has had urticaria for the past week."
*   "The patient had a well-healed herniorrhaphy scar."

The sentences do not need to be complete sentences or grammatically correct, and should accurately reflect the spoken input you expect the system to encounter in deployment. These examples should reflect both the style and content of the task the users will perform with your application.

The language model data should be written in plain-text file using either the US-ASCII or UTF-8, depending of the locale. For en-US, both encodings are supported. For zh-CN, only UTF-8 is supported (BOM is optional). The text file should contain one example (sentence, utterance, or query) per line.

If you wish some sentences to have a higher weight (importance), you can add it several times to your data. A good number of repetitions is between 10 - 100. If you normalize it to 100 you can weight sentence relative to this easily.

The main requirements for the language data are summarized in the following table.

| Property | Value |
|----------|-------|
| Text Encoding | en-US: US-ACSII or UTF-8 or zh-CN: UTF-8|
| # of Utterances per line | 1 |
| Maximum File Size | 200 MB |
| Remarks | avoid repeating characters more often than 4 times, i.e. 'aaaaa'|
| Remarks | no special characters like '\t' or any other UTF-8 character above U+00A1 in [Unicode characters table](http://www.utf8-chartable.de/)|
| Remarks | URIs will also be rejected since there is no unqiue way to pronounce a URI|

When the text is imported, it will be text-normalized so it can be processed by the system. However, there are some very important normalizations that must be done by the user _prior_ to uploading the data. Please consult the section on [Transcription Guidelines](cognitive-services-custom-speech-transcription-guidelines.md) for the appropriate language when preparing your language data.

## Importing the language data set

When you are ready to import your language data set, click “Language Data” from the “Menu” drop-down menu. A table called “Language Data” that contains your language data sets is shown. If you have not yet uploaded any language data, the table will be empty. The current locale is reflected in the table title. If you would like to import language data of a different language, click on “Change Locale”. Additional information on supported languages can be found in the section on [Changing Locale](cognitive-services-custom-speech-change-locale.md).

To import a new data set, click “Import New” under the table title. Enter a Name and Description to help you identify the data set in the future. Next, use the “Choose File” button to locate the text file of language data. After that, click “Import” and the data set will be uploaded. Depending on the size of the data set, this may take several minutes.

![try](../../../media/cognitive-services/custom-speech-service/custom-speech-language-datasets-import.png)

When the import is complete, you will return to the language data table and will see an entry that corresponds to your language data set. Notice that it has been assigned a unique id (GUID). The data will also have a status that reflects its current state. Its status will be “Waiting” while it is being queued for processing, “Processing” while it is going through validation, and “Complete” when the data is ready for use. Data validation performs a series of checks on the text in the file and some text normalization of the data.

When the status is “Complete” you can click “View Report” to see the language data verification report. The number of utterances that passed and failed verification are shown, along with details about the failed utterances. In the example below, two examples failed verification because of improper characters (in this data set, the first had two emoticons and the second had several characters outside of the ASCII printable character set).

![try](../../../media/cognitive-services/custom-speech-service/custom-speech-language-datasets-report.png)

When the status of the language data set is “Complete”, it can be used to create a custom language model.

![try](../../../media/cognitive-services/custom-speech-service/custom-speech-language-datasets.png)

## Creating a custom language model

Once your language data is ready, click “Language Models” from the “Menu” drop-down menu to start the process of custom language model creation. This page contains a table called “Language Models” with your current custom language models. If you have not yet created any custom language models, the table will be empty. The current locale is reflected in the table title. If you would like to create a language model for a different language, click on “Change Locale”. Additional information on supported languages can be found in the section on [Changing Locale](cognitive-services-custom-speech-change-locale.md). To create a new model, click the “Create New” link below the table title.

On the "Create Language Model" page, enter a "Name" and "Description" to help you keep track of pertinent information about this model, such as the data set used. Next, select the “Base Language Model” from the drop-down menu. This model will be the starting point for your customization. There are two base language models to choose from. The _Microsoft Search and Dictation LM_ is appropriate for speech directed at an application, such as such as commands, search queries, or dictation. The _Microsoft Conversational LM_ is appropriate for recognizing speech spoken in a conversational style. This type of speech is typically directed at another person and occurs in call centers or meetings.

After you have specified the base language model, select the language data set you wish to use for the customization using the “Language Data” drop down menu

![try](../../../media/cognitive-services/custom-speech-service/custom-speech-language-models-create2.png)

As with the acoustic model creation, you can optionally choose to perform offline testing of your new model when the processing is complete. Note that because this is an evaluation of the speech-to-text performance, offline testing requires an acoustic data set.

To perform offline testing of your language model, select the check box next to “Offline Testing”. Then select an acoustic model from the drop-down menu. If you have not created any custom acoustic models, the Microsoft base acoustic models will be the only model in the menu. In case you have picked a conversational LM base model, you need to use a conversational AM here. In case you use a search and dictate LM model, you have to select a search and dictate AM model.

Finally, select the acoustic data set you would like to use to perform the evaluation.

When you are ready to start processing, press “Create”. This will return you to the table of language models. There will be a new entry in the table corresponding to this model. The status reflects the model’s state and will go through several states including “Waiting”, “Processing”, and “Complete”.

When the model has reached the “Complete” state, it can be deployed to an endpoint. Clicking on “View Result” will show the results of offline testing, if performed.

If you would like to change the "Name" or "Description"" of the model at some point, you can use the “Edit” link in the appropriate row of the language models table.

## Next steps
* Try to create your [custom acoustic model](cognitive-services-custom-speech-create-acoustic-model.md) to improve recognition accuracy
* [Create a custom speech-to-text endpoint](cognitive-services-custom-speech-create-endpoint.md) which you can use from app
