---
author: laujan
ms.service: azure-ai-document-intelligence
ms.topic: include
ms.date: 11/15/2023
ms.author: lajanuar
ms.custom: ignite-fall-2021
---

Go to the Azure portal and <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer" title="Create a new Document Intelligence resource" target="_blank">create a new Document Intelligence resource </a>. In the **Create** pane, provide the following information:

| Project details   | Description   |
|--|--|
| **Subscription** | Select the Azure subscription which has been granted access. |
| **Resource group** | The Azure resource group that contains your resource. You can create a new group or add it to a pre-existing group. |
| **Region** | The location of your Azure AI services resource. Different locations may introduce latency, but have no impact on the runtime availability of your resource. |
| **Name** | A descriptive name for your resource. We recommend using a descriptive name, for example *MyNameFormRecognizer*. |
| **Pricing tier** | The cost of your resource depends on the pricing tier you choose and your usage. For more information, see the API [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/).|
|**Review + create** | Select the Review + create button to deploy your resource on the Azure portal. |

## Retrieve the key and endpoint

When your Document Intelligence resource finishes deploying, find and select it from the **All resources** list in the portal. Your key and endpoint will be located on the resource's **Key and Endpoint** page, under **Resource Management**. Save both of these to a temporary location before going forward.
