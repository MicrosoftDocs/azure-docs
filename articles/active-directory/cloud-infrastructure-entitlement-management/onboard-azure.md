---
title:  Onboard a Microsoft Azure subscription in Permissions Management
description: How to a Microsoft Azure subscription on Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 09/15/2023
ms.author: jfields
---

# Onboard a Microsoft Azure subscription

This article describes how to onboard a Microsoft Azure subscription or subscriptions on Permissions Management. Onboarding a subscription creates a new authorization system to represent the Azure subscription in Permissions Management.

> [!NOTE]
> You must have [Global Administrator](https://aka.ms/globaladmin) permissions to perform the tasks in this article.

## Explanation

The Permissions Management service is built on Azure, and given you're onboarding your Azure subscriptions to be monitored and managed, setup is simple with few moving parts to configure. Below is what is required to configure onboarding:

* When your tenant is onboarded, an application is created in the tenant.
* This app requires 'reader' permissions on the subscriptions
* For controller functionality, the app requires 'User Access Administrator' to create and implement right-size roles

## Prerequisites

To add Permissions Management to your Microsoft Entra tenant:
- You must have a Microsoft Entra user account and an Azure command-line interface (Azure CLI) on your system, or an Azure subscription. If you don't already have one, [create a free account](https://azure.microsoft.com/free/).
- You must have **Microsoft.Authorization/roleAssignments/write** permission at the subscription or management group scope to perform these tasks. If you don't have this permission, you can ask someone who has this permission to perform these tasks for you.

## How to onboard an Azure subscription

1. If the **Data Collectors** dashboard isn't displayed when Permissions Management launches:

    - In the Permissions Management home page, select **Settings** (the gear icon, top right), and then select the **Data Collectors** subtab.

1. On the **Data Collectors** dashboard, select **Azure**, and then select **Create Configuration**.

### 1. Add Azure subscription details

Choose from three options to manage Azure subscriptions. 

#### Option 1: Automatically manage 

This option lets subscriptions be automatically detected and monitored without further work required. A key benefit of automatic management is that any current or future subscriptions found are onboarded automatically. The steps to detect a list of subscriptions and onboard for collection are as follows:  

- Firstly, grant Reader role to Cloud Infrastructure Entitlement Management application at management group or subscription scope. To do this:  

1. In the EPM portal, left-click the cog on the top right-hand side.  
1. Go to data collectors tab 
1. Ensure **Azure** is selected.
1. Click **Create Configuration.**
1. For onboarding mode, select **Automatically Manage.**

    > [!NOTE]
    > The steps listed on the screen outline how to create the role assignment for the Cloud Infrastructure Entitlements Management application. This is performed manually in the Microsoft Entra ID console, or programmatically with PowerShell or the Azure CLI.

- Once complete, Click **Verify Now & Save.**

To view status of onboarding after saving the configuration: 

1. Collectors are now listed and change through status types. For each collector listed with a status of **Collected Inventory,** click on that status to view further information. 
1. You can then view subscriptions on the In Progress page.

#### Option 2: Enter authorization systems 

You have the ability to specify only certain subscriptions to manage and monitor with Permissions Management (up to 100 per collector). Follow the steps below to configure these subscriptions to be monitored: 

1. For each subscription you wish to manage, ensure that the ‘Reader’ role has been granted to Cloud Infrastructure Entitlement Management application for the subscription. 
1. In the EPM portal, click the cog on the top right-hand side. 
1. Go to data collectors tab 
1. Ensure 'Azure' is selected
1. Click ‘Create Configuration’ 
1. Select ‘Enter Authorization Systems’ 
1. Under the Subscription IDs section, enter a desired subscription ID into the input box. Click the “+” up to nine extra times, putting a single subscription ID into each respective input box. 
1. Once you have input all of the desired subscriptions, click next 
1. Click ‘Verify Now & Save’ 
1. Once the access to read and collect data is verified, collection will begin. 

To view status of onboarding after saving the configuration: 

1. Go to the **Data Collectors** tab.  
1. Click on the status of the data collector.  
1. View subscriptions on the In Progress page.

#### Option 3: Select authorization systems 

This option detects all subscriptions that are accessible by the Cloud Infrastructure Entitlement Management application.  

- Firstly, grant Reader role to Cloud Infrastructure Entitlement Management application at management group or subscription scope.  

1. In the Permissions Management portal, click the cog on the top right-hand side.  
1. Go to the **Data Collectors** tab.
1. Ensure **Azure** is selected.
1. Click **Create Configuration.** 
1. For onboarding mode, select **Automatically Manage.** 

    > [!NOTE]
    > The steps listed on the screen outline how to create the role assignment for the Cloud Infrastructure Entitlements Management application. You can do this manually in the Microsoft Entra ID console, or programmatically with PowerShell or the Azure CLI.

- Once complete, Click **Verify Now & Save.** 

To view status of onboarding after saving the configuration: 

1. Go to newly create Data Collector row under Azure data collectors. 
1. Click on Status column when the row has **Pending** status 
1. To onboard and start collection, choose specific ones subscriptions from the detected list and consent for collection.

### 2. Review and save.

1. In **Permissions Management Onboarding – Summary** page, review the information you've added, and then select **Verify Now & Save**.

    The following message appears: **Successfully Created Configuration.**

    On the **Data Collectors** tab, the **Recently Uploaded On** column displays **Collecting**. The **Recently Transformed On** column displays **Processing.**

    The status column in your Permissions Management UI shows you which step of data collection you're at:  
 
    - **Pending**: Permissions Management has not started detecting or onboarding yet. 
    - **Discovering**: Permissions Management is detecting the authorization systems. 
    - **In progress**: Permissions Management has finished detecting the authorization systems and is onboarding. 
    - **Onboarded**: Data collection is complete, and all detected authorization systems are onboarded to Permissions Management. 

### 3. View the data.

1. To view the data, select the **Authorization Systems** tab.

    The **Status** column in the table displays **Collecting Data.**

    The data collection process will take some time, depending on the size of the account and how much data is available for collection.


## Next steps

- For information on how to start viewing information about your authorization system in Permissions Management, see [View key statistics and data about your authorization system](ui-dashboard.md).
