---
title: What is the Immersive Reader API?
titleSuffix: Azure Cognitive Services
description: Learn about the Immersive Reader API.
services: cognitive-services
author: metanMSFT
manager: nitinme

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: overview
ms.date: 06/20/2019
ms.author: metan
#Customer intent: As a developer, I want to learn more about the Immersive Reader, which is a new offering in Cognitive Services, so that I can embed this package of content into a document to accommodate users with reading differences.
---

# What is Immersive Reader?

The [Immersive Reader](https://www.onenote.com/learningtools) is an inclusively designed tool that implements proven techniques to improve reading comprehension for emerging readers, language learners, and people with learning differences such as dyslexia.

You can use Immersive Reader in your web application by using the Immersive Reader SDK.

## What does Immersive Reader do?

The Immersive Reader is designed to make reading more accessible for everyone.

* Shows content in a minimal reading view

  ![Immersive Reader](./media/immersive-reader.png)

* Displays pictures of commonly used words

  ![Picture Dictionary](./media/picture-dictionary.png)

* Highlights nouns, verbs, adjectives, and adverbs

  ![Parts of Speech](./media/parts-of-speech.png)

* Reads your content out loud to you

  ![Read Aloud](./media/read-aloud.png)

* Translates your content into another language

  ![Translation](./media/translation.png)

* Breaks down words into syllables

  ![Syllabification](./media/syllabification.png)

## How does Immersive Reader work?

The Immersive Reader is a standalone web app that, when invoked using the Immersive Reader JavaScript SDK, is displayed on top of your existing web app via an `iframe`. When you call the API to launch the Immersive Reader, you specify the content you wish to show in the Immersive Reader. Our SDK handles the creation and styling of the `iframe` and communication with the Immersive Reader backend service, which processes the content for parts of speech, text to speech, translation, and so on.

## Next steps

Get started with Immersive Reader:

* Jump into the [quickstart](./quickstart.md)
* Explore the [Immersive Reader SDK on GitHub](https://github.com/Microsoft/immersive-reader-sdk)
* Read the [Immersive Reader SDK Reference](./reference.md)