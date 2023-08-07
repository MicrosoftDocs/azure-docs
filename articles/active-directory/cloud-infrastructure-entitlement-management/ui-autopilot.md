---
title: View rules in the Autopilot dashboard in Permissions Management
description: How to view rules in the Autopilot dashboard in Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 02/16/2023
ms.author: jfields
---

# View rules in the Autopilot dashboard

The **Autopilot** dashboard in Permissions Management provides a table of information about Autopilot rules for administrators. Creating Autopilot rules allows you to automate right-sizing policies so you can automatically remove unused roles and permissions assigned to identities in your authorization system.


> [!NOTE]
> Only users with the **Administrator** role can view and make changes on this tab.

## View a list of rules

1. In the Permissions Management home page, select the **Autopilot** tab.
1. In the **Autopilot** dashboard, from the **Authorization system types** dropdown, select the authorization system types you want: Amazon Web Services (**AWS**), Microsoft **Azure**, or Google Cloud Platform (**GCP**).
1. From the **Authorization System** dropdown, in the **List** and **Folders** box, select the account and folder names that you want.
1. Select **Apply**.

    The following information displays in the **Autopilot Rules** table:

    - **Rule Name**: The name of the rule.
    - **State**: The status of the rule: idle (not in use) or active (in use).
    - **Rule Type**: The type of rule that's applied.
    - **Mode**: The status of the mode: on-demand or not.
    - **Last Generated**: The date and time the rule was last generated.
    - **Created By**: The email address of the user who created the rule.
    - **Last Modified**: The date and time the rule was last modified.
    - **Subscription**: Provides an **On** or **Off** subscription that allows you to receive email notifications when recommendations are generated, applied, or unapplied.

## View other available options for rules

- Select the ellipses **(...)**

    The following options are available:

    - **View Rule**: Select to view details of the rule.
    - **Delete Rule**: Select to delete the rule. Only the user who created the selected rule can delete the rule.
    - **Generate Recommendations**: Creates recommendations for each user and the authorization system. Only the user who created the selected rule can create recommendations.
    - **View Recommendations**: Displays the recommendations for each user and authorization system.
    - **Notification Settings**: Displays the users subscribed to this rule. Only the user who created the selected rule can add other users to receive notifications.

You can also select:

- **Reload**: Select to refresh the displayed list of roles/policies.
- **Search**: Select to search for a specific role/policy.
- **Columns**: From the dropdown list, select the columns you want to display.
    - Select **Reset to default** to return to the system defaults.
- **New Rule**: Select to create a new rule. For more information, see [Create a rule](how-to-create-rule.md).



## Next steps

- For information about creating rules, see [Create a rule](how-to-create-rule.md).
- For information about generating, viewing, and applying rule recommendations for rules, see [Generate, view, and apply rule recommendations for rules](how-to-recommendations-rule.md).
- For information about notification settings for rules, see [View notification settings for a rule](how-to-notifications-rule.md).
