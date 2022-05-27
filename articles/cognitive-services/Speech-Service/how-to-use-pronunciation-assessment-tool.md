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

## Try out pronunciation assessment without signing in

You can explore and try out Pronunciation Assessment even without signing in.

Follow these steps to try it out:

1. Visit the [Speech Studio](https://speech.microsoft.com) portal and then select **Pronunciation Assessment**.

2. You can try out the assessment samples as shown in the following screenshot.

   :::image type="content" source="media/pronunciation-assessment/pa-without-signing-in-1.png" alt-text="Screenshot of pronunciation assessment without signing in":::

   You can't enter your own scripts to evaluate your pronunciation without signing in.

3. To get full access to Pronunciation Assessment feature, sign in with your Azure S0 account.

   :::image type="content" source="media/pronunciation-assessment/pa-without-signing-in-Signin.png" alt-text="Screenshot of signing in with Azure account":::
  
## Try out pronunciation assessment after signing in

If you're new to Azure, [create an Azure account](https://azure.microsoft.com/free/cognitive-services/).

Once you've created an Azure account and a Speech service subscription, you'll need to sign in to Speech Studio and connect your subscription. If you want to switch to another Speech subscription, select the **cog** icon at the top.

### Evaluate speech pronunciation

Follow these steps to evaluate if your pronunciation needs to be improved and how to improve your pronunciation.

1. First, you need to select the following checkbox. Or else, you can't record audio or upload audio to evaluate your pronunciation.

   :::image type="content" source="media/pronunciation-assessment/pa-acknowledge.png" alt-text="Screenshot of acknowledgement":::

2. Next, select a language for which you want to evaluate the pronunciation.
  
   :::image type="content" source="media/pronunciation-assessment/pa-language.png" alt-text="Screenshot of choosing languages":::

   Pronunciation Assessment is announced generally available in US English, while [other languages](language-support.md#pronunciation-assessment) are available in preview.

3. You can record the sample script directly, or your own script.

   :::image type="content" source="media/pronunciation-assessment/pa-record.png" alt-text="Screenshot of recording":::

   When reading the reference text, you should be close to microphone to make sure the recorded voice isn't too low. 

   You can also upload the audio recorded offline for pronunciation assessment. Once successfully uploaded, the audio will be automatically evaluated by the system, as shown in the following screenshot.

   :::image type="content" source="media/pronunciation-assessment/pa-upload.png" alt-text="Screenshot of uploading recorded audio":::
   
4. Once you've recorded the reference text or uploaded the recorded audio, the **Assessment result** will be output. The result includes your spoken audio and the feedback on the accuracy and fluency of spoken audio, by comparing a machine generated transcript of the input audio with the reference text.

   You can listen to your spoken audio, and download it if necessary.
   
   :::image type="content" source="media/pronunciation-assessment/pa-audio.png" alt-text="Screenshot of downloading spoken audio":::

   Pronunciation Assessment evaluates three aspects of pronunciation: accuracy, fluency, and completeness, as shown in the following screenshot.

   :::image type="content" source="media/pronunciation-assessment/pa-score.png" alt-text="Screenshot of pronunciation error"::: 
    
   Your spoken audio is converted to text in the **Display** window. If a word is omitted, inserted, or mispronounced compared to the reference text, this word will be marked with a color. Each color corresponds to an error type. 
   
   Keeping your mouse over each word, you can see accuracy scores for the whole word, syllables and specific phonemes. You can customize the level to be displayed on the portal to suit your needs.
   
   You can also check the pronunciation assessment result in JSON. The word-level, syllable-level, and phoneme-level accuracy scores are included in the JSON file. The JSON output looks similar to the following code snippet.

    :::image type="content" source="media/pronunciation-assessment/pa-json.png" alt-text="Screenshot of result in json"::: 
    
    At the bottom of **Assessment result**, you can see **Pronunciation score**, **Accuracy score**, **Fluency score**, and **Completeness score**. The **Pronunciation score** is overall score indicating the pronunciation quality of the given speech. This overall score is aggregated from **Accuracy score**, **Fluency score**, and **Completeness score** with weight.

## Next steps

- Create a [free Azure account](https://azure.microsoft.com/free/cognitive-services/)
- Try out [pronunciation assessment with the Speech SDK](how-to-pronunciation-assessment.md)
- Learn about how to use pronunciation assessment [features](use-pronunciation-assessment.md)
