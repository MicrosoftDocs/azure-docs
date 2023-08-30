---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 07/12/2023
ms.author: kengaderdus
---
Once you've added app roles in your application, administrator can assign users and groups to the roles. Assignment of users and groups to roles can be done through the admin center, or programmatically using [Microsoft Graph](/graph/api/user-post-approleassignments). When the users assigned to the various app roles sign in to the application, their tokens have their assigned roles in the `roles` claim.

To assign users and groups to application roles by using the Azure portal:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a Conditional Access Administrator, Security Administrator, or Global Administrator. 
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="../../media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to your customer tenant. 
1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. Select **All applications** to view a list of all your applications. If your application doesn't appear in the list, use the filters at the top of the **All applications** list to restrict the list, or scroll down the list to locate your application.
1. Select the application in which you want to assign users or security group to roles.
1. Under **Manage**, select **Users and groups**.
1. Select **Add user** to open the **Add Assignment** pane.
1. In the **Add Assignment** pane, select **Users and groups**. A list of users and security groups appears. You can select multiple users and groups in the list.
1. Once you've selected users and groups, choose **Select**.
1. In the **Add assignment** pane, choose **Select a role**. All the roles you defined for the application appear.
1. Select a role, and then choose **Select**.
1. Select **Assign** to finish the assignment of users and groups to the app.
1. Confirm that the users and groups you added appear in the **Users and groups** list.
