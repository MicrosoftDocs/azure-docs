---
title: Add an authorization system for data collection in CloudKnox Permissions Management
description: How to add an authorization system for data collection in CloudKnox Permissions Management.
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

# Add an authorization system for data collection

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

You can use the **Authorization system** dashboard in CloudKnox Permissions Management (CloudKnox) to add an authorization system for data collection.

## Add an authorization system

1. To add an authorization system, at the top of the CloudKnox page, select **Settings** (the gear icon). Then select the **Authorization system** tab.

1. On the **Authorization system** tab, select your authorization system: 

    - **AWS** for Amazon Web Services.
    - **Azure** for Microsoft Azure.
    - **GCP** for Google Cloud Platform.

1. Apply filters to the authorization system using the following dropdown menus from the top of the screen and select **Apply** once selected:

    - **Controller Status**: Select **All**, **Enabled**, or **Disabled**.
    - **Benchmark Status**: **Controller Status**: Select **All**, **Enabled**, or **Disabled**.
    - **Entitlement Status**: **Controller Status**: Select **All**, **Enabled**, or **Disabled**. **All**, **Online**, or **Offline**.
    - **Enter a Name or ID**: Use this box to enter a specific name or ID to apply the filter, if necessary.

1. The table displays the following details for each authorization system:

     - **Name**: Displays the name of the authorization system, if available. Otherwise, it will display the ID of the authorization system.
         - To access Account explorer, select the name or the ID. 
     - **ID**: Displays the identification number of the authorization system. It's a unique number that identifies a specific authorization system.
     - **Controller Status**: Displays either **Enabled** or **Disabled**.

         The **Controller status** indicates whether an administrator has given permission to CloudKnox to perform write operations for various features, such as privilege on demand, activity-based roles, or policy creation, etc.

     - **Status**: The date the data was most recently collected.
     - **Recently uploaded on**: The date the data was most recently uploaded. 
     - **Recently transformed on**: The date the data was most recently processed. 


## Start collecting data from an authorization system   

1. Select the ellipses **(...)** at the end of the row in the table.
1. Select **Collect Data**.

    A message displays to confirm if data collection has started of failed. 
    If data collection fails, check your **Controller status** and **Entitlement Status**, and then try again.


## Stop collecting data from an authorization system   

1. Select the ellipses **(...)** at the end of the row in the table.
1. To delete your authorization system, select **Delete**. 

    The **Onboarding - Summary** box displays.

1. Select **Delete**. 



## Next steps

- For information about viewing and configuring settings for collecting data from your authorization system and its associated accounts, see [View and configure settings for data collection](cloudknox-product-data-sources.md)
- For information about viewing an inventory of created resources and licensing information for your authorization systems, see [Display an inventory of  created resources and licenses for your authorization system](cloudknox-product-data-inventory.md)