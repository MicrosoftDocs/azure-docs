---
title: Azure Video Indexer labels identification overview
titleSuffix: Azure Video Indexer 
description: This article gives an overview of an Azure Video Indexer labels identification.
author: juliako
ms.author: juliako
manager: femila
ms.service: azure-video-indexer
ms.date: 06/15/2022
ms.topic: article
---

# Labels identification  

Labels identification is an Azure Video Indexer AI feature that identifies visual objects like sunglasses or actions like swimming, appearing in the video footage of a media file. There are many labels identification categories and once extracted, labels identification instances are displayed in the Insights tab and can be translated into over 50 languages. Clicking a Label opens the instance in the media file, select Play Previous or Play Next to see more instances. 

## Prerequisites  

Review [Transparency Note overview](/legal/azure-video-indexer/transparency-note?context=/azure/azure-video-indexer/context/context)

## General principles 

This article discusses labels identification and the key considerations for making use of this technology responsibly. There are many things you need to consider when deciding how to use and implement an AI-powered feature:

- Does this feature perform well in my scenario? Before deploying labels identification into your scenario, test how it performs using real-life data and make sure it can deliver the accuracy you need.
- Are we equipped to identify and respond to errors? AI-powered products and features won't be 100% accurate, so consider how you'll identify and respond to any errors that may occur.

## View the insight

When working on the website the instances are displayed in the Insights tab. They can also be generated in a categorized list in a JSON file that includes the Labels ID, category, instances together with each label’s specific start and end times and confidence score, as follows: 

To display labels identification insights in a JSON file, do the following: 

1. Click Download and then Insights (JSON). 
1. Copy the text, paste it into your JSON Viewer.

    ```json
    "labels": [
        {
        "id": 1,
        "name": "human face",
        "language": "en-US",
        "instances": [
            {
            "confidence": 0.9987,
            "adjustedStart": "0:00:00",
            "adjustedEnd": "0:00:25.6",
            "start": "0:00:00",
            "end": "0:00:25.6"
            },
            {
            "confidence": 0.9989,
            "adjustedStart": "0:01:21.067",
            "adjustedEnd": "0:01:41.334",
            "start": "0:01:21.067",
            "end": "0:01:41.334"
            }
        ]
        },
        {
        "id": 2,
        "name": "person",
        "referenceId": "person",
        "language": "en-US",
        "instances": [
            {
            "confidence": 0.9959,
            "adjustedStart": "0:00:00",
            "adjustedEnd": "0:00:26.667",
            "start": "0:00:00",
            "end": "0:00:26.667"
            },
            {
            "confidence": 0.9974,
            "adjustedStart": "0:01:21.067",
            "adjustedEnd": "0:01:41.334",
            "start": "0:01:21.067",
            "end": "0:01:41.334"
            }
        ]
        },
    ```

To download the JSON file via the API, [Azure Video Indexer developer portal](https://api-portal.videoindexer.ai/). 

## Labels components 

During the Labels procedure, objects in a media file are processed, as follows:

|Component|Definition|
|---|---|
|Source	|The user uploads the source file for indexing. |
|Tagging|	Images are tagged and labeled. For example, door, chair, woman, headphones, jeans. |
|Filtering and aggregation	|Tags are filtered according to their confidence level and aggregated according to their category.|
|Confidence level|	The estimated confidence level of each label is calculated as a range of 0 to 1. The confidence score represents the certainty in the accuracy of the result. For example, an 82% certainty is represented as an 0.82 score.|

## Example use cases 

- Extracting labels from frames for contextual advertising or branding. For example, placing an ad for beer following footage on a beach.
- Creating a verbal description of footage to enhance accessibility for the visually impaired, for example a background storyteller in movies. 
- Deep searching media archives for insights on specific objects to create feature stories for the news.
- Using relevant labels to create content for trailers, highlights reels, social media or new clips. 

## Considerations when choosing a use case 

- Carefully consider the accuracy of the results, to promote more accurate detections, check the quality of the video, low quality video might impact the detected insights. 
- Carefully consider when using for law enforcement that Labels potentially cannot detect parts of the video. To ensure fair and high-quality decisions, combine Labels with human oversight. 
- Don't use labels identification for decisions that may have serious adverse impacts. Machine learning models can result in undetected or incorrect classification output. Decisions based on incorrect output could have serious adverse impacts. Additionally, it's advisable to include human review of decisions that have the potential for serious impacts on individuals. 

When used responsibly and carefully, Azure Video Indexer is a valuable tool for many industries. To respect the privacy and safety of others, and to comply with local and global regulations, we recommend the following:   

- Always respect an individual’s right to privacy, and only ingest videos for lawful and justifiable purposes.  
- Don't purposely disclose inappropriate content about young children or family members of celebrities or other content that may be detrimental or pose a threat to an individual’s personal freedom.  
- Commit to respecting and promoting human rights in the design and deployment of your analyzed media.  
- When using 3rd party materials, be aware of any existing copyrights or permissions required before distributing content derived from them. 
- Always seek legal advice when using content from unknown sources. 
- Always obtain appropriate legal and professional advice to ensure that your uploaded videos are secured and have adequate controls to preserve the integrity of your content and to prevent unauthorized access.    
- Provide a feedback channel that allows users and individuals to report issues with the service.  
- Be aware of any applicable laws or regulations that exist in your area regarding processing, analyzing, and sharing media containing people. 
- Keep a human in the loop. Do not use any solution as a replacement for human oversight and decision-making.  
- Fully examine and review the potential of any AI model you're using to understand its capabilities and limitations. 

## Next steps

### Learn More about Responsible AI

- [Microsoft Responsible AI principles](https://www.microsoft.com/ai/responsible-ai?activetab=pivot1%3aprimaryr6) 
- [Microsoft Responsible AI resources](https://www.microsoft.com/ai/responsible-ai-resources)
- [Microsoft Azure Learning courses on Responsible AI](/training/paths/responsible-ai-business-principles/)
- [Microsoft Global Human Rights Statement](https://www.microsoft.com/corporate-responsibility/human-rights-statement?activetab=pivot_1:primaryr5)  

### Contact us

`visupport@microsoft.com`  

## Azure Video Indexer insights

- [Audio effects detection](audio-effects-detection.md)
- [Face detection](face-detection.md)
- [OCR](ocr.md)
- [Keywords extraction](keywords.md)
- [Transcription, Translation & Language identification](transcription-translation-lid.md)
- [Named entities](named-entities.md)
- [Observed people tracking & matched persons](observed-matched-people.md)
- [Topics inference](topics-inference.md)
