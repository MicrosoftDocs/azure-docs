---
author: PatrickFarley
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 06/12/2019
ms.author: pafarley
---

When you are granted access to use Form Recognizer, you'll receive a Welcome email with several links and resources. Use the "Azure portal" link in that message to open the Azure portal and create a Form Recognizer resource. In the **Create** pane, provide the following information:

|    |    |
|--|--|
| **Name** | A descriptive name for your resource. We recommend using a descriptive name, for example *MyNameFormRecognizer*. |
| **Subscription** | Select the Azure subscription which has been granted access. |
| **Location** | The location of your cognitive service instance. Different locations may introduce latency, but have no impact on the runtime availability of your resource. |
| **Pricing tier** | The cost of your resource depends on the pricing tier you choose and your usage. For more information, see the API [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/).
| **Resource group** | The [Azure resource group](https://docs.microsoft.com/azure/architecture/cloud-adoption/governance/resource-consistency/azure-resource-access#what-is-an-azure-resource-group) that will contain your resource. You can create a new group or add it to a pre-existing group. |

> [!IMPORTANT]
> Normally when you create a Cognitive Service resource in the Azure portal, you have the option to create a multi-service subscription key (used across multiple cognitive services) or a single-service subscription key (used only with a specific cognitive service). However, because Form Recognizer is a preview release, it is not included in the multi-service subscription, and you cannot create the single-service subscription unless you use the link provided in the Welcome email.

When your Form Recognizer resource finishes deploying, find and select it from the **All resources** list in the portal. Then select the **Keys** tab to view your subscription keys. Either key will give your app access to the resource. Copy the value of **KEY 1**. You will use it in the next section.