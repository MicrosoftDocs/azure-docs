---
title: Introduction to red teaming large language models (LLMs)
titleSuffix: Azure OpenAI Service
description: Learn about how red teaming and adversarial testing is an essential practice in the responsible development of systems and features using large language models (LLMs)
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 05/18/2023
ms.custom: 
manager: nitinme
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
keywords:
---

# Introduction to red teaming large language models (LLMs)

The term *red teaming* has historically described systematic adversarial attacks for testing security vulnerabilities. With the rise of LLMs, the term has extended beyond traditional cybersecurity and evolved in common usage to describe many kinds of probing, testing, and attacking of AI systems. With LLMs, both benign and adversarial usage can produce potentially harmful outputs, which can take many forms, including harmful content such as hate speech, incitement or glorification of violence, or sexual content.

**Red teaming is an essential practice in the responsible development of systems and features using LLMs**. While not a replacement for systematic [measurement and mitigation](/legal/cognitive-services/openai/overview?context=/azure/ai-services/openai/context/context) work, red teamers help to uncover and identify harms and, in turn, enable measurement strategies to validate the effectiveness of mitigations.

Microsoft has conducted red teaming exercises and implemented safety systems (including [content filters](content-filter.md) and other [mitigation strategies](prompt-engineering.md)) for its Azure OpenAI Service models (see this [Responsible AI Overview](/legal/cognitive-services/openai/overview?context=/azure/ai-services/openai/context/context)). However, the context of your LLM application will be unique and you also should conduct red teaming to:

- Test the LLM base model and determine whether there are gaps in the existing safety systems, given the context of your application system.
- Identify and mitigate shortcomings in the existing default filters or mitigation strategies.
- Provide feedback on failures so we can make improvements.

Here is how you can get started in your process of red teaming LLMs. Advance planning is critical to a productive red teaming exercise.

## Getting started

### Managing your red team

**Assemble a diverse group of red teamers.**

LLM red teamers should be a mix of people with diverse social and professional backgrounds, demographic groups, and interdisciplinary expertise that fits the deployment context of your AI system. For example, if you’re designing a chatbot to help health care providers, medical experts can help identify risks in that domain.

**Recruit red teamers with both benign and adversarial mindsets.**

Having red teamers with an adversarial mindset and security-testing experience is essential for understanding security risks, but red teamers who are ordinary users of your application system and haven’t been involved in its development can bring valuable perspectives on harms that regular users might encounter.

**Remember that handling potentially harmful content can be mentally taxing.**

You will need to take care of your red teamers, not only by limiting the amount of time they spend on an assignment, but also by letting them know they can opt out at any time. Also, avoid burnout by switching red teamers’ assignments to different focus areas.

### Planning your red teaming

#### Where to test

Because a system is developed using a LLM base model, you may need to test at several different layers:

- The LLM base model with its [safety system](./content-filter.md) in place to identify any gaps that may need to be addressed in the context of your application system. (Testing is usually through an API endpoint.)
- Your application system. (Testing is usually through a UI.)
- Both the LLM base model and your application system before and after mitigations are in place.

#### How to test

Consider conducting iterative red teaming in at least two phases:

1. Open-ended red teaming, where red teamers are encouraged to discover a variety of harms. This can help you develop a taxonomy of harms to guide further testing. Note that developing a taxonomy of undesired LLM outputs for your application system is crucial to being able to measure the success of specific mitigation efforts.
2. Guided red teaming, where red teamers are assigned to focus on specific harms listed in the taxonomy while staying alert for any new harms that may emerge. Red teamers can also be instructed to focus testing on specific features of a system for surfacing potential harms.

Be sure to:

- Provide your red teamers with clear instructions for what harms or system features they will be testing.
- Give your red teamers a place for recording their findings. For example, this could be a simple spreadsheet specifying the types of data that red teamers should provide, including basics such as:
    - The type of harm that was surfaced.
    - The input prompt that triggered the output.
    - An excerpt from the problematic output.
    - Comments about why the red teamer considered the output problematic.
- Maximize the effort of responsible AI red teamers who have expertise for testing specific types of harms or undesired outputs. For example, have security subject matter experts focus on jailbreaks, metaprompt extraction, and content related to aiding cyberattacks.

### Reporting red teaming findings

You will want to summarize and report red teaming top findings at regular intervals to key stakeholders, including teams involved in the measurement and mitigation of LLM failures so that the findings can inform critical decision making and prioritizations.

## Next steps

[Learn about other mitigation strategies like prompt engineering](./prompt-engineering.md)
