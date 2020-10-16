---
title: Windows Virtual Desktop set up file share MSIX app attach - Azure
description: How to set up a file share for MSIX app attach for Windows Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 11/09/2020
ms.author: helohr
manager: lizross
---
# Set up a file share for MSIX app attach

All MSIX images must be stored on a network share that can be accessed by users in a host pool with read-only permissions.

MSIX app attach does not take dependency on type of storage fabric powering the file share. The considerations for the MSIX app attach share are same as those for an FSLogix share. More information [here](store-fslogix-profile.md).

## Performance requirements

Limitations or quotas for MSIX app attach image size depend on the storage type used for storing the VHD or VHDx files, as well as the size limitations of the VHD or VHDx format and the file system.

The following table gives an example of how many resources a single 1 GB MSIX image with one MSIX app inside of it requires for each VM:

| Resource             | Requirements |
|----------------------|--------------|
| Steady state IOPs    | 1 IOPs       |
| Machine boot sign in | 10 IOPs      |

Requirements can vary widely depending how many MSIX-packaged applications are stored in the MSIX image. For larger MSIX images, you'll need to allocate more bandwidth.

### Storage recommendations

Azure offers multiple storage options that can be used for MISX app attach. We recommend using Azure Files or Azure NetApp Files as those options offer the best value between cost and management overhead. The article [Storage options for FSLogix profile containers in Windows Virtual Desktop](store-fslogix-profile.md) compares the different managed storage solutions Azure offers in the context of Windows Virtual Desktop.

### Optimize MSIX app attach performance

Here are some other things we recommend you do to optimize MSIX app attach performance:

- The storage solution you use for MSIX app attach should be in the same datacenter location as the session hosts.
- To avoid performance bottlenecks, exclude the following VHD(X) files for profile containers from antivirus scans:
   
    - <MSIXAppAttachFileShare\>\*.VHD
    - <MSIXAppAttachFileShare\>\*.VHDX
    - <MSIXAppAttachFileShare\>TEMP\*.VHD
    - <MSIXAppAttachFileShare\>TEMP\*.VHDX
    - \\\\storageaccount.file.core.windows.net\\share\*\*.VHD
    - \\\\storageaccount.file.core.windows.net\\share\*\*.VHDX

- Separate the storage fabric for MSIX app attach from FSLogix profile containers.
- All VM system accounts and user accounts must have read-only permissions to access the file share.
- Any disaster recovery plans for Windows Virtual Desktop must include replicating the MSIX app attach file share in your secondary failover location. To learn more about disaster recovery, see [Set up a business continuity and disaster recovery plan](disaster-recovery.md).

## How to set up the file share

The setup process for MSIX app attach file share has only one difference when compared to [the setup process for FSLogix profile file shares](create-host-pools-user-profile.md). That difference is the type of permissions that must be granted on the files share. MSIX app attach requires read-only permissions on the files share.

If Azure File is being used session host, you'll need to assign the VM the correct identity in order to access the share.

To assign the identity that will let the users access the file share:

1. Open Azure Files and go to **VM** > **Identity**.

2. Add a system-assigned identity to the VM.

3. Select **Access Control (IAM)**.

4. Go to **Role assignments** and add the **Storage File Data SMB Share Reader** role.

5. Assign access to the virtual machine for the subscription that needs access to MSIX app attach.

Once you've assigned the identity to the profiles, follow the instructions in the articles in [Next steps](#next-steps) to grant other required permissions to the identity you've assigned to the VMs.

## Next steps

- Learn how to set up Azure Active Directory Domain Services (AD DS) at [Create a profile container with Azure Files and AD DS](create-file-share.md).

- Learn how to set up Azure Files and Azure AD DS at [Create a profile container with Azure Files and Azure AD DS](create-profile-container-adds.md).

- Learn how to set up Azure NetApp Files for MSIX app attach at [Create a profile container with Azure NetApp Files and AD DS](create-fslogix-profile-container.md).

- Learn how to use a virtual machine-based file share at [Create a profile container for a host pool using a file share](create-host-pools-user-profile.md).
