---
author: PatrickFarley
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 06/12/2019
ms.author: pafarley
---

Go to the Azure portal and <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer" title="Create a new Form Recognizer resource" target="_blank">create a new Form Recognizer resource <span class="docon docon-navigate-external x-hidden-focus"></span></a>. In the **Create** pane, provide the following information:

|    |    |
|--|--|
| **Name** | A descriptive name for your resource. We recommend using a descriptive name, for example *MyNameFormRecognizer*. |
| **Subscription** | Select the Azure subscription which has been granted access. |
| **Location** | The location of your cognitive service instance. Different locations may introduce latency, but have no impact on the runtime availability of your resource. |
| **Pricing tier** | The cost of your resource depends on the pricing tier you choose and your usage. For more information, see the API [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/).
| **Resource group** | The [Azure resource group](https://docs.microsoft.com/azure/cloud-adoption-framework/govern/resource-consistency/resource-access-management#what-is-an-azure-resource-group) that will contain your resource. You can create a new group or add it to a pre-existing group. |

> [!NOTE]
> Normally when you create a Cognitive Service resource in the Azure portal, you have the option to create a multi-service subscription key (used across multiple cognitive services) or a single-service subscription key (used only with a specific cognitive service). However, because Form Recognizer is a preview release, it is not included in the multi-service subscription, and you cannot create the single-service subscription unless you use the link provided in the Welcome email.

When your Form Recognizer resource finishes deploying, find and select it from the **All resources** list in the portal. Your key and endpoint will be located on the resource's key and endpoint page, under resource management. Save both of these to a temporary location before going forward.
