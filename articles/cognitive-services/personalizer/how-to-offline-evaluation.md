---
title: Offline evaluation - Personalizer
titleSuffix: Azure Cognitive Services
description: Learn how to analyze your learning loop with an offline evaluation
services: cognitive-services
author: edjez
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: conceptual
ms.date: 05/07/2019
ms.author: edjez
---

# How to analyze your learning loop with an offline evaluation


Learn how to complete an offline evaluation and understand the results.

Offline Evaluations allow you to measure how effective Personalizer is compared to your application's default behavior, learn what features are contributing most to personalization, and discover new machine learning settings automatically.

Read about [Offline Evaluations](concepts-offline-evaluation.md) to learn more.


## Prerequisites

1. You must have a Personalizer loop configured
1. The Personalizer loop must have at least 50,000 events in its logs for meaningful evaluation results.

Optionally, you may also have previously exported _learning policy_ files you can compare and test in the same evaluation.

## Steps to Start a New Offline Evaluation

1. Locate your Personalization Loop resource in the Azure portal.
1. Navigate to the "Evaluation" section.
1. Click on New Evaluation
1. Select a start and end date for the offline evaluation. These are dates in the past, that specify the range of data to use in the evaluation. This data must be present in the logs, as specified in the [Data Retention](how-to-settings.md) setting.
1. Optionally, you can upload your own learning policy. 
1. Specify whether Personalizer should create an optimized Learning Policy based on the user behavior observed in this time period.
1. Start the Evaluation

## Results

Evaluations can take a long time to run, depending on the amount of data to process, number of learning policies to compare, and whether an optimization was requested.

Once completed, you can see the following results:

1. Comparisons of Learning Policies, including:
    * **Online Policy**: The current Learning Policy used in Personalizer
    * **Baseline**: The application's default (as determined by the first Action sent in Rank calls),
    * **Random Policy**: An imaginary Rank behavior that always returns random choice of Actions from the supplied ones.
    * **Custom Policies**: Additional Learning Policies uploaded when starting the evaluation.
    * **Optimized Policy**: If the evaluation was started with the option to discover an optimized policy, it will also be compared, and you will be able to download it or make it the online learning policy, replacing the current one.

1. Effectiveness of [Features](concepts-features.md) for Actions and Context.


## More Information

* Learn [how offline evaluations work](concepts-offline-evaluation.md).