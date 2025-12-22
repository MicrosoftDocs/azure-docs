---
title: Overview - Azure Files Identity-Based Authentication
description: Azure Files supports identity-based authentication over SMB (Server Message Block) with Active Directory Domain Services (AD DS), Microsoft Entra Domain Services, and Microsoft Entra Kerberos for hybrid and cloud-only identities (preview).
author: khdownie
ms.service: azure-file-storage
ms.topic: overview
ms.date: 12/15/2025
ms.author: kendownie
# Customer intent: "As a cloud architect, I want to implement identity-based authentication for Azure file shares over SMB, so that I can enhance security and streamline access for users."
---

# Overview of Azure Files identity-based authentication for SMB access

**Applies to:** :heavy_check_mark: SMB Azure file shares

This article explains how you can use identity-based authentication, either on-premises or in Azure, to enable identity-based access to Azure file shares over server message block (SMB) protocol. Just like Windows file servers, you can grant permissions to an identity at the share, directory, or file level. There's no additional service charge to enable identity-based authentication on your storage account.

Identity-based authentication is supported over SMB for Windows, [Linux](storage-files-identity-auth-linux-kerberos-enable.md), and MacOS clients. However, it isn't currently supported with Network File System (NFS) shares.

> [!IMPORTANT]
> For security reasons, using identity-based authentication to access file shares is recommended over using the storage account key. Never share your storage account keys.

## How it works

Azure file shares use the Kerberos protocol to authenticate with an identity source. When an identity associated with a user or application running on a client attempts to access data in Azure file shares, the request is sent to the identity source to authenticate the identity. If authentication is successful, the identity source returns a Kerberos ticket. The client then sends a request that includes the Kerberos ticket, and Azure Files uses that ticket to authorize the request. The Azure Files service only receives the Kerberos ticket, not the user's access credentials.

## Common use cases

Identity-based authentication with SMB Azure file shares can be useful in a variety of scenarios:

### Replace on-premises file servers

Replacing scattered on-premises file servers is a challenge every organization faces during their IT modernization journey. Using identity-based authentication with Azure Files provides a seamless migration experience, allowing end users to continue to access their data with the same credentials.

### Lift and shift applications to Azure

When you lift and shift applications to the cloud, you'll likely want to keep the same authentication model for file share access. Identity-based authentication eliminates the need to change your directory service, expediting cloud adoption.

### Backup and disaster recovery (DR)

If you're keeping your primary file storage on-premises, Azure Files is an ideal solution for backup and DR to improve business continuity. You can use Azure file shares to back up your file servers while preserving Windows discretionary access control lists (DACLs). For DR scenarios, you can configure an authentication option to support proper access control enforcement at failover.

## Choose an identity source for your storage account

Before you enable identity-based authentication on your storage account, you need to know what identity source you're going to use. It's likely that you already have one, as most companies and organizations have some type of domain environment configured. Consult your Active Directory (AD) or IT admin to be sure. If you don't already have an identity source, you'll need to configure one before you can enable identity-based authentication.

### Supported authentication scenarios

You can enable identity-based authentication over SMB using one of three identity sources: **On-premises Active Directory Domain Services (AD DS)**, **Microsoft Entra Domain Services**, or **Microsoft Entra Kerberos**. You can only use one identity source for file access authentication per storage account, and it applies to all file shares in the account.

- **On-premises AD DS:** The storage account is joined to the on-premises AD DS, and identities from AD DS can securely access SMB Azure file shares from a domain-joined client or a client that has uninterrupted connectivity to the domain controller. The on-premises AD DS environment must be [synced to Microsoft Entra ID](/entra/identity/hybrid/connect/how-to-connect-install-roadmap) using either the on-premises [Microsoft Entra Connect](/entra/identity/hybrid/connect/whatis-azure-ad-connect) application or [Microsoft Entra Connect cloud sync](/entra/identity/hybrid/cloud-sync/what-is-cloud-sync), a lightweight agent that can be installed from the Microsoft Entra Admin Center. See the [full list of prerequisites](storage-files-identity-ad-ds-overview.md#prerequisites).

- **Microsoft Entra Kerberos:** You can use Microsoft Entra ID to authenticate [hybrid](../../active-directory/hybrid/whatis-hybrid-identity.md) or cloud-only identities (preview), allowing end users to access Azure file shares. If you want to authenticate hybrid identities, you'll need an existing AD DS deployment, which is then synced to your Microsoft Entra tenant. See the [prerequisites](storage-files-identity-auth-hybrid-identities-enable.md#prerequisites).

- **Microsoft Entra Domain Services:** Cloud-based VMs that are joined to Microsoft Entra Domain Services can access Azure file shares with Microsoft Entra credentials. In this solution, Microsoft Entra ID runs a traditional Windows Server AD domain that is a child of the customer's Microsoft Entra tenant. See the [prerequisites](storage-files-identity-auth-domain-services-enable.md#prerequisites).

Use the following guidelines to determine which identity source you should choose.

- If your organization already has an on-premises AD and isn't ready to move identities to the cloud, and if your clients, VMs, and applications are domain-joined or have unimpeded network connectivity to those domain controllers, choose AD DS.

- If some or all of the clients don't have unimpeded network connectivity to your AD DS, or if you're storing FSLogix profiles on Azure file shares for Microsoft Entra joined VMs, choose Microsoft Entra Kerberos.

- If you have an existing on-premises AD but are planning to move applications to the cloud and you want your identities to exist both on-premises and in the cloud (hybrid), choose Microsoft Entra Kerberos.

- If you want to authenticate cloud-only identities without using domain controllers, choose Microsoft Entra Kerberos. This feature is currently in preview.

- If you already use Microsoft Entra Domain Services, choose Microsoft Entra Domain Services as your identity source.

## Enable an identity source

Once you've chosen an identity source, you must enable it on your storage account.

### AD DS

For AD DS authentication, you can host your AD domain controllers on Azure VMs or on-premises. Either way, your clients must have unimpeded network connectivity to the domain controller, so they must be within the corporate network or virtual network (VNET) of your domain service. We recommend domain-joining your client machines or VMs so that users don't have to provide explicit credentials each time they access the share.

The following diagram depicts on-premises AD DS authentication to Azure file shares over SMB. The on-premises AD DS must be synced to Microsoft Entra ID using Microsoft Entra Connect Sync or Microsoft Entra Connect cloud sync. Only [hybrid user identities](../../active-directory/hybrid/whatis-hybrid-identity.md) that exist in both on-premises AD DS and Microsoft Entra ID can be authenticated and authorized for Azure file share access. This is because the share-level permission is configured against the identity represented in Microsoft Entra ID, whereas the directory/file-level permission is enforced with that in AD DS. Make sure that you configure the permissions correctly against the same hybrid user.

:::image type="content" source="media/storage-files-active-directory-overview/files-ad-ds-auth-diagram.png" alt-text="Diagram that depicts on-premises AD DS authentication to Azure file shares over SMB.":::

To enable AD DS authentication, first read [Overview - on-premises Active Directory Domain Services authentication over SMB for Azure file shares](storage-files-identity-ad-ds-overview.md) and then see [Enable AD DS authentication for Azure file shares](storage-files-identity-ad-ds-enable.md).

<a name='azure-ad-kerberos-for-hybrid-identities'></a>

### Microsoft Entra Kerberos

Enabling and configuring Microsoft Entra ID for authenticating [hybrid](../../active-directory/hybrid/whatis-hybrid-identity.md) or cloud-only identities (preview) allows Microsoft Entra users to access Azure file shares using Kerberos authentication. This configuration uses Microsoft Entra ID to issue the Kerberos tickets to access the file share with the industry-standard SMB protocol. This means end users can access Azure file shares without requiring network connectivity to domain controllers.

> [!IMPORTANT]
> If you want to use Microsoft Entra Kerberos to authenticate hybrid identities, a traditional AD DS deployment is required. It must be synced to Microsoft Entra ID using Microsoft Entra Connect Sync or Microsoft Entra Connect cloud sync. Clients must be Microsoft Entra joined or [Microsoft Entra hybrid joined](../../active-directory/devices/hybrid-join-plan.md).

The following diagram represents the workflow for Microsoft Entra Kerberos authentication for hybrid (i.e., not cloud-only) identities over SMB.

:::image type="content" source="media/storage-files-active-directory-overview/files-microsoft-entra-kerberos-diagram.png" alt-text="Diagram of configuration for Microsoft Entra Kerberos authentication for hybrid identities over SMB.":::

To enable Microsoft Entra Kerberos authentication, see [Enable Microsoft Entra Kerberos authentication on Azure Files](storage-files-identity-auth-hybrid-identities-enable.md).

You can also use this feature to store FSLogix profiles on Azure file shares for Microsoft Entra joined VMs. For more information, see [Create a profile container with Azure Files and Microsoft Entra ID](/azure/virtual-desktop/create-profile-container-azure-ad).

<a name='azure-ad-ds'></a>

### Microsoft Entra Domain Services

For Microsoft Entra Domain Services authentication, you must enable Microsoft Entra Domain Services and domain join the virtual machines that will access Azure file shares using Kerberos authentication. These virtual machines must have network connectivity to the Microsoft Entra Domain Services managed domain.

The authentication flow is similar to on premises AD DS authentication, with the following differences:

- The storage account identity is created automatically during enablement.
- All Microsoft Entra ID users can be authenticated and authorized. Users can be cloud-only or hybrid. User synchronization from Microsoft Entra ID to Microsoft Entra Domain Services is managed by the platform.

#### Access requirements for Microsoft Entra Domain Services

For clients to authenticate using Microsoft Entra Domain Services, the following requirements must be met.

- Kerberos authentication requires the client to be domain joined to the Microsoft Entra Domain Services managed domain.
- Non-Azure clients can't be domain joined to the Microsoft Entra Domain Services managed domain.
- Clients that aren't domain joined can still access Azure file shares using explicit credentials only if the client has unimpeded network connectivity to the Microsoft Entra Domain Services domain controllers, for example through VPN or other supported connections.

:::image type="content" source="media/storage-files-active-directory-overview/files-microsoft-entra-domain-services-auth-diagram.png" alt-text="Diagram of configuration for Microsoft Entra Domain Services authentication with Azure Files over SMB.":::

To enable Microsoft Entra Domain Services authentication, see [Enable Microsoft Entra Domain Services authentication on Azure Files](storage-files-identity-auth-domain-services-enable.md).

## See also

- [Overview of Azure Files authorization and access control](storage-files-authorization-overview.md)
- [Kerberos Authentication Overview](/windows-server/security/kerberos/kerberos-authentication-overview)
