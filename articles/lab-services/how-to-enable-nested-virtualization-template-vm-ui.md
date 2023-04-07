---
title: Enable nested virtualization on a template VM
titleSuffix: Azure Lab Services
description: Learn how to create a template VM in Azure Lab Services with multiple VMs inside. In other words, enable nested virtualization on a template VM in Azure Lab Services. 
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 03/03/2023
---

# Enable nested virtualization manually on a template VM in Azure Lab Services

Nested virtualization enables you to create a multi-VM environment inside a lab's template VM. Publishing the template provides each user in the lab with a virtual machine that is set up with multiple VMs within it.  For more information about nested virtualization and Azure Lab Services, see [Enable nested virtualization on a template virtual machine in Azure Lab Services](how-to-enable-nested-virtualization-template-vm.md).

This article covers how to set up nested virtualization on a template machine in Azure Lab Services using Windows roles and tools directly.  There are a few things needed to enable a class to use nested virtualization.  The following steps describe how to manually set up an Azure Lab Services machine template with Hyper-V.  Steps are intended for Windows Server 2016 or Windows Server 2019.  

> [!IMPORTANT]
> Select **Large (nested virtualization)** or **Medium (nested virtualization)** for the virtual machine size when creating the lab.  Nested virtualization will not work otherwise.  

## Enable Hyper-V role

The following steps describe how to enable Hyper-V on Windows Server using Server Manager.  After enabling Hyper-V, Hyper-V manager is available to add, modify, and delete client VMs on the template VM.

1. Connect to the template virtual machine using remote desktop (RDP).

1. In **Server Manager**, on the Dashboard page, select **Add Roles and Features**.

1. On the **Before you begin** page, select **Next**.

1. On the **Select installation type** page, keep the default selection of **Role-based or feature-based installation** and then select **Next**.

1. On the **Select destination server** page, select **Select a server from the server pool**. The current server is already  selected.  Select **Next**.

1. On the **Select server roles** page, select **Hyper-V**.  

1. The **Add Roles and Features Wizard** pop-up appears.  Select **Include management tools (if applicable)**, and then select **Add Features**.

1. On the **Select server roles** page, select **Next**.

1. On the **Select features page**, select **Next**.

1. On the **Hyper-V** page, select **Next**.

1. On the **Create Virtual Switches** page, accept the defaults, and select **Next**.

1. On the **Virtual Machine Migration** page, accept the defaults, and select **Next**.

1. On the **Default Stores** page, accept the defaults, and select **Next**.

1. On the **Confirm installation selections** page, select **Restart the destination server automatically if required**.

1. When the **Add Roles and Features Wizard** pop-up appears, select **Yes**.

1. Select **Install**.

1. Wait for the **Installation progress** page to indicate that the Hyper-V role is complete.  The machine may restart in the middle of the installation.

1. Select **Close**.

## Enable DHCP role

Any Hyper-V client VM you create, needs an IP address in the NAT network.  You'll create the NAT network at a later stage.  One way to assign IP addresses is to set up the host, in this case the lab VM template, as a DHCP server.

To enable the DHCP role on the template VM:

1. In **Server Manager**, on the **Dashboard** page, select **Add Roles and Features**.

1. On the **Before you begin** page, select **Next**.
1. On the **Select installation type** page, select **Role-based or feature-based installation** and then select **Next**.
1. On the **Select destination server** page, select the current server from the server pool and then select **Next**.
1. On the **Select server roles** page, select **DHCP Server**.  
1. The **Add Roles and Features Wizard** pop-up appears.  Select **Include management tools (if applicable)**.  Select **Add Features**.

    >[!NOTE]
    >You may see a validation error stating that no static IP addresses were found.  This warning can be ignored for our scenario.

1. On the **Select server roles** page, select **Next**.
1. On the **Select features** page, select **Next**.
1. On the **DHCP Server** page, select **Next**.
1. On the **Confirm installation selections** page, select **Install**.
1. Wait for the **Installation progress page** to indicate that the DHCP role is complete.
1. Select Close.

## Enable Routing and Remote Access role

To enable the Routing and Remote Access role:

1. In **Server Manager**, on the **Dashboard** page, select **Add Roles and Features**.

1. On the **Before you begin** page, select **Next**.
1. On the **Select installation type** page, select **Role-based or feature-based installation** and then select **Next**.
1. On the **Select destination server** page, select the current server from the server pool and then select **Next**.
1. On the **Select server roles** page, select **Remote Access**, and then select **OK**.
1. On the **Select features** page, select **Next**.
1. On the **Remote Access** page, select **Next**.
1. On the **Role Services** page, select **Routing**.
1. The **Add Roles and Features Wizard** pop-up appears.  Select **Include management tools (if applicable)**.  Select **Add Features**.
1. Select **Next**.
1. On the **Web Server Role (IIS)** page, select **Next**.
1. On the **Select role services** page, select **Next**.
1. On the **Confirm installation selections** page, select **Install**.
1. Wait for the **Installation progress** page to indicate that the Remote Access role is complete.  
1. Select **Close**.

## Create virtual NAT network

Now that you enabled the necessary server roles, you can create the NAT network.  The creation process involves creating a switch and the NAT network, itself.  A NAT (network address translation) network assigns a public IP address to a group of VMs on a private network to allow connectivity to the internet.  In this case, the group of private VMs are the nested VMs.  The NAT network allows the nested VMs to communicate with one another. A switch is a network device that handles receiving and routing of traffic in a network.

### Create a new virtual switch

To create a new virtual switch:

1. Open **Hyper-V Manager** from Windows Administrative Tools.

1. Select the current server in the left-hand navigation menu.
1. Select **Virtual Switch Manager…** from the **Actions** menu on the right-hand side of the **Hyper-V Manager**.
1. On the **Virtual Switch Manager** pop-up, select **Internal** for the type of switch to create.  Select **Create Virtual Switch**.
1. For the newly created virtual switch, set the name to something memorable.  For this example, you use *LabServicesSwitch*.
1. Select **OK**.

    Windows now creates a new network adapter. The name is similar to *vEthernet (LabServicesSwitch)*.  To verify, open the **Control Panel** > **Network and Internet** > **View network status and tasks**.  On the left, select **Change adapter settings** to view all network adapters.

1. Before you continue to create a NAT network, restart the template virtual machine.

### Create a NAT network

To create a NAT network: 

1. Open the **Routing and Remote Access** tool from Windows Administrative Tools.

1. Select the local server in the left navigation page.
1. Choose **Action** -> **Configure and Enable Routing and Remote Access**.
1. When **Routing and Remote Access Server Setup Wizard** appears, select **Next**.
1. On the **Configuration** page, select **Network address translation (NAT)** configuration, and then select **Next**.

    >[!WARNING]
    >Don't choose the **Virtual private network (VPN) access and NAT** option.

1. On **NAT Internet Connection** page, choose **Ethernet**, and then select **Next**. 

    >[!WARNING]
    >Don't choose the **vEthernet (LabServicesSwitch)** connection we created in Hyper-V Manager.

    If there are no network interfaces in the list, restart the virtual machine.

1. Select **Finish** on the last page of the wizard.

1. On the **Start the service** dialog, select **Start Service**, and wait until the service is running.

## Update network adapter settings

The network adapter is associated with the IP used for the default gateway IP for the NAT network you created earlier.  In this example, you create an IP address of `192.168.0.1` with a subnet mask of `255.255.255.0`.  You use the virtual switch you created earlier.

1. Open the **Control Panel**, select **Network and Internet**, select **View network status and tasks**.

1. On the left, select **Change adapter settings**.  
1. In the **Network Connections** window, double-click on 'vEthernet (LabServicesSwitch)' to show the **vEthernet (LabServicesSwitch) Status** details dialog.
1. Select the **Properties** button.
1. Select **Internet Protocol Version 4 (TCP/IPv4)** item and select the **Properties** button.
1. In the **Internet Protocol Version 4 (TCP/IPv4) Properties** dialog, select **Use the following IP address**.  For the IP address, enter 192.168.0.1. For the subnet mask, enter 255.255.255.0.  Leave the default gateway and DNS servers blank.

    >[!NOTE]
    > The range for the NAT network is, in CIDR notation, 192.168.0.0/24.  This configuration creates a range of usable IP addresses from 192.168.0.1 to 192.168.0.254.  By convention, gateways have the first IP address in a subnet range.

1. Select **OK**.

## Create DHCP Scope

The following steps are instructions to add a DHCP scope.  In this article, the NAT network is 192.168.0.0/24 in CIDR notation.  This creates a range of usable IP addresses from 192.168.0.1 to 192.168.0.254.  The DHCP scope must be in that range of usable addresses, excluding the IP address you already created earlier.

1. Open **Administrative Tools** and open the **DHCP** administrative tool.
1. In the **DHCP** tool, expand the node for the current server and select **IPv4**.
1. From the Action menu, choose **New Scope…**.
1. When the **New Scope Wizard** appears, select **Next** on the **Welcome** page.
1. On the **Scope Name** page, enter 'LabServicesDhcpScope' or something else memorable for the name.  Select **Next**.
1. On the **IP Address Range** page, enter the following values.

    - *192.168.0.100* for the **Start IP address**
    - *192.168.0.200* for the **End IP address**
    - *24* for the **Length**
    - *255.255.255.0* for the **Subnet mask**

1. Select **Next**.
1. On the **Add Exclusions and Delay** page, select **Next**.
1. On the **Lease Duration** page, select **Next**.
1. On the **Configure DHCP Options** page, select **Yes, I want to configure these options now**. Select **Next**.
1. On the **Router (Default Gateway)**
1. Add 192.168.0.1, if not done already. Select **Next**.
1. On the **Domain Name and DNS Servers** page, add 168.63.129.16 as a DNS server IP address, if not done already.  168.63.129.16 is the IP address for an Azure static DNS server. Select **Next**.
1. On the **WINS Servers** page, select **Next**.
1. One the **Activate Scope** page, select **Yes, I want to activate this scope now**.  Select **Next**.
1. On the **Completing the New Scope Wizard** page, select **Finish**.

## Conclusion

Now your template machine is ready to create Hyper-V virtual machines.   See [Create a Virtual Machine in Hyper-V](/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-in-hyper-v) for instructions about how to create Hyper-V virtual machines.  Also see the [Microsoft Evaluation Center](https://www.microsoft.com/evalcenter/) to check out available operating systems and software.

## Next steps

Next steps are common to setting up any lab.

- [As an educator, add students to a lab](tutorial-setup-lab.md#add-users-to-the-lab)
- [As an educator, set quota for students](how-to-configure-student-usage.md#set-quotas-for-users)
- [As an educator, set a schedule for the lab](tutorial-setup-lab.md#add-a-lab-schedule)
- [As an educator, publish a lab](tutorial-setup-lab.md#publish-lab)
