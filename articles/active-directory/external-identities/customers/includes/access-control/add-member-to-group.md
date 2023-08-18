---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 07/12/2023
ms.author: kengaderdus
---
Now that you've added app groups claim in your application, add users to the security groups. If you don't have security group, [create one](../../../../fundamentals/how-to-manage-groups.md#create-a-basic-group-and-add-members).

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a Conditional Access Administrator, Security Administrator, or Global Administrator.
1. Make sure you're using the directory that contains your Azure AD customer tenant: Select the **Directories + subscriptions** icon :::image type="icon" source="../../media/common/portal-directory-subscription-filter.png" border="false"::: for switching directories in the toolbar, and then find your customer tenant in the list. If it's not the current directory, select **Switch**.
1. In the left menu, select **Groups**, and then select **All groups**.
1. Select the group you want to manage.
1. Select  **Members**.
1. Select **+ Add members**.
1. Scroll through the list or enter a name in the search box. You can choose multiple names. When you're ready, choose **Select**.
1. The **Group Overview** page updates to show the number of members who are now added to the group.

