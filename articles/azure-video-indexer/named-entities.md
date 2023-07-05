---
title: Azure Video Indexer named entities extraction overview 
titleSuffix: Azure Video Indexer 
description: An introduction to Azure Video Indexer named entities extraction component responsibly.
author: Juliako
ms.author: juliako
manager: femila
ms.service: azure-video-indexer
ms.date: 06/15/2022
ms.topic: article
---

# Named entities extraction  

Named entities extraction is an Azure Video Indexer AI feature that uses Natural Language Processing (NLP) to extract insights on the locations, people and brands appearing in audio and images in media files. Named entities extraction is automatically used with Transcription and OCR and its insights are based on those extracted during these processes. The resulting insights are displayed in the **Insights** tab and are filtered into locations, people and brand categories. Clicking a named entity, displays its instance in the media file. It also displays a description of the entity and a Find on Bing link of recognizable entities.   

## Prerequisites  

Review [Transparency Note overview](/legal/azure-video-indexer/transparency-note?context=/azure/azure-video-indexer/context/context)

## General principles 

This article discusses named entities and the key considerations for making use of this technology responsibly. There are many things you need to consider when deciding how to use and implement an AI-powered feature:

-	Will this feature perform well in my scenario? Before deploying named entities extraction into your scenario, test how it performs using real-life data and make sure it can deliver the accuracy you need.
-	Are we equipped to identify and respond to errors? AI-powered products and features won't be 100% accurate, so consider how you'll identify and respond to any errors that may occur.

## View the insight

To see the insights in the website, do the following:

1. Go to View and check Named Entities.
1. Go to Insights and scroll to named entities.

To display named entities extraction insights in a JSON file, do the following: 

1. Click Download and then Insights (JSON).
2. Named entities are divided into three:

    * Brands
    * Location
    * People
3. Copy the text and paste it into your JSON Viewer.
    
    ```json
    namedPeople: [
    {
    referenceId: "Satya_Nadella",
    referenceUrl: "https://en.wikipedia.org/wiki/Satya_Nadella",
    confidence: 1,
    description: "CEO of Microsoft Corporation",
    seenDuration: 33.2,
    id: 2,
    name: "Satya Nadella",
    appearances: [
    {
    startTime: "0:01:11.04",
    endTime: "0:01:17.36",
    startSeconds: 71,
    endSeconds: 77.4
    },
    {
    startTime: "0:01:31.83",
    endTime: "0:01:37.1303666",
    startSeconds: 91.8,
    endSeconds: 97.1
    },
    ```
    
To download the JSON file via the API, use the [Azure Video Indexer developer portal](https://api-portal.videoindexer.ai/). 

## Named entities extraction components 

During the named entities extraction procedure, the media file is processed, as follows:   

|Component|Definition|
|---|---|
|Source file | 	The user uploads the source file for indexing. |
|Text extraction |- The audio file is sent to Speech Services API to extract the transcription.<br/>- Sampled frames are sent to the Computer Vision API to extract OCR. |
|Analytics	|The insights are then sent to the Text Analytics API to extract the entities. For example, Microsoft, Paris or a person’s name like Paul or Sarah.
|Processing and consolidation |	The results are then processed. Where applicable, Wikipedia links are added and brands are identified via the Video Indexer built-in and customizable branding lists.
Confidence value	The estimated confidence level of each named entity is calculated as a range of 0 to 1. The confidence score represents the certainty in the accuracy of the result. For example, an 82% certainty is represented as an 0.82 score.|

## Example use cases 

-	Contextual advertising, for example, placing an ad for a Pizza chain following footage on Italy.
- Deep searching media archives for insights on people or locations to create feature stories for the news.
-	Creating a verbal description of footage via OCR processing to enhance accessibility for the visually impaired, for example a background storyteller in movies. 
-	Extracting insights on brand na

## Considerations and limitations when choosing a use case 

-	Carefully consider the accuracy of the results, to promote more accurate detections, check the quality of the audio and images, low quality audio and images might impact the detected insights. 
-	Named entities only detect insights in audio and images. Logos in a brand name may not be detected.
-	Carefully consider that when using for law enforcement named entities may not always detect parts of the audio. To ensure fair and high-quality decisions, combine named entities with human oversight. 
-	Don't use named entities for decisions that may have serious adverse impacts. Machine learning models that extract text can result in undetected or incorrect text output. Decisions based on incorrect output could have serious adverse impacts. Additionally, it's advisable to include human review of decisions that have the potential for serious impacts on individuals. 

When used responsibly and carefully Azure Video Indexer is a valuable tool for many industries. To respect the privacy and safety of others, and to comply with local and global regulations, we recommend the following:  

-	Always respect an individual’s right to privacy, and only ingest videos for lawful and justifiable purposes.  
-	Don't purposely disclose inappropriate content about young children or family members of celebrities or other content that may be detrimental or pose a threat to an individual’s personal freedom.  
-	Commit to respecting and promoting human rights in the design and deployment of your analyzed media.  
-	When using 3rd party materials, be aware of any existing copyrights or permissions required before distributing content derived from them. 
-	Always seek legal advice when using content from unknown sources. 
-	Always obtain appropriate legal and professional advice to ensure that your uploaded videos are secured and have adequate controls to preserve the integrity of your content and to prevent unauthorized access.    
-	Provide a feedback channel that allows users and individuals to report issues with the service.  
-	Be aware of any applicable laws or regulations that exist in your area regarding processing, analyzing, and sharing media containing people. 
-	Keep a human in the loop. Do not use any solution as a replacement for human oversight and decision-making.  
-	Fully examine and review the potential of any AI model you're using to understand its capabilities and limitations. 

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
- [Keywords extraction](keywords.md)
- [Transcription, Translation & Language identification](transcription-translation-lid.md)
- [Labels identification](labels-identification.md) 
- [Observed people tracking & matched persons](observed-matched-people.md)
- [Topics inference](topics-inference.md)
