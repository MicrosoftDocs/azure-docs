---
title: Microsoft CloudKnox Permissions Management - The Autopilot dashboard
description: How to view Autopilot rules in the Microsoft CloudKnox Permissions Management Autopilot dashboard.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 01/14/2022
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - The Autopilot dashboard

The Microsoft CloudKnox Permissions Management (CloudKnox) **Autopilot** dashboard provides a table of information about **Autopilot Rules** for administrators.

This topic provides an overview of the components of the **Autopilot** dashboard.

> [!NOTE]
> Only users with the **Administrator** role can view and make changes on this tab.

**To display a list of Autopilot Rules**

- **Authorization system types** - From a drop-down list, select the authorization system types you can access. May include Amazon Web Services (AWS), Microsoft Azure (Azure), Google Cloud Platform (GCP), and so on.
- **Authorization systems** - Select the appropriate option from either the **List** or **Folders** section, and then select **Apply**. 

The following information displays in the table:

- **Rule Name** - The name of the rule.
- **State** - The status of the rule: idle (not being use) or active (being used).
- **Rule Type** - The type of rule being applied. 
- **Mode** - The status of the mode: on-demand or not.
- **Last Generated** - The date and time the rule was last generated.
- **Created By** - The email address of the user who created the rule.
- **Last Modified** - The date and time the rule was last modified.
- **Subscription** - Provides an **On** or **Off** subscription that allows you to receive email notifications when recommendations have been generated, applied, or unapplied.

**To view the available options**

- Select the ellipses **(...)**

The following options are available:

- **View Rule** - Displays the details of the rule.
- **Delete Rule** - Deletes the rule. Only the user who created the selected rule can delete the rule. 
- **Generate Recommendations** - Creates recommendations for each user and the authorization system. Only the user who created the selected rule can create recommendations.
- **View Recommendations** - Displays the recommendations for each user and authorization system.
- **Notification Settings** - Displays the users subscribed to this rule. Only the user who created the selected rule can add other users to be notified.

You can also select:

- **Reload** - Select to refresh the displayed list of roles/policies.
- **Search** - Select to search for a specific role/policy.
- **||| Columns** - From the drop-down list, select the columns you want to display.
    - Select **Reset to default** to return to the system defaults. 
- **New Rule** - Select to create a new rule. For more information, see Create a new rule.
<!---cloudknox-howto-create-rule.html--->




<!---## Next steps--->