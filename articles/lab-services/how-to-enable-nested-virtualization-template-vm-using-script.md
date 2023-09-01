---
title: Enable nested virtualization
titleSuffix: Azure Lab Services
description: Learn how to enable nested virtualization on a template VM in Azure Lab Services to create multi-VM labs.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 06/27/2023
---

# Enable nested virtualization in Azure Lab Services

Nested virtualization enables you to create a lab in Azure Lab Services that contains a multi-VM environment. To avoid that lab users need to enable nested virtualization on their lab VM and install the nested VMs inside it, you can prepare a lab template. When you publish the lab, each lab user has a lab VM that already contains the nested virtual machines.

For concepts, considerations, and recommendations about nested virtualization, see [nested virtualization in Azure Lab Services](./concept-nested-virtualization-template-vm.md).

> [!NOTE]
> Virtualization applications other than Hyper-V are [*not* supported for nested virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization#3rd-party-virtualization-apps). This includes any software that requires hardware virtualization extensions.

>[!IMPORTANT]
>Select **Large (nested virtualization)** or **Medium (nested virtualization)** for the virtual machine size when creating the lab. Nested virtualization will not work otherwise.

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]
[!INCLUDE [Create and manage labs](./includes/lab-services-prerequisite-create-lab.md)]
[!INCLUDE [Existing lab plan](./includes/lab-services-prerequisite-lab-plan.md)]

## Enable nested virtualization

To enable nested virtualization on the template VM, you first connect to the VM by using a remote desktop (RDP) client. You can then apply the configuration changes by either running a PowerShell script or using Windows tools.

# [PowerShell](#tab/powershell)

You can use a PowerShell script to set up nested virtualization on a template VM in Azure Lab Services. The following steps guide you through how to use the [Lab Services Hyper-V scripts](https://github.com/Azure/LabServices/tree/main/ClassTypes/PowerShell/HyperV). The steps are intended for Windows Server 2016, Windows Server 2019, or Windows 10.

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

# [Windows tools](#tab/windows)

You can set up nested virtualization on a template VM in Azure Lab Services using Windows roles and tools directly. There are a few things needed on the template VM enable nested virtualization. The following steps describe how to manually set up a Lab Services machine template with Hyper-V. Steps are intended for Windows Server 2016 or Windows Server 2019.

First, follow these steps to [connect to the template virtual machine by using a remote desktop client](./how-to-create-manage-template.md#update-a-template-vm).

### 1. Enable the Hyper-V role

The following steps describe the actions to enable Hyper-V on Windows Server using Server Manager. After enabling Hyper-V, Hyper-V manager is available to add, modify, and delete client VMs.

1. In **Server Manager**, on the Dashboard page, select **Add Roles and Features**.

2. On the **Before you begin** page, select **Next**.
3. On the **Select installation type** page, keep the default selection of Role-based or feature-based installation and then select **Next**.
4. On the **Select destination server** page, select Select a server from the server pool.   The current server is already selected.  Select **Next**.
5. On the **Select server roles** page, select **Hyper-V**.  
6. The **Add Roles and Features Wizard** pop-up appears.  Select **Include management tools (if applicable)**.  Select the **Add Features** button.
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

When you create a client VM, it needs an IP address in the Network Address Translation (NAT) network. Create the NAT network in a later step. 

To assign the IP addresses automatically, configure the lab VM template as a DHCP server:

1. In **Server Manager**, on the **Dashboard** page, select **Add Roles and Features**.
2. On the **Before you begin** page, select **Next**.
3. On the **Select installation type** page, select **Role-based or feature-based installation** and then select **Next**.
4. On the **Select destination server** page, select the current server from the server pool and then select **Next**.
5. On the **Select server roles** page, select **DHCP Server**.  
6. The **Add Roles and Features Wizard** pop-up appears.  Select **Include management tools (if applicable)**.  Select **Add Features**.

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
9. The **Add Roles and Features Wizard** pop-up appears.  Select **Include management tools (if applicable)**.  Select **Add Features**.
10. Select **Next**.
11. On the **Web Server Role (IIS)** page, select **Next**.
12. On the **Select role services** page, select **Next**.
13. On the **Confirm installation selections** page, select **Install**.
14. Wait for the **Installation progress** page to indicate that the Remote Access role is complete.  
15. Select **Close**.

### 4. Create virtual NAT network

Now that you've installed all the necessary roles, you can create the NAT network.  The creation process involves creating a switch and the NAT network, itself. 

A NAT network assigns a public IP address to a group of VMs on a private network to allow connectivity to the internet. In this case, the group of private VMs consists of the nested VMs. The NAT network allows the nested VMs to communicate with one another.

A switch is a network device that handles receiving and routing of traffic in a network.

#### Create a new virtual switch

To create a virtual switch in Hyper-V:

1. Open **Hyper-V Manager** from Windows Administrative Tools.

2. Select the current server in the left-hand navigation menu.
3. Select **Virtual Switch Manager…** from the **Actions** menu on the right-hand side of the **Hyper-V Manager**.
4. On the **Virtual Switch Manager** pop-up, select **Internal** for the type of switch to create.  Select **Create Virtual Switch**.
5. For the newly created virtual switch, set the name to something memorable.  For this example, we use 'LabServicesSwitch'.  Select **OK**.
6. A new network adapter is created.  The name is similar to 'vEthernet (LabServicesSwitch)'.  To verify open the **Control Panel**, select **Network and Internet**, select **View network status and tasks**.  On the left, select **Change adapter settings**.

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

---

You've now configured your template VM to use nested virtualization and create VMs inside it.

## Troubleshooting

### The Linux VM is only showing a black screen

Perform the following steps to verify your nested VM configuration:

- Check which [Hyper-V virtual machine generation](/windows-server/virtualization/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v) you used for the nested VM. Some Linux distributions don't work with Gen 1 Hyper-V VMs.

    Learn more about the [supported guest operating systems in Hyper-V](/virtualization/hyper-v-on-windows/about/supported-guest-os).

### Hyper-V doesn't start with error `The virtual machine is using processor-specific xsave features not supported`

- This error can happen when a lab user leaves the Hyper-V VM in the saved state. You can right-select the VM in Hyper-V Manager and select **Delete saved state**.

    > [!CAUTION]
    > Deleting the saved state means that any unsaved work is lost, but anything saved to disk remains intact.

- This error can happen when the Hyper-V VM is turned off and the VHDX file is corrupted. If the lab user has created a backup of the VDHX file, or saved a snapshot, they can restore the VM from that point.

It's recommended that Hyper-V VMs have their [automatic shutdown action set to shutdown](./concept-nested-virtualization-template-vm.md#automatically-shut-down-nested-vms).

### Hyper-V is too slow

Increase the number vCPUs and memory that is assigned to the Hyper-V VM in Hyper-V Manager. The total number of vCPUs can't exceed the number of cores of the host VM (lab VM). If you're using variable memory, the default option, increase the minimum amount of memory assigned to the VM. The maximum amount of assigned memory (if using variable memory) can exceed the amount of memory of the host VM. This allows greater flexibility when having to complete intensive operations on just one of the Hyper-V VMs.

If you're using the Medium (Nested Virtualization) VM size for the lab, consider using the Large (Nested Virtualization) VM size instead to have more compute resources for each lab VM.
 
### Internet connectivity isn't working for nested VMs

- Confirm that you followed the previous steps for enabling nested virtualization. Consider using the PowerShell script option.

- If you're running a system administration class, consider not using the host VM (lab VM) as the DHCP server.

    Changing the settings of the lab VM can cause issues with other lab VMs. Create an internal or private NAT network and have one of the VMs act as the DHCP, DNS, or domain controller. Using private over internal does mean that Hyper-V VMs don't have internet access.

- Check the network adapter settings for the Hyper-V VM:

    - Set the IP address of the DNS server and DHCP server to [*168.63.129.16*](/azure/virtual-network/what-is-ip-address-168-63-129-16).
    - Set the guest VM IPv4 address in the range of the [NAT network you created previously](#create-a-nat-network).

> [!NOTE]
> The ping command from a Hyper-V VM to the host VM doesn't work. To test internet connectivity, launch a web browser and verify that the web page loads correctly.
  
## Next steps

Now that you've configured nested virtualization on the template VM, you can [create nested virtual machines with Hyper-V](/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-in-hyper-v). See [Microsoft Evaluation Center](https://www.microsoft.com/evalcenter/) to check out available operating systems and software.

- [Add lab users](how-to-manage-lab-users.md)
- [Set quota hours](how-to-manage-lab-users.md#set-quotas-for-users)
- [Configure a lab schedule](./how-to-create-schedules.md)
