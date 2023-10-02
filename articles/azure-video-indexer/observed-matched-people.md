---
title: Azure AI Video Indexer observed people tracking & matched faces overview
description: An introduction to Azure AI Video Indexer observed people tracking & matched faces component responsibly.
ms.service: azure-video-indexer
ms.date: 04/06/2023
ms.topic: article
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Observed people tracking and matched faces

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

> [!IMPORTANT]
> Face identification, customization and celebrity recognition features access is limited based on eligibility and usage criteria in order to support our Responsible AI principles. Face identification, customization and celebrity recognition features are only available to Microsoft managed customers and partners. Use the [Face Recognition intake form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUQjA5SkYzNDM4TkcwQzNEOE1NVEdKUUlRRCQlQCN0PWcu) to apply for access.

Observed people tracking and matched faces are Azure AI Video Indexer AI features that automatically detect and match people in media files. Observed people tracking and matched faces can be set to display insights on people, their clothing, and the exact timeframe of their appearance.

The resulting insights are displayed in a categorized list in the Insights tab, the tab includes a thumbnail of each person and their ID. Clicking the thumbnail of a person displays the matched person (the corresponding face in the People insight). Insights are also generated in a categorized list in a JSON file that includes the thumbnail ID of the person, the percentage of time appearing in the file, Wiki link (if they're a celebrity) and confidence level.

## Prerequisites

Review [transparency note overview](/legal/azure-video-indexer/transparency-note?context=/azure/azure-video-indexer/context/context)

## General principles

This article discusses observed people tracking and matched faces and the key considerations for making use of this technology responsibly. There are many things you need to consider when deciding how to use and implement an AI-powered feature:

- Will this feature perform well in my scenario? Before deploying observed people tracking and matched faces into your scenario, test how it performs using real-life data and make sure it can deliver the accuracy you need.
- Are we equipped to identify and respond to errors? AI-powered products and features will not be 100% accurate, so consider how you'll identify and respond to any errors that may occur.

## View the insight

When uploading the media file, go to Video + Audio Indexing and select Advanced.

To display observed people tracking and matched faces insight on the website, do the following:

1. After the file has been indexed, go to Insights and then scroll to observed people.

To see  the insights in a JSON file, do the following:

1. Click Download and then Insights (JSON).
1. Copy the `observedPeople` text and paste it into your JSON viewer.

    The following section shows observed people and clothing. For the person with id 4 (`"id": 4`) there's also a matching face.

   ```json
    "observedPeople": [
      {
        "id": 1,
        "thumbnailId": "4addcebf-6c51-42cd-b8e0-aedefc9d8f6b",
        "clothing": [
          {
            "id": 1,
            "type": "sleeve",
            "properties": {
              "length": "long"
            }
          },
          {
            "id": 2,
            "type": "pants",
            "properties": {
              "length": "long"
            }
          }
        ],
        "instances": [
          {
            "adjustedStart": "0:00:00.0667333",
            "adjustedEnd": "0:00:12.012",
            "start": "0:00:00.0667333",
            "end": "0:00:12.012"
          }
        ]
      },
      {
        "id": 2,
        "thumbnailId": "858903a7-254a-438e-92fd-69f8bdb2ac88",
        "clothing": [
          {
              "id": 1,
              "type": "sleeve",
              "properties": {
                  "length": "short"
              }
          }
        ],
        "instances": [
          {
              "adjustedStart": "0:00:23.2565666",
              "adjustedEnd": "0:00:25.4921333",
              "start": "0:00:23.2565666",
              "end": "0:00:25.4921333"
          },
          {
              "adjustedStart": "0:00:25.8925333",
              "adjustedEnd": "0:00:25.9926333",
              "start": "0:00:25.8925333",
              "end": "0:00:25.9926333"
          },
          {
              "adjustedStart": "0:00:26.3930333",
              "adjustedEnd": "0:00:28.5618666",
              "start": "0:00:26.3930333",
              "end": "0:00:28.5618666"
          }
        ]
      },
      {
        "id": 3,
        "thumbnailId": "1406252d-e7f5-43dc-852d-853f652b39b6",
        "clothing": [
          {
            "id": 1,
            "type": "sleeve",
            "properties": {
                "length": "short"
            }
          },
          {
            "id": 2,
            "type": "pants",
            "properties": {
                "length": "long"
            }
          },
          {
            "id": 3,
            "type": "skirtAndDress"
          }
        ],
        "instances": [
          {
            "adjustedStart": "0:00:31.9652666",
            "adjustedEnd": "0:00:34.4010333",
            "start": "0:00:31.9652666",
            "end": "0:00:34.4010333"
          }
        ]
      },
      {
        "id": 4,
        "thumbnailId": "d09ad62e-e0a4-42e5-8ca9-9a640c686596",
        "clothing": [
          {
            "id": 1,
            "type": "sleeve",
            "properties": {
                "length": "short"
            }
          },
          {
            "id": 2,
            "type": "pants",
            "properties": {
                "length": "short"
            }
          }
        ],
        "matchingFace": {
          "id": 1310,
          "confidence": 0.3819
        },
        "instances": [
          {
              "adjustedStart": "0:00:34.8681666",
              "adjustedEnd": "0:00:36.0026333",
              "start": "0:00:34.8681666",
              "end": "0:00:36.0026333"
          },
          {
              "adjustedStart": "0:00:36.6699666",
              "adjustedEnd": "0:00:36.7367",
              "start": "0:00:36.6699666",
              "end": "0:00:36.7367"
          },
          {
              "adjustedStart": "0:00:37.2038333",
              "adjustedEnd": "0:00:39.6729666",
              "start": "0:00:37.2038333",
              "end": "0:00:39.6729666"
          }
        ]
      }
    ]
   ```

To download the JSON file via the API, use the [Azure AI Video Indexer developer portal](https://api-portal.videoindexer.ai/).

## Observed people tracking and matched faces components

During the observed people tracking and matched faces procedure, images in a media file are processed, as follows:

|Component|Definition|
|---|---|
|Source file |    The user uploads the source file for indexing.   |
|Detection |    The media file is tracked to detect observed people and their clothing. For example, shirt with long sleeves, dress or long pants. Note that to be detected, the full upper body of the person must appear in the media.|
|Local grouping    |The identified observed faces are filtered into local groups. If a person is detected more than once, additional observed faces instances are created for this person. |
|Matching and Classification    |The observed people instances are matched to faces. If there is a known celebrity, the observed person will be given their name. Any number of observed people instances can be matched to the same face.  |
|Confidence value|    The estimated confidence level of each observed person is calculated as a range of 0 to 1. The confidence score represents the certainty in the accuracy of the result. For example, an 82% certainty is represented as an 0.82 score.|

## Example use cases

- Tracking a person’s movement, for example,  in law enforcement for more efficiency when analyzing an accident or crime.
- Improving efficiency by deep searching for matched people in organizational archives for insight on specific celebrities, for example when creating promos and trailers.
- Improved efficiency when creating feature stories, for example, searching for people wearing a red shirt in the archives of a football game at a News or Sports agency.

## Considerations and limitations when choosing a use case

Below are some considerations to keep in mind when using observed people and matched faces.

### Limitations of observed people tracking

It's important to note the limitations of observed people tracking, to avoid or mitigate the effects of false negatives (missed detections) and limited detail.

* People are generally not detected if they appear small (minimum person height is 100 pixels).
* Maximum frame size is FHD
* Low quality video (for example, dark lighting conditions) may impact the detection results.
* The recommended frame rate at least 30 FPS.
* Recommended video input should contain up to 10 people in a single frame. The feature could work with more people in a single frame, but the detection result retrieves up to 10 people in a frame with the detection highest confidence.
* People with similar clothes: (for example, people wear uniforms, players in sport games) could be detected as the same person with the same ID number.
* Obstruction – there maybe errors where there are obstructions (scene/self or obstructions by other people).
* Pose: The tracks may be split due to different poses (back/front)

### Other considerations

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
- [Topics inference](topics-inference.md)
