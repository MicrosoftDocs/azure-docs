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
|You will read a paragraph, and then issue queries to a search engine in order to fact-check it. Also explain the queries.<br>---<br>PARAGRAPH<br>John Smith is married to Lucy Smith. They have five kids, and he works as a software engineer at Microsoft. What search queries should I do to fact-check this?<br>---<br>QUERIES | . "John Smith Microsoft" - To check if John Smith is indeed employed at Microsoft.<br>2. "John Smith Lucy Smith" - To check if John Smith is married to Lucy Smith.<br>3. "John Smith children" - To check if John Smith has five children.|

If you’re not sure what syntax to use, consider using markdown or XML,  since large language models have been trained on a lot of web content in XML or markdown.

## Break the task down

Models often perform better if the task is broken down into smaller steps. For example, in the search query generation prompt referenced earlier, the prompt can be restructured so that the model is first instructed to extract relevant facts, and then instructed to generate search queries that can be used to verify those facts.

|Prompt|Completion|
|------|----------|
|You will read a paragraph, and then issue queries to a search engine in order to fact-check it.<br>---<br>PARAGRAPH<br>John Smith is married to Lucy Smith. They have five kids, and he works as a software engineer at Microsoft. What search queries should I do to fact-check this?<br>Now you will extract factual claims, and issue queries to fact-check them. When issuing a query, use the function SEARCH("query")<br><br>FACTUAL CLAIMS | 1. John Smith is married to Lucy Smith <br>2. They have five kids<br>3. He works as a software engineer at Microsoft<br><br>QUERIES<br>SEARCH("John Smith married Lucy Smith")<br>SEARCH("John Smith family size")<br>SEARCH("John Smith Microsoft software engineer") |

Notice the use of clear syntax to differentiate the sections and prime the output. In this simple example, breaking the task down from one to two steps is not very dramatic, but when trying to do this for a larger piece of text with many factual claims, breaking the task down can make a significant difference.

## Use of affordances

Sometimes we can get the model to use an [affordance](https://www.interaction-design.org/literature/topics/affordances) instead of relying on its own parameters for information and answers. Search, for example, can be an affordance to help mitigate against fabricated answers, and to get up-to-date information.

One simple way to use an affordance is to stop generation once the affordance calls are generated by the model, then paste the outcomes back into the prompt. Below is an example of what the follow-up call could be after doing the **SEARCH** calls above. Notice how we pasted the search results into the prompt and replaced the previous **SEARCH** calls.

|Prompt|Completion|
|------|----------|
| You will read a paragraph, extract factual claims, and then use search engine results to fact-check them<br>---<br>PARAGRAPH<br>John Smith is married to Lucy Smith. They have five kids, and he works as a software engineer at Microsoft. What search queries should I do to fact-check this?<br>---<br>FACTUAL CLAIMS<br>- John Smith is married to Lucy Smith<br>- John and Lucy have five kids<br>- John works as a software engineer at Microsoft<br>---<br>Here are various search queries issued to research the claims above:<br>SEARCH QUERIES<br>- John Smith married to Lucy Smith<br>- John Smith number of children<br>- John Smith software engineer Microsoft<br>---<br>Here are snippets of the search results:<br>SNIPPETS:<br>[1] … John Smith’s wedding was on September 25, 2012 …<br>[2] … John Smith was accompanied by his wife Lucy to a ball<br>[3]John was accompanied to the soccer game by his two daughters and three sons<br>[4] … After spending 10 years at Microsoft, Smith founded his own startup, Tailspin Toys<br>5] John M is the town smith, and he married Fiona. They have a daughter named Lucy<br>---<br>Given the snippets, fact check each of the factual claims above: | - John Smith is married to Lucy Smith: Confirmed. Snippet [1] and [2] both mention John Smith's wife as Lucy.<br>- John and Lucy have five kids: Confirmed. Snippet [3] mentions that John was accompanied by his two daughters and three sons.<br>- John works as a software engineer at Microsoft: Partially confirmed. Snippet [4] mentions that John spent 10 years at Microsoft, but it does not explicitly state that he currently works there. Further research may be needed to confirm his current employment status. |  



















## Next steps

* [Learn more about Azure OpenAI](../overview.md).
* Get started with the ChatGPT model with [the ChatGPT quickstart](../chatgpt-quickstart.md).
* For more examples, check out the [Azure OpenAI Samples GitHub repository](https://github.com/Azure/openai-samples)
