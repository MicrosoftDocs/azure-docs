---
title: Analyzer naming structure - Linguistic Analysis API
titlesuffix: Azure Cognitive Services
description: Learn how the Linguistic Analysis API Analyzer naming structure allows for both flexibility and precision.
services: cognitive-services
author: RichardSunMS
manager: cgronlun
ms.service: cognitive-services
ms.component: linguistic-analysis
ms.topic: conceptual
ms.date: 03/23/2016
ms.author: lesun
ROBOTS: NOINDEX
---

# Analyzer Names

> [!IMPORTANT]
> The Linguistic Analysis preview was decommissioned on August 9, 2018. We recommend using [Azure Machine Learning text analytics modules](https://docs.microsoft.com/azure/machine-learning/studio-module-reference/text-analytics) for text processing and analysis.

We use a somewhat complicated naming structure for analyzers to allow both flexibility on analyzers and precision in understanding what a name means.
Analyzer names consist of four parts: an ID, a Kind, a Specification, and an Implementation.
The role of each component is defined below.

## ID
First, an analyzer has a unique ID; a GUID.
These GUIDs should change relatively rarely, but are the only way to uniquely describe a particular analyzer.

## Kind
Next, each analyzer is a **kind**.
This defines in very broad terms the type of analysis returned, and should uniquely define the data structure used to represent that analysis.
Currently, there are three distinct kinds:
 - [Tokens](Sentences-and-Tokens.md)
 - [POS Tags](Pos-Tagging.md)
 - [Constituency Tree](constituency-parsing.md)

## Specification
Within a given kind, however, different experts might disagree on how a particular phenomenon should be analyzed.
Unlike programming languages, there's no clear and exact definition of how this should be done.

For instance, imagine we were trying to find the tokens in the English sentence "He didn't go."
In particular, consider the string "didn't".
One possible interpretation is that this should be split into two tokens: "did" and "not".
Then the alternative sentence "He did not go" would have the same set of tokens.
Another possibility is to say that it should be split into the tokens "did" and "n't".
The latter token would not normally be considered a word, but this approach retains more information about the surface string, which can sometimes be useful.
Or perhaps that contraction should be considered a single word.

Regardless which choice is made, that choice should be made consistently.
This is precisely the role of a **specification**: to decide what a correct representation should be.

Analyzer outputs can only be fairly compared to data that conforms to the same specification.

## Implementation

Often there are multiple models that attempt to achieve the same results, but with different performance characteristics.
One model might be faster though less accurate; another might make a different trade-off.

The **implementation** portion of an analyzer name is used to identify this type of information, so that users can pick the most appropriate analyzer for their needs.
