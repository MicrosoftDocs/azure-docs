---
title:  Microsoft CloudKnox Permissions Management - Onboard  a Microsoft Azure subscription
description: How to a Microsoft Azure subscription on Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/24/2022
ms.author: v-ydequadros
---

# Onboard a Microsoft Azure subscription

This topic describes how to onboard a Microsoft Azure subscription or subscriptions on Microsoft CloudKnox Permissions Management (CloudKnox). This creates a new authorization system representing the Azure subscriptions' roles in CloudKnox. 

> [!NOTE] 
> Any group member can perform the tasks in this article after the Global Administrator has initially completed the steps provided in [Enable CloudKnox on your Azure Active Directory tenant](cloudknox-onboard-enable-tenant.md).

## Onboard an Azure subscription

1. If the **Data Collectors** tab isn't displayed: 

    - In the CloudKnox homepage, select **Settings** (the gear icon), and then select the **Data Collectors** tab.

1. On the **Data Collectors** tab, select **Azure**, and then select **Create Configuration**.

1. To view entitlement data in CloudKnox, in the **Azure Subscription IDs** box, enter your Azure subscription ID.

    1. To locate the Azure Subscription ID, open the **Subscriptions** page in Azure.

    1. Return to CloudKnox and paste the subscription ID in the **Azure Subscription IDs** box.

    1. Next, locate your CloudKnox subscription. On the **Overview** page, search for *CloudKnox*.

        The **Subscriptions** page opens. The **Subscription name** section of the page displays a list of Azure subscriptions available to you. 

    1. From the **Subscription Id** column, copy the subscription ID you want.

    1. Return to CloudKnox and paste the subscription ID in the **Subscription IDs** box.

	    You can enter up to 10 subscriptions IDs. Click the plus icon next to the text box to insert more subscriptions and repeat Step 3.

1. From the **Permission Level** drop-down list, select the required **Subscription Level**.

1. From the **Controller Status** drop-down menu: 

    - To assign the **Reader** role, select **Disabled** for read-only permissions.
    - To assign the **Owner** role, select **Enabled** for read and write permissions.

    The script box displays the role assignment script.

1. To give this role assignment to the service principal, copy the script from the box and paste it in the command-line app.

    <!---Add info on how to do this manually.--->

1. Return to CloudKnox and select **Next**.

1. In **CloudKnox Onboarding – Summary**, review the information you’ve added, and then select **View Now & Save**.

    The following message appears: **Successfully created configuration.**

    On the **Data Collectors** tab, the **Recently Uploaded On** column displays **Collecting** and the **Recently Transformed On** column displays **Processing.** 

    This step confirms that CloudKnox has started collecting and processing your Azure data.

1. To view your data, select the **Authorization Systems** tab.

    The **Status** column in the table displays **Collecting Data.**

    The data collection process will take some time, depending on the size of the account and how much data is available for collection.


## Next steps

- For information on how to onboard an Amazon Web Services (AWS) account, see [Onboard an Amazon Web Services (AWS) account](cloudknox-onboard-aws.md).
- For information on how to onboard a Google Cloud Platform (GCP) project, see [Onboard a Google Cloud Platform (GCP) project](cloudknox-onboard-gcp.md).