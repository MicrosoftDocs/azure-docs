---
title: How to work with prompt engineering and the Completion API
titleSuffix: Azure OpenAI
description: Learn how to work with the Completion API for prompt engineering
author: mrbullwinkle 
ms.author: mbullwin 
ms.service: cognitive-services
ms.topic: include
ms.date: 03/21/2023
manager: nitinme
keywords: ChatGPT
---

## Start with clear instructions

The sequence in which information is fed in the prompt, matters (GPT style models are built in a certain way and that’s the reason behind this). Our research suggests that telling the model the task you want it to do at the beginning of the prompt, before sharing additional contextual information or examples, can help produce higher-quality outputs.

|Prompt|Completion|
|------|----------|
|Your task is to verify if the statement "Several sources mention a chance of another large eruption" is supported by a specific quote from the following set of snippets.<br>---<br>SNIPPETS<br>[1] 14 percent chance of megaquake hitting Seattle, experts say<br>SEATTLE - There's a 14 percent chance of a magnitude 9 Cascadia earthquake hitting Seattle in the next 50 years, the U.S. Geological Survey estimates. "Unfortunately, we are unable to...<br><br>[2] Earthquake experts lay out latest outlook for Seattle's 'Really Big One’<br>“We say that there's approximately a 14% chance of another approximately magnitude-9 earthquake occurring in the next 50 years,” said a geophysicist at the University of Washington...<br>|Yes, the statement is directly implied by the snippets.|

In this next example, we give the exact statement we want to check (“Several sources mention a chance of another eruption”) before we give the snippet context. This allows the token representations extracted from the snippets to be tailored to the statement we are checking. And the resulting model response is accurate:

|Prompt|Completion|
|------|----------|
|Your task is to verify if the statement "Several sources mention a chance of another large eruption" is supported by a specific quote from the following set of snippets.<br>---<br>SNIPPETS<br>[1] 14 percent chance of megaquake hitting Seattle, experts say
SEATTLE - There's a 14 percent chance of a magnitude 9 Cascadia earthquake hitting Seattle in the next 50 years, the U.S. Geological Survey estimates. "Unfortunately, we are unable to...<br><br>[2] Earthquake experts lay out latest outlook for Seattle's 'Really Big One’<br>“We say that there's approximately a 14% chance of another approximately magnitude-9 earthquake occurring in the next 50 years,” said a geophysicist at the University of Washington...<br>---<br>**Is the statement "Several sources mention a chance of another large eruption" directly implied or stated by the snippets?**| No, the statement is not directly implied or stated by the snippets. The snippets mention a chance of a "megaquake" and a "magnitude 9 Cascadia earthquake" hitting Seattle in the next 50 years, but do not mention a chance of another large eruption.|

## Repeat the instructions at the end

Models can be susceptible to “recency bias,” which means that information at the end of the prompt might have more significant influence over the output than information at the beginning of the prompt. Therefore, it is worth experimenting with repeating the instructions at the end of the prompt and evaluating the impact for your use case.

We saw in the earlier example how repeating the instruction at the beginning as well as the end of the prompt leads to a higher likelihood of getting an accurate model response.

## Prime the output

This refers to including a few words or phrases at the end of the prompt to obtain a model response that follows the desired form. For example, using a cue such as `“Here’s a bulleted list of key points:\n- ”` can help make sure the outputted is formatted as a list of bullet points.

|Prompt|Completion|
|------|----------|
| John Smith is married to Lucy Smith. They have five kids, and he works as a software engineer at Microsoft. What search queries should I do to fact-check this? <br>##<br>One possible search query is:|"John Smith Microsoft software engineer"<br>Another possible search query is: "Lucy Smith married to John Smith"<br>A third possible search query is: "John Smith family size".|

In the above prompt, the text **"One possible search query is:"** primes the model to produce an output in the form of a search query. This technique can help remove hedges that the model might typically add, such as “One possibility is...”.

## Add clear syntax

Using clear syntax for your prompt—including punctuation, headings, and section markers—helps communicate intent and often makes outputs easier to parse. 

In the example below, separators (“---” in this case) have been added between different sources of information or steps. This allows the use of “---” as a stopping condition for generation. In addition, section headings or special variables are presented in uppercase to differentiate them.

|Prompt|Completion|
|------|----------|















## Next steps

* [Learn more about Azure OpenAI](../overview.md).
* Get started with the ChatGPT model with [the ChatGPT quickstart](../chatgpt-quickstart.md).
* For more examples, check out the [Azure OpenAI Samples GitHub repository](https://github.com/Azure/openai-samples)
