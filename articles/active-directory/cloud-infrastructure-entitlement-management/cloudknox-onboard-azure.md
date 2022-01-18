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
ms.date: 01/17/2022
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

1. From the **Permission Level** drop-down list, select the required **Subscription Level**.

1. From the **Controller Status** drop-down menu, to assign the **Reader** role, select **Disabled for read-only permissions**.

    To assign the **Owner** role, select **Enabled for read and write permissions**.

1. In the **Azure Subscription IDs** box, enter your Azure subscription ID.

    1. To locate the Azure Subscription ID, open the **Enterprise applications** page in Azure.

    1. To locate your CloudKnox subscription, on the **Overview** page, search for *CloudKnox* .

        The **Subscriptions** page opens. The **Subscription name** section of the page displays a list of CloudKnox subscriptions available to you. 

    1. From the **Subscription Id** column, copy the subscription ID you want.

    1. Return to CloudKnox and paste the subscription ID in the **Azure Subscription IDs** box.

1. Select **Next**.

1. In the **CloudKnox Onboarding – Summary** dialog, review the information you’ve added, and then select **View Now & Save**.

    On the **Data Collectors** tab, check the **Recently Uploaded On** and **Recently Transformed On** columns. You’ll see that CloudKnox has started collecting data.

1. To confirm that data collection has started, select **Authorization Systems** tab, and in the table, the **Status** column displays **Collecting Data.**

<!---## Next steps--->

<!---For information on how to onboard Amazon Web Services (AWS), see [Onboard the (AWS) authorization system](cloudknox-onboard-aws.html).--->
<!---For information on how to onboard Google Cloud Platform (GCP), see [Onboard the GCP authorization system](cloudknox-onboard-gcp.html).--->