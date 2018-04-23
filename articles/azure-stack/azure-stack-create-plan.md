---
title: Create a plan in Azure Stack | Microsoft Docs
description: As a cloud administrator, create a plan that lets subscribers provision virtual machines.
services: azure-stack
documentationcenter: ''
author: brenduns
manager: femila
editor: ''

ms.assetid: 3dc92e5c-c004-49db-9a94-783f1f798b98
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/23/2018
ms.author: brenduns
ms.reviewer:

---
# Create a plan in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

[Plans](azure-stack-key-features.md) are groupings of one or more services. As a provider, you can create plans to offer to your users. In turn, your users subscribe to your offers to use the plans and services they include. This example shows you how to create a plan that includes the compute, network, and storage resource providers. This plan gives subscribers the ability to provision virtual machines.

1. Sign in to the Azure Stack administrator portal (https://adminportal.local.azurestack.external).

2. To create a plan and offer that users can subscribe to, select **New** > **Offers + Plans** > **Plan**.  
   ![Select a plan](media/azure-stack-create-plan/select-plan.png)

3. In the **New plan** pane, fill in **Display name** and **Resource name**. The Display name is the plan's friendly name that users see. Only the admin can see the Resource name, which is the name that admins use to work with the plan as an Azure Resource Manager resource.  
   ![Specify details](media/azure-stack-create-plan/plan-name.png)

4. Create a new **Resource Group**, or select an existing one, as a container for the plan.  
   ![Specify the resource group](media/azure-stack-create-plan/resource-group.png)

5. select **Services** and then select the checkbox for **Microsoft.Compute**, **Microsoft.Network**, and **Microsoft.Storage**. Next, choose **Select** to save the configuration. Checkboxes appear when the mouse hovers over each option.  
   ![Select services](media/azure-stack-create-plan/services.png)

6. Select **Quotas**, **Microsoft.Storage (local)**, and then choose either the default quota or select **Create new quota** to customize the quota.  
   ![Quotas](media/azure-stack-create-plan/quotas.png)

7. If you're creating a new quota, enter a **Name** for the quota > specify the quota values > select **OK**. The **Create quota** pane closes.
   ![New quota](media/azure-stack-create-plan/new-quota.png)

   You then select the new quota you created. Selecting the quota assigns it and closes the selection pane.  
   ![Assign the quota](media/azure-stack-create-plan/assign-quota.png)

8. Repeat steps 6 and 7 to create and assign quotas for **Microsoft.Network (local)** and **Microsoft.Compute (local)**.  When all three services have quotas assigned, they appear similar to the following image.  
   ![Complete quota assignments](media/azure-stack-create-plan/all-quotas-assigned.png)

9. In the **Quotas** pane, choose **OK**, and then in the **New plan** pane, choose **Create** to create the plan.  
    ![Create the plan](media/azure-stack-create-plan/create.png)
10. To see your new plan, select **All resources**, then search for the plan and select its name. If your list of resources is long, use **Search** to locate your plan by name.  
   ![Review the plan](media/azure-stack-create-plan/plan-overview.png)

### Next steps
[Create an offer](azure-stack-create-offer.md)
