---
title: Swap between two Cloud Services (extended support) deployments
description: Swap between two Cloud Services (extended support) deploymentsdeployments
ms.topic: article
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Swap between two Cloud Service (extended support) deployments

Cloud Services (extended support) allows users to swap between two independent Cloud Service deployments. Unlike Cloud Services (classic), the concept of deployment slots no longer exists in the Azure Resource Manager model . 

When you deploy a new release of a Cloud Service (extended support), you can make it “swappable” with another existing Cloud Service. This enables users to stage and test the new release. 

> [!NOTE]
> You cannot swap between a Cloud Service (classic) and a Cloud Service (extended support) deployment. 

## Use Swap to change deployments

You can swap deployments from the Cloud Services (extended support) dashboard.

1.	In the Azure portal, select the Cloud Service you want to update.

2.	On the overview blade, select **Swap**.

    :::image type="content" source="media/cloud-services-swap1.png" alt-text="Image shows selecting the swap option from the Azure Portal.":::

3.	A confirmation window will appear displaying the current Cloud Service deployment and the one you want to swap it with. 

    :::image type="content" source="media/cloud-services-swap2.png" alt-text="Image shows confirmation screen where user must OK to the VIP swap.":::
 
4.	Verify the information is correct and select **OK** to swap the deployments.

> [!NOTE]
> The swap happens quickly because the only thing that changes is the virtual IP addresses (VIPs) for the two Cloud Services.

## Common questions about swapping deployments

### What are the prerequisites for swapping between two Cloud Services?
There are two key prerequisites for a successful Cloud Service (extended support) swap:

1. If you want to use a reserved IP address for one of the swappable Cloud Services, the other Cloud Service must also use a reserved IP.

2. All instances of your roles must be running before you can perform the swap. You can check the status of your instances on the Overview blade of the Azure portal or by running the `Get-AzRole` command in Azure PowerShell.

> [!NOTE]
Guest OS updates and service healing operations also can cause deployment swaps to fail. For more information, see [Troubleshoot Cloud Service deployment problems](https://docs.microsoft.com/azure/cloud-services/cloud-services-troubleshoot-deployment-problems).

### Does a swap incur downtime for my application? How should I handle it?
A Cloud Service swap is typically quick because it's just a configuration change in the Azure load balancer. In some cases, it can take 10 or more seconds and result in transient connection failures. To limit impact to your customers, consider implementing client retry logic.

