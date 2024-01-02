---
title: GPT-4 Turbo with Vision concepts
titleSuffix: Azure OpenAI
description: Learn about vision chats enabled by GPT-4 Turbo with Vision.
author: PatrickFarley
ms.author: pafarley
ms.service: azure-ai-openai
ms.topic: conceptual 
ms.date: 01/02/2024
manager: nitinme
keywords: 
---

# GPT-4 Turbo with Vision concepts

GPT-4 Turbo with Vision is a large multimodal model (LMM) developed by OpenAI that can analyze images and provide textual responses to questions about them. It incorporates both natural language processing and visual understanding. This guide provides details on the capabilities and limitations of GPT-4 Turbo with Vision.

To try out GPT-4 Turbo with Vision, see the [quickstart](/azure/ai-services/openai/gpt-v-quickstart).

## Chats with vision

The GPT-4 Turbo with Vision model answers general questions about what's present in the images or videos you upload.


## Enhancements

Enhancements let you incorporate other Azure AI services to add new functionality to the chat-with-vision experience.

**Object grounding**: Azure AI Vision complements GPT-4 Turbo with Vision’s text response by identifying and locating salient objects in the input images. This lets the chat model give more accurate and detailed responses about the contents of the image.

:::image type="content" source="../media/concepts/gpt-v/object-grounding.png" alt-text="Screenshot of an image with object grounding applied. Object have bounding boxes with labels.":::

:::image type="content" source="../media/concepts/gpt-v/object-grounding-response.png" alt-text="Screenshot of a chat response to an image prompt about an outfit. The response is an itemized list of clothing items seen in the image.":::

**Optical Character Recognition (OCR)**: Azure AI Vision complements GPT-4 Turbo with Vision by providing high-quality OCR results as supplementary information to the chat model. It allows the model to produce higher quality responses for images with dense text, transformed images, and numbers-heavy financial documents, and increases the variety of languages the model can recognize in text.

:::image type="content" source="../media/concepts/gpt-v/receipts.png" alt-text="Photo of several receipts.":::

:::image type="content" source="../media/concepts/gpt-v/ocr-response.png" alt-text="Screenshot of the JSON response of an OCR call.":::

**Video prompt**: The **video prompt** enhancement lets you use video clips as input for AI chat, enabling the model to generate summaries and answers about video content. It uses Azure AI Vision Video Retrieval to sample a set of frames from a video and create a transcript of the speech in the video.

In order to use the video prompt enhancement, you need both an Azure AI Vison resource and an Azure Video Indexer resource, in addition to your Azure OpenAI resource.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RW1eHRf]


## Special pricing information

GPT-4 Turbo with Vision accrues charges like other Azure OpenAI chat models. You pay a per-token rate for the prompts and completions, detailed on the [Pricing page](/pricing/details/cognitive-services/openai-service/). The base charges and additional features are outlined here:

Base Pricing for GPT-4 Turbo with Vision is:
- Input: $0.01 per 1000 tokens
- Output: $0.03 per 1000 tokens

See the [Tokens section of the overview](/azure/ai-services/openai/overview#tokens) for information on how text and images translate to tokens.

Additionally, if you use video prompt integration with the Video Retrieval add-on, it accrues other costs:
- Ingestion: $0.05 per minute of video
- Transactions: $0.25 per 1000 queries of the Video Retrieval index

Processing videos involves the use of extra tokens to identify key frames for analysis. The number of these additional tokens will be roughly equivalent to the sum of the tokens in the text input, plus 700 tokens.

### Example price calculation

For a typical use case, take a 3-minute video with a 100-token prompt input. The video has a transcript that's 100 tokens long, and when the service processes the prompt, it generates 100 tokens of output. The pricing for this transaction would be:

| Item        | Detail        | Total Cost   |
|-----------------|-----------------|--------------|
| GPT-4 Turbo with Vision Input Tokens      | 100 text tokens    | $0.001     |
| Additional Cost to identify frames        | 100 input tokens + 700 tokens + 1 Video Retrieval transaction         | $0.00825     |
| Image Inputs and Transcript Input         | 20 images (85 tokens each) + 100 transcript tokens            | $0.018       |
| Output Tokens      | 100 tokens (assumed)    | $0.003       |
| **Total Cost**      |      | **$0.03025** |

Additionally, there's a one-time indexing cost of $0.15 to generate the Video Retrieval index for this 3-minute video. This index can be reused across any number of Video Retrieval and GPT-4 Turbo with Vision calls.

## Limitations

This section describes the limitations of GPT-4 Turbo with Vision.

### Image support

- **Limitation on image enhancements per chat session**: Enhancements cannot be applied to multiple images within a single chat call.
- **Maximum input image size**: The maximum size for input images is restricted to 20 MB.
- **Object grounding in enhancement API**: When the enhancement API is used for object grounding, and the model detects duplicates of an object, it will generate one bounding box and label for all the duplicates instead of separate ones for each.
- **Low resolution accuracy**: When images are analyzed using the "low resolution" setting, it allows for faster responses and uses fewer input tokens for certain use cases. However, this could impact the accuracy of object and text recognition within the image.
- **Image chat restriction**: When uploading images in the chat playground or the API, there is a limit of 10 images per chat call.

### Video support

- **Low resolution**: Video frames are analyzed using GPT-4 Turbo with Vision's "low resolution" setting, which may affect the accuracy of small object and text recognition in the video.
- **Video file limits**: Both MP4 and MOV file types are supported. In the Azure AI Playground, videos must be less than 3 minutes long. When you use the API there is no such limitation.
- **Prompt limits**: Video prompts only contain one video and no images. In Playground, you can clear the session to try another video or images.
- **Limited frame selection**: The service selects 20 frames from the entire video, which might not capture all the critical moments or details. Frame selection can be approximately evenly spread through the video or focused by a specific video retrieval query, depending on the prompt.
- **Language support**: The service primarily supports English for grounding with transcripts. Transcripts don't provide accurate information on lyrics in songs.

## Next steps

- Get started using GPT-4 Turbo with Vision by following the [quickstart](/azure/ai-services/openai/gpt-v-quickstart).
- For a more in-depth look at the APIs, and to use video prompts in chat, follow the [how-to guide](../how-to/gpt-with-vision.md).
- See the [completions and embeddings API reference](../reference.md)