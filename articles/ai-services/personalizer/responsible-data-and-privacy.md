---
title: Data and privacy for Personalizer
titleSuffix: Azure AI services
description: Data and privacy for Personalizer
author: jcodella
ms.author: jacodel
manager: nitinme
ms.service: azure-ai-personalizer
ms.date: 05/23/2022
ms.topic: conceptual
---

# Data and privacy for Personalizer

This article provides information about what data Azure AI Personalizer uses to work, how it processes that data, and how you can control that data. It assumes basic familiarity with [what Personalizer is](what-is-personalizer.md) and [how Personalizer works](how-personalizer-works.md). Specific terms can be found in Terminology.


## What data does Personalizer process?

Personalizer processes the following types of data:
- **Context features and Action features**: Your application sends information about users, and the products or content to personalize, in aggregated form. This data is sent to Personalizer in each Rank API call in arguments for Context and Actions. You decide what to send to the API and how to aggregate it. The data is expressed as attributes or features. You provide information about your users, such as their device and their environment, as Context features. You shouldn't send features specific to a user like a phone number or email or User IDs. Action features include information about your content and product, such as movie genre or product price. For more information, see [Features for Actions and Context](concepts-features.md).
- **Reward information**: A reward score (a number between 0 and 1) ranks how well the user interaction resulting from the personalization choice mapped to a business goal. For example, an event might get a reward of "1" if a recommended article was clicked on. For more information, see [Rewards](concept-rewards.md).

To understand more about what information you typically use with Personalizer, see [Features are information about Actions and Context](concepts-features.md).

[!TIP] You decide which features to use, how to aggregate them, and where the information comes from when you call the Personalizer Rank API in your application. You also determine how to create reward scores.

## How does Personalizer process data?

The following diagram illustrates how your data is processed.

![Diagram that shows how Personalizer processes data.](media/how-personalizer-works/personalization-how-it-works.png)

Personalizer processes data as follows:

1. Personalizer receives data each time the application calls the Rank API for a personalization event. The data is sent via the arguments for the Context and Actions. 

2. Personalizer uses the information in the Context and Actions, its internal AI models, and service configuration to return the rank response for the ID of the action to use. The contents of the Context and Actions are stored for no more than 48 hours in transient caches with the EventID used or generated in the Rank API.
3. The application then calls the Reward API with one or more reward scores. This information is also stored in transient caches and matched with the Actions and Context information.
4. After the rank and reward information for events is correlated, it's removed from transient caches and placed in more permanent storage. It remains in permanent storage until the number of days specified in the Data Retention setting has gone by, at which time the information is deleted. If you choose not to specify a number of days in the Data Retention setting, this data will be saved as long as the Personalizer Azure Resource is not deleted or until you choose to Clear Data via the UI or APIs. You can change the Data Retention setting at any time.
5. Personalizer continuously trains internal Personalizer AI models specific to this Personalizer loop by using the data in the permanent storage and machine learning configuration parameters in [Learning settings](concept-active-learning.md).
6. Personalizer creates [offline evaluations either](concepts-offline-evaluation.md) automatically or on demand.
Offline evaluations contain a report of rewards obtained by Personalizer models during a past time period. An offline evaluation embeds the models active at the time of their creation, and the learning settings used to create them, as well as a historical aggregate of average reward per event for that time window. Evaluations also include [feature importance](how-to-feature-evaluation.md), which is a list of features observed in the time period, and their relative importance in the model.


### Independence of Personalizer loops

Each Personalizer loop is separate and independent from others, as follows:

- **No external data augmentation**: Each Personalizer loop only uses the data supplied to it by you via Rank and Reward API calls to train models. Personalizer doesn't use any additional information from any origin, such as other Personalizer loops in your own Azure subscription, Microsoft, third-party sources or subprocessors.
- **No data, model, or information sharing**: A Personalizer loop won't share information about events, features, and models with any other Personalizer loop in your subscription, Microsoft, third parties or subprocessors.


## How is data retained and what customer controls are available?

Personalizer retains different types of data in different ways and provides the following controls for each.


### Personalizer rank and reward data

Personalizer stores the features about Actions and Context sent via rank and reward calls for the number of days specified in configuration under Data Retention.
To control this data retention, you can:

1. Specify the number of days to retain log storage in the [Azure portal for the Personalizer resource](how-to-settings.md)under **Configuration** > **Data Retention** or via the API. The default **Data Retention** setting is seven days. Personalizer deletes all Rank and Reward data older than this number of days automatically. 

2. Clear data for logged personalization and reward data in the Azure portal under **Model and learning settings** > **Clear data** > **Logged personalization and reward data** or via the API. 

3. Delete the Personalizer loop from your subscription in the Azure portal or via Azure resource management APIs.

You can't access past data from Rank and Reward API calls in the Personalizer resource directly. If you want to see all the data that's being saved, configure log mirroring to create a copy of this data on an Azure Blob Storage resource you've created and are responsible for managing.


### Personalizer transient cache

Personalizer stores partial data about an event separate from rank and reward calls in transient caches. Events are automatically purged from the transient cache 48 hours from the time the event occurred.

To delete transient data, you can:

1. Clear data for logged personalization and reward data in the Azure portal under **Model and learning settings** > **Clear data** or via the API. 

2. Delete the Personalizer loop from your subscription in the Azure portal or via Azure resource management APIs.


### Personalizer models and learning settings 

A Personalizer loop trains models with data from Rank and Reward API calls, driven by the hyperparameters and configuration specified in **Model and learning settings** in the Azure portal. Models are volatile. They're constantly changing and being trained on additional data in near real time. Personalizer doesn't automatically save older models and keeps overwriting them with the latest models. For more information, see ([How to manage models and learning settings](how-to-manage-model.md)). To clear models and learning settings:

1. Reset them in the Azure portal under **Model and learning settings** > **Clear data** or via the API. 

2. Delete the Personalizer loop from your subscription in the Azure portal or via Azure resource management APIs.


### Personalizer evaluation reports

Personalizer also retains the information generated in [offline evaluations](concepts-offline-evaluation.md) for reports.

To delete offline evaluation reports, you can:

1. Go to the Personalizer loop under the Azure portal. Go to **Evaluations** and delete the relevant evaluation. 

2. Delete evaluations via the Evaluations API. 

3. Delete the Personalizer loop from your subscription in the Azure portal or via Azure resource management APIs.


### Further storage considerations 

- **Customer managed keys**: Customers can configure the service to encrypt data at rest with their own managed keys. This second layer of encryption is on top of Microsoft's own encryption.
- **Geography**: In all cases, the incoming data, models, and evaluations are processed and stored in the same geography where the Personalizer resource was created.

Also see:

- [How to manage model and learning settings](how-to-manage-model.md)
- [Configure Personalizer learning loop](how-to-settings.md)


## Next steps

- [See Responsible use guidelines for Personalizer](responsible-use-cases.md).

To learn more about Microsoft's privacy and security commitments, see the [Microsoft Trust Center](https://www.microsoft.com/trust-center).
