---
title: Interactive language learning with pronunciation assessment
description: Interactive language learning with pronunciation assessment gives you instant feedback on pronunciation, fluency, prosody, grammar, and vocabulary through interactive chats.
author: sally-baolian
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 8/1/2024
ms.author: v-baolianzou
---

# Interactive language learning with pronunciation assessment

[!INCLUDE [Feature preview](~/reusable-content/ce-skilling/azure/includes/ai-studio/includes/feature-preview.md)]

Learning a new language is an exciting journey. Interactive language learning can make your learning experience more engaging and effective. By using pronunciation assessment effectively, you get instant feedback on pronunciation accuracy, fluency, prosody, grammar, and vocabulary through your interactive language learning experience.
 
> [!NOTE]
> The language learning feature currently supports only `en-US`. For available regions, refer to [available regions for pronunciation assessment](regions.md#speech-service). If you turn on the **Avatar** button to interact with a text to speech avatar, refer to the available [regions](regions.md#speech-service) for text to speech avatar. 
>
> If you have any feedback on the language learning feature, fill out [this form](https://aka.ms/speechpa/intake). 

## Common use cases

Here are some common scenarios where you can make use of the language learning feature to improve your language skills:

- **Assess pronunciations:** Practice your pronunciation and receive scores with detailed feedback to identify areas for improvement.
- **Improve speaking skills:** Engage in conversations with a native speaker (or a simulated one) to enhance your speaking skills and build confidence.
- **Learn new vocabulary:** Expand your vocabulary and work on advanced pronunciation by interacting with AI-driven language models.

## Getting started

In this section, you can learn how to immerse yourself in dynamic conversations with a GPT-powered voice assistant to enhance your speaking skills. 

To get started with language learning through chatting, follow these steps:

1. Go to **Language learning** in the [Speech Studio](https://aka.ms/speechstudio). 

1. Decide on a scenario or context in which you'd like to interact with the voice assistant. This can be a casual conversation, a specific topic, or a language learning exercise.  

   :::image type="content" source="media/pronunciation-assessment/language-learning.png" alt-text="Screenshot of choosing chatting scenario to interact with the voice assistant." lightbox="media/pronunciation-assessment/language-learning.png":::

   If you want to interact with an avatar, toggle the **Avatar** button in the upper right corner to **On**.

1. Press the microphone icon to start speaking naturally, as if you were talking to a real person. 
  
   :::image type="content" source="media/pronunciation-assessment/language-learning-selecting-mic-icon.png" alt-text="Screenshot of selecting the microphone icon to interact with the voice assistant." lightbox="media/pronunciation-assessment/language-learning-selecting-mic-icon.png":::

   For accurate vocabulary and grammar scores, speak at least 3 sentences before assessment.
   
1. Press the stop button or **Assess my response** button to finish speaking. This action will trigger the assessment process.

   :::image type="content" source="media/pronunciation-assessment/language-learning-assess-response.png" alt-text="Screenshot of selecting the stop button to assess your response." lightbox="media/pronunciation-assessment/language-learning-assess-response.png":::

1. Wait for a moment, and you can get a detailed assessment report.

   :::image type="content" source="media/pronunciation-assessment/language-learning-assess-report.png" alt-text="Screenshot of a detailed assessment report.":::

   The assessment report may include feedback on:
   - **Accuracy:** Accuracy indicates how closely the phonemes match a native speaker's pronunciation.
   - **Fluency:** Fluency indicates how closely the speech matches a native speaker's use of silent breaks between words.
   - **Prosody:** Prosody indicates the nature of the given speech, including stress, intonation, speaking speed, and rhythm.
   - **Grammar:** Grammar considers lexical accuracy, grammatical accuracy, and diversity of sentence structures, providing a more comprehensive evaluation of language proficiency.
   - **Vocabulary:** Vocabulary evaluates the speaker's effective usage of words and their appropriateness within the given context to express ideas accurately, as well as the level of lexical complexity.

    When recording your speech for pronunciation assessment, ensure your recording time falls within the recommended range of 20 seconds (equivalent to more than 50 words) to 10 minutes per session. This time range is optimal for evaluating the content of your speech accurately. Whether you have a short and focused conversation or a more extended dialogue, as long as the total recorded time falls within this range, you'll receive comprehensive feedback on your pronunciation, fluency, and content.

   To get feedback on how to improve for each aspect of the assessment, select **Get feedback on how to improve**.

    :::image type="content" source="media/pronunciation-assessment/language-learning-feedback-improve.png" alt-text="Screenshot of selecting the button to get feedback on how to improve for each aspect of the assessment.":::

    When you have completed the conversation, you can also download your chat audio. You can clear the current conversation by selecting **Clear chat**.

## Next steps

- Use [pronunciation assessment with the Speech SDK](how-to-pronunciation-assessment.md)
- Try [pronunciation assessment in the studio](pronunciation-assessment-tool.md).
- Read our [pronunciation assessment blog](https://techcommunity.microsoft.com/t5/ai-azure-ai-services-blog/speech-pronunciation-assessment-is-generally-available/ba-p/3740894) to learn more speech scenarios.
