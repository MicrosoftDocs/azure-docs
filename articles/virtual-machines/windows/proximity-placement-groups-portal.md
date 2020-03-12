---
title: Create a proximity placement group using the portal 
description: Learn how to create a proximity placement group using the Azure portal. 
services: virtual-machines
author: cynthn
manager: gwallace

ms.service: virtual-machines
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 10/30/2019
ms.author: cynthn

---

# Create a proximity placement group using the portal

To get VMs as close as possible, achieving the lowest possible latency, you should deploy them within a [proximity placement group](co-location.md#proximity-placement-groups).

A proximity placement group is a logical grouping used to make sure that Azure compute resources are physically located close to each other. Proximity placement groups are useful for workloads where low latency is a requirement.


## Create the proximity placement group

1. Type **proximity placement group** in the search.
1. Under **Services** in the search results, select **Proximity placement groups**.
1. In the **Proximity placement groups** page, select **Add**.
1. In the **Basics** tab, under **Project details**, make sure the correct subscription is selected.
1. In **Resource group** either select **Create new** to create a new group or select an existing resource group from the drop-down.
1. In **Region** select the location where you want the proximity placement group to be created.
1. In **Proximity placement group name** type a name and then select **Review + create**.
1. After validation passes, select **Create** to create the proximity placement group.

	![Screenshot of creating a proximity placement group](./media/ppg/ppg.png)


## Create a VM

1. While creating a VM in the portal, go to the **Advanced** tab. 
1. In the **Proximity placement group** selection, select the correct placement group. 

	![Screenshot of the proximity placement group section when creating a new VM in the portal](./media/ppg/vm-ppg.png)

1. When you are done making all of the other required selections, select **Review + create**.
1. After it passes validation, select **Create** to deploy the VM in the placement group.




## Next steps

You can also use the [Azure PowerShell](proximity-placement-groups.md) to create proximity placement groups.

