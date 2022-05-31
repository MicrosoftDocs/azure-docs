---
title: How to use the pronunciation assessment tool
titleSuffix: Azure Cognitive Services
description: The pronunciation assessment tool enables you to evaluate speech pronunciation and gives you feedback on the accuracy and fluency of your speech, no coding required.
services: cognitive-services
author: sally-baolian
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 05/17/2022
ms.author: v-baolianzou
---

# How to use the pronunciation assessment tool

This article provides you instructions on using the pronunciation assessment tool through [Speech Studio](https://speech.microsoft.com) portal with no-code experience.

The pronunciation assessment tool enables you to evaluate speech pronunciation and gives you feedback on the accuracy and fluency of your speech, no coding required.

## Try out pronunciation assessment

You can explore and try out Pronunciation Assessment even without signing in. To get full access to Pronunciation Assessment feature, sign in with your Azure S0 account.

:::image type="content" source="media/pronunciation-assessment/pa-without-signing-in-Signin.png" alt-text="Screenshot of signing in with Azure account":::

Follow these steps to assess your pronunciation of the reference text:

1. Go to **Pronunciation Assessment** in the [Speech Studio](https://aka.ms/speechstudio/pronunciationassessment).

1. Choose a language for which you want to evaluate the pronunciation.
  
   :::image type="content" source="media/pronunciation-assessment/pa-language.png" alt-text="Screenshot of choosing languages":::

    > [!NOTE] 
    > Pronunciation Assessment is announced generally available in US English, while [other languages](language-support.md#pronunciation-assessment) are available in preview.

1. You can record the sample script directly, or your own script.

   :::image type="content" source="media/pronunciation-assessment/pa-record.png" alt-text="Screenshot of recording":::

   When reading the reference text, you should be close to microphone to make sure the recorded voice isn't too low. 

   You can also upload the audio recorded offline for pronunciation assessment. Once successfully uploaded, the audio will be automatically evaluated by the system, as shown in the following screenshot.

   :::image type="content" source="media/pronunciation-assessment/pa-upload.png" alt-text="Screenshot of uploading recorded audio":::


## Pronunciation assessment results

Once you've recorded the reference text or uploaded the recorded audio, the **Assessment result** will be output. The result includes your spoken audio and the feedback on the accuracy and fluency of spoken audio, by comparing a machine generated transcript of the input audio with the reference text. You can listen to your spoken audio, and download it if necessary.

You can also check the pronunciation assessment result in JSON. The word-level, syllable-level, and phoneme-level accuracy scores are included in the JSON file. 

### Overall scores 

Pronunciation Assessment evaluates three aspects of pronunciation: accuracy, fluency, and completeness. At the bottom of **Assessment result**, you can see **Pronunciation score**, **Accuracy score**, **Fluency score**, and **Completeness score**. The **Pronunciation score** is overall score indicating the pronunciation quality of the given speech. This overall score is aggregated from **Accuracy score**, **Fluency score**, and **Completeness score** with weight.

:::image type="content" source="media/pronunciation-assessment/pa-audio.png" alt-text="Screenshot of downloading spoken audio":::

Your spoken audio is converted to text in the **Display** window. If a word is omitted, inserted, or mispronounced compared to the reference text, this word will be marked with a color. Each color corresponds to an error type.

### Scores within words

### [Display](#tab/display)

 

Keeping your mouse over each word, you can see accuracy scores for the whole word, syllables and specific phonemes. You can customize the level to be displayed on the portal to suit your needs.

:::image type="content" source="media/pronunciation-assessment/pa-display-omission.png" alt-text="Screenshot of result in json":::

### [JSON](#tab/json)

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



## Next steps

- Try out [pronunciation assessment with the Speech SDK](how-to-pronunciation-assessment.md)
- Learn about how to use pronunciation assessment [features](use-pronunciation-assessment.md)
