---
title: Create and view an alert in CloudKnox Permissions Management 
description: How to create and view an alert in CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 02/02/2022
ms.author: v-ydequadros
---

# Create and view an alert

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

This article describes how you can create an alert in CloudKnox Permissions Management (CloudKnox).

## Create an alert

1. In the CloudKnox home page, select **Activity triggers** (the bell icon).
1. In the **Activity** tab, select **Create activity trigger**.
1. In the **Alert name** box, enter a name for your alert.
1. In **Authorization system type**, select your authorization system: Amazon Web Services (**AWS**), Microsoft **Azure**, or Google Cloud Platform (**GCP**).
1. In **Authorization system**, select **Is** or **In**, and then select one or more accounts and folders.
1. From the **Select a type** dropdown, select: **Access key ID**, **Identity tag key**, **Identity tag key value**, **Resource name**, **Resource tag key** or **Resource tag key value**.
1. From the **Operator** dropdown, select an option:

    - **Is**/**Is Not**: Select in the value field to view a list of all available usernames. You can either select or enter the required username.
    - **Contains**/**Not Contains**: Enter any text that the query parameter should or shouldn't contain, for example *CloudKnox*.
    - **In**/**Not In**: Select in the value field to view list of all available values. Select the required multiple values.

1. To add another parameter, select the plus sign **(+)**, then select an operator, and then enter a value.

    To remove a parameter, select the minus sign **(-)**.
1. To add another activity type, select **Add**, and then enter your parameters.
1. To save your alert, select **Save**.

    A message displays to confirm your alert trigger has been created.

    The **Triggers** table in the **Alert triggers** subtab displays your alert.

## View an alert

1. In the CloudKnox home page, select **Activity triggers** (the bell icon).
1. In the **Activity** tab, select the **Alerts** subtab.
1. From the **Alert name** dropdown, select an alert.
1. From the **Date** dropdown, select **Last 24 Hours**, **Last 2 Days**, **Last Week**, or **Custom Range**.

    If you select **Custom range**, select date and time settings, and then select **Apply**.
1. To run the alert, select **Apply**

    The **Alerts** table displays information about your alert.





## Next steps

- For an overview on activity triggers, see [View information about activity triggers](cloudknox-ui-triggers.md).


