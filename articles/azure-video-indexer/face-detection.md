---
title: Face detection overview
titleSuffix: Azure AI Video Indexer 
description: Get an overview of face detection in Azure AI Video Indexer.
author: juliako
ms.author: juliako
manager: femila
ms.service: azure-video-indexer
ms.date: 04/17/2023
ms.topic: article
---

# Face detection  

Face detection is a feature of Azure AI Video Indexer that automatically detects faces in a media file and aggregates instances of similar faces into the same group. The celebrities recognition module is then run to recognize celebrities. This module covers approximately one million faces and is based on commonly requested data sources. Faces that aren't recognized by Azure AI Video Indexer are still detected but are left unnamed. Customers can build their own custom [Person modules](/azure/azure-video-indexer/customize-person-model-overview) whereby the Azure AI Video Indexer recognizes faces that aren't recognized by default.

The resulting insights are generated in a categorized list in a JSON file that includes a thumbnail and either name or ID of each face. Clicking face’s thumbnail displays information like the name of the person (if they were recognized), the % of appearances in the video, and their biography if they're a celebrity. It also enables scrolling between the instances in the video.  

> [!IMPORTANT]
> Face identification, customization, and celebrity recognition features access is limited based on eligibility and usage criteria to support our Responsible AI principles. Face identification, customization, and celebrity recognition features are available to Microsoft-managed customers and partners. To apply for access, use the [Face Recognition intake form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUQjA5SkYzNDM4TkcwQzNEOE1NVEdKUUlRRCQlQCN0PWcu).

## Prerequisites  

Review [transparency note overview](/legal/azure-video-indexer/transparency-note?context=/azure/azure-video-indexer/context/context).

## General principles

This article discusses faces detection and the key considerations for using this technology responsibly. There are many things you need to consider when you decide how to use and implement an AI-powered feature:

- Will this feature perform well in my scenario? Before deploying face detection in your scenario, test how it performs by using real-life data. Make make sure that it can deliver the accuracy you need.
- Are you equipped to identify and respond to errors? AI-powered products and features won't be 100% accurate, so consider how you'll identify and respond to any errors that might occur.

## Key terms  

|Term|Definition|
|---|---|
| Insight  | The information and knowledge that you derive from processing and analyzing video and audio files that generate different types of insights. The insight can include detected objects, people, faces, keyframes, and translations or transcriptions. |
| Face recognition  | The analysis of images to identify the faces that appear in the images. This process is implemented via the Azure AI Face API. |
| Template | Enrolled images of people are converted to templates, which are then used for facial recognition. Machine-interpretable features are extracted from one or more images of an individual to create that individual’s template. The enrollment or probe images aren't stored by the Face API, and the original images can't be reconstructed based on a template. Template quality is a key determinant on the accuracy of your results. |
| Enrollment | The process of enrolling images of individuals for template creation so they can be recognized. When a person is enrolled to a verification system that's used for authentication, their template is also associated with a primary identifier2 that's used to determine which template to compare with the probe template. High-quality images and images that represent natural variations in how a person looks (for instance,wearing glasses and not wearing glasses) generate high-quality enrollment templates. |
| Deep search  | The ability to retrieve only relevant video and audio files from a video library by searching for specific terms within the extracted insights.|

## View insights

To see the instances on the website:

1. When you upload the media file, go to **Video + Audio Indexing**, or go to **Audio Only or Video + Audio**, and then select **Advanced**.
1. After the file is uploaded and indexed, go to **Insights** and scroll to **People**.

To see face detection insight in the JSON file:  

1. Select **Download** > **Insights (JSON)**.  
1. Under `insights`, copy the `faces` element  and paste it into your JSON viewer.

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

To download the JSON file via the API, go to the [Azure AI Video Indexer developer portal](https://api-portal.videoindexer.ai/).

> [!IMPORTANT]
> When you review face detections in the UI, you might not see all faces. We expose only face groups that have a confidence of more than 0.5, and the face must appear for a minimum of 4 seconds or 10 percent of the value of `video_duration`. Only when these conditions are met do we show the face in the UI and the *Insights.json* file. You can always retrieve all face instances from the Face Artifact file by using the API `https://api.videoindexer.ai/{location}/Accounts/{accountId}/Videos/{videoId}/ArtifactUrl[?Faces][&accessToken]`.

## Face detection components

The following table describes how images in a media file are processed during the face detection procedure:

| Component | Definition |
|---|---|
| Source file | The user uploads the source file for indexing. |
| Detection and aggregation | The face detector identifies the faces in each frame. The faces are then aggregated and grouped. |
| Recognition | The celebrities module runs over the aggregated groups to recognize celebrities. If the customer has created their own **persons** module, it also is run to recognize people. When people aren't recognized, they're labeled Unknown1, Unknown2, and so on. |
| Confidence value | Where applicable for well-known faces or faces that are identified in the customizable list, the estimated confidence level of each label is calculated as a range of 0 to 1. The confidence score represents the certainty in the accuracy of the result. For example, an 82 percent certainty is represented as an 0.82 score.|

## Example use cases

- Summarize where an actor appears in a movie or reuse footage by deep searching specific faces in organizational archives for insight about a specific celebrity.
- Get improved efficiency when you create feature stories at a news agency or sports agency. Examples include deep searching a celebrity or a football player in organizational archives.
- Use faces that appear in a video to create promos, trailers, or highlights. Azure AI Video Indexer can assist by adding keyframes, scene markers, time stamps, and labeling so that content editors invest less time reviewing numerous files.

## Considerations for choosing a use case

- Carefully consider the accuracy of the results. To promote more accurate detections, check the quality of the video. Low-quality video might affect the insights that are detected.
- Carefully review results if you use face detection for law enforcement. People might not be detected if they're small, sitting, crouching, or obstructed by objects or other people. To ensure fair and high-quality decisions, combine face detection-based automation with human oversight.
- Don't use face detection for decisions that might have serious, adverse impacts. Decisions that are based on incorrect output can have serious, adverse impacts. Also, it's advisable to include human review of decisions that have the potential for serious impacts on individuals.

Face detection is a valuable tool for many industries when it's used responsibly and carefully. To respect the privacy and safety of others, and to comply with local and global regulations, we recommend that you follow these use guidelines:

- Always respect an individual’s right to privacy, and ingest videos only for lawful and justifiable purposes.
- Don't purposely disclose inappropriate content about young children, family members of celebrities, or other content that might be detrimental to or pose a threat to an individual’s personal freedom.
- Commit to respecting and promoting human rights in the design and deployment of your analyzed media.
- If you use third-party materials, be aware of any existing copyrights or required permissions before you distribute content that's derived from them.  
- Always seek legal advice if you use content from unknown sources.  
- Always obtain appropriate legal and professional advice to ensure that your uploaded videos are secured, and that they have adequate controls to preserve the integrity of your content and prevent unauthorized access.
- Provide a feedback channel that allows users and individuals to report issues they might experience with the service.
- Be aware of any applicable laws or regulations that exist in your area regarding processing, analyzing, and sharing media that features people.  
- Keep a human in the loop. Don't use any solution as a replacement for human oversight and decision making.
- Fully examine and review the potential of any AI model that you're using to understand its capabilities and limitations.  

## Related content

Learn more about Responsible AI:

- [Microsoft Responsible AI principles](https://www.microsoft.com/ai/responsible-ai?activetab=pivot1%3aprimaryr6)
- [Microsoft Responsible AI resources](https://www.microsoft.com/ai/responsible-ai-resources)
- [Microsoft Azure Learning courses on Responsible AI](/training/paths/responsible-ai-business-principles/)
- [Microsoft Global Human Rights Statement](https://www.microsoft.com/corporate-responsibility/human-rights-statement?activetab=pivot_1:primaryr5)  

Azure AI Video Indexer insights:

- [Audio effects detection](audio-effects-detection.md)
- [OCR](ocr.md)
- [Keywords extraction](keywords.md)
- [Transcription, translation, and language identification](transcription-translation-lid.md)
- [Labels identification](labels-identification.md)
- [Named entities](named-entities.md)
- [Observed people tracking and matched persons](observed-matched-people.md)
- [Topics inference](topics-inference.md)
