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
ms.date: 02/03/2022
ms.author: v-ydequadros
---

# Onboard a Microsoft Azure subscription

> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

This article describes how to onboard a Microsoft Azure subscription or subscriptions on CloudKnox Permissions Management (CloudKnox). This creates a new authorization system representing the Azure subscriptions' roles in CloudKnox. 

> [!NOTE] 
> Any group member can perform the tasks in this article after the Global Administrator has initially completed the steps provided in [Enable CloudKnox on your Azure Active Directory tenant](cloudknox-onboard-enable-tenant.md).

## Prerequisites

To add CloudKnox to your Azure AD tenant:
- You must have an Azure AD user account, Azure CLI on your system, or an Azure subscription. If you don't already have one, [create a free account](https://azure.microsoft.com/free/).
- The group administrator must have **Subscription role management access** permissions to perform the tasks in Step 3. If they don’t have these permissions, they can ask someone who does to get the information for them.

## Onboard an Azure subscription

1. If the **Data collectors** tab isn't displayed: 

    - In the CloudKnox homepage, select **Settings** (the gear icon), and then select the **Data collectors** tab.

1. On the **Data collectors** tab, select **Azure**, and then select **Create configuration**.

1. To view entitlement data in CloudKnox, in the **Azure subscription IDs** box, enter your Azure subscription ID.

    > [!NOTE] 
    > The group administrator must have **Subscription role management access** permissions to perform the tasks in Step 3. If you don’t have this access, skip this step and ask someone who has this permission to get the information for you.

    1. To locate the Azure subscription ID, open the **Subscriptions** page in Azure.

    1. Return to CloudKnox and paste the subscription ID in the **Azure subscription IDs** box.

    1. Next, locate your CloudKnox subscription. On the **Overview** page, search for *CloudKnox*.

        The **Subscriptions** page opens. The **Subscription name** section of the page displays a list of Azure subscriptions available to you. 

    1. From the **Subscription ID** column, copy the subscription ID you want.

    1. Return to CloudKnox and paste the subscription ID in the **Subscription IDs** box.

	    You can enter up to 10 subscriptions IDs. Click the plus icon next to the text box to insert more subscriptions and repeat Step 3.

1. From the **Permission level** drop-down list, select the required **Subscription level**.

1. From the **Controller status** drop-down menu: 

    - To assign the **Reader** role, select **Disabled** for read-only permissions.
    - To assign the **Owner** role, select **Enabled** for read and write permissions.

    The script box displays the role assignment script.

1. To give this role assignment to the service principal, copy the script from the box and paste it in the command-line app.

    <!---Add info on how to do this manually.--->

1. Return to CloudKnox and select **Next**.

1. In **CloudKnox onboarding – Summary**, review the information you’ve added, and then select **View now & save**.

    The following message appears: **Successfully created configuration.**

    On the **Data Collectors** tab, the **Recently uploaded on** column displays **Collecting** and the **Recently transformed on** column displays **Processing.** 

    This step confirms that CloudKnox has started collecting and processing your Azure data.

1. To view your data, select the **Authorization systems** tab.

    The **Status** column in the table displays **Collecting data.**

    The data collection process will take some time, depending on the size of the account and how much data is available for collection.


## Next steps

- For information on how to onboard an Amazon Web Services (AWS) account, see [Onboard an Amazon Web Services (AWS) account](cloudknox-onboard-aws.md).
- For information on how to onboard a Google Cloud Platform (GCP) project, see [Onboard a Google Cloud Platform (GCP) project](cloudknox-onboard-gcp.md).
- For an overview on CloudKnox, see [What is CloudKnox Permissions Management?](cloudknox-overview.md).
- For information on how to start viewing information about your authorization system in CloudKnox, see [View key statistics and data about your authorization system](cloudknox-ui-dashboard.md).