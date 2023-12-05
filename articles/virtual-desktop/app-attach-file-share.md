---
title: Set up a file share for MSIX app attach
titleSuffix: Azure Virtual Desktop
description: How to set up a file share for MSIX app attach for Azure Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 03/22/2023
ms.author: helohr
manager: femila
---
# Set up a file share for MSIX app attach

For a user to access MSIX images, the images must be stored on a network share. In this article, you'll learn how to set up a file share for MSIX app attach.

MSIX app attach doesn't have dependencies on the type of storage fabric the file share uses. The considerations for the MSIX app attach share are same as the considerations for an FSLogix share. To learn more about storage requirements, see [Storage options for FSLogix profile containers in Azure Virtual Desktop](store-fslogix-profile.md).

## Performance requirements

MSIX app attach image size limits for your system depend on:

- The storage type you're using to store the VHD or VHDX files.

- The size limitations of the VHD, VHDX or CIM files and the file system.

The following table gives an example of how many resources a single 1-GB MSIX image with one MSIX app inside of it requires for each VM:

| Resource             | Requirements |
|----------------------|--------------|
| Steady state IOPs    | One IOP      |
| Machine boot sign-in | 10 IOPs      |
| Latency              | 400 ms       |

Requirements can vary widely depending how many MSIX-packaged applications are stored in the MSIX image. For larger MSIX images, you'll need to allocate more bandwidth.

## Storage recommendations

Azure offers multiple storage options that can be used for MSIX app attach. We recommend using Azure Files or Azure NetApp Files as those options offer the best value between cost and management overhead. The article [Storage options for FSLogix profile containers in Azure Virtual Desktop](store-fslogix-profile.md) compares the different managed storage solutions Azure offers in the context of Azure Virtual Desktop.

## Optimize MSIX app attach performance

Here are some other things we recommend you do to optimize MSIX app attach performance:

- The storage solution you use for MSIX app attach should be in the same datacenter location as the session hosts.
- To avoid performance bottlenecks, exclude the following VHD, VHDX, and CIM files from antivirus scans:
   
    - `<MSIXAppAttachFileShare\>\*.VHD`
    - `<MSIXAppAttachFileShare\>\*.VHDX`
    - `<MSIXAppAttachFileShare>.CIM`

- If you're using Azure Files, exclude the following locations from antivirus scans:
    
    - `\\storageaccount.file.core.windows.net\share*.VHD`
    - `\\storageaccount.file.core.windows.net\share*.VHDX`
    - `\\storageaccount.file.core.windows.net\share**.CIM`

- Separate the storage fabrics for MSIX app attach from FSLogix profile containers.
- Any disaster recovery plans for Azure Virtual Desktop must include replicating the MSIX app attach file share in your secondary failover location. To learn more about disaster recovery, see [Set up a business continuity and disaster recovery plan](disaster-recovery.md). You'll also need to ensure your file share path is accessible in the secondary location. You can use [Distributed File System (DFS) Namespaces](/windows-server/storage/dfs-namespaces/dfs-overview) to provide a single share name across different file shares. 

## Configure file share permissions when using Azure Files

The setup process for MSIX app attach file share is largely the same as [the setup process for FSLogix profile file shares](create-host-pools-user-profile.md). However, you'll need to assign different permissions. MSIX app attach requires read-only permissions using the computer account of each session host to access the file share.

When you store your MSIX applications in Azure Files, you must assign all session host VMs both storage account role-based access permissions and file share New Technology File System (NTFS) permissions on the share.

| Azure object                      | Required role                                     | Role function                                  |
|-----------------------------------|--------------------------------------------------|-----------------------------------------------|
| Session hosts (VM computer objects)| [Storage File Data SMB Share Reader](../role-based-access-control/built-in-roles.md#storage-file-data-smb-share-reader)        | Allows for read access to Azure File Share over SMB  |
| Admins on File Share              | [Storage File Data SMB Share Elevated Contributor](../role-based-access-control/built-in-roles.md#storage-file-data-smb-share-elevated-contributor) | Allows for read, write, delete, and modify ACLs on files and directories in Azure File Shares                                  |

To assign session hosts VMs permissions for the storage account and file share:

1. Create an Active Directory Domain Services (AD DS) security group.

2. Add the computer accounts for all session hosts VMs as members of the group.

3. Sync the AD DS group to Microsoft Entra ID.

4. Create a storage account.

5. Create a file share under the storage account by following the instructions in [Create an Azure file share](../storage/files/storage-how-to-create-file-share.md#create-a-file-share).

6. Join the storage account to AD DS by following the instructions in [Part one: enable AD DS authentication for your Azure file shares](../storage/files/storage-files-identity-ad-ds-enable.md#option-one-recommended-use-azfileshybrid-powershell-module).

7. Assign the synced AD DS group the Storage File Data SMB Share Reader role on the storage account.

8. Mount the file share to any session host by following the instructions in [Part two: assign share-level permissions to an identity](../storage/files/storage-files-identity-ad-ds-assign-permissions.md).

9. Grant **Modify** NTFS permissions on the file share to the AD DS group.

## Next steps

Once you're finished, here are some other resources you might find helpful:

- [Add and publish MSIX app attach packages with the Azure portal](app-attach-azure-portal.md)
- Ask our community questions about this feature at the [Azure Virtual Desktop TechCommunity](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop).
- You can also leave feedback for Azure Virtual Desktop at the [Azure Virtual Desktop feedback hub](https://support.microsoft.com/help/4021566/windows-10-send-feedback-to-microsoft-with-feedback-hub-app).
- [What is MSIX app attach?](what-is-app-attach.md)
- [MSIX app attach FAQ](app-attach-faq.yml)
