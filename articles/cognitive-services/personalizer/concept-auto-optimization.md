---
title: Auto-optimize - Personalizer
description: This article provides a conceptual overview of the auto-optimize feature for Azure Personalizer service.
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: conceptual
ms.date: 03/08/2021
---

# Personalizer Auto-Optimize (Preview)


## Introduction
Auto-Optimize is a setting in Personalizer that saves manual effort in keeping a Personalizer loop at it's best performance, by automatically searching for improved Learning Settings used to train your models and applying them. Personalizer has strict criteria to apply new Learning Settings to insure improvements are unlikely to introduce loss in rewards.

Personalizer Auto-Optimize is in Public Preview and features, approaches and processes will change based on user feedback.

## When to Use Auto-Optimize
In most cases, the best option is to have Auto-Optimize turned on. Auto-Optimize is *on* for default for new Personalizer loops.

Auto-optimize may help in the following situations:
1. You build applications that are used by many tenants, and each gets their own Personalizer loop(s); for example, if you host multiple e-commerce sites. Auto-Optimize allows you to avoid the manual effort you'd need to tune learning settings for large numbers of Personalizer loops.
1. You have deployed Personalizer and validated that it is working well, getting good rewards, and you have made sure there are no bugs or problems in your features.

Note: Auto-Optimize will periodically overwrite Personalizer Learning Settings. If your use case or industry requires audit and archive of models and settings, or if you need backups of previous settings, you can use the Personalizer API to retrieve Learning Settings, or download them via the Azure Portal.

## How to Enable and Disable Auto-Optimize
To Enable Auto-Optimize, use the toggle switch in the "Model and Learning Settings" blade in the Azure Portal. 

Alternatively, you can activate Auto-Optimize using the Personalizer API.

To disable Auto-Optimize, turn off the toggle.

## Auto-Optimize Reports

In the Model and Learning Settings blade you can see the history of auto-optimize runs and the action taken on each. 
Here you can see
* When an auto-optimize run happened,
* What data window was included,
* What was the reward performance of online, baseline, and best found Learning Settings,
* Actions taken: if Learning Settings were updated or not.

A history of previous Auto-Optimize runs is kept for your analysis. You can seek out more details about those Offline Evaluations and reports for each. Also, this allows you find an apply any Learning Settings that is in this history.

## How it Works
Personalizer is constantly training the AI models it uses based on rewards. This training is done following some *Learning Settings*, which contain hyper-parameters and other values used in the training process. These learning settings can be "tuned" to your specific Personalizer instance. 

Personalizer also has the ability to perform *Offline Evaluations*. Offline Evaluations look at past data, and can produce a statistical estimation of the average reward that Personalizer different algorithms and models could have attained. During this process Personalizer will also search for better Learning Settings, estimating their performance (how many rewards they would have gotten) over that past time period.

#### Auto-Optimize Frequency
Auto-Optimize will run periodically, and will perform the Auto-Optimize based on past data
* If your application sends to Personalizer more than approximately 20Mb of data in the last 2 weeks, it will use the last 2 weeks of data.
* If your application sends less than this amount, Personalizer will add data from previous days until there is enough data to do the optimize, or it reaches the earliest data stored (up to the Data Retention number of days).

The exact times and days in which Auto-Optimize is run is determined by the Personalizer service, and will fluctuate over time.

#### Criteria for Updating Learning Settings

Personalizer uses these reward estimations to decide whether to change the current Learning Settings for others. Each estimation is a distribution curve, with upper and lower 95% confidence bounds. Personalizer will only apply new Learning Settings if:
  1. They showed higher average rewards in the evaluation period, AND
  1. They have a lower bound of the 95% confidence interval, that is *higher* than the lower bound of the 95% confidence interval of the online Learning Settings.
This criteria to maximize the reward improvement, while trying to eliminate the probability of future rewards lost is managed by Personalizer and draws from research in [Seldonian algorithms](https://aisafety.cs.umass.edu/overview.html) and AI safety.

#### Limitations of Auto-Optimize

Personalizer Auto-Optimize relies on an analysis of a past period to estimate performance in the future. It is possible that due to external factors in the world, your application, and your users, that these estimations and predictions about Personalizer's models are not representative of the future. The next Auto-Optimize pass will probably correct these deviations.

## Read More

* [Offline evaluations](https://docs.microsoft.com/azure/cognitive-services/personalizer/concepts-offline-evaluation)
* [Learning Policy and Settings](https://docs.microsoft.com/azure/cognitive-services/personalizer/concept-active-learning)
* [How To Analyze Personalizer with an Offline Evaluation](https://docs.microsoft.com/azure/cognitive-services/personalizer/how-to-offline-evaluation) 
* [Research in AI Safety](https://aisafety.cs.umass.edu/overview.html) 
