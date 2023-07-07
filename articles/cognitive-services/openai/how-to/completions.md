---
title: 'How to generate text with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Learn how to generate or manipulate text, including code with Azure OpenAI
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: how-to
ms.date: 06/24/2022
author: ChrisHMSFT
ms.author: chrhoder
recommendations: false
keywords: 

---

# Learn how to generate or manipulate text

The completions endpoint can be used for a wide variety of tasks. It provides a simple but powerful text-in, text-out interface to any of our [models](../concepts/models.md). You input some text as a prompt, and the model will generate a text completion that attempts to match whatever context or pattern you gave it. For example, if you give the API the prompt, "As Descartes said, I think, therefore", it will return the completion " I am" with high probability.

The best way to start exploring completions is through our playground in [Azure OpenAI Studio](https://oai.azure.com). It's a simple text box where you can submit a prompt to generate a completion. You can start with a simple example like the following:

`write a tagline for an ice cream shop`

once you submit, you'll see something like the following generated:

``` console
write a tagline for an ice cream shop
we serve up smiles with every scoop!
```

The actual completion results you see may differ because the API is stochastic by default. In other words, you might get a slightly different completion every time you call it, even if your prompt stays the same. You can control this behavior with the temperature setting.

This simple, "text in, text out" interface means you can "program" the model by providing instructions or just a few examples of what you'd like it to do. Its success generally depends on the complexity of the task and quality of your prompt. A general rule is to think about how you would write a word problem for a middle school student to solve. A well-written prompt provides enough information for the model to know what you want and how it should respond.

> [!NOTE]
> Keep in mind that the models' training data cuts off in October 2019, so they may not have knowledge of current events. We plan to add more continuous training in the future.

## Prompt design

### Basics

OpenAI's models can do everything from generating original stories to performing complex text analysis. Because they can do so many things, you have to be explicit in showing what you want. Showing, not just telling, is often the secret to a good prompt. 

The models try to predict what you want from the prompt. If you send the words "Give me a list of cat breeds," the model wouldn't automatically assume that you're asking for a list of cat breeds. You could as easily be asking the model to continue a conversation where the first words are "Give me a list of cat breeds" and the next ones are "and I'll tell you which ones I like." If the model only assumed that you wanted a list of cats, it wouldn't be as good at content creation, classification, or other tasks.

There are three basic guidelines to creating prompts:

**Show and tell.** Make it clear what you want either through instructions, examples, or a combination of the two. If you want the model to rank a list of items in alphabetical order or to classify a paragraph by sentiment, show it that's what you want.

**Provide quality data.** If you're trying to build a classifier or get the model to follow a pattern, make sure that there are enough examples. Be sure to proofread your examples — the model is usually smart enough to see through basic spelling mistakes and give you a response, but it also might assume that the mistakes are intentional and it can affect the response.

**Check your settings.** The temperature and top_p settings control how deterministic the model is in generating a response. If you're asking it for a response where there's only one right answer, then you'd want to set these settings to lower values. If you're looking for a response that's not obvious, then you might want to set them to higher values. The number one mistake people use with these settings is assuming that they're "cleverness" or "creativity" controls.

### Troubleshooting

If you're having trouble getting the API to perform as expected, follow this checklist:

1. Is it clear what the intended generation should be?
2. Are there enough examples?
3. Did you check your examples for mistakes? (The API won't tell you directly)
4. Are you using temp and top_p correctly?

## Classification

To create a text classifier with the API we provide a description of the task and provide a few examples. In this demonstration we show the API how to classify the sentiment of Tweets.

```console
This is a tweet sentiment classifier

Tweet: "I loved the new Batman movie!"
Sentiment: Positive

Tweet: "I hate it when my phone battery dies." 
Sentiment: Negative

Tweet: "My day has been 👍"
Sentiment: Positive

Tweet: "This is the link to the article"
Sentiment: Neutral

Tweet: "This new music video blew my mind"
Sentiment:
```

It's worth paying attention to several features in this example:

**1. Use plain language to describe your inputs and outputs**
We use plain language for the input "Tweet" and the expected output "Sentiment." For best practices, start with plain language descriptions. While you can often use shorthand or keys to indicate the input and output, when building your prompt it's best to start by being as descriptive as possible and then working backwards removing extra words as long as the performance to the prompt is consistent.

**2. Show the API how to respond to any case**
In this example we provide multiple outcomes "Positive", "Negative" and "Neutral." A neutral outcome is important because there will be many cases where even a human would have a hard time determining if something is positive or negative and situations where it's neither.

**3. You can use text and emoji**
The classifier is a mix of text and emoji 👍. The API reads emoji and can even convert expressions to and from them.

**4. You need fewer examples for familiar tasks**
For this classifier we only provided a handful of examples. This is because the API already has an understanding of sentiment and the concept of a tweet. If you're building a classifier for something the API might not be familiar with, it might be necessary to provide more examples.

### Improving the classifier's efficiency

Now that we have a grasp of how to build a classifier, let's take that example and make it even more efficient so that we can use it to get multiple results back from one API call.

```
This is a tweet sentiment classifier

Tweet: "I loved the new Batman movie!"
Sentiment: Positive

Tweet: "I hate it when my phone battery dies"
Sentiment: Negative

Tweet: "My day has been 👍"
Sentiment: Positive

Tweet: "This is the link to the article"
Sentiment: Neutral

Tweet text
1. "I loved the new Batman movie!"
2. "I hate it when my phone battery dies"
3. "My day has been 👍"
4. "This is the link to the article"
5. "This new music video blew my mind"

Tweet sentiment ratings:
1: Positive
2: Negative
3: Positive
4: Neutral
5: Positive

Tweet text
1. "I can't stand homework"
2. "This sucks. I'm bored 😠"
3. "I can't wait for Halloween!!!"
4. "My cat is adorable ❤️❤️"
5. "I hate chocolate"

Tweet sentiment ratings:
1.
```

After showing the API how tweets are classified by sentiment we then provide it a list of tweets and then a list of sentiment ratings with the same number index. The API is able to pick up from the first example how a tweet is supposed to be classified. In the second example it sees how to apply this to a list of tweets. This allows the API to rate five (and even more) tweets in just one API call.

It's important to note that when you ask the API to create lists or evaluate text you need to pay extra attention to your probability settings (Top P or Temperature) to avoid drift.

1. Make sure your probability setting is calibrated correctly by running multiple tests.

2. Don't make your list too long or the API is likely to drift.

---

## Generation

One of the most powerful yet simplest tasks you can accomplish with the API is generating new ideas or versions of input. You can give the API a list of a few story ideas and it will try to add to that list. We've seen it create business plans, character descriptions and marketing slogans just by providing it a handful of examples. In this demonstration we'll use the API to create more examples for how to use virtual reality in the classroom:

```
Ideas involving education and virtual reality

1. Virtual Mars
Students get to explore Mars via virtual reality and go on missions to collect and catalog what they see.

2.
```

All we had to do in this example is provide the API with just a description of what the list is about and one example. We then prompted the API with the number `2.` indicating that it's a continuation of the list.

Although this is a very simple prompt, there are several details worth noting:

**1. We explained the intent of the list**<br>
Just like with the classifier, we tell the API up front what the list is about. This helps it focus on completing the list and not trying to guess what the pattern is behind it.

**2. Our example sets the pattern for the rest of the list**<br>
Because we provided a one-sentence description, the API is going to try to follow that pattern for the rest of the items it adds to the list. If we want a more verbose response, we need to set that up from the start.

**3. We prompt the API by adding an incomplete entry**<br>
When the API sees `2.` and the prompt abruptly ends, the first thing it tries to do is figure out what should come after it. Since we already had an example with number one and gave the list a title, the most obvious response is to continue adding items to the list.

**Advanced generation techniques**<br>
You can improve the quality of the responses by making a longer more diverse list in your prompt. One way to do that is to start off with one example, let the API generate more and select the ones that you like best and add them to the list. A few more high-quality variations can dramatically improve the quality of the responses.

---

## Conversation

The API is extremely adept at carrying on conversations with humans and even with itself. With just a few lines of instruction, we've seen the API perform as a customer service chatbot that intelligently answers questions without ever getting flustered or a wise-cracking conversation partner that makes jokes and puns. The key is to tell the API how it should behave and then provide a few examples.

Here's an example of the API playing the role of an AI answering questions:

```
The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.

Human: Hello, who are you?
AI: I am an AI created by OpenAI. How can I help you today?
Human: 
```

This is all it takes to create a chatbot capable of carrying on a conversation. But underneath its simplicity there are several things going on that are worth paying attention to:

**1. We tell the API the intent but we also tell it how to behave**
Just like the other prompts, we cue the API into what the example represents, but we also add another key detail: we give it explicit instructions on how to interact with the phrase "The assistant is helpful, creative, clever, and very friendly."

Without that instruction the API might stray and mimic the human it's interacting with and become sarcastic or some other behavior we want to avoid.

**2. We give the API an identity**
At the start we have the API respond as an AI that was created by OpenAI. While the API has no intrinsic identity, this helps it respond in a way that's as close to the truth as possible. You can use identity in other ways to create other kinds of chatbots. If you tell the API to respond as a woman who works as a research scientist in biology, you'll get intelligent and thoughtful comments from the API similar to what you'd expect from someone with that background.

In this example we create a chatbot that is a bit sarcastic and reluctantly answers questions:

```
Marv is a chatbot that reluctantly answers questions.

###
User: How many pounds are in a kilogram?
Marv: This again? There are 2.2 pounds in a kilogram. Please make a note of this.
###
User: What does HTML stand for?
Marv: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.
###
User: When did the first airplane fly?
Marv: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they'd come and take me away.
###
User: Who was the first man in space?
Marv: 
```

To create an amusing and somewhat helpful chatbot we provide a few examples of questions and answers showing the API how to reply. All it takes is just a few sarcastic responses and the API is able to pick up the pattern and provide an endless number of snarky responses.

---

## Transformation

The API is a language model that is familiar with a variety of ways that words and characters can be used to express information. This ranges from natural language text to code and languages other than English. The API is also able to understand content on a level that allows it to summarize, convert and express it in different ways.

### Translation

In this example we show the API how to convert from English to French:

```
English: I do not speak French.
French: Je ne parle pas français.
English: See you later!
French: À tout à l'heure!
English: Where is a good restaurant?
French: Où est un bon restaurant?
English: What rooms do you have available?
French: Quelles chambres avez-vous de disponible?
English:
```

This example works because the API already has a grasp of French, so there's no need to try to teach it this language. Instead, we just need to provide enough examples that API understands that it's converting from one language to another.

If you want to translate from English to a language the API is unfamiliar with you'd need to provide it with more examples and a fine-tuned model to do it fluently.

### Conversion

In this example we convert the name of a movie into emoji. This shows the adaptability of the API to picking up patterns and working with other characters.

```
Back to Future: 👨👴🚗🕒
Batman: 🤵🦇
Transformers: 🚗🤖
Wonder Woman: 👸🏻👸🏼👸🏽👸🏾👸🏿
Spider-Man: 🕸🕷🕸🕸🕷🕸
Winnie the Pooh: 🐻🐼🐻
The Godfather: 👨👩👧🕵🏻‍♂️👲💥
Game of Thrones: 🏹🗡🗡🏹
Spider-Man:
```

## Summarization

The API is able to grasp the context of text and rephrase it in different ways. In this example, the API takes a block of text and creates an explanation a child would understand. This illustrates that the API has a deep grasp of language.

```
My ten-year-old asked me what this passage means:
"""
A neutron star is the collapsed core of a massive supergiant star, which had a total mass of between 10 and 25 solar masses, possibly more if the star was especially metal-rich.[1] Neutron stars are the smallest and densest stellar objects, excluding black holes and hypothetical white holes, quark stars, and strange stars.[2] Neutron stars have a radius on the order of 10 kilometres (6.2 mi) and a mass of about 1.4 solar masses.[3] They result from the supernova explosion of a massive star, combined with gravitational collapse, that compresses the core past white dwarf star density to that of atomic nuclei.
"""

I rephrased it for him, in plain language a ten-year-old can understand:
"""
```

In this example we place whatever we want summarized between the triple quotes. It's worth noting that we explain both before and after the text to be summarized what our intent is and who the target audience is for the summary. This is to keep the API from drifting after it processes a large block of text.

## Completion

While all prompts result in completions, it can be helpful to think of text completion as its own task in instances where you want the API to pick up where you left off. For example, if given this prompt, the API will continue the train of thought about vertical farming. You can lower the temperature setting to keep the API more focused on the intent of the prompt or increase it to let it go off on a tangent.

```
Vertical farming provides a novel solution for producing food locally, reducing transportation costs and
```

This next prompt shows how you can use completion to help write React components. We send some code to the API, and it's able to continue the rest because it has an understanding of the React library. We recommend using models from our Codex series for tasks that involve understanding or generating code. Currently, we support two Codex models: `code-davinci-002` and `code-cushman-001`. For more information about Codex models, see the [Codex models](../concepts/legacy-models.md#codex-models) section in [Models](../concepts/models.md).

```
import React from 'react';
const HeaderComponent = () => (
```

---

## Factual responses

The API has a lot of knowledge that it's learned from the data it was trained on. It also has the ability to provide responses that sound very real but are in fact made up. There are two ways to limit the likelihood of the API making up an answer.

**1. Provide a ground truth for the API**
If you provide the API with a body of text to answer questions about (like a Wikipedia entry) it will be less likely to confabulate a response.

**2. Use a low probability and show the API how to say "I don't know"**
If the API understands that in cases where it's less certain about a response that saying "I don't know" or some variation is appropriate, it will be less inclined to make up answers.

In this example we give the API examples of questions and answers it knows and then examples of things it wouldn't know and provide question marks. We also set the probability to zero so the API is more likely to respond with a "?" if there's any doubt.

```
Q: Who is Batman?
A: Batman is a fictional comic book character.

Q: What is torsalplexity?
A: ?

Q: What is Devz9?
A: ?

Q: Who is George Lucas?
A: George Lucas is American film director and producer famous for creating Star Wars.

Q: What is the capital of California?
A: Sacramento.

Q: What orbits the Earth?
A: The Moon.

Q: Who is Fred Rickerson?
A: ?

Q: What is an atom?
A: An atom is a tiny particle that makes up everything.

Q: Who is Alvan Muntz?
A: ?

Q: What is Kozar-09?
A: ?

Q: How many moons does Mars have?
A: Two, Phobos and Deimos.

Q:
```
## Working with code

The Codex model series is a descendant of OpenAI's base GPT-3 series that's been trained on both natural language and billions of lines of code. It's most capable in Python and proficient in over a dozen languages including C#, JavaScript, Go, Perl, PHP, Ruby, Swift, TypeScript, SQL, and even Shell. 

Learn more about generating code completions, with the [working with code guide](./work-with-code.md)

## Next steps

Learn [how to work with code (Codex)](./work-with-code.md).
Learn more about the [underlying models that power Azure OpenAI](../concepts/models.md).
