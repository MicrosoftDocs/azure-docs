---
title: Azure Virtual Desktop FSLogix profile container share - Azure
description: How to set up an FSLogix profile container for a Azure Virtual Desktop host pool using a virtual machine-based file share.
author: Heidilohr
ms.topic: how-to
ms.date: 04/08/2022
ms.author: helohr
manager: femila
---
# Create a profile container for a host pool using a file share

The Azure Virtual Desktop service offers FSLogix profile containers as the recommended user profile solution. We don't recommend using the User Profile Disk (UPD) solution, which will be deprecated in future versions of Azure Virtual Desktop.

This article will tell you how to set up a FSLogix profile container share for a host pool using a virtual machine-based file share. We strongly recommend using Azure Files instead of file shares. For more FSLogix documentation, see the [FSLogix site](https://docs.fslogix.com/).

>[!NOTE]
>If you're looking for comparison material about the different FSLogix Profile Container storage options on Azure, see [Storage options for FSLogix profile containers](store-fslogix-profile.md).

## Create a new virtual machine that will act as a file share

When creating the virtual machine, be sure to place it on either the same virtual network as the host pool virtual machines or on a virtual network that has connectivity to the host pool virtual machines. It must also be joined to your Active Directory domain. You can create a virtual machine in multiple ways. Here are a few options:

- [Create a virtual machine from an Azure Gallery image](../virtual-machines/windows/quick-create-portal.md#create-virtual-machine)
- [Create a virtual machine from a managed image](../virtual-machines/windows/create-vm-generalized-managed.md)
- [Create a virtual machine from an unmanaged image](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/vm-from-user-image)

## Prepare the virtual machine to act as a file share for user profiles

The following are general instructions about how to prepare a virtual machine to act as a file share for user profiles:

1. Add the Azure Virtual Desktop Active Directory users to an [Active Directory security group](/windows/security/identity-protection/access-control/active-directory-security-groups/). This security group will be used to authenticate the Azure Virtual Desktop users to the file share virtual machine you just created.
2. [Connect to the file share virtual machine](../virtual-machines/windows/quick-create-portal.md#connect-to-virtual-machine).
3. On the file share virtual machine, create a folder on the **C drive** that will be used as the profile share.
4. Right-click the new folder, select **Properties**, select **Sharing**, then select **Advanced sharing...**.
5. Select **Share this folder**, select **Permissions...**, then select **Add...**.
6. Search for the security group to which you added the Azure Virtual Desktop users, then make sure that group has **Full Control**.
7. After adding the security group, right-click the folder, select **Properties**, select **Sharing**, then copy down the **Network Path** to use for later.

For more information about permissions, see the [FSLogix documentation](/fslogix/fslogix-storage-config-ht/).

## Configure the FSLogix profile container

To configure FSLogix profile container, do the following on each session host registered to the host pool:

1. [Connect to the virtual machine](../virtual-machines/windows/quick-create-portal.md#connect-to-virtual-machine) with the credentials you provided when creating the virtual machine.
2. Launch an internet browser and [download the FSLogix agent](https://aka.ms/fslogix_download).
3. Open the downloaded .zip file, navigate to either **Win32\\Release** or **x64\\Release** (depending on your operating system) and run **FSLogixAppsSetup** to install the FSLogix agent.  To learn more about how to install FSLogix, see [Download and install FSLogix](/fslogix/install-ht/).
4. Navigate to **Program Files** > **FSLogix** > **Apps** to confirm the agent installed successfully.
5. From the start menu, run **regedit** as an administrator. Navigate to **Computer\\HKEY_LOCAL_MACHINE\\Software\\FSLogix**.
6. Create a key named **Profiles**.
7. Create the following values for the **Profiles** key (replacing **\\\\hostname\\share** with your real path):

   | Name                | Type               | Data/Value                        |
   |---------------------|--------------------|-----------------------------------|
   | Enabled             | DWORD              | 1                                 |
   | VHDLocations        | Multi-String Value | \\\\hostname\\share                |

8. If you're using OneDrive Files on Demand, you also need to use the volume type VHDX by creating the following value:

   | Name                | Type               | Data/Value                        |
   |---------------------|--------------------|-----------------------------------|
   | VolumeType          | String Value       | VHDX                              |
