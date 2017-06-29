---
title: Create a plan in Azure Stack | Microsoft Docs
description: As a cloud administrator, create a plan that lets subscribers provision virtual machines.
services: azure-stack
documentationcenter: ''
author: ErikjeMS
manager: byronr
editor: ''

ms.assetid: 3dc92e5c-c004-49db-9a94-783f1f798b98
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 7/10/2017
ms.author: erikje

---
# Create a plan in Azure Stack
[Plans](azure-stack-key-features.md) are groupings of one or more services. As a provider, you can create plans to offer to your tenants. In turn, your tenants subscribe to your offers to use the plans and services they include. This example shows you how to create a plan that includes the compute, network, and storage resource providers. This plan gives subscribers the ability to provision virtual machines.

1. Sign in to the Azure Stack administrator portal (https://adminportal.local.azurestack.external). Enter the credentials for the account that you created during step 5 of the [Run the PowerShell script](azure-stack-run-powershell-script.md) section.

2. To create a plan and offer that tenants can subscribe to, click **New** > **Tenant Offers + Plans** > **Plan**.

   ![](media/azure-stack-create-plan/image01.png)
3. In the **New Plan** blade, fill in **Display Name** and **Resource Name**. The Display Name is the plan's friendly name that tenants see. Only the admin can see the Resource Name. It's the name that admins use to work with the plan as an Azure Resource Manager resource.

   ![](media/azure-stack-create-plan/image02.png)
4. Create a new **Resource Group**, or select an existing one, as a container for the plan.

   ![](media/azure-stack-create-plan/image02a.png)
5. Click **Services**, select **Microsoft.Compute**, **Microsoft.Network**, and **Microsoft.Storage**, and then click **Select**.

   ![](media/azure-stack-create-plan/image03.png)
6. Click **Quotas**, click **Microsoft.Storage (local)**, and then either select the default quota or click **Create new quota** to customize the quota.

   ![](media/azure-stack-create-plan/image04.png)
7. Type a name for the quota, click **Quota Settings**, set the quota values and click **OK**, and then click **OK**.

   ![](media/azure-stack-create-plan/image06.png)
8. Click **Microsoft.Network (local)**, and then either select the default quota or click **Create new quota** to customize the quota.

    ![](media/azure-stack-create-plan/image07.png)
9. Type a name for the quota, click **Quota Settings**, set the quota values and click **OK**, and then click **OK**.

    ![](media/azure-stack-create-plan/image08.png)
10. Click **Microsoft.Compute (local)**, and then either select the default quota or click **Create new quota** to customize the quota.

    ![](media/azure-stack-create-plan/image09.png)
11. Type a name for the quota, click **Quota Settings**, set the quota values and click **OK**, and then click **OK**.

    ![](media/azure-stack-create-plan/image10.png)
12. In the **Quotas** blade, click **OK**, and then in the **New Plan** blade, click **Create** to create the plan.

    ![](media/azure-stack-create-plan/image11.png)
13. To see your new plan, click **All resources**, then search for the plan and click its name.

    ![](media/azure-stack-create-plan/image12.png)

## Next steps
[Create an offer](azure-stack-create-offer.md)
