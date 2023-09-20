---
title: Artificial Intelligence (AI) shared responsibility model      
description: "Understand the shared responsibility model and which tasks are handled by the AI platform or application provider, and which tasks are handled by you."
services: security
documentationcenter: na
author: TerryLanfear
manager: rkarlin
editor: na

ms.assetid:
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/20/2023
ms.author: terrylan

---
# Artificial Intelligence (AI) shared responsibility model

As you consider and evaluate AI enabled integration, it's critical to understand the shared responsibility model and which tasks are handled by the AI platform or application provider, and which tasks are handled by you. The workload responsibilities vary depending on whether the AI integration is based on Software as a Service (SaaS), Platform as a Service (PaaS), or Infrastructure as a Service (IaaS).

## Division of responsibility
When developing your own AI capabilities, such as training a new Machine Learning (ML) algorithm or fine-tuning Large Language Models (LLMs), you own the compute and Microsoft provides the AI infrastructure. As you move towards more managed solutions, such as one of many Microsoft Copilot solutions *(add link to an article about Microsoft Copilot)*, responsibilities transfer to Microsoft. The following diagram illustrates the areas of responsibility between you and Microsoft according to the type of deployment.

:::image type="content" source="media/shared-responsibility-ai/ai-shared-responsibility.png" alt-text="Diagram showing responsibility zones." border="false":::

## AI layer overview
An AI enabled application consists of three layers of functionality that group together tasks which may be performed by you or by an AI provider. The security responsibilities generally reside with whoever performs the tasks, but an AI provider may choose to expose security or other controls as a configuration option to you as appropriate. These three layers include:

### AI platform
The AI platform layer provides the AI capabilities to the applications. At the platform layer there is a need to build and safeguard the infrastructure that runs the AI model, training data, and specific configurations that change the behavior of the model, such as weights and biases. This layer provides access to functionality via APIs, which will pass text known as a *Metaprompt* to the AI model for processing, then return the generated outcome, known as a *Prompt-Response*.

**AI platform security considerations** - To protect the AI platform from malicious inputs, a safety system must be built to filter out the potentially harmful instructions sent to the AI model (inputs). As AI models are generative, there is also a potential that some harmful content may be generated and returned to the user (outputs). Thus, any safety system must first protect inputs and generated content based on classification, as well as outputs. Additionally, these classifications will evolve over time based on model knowledge, locale, and industry.

### AI application
The AI application accesses the AI capabilities and provides the service or interface that is consumed by the user. The components in this layer can vary from relatively simple to highly complex, depending on the application. The simplest standalone AI applications act as an interface to a set of APIs taking a text-based user-prompt and passing that data to the model for a response. More complex AI applications include the ability to ground the user-prompt with additional context, including a persistence layer, semantic index, or via plugins to allow access to additional data sources. Advanced AI applications may also interface with existing applications and systems. Existing applications and systems may work across text, audio, and images to generate various types of content.

**AI applicaction security considerations** - An application safety system must be built to protect the AI application from malicious activities. The safety system provides deep inspection of the content being used in a request sent to the AI model. The safety system also inspects the interactions with any plugins, data connectors, and other AI applications (known as AI Orchestration).

### AI usage
The AI usage layer describes how the AI capabilities are ultimately used and consumed. Generative AI offers a new type of user/computer interface that is fundamentally different from other computer interfaces, such as API, command-prompt, and graphical user interfaces (GUIs). The generative AI interface is both interactive and dynamic, allowing the computer capabilities to adjust to the user and their intent. The generative AI interface contrasts with previous interfaces that primarily force users to learn the system design and functionality and adjust to it. This interactivity allows user input, instead of application designers, to have a high level of influence of the output of the system, making safety guardrails critical to protecting people, data, and business assets.

**AI usage security considerations** - Protecting AI usage is similar to any computer system as it relies on security assurances for identity and access controls, device protections and monitoring, data protection and governance, administrative controls, and other controls.

Additional emphasis is required on user behavior and accountability because of the increased influence users have on the output of the systems. It's critical to update acceptable use policies and educate users on them. These should include AI specific considerations related to security, privacy, and ethics. Additionally, users should be educated on AI based attacks that can be used to trick them with convincing fake text, voices, videos, and more.

AI specific attack types are defined in several places including MSRC AI Bug Bar, MITRE ATLAS, OWASP Top 10 for LLM, OWASP Top 10 for ML, and NIST AI Risk Management Framework. *(Need to find links)*

## Security lifecycle
As with security for any other type of capability, it's critical to plan for a complete approach, including people, process, and technology across the full security lifecycle (identify, protect, detect, respond, recover, and govern). Any gap or weakness in this lifecycle could have you:

- Miss securing important assets
- Experience easily preventable attacks
- Unable to handle attacks
- Unable to rapidly restore business critical services
- Apply controls inconsistently

This is described well in the NIST Cybersecurity framework. *(Need to find LINK)*

## Copilot security advantages
To help bring AI to the world, Microsoft is developing Copilot solutions for each of the main productivity solutions: from Bing and Windows, to GitHub and Office 365, Microsoft is developing full stack solutions for all types of productivity scenarios. These are offered as SaaS solutions. Built into the user interface of the product, they are tuned to assist the user with. *(Tuned to assist the user with what?)*

Microsoft ensures that every Copilot solution is engineered following our strong principles for AI governance. *(Link to our principles of AI governance.)*

## Next steps
Learn more about the security of AI systems by reading the Microsoft Principles of Secure AI. *(Link to principles of secure AI.)*

Learn about the [shared responsibilities for cloud computing](shared-responsibility.md).
