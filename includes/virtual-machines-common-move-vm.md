---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 10/19/2018
 ms.author: cynthn
 ms.custom: include file
---

## Use the Azure portal to move a VM to a different subscription
You can move a VM and its associated resources to a different subscription by using the Azure portal.

1. Go to the [Azure portal](https://portal.azure.com) to manage the resource group containing the VM to move. Search for and select **Resource groups**.
2. Choose the resource group containing the VM that you would like to move.
3. At the top of the page for the resource group, select **Move** and then select **Move to another subscription**. The **Move resources** page opens.
4. Select each of the resources to move. In most cases, you should move all of the related resources that are listed.
5. Select the **Subscription** where you want the VM to be moved.
6. Select an existing **Resource group**, or enter a name to have a new resource group created.
7. When you are done, select that you understand that new resource IDs will be created and that the new IDs will need to be used with the VM after it is moved, and then select **OK**.

## Use the Azure portal to move a VM to another resource group
You can move a VM and its associated resources to another resource group by using the Azure portal.

1. Go to the [Azure portal](https://portal.azure.com) to manage the resource group containing the VM to move. Search for and select **Resource groups**.
2. Choose the resource group containing the VM that you would like to move.
3. At the top of the page for the resource group, select **Move** and then select **Move to another resource group**. The **Move resources** page opens.
4. Select each of the resources to move. In most cases, you should move all of the related resources that are listed.
5. Select an existing **Resource group**, or enter a name to have a new resource group created.
6. When you are done, select that you understand that new resource IDs will be created and that the new IDs will need to be used with the VM after it is moved, and then select **OK**.

