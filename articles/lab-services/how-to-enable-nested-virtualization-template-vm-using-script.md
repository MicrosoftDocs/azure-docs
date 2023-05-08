---
title: Enable nested virtualization on a template VM (script)
titleSuffix: Azure Lab Services
description: Learn how to enable nested virtualization on a template VM in Azure Lab Services by using a script. Nested virtualization enables you to create a lab with multiple VMs inside it.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 01/13/2023
---

# Enable nested virtualization on a template virtual machine in Azure Lab Services

Nested virtualization enables you to create a multi-VM environment inside a lab's template virtual machine. Publishing the template provides each user in the lab with a VM that's set up with multiple VMs within it.

For more information about nested virtualization and Azure Lab Services, see [Nested virtualization on a template virtual machine](./concept-nested-virtualization-template-vm.md).

To enable nested virtualization on the template VM, you first connect to the VM by using a remote desktop (RDP) client. Then you can apply the configuration changes in either of two ways:

- [Enable nested virtualization by using a script](#enable-nested-virtualization-by-using-a-script).
- [Enable nested virtualization by using Windows tools](#enable-nested-virtualization-by-using-windows-tools).

> [!NOTE]
> Virtualization applications other than Hyper-V are [*not* supported for nested virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization#3rd-party-virtualization-apps). This includes any software that requires hardware virtualization extensions.

>[!IMPORTANT]
>Select **Large (nested virtualization)** or **Medium (nested virtualization)** for the virtual machine size when creating the lab. Nested virtualization will not work otherwise.

## Prerequisites

- A lab plan and one or more labs. Learn how to [Set up a lab plan](quick-create-resources.md) and [Set up a lab](tutorial-setup-lab.md).
- Permission to edit the lab. Learn how to [Add a user to the Lab Creator role](quick-create-resources.md#add-a-user-to-the-lab-creator-role). For more role options, see [Lab Services built-in roles](administrator-guide.md#rbac-roles).

## Enable nested virtualization by using a script

You can use a PowerShell script to set up nested virtualization on a template VM in Azure Lab Services. The following steps will guide you through how to use the [Lab Services Hyper-V scripts](https://github.com/Azure/LabServices/tree/main/ClassTypes/PowerShell/HyperV). The steps are intended for Windows Server 2016, Windows Server 2019, or Windows 10.

1. Follow these steps to [connect to and update the template machine](./how-to-create-manage-template.md#update-a-template-vm).

1. Launch **PowerShell** in **Administrator** mode.

1. You may have to change the execution policy to successfully run the script. Run the following command:

    ```powershell
    Set-ExecutionPolicy bypass -force
    ```

1. Download and run the script:

    ```powershell
    Invoke-WebRequest 'https://aka.ms/azlabs/scripts/hyperV-powershell' -Outfile SetupForNestedVirtualization.ps1
    .\SetupForNestedVirtualization.ps1
    ```

    > [!NOTE]
    > The script may require the machine to be restarted. Follow instructions from the script and re-run the script until **Script completed** is seen in the output.

1. Don't forget to reset the execution policy. Run the following command:

    ```powershell
    Set-ExecutionPolicy default -force
    ```

You've now configured your template VM to use nested virtualization and create VMs inside it.

## Enable nested virtualization by using Windows tools

You can set up nested virtualization on a template VM in Azure Lab Services using Windows roles and tools directly. There are a few things needed on the template VM enable nested virtualization. The following steps describe how to manually set up a Lab Services machine template with Hyper-V. Steps are intended for Windows Server 2016 or Windows Server 2019.

First, follow these steps to [connect to the template virtual machine by using a remote desktop client](./how-to-create-manage-template.md#update-a-template-vm).

### 1. Enable the Hyper-V role

The following steps describe the actions to enable Hyper-V on Windows Server using Server Manager. After enabling Hyper-V, Hyper-V manager is available to add, modify, and delete client VMs.

1. In **Server Manager**, on the Dashboard page, select **Add Roles and Features**.

2. On the **Before you begin** page, select **Next**.
3. On the **Select installation type** page, keep the default selection of Role-based or feature-based installation and then select **Next**.
4. On the **Select destination server** page, select Select a server from the server pool.   The current server will already be selected.  Select Next.
5. On the **Select server roles** page, select **Hyper-V**.  
6. The **Add Roles and Features Wizard** pop-up will appear.  Select **Include management tools (if applicable)**.  Select the **Add Features** button.
7. On the **Select server roles** page, select **Next**.
8. On the **Select features page**, select **Next**.
9. On the **Hyper-V** page, select **Next**.
10. On the **Create Virtual Switches** page, accept the defaults, and select **Next**.
11. On the **Virtual Machine Migration** page, accept the defaults, and select **Next**.
12. On the **Default Stores** page, accept the defaults, and select **Next**.
13. On the **Confirm installation selections** page, select **Restart the destination server automatically if required**.
14. When the **Add Roles and Features Wizard** pop-up appears, select **Yes**.
15. Select **Install**.
16. Wait for the **Installation progress** page to indicate that the Hyper-V role is complete.  The machine may restart in the middle of the installation.
17. Select **Close**.

### 2. Enable the DHCP role

When you create a client VM, it needs an IP address in the Network Address Translation (NAT) network. You'll create the NAT network in a later step. 

To assign the IP addresses automatically, configure the lab VM template as a DHCP server:

1. In **Server Manager**, on the **Dashboard** page, select **Add Roles and Features**.
2. On the **Before you begin** page, select **Next**.
3. On the **Select installation type** page, select **Role-based or feature-based installation** and then select **Next**.
4. On the **Select destination server** page, select the current server from the server pool and then select **Next**.
5. On the **Select server roles** page, select **DHCP Server**.  
6. The **Add Roles and Features Wizard** pop-up will appear.  Select **Include management tools (if applicable)**.  Select **Add Features**.

    >[!NOTE]
    >You may see a validation error stating that no static IP addresses were found.  This warning can be ignored for our scenario.

7. On the **Select server roles** page, select **Next**.
8. On the **Select features** page, select **Next**.
9. On the **DHCP Server** page, select **Next**.
10. On the **Confirm installation selections** page, select **Install**.
11. Wait for the **Installation progress page** to indicate that the DHCP role is complete.
12. Select Close.

### 3. Enable the Routing and Remote Access role

Next, enable the [Routing service](/windows-server/remote/remote-access/remote-access#routing-service) to enable routing network traffic between the VMs on the template VM.

1. In **Server Manager**, on the **Dashboard** page, select **Add Roles and Features**.

2. On the **Before you begin** page, select **Next**.
3. On the **Select installation type** page, select **Role-based or feature-based installation** and then select **Next**.
4. On the **Select destination server** page, select the current server from the server pool and then select **Next**.
5. On the **Select server roles** page, select **Remote Access**. Select **OK**.
6. On the **Select features** page, select **Next**.
7. On the **Remote Access** page, select **Next**.
8. On the **Role Services** page, select **Routing**.
9. The **Add Roles and Features Wizard** pop-up will appear.  Select **Include management tools (if applicable)**.  Select **Add Features**.
10. Select **Next**.
11. On the **Web Server Role (IIS)** page, select **Next**.
12. On the **Select role services** page, select **Next**.
13. On the **Confirm installation selections** page, select **Install**.
14. Wait for the **Installation progress** page to indicate that the Remote Access role is complete.  
15. Select **Close**.

### 4. Create virtual NAT network

Now that you've installed all the necessary roles, you can create the NAT network.  The creation process will involve creating a switch and the NAT network, itself. 

A NAT network assigns a public IP address to a group of VMs on a private network to allow connectivity to the internet. In this case, the group of private VMs consists of the nested VMs. The NAT network allows the nested VMs to communicate with one another.

A switch is a network device that handles receiving and routing of traffic in a network.

#### Create a new virtual switch

To create a virtual switch in Hyper-V:

1. Open **Hyper-V Manager** from Windows Administrative Tools.

2. Select the current server in the left-hand navigation menu.
3. Select **Virtual Switch Manager…** from the **Actions** menu on the right-hand side of the **Hyper-V Manager**.
4. On the **Virtual Switch Manager** pop-up, select **Internal** for the type of switch to create.  Select **Create Virtual Switch**.
5. For the newly created virtual switch, set the name to something memorable.  For this example, we'll use 'LabServicesSwitch'.  Select **OK**.
6. A new network adapter will be created.  The name will be similar to 'vEthernet (LabServicesSwitch)'.  To verify open the **Control Panel**, select **Network and Internet**, select **View network status and tasks**.  On the left, select **Change adapter settings**.

#### Create a NAT network

To create a NAT network on the lab template VM:

1. Open the **Routing and Remote Access** tool from Windows Administrative Tools.

2. Select the local server in the left navigation page.
3. Choose **Action** -> **Configure and Enable Routing and Remote Access**.
4. When **Routing and Remote Access Server Setup Wizard** appears, select **Next**.
5. On the **Configuration** page, select **Network address translation (NAT)** configuration.  Select **Next**.

    >[!WARNING]
    >Do not choose the 'Virtual private network (VPN) access and NAT' option.

6. On **NAT Internet Connection** page, choose 'Ethernet'.  Don't choose the 'vEthernet (LabServicesSwitch)' connection we created in Hyper-V Manager. Select **Next**.
7. Select **Finish** on the last page of the wizard.
8. When the **Start the service** dialog appears, select **Start Service**.
9. Wait until service is started.

### 5. Update network adapter settings

Next, associate the IP address of the network adapter with the default gateway IP of the NAT network you created earlier. In this example, assign an IP address of 192.168.0.1, with a subnet mask of 255.255.255.0. Use the virtual switch that you created earlier.

1. Open the **Control Panel**, select **Network and Internet**, select **View network status and tasks**.

2. On the left, select **Change adapter settings**.  
3. In the **Network Connections** window, double-click on 'vEthernet (LabServicesSwitch)' to show the **vEthernet (LabServicesSwitch) Status** details dialog.
4. Select the **Properties** button.
5. Select **Internet Protocol Version 4 (TCP/IPv4)** item and select the **Properties** button.
6. In the **Internet Protocol Version 4 (TCP/IPv4) Properties** dialog:

    - Select **Use the following IP address**.
    - For the IP address, enter 192.168.0.1. 
    - For the subnet mask, enter 255.255.255.0.
    - Leave the default gateway and DNs servers blank.

    >[!NOTE]
    > The range for the NAT network will be, in CIDR notation, 192.168.0.0/24. This range provides usable IP addresses from 192.168.0.1 to 192.168.0.254.  By convention, gateways have the first IP address in a subnet range.

7. Select OK.

### 6. Create DHCP Scope

Next, you can add a DHCP scope. In this case, our NAT network is 192.168.0.0/24 in CIDR notation. This range provides usable IP addresses from 192.168.0.1 to 192.168.0.254. The scope you create must be in that range of usable addresses, excluding the IP address you assigned in the previous step.

1. Open **Administrative Tools** and open the **DHCP** administrative tool.
2. In the **DHCP** tool, expand the node for the current server and select **IPv4**.
3. From the Action menu, choose **New Scope…**.
4. When the **New Scope Wizard** appears, select **Next** on the **Welcome** page.
5. On the **Scope Name** page, enter 'LabServicesDhcpScope' or something else memorable for the name.  Select **Next**.
6. On the **IP Address Range** page, enter the following values.

    - 192.168.0.100 for the Start IP address
    - 192.168.0.200 for the End IP address
    - 24 for the Length
    - 255.255.255.0 for the Subnet mask

7. Select **Next**.
8. On the **Add Exclusions and Delay** page, select **Next**.
9. On the **Lease Duration** page, select **Next**.
10. On the **Configure DHCP Options** page, select **Yes, I want to configure these options now**. Select **Next**.
11. On the **Router (Default Gateway)**
12. Add 192.168.0.1, if not done already. Select **Next**.
13. On the **Domain Name and DNS Servers** page, add 168.63.129.16 as a DNS server IP address, if not done already.  168.63.129.16 is the IP address for an Azure static DNS server. Select **Next**.
14. On the **WINS Servers** page, select **Next**.
15. One the **Activate Scope** page, select **Yes, I want to activate this scope now**.  Select **Next**.
16. On the **Completing the New Scope Wizard** page, select **Finish**.


## Conclusion

Now your template machine is ready to create Hyper-V virtual machines. See [Create a Virtual Machine in Hyper-V](/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-in-hyper-v) for instructions on how to create Hyper-V virtual machines. Also, see [Microsoft Evaluation Center](https://www.microsoft.com/evalcenter/) to check out available operating systems and software.

## Next steps

Next steps are common to setting up any lab.

- [Add users](tutorial-setup-lab.md#add-users-to-the-lab)
- [Set quota](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-lab.md#add-a-lab-schedule)
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users)
