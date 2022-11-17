---
title: Use Azure Files with multiple Active Directory (AD) forests
description: Configure on-premises Active Directory Domain Services (AD DS) authentication for SMB Azure file shares with an AD DS environment using multiple forests
author: khdownie
ms.service: storage
ms.topic: how-to
ms.date: 11/17/2022
ms.author: kendownie
ms.subservice: files 
---

# Use Azure Files with multiple Active Directory forests

Many organizations want to use identity-based authentication for SMB Azure file shares in environments that have multiple on-premises Active Directory Domain Services (AD DS) forests. This is a common IT scenario, especially following mergers and acquisitions. This article explains forest trust relationships and provides step-by-step instructions for multi-forest setup and validation.

> [!IMPORTANT]
> The content of this article only applies to SMB Azure file shares.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Prerequisites

- Two AD DS domain controllers in different forests and on different virtual networks

## How forest trust relationships work

Azure Files on-premises AD DS authentication is only supported against the AD forest of the domain service that the storage account is registered to. You can only access Azure file shares with the AD DS credentials from a single forest by default. If you need to access your Azure file share from a different forest, then you must configure a forest trust.

The way Azure Files register in AD DS almost the same as a regular file server, where it creates an identity (computer or service logon account) in AD DS for authentication. The only difference is that the registered SPN of the storage account ends with "file.core.windows.net" which does not match with the domain suffix. Consult your domain administrator to see if any update to your suffix routing policy is required to enable multiple forest authentication due to the different domain suffix.

### Configuring suffix routing

For example, when users in forest A domain want to reach a file share with the storage account registered against a domain in forest B, this won't automatically work because the service principal of the storage account doesn't have a suffix matching the suffix of any domain in forest A. We can address this issue by manually configuring a suffix routing rule from forest A to forest B for a custom suffix of "file.core.windows.net".

First, you must add a new custom suffix on forest B. Make sure you have the appropriate administrative permissions to change the configuration, then follow these steps:

    1. Log on to a machine domain joined to forest B.
    2. Open up the **Active Directory Domains and Trusts** console.
    3. Right-click on **Active Directory Domains and Trusts**.
    4. Select **Properties**.
    5. Select **Add**.
    6. Add "file.core.windows.net" as the UPN Suffixes.
    7. Select **Apply**, then **OK** to close the wizard.

Next, add the suffix routing rule on forest A, so that it redirects to forest B.

    1. Log on to a machine domain joined to forest A.
    2. Open up "Active Directory Domains and Trusts" console.
    3. Right-click on the domain that you want to access the file share, then select the **Trusts** tab and select forest B domain from outgoing trusts. If you haven't configured trust between the two forests, you need to set up the trust first.
    4. Select **Properties** and then **Name Suffix Routing**
    5. Check if the "*.file.core.windows.net" suffix shows up. If not, click **Refresh**.
    6. Select "*.file.core.windows.net", then select **Enable** and **Apply**.

## Multi-forest setup and validation


### Collect domain information


### Establish the trust


## Next steps

For more information, see these resources:

- [Potential errors when enabling Azure AD Kerberos authentication for hybrid users](storage-troubleshoot-windows-file-connection-problems.md#potential-errors-when-enabling-azure-ad-kerberos-authentication-for-hybrid-users)
- [Overview of Azure Files identity-based authentication support for SMB access](storage-files-active-directory-overview.md)
- [FAQ](storage-files-faq.md)
