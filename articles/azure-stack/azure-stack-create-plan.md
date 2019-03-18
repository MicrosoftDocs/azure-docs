---
title: Create a plan in Azure Stack | Microsoft Docs
description: As a cloud administrator, create a plan that lets subscribers provision virtual machines.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid: 3dc92e5c-c004-49db-9a94-783f1f798b98
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/07/2019
ms.author: sethm
ms.reviewer: efemmano
ms.lastreviewed: 03/07/2019

---
# Create a plan in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

[Plans](azure-stack-key-features.md) are groupings of one or more services and their quotas. As a provider, you can create plans to offer to your users. In turn, your users subscribe to your offers to use the plans, services, and quotas they include. This example shows you how to create a plan that includes the compute, network, and storage resource providers. This plan gives subscribers the ability to provision virtual machines.

## Create a plan (1902 and later)

1. Sign in to the [Azure Stack administrator portal](https://adminportal.local.azurestack.external).

2. To create a plan and offer that users can subscribe to, select **+ Create a resource**, then **Offers + Plans**, then **Plan**.
  
   ![Select a plan](media/azure-stack-create-plan/select-plan.png)

3. A tabbed user interface appears that enables you to specify the plan name, add services, and define quotas for each of the selected services. Most importantly, you can review the details of the offer you create, before you decide to create it.

   Under the **Basics** tab of the **New plan** window, enter a **Display name** and a **Resource name**. The display name is the plan's friendly name that operators can see. Note that in the administrator portal, plan details are only visible to operators.

   ![Specify details](media/azure-stack-create-plan/plan-name.png)

4. Create a new **Resource Group**, or select an existing one, as a container for the plan.

   ![Specify the resource group](media/azure-stack-create-plan/resource-group.png)

5. Select the **Services** tab, and then select the checkbox for **Microsoft.Compute**, **Microsoft.Network**, and **Microsoft.Storage**.
  
   ![Select services](media/azure-stack-create-plan/services.png)

6. Select the **Quotas** tab. Next to **Microsoft.Storage**, choose either the default quota from the dropdown box, or select **Create New** to create a customized quota.
  
   ![Quotas](media/azure-stack-create-plan/quotas.png)

7. If you're creating a new quota, enter a **Name** for the quota, and then specify the quota values. Select **OK** to create the quota.

   ![New quota](media/azure-stack-create-plan/new-quota.png)

8. Repeat steps 6 and 7 to create and assign quotas for **Microsoft.Network** and **Microsoft.Compute**. When all three services have quotas assigned, they'll look like the next example.

   ![Complete quota assignments](media/azure-stack-create-plan/all-quotas-assigned.png)

9. Select **Review + create** to review the plan. Review all values and quotas to ensure they are correct. Note the expansion arrows to the left of each service/quota pair. A new feature enables you to expand the quotas in the selected plans, one at a time, to view the details of each quota in a plan and go back to make any necessary edits.

   ![Create the plan](media/azure-stack-create-plan/create.png)

10. When you are ready, select **Create** to create the plan.

11. To see the new plan, select **Plans**, then search for the plan and select its name. If your list of resources is long, use **Search** to locate your plan by name.

## Create a plan (1901 and earlier)

1. Sign in to the [Azure Stack administrator portal](https://adminportal.local.azurestack.external).

2. To create a plan and offer that users can subscribe to, select **+ Create a resource**, then **Offers + Plans**, then **Plan**.
  
   ![Select a plan](media/azure-stack-create-plan/select-plan1901.png)

3. Under **New plan**, enter a **Display name** and a **Resource name**. The display name is the plan's friendly name that users can see. Only the admin can see the resource name, which admins use to work with the plan as an Azure Resource Manager resource.

   ![Specify details](media/azure-stack-create-plan/plan-name1901.png)

4. Create a new **Resource Group**, or select an existing one, as a container for the plan.

   ![Specify the resource group](media/azure-stack-create-plan/resource-group1901.png)

5. Select **Services** and then select the checkbox for **Microsoft.Compute**, **Microsoft.Network**, and **Microsoft.Storage**. Next, choose **Select** to save the configuration. Checkboxes appear when the mouse hovers over each option.
  
   ![Select services](media/azure-stack-create-plan/services1901.png)

6. Select **Quotas**, **Microsoft.Storage (local)**, and then choose either the default quota or select **Create new quota** to create a customized quota.
  
   ![Quotas](media/azure-stack-create-plan/quotas1901.png)

7. If you're creating a new quota, enter a **Name** for the quota > specify the quota values > select **OK**. The **Create quota** dialog closes.

   ![New quota](media/azure-stack-create-plan/new-quota1901.png)

   You then select the new quota you created. Selecting the quota assigns it and closes the selection dialog.
  
   ![Assign the quota](media/azure-stack-create-plan/assign-quota1901.png)

8. Repeat steps 6 and 7 to create and assign quotas for **Microsoft.Network (local)** and **Microsoft.Compute (local)**. When all three services have quotas assigned, they'll look like the next example.

   ![Complete quota assignments](media/azure-stack-create-plan/all-quotas-assigned1901.png)

9. Under **Quotas**, choose **OK**, and then under **New plan**, choose **Create** to create the plan.

    ![Create the plan](media/azure-stack-create-plan/create1901.png)

10. To see your new plan, select **All resources**, then search for the plan and select its name. If your list of resources is long, use **Search** to locate your plan by name.

    ![Review the plan](media/azure-stack-create-plan/plan-overview1901.png)

## Next steps

* [Create an offer](azure-stack-create-offer.md)
