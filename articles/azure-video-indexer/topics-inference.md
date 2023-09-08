---
title: Azure AI Video Indexer topics inference overview 
titleSuffix: Azure AI Video Indexer 
description: An introduction to Azure AI Video Indexer topics inference component responsibly.
author: Juliako
ms.author: juliako
manager: femila
ms.service: azure-video-indexer
ms.date: 06/15/2022
ms.topic: article
---

# Topics inference  

Topics inference is an Azure AI Video Indexer AI feature that automatically creates inferred insights derived from the transcribed audio, OCR content in visual text, and celebrities recognized in the video using the Video Indexer facial recognition model. The extracted Topics and categories (when available) are listed in the Insights tab. To jump to the topic in the media file, click a Topic -> Play Previous or Play Next. 

The resulting insights are also generated in a categorized list in a JSON file which includes the topic name, timeframe and confidence score.  

## Prerequisites  

Review [transparency note overview](/legal/azure-video-indexer/transparency-note?context=/azure/azure-video-indexer/context/context)

## General principles 

This article discusses topics and the key considerations for making use of this technology responsibly. There are many things you need to consider when deciding how to use and implement an AI-powered feature:

- Will this feature perform well in my scenario? Before deploying topics inference into your scenario, test how it performs using real-life data and make sure it can deliver the accuracy you need.
- Are we equipped to identify and respond to errors? AI-powered products and features won't be 100% accurate, so consider how you'll identify and respond to any errors that may occur.

## View the insight

To display Topics Inference insights on the website.

1. Go to Insights and scroll to Topics.

To display the instances in a JSON file, do the following: 

1. Click Download -> Insight (JSON). 
1. Copy the `topics` text and paste it into your JSON viewer.
     
    ```json
    "topics": [
      {
        "id": 1,
        "name": "Pens",
        "referenceId": "Category:Pens",
        "referenceUrl": "https://en.wikipedia.org/wiki/Category:Pens",
        "referenceType": "Wikipedia",
        "confidence": 0.6833,
        "iabName": null,
        "language": "en-US",
        "instances": [
          {
            "adjustedStart": "0:00:30",
            "adjustedEnd": "0:01:17.5",
            "start": "0:00:30",
            "end": "0:01:17.5"
          }
        ]
      },
      {
        "id": 2,
        "name": "Musical groups",
        "referenceId": "Category:Musical_groups",
        "referenceUrl": "https://en.wikipedia.org/wiki/Category:Musical_groups",
        "referenceType": "Wikipedia",
        "confidence": 0.6812,
        "iabName": null,
        "language": "en-US",
        "instances": [
          {
            "adjustedStart": "0:01:10",
            "adjustedEnd": "0:01:17.5",
            "start": "0:01:10",
            "end": "0:01:17.5"
          }
        ]
      },
    ```
    
To download the JSON file via the API, use the [Azure AI Video Indexer developer portal](https://api-portal.videoindexer.ai/). 

For more information, see [about topics](https://azure.microsoft.com/blog/multi-modal-topic-inferencing-from-videos/).

## Topics components 

During the topics indexing procedure, topics are extracted, as follows:

|Component|Definition|
|---|---|
|Source language	|The user uploads the source file for indexing.|
|Pre-processing|Transcription, OCR and facial recognition AIs extract insights from the media file.|
|Insights processing|	Topics AI analyzes the transcription, OCR and facial recognition insights extracted during pre-processing: <br/>-	Transcribed text, each line of transcribed text insight is examined using ontology-based AI technologies. <br/>-	OCR and Facial Recognition insights are examined together using ontology-based AI technologies.  |
|Post-processing	|- Transcribed text, insights are extracted and tied to a Topic category together with the line number of the transcribed text. For example, Politics in line 7.<br/>- OCR and Facial Recognition, each insight is tied to a Topic category together with the time of the topic’s instance in the media file. For example, Freddie Mercury in the People and Music categories at 20.00. |
|Confidence value	|The estimated confidence level of each topic is calculated as a range of 0 to 1. The confidence score represents the certainty in the accuracy of the result. For example, an 82% certainty is represented as an 0.82 score.|

## Example use cases 

- Personalization using topics inference to match customer interests, for example websites about England posting promotions about English movies or festivals.
- Deep-searching archives for insights on specific topics to create feature stories about companies, personas or technologies, for example by a news agency. 
-	Monetization, increasing the worth of extracted insights. For example, industries like the news or social media that rely on ad revenue can deliver relevant ads by using the extracted insights as additional signals to the ad server.

## Considerations and limitations when choosing a use case 

Below are some considerations to keep in mind when using topics:

- When uploading a file always use high-quality video content. The recommended maximum frame size is HD and frame rate is 30 FPS. A frame should contain no more than 10 people. When outputting frames from videos to AI models, only send around 2 or 3 frames per second. Processing 10 and more frames might delay the AI result.  
- When uploading a file always use high quality audio and video content. At least 1 minute of spontaneous conversational speech is required to perform analysis. Audio effects are detected in non-speech segments only. The minimal duration of a non-speech section is 2 seconds. Voice commands and singing aren't supported. 
- Typically, small people or objects under 200 pixels and people who are seated may not be detected. People wearing similar clothes or uniforms might be detected as being the same person and will be given the same ID number. People or objects that are obstructed may not be detected. Tracks of people with front and back poses may be split into different instances. 

When used responsibly and carefully, Azure AI Video Indexer is a valuable tool for many industries. To respect the privacy and safety of others, and to comply with local and global regulations, we recommend the following:  

- Always respect an individual’s right to privacy, and only ingest videos for lawful and justifiable purposes.  
- Don't purposely disclose inappropriate media showing young children or family members of celebrities or other content that may be detrimental or pose a threat to an individual’s personal freedom.  
- Commit to respecting and promoting human rights in the design and deployment of your analyzed media.  
- When using 3rd party materials, be aware of any existing copyrights or permissions required before distributing content derived from them. 
- Always seek legal advice when using media from unknown sources. 
- Always obtain appropriate legal and professional advice to ensure that your uploaded videos are secured and have adequate controls to preserve the integrity of your content and to prevent unauthorized access.    
- Provide a feedback channel that allows users and individuals to report issues with the service.  
- Be aware of any applicable laws or regulations that exist in your area regarding processing, analyzing, and sharing media containing people. 
- Keep a human in the loop. Don't use any solution as a replacement for human oversight and decision-making.  
- Fully examine and review the potential of any AI model you're using to understand its capabilities and limitations. 

## Next steps

### Learn More about Responsible AI

- [Microsoft Responsible AI principles](https://www.microsoft.com/ai/responsible-ai?activetab=pivot1%3aprimaryr6) 
- [Microsoft Responsible AI resources](https://www.microsoft.com/ai/responsible-ai-resources)
- [Microsoft Azure Learning courses on Responsible AI](/training/paths/responsible-ai-business-principles/)
- [Microsoft Global Human Rights Statement](https://www.microsoft.com/corporate-responsibility/human-rights-statement?activetab=pivot_1:primaryr5)  

### Contact us

`visupport@microsoft.com`  

## Azure AI Video Indexer insights

- [Audio effects detection](audio-effects-detection.md)
- [Face detection](face-detection.md)
- [Keywords extraction](keywords.md)
- [Transcription, translation & language identification](transcription-translation-lid.md)
- [Labels identification](labels-identification.md) 
- [Named entities](named-entities.md)
- [Observed people tracking & matched faces](observed-matched-people.md)
