---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 07/25/2019
 ms.author: cynthn
 ms.custom: include file
---

1. Open the Azure [portal](https://portal.azure.com).
1. Select **Create a resource** in the upper left corner.
1. Search for **Host group** and then select **Host Groups (preview)** from the results.
![Host groups search result.](./media/virtual-machines-common-dedicated-hosts-portal/host-group.png)
1. In the **Host Groups (preview)** page, select **Create**.
1. Select the subscription your would like to use and then select **Create new** to create a new resource group.
1. Type *myDedicatedHostsRG* as the **Name** and then select **OK**.
1. For **Host group name**, type *myHostGroup*.
1. For **Location**, select **East US**.
1. For **Availability Zone**, select **1**.
1. For **Fault domain count**, select **2**.
1. Select **Review + create** and then wait for validation.
![Host group settings](./media/virtual-machines-common-dedicated-hosts-portal/host-group-settings.png)
1. Once you see the **Validation passed** message, select **Create** to create the host group.

