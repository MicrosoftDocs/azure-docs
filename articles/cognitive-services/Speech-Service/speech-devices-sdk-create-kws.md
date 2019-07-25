---
title: Create a custom wake word - Speech Services
titleSuffix: Azure Cognitive Services
description: Your device is always listening for a wake word (or phrase). When the user says the wake word, the device sends all subsequent audio to the cloud, until the user stops speaking. Customizing your wake word is an effective way to differentiate your device and strengthen your branding.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/05/2019
ms.author: erhopf
---

# Create a custom wake word by using the Speech service

Your device is always listening for a wake word (or phrase). For example, "Hey Cortana" is a wake word for the Cortana assistant. When the user says the wake word, the device sends all subsequent audio to the cloud, until the user stops speaking. Customizing your wake word is an effective way to differentiate your device and strengthen your branding.

In this article, you learn how to create a custom wake word for your device.

## Choose an effective wake word

Consider the following guidelines when you choose a wake word:

* Your wake word should be an English word or a phrase. It should take no longer than two seconds to say.

* Words of 4 to 7 syllables work best. For example, "Hey, Computer" is a good wake word. Just "Hey" is a poor one.

* Wake words should follow common English pronunciation rules.

* A unique or even a made-up word that follows common English pronunciation rules might reduce false positives. For example, "computerama" might be a good wake word.

* Do not choose a common word. For example, "eat" and "go" are words that people say frequently in ordinary conversation. They might be false triggers for your device.

* Avoid using a wake word that might have alternative pronunciations. Users would have to know the "right" pronunciation to get their device to respond. For example, "509" can be pronounced "five zero nine," "five oh nine," or "five hundred and nine." "R.E.I." can be pronounced "r-e-i" or "ray." "Live" can be pronounced "/līv/" or "/liv/".

* Do not use special characters, symbols, or digits. For example, "Go#" and "20 + cats" would not be good wake words. However, "go sharp" or "twenty plus cats" might work. You can still use the symbols in your branding and use marketing and documentation to reinforce the proper pronunciation.

> [!NOTE]
> If you choose a trademarked word as your wake word, be sure that you own that trademark or that you have permission from the trademark owner to use the word. Microsoft is not liable for any legal issues that might arise from your choice of wake word.

## Create your wake word

Before you can use a custom wake word with your device, you'll need to create a wake word with the Microsoft Custom Wake Word Generation service. After you provide a wake word, the service produces a file that you deploy to your development kit to enable the wake word on your device.

1. Go to the [Custom Speech Service Portal](https://aka.ms/sdsdk-speechportal) and **Sign in** or if you do not have a speech subscription choose [**Create a subscription**](https://go.microsoft.com/fwlink/?linkid=2086754)

    ![The Custom Speech Service Portal](media/speech-devices-sdk/wake-word-4.png)

1. At the [Custom Wake Word](https://aka.ms/sdsdk-wakewordportal) page type in the wake word of your choice and click **Add wake word**. We have some [guidelines](#choose-an-effective-wake-word) to help choose an effective keyword. Currently we only support en-US language.

    ![Enter your wake word](media/speech-devices-sdk/wake-word-5.png)

1. Three alternative pronunciations of your wake word will be created. You can choose all the pronunciations that you like. Then select **Submit** to generate the wake word. If you want to change the wake word please remove the existing one first, when you hover on the pronunciation line the delete icon will appear.

    ![Review your wake word](media/speech-devices-sdk/wake-word-6.png)

1. It might take up to one minute for the model to be generated. You will be prompted to download the file.

    ![Download your wake word](media/speech-devices-sdk/wake-word-7.png)

1. Save the .zip file to your computer. You will need this file to deploy your custom wake word to the development kit.

## Next steps

Test your custom wake word with [Speech Devices SDK Quickstart](https://aka.ms/sdsdk-quickstart).
