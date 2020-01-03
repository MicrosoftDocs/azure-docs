---
title: Scale quotas and limits in your lab in Azure DevTest Labs | Microsoft Docs
description: Learn how to scale a lab in Azure DevTest Labs
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila

ms.assetid: ae624155-9181-45fa-bd2b-1983339b7e0e
ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/17/2018
ms.author: spelluru

---
# Scale quotas and limits in DevTest Labs
As you work in DevTest Labs, you might notice that there are certain default limits to some Azure resources, which can affect the DevTest Labs service. These limits are referred to as **quotas**.

> [!NOTE]
> The DevTest Labs service doesn't impose any quotas. Any quotas you might encounter are default constraints of the overall Azure subscription.

You can use each Azure resource until you reach its quota. Each subscription has separate quotas and usage is tracked per subscription.

For example, each subscription has a default quota of 20 cores. So, if you are creating VMs in your lab with four cores each, then you can only create five VMs.

[Azure Subscription and Service Limits](https://docs.microsoft.com/azure/azure-subscription-service-limits) lists some of the most common quotas for Azure resources. The resources most commonly used in a lab, and for which you might encounter quotas, include VM cores, public IP addresses, network interface, managed disks, RBAC role assignment, and ExpressRoute circuits.

## View your usage and quotas
These steps show you how to view the current quotas in your subscription for specific Azure resources, and to see what percentage of each quota you have used.

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).
1. Select **More Services**, and then select **Billing** from the list.
1. In the Billing blade, select a subscription.
4. Select **Usage + quotas**.

   ![Usage and quotas button](./media/devtest-lab-scale-lab/devtestlab-usage-and-quotas.png)

   The Usage + quotas blade appears, listing different resources available in that subscription and the percentage of the quota that is being used per resource.

   ![Quotas and usage](./media/devtest-lab-scale-lab/devtestlab-view-quotas.png)

## Requesting more resources in your subscription
If you reach a quota cap, the default limit of a resource in a subscription can be increased up to a maximum limit, as described in [Azure Subscription and Service Limits](https://docs.microsoft.com/azure/azure-subscription-service-limits).

These steps show you how to request a quota increase through the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Select **More Services**, select **Billing**, and then select **Usage + quotas**.
1. In the Usage + quotas blade, select the **Request Increase** button.

   ![Request increase button](./media/devtest-lab-scale-lab/devtestlab-request-increase.png)

1. To complete and submit the request, fill out the required information on all three tabs of the **New support request** form.

   ![Request increase form](./media/devtest-lab-scale-lab/devtestlab-support-form.png)

[Understanding Azure Limits and Increases](https://azure.microsoft.com/blog/azure-limits-quotas-increase-requests/) provides more information about contacting Azure support to request a quota increase.



[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

### Next steps
* Explore the [DevTest Labs Azure Resource Manager QuickStart template gallery](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/QuickStartTemplates).
