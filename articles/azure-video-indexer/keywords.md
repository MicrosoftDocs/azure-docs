---
title: Azure AI Video Indexer keywords extraction overview 
titleSuffix: Azure AI Video Indexer 
description: An introduction to Azure AI Video Indexer keywords extraction component responsibly.
author: Juliako
ms.author: juliako
manager: femila
ms.service: azure-video-indexer
ms.date: 06/15/2022
ms.topic: article
---

# Keywords extraction  

Keywords extraction is an Azure AI Video Indexer AI feature that automatically detects insights on the different keywords discussed in media files. Keywords extraction can extract insights in both single language and multi-language media files. The total number of extracted keywords and their categories are listed in the Insights tab, where clicking a Keyword and then clicking Play Previous or Play Next jumps to the keyword in the media file.  

## Prerequisites  

Review [Transparency Note overview](/legal/azure-video-indexer/transparency-note?context=/azure/azure-video-indexer/context/context)

## General principles 

This article discusses Keywords and the key considerations for making use of this technology responsibly. There are many things you need to consider when deciding how to use and implement an AI-powered feature: 

- Will this feature perform well in my scenario? Before deploying Keywords Extraction into your scenario, test how it performs using real-life data and make sure it can deliver the accuracy you need. 
- Are we equipped to identify and respond to errors? AI-powered products and features won't be 100% accurate, so consider how you'll identify and respond to any errors that may occur. 

## View the insight

When working on the website the insights are displayed in the **Insights** tab. They can also be generated in a categorized list in a JSON file which includes the Keyword’s ID, text, together with each keyword’s specific start and end time and confidence score.  

To display the instances in a JSON file, do the following: 

1. Click Download and then Insights (JSON).  
1. Copy the text and paste it into your Online JSON Viewer. 
    
    ```json
    "keywords": [
      {
        "id": 1,
        "text": "office insider",
        "confidence": 1,
        "language": "en-US",
        "instances": [
          {
            "adjustedStart": "0:00:00",
            "adjustedEnd": "0:00:05.75",
            "start": "0:00:00",
            "end": "0:00:05.75"
          },
          {
            "adjustedStart": "0:01:21.82",
            "adjustedEnd": "0:01:24.7",
            "start": "0:01:21.82",
            "end": "0:01:24.7"
          },
          {
            "adjustedStart": "0:01:31.32",
            "adjustedEnd": "0:01:32.76",
            "start": "0:01:31.32",
            "end": "0:01:32.76"
          },
          {
            "adjustedStart": "0:01:35.8",
            "adjustedEnd": "0:01:37.84",
            "start": "0:01:35.8",
            "end": "0:01:37.84"
          }
        ]
      },
      {
        "id": 2,
        "text": "insider tip",
        "confidence": 0.9975,
        "language": "en-US",
        "instances": [
          {
            "adjustedStart": "0:01:14.91",
            "adjustedEnd": "0:01:19.51",
            "start": "0:01:14.91",
            "end": "0:01:19.51"
          }
        ]
      },

    ```
    
To download the JSON file via the API, use the [Azure AI Video Indexer developer portal](https://api-portal.videoindexer.ai/). 

> [!NOTE]
> Keywords extraction is language independent. 

## Keywords components

During the Keywords procedure, audio and images in a media file are processed, as follows:

|Component|Definition|
|---|---|
|Source language |	The user uploads the source file for indexing. |
|Transcription API	|The audio file is sent to Azure AI services and the translated transcribed output is returned. If a language has been specified it is processed.| 
|OCR of video	|Images in a media file are processed using the Azure AI Vision Read API to extract text, its location, and other insights.  |
|Keywords extraction	|An extraction algorithm processes the transcribed audio. The results are then combined with the insights detected in the video during the OCR process. The keywords and where they appear in the media and then detected and identified. |
|Confidence level|	The estimated confidence level of each keyword is calculated as a range of 0 to 1. The confidence score represents the certainty in the accuracy of the result. For example, an 82% certainty will be represented as an 0.82 score.|

## Example use cases 

- Personalization of keywords to match customer interests, for example websites about England posting promotions about English movies or festivals. 
- Deep-searching archives for insights on specific keywords to create feature stories about companies, personas or technologies, for example by a news agency.  

## Considerations and limitations when choosing a use case 

Below are some considerations to keep in mind when using keywords extraction: 

- When uploading a file always use high-quality video content. The recommended maximum frame size is HD and frame rate is 30 FPS. A frame should contain no more than 10 people. When outputting frames from videos to AI models, only send around 2 or 3 frames per second. Processing 10 and more frames might delay the AI result.   
- When uploading a file always use high quality audio and video content. At least 1 minute of spontaneous conversational speech is required to perform analysis. Audio effects are detected in non-speech segments only. The minimal duration of a non-speech section is 2 seconds. Voice commands and singing aren't supported.  

When used responsibly and carefully Keywords is a valuable tool for many industries. To respect the privacy and safety of others, and to comply with local and global regulations, we recommend the following:   

- Always respect an individual’s right to privacy, and only ingest media for lawful and justifiable purposes.   
- Don't purposely disclose inappropriate media showing young children or family members of celebrities or other content that may be detrimental or pose a threat to an individual’s personal freedom.   
- Commit to respecting and promoting human rights in the design and deployment of your analyzed media.   
- When using 3rd party materials, be aware of any existing copyrights or permissions required before distributing content derived from them.  
- Always seek legal advice when using media from unknown sources.  
- Always obtain appropriate legal and professional advice to ensure that your uploaded media is secured and have adequate controls to preserve the integrity of your content and to prevent unauthorized access.     
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
- [OCR](ocr.md)
- [Transcription, Translation & Language identification](transcription-translation-lid.md)
- [Labels identification](labels-identification.md) 
- [Named entities](named-entities.md)
- [Observed people tracking & matched persons](observed-matched-people.md)
- [Topics inference](topics-inference.md)
