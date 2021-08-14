---
title: Create an access review of Azure resource roles in PIM - Azure AD | Microsoft Docs
description: Learn how to create an access review of Azure resource roles in Azure AD Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.subservice: pim
ms.date: 04/27/2021
ms.author: curtand
ms.custom: pim
ms.collection: M365-identity-device-management
---

# Create an access review of Azure resource roles in Privileged Identity Management

The need for access to privileged Azure resource roles by employees changes over time. To reduce the risk associated with stale role assignments, you should regularly review access. You can use Azure Active Directory (Azure AD) Privileged Identity Management (PIM) to create access reviews for privileged access to Azure resource roles. You can also configure recurring access reviews that occur automatically. This article describes how to create one or more access reviews.

## Prerequisite license

[!INCLUDE [Azure AD Premium P2 license](../../../includes/active-directory-p2-license.md)] For more information about licenses for PIM, refer to [License requirements to use Privileged Identity Management](subscription-requirements.md).

> [!Note]
> Currently, you can scope an access review to service principals with access to Azure AD and Azure resource roles (Preview) with an Azure Active Directory Premium P2 edition active in your tenant. The licensing model for service principals will be finalized for general availability of this feature and additional licenses may be required.

## Prerequisite role

 To create access reviews, you must be assigned to the [Owner](../../role-based-access-control/built-in-roles.md#owner) or [User Access Administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) Azure role for the resource.

## Open access reviews

1. Sign in to [Azure portal](https://portal.azure.com/) with a user that is assigned to one of the prerequisite roles.

1. Select **Identity Governance**

1. In the left menu, select **Azure resources** under **Azure AD Privileged Identity Management**.

1. Select the resource you want to manage, such as a subscription.

    ![Azure resources - Select a resource to create an access review](./media/pim-resource-roles-start-access-review/access-review-select-resource.png)

1. Under Manage, select **Access reviews**.

    ![Azure resources - Access reviews list showing the status of all reviews](./media/pim-resource-roles-start-access-review/access-reviews.png)

1. Click **New** to create a new access review.

1. Name the access review. Optionally, give the review a description. The name and description are shown to the reviewers.

    ![Create an access review - Review name and description](./media/pim-resource-roles-start-access-review/name-description.png)

1. Set the **Start date**. By default, an access review occurs once, starts the same time it's created, and it ends in one month. You can change the start and end dates to have an access review start in the future and last however many days you want.

    ![Start date, frequency, duration, end, number of times, and end date](./media/pim-resource-roles-start-access-review/start-end-dates.png)

1. To make the access review recurring, change the **Frequency** setting from **One time** to **Weekly**, **Monthly**, **Quarterly**, **Annually**, or **Semi-annually**. Use the **Duration** slider or text box to define how many days each review of the recurring series will be open for input from reviewers. For example, the maximum duration that you can set for a monthly review is 27 days, to avoid overlapping reviews.

1. Use the **End** setting to specify how to end the recurring access review series. The series can end in three ways: it runs continuously to start reviews indefinitely, until a specific date, or after a defined number of occurrences has been completed. You, another User administrator, or another Global administrator can stop the series after creation by changing the date in **Settings**, so that it ends on that date.

1. In the **Users** section,  select the scope of the review. To review users, select **Users or select (Preview) Service Principals** to review the machine accounts with access to the Azure role.

    When **Users** is selected, membership of groups assigned to the role will be expanded to the individual members of the group. When **Service Principals** is selected, only those with direct membership (not via nested groups) will be reviewed.  

    ![Users scope to review role membership of](./media/pim-resource-roles-start-access-review/users.png)


1. Under **Review role membership**, select the privileged Azure roles to review. 

    > [!NOTE]
    > Selecting more than one role will create multiple access reviews. For example, selecting five roles will create five separate access reviews.
    If you are creating an access review of **Azure AD roles**, the following shows an example of the Review membership list.

1. In **assignment type**, scope the review by how the principal was assigned to the role. Choose **(Preview) eligible assignments only** to review eligible assignments (regardless of activation status when the review is created) or **(Preview) active assignments only** to review active assignments. Choose **all active and eligible assignments** to review all assignments regardless of type.

    ![Reviewers list of assignment types](./media/pim-resource-roles-start-access-review/assignment-type-select.png)

1. In the **Reviewers** section, select one or more people to review all the users. Or you can select to have the members review their own access.

    ![Reviewers list of selected users or members (self)](./media/pim-resource-roles-start-access-review/reviewers.png)

    - **Selected users** - Use this option to designate a specific user to complete the review. This option is available regardless of the Scope of the review, and the selected reviewers can review users and service principals. 
    - **Members (self)** - Use this option to have the users review their own role assignments. This option is only available if the review is scoped to **Users**.
    - **Manager** – Use this option to have the user’s manager review their role assignment. This option is only available if the review is scoped to **Users**. Upon selecting Manager, you will also have the option to specify a fallback reviewer. Fallback reviewers are asked to review a user when the user has no manager specified in the directory. 

### Upon completion settings

1. To specify what happens after a review completes, expand the **Upon completion settings** section.

    ![Upon completion settings to auto apply and should review not respond](./media/pim-resource-roles-start-access-review/upon-completion-settings.png)

1. If you want to automatically remove access for users that were denied, set **Auto apply results to resource** to **Enable**. If you want to manually apply the results when the review completes, set the switch to **Disable**.

1. Use the **Should reviewer not respond** list to specify what happens for users that are not reviewed by the reviewer within the review period. This setting does not impact users who have been reviewed by the reviewers manually. If the final reviewer's decision is Deny, then the user's access will be removed.

    - **No change** - Leave user's access unchanged
    - **Remove access** - Remove user's access
    - **Approve access** - Approve user's access
    - **Take recommendations** - Take the system's recommendation on denying or approving the user's continued access

1. You can send notifications to additional users or groups (Preview) to receive review completion updates. This feature allows for stakeholders other than the review creator to be updated on the progress of the review. To use this feature, select **Select User(s) or Group(s)** and add an additional user or group upon you want to receive the status of completion.

    ![Upon completion settings - Add additional users to receive notifications](./media/pim-resource-roles-start-access-review/upon-completion-settings-additional-receivers.png) 

### Advanced settings

1. To specify additional settings, expand the **Advanced settings** section.

    ![Advanced settings for show recommendations, require reason on approval, mail notifications, and reminders](./media/pim-resource-roles-start-access-review/advanced-settings.png)

1. Set **Show recommendations** to **Enable** to show the reviewers the system recommendations based the user's access information.

1. Set **Require reason on approval** to **Enable** to require the reviewer to supply a reason for approval.

1. Set **Mail notifications** to **Enable** to have Azure AD send email notifications to reviewers when an access review starts, and to administrators when a review completes.

1. Set **Reminders** to **Enable** to have Azure AD send reminders of access reviews in progress to all reviewers. Reviewers will receive the reminders halfway through the duration of the review, regardless of whether they have completed their review at that time.
1. The content of the email sent to reviewers is autogenerated based on the review details, such as review name, resource name, due date, etc. If you need a way to communicate additional information such as additional instructions or contact information, you can specify these details in the **Additional content for reviewer email** which will be included in the invitation and reminder emails sent to assigned reviewers. The highlighted section below is where this information will be displayed.

    ![Content of the email sent to reviewers with highlights](./media/pim-resource-roles-start-access-review/email-info.png)

## Start the access review

Once you have specified the settings for an access review, click **Start**. The access review will appear in your list with an indicator of its status.

![Access reviews list showing the status of started review](./media/pim-resource-roles-start-access-review/access-reviews-list.png)

By default, Azure AD sends an email to reviewers shortly after the review starts. If you choose not to have Azure AD send the email, be sure to inform the reviewers that an access review is waiting for them to complete. You can show them the instructions for how to [review access to Azure resource roles](pim-resource-roles-perform-access-review.md).

## Manage the access review

You can track the progress as the reviewers complete their reviews on the **Overview** page of the access review. No access rights are changed in the directory until the [review is completed](pim-resource-roles-complete-access-review.md).

![Access reviews overview page showing the details of the review](./media/pim-resource-roles-start-access-review/access-review-overview.png)

If this is a one-time review, then after the access review period is over or the administrator stops the access review, follow the steps in [Complete an access review of Azure resource roles](pim-resource-roles-complete-access-review.md) to see and apply the results.  

To manage a series of access reviews, navigate to the access review, and you will find upcoming occurrences in Scheduled reviews, and edit the end date or add/remove reviewers accordingly.

Based on your selections in **Upon completion settings**, auto-apply will be executed after the review's end date or when you manually stop the review. The status of the review will change from **Completed** through intermediate states such as **Applying** and finally to state **Applied**. You should expect to see denied users, if any, being removed from roles in a few minutes.

## Next steps

- [Review access to Azure resource roles](pim-resource-roles-perform-access-review.md)
- [Complete an access review of Azure resource roles](pim-resource-roles-complete-access-review.md)
- [Create an access review of Azure AD roles](pim-how-to-start-security-review.md)
