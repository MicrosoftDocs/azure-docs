---
title: "Jailbreak risk detection in Azure AI Content Safety"
titleSuffix: Azure AI services
description: Learn about jailbreak risk detection and the related flags that the Content Safety service returns.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom: build-2023
ms.topic: conceptual
ms.date: 11/07/2023
ms.author: pafarley
keywords: 
---


# Jailbreak risk detection


Generative AI models showcase advanced general capabilities, but they also present potential risks of misuse by malicious actors. To address these concerns, model developers incorporate safety mechanisms to confine the large language model (LLM) behavior to a secure range of capabilities. Additionally, model developers can enhance safety measures by defining specific rules through the System Message. 

Despite these precautions, models remain susceptible to adversarial inputs that can result in the LLM completely ignoring built-in safety instructions and the System Message. 

## What is a jailbreak attack?

A jailbreak attack, also known as a User Prompt Injection Attack (UPIA), is an intentional attempt by a user to exploit the vulnerabilities of an LLM-powered system, bypass its safety mechanisms, and provoke restricted behaviors. These attacks can lead to the LLM generating inappropriate content or performing actions restricted by System Prompt or RHLF.  

Most generative AI models are prompt-based: the user interacts with the model by entering a text prompt, to which the model responds with a completion.  

Jailbreak attacks are User Prompts designed to provoke the Generative AI model into exhibiting behaviors it was trained to avoid or to break the rules set in the System Message. These attacks can vary from intricate role-play to subtle subversion of the safety objective. 

## Types of jailbreak attacks

Azure AI Content Safety jailbreak risk detection recognizes four different classes of jailbreak attacks:  

|Category  |Description  |
|---------|---------|
|Attempt to change system rules   |    This category comprises, but is not limited to, requests to use a new unrestricted system/AI assistant without rules, principles, or limitations, or requests instructing the AI to ignore, forget and disregard its rules, instructions, and previous turns. |
|Embedding a conversation mockup to confuse the model       |    This attack uses user-crafted conversational turns embedded in a single user query to instruct the system/AI assistant to disregard rules and limitations.      |
|Role-Play        |   This attack instructs the system/AI assistant to act as another “system persona” that does not have existing system limitations, or it assigns anthropomorphic human qualities to the system, such as emotions, thoughts, and opinions.       |
|Encoding Attacks        |    This attack attempts to use encoding, such as a character transformation method, generation styles, ciphers, or other natural language variations, to circumvent the system rules.      |

## Next steps

Follow the how-to guide to get started using Content Safety to detect jailbreak attacks.

> [!div class="nextstepaction"]
> [Detect jailbreak attacks](../how-to/detect-jailbreak.md)
