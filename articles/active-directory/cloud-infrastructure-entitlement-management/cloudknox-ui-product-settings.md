---
title: Microsoft CloudKnox Permissions Management - View, and modify configuration settings for data collection
description: How to view and modify configuration settings for data collection in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 01/24/2022
ms.author: v-ydequadros
---

# View and modify configuration settings for data collection

When you first open Microsoft CloudKnox Permissions Management (CloudKnox) after successfully enabling CloudKnox, the CloudKnox **Settings** dashboard displays. You use the **Settings** dashboard to set, view, and modify configuration settings for data collection information.

## View configuration settings for data collection

1. If the CloudKnox Settings dashboard does not open automatically, in the upper right of the window, select **Settings** (the gear icon).

    The **Settings** dashboard has three tabs:

    - **Data collectors** - Use this tab to configure settings for the data you want to collect from your authorization system.
    - **Authorization systems** - Use this tab to configure settings for the authorization system you want to use.
    - **Inventory** - Use this tab to configure settings for inventory and licensing for the authorization system you selected in the **Authorization systems** tab.

1. Select the authorization system whose data you want to collect:

    - For Amazon Web Services (AWS), select **AWS**. 
    - For Microsoft Azure, select **Azure**.
    - For Google Cloud Platform (GCP), select **GCP**.

1. The **Data collectors** tab displays the following information about the authorization system on which you are collecting data:

    - The **Name** of the authorization system
    - The **ID number** of your account, subscription, or project.
    - The **IP address**
    - The **Data types**
    - **Recently uploaded on** - The status of your data as it's being collected.
    - **Recently transformed on** - The status of your data as it's being processed.
    - The **Tenant ID** - The ID for your Azure AD tenant.
    - The **Tenant name** - The name for your Azure AD tenant. 
    - The ellipses **(...)** menu 
        - To view details about the **Sentry Appliance Configuration**, select **Configure**.
        - To delete the corresponding **Authorization Systems**, select **Delete**.

1. You can also use the following options:

    - **Search** - Enter an ID or IP address to display specific authorization systems.
    - **Filters** - Select the uploaded and transformed systems you want to display: **All** or **Online** . 
    - **||| Columns** - Select the columns you want to display: **Recently Uploaded On** and **Recently Transformed On**.
    - To return to the system default settings, Select **Reset to default**.
    - **Deploy** - Select to deploy the Sentry Appliance. 

## View configuration settings for authorization systems

1. Select the **Authorization systems** tab.

    The **Authorization systems** tab has two subtabs: 

    - **List** 
    - **Folders**

### View configuration settings for the accounts you've selected

1. Select the **List** subtab.

1. In the **List** tab, select settings to display information you want to about the account you've selected:

    - **Controller Status** - From the drop-down list, select **All**, **Enabled**, or **Disabled**.
    - **Benchmark Status** - From the drop-down list, select **All**, **Online**, or **Offline**.
    - **Entitlement Status** - From the drop-down list, select **All**, **Online**, or **Offline**.
    - **Search** - Enter an account name or ID.
    - **Apply** - Select **Apply** to apply your settings.
    - **Reset Filter** - Select **Reset Filter** to discard your settings.
    - The ellipses **(...)** menu - Select **Collect Data** or **Delete**.

1. The authorization systems table displays following information about the authorization system you've selected:

    - **Name** - The name of the authorization system.
    - **ID number** - The identification number of the authorization system.
    - **Controller Status** - The controller status: **All**, **Enabled**, or **Disabled**.
    - **Benchmark status** - The benchmark status: **All**, **Online**, or **Offline**.
    - **Entitlements Status** - The entitlement status: **All**, **Online**, or **Offline**.
    - **||| Columns** - Select the columns you want to display: **Controller Status**, **Benchmark status**, and **Entitlements Status**.

1. To return to the system default settings, select **Reset to default**.

### View configuration settings for the folders you've selected

1. Select the **Folders** subtab.

1. In the **Folders** subtab, select settings to display information you want to about the folders you've selected:

    - **Folder Name** - The name of the folder.
    - **Created On** - The date the folder was created.
    - **Created By** - The name of the person who created the folder.
    - **Last Modified On** - The date the folder was last modified.
    - **Last Modified By** - The name of the person who last modified the folder.
    - The ellipses **(...)** menu - From the menu, select **Copy Folder Id**, **Edit**, or **Delete**.
    - **Search** - Enter a folder name.
    - **||| Columns** - Select the columns you want to display: **Created On**, **Created By**, **Last Modified On**, and **Last Modified By**.
    - **Create Folder** - Create a new folder. 

1. To return to the system default settings, select **Reset to default**.


## View configuration settings for inventory

1. Select the **Inventory** tab.

    The **Inventory** tab has two subtabs:

    - **Inventory** 
    - **Licensing**

### View configuration settings for inventory

1. Select the **Inventory** subtab.

1. In the **Inventory** subtab, select settings to display information about the authorization system you've selected:

    - **Authorization System Name** - The name of the authorization system.
    - **Dynamodb Table**
    - **EC2 Instance**
    - **VPC Internet Gateway**
    - **Elasticache Cluster**
    - **Lambda Function**
    - **Search** - Enter a name.
    - **||| Columns** - Select the columns you want to display: **Dynamodb Table**, **EC2 Instance**, **VPC Internet Gateway**, **Elasticache Cluster**, and **Lambda Function**.

1. To return to the system default settings, select **Reset to default**.

### View configuration settings for licensing

1. Select the **Licensing** subtab.

1. In the **Licensing** subtab, select settings to display information about the authorization system you've selected:

    - **Authorization System** - A list of accounts.
    - **Total Number of Licenses** - The number of licenses.
    - **Search** - Enter a name.

<!---## Next steps--->