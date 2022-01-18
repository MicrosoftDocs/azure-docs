---
title:  Microsoft CloudKnox Permissions Management - Onboard the Microsoft Azure authorization system
description: How to enable the Microsoft Azure authorization system on Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/18/2022
ms.author: v-ydequadros
---

# Onboard the Microsoft Azure authorization system

This topic describes how to onboard the Microsoft Azure authorization system on Microsoft CloudKnox Permissions Management (CloudKnox).

> [!NOTE] 
> To complete this task you must have Global Administrator permissions.

> [!NOTE] 
> Before beginning this task, make sure you have completed the steps provided in Enable CloudKnox on your Azure Active Directory tenant.

<!---[Enable CloudKnox on your Azure Active Directory tenant](cloudknox-onboard-enable-tenant.html).--->

**To onboard the Azure authorization system on CloudKnox:**

1. If the **Data Collectors** tab isn't displayed: 

    - In the CloudKnox homepage, select **Settings** (the gear icon), and then select the **Data Collectors** tab.

1. On the **Data Collectors** tab, select **Azure**, and then select **Create Configuration**.

1. To view entitlement data in CloudKnox, in the **Azure Subscription IDs** box, enter your Azure subscription ID.

    1. To locate the Azure Subscription ID, open the **Enterprise applications** page in Azure.

    1. Return to CloudKnox and paste the subscription ID in the **Azure Subscription IDs** box.

    1. Next, locate your CloudKnox subscription. On the **Overview** page, search for *CloudKnox*.

        The **Subscriptions** page opens. The **Subscription name** section of the page displays a list of CloudKnox subscriptions available to you. 

    1. From the **Subscription Id** column, copy the subscription ID you want.

    1. Return to CloudKnox and paste the subscription ID in the **Subscription IDs** box.

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

    The data collection process takes a few minutes, so you may have to refresh your screen a few times to see the data.

<!---## Next steps--->

<!---For information on how to onboard Amazon Web Services (AWS), see [Onboard the (AWS) authorization system](cloudknox-onboard-aws.html).--->
<!---For information on how to onboard Google Cloud Platform (GCP), see [Onboard the GCP authorization system](cloudknox-onboard-gcp.html).--->