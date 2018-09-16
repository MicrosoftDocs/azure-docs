---
title: How to create a language model with the Speech Service - Microsoft Cognitive Services
description: Learn how to create a language model with the Speech Service in Microsoft Cognitive Services.
services: cognitive-services
author: PanosPeriorellis
ms.service: cognitive-services
ms.component: speech-service
ms.topic: tutorial
ms.date: 06/25/2018
ms.author: panosper
---

# Tutorial: Create a custom language model

In this document, you create a custom language model, which you can then use in conjunction with existing state-of-the-art speech models from Microsoft to add voice interaction to your application.

The document discusses how to:
> [!div class="checklist"]
> * Prepare the data
> * Import the language data set
> * Create the custom language model

If you don't have a Cognitive Services account, create a [free account](https://azure.microsoft.com/try/cognitive-services/) before you begin.

## Prerequisites

Ensure that your Cognitive Services account is connected to a subscription by opening the [Cognitive Services Subscriptions](https://customspeech.ai/Subscriptions) page.

You can connect to a Speech Service subscription created in the Azure portal by clicking the **Connect existing subscription** button.

For information on creating a Speech Service subscription in the Azure portal, see the [get-started](get-started.md) page.

## Prepare the data

In order to create a custom language model for your application, you need to provide a list of example utterances to the system, for example:

*   "the patient has had urticaria for the past week."
*   "The patient had a well-healed herniorrhaphy scar."

The sentences do not need to be complete sentences or grammatically correct, and should accurately reflect the spoken input the system is expected to encounter in deployment. These examples should reflect both the style and content of the task the users will perform with your application.

The language model data should be written in UTF-8 BOM. The text file should contain one example (sentence, utterance, or query) per line.

If you wish some terms to have a higher weight (importance), you can add several utterances that include that term to your data. 

The main requirements for the language data are summarized in the following table.

| Property | Value |
|----------|-------|
| Text Encoding | UTF-8 BOM|
| # of Utterances per line | 1 |
| Maximum File Size | 1.5 GB |
| Remarks | avoid repeating characters more often than four times, for example 'aaaaa'|
| Remarks | no special characters like '\t' or any other UTF-8 character above U+00A1 in [Unicode characters table](http://www.utf8-chartable.de/)|
| Remarks | URIs will also be rejected since there is no unique way to pronounce a URI|

When the text is imported, it is text-normalized so it can be processed by the system. However, there are some important normalizations that must be done by the user _prior_ to uploading the data. See the [Transcription guidelines](prepare-transcription.md) to determine appropriate language when preparing your language data.

## Language support

The following languages are supported for custom **Speech to Text** language models.

Click for Full list of [Supported-languages](supported-languages.md)

## Import the language data set

Click the “Import” button in the "Language Datasets" row, and the site displays a page for uploading a new data set.

When you are ready to import your language data set, log into the [Speech Service Portal](https://customspeech.ai).  Then click the “Custom Speech” drop-down menu on the top ribbon and select “Adaptation Data”. The first time one attempts to upload data to the Speech Service, you will see an empty table called “Datasets”.

To import a new data set, click the “Import” button in the "Language Datasets" row, and the site displays a page for uploading a new data set. Enter a Name and Description to help you identify the data set in the future and choose the locale. Next, use the “Choose File” button to locate the text file of language data. After that, click “Import” and the data set will be uploaded. Depending on the size of the data set, import may take several minutes.

![try](media/stt/speech-language-datasets-import.png)

When the import is complete, you will return to the language data table and will see an entry that corresponds to your language data set. Notice that it has been assigned a unique id (GUID). The data will also have a status that reflects its current state. Its status will be “Waiting” while it is being queued for processing, “Processing” while it is going through validation, and “Complete” when the data is ready for use. Data validation performs a series of checks on the text in the file and some text normalization of the data.

When the status is “Complete”, you can click “View Report” to see the language data verification report. The number of utterances that passed and failed verification are shown, along with details about the failed utterances. In the example below, two examples failed verification because of improper characters (in this data set, the first line had two TAB characters the second had several characters outside of the ASCII printable character set, while the third line was blank).

![try](media/stt/speech-language-datasets-report.png)

When the status of the language data set is “Complete”, it can be used to create a custom language model.

![try](media/stt/speech-language-datasets.png)

## Create a custom language model

Once your language data is ready, click “Language Models” from the “Menu” drop-down menu to start the process of custom language model creation. This page contains a table called “Language Models” with your current custom language models. If you have not yet created any custom language models, the table will be empty. The current locale is shown in the table next to the relevant data entry.

The appropriate locale must be selected before taking any action. The current locale is indicated in the table title on all data, model, and deployment pages. To change the locale, click the “Change Locale” button located under the table’s title which will take you to a locale confirmation page. Click “OK” to return to the table.

On the "Create Language Model" page, enter a "Name" and "Description" to help you keep track of pertinent information about this model, such as the data set used. Next, select the “Base Language Model” from the drop-down menu. This model will be the starting point for your customization. There are two base language models to choose from. The Search and Dictation model is appropriate for speech directed at an application, such as commands, search queries, or dictation. The Conversational model is appropriate for recognizing speech spoken in a conversational style. This type of speech is typically directed at another person and occurs in call centers or meetings. A new model called "Universal" is also publicly availabe. Universal aims to tackle all scenario and eventually replace the Search and Dictation and the Conversational models.

5.	In the example below
After you have specified the base language model, select the language data set you wish to use for the customization using the “Language Data” drop-down menu

![try](media/stt/speech-language-models-create2.png)

As with the acoustic model creation, you can optionally choose to perform offline testing of your new model when the processing is complete. Model evaluations require an acoustic data set.

To perform offline testing of your language model, select the check box next to “Offline Testing”. Then select an acoustic model from the drop-down menu. If you have not created any custom acoustic models, the Microsoft base acoustic models will be the only model in the menu. In case you have picked a conversational LM base model, you need to use a conversational AM here. In case you use a search and dictate LM model, you have to select a search and dictate AM model.

Finally, select the acoustic data set you would like to use to perform the evaluation.

When you are ready to start processing, press “Create” which will take you to the table of language models. There will be a new entry in the table corresponding to this model. The status reflects the model’s state and will go through several states including “Waiting”, “Processing”, and “Complete”.

When the model has reached the “Complete” state, it can be deployed to an endpoint. Clicking on “View Result” will show the results of offline testing, if performed.

If you would like to change the "Name" or "Description" of the model at some point, you can use the “Edit” link in the appropriate row of the language models table.

## Next steps

- [Get your Speech trial subscription](https://azure.microsoft.com/try/cognitive-services/)
- [How to recognize speech in C#](quickstart-csharp-dotnet-windows.md)
- [Git Sample Data](https://github.com/Microsoft/Cognitive-Custom-Speech-Service)
