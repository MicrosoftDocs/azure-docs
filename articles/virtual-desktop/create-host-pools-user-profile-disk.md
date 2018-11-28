---
title: Create a User Profile Disk share for a Windows Virtual Desktop host pool - Azure
description: How to create a User Profile Disk share for a Windows Virtual Desktop host pool.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 11/21/2018
ms.author: helohr
---
# Create a User Profile Disk share for a host pool

This section will tell you how to set up a User Profile Disk share for a host pool. (We need more information here.)

To create a new VM that will act as a file share:

1. Create a new security group in Azure Active Directory.
2. Create a new resource group that will host the VM.
3. Select **Virtual Machines** in the left-hand navigation pane.
4. On the **Virtual machine** blade, select **+Add**. Choose any VM with "Windows Server" in its name, then select **Create**.
5. On the Create virtual machine flow under the Basic blade, enter the required information.
    1. Name: the VM name.
    2. Admin username: choose an admin name you will remember.
    3. Admin password: choose a password that meets Azure VM password complexity standards.
    4. Resource group: use the resource group you created in step 1
6. Complete the VM setup by following the rest of the instructions. The VM will take some time to deploy.

## Prepare the VM to act as a file share for User Profile Disks

To prepare the VM to act as a file share for User Profile Disks:

1. Join the VMs to the domain.
2. Add the VMs to the security group you created in Create a new VM that will act as a file share.
3. Select the User Profile Disk VM and select Connect at the top of the VM blade.
4. Add the VM to the security group you created in Create a new VM that will act as a file share. Once you add session host VMs to the group, they won’t be counted as part of the security group until you restart them.
5. Connect to the VM you created.
6. Copy SetupUVHD.ps1 to the User Profile Disk VM.
7. Run PowerShell as a local admin.
8. Navigate to the folder youwhere copied SetupUVHD.ps1 towas copied and run the following cmdlet with these parameters:
    1. *PathOfShare*: the full path to drive and folder where the User Profile Disk will be stored.
    2. *NameOfShare*: the name of the folder where the User Profile Disk will be stored.
    3. *SizeInGB*: the User Profile Disk’s file size.
    4. *DomainName\SecurityGroupFromStep1*: the name of the security group where all session host VMs are added.
    
    ```PowerShell
    .\SetupUVHD.ps1 -UvhdSharePath "<PathOfShare> " -ShareName "NameOfShare" -MaxGB <SizeInGB> -DomainGroupForSessionHosts "<DomainName>\<SecurityGroupFromStep1">
    ```

9. After running the cmdlet, “Setup Completed Successfully” should appear in the PowerShell window.

## Enable this file share to be used by the host pool

To enable this file share to be used by the host pool:

1. Open PowerShell as an admin (this requires setting the context to the Windows Virtual Desktop service).
2. Run the following cmdlet to set context to the RDS tenant deployment.
    
    ```PowerShell
    Set-RdsHostPool <tenantname> <hostpoolname> -DiskPath <\\FileServer\PathOfShare> -EnableUserProfileDisk
    ```
