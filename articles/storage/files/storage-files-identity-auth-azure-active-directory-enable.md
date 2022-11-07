---
title: Use Azure Active Directory to authorize access to Azure files over SMB for hybrid identities using Kerberos authentication
description: Learn how to enable identity-based Kerberos authentication for hybrid user identities over Server Message Block (SMB) for Azure Files through Azure Active Directory. Your users can then access Azure file shares by using their Azure AD credentials.
author: khdownie
ms.service: storage
ms.topic: how-to
ms.date: 11/07/2022
ms.author: kendownie
ms.subservice: files
---

# Enable Azure Active Directory Kerberos authentication for hybrid identities on Azure Files
[!INCLUDE [storage-files-aad-auth-include](../../../includes/storage-files-aad-auth-include.md)]

This article focuses on enabling and configuring Azure AD for authenticating [hybrid user identities](../../active-directory/hybrid/whatis-hybrid-identity.md), which are on-premises AD identities that are synced to the cloud. This allows Azure AD users to access Azure file shares using Kerberos authentication. This configuration uses Azure AD to issue the necessary Kerberos tickets to access the file share with the industry-standard SMB protocol. This means your end users can access Azure file shares over the internet without requiring a line-of-sight to domain controllers from hybrid Azure AD-joined and Azure AD-joined VMs. However, configuring Windows access control lists (ACLs) and permissions might require line-of-sight to the domain controller.

For more information on supported options and considerations, see [Overview of Azure Files identity-based authentication options for SMB access](storage-files-active-directory-overview.md). For more information about Azure AD Kerberos, see [Deep dive: How Azure AD Kerberos works](https://techcommunity.microsoft.com/t5/itops-talk-blog/deep-dive-how-azure-ad-kerberos-works/ba-p/3070889).

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Prerequisites

Before you enable Azure AD over SMB for Azure file shares, make sure you've completed the following prerequisites.

> [!NOTE]
> Your Azure storage account can't authenticate with both Azure AD and a second method like AD DS or Azure AD DS. You can only use one AD source. If you've already chosen another AD source for your storage account, you must disable it before enabling Azure AD Kerberos.

The Azure AD Kerberos functionality for hybrid identities is only available on the following operating systems:

  - Windows 11 Enterprise single or multi-session.
  - Windows 10 Enterprise single or multi-session, versions 2004 or later with the latest cumulative updates installed, especially the [KB5007253 - 2021-11 Cumulative Update Preview for Windows 10](https://support.microsoft.com/topic/november-22-2021-kb5007253-os-builds-19041-1387-19042-1387-19043-1387-and-19044-1387-preview-d1847be9-46c1-49fc-bf56-1d469fc1b3af).
  - Windows Server, version 2022 with the latest cumulative updates installed, especially the [KB5007254 - 2021-11 Cumulative Update Preview for Microsoft server operating system version 21H2](https://support.microsoft.com/topic/november-22-2021-kb5007254-os-build-20348-380-preview-9a960291-d62e-486a-adcc-6babe5ae6fc1).

To learn how to create and configure a Windows VM and log in by using Azure AD-based authentication, see [Log in to a Windows virtual machine in Azure by using Azure AD](../../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md).

This feature doesn't currently support user accounts that you create and manage solely in Azure AD. User accounts must be [hybrid user identities](../../active-directory/hybrid/whatis-hybrid-identity.md), which means you'll also need AD DS and either [Azure AD Connect](../../active-directory/hybrid/whatis-azure-ad-connect.md) or [Azure AD Connect cloud sync](../../active-directory/cloud-sync/what-is-cloud-sync.md). You must create these accounts in Active Directory and sync them to Azure AD. To assign Azure Role-Based Access Control (RBAC) permissions for the Azure file share to a user group, you must create the group in Active Directory and sync it to Azure AD.

You must disable multi-factor authentication (MFA) on the Azure AD app representing the storage account.

Azure AD Kerberos authentication only supports using AES-256 encryption.

## Regional availability

Azure Files authentication with Azure AD Kerberos is available in Azure public cloud in [all Azure regions](https://azure.microsoft.com/global-infrastructure/locations/) except China and Government clouds.

## Enable Azure AD Kerberos authentication for hybrid user accounts

You can enable Azure AD Kerberos authentication on Azure Files for hybrid user accounts using the Azure portal, PowerShell, or Azure CLI.

# [Portal](#tab/azure-portal)

To enable Azure AD Kerberos authentication using the [Azure portal](https://portal.azure.com), follow these steps.

1. Sign in to the Azure portal and select the storage account you want to enable Azure AD Kerberos authentication for.
1. Under **Data storage**, select **File shares**.
1. Next to **Active Directory**, select the configuration status (for example, **Not configured**).
 
   :::image type="content" source="media/storage-files-identity-auth-azure-active-directory-enable/configure-active-directory.png" alt-text="Screenshot of the Azure portal showing file share settings for a storage account. Active Directory configuration settings are selected." lightbox="media/storage-files-identity-auth-azure-active-directory-enable/configure-active-directory.png" border="true":::

1. Under **Azure AD Kerberos**, select **Set up**.
1. Select the **Azure AD Kerberos** checkbox.

   :::image type="content" source="media/storage-files-identity-auth-azure-active-directory-enable/enable-azure-ad-kerberos.png" alt-text="Screenshot of the Azure portal showing Active Directory configuration settings for a storage account. Azure AD Kerberos is selected." lightbox="media/storage-files-identity-auth-azure-active-directory-enable/enable-azure-ad-kerberos.png" border="true":::

1. **Optional:** If you want to configure directory and file-level permissions through Windows File Explorer, then you also need to specify the domain name and domain GUID for your on-premises AD. You can get this information from your domain admin or by running the following Active Directory PowerShell cmdlets from an on-premises AD-joined client:

   ```PowerShell
   $domainInformation = Get-ADDomain
   $domainGuid = $domainInformation.ObjectGUID.ToString()
   $domainName = $domainInformation.DnsRoot
   ```

   If you'd prefer to configure directory and file-level permissions using icacls, you can skip this step. However, if you want to use icacls, the client will need line-of-sight to the on-premises AD.

1. Select **Save**.

# [Azure PowerShell](#tab/azure-powershell)

To enable Azure AD Kerberos using Azure PowerShell, run the following command. Remember to replace placeholder values, including brackets, with your values.

```azurepowershell
Set-AzStorageAccount -ResourceGroupName <resourceGroupName> -StorageAccountName <storageAccountName> -EnableAzureActiveDirectoryKerberosForFile $true
```

**Optional:** If you want to configure directory and file-level permissions through Windows File Explorer, then you also need to specify the domain name and domain GUID for your on-premises AD. If you'd prefer to configure directory and file-level permissions using icacls, you can skip this step. However, if you want to use icacls, the client will need line-of-sight to the on-premises AD.

You can get this information from your domain admin or by running the following Active Directory PowerShell cmdlets from an on-premises AD-joined client:

```PowerShell
$domainInformation = Get-ADDomain
$domainGuid = $domainInformation.ObjectGUID.ToString()
$domainName = $domainInformation.DnsRoot
```

To specify the domain name and domain GUID for your on-premises AD, run the following Azure PowerShell command. Remember to replace placeholder values, including brackets, with your values.

```azurepowershell
Set-AzStorageAccount -ResourceGroupName <resourceGroupName> -StorageAccountName <storageAccountName> -EnableAzureActiveDirectoryKerberosForFile $true -ActiveDirectoryDomainName $domainName -ActiveDirectoryDomainGuid $domainGuid
```

# [Azure CLI](#tab/azure-cli)
  
To enable Azure AD Kerberos using Azure CLI, run the following command. Remember to replace placeholder values, including brackets, with your values.

```azurecli
az storage account update --name <storageaccountname> --resource-group <resourcegroupname> --enable-files-aadkerb true
```

**Optional:** If you want to configure directory and file-level permissions through Windows File Explorer, then you also need to specify the domain name and domain GUID for your on-premises AD. If you'd prefer to configure directory and file-level permissions using icacls, you can skip this step. However, if you want to use icacls, the client will need line-of-sight to the on-premises AD.

You can get this information from your domain admin or by running the following Active Directory PowerShell cmdlets from an on-premises AD-joined client:

```PowerShell
$domainInformation = Get-ADDomain
$domainGuid = $domainInformation.ObjectGUID.ToString()
$domainName = $domainInformation.DnsRoot
```

To specify the domain name and domain GUID for your on-premises AD, run the following command. Remember to replace placeholder values, including brackets, with your values.

```azurecli
az storage account update --name <storageAccountName> --resource-group <resourceGroupName> --enable-files-aadkerb true --domain-name <domainName> --domain-guid <domainGuid>
```

---

> [!WARNING]
> If you've previously enabled Azure AD Kerberos authentication through manual limited preview steps to store FSLogix profiles on Azure Files for Azure AD-joined VMs, the password for the storage account's service principal is set to expire every six months. Once the password expires, users won't be able to get Kerberos tickets to the file share. To mitigate this, see "Error - Service principal password has expired in Azure AD" under [Potential errors when enabling Azure AD Kerberos authentication for hybrid users](storage-troubleshoot-windows-file-connection-problems.md#potential-errors-when-enabling-azure-ad-kerberos-authentication-for-hybrid-users).

## Grant admin consent to the new service principal

After enabling Azure AD Kerberos authentication, you'll need to explicitly grant admin consent to the new Azure AD application registered in your Azure AD tenant to complete your configuration. You can configure the API permissions from the [Azure portal](https://portal.azure.com) by following these steps:

1. Open **Azure Active Directory**.
2. Select **App registrations** on the left pane.
3. Select **All Applications**.

   :::image type="content" source="media/storage-files-identity-auth-azure-active-directory-enable/azure-portal-azuread-app-registrations.png" alt-text="Screenshot of the Azure portal. Azure Active Directory is open. App registrations is selected in the left pane. All applications is highlighted in the right pane." lightbox="media/storage-files-identity-auth-azure-active-directory-enable/azure-portal-azuread-app-registrations.png":::

4. Select the application with the name matching **[Storage Account] $storageAccountName.file.core.windows.net**.
5. Select **API permissions** in the left pane.
6. Select **Grant admin consent for "DirectoryName"**.
7. Select **Yes** to confirm.

## Disable multi-factor authentication on the storage account

Azure AD Kerberos doesn't support using MFA to access Azure file shares configured with Azure AD Kerberos. You must exclude the Azure AD app representing your storage account from your MFA conditional access policies if they apply to all apps. The storage account app should have the same name as the storage account in the conditional access exclusion list.

  > [!IMPORTANT]
  > If you don't exclude MFA policies from the storage account app, you won't be able to access the file share. Trying to map the file share using `net use` will result in an error message that says "System error 1327: Account restrictions are preventing this user from signing in. For example: blank passwords aren't allowed, sign-in times are limited, or a policy restriction has been enforced."

## Assign share-level permissions

When you enable identity-based access, you can set for each share which users and groups have access to that particular share. Once a user is allowed into a share, Windows ACLs (also called NTFS permissions) on individual files and directories take over. This allows for fine-grained control over permissions, similar to an SMB share on a Windows server.

To set share-level permissions, follow the instructions in [Assign share-level permissions to an identity](storage-files-identity-ad-ds-assign-permissions.md).

## Configure directory and file-level permissions

Once your share-level permissions are in place, there are two options for configuring directory and file-level permissions with Azure AD Kerberos authentication:

- **Windows Explorer experience:** If you choose this option, then the client must be domain-joined to the on-premises AD.
- **icacls utility:** If you choose this option, then the client needs line-of-sight to the on-premises AD.

To configure directory and file-level permissions through Windows File explorer, you also need to specify domain name and domain GUID for your on-premises AD. You can get this information from your domain admin or from an on-premises AD-joined client. If you prefer to configure using icacls, this step is not required.

To configure directory and file-level permissions, follow the instructions in [Configure directory and file-level permissions over SMB](storage-files-identity-ad-ds-configure-permissions.md).

## Configure the clients to retrieve Kerberos tickets

Enable the Azure AD Kerberos functionality on the client machine(s) you want to mount/use Azure File shares from. You must do this on every client on which Azure Files will be used.

Use one of the following three methods:

- Configure this Intune [Policy CSP](/windows/client-management/mdm/policy-configuration-service-provider) and apply it to the client(s): [Kerberos/CloudKerberosTicketRetrievalEnabled](/windows/client-management/mdm/policy-csp-kerberos#kerberos-cloudkerberosticketretrievalenabled)
- Configure this group policy on the client(s): `Administrative Templates\System\Kerberos\Allow retrieving the Azure AD Kerberos Ticket Granting Ticket during logon`
- Create the following registry value on the client(s): `reg add HKLM\SYSTEM\CurrentControlSet\Control\Lsa\Kerberos\Parameters /v CloudKerberosTicketRetrievalEnabled /t REG_DWORD /d 1`

Changes are not instant, and require a policy refresh or a reboot to take effect.

## Disable Azure AD authentication on your storage account

If you want to use another authentication method, you can disable Azure AD authentication on your storage account by using the Azure portal, Azure PowerShell, or Azure CLI.

> [!NOTE]
> Disabling this feature means that there will be no Active Directory configuration for file shares in your storage account until you enable one of the other Active Directory sources to reinstate your Active Directory configuration.

# [Portal](#tab/azure-portal)

To disable Azure AD Kerberos authentication on your storage account by using the Azure portal, follow these steps.

1. Sign in to the Azure portal and select the storage account you want to disable Azure AD Kerberos authentication for.
1. Under **Data storage**, select **File shares**.
1. Next to **Active Directory**, select the configuration status.
1. Under **Azure AD Kerberos**, select **Configure**.
1. Uncheck the **Azure AD Kerberos** checkbox.
1. Select **Save**.

# [Azure PowerShell](#tab/azure-powershell)

To disable Azure AD Kerberos authentication on your storage account by using Azure PowerShell, run the following command. Remember to replace placeholder values, including brackets, with your values.

```azurepowershell
Set-AzStorageAccount -ResourceGroupName <resourceGroupName> -StorageAccountName <storageAccountName> -EnableAzureActiveDirectoryKerberosForFile $false
```

# [Azure CLI](#tab/azure-cli)

To disable Azure AD Kerberos authentication on your storage account by using Azure CLI, run the following command. Remember to replace placeholder values, including brackets, with your values.

```azurecli
az storage account update --name <storageaccountname> --resource-group <resourcegroupname> --enable-files-aadkerb false
```

---

## Next steps

For more information, see these resources:

- [Potential errors when enabling Azure AD Kerberos authentication for hybrid users](storage-troubleshoot-windows-file-connection-problems.md#potential-errors-when-enabling-azure-ad-kerberos-authentication-for-hybrid-users)
- [Overview of Azure Files identity-based authentication support for SMB access](storage-files-active-directory-overview.md)
- [Create a profile container with Azure Files and Azure Active Directory](../../virtual-desktop/create-profile-container-azure-ad.md)
- [FAQ](storage-files-faq.md)
