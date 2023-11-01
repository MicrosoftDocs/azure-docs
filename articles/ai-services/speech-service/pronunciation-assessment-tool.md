---
title: How to use pronunciation assessment in Speech Studio
titleSuffix: Azure AI services
description: The pronunciation assessment tool in Speech Studio gives you feedback on the accuracy and fluency of your speech, no coding required.
services: cognitive-services
author: sally-baolian
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 10/25/2023
ms.author: v-baolianzou
---

# Pronunciation assessment in Speech Studio

Pronunciation assessment uses the Speech to text capability to provide subjective and objective feedback for language learners. Practicing pronunciation and getting timely feedback are essential for improving language skills. Assessments driven by experienced teachers can take a lot of time and effort and makes a high-quality assessment expensive for learners. Pronunciation assessment can help make the language assessment more engaging and accessible to learners of all backgrounds. 

> [!NOTE]
> For information about availability of pronunciation assessment, see [supported languages](language-support.md?tabs=pronunciation-assessment) and [available regions](regions.md#speech-service).

This article describes how to use the pronunciation assessment tool without writing any code through the [Speech Studio](https://speech.microsoft.com). For information about how to integrate pronunciation assessment in your speech applications, see [How to use pronunciation assessment](how-to-pronunciation-assessment.md).

In addition to the baseline scores of accuracy, fluency, and completeness, the pronunciation asessment feature in Speech Studio includes more comprehensive scores to provide detailed feedback on various aspects of speech performance and understanding. The enhanced scores are as follows: Prosody score, Vocabulary score, Grammar score, and Topic score. These scores offer valuable insights into speech prosody, vocabulary usage, grammar correctness, and topic understanding. 

 :::image type="content" source="media/pronunciation-assessment/speaking-score.png" alt-text="Screenshot of overall pronunciation score and overall content score on Speech Studio.":::

At the bottom of the Assessment result, two overall scores are displayed: Pronunciation score and Content score. In the Reading tab, you will find the Pronunciation Score displayed. In the Speaking tab, both the Pronunciation Score and the Content Score are displayed.

**Pronunciation Score**: This score represents an aggregated assessment of the pronunciation quality and includes four sub-aspects. These scores are available in both the reading and speaking tabs for both scripted and unscripted assessments.
- **Accuracy score**: Evaluates the correctness of pronunciation.
- **Fluency score**: Measures the level of smoothness and naturalness in speech.
- **Completeness score**: Reflects the number of words pronounced correctly.
- **Prosody score**: Assesses the use of appropriate intonation, rhythm, and stress. Several additional error types related to prosody assessment are introduced, such as Unexpected break, Missing break, and Monotone. These error types provide more detailed information about pronunciation errors compared to the previous engine.

**Content Score**: This score provides an aggregated assessment of the content of the speech and includes three sub-aspects. This score is only available in the speaking tab for an unscriped assessment.
- **Vocabulary score**: Evaluates the speaker's effective usage of words and their appropriateness within the given context to express ideas accurately, as well as the level of lexical complexity.
- **Grammar score**: Evaluates the correctness of grammar usage and variety of sentence patterns. It considers lexical accuracy, grammatical accuracy, and diversity of sentence structures, providing a more comprehensive evaluation of language proficiency.
- **Topic score**: Assesses the level of understanding and engagement with the topic discussed in the speech. It evaluates the speaker's ability to effectively express thoughts and ideas related to the given topic.

These overall scores offer a comprehensive assessment of both pronunciation and content, providing learners with valuable feedback on various aspects of their speech performance and understanding. By using these enhanced features, language learners can gain deeper insights into their advantages and areas for improvement in both pronunciation and content expression.

> [!NOTE]
> Content and prosody assessments are only available in the [en-US](./language-support.md?tabs=pronunciation-assessment) locale.

## Pricing

As a baseline, usage of pronunciation assessment costs the same as speech to text for pay-as-you-go or commitment tier [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services). If you [purchase a commitment tier](../commitment-tier.md) for speech to text, the spend for pronunciation assessment goes towards meeting the commitment. 

The pronunciation assessment feature also offers additional scores that are not included in the baseline speech to text price: prosody, grammar, topic, and vocabulary. These scores are available as an add-on charge above the baseline speech to text price. For information about pricing, see [speech to text pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services).

Here's a table of available pronunciation assessment scores, whether it's available in the [scripted](#conduct-a-scripted-assessment) or [unscripted](#conduct-an-unscripted-assessment) assessments, and whether it's included in the baseline speech to text price or the add-on price.

| Score | Scripted or unscripted | Included in baseline speech to text price? |
| --- | --- | --- |
| Accuracy | Scripted and unscripted | Yes |
| Fluency | Scripted and unscripted | Yes |
| Completeness | Scripted | Yes |
| Miscue | Scripted and unscripted | Yes |
| Prosody | Scripted and unscripted | No |
| Grammar | Unscripted only | No |
| Topic | Unscripted only | No |
| Vocabulary | Unscripted only | No |


## Try out pronunciation assessment

You can explore and try out pronunciation assessment even without signing in. 

> [!TIP]
> To assess more than 5 seconds of speech with your own script, sign in with an [Azure account](https://azure.microsoft.com/free/cognitive-services) and use your <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices"  title="Create a Speech resource"  target="_blank">Speech resource</a>.


## Granularity of pronunciation assessment

Pronunciation assessment provides various assessment results in different granularities, from individual phonemes to the entire text input. 
- At the full-text level, pronunciation assessment offers additional Fluency, Completeness, and Prosody scores: Fluency indicates how closely the speech matches a native speaker's use of silent breaks between words; Completeness indicates how many words are pronounced in the speech to the reference text input; Prosody indicates how well a speaker conveys elements of naturalness, expressiveness, and overall prosody in their speech. An overall score aggregated from Accuracy, Fluency, Completeness and Prosody is then given to indicate the overall pronunciation quality of the given speech. Pronunciation assessment also offers content score (Vocabulary, Grammar, and Topic) at the full-text level.
- At the word-level, pronunciation assessment can automatically detect miscues and provide accuracy score simultaneously, which provides more detailed information on omission, repetition, insertions, and mispronunciation in the given speech.
- Syllable-level accuracy scores are currently available via the [JSON file](?tabs=json#pronunciation-assessment-results) or [Speech SDK](how-to-pronunciation-assessment.md).
- At the phoneme level, pronunciation assessment provides accuracy scores of each phoneme, helping learners to better understand the pronunciation details of their speech.

## Reading and speaking scenarios

For pronunciation assessment, there are two scenarios: Reading and Speaking. 
- Reading: This scenario is designed for [scripted assessment](#conduct-a-scripted-assessment). It requires the learner to read a given text. The reference text is provided in advance.
- Speaking: This scenario is designed for [unscripted assessment](#conduct-an-unscripted-assessment). It requires the learner to speak on a given topic. The reference text is not provided in advance.

### Conduct a scripted assessment

Follow these steps to assess your pronunciation of the reference text:

1. Go to **Pronunciation Assessment** in the [Speech Studio](https://aka.ms/speechstudio/pronunciationassessment).

   :::image type="content" source="media/pronunciation-assessment/pa.png" alt-text="Screenshot of how to go to Pronunciation Assessment on Speech Studio.":::

1. On the Reading tab, choose a supported [language](language-support.md?tabs=pronunciation-assessment) that you want to evaluate the pronunciation.

   :::image type="content" source="media/pronunciation-assessment/select-reading-language.png" alt-text="Screenshot of choosing a supported language on reading tab that you want to evaluate the pronunciation.":::

1. You can use provisioned text samples or enter your own script.

   When reading the text, you should be close to microphone to make sure the recorded voice isn't too low. 

   :::image type="content" source="media/pronunciation-assessment/scripted-assessment.png" alt-text="Screenshot of where to record audio with a microphone on reading tab.":::

   Otherwise you can upload recorded audio for pronunciation assessment. Once successfully uploaded, the audio will be automatically evaluated by the system, as shown in the following screenshot.

   :::image type="content" source="media/pronunciation-assessment/upload-audio.png" alt-text="Screenshot of uploading recorded audio to be assessed.":::

### Conduct an unscripted assessment

If you want to conduct an unscripted assessment, select the Speaking tab. This allows you to conduct unscripted assessment without providing reference text in advance. Here's how to proceed:

1. Go to **Pronunciation Assessment** in the [Speech Studio](https://aka.ms/speechstudio/pronunciationassessment).

1. On the Speaking tab, choose a supported [language](language-support.md?tabs=pronunciation-assessment) that you want to evaluate the pronunciation.
   
   :::image type="content" source="media/pronunciation-assessment/select-speaking-language.png" alt-text="Screenshot of choosing a supported language on speaking tab that you want to evaluate the pronunciation.":::
   
1. Next, you have the option to select from sample topics provided or enter your own topic. This choice allows you to assess your ability to speak on a given subject without a predefined script.

   :::image type="content" source="media/pronunciation-assessment/input-topic.png" alt-text="Screenshot of inputting a topic on speaking tab to assess your bility to speak on a given subject without a predefined script.":::

   When recording your speech for pronunciation assessment, it's important to ensure that your recording time falls within the recommended range of 15 seconds (equivalent to more than 50 words) to 10 minutes. This time range is optimal for evaluating the content of your speech accurately. To receive a topic score, your spoken audio should contain at least 3 sentences. 

   You can also upload recorded audio for pronunciation assessment. Once successfully uploaded, the audio will be automatically evaluated by the system.

## Pronunciation assessment results

Once you've recorded your speech or uploaded the recorded audio, the **Assessment result** will be output. The result includes your spoken audio and the feedback on your speech assessment. You can listen to your spoken audio and download it if necessary.

You can also check the pronunciation assessment result in JSON. The word-level, syllable-level, and phoneme-level accuracy scores are included in the JSON file. 

### [Display](#tab/display)

:::image type="content" source="media/pronunciation-assessment/assessment-result.png" alt-text="Screenshot of showing assessment result on Display window which inlcudes transcipt and feedback on your speech.":::

The complete transcription is shown in the **Display** window. The word will be highlighted according to the error type. The error types in the pronunciation assessment are represented using different colors. This visual distinction makes it easier to identify and analyze specific errors. It provides a clear overview of the error types and frequencies in the spoken audio, helping you focus on areas that need improvement. You can toggle on/off each error type to focus on specific types of errors or exclude certain types from the display. This feature provides flexibility in how you review and analyze the errors in your spoken audio. While hovering over each word, you can see accuracy scores for the whole word or specific phonemes. 

At the bottom of the Assessment result, scoring results will be displayed. For scripted pronunciation assessment, only pronunciation score (including accuracy score, fluency score, completeness score, and prosody score) will be provided. For unscripted pronunciation assessment, both pronunciation score (including accuracy score, fluency score, and prosody score) and content score (including vocabulary score, grammar score, and topic score) will be displayed.

### [JSON](#tab/json)

The complete transcription is shown in the `text` attribute. You can see accuracy scores for the whole word, syllables, and specific phonemes. You can get the same results using the Speech SDK. For information, see [How to use pronunciation assessment](how-to-pronunciation-assessment.md).

```json
{
    "text": "Today was a beautiful day. We had a great time taking a long long walk in the morning. The countryside was in full bloom, yet the air was crisp and cold towards end of the day clouds came in forecasting much needed rain.",
    "duration": 156100000,
    "offset": 800000,
    "json": {
        "Id": "f583d7588c89425d8fce76686c11ed12",
        "RecognitionStatus": 0,
        "Offset": 800000,
        "Duration": 156100000,
        "DisplayText": "Today was a beautiful day. We had a great time taking a long long walk in the morning. The countryside was in full bloom, yet the air was crisp and cold towards end of the day clouds came in forecasting much needed rain.",
        "SNR": 40.47014,
        "NBest": [
            {
                "Confidence": 0.97532314,
                "Lexical": "today was a beautiful day we had a great time taking a long long walk in the morning the countryside was in full bloom yet the air was crisp and cold towards end of the day clouds came in forecasting much needed rain",
                "ITN": "today was a beautiful day we had a great time taking a long long walk in the morning the countryside was in full bloom yet the air was crisp and cold towards end of the day clouds came in forecasting much needed rain",
                "MaskedITN": "today was a beautiful day we had a great time taking a long long walk in the morning the countryside was in full bloom yet the air was crisp and cold towards end of the day clouds came in forecasting much needed rain",
                "Display": "Today was a beautiful day. We had a great time taking a long long walk in the morning. The countryside was in full bloom, yet the air was crisp and cold towards end of the day clouds came in forecasting much needed rain.",
                "PronunciationAssessment": {
                    "AccuracyScore": 92,
                    "FluencyScore": 81,
                    "CompletenessScore": 93,
                    "PronScore": 85.6
                },
                "Words": [
                    // Words preceding "countryside" are omitted for brevity...
                    {
                        "Word": "countryside",
                        "Offset": 66200000,
                        "Duration": 7900000,
                        "PronunciationAssessment": {
                            "AccuracyScore": 30,
                            "ErrorType": "Mispronunciation"
                        },
                        "Syllables": [
                            {
                                "Syllable": "kahn",
                                "PronunciationAssessment": {
                                    "AccuracyScore": 3
                                },
                                "Offset": 66200000,
                                "Duration": 2700000
                            },
                            {
                                "Syllable": "triy",
                                "PronunciationAssessment": {
                                    "AccuracyScore": 19
                                },
                                "Offset": 69000000,
                                "Duration": 1100000
                            },
                            {
                                "Syllable": "sayd",
                                "PronunciationAssessment": {
                                    "AccuracyScore": 51
                                },
                                "Offset": 70200000,
                                "Duration": 3900000
                            }
                        ],
                        "Phonemes": [
                            {
                                "Phoneme": "k",
                                "PronunciationAssessment": {
                                    "AccuracyScore": 0
                                },
                                "Offset": 66200000,
                                "Duration": 900000
                            },
                            {
                                "Phoneme": "ah",
                                "PronunciationAssessment": {
                                    "AccuracyScore": 0
                                },
                                "Offset": 67200000,
                                "Duration": 1000000
                            },
                            {
                                "Phoneme": "n",
                                "PronunciationAssessment": {
                                    "AccuracyScore": 11
                                },
                                "Offset": 68300000,
                                "Duration": 600000
                            },
                            {
                                "Phoneme": "t",
                                "PronunciationAssessment": {
                                    "AccuracyScore": 16
                                },
                                "Offset": 69000000,
                                "Duration": 300000
                            },
                            {
                                "Phoneme": "r",
                                "PronunciationAssessment": {
                                    "AccuracyScore": 27
                                },
                                "Offset": 69400000,
                                "Duration": 300000
                            },
                            {
                                "Phoneme": "iy",
                                "PronunciationAssessment": {
                                    "AccuracyScore": 15
                                },
                                "Offset": 69800000,
                                "Duration": 300000
                            },
                            {
                                "Phoneme": "s",
                                "PronunciationAssessment": {
                                    "AccuracyScore": 26
                                },
                                "Offset": 70200000,
                                "Duration": 1700000
                            },
                            {
                                "Phoneme": "ay",
                                "PronunciationAssessment": {
                                    "AccuracyScore": 56
                                },
                                "Offset": 72000000,
                                "Duration": 1300000
                            },
                            {
                                "Phoneme": "d",
                                "PronunciationAssessment": {
                                    "AccuracyScore": 100
                                },
                                "Offset": 73400000,
                                "Duration": 700000
                            }
                        ]
                    },
                    // Words following "countryside" are omitted for brevity...
                ]
            }
        ]
    }
}
```

---

## Assessment scores in streaming mode

Pronunciation Assessment supports uninterrupted streaming mode. The Speech Studio demo allows for up to 60 minutes of recording in streaming mode for evaluation. As long as you don't press the stop recording button, the evaluation process doesn't finish and you can pause and resume evaluation conveniently.

Pronunciation Assessment evaluates several aspects of pronunciation. At the bottom of **Assessment result**, you can see **Pronunciation score** as aggregated overall score which includes 4 sub aspects: **Accuracy score**, **Fluency score**, **Completeness score**, and **Prosody score**. In streaming mode, since the **Accuracy score**, **Fluency score**, and **Prosody score** will vary over time throughout the recording process, we demonstrate an approach on Speech Studio to display approximate overall score incrementally before the end of the evaluation, which weighted only with Accuracy score, Fluency score, and Prosody score. The **Completeness score** is only calculated at the end of the evaluation after you press the stop button, so the final pronunciation overall score is aggregated from **Accuracy score**, **Fluency score**, **Completeness score**, and **Prosody score** with weight.

Refer to the demo examples below for the whole process of evaluating pronunciation in streaming mode.

**Start recording**

As you start recording, the scores at the bottom begin to alter from 0.

:::image type="content" source="media/pronunciation-assessment/initial-recording.png" alt-text="Screenshot of overall assessment scores when starting to record." lightbox="media/pronunciation-assessment/initial-recording.png":::

**During recording**

During recording a long paragraph, you can pause recording at any time. You can continue to evaluate your recording as long as you don't press the stop button. 

:::image type="content" source="media/pronunciation-assessment/pa-recording-display-score.png" alt-text="Screenshot of overall assessment scores when recording." lightbox="media/pronunciation-assessment/pa-recording-display-score.png":::

**Finish recording**

After you press the stop button, you can see **Pronunciation score**, **Accuracy score**, **Fluency score**, **Completeness score**, and **Prosody score** at the bottom.

:::image type="content" source="media/pronunciation-assessment/pa-after-recording-display-score.png" alt-text="Screenshot of overall assessment scores after recording." lightbox="media/pronunciation-assessment/pa-after-recording-display-score.png":::

## Responsible AI 

An AI system includes not only the technology, but also the people who will use it, the people who will be affected by it, and the environment in which it is deployed. Read the transparency notes to learn about responsible AI use and deployment in your systems. 

* [Transparency note and use cases](/legal/cognitive-services/speech-service/pronunciation-assessment/transparency-note-pronunciation-assessment?context=/azure/ai-services/speech-service/context/context)
* [Characteristics and limitations](/legal/cognitive-services/speech-service/pronunciation-assessment/characteristics-and-limitations-pronunciation-assessment?context=/azure/ai-services/speech-service/context/context)

## Next steps

- Use [pronunciation assessment with the Speech SDK](how-to-pronunciation-assessment.md)
- Read the blog about [use cases](https://aka.ms/pronunciationassessment/techblog)
