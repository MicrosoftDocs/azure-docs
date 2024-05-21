---
author: eric-urban
ms.service: azure-ai-speech
ms.custom:
  - build-2024
ms.topic: include
ms.date: 5/21/2024
ms.author: eur
---

[!INCLUDE [Feature preview](../../../../../ai-studio/includes/feature-preview.md)]

In this quickstart, you try real-time speech to text in [Azure AI Studio](https://ai.azure.com). 

## Prerequisites

[!INCLUDE [Prerequisites](../../../../includes/quickstarts/ai-studio-prerequisites.md)]

## Try real-time speech to text

1. Go to the **Home** page in [AI Studio](https://ai.azure.com/) and then select **AI Services** from the left pane.

    :::image type="content" source="../../../media/ai-studio/ai-services-home.png" alt-text="Screenshot of the AI Services page in Azure AI Studio." lightbox="../../../media/ai-studio/ai-services-home.png":::

1. Select **Speech** from the list of AI services.
1. Select **Real-time speech to text**.

    :::image type="content" source="../../../media/ai-studio/real-time-speech-to-text-select.png" alt-text="Screenshot of the option to select the real-time speech to text tile." lightbox="../../../media/ai-studio/real-time-speech-to-text-select.png":::

1. In the **Try it out** section, select your hub's AI services connection. For more information about AI services connections, see [connect AI services to your hub in AI Studio](../../../../../ai-studio/ai-services/connect-ai-services.md#connect-to-ai-services). 

    :::image type="content" source="../../../media/ai-studio/real-time-speech-to-text-connect.png" alt-text="Screenshot of the option to select an AI services connection and other settings." lightbox="../../../media/ai-studio/real-time-speech-to-text-connect.png":::

1. Select **Show advanced options** to configure speech to text options such as: 

    - **Language identification**: Used to identify languages spoken in audio when compared against a list of supported languages. For more information about language identification options such as at-start and continuous recognition, see [Language identification](../../../language-identification.md).
    - **Speaker diarization**: Used to identify and separate speakers in audio. Diarization distinguishes between the different speakers who participate in the conversation. The Speech service provides information about which speaker was speaking a particular part of transcribed speech. For more information about speaker diarization, see the [real-time speech to text with speaker diarization](../../../get-started-stt-diarization.md) quickstart.
    - **Custom endpoint**: Use a deployed model from custom speech to improve recognition accuracy. To use Microsoft's baseline model, leave this set to None. For more information about custom speech, see [Custom Speech](../../../custom-speech-overview.md).
    - **Output format**: Choose between simple and detailed output formats. Simple output includes display format and timestamps. Detailed output includes more formats (such as display, lexical, ITN, and masked ITN), timestamps, and N-best lists. 
    - **Phrase list**: Improve transcription accuracy by providing a list of known phrases, such as names of people or specific locations. Use commas or semicolons to separate each value in the phrase list. For more information about phrase lists, see [Phrase lists](../../../improve-accuracy-phrase-list.md).

1. Select an audio file to upload, or record audio in real-time. In this example, we use the `Call1_separated_16k_health_insurance.wav` file that's available in the [Speech SDK repository on GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/raw/master/scenarios/call-center/sampledata/Call1_separated_16k_health_insurance.wav). You can download the file or use your own audio file.

    :::image type="content" source="../../../media/ai-studio/real-time-speech-to-text-audio.png" alt-text="Screenshot of the option to select an audio file or speak into a microphone." lightbox="../../../media/ai-studio/real-time-speech-to-text-audio.png":::

1. You can view the real-time speech to text results in the **Results** section.

    :::image type="content" source="../../../media/ai-studio/real-time-speech-to-text-results.png" alt-text="Screenshot of the real-time transcription results in Azure AI Studio." lightbox="../../../media/ai-studio/real-time-speech-to-text-results.png":::
