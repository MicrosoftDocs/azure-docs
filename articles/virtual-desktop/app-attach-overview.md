---
title: MSIX app attach and app attach - Azure Virtual Desktop
description: Learn about MSIX app attach and app attach in Azure Virtual Desktop, where you can dynamically attach applications from an application package to a user session.
ms.topic: conceptual
zone_pivot_groups: azure-virtual-desktop-app-attach
author: dknappettmsft
ms.author: daknappe
ms.date: 12/08/2023
---

# MSIX app attach and app attach in Azure Virtual Desktop

> [!IMPORTANT]
> App attach is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

There are two features in Azure Virtual Desktop that enable you to dynamically attach applications from an application package to a user session in Azure Virtual Desktop - *MSIX app attach* and *app attach (preview)*. *MSIX app attach* is generally available, but *app attach* is available in preview, which improves the administrative and user experiences. With both *MSIX app attach* and *app attach*, applications aren't installed locally on session hosts or images, making it easier to create custom images for your session hosts, and reducing operational overhead and costs for your organization. Applications run within containers, which separate user data, the operating system, and other applications, increasing security and making them easier to troubleshoot. 

The following table compares MSIX app attach with app attach:

| MSIX app attach | App attach |
|--|--|
| Applications are delivered using RemoteApp or as part of a desktop session. Permissions are controlled by assignment to application groups, however all desktop users see all MSIX app attach applications in the desktop application group. | Applications are delivered using RemoteApp or as part of a desktop session. Permissions are applied per application per user, giving you greater control over which applications your users can access in a remote session. Desktop users only see the app attach applications assigned to them. |
| Applications might only run on one host pool. If you want it to run on another host pool, you must create another package. | The same application package can be used across multiple host pools. |
| Applications can only run on the host pool in which they're added. | Applications can run on any session host running a Windows client operating system in the same Azure region as the application package. |
| To update the application, you must delete and recreate the application with another version of the package. You should update the application in a maintenance window. | Applications can be upgraded to a new application version with a new disk image without the need for a maintenance window. |
| Users can't run two versions of the same application on the same session host. | Users can run two versions of the same application concurrently on the same session host. |
| Telemetry for usage and health is now available through Azure Log Analytics. | Telemetry for usage and health is available through Azure Log Analytics. |

You can use the following application package types and file formats:

| Package type | File formats | Feature availability |
|--|--|--|
| MSIX and MSIX bundle | `.msix`<br />`.msixbundle` | MSIX app attach<br />App attach |
| Appx and Appx bundle | `.appx`<br />`.appxbundle` | App attach only |

MSIX and Appx are Windows application package formats that provide a modern packaging experience to Windows applications. Applications run within containers, which separate user data, the operating system, and other applications, increasing security and making them easier to troubleshoot. MSIX and Appx are similar, where the main difference is that MSIX is a superset of Appx. MSIX supports all the features of Appx, plus other features that make it more suitable for enterprise use.

> [!TIP]
> Select a button at the top of this article to choose between *MSIX app attach* (current) and *app attach* (preview) to see the relevant documentation.

You can get MSIX packages from software vendors, or you can [create an MSIX package from an existing installer](/windows/msix/packaging-tool/create-an-msix-overview). To learn more about MSIX, see [What is MSIX?](/windows/msix/overview)

::: zone pivot="app-attach"
## How a user gets an application 

You can assign different applications to different users in the same host pool or on the same session host. During sign-in, all three of the following requirements must be met for the user to get the right application at the right time: 

- The application must be assigned to the host pool. Assigning the application to the host pool enables you to be selective about which host pools the application is available on to ensure that the right hardware resources are available for use by the application. For example, if an application is graphics-intensive, you can ensure it only runs on a host pool with GPU-optimized session hosts. 

- The user must be able to sign-in to session hosts in the host pool, so they must be in a Desktop or RemoteApp application group. For a RemoteApp application group, the app attach application must be added to the application group, but you don't need to add the application to a desktop application group.

- The application must be assigned to the user. You can use a group or a user account.

If all of these requirements are met, the user gets the application. This process provides control over who gets an application on which host pool and also how it's possible for users within a single host pool or even signed in to the same multi-session session host to get different application combinations. Users who don’t meet the requirements don't get the application. 
::: zone-end

::: zone pivot="msix-app-attach"
## How a user gets an application 

You can assign different applications to different users in the same host pool. With MSIX app attach, you add MSIX packages to a host pool and control assignment of applications using desktop or RemoteApp application groups. During sign-in, the following requirements must be met for the user to get the right application at the right time:

- The user must be able to sign-in to session hosts in the host pool, so they must be in a Desktop or RemoteApp application group.

- The MSIX image must be added to the host pool. 

If these requirements are met, the user gets the application. Assigning applications using a desktop application group adds them to the user's start menu. Users who don’t meet the requirements don't get the application. 
::: zone-end

## Application images

Before you can use your application packages with Azure Virtual Desktop, you need to [Create an MSIX image](app-attach-create-msix-image.md) from your existing application packages using the MSIXMGR tool. You then need to store each disk image on a file share that is accessible by your session hosts. For more information on the requirements for a file share, see [File share](#file-share).

### Disk image types

You can use *Composite Image File System (CimFS)*, *VHDX* or *VHD* for disk images, but we don't recommend using VHD. Mounting and unmounting CimFS images is faster than VHD and VHDX files and also consumes less CPU and memory. We only recommend using CimFS for your application images if your session hosts are running Windows 11.

A CimFS image is a combination of several files: one file has the `.cim` file extension and contains metadata, together with at least two other files, one starting with `objectid_` and the other starting with `region_` that contain the actual application data. The files accompanying the `.cim` file don't have a file extension. The following table is a list of example files you'd find for a CimFS image:

| File name | Size |
|--|--|
| `MyApp.cim` | 1 KB |
| `objectid_b5742e0b-1b98-40b3-94a6-9cb96f497e56_0` | 27 KB |
| `objectid_b5742e0b-1b98-40b3-94a6-9cb96f497e56_1` | 20 KB |
| `objectid_b5742e0b-1b98-40b3-94a6-9cb96f497e56_2` | 42 KB |
| `region_b5742e0b-1b98-40b3-94a6-9cb96f497e56_0` | 428 KB |
| `region_b5742e0b-1b98-40b3-94a6-9cb96f497e56_1` | 217 KB |
| `region_b5742e0b-1b98-40b3-94a6-9cb96f497e56_2` | 264,132 KB |

The following table is a performance comparison between VHDX and CimFS. These numbers were the result of a test run with 500 files of 300 MB each per format and the tests were performed on a [DSv4 Azure virtual machine](../virtual-machines/dv4-dsv4-series.md).

| Metric | VHD | CimFS |
|--|--|--|
| Average mount time | 356 ms | 255 ms |
| Average unmount time | 1615 ms | 36 ms |
| Memory consumption | 6% (of 8 GB) | 2% (of 8 GB) |
| CPU (count spike) | Maxed out multiple times | No effect |

## Application registration

::: zone pivot="app-attach"
App attach mounts disk images containing your applications from a file share to a user's session during sign-in, then a registration process makes the applications available to the user. There are two types of registration:
::: zone-end

::: zone pivot="app-attach"
MSIX app attach mounts disk images containing your applications from a file share to a user's session during sign-in, then a registration process makes the applications available to the user. There are two types of registration:
::: zone-end

- **On-demand**: applications are only partially registered at sign-in and the full registration of an application is postponed until the user starts the application. On-demand is the registration type we recommend you use as it doesn't affect the time it takes to sign-in to Azure Virtual Desktop. On-demand is the default registration method.

- **Log on blocking**: each application you assign to a user is fully registered. Registration happens while the user is signing in to their session, which might affect the sign-in time to Azure Virtual Desktop.

::: zone pivot="app-attach"
> [!IMPORTANT]
>
> All MSIX and Appx application packages include a certificate. You're responsible for making sure the certificates are trusted in your environment. Self-signed certificates are supported with the appropriate chain of trust.

App attach doesn't limit the number of applications users can use. You should consider your available network throughput and the number of open handles per file (each image) your file share supports, as it might limit the number of users or applications you can support. For more information, see [File share](#file-share).
::: zone-end

::: zone pivot="msix-app-attach"
> [!IMPORTANT]
>
> All MSIX application packages include a certificate. You're responsible for making sure the certificates are trusted in your environment. Self-signed certificates are supported.

MSIX app attach doesn't limit the number of applications users can use. You should consider your available network throughput and the number of open handles per file (each image) your file share supports, as it might limit the number of users or applications you can support. For more information, see [File share](#file-share).
::: zone-end

## Application state

::: zone pivot="app-attach"
An MSIX and Appx package is set as **active** or **inactive**. Packages set to active makes the application available to users. Packages set to inactive are ignored by Azure Virtual Desktop and not added when a user signs-in.
::: zone-end

::: zone pivot="msix-app-attach"
An MSIX package is set as **active** or **inactive**. MSIX packages set to active makes the application available to users. MSIX packages set to inactive are ignored by Azure Virtual Desktop and not added when a user signs-in.
::: zone-end

::: zone pivot="app-attach"
## New versions of applications

You can add a new version of an application by supplying a new image containing the updated application. You can use this new image in two ways:

- **Side by side**: create a new application using the new disk image and assign it to the same host pools and users as the existing application.

- **In-place**: create a new image where the version number of the application changes, then update the existing application to use the new image. The version number can be higher or lower, but you can't update an application with the same version number. Don't delete the existing image until all users are finished using it.

Once updated, users will get the updated application version the next time they sign-in. Users don't need to stop using the previous version to add a new version.
::: zone-end

::: zone pivot="msix-app-attach"
## New versions of applications

With MSIX app attach, you need to delete the application package, then you create a new application using the new disk image and assign it to the same host pools. You can't update in-place as you can with app attach. Users will get the new image with the updated application the next time they sign-in. You should perform these tasks during a maintenance window.
::: zone-end

## Identity providers

::: zone pivot="app-attach"
Here are the identity providers you can use with app attach:

| Identity provider | Status |
|--|--|
| Microsoft Entra ID | Supported |
| Active Directory Domain Services (AD DS) | Supported |
| Microsoft Entra Domain Services | Not supported |
::: zone-end

::: zone pivot="msix-app-attach"
Here are the identity providers you can use with MSIX app attach:

| Identity provider | Status |
|--|--|
| Microsoft Entra ID | Not supported |
| Active Directory Domain Services (AD DS) | Supported |
| Microsoft Entra Domain Services (Azure AD DS) | Not supported |
::: zone-end

## File share

::: zone pivot="app-attach"
App attach requires that your application images are stored on an SMB file share, which is then mounted on each session host during sign-in. App attach doesn't have dependencies on the type of storage fabric the file share uses. We recommend using [Azure Files](../storage/files/storage-files-introduction.md) as it's compatible with Microsoft Entra ID or Active Directory Domain Services, and offers great value between cost and management overhead.

You can also use [Azure NetApp Files](../azure-netapp-files/azure-netapp-files-introduction.md), but that requires your session hosts to be joined to Active Directory Domain Services.
::: zone-end

::: zone pivot="msix-app-attach"
MSIX app attach requires that your application images are stored on an SMB version 3 file share, which is then mounted on each session host during sign-in. MSIX app attach doesn't have dependencies on the type of storage fabric the file share uses. We recommend using [Azure Files](../storage/files/storage-files-introduction.md) as it's compatible with the supported identity providers you can use for MSIX app attach, and offers great value between cost and management overhead. You can also use [Azure NetApp Files](../azure-netapp-files/azure-netapp-files-introduction.md), but that requires your session hosts are joined to Active Directory Domain Services.
::: zone-end

The following sections provide some guidance on the permissions, performance, and availability required for the file share.

### Permissions

Each session host mounts application images from the file share. You need to configure NTFS and share permissions to allow each session host computer object read access to the files and file share. How you configure the correct permission depends on which storage provider and identity provider you're using for your file share and session hosts.

::: zone pivot="app-attach"
- To use Azure Files when your session hosts joined to Microsoft Entra ID, you need to assign the [Reader and Data Access](../role-based-access-control/built-in-roles.md#reader-and-data-access) Azure role-based access control (RBAC) role to the **Azure Virtual Desktop** and **Azure Virtual Desktop ARM Provider** service principals. This RBAC role assignment allows your session hosts to access the storage account using [access keys](../storage/common/storage-account-keys-manage.md). The storage account must be in the same Azure subscription as your session hosts. To learn how to assign an Azure RBAC role to the Azure Virtual Desktop service principals, see [Assign RBAC roles to the Azure Virtual Desktop service principals](service-principal-assign-roles.md).

   For more information about using Azure Files with session hosts that are joined to Microsoft Entra ID, Active Directory Domain Services, or Microsoft Entra Domain Services, see [Overview of Azure Files identity-based authentication options for SMB access](../storage/files/storage-files-active-directory-overview.md).

   > [!WARNING]
   > Assigning the **Azure Virtual Desktop ARM Provider** service principal to the storage account grants the Azure Virtual Desktop service to all data inside the storage account. We recommended you only store apps to use with app attach in this storage account and rotate the access keys regularly.
::: zone-end

::: zone pivot="app-attach"
- For Azure Files with Active Directory Domain Services, you need to assign the [Storage File Data SMB Share Reader](../role-based-access-control/built-in-roles.md#storage-file-data-smb-share-reader) Azure role-based access control (RBAC) role as the [default share-level permission](../storage/files/storage-files-identity-ad-ds-assign-permissions.md#share-level-permissions-for-all-authenticated-identities), and [configure NTFS permissions](../storage/files/storage-files-identity-ad-ds-configure-permissions.md) to give read access to each session host's computer object.

   For more information about using Azure Files with session hosts that are joined to Microsoft Entra ID, Active Directory Domain Services, or Microsoft Entra Domain Services, see [Overview of Azure Files identity-based authentication options for SMB access](../storage/files/storage-files-active-directory-overview.md).
::: zone-end

::: zone pivot="msix-app-attach"
- For Azure Files with Active Directory Domain Services, you need to assign the [Storage File Data SMB Share Reader](../role-based-access-control/built-in-roles.md#storage-file-data-smb-share-reader) Azure role-based access control (RBAC) role as the [default share-level permission](../storage/files/storage-files-identity-ad-ds-assign-permissions.md#share-level-permissions-for-all-authenticated-identities), and [configure NTFS permissions](../storage/files/storage-files-identity-ad-ds-configure-permissions.md) to give read access to each session host's computer object.

   For more information about using Azure Files with session hosts that are joined to Active Directory Domain Services or Microsoft Entra Domain Services, see [Overview of Azure Files identity-based authentication options for SMB access](../storage/files/storage-files-active-directory-overview.md).
::: zone-end

- For Azure NetApp Files, you can [create an SMB volume](../azure-netapp-files/azure-netapp-files-create-volumes-smb.md) and configure NTFS permissions to give read access to each session host's computer object. Your session hosts need to be joined to Active Directory Domain Services or Microsoft Entra Domain Services.

You can verify the permissions are correct by using [PsExec](/sysinternals/downloads/psexec). For more information, see [Check file share access](troubleshoot-app-attach.md#check-file-share-access).

### Performance

Requirements can vary greatly depending how many packaged applications are stored in an image and you need to test your applications to understand your requirements. For larger images, you need to allocate more bandwidth. The following table gives an example of the requirements a single 1 GB MSIX image containing one application requires per session host:

| Resource | Requirements |
|--|--|
| Steady state IOPs | One IOP |
| Machine boot sign-in | 10 IOPs |
| Latency | 400 ms |

To optimize the performance of your applications, we recommend:

- Your file share should be in the same Azure region as your session hosts. If you're using Azure Files, your storage account needs to be in the same Azure region as your session hosts.

- Exclude the disk images containing your applications from antivirus scans as they're read-only.

- Ensure your storage and network fabric can provide adequate performance. You should avoid using the same file share with [FSLogix profile containers](/fslogix/concepts-container-types#profile-container).

### Availability

Any disaster recovery plans for Azure Virtual Desktop must include replicating the MSIX app attach file share to your secondary failover location. You also need to ensure your file share path is accessible in the secondary location. For example, you can use [Distributed File System (DFS) Namespaces with Azure Files](../storage/files/files-manage-namespaces.md) to provide a single share name across different file shares. To learn more about disaster recovery for Azure Virtual Desktop, see [Set up a business continuity and disaster recovery plan](disaster-recovery.md).

### Azure Files 

Azure Files has limits on the number of open handles per root directory, directory, and file. When using MSIX app attach or app attach, VHDX or CimFS disk images are mounted using the computer account of the session host, meaning one handle is opened per session host per disk image, rather than per user. For more information on the limits and sizing guidance, see [Azure Files scalability and performance targets](../storage/files/storage-files-scale-targets.md#file-scale-targets) and [Azure Files sizing guidance for Azure Virtual Desktop](../storage/files/storage-files-scale-targets.md#azure-files-sizing-guidance-for-azure-virtual-desktop).

## MSIX and Appx package certificates

All MSIX and Appx packages require a valid code signing certificate. To use these packages with app attach, you need to ensure the whole certificate chain is trusted on your session hosts. A code signing certificate has the object identifier `1.3.6.1.5.5.7.3.3`. You can get a code signing certificate for your packages from:

- A public certificate authority (CA).

- An internal enterprise or standalone certificate authority, such as [Active Directory Certificate Services](/windows-server/identity/ad-cs/active-directory-certificate-services-overview). You need to export the code signing certificate, including its private key.

- A tool such as the PowerShell cmdlet [New-SelfSignedCertificate](/powershell/module/pki/new-selfsignedcertificate) that generates a self-signed certificate. You should only use self-signed certificates in a test environment. For more information on creating a self-signed certificate for MSIX and Appx packages, see [Create a certificate for package signing](/windows/msix/package/create-certificate-package-signing).

Once you've obtained a certificate, you need to digitally sign your MSIX or Appx packages with the certificate. You can use the [MSIX Packaging Tool](/windows/msix/packaging-tool/tool-overview) to sign your packages when you create an MSIX package. For more information, see [Create an MSIX package from any desktop installer](/windows/msix/packaging-tool/create-app-package).

To ensure the certificate is trusted on your session hosts, you need your session hosts to trust the whole certificate chain. How you do this depends on where you got the certificate from and how you manage your session hosts and the identity provider you use. The following table provides some guidance on how to ensure the certificate is trusted on your session hosts:

- **Public CA**: certificates from a public CA are trusted by default in Windows and Windows Server.

- **Internal Enterprise CA**:

    - For session hosts joined to Active Directory, with AD CS configured as the internal enterprise CA, are trusted by default and stored in the configuration naming context of Active Directory Domain Services. When AD CS is a configured as a standalone CA, you need to configure Group Policy to distribute the root and intermediate certificates to session hosts. For more information, see [Distribute certificates to Windows devices by using Group Policy](/windows-server/identity/ad-cs/distribute-certificates-group-policy/).

    - For session hosts joined to Microsoft Entra ID, you can use Microsoft Intune to distribute the root and intermediate certificates to session hosts. For more information, see [Trusted root certificate profiles for Microsoft Intune](/mem/intune/protect/certificates-trusted-root).

    - For session hosts using Microsoft Entra hybrid join, you can use either of the previous methods, depending on your requirements.

- **Self-signed**: install the trusted root to the **Trusted Root Certification Authorities** store on each session host. We don't recommend distributing this certificate using Group Policy or Intune as it should only be used for testing.

> [!IMPORTANT]
> You should timestamp your package so that its validity can outlast your certificate's expiration date. Otherwise, once the certificate has expired, you need to update the package with a new valid certificate and once again ensure it's trusted on your session hosts.

## Next steps

Learn how to [Add and manage app attach applications in Azure Virtual Desktop](app-attach-setup.md).
