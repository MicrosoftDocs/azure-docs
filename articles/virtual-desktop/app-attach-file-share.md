---
title: Windows Virtual Desktop MSIX app attach - Azure
description: How to set up MSIX app attach for Windows Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 06/16/2020
ms.author: helohr
manager: lizross
---
# Set up a file share for MSIX app attach

All MSIX images must be stored on a network share.

All VMs in a Hostpool and all users accessing the VM must have read-only permissions to the share.

MSIX app attach does not take dependency on type of storage fabric powering the file share. The considerations for the MSIX app attach share are same as those for an FSLogix share. More information [here](store-fslogix-profile.md).

## Performance requirements

In terms of overall MSIX image size, limitations or quotas for MSIX app attach depend on the storage type used for storing the VHD/VHDx files, as well as the size limitations of the VHD/VHDx format, and the file system.

Additionally, the following table gives an example of how many resources an MSIX image requires for each VM. Requirements can vary widely depending on the number of MSIX packaged application stored in a MSIX image (VHD/VHDx). The table uses a singled MSIX image with single MSIX application as a reference point. Further it assumes an average MSIX image size of 1 GB. For larger MSIX images adequate bandwidth must be allocated.

| Resource             | Requirements |
|----------------------|--------------|
| Steady state IOP     | 1 IOPs       |
| Machine boot sign in | 10 IOPs      |

## Storage options for MSIX app attach

Azure offers multiple storage options that can be used for MISX app attach. We recommend using Azure Files or Azure NetApp Files as those options offer the best value between cost and management overhead. The article [Storage options for FSLogix profile containers in Windows Virtual Desktop](store-fslogix-profile.md) compares the different managed storage solutions Azure offers in the context of Windows Virtual Desktop.

## Best practices

Following are best practices for MSIX app attach file share:

- For optimal performance, the storage solution for MSIX app attach must be in the same data-center location as the session hosts.

- Exclude the VHD(X) files for profile containers from antivirus scanning, to avoid performance bottlenecks.

- Separate the storage fabric for MSIX app attach and FSLogix profile containers.

## Antivirus exclusions

Exclude files:

\<MSIXAppAttachFileShare\>\*.VHD

\<MSIXAppAttachFileShare\>\*.VHDX

\<MSIXAppAttachFileShare\>TEMP\*.VHD

\<MSIXAppAttachFileShare\>TEMP\*.VHDX

\\\\storageaccount.file.core.windows.net\\share\*\*.VHD

\\\\storageaccount.file.core.windows.net\\share\*\*.VHDX

**Storage permission**
======================

MSIX app attach requires read-only permissions for both VM system accounts and
all user accounts.

**Disaster recovery**
=====================

Any disaster recovery plans for WVD must include MSIX app attach file share
being replicated across DR zones.

**Setup process**
=================

The setup process for MSIX app attach file share has only one difference when
compared to the FSLogix profiles share. That difference is the type of
permissions that must be granted on the files share. MSIX app attach requires
read-only permissions on the files share.

Below are the steps for the different storage fabrics. Select article based on
what storage is being used in the WVD environment.

Assign identity to session host VMs 
------------------------------------

If Azure File is being used session host VM must be assigned an identity in
order to access the share

>   Select the VM \> Identity

>   Add a system assigned identity to the VM

>   System assigned

>   Click on Access Control (IAM)

>   Add Role assignments

>   Role: Storage File Data SMB Share Reader

>   Assign access to: Virtual machine

>   Elect subscription

>   Grab VMs

Once identities are assigned follow the specific steps in each article below to
grant permission to the identity tied to the VMs.

Setup Azure Files and AD DS for MSIX app attach 
------------------------------------------------

Detailed steps
[here](https://docs.microsoft.com/en-us/azure/virtual-desktop/create-file-share).

Setup Azure Files and Azure AD DS for MSIX app attach 
------------------------------------------------------

More
[here](https://docs.microsoft.com/en-us/azure/virtual-desktop/create-profile-container-adds).

Setup Azure NetApp Files for MSIX app attach 
---------------------------------------------

More
[here](https://docs.microsoft.com/en-us/azure/virtual-desktop/create-fslogix-profile-container).

Use VM-based file share 
------------------------

More
[here](https://docs.microsoft.com/en-us/azure/virtual-desktop/create-host-pools-user-profile).
