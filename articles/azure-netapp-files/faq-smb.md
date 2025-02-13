---
title: SMB FAQs for Azure NetApp Files | Microsoft Docs
description: Answers frequently asked questions (FAQs) about the SMB protocol of Azure NetApp Files.
ms.service: azure-netapp-files
ms.topic: conceptual
author: b-hchen
ms.author: anfdocs
ms.date: 01/29/2025
---
# SMB FAQs for Azure NetApp Files

This article answers frequently asked questions (FAQs) about the SMB protocol of Azure NetApp Files.

## Which SMB versions are supported by Azure NetApp Files?

Azure NetApp Files supports SMB 2.1 and SMB 3.1 (which includes support for SMB 3.0). 

## Can I use Windows Server 2025? 

Windows Server 2025 currently doesn't work with the Azure NetApp Files SMB protocol. 

## Does Azure NetApp Files support access to ‘offline files’ on SMB volumes?

Azure NetApp Files supports 'manual' offline files, allowing users on Windows clients to manually select files to be cached locally.

## Is an Active Directory connection required for SMB access? 

Yes, you must create an Active Directory connection before deploying an SMB volume. The specified Domain Controllers must be accessible by the delegated subnet of Azure NetApp Files for a successful connection. See [Create an SMB volume](./azure-netapp-files-create-volumes-smb.md) for details. 

## How many Active Directory connections are supported?

Azure NetApp Files now supports the ability to [create multiple Active Directory (AD) configurations in a subscription](create-active-directory-connections.md#multi-ad). 

You can also map multiple NetApp accounts that are under the same subscription and same region to a common AD server created in one of the NetApp accounts. See [Map multiple NetApp accounts in the same subscription and region to an AD connection](create-active-directory-connections.md#shared_ad). 

<a name='does-azure-netapp-files-support-azure-active-directory'></a>

## Does Azure NetApp Files support Microsoft Entra ID? 

Both [Microsoft Entra Domain Services](../active-directory-domain-services/overview.md) and [Active Directory Domain Services (AD DS)](/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview) are supported. You can use existing Active Directory domain controllers with Azure NetApp Files. Domain controllers can reside in Azure as virtual machines, or on premises via ExpressRoute or S2S VPN. Azure NetApp Files doesn't support AD join for [Microsoft Entra ID](../active-directory/fundamentals/index.yml) at this time. 

If you're using Azure NetApp Files with Microsoft Entra Domain Services, the organizational unit path is `OU=AADDC Computers` when you configure Active Directory for your NetApp account.

## How do the Netlogon protocol changes in the April 2023 Windows Update affect Azure NetApp Files? 

The Windows April 2023 updated included a patch for Netlogon protocol changes, which were not enforced at release. 

The upgrades to the Azure NetApp File storage resource have been completed. The enforcement of setting `RequireSeal` value to 2 will occur by default with the June 2023 Azure update. No action is required regarding the June 13 enforcement phase.  

For more information about this update, see [KB5021130: How to manage the Netlogon protocol changes related to CVE-2022-38023](https://support.microsoft.com/topic/kb5021130-how-to-manage-the-netlogon-protocol-changes-related-to-cve-2022-38023-46ea3067-3989-4d40-963c-680fd9e8ee25#timing5021130).

## What versions of Windows Server Active Directory are supported?

Azure NetApp Files supports Windows Server 2012-2022 versions of Active Directory Domain Services.

## I’m having issues connecting to my SMB share. What should I do?

As a best practice, set the maximum tolerance for computer clock synchronization to five minutes. For more information, see [Maximum tolerance for computer clock synchronization](/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/jj852172(v=ws.11)). 

## Can I manage `SMB Shares`, `Sessions`, and `Open Files` through Microsoft Management Console (MMC)?

Azure NetApp Files supports modifying `SMB Shares` by using MMC. However, modifying share properties has significant risk. If the users or groups assigned to the share properties are removed from the Active Directory, or if the permissions for the share become unusable, then the entire share will become inaccessible.

Azure NetApp Files doesn't support using MMC to manage `Sessions` and `Open Files`.

## How can I obtain the IP address of an SMB volume via the portal?

Use the **JSON View** link on the volume overview pane, and look for the **startIp** identifier under **properties** > **mountTargets**.

## Can Azure NetApp Files SMB volumes be accessed via a web browser such as Microsoft Edge?

No. Azure NetApp Files volumes do not support data access via web browsers. 

## Can an Azure NetApp Files SMB share act as a DFS Namespace (DFS-N) root?

No. However, Azure NetApp Files SMB shares can serve as a DFS Namespace (DFS-N) folder target. 
  
To use an Azure NetApp Files SMB share as a DFS-N folder target, provide the Universal Naming Convention (UNC) mount path of the Azure NetApp Files SMB share by using the [DFS Add Folder Target](/windows-server/storage/dfs-namespaces/add-folder-targets#to-add-a-folder-target) procedure.

Also refer to [Use DFS-N and DFS Root Consolidation with Azure NetApp Files](use-dfs-n-and-dfs-root-consolidation-with-azure-netapp-files.md).

## Can the SMB share permissions be changed?   

Azure NetApp Files supports modifying `SMB Shares` by using Microsoft Management Console (MMC). However, modifying share properties has significant risk. If the users or groups assigned to the share properties are removed from the Active Directory, or if the permissions for the share become unusable, then the entire share will become inaccessible.

See [Modify SMB share permissions](azure-netapp-files-create-volumes-smb.md#modify-smb-share-permissions) for more information on this procedure.

Azure NetApp Files also supports [access-based enumeration](azure-netapp-files-create-volumes-smb.md#access-based-enumeration) and [non-browsable shares](azure-netapp-files-create-volumes-smb.md#non-browsable-share) on SMB and dual-protocol volumes. You can enable these features during or after the creation of an SMB or dual-protocol volume.

## Can I use the same share name for multiple volumes? 

The same share name can be used for:
* volumes deployed in different regions
* volumes deployed to different availability zones within the same region 

If you're using:
* regional volumes (without availability zones) or
* volumes within the same availability zone, 

The same share name can be used, however the share name must be unique within each delegated subnet or assigned to different delegated subnets. 

For more information, see [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md) or [Create a dual-protocol volume for Azure NetApp Files](create-volumes-dual-protocol.md). 

## Can I change the SMB share name after the SMB volume has been created?

No. However, you can create a new SMB volume with the new share name from a snapshot of the SMB volume with the old share name.   

Alternatively, you can use [Windows Server DFS Namespace](/windows-server/storage/dfs-namespaces/dfs-overview) where a DFS Namespace with the new share name can point to the Azure NetApp Files SMB volume with the old share name.

## Does Azure NetApp Files support SMB change notification and file locking?   

Yes.    

Azure NetApp Files supports [`CHANGE_NOTIFY` response](/openspecs/windows_protocols/ms-smb2/14f9d050-27b2-49df-b009-54e08e8bf7b5). This response is for the client’s request that comes in the form of a [`CHANGE_NOTIFY` request](/openspecs/windows_protocols/ms-smb2/598f395a-e7a2-4cc8-afb3-ccb30dd2df7c).  

Azure NetApp Files also supports [`LOCK` response](/openspecs/windows_protocols/ms-smb2/e215700a-102c-450a-a598-7ec2a99cd82c). This response is for the client’s request that comes in the form of a [`LOCK` request](/openspecs/windows_protocols/ms-smb2/6178b960-48b6-4999-b589-669f88e9017d).  

Azure NetApp Files also supports [breaking file locks](troubleshoot-file-locks.md).

To learn more about file locking in Azure NetApp Files, see [file locking](understand-file-locks.md).

## What network authentication methods are supported for SMB volumes in Azure NetApp Files?

NTLMv2 and Kerberos network authentication methods are supported with SMB volumes in Azure NetApp Files. NTLMv1 and LanManager are disabled and are not supported.

To disable NTLM, see:

- [Active Directory Hardening Series - Part 1 – Disabling NTLMv1](https://techcommunity.microsoft.com/blog/coreinfrastructureandsecurityblog/active-directory-hardening-series---part-1-%E2%80%93-disabling-ntlmv1/3934787)
- [Network security - Restrict NTLM Incoming NTLM traffic](/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/network-security-restrict-ntlm-incoming-ntlm-traffic)
- [Network security - Restrict NTLM in this domain](/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/network-security-restrict-ntlm-ntlm-authentication-in-this-domain)

## What is the password rotation policy for the Active Directory computer account for SMB volumes?

The Azure NetApp Files service has a policy that automatically updates the password on the Active Directory computer account that is created for SMB volumes. This policy has the following properties:   

* Schedule interval: 4 weeks
* Schedule randomization period: 120 minutes
* Schedule: Sunday `@0100`

To see  when the password was last updated on the Azure NetApp Files SMB computer account, check the `pwdLastSet` property on the computer account using the [Attribute Editor](create-volumes-dual-protocol.md#access-active-directory-attribute-editor) in the **Active Directory Users and Computers** utility:

![Screenshot that shows the Active Directory Users and Computers utility](./media/faq-smb/active-directory-users-computers-utility.png)

>[!NOTE] 
> Due to an interoperability issue with the [April 2022 Monthly Windows Update](
https://support.microsoft.com/topic/april-12-2022-kb5012670-monthly-rollup-cae43d16-5b5d-43ea-9c52-9174177c6277), the policy that automatically updates the Active Directory computer account password for SMB volumes has been suspended until a fix is deployed.

## How do Azure NetApp Files Continuous Availability Shares behave when there's an underlying storage hardware maintenance event?

The SMB client detects a TCP reset. There's no disruption if the SMB client reconnects within 60 seconds.

## Does Azure NetApp Files support Alternate Data Streams?

Yes, Azure NetApp Files supports [Alternate Data Streams (ADS)](/openspecs/windows_protocols/ms-fscc/e2b19412-a925-4360-b009-86e3b8a020c8) by default on [SMB volumes](azure-netapp-files-create-volumes-smb.md) and [dual-protocol volumes configured with NTFS security style](create-volumes-dual-protocol.md#considerations) when accessed via SMB.

## What are SMB/CIFS `oplocks` and are they enabled on Azure NetApp Files volumes?

SMB/CIFS oplocks (opportunistic locks) enable the redirector on a SMB/CIFS client in certain file-sharing scenarios to perform client-side caching of read-ahead, write-behind, and lock information. A client can then work with a file (read or write it) without regularly reminding the server that it needs access to the file. This improves performance by reducing network traffic. SMB/CIFS oplocks are enabled on Azure NetApp Files SMB and dual-protocol volumes.


## Next steps  

- [FAQs about SMB performance for Azure NetApp Files](azure-netapp-files-smb-performance.md)
- [How to create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request)
- [Networking FAQs](faq-networking.md)
- [Security FAQs](faq-security.md)
- [Performance FAQs](faq-performance.md)
- [NFS FAQs](faq-nfs.md)
- [Capacity management FAQs](faq-capacity-management.md)
- [Data migration and protection FAQs](faq-data-migration-protection.md)
- [Azure NetApp Files backup FAQs](faq-backup.md)
- [Application resilience FAQs](faq-application-resilience.md)
- [Integration FAQs](faq-integration.md)
