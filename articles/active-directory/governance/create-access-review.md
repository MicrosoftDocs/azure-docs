---
title: Create an access review of groups & applications - Azure AD
description: Learn how to create an access review of group members or application access in Azure Active Directory access reviews. 
services: active-directory
author: ajburnle
manager: daveba
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 08/20/2021
ms.author: ajburnle
ms.reviewer: mwahl
ms.collection: M365-identity-device-management
---
 
# Create an access review of groups and applications in Azure AD access reviews
 
Access to groups and applications for employees and guests changes over time. To reduce the risk associated with stale access assignments, administrators can use Azure Active Directory (Azure AD) to create access reviews for group members or application access. Microsoft 365 and Security group owners can also use Azure AD to create access reviews for group members as long as the Global or User Administrator enables the setting via Access Reviews Settings blade (preview). For more information about these scenarios, see [Manage Access Reviews](manage-access-reviews.md) 
 
You can watch a quick video talking about enabling Access Reviews:
 
>[!VIDEO https://www.youtube.com/embed/X1SL2uubx9M]
 
This article describes how to create one or more access reviews for group members or application access.
 
## Prerequisites
 
- Azure AD Premium P2
- Global administrator, User administrator or Identity Governance administrator
- (Preview) Microsoft 365 and Security group owner
 
For more information, see [License requirements](access-reviews-overview.md#license-requirements).
 
## Create one or more access reviews
 
1. Sign in to the Azure portal and open the [Identity Governance page](https://portal.azure.com/#blade/Microsoft_AAD_ERM/DashboardBlade/).
 
2. In the left menu, click **Access reviews**.
 
3. Click **New access review** to create a new access review.
 
    ![Access reviews pane in Identity Governance](./media/create-access-review/access-reviews.png)
 
4. In **Step 1: Select what to review** select which resource you would like to review.
 
    ![Create an access review - Review name and description](./media/create-access-review/select-what-review.png)
 
5. If you selected **Teams + Groups** in Step 1, you have two options in Step 2
   - **All Microsoft 365 groups with guest users.** Select this option if you would like to create recurring reviews on all your guest users across all your Microsoft Teams and Microsoft 365 groups in your organization. You can choose to exclude certain groups by clicking on ‘Select group(s) to exclude’.
   - **Select teams + groups.** Select this option if you would like to specify a finite set of teams and/or groups to review. After clicking on this option, you will see a list of groups to the right to pick from.
 
     ![Teams and groups](./media/create-access-review/teams-groups.png)
 
 
6. If you selected **Applications** in Step 1, you can then select one or more applications in Step 2
 
    >[!NOTE]
    > Selecting multiple groups and/or applications will result in multiple access reviews created. For example, if you select 5 groups to review, that will result in 5 separate access reviews
 
   ![The interface displayed if you chose applications rather than groups](./media/create-access-review/select-application-detailed.png)
 
7. Next, in Step 3 you can select a scope for the review. Your options are
   - **Guest users only.** Selecting this option limits the access review to just the Azure AD B2B guest users in your directory.
   - **Everyone.** Selecting this option scopes the access review to all user objects associated with the resource.
 
    >[!NOTE]
    > If you selected All Microsoft 365 groups with guest users in Step 2, then your only option is to review Guest users in Step 3
 
8. Click on **Next: Reviews**.
 
9. In the **Select reviewers** section, select either one or more people to perform the access reviews. You can choose from:
    - **Group owner(s)** (Only available when performing a review on a Team or group)
    - **Selected user(s) or groups(s)**
    - **Users review own access**
    - **Managers of users.**
    If you choose either **Managers of users** or **Group owners**  you also have the option to specify a fallback reviewer. Fallback reviewers are asked to do a review when the user has no manager specified in the directory or the group does not have an owner.
 
    ![new access review](./media/create-access-review/new-access-review.png)
 
10. In the **Specify recurrence of review** section, you must specify four different selections:
- **Duration** - How long a review will be open for input from reviewers. 
- **Review recurrence** - How often a review occurs such as **One Time, Weekly, Monthly, Quarterly, Semi-annually, Annually**.
- **Start date** - When the series of reviews begins.
-  **End date** - When the series of reviews ends. You can specify that it **Never** ends, **End on a specific date**, or **End after number of occurrences**.

 
    ![Choose how often the review should happen](./media/create-access-review/frequency.png)
 
11. Click the **Next: Settings** button at the bottom of the page.
 
12. In the **Upon completion settings** you can specify what happens after the review completes
 
    ![Create an access review - upon completion settings](./media/create-access-review/upon-completion-settings-new.png)
 
     If you want to access to be removed automatically once the review duration ends, set **Auto apply results to resource** to Enable. If disabled, you will have to manually apply the results when the review completes. See [Manage access reviews](manage-access-review.md) to learn more about applying the results of the review.
    
     Use **If reviewers don't respond** to specify what happens for users not reviewed by any reviewer within the review period. This setting does not impact users who have been reviewed by a reviewer.
 
    - **No change** - Leave user's access unchanged
    - **Remove access** - Remove user's access
    - **Approve access** - Approve user's access
    - **Take recommendations** - Take the system's recommendation on denying or approving the user's continued access
 
     Use the **Action to apply on denied guest users**, a choice only available if the access review is scoped to only include guest users, to specify what happens to guest users if they are denied either by a reviewer or by the **If reviewers don't respond** setting.
    - **Remove user’s membership from the resource** will remove a denied guest user’s access to the group or application being reviewed. They will still be able to sign-in to the tenant and will not lose any other access.
    - **Block user from signing-in for 30 days, then remove user from the tenant** will block a denied guest user from signing in to the tenant, regardless if they have access to other resources. If this action was taken in error, admins can re-enable the guest user's access within 30 days after the guest user has been disabled. If there is no action taken on the disabled guest user after 30 days, they will be deleted from the tenant.
 
    To learn more about best practices for removing guest users who no longer have access to resources in your organization, see [Use Azure AD Identity Governance to review and remove external users who no longer have resource access.](access-reviews-external-users.md)
 
    > [!NOTE]
    > Action to apply on denied guest users isn't configurable on reviews scoped to more than guest users. It's also not configurable for reviews of **All Microsoft 365 groups with guest users.** When not configurable, the default option of removing user's membership from the resource is used on denied users.
 
13. Use **(Preview) At end of review, send notification to** to send notifications to other users or groups with completion updates. This feature allows for stakeholders other than the review creator to be updated on the progress of the review. To use this feature, select **Select User(s) or Group(s)** and add an additional user or group upon you want to receive the status of completion.
 
14. In the **Enable review decision helpers** choose whether you would like your reviewer to receive recommendations during the review process. When enabled, users who have signed in during the previous 30-day period are recommended to be approved, while users who have not signed in during the past 30 days are recommended to be denied.

> [!NOTE]
 > If you are creating an access review based on applications, your recommendations will be be based on the 30 day interval period based on when the user last signed into the application rather than the tenant.
 
    ![Enable decision helpers options](./media/create-access-review/helpers.png)
 
15. In the **Advanced settings** section you can choose the following
    - Set **Justification required** to **Enable** to require the reviewer to supply a reason for approval or denial.
    - Set **email notifications** to **Enable** to have Azure AD send email notifications to reviewers when an access review starts, and to administrators when a review completes.
    - Set **Reminders** to **Enable** to have Azure AD send reminders of access reviews in progress to all reviewers. Reviewers will receive the reminders halfway through the duration of the review, regardless of whether they have completed their review at that time.
    - The content of the email sent to reviewers is autogenerated based on the review details, such as review name, resource name, due date, etc. If you need a way to communicate additional information such as additional instructions or contact information, you can specify these details in the **Additional content for reviewer email** section. The information that you enter is included in the invitation and reminder emails sent to assigned reviewers. The section highlighted in the image below shows where this information is displayed.
 
      ![additional content for reviewer](./media/create-access-review/additional-content-reviewer.png)
 
16. Click on **Next: Review + Create** to move to the next page
 
  ![create review screen](./media/create-access-review/create-review.png)
17. Name the access review. Optionally, give the review a description. The name and description are shown to the reviewers.
 
18. Review the information and select **Create**.
 
    
 
## Allow group owners to create and manage access reviews of their groups (Preview)
 
Prerequisite role: Global or User Administrator
 
1. Sign in to the Azure portal and open the [Identity Governance page](https://portal.azure.com/#blade/Microsoft_AAD_ERM/DashboardBlade/).
 
1. In the left menu, under **Access reviews**, **settings**.
 
1. On the **Delegate who can create and manage access reviews page**, set the **(Preview) Group owners can create and manage for access reviews of groups they own** setting to **Yes**.
 
    ![create reviews - Enable group owners to review](./media/create-access-review/group-owners-review-access.png)
 
    > [!NOTE]
    > By default, the setting is set to **No** so it must be updated to allow group owners to create and manage access reviews.
 
## Start the access review
 
Once you have specified the settings for an access review, click **Start**. The access review will appear in your list with an indicator of its status.
 
![List of access reviews and their status](./media/create-access-review/access-reviews-list.png)
 
By default, Azure AD sends an email to reviewers shortly after the review starts. If you choose not to have Azure AD send the email, be sure to inform the reviewers that an access review is waiting for them to complete. You can show them the instructions for how to [review access to groups or applications](perform-access-review.md). If your review is for guests to review their own access, show them the instructions for how to [review access for yourself to groups or applications](review-your-access.md).
 
If you have assigned guests as reviewers and they have not accepted their invite to the tenant, they will not receive an email from access reviews because they must first accept the invite prior to reviewing.

## Update the access review

After one or more access reviews have been started, you may want to modify or update the settings of your existing access reviews. Here are some common scenarios that you might want to consider:

- **Updating settings or reviewers** - If an access review is recurring, there are separate settings under "Current" versus under "Series". Updating the settings or reviewers under "Current" will only apply changes to the current access review while updating the settings under "Series" will update the setting for all future recurrences.

![Update Access Review Settings](./media/create-access-review/current-v-series-setting.png)

- **Adding and removing reviewers** - When updating access reviews, you may choose to add a fallback reviewer in addition to the primary reviewer. Primary reviewers may be removed when updating an access review. However, fallback reviewers are not removable by design.

    > [!Note]
    > Fallback reviewers can only be added when reviewer type is manager  or group owner. Primary reviewers can be added when reviewer type is selected user.

- **Reminding the reviewers** - When updating access reviews, you may choose to enable the reminder option under Advanced Settings. Once enabled, users will receive an email notification at the midpoint of the review period, regardless of whether they have completed the review or not. 

![Reminding Reviewers](./media/create-access-review/reminder-setting.png)



 
## Next steps
 
- [Review access to groups or applications](perform-access-review.md)
- [Review access for yourself to groups or applications](review-your-access.md)
- [Complete an access review of groups or applications](complete-access-review.md)


