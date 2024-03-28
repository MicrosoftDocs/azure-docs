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

> [!IMPORTANT]
> We recommend that you use nested virtualization with Windows 11. You can take advantage of the 'Default Switch' created when you install Hyper-V on a Windows client OS. You should use nested virtualization on Windows Server operating systems when you require additional control over the network settings.

# [PowerShell](#tab/powershell)

You can use a PowerShell script to set up nested virtualization on a template VM in Azure Lab Services. The following steps guide you through how to use the [Lab Services Hyper-V scripts](https://github.com/Azure/LabServices/tree/main/ClassTypes/PowerShell/HyperV). The script is intended for Windows 11.

1. Follow these steps to [connect to and update the template machine](./how-to-create-manage-template.md#update-a-template-vm).

1. Launch **PowerShell** as an Administrator.

1. You might have to change the execution policy to successfully run the script. Run the following command:

    ```powershell
    Set-ExecutionPolicy bypass -force
    ```

1. Download and run the script to enable the Hyper-V feature and tools.

    ```powershell
    Invoke-WebRequest 'https://aka.ms/azlabs/scripts/hyperV-powershell' -Outfile SetupForNestedVirtualization.ps1
    .\SetupForNestedVirtualization.ps1
    ```

    > [!NOTE]
    > The script might require you to restart the VM. If so, stop and start the template VM from the [Azure Lab Services website](https://labs.azure.com) and re-run the script until you see **Script completed** in the output.

1. Don't forget to reset the execution policy.

    ```powershell
    Set-ExecutionPolicy default -force
    ```

The template VM is now configured for use with nested virtualization. You can [create VMs](/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-in-hyper-v?tabs=hyper-v-manager) inside it. Use the switch specified by the script when creating new Hyper-V VMs.

# [Windows tools](#tab/windows)

You can set up nested virtualization on a template VM in Azure Lab Services by using Windows features and tools directly. The following steps describe how to manually set up a Lab Services machine template with Hyper-V. These steps are intended for Windows 11.

1. Open the **Settings** page.
1. Select **Apps**.
1. Select **Optional features**.
1. Select **More Windows features** under the **Related features** section.
1. The **Windows features** pop-up appears. Check the **Hyper-V** feature and select **OK**.
1. Wait for the Hyper-V feature to be installed. When prompted to restart the VM, select **Don't restart**.
1. To start and stop the template VM, go to the [Azure Lab Services website](https://labs.azure.com).

The template VM is now configured to use nested virtualization.  You can [create VMs](/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-in-hyper-v?tabs=hyper-v-manager) inside it. Use Default Switch when you create new nested VMs with Hyper-V.

---

## Connect to a nested VM in another lab VM

Extra configuration is required to connect from a nested VM on one lab VM to a nested VM that is hosted in another lab VM. Add a static mapping to the NAT instance with the [Add-NetNatStaticMapping](/powershell/module/netnat/add-netnatstaticmapping) PowerShell cmdlet.

> [!NOTE]
> You can't use the `ping` command to test connectivity from or to a nested VM.

> [!NOTE]
> The static mapping only works when you use private IP addresses. The VM that the lab user is connecting from must be a lab VM, or the VM has to be on the same network if using advanced networking.

### Example scenarios

Consider the following sample lab setup:

- Lab VM 1 (Windows Server 2022, IP 10.0.0.8)
  - Nested VM 1-1 (Ubuntu 20.04, IP 192.168.0.102, SSH allowed)
  - Nested VM 1-2 (Windows 11, IP 192.168.0.103, remote desktop enabled and allowed)

- Lab VM 2 (Windows Server 2022, IP 10.0.0.9)
  - Nested VM 2-1 (Ubuntu 20.04, IP 192.168.0.102, SSH allowed)
  - Nested VM 2-2 (Windows 11, IP 192.168.0.103, remote desktop enabled and allowed)

Enable connection with SSH from lab VM 2 to nested lab VM 1-1:

1. On lab VM 1, add a static mapping:

    ```powershell
    Add-NetNatStaticMapping -NatName "LabServicesNat" -Protocol TCP -ExternalIPAddress 0.0.0.0 -InternalIPAddress 192.168.0.102 -InternalPort 22 -ExternalPort 23
    ```

1. On lab VM 2, connect using SSH:

    ```bash
    ssh user1@10.0.0.8 -p 23
    ```

Enable connection with RDP from lab VM 2, or its nested VMs, to nested lab VM 1-2:

1. On lab VM 1, add a static mapping.

    ```powershell
    Add-NetNatStaticMapping -NatName "LabServicesNat" -Protocol TCP -ExternalIPAddress 0.0.0.0 -InternalIPAddress 192.168.0.103 -InternalPort 3389 -ExternalPort 3390
    ```

1. On lab VM 2, or its nested VMs, connect using RDP to `10.0.0.8:3390`.

    > [!IMPORTANT]
    > Include `~\` in front of the user name. For example, `~\Administrator` or `~\user1`.

## Troubleshooting

These suggestions might address some common issues.

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

Increase the number vCPUs and memory that is assigned to the Hyper-V VM in Hyper-V Manager. The total number of vCPUs can't exceed the number of cores of the host VM (lab VM). If you're using variable memory, the default option, increase the minimum amount of memory assigned to the VM. The maximum amount of assigned memory, if you use variable memory, can exceed the amount of memory of the host VM. This approach allows greater flexibility when having to complete intensive operations on just one of the Hyper-V VMs.

If you're using the **Medium (Nested Virtualization)** VM size for the lab, consider using the **Large (Nested Virtualization)** VM size instead to have more compute resources for each lab VM.

### Internet connectivity isn't working for nested VMs

- Verify that you followed the previous steps for enabling nested virtualization. Consider using the PowerShell script option.

- Check if the host VM (lab VM) has the DHCP role installed if you're using Windows Server.

  Running a lab VM as a DHCP server isn't supported. See [Can I deploy a DHCP server in a virtual network?](../virtual-network/virtual-networks-faq.md). Changing the settings of the lab VM can cause issues with other lab VMs.

- Check the network adapter settings for the Hyper-V VM.

  - Set the IP address of the DNS server and DHCP server to [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md).
  - If the guest VM IPv4 address is set manually, verify that it's in the range of the NAT network connected to the Hyper-V switch.
  - Try enabling Hyper-V [DHCP guard](/archive/blogs/virtual_pc_guy/hyper-v-networkingdhcp-guard) and [Router guard](/archive/blogs/virtual_pc_guy/hyper-v-networkingrouter-guard).

    ```powershell
    Get-VMNetworkAdapter * | Set-VMNetworkAdapter -RouterGuard On -DhcpGuard On
    ```

> [!NOTE]
> You can't use the `ping` command from a Hyper-V VM to the host VM. To test internet connectivity, launch a web browser and verify that the web page loads correctly.

### Can't start Hyper-V VMs

You might choose to create a non-admin user when you create a lab. To be able to start or stop Hyper-V VMs, you must add such a user to the **Hyper-V Administrators** group. For more information about Hyper-V and non-admin users, see [Non-admin user](concept-nested-virtualization-template-vm.md#non-admin-user).
  
## Related content

After you configure nested virtualization on the template VM, you can [create nested virtual machines with Hyper-V](/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-in-hyper-v). See [Microsoft Evaluation Center](https://www.microsoft.com/evalcenter/) to check out available operating systems and software.

- [Add lab users](how-to-manage-lab-users.md)
- [Set quota hours](how-to-manage-lab-users.md#set-quotas-for-users)
- [Configure a lab schedule](./how-to-create-schedules.md)
