---
title: Learning policy - Personalizer
description: Learning settings determine the *hyperparameters* of the model training. Two models of the same data that are trained on different learning settings will end up different.
author: jcodella
ms.author: jacodel
ms.manager: nitinme
ms.service: azure-ai-personalizer
ms.topic: conceptual
ms.date: 02/20/2020
---

# Learning policy and settings

[!INCLUDE [Deprecation announcement](includes/deprecation.md)]

Learning settings determine the *hyperparameters* of the model training. Two models of the same data that are trained on different learning settings will end up different.

[Learning policy and settings](how-to-settings.md#configure-rewards-for-the-feedback-loop) are set on your Personalizer resource in the Azure portal.

## Import and export learning policies

You can import and export learning-policy files from the Azure portal. Use this method to save existing policies, test them, replace them, and archive them in your source code control as artifacts for future reference and audit.

Learn [how to](how-to-manage-model.md#import-a-new-learning-policy) import and export a learning policy in the Azure portal for your Personalizer resource.

## Understand learning policy settings

The settings in the learning policy aren't intended to be changed. Change settings only if you understand how they affect Personalizer. Without this knowledge, you could cause problems, including invalidating Personalizer models.

Personalizer uses [vowpalwabbit](https://github.com/VowpalWabbit) to train and score the events. Refer to the [vowpalwabbit documentation](https://vowpalwabbit.org/docs/vowpal_wabbit/python/9.6.0/command_line_args.html) on how to edit the learning settings using vowpalwabbit. Once you have the correct command line arguments, save the command to a file with the following format (replace the arguments property value with the desired command) and upload the file to import learning settings in the **Model and Learning Settings** pane in the Azure portal for your Personalizer resource.

The following `.json` is an example of a learning policy.

```json
{
  "name": "new learning settings",
  "arguments": " --cb_explore_adf --epsilon 0.2 --power_t 0 -l 0.001 --cb_type mtr -q ::"
}
```

## Compare learning policies

You can compare how different learning policies perform against past data in Personalizer logs by doing [offline evaluations](concepts-offline-evaluation.md).

[Upload your own learning policies](how-to-manage-model.md) to compare them with the current learning policy.

## Optimize learning policies

Personalizer can create an optimized learning policy in an [offline evaluation](how-to-offline-evaluation.md). An optimized learning policy that has better rewards in an offline evaluation will yield better results when it's used online in Personalizer.

After you optimize a learning policy, you can apply it directly to Personalizer so it immediately replaces the current policy. Or you can save the optimized policy for further evaluation and later decide whether to discard, save, or apply it.

## Next steps

* Learn [active and inactive events](concept-active-inactive-events.md).
