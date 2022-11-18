---
title: Use Azure Files with multiple Active Directory (AD) forests
description: Configure on-premises Active Directory Domain Services (AD DS) authentication for SMB Azure file shares with an AD DS environment using multiple forests.
author: khdownie
ms.service: storage
ms.topic: how-to
ms.date: 11/18/2022
ms.author: kendownie
ms.subservice: files 
---

# Use Azure Files with multiple Active Directory forests

Many organizations want to use identity-based authentication for SMB Azure file shares in environments that have multiple on-premises Active Directory Domain Services (AD DS) forests. This is a common IT scenario, especially following mergers and acquisitions, where the acquired company's AD forests are isolated from the parent company's AD forests. This article explains how forest trust relationships work and provides step-by-step instructions for multi-forest setup and validation.

> [!IMPORTANT]
> When you have multiple forests, all forests must be reachable by a single Azure AD Connect sync server. You can use Azure AD Cloud Sync instead of (or alongside) Azure AD Connect to synchronize to an Azure AD tenant from a disconnected, multi-forest AD environment.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Prerequisites

- Two AD DS domain controllers with different forests and on different virtual networks (VNETs)
- Sufficient AD permissions to perform administrative tasks

## How forest trust relationships work

Azure Files on-premises AD DS authentication is only supported against the AD forest of the domain service that the storage account is registered to. You can only access Azure file shares with the AD DS credentials from a single forest by default. If you need to access your Azure file share from a different forest, then you must configure a **forest trust**.

A forest trust is a transitive trust between two AD forests that allows users in any of the domains in one forest to be authenticated in any of the domains in the other forest.

### Configuring suffix routing

The way Azure Files register in AD DS is almost the same as a regular file server, where it creates an identity (a computer account or service logon account) that represents the storage account in AD DS for authentication. The only difference is that the registered service principal name (SPN) of the storage account ends with "file.core.windows.net" which does not match with the domain suffix. In this case, you might need to configure your suffix routing policy to enable multiple forest authentication due to the different domain suffix.

For example, when users in a domain in **Forest 1** want to reach a file share with the storage account registered against a domain in **Forest 2**, this won't automatically work because the service principal of the storage account doesn't have a suffix matching the suffix of any domain in **Forest 1**. We can address this issue by manually configuring a suffix routing rule from **Forest 1** to **Forest 2** for a custom suffix of "file.core.windows.net".

First, you must add a new custom suffix on **Forest 2**. Make sure you have the appropriate administrative permissions to change the configuration and that you've established trust between the two forests. Then follow these steps:

1. Log on to a machine that's domain-joined to **Forest 2**.
2. Open the **Active Directory Domains and Trusts** console.
3. Right-click on **Active Directory Domains and Trusts**.
4. Select **Properties**, and then select **Add**.
6. Add "file.core.windows.net" as the UPN Suffix.
7. Select **Apply**, then **OK** to close the wizard.

Next, add the suffix routing rule on **Forest 1**, so that it redirects to **Forest 2**.

1. Log on to a machine domain joined to **Forest 1**.
2. Open the **Active Directory Domains and Trusts** console.
3. Right-click on the domain that you want to access the file share, then select the **Trusts** tab and select **Forest 2** domain from outgoing trusts. If you haven't configured trust between the two forests, you need to set up the trust first.
4. Select **Properties** and then **Name Suffix Routing**.
5. Check if the "*.file.core.windows.net" suffix shows up. If not, select **Refresh**.
6. Select "*.file.core.windows.net", then select **Enable** and **Apply**.

## Multi-forest setup and validation

In this how-to exercise, we'll collection domain information and VNET connections between domains, establish and configure a trust, and then validate that the trust is working between the domains.

### Collect domain information

For this exercise, we have two on-premises AD DS domain controllers with two different forests and in different VNETs.

**Forest 1:** Onprem1
Domain: onpremad1.com

**Forest 2:** Onprem2
Domain: onpremad2.com

**Onprem1:** Vnet - DomainServicesVNet WUS
**Onprem2:** Vnet - vnet2/workloads

### Establish and configure the trust

In order to enable clients from forest **Onprem1** to access Azure Files domain resources in forest **Onprem2**, we must establish a trust between the two forests. Follow these steps to establish the trust.

1. Log on to a machine that's domain-joined to **Forest 2** and open the **Active Directory Domains and Trusts** console.
1. Right-click on the local domain **onpremad2.com**, and then select the **Trusts** tab.
1. Select **New Trusts** to launch the **New Trust Wizard**.
1. Specify the domain name you want to build trust with (in this example, **onpremad1.com**), and then select **Next**.
1. For **Trust Type**, select **Forest trust**, and then select **Next**.
1. For **Direction of Trust**, select **Two-way**, and then select **Next**.
1. For **Sides of Trust**, select **This domain only**, and then select **Next**.
1. Users in the specified forest can be authenticated to use all of the resources in the local forest (forest-wide authentication) or only those resources that you select (selective authentication). For **Outgoing Trust Authentication Level**, select **Forest-wide authentication**, which is the preferred option when both forests belong to the same organization. Select **Next**.
1. Enter a password for the trust, then select **Next**. The same password must be used when creating this trust relationship in the specified domain.
1. You should see a message that the trust relationship was successfully created. To configure the trust, select **Next**.
1. Confirm the outgoing trust, and select **Next**.
1. Enter the username and password of a user that has admin privileges from the other domain.

Once the authentication passes, the trust is established, and you should be able to see the specified domain **onpremad1.com** listed in the **Trusts** tab.

### Validate the trust is working

Once the trust is established, you'll need to create storage accounts and enable AD DS authentication for Azure file shares. 

## Next steps

For more information, see these resources:

- [Overview of Azure Files identity-based authentication support for SMB access](storage-files-active-directory-overview.md)
- [FAQ](storage-files-faq.md)
