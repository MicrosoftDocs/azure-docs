---
title: Enable nested virtualization on a template VM in Azure Lab Services (UI) | Microsoft Docs
description: Learn how to create a template VM with multiple VMs inside.  In other words, enable nested virtualization on a template VM in Azure Lab Services. 
services: lab-services
author: emaher

ms.service: lab-services
ms.topic: article
ms.date: 1/23/2020
ms.author: enewman
---
# Enable nested virtualization on a template virtual machine in Azure Lab Services manually

Nested virtualization enables you to create a multi-VM environment inside a lab's template virtual machine. Publishing the template will provide each user in the lab with a virtual machine set up with multiple VMs within it.  For more information about nested virtualization and Azure Lab Services, see [Enable nested virtualization on a template virtual machine in Azure Lab Services](how-to-enable-nested-virtualization-template-vm.md).

This article covers how to set up nested virtualization on a template machine in Azure Lab Services using Windows roles and tools directly.  There are a few things needed to enable a class to use nested virtualization.  The steps below will describe how to manually set up a Lab Services machine template with Hyper-V.  Steps are intended for Windows Server 2016 or Windows Server 2019.  

>[!IMPORTANT]
>Select **Large (nested virtualization)** or **Medium (nested virtualization)** for the virtual machine size when creating the lab.  Nested virtualization will not work otherwise.  

## Enable Hyper-V role

The following steps describe actions needed to enable Hyper-V on Windows Server using either Server Manager.  Once the installation is successful, Hyper-V manager will be available to add, modify, and delete client virtual machines.

1. In **Server Manager**, on the Dashboard page, click **Add Roles and Features**.
2. On the **Before you begin** page, click **Next**.
3. On the **Select installation type** page, keep the default selection of Role-based or feature-based installation and then click **Next**.
4. On the **Select destination server** page, select Select a server from the server pool.   The current server will already be selected.  Click Next.
5. On the **Select server roles** page, select **Hyper-V**.  
6. The **Add Roles and Features Wizard** pop-up will appear.  Select **Include management tools (if applicable)**.  Click the **Add Features** button.
7. On the **Select server roles** page, click **Next**.
8. On the **Select features page**, click **Next**.
9. On the **Hyper-V** page, click **Next**.
10. On the **Create Virtual Switches** page, accept the defaults, and click **Next**.
11. On the **Virtual Machine Migration** page, accept the defaults, and click **Next**.
12. On the **Default Stores** page, accept the defaults, and click **Next**.
13. On the **Confirm installation selections** page, select **Restart the destination server automatically if required**.
14. When the **Add Roles and Features Wizard** pop-up appears, click **Yes**.
15. Click **Install**.
16. Wait for the **Installation progress** page to indicate that the Hyper-V role is complete.  The machine may restart in the middle of the installation.
17. Click **Close**.

## Enable DHCP role

Any Hyper-V client virtual machines created, needs an IP address in the NAT network.  We'll create the NAT network later.  One way to assign IP addresses is to set up the host, in this case the lab virtual machine template, as a DHCP server.  Below are the steps required to enable the DHCP role.

1. In **Server Manager**, on the **Dashboard** page, click **Add Roles and Features**.
2. On the **Before you begin** page, click **Next**.
3. On the **Select installation type** page, select **Role-based or feature-based installation** and then click **Next**.
4. On the **Select destination server** page, select the current server from the server pool and then click **Next**.
5. On the **Select server roles** page, select **DHCP Server**.  
6. The **Add Roles and Features Wizard** pop-up will appear.  Select **Include management tools (if applicable)**.  Click **Add Features**.

    >[!NOTE]
    >You may see a validation error stating that no static IP addresses were found.  This warning can be ignored for our scenario.

7. On the **Select server roles** page, click **Next**.
8. On the **Select features** page, click **Next**.
9. On the **DHCP Server** page, click **Next**.
10. On the **Confirm installation selections** page, click **Install**.
11. Wait for the **Installation progress page** to indicate that the DHCP role is complete.
12. Click Close.

## Enable Routing and Remote Access role

1. In **Server Manager**, on the **Dashboard** page, click **Add Roles and Features**.
2. On the **Before you begin** page, click **Next**.
3. On the **Select installation type** page, select **Role-based or feature-based installation** and then click **Next**.
4. On the **Select destination server** page, select the current server from the server pool and then click **Next**.
5. On the **Select server roles** page, select **Remote Access**. Click **OK**.
6. On the **Select features** page, click **Next**.
7. On the **Remote Access** page, click **Next**.
8. On the **Role Services** page, select **Routing**.
9. The **Add Roles and Features Wizard** pop-up will appear.  Select **Include management tools (if applicable)**.  Click **Add Features**.
10. Click **Next**.
11. On the **Web Server Role (IIS)** page, click **Next**.
12. On the **Select role services** page, click **Next**.
13. On the **Confirm installation selections** page, click **Install**.
14. Wait for the **Installation progress** page to indicate that the Remote Access role is complete.  
15. Click **Close**.

## Create virtual NAT network

Now that all the necessary roles have been installed, it's time to create the NAT network.  The creation process will involve creating a switch and the NAT network, itself.  A NAT (network address translation) network assigns a public IP address to a group of VMs on a private network to allow connectivity to the internet.  In our case, the group of private VMs will be the nested VMs.  The NAT network will allow the nested VMs to communicate with one another. A switch is a network device that handles receiving and routing of traffic in a network.

### Create a new virtual switch

1. Open **Hyper-V Manager** from Windows Administrative Tools.
2. Select the current server in the left-hand navigation menu.
3. Click **Virtual Switch Manager…** from the **Actions** menu on the right-hand side of the **Hyper-V Manager**.
4. On the **Virtual Switch Manager** pop-up, select **Internal** for the type of switch to create.  Click **Create Virtual Switch**.
5. For the newly created virtual switch, set the name to something memorable.  For this example, we'll use 'LabServicesSwitch'.  Click **OK**.
6. A new network adapter will be created.  The name will be similar to 'vEthernet (LabServicesSwitch)'.  To verify open the **Control Panel**, click **Network and Internet**, click **View network status and tasks**.  On the left, click **Change adapter settings**.

### Create a NAT network

1. Open the **Routing and Remote Access** tool from Windows Administrative Tools.
2. Select the local server in the left navigation page.
3. Choose **Action** -> **Configure and Enable Routing and Remote Access**.
4. When **Routing and Remote Access Server Setup Wizard** appears, click **Next**.
5. On the **Configuration** page, select **Network address translation (NAT)** configuration.  Click **Next**.

    >[!WARNING]
    >Do not choose the 'Virtual private network (VPN) access and NAT' option.

6. On **NAT Internet Connection** page, choose 'Ethernet'.  Don't choose the 'vEthernet (LabServicesSwitch)' connection we created in Hyper-V Manager. Click **Next**.
7. Click **Finish** on the last page of the wizard.
8. When the **Start the service** dialog appears, click **Start Service**.
9. Wait until service is started.

## Update network adapter settings

The network adapter will be associated with the IP used for the default gateway IP for the NAT network created earlier.  In this example, we create an IP address of 192.168.0.1 with a subnet mask of 255.255.255.0.  We will use the virtual switch created earlier.

1. Open the **Control Panel**, click **Network and Internet**, click **View network status and tasks**.
2. On the left, click **Change adapter settings**.  
3. In the **Network Connections** window, double-click on 'vEthernet (LabServicesSwitch)' to show the **vEthernet (LabServicesSwitch) Status** details dialog.
4. Click the **Properties** button.
5. Select **Internet Protocol Version 4 (TCP/IPv4)** item and click the **Properties** button.
6. In the **Internet Protocol Version 4 (TCP/IPv4) Properties** dialog, select **Use the following IP address**.  For the ip address, enter 192.168.0.1. For the subnet mask, enter 255.255.255.0.  Leave the default gateway blank.  Leave the DNS servers blank as well.

    >[!NOTE]
    > Our range for our NAT network will be, in CIDR notation, 192.168.0.0/24.  This creates a range of usable IP addresses from 192.168.0.1 to 192.168.0.254.  By convention, gateways have the first IP address in a subnet range.

7. Click OK.

## Create DHCP Scope

The following steps are instruction to add DHCP scope.  In this article, our NAT network is 192.168.0.0/24 in CIDR notation.  This creates a range of usable IP addresses from 192.168.0.1 to 192.168.0.254.  The scope created must be in that range of usable addresses excluding the IP address already created earlier.

1. Open **Administrative Tools** and open the **DHCP** administrative tool.
2. In the **DHCP** tool, expand the node for the current server and select **IPv4**.
3. From the Action menu, choose **New Scope…**
4. When the **New Scope Wizard** appears, click **Next** on the **Welcome** page.
5. On the **Scope Name** page, enter 'LabServicesDhcpScope' or something else memorable for the name.  Click **Next**.
6. On the **IP Address Range** page, enter the following values.

    - 192.168.0.100 for the Start IP address
    - 192.168.0.200 for the End IP address
    - 24 for the Length
    - 255.255.255.0 for the Subnet mask

7. Click **Next**.
8. On the **Add Exclusions and Delay** page, click **Next**.
9. On the **Lease Duration** page, click **Next**.
10. On the **Configure DHCP Options** page, select **Yes, I want to configure these options now**. Click **Next**.
11. On the **Router (Default Gateway)**
12. Add 192.168.0.1, if not done already. Click **Next**.
13. On the **Domain Name and DNS Servers** page, add 168.63.129.16 as a DNS server IP address, if not done already.  168.63.129.16 is the IP address for an Azure static DNS server. Click **Next**.
14. On the **WINS Servers** page, click **Next**.
15. One the **Activate Scope** page, select **Yes, I want to activate this scope now**.  Click **Next**.
16. On the **Completing the New Scope Wizard** page, click **Finish**.

## Conclusion

Now your template machine is ready to create Hyper-V virtual machines.   See [Create a Virtual Machine in Hyper-V](https://docs.microsoft.com/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-in-hyper-v) for instructions about how to create Hyper-V virtual machines.  Also see the [Microsoft Evaluation Center](https://www.microsoft.com/evalcenter/) to check out available operating systems and software.

## Next steps

Next steps are common to setting up any lab.

- [Add users](tutorial-setup-classroom-lab.md#add-users-to-the-lab)
- [Set quota](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-classroom-lab.md#set-a-schedule-for-the-lab)
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users)