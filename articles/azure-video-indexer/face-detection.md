---
title: Azure AI Video Indexer face detection overview
titleSuffix: Azure AI Video Indexer 
description: This article gives an overview of an Azure AI Video Indexer face detection.
author: juliako
ms.author: juliako
manager: femila
ms.service: azure-video-indexer
ms.date: 04/17/2023
ms.topic: article
---

# Face detection  

> [!IMPORTANT]
> Face identification, customization and celebrity recognition features access is limited based on eligibility and usage criteria in order to support our Responsible AI principles. Face identification, customization and celebrity recognition features are only available to Microsoft managed customers and partners. Use the [Face Recognition intake form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUQjA5SkYzNDM4TkcwQzNEOE1NVEdKUUlRRCQlQCN0PWcu) to apply for access.

Face detection is an Azure AI Video Indexer AI feature that automatically detects faces in a media file and aggregates instances of similar faces into the same group. The celebrities recognition module is then run to recognize celebrities. This module covers approximately one million faces and is based on commonly requested data sources. Faces that aren't recognized by Azure AI Video Indexer are still detected but are left unnamed. Customers can build their own custom [Person modules](/azure/azure-video-indexer/customize-person-model-overview) whereby the Azure AI Video Indexer recognizes faces that aren't recognized by default. 

The resulting insights are generated in a categorized list in a JSON file that includes a thumbnail and either name or ID of each face. Clicking face’s thumbnail displays information like the name of the person (if they were recognized), the % of appearances in the video, and their biography if they're a celebrity. It also enables scrolling between the instances in the video.  

## Prerequisites  

Review [transparency note overview](/legal/azure-video-indexer/transparency-note?context=/azure/azure-video-indexer/context/context)

## General principles 

This article discusses faces detection and the key considerations for making use of this technology responsibly. There are many things you need to consider when deciding how to use and implement an AI-powered feature: 

- Will this feature perform well in my scenario? Before deploying faces detection into your scenario, test how it performs using real-life data and make sure it can deliver the accuracy you need. 
- Are we equipped to identify and respond to errors? AI-powered products and features won't be 100% accurate, so consider how you'll identify and respond to any errors that may occur. 

## Key terms  

|Term|Definition|
|---|---|
|Insight  |The information and knowledge derived from the processing and analysis of video and audio files that generate different types of insights and can include detected objects, people, faces, keyframes and translations or transcriptions. |
|Face recognition  |The analysis of images to identify the faces that appear in the images. This process is implemented via the Azure AI Face API. |
|Template |Enrolled images of people are converted to templates, which are then used for facial recognition. Machine-interpretable features are extracted from one or more images of an individual to create that individual’s template. The enrollment or probe images aren't stored by Face API and the original images can't be reconstructed based on a template. Template quality is a key determinant on the accuracy of your results. |
|Enrollment |The process of enrolling images of individuals for template creation so they can be recognized. When a person is enrolled to a verification system used for authentication, their template is also associated with a primary identifier2 that is used to determine which template to compare with the probe template. High-quality images and images representing natural variations in how a person looks (for instance wearing glasses, not wearing glasses) generate high-quality enrollment templates. |
|Deep search  |The ability to retrieve only relevant video and audio files from a video library by searching for specific terms within the extracted insights.|

## View the insight

To see the instances on the website, do the following: 

1. When uploading the media file, go to Video + Audio Indexing, or go to Audio Only or Video + Audio and select Advanced. 
1. After the file is uploaded and indexed, go to Insights and scroll to People. 

To see face detection insight in the JSON file, do the following:  

1. Select Download -> Insights (JSON).  
1. Copy the `faces` element, under `insights`, and paste it into your JSON viewer. 

    ```json
    "faces": [
        {
        "id": 1785,
        "name": "Emily Tran",
        "confidence": 0.7855,
        "description": null,
        "thumbnailId": "fd2720f7-b029-4e01-af44-3baf4720c531",
        "knownPersonId": "92b25b4c-944f-4063-8ad4-f73492e42e6f",
        "title": null,
        "imageUrl": null,
        "thumbnails": [
            {
            "id": "4d182b8c-2adf-48a2-a352-785e9fcd1fcf",
            "fileName": "FaceInstanceThumbnail_4d182b8c-2adf-48a2-a352-785e9fcd1fcf.jpg",
            "instances": [
                {
                "adjustedStart": "0:00:00",
                "adjustedEnd": "0:00:00.033",
                "start": "0:00:00",
                "end": "0:00:00.033"
                }
            ]
            },
            {
            "id": "feff177b-dabf-4f03-acaf-3e5052c8be57",
            "fileName": "FaceInstanceThumbnail_feff177b-dabf-4f03-acaf-3e5052c8be57.jpg",
            "instances": [
                {
                "adjustedStart": "0:00:05",
                "adjustedEnd": "0:00:05.033",
                "start": "0:00:05",
                "end": "0:00:05.033"
                }
            ]
            },
        ]
        }
    ]
    ```

To download the JSON file via the API, [Azure AI Video Indexer developer portal](https://api-portal.videoindexer.ai/). 

> [!IMPORTANT]
> When reviewing face detections in the UI you may not see all faces, we expose only face groups with a confidence of more than 0.5 and the face must appear for a minimum of 4 seconds or 10% * video_duration. Only when these conditions are met we will show the face in the UI and the Insights.json. You can always retrieve all face instances from the Face Artifact file using the api `https://api.videoindexer.ai/{location}/Accounts/{accountId}/Videos/{videoId}/ArtifactUrl[?Faces][&accessToken]`

## Face detection components 

During the Faces Detection procedure, images in a media file are processed, as follows: 

|Component|Definition|
|---|---|
|Source file  |	The user uploads the source file for indexing. |
|Detection and aggregation	|The face detector identifies the faces in each frame. The faces are then aggregated and grouped.   |
|Recognition	|The celebrities module runs over the aggregated groups to recognize celebrities. If the customer has created their own **persons** module it's also run to recognize people. When people aren't recognized, they're labeled Unknown1, Unknown2 and so on. |
|Confidence value	|Where applicable for well-known faces or faces identified in the customizable list, the estimated confidence level of each label is calculated as a range of 0 to 1. The confidence score represents the certainty in the accuracy of the result. For example, an 82% certainty is represented as an 0.82 score.|

## Example use cases 

* Summarizing where an actor appears in a movie or reusing footage by deep searching for specific faces in organizational archives for insight on a specific celebrity. 
* Improved efficiency when creating feature stories at a news or sports agency, for example deep searching for a celebrity or football player in organizational archives. 
* Using faces appearing in the video to create promos, trailers or highlights. Azure AI Video Indexer can assist by adding keyframes, scene markers, timestamps and labeling so that content editors invest less time reviewing numerous files.   

## Considerations when choosing a use case 

* Carefully consider the accuracy of the results, to promote more accurate detections, check the quality of the video, low quality video might impact the detected insights.   
* Carefully consider when using for law enforcement. People might not be detected if they're small, sitting, crouching, or obstructed by objects or other people. To ensure fair and high-quality decisions, combine face detection-based automation with human oversight. 
* Don't use face detection for decisions that may have serious adverse impacts. Decisions based on incorrect output could have serious adverse impacts. Additionally, it's advisable to include human review of decisions that have the potential for serious impacts on individuals. 

When used responsibly and carefully face detection is a valuable tool for many industries. To respect the privacy and safety of others, and to comply with local and global regulations, we recommend the following:   

* Always respect an individual’s right to privacy, and only ingest videos for lawful and justifiable purposes.   
* Don't purposely disclose inappropriate content about young children or family members of celebrities or other content that may be detrimental or pose a threat to an individual’s personal freedom.   
* Commit to respecting and promoting human rights in the design and deployment of your analyzed media.   
* When using third party materials, be aware of any existing copyrights or permissions required before distributing content derived from them.  
* Always seek legal advice when using content from unknown sources.  
* Always obtain appropriate legal and professional advice to ensure that your uploaded videos are secured and have adequate controls to preserve the integrity of your content and to prevent unauthorized access.     
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

## Azure AI Video Indexer insights

- [Audio effects detection](audio-effects-detection.md)
- [OCR](ocr.md)
- [Keywords extraction](keywords.md)
- [Transcription, translation & language identification](transcription-translation-lid.md)
- [Labels identification](labels-identification.md) 
- [Named entities](named-entities.md)
- [Observed people tracking & matched persons](observed-matched-people.md)
- [Topics inference](topics-inference.md)
