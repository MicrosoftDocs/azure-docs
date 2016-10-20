<properties 
   pageTitle="How to set a static private IP in ARM mode using the Azure portal| Microsoft Azure"
   description="Understanding private IPs (DIPs) and how to manage them in ARM mode using the Azure portal"
   services="virtual-network"
   documentationCenter="na"
   authors="jimdial"
   manager="carmonm"
   editor="tysonn"
   tags="azure-resource-manager"
/>
<tags 
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/04/2016"
   ms.author="jdial" />

# How to set a static private IP address in the Azure portal

[AZURE.INCLUDE [virtual-networks-static-private-ip-selectors-arm-include](../../includes/virtual-networks-static-private-ip-selectors-arm-include.md)]

[AZURE.INCLUDE [virtual-networks-static-private-ip-intro-include](../../includes/virtual-networks-static-private-ip-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)] This article covers the Resource Manager deployment model. You can also [manage static private IP address in the classic deployment model](virtual-networks-static-private-ip-classic-pportal.md).

[AZURE.INCLUDE [virtual-networks-static-ip-scenario-include](../../includes/virtual-networks-static-ip-scenario-include.md)]

The sample steps below expect a simple environment already created. If you want to run the steps as they are displayed in this document, first build the test environment described in [create a vnet](virtual-networks-create-vnet-arm-pportal.md).

## How to create a VM for testing static private IP addresses

You cannot set a static private IP address during the creation of a VM in the Resource Manager deployment mode by using the Azure portal. You must create the VM first, tehn set its private IP to be static.

To create a VM named *DNS01* in the *FrontEnd* subnet of a VNet named *TestVNet*, follow the steps below.

1. From a browser, navigate to http://portal.azure.com and, if necessary, sign in with your Azure account.
2. Click **NEW** > **Compute** > **Windows Server 2012 R2 Datacenter**, notice that the **Select a deployment model** list already shows **Resource Manager**, and then click **Create**, as seen in the figure below.

	![Create VM in Azure portal](./media/virtual-networks-static-ip-arm-pportal/figure01.png)

3. In the **Basics** blade, enter the name of the VM to be created (*DNS01* in our scenario), the local administrator account, and password, as seen in the figure below.

	![Basics blade](./media/virtual-networks-static-ip-arm-pportal/figure02.png)

4. Make sure the **Location** selected is *Central US*, then click **Select existing** under **Resource group**, then click **Resource group** again, then click *TestRG*, and then click **OK**.

	![Basics blade](./media/virtual-networks-static-ip-arm-pportal/figure03.png)

5. In the **Choose a size** blade, select **A1 Standard**, and then click **Select**.

	![Choose a size blade](./media/virtual-networks-static-ip-arm-pportal/figure04.png)	

6. In teh **Settings** blade, make sure the following properties are set are set with the values below, and then click **OK**.

	-**Storage account**: *vnetstorage*
	- **Network**: *TestVNet*
	- **Subnet**: *FrontEnd*

	![Choose a size blade](./media/virtual-networks-static-ip-arm-pportal/figure05.png)	 

7. In the **Summary** blade, click **OK**. Notice the tile below displayed in your dashboard.

	![Create VM in Azure portal](./media/virtual-networks-static-ip-arm-pportal/figure06.png)

## How to retrieve static private IP address information for a VM

To view the static private IP address information for the VM created with the steps above, execute the steps below.

1. From the Azure Azure portal, click **BROWSE ALL** > **Virtual machines** > **DNS01** > **All settings** > **Network interfaces** and then click on the only network interface listed.

	![Deploying VM tile](./media/virtual-networks-static-ip-arm-pportal/figure07.png)

2. In the **Network interface** blade, click **All settings** > **IP addresses** and notice the **Assignment** and **IP address** values.

	![Deploying VM tile](./media/virtual-networks-static-ip-arm-pportal/figure08.png)

## How to add a static private IP address to an existing VM
To add a static private IP address to the VM created using the steps above, follow the steps below:

1. From the **IP addresses** blade shown above, click **Static** under **Assignment**.
2. Type *192.168.1.101* for **IP address**, and then click **Save**.

	![Create VM in Azure portal](./media/virtual-networks-static-ip-arm-pportal/figure09.png)

>[AZURE.NOTE] If after clicking **Save** you notice that the assignment is still set to **Dynamic**, it means that the IP address you typed is already in use. Try a different IP address.

## How to remove a static private IP address from a VM
To remove the static private IP address from the VM created above, follow the step below.
	
1. From the **IP addresses** blade shown above, click **Dynamic** under **Assignment**, and then click **Save**.

## Next steps

- Learn about [reserved public IP](virtual-networks-reserved-public-ip.md) addresses.
- Learn about [instance-level public IP (ILPIP)](virtual-networks-instance-level-public-ip.md) addresses.
- Consult the [Reserved IP REST APIs](https://msdn.microsoft.com/library/azure/dn722420.aspx).