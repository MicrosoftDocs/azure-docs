---
title: Enable nested virtualization
titleSuffix: Azure Lab Services
description: Learn how to enable nested virtualization on a template VM in Azure Lab Services to create multi-VM labs.
services: lab-services
ms.service: lab-services
author: RoseHJM
ms.author: rosemalcolm
ms.topic: how-to
ms.date: 03/04/2024
#customer intent: As an administrator or educator, I want to set up labs in Azure Lab Services that include multiple embedded virtual machines because some learning tasks require multiple computers interacting on a network.
---

# Enable nested virtualization in Azure Lab Services

Nested virtualization supports a lab in Azure Lab Services that contains a multiple virtual machine (VM) environment. You can prepare a lab template for your multiple VM environment. Users don't need to enable nested virtualization on their lab VM or install the nested VMs on it. When you publish the lab, each lab user has a lab VM that already contains the nested virtual machines.

## Prerequisites

[!INCLUDE [Azure subscription](./includes/lab-services-prerequisite-subscription.md)]
[!INCLUDE [Create and manage labs](./includes/lab-services-prerequisite-create-lab.md)]
[!INCLUDE [Existing lab plan](./includes/lab-services-prerequisite-lab-plan.md)]

For concepts, considerations, and recommendations about nested virtualization, see [nested virtualization in Azure Lab Services](./concept-nested-virtualization-template-vm.md).

> [!NOTE]
> Virtualization applications other than Hyper-V aren't [supported for nested virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization#3rd-party-virtualization-apps). This includes any software that requires hardware virtualization extensions.

> [!IMPORTANT]
> Select **Large (nested virtualization)** or **Medium (nested virtualization)** for the virtual machine size when creating the lab. Nested virtualization doesn't work otherwise.

## Enable nested virtualization

To enable nested virtualization on the template VM, first connect to the VM by using a remote desktop (RDP) client. You can then apply the configuration changes by either running a PowerShell script or using Windows tools.

# [PowerShell](#tab/powershell)

You can use a PowerShell script to set up nested virtualization on a template VM in Azure Lab Services. The following steps guide you through how to use the [Lab Services Hyper-V scripts](https://github.com/Azure/LabServices/tree/main/ClassTypes/PowerShell/HyperV). The steps are intended for Windows Server 2016, Windows Server 2019, or Windows 10.

1. Follow these steps to [connect to and update the template machine](./how-to-create-manage-template.md#update-a-template-vm).

1. Launch **PowerShell** in **Administrator** mode.

1. You might have to change the execution policy to successfully run the script. Run the following command:

    ```powershell
    Set-ExecutionPolicy bypass -force
    ```

1. Download and run the script.

    ```powershell
    Invoke-WebRequest 'https://aka.ms/azlabs/scripts/hyperV-powershell' -Outfile SetupForNestedVirtualization.ps1
    .\SetupForNestedVirtualization.ps1
    ```

    > [!NOTE]
    > The script might require the machine to restart. Follow instructions from the script and re-run the script until you see **Script completed** in the output.

1. Don't forget to reset the execution policy. Run the following command.

    ```powershell
    Set-ExecutionPolicy default -force
    ```

# [Windows tools](#tab/windows)

You can set up nested virtualization on a template VM in Azure Lab Services using Windows roles and tools directly. There are a few things needed on the template VM enable nested virtualization. The following steps describe how to manually set up a Lab Services machine template with Hyper-V. Steps are intended for Windows Server 2016 or Windows Server 2019.

First, follow these steps to [connect to the template virtual machine by using a remote desktop client](./how-to-create-manage-template.md#update-a-template-vm).

### Enable the Hyper-V role

The following steps describe the actions to enable Hyper-V on Windows Server using Server Manager. After enabling Hyper-V, Hyper-V manager is available to add, modify, and delete client VMs.

1. In **Server Manager**, on the **Dashboard** page, select **Add roles and features**.
1. On the **Before you begin** page, select **Next**.
1. On the **Select installation type** page, keep the default selection of **Role-based or feature-based installation** and select **Next**.
1. On the **Select destination server** page, choose a server from the server pool. The current server is already selected. Select **Next**.
1. On the **Select server roles** page, select **Hyper-V**.
1. The **Add Roles and Features Wizard** dialog box appears. Select **Include management tools (if applicable)**, then select **Add Features**.
1. For the **Select server roles** page, the **Select features page**, and the **Hyper-V** page, select **Next**.
1. On the **Create Virtual Switches** page, the **Virtual Machine Migration** page, and the **Default Stores** page, accept the defaults, and select **Next**.
1. On the **Confirm installation selections** page, select **Restart the destination server automatically if required**. When the **Add Roles and Features Wizard** dialog box appears, select **Yes**.
1. Select **Install**. Wait for the **Installation progress** page to indicate that the Hyper-V role is complete. The machine might restart in the middle of the installation.
1. Select **Close**.

### Enable the DHCP role

When you create a client VM, it needs an IP address in the Network Address Translation (NAT) network. Create the NAT network in a later step.

To assign the IP addresses automatically, configure the lab VM template as a DHCP server:

1. In **Server Manager**, on the **Dashboard** page, select **Add roles and features**.
1. On the **Before you begin** page, select **Next**.
1. On the **Select installation type** page, select **Role-based or feature-based installation** and select **Next**.
1. On the **Select destination server** page, choose the current server from the server pool and select **Next**.
1. On the **Select server roles** page, select **DHCP Server**.
1. The **Add Roles and Features Wizard** dialog box appears. Select **Include management tools (if applicable)**. Select **Add Features**.

   > [!NOTE]
   > You might see a validation result that states that no static IP addresses were found. You can ignore this warning for this scenario.

1. On the **Select server roles** page, select **Next**.
1. On the **Select features** page and the **DHCP Server** page, select **Next**.
1. On the **Confirm installation selections** page, select **Install**. Wait for the **Installation progress page** to indicate that the DHCP role is complete.
1. Select **Close**.

### Enable the Routing and Remote Access role

Enable the [Routing service](/windows-server/remote/remote-access/remote-access#routing-service) to enable routing network traffic between the VMs on the template VM.

1. In **Server Manager**, on the **Dashboard** page, select **Add roles and features**.
1. On the **Before you begin** page, select **Next**.
1. On the **Select installation type** page, select **Role-based or feature-based installation** and select **Next**.
1. On the **Select destination server** page, choose the current server from the server pool and select **Next**.
1. On the **Select server roles** page, select **Remote Access**. Select **Next**.
1. On the **Select features** page and the **Remote Access** page, select **Next**.
1. On the **Select role services** page, select **Routing**.
1. The **Add Roles and Features Wizard** dialog box appears. Select **Include management tools (if applicable)**. Select **Add Features**.
1. Select **Next**.
1. On the **Web Server Role (IIS)** page and the **Select role services** page, select **Next**.
1. On the **Confirm installation selections** page, select **Install**. Wait for the **Installation progress** page to indicate that the Remote Access role is complete.
1. Select **Close**.

### Create virtual NAT network

After you install all the necessary roles, create the NAT network. The creation process involves creating a switch and the NAT network, itself.

A NAT network assigns a public IP address to a group of VMs on a private network to allow connectivity to the internet. In this case, the group of private VMs consists of the nested VMs. The NAT network allows the nested VMs to communicate with one another.

A switch is a network device that handles receiving and routing of traffic in a network.

#### Create a new virtual switch

Create a virtual switch in Hyper-V.

1. Open **Hyper-V Manager** from Windows Administrative Tools.
1. In the left-hand navigation menu, select the current server.
1. In the **Actions** menu on the right, select **Virtual Switch Manager**.
1. In the **Virtual Switch Manager** dialog box, select **Internal** for the type of switch to create. Select **Create Virtual Switch**.
1. For the newly created virtual switch, set the name to something memorable, such as *LabServicesSwitch*. Select **OK**.

   A new network adapter is created. The name is similar to *vEthernet (LabServicesSwitch)*. To verify open the **Control Panel**, select **Network and Internet**, select **View network status and tasks**. On the left, select **Change adapter settings**.

#### Create a NAT network

Create a NAT network on the lab template VM.

> [!NOTE]
> You might need to restart your VM after you create the switch in the previous section to see the options for this procedure.

1. Open the **Routing and Remote Access** tool from Windows Administrative Tools.
1. In the navigation pane, select the local server.
1. Choose **Action** > **Configure and Enable Routing and Remote Access**.
1. When the **Routing and Remote Access Server Setup Wizard** appears, select **Next**.
1. On the **Configuration** page, select **Network address translation (NAT)** configuration. Select **Next**.

   > [!WARNING]
   > Don't choose the **Virtual private network (VPN) access and NAT** option.

1. On **NAT Internet Connection** page, choose **Ethernet**. Don't choose the **vEthernet (LabServicesSwitch)** connection you created in Hyper-V Manager. Select **Next**.
1. Select **Finish** on the last page of the wizard.
1. When the **Start the service** dialog box appears, select **Start Service**.

   Wait until service start.

### Update network adapter settings

Associate the IP address of the network adapter with the default gateway IP of the NAT network that you created earlier. In this example, assign an IP address of 192.168.0.1, with a subnet mask of 255.255.255.0. Use the virtual switch that you created earlier.

1. Open the **Control Panel**, select **Network and Internet**, select **View network status and tasks**.
1. On the left, select **Change adapter settings**.
1. In the **Network Connections** window, double-click on **vEthernet (LabServicesSwitch)** to show the **vEthernet (LabServicesSwitch) Status** dialog box.
1. Select **Properties**.
1. Select **Internet Protocol Version 4 (TCP/IPv4)** item and select **Properties**.
1. In **Internet Protocol Version 4 (TCP/IPv4) Properties**, enter these values.

    - Select **Use the following IP address**.
    - For the IP address, enter 192.168.0.1.
    - For the subnet mask, enter 255.255.255.0.
    - Leave the default gateway and DNS servers blank.

    >[!NOTE]
    > The range for the NAT network is, in CIDR notation, 192.168.0.0/24. This range provides usable IP addresses from 192.168.0.1 to 192.168.0.254. By convention, gateways have the first IP address in a subnet range.

1. Select **OK** and **Close**.

### Create DHCP Scope

Add a DHCP scope. In this case, your NAT network is 192.168.0.0/24 in CIDR notation. This range provides usable IP addresses from 192.168.0.1 to 192.168.0.254. The scope you create must be in that range of usable addresses, excluding the IP address you assigned in the previous step.

1. Open the **DHCP** tool from Windows Administrative Tools.
1. In the **DHCP** tool, expand the node for the current server, and select **IPv4**.
1. From the **Action** menu, choose **New Scope**.
1. When the **New Scope Wizard** appears, on the **Welcome** page, select **Next**.
1. On the **Scope Name** page, enter *LabServicesDhcpScope* or something else memorable for the name. Select **Next**.
1. On the **IP Address Range** page, enter the following values, and then select **Next**.

    - 192.168.0.100 for the Start IP address
    - 192.168.0.200 for the End IP address
    - 24 for the Length
    - 255.255.255.0 for the Subnet mask

1. On the **Add Exclusions and Delay** page and the **Lease Duration** page, select **Next**.
1. On the **Configure DHCP Options** page, select **Yes, I want to configure these options now**. Select **Next**.
1. On the **Router (Default Gateway)**, add *192.168.0.1*, if not done already. Select **Next**.
1. On the **Domain Name and DNS Servers** page, add *168.63.129.16* as a DNS server IP address, if not done already. 168.63.129.16 is the IP address for an Azure static DNS server. Select **Next**.
1. On the **WINS Servers** page, select **Next**.
1. One the **Activate Scope** page, select **Yes, I want to activate this scope now**. Select **Next**.
1. On the **Completing the New Scope Wizard** page, select **Finish**.

---

You configured your template VM to use nested virtualization and create VMs inside it.

## Troubleshooting

### The Linux VM is only showing a black screen

Perform the following steps to verify your nested VM configuration:

- Check which [Hyper-V virtual machine generation](/windows-server/virtualization/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v) you used for the nested VM. Some Linux distributions don't work with Gen 1 Hyper-V VMs.

  Learn more about the [supported guest operating systems in Hyper-V](/virtualization/hyper-v-on-windows/about/supported-guest-os).

### Hyper-V doesn't start with error `The virtual machine is using processor-specific xsave features not supported`

- This error can happen when a lab user leaves the Hyper-V VM in the saved state. You can right-select the VM in Hyper-V Manager and select **Delete saved state**.

  > [!CAUTION]
  > Deleting the saved state means that any unsaved work is lost, but anything saved to disk remains intact.

- This error can happen when the Hyper-V VM is turned off and the VHDX file is corrupted. If the lab user creates a backup of the VDHX file, or saved a snapshot, they can restore the VM from that point.

We recommend that you set Hyper-V VMs [automatic shutdown action set to shutdown](./concept-nested-virtualization-template-vm.md#automatically-shut-down-nested-vms).

### Hyper-V is too slow

Increase the number vCPUs and memory that is assigned to the Hyper-V VM in Hyper-V Manager. The total number of vCPUs can't exceed the number of cores of the host VM (lab VM). If you're using variable memory, the default option, increase the minimum amount of memory assigned to the VM. The maximum amount of assigned memory, if using variable memory, can exceed the amount of memory of the host VM. This approach allows greater flexibility when having to complete intensive operations on just one of the Hyper-V VMs.

If you're using the **Medium (Nested Virtualization)** VM size for the lab, consider using the **Large (Nested Virtualization)** VM size instead to have more compute resources for each lab VM.

### Internet connectivity isn't working for nested VMs

- Confirm that you followed the previous steps for enabling nested virtualization. Consider using the PowerShell script option.

- If you're running a system administration class, consider not using the host VM (lab VM) as the DHCP server.

  Changing the settings of the lab VM can cause issues with other lab VMs. Create an internal or private NAT network and have one of the VMs act as the DHCP, DNS, or domain controller. Using private over internal does mean that Hyper-V VMs don't have internet access.

- Check the network adapter settings for the Hyper-V VM:

  - Set the IP address of the DNS server and DHCP server to [168.63.129.16](/azure/virtual-network/what-is-ip-address-168-63-129-16).
  - Set the guest VM IPv4 address in the range of the [NAT network you created previously](#create-a-nat-network).

> [!NOTE]
> The `ping` command from a Hyper-V VM to the host VM doesn't work. To test internet connectivity, launch a web browser and verify that the web page loads correctly.
  
## Related content

After you configure nested virtualization on the template VM, you can [create nested virtual machines with Hyper-V](/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-in-hyper-v). See [Microsoft Evaluation Center](https://www.microsoft.com/evalcenter/) to check out available operating systems and software.

- [Add lab users](how-to-manage-lab-users.md)
- [Set quota hours](how-to-manage-lab-users.md#set-quotas-for-users)
- [Configure a lab schedule](./how-to-create-schedules.md)
