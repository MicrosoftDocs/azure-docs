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

# Swap between two Cloud Services (Extended Support) Deployments

With cloud services (extended support) you can swap between two independent cloud service deployments. Unlike cloud services (classic), the concept of slots does not exist with the Azure Resource Manager model. When you decide to deploy a new release of a cloud service (extended support), you can make it “swappable” with another existing cloud service (extended support) enabling you to stage and test your new release using this deployment. Note that you cannot swap between a cloud service (classic) and a cloud service (extended support). 

## Use Swap to switch the URLs by which the two cloud services are addressed, in effect promoting a new cloud service (staged) to production release.

You can swap deployments from the Cloud Services page or the dashboard.

1.	In the Azure portal, select the cloud service you want to update. This step opens the cloud service instance blade.

2.	On the blade, select Swap.

    :::image type="content" source="media/cloud-services-swap1.png" alt-text="Image shows selecting the swap option from the Azure Portal.":::
3.	The following confirmation prompt opens:

    :::image type="content" source="media/cloud-services-swap2.png" alt-text="Image shows confirmation screen where user must OK to the VIP swap.":::
 
4.	After you verify the deployment information, select OK to swap the deployments.
The swap happens quickly because the only thing that changes is the virtual IP addresses (VIPs) for the two cloud services.
To save compute costs, you can delete one of the cloud services (designated as a staging environment for your application deployment) after you verify that your swapped cloud service is working as expected.

## Common questions about swapping deployments

### What are the prerequisites for swapping between two cloud services?
There are two key prerequisites for a successful cloud service (extended support) swap:

If you want to use a static / reserved IP address for one of the swappable cloud services, the other cloud service must also use a reserved IP. Otherwise, the swap fails.

All instances of your roles must be running before you can perform the swap. You can check the status of your instances on the Overview blade of the Azure portal. 

Alternatively, you can use the Get-AzRole command in Windows PowerShell.

> [!NOTE]
Guest OS updates and service healing operations also can cause deployment swaps to fail. For more information, see Troubleshoot cloud service deployment problems.

### Does a swap incur downtime for my application? How should I handle it?
As described in the previous section, a cloud service swap is typically fast because it's just a configuration change in the Azure load balancer. In some cases, it can take 10 or more seconds and result in transient connection failures. To limit impact to your customers, consider implementing client retry logic.

