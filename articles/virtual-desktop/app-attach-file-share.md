---
title: Windows Virtual Desktop set up file share MSIX app attach preview - Azure
description: How to set up a file share for MSIX app attach for Windows Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 11/16/2020
ms.author: helohr
manager: lizross
---
# Set up a file share for MSIX app attach preview

> [!IMPORTANT]
> MSIX app attach is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

All MSIX images must be stored on a network share that can be accessed by users in a host pool with read-only permissions.

MSIX app attach (preview) doesn't have any dependencies on the type of storage fabric the file share uses. The considerations for the MSIX app attach share are same as those for an FSLogix share. To learn more about storage requirements, see [Storage options for FSLogix profile containers in Windows Virtual Desktop](store-fslogix-profile.md).

## Performance requirements

MSIX app attach image size limits for your system depend on the storage type you're using to store the VHD or VHDx files, as well as the size limitations of the VHD or VHDx format and the file system.

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
- To avoid performance bottlenecks, exclude the following VHD and VHDX files from antivirus scans:
   
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

The setup process for MSIX app attach file share is largely the same as [the setup process for FSLogix profile file shares](create-host-pools-user-profile.md). However, you will need to assign your users a different permission type, as MSIX app attach requires read-only permissions to access the file share.

If you're storing your MSIX applications in Azure Files, then for your session hosts, you'll need to assign the VMs a managed service identity (MSI) to use in defining role-based access control (RBAC) permissions on the share.

To assign an MSI that will let the VM access the file share:

1. Open the **Virtual machines** tab in the Azure portal, select the session host VM you want to assign an identity to, then go to **VM** > **Identity**.

2. Add a system-assigned identity to the VM.

3. Select **Access Control (IAM)**.

4. Select **Azure role assignments**.

5. Go to **Scope** > **Storage**.

6. Select the name of the storage account you want to assign.

7. Go to **Role select**, then select the **Storage File Data SMB Share Reader** role. This will grant the storage account for the VM access to the MSIX application.

8.  When you're done, select **Save**.

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