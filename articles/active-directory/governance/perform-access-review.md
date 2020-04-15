---
title: Review access to groups & applications in access reviews - Azure AD
description: Learn how to review access of group members or application access in Azure Active Directory access reviews.
services: active-directory
author: barclayn
manager: daveba
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 04/15/2020
ms.author: barclayn
ms.reviewer: mwahl
ms.collection: M365-identity-device-management
---

# Review access to groups and applications in Azure AD access reviews

Azure Active Directory (Azure AD) simplifies how enterprises manage access to groups and applications in Azure AD and other Microsoft Online Services with a feature called Azure AD access reviews. We will go over how a designated reviewer performs an access review for members of a group or users with access to an application.

## Perform access review

You can start the Access Review process from the notification email or by going directly to the site.

- **Email**:

    1. Look for an email from Microsoft asking you to review access. Here is an example email to review the access for a group.

        ![Example email from Microsoft to review access to a group](./media/perform-access-review/access-review-email.png)

    1. Click the **Start review** link to open the access review.

- **If you don't have the email**, you can find your pending access reviews by following these steps.

    1. Sign in to the MyApps portal at [https://myapps.microsoft.com](https://myapps.microsoft.com).

        ![MyApps portal listing apps you have permissions to](./media/perform-access-review/myapps-access-panel.png)

    1. In the upper-right corner of the page, click the user next to your name and default organization. If more than one organization is listed, select the organization that requested an access review.

    1. Click the **Access reviews** tile to see a list of pending access reviews.

        > [!NOTE]
        > If the **Access reviews** tile isn't visible, there are no access reviews to perform for that organization and no action is needed at this time.

        ![Pending access reviews list for apps and groups](./media/perform-access-review/access-reviews-list.png)

    1. Click the **Begin review** link for the access review you want to perform.

Once you have opened the access review, you see the names of users who need to have their access reviewed.

If the request is to review your own access, the page will look different. For more information, see [Review access for yourself to groups or applications](review-your-access.md).

![Open access review listing the users to review](./media/perform-access-review/perform-access-review.png)

There are two ways that you can approve or deny access:

- You can approve or deny access for one or more users 'manually' by choosing the appropriate action for each user request.
- You can accept the system recommendations.

### Approve or deny access for one or more users

1. Review the list of users and decide whether to approve or deny their continued access.

    - To approve or deny access for a single user, click the row to open a window to specify the action to take. 
    - To approve or deny access for multiple users, add check marks next to the users and then click the **Review X user(s)** button to open a window to specify the action to take.

1. Click **Approve** or **Deny**. 

    ![Action window that includes Approve, Deny, and Don't know options](./media/perform-access-review/approve-deny.png)
    >[!NOTE]
    > If you are unsure, you can click **Don't know**. and the user gets to keep their access and your choice is recorded in the audit logs.

1. The administrator of the access review may require that you supply a reason in the **Reason** box for your decision. Even when a reason is not required. You can still provide a reason for your decision and the information that you include will be available to other reviewers.

1. Once you have specified the action to take, click **Save**.

    >[!NOTE]
    > You can change your response at any time until the access review has ended. If you want to change your response, select the row and update the response. For example, you can approve a previously denied user or deny a previously approved user.
    >[!IMPORTANT]
    > - If a user is denied access, they aren't removed immediately. They are removed when the review period has ended or when an administrator stops the review. 
    > - If there are multiple reviewers, the last submitted response is recorded. Consider an example where an administrator designates two reviewers – Alice and Bob. Alice opens the access review first and approves a user's access request. Before the review period ends, Bob opens the access review and denies access on the same request previously approved by Alice. The last decision denying the access is the response that gets recorded.

### Approve or deny access based on recommendations 

To make access reviews easier and faster for you, we also provide recommendations that you can accept with a single click. The recommendations are generated based on the user's sign-in activity.

1. In the blue bar at the bottom of the page, click **Accept recommendations**.

    ![Open access review listing showing the Accept recommendations button](./media/perform-access-review/accept-recommendations.png)

    You see a summary of the recommended actions.

    ![Window that displays a summary of the recommended actions](./media/perform-access-review/accept-recommendations-summary.png)

1. Click **Ok** to accept the recommendations.

## Perform access review using My Access (Preview)

During the preview you can get to the My Access experience three different ways:

- Sign in to the MyApps portal at [https://myapps.microsoft.com](https://myapps.microsoft.com).

    ![MyApps portal listing apps you have permissions to](./media/perform-access-review/myapps-access-panel.png)

    In the upper-right corner of the page, click the user next to your name and default organization. If more than one organization is listed, select the organization that requested an access review.

    1. Click the **Access reviews** tile to see a list of pending access reviews.

        > [!NOTE]
        > If the **Access reviews** tile isn't visible, there are no access reviews to perform for that organization and no action is needed at this time.

        ![Pending access reviews list for apps and groups with the new experience available banner displayed during the preview](./media/perform-access-review/banner.png)

    1. Click on **Try it!**
  
- **Email**:

    1. Look for an email from Microsoft asking you to review access. You can see an example email message below:

        ![Example email from Microsoft to review access to a group](./media/perform-access-review/access-review-email.png)

    1. Click the **Start review** link to open the access review.

- **If you don't have the email**, you can find your pending access reviews by following these steps.

   1. Sign  in to the MyAccess portal at ht<span>tps://<span>myacces<span>s.m<span>icrosof<span>t.<span>com/@**Castelia<span>.<span>onmicrosoft<span>.<span>com**?enableReviews=true#/access-reviews

  >[!IMPORTANT]
  >Replace `Castelia.onmicrosoft.com` with your domain URL between the **@** and **?**.

   ![MyAccess portal showing access reviews](./media/perform-access-review/myaccess-portal.png)

   2. Select **Access reviews** from the menu on the left side of the screen. 

    ![access reviews in the menu](./media/perform-access-review/access-reviews-menu.png)

   3. Click on the name of an Access review to get started.
 
   ![Pending access reviews list for apps and groups](./media/perform-access-review/access-reviews-list-preview.png)

Once you have opened the access review, you see the names of users who need to have their access reviewed.

If the request is to review your own access, the page will look different. For more information, see [Review access for yourself to groups or applications](review-your-access.md).

![Open access review listing the users who need review](./media/perform-access-review/user-list-preview.png)

There are two ways that you can approve or deny access:

- You can approve or deny access for one or more users 'manually' by choosing the appropriate action for each user request.
- You can accept the system recommendations.

### Approve or deny access for one or more users (Preview)

1. Review the list of users and decide whether to approve or deny their continued access.

    - To approve or deny access for a single user, click the row to open a window to specify the action to take. 
    - To approve or deny access for multiple users, add check marks next to the users and then click the **Review X user(s)** button to open a window to specify the action to take.

1. Click **Approve** or **Deny**. 

    ![Action window that includes Approve, Deny, and Don't know options](./media/perform-access-review/user-detail-preview.png)
    >[!NOTE]
    > If you are unsure, you can click **Don't know**. and the user gets to keep their access and your choice is recorded in the audit logs.

1. The administrator of the access review may require that you supply a reason in the **Reason** box for your decision. Even when a reason is not required. You can still provide a reason for your decision and the information that you include will be available to other reviewers.

1. Once you have specified the action to take, click **Save**.

    >[!NOTE]
    > You can change your response at any time until the access review has ended. If you want to change your response, select the row and update the response. For example, you can approve a previously denied user or deny a previously approved user.


    >[!IMPORTANT]
    > - If a user is denied access, they aren't removed immediately. They are removed when the review period has ended or when an administrator stops the review. 
    > - If there are multiple reviewers, the last submitted response is recorded. Consider an example where an administrator designates two reviewers – Alice and Bob. Alice opens the access review first and approves a user's access request. Before the review period ends, Bob opens the access review and denies access on the same request previously approved by Alice. The last decision denying the access is the response that gets recorded.

### Approve or deny access based on recommendations (Preview)

To make access reviews easier and faster for you, we also provide recommendations that you can accept with a single click. The recommendations are generated based on the user's sign-in activity.

1. Select one or more users and then choose **Accept recommendations** 

    ![Open access review listing showing the Accept recommendations button](./media/perform-access-review/accept-recommendations-preview.png)

1. Click **Submit** to accept the recommendations.


## Next steps

- [Complete an access review of groups or applications](complete-access-review.md)

