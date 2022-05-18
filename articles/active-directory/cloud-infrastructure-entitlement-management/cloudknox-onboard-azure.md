---
title:  Onboard a Microsoft Azure subscription in CloudKnox Permissions Management
description: How to a Microsoft Azure subscription on CloudKnox Permissions Management.
services: active-directory
author: mtillman
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 04/20/2022
ms.author: mtillman
---

# Onboard a Microsoft Azure subscription

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

> [!NOTE] 
> The CloudKnox Permissions Management (CloudKnox) PREVIEW is currently not available for tenants hosted in the European Union (EU).

This article describes how to onboard a Microsoft Azure subscription or subscriptions on CloudKnox Permissions Management (CloudKnox). Onboarding a subscription creates a new authorization system to represent the Azure subscription in CloudKnox. 

> [!NOTE] 
> A *global administrator* or *super admin* (an admin for all authorization system types) can perform the tasks in this article after the global administrator has initially completed the steps provided in [Enable CloudKnox on your Azure Active Directory tenant](cloudknox-onboard-enable-tenant.md).

## Prerequisites

To add CloudKnox to your Azure AD tenant:
- You must have an Azure AD user account and an Azure command-line interface (Azure CLI) on your system, or an Azure subscription. If you don't already have one, [create a free account](https://azure.microsoft.com/free/).
- You must have **Microsoft.Authorization/roleAssignments/write** permission at the subscription or management group scope to perform these tasks. If you don't have this permission, you can ask someone who has this permission to perform these tasks for you.


## View a training video on enabling CloudKnox in your Azure AD tenant

To view a video on how to enable CloudKnox in your Azure AD tenant, select [Enable CloudKnox in your Azure AD tenant](https://www.youtube.com/watch?v=-fkfeZyevoo).

## How to onboard an Azure subscription

1. If the **Data Collectors** dashboard isn't displayed when CloudKnox launches: 

    - In the CloudKnox home page, select **Settings** (the gear icon), and then select the **Data Collectors** subtab.

1. On the **Data Collectors** dashboard, select **Azure**, and then select **Create Configuration**.

### 1. Add Azure subscription details

1. On the **CloudKnox Onboarding - Azure Subscription Details** page, enter the **Subscription IDs** that you want to onboard.
	
   > [!NOTE] 
   > To locate the Azure subscription IDs, open the **Subscriptions** page in Azure.
   > You can enter up to 10 subscriptions IDs. Select the plus sign **(+)** icon next to the text box to enter more subscriptions.

1. From the **Scope** dropdown, select **Subscription** or **Management Group**. The script box displays the role assignment script. 
	
   > [!NOTE] 
   > Select **Subscription** if you want to assign permissions separately for each individual subscription. The generated script has to be executed once per subscription. 
   > Select **Management Group** if all of your subscriptions are under one management group. The generated script must be executed once for the management group.

1. To give this role assignment to the service principal, copy the script to a file on your system where Azure CLI is installed and execute it. 

    You can execute the script once for each subscription, or once for all the subscriptions in the management group.

1. From the **Enable Controller** dropdown, select:

    - **True**, if you want the controller to provide CloudKnox with read and write access so that any remediation you want to do from the CloudKnox platform can be done automatically.
    - **False**, if you want the controller to provide CloudKnox with read-only access.

1. Return to **CloudKnox Onboarding - Azure Subscription Details** page and select **Next**.

### 2. Review and save.

- In **CloudKnox Onboarding – Summary** page, review the information you’ve added, and then select **Verify Now & Save**.

    The following message appears: **Successfully Created Configuration.**

    On the **Data Collectors** tab, the **Recently Uploaded On** column displays **Collecting**. The **Recently Transformed On** column displays **Processing.** 

    You have now completed onboarding Azure, and CloudKnox has started collecting and processing your data.

### 3. View the data.

- To view the data, select the **Authorization Systems** tab. 

    The **Status** column in the table displays **Collecting Data.**

    The data collection process will take some time, depending on the size of the account and how much data is available for collection.


## Next steps

- For information on how to onboard an Amazon Web Services (AWS) account, see [Onboard an Amazon Web Services (AWS) account](cloudknox-onboard-aws.md).
- For information on how to onboard a Google Cloud Platform (GCP) project, see [Onboard a Google Cloud Platform (GCP) project](cloudknox-onboard-gcp.md).
- For information on how to enable or disable the controller after onboarding is complete, see [Enable or disable the controller](cloudknox-onboard-enable-controller-after-onboarding.md).
- For information on how to add an account/subscription/project after onboarding is complete, see [Add an account/subscription/project after onboarding is complete](cloudknox-onboard-add-account-after-onboarding.md).
- For an overview on CloudKnox, see [What's CloudKnox Permissions Management?](cloudknox-overview.md).
- For information on how to start viewing information about your authorization system in CloudKnox, see [View key statistics and data about your authorization system](cloudknox-ui-dashboard.md).