---
title: Enable accidental deletions prevention in Application Provisioning in Azure Active Directory
description: Enable accidental deletions prevention in Application Provisioning in Azure Active Directory.
services: active-directory
author: kenwith
manager: mtillman
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: how-to
ms.workload: identity
ms.date: 08/30/2021
ms.author: kenwith
ms.reviewer: arvinh
---

# Enable accidental deletions prevention in Application Provisioning

Application Provisioning includes a a feature to help avoid accidental deletions. This feature ensures that users are not disabled or deleted in an application unexpectedly. 

The feature accomplishes this by allowing you to specify a deletion threshold, above which an admin 
needs to explicitly choose to allow the deletions to be processed.

> [!NOTE]
> Until the accidental deletions prevention feature is fully released, you will need to access the Azure portal using this URL: https://portal.azure.com/?Microsoft_AAD_IAM_userProvisioningDeleteThreshold=true


## Configure accidental deletion prevention
To enable accidental deletion prevention:
1.  In the Azure portal, select **Azure Active Directory**.
2.  Select **Enterprise applications** and then select your app.
3.  Select **Provisioning** and then on the provisioning page select **Edit provisioning**.
4. Under **Settings**, select the **Prevent accidental deletions** checkbox and specify a deletion 
threshold.
5. Select **Save**, to save the changes.

:::image type="content" source="media/accidental-deletions/accidental-deletions-setting.png" alt-text="A checkbox to enable accidental deletions and a textbox to set the deletion threshold." lightbox="media/accidental-deletions/accidental-deletions-setting.png":::

## Test deletion prevention
You can test the feature by triggering disable / deletion events by setting the threshold to a low number, for example 3, and then changing scoping filters, un-assigning users, and deleting users from the directory (see common scenarios in next section). 

Let the provisioning job run (20 – 40 mins) and navigate back to the provisioning page. You will see the provisioning job in quarantine and can choose to allow the deletions or review the provisioning logs to understand why the deletions occurred.

## Common de-provisioning scenarios to test
- Delete a user / put them into the recycle bin.
- Block sign in for a user.
- Unassign a user or group from the application.
- Remove a user from a group that’s providing them access to the app.
- Change scope from sync all users and groups to sync assigned users and groups (Please be 
careful with sync all as it means all users in the tenant will be exported into the target 
application, unless you add additional scoping filters).

To learn more about de-provisioning scenarios, see [How Application Provisioning Works](how-provisioning-works.md#de-provisioning).

## Frequently Asked Questions

### What scenarios count toward the deletion threshold?
Anytime a user is set to be removed from the target application, it will be counted against the 
deletion threshold. Scenarios that could lead to a user being removed from the target 
application could include: un-assigning the user from the application, changing the sync scope 
from “sync all” to “sync assigned” to soft / hard deleting a user in the directory. Groups 
evaluated for deletion count towards the deletion threshold.

### What is the interval that the deletion threshold is evaluated on?
It is evaluated each cycle. If the number of deletions does not exceed the threshold during a 
single cycle, the “circuit breaker” won’t be triggered. If multiple cycles are needed to reach a 
steady state, the deletion threshold will be evaluated per cycle.

### How are these deletion events logged?
You can find users that should be disabled / deleted but haven’t due to the deletion threshold 
by navigating to the provisioning logs and selecting the “StagedDelete” action.


## Next steps 

- [How application provisioning works](how-provisioning-works.md)
- [Plan an application provisioning deployment](plan-auto-user-provisioning.md)
