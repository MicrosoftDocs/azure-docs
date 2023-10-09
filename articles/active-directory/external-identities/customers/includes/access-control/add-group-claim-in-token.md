---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 07/12/2023
ms.author: kengaderdus
---
To emit the group membership claims in security tokens, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a Conditional Access Administrator, Security Administrator, or Global Administrator. 
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="../../media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to your customer tenant. 
1. Browse to **Identity** > **Applications** > **App registrations**.
1. Select the application in which you want to add the groups claim.
1. Under **Manage**, select **Token configuration**.
1. Select **Add groups claim**.
1. Select group types to include in the security tokens.
1. For the **Customize token properties by type**, select **Group ID**.
1. Select **Add** to add the groups claim.