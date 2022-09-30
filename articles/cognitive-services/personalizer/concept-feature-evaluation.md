---
title: Feature evaluation - Personalizer
titleSuffix: Azure Cognitive Services
description: When you run an Evaluation in your Personalizer resource from the Azure portal, Personalizer provides information about what features of context and actions are influencing the model. 
author: jcodella
ms.author: jacodel
ms.manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: conceptual
ms.date: 07/29/2019
---

# Feature evaluation

When you run an Evaluation in your Personalizer resource from the [Azure portal](https://portal.azure.com), Personalizer provides information about what features of context and actions are influencing the model. 

This is useful in order to:

* Imagine additional features you could use, getting inspiration from what features are more important in the model.
* See what features aren't important, and potentially remove them or further analyze what may be affecting usage.
* Provide guidance to editorial or curation teams about new content or products worth bringing into the catalog.
* Troubleshoot common problems and mistakes that happen when sending features to Personalizer.

The more important features have stronger weights in the model. Because these features have stronger weight, they tend to be present when Personalizer obtains higher rewards.

## Getting feature importance evaluation

To see feature importance results, you must run an evaluation. The evaluation creates human-readable feature labels based on the feature names observed during the evaluation period.

The resulting information about feature importance represents the current Personalizer online model. The evaluation analyzes feature importance of the model saved at the end date of the evaluation period, after undergoing all the training done during the evaluation, with the current online learning policy. 

The feature importance results don't represent other policies and models tested or created during the evaluation.  The evaluation won't include features sent to Personalizer after the end of the evaluation period.

## How to interpret the feature importance evaluation

Personalizer evaluates features by creating "groups" of features that have similar importance. One group can be said to have overall stronger importance than others, but within the group, ordering of features is alphabetically.

Information about each Feature includes:

* Whether the feature comes from Context or Actions
* Feature Key and Value

For example, an ice cream shop ordering app may see `Context.Weather:Hot` as a very important feature.

Personalizer displays correlations of features that, when taken into account together, produce higher rewards.

For example, you may see `Context.Weather:Hot` *with* `Action.MenuItem:IceCream` as well as `Context.Weather:Cold` *with* `Action.MenuItem:WarmTea:`.

## Actions you can take based on feature evaluation

### Imagine additional features you could use

Get inspiration from the more important features in the model. For example, if you see "Context.MobileBattery:Low" in a video mobile app, you may think that connection type may also make customers choose to see one video clip over another, then add features about connectivity type and bandwidth into your app.

### See what features aren't important

Potentially remove unimportant features or further analyze what may affect usage. Features may rank low for many reasons. One could be that genuinely the feature doesn't affect user behavior. But it could also mean that the feature isn't apparent to the user. 

For example, a video site could see that "Action.VideoResolution=4k" is a low-importance feature, contradicting user research. The cause could be that the application doesn't even mention or show the video resolution, so users wouldn't change their behavior based on it.

### Provide guidance to editorial or curation teams

Provide guidance about new content or products worth bringing into the catalog. Personalizer is designed to be a tool that augments human insight and teams. One way it does this is by providing information to editorial groups on what is it about products, articles or content that drives behavior. For example, the video application scenario may show that there's an important feature called "Action.VideoEntities.Cat:true", prompting the editorial team to bring in more cat videos.

### Troubleshoot common problems and mistakes

Common problems and mistakes can be fixed by changing your application code so it won't send inappropriate or incorrectly formatted features to Personalizer. 

Common mistakes when sending features include the following:

* Sending personally identifiable information (PII). PII specific to one individual (such as name, phone number, credit card numbers, IP Addresses) shouldn't be used with Personalizer. If your application needs to track users, use a non-identifying UUID or some other UserID number. In most scenarios this is also problematic.
* With large numbers of users, it's unlikely that each user's interaction will weigh more than all the population's interaction, so sending user IDs (even if non-PII) will probably add more noise than value to the model.
* Sending date-time fields as precise timestamps instead of featurized time values. Having features such as Context.TimeStamp.Day=Monday or "Context.TimeStamp.Hour"="13" is more useful. There will be at most 7 or 24 feature values for each. But `"Context.TimeStamp":"1985-04-12T23:20:50.52Z"` is so precise that there will be no way to learn from it because it will never happen again.

## Next steps

Understand [scalability and performance](concepts-scalability-performance.md) with Personalizer.

