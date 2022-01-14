---
title: Microsoft CloudKnox Permissions Management - Create a new rule 
description: How to create a new rule in the Microsoft CloudKnox Permissions Management Autopilot dashboard.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/14/2022
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - Create a new rule 
 
This topic describes how to create a new rule in the Microsoft CloudKnox Permissions Management (CloudKnox) **Autopilot** dashboard.

## Create a rule for Amazon Web Services (AWS) 

1. In CloudKnox, select the **Autopilot** tab.

   CloudKnox displays the rule options available to you.
1. Select **New Rule**.
1. In the **Rule Name** box, enter a name for your rule.
1. Select **AWS**, and then select **Next**.
1. Select the **Authorization Systems** tab.
1. From the **Folders** drop-down list, select a folder.

    Select **Reset** to change your folder selection.
1. Select the account you want to use.
1. In the **Configure** tab, select the following parameters for your rule:

    - **Role Created On Is** - Select the duration in days.
    - **Role Last Used On Is** - Select the duration in days when the role was last used.
    - **Cross Account Role** - Select **True** or **False**.
1. In the **Mode** tab, select **On-Demand** if you want recommendations to be generated and applied manually.
1. Select **Save**
    The table in the **New Rule** tab displays a list of rules you have created.

## Create a rule for Microsoft Azure (Azure) 

1. In CloudKnox, select the **Autopilot** tab.

   CloudKnox displays the rule options available to you.
1. Select **New Rule**.
1. In the **Rule Name** box, enter a name for your rule.
1. Select **Azure**, and then select **Next**.
1. Select the **Authorization Systems** tab.
1. From the **Folders** drop-down list, select a folder.

    Select **Reset** to change your folder selection.
1. Select the account you want to use.
1. In the **Configure** tab, select a duration in days for how long your rule has not been used.
1. In the **Mode** tab, select **On-Demand** if you want recommendations to be generated and applied manually.
1. Select **Save**
    The table in the **New Rule** tab displays a list of rules you have created.

## Create a rule for Google Cloud Platform (GCP) 

1. In CloudKnox, select the **Autopilot** tab.

   CloudKnox displays the rule options available to you.
1. Select **New Rule**.
1. In the **Rule Name** box, enter a name for your rule.
1. Select **GCP**, and then select **Next**.
1. Select the **Authorization Systems** tab.
1. From the **Folders** drop-down list, select a folder.

    Select **Reset** to change your folder selection.
1. Select the account you want to use.
1. In the **Configure** tab, select the following parameters for your rule:

    - **Cross Project** - Select **True** or **False**.
    - **Unused** - Select a duration in days for how long your rule has not been used..
1. In the **Mode** tab, select **On-Demand** if you want recommendations to be generated and applied manually.
1. Select **Save**
    The table in the **New Rule** tab displays a list of rules you have created.




<!---## Next steps--->