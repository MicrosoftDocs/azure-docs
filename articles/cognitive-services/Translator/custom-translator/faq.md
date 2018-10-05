---
title: Custom Translator Faq
titlesuffix: Azure Cognitive Services
description: Custom Translator Faq
author: rajdeep-in
manager: christw
ms.service: cognitive-services
ms.component: custom-translator
ms.date: 10/15/2018
ms.author: v-rada
ms.topic: overview
Customer intent: As a custom translator user, I want to review frequently asked questions, so that my questions are clarified.
---

# Frequently asked questions

### What are the current restrictions in Custom Translator?

-   Trainings - A user can have a maximum of four concurrent trainings in a
    workspace.

-   Deployments – A user can have a maximum of four concurrent deployments in a workspace.

-   Submitted files must be less than 100 MB in size.

-   Monolingual data is not supported.

### When should I request deployment for a translation system that has been trained?

It may take several trainings to create the optimal translation system for your project. You may want to try using more training data or more carefully filtered data. You should
be strict and careful in designing your tuning set and your test set, to be
fully representative of the terminology and style of material you want to
translate. You can be more liberal in composing your training data, and
experiment with different options. Request a system deployment when you are
satisfied with the training results, have no more data to add to the training to
improve your trained system, want to access the trained model via APIs.

### How many trained systems can be deployed in a project?

Only one trained system can be deployed per project. It may take several
trainings to create a suitable translation system for your project and we
encourage you to request deployment of a training that gives you the best
result. You can determine the quality of the training by the BLEU score (higher
is better), and by consulting with reviewers before deciding that the quality of
translations is suitable for deployment.

### When can I expect my trainings to be deployed?

The deployment generally takes less than an hour.

### How do you access a deployed system?

Deployed systems can be accessed via the Microsoft Translator Text API V3 by
specifying the CategoryID. More information about the Translator Text API can
be found in the [API
Reference](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/reference/v3-0-reference)
webpage.

### How can I ensure skipping the alignment and sentence breaking step in Custom Translator, if my data is already sentence aligned?

The Custom Translator skips sentence alignment and sentence breaking for TMX
files and for text files with the “.align” extension. “.align” files give users
an option to Custom Translator’s sentence breaking and alignment process for the
files that are perfectly aligned, and need no further processing. We recommend
using “.align” extension only for files that are perfectly aligned.

If the number of extracted sentences does not match the two files with the same
base name, Custom Translator will still run the sentence aligner on “.align”
files.

### I tried uploading my TMX, but it says "document processing failed"!

Ensure that the TMX conforms to the TMX 1.4b Specification at
<https://www.gala-global.org/tmx-14b>.
