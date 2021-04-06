---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 04/02/2020
ms.author: trbye
---

The Speech resource subscription key and region are required to create a speech configuration object. The configuration object is needed to instantiate a speech recognizer object.

The recognizer instance exposes multiple ways to recognize speech. In this example, speech is recognized once. This functionality lets the Speech service know that you're sending a single phrase for recognition, and that once the phrase is identified to stop recognizing speech. Once the result is yielded, the code will write the recognition reason to the console.

> [!TIP]
> The Speech SDK will default to recognizing using `en-us` for the language, see [Specify source language for speech to text](../../../how-to-specify-source-language.md) for information on choosing the source language.