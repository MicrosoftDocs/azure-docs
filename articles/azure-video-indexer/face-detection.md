---
title: Face detection overview
description: Get an overview of face detection in Azure AI Video Indexer.
ms.service: azure-video-indexer
ms.date: 04/17/2023
ms.topic: article
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Face detection

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

Face detection, a feature of Azure AI Video Indexer, automatically detects faces in a media file, and then aggregates instances of similar faces into groups. The celebrities recognition model then runs to recognize celebrities.

The celebrities recognition model covers approximately 1 million faces and is based on commonly requested data sources. Faces that Video Indexer doesn't recognize as celebrities are still detected but are left unnamed. You can build your own custom [person model](/azure/azure-video-indexer/customize-person-model-overview) to train Video Indexer to recognize faces that aren't recognized by default.

Face detection insights are generated as a categorized list in a JSON file that includes a thumbnail and either a name or an ID for each face. Selecting a face’s thumbnail displays information like the name of the person (if they were recognized), the percentage of the video that the person appears, and the person's biography, if they're a celebrity. You can also scroll between instances in the video where the person appears.

> [!IMPORTANT]
> To support Microsoft Responsible AI principles, access to face identification, customization, and celebrity recognition features is limited and based on eligibility and usage criteria. Face identification, customization, and celebrity recognition features are available to Microsoft managed customers and partners. To apply for access, use the [facial recognition intake form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUQjA5SkYzNDM4TkcwQzNEOE1NVEdKUUlRRCQlQCN0PWcu).

## Prerequisites  

Review [Transparency Note for Azure AI Video Indexer](/legal/azure-video-indexer/transparency-note?context=/azure/azure-video-indexer/context/context).

## General principles

This article discusses face detection and key considerations for using this technology responsibly. You need to consider many important factors when you decide how to use and implement an AI-powered feature, including:

- Will this feature perform well in your scenario? Before you deploy face detection in your scenario, test how it performs by using real-life data. Make sure that it can deliver the accuracy you need.
- Are you equipped to identify and respond to errors? AI-powered products and features aren't 100 percent accurate, so consider how you'll identify and respond to any errors that occur.

## Key terms  

| Term | Definition |
|---|---|
| insight  | The information and knowledge that you derive from processing and analyzing video and audio files. The insight can include detected objects, people, faces, keyframes, and translations or transcriptions. |
| face recognition  | Analyzing images to identify the faces that appear in the images. This process is implemented via the Azure AI Face API. |
| template | Enrolled images of people are converted to templates, which are then used for facial recognition. Machine-interpretable features are extracted from one or more images of an individual to create that individual’s template. The enrollment or probe images aren't stored by the Face API, and the original images can't be reconstructed based on a template. Template quality is a key determinant for accuracy in your results. |
| enrollment | The process of enrolling images of individuals for template creation so that they can be recognized. When a person is enrolled to a verification system that's used for authentication, their template is also associated with a primary identifier that's used to determine which template to compare against the probe template. High-quality images and images that represent natural variations in how a person looks (for instance, wearing glasses and not wearing glasses) generate high-quality enrollment templates. |
| deep search  | The ability to retrieve only relevant video and audio files from a video library by searching for specific terms within the extracted insights.|

## View insights

To see face detection instances on the Azure AI Video Indexer website:

1. When you upload the media file, in the **Upload and index** dialog, select **Advanced settings**.
1. On the left menu, select **People models**. Select a model to apply to the media file.
1. After the file is uploaded and indexed, go to **Insights** and scroll to **People**.

To see face detection insights in a JSON file:  

1. On the Azure AI Video Indexer website, open the uploaded video.
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
> When you review face detections in the UI, you might not see all faces that appear in the video. We expose only face groups that have a confidence of more than 0.5, and the face must appear for a minimum of 4 seconds or 10 percent of the value of `video_duration`. Only when these conditions are met do we show the face in the UI and in the *Insights.json* file. You can always retrieve all face instances from the face artifact file by using the API: `https://api.videoindexer.ai/{location}/Accounts/{accountId}/Videos/{videoId}/ArtifactUrl[?Faces][&accessToken]`.

## Face detection components

The following table describes how images in a media file are processed during the face detection procedure:

| Component | Definition |
|---|---|
| source file | The user uploads the source file for indexing. |
| detection and aggregation | The face detector identifies the faces in each frame. The faces are then aggregated and grouped. |
| recognition | The celebrities model processes the aggregated groups to recognize celebrities. If you've created your own people model, it also processes groups to recognize other people. If people aren't recognized, they're labeled Unknown1, Unknown2, and so on. |
| confidence value | Where applicable for well-known faces or for faces that are identified in the customizable list, the estimated confidence level of each label is calculated as a range of 0 to 1. The confidence score represents the certainty in the accuracy of the result. For example, an 82 percent certainty is represented as an 0.82 score. |

## Example use cases

The following list describes examples of common use cases for face detection:

- Summarize where an actor appears in a movie or reuse footage by deep searching specific faces in organizational archives for insight about a specific celebrity.
- Get improved efficiency when you create feature stories at a news agency or sports agency. Examples include deep searching a celebrity or a football player in organizational archives.
- Use faces that appear in a video to create promos, trailers, or highlights. Video Indexer can assist by adding keyframes, scene markers, time stamps, and labeling so that content editors invest less time reviewing numerous files.

## Considerations for choosing a use case

Face detection is a valuable tool for many industries when it's used responsibly and carefully. To respect the privacy and safety of others, and to comply with local and global regulations, we recommend that you follow these use guidelines:

- Carefully consider the accuracy of the results. To promote more accurate detection, check the quality of the video. Low-quality video might affect the insights that are presented.
- Carefully review results if you use face detection for law enforcement. People might not be detected if they're small, sitting, crouching, or obstructed by objects or other people. To ensure fair and high-quality decisions, combine face detection-based automation with human oversight.
- Don't use face detection for decisions that might have serious, adverse impacts. Decisions that are based on incorrect output can have serious, adverse impacts. It's advisable to include human review of decisions that have the potential for serious impacts on individuals.
- Always respect an individual’s right to privacy, and ingest videos only for lawful and justifiable purposes.
- Don't purposely disclose inappropriate content about young children, family members of celebrities, or other content that might be detrimental to or pose a threat to an individual’s personal freedom.
- Commit to respecting and promoting human rights in the design and deployment of your analyzed media.
- If you use third-party materials, be aware of any existing copyrights or required permissions before you distribute content that's derived from them.  
- Always seek legal advice if you use content from an unknown source.  
- Always obtain appropriate legal and professional advice to ensure that your uploaded videos are secured and that they have adequate controls to preserve content integrity and prevent unauthorized access.
- Provide a feedback channel that allows users and individuals to report issues they might experience with the service.
- Be aware of any applicable laws or regulations that exist in your area about processing, analyzing, and sharing media that features people.  
- Keep a human in the loop. Don't use any solution as a replacement for human oversight and decision making.
- Fully examine and review the potential of any AI model that you're using to understand its capabilities and limitations.  

## Related content

Learn more about Responsible AI:

- [Microsoft Responsible AI principles](https://www.microsoft.com/ai/responsible-ai?activetab=pivot1%3aprimaryr6)
- [Microsoft Responsible AI resources](https://www.microsoft.com/ai/responsible-ai-resources)
- [Microsoft Azure Learn training courses on Responsible AI](/training/paths/responsible-ai-business-principles/)
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
