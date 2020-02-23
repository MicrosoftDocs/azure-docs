---
title: Manage learning policy - Personalizer
description: This article contains answers to frequently asked troubleshooting questions about Personalizer.
ms.topic: conceptual
ms.date: 01/08/2019
---

# Manage learning policy

Learning policy settings determine the _hyperparameters_ of the model training. The learning policy is defined in a `.json` file.

## Import a new learning policy

1. Open the [Azure portal](https://portal.azure.com), and select your Personalizer resource.
1. Select **Model and learning settings** in the **Resource Management** section.
1. For the **Import learning settings** select the file you created with the JSON format specified above, then select the **Upload** button.

    Wait for the notification that the learning policy was uploaded successfully.

## Export a learning policy

1. Open the [Azure portal](https://portal.azure.com), and select your Personalizer resource.
1. Select **Model and learning settings** in the **Resource Management** section.
1. For the **Import learning settings** select the **Export learning settings** button. This saves the `json` file to your local computer.

## Next steps

Learn about learning policy [concepts](concept-active-learning.md#learning-settings)

[Learn about region availability](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services)