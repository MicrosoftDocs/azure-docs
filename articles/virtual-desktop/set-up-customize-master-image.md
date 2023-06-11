---
title: Prepare and customize a VHD image of Azure Virtual Desktop - Azure
description: How to prepare, customize and upload a Azure Virtual Desktop image to Azure.
author: Heidilohr
ms.topic: how-to
ms.date: 04/21/2023
ms.author: helohr
manager: femila
---
# Prepare and customize a VHD image for Azure Virtual Desktop

This article tells you how to prepare a master virtual hard disk (VHD) image for upload to Azure, including how to create virtual machines (VMs) and install software on them. These instructions are for a Azure Virtual Desktop-specific configuration that can be used with your organization's existing processes.

>[!IMPORTANT]
>We recommend you use an image from the Azure Compute Gallery or the Azure portal. However, if you do need to use a customized image, make sure you don't already have the Azure Virtual Desktop Agent installed on your VM. If you do, either follow the instructions in [Step 1: Uninstall all agent, boot loader, and stack component programs](troubleshoot-agent.md#step-1-uninstall-all-agent-boot-loader-and-stack-component-programs) to uninstall the Agent and all related components from your VM or create a new image from a VM with the Agent uninstalled. Using a customized image with the Azure Virtual Desktop Agent can cause problems with the image, such as blocking registration as the host pool registration token will have expired which will prevent user session connections.  

## Create a VM

Windows 10 Enterprise multi-session is available in the Azure Compute Gallery or the Azure portal. There are two options for customizing this image.

The first option is to provision a virtual machine (VM) in Azure by following the instructions in [Create a VM from a managed image](../virtual-machines/windows/create-vm-generalized-managed.md), and then skip ahead to [Software preparation and installation](set-up-customize-master-image.md#software-preparation-and-installation).

The second option is to create the image locally by downloading the image, provisioning a Hyper-V VM, and customizing it to suit your needs, which we cover in the following section.

### Local image creation

You can download an image following the instructions in [Export an image version to a managed disk](../virtual-machines/managed-disk-from-image-version.md) and then [Download a Windows VHD from Azure](../virtual-machines/windows/download-vhd.md). Once you've downloaded the image to a local location, open **Hyper-V Manager** to create a VM with the VHD you copied. The following instructions are a simple version, but you can find more detailed instructions in [Create a virtual machine in Hyper-V](/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-in-hyper-v/).

To create a VM with the copied VHD:

1. Open the **New Virtual Machine Wizard**.

2. On the Specify Generation page, select **Generation 1**.

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the Specify Generation page. The "Generation 1" option is selected.](media/a41174fd41302a181e46385e1e701975.png)

3. Under Checkpoint Type, disable checkpoints by unchecking the check box.

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the Checkpoint Type section of the Checkpoints page.](media/20c6dda51d7cafef33251188ae1c0c6a.png)

You can also run the following cmdlet in PowerShell to disable checkpoints.

```powershell
Set-VM -Name <VMNAME> -CheckpointType Disabled
```

### Fixed disk

If you create a VM from an existing VHD, it creates a dynamic disk by default. It can be changed to a fixed disk by selecting **Edit Disk...** as shown in the following image. For more detailed instructions, see [Prepare a Windows VHD or VHDX to upload to Azure](../virtual-machines/windows/prepare-for-upload-vhd-image.md).

> [!div class="mx-imgBorder"]
> ![A screenshot of the Edit Disk option.](media/35772414b5a0f81f06f54065561d1414.png)

You can also run the following PowerShell command to change the disk to a fixed disk.

```powershell
Convert-VHD –Path c:\test\MY-VM.vhdx –DestinationPath c:\test\MY-NEW-VM.vhd -VHDType Fixed
```

## Software preparation and installation

This section covers how to prepare and install FSLogix and Windows Defender, as well as some basic configuration options for apps and your image's registry.

If you're installing Microsoft 365 Apps for enterprise and OneDrive on your VM, go to [Install Office on a master VHD image](install-office-on-wvd-master-image.md) and follow the instructions there to install the apps. After you're done, return to this article.

If your users need to access certain LOB applications, we recommend you install them after completing this section's instructions.

### Set up user profile container (FSLogix)

To include the FSLogix container as part of the image, follow the instructions in [Create a profile container for a host pool using a file share](create-host-pools-user-profile.md#configure-the-fslogix-profile-container). You can test the functionality of the FSLogix container with [this quickstart](/fslogix/configure-cloud-cache-tutorial/).

### Configure Windows Defender

If Windows Defender is configured in the VM, make sure it's configured to not scan the entire contents of VHD and VHDX files during attachment.

This configuration only removes scanning of VHD and VHDX files during attachment, but won't affect real-time scanning.

For more detailed instructions for how to configure Windows Defender, see [Configure Windows Defender Antivirus exclusions on Windows Server](/windows/security/threat-protection/windows-defender-antivirus/configure-server-exclusions-windows-defender-antivirus/).

To learn more about how to configure Windows Defender to exclude certain files from scanning, see [Configure and validate exclusions based on file extension and folder location](/windows/security/threat-protection/windows-defender-antivirus/configure-extension-file-exclusions-windows-defender-antivirus/).

### Disable Automatic Updates

To disable Automatic Updates via local Group Policy:

1. Open **Local Group Policy Editor\\Administrative Templates\\Windows Components\\Windows Update**.
2. Right-click **Configure Automatic Update** and set it to **Disabled**.

You can also run the following command from an elevated PowerShell prompt to disable Automatic Updates.

```powershell
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" -Name NoAutoUpdate -PropertyType DWORD -Value 1 -Force
```

### Specify Start layout for Windows 10 PCs (optional)

Run the following command from an elevated PowerShell prompt to specify a Start layout for Windows 10 PCs.

```powershell
New-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer" -Name SpecialRoamingOverrideAllowed -PropertyType DWORD -Value 1 -Force
```

### Set up time zone redirection

Time zone redirection can be enforced on Group Policy level since all VMs in a host pool are part of the same security group.

To redirect time zones:

1. On the Active Directory server, open the **Group Policy Management Console**.
2. Expand your domain and Group Policy Objects.
3. Right-click the **Group Policy Object** that you created for the group policy settings and select **Edit**.
4. In the **Group Policy Management Editor**, navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.
5. Enable the **Allow time zone redirection** setting.

You can also run the following command from an elevated PowerShell prompt to redirect time zones:

```powershell
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" -Name fEnableTimeZoneRedirection -PropertyType DWORD -Value 1 -Force
```

### Disable Storage Sense

For Azure Virtual Desktop session hosts that use Windows 10 Enterprise or Windows 10 Enterprise multi-session, we recommend disabling Storage Sense. Disks where the operating system is installed are typically small in size and user data is stored remotely through profile roaming. This scenario results in Storage Sense believing that the disk is critically low on free space. You can disable Storage Sense in the Settings menu under **Storage**, as shown in the following screenshot:

> [!div class="mx-imgBorder"]
> ![A screenshot of the Storage menu under Settings. The "Storage sense" option is turned off.](media/storagesense.png)

You can also run the following command from an elevated PowerShell prompt to disable Storage Sense:

```powershell
New-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\StorageSense\Parameters\StoragePolicy" -Name 01 -PropertyType DWORD -Value 0 -Force
```

### Include additional language support

This article doesn't cover how to configure language and regional support. For more information, see the following articles:

- [Add languages to Windows images](/windows-hardware/manufacture/desktop/add-language-packs-to-windows/)
- [Features on demand](/windows-hardware/manufacture/desktop/features-on-demand-v2--capabilities/)
- [Language and region features on demand (FOD)](/windows-hardware/manufacture/desktop/features-on-demand-language-fod/)

### Other applications and registry configuration

This section covers application and operating system configuration. All configuration in this section is done through adding, changing, or removing registry entries.

For feedback hub collection of telemetry data on Windows 10 Enterprise multi-session, run the following command from an elevated PowerShell prompt:

```powershell
New-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name AllowTelemetry -PropertyType DWORD -Value 3 -Force
```

To prevent Watson crashes, run the following command from an elevated PowerShell prompt:

```powershell
Remove-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\Windows Error Reporting" -Name Corporate* -Force -Verbose
```

To enable 5k resolution support, run the following commands from an elevated PowerShell prompt. You must run the commands before you can enable the side-by-side stack.

```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" -Name MaxMonitors -PropertyType DWORD -Value 4 -Force
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" -Name MaxXResolution -PropertyType DWORD -Value 5120 -Force
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" -Name MaxYResolution -PropertyType DWORD -Value 2880 -Force
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\rdp-sxs" -Name MaxMonitors -PropertyType DWORD -Value 4 -Force
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\rdp-sxs" -Name MaxXResolution -PropertyType DWORD -Value 5120 -Force
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\rdp-sxs" -Name MaxYResolution -PropertyType DWORD -Value 2880 -Force
```

## Prepare the image for upload to Azure

After you've finished configuration and installed all applications, follow the instructions in [Prepare a Windows VHD or VHDX to upload to Azure](../virtual-machines/windows/prepare-for-upload-vhd-image.md) to prepare the image.

After preparing the image for upload, make sure the VM remains in the off or deallocated state.

## Upload master image to a storage account in Azure

This section only applies when the master image was created locally.

The following instructions will tell you how to upload your master image into an Azure storage account. If you don't already have an Azure storage account, follow the instructions in [this article](../storage/common/storage-account-create.md) to create one.

1. Convert the VM image (VHD) to Fixed if you haven't already. If you don't convert the image to Fixed, you can't successfully create the image.

2. Upload the VHD to a blob container in your storage account. You can upload quickly with the [Storage Explorer tool](https://azure.microsoft.com/features/storage-explorer/). To learn more about the Storage Explorer tool, see [this article](../vs-azure-tools-storage-manage-with-storage-explorer.md?tabs=windows).

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the Microsoft Azure Storage Explorer Tool's search window. The "Upload .vhd or vhdx files as page blobs (recommended)" check box is selected.](media/897aa9a9b6acc0aa775c31e7fd82df02.png)

3. Next, go to the Azure portal in your browser and search for "Images." Your search should lead you to the **Create image** page, as shown in the following screenshot:

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the Create image page of the Azure portal, filled with example values for the image.](media/d3c840fe3e2430c8b9b1f44b27d2bf4f.png)

4. Once you've created the image, you should see a notification like the one in the following screenshot:

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the "successfully created image" notification.](media/1f41b7192824a2950718a2b7bb9e9d69.png)

## Next steps

Now that you have an image, you can create or update host pools. To learn more about how to create and update host pools, see the following articles:

- [Create a host pool with an Azure Resource Manager template](./virtual-desktop-fall-2019/create-host-pools-arm-template.md)
- [Tutorial: Create a host pool with Azure Marketplace](create-host-pools-azure-marketplace.md)
- [Create a host pool with PowerShell](create-host-pools-powershell.md)
- [Create a profile container for a host pool using a file share](create-host-pools-user-profile.md)
- [Configure the Azure Virtual Desktop load-balancing method](configure-host-pool-load-balancing.md)

If you encountered a connectivity problem after preparing or customizing your VHD image, check out the [troubleshooting guide](troubleshoot-agent.md#your-issue-isnt-listed-here-or-wasnt-resolved) for help.
