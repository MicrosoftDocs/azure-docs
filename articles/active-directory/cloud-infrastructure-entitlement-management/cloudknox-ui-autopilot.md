---
title: View rules in the Autopilot dashboard in CloudKnox Permissions Management
description: How to view rules in the Autopilot dashboard in CloudKnox Permissions Management.
services: active-directory
author: kenwith
manager: rkarlin
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 02/23/2022
ms.author: kenwith
---

# View rules in the Autopilot dashboard

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

The **Autopilot** dashboard in CloudKnox Permissions Management (CloudKnox) provides a table of information about **Autopilot rules** for administrators.


> [!NOTE]
> Only users with the **Administrator** role can view and make changes on this tab.

## View a list of rules 

1. In the CloudKnox home page, select the **Autopilot** tab.
1. In the **Autopilot** dashboard, from the **Authorization system types** dropdown, select the authorization system types you want: Amazon Web Services (**AWS**), Microsoft **Azure**, or Google Cloud Platform (**GCP**).
1. From the **Authorization System** dropdown, in the **List** and **Folders** box, select the account and folder names that you want.
1. Select **Apply**. 

    The following information displays in the **Autopilot Rules** table:

    - **Rule Name**: The name of the rule.
    - **State**: The status of the rule: idle (not being use) or active (being used).
    - **Rule Type**: The type of rule being applied. 
    - **Mode**: The status of the mode: on-demand or not.
    - **Last Generated**: The date and time the rule was last generated.
    - **Created By**: The email address of the user who created the rule.
    - **Last Modified**: The date and time the rule was last modified.
    - **Subscription**: Provides an **On** or **Off** subscription that allows you to receive email notifications when recommendations have been generated, applied, or unapplied.

## View other available options for rules

- Select the ellipses **(...)**

    The following options are available:

    - **View Rule**: Select to view details of the rule.
    - **Delete Rule**: Select to delete the rule. Only the user who created the selected rule can delete the rule. 
    - **Generate Recommendations**: Creates recommendations for each user and the authorization system. Only the user who created the selected rule can create recommendations.
    - **View Recommendations**: Displays the recommendations for each user and authorization system.
    - **Notification Settings**: Displays the users subscribed to this rule. Only the user who created the selected rule can add other users to be notified.

You can also select:

- **Reload**: Select to refresh the displayed list of roles/policies.
- **Search**: Select to search for a specific role/policy.
- **Columns**: From the dropdown list, select the columns you want to display.
    - Select **Reset to default** to return to the system defaults. 
- **New Rule**: Select to create a new rule. For more information, see [Create a rule](cloudknox-howto-create-rule.md).



## Next steps

- For information about creating rules, see [Create a rule](cloudknox-howto-create-rule.md).
- For information about generating, viewing, and applying rule recommendations for rules, see [Generate, view, and apply rule recommendations for rules](cloudknox-howto-recommendations-rule.md).
- For information about notification settings for rules, see [View notification settings for a rule](cloudknox-howto-notifications-rule.md).
