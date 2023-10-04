---
title: Azure AI Video Indexer text-based emotion detection overview 
description: This article gives an overview of Azure AI Video Indexer text-based emotion detection.
ms.service: azure-video-indexer
ms.date: 08/02/2023
ms.topic: article
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Text-based emotion detection

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

Emotions detection is an Azure AI Video Indexer AI feature that automatically detects emotions in video's transcript lines. Each sentence can either be detected as: 

- *Anger*,
- *Fear*,
- *Joy*, 
- *Sad*

Or, none of the above if no other emotion was detected.

The model works on text only (labeling emotions in video transcripts.) This model doesn't infer the emotional state of people, may not perform where input is ambiguous or unclear, like sarcastic remarks. Thus, the model shouldn't be used for things like assessing employee performance or the emotional state of a person.  

## General principles 

There are many things you need to consider when deciding how to use and implement an AI-powered feature: 

- Will this feature perform well in my scenario? Before deploying emotions detection into your scenario, test how it performs using real-life data and make sure it can deliver the accuracy you need. 
- Are we equipped to identify and respond to errors? AI-powered products and features aren't 100% accurate, consider how you identify and respond to any errors that may occur. 

## View the insight

When working on the website the insights are displayed in the **Insights** tab. They can also be generated in a categorized list in a JSON file that includes the ID, type, and a list of instances it appeared at, with their time and confidence. 

To display the instances in a JSON file, do the following: 

1. Select Download -> Insights (JSON). 
1. Copy the text and paste it into an online JSON viewer. 

```json
"emotions": [ 
  { 
    "id": 1, 
    "type": "Sad", 
    "instances": [ 
      { 
        "confidence": 0.5518, 
        "adjustedStart": "0:00:00", 
        "adjustedEnd": "0:00:05.75", 
        "start": "0:00:00", 
        "end": "0:00:05.75" 
      }, 

```

To download the JSON file via the API, use the [Azure AI Video Indexer developer portal](https://api-portal.videoindexer.ai/). 

> [!NOTE]
> Text-based emotion detection is language independent, however if the transcript is not in English, it is first being translated to English and only then the model is applied. This may cause a reduced accuracy in emotions detection for non English languages. 

## Emotions detection components 

During the emotions detection procedure, the transcript of the video is processed, as follows: 

|Component |Definition |
|---|---|
|Source language |The user uploads the source file for indexing. |
|Transcription API |The audio file is sent to Azure AI services and the translated transcribed output is returned. If a language has been specified, it's processed. |
|Emotions detection  |Each sentence is sent to the emotions detection model. The model produces the confidence level of each emotion. If the confidence level exceeds a specific threshold, and there's no ambiguity between positive and negative emotions, the emotion is detected. In any other case, the sentence is labeled as neutral.|
|Confidence level |The estimated confidence level of the detected emotions is calculated as a range of 0 to 1. The confidence score represents the certainty in the accuracy of the result. For example, an 82% certainty is represented as an 0.82 score. |

## Considerations and limitations for input data

Here are some considerations to keep in mind when using emotions detection: 

- When uploading a file always use high quality audio and video content.

When used responsibly and carefully emotions detection is a valuable tool for many industries. To respect the privacy and safety of others, and to comply with local and global regulations, we recommend the following:   

- Always respect an individual’s right to privacy, and only ingest media for lawful and justifiable purposes.    
Don't purposely disclose inappropriate media showing young children or family members of celebrities or other content that may be detrimental or pose a threat to an individual’s personal freedom.   
- Commit to respecting and promoting human rights in the design and deployment of your analyzed media.   
- When using third-party materials, be aware of any existing copyrights or permissions required before distributing content derived from them.  
- Always seek legal advice when using media from unknown sources.  
- Always obtain appropriate legal and professional advice to ensure that your uploaded media is secured and have adequate controls to preserve the integrity of your content and to prevent unauthorized access.     
- Provide a feedback channel that allows users and individuals to report issues with the service.   
- Be aware of any applicable laws or regulations that exist in your area regarding processing, analyzing, and sharing media containing people.  
- Keep a human in the loop. Don't use any solution as a replacement for human oversight and decision-making.   
- Fully examine and review the potential of any AI model you're using to understand its capabilities and limitations.  

- Fully examine and review the potential of any AI model you're using to understand its capabilities and limitations.


## Transparency Notes

### General 

Review [Transparency Note overview](/legal/azure-video-indexer/transparency-note?context=/azure/azure-video-indexer/context/context)

### Emotion detection specific 

Introduction: This model is designed to help detect emotions in the transcript of a video. However, it isn't suitable for making assessments about an individual's emotional state, their ability, or their overall performance.  

Use cases: This emotion detection model is intended to help determine the sentiment behind sentences in the video’s transcript. However, it only works on the text itself, and may not perform well for sarcastic input or in cases where input may be ambiguous or unclear. 

Information requirements: To increase the accuracy of this model, it is recommended that input data be in a clear and unambiguous format. Users should also note that this model does not have context about input data, which can impact its accuracy.  

Limitations: This model can produce both false positives and false negatives. To reduce the likelihood of either, users are advised to follow best practices for input data and preprocessing, and to interpret outputs in the context of other relevant information. It's important to note that the system does not have any context of the input data. 

Interpretation: The outputs of this model should not be used to make assessments about an individual's emotional state or other human characteristics. This model is supported in English and may not function properly with non-English inputs. Not English inputs are being translated to English before entering the model, therefore may produce less accurate results. 

### Intended use cases

- Content Creators and Video Editors - Content creators and video editors can use the system to analyze the emotions expressed in the text transcripts of their videos. This helps them gain insights into the emotional tone of their content, allowing them to fine-tune the narrative, adjust pacing, or ensure the intended emotional impact on the audience.
- Media Analysts and Researchers - Media analysts and researchers can employ the system to analyze the emotional content of a large volume of video transcripts quickly. They can use the emotional timeline generated by the system to identify trends, patterns, or emotional responses in specific topics or areas of interest.
- Marketing and Advertising Professionals - Marketing and advertising professionals can utilize the system to assess the emotional reception of their campaigns or video advertisements. Understanding the emotions evoked by their content helps them tailor messages more effectively and gauge the success of their campaigns.
- Video Consumers and Viewers - End-users, such as viewers or consumers of video content, can benefit from the system by understanding the emotional context of videos without having to watch them entirely. This is particularly useful for users who want to decide if a video is worth watching or for those with limited time to spare.
- Entertainment Industry Professionals - Professionals in the entertainment industry, such as movie producers or directors, can utilize the system to gauge the emotional impact of their film scripts or storylines, aiding in script refinement and audience engagement. 

### Considerations when choosing other use cases

- The model should not be used to evaluate employee performance and monitoring individuals.
- The model should not be used for making assessments about a person, their emotional state, or their ability.
- The results of the model can be inaccurate, as this is an AI system, and should be treated with caution.
- The confidence of the model in its prediction should also be taken into account.
- Non English videos will produce less accurate results.

## Next steps

### Learn More about Responsible AI

- [Microsoft Responsible AI principles](https://www.microsoft.com/ai/responsible-ai?activetab=pivot1%3aprimaryr6) 
- [Microsoft Responsible AI resources](https://www.microsoft.com/ai/responsible-ai-resources)
- [Microsoft Azure Learning courses on Responsible AI](/training/paths/responsible-ai-business-principles/)
- [Microsoft Global Human Rights Statement](https://www.microsoft.com/corporate-responsibility/human-rights-statement?activetab=pivot_1:primaryr5)  

### Contact us

`visupport@microsoft.com`  

## Azure AI Video Indexer insights

View some other Azure Video Insights:

- [Audio effects detection](audio-effects-detection.md)
- [Face detection](face-detection.md)
- [OCR](ocr.md)
- [Keywords extraction](keywords.md)
- [Transcription, Translation & Language identification](transcription-translation-lid.md)
- [Named entities](named-entities.md)
- [Observed people tracking & matched persons](observed-matched-people.md)
- [Topics inference](topics-inference.md)
