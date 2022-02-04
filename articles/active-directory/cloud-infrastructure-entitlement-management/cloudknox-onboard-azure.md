---
title:  Onboard a Microsoft Azure subscription in CloudKnox Permissions Management - 
description: How to a Microsoft Azure subscription on CloudKnox Permissions Management.
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

# Onboard a Microsoft Azure subscription

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

This article describes how to onboard a Microsoft Azure subscription or subscriptions on CloudKnox Permissions Management (CloudKnox). This creates a new authorization system representing the Azure subscription in CloudKnox. 

> [!NOTE] 
> A Global Administrator or a Super Admin (Admin for all authorization system types) can perform the tasks in this article after the Global Administrator has initially completed the steps provided in [Enable CloudKnox on your Azure Active Directory tenant](cloudknox-onboard-enable-tenant.md).

## Prerequisites

To add CloudKnox to your Azure AD tenant:
- You must have an Azure AD user account, Azure CLI on your system, or an Azure subscription. If you don't already have one, [create a free account](https://azure.microsoft.com/free/).
- You must have **Microsoft.Authorization/roleAssignments/write** permission at the subscription or management group scope to perform the tasks in Step 3. If not, you can ask someone who does to perform these tasks.

## Onboard an Azure subscription

1. If the **Data Collectors** tab isn't displayed: 

    - In the CloudKnox homepage, select **Settings** (the gear icon), and then select the **Data Collectors** tab.

1. On the **Data Collectors** tab, select **Azure**, and then select **Create Configuration**.

1. **CloudKnox On Boarding - Azure Subscription Details**
	1. On the **CloudKnox Onboarding - Azure Subscription Details** page, enter **Subscription IDs** that you want to onboard.
		> [!NOTE] 
	    	> To locate the Azure subscription IDs, open the **Subscriptions** page in Azure.
	    	> You can enter up to 10 subscriptions IDs. Click the plus icon next to the text box to insert more subscriptions.

	1. From the **Scope** drop-down list, select **Subscription** or **Management Group**. The script box displays the role assignment script. 
		> [!NOTE] 
	    	> Select **Subscription** if you want to assign permissions separately for each individual subscription. The generated script has to be executed once per subscription.
	    	> Select **Management Group** if all of your subscriptions are under one management group. The generated script has to be executed once for the management group .
	    	
	1. To give this role assignment to the service principal, copy the script to a file on your system where Azure CLI is installed and execute it once per subscription or just once for the whole management group.
		<!---Add info on how to do this manually.--->
	1. Return to **CloudKnox Onboarding - Azure Subscription Details** page, and select **Next**.

1. In **CloudKnox Onboarding – Summary** page, review the information you’ve added, and then select **Verify Now & Save**.

    The following message appears: **Successfully Created Configuration.**

    On the **Data Collectors** tab, the **Recently Uploaded On** column displays **Collecting** and the **Recently Transformed On** column displays **Processing.** 

    This step confirms that CloudKnox has started collecting and processing your Azure data.

1. To view your data, select the **Authorization Systems** tab.

    The **Status** column in the table displays **Collecting Data.**

    The data collection process will take some time, depending on the size of the account and how much data is available for collection.


## Next steps

- For information on how to onboard an Amazon Web Services (AWS) account, see [Onboard an Amazon Web Services (AWS) account](cloudknox-onboard-aws.md).
- For information on how to onboard a Google Cloud Platform (GCP) project, see [Onboard a Google Cloud Platform (GCP) project](cloudknox-onboard-gcp.md).
<!--- - For information on how to enable or disable the controller, see [Enable or disable the controller](cloudknox-onboard-enable-controller.md).
- For information on how to add an account/subscription/project after onboarding, see [Add an account/subscription/project after onboarding is complete](cloudknox-onboard-add-account-after-onboarding.md)--->
