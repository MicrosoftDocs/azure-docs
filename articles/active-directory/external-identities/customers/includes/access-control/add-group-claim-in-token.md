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
1. Make sure you're using the directory that contains your Azure AD customer tenant: Select the **Directories + subscriptions** icon :::image type="icon" source="../../media/common/portal-directory-subscription-filter.png" border="false"::: for switching directories in the toolbar, and then find your customer tenant in the list. If it's not the current directory, select **Switch**.
1. In the left menu, under **Applications**, select **App registrations**, and then select the application in which you want to add the groups claim.
1. Under **Manage**, select **Token configuration**.
2. Select **Add groups claim**.
3. Select **group types** to include in the security tokens.
4. For the **Customize token properties by type**, select **Group ID**.
5. Select **Add** to add the groups claim.