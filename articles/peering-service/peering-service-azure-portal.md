---
title: Microsoft Azure Peering Service | Microsoft Docs
description: Learn about Microsoft Azure Peering Service
services: peering-service
author: ypitsch
manager: 
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 
ms.author: ypitsch
---

## Create Peering Service – Azure Portal

![create service](./media/peering-service-portal/peering-service-UI-Basic.png)

1.	Choose the subscription to which the peering service must be registered by choosing the option from the Subscription drop-down list.
2.	Select the resource group to which the subscription is registered from the Resource group drop-down list. 

[!Note Ensure existing resource group is chosen from the Resource group drop-down list as Peering Service supports only existing ones].
1.	Provide a name to this Peering Service instance in the Name textbox.
2.	Next, click on the Next: Configuration button at the bottom. Doing so, Configuration page appears.
1.	Choose the location to which the Peering Service must be enabled by choosing the same from the Peering service location drop-down list.
2.	Now, choose the service provider from whom the service must be procured by choosing provider name from the Peering service provider drop-down list.
3.	Prefixes – 
•	Create a Prefix by clicking on Create new button at the bottom and the appropriate text boxes appear.
•	Provide a name to the prefix resource in the Name text box and provide the prefix range in the Prefixes text box that is associated with the service provider.