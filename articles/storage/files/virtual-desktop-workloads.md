---
title: Use Azure Files for Virtual Desktop Workloads
description: Learn how to use SMB Azure file shares for virtual desktop workloads, including FSLogix profile containers for Azure Virtual Desktop, and how to optimize scale and performance.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 10/14/2026
ms.author: kendownie
# Customer intent: "As an IT administrator managing virtual desktop environments, I want to use Azure Files to store user profiles and disk images, so that I can ensure high availability, performance, and scalability for our users across multiple sessions."
---

# Azure Files guidance for virtual desktop workloads

Azure Files provides fully managed, scalable SMB file shares that are an excellent fit for storing virtual desktop user profiles and disk images in the cloud.

## Azure Files for virtual desktop infrastructure (VDI)

Virtual desktop infrastructure (VDI) centralizes desktop environments on servers, enabling secure remote access and simplified management across devices. [Azure Virtual Desktop](/azure/virtual-desktop/overview) is Microsoft’s cloud-based VDI solution, offering scalable, multi-session Windows 10 and 11 desktops with seamless integration into Microsoft 365 and Microsoft Entra ID, ideal for remote work and secure resource access. Other VDI offerings include Citrix/VMware Horizon on Azure infrastructure.

Azure Files is ideal for VDI because it provides cloud file shares that integrate seamlessly with [FSLogix](/azure/virtual-desktop/fslogix-profile-containers) for user profile storage or [App Attach](/azure/virtual-desktop/app-attach-overview) to store disk images for dynamic application delivery. When deployed correctly, Azure Files can reduce infrastructure overhead, provide high availability, support enterprise-grade security, and deliver consistent performance for a smooth user experience across virtual desktop sessions.

:::image type="content" source="media/virtual-desktop-workloads/files-virtual-desktop-architecture.png" alt-text="Architecture diagram showing how to use Azure Files for VDI workloads." border="false":::

## Performance, scale, and cost

Azure Files offers different billing models, including provisioned and pay-as-you-go. See [Understand Azure Files billing](understanding-billing.md).

While Azure Files can support thousands of concurrent virtual desktop users from a single file share, it's critical to properly test your workloads against the size and type of file share you're using. Your requirements vary based on the number of users and profile size.

Virtual desktops with home directories can benefit from [metadata caching](smb-performance.md#metadata-caching-for-ssd-file-shares) on SSD file shares.

## Authentication and authorization

You must use identity-based authentication and assign the correct permissions and Azure RBAC roles to enable users to securely access their profile or application.

You can use one of the following identity sources to authenticate users to access the Azure file share:

- [On-premises Active Directory Domain Services (AD DS)](/fslogix/how-to-configure-profile-container-azure-files-active-directory): This option requires virtual desktop users to have unimpeded network connectivity to domain controllers.

- [Microsoft Entra Kerberos](/fslogix/how-to-configure-profile-container-entra-id-hybrid) (hybrid or cloud-only identities): Microsoft Entra Kerberos is a good fit for virtual desktop workloads because it doesn't require users to have unimpeded network connectivity to domain controllers. With this option, you can store profiles that can be accessed by hybrid or cloud-only user identities from Microsoft Entra joined or Microsoft Entra hybrid joined session hosts.

- [Microsoft Entra Domain Services](/fslogix/how-to-configure-profile-container-azure-files-active-directory): If you need to authenticate cloud-only identities and want a managed directory service, this can be a good option.

To configure storage permissions, see [Configure SMB storage permissions for FSLogix](/fslogix/how-to-configure-storage-permissions).

## Availability and disaster recovery

Before you select an [Azure region](/azure/reliability/regions-list) for your virtual desktop workload, be aware of its regional compliance and data residency requirements.

Use a storage account that's in the same Azure region and resource group as your Azure Virtual Desktop host pool.

Another important consideration in region selection is latency. It's generally best to centralize all necessary virtual desktop resources, including user profiles, in the same Azure region and subscription as your Azure Virtual Desktop host pool. If you deploy file shares in a region that's far from your users, it can increase latency and degrade performance. It can also increase the cost of data transfer between regions.

Azure Files offers both HDD (standard) and SSD (premium) file shares. SSD Azure file shares don't offer geo-redundancy. For more information about the different redundancy options available for Azure Files, see [Azure Files redundancy](files-redundancy.md).

## Azure Files sizing guidance for Azure Virtual Desktop

In large-scale VDI environments, tens of thousands of users might need to access the same file simultaneously, especially during application launches and session setups. In these situations, you might run out of handles, especially if you're using a single Azure file share. This section describes how various types of disk images consume handles and provides sizing guidance based on the technology you're using.

Azure Files supports both **FSLogix** and **non-FSLogix** profile storage scenarios. This guidance provides recommended file share configurations based on the number of concurrent virtual desktop users, expected IOPS per user, and storage type (HDD or SSD). In general, FSLogix enables more efficient handle usage compared to non-FSLogix.

> [!TIP]
> Azure Files has a 2,000 concurrent handle limit per file and directory, and a 10,000 concurrent handle limit for the root directory of a share. This article is written with those limits in mind. However, for SSD file shares, these limits are soft. To scale beyond these limits, you can [enable metadata caching](smb-performance.md#register-for-the-metadata-caching-feature) and register for [increased file handle limits (preview)](smb-performance.md#register-for-increased-file-handle-limits-preview).

### FSLogix profile containers

> [!TIP]
> When using [FSLogix Cloud Cache](/fslogix/concepts-fslogix-cloud-cache) with Azure Files, use SSD file shares. SSD shares provide lower latency and higher IOPS than HDD shares, which helps deliver more consistent Cloud Cache performance and reduces the likelihood of storage becoming a performance bottleneck.

If you're using [FSLogix with Azure Virtual Desktop](/azure/virtual-desktop/fslogix-containers-azure-files), your user profile containers are either Virtual Hard Disk (VHD) or Hyper-V Virtual Hard Disk (VHDX) files, and they're mounted in a user context, not a system context. Each user opens a single root directory handle, which should be to the file share. Azure Files can support a maximum of 10,000 users assuming you have the file share (`\\storageaccount.file.core.windows.net\sharename`) + the profile directory (`%sid%_%username%`) + profile container (`profile_%username.vhd(x)`).

If you're hitting the limit of 10,000 concurrent handles for the root directory or users are seeing poor performance, try using an additional Azure file share and distributing the containers between the shares.

For example, if you have 2,400 concurrent users, you'd need 2,400 handles on the root directory (one for each user), which is below the limit of 10,000 open handles. For FSLogix users, reaching the limit on open file and directory handles is unlikely. If you have a single FSLogix profile container per user, you'd only consume two file/directory handles: one for the profile directory and one for the profile container file. If users have two containers each (profile and ODFC), you'd need one more handle for the ODFC file.

The following table lists general recommendations for **FSLogix profile containers** based on the number of concurrent users under these conditions:

- Each user has 1–2 containers (profile + optional Office container)
- Handles: ~2–3 per user (root directory, profile, and possibly ODFC container)

| **Number of concurrent FSLogix users** | **Recommended file storage** | **Notes** |
| - | - | - |
| Less than 2,000 users | HDD pay-as-you-go or provisioned v2 file shares | Acceptable for light workloads or low concurrency |
| 2,000-5,000 users | 1-2 SSD file shares with [metadata caching](smb-performance.md#register-for-the-metadata-caching-feature) | SSD improves sign-in performance; handles remain well below 10,000 per share |
| 5,000-10,000 users | 2-4 SSD file shares, distributed evenly | Shares must be partitioned correctly |
| More than 10,000 users | Multiple SSD file shares with [metadata caching](smb-performance.md#register-for-the-metadata-caching-feature) and [increased file handle limits (preview)](smb-performance.md#register-for-increased-file-handle-limits-preview) | Register for increased handle limits and enable metadata caching for large-scale environments |

### Non-FSLogix profile storage

If you're not using FSLogix, you might be using roaming user profiles or folder redirection in Windows.

> [!NOTE]
> Non-FSLogix profiles are more likely to hit the per-directory or per-file handle limit of 2,000 concurrent handles. If you need to scale beyond this limit, you can use SSD file shares, [enable metadata caching](smb-performance.md#register-for-the-metadata-caching-feature), and register for [increased file handle limits (preview)](smb-performance.md#register-for-increased-file-handle-limits-preview).

The following table lists general recommendations for **non-FSLogix** profile storage based on the number of concurrent users under these conditions:

- Profile data is stored as many small files/folders
- Higher metadata IOPS per user
- Handle usage is relatively high (each file/folder accessed consumes a handle)
- Profile size ~5 GiB
- Peak IOPS: 50 IOPS/user during login, 20 IOPS/user during steady-state

| **Number of concurrent users** | **Recommended file storage** | **Notes** |
| - | - | - |
| Less than 400 users | HDD pay-as-you-go file shares | Suitable for low-concurrency workloads with minimal IOPS demands. |
| 400-1,000 users | HDD provisioned v2 file shares or multiple HDD pay-as-you-go file shares | Might require tuning for peak sign-in bursts. HDD provisioned v2 file shares can use [credit-based bursting](understand-performance.md#bursting) for short IOPS peaks. |
| 1,000-2,000 users | SSD or multiple HDD file shares | SSDs recommended due to better metadata latency. |
| More than 2,000 users | Multiple SSD file shares with [metadata caching](smb-performance.md#register-for-the-metadata-caching-feature) and [increased file handle limits (preview)](smb-performance.md#register-for-increased-file-handle-limits-preview) | Critical to avoid handle limits and achieve consistent sign-in performance. |

### Understand user profile sign-in and sign-out behavior

Azure Virtual Desktop environments that use profile containers can have highly variable storage demand throughout the day. Normal user activity generates relatively steady I/O, while concentrated sign-in and sign-out periods create short IOPS spikes.

With the Azure Files provisioned v2 billing model, you can provision storage capacity, IOPS, and throughput independently. Azure Files also provides credit-based IOPS bursting, which allows a share with available burst credits to temporarily exceed its provisioned IOPS.

A typical workday includes two periods of concentrated storage activity as users start and end their sessions. These *sign-in and sign-out storms* cause temporary IOPS spikes as FSLogix profile containers open or close. Between these events, the share generally handles steadier session activity.

The important distinction is between steady-state demand and short peak demand. The following example shows how to size an Azure Files SMB share that requires approximately 20,000 IOPS during normal operation and temporarily reaches 75,000 IOPS during sign-in or sign-out activity.

:::image type="content" source="media/virtual-desktop-workloads/sign-in-sign-out-storm.svg" alt-text="Line chart of a typical workday showing short 75,000-IOPS peaks during morning sign-in and evening sign-out, with steady demand of about 20,000 IOPS between the peaks." border="false":::

#### Example: Size Azure Files for 2,000 Azure Virtual Desktop users

This example illustrates a sizing approach. The workload values are sample assumptions, not universal sizing requirements. Test your workload to determine its actual steady-state and peak requirements.

| Parameter | Example value |
| - | - |
| Concurrent users | 2,000 |
| Average profile size | 30 GiB per user |
| Storage | 60-TiB provisioned v2 SSD share |
| Steady-state IOPS | 10 per user, or approximately 20,000 IOPS |
| Peak sign-in or sign-out demand | 75,000 IOPS |

Because provisioned v2 separates capacity, IOPS, and throughput, the share doesn't need extra provisioned capacity solely to obtain more IOPS.

##### Step 1: Separate steady-state and peak IOPS

In this example, the steady-state requirement is approximately **20,000 IOPS**, and the peak requirement is **75,000 IOPS**.

##### Step 2: Calculate the provisioned v2 burst limit

For provisioned v2 SSD file shares, the [burst IOPS limit](understanding-billing.md#provisioned-v2-bursting) is calculated as follows:

`MIN(MAX(3 * ProvisionedIOPS, 10000), 102400)`

To provide a burst limit of 75,000 IOPS, work backward from the peak requirement: `75,000 / 3 = 25,000` provisioned IOPS.

##### Step 3: Compare peak provisioning with burst-aware sizing

| Provisioning approach | Provisioned IOPS | How the peak is served |
| - | - | - |
| Provision for the peak | 75,000 | The full peak is provisioned and billed continuously. |
| Use credit-based bursting | 25,000 | Provisioned IOPS serve normal demand, and available burst credits serve the temporary peak. |

> [!NOTE]
> The provisioned IOPS in the burst-aware approach are one-third of the 75,000-IOPS peak. This ratio applies only to the IOPS component of the bill. Total cost also includes capacity, throughput, redundancy, region, and other applicable charges.

##### Step 4: Understand how burst credits cover the peak

The provisioned v2 SSD burst-credit formula is `(BurstLimit - ProvisionedIOPS) * 3600`.

In this example, `(75,000 - 25,000) * 3,600 = 180,000,000` burst IOPS credits. Each I/O above the provisioned level consumes one credit. Credits accrue while actual IOPS are below the provisioned level and decline while actual IOPS exceed it. A new file share starts with a full burst-credit bucket.

##### Step 5: Estimate the Azure Files cost

Use the [Azure Files provisioned v2 pricing page](https://azure.microsoft.com/pricing/details/storage/files/) to estimate your Azure Files SSD cost. The total price is based on independently provisioned storage capacity, IOPS, and throughput. In the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/), select the target region, redundancy option, media tier, provisioned capacity, IOPS, and throughput.

> [!IMPORTANT]
> Credit-based bursting operates on a best-effort basis and depends on available credits. Validate that the burst duration and the time between recurring peaks allow enough credits to accumulate. Provision for the peak when the workload requires guaranteed performance or regularly sustains IOPS above the provisioned value.

### App attach

If you're using [MSIX App attach or App attach](/azure/virtual-desktop/app-attach-overview) to dynamically attach applications, you can use Composite Image File System (CimFS) or VHD/VHDX files for [disk images](/azure/virtual-desktop/app-attach-overview#application-images). Either way, the scale limits are per VM mounting the image, not per user. The number of users is irrelevant when calculating scale limits. When a VM is booted, it mounts the disk image, even if there are zero users.

#### App attach with CimFS

If you're using App attach with CimFS, the disk images only consume handles on the disk image files. They don't consume handles on the root directory or the directory containing the disk image. However, because a CimFS image is a combination of the .cim file and at least two other files, for every VM mounting the disk image, you need one handle each for three files in the directory. So if you have 100 VMs, you need 300 file handles.

You might run out of file handles if the number of VMs per app exceeds 2,000. In this case, use an additional Azure file share or [enable metadata caching for SSD file shares](smb-performance.md#register-for-the-metadata-caching-feature) and register for [increased file handle limits (preview)](smb-performance.md#register-for-increased-file-handle-limits-preview).

#### App attach with VHD/VHDX

If you're using App attach with VHD/VHDX files, the files are mounted in a system context, not a user context, and they're shared and read-only. More than one handle on the VHDX file can be consumed by a connecting system. To stay within Azure Files scale limits, the number of VMs multiplied by the number of apps must be less than 10,000, and the number of VMs per app can't exceed 2,000. So the constraint is whichever you hit first.

In this scenario, you could hit the per file/directory limit with 2,000 mounts of a single VHD/VHDX. Or, if the share contains multiple VHD/VHDX files, you could hit the root directory limit first. For example, 100 VMs mounting 100 shared VHDX files will hit the 10,000 handle root directory limit.

In another example, 100 VMs accessing 20 apps require 2,000 root directory handles (100 x 20 = 2,000), which is well within the 10,000 limit for root directory handles. You also need a file handle and a directory/folder handle for every VM mounting the VHD(X) image, so 200 handles in this case (100 file handles + 100 directory handles), which is comfortably below the 2,000 handle limit per file/directory.

If you're hitting the limits on maximum concurrent handles for the root directory, use an additional Azure file share.

If you're hitting the limits on maximum concurrent handles per file/directory, use an additional Azure file share or [enable metadata caching for SSD file shares](smb-performance.md#register-for-the-metadata-caching-feature) and register for [increased file handle limits (preview)](smb-performance.md#register-for-increased-file-handle-limits-preview).

## See also

- [Use Azure File Sync with Azure Virtual Desktop Hybrid](azure-virtual-desktop-hybrid.md)
- [Storage considerations for Azure Virtual Desktop workloads](/azure/well-architected/azure-virtual-desktop/storage)
- [Storage options for FSLogix profile containers in Azure Virtual Desktop](/azure/virtual-desktop/store-fslogix-profile)
