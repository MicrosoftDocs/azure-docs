---
title: Azure Video Indexer emotions detection overview
titleSuffix: Azure Video Indexer 
description: This article gives an overview of an Azure Video Indexer emotions detection.
author: juliako
ms.author: juliako
manager: femila
ms.service: azure-video-indexer
ms.date: 04/17/2023
ms.topic: article
---

# Emotions detection

Emotions detection is an Azure Video Indexer AI feature that automatically detects emotions in video's transcript lines. Each sentence can either be detected as "Anger", "Fear", "Joy", "Sad", or none of the above if no other emotion was detected.

The model works on text only (labeling emotions in video transcripts.) This model doesn't infer the emotional state of people, may not perform where input is ambiguous or unclear, like sarcastic remarks. Thus, the model shouldn't be used for things like assessing employee performance or the emotional state of a person.  

## Prerequisites  

Review [Transparency Note overview](/legal/azure-video-indexer/transparency-note?context=/azure/azure-video-indexer/context/context)

## General principles 

There are many things you need to consider when deciding how to use and implement an AI-powered feature: 

- Will this feature perform well in my scenario? Before deploying emotions detection into your scenario, test how it performs using real-life data and make sure it can deliver the accuracy you need. 
- Are we equipped to identify and respond to errors? AI-powered products and features won't be 100% accurate, so consider how you'll identify and respond to any errors that may occur. 

## View the insight

When working on the website the insights are displayed in the **Insights** tab. They can also be generated in a categorized list in a JSON file that includes the id, type, and a list of instances it appeared at, with their time and confidence. 

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

To download the JSON file via the API, use the [Azure Video Indexer developer portal](https://api-portal.videoindexer.ai/). 

> [!NOTE]
> Emotions detection is language independent, however if the transcript is not in English, it is first being translated to English and only then the model is applied. This may cause a reduced accuracy in emotions detection for non English languages. 

## Emotions detection components 

During the emotions detection procedure, the transcript of the video is processed, as follows: 

|Component |Definition |
|---|---|
|Source language |The user uploads the source file for indexing. |
|Transcription API |The audio file is sent to Cognitive Services and the translated transcribed output is returned. If a language has been specified, it is processed. |
|Emotions detection  |Each sentence is sent to the emotions detection model. The model produces the confidence level of each emotion. If the confidence level exceeds a specific threshold, and there is no ambiguity between positive and negative emotions, the emotion is detected. In any other case, the sentence is labeled as neutral.|
|Confidence level |The estimated confidence level of the detected emotions is calculated as a range of 0 to 1. The confidence score represents the certainty in the accuracy of the result. For example, an 82% certainty is represented as an 0.82 score. |

## Considerations and limitations when choosing a use case 

Below are some considerations to keep in mind when using emotions detection: 

* When uploading a file always use high quality audio and video content.

When used responsibly and carefully emotions detection is a valuable tool for many industries. To respect the privacy and safety of others, and to comply with local and global regulations, we recommend the following:   

* Always respect an individual’s right to privacy, and only ingest media for lawful and justifiable purposes.    
Don't purposely disclose inappropriate media showing young children or family members of celebrities or other content that may be detrimental or pose a threat to an individual’s personal freedom.   
* Commit to respecting and promoting human rights in the design and deployment of your analyzed media.   
* When using 3rd party materials, be aware of any existing copyrights or permissions required before distributing content derived from them.  
* Always seek legal advice when using media from unknown sources.  
* Always obtain appropriate legal and professional advice to ensure that your uploaded media is secured and have adequate controls to preserve the integrity of your content and to prevent unauthorized access.     
* Provide a feedback channel that allows users and individuals to report issues with the service.   
* Be aware of any applicable laws or regulations that exist in your area regarding processing, analyzing, and sharing media containing people.  
* Keep a human in the loop. Don't use any solution as a replacement for human oversight and decision-making.   
* Fully examine and review the potential of any AI model you're using to understand its capabilities and limitations.  

## Next steps

### Learn More about Responsible AI

- [Microsoft Responsible AI principles](https://www.microsoft.com/ai/responsible-ai?activetab=pivot1%3aprimaryr6) 
- [Microsoft Responsible AI resources](https://www.microsoft.com/ai/responsible-ai-resources)
- [Microsoft Azure Learning courses on Responsible AI](/training/paths/responsible-ai-business-principles/)
- [Microsoft Global Human Rights Statement](https://www.microsoft.com/corporate-responsibility/human-rights-statement?activetab=pivot_1:primaryr5)  

### Contact us

`visupport@microsoft.com`  

## Azure Video Indexer insights

View some other Azure Video Insights:

- [Audio effects detection](audio-effects-detection.md)
- [Face detection](face-detection.md)
- [OCR](ocr.md)
- [Keywords extraction](keywords.md)
- [Transcription, Translation & Language identification](transcription-translation-lid.md)
- [Named entities](named-entities.md)
- [Observed people tracking & matched persons](observed-matched-people.md)
- [Topics inference](topics-inference.md)
