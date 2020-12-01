---
title: Configure scaling for Azure Cloud Services (extended support)
description: How to enable scaling options for Azure Cloud Services (extended support)
ms.topic: how-to
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Configure scaling option with Azure Cloud Services (extended support) 

Conditions can be configured to enable a Cloud Service (extended support) deployment to scale in and out. These conditions can be based on CPU usage, disk load and network load. 

Consider the following information before configuring scaling of your Cloud Service deployment:
- Scaling impacts core usage. Larger role instances consume more cores and you can only scale within the core limit of your subscription. For more information, see [Available sizes](available-sizes.md).
- Scaling based on queue messaging threshold is supported. For more information, see [Get started with Azure Queue storage](https://docs.microsoft.com/azure/storage/queues/storage-dotnet-how-to-use-queues).
- To ensure high availability of your Cloud Service (extended support) application, ensure to deploy with two or more role instances. For more information, see [Service level agreements](https://azure.microsoft.com/support/legal/sla/).
- Autoscale can only occur when all roles are in a **Ready** state.

## Configure and manage scaling

1. Sign in to the Azure portal. 
2. Select the Cloud Service (extended support) deployment you want to configure scaling on. 
3. Select the **Scale** blade. 
	:::image type="content" source="media/enable-scaling-1.png" alt-text="Image shows selecting the Remote Desktop option in the Azure portal":::
4. A page will display a list of all the roles which scaling operations can be configured. Select the role you want to configure. 
5. Select the type of scale you want to configure
	- **Manual scale** will set the absolute count of instances.
		1. Select **Manual scale**.
		2. Input the number of instances you want to scale up or down to.
		3. Select **Save**.
		:::image type="content" source="media/enable-scaling-2.png" alt-text="Image shows setting up manual scaling in the Azure portal":::
		4. The scaling operation will begin immediately. 
		
	- **Autoscale** will allow you to set rules that govern how much or how little to scale based on predetermined rules. 
		1. Select **Custom autoscale**
		2. Choose to scale based on a metric or instance count.
		3. Add rules as needed to achieve the desired scaling results.
		4. Select **Save**.
		:::image type="content" source="media/enable-scaling-3.png" alt-text="Image shows setting up custom autoscale in the Azure portal":::
		5. The scaling operations will begin as soon as a rule is triggered.
		
6. You can view or adjust the scaling rules applied to your deployment by selecting the **Scale** tab.
	:::image type="content" source="media/enable-scaling-4.png" alt-text="Image shows viewing the scaling tab in the Azure portal":::
	:::image type="content" source="media/enable-scaling-5.png" alt-text="Image shows adjusting an existing scaling rule in the Azure portal":::

## Next steps
See [Frequently asked questions about Cloud services (extended support)](faq.md)
