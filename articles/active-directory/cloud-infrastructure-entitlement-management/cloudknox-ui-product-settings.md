---
title: Microsoft CloudKnox Permissions Management - View and modify configuration settings for data collection
description: How to view and modify configuration settings for data collection in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 01/26/2022
ms.author: v-ydequadros
---

# View and modify configuration settings for data collection

When you first open Microsoft CloudKnox Permissions Management (CloudKnox) after successfully enabling CloudKnox, the CloudKnox **Settings** dashboard displays. You use the **Settings** dashboard to set, view, and modify configuration settings for data collection information.

## View configuration settings for data collection

1. To open the CloudKnox Settings dashboard, in the upper right of the CloudKnox home page , select **Settings** (the gear icon).

    The **Settings** dashboard has three tabs:

    - **Data collectors** - Use this tab to configure settings for the data you want to collect from your authorization system.
    - **Authorization systems** - Use this tab to configure settings for the authorization system you want to use.
    - **Inventory** - Use this tab to configure settings for inventory and licensing for the authorization system you selected in the **Authorization systems** tab.

1. In the **Authorization systems** tab, select the authorization system whose data you want to collect:

    - For Amazon Web Services (AWS), select **AWS**. 
    - For Microsoft Azure, select **Azure**.
    - For Google Cloud Platform (GCP), select **GCP**.

1. Return to the **Data collectors** tab and view the following information about the authorization system on which you are collecting data:

    - The **Name** of the authorization system
    - The **ID number** of your account, subscription, or project.
    - The **IP address**
    - The **Data types**
    - **Recently uploaded on** - The status of your data as it's being collected.
    - **Recently transformed on** - The status of your data as it's being processed.
    - The **Tenant ID** - The ID for your Azure AD tenant.
    - The **Tenant name** - The name for your Azure AD tenant.
    - The ellipses **(...)** menu 
        - To view details about the **Sentry appliance configuration**, select **Configure**.
        - To delete the corresponding **Authorization systems**, select **Delete**.

1. To view a more specific data set, use the following options on the **Data collectors** tab:

    - **Search** - Enter an ID or IP address to display specific authorization systems.
    - **Filters** - Select the uploaded and transformed systems you want to display: **All** or **Online** . 
    - **||| Columns** - Select the columns you want to display or hide: **Recently uploaded on** and **Recently transformed on**. 
        - To return to the system default settings, Select **Reset to default**.
    - **Deploy** - Select to deploy the Sentry Appliance. 

## View configuration settings for authorization systems

1. In the **Settings** dashboard, select the **Authorization systems** tab.

    The **Authorization systems** tab has two subtabs: 

    - **List** - This subtab displays information about your accounts.
    - **Folders** - This subtab displays information about your folders.

### View configuration settings for the accounts you've selected

1. In the **Authorization systems** tab, select the **List** subtab.Then select the following settings to display information you want to about an account:

    - **Controller status** - From the drop-down list, select **All**, **Enabled**, or **Disabled**.
    - **Benchmark status** - From the drop-down list, select **All**, **Online**, or **Offline**.
    - **Entitlement status** - From the drop-down list, select **All**, **Online**, or **Offline**.
    - **Search** - Enter an account name or ID.
    - **Apply** - Select **Apply** to apply your settings.
    - **Reset filter** - Select **Reset Filter** to discard your settings.

1. The authorization systems table displays following information about the authorization system you've selected:

    - **Name** - The name of the authorization system.
    - **ID number** - The identification number of the authorization system.
    - **Controller status** - The controller status: **All**, **Enabled**, or **Disabled**.
    - **Benchmark status** - The benchmark status: **All**, **Online**, or **Offline**.
    - **Entitlements Status** - The entitlement status: **All**, **Online**, or **Offline**.
    - **||| Columns** - Select the columns you want to display: **Controller status**, **Benchmark status**, and **Entitlements status**.
    - The ellipses **(...)** menu - Select **Collect data** or **Delete**.

1. To return to the system default settings, select **Reset to default**.

### View configuration settings for the folders you've selected

1. In the **Authorization systems** tab, select the **Folders** subtab. Then select the following settings to display information you want to about a folder:

    - **Folder name** - The name of the folder.
    - **Created on** - The date the folder was created.
    - **Created by** - The name of the person who created the folder.
    - **Last modified on** - The date the folder was last modified.
    - **Last modified by** - The name of the person who last modified the folder.
    - The ellipses **(...)** menu - From the menu, select **Copy folder ID**, **Edit**, or **Delete**.
    - **Search** - Enter a folder name.
    - **||| Columns** - Select the columns you want to display: **Created on**, **Created by**, **Last modified on**, and **Last modified by**.
    - **Create Folder** - Create a new folder. 

1. To return to the system default settings, select **Reset to default**.


## View configuration settings for inventory

- In the **Settings** dashboard, select the **Inventory** tab.

    The **Inventory** tab has two subtabs:

    - **Inventory** 
    - **Licensing**

### View configuration settings for inventory

1. Select the **Inventory** subtab, and then select an authorization system.
1. Select settings to display information about the authorization system you've selected:

    - **Authorization system name** - The name of the authorization system.
    - **Dynamodb table**
    - **EC2 instance**
    - **VPC internet gateway**
    - **Elasticache cluster**
    - **Lambda function**
    - **Search** - Enter a name.
    - **||| Columns** - Select the columns you want to display: **Dynamodb table**, **EC2 instance**, **VPC internet gateway**, **Elasticache cluster**, and **Lambda function**.

1. To return to the system default settings, select **Reset to default**.

### View configuration settings for licensing

1. Select the **Licensing** subtab, and then select an authorization system.

1. In the **Licensing** subtab, select settings to display information about the authorization system you've selected:

    - **Authorization system** - A list of accounts in the authorization system.
    - **Total number of licenses** - The number of licenses.
    - **Search** - Enter a name.

<!---## Next steps--->