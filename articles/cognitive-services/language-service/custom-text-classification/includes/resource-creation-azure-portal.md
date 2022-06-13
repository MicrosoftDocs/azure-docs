---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 06/02/2022
ms.author: aahi
ms.custom: language-service-custom-classification, event-tier1-build-2022
---

### Create a new resource from the Azure portal

1. Go to the [Azure portal](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) to create a new Azure Language resource. 

1. In the window that appears, select **Custom text classification & custom named entity recognition (preview)** from the custom features. Click **Continue to create your resource** at the bottom of the screen. 

    :::image type="content" source="../media/select-custom-feature-azure-portal.png" alt-text="A screenshot showing the selection option for custom text classification and custom named entity recognition in Azure portal." lightbox="../media/select-custom-feature-azure-portal.png":::


1. Create a Language resource with following details.

    |Instance detail  |Required value  |
    |---------|---------|
    |Region | One of the [supported regions](../service-limits.md#regional-availability). You can use "West US 2" for this quickstart.      |
    |Pricing tier     | One of the [supported pricing tiers](../service-limits.md#pricing-tiers). You can use the Free (F0) tier for this quickstart.       |

1. In the **Custom text classification & custom named entity recognition** section, select an existing storage account or select **New storage account**. Note that these values are to help you get started, and not necessarily the [storage account values](../../../../storage/common/storage-account-overview.md) you’ll want to use in production environments. To avoid latency during building your project connect to storage accounts in the same region as your Language resource.

    |Storage account value  |Recommended value  |
    |---------|---------|
    | Name | Any name |
    | Account kind| Storage (general purpose v1) |
    | Performance | Standard |
    | Replication | Locally redundant storage (LRS) |

1. Make sure the **Responsible AI Notice** is checked. Select **Review + create** at the bottom of the page, then select.