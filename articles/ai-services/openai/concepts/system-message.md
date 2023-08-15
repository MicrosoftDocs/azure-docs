---
title: System message framework and template recommendations for Large Language Models(LLMs)
titleSuffix: Azure OpenAI Service
description: Learn about how to construct system messages also know as metaprompts to guide an AI system's behavior.
ms.service: cognitive-services
ms.subservice: openai
ms.topic: conceptual
ms.date: 05/19/2023
ms.custom: 
manager: nitinme
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
keywords:
---

# System message framework and template recommendations for Large Language Models (LLMs)

This article provides a recommended framework and example templates to help write an effective system message, sometimes referred to as a metaprompt or [system prompt](advanced-prompt-engineering.md?pivots=programming-language-completions#meta-prompts) that can be used to guide an AI system’s behavior and improve system performance. If you're new to prompt engineering, we recommend starting with our [introduction to prompt engineering](prompt-engineering.md) and [prompt engineering techniques guidance](advanced-prompt-engineering.md).

This guide provides system message recommendations and resources that, along with other prompt engineering techniques, can help increase the accuracy and grounding of responses you generate with a Large Language Model (LLM). However, it is important to remember that even when using these templates and guidance, you still need to validate the responses the models generate. Just because a carefully crafted system message worked well for a particular scenario doesn't necessarily mean it will work more broadly across other scenarios. Understanding the [limitations of LLMs](/legal/cognitive-services/openai/transparency-note?context=/azure/ai-services/openai/context/context#limitations) and the [mechanisms for evaluating and mitigating those limitations](/legal/cognitive-services/openai/overview?context=/azure/ai-services/openai/context/context) is just as important as understanding how to leverage their strengths.

The LLM system message framework described here covers four concepts:

- Define the model’s profile, capabilities, and limitations for your scenario
- Define the model’s output format
- Provide example(s) to demonstrate the intended behavior of the model
- Provide additional behavioral guardrails

## Define the model’s profile, capabilities, and limitations for your scenario

- **Define the specific task(s)** you would like the model to complete. Describe who the users of the model will be, what inputs they will provide to the model, and what you expect the model to do with the inputs.

- **Define how the model should complete the tasks**, including any additional tools (like APIs, code, plug-ins) the model can use. If it doesn’t use additional tools, it can rely on its own parametric knowledge.

- **Define the scope and limitations** of the model’s performance. Provide clear instructions on how the model should respond when faced with any limitations. For example, define how the model should respond if prompted on subjects or for uses that are off topic or otherwise outside of what you want the system to do.

- **Define the posture and tone** the model should exhibit in its responses.

## Define the model's output format

When using the system message to define the model’s desired output format in your scenario, consider and include the following types of information:

- **Define the language and syntax** of the output format. If you want the output to be machine parse-able, you may want the output to be in formats like JSON, XSON or XML.

- **Define any styling or formatting** preferences for better user or machine readability. For example, you may want relevant parts of the response to be bolded or citations to be in a specific format.

## Provide example(s) to demonstrate the intended behavior of the model

When using the system message to demonstrate the intended behavior of the model in your scenario, it is helpful to provide specific examples. When providing examples, consider the following:

- Describe difficult use cases where the prompt is ambiguous or complicated, to give the model additional visibility into how to approach such cases.
- Show the potential “inner monologue” and chain-of-thought reasoning to better inform the model on the steps it should take to achieve the desired outcomes.

## Define additional behavioral guardrails

When defining additional safety and behavioral guardrails, it’s helpful to first identify and prioritize [the harms](/legal/cognitive-services/openai/overview?context=/azure/ai-services/openai/context/context) you’d like to address. Depending on the application, the sensitivity and severity of certain harms could be more important than others.

## Next steps

- Learn more about [Azure OpenAI](../overview.md)
- Learn more about [deploying Azure OpenAI responsibly](/legal/cognitive-services/openai/overview?context=/azure/ai-services/openai/context/context)
- For more examples, check out the [Azure OpenAI Samples GitHub repository](https://github.com/Azure-Samples/openai)
