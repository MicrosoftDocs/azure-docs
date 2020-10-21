---
title: What is the Immersive Reader?
titleSuffix: Azure Cognitive Services
description: Immersive Reader is a tool that is designed to help people with learning differences or help new readers and language learners with reading comprehension.
services: cognitive-services
author: metanMSFT
manager: nitinme

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: overview
ms.date: 01/4/2020
ms.author: metan
ms.custom: "cog-serv-seo-aug-2020"
keywords: readers, language learners, display pictures, improve reading, read content, translate
#Customer intent: As a developer, I want to learn more about the Immersive Reader, which is a new offering in Cognitive Services, so that I can embed this package of content into a document to accommodate users with reading differences.
---

# What is Immersive Reader?

[Immersive Reader](https://www.onenote.com/learningtools) is an inclusively designed tool that implements proven techniques to improve reading comprehension for new readers, language learners, and people with learning differences such as dyslexia. With the Immersive Reader client library, you can leverage the same technology used in Microsoft Word and Microsoft One Note to improve your web applications. 

## Use Immersive Reader to improve reading accessibility 

Immersive Reader is designed to make reading easier and more accessible for everyone. Let's take a look at a few of Immersive Reader's core features.

### Isolate content for improved readability

Immersive Reader isolates content to improve readability. 

  ![Isolate content for improved readability with Immersive Reader](./media/immersive-reader.png)

### Display pictures for common words

For commonly used terms, the Immersive Reader will display a picture.

  ![Picture Dictionary with Immersive Reader](./media/picture-dictionary.png)

### Highlight parts of speech

Immersive Reader can be use to help learners understand parts of speech and grammar by highlighting verbs, nouns, pronouns, and more.

  ![Show parts of speech with Immersive Reader](./media/parts-of-speech.png)

### Read content aloud

Speech synthesis (or text-to-speech) is baked into the Immersive Reader service, which lets your readers select text to be read aloud. 

  ![Read text aloud with Immersive Reader](./media/read-aloud.png)

### Translate content in real-time

Immersive Reader can translate text into many languages in real-time. This is helpful to improve comprehension for readers learning a new language.

  ![Translate text with Immersive Reader](./media/translation.png)

### Split words into syllables

With Immersive Reader you can break words into syllables to improve readability or to sound out new words.

  ![Break words into syllables with Immersive Reader](./media/syllabification.png)

## How does Immersive Reader work?

Immersive Reader is a standalone web application. When invoked using the Immersive Reader client library is displayed on top of your existing web application in an `iframe`. When your wep application calls the Immersive Reader service, you specify the content to show the reader. The Immersive Reader client library handles the creation and styling of the `iframe` and communication with the Immersive Reader backend service. The Immersive Reader service processes the content for parts of speech, text to speech, translation, and more.

## Get started with Immersive Reader

The Immersive Reader client library is available in C#, JavaScript, Java (Android),  Kotlin (Android), and Swift (iOS). Get started with:

* [Quickstart: Use the Immersive Reader client library](quickstarts/client-libraries.md)

## Next steps

Get started with Immersive Reader:

* Read the [Immersive Reader client library Reference](./reference.md)
* Explore the [Immersive Reader client library on GitHub](https://github.com/microsoft/immersive-reader-sdk)
