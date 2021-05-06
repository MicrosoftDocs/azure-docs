---
title: Windows Virtual Desktop set up file share MSIX app attach - Azure
description: How to set up a file share for MSIX app attach for Windows Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 04/13/2021
ms.author: helohr
manager: femila
---
# Set up a file share for MSIX app attach

All MSIX images must be stored on a network share that can be accessed by users in a host pool with read-only permissions.

MSIX app attach doesn't have any dependencies on the type of storage fabric the file share uses. The considerations for the MSIX app attach share are same as those for an FSLogix share. To learn more about storage requirements, see [Storage options for FSLogix profile containers in Windows Virtual Desktop](store-fslogix-profile.md).

## Performance requirements

MSIX app attach image size limits for your system depend on the storage type you're using to store the VHD or VHDx files, as well as the size limitations of the VHD, VHSD or CIM files and the file system.

The following table gives an example of how many resources a single 1 GB MSIX image with one MSIX app inside of it requires for each VM:

| Resource             | Requirements |
|----------------------|--------------|
| Steady state IOPs    | 1 IOPs       |
| Machine boot sign in | 10 IOPs      |
| Latency              | 400 ms       |

Requirements can vary widely depending how many MSIX-packaged applications are stored in the MSIX image. For larger MSIX images, you'll need to allocate more bandwidth.

### Storage recommendations

Azure offers multiple storage options that can be used for MISX app attach. We recommend using Azure Files or Azure NetApp Files as those options offer the best value between cost and management overhead. The article [Storage options for FSLogix profile containers in Windows Virtual Desktop](store-fslogix-profile.md) compares the different managed storage solutions Azure offers in the context of Windows Virtual Desktop.

### Optimize MSIX app attach performance

Here are some other things we recommend you do to optimize MSIX app attach performance:

- The storage solution you use for MSIX app attach should be in the same datacenter location as the session hosts.
- To avoid performance bottlenecks, exclude the following VHD, VHDX, and CIM files from antivirus scans:
   
    - <MSIXAppAttachFileShare\>\*.VHD
    - <MSIXAppAttachFileShare\>\*.VHDX
    - \\\\storageaccount.file.core.windows.net\\share\*\*.VHD
    - \\\\storageaccount.file.core.windows.net\\share\*\*.VHDX
    - <MSIXAppAttachFileShare>.CIM
    - \\\\storageaccount.file.core.windows.net\\share\*\*.CIM

- Separate the storage fabric for MSIX app attach from FSLogix profile containers.
- All VM system accounts and user accounts must have read-only permissions to access the file share.
- Any disaster recovery plans for Windows Virtual Desktop must include replicating the MSIX app attach file share in your secondary failover location. To learn more about disaster recovery, see [Set up a business continuity and disaster recovery plan](disaster-recovery.md).

## How to set up the file share

The setup process for MSIX app attach file share is largely the same as [the setup process for FSLogix profile file shares](create-host-pools-user-profile.md). However, you'll need to assign users different permissions. MSIX app attach requires read-only permissions to access the file share.

If you're storing your MSIX applications in Azure Files, then for your session hosts, you'll need to assign all session host VMs both storage account role-based access control (RBAC) and file share New Technology File System (NTFS) permissions on the share.

| Azure object                      | Required role                                     | Role function                                  |
|-----------------------------------|--------------------------------------------------|-----------------------------------------------|
| Session host (VM computer objects)| Storage File Data SMB Share Contributor          | Read and Execute, Read, List folder contents  |
| Admins on File Share              | Storage File Data SMB Share Elevated Contributor | Full control                                  |
| Users on File Share               | Storage File Data SMB Share Contributor          | Read and Execute, Read, List folder contents  |

To assign session host VMs permissions for the storage account and file share:

1. Create an Active Directory Domain Services (AD DS) security group.

2. Add the computer accounts for all session host VMs as members of the group.

3. Sync the AD DS group to Azure Active Directory (Azure AD).

4. Create a storage account.

5. Create a file share under the storage account by following the instructions in [Create an Azure file share](../storage/files/storage-how-to-create-file-share.md#create-a-file-share).

6. Join the storage account to AD DS by following the instructions in [Part one: enable AD DS authentication for your Azure file shares](../storage/files/storage-files-identity-ad-ds-enable.md#option-one-recommended-use-azfileshybrid-powershell-module).

7. Assign the synced AD DS group to Azure AD, and assign the storage account the Storage File Data SMB Share Contributor role.

8. Mount the file share to any session host by following the instructions in [Part two: assign share-level permissions to an identity](../storage/files/storage-files-identity-ad-ds-assign-permissions.md).

9. Grant NTFS permissions on the file share to the AD DS group.

10. Set up NTFS permissions for the user accounts. You'll need an operating unit (OU) sourced from the AD DS that the accounts in the VM belong to.

Once you've assigned the identity to your storage, follow the instructions in the articles in [Next steps](#next-steps) to grant other required permissions to the identity you've assigned to the VMs.

You'll also need to make sure your session host VMs have New Technology File System (NTFS) permissions. You must have an operational unit container that's sourced from Active Directory Domain Services (AD DS), and your users must be members of that operational unit to use these permissions.

## Next steps

Here are the other things you'll need to do after you've set up the file share:

- Learn how to set up Azure Active Directory Domain Services (AD DS) at [Create a profile container with Azure Files and AD DS](create-file-share.md).
- Learn how to set up Azure Files and Azure AD DS at [Create a profile container with Azure Files and Azure AD DS](create-profile-container-adds.md).
- Learn how to set up Azure NetApp Files for MSIX app attach at [Create a profile container with Azure NetApp Files and AD DS](create-fslogix-profile-container.md).
- Learn how to use a virtual machine-based file share at [Create a profile container for a host pool using a file share](create-host-pools-user-profile.md).

Once you're finished, here are some other resources you might find helpful:

- Ask our community questions about this feature at the [Windows Virtual Desktop TechCommunity](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop).
- You can also leave feedback for Windows Virtual Desktop at the [Windows Virtual Desktop feedback hub](https://support.microsoft.com/help/4021566/windows-10-send-feedback-to-microsoft-with-feedback-hub-app).
- [MSIX app attach glossary](app-attach-glossary.md)
- [MSIX app attach FAQ](app-attach-faq.md)
