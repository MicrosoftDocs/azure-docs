---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 05/09/2022
ms.author: aahi
ms.custom: language-service-custom-classification, event-tier1-build-2022
---

### Create a new resource from the Azure portal

1. Go to the [Azure portal](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) to create a new Azure Language resource. 

2. Click on **Create a new resource**

3. In the window that appears, search for **Language service**  

4. Click **Create** 

5. In the window that appears, select **Custom text classification & custom named entity recognition** from the custom features. Click **Continue to create your resource**. 

    :::image type="content" source="../media/select-custom-feature-azure-portal.png" alt-text="A screenshot showing the selection option for custom text classification and custom named entity recognition in Azure portal." lightbox="../media/select-custom-feature-azure-portal.png":::


6. Create a Language resource with following details.

    |Instance detail  |Required value  |
    |---------|---------|
    |Location | Learn more about [supported regions](../service-limits.md#regional-availability).      |
    |Pricing tier     | Learn more about [supported pricing tiers](../service-limits.md#pricing-tiers).        |

7. In the **Custom text classification & custom named entity recognition** section, select an existing storage account or select **Create a new storage account**. Note that these values are to help you get started, and not necessarily the [storage account values](../../../../storage/common/storage-account-overview.md) you’ll want to use in production environments. To avoid latency during building your project connect to storage accounts in the same region as your Language resource.

    |Storage account value  |Recommended value  |
    |---------|---------|
    | Name | Any name |
    | Account kind| Storage (general purpose v1) |
    | Performance | Standard |
    | Replication | Locally redundant storage (LRS) |