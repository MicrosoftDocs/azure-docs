---
title: Part-of-Speech Tagging in the Linguistic Analysis API | Microsoft Docs
description: Learn how Part-of-Speech Tagging in Microsoft Cognitive Services identifies the category or part of speech of each word of text.
services: cognitive-services
author: RichardSunMS
manager: wkwok

ms.service: cognitive-services
ms.technology: linguistic-analysis-api
ms.topic: article
ms.date: 09/27/2016
ms.author: lesun
---

# Part-of-Speech Tagging

## Background and Motivation

Once a text has been separated into sentences and tokens, the next step of analysis is to identify the category or part-of-speech of each word.
These include categories like *noun* (generally representing people, places, things, ideas, etc.) and *verb* (generally representing actions, changes of state, etc.
For some words, the part-of-speech is unambiguous (for instance, *quagmire* is really only a noun), but for many others, it's hard to tell.
*Table* could be a place where you sit (or 2-D layout of numbers), but you can also "table a discussion".

## List of Part-of-Speech Tags

| Tag | Description | Example words |
|-----|-------------|---------------|
| $ | dollar | $ |
| \`\` | opening quotation mark | \` \`\` |
| '' | closing quotation mark | ' '' |
| ( | opening parenthesis | ( [ { |
| ) | closing parenthesis | ) ] } |
| , | comma | , |
| -- | dash | -- |
| . | sentence terminator | . ! ? |
| : | colon or ellipsis | : ; ... |
| CC | conjunction, coordinating | and but or yet|
| CD | numeral, cardinal | nine 20 1980 '96 |
| DT | determiner |a the an all both neither|
| EX | existential there | there |
| FW | foreign word | enfant terrible hoi polloi je ne sais quoi |
| IN | preposition or subordinating conjunction| in inside if upon whether |
| JJ | adjective or numeral, ordinal | ninth pretty execrable multimodal |
| JJR | adjective, comparative | better faster cheaper |
| JJS | adjective, superlative | best fastest cheapest | 
| LS | list item marker | (a) (b) 1 2 A B A. B. |
| MD | modal auxiliary | can may shall will could might should ought |
| NN | noun, common, singular or mass | potato money shoe |
| NNP | noun, proper, singular | Kennedy Roosevelt Chicago Weehauken |
| NNPS | noun, proper, plural | Springfields Bushes |
| NNS | noun, common, plural | pieces mice fields |
| PDT | pre-determiner | all both half many quite such sure this |
| POS | genitive marker | ' 's |
| PRP | pronoun, personal | she he it I we they you |
| PRP$ | pronoun, possessive | hers his its my our their your |
| RB | adverb | clinically only |
| RBR | adverb, comparative | further gloomier grander graver greater grimmer harder harsher healthier heavier higher however larger later leaner lengthier less-perfectly lesser lonelier longer louder lower more ... |
| RBS | adverb, superlative | best biggest bluntest earliest farthest first furthest hardest heartiest highest largest least less most nearest second tightest worst |
| RP | particle | on off up out about |
| SYM | symbol | % & |
| TO | "to" as preposition or infinitive marker | to |
| UH | interjection | uh hooray howdy hello |
| VB | verb, base form | give assign fly |
| VBD | verb, past tense | gave assigned flew |
| VBG | verb, present participle or gerund | giving assigning flying |
| VBN | verb, past participle | given assigned flown |
| VBP | verb, present tense, not 3rd person singular | give assign fly |
| VBZ | verb, present tense, 3rd person singular | gives assigns flies |
| WDT | WH-determiner | that what which |
| WP | WH-pronoun | who whom |
| WP$ | WH-pronoun, possessive | whose |
| WRB | Wh-adverb | how however whenever where |

## Specification

As for tokenization, we rely on the specification from the [Penn Treebank](https://www.cis.upenn.edu/~treebank/).
