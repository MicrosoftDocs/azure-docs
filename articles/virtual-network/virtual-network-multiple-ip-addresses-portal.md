---
title: Multiple IP addresses for virtual machines - Portal | Microsoft Docs
description: Learn how to assign multiple IP addresses to a virtual machine using the Azure Portal.
services: virtual-network
documentationcenter: na
author: anavinahar
manager: narayan
editor: ''
tags: azure-resource-manager

ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/28/2016
ms.author: annahar

---
# Assign multiple IP addresses to virtual machines
> [!div class="op_single_selector"]
> * [Azure Portal](virtual-network-multiple-ip-addresses-portal.md)
> * [PowerShell](virtual-network-multiple-ip-addresses-powershell.md)
> 
> 

An Azure Virtual Machine (VM) can have one or more network interfaces (NIC) attached to it. Any NIC can have one or more public or private IP addresses assigned to it. If you're not familiar with IP addresses in Azure, read the [IP addresses in Azure](virtual-network-ip-addresses-overview-arm.md) article to learn more about them. This article explains how to use Azure Portal to assign multiple IP addresses to a VM in the Azure Resource Manager deployment model.

Assigning multiple IP addresses to a VM enables the following capabilities:

* Hosting multiple websites or services with different IP addresses and SSL certificates on a single server.
* Serve as a network virtual appliance, such as a firewall or load balancer.
* The ability to add any of the private IP addresses for any of the NICs to an Azure Load Balancer back-end pool. In the past, only the primary IP address for the primary NIC could be added to a back-end pool.

[!INCLUDE [virtual-network-preview](../../includes/virtual-network-preview.md)]

To register for the preview, send an email to [Multiple IPs](mailto:MultipleIPsPreview@microsoft.com?subject=Request%20to%20enable%20subscription%20%3csubscription%20id%3e) with your subscription ID and intended use.

## Scenario
In this article, you will associate three IP configurations to a network interface.
The following example configurations will be created and assigned to a NIC that will have three private IP addresses and one public IP address assigned to it:

* IPConfig-1: A dynamic private IP address (default) and a public IP address from the public IP address resource named PIP1.
* IPConfig-2: A static private IP address and no public IP address.
* IPConfig-3: A dynamic private IP address and no public IP address.
  
    ![Alt image text](./media/virtual-network-multiple-ip-addresses-powershell/OneNIC-3IP.png)

This scenario assumes you have a resource group called *RG1* within which there is a VNet called *VNet1* and a subnet called *Subnet1*. Further, it assumes you have a VM called *VM1*, a network interface called *VM1-NIC1* associated to it and a public IP address called *PIP1*.

[This article](../virtual-machines/virtual-machines-windows-ps-create.md) walks through how to create the resources mentioned above in case you have not created them before.

## <a name = "create"></a>Create a VM with multiple IP addresses
To create a multiple IP configurations based on the scenario above by using the Azure preview portal, follow the steps below.

1. From a browser, navigate to http://portal.azure.com and, if necessary, sign in with your Azure account.
2. Select the network interface you want to add the IP configurations to: **Virtual Machines** > **VM1** > **Network interfaces** > **VM1-NIC1**
3. In the **Network interface** blade, select **IP configurations**. You will see a list of the existing IP configurations.
4. To associate **PIP1** with **ipconfig1**, in the **IP configurations** blade, select **ipconfig1**. In the **ipconfig1** blade, under **Public IP address**, select **Enabled**.
5. In the **IP address** tab, select **Configure required settings** and then select **PIP1** or the public IP address you would like to associate with this primary IP configuration and then click on save. You can also create a new public IP address to associate here. You will then see a Saving network interface notification and once this finishes you will see **PIP1** associated with **ipconfig1**.
   
    ![Alt image text](media\\virtual-network-multiple-ip-addresses-portal\\01-portal.PNG)

    >[AZURE.NOTE] Public IP addresses have a nominal fee. To learn more about IP address pricing, read the [IP address pricing](https://azure.microsoft.com/pricing/details/ip-addresses) page.

1. Next, to add an IP configuration, under the **IP configurations** section of your network interface, click on **+Add**.
   
   > [!NOTE]
   > You can assign up to 250 private IP address to a NIC. There is a limit to the number of public IP addresses that can be used within a subscription. To learn more, read the [Azure limits](../azure-subscription-service-limits.md#networking-limits---azure-resource-manager) article.
   > 
   > 
2. In the **Add IP configuration** blade, name your IP configuration. Here it is, **IPConfig-2**. Select **Static** for **Allocation** and enter the IP address you would like. In this scenario, it is 10.0.0.5. Then click **OK**. Once the configuration is saved, you will see the IP configuration in the list.
   
    ![Alt image text](media\\virtual-network-multiple-ip-addresses-portal\\02-portal.PNG)
3. Next, add the third IP configuration, by selecting **+Add** in the **IP  configurations** blade and filling in the necessary details as shown below. Then select **OK**.
   
    ![Alt image text](media\\virtual-network-multiple-ip-addresses-portal\\03-portal.PNG)
   
    Note that IPConfig-2 and IPConfig-3 can also be associated with a public IP by selecting **Enabled** in the **Public IP address** section of the **Add IP configuration** blade. A new public IP can be created or one already created can be associated with the IP configuration.
4. Manually add all the private IP addresses (including the primary) to the TCP/IP configuration in the operating system as shown below. To manually add the IP addresses you must connect to your VM and then follow the steps outlined below.

**Windows**

1. From a command prompt, type *ipconfig /all*.  You only see the *Primary* private IP address (through DHCP).
2. Next type *ncpa.cpl* in the command prompt window. This will open a new window.
3. Open the properties for **Local Area Connection**.
4. Double click on Internet Protocol version 4 (IPv4)
5. Select **Use the following IP address** and enter the following values:
   
   * **IP address**: Enter the *Primary* private IP address
   * **Subnet mask**: Set based on your subnet. For example, if the subnet is a /24 subnet then the subnet mask is 255.255.255.0.
   * **Default gateway**: The first IP address in the subnet. If your subnet is 10.0.0.0/24, then the gateway IP address is 10.0.0.1.
   * Click **Use the following DNS server addresses** and enter the following values:
     * **Preferred DNS server:** Enter 168.63.129.16 if you are not using your own DNS server.  If you are, enter the IP address for your DNS server.
   * Click the **Advanced** button and add additional IP addresses. Add each of the secondary private IP addresses listed in step 8 to the NIC with the same subnet specified for the primary IP address.
   * Click **OK** to close out the TCP/IP settings and then **OK** again to close the adapter settings. This will then reestablish your RDP connection.
6. From a command prompt, type *ipconfig /all*. All IP addresses you added are shown and DHCP is turned off.

**Linux (Ubuntu)**

1. Open a terminal window.
2. Make sure you are the root user. If you are not, you can do this by using the following command:
   
            sudo -i
3. Update the configuration file of the network interface (assuming ‘eth0’).
   
   * Keep the existing line item for dhcp. This will configure the primary IP address as it used to be earlier.
   * Add a configuration for an additional static IP address with the following commands:
     
               cd /etc/network/interfaces.d/
               ls
     
       You should see a .cfg file.
4. Open the file: vi *filename*.
   
    You should see the following lines at the end of the file:
   
            auto eth0
            iface eth0 inet dhcp
5. Add the following lines after the lines that exist in this file:
   
            iface eth0 inet static
            address <your private IP address here>
6. Save the file by using the following command:
   
            :wq
7. Reset the network interface with the following command:
   
           sudo ifdown eth0 && sudo ifup eth0
   
   > [!IMPORTANT]
   > Run both ifdown and ifup in the same line if using a remote connection.
   > 
   > 
8. Verify the IP address is added to the network interface with the following command:
   
            ip addr list eth0
   
    You should see the IP address you added as part of the list.

**Linux (Redhat, CentOS, and others)**

1. Open a terminal window.
2. Make sure you are the root user. If you are not, you can do this by using the following command:
   
            sudo -i
3. Enter your password and follow instructions as prompted. Once you are the root user, navigate to the network scripts folder with the following command:
   
            cd /etc/sysconfig/network-scripts
4. List the related ifcfg files using the following command:
   
            ls ifcfg-*
   
    You should see *ifcfg-eth0* as one of the files.
5. Copy the *ifcfg-eth0* file and name it *ifcfg-eth0:0* with the following command:
   
            cp ifcfg-eth0 ifcfg-eth0:0
6. Edit the *ifcfg-eth0:0* file with the following command:
   
            vi ifcfg-eth1
7. Change the device to the appropriate name in the file; *eth0:0* in this case, with the following command:
   
            DEVICE=eth0:0
8. Change the *IPADDR = YourPrivateIPAddress* line to reflect the IP address.
9. Save the file with the following command:
   
            :wq
10. Restart the network services and make sure the changes are successful by running the following commands:
    
            /etc/init.d/network restart
            Ipconfig
    
    You should see the IP address you added, *eth0:0*, in the list returned.

## <a name="add"></a>Add IP addresses to an existing VM
Complete the following steps to add additional IP addresses to an existing NIC:

1. From a browser, navigate to http://portal.azure.com and, if necessary, sign in with your Azure account.
2. Select the network interface you want to add the IP configurations to in the **Network interfaces** section.
3. In the **Network interface** blade, select **IP configurations**. You will see a list of the existing IP configurations.
4. Next, to add an IP configuration, under the IP configurations section of your network interface, click on **+Add**.
5. In the Add IP configuration blade, name your IP configuration. Select  the type of IP address you would like: Static or Dynamic under **Allocation**. Under **Public IP address**, select **Enabled** if you would like to associate your IP configuration with a public IP. If not click on **Disabled**. Selecting **Enabled** allows you to associate an existing public IP to your configuration in addition to  Then click OK. Once the configuration is saved, you will see the IP configuration in the list.

