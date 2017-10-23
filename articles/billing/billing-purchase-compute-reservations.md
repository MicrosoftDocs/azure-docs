---
title: Save compute costs by purchasing a Azure Reserved Virtual Machine Instance - Azure | Microsoft Docs
description: Learn about Azure Reserved Virtual Machine Instance. 
author: vikdesai
manager: vikdesai
editor: ''

ms.assetid: 74F4940C-E5FA-4ABC-939E-3386A94ADE86
ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/24/2017
ms.author: vikdesai
---
# Purchase Azure Reserved Virtual Machine Instances and save on compute costs
Reserved Virtual Machine Instances allow you to pre-purchase 1 to 3 years of compute capacity and get a discount on the virtual machines you use. More details on Reserved Virtual Machine Instances offering are [here](https://azure.microsoft.com/en-us/pricing/reserved-vm-instances/).

You can purchase Reserved Virtual Machine Instances in the [Azure portal](https://portal.azure.com). To buy a Reserved Virtual Machine Instance:
-	You must be in an Owner role for at least one Enterprise or Pay-As-You-Go subscription.
-	For Enterprise subscriptions, reservation purchases must be enabled in the [EA portal](https://ea.azure.com). 
 
## Purchase a Reserved Virtual Machine Instance
1)	Select **More Services -> Reservations**. (exact entry point and command to be added)
2)	Select **Add** to purchase a new reservation. (screenshot to be added)
3)	Fill in the required fields. VM instances that match the attributes you select, qualify to get Reserve Instances discount. The actual number of instances that get the discount depend on the scope and quantity selected.

| Field      | Description|
|:------------|:--------------|
|Name        |The name of this reservation.| 
|Subscription|The subscription used to pay for the reservation. The payment method attached to this subscription is charged the upfront costs for the reservation. The subscription must be of an Enterprise Agreement (offer number: MS-AZR-0017P) or Pay-As-You-Go (offer number: MS-AZR-0003P). For an enterprise subscription, the charges are directed to the enrollment, either deducted from monetary commitment balance or charged as overage. For Pay-As-You-Go subscription, the charges are billed to the attached credit card or invoice payment method.|    
|Scope       |The reservation’s scope can cover one subscription or multiple (shared scope). If you select: Single subscription - The reservation discount is applied to VMs in this subscription. Shared - The reservation discount is applied to VMs running in any subscriptions within your billing account. For enterprise customers, the shared scope is the enrollment and includes all subscriptions within the enrollment.|  
|Location    |The Azure region that’s covered by the reservation.|    
|VM Size     |The size of the VM instances.|

4)	Select **Purchase** to complete the transaction.
5)	Select **View this Reservation** to see the status of the reservation purchase.
