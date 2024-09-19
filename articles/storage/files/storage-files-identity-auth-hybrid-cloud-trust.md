---
title: Configure a cloud trust between AD DS and Microsoft Entra Kerberos
description: Learn how to enable identity-based Kerberos authentication for hybrid user identities over Server Message Block (SMB) for Azure Files by establishing a cloud trust between on-premises Active Directory Domain Services (AD DS) and Microsoft Entra ID. Your users can then access Azure file shares by using their on-premises credentials.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 09/19/2024
ms.author: kendownie
recommendations: false
---

# Configure a cloud trust between on premises AD DS and Microsoft Entra ID for accessing Azure Files

Many organizations want to use identity-based authentication for SMB Azure file shares in environments that span both on-premises Active Directory Domain Services (AD DS) and Microsoft Entra, but don't meet the necessary [prerequisites to use Microsoft Entra Kerberos](storage-files-identity-auth-hybrid-identities-enable.md#prerequisites). In such scenarios, customers can establish a cloud trust between their on-premises AD DS and MS Entra ID (formerly Azure Active Directory) to access SMB file shares in a secure manner. This article explains how a cloud trust works, and provides instructions for setup and validation. It also includes steps to rotate a Kerberos key for your service account in Microsoft Entra ID and Trusted Domain Object, and steps to remove a Trusted Domain Object and all Kerberos settings, if desired.

This article focuses on authenticating [hybrid user identities](../../active-directory/hybrid/whatis-hybrid-identity.md), which are on-premises AD DS identities that are synced to Microsoft Entra ID. **Cloud-only identities aren't currently supported for Azure Files**.

## Applies to

| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Scenarios

The following are examples of scenarios in which it would make sense to configure a cloud trust:

- You have a traditional on premises AD DS but are unable to leverage it for authentication because you don't have unimpeded network connectivity to the domain controllers

- You've started migrating to the cloud but currently have applications still running on traditional on premises AD DS

- You don't meet the OS requirements for Microsoft Entra Kerberos authentication

## Permissions

To complete the steps outlined in this article, you need:

- An on-premises Active Directory administrator username and password
- Microsoft Entra Global Administrator account username and password

## Prerequisites

Before you configure the cloud trust, make sure you've completed the following prerequisites.


## Next step

For more information, see these resources:

- [Overview of Azure Files identity-based authentication support for SMB access](storage-files-active-directory-overview.md)
