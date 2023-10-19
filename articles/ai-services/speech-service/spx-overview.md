---
title: The Azure AI Speech CLI
titleSuffix: Azure AI services
description: In this article, you learn about the Speech CLI, a command-line tool for using Speech service without having to write any code.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: overview
ms.date: 09/16/2022
ms.author: eur
---

# What is the Speech CLI?

The Speech CLI is a command-line tool for using Speech service without having to write any code. The Speech CLI requires minimal setup. You can easily use it to experiment with key features of Speech service and see how it works with your use cases. Within minutes, you can run simple test workflows, such as batch speech-recognition from a directory of files or text to speech on a collection of strings from a file. Beyond simple workflows, the Speech CLI is production-ready, and you can scale it up to run larger processes by using automated `.bat` or shell scripts.

Most features in the Speech SDK are available in the Speech CLI, and some advanced features and customizations are simplified in the Speech CLI. As you're deciding when to use the Speech CLI or the Speech SDK, consider the following guidance.

Use the Speech CLI when:
* You want to experiment with Speech service features with minimal setup and without having to write code.
* You have relatively simple requirements for a production application that uses Speech service.

Use the Speech SDK when:
* You want to integrate Speech service functionality within a specific language or platform (for example, C#, Python, or C++).
* You have complex requirements that might require advanced service requests.
* You're developing custom behavior, including response streaming.

## Core features

* **Speech recognition**: Convert speech to text either from audio files or directly from a microphone, or transcribe a recorded conversation.

* **Speech synthesis**: Convert text to speech either by using input from text files or by inputting directly from the command line. Customize speech output characteristics by using [Speech Synthesis Markup Language (SSML) configurations](speech-synthesis-markup.md).

* **Speech translation**: Translate audio in a source language to text or audio in a target language.

* **Run on Azure compute resources**: Send Speech CLI commands to run on an Azure remote compute resource by using `spx webjob`.

## Get started

To get started with the Speech CLI, see the [quickstart](spx-basics.md). This article shows you how to run some basic commands. It also gives you slightly more advanced commands for running batch operations for speech to text and text to speech. After you've read the basics article, you should understand the syntax well enough to start writing some custom commands or automate simple Speech service operations.

## Next steps

- [Get started with the Azure AI Speech CLI](spx-basics.md)
- [Speech CLI configuration options](./spx-data-store-configuration.md)
- [Speech CLI batch operations](./spx-batch-operations.md)
