---
title: Introduction to Azure AI Video Indexer audio effects detection
titleSuffix: Azure AI Video Indexer 
description: An introduction to Azure AI Video Indexer audio effects detection component responsibly.
ms.service: azure-video-indexer
ms.date: 06/15/2022
ms.topic: article
author: IngridAtMicrosoft
ms.author: inhenkel
---

# Audio effects detection

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

Audio effects detection is an Azure AI Video Indexer feature that detects insights on various acoustic events and classifies them into acoustic categories. Audio effect detection can detect and classify different categories such as laughter, crowd reactions, alarms and/or sirens.  

When working on the website, the instances are displayed in the Insights tab. They can also be generated in a categorized list in a JSON file that includes the category ID, type, name, and instances per category together with the specific timeframes and confidence score. 

## Prerequisites  

Review [transparency note overview](/legal/azure-video-indexer/transparency-note?context=/azure/azure-video-indexer/context/context)

## General principles 

This article discusses audio effects detection and the key considerations for making use of this technology responsibly. There are many things you need to consider when deciding how to use and implement an AI-powered feature: 

* Does this feature perform well in my scenario? Before deploying audio effects detection into your scenario, test how it performs using real-life data and make sure it can deliver the accuracy you need. 
* Are we equipped to identify and respond to errors? AI-powered products and features won't be 100% accurate, so consider how you'll identify and respond to any errors that may occur. 

## View the insight

To see the instances on the website, do the following: 

1. When uploading the media file, go to Video + Audio Indexing, or go to Audio Only or Video + Audio and select Advanced. 
1. After the file is uploaded and indexed, go to Insights and scroll to audio effects. 

To display the JSON file, do the following: 

1. Select Download -> Insights (JSON).  
1. Copy the `audioEffects` element, under `insights`, and paste it into your Online JSON viewer. 

    ```json
    "audioEffects": [
      {
        "id": 1,
        "type": "Silence",
        "instances": [
          {
            "confidence": 0,
            "adjustedStart": "0:01:46.243",
            "adjustedEnd": "0:01:50.434",
            "start": "0:01:46.243",
            "end": "0:01:50.434"
          }
        ]
      },
      {
        "id": 2,
        "type": "Speech",
        "instances": [
          {
            "confidence": 0,
            "adjustedStart": "0:00:00",
            "adjustedEnd": "0:01:43.06",
            "start": "0:00:00",
            "end": "0:01:43.06"
          }
        ]
      }
    ],
    ```

To download the JSON file via the API, use the [Azure AI Video Indexer developer portal](https://api-portal.videoindexer.ai/). 

## Audio effects detection components 

During the audio effects detection procedure, audio in a media file is processed, as follows: 

|Component|Definition|
|---|---|
|Source file |	The user uploads the source file for indexing. |
|Segmentation|  	The audio is analyzed, nonspeech audio is identified and then split into short overlapping internals. |
|Classification| 	An AI process analyzes each segment and classifies its contents into event categories such as crowd reaction or laughter. A probability list is then created for each event category according to department-specific rules. |
|Confidence level|	The estimated confidence level of each audio effect is calculated as a range of 0 to 1. The confidence score represents the certainty in the accuracy of the result. For example, an 82% certainty is represented as an 0.82 score.|

## Example use cases 

- Companies with a large video archive can improve accessibility by offering more context for a hearing- impaired audience by transcription of nonspeech effects. 
- Improved efficiency when creating raw data for content creators. Important moments in promos and trailers such as laughter, crowd reactions, gunshots, or explosions can be identified, for example,  in Media and Entertainment. 
- Detecting and classifying gunshots, explosions, and glass shattering in a smart-city system or in other public environments that include cameras and microphones to offer fast and accurate detection of violence incidents.  

## Considerations and limitations when choosing a use case 

- Avoid use of short or low-quality audio, audio effects detection provides probabilistic and partial data on detected nonspeech audio events. For accuracy, audio effects detection requires at least 2 seconds of clear nonspeech audio. Voice commands or singing aren't supported.   
- Avoid use of audio with loud background music or music with repetitive and/or linearly scanned frequency, audio effects detection is designed for nonspeech audio only and therefore can't classify events in loud music. Music with repetitive and/or linearly scanned frequency many be incorrectly classified as an alarm or siren. 
- Carefully consider the methods of usage in law enforcement and similar institutions, to promote more accurate probabilistic data, carefully review the following: 

    - Audio effects can be detected in nonspeech segments only. 
    - The duration of a nonspeech section should be at least 2 seconds. 
    - Low quality audio might impact the detection results.  
    - Events in loud background music aren't classified.  
    - Music with repetitive and/or linearly scanned frequency might be incorrectly classified as an alarm or siren. 
    - Knocking on a door or slamming a door might be labeled as a gunshot or explosion. 
    - Prolonged shouting or sounds of physical human effort might be incorrectly classified. 
    - A group of people laughing might be classified as both laughter and crowd. 
    - Natural and nonsynthetic gunshot and explosions sounds are supported. 

When used responsibly and carefully, Azure AI Video Indexer is a valuable tool for many industries. To respect the privacy and safety of others, and to comply with local and global regulations, we recommend the following:   

- Always respect an individual’s right to privacy, and only ingest audio for lawful and justifiable purposes.   
- Don't purposely disclose inappropriate audio of young children or family members of celebrities or other content that may be detrimental or pose a threat to an individual’s personal freedom.   
- Commit to respecting and promoting human rights in the design and deployment of your analyzed audio.   
- When using third party materials, be aware of any existing copyrights or permissions required before distributing content derived from them.  
- Always seek legal advice when using audio from unknown sources.  
- Be aware of any applicable laws or regulations that exist in your area regarding processing, analyzing, and sharing audio containing people.  
- Keep a human in the loop. Don't use any solution as a replacement for human oversight and decision-making.   
- Fully examine and review the potential of any AI model you're using to understand its capabilities and limitations.  

## Next steps

- [Microsoft Responsible AI principles](https://www.microsoft.com/ai/responsible-ai?activetab=pivot1%3aprimaryr6) 
- [Microsoft Responsible AI resources](https://www.microsoft.com/ai/responsible-ai-resources)
- [Microsoft Azure Learning courses on Responsible AI](/training/paths/responsible-ai-business-principles/)
- [Microsoft Global Human Rights Statement](https://www.microsoft.com/corporate-responsibility/human-rights-statement?activetab=pivot_1:primaryr5)  

### Contact us

`visupport@microsoft.com`  

## Azure AI Video Indexer insights

- [Face detection](face-detection.md)
- [OCR](ocr.md)
- [Keywords extraction](keywords.md)
- [Transcription, translation & language identification](transcription-translation-lid.md)
- [Labels identification](labels-identification.md) 
- [Named entities](named-entities.md)
- [Observed people tracking & matched faces](observed-matched-people.md)
- [Topics inference](topics-inference.md)
