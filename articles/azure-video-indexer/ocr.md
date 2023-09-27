---
title: Azure AI Video Indexer optical character recognition (OCR) overview 
titleSuffix: Azure AI Video Indexer 
description: An introduction to Azure AI Video Indexer optical character recognition (OCR) component responsibly.
manager: femila
ms.service: azure-video-indexer
ms.date: 06/15/2022
ms.topic: article
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Optical character recognition (OCR)

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

Optical character recognition (OCR) is an Azure AI Video Indexer AI feature that extracts text from images like pictures, street signs and products in media files to create insights.  

OCR currently extracts insights from printed and handwritten text in over 50 languages, including from an image with text in multiple languages. For more information, see [OCR supported languages](../ai-services/computer-vision/language-support.md#optical-character-recognition-ocr).    

## Prerequisites  

Review [transparency note overview](/legal/azure-video-indexer/transparency-note?context=/azure/azure-video-indexer/context/context)

## General principles 

This article discusses optical character recognition (OCR) and the key considerations for making use of this technology responsibly. There are many things you need to consider when deciding how to use and implement an AI-powered feature: 

- Will this feature perform well in my scenario? Before deploying OCR into your scenario, test how it performs using real-life data and make sure it can deliver the accuracy you need. 
- Are we equipped to identify and respond to errors? AI-powered products and features won't be 100% accurate, so consider how you'll identify and respond to any errors that may occur. 

## View the insight

When working on the website the insights are displayed in the **Timeline** tab. They can also be generated in a categorized list in a JSON file that includes the ID, transcribed text, duration and confidence score.  

To see the instances on the website, do the following: 

1. Go to View and check OCR.  
1. Select Timeline to display the extracted text. 

Insights can also be generated in a categorized list in a JSON file that includes the ID, language, text together with each instance’s confidence score.  

To see  the insights in a JSON file, do the following: 

1. Select Download -> Insight (JSON).  
1. Copy the `ocr` element, under `insights`, and paste it into your online JSON viewer. 
    
    ```json
    "ocr": [
        {
          "id": 1,
          "text": "2017 Ruler",
          "confidence": 0.4365,
          "left": 901,
          "top": 3,
          "width": 80,
          "height": 23,
          "angle": 0,
          "language": "en-US",
          "instances": [
            {
              "adjustedStart": "0:00:45.5",
              "adjustedEnd": "0:00:46",
              "start": "0:00:45.5",
              "end": "0:00:46"
            },
            {
              "adjustedStart": "0:00:55",
              "adjustedEnd": "0:00:55.5",
              "start": "0:00:55",
              "end": "0:00:55.5"
            }
          ]
        },
        {
          "id": 2,
          "text": "2017 Ruler postppu - PowerPoint",
          "confidence": 0.4712,
          "left": 899,
          "top": 4,
          "width": 262,
          "height": 48,
          "angle": 0,
          "language": "en-US",
          "instances": [
            {
              "adjustedStart": "0:00:44.5",
              "adjustedEnd": "0:00:45",
              "start": "0:00:44.5",
              "end": "0:00:45"
            }
          ]
        },
    ```
    
To download the JSON file via the API, use the [Azure AI Video Indexer developer portal](https://api-portal.videoindexer.ai/). 

## OCR components 

During the OCR procedure, text images in a media file are processed, as follows:  

|Component|Definition|
|---|---|
|Source file|	The user uploads the source file for indexing.|
|Read model	|Images are detected in the media file and text is then extracted and analyzed by Azure AI services. |
|Get read results model	|The output of the extracted text is displayed in a JSON file.|
|Confidence value|	The estimated confidence level of each word is calculated as a range of 0 to 1. The confidence score represents the certainty in the accuracy of the result. For example, an 82% certainty will be represented as an 0.82 score.|

For more information, see [OCR technology](../ai-services/computer-vision/overview-ocr.md). 

## Example use cases 

- Deep searching media footage for images with signposts, street names or car license plates, for example, in law enforcement. 
- Extracting text from images in media files and then translating it into multiple languages in labels for accessibility, for example in media or entertainment. 
- Detecting brand names in images and tagging them for translation purposes, for example in advertising and branding. 
- Extracting text in images that is then automatically tagged and categorized for accessibility and future usage, for example to generate content at a news agency. 
- Extracting text in warnings in online instructions and then translating the text to comply with local standards, for example, e-learning instructions for using equipment.     

## Considerations and limitations when choosing a use case 

- Carefully consider the accuracy of the results, to promote more accurate detections, check the quality of the image, low quality images might impact the detected insights.  
- Carefully consider when using for law enforcement that OCR can potentially misread or not detect parts of the text. To ensure fair and high-quality decisions, combine OCR-based automation with human oversight. 
- When extracting handwritten text, avoid using the OCR results of signatures that are hard to read for both humans and machines. A better way to use OCR is to use it for detecting the presence of a signature for further analysis. 
- Don't use OCR for decisions that may have serious adverse impacts. Machine learning models that extract text can result in undetected or incorrect text output. Decisions based on incorrect output could have serious adverse impacts. Additionally, it's advisable to include human review of decisions that have the potential for serious impacts on individuals. 

When used responsibly and carefully, Azure AI Video Indexer is a valuable tool for many industries. To respect the privacy and safety of others, and to comply with local and global regulations, we recommend the following:   

- Always respect an individual’s right to privacy, and only ingest videos for lawful and justifiable purposes.   
- Don't purposely disclose inappropriate content about young children or family members of celebrities or other content that may be detrimental or pose a threat to an individual’s personal freedom.   
- Commit to respecting and promoting human rights in the design and deployment of your analyzed media.   
- When using third party materials, be aware of any existing copyrights or permissions required before distributing content derived from them.  
- Always seek legal advice when using content from unknown sources.  
- Always obtain appropriate legal and professional advice to ensure that your uploaded videos are secured and have adequate controls to preserve the integrity of your content and to prevent unauthorized access.     
- Provide a feedback channel that allows users and individuals to report issues with the service.   
- Be aware of any applicable laws or regulations that exist in your area regarding processing, analyzing, and sharing media containing people.  
- Keep a human in the loop. Don't use any solution as a replacement for human oversight and decision-making.   
- Fully examine and review the potential of any AI model you're using to understand its capabilities and limitations.  

## Learn more about OCR

- [Azure AI services documentation](/azure/ai-services/computer-vision/overview-ocr)
- [Transparency note](/legal/cognitive-services/computer-vision/ocr-transparency-note)  
- [Use cases](/legal/cognitive-services/computer-vision/ocr-transparency-note#example-use-cases) 
- [Capabilities and limitations](/legal/cognitive-services/computer-vision/ocr-characteristics-and-limitations) 
- [Guidance for integration and responsible use with OCR technology](/legal/cognitive-services/computer-vision/ocr-guidance-integration-responsible-use)
- [Data, privacy and security](/legal/cognitive-services/computer-vision/ocr-data-privacy-security)
- [Meter: WER](/legal/cognitive-services/computer-vision/ocr-characteristics-and-limitations#word-level-accuracy-measure)  

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
- [Topics inference](topics-inference.md)
