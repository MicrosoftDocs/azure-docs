---
title: Release Notes - Text-to-speech
titleSuffix: Azure Cognitive Services
description: A running log of Text-to-speech feature releases, improvements, bug fixes, and known issues.
services: cognitive-services
author: oliversc
manager: jhakulin
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/06/2020
ms.author: oliversc
ms.custom: seodec18
---

# Release notes

## Text-to-speech 2020-July release

### New features

* **Neural TTS, 15 new neural voices**: The new voices added to the Neural TTS portfolio are Salma in Arabic (Egypt), Zariyah in Arabic (Saudi Arabia), Alba in Catalan (Spain), Christel in Danish (Denmark), Neerja in English (India), Swara in Hindi (India), Colette in Dutch (Netherland), Zofia in Polish (Poland), Fernanda in Portuguese (Portugal), Dariya in Russian (Russia), Hillevi in Swedish (Sweden), Achara in Thai (Thailand), Iselin Norwegian (Bokmål) in (Norway),  HiuGaai in Chinese (Hongkong) and HsiaoYu in Chinese (Taiwan). Check all [supported languages](https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#neural-voices).  

* **Custom Voice, streamlined voice testing with the training flow to simplify user experience**: With the new testing feature, each voice will be automatically tested with a predefined test set optimized for each language to cover general and voice assistant scenarios. These test sets are carefully selected and tested to include typical use cases and phonemes in the language. Besides, users can still select to upload their own test scripts when training a model.

* **Audio Content Creation: a set of new features are released to enable more powerful voice tuning and audio management capabilities**

    * `Pitch`, `rate`, and `volume` are enhanced to support tuning with a predefined value, like slow, medium and fast. It's now straightforward for users to pick a 'constant' value for their audio editing.

    * Users can now review the `Audio history` for their work file. With this feature, users can easily track all the generated audio related to a working file. They can check the history version and compare the quality while tuning at the same time. 

    * The `Clear` feature is now more flexible. Users can clear a specific tuning parameter while keeping other parameters available for the selected content.  

    * A tutorial video was added on the [landing page](https://speech.microsoft.com/audiocontentcreation) to help users quickly get started with TTS voice tuning and audio management. 

### General TTS voice quality improvements

* Improved TTS vocoder in for higher fidelity and lower latency.

    * Updated Elsa in Italian to a new vocoder which achieved +0.464 CMOS (Comparative Mean Opinion Score) gain in voice quality, 40% faster in synthesis and 30% reduction on first byte latency. 
    * Updated Xiaoxiao in Chinese to the new vocoder with +0148 CMOS gain for the general domain, +0.348 for the newscast style and +0.195 for the lyrical style. 

* Updated `de-DE` and `ja-JP` voice models to make the TTS output more natural.
    
    * Updated Katja in German with the latest prosody modelling method, the MOS (Mean Opinion Score) gain is +0.13. 
    * Updated Nanami in Japanese with a new pitch accent prosody model, the MOS (Mean Opinion Score) gain is +0.19;  

* Improved word-level pronunciation accuracy in 5 languages.

    | Language | Pronunciation error reduction |
    |---|---|
    | en-GB | 51% |
    | ko-KR | 17% |
    | pt-BR | 39% |
    | pt-PT | 77% |
    | id-ID | 46% |

### Bug fixes

* Currency reading
    * Fixed the issue with currency reading for `es-ES` and `es-MX`
     
    | Language | Input | Readout after improvement |
    |---|---|---|
    | es-MX | $1.58 | un peso cincuenta y ocho centavos |
    | es-ES | $1.58 | un dólar cincuenta y ocho centavos |

    * Support for negative currency (like “-325 €” ) in following locales: `en-US`, `en-GB`, `fr-FR`, `it-IT`, `en-AU`, `en-CA`.

* Improved address reading in `pt-PT`.
* Fixed Natasha (`en-AU`) and Libby (`en-UK`) pronunciation issues on the word "for" and "four".  
* Fixed bugs on Audio Content Creation tool
    * The additional and unexpected pause after the second paragraph is fixed.  
    * 'No break' feature is added back from a regression bug. 
    * The random refresh issue of Speech Studio is fixed.  

### Samples/SDK

* JavaScript: Fixes playback issue in FireFox, and Safari on macOS and iOS. 
* See Speech SDK 1.12.1 [release notes](https://docs.microsoft.com/azure/cognitive-services/speech-service/releasenotes) for more details 



