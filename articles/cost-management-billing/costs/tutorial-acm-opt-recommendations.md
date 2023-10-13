---
title: Tutorial - Reduce Azure costs with recommendations
description: This tutorial helps you reduce Azure costs when you act on optimization recommendations.
author: bandersmsft
ms.author: banders
ms.date: 12/06/2022
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
ms.custom: seodec18
---

# Tutorial: Optimize costs from recommendations

Cost Management works with Azure Advisor to provide cost optimization recommendations. Azure Advisor helps you optimize and improve efficiency by identifying idle and underutilized resources. This tutorial walks you through an example where you identify underutilized Azure resources and then you take action to reduce costs.

Watch the video [Optimizing cloud investments in Cost Management](https://www.youtube.com/watch?v=cSNPoAb-TNc) to learn more about using Advisor to optimize your costs. To watch other videos, visit the [Cost Management YouTube channel](https://www.youtube.com/c/AzureCostManagement).

>[!VIDEO https://www.youtube.com/embed/cSNPoAb-TNc]

In this tutorial, you learn how to:

> [!div class="checklist"]
> * View cost optimization recommendations to view potential usage inefficiencies
> * Act on a recommendation to resize a virtual machine to a more cost-effective option
> * Verify the action to ensure that the virtual machine was successfully resized

## Prerequisites
Recommendations are available for a variety of scopes and Azure account types. To view the full list of supported account types, see [Understand Cost Management data](understand-cost-mgt-data.md). You must have at least read access to one or more of the following scopes to view cost data. For more information about scopes, see [Understand and work with scopes](understand-work-scopes.md).

- Subscription
- Resource group

If you have a new subscription, you can't immediately use Cost Management features. It might take up to 48 hours before you can use all Cost Management features. Also, you must have active virtual machines with at least 14 days of activity.

## Sign in to Azure
Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com/).

## View cost optimization recommendations

To view cost optimization recommendations for a subscription, open the desired scope in the Azure portal and select **Advisor recommendations**.

To view recommendations for a management group, open the desired scope in the Azure portal and select **Cost analysis** in the menu. Use the **Scope** pill to switch to a different scope, such as a management group. Select **Advisor recommendations** in the menu. For more information about scopes, see [Understand and work with scopes](understand-work-scopes.md).

![Cost Management Advisor recommendations shown in the Azure portal](./media/tutorial-acm-opt-recommendations/advisor-recommendations.png)

The list of recommendations identifies usage inefficiencies or shows purchase recommendations that can help you save additional money. The totaled **Potential yearly savings** shows the total amount that you can save if you shut down or deallocate all of your VMs that meet recommendation rules. If you don't want to shut them down, you should consider resizing them to a less expensive VM SKU.

The **Impact** category, along with the **Potential yearly savings**, are designed to help identify recommendations that have the potential to save as much as possible.

High impact recommendations include:
- [Buy an Azure savings plan to save money on a variety of compute services](../savings-plan/buy-savings-plan.md)
- [Buy reserved virtual machine instances to save money over pay-as-you-go costs](../../advisor/advisor-reference-cost-recommendations.md#buy-virtual-machine-reserved-instance-to-save-money-over-pay-as-you-go-costs)
- [Optimize virtual machine spend by resizing or shutting down underutilized instances](../../advisor/advisor-cost-recommendations.md#optimize-virtual-machine-vm-or-virtual-machine-scale-set-vmss-spend-by-resizing-or-shutting-down-underutilized-instances)
- [Use Standard Storage to store Managed Disks snapshots](../../advisor/advisor-reference-cost-recommendations.md#use-standard-storage-to-store-managed-disks-snapshots)

Medium impact recommendations include:
- [Reduce costs by eliminating un-provisioned ExpressRoute circuits](../../advisor/advisor-reference-cost-recommendations.md#delete-expressroute-circuits-in-the-provider-status-of-not-provisioned)
- [Reduce costs by deleting or reconfiguring idle virtual network gateways](../../advisor/advisor-reference-cost-recommendations.md#repurpose-or-delete-idle-virtual-network-gateways)

## Act on a recommendation

Azure Advisor monitors your virtual machine usage for seven days and then identifies underutilized virtual machines. Virtual machines whose CPU utilization is five percent or less and network usage is seven MB or less for four or more days are considered low-utilization virtual machines.

The 5% or less CPU utilization setting is the default, but you can adjust the settings. For more information about adjusting the setting, see the [Configure the average CPU utilization rule or the low usage virtual machine recommendation](../../advisor/advisor-get-started.md#configure-recommendations).

Although some scenarios can result in low utilization by design, you can often save money by changing the size of your virtual machines to less expensive sizes. Your actual savings might vary if you choose a resize action. Let's walk through an example of resizing a virtual machine.

In the list of recommendations, select the **Right-size or shutdown underutilized virtual machines** recommendation. In the list of virtual machine candidates, choose a virtual machine to resize and then select the virtual machine. The virtual machine's details are shown so that you can verify the utilization metrics. The **potential yearly savings** value is what you can save if you shut down or remove the VM. Resizing a VM will probably save you money, but you won't save the full amount of the potential yearly savings.

![Example of Recommendation details](./media/tutorial-acm-opt-recommendations/recommendation-details.png)

In the VM details, check the utilization of the virtual machine to confirm that it's a suitable resize candidate.

![Example VM details showing historical utilization](./media/tutorial-acm-opt-recommendations/vm-details.png)

Note the current virtual machine's size. After you've verified that the virtual machine should be resized, close the VM details so that you see the list of virtual machines.

In the list of candidates to shut down or resize, select **Resize _&lt;FromVirtualMachineSKU&gt;_ to _&lt;ToVirtualMachineSKU&gt;_**.
![Example recommendation with the option to resize the virtual machine](./media/tutorial-acm-opt-recommendations/resize-vm.png)

Next, you're presented with a list of available resize options. Choose the one that will give the best performance and cost-effectiveness for your scenario. In the following example, the option chosen resizes from **Standard_D8s_v3** to **Standard_D2s_v3**.

![Example list of available VM sizes where you can choose a size](./media/tutorial-acm-opt-recommendations/choose-size.png)

After you choose a suitable size, select **Resize** to start the resize action.

Resizing requires an actively running virtual machine to restart. If the virtual machine is in a production environment, we recommend that you run the resize operation after business hours. Scheduling the restart can reduce disruptions caused by momentarily unavailability.

## Verify the action

When the VM resizing completes successfully, an Azure notification is shown.

![Successful resized virtual machine notification](./media/tutorial-acm-opt-recommendations/resized-notification.png)

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * View cost optimization recommendations to view potential usage inefficiencies
> * Act on a recommendation to resize a virtual machine to a more cost-effective option
> * Verify the action to ensure that the virtual machine was successfully resized

If you haven't already read the Cost Management best practices article, it provides high-level guidance and principles to consider to help manage costs.

> [!div class="nextstepaction"]
> [Cost Management best practices](cost-mgt-best-practices.md)
