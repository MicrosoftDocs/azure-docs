---
title: Configure Personalizer
description: Service configuration includes how the service treats rewards, how often the service explores, how often the model is retrained, and how much data is stored.
author: jcodella
ms.author: jacodel
ms.manager: nitinme
ms.service: azure-ai-personalizer
ms.topic: how-to
ms.date: 04/29/2020
---

# Configure Personalizer learning loop

[!INCLUDE [Deprecation announcement](includes/deprecation.md)]

Service configuration includes how the service treats rewards, how often the service explores, how often the model is retrained, and how much data is stored.

Configure the learning loop on the **Configuration** page, in the Azure portal for that Personalizer resource.

<a name="configure-service-settings-in-the-azure-portal"></a>
<a name="configure-reward-settings-for-the-feedback-loop-based-on-use-case"></a>

## Planning configuration changes

Because some configuration changes [reset your model](#settings-that-include-resetting-the-model), you should plan your configuration changes.

If you plan to use [Apprentice mode](concept-apprentice-mode.md), make sure to review your Personalizer configuration before switching to Apprentice mode.

<a name="clear-data-for-your-learning-loop"></a>

## Settings that include resetting the model

The following actions trigger a retraining of the model using data available upto the last 2 days.

* Reward
* Exploration

To [clear](how-to-manage-model.md) all your data, use the **Model and learning settings** page.

## Configure rewards for the feedback loop

Configure the service for your learning loop's use of rewards. Changes to the following values will reset the current Personalizer model and retrain it with the last 2 days of data.

> [!div class="mx-imgBorder"]
> ![Configure the reward values for the feedback loop](media/settings/configure-model-reward-settings.png)

|Value|Purpose|
|--|--|
|Reward wait time|​Sets the length of time during which Personalizer will collect reward values for a Rank call, starting from the moment the Rank call happens. This value is set by asking: "How long should Personalizer wait for rewards calls?" Any reward arriving after this window will be logged but not used for learning.|
|Default reward|If no reward call is received by Personalizer during the Reward Wait Time window associated to a Rank call, Personalizer will assign the Default Reward. By default, and in most scenarios, the Default Reward is zero (0).|
|Reward aggregation|If multiple rewards are received for the same Rank API call, this aggregation method is used: **sum** or **earliest**. Earliest picks the earliest score received and discards the rest. This is useful if you want a unique reward among possibly duplicate calls. |

After changing these values, make sure to select **Save**.

## Configure exploration to allow the learning loop to adapt

Personalization is able to discover new patterns and adapt to user behavior changes over time by exploring alternatives instead of using the trained model's prediction. The **Exploration** value determines what percentage of Rank calls are answered with exploration.

Changes to this value will reset the current Personalizer model and retrain it with the last 2 days of data.

![The exploration value determines what percentage of Rank calls are answered with exploration](media/settings/configure-exploration-setting.png)

After changing this value, make sure to select **Save**.

<a name="model-update-frequency"></a>

## Configure model update frequency for model training

The **Model update frequency** sets how often the model is trained.

|Frequency setting|Purpose|
|--|--|
|1 minute|One-minute update frequencies are useful when **debugging** an application's code using Personalizer, doing demos, or interactively testing machine learning aspects.|
|15 minutes|High model update frequencies are useful for situations where you want to **closely track changes** in user behaviors. Examples include sites that run on live news, viral content, or live product bidding. You could use a 15-minute frequency in these scenarios. |
|1 hour|For most use cases, a lower update frequency is effective.|

![Model update frequency sets how often a new Personalizer model is retrained.](media/settings/configure-model-update-frequency-settings-15-minutes.png)

After changing this value, make sure to select **Save**.

## Data retention

**Data retention period** sets how many days Personalizer keeps data logs. Past data logs are required to perform [offline evaluations](concepts-offline-evaluation.md), which are used to measure the effectiveness of Personalizer and optimize Learning Policy.

After changing this value, make sure to select **Save**.



## Next steps

[Learn how to manage your model](how-to-manage-model.md)
