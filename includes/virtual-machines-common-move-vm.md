
This article walks you through how to move a VM between subscriptions. This can be handy if you originally created a VM in a personal subscription and now want to move it to your company's subscription to continue your work.

> [AZURE.NOTE] New resource IDs will be created as part of the move. Once the VM has been moved, you will need to update your tools and scripts to use the new resource IDs. 

1. Open the [Azure portal](https://portal.azure.com).
2. Click **Browse** > **Virtual machines** and select the VM you would like to move from the list.
	
	![Screenshot of the Essentials section where you click the pencil icon to open the Move resources blade.](./media/virtual-machines-common-move-vm/move-button.png)
	
3. In the **Essentials** section, click on the **Change subscription** pencil icon next to the subscription name. The **Move resources** blade will open.
	
	![Screenshot of the Move resources blade.](./media/virtual-machines-common-move-vm/move.png)
	
4. Select each of the resources to move. In most cases, you should move all of the listed optional resources.
5. Select the **Subscription** where you want the VM to be moved.
6. Select an existing **Resource group** or type a name to have a new resource group created.
7. When you are done, select that you understand that new resource IDs will be created and those need to be used with the VM once it is moved, then click **OK**.



## Next steps

You can move many different types of resources between resource groups and subscriptions. For more information, see [Move resources to new resource group or subscription](../articles/resource-group-move-resources.md).	
