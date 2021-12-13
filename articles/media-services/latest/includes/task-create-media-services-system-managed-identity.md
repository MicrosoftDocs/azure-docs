---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 11/29/2021
ms.author: inhenkel
ms.custom: portal
---

<!-- Use the portal to create a media services account. -->

## Enable a Media Services system-assigned managed identity

When a Media Services account is created, a user-managed identity is either selected or created.  If you need to create a system-managed identity, take the following steps after you've created a Media Services account:

1. In the Azure portal, select the Media Services account to which you want to add a system-managed identity from the list of resources on your portal home screen. The account screen will appear.
1. From the left navigation menu, select **Identity**. The Identity screen for the account will appear.
1. Select the **System-assigned** tab.
1. Select the **Yes** radio button to enable the system-assigned identity.
1. Select **Save**.