---
title: Move an Azure Load Balancer to another Azure region
description: Use an Azure Resource Manager template to move an external or internal load balancer from one Azure region to another using the Azure portal or Azure PowerShell.
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: how-to
ms.date: 11/27/2024
ms.author: mbender
ms.custom: template-how-to, devx-track-arm-template, engagement-fy23
---

# Move an Azure Load Balancer to another Azure region

There are various scenarios in which you'd want to move an internal or external load balancer from one region to another. For example, you might want to create another load balancer with the same configuration for testing. You also might want to move an load balancer to another region as part of disaster recovery planning.

In a literal sense, you can't move an Azure load balancer from one region to another. But you can use an Azure Resource Manager template to export the existing configuration and public IP address of a load balancer. You can then stage the resource in another region by exporting the load balancer and public IP to a template, modifying the parameters to match the destination region, and then deploying the template to the new region. For more information on Resource Manager and templates, see [Export resource groups to templates](../azure-resource-manager/management/manage-resource-groups-powershell.md#export-resource-groups-to-templates).

In this article, you'll learn how to move an external or internal load balancer from one Azure region to another using the Azure portal or Azure PowerShell. Choose the tab that matches your preferred method and the type of load balancer you want to move.

# [External load balancer](#tab/external-load-balancer)

## Move an external load balancer to another region using the Azure portal

Use this procedure to move an external load balancer to another region using the Azure portal or Azure PowerShell.

## Prerequisites

# [Azure Portal](#tab/azure-portal/external-load-balancer)

- Make sure the Azure external load balancer is in the Azure region from which you want to move.

- Azure external load balancers can't be moved between regions. You have to associate the new load balancer to resources in the target region.

- To export an external load balancer configuration and deploy a template to create an external load balancer in another region, you need to be assigned the Network Contributor role or higher.

- Identify the source networking layout and all the resources that you're currently using. This layout includes but isn't limited to load balancers, network security groups,  public IPs, and virtual networks.

- Verify that your Azure subscription allows you to create external load balancers in the target region. Contact support to enable the required quota.

- Make sure your subscription has enough resources to support the addition of the load balancers. See [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits).

# [Azure PowerShell](#tab/azure-powershell/external-load-balancer)

- Make sure that the Azure external load balancer is in the Azure region from which you want to move.

- Azure external load balancers can't be moved between regions.  You have to associate the new load balancer to resources in the target region.

- To export an external load balancer configuration and deploy a template to create an external load balancer in another region, you need the Network Contributor role or higher.
   
- Identify the source networking layout and all the resources that you're currently using. This layout includes but isn't limited to load balancers, network security groups,  public IPs, and virtual networks.

- Verify that your Azure subscription allows you to create external load balancers in the target region that's used. Contact support to enable the required quota.

- Make sure that your subscription has enough resources to support the addition of load balancers for this process.  See [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits)

# [Internal load balancer](#tab/internal-load-balancer)

## Move an external load balancer to another region using the Azure portal


# [Azure Portal](#tab/azure-portal/internal-load-balancer)

# [Azure PowerShell](#tab/azure-powershell/internal-load-balancer)

---

## Discard

If you want to discard the target public IP and external load balancer, delete the resource group that contains them. To do so, select the resource group from your dashboard in the portal and then select **Delete** at the top of the overview page.

## Clean up

To commit the changes and complete the move of the public IP and external load balancer, delete the source public IP and external load balancer or resource group. To do so, select that resource group from your dashboard in the portal and then select **Delete** at the top of each page.

## Next steps

In this tutorial, you moved an Azure external load balancer from one region to another and cleaned up the source resources. To learn more about moving resources between regions and disaster recovery in Azure, see:

- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)