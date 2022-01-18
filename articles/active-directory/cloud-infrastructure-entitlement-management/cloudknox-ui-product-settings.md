---
title: Microsoft CloudKnox Permissions Management - The CloudKnox Settings dashboard
description: How to view and modify product settings information in the CloudKnox settings dashboard in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 01/17/2022
ms.author: v-ydequadros
---

# The CloudKnox Settings dashboard

This topic describes how to use the **Settings** dashboard in Microsoft CloudKnox Permissions Management (CloudKnox) to view and modify product settings.

**To display the CloudKnox Settings dashboard**

- In the upper right of the CloudKnox dashboard, select **Settings** (the gear icon).

    The **Settings** dashboard has three tabs:

    - **Data Collectors**
    - **Authorization Systems**
    - **Inventory**

## The Data Collectors tab

The **Data Collectors** tab displays the following information:

- Authorization systems you can access:
    - The **Name** of the authorization system
    - The **ID number**
    - The **IP address**
    - The **Data Types**
    - **Recently Uploaded On**
    - **Recently Transformed On**
    - The ellipses **(...)** menu 
        - To view details about the **Sentry Appliance Configuration**, select **Configure**.
        - To delete the corresponding **Authorization Systems**, select **Delete**.

You can also use the following options:

- **Search** - Enter an ID or IP address to display specific authorization systems.
- **Filters** - Select the uploaded and transformed systems you want to display: **All** or **Online** . 
- **||| Columns** - Select the columns you want to display: **Recently Uploaded On** and **Recently Transformed On**.
    - To return to the system default settings, Select **Reset to default**.
- **Deploy** - Select to deploy the Sentry Appliance. 
    <!---Add link to For more information, see Deploy the Sentry Appliance.--->

## The Authorization Systems tab

The **Authorization Systems** tab has two subtabs: 

- **List** 
- **Folders**

### The List subtab

The **List** tab displays the following information about the authorization system you've selected:

- **Controller Status** - From the drop-down list, select **All**, **Enabled**, or **Disabled**.
- **Benchmark Status** - From the drop-down list, select **All**, **Online**, or **Offline**.
- **Entitlement Status** - From the drop-down list, select **All**, **Online**, or **Offline**.
- **Search** - Enter an account name or ID.
- **Apply** - Select **Apply** to apply your settings.
- **Reset Filter** - Select **Reset Filter** to discard your settings.
- The ellipses **(...)** menu - Select **Collect Data** or **Delete**.

The authorization systems table displays the following information about the authorization system you've selected:

- **Name** - The name of the authorization system.
- **ID number** - The identification number of the authorization system.
- **Controller Status** - The controller status: **All**, **Enabled**, or **Disabled**.
- **Benchmark status** - The benchmark status: **All**, **Online**, or **Offline**.
- **Entitlements Status** - The entitlement status: **All**, **Online**, or **Offline**.
- **||| Columns** - Select the columns you want to display: **Controller Status**, **Benchmark status**, and **Entitlements Status**.
    - To return to the system default settings, Select **Reset to default**.

### The Folders subtab

The **Folders** subtab displays the names of all the authorizations you have access to. Select an authorization system to display the following information:

- **Folder Name** - The name of the folder.
- **Created On** - The date the folder was created.
- **Created By** - The name of the person who created the folder.
- **Last Modified On** - The date the folder was last modified.
- **Last Modified By** - The name of the person who last modified the folder.
- The ellipses **(...)** menu - From the menu, select **Copy Folder Id**, **Edit**, or **Delete**.
- **Search** - Enter a folder name.
- **||| Columns** - Select the columns you want to display: **Created On**, **Created By**, **Last Modified On**, and **Last Modified By**.
    - To return to the system default settings, Select **Reset to default**.
- **Create Folder** - Create a new folder. 

## The Inventory tab

The **Inventory** tab has two subtabs:
- **Inventory** 
- **Licensing**

### The Inventory subtab

The **Inventory** subtab displays the following information about the authorization system you've selected:

- **Authorization System Name** - The name of the authorization system.
- **Dynamodb Table**
- **EC2 Instance**
- **VPC Internet Gateway**
- **Elasticache Cluster**
- **Lambda Function**
- **Search** - Enter a name.
    - **||| Columns** - Select the columns you want to display: **Dynamodb Table**, **EC2 Instance**, **VPC Internet Gateway**, **Elasticache Cluster**, and **Lambda Function**.
        - To return to the system default settings, select **Reset to default**.

### The Licensing subtab

The **Licensing** subtab displays the following information about the authorization system you've selected:

- **Authorization System** - A list of accounts.
- **Total Number of Licenses** - The number of licenses.
- **Search** - Enter a name.

<!---## Next steps--->