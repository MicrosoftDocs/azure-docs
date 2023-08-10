---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 04/14/2023
ms.author: aahi
---

### Create a new resource from the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) to create a new Azure AI Language resource.

1. In the window that appears, select **Custom text classification & custom named entity recognition** from the custom features. Select **Continue to create your resource** at the bottom of the screen. 

    :::image type="content" source="../media/select-custom-feature-azure-portal.png" alt-text="A screenshot showing custom text classification & custom named entity recognition in the Azure portal." lightbox="../media/select-custom-feature-azure-portal.png":::

1. Create a Language resource with following details.

    |Name  | Description  |
    |---------|---------|
    | Subscription | Your Azure subscription. |
    | Resource group | A resource group that will contain your resource. You can use an existing one, or create a new one. |
    |Region | The region for your Language resource. For example, "West US 2". |
    | Name | A name for your resource. |
    |Pricing tier     | The pricing tier for your Language resource. You can use the Free (F0) tier to try the service.       |

    > [!NOTE]
    > If you get a message saying "*your login account is not an owner of the selected storage account's resource group*", your account needs to have an owner role assigned on the resource group before you can create a Language resource. Contact your Azure subscription owner for assistance.

1. In the **Custom text classification & custom named entity recognition** section, select an existing storage account or select **New storage account**. These values are to help you get started, and not necessarily the [storage account values](../../../../storage/common/storage-account-overview.md) you’ll want to use in production environments. To avoid latency during building your project connect to storage accounts in the same region as your Language resource.

    |Storage account value  |Recommended value  |
    |---------|---------|
    | Storage account name | Any name |
    | Storage account type | Standard LRS |

1. Make sure the **Responsible AI Notice** is checked. Select **Review + create** at the bottom of the page, then select **Create**.
