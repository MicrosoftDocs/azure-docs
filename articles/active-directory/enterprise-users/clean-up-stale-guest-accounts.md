---
title: Clean up stale guest accounts - Azure Active Directory | Microsoft Docs
description: Clean up stale guest accounts using access reviews 
services: active-directory 
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.date: 08/29/2022
ms.topic: how-to
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Clean up stale guest accounts using access reviews

As users collaborate with external partners, it’s possible that many guest accounts get created in Azure Active Directory (Azure AD) tenants over time. When collaboration ends and the users no longer access your tenant, the guest accounts may become stale. Admins can use Access Reviews to automatically review inactive guest users and block them from signing in, and later, delete them from the directory.

Learn more about [how to manage inactive user accounts in Azure AD](https://learn.microsoft.com/azure/active-directory/reports-monitoring/howto-manage-inactive-user-accounts).

There are a few recommended patterns that are effective at cleaning up stale guest accounts:

1. Create a multi-stage review whereby guests self-attest whether they still need access. A second-stage reviewer assesses results and makes a final decision. Guests with denied access are disabled and later deleted.

2. Create a review to remove inactive external guests. Admins define inactive as period of days. They disable and later delete guests that don’t sign in to the tenant within that time frame. By default, this doesn't affect recently created users. [Learn more about how to identify inactive accounts](https://learn.microsoft.com/azure/active-directory/reports-monitoring/howto-manage-inactive-user-accounts#how-to-detect-inactive-user-accounts).

Use the following instructions to learn how to create Access Reviews that follow these patterns. Consider the configuration recommendations and then make the needed changes that suit your environment.

## Create a multi-stage review for guests to self-attest continued access

1. Create a [dynamic group](https://learn.microsoft.com/azure/active-directory/enterprise-users/groups-create-rule) for the guest users you want to review. For example,

   `(user.userType -eq "Guest") and (user.mail -contains "@contoso.com") and (user.accountEnabled -eq true)`

2. To [create an Access Review](https://learn.microsoft.com/azure/active-directory/governance/create-access-review)
    for the dynamic group, navigate to **Azure Active Directory > Identity Governance > Access Reviews**.

3. Select **New access review**.

4. Configure Review type.

   | Property | Value |
   |:-----|:-------|
   | Select what to review | **Teams + Groups**|
   |Review scope | **Select Teams + groups** |
   |Group| Select the dynamic group |
   |Scope| **Guest users only**|
   |(Optional) Review inactive guests | Check the box for **Inactive users (on tenant level) only**.<br> Enter the number of days that constitute inactivity.|

   ![Screenshot shows the review type dialog for multi-stage review for guests to self-attest continued access.](./media/clean-up-stale-guest-accounts/review-type-multi-stage-review.png)

5. Select **Next: Reviews**.

6. Configure Reviews:

   |Property | Value |
   |:------------|:-------------|
   | **First stage review** |     |
   | (Preview) Multi-stage review| Check the box|
   |Select reviewers | **Users review their own access**|
   | Stage duration (in days) | Enter the number of days |
   |**Second stage review** |            |
   | Select reviewers | **Group owner(s)** or **Selected user(s) or group(s)**|
   |Stage duration (in days) |  Enter the number of days.<br>(Optional) Specify a fallback reviewer.|
   | **Specify recurrence of review** |    |
   | Review recurrence | Select your preference from the drop-down|
   |Start date| Select a date|
   |End| Select your preference |
   | **Specify reviewees to go to the next stage** | | 
   | Reviewees going to the next stage | Select reviewees. For example, select users who self-approved or responded **Don't know**.

    ![Screenshot shows the first stage review for multi-stage review for guests to self-attest continued access.](./media/clean-up-stale-guest-accounts/first-stage-review-for-multi-stage-review.png)

7. Select **Next: Settings**.

8. Configure Settings:

   | Property | Value |
   |:--------|:-------|
   | **Upon completion settings**| |
   |Auto apply results to resource| Check the box|
   |If reviewers don't respond | **Remove access** |
   | Action to apply on denied guest users | **Block user from signing in for 30 days, then remove user from the tenant**|
   | (Optional) At end of review, send notification to | Specify other users or groups to notify.|
   | **Enable reviewer decision helpers** |  |
   | Additional content for reviewer email | Add a custom message for reviewers |
   | All other fields| Leave the default values for the remaining options. |

   ![Screenshot shows the settings dialog for multi-stage review for guests to self-attest continued access.](./media/clean-up-stale-guest-accounts/settings-for-multi-stage-review.png)

9. Select **Next: Review + Create**

10. Enter an Access Review name. (Optional) provide description.

11. Select **Create**.

## Create a review to remove inactive external guests

1. Create a [dynamic group](https://learn.microsoft.com/azure/active-directory/enterprise-users/groups-create-rule) for the guest users you want to review. For example,

   `(user.userType -eq "Guest") and (user.mail -contains "@contoso.com") and (user.accountEnabled -eq true)`

2. To [create an access review](https://learn.microsoft.com/azure/active-directory/governance/create-access-review) for the dynamic group, navigate to **Azure Active Directory > Identity Governance > Access Reviews**.

3. Select **New access review**.

4. Configure Review type:

   |Property | Value |
   |:---------|:------------|
   | Select what to review | **Teams + Groups** |
   | Review scope | **Select Teams + groups** |
   | Group | Select the dynamic group |
   | Scope | **Guest users only**
   | Inactive users (on tenant level) only | Check the box |
   | Days inactive | Enter the number of days that constitutes inactivity |

   >[!NOTE]
   >The inactivity time you configure will not affect recently created users. The Access Review will check if the user has been created in the timeframe you configure and ignore users who haven’t existed for at least that amount of time. For example, if you set the inactivity time as 90 days and a guest user was created/invited less than 90 days ago, the guest user will not be in scope of the Access Review. This ensures that guests can sign in once before being removed.
   
   ![Screenshot shows the review type dialog to remove inactive external guests.](./media/clean-up-stale-guest-accounts/review-type-remove-inactive-guests.png)

5. Select **Next: Reviews**.

6. Configure Reviews:

   | Property | Value |
   |:----|:---|
   | **Specify reviewers** |  |
   | Select reviewers | Select **Group owner(s)** or a user or group.<br>(Optional) To enable the process to remain automated, select a reviewer who will take no action.|  
   | **Specify recurrence of review**| | 
   | Duration (in days) | Enter or select a value based on your preference|
   | Review recurrence | Select your preference from the drop-down |
   | Start date | Select a date |
   | End | Choose an option |

7. Select **Next: Settings**.

   ![Screenshot shows the Reviews dialog to remove inactive external guests.](./media/clean-up-stale-guest-accounts/reviews-remove-inactive-guests.png)

8. Configure Settings:

   | Property | Value |
   | :----| :-----|
   | **Upon completion settings** | |
   | Auto apply results to resource | Check the box |
   | If reviews don't respond | **Remove access** |
   | Action to apply on denied guest users | **Block user from signing in for 30 days, then remove user from the tenant**  |
   | **Enable reviewer decision helpers** | |
   | No sign-in within 30 days | Check the box |
   | All other fields | Check/uncheck the boxes based on your preference. |

   ![Screenshot shows the Settings dialog to remove inactive external guests.](./media/clean-up-stale-guest-accounts/settings-remove-inactive-guests.png)

9. Select **Next: Review + Create**.

10. Enter an Access Review name. (Optional) provide description.

11. Select **Create**.

Guest users who don't sign into the tenant for the number of days you
configured are disabled for 30 days, then deleted. After deletion, you
can restore guests for up to 30 days, after which a new invitation is
needed.
