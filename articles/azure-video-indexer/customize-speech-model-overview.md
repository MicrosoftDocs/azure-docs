---
title: Customize a speech model in Azure AI Video Indexer  
description: This article gives an overview of what is a speech model in Azure AI Video Indexer. 
ms.topic: conceptual
ms.date: 03/06/2023
---

# Customize a speech model

[!INCLUDE [speech model](./includes/speech-model.md)]

Through Azure AI Video Indexer integration with [Azure AI Speech services](../ai-services/speech-service/captioning-concepts.md), a Universal Language Model is utilized as a base model that is trained with Microsoft-owned data and reflects commonly used spoken language. The base model is pretrained with dialects and phonetics representing various common domains. The base model works well in most speech recognition scenarios. 

However, sometimes the base model’s transcription doesn't accurately handle some content. In these situations, a customized speech model can be used to improve recognition of domain-specific vocabulary or pronunciation that is specific to your content by providing text data to train the model. Through the process of creating and adapting speech customization models, your content can be properly transcribed. There is no additional charge for using Video Indexers speech customization. 

## When to use a customized speech model?  

If your content contains industry specific terminology or when reviewing Video Indexer transcription results you notice inaccuracies, you can create and train a custom speech model to recognize the terms and improve the transcription quality. It may only be worthwhile to create a custom model if the relevant words and names are expected to appear repeatedly in the content you plan to index. Training a model is sometimes an iterative process and you might find that after the initial training, results could still use improvement and would benefit from additional training, see [How to Improve your custom model](#how-to-improve-your-custom-models) section for guidance.  

However, if you notice a few words or names transcribed incorrectly in the transcript, a custom speech model might not be needed, especially if the words or names aren’t expected to be commonly used in content you plan on indexing in the future. You can just edit and correct the transcript in the Video Indexer website (see [View and update transcriptions in Azure AI Video Indexer website](edit-transcript-lines-portal.md)) and don’t have to address it through a custom speech model.  

For a list of languages that support custom models and pronunciation, see the Customization and Pronunciation columns of the language support table in [Language support in Azure AI Video Indexer](language-support.md).

## Train datasets 

When indexing a video, you can use a customized speech model to improve the transcription. Models are trained by loading them with [datasets](../ai-services/speech-service/how-to-custom-speech-test-and-train.md) that can include plain text data and pronunciation data.   

Text used to test and train a custom model should include samples from a diverse set of content and scenarios that you want your model to recognize. Consider the following factors when creating and training your datasets: 

- Include text that covers the kinds of verbal statements that your users make when they're interacting with your model. For example, if your content is primarily related to a sport, train the model with content containing terminology and subject matter related to the sport. 
- Include all speech variances that you want your model to recognize. Many factors can vary speech, including accents, dialects, and language-mixing. 
- Only include data that is relevant to content you're planning to transcribe. Including other data can harm recognition quality overall. 

### Dataset types 

There are two dataset types that you can use for customization. To help determine which dataset to use to address your problems, refer to the following table: 

|Use case|Data type|
|---|---|
|Improve recognition accuracy on industry-specific vocabulary and grammar, such as medical terminology or IT jargon. |Plain text|  
|Define the phonetic and displayed form of a word or term that has nonstandard pronunciation, such as product names or acronyms. |Pronunciation data  |

### Plain-text data for training 

A dataset including plain text sentences of related text can be used to improve the recognition of domain-specific words and phrases. Related text sentences can reduce substitution errors related to misrecognition of common words and domain-specific words by showing them in context. Domain-specific words can be uncommon or made-up words, but their pronunciation must be straightforward to be recognized. 

### Best practices for plain text datasets 

- Provide domain-related sentences in a single text file. Instead of using full sentences, you can upload a list of words. However, while this adds them to the vocabulary, it doesn't teach the system how the words are ordinarily used. By providing full or partial utterances (sentences or phrases of things that users are likely to say), the language model can learn the new words and how they're used. The custom language model is good not only for adding new words to the system, but also for adjusting the likelihood of known words for your application. Providing full utterances helps the system learn better. 
- Use text data that’s close to the expected spoken utterances. Utterances don't need to be complete or grammatically correct, but they must accurately reflect the spoken input that you expect the model to recognize.  
- Try to have each sentence or keyword on a separate line.  
- To increase the weight of a term such as product names, add several sentences that include the term.  
- For common phrases that are used in your content, providing many examples is useful because it tells the system to listen for these terms.  
- Avoid including uncommon symbols (~, # @ % &) as they'll get discarded. The sentences in which they appear will also get discarded.   
- Avoid putting too large inputs, such as hundreds of thousands of sentences, because doing so will dilute the effect of boosting. 

Use this table to ensure that your plain text dataset file is formatted correctly: 

|Property|Value|
|---|---| 
|Text encoding |UTF-8 BOM| 
|Number of utterances per line |1 |
|Maximum file size |200 MB |

Try to follow these guidelines in your plain text files: 

- Avoid repeating characters, words, or groups of words more than three times, such as "yeah yeah yeah yeah" as the service might drop lines with too many repetitions. 
- Don't use special characters or UTF-8 characters above U+00A1. 
- URIs is rejected. 
- For some languages such as Japanese or Korean, importing large amounts of text data can take a long time or can time out. Consider dividing the dataset into multiple text files with up to 20,000 lines in each. 

## Pronunciation data for training 

You can add to your custom speech model a custom pronunciation dataset to improve recognition of mispronounced words, phrases, or names.  

Pronunciation datasets need to include the spoken form of a word or phrase as well as the recognized displayed form. The spoken form is the phonetic sequence spelled out, such as “Triple A”. It can be composed of letters, words, syllables, or a combination of all three.  The recognized displayed form is how you would like the word or phrase to appear in the transcription. This table includes some examples: 

|Recognized displayed form |Spoken form |
|---|---|
|3CPO |three c p o |
|CNTK |c n t k |
|AAA |Triple A |

You provide pronunciation datasets in a single text file. Include the spoken utterance and a custom pronunciation for each. Each row in the file should begin with the recognized form, then a tab character, and then the space-delimited phonetic sequence. 

```
3CPO    three c p o 
CNTK    c n t k 
IEEE    i triple e 
```

Consider the following when creating and training pronunciation datasets: 

It’s not recommended to use custom pronunciation files to alter the pronunciation of common words.  

If there are a few variations of how a word or name is incorrectly transcribed, consider using some or all of them when training the pronunciation dataset. For example, if Robert is mentioned five times in the video and transcribed as Robort, Ropert, and robbers. You can try including all variations in the file as in the following example but be cautious when training with actual words like robbers as if robbers is mentioned in the video, it is transcribed as Robert. 

`Robert    Roport`   
`Robert    Ropert`   
`Robert    Robbers` 

Pronunciation model isn't meant to address acronyms. For example, if you want Doctor to be transcribed as Dr., this can't be achieved through a pronunciation model. 

Refer to the following table to ensure that your pronunciation dataset files are valid and correctly formatted. 

|Property |Value |
|---|---|
|Text encoding |UTF-8 BOM (ANSI is also supported for English) |
|Number of pronunciations per line |1 |
|Maximum file size |1 MB (1 KB for free tier) |

## How to improve your custom models  

Training a pronunciation model can be an iterative process, as you might gain more knowledge on the pronunciation of the subject after initial training and evaluation of your model’s results. Since existing models can't be edited or modified, training a model iteratively requires the creation and uploading of datasets with additional information as well as training new custom models based on the new datasets. You would then reindex the media files with the new custom speech model. 

Example: 

Let's say you plan on indexing sports content and anticipate transcript accuracy issues with specific sports terminology as well as in the names of players and coaches. Before indexing, you've created a speech model with a plain text dataset with content containing relevant sports terminology and a pronunciation dataset with some of the player and coaches’ names. You index a few videos using the custom speech model and when reviewing the generated transcript, find that while the terminology is transcribed correctly, many names aren't. You can take the following steps to improve performance in the future: 

1. Review the transcript and note all the incorrectly transcribed names. They could fall into two groups:  

    - Names not in the pronunciation file.  
    - Names in the pronunciation file but they're still incorrectly transcribed. 
2. Create a new dataset file. Either download the pronunciation dataset file or modify your locally saved original. For group A, add the new names to the file with how they were incorrectly transcribed (Michael Mikel). For group B, add additional lines with each line having the correct name and a unique example of how it was incorrectly transcribed. For example: 

    `Stephen Steven`   
    `Stephen Steafan`   
    `Stephen Steevan` 
3. Upload this file as a new dataset file. 
4. Create a new speech model and add the original plain text dataset and the new pronunciation dataset file. 
5. Reindex the video with the new speech model. 
6. If needed, repeat steps 1-5 until the results are satisfactory. 

## Next steps

To get started with speech customization, see:

- [Customize a speech model using the API](customize-speech-model-with-api.md)
- [Customize a speech model using the website](customize-speech-model-with-website.md)
