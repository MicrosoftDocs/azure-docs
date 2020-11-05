---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 11/04/2020
ms.author: inhenkel
ms.custom: portal
---

<!-- Use the portal to create a media services account. -->

## Create a Media Services account

1. Sign in at the [Azure portal](https://portal.azure.com/).
1. Click **+Create a resource** > **Media** > **Media Services**.
1. In the **Create a Media Services account** section enter required values.

    | Name | Description |
    | ---|---|
    |**Account Name**|Enter the name of the new Media Services account. A Media Services account name is all lowercase letters or numbers with no spaces, and is 3 to 24 characters in length.|
    |**Subscription**|If you have more than one subscription, select one from the list of Azure subscriptions that you have access to.|
    |**Resource Group**|Select the new or existing resource. A resource group is a collection of resources that share lifecycle, permissions, and policies. Learn more [here](../../azure-resource-manager/management/overview.md#resource-groups).|
    |**Location**|Select the geographic region that will be used to store the media and metadata records for your Media Services account. This  region will be used to process and stream your media. Only the available Media Services regions appear in the drop-down list box. |
    |**Storage Account**|Select a storage account to provide blob storage of the media content from your Media Services account. You can select an existing storage account in the same geographic region as your Media Services account, or you can create a new storage account. A new storage account is created in the same region. The rules for storage account names are the same as for Media Services accounts.<br/><br/>You must have one **Primary** storage account and you can have any number of **Secondary** storage accounts associated with your Media Services account. You can use the Azure portal to add secondary storage accounts. For more information, see [Azure Storage accounts with Azure Media Services accounts](storage-account-concept.md).<br/><br/>The Media Services account and all associated storage accounts must be in the same Azure subscription. It is strongly recommended to use storage accounts in the same location as the Media Services account to avoid additional latency and data egress costs.|
    |**Advanced settings**| You can create an account using a system-managed identity by selecting the **System-managed** radio button.  Making this selection will allow you to use [managed identities](concept-managed-identities.md) with Media Services to enable trusted storage. Additionally, customer managed keys, or bring your own key (BYOK) will also be enabled by making this choice.  For more information about customer managed keys, see [Bring your own key (customer-managed keys) with Media Services](concept-use-customer-managed-keys-byok.md).

1. Select **Pin to dashboard** to see the progress of the account deployment.
1. Click **Create** at the bottom of the form.
