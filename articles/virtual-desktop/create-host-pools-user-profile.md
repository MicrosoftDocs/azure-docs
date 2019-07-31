---
title: Set up a user profile share for a Windows Virtual Desktop Preview host pool  - Azure
description: How to set up an FSLogix profile container for a Windows Virtual Desktop Preview host pool.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 04/05/2019
ms.author: helohr
---
# Set up a user profile share for a host pool

The Windows Virtual Desktop Preview service offers FSLogix profile containers as the recommended user profile solution. We don't recommend using the User Profile Disk (UPD) solution, which will be deprecated in future versions of Windows Virtual Desktop.

This section will tell you how to set up a FSLogix profile container share for a host pool. For general documentation regarding FSLogix, see the [FSLogix site](https://docs.fslogix.com/).

## Create a new virtual machine that will act as a file share

When creating the virtual machine, be sure to place it on either the same virtual network as the host pool virtual machines or on a virtual network that has connectivity to the host pool virtual machines. You can create a virtual machine in multiple ways:

- [Create a virtual machine from an Azure Gallery image](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal#create-virtual-machine)
- [Create a virtual machine from a managed image](https://docs.microsoft.com/azure/virtual-machines/windows/create-vm-generalized-managed)
- [Create a virtual machine from an unmanaged image](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-from-user-image)

After creating the virtual machine, join it to the domain by doing the following things:

1. [Connect to the virtual machine](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal#connect-to-virtual-machine) with the credentials you provided when creating the virtual machine.
2. On the virtual machine, launch **Control Panel** and select **System**.
3. Select **Computer name**, select **Change settings**, and then select **Change…**
4. Select **Domain** and then enter the Active Directory domain on the virtual network.
5. Authenticate with a domain account that has privileges to domain-join machines.

## Prepare the virtual machine to act as a file share for user profiles

The following are general instructions about how to prepare a virtual machine to act as a file share for user profiles:

1. Add the Windows Virtual Desktop Active Directory users to an [Active Directory security group](https://docs.microsoft.com/windows/security/identity-protection/access-control/active-directory-security-groups). This security group will be used to authenticate the Windows Virtual Desktop users to the file share virtual machine you just created.
2. [Connect to the file share virtual machine](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal#connect-to-virtual-machine).
3. On the file share virtual machine, create a folder on the **C drive** that will be used as the profile share.
4. Right-click the new folder, select **Properties**, select **Sharing**, then select **Advanced sharing...**.
5. Select **Share this folder**, select **Permissions...**, then select **Add...**.
6. Search for the security group to which you added the Windows Virtual Desktop users, then make sure that group has **Full Control**.
7. After adding the security group, right-click the folder, select **Properties**, select **Sharing**, then copy down the **Network Path** to use for later.

For more information about permissions, see the [FSLogix documentation](https://docs.fslogix.com/display/20170529/Requirements%2B-%2BProfile%2BContainers).

## Configure the FSLogix profile container

To configure the virtual machines with the FSLogix software, do the following on each machine registered to the host pool:

1. [Connect to the virtual machine](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal#connect-to-virtual-machine) with the credentials you provided when creating the virtual machine.
2. Launch an internet browser and navigate to [this link](https://go.microsoft.com/fwlink/?linkid=2084562) to download the FSLogix agent. As part of the Windows Virtual Desktop public preview, you'll get a license key to activate the FSLogix software. The key is the LicenseKey.txt file included in the FSLogix agent .zip file.
3. Navigate to either \\\\Win32\\Release or \\\\X64\\Release in the .zip file and run **FSLogixAppsSetup** to install the FSLogix agent.
4. Navigate to **Program Files** > **FSLogix** > **Apps** to confirm the agent installed.
5. From the start menu, run **RegEdit** as an administrator. Navigate to **Computer\\HKEY_LOCAL_MACHINE\\software\\FSLogix**.
6. Create a key named **Profiles**.
7. Create the following values for the Profiles key:

| Name                | Type               | Data/Value                        |
|---------------------|--------------------|-----------------------------------|
| Enabled             | DWORD              | 1                                 |
| VHDLocations        | Multi-String Value | "Network path for file share"     |

>[!IMPORTANT]
>To help secure your Windows Virtual Desktop environment in Azure, we recommend you don't open inbound port 3389 on your VMs. Windows Virtual Desktop doesn't require an open inbound port 3389 for users to access the host pool's VMs. If you must open port 3389 for troubleshooting purposes, we recommend you use [just-in-time VM access](https://docs.microsoft.com/azure/security-center/security-center-just-in-time).