---
 title: include file
 description: include file
 services: virtual-network
 author: genlin
 ms.service: virtual-network
 ms.topic: include
 ms.date: 04/13/2018
 ms.author: genli
 ms.custom: include file

---

## How to create a classic VNet in the Azure portal
To create a classic VNet based on the preceding scenario, follow these steps.

1. From a browser, navigate to https://portal.azure.com and, if necessary, sign in with your Azure account.
2. Click **Create a resource** > **Networking** > **Virtual network**. Notice that the **Select a deployment model** list already shows **Classic**. 3. Click **Create** as shown in the following figure.
   
    ![Create VNet in Azure portal](./media/virtual-networks-create-vnet-classic-pportal-include/vnet-create-pportal-figure1.gif)
4. On the **Virtual network** pane, type the **Name** of the VNet, and then click **Address space**. Configure your address space settings for the VNet and its first subnet, then click **OK**. The following figure shows the CIDR block settings for our scenario.
   
    ![Address space pane](./media/virtual-networks-create-vnet-classic-pportal-include/vnet-create-pportal-figure2.png)
5. Click **Resource Group** and select a resource group to add the VNet to, or click **Create new resource group** to add the VNet to a new resource group. The following figure shows the resource group settings for a new resource group called **TestRG**. For more information about resource groups, visit [Azure Resource Manager Overview](../articles/azure-resource-manager/management/overview.md#resource-groups).
   
    ![Create resource group pane](./media/virtual-networks-create-vnet-classic-pportal-include/vnet-create-pportal-figure3.png)
6. If necessary, change the **Subscription** and **Location** settings for your VNet. 
7. If you do not want to see the VNet as a tile in the **Startboard**, disable **Pin to Startboard**. 
8. Click **Create** and notice the tile named **Creating Virtual network** as shown in the following figure.
   
    ![Create VNet in portal](./media/virtual-networks-create-vnet-classic-pportal-include/vnet-create-pportal-figure4.png)
9. Wait for the VNet to be created, and when you see the tile, click it to add more subnets.
   
    ![Create VNet in portal](./media/virtual-networks-create-vnet-classic-pportal-include/vnet-create-pportal-figure5.png)
10. You should see the **Configuration** for your VNet as shown. 
   
    ![Create VNet in portal](./media/virtual-networks-create-vnet-classic-pportal-include/vnet-create-pportal-figure6.png)
11. Click **Subnets** > **Add**, then type a **Name** and specify an **Address range (CIDR block)** for your subnet, and then click **OK**. The following figure shows the settings for our current scenario.
    
    ![Create VNet in Azure portal](./media/virtual-networks-create-vnet-classic-pportal-include/vnet-create-pportal-figure7.gif)

