---
title: Auto-optimize - Personalizer
description: This article provides a conceptual overview of the auto-optimize feature for Azure AI Personalizer service.
author: jcodella
ms.author: jacodel
ms.manager: nitinme
ms.service: azure-ai-personalizer
ms.topic: conceptual
ms.date: 03/08/2021
---

# Personalizer Auto-Optimize (Preview)

[!INCLUDE [Deprecation announcement](includes/deprecation.md)]

## Introduction
Personalizer automatic optimization saves you manual effort in keeping a Personalizer loop at its best machine learning performance, by automatically searching for improved Learning Settings used to train your models and applying them. Personalizer has strict criteria to apply new Learning Settings to insure improvements are unlikely to introduce loss in rewards.

Personalizer Auto-Optimize is in Public Preview and features, approaches and processes will change based on user feedback.

## When to use Auto-Optimize
In most cases, the best option is to have Auto-Optimize turned on. Auto-Optimize is *on* for default for new Personalizer loops.

Auto-optimize may help in the following situations:
* You build applications that are used by many tenants, and each gets their own Personalizer loop(s); for example, if you host multiple e-commerce sites. Auto-Optimize allows you to avoid the manual effort you'd need to tune learning settings for large numbers of Personalizer loops.
* You have deployed Personalizer and validated that it is working well, getting good rewards, and you have made sure there are no bugs or problems in your features.

> [!NOTE]
> Auto-Optimize will periodically overwrite Personalizer Learning Settings. If your use case or industry requires audit and archive of models and settings, or if you need backups of previous settings, you can use the Personalizer API to retrieve Learning Settings, or download them via the Azure portal.

## How to enable and disable Auto-Optimize
To Enable Auto-Optimize, use the toggle switch in the "Model and Learning Settings" blade in the Azure portal. 

Alternatively, you can activate Auto-Optimize using the Personalizer `/configurations/service` API.

To disable Auto-Optimize, turn off the toggle.

## Auto-Optimize reports

In the Model and Learning Settings blade you can see the history of auto-optimize runs and the action taken on each. 

The table shows:
* When an auto-optimize run happened,
* What data window was included,
* What was the reward performance of online, baseline, and best found Learning Settings,
* Actions taken: if Learning Settings were updated or not.

Reward performance of different learning settings in each auto-optimization history row are shown in absolute numbers, and as percentages relative to baseline performance. 

**Example**: If your baseline average reward is estimated to be 0.20, and the online Personalizer behavior is achieving 0.30, these will be shown as 100% and 150% respectively. If the auto optimization found learning settings capable of achieving 0.40 average reward, it will be shown as 200% (0.40 is 200% of 0.20). Assuming the confidence margins allow for it, the new settings would be applied, and then these would drive Personalizer as the Online settings until the next run.

A history of up to 24 previous Auto-Optimize runs is kept for your analysis. You can seek out more details about those Offline Evaluations and reports for each. Also, the reports contain any Learning Settings that are in this history, which you can find and download or apply.

## How it works
Personalizer is constantly training the AI models it uses based on rewards. This training is done following some *Learning Settings*, which contain hyper-parameters and other values used in the training process. These learning settings can be "tuned" to your specific Personalizer instance. 

Personalizer also has the ability to perform *Offline Evaluations*. Offline Evaluations look at past data, and can produce a statistical estimation of the average reward that Personalizer different algorithms and models could have attained. During this process Personalizer will also search for better Learning Settings, estimating their performance (how many rewards they would have gotten) over that past time period.

#### Auto-Optimize frequency
Auto-Optimize will run periodically, and will perform the Auto-Optimize based on past data
* If your application sends to Personalizer more than approximately 20 Mb of data in the last two weeks, it will use the last two weeks of data.
* If your application sends less than this amount, Personalizer will add data from previous days until there is enough data to optimize, or it reaches the earliest data stored (up to the Data Retention number of days).

The exact times and days when Auto-Optimize runs is determined by the Personalizer service, and will fluctuate over time.

#### Criteria for updating learning settings

Personalizer uses these reward estimations to decide whether to change the current Learning Settings for others. Each estimation is a distribution curve, with upper and lower 95% confidence bounds. Personalizer will only apply new Learning Settings if:
  * They showed higher average rewards in the evaluation period, AND
  * They have a lower bound of the 95% confidence interval, that is *higher* than the lower bound of the 95% confidence interval of the online Learning Settings.
This criteria to maximize the reward improvement, while trying to eliminate the probability of future rewards lost is managed by Personalizer and draws from research in [Seldonian algorithms](https://aisafety.cs.umass.edu/overview.html) and AI safety.

#### Limitations of Auto-Optimize

Personalizer Auto-Optimize relies on an evaluation of a past period to estimate performance in the future. It is possible that due to external factors in the world, your application, and your users, that these estimations and predictions about Personalizer's models done for the past period are not representative of the future.

Automatic Optimization Preview is unavailable for Personalizer loops that have enabled the Multi-Slot personalization API Preview functionality. 

## Next steps

* [Offline evaluations](concepts-offline-evaluation.md)
* [Learning Policy and Settings](concept-active-learning.md)
* [How To Analyze Personalizer with an Offline Evaluation](how-to-offline-evaluation.md) 
* [Research in AI Safety](https://aisafety.cs.umass.edu/overview.html) 
