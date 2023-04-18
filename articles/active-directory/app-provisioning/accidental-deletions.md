---
title: Enable accidental deletions prevention in the Azure AD provisioning service
description: Enable accidental deletions prevention in the Azure Active Directory (Azure AD) provisioning service for applications and cross-tenant synchronization.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: how-to
ms.workload: identity
ms.date: 04/10/2023
ms.author: kenwith
ms.reviewer: arvinh
zone_pivot_groups: app-provisioning-cross-tenant-synchronization
---

# Enable accidental deletions prevention in the Azure AD provisioning service

::: zone pivot="app-provisioning"
The Azure AD provisioning service includes a feature to help avoid accidental deletions. This feature ensures that users aren't disabled or deleted in an application unexpectedly.
::: zone-end

::: zone pivot="cross-tenant-synchronization"
> [!IMPORTANT]
> [Cross-tenant synchronization](../multi-tenant-organizations/cross-tenant-synchronization-overview.md) is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The Azure AD provisioning service includes a feature to help avoid accidental deletions. This feature ensures that users aren't disabled or deleted in the target tenant unexpectedly.
::: zone-end

The feature lets you specify a deletion threshold, above which an admin 
needs to explicitly choose to allow the deletions to be processed.

## Configure accidental deletion prevention

To enable accidental deletion prevention:

1.  In the Azure portal, select **Azure Active Directory**.

::: zone pivot="app-provisioning"
2.  Select **Enterprise applications** and then select your application.

3.  Select **Provisioning** and then on the provisioning page select **Edit provisioning**.
::: zone-end

::: zone pivot="cross-tenant-synchronization"
2.  Select **Cross-tenant synchronization (Preview)** > **Configurations** and then select your configuration.

3.  Select **Provisioning**.
::: zone-end

4. Under **Settings**, select the **Prevent accidental deletions** check box and specify a deletion 
threshold.

5. Ensure the **Notification Email** address is completed.

    If the deletion threshold is met, an email will be sent.

6. Select **Save** to save the changes.

When the deletion threshold is met, the job will go into quarantine and a notification email will be sent. The quarantined job can then be allowed or rejected. To learn more about quarantine behavior, see [Application provisioning in quarantine status](application-provisioning-quarantine-status.md).

## Recovering from an accidental deletion
If you encounter an accidental deletion, you'll see it on the provisioning status page.  It will say **Provisioning has been quarantined. See quarantine details for more information**.

You can click either **Allow deletes** or **View provisioning logs**.

### Allowing deletions

The **Allow deletes** action will delete the objects that triggered the accidental delete threshold.  Use the following procedure to accept the deletes.  

1. Select **Allow deletes**.
2. Click **Yes** on the confirmation to allow the deletions.
3. You'll see confirmation that the deletions were accepted and the status will return to healthy with the next cycle.

### Rejecting deletions

If you don't want to allow the deletions, you need to do the following:
- Investigate the source of the deletions. You can use the provisioning logs for details.
- Prevent the deletion by assigning the user / group to the application (or configuration) again, restoring the user / group, or updating your provisioning configuration.
- Once you've made the necessary changes to prevent the user / group from being deleted, restart provisioning. Don't restart provisioning until you've made the necessary changes to prevent the users / groups from being deleted. 


### Test deletion prevention
You can test the feature by triggering disable / deletion events by setting the threshold to a low number, for example 3, and then changing scoping filters, un-assigning users, and deleting users from the directory (see common scenarios in next section). 

Let the provisioning job run (20 – 40 mins) and navigate back to the provisioning page. You'll see the provisioning job in quarantine and can choose to allow the deletions or review the provisioning logs to understand why the deletions occurred.

## Common deprovisioning scenarios to test
- Delete a user / put them into the recycle bin.
- Block sign in for a user.
- Unassign a user or group from the application (or configuration).
- Remove a user from a group that's providing them access to the application (or configuration).

To learn more about deprovisioning scenarios, see [How Application Provisioning Works](how-provisioning-works.md#deprovisioning).

## Frequently Asked Questions

### What scenarios count toward the deletion threshold?
When a user is set to be removed from the target application (or target tenant), it will be counted against the 
deletion threshold. Scenarios that could lead to a user being removed from the target 
application (or target tenant) could include: unassigning the user from the application (or configuration) and soft / hard deleting a user in the directory. Groups 
evaluated for deletion count towards the deletion threshold. In addition to deletions, the same functionality also works for disables.

### What is the interval that the deletion threshold is evaluated on?
It's evaluated each cycle. If the number of deletions doesn't exceed the threshold during a 
single cycle, the “circuit breaker” won’t be triggered. If multiple cycles are needed to reach a 
steady state, the deletion threshold will be evaluated per cycle.

### How are these deletion events logged?
You can find users that should be disabled / deleted but haven’t due to the deletion threshold. 
Navigation to **Provisioning logs** and then filter **Action** with *StagedAction* or *StagedDelete*.


## Next steps 

- [How application provisioning works](how-provisioning-works.md)
- [Plan an application provisioning deployment](plan-auto-user-provisioning.md)
