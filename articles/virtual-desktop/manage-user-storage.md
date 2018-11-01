---
title: Manage user storage in Windows Virtual Desktop
description: How to manage file shares for virtual machines in Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 10/25/2018
ms.author: helohr
---
# Manage user storage in Windows Virtual Desktop

## Create a new VM that will act as a file share

To create a new VM that will act as a file share:

1. Create a new security group in AD.
    
    >[!NOTE]
    >AAD doesn’t support groups for VMs.
    
2. Create a new resource group that will host the VM.
3. Select **Virtual Machines** in the left navigation pane.
4. On the Virtual machine blade, select **+Add**. Choose any VM with "Windows Server" in its name, then select **Create**.
5. On the Create virtual machine flow under the Basic blade, enter the required information.
    1. **Name**: the VM name.
    2. **Admin username**: choose an admin name you will remember.
    3. **Admin password**: choose a password that meets Azure VM password complexity standards.
    4. **Resource group**: use the resource group you created in step 1.
6. Complete the VM setup by following the rest of the instructions in the workflow. Once you're done, you'll have to wait a little bit for the VM to deploy.

## Prepare the VM to act as a file share for UPDs

To prepare the VM to act as a file share for UPDs:

1. Join the VMs to the domain.
2. Add the VMs to the security group that will act as a file share.
3. Select **UPD VM**, then select **Connect** on the VM blade.
4. Add the VM to the security group you created in Create a new VM that will act as a file share.
    >[!NOTE]
    >Once you add session host VMs to the group, they won’t be counted as part of the security group until you restart them.
5. Connect to the created VM.
6. Copy SetupUVHD.ps1 to the UPD VM.
7. Run PowerShell as a local admin.
8. Navigate to the folder you copied SetupUVHD.ps1 to and run the following cmdlet:
    ```PowerShell
    .\SetupUVHD.ps1 -UvhdSharePath "<PathOfShare>" -ShareName "NameOfShare" -MaxGB <SizeInGB> -DomainGroupForSessionHosts "<DomainName>\<SecurityGroupFromStep1">
    ```
    Replace the bracketed values with the following parameters:
    1. *PathOfShare*: the full path to drive and folder where you'll store the UPD.
    2. *NameOfShare*: the name of the folder where you'll store the UPD.
    3. *SizeInGB*: the UPD’s file size.
    4. *DomainName\SecurityGroupFromStep1*: the name of the security group where all session host VMs will be added.
9. After running the cmdlet, “Setup Completed Successfully” should appear in the PowerShell window.

## Enable the host pool to use the file share

To enable the host pool to use the file share you created:

1. Open PowerShell as an admin (this requires setting the context to the Windows Virtual Desktop service).
2. Run the following cmdlet to set context to the RDS tenant deployment.

```PowerShell
Set-RdsHostPool <tenantname> <hostpoolname> -DiskPath <\\FileServer\PathOfShare> -EnableUserProfileDisk
```