---
title: Create a rule in the Autopilot dashboard in CloudKnox Permissions Management 
description: How to create a rule in the Autopilot dashboard in CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/01/2022
ms.author: v-ydequadros
---

# Create a rule in the Autopilot dashboard

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.
 
This article describes how to create a rule in the CloudKnox Permissions Management (CloudKnox) **Autopilot** dashboard.

> [!NOTE]
> Only users with **Administrator** permissions can view and make changes on the Autopilot tab. If you don’t have these permissions, contact your system administrator.

## Create a rule for Amazon Web Services (AWS) 

1. In CloudKnox, select the **Autopilot** tab.
1. Select **New rule**.
1. In the **Rule name** box, enter a name for your rule, and then select **Next**.
1. Select **AWS**, and then select **Next**. 
1. Select **All** or the account names that you want.
1. From the **Folders** dropdown, select a folder, and then select **Apply**.

     To change your folder settings, select **Reset**.

1. In the **Configure** tab, select the following parameters for your rule:

    - **Role created on is**: Select the duration in days.
    - **Role last used on is**: Select the duration in days when the role was last used.
    - **Cross account role**: Select **True** or **False**.

1. In the **Mode** tab, if you want recommendations to be generated and applied manually, select **On-demand**.
1. Select **Save**

    The following information displays in the **Autopilot rules** table:

    - **Rule Name**: The name of the rule.
    - **State**: The status of the rule: idle (not being use) or active (being used).
    - **Rule Type**: The type of rule being applied. 
    - **Mode**: The status of the mode: on-demand or not.
    - **Last Generated**: The date and time the rule was last generated.
    - **Created By**: The email address of the user who created the rule.
    - **Last Modified**: The date and time the rule was last modified.
    - **Subscription**: Provides an **On** or **Off** subscription that allows you to receive email notifications when recommendations have been generated, applied, or unapplied.

## Create a rule for Microsoft Azure 

1. In CloudKnox, select the **Autopilot** tab.
1. Select **New rule**.
1. Select **Azure**, and then select **Next**.
1. In the **Rule name** box, enter a name for your rule, and then select **Next**.
1. Select **All** or the account names that you want.
1. From the **Folders** dropdown, select a folder, and then select **Apply**.

     To change your folder settings, select **Reset**.

1. In the **Configure** tab, select a duration in days for how long your rule hasn't been used.
1. In the **Mode** tab, if you want recommendations to be generated and applied manually, select **On-demand**.
1. Select **Save**

    The following information displays in the **Autopilot rules** table:

    - **Rule Name**: The name of the rule.
    - **State**: The status of the rule: idle (not being use) or active (being used).
    - **Rule Type**: The type of rule being applied. 
    - **Mode**: The status of the mode: on-demand or not.
    - **Last Generated**: The date and time the rule was last generated.
    - **Created By**: The email address of the user who created the rule.
    - **Last Modified**: The date and time the rule was last modified.
    - **Subscription**: Provides an **On** or **Off** subscription that allows you to receive email notifications when recommendations have been generated, applied, or unapplied.

## Create a rule for Google Cloud Platform (GCP) 

1. In CloudKnox, select the **Autopilot** tab.
1. Select **New rule**.
1. Select **GCP**, and then select **Next**.
1. In the **Rule name** box, enter a name for your rule, and then select **Next**.
1. Select **All** or the account names that you want.
1. From the **Folders** dropdown, select a folder, and then select **Apply**.

     To change your folder settings, select **Reset**.

1. The **Configure** tab displays the following options:

    - **Cross project**: Select **True** or **False**.
    - **Unused**: Select a duration in days for how long your rule hasn't been used.

1. In the **Mode** tab, if you want recommendations to be generated and applied manually, select **On-demand**.
1. Select **Save**

    The following information displays in the **Autopilot rules** table:

    - **Rule Name**: The name of the rule.
    - **State**: The status of the rule: idle (not being use) or active (being used).
    - **Rule Type**: The type of rule being applied. 
    - **Mode**: The status of the mode: on-demand or not.
    - **Last Generated**: The date and time the rule was last generated.
    - **Created By**: The email address of the user who created the rule.
    - **Last Modified**: The date and time the rule was last modified.
    - **Subscription**: Provides an **On** or **Off** subscription that allows you to receive email notifications when recommendations have been generated, applied, or unapplied.


## Next steps

- For more information about viewing rules, see [View roles in the Autopilot dashboard](cloudknox-ui-autopilot.md).
