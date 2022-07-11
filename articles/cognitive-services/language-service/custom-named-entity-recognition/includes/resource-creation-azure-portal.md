---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 06/02/2022
ms.author: aahi
---

### Create a new resource from the Azure portal

1. Go to the [Azure portal](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) to create a new Azure Language resource. 

1. In the window that appears, select **Custom text classification & custom named entity recognition (preview)** from the custom features. Click **Continue to create your resource** at the bottom of the screen. 

    :::image type="content" source="../media/select-custom-feature-azure-portal.png" alt-text="A screenshot showing custom text classification & custom named entity recognition in the Azure portal." lightbox="../media/select-custom-feature-azure-portal.png":::

1. Create a Language resource with following details.

    |Instance detail  | Description  |
    |---------|---------|
    |Location | The [location](../service-limits.md#regional-availability) of your Language resource. You can use "West US 2" for this quickstart.   |
    |Pricing tier     | The [pricing tier](../service-limits.md#language-resource-limits) for your Language resource. You can use the Free (F0) tier for this quickstart.       |

1. In the **Custom text classification & custom named entity recognition** section, select an existing storage account or select **New storage account**. These values are to help you get started, and not necessarily the [storage account values](/azure/storage/common/storage-account-overview) you’ll want to use in production environments. To avoid latency during building your project connect to storage accounts in the same region as your Language resource.

    |Storage account value  |Recommended value  |
    |---------|---------|
    | Name | Any name |
    | Account kind| Storage (general purpose v1) |
    | Performance | Standard |
    | Replication | Locally redundant storage (LRS) |

1. Make sure the **Responsible AI Notice** is checked. Select **Review + create** at the bottom of the page, then select **Create**. 