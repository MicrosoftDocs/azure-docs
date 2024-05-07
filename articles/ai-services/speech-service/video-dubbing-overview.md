---
title: Video dubbing overview - Speech service
titleSuffix: Azure AI services
description: With video dubbing, you can seamlessly integrate multi-language voice-over capabilities into your videos.
author: sally-baolian
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 4/29/2024
ms.author: v-baolianzou
---

# What is video dubbing (preview) 

The process of replacing the original language of a video with audio recorded in a different language has long been relied upon to cater to diverse audiences. Traditionally achieved through human recording and manual post-production, dubbing is essential for ensuring that viewers can enjoy video content in their native language. However, this process comes with key pain points, including its high cost, lengthy duration, and inability to replicate the original speaker's voice accurately. In response to these challenges, we provide a cutting-edge Azure AI Service, video dubbing, where you can leverage our API to seamlessly translate and generate videos in multiple languages automatically.  

Video dubbing is currently available in preview mode. With its powerful capabilities, you can efficiently localize your video content to cater to diverse audiences around the globe. This service empowers you to efficiently create immersive, localized videos across various use cases such as vlogs, education, news, enterprise training, advertising, film, TV shows, and more. 

## Use case 

The video dubbing service provided by Azure AI has a wide range of use cases across various industries and content types. Here are some key applications: 

- **Vlog & short video**: Content creators can easily translate and dub their vlogs and short videos to reach international audiences, expanding their viewership and engagement. 

- **Education & learning**: Educational institutions and e-learning platforms can dub their instructional videos and lectures into different languages, making learning more accessible and inclusive. 

- **News & interviews**: News organizations can translate and dub news segments and interviews to provide accurate and timely information to audiences worldwide. 

- **Enterprise training**: Corporations can localize their training videos for employees in different regions, ensuring consistent and effective communication across their workforce. 

- **Advertisement & marketing**: Businesses can localize their advertising and marketing videos to resonate with target audiences in different markets, enhancing brand awareness and customer engagement. 

- **Film & TV show**: Film studios and production companies can dub their movies and TV shows for international distribution, reaching a broader audience and maximizing revenue potential. 

## Supported regions and languages

Currently, the service is supported in the following region: East US.

We support video dubbing between various languages, enabling you to tailor your content to specific linguistic preferences. For the languages supported for video dubbing, refer to the [supported source and target languages](language-support.md?tabs=speech-translation#video-dubbing). 

## Core features

- **Dialogue audio extraction and spoken content transcription** 

  Automatically extracts dialogue audio from the source video and transcribe the spoken content.

- **Translation from language A to B and large language model (LLM) reformulation** 

  Translates the transcribed content from the original language (Language A) to the target language (Language B) using advanced language processing techniques. Enhances translation quality and refines gender-aware translated text through LLM reformulation. 

- **Automatic dubbing – voice generation in other language**

  Utilizes AI-powered text-to-speech technology to automatically generate human-like voices in the target language. These voices are precisely synchronized with the video, ensuring a flawless dubbing experience. This includes utilizing prebuilt neural voices for high-quality output and offering options for personal voice. 

- **Human in the loop for content editing**

  Allows for human intervention to review and edit the translated content, ensuring accuracy and cultural appropriateness before finalizing the dubbed video. 

- **Subtitles generation**

  Delivers the fully dubbed video with translated dialogue, synchronized subtitles, and generated voices, ready for download and distribution across various platforms. You can also set the subtitle length on each screen for optimal display. 

## Get started 

To get started with video dubbing, refer to [video dubbing in the studio](video-dubbing-studio.md). 

## Price 

Pricing details for the video dubbing service will be effective from June 2024. 

## Next steps

* Try the [video dubbing in the studio](video-dubbing-studio.md)
  
