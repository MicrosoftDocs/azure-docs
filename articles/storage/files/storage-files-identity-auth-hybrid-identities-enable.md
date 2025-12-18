---
title: Microsoft Entra Kerberos Authentication for Azure Files
description: Learn how to enable identity-based Kerberos authentication over Server Message Block (SMB) for Azure Files through Microsoft Entra ID. Hybrid and cloud-only users can then access Azure file shares by using their Microsoft Entra credentials.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 11/26/2025
ms.author: kendownie
# Customer intent: As a storage administrator, I want to enable Microsoft Entra Kerberos authentication on Azure Files, so that hybrid and cloud-only users can securely access file shares with their Microsoft Entra credentials.
---

# Enable Microsoft Entra Kerberos authentication for hybrid and cloud-only identities (preview) on Azure Files

**Applies to:** :heavy_check_mark: SMB Azure file shares

This article focuses on enabling and configuring Microsoft Entra ID (formerly Azure AD) for authenticating [hybrid](../../active-directory/hybrid/whatis-hybrid-identity.md) or cloud-only identities (preview).

- Hybrid identities are on-premises Active Directory Domain Services (AD DS) identities that are synced to Microsoft Entra ID using either [Microsoft Entra Connect](../../active-directory/hybrid/whatis-azure-ad-connect.md) or [Microsoft Entra Connect cloud sync](../../active-directory/cloud-sync/what-is-cloud-sync.md).

- Cloud-only identities are created and managed only in Microsoft Entra ID.

Enabling Microsoft Entra Kerberos authentication allows users to access Azure file shares using Kerberos authentication. Microsoft Entra ID issues the necessary Kerberos tickets to access the file share with the SMB protocol. For cloud-only users, this means that Azure file shares no longer need a domain controller for authorization or authentication (preview). However, for hybrid identities, configuring Windows access control lists (ACLs) and directory/file-level permissions for a user or group requires unimpeded network connectivity to the on-premises domain controller.

For more information, see [Overview of Azure Files identity-based authentication options for SMB access](storage-files-active-directory-overview.md) and [this deep dive](https://techcommunity.microsoft.com/t5/itops-talk-blog/deep-dive-how-azure-ad-kerberos-works/ba-p/3070889).

> [!IMPORTANT]
> You can only enable one identity source on your storage account for identity-based authentication with Azure Files. If Microsoft Entra Kerberos authentication doesn't fit your requirements, you might be able to use [on-premises Active Directory Domain Service (AD DS)](storage-files-identity-ad-ds-overview.md) or [Microsoft Entra Domain Services](storage-files-identity-auth-domain-services-enable.md) instead. The configuration steps and supported scenarios are different for each method.

## Prerequisites

Before you enable Microsoft Entra Kerberos authentication over SMB for Azure file shares, make sure you've completed the following prerequisites. 

### Minimum prerequisites

The following prerequisites are mandatory. Without these, you can't authenticate using Microsoft Entra ID.

- Your Azure storage account can't authenticate with both Microsoft Entra ID and a second method like AD DS or Microsoft Entra Domain Services. If you've already chosen another identity source for your storage account, you must disable it before enabling Microsoft Entra Kerberos.

- If you want to authenticate hybrid identities, you'll also need AD DS and either [Microsoft Entra Connect](../../active-directory/hybrid/whatis-azure-ad-connect.md) or [Microsoft Entra Connect cloud sync](../../active-directory/cloud-sync/what-is-cloud-sync.md). You must create these accounts in Active Directory and sync them to Microsoft Entra ID. To assign Azure Role-Based Access Control (RBAC) permissions for the Azure file share to a user group, you must create the group in Active Directory and sync it to Microsoft Entra ID. This doesn't apply to cloud-only identities.

- The WinHTTP Web Proxy Auto-Discovery Service (`WinHttpAutoProxySvc`) is required, and must be in the "running" state. You may optionally [disable Web Proxy Auto-Discovery (WPAD)](/troubleshoot/windows-server/networking/disable-http-proxy-auth-features#how-to-disable-wpad), but the service should still be running.

- The IP Helper service (`iphlpsvc`) is required, and must be in the "running" state.

- You must disable multifactor authentication (MFA) on the Microsoft Entra app representing the storage account. For instructions, see [Disable multifactor authentication on the storage account](#disable-multifactor-authentication-on-the-storage-account).

- This feature doesn't currently support cross-tenant access for B2B users or guest users. Users from a Microsoft Entra tenant other than the one configured won't be able to access the file share.

- With Microsoft Entra Kerberos, the Kerberos ticket encryption is always AES-256. But you can set the SMB channel encryption that best fits your needs.

- Azure Files SMB support for external identities is currently limited to FSLogix scenarios running on Azure Virtual Desktop (AVD). This applies to external users invited to a Microsoft Entra ID tenant in the public cloud, with the exception of cross-cloud users (those invited into the tenant from Azure Government or Azure operated by 21Vianet). Government cloud scenarios aren't supported. Non-AVD scenarios aren't supported for business-to-business guest users or users from other Microsoft Entra tenants.

> [!IMPORTANT]
> Cloud-only identities support (preview) is only available using a [default share-level permission](storage-files-identity-assign-share-level-permissions.md#share-level-permissions-for-all-authenticated-identities).

### Operating system and domain prerequisites

The following prerequisites are required for the standard Microsoft Entra Kerberos authentication flow as described in this article. If some or all of your client machines don't meet these, you can still enable Microsoft Entra Kerberos authentication for SMB file shares, but you'll also need to [configure a cloud trust](storage-files-identity-auth-hybrid-cloud-trust.md) to allow these clients to access file shares.

Using Microsoft Entra Kerberos authentication for cloud-only identities (preview) requires one of the following operating systems:

  - Windows 11 Enterprise/Pro single or multi-session.
  - Windows Server 2025 with the latest cumulative updates installed.

Using Microsoft Entra Kerberos authentication for hybrid identities requires one of the following operating systems:

  - Windows 11 Enterprise/Pro single or multi-session.
  - Windows 10 Enterprise/Pro single or multi-session, versions 2004 or later with the latest cumulative updates installed, especially the [KB5007253 - 2021-11 Cumulative Update Preview for Windows 10](https://support.microsoft.com/topic/november-22-2021-kb5007253-os-builds-19041-1387-19042-1387-19043-1387-and-19044-1387-preview-d1847be9-46c1-49fc-bf56-1d469fc1b3af).
  - Windows Server 2025 with the latest cumulative updates installed.
  - Windows Server 2022 with the latest cumulative updates installed, especially the [KB5007254 - 2021-11 Cumulative Update Preview for Microsoft server operating system version 21H2](https://support.microsoft.com/topic/november-22-2021-kb5007254-os-build-20348-380-preview-9a960291-d62e-486a-adcc-6babe5ae6fc1).

To learn how to create and configure a Windows VM and log in by using Microsoft Entra ID-based authentication, see [Log in to a Windows virtual machine in Azure by using Microsoft Entra ID](../../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md).

Clients must be Microsoft Entra joined or [Microsoft Entra hybrid joined](../../active-directory/devices/hybrid-join-plan.md). They can't be joined to Microsoft Entra Domain Services or joined to AD only.

## Regional availability

Support for hybrid identities is available in the [Azure Public, Azure US Gov, and Azure China 21Vianet clouds](https://azure.microsoft.com/global-infrastructure/locations/).

Support for cloud-only identities (preview) is available only in the Azure Public clouds and is limited to using a [default share-level permission](storage-files-identity-assign-share-level-permissions.md#share-level-permissions-for-all-authenticated-identities) for all authenticated identities.

<a name='enable-azure-ad-kerberos-authentication'></a>

## Enable Microsoft Entra Kerberos authentication

You can enable Microsoft Entra Kerberos authentication on Azure Files using the Azure portal, PowerShell, or Azure CLI.

# [Portal](#tab/azure-portal)

To enable Microsoft Entra Kerberos authentication using the [Azure portal](https://portal.azure.com), follow these steps.

1. Sign in to the Azure portal and select the storage account you want to enable Microsoft Entra Kerberos authentication for.
1. Under **Data storage**, select **File shares**.
1. Next to **Identity-based access**, select the configuration status (for example, **Not configured**).
 
   :::image type="content" source="media/storage-files-identity-auth-hybrid-identities-enable/configure-identity-based-access.png" alt-text="Screenshot of the Azure portal showing file share settings for a storage account." lightbox="media/storage-files-identity-auth-hybrid-identities-enable/configure-identity-based-access.png" border="true":::

1. Under **Microsoft Entra Kerberos**, select **Set up**.
1. Select the **Microsoft Entra Kerberos** checkbox.

   :::image type="content" source="media/storage-files-identity-auth-hybrid-identities-enable/enable-entra-kerberos.png" alt-text="Screenshot of the Azure portal showing identity-based access configuration settings for a storage account. Microsoft Entra Kerberos is selected." lightbox="media/storage-files-identity-auth-hybrid-identities-enable/enable-entra-kerberos.png" border="true":::

1. **Optional:** If you're authenticating hybrid identities and want to configure directory and file-level permissions through Windows File Explorer, then you must specify the domain name and domain GUID for your on-premises AD. You can get this information from your domain admin or by running the following Active Directory PowerShell cmdlet from an on-premises AD-joined client: `Get-ADDomain`. Your domain name should be listed in the output under `DNSRoot` and your domain GUID should be listed under `ObjectGUID`. If you'd prefer to configure directory and file-level permissions using icacls, you can skip this step. However, if you want to use icacls, the client will need unimpeded network connectivity to the on-premises AD. **Configuring directory and file-level permissions using Windows File Explorer isn't currently supported for cloud-only identities (preview).**

1. Select **Save**.

# [Azure PowerShell](#tab/azure-powershell)

To enable Microsoft Entra Kerberos using Azure PowerShell, run the following command. Remember to replace placeholder values, including brackets, with your values.

```azurepowershell
Set-AzStorageAccount -ResourceGroupName <resourceGroupName> -StorageAccountName <storageAccountName> -EnableAzureActiveDirectoryKerberosForFile $true
```

**Optional:** If you're authenticating hybrid identities and you want to configure directory and file-level permissions through Windows File Explorer, then you also need to specify the domain name and domain GUID for your on-premises AD. If you'd prefer to configure directory and file-level permissions using icacls, you can skip this step. However, if you want to use icacls, the client will need unimpeded network connectivity to the on-premises AD. **Configuring directory and file-level permissions using Windows File Explorer isn't currently supported for cloud-only identities (preview).**

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
  
To enable Microsoft Entra Kerberos using Azure CLI, run the following command. Remember to replace placeholder values, including brackets, with your values.

```azurecli
az storage account update --name <storageaccountname> --resource-group <resourcegroupname> --enable-files-aadkerb true
```

**Optional:** If you're authenticating hybrid identities and you want to configure directory and file-level permissions through Windows File Explorer, then you also need to specify the domain name and domain GUID for your on-premises AD. If you'd prefer to configure directory and file-level permissions using icacls, you can skip this step. However, if you want to use icacls, the client will need unimpeded network connectivity to the on-premises AD. **Configuring directory and file-level permissions using Windows File Explorer isn't currently supported for cloud-only identities (preview).**

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
> If you've previously enabled Microsoft Entra Kerberos authentication through manual limited preview steps to store FSLogix profiles on Azure Files for Microsoft Entra joined VMs, the password for the storage account's service principal is set to expire every six months. Once the password expires, users won't be able to get Kerberos tickets to the file share. To mitigate this, see "Error - Service principal password has expired in Microsoft Entra ID" under [Potential errors when enabling Microsoft Entra Kerberos authentication](/troubleshoot/azure/azure-storage/files-troubleshoot-smb-authentication?toc=/azure/storage/files/toc.json#potential-errors-when-enabling-azure-ad-kerberos-authentication-for-hybrid-users).

## Grant admin consent to the new service principal

After enabling Microsoft Entra Kerberos authentication, you'll need to explicitly grant admin consent to the new Microsoft Entra application registered in your Microsoft Entra tenant. This service principal is auto-generated and isn't used for authorization to the file share, so don't make any edits to the service principal other than those documented here. If you do, you might get an error.

You can configure the API permissions from the [Azure portal](https://portal.azure.com) by following these steps:

1. Open **Microsoft Entra ID**.
1. In the service menu, under **Manage**, select **App registrations**.
1. Select **All Applications**.
1. Select the application with the name matching **[Storage Account] `<your-storage-account-name>`.file.core.windows.net**.
1. In the service menu, under **Manage**, select **API permissions**.
1. Select **Grant admin consent for [Directory Name]** to grant consent for the three requested API permissions (openid, profile, and User.Read) for all accounts in the directory.
1. Select **Yes** to confirm.

If you're connecting to a storage account via a private endpoint/private link using Microsoft Entra Kerberos authentication, you'll also need to add the private link FQDN to the storage account's Microsoft Entra application. For instructions, see our [troubleshooting guide](/troubleshoot/azure/azure-storage/files-troubleshoot-smb-authentication?toc=/azure/storage/files/toc.json#error-1326---the-username-or-password-is-incorrect-when-using-private-link).

## Enable cloud-only groups support (mandatory for cloud-only identities)

Kerberos tickets can include a maximum of 1,010 Security Identifiers (SIDs) for groups. Now that Microsoft Entra Kerberos supports Entra-only identities (preview), tickets must include both on-premises group SIDs and cloud group SIDs. If the combined group SIDs exceed 1,010, the Kerberos ticket can't be issued. 

If you're using Microsoft Entra Kerberos to authenticate cloud-only identities, you'll need to update the Tags in your application manifest file, or authentication will fail. 

Follow [these instructions](/entra/identity/authentication/kerberos#group-sid-limit-in-entra-kerberos-preview) to update the tag in your application manifest.

## Disable multifactor authentication on the storage account

Microsoft Entra Kerberos doesn't support using MFA to access Azure file shares configured with Microsoft Entra Kerberos. You must exclude the Microsoft Entra app representing your storage account from your MFA conditional access policies if they apply to all apps.

The storage account app should have the same name as the storage account in the conditional access exclusion list. When searching for the storage account app in the conditional access exclusion list, search for: **[Storage Account] `<your-storage-account-name>`.file.core.windows.net**

Remember to replace `<your-storage-account-name>` with the proper value.

  > [!IMPORTANT]
  > If you don't exclude MFA policies from the storage account app, you won't be able to access the file share. Trying to map the file share using `net use` will result in an error message that says "System error 1327: Account restrictions are preventing this user from signing in. For example: blank passwords aren't allowed, sign-in times are limited, or a policy restriction has been enforced."

For guidance on disabling MFA, see the following:

- [Add exclusions for service principals of Azure resources](../../active-directory/conditional-access/howto-conditional-access-policy-all-users-mfa.md#user-exclusions)
- [Create a conditional access policy](../../active-directory/conditional-access/howto-conditional-access-policy-all-users-mfa.md#create-a-conditional-access-policy)

## Assign share-level permissions

When you enable identity-based access, for each share you must assign which users and groups have access to that particular share. Once a user or group is allowed access to a share, Windows ACLs (also called NTFS permissions) on individual files and directories take over. This allows for fine-grained control over permissions, similar to an SMB share on a Windows server.

To set share-level permissions, follow the instructions in [Assign share-level permissions to an identity](storage-files-identity-assign-share-level-permissions.md). Cloud-only identities can only be assigned a [default share-level permission](storage-files-identity-assign-share-level-permissions.md#share-level-permissions-for-all-authenticated-identities) that applies to all authenticated identities.

## Configure directory and file-level permissions

Once share-level permissions are in place, you can assign Windows ACLs (directory/file-level permissions) to the user or group. **For hybrid identities, this requires using a device with unimpeded network connectivity to an on-premises AD**.

To configure directory and file-level permissions, follow the instructions in [Configure directory and file-level permissions over SMB](storage-files-identity-configure-file-level-permissions.md).

## Configure the clients to retrieve Kerberos tickets

Enable the Microsoft Entra Kerberos functionality on the client machine(s) you want to mount/use Azure File shares from. You must do this on every client on which Azure Files will be used.

Use one of the following three methods:

# [Intune](#tab/intune)

Configure this Intune [Policy CSP](/windows/client-management/mdm/policy-configuration-service-provider) and apply it to the client(s): [Kerberos/CloudKerberosTicketRetrievalEnabled](/windows/client-management/mdm/policy-csp-kerberos#cloudkerberosticketretrievalenabled), set to 1

> > [!NOTE]
> > When configuring **CloudKerberosTicketRetrievalEnabled** via Intune, use the **Settings Catalog** instead of the OMA-URI method.  
> The OMA-URI method does **not** work on **Azure Virtual Desktop (AVD) multi-session** devices. AVD multi-session is a common deployment scenario for **Entra Kerberos with hybrid identities**, including configurations involving **Entra ID Join**, **FSLogix**, and **Azure Files**.  


# [Group Policy](#tab/gpo)

Configure this group policy on the client(s) to "Enabled": `Administrative Templates\System\Kerberos\Allow retrieving the Azure AD Kerberos Ticket Granting Ticket during logon`

On older versions of Windows, this setting will be called: `Administrative Templates\System\Kerberos\Allow retrieving the cloud Kerberos ticket during the logon`
 
This setting allows the client to retrieve a cloud-based Kerberos Ticket Granting Ticket (TGT) during user logon.

# [Registry Key](#tab/regkey)

Set the following registry value on the client(s) by running this command from an elevated command prompt: 

```console
reg add HKLM\SYSTEM\CurrentControlSet\Control\Lsa\Kerberos\Parameters /v CloudKerberosTicketRetrievalEnabled /t REG_DWORD /d 1
```

---

Changes aren't instant, and require a policy refresh or a reboot to take effect.

> [!IMPORTANT]
> Once this change is applied, the client(s) won't be able to connect to storage accounts that are configured for on-premises AD DS integration without configuring Kerberos realm mappings. If you want the client(s) to be able to connect to storage accounts configured for AD DS as well as storage accounts configured for Microsoft Entra Kerberos, follow the steps in [Configure coexistence with storage accounts using on-premises AD DS](#configure-coexistence-with-storage-accounts-using-on-premises-ad-ds).

### Configure coexistence with storage accounts using on-premises AD DS

If you want to enable client machines to connect to storage accounts that are configured for AD DS as well as storage accounts configured for Microsoft Entra Kerberos, follow these steps. If you're only using Microsoft Entra Kerberos, skip this section.

Add an entry for each storage account that uses on-premises AD DS integration. Use one of the following three methods to configure Kerberos realm mappings. Changes aren't instant, and require a policy refresh or a reboot to take effect.

# [Intune](#tab/intune)

Configure this Intune [Policy CSP](/windows/client-management/mdm/policy-configuration-service-provider) and apply it to the client(s): [Kerberos/HostToRealm](/windows/client-management/mdm/policy-csp-admx-kerberos#hosttorealm)

# [Group Policy](#tab/gpo)

Configure this group policy on the client(s): `Administrative Template\System\Kerberos\Define host name-to-Kerberos realm mappings`

- Set the policy to `Enabled`
- Then, click on the `Show...` button to define the list of host name-to-realm mappings. For each storage account configured for AD DS, add an entry where:
  - `Value` is the AD DS-enabled storage account's host name, i.e. `<your storage account name>.file.core.windows.net`
  - `Value name` is the AD DS realm name

# [Registry Key](#tab/regkey)

Run the following `ksetup` Windows command on the client(s):

```console
ksetup /addhosttorealmmap <hostname> <REALMNAME>
```

For example, if your realm is `CONTOSO.LOCAL`, run `ksetup /addhosttorealmmap <your storage account name>.file.core.windows.net CONTOSO.LOCAL`

---

> [!IMPORTANT]
> In Kerberos, realm names are case sensitive and upper case. Your Kerberos realm name is usually the same as your domain name, in upper-case letters.

## Undo the client configuration to retrieve Kerberos tickets

If you no longer want to use a client machine for Microsoft Entra Kerberos authentication, you can disable the Microsoft Entra Kerberos functionality on that machine. Use one of the following three methods, depending on how you enabled the functionality:

# [Intune](#tab/intune)

Configure this Intune [Policy CSP](/windows/client-management/mdm/policy-configuration-service-provider) and apply it to the client(s): [Kerberos/CloudKerberosTicketRetrievalEnabled](/windows/client-management/mdm/policy-csp-kerberos#kerberos-cloudkerberosticketretrievalenabled), set to 0

# [Group Policy](#tab/gpo)

Configure this group policy on the client(s) to "Disabled": `Administrative Templates\System\Kerberos\Allow retrieving the Azure AD Kerberos Ticket Granting Ticket during logon`

# [Registry Key](#tab/regkey)

Set the following registry value on the client(s) by running this command from an elevated command prompt: 

```console
reg add HKLM\SYSTEM\CurrentControlSet\Control\Lsa\Kerberos\Parameters /v CloudKerberosTicketRetrievalEnabled /t REG_DWORD /d 0
```

---

Changes aren't instant, and require a policy refresh or a reboot to take effect.

If you followed the steps in [Configure coexistence with storage accounts using on-premises AD DS](#configure-coexistence-with-storage-accounts-using-on-premises-ad-ds), you can optionally remove all host name to Kerberos realm mappings from the client machine. Use one of the following three methods:

# [Intune](#tab/intune)

Configure this Intune [Policy CSP](/windows/client-management/mdm/policy-configuration-service-provider) and apply it to the client(s): [Kerberos/HostToRealm](/windows/client-management/mdm/policy-csp-admx-kerberos#hosttorealm)

# [Group Policy](#tab/gpo)

Configure this group policy on the client(s): `Administrative Template\System\Kerberos\Define host name-to-Kerberos realm mappings`

# [Registry Key](#tab/regkey)

Run the following `ksetup` Windows command on the client(s):

```console
ksetup /delhosttorealmmap <hostname> <realmname>
```

For example, if your realm is `CONTOSO.LOCAL`, run `ksetup /delhosttorealmmap <your storage account name>.file.core.windows.net CONTOSO.LOCAL`

You can view the list of current host name to Kerberos realm mappings by inspecting the registry key `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa\Kerberos\HostToRealm`.

---

Changes aren't instant, and require a policy refresh or a reboot to take effect.

> [!IMPORTANT]
> Once this change is applied, the client(s) won't be able to connect to storage accounts that are configured for Microsoft Entra Kerberos authentication. However, they will be able to connect to storage accounts configured to AD DS, without any additional configuration.

<a name='disable-azure-ad-authentication-on-your-storage-account'></a>

## Disable Microsoft Entra authentication on your storage account

If you want to use another authentication method, you can disable Microsoft Entra authentication on your storage account by using the Azure portal, Azure PowerShell, or Azure CLI.

> [!NOTE]
> Disabling this feature means that there will be no identity-based access for file shares in your storage account until you enable and configure one of the other identity sources.

# [Portal](#tab/azure-portal)

To disable Microsoft Entra Kerberos authentication on your storage account by using the Azure portal, follow these steps.

1. Sign in to the Azure portal and select the storage account you want to disable Microsoft Entra Kerberos authentication for.
1. Under **Data storage**, select **File shares**.
1. Next to **Identity-based access**, select the configuration status.
1. Under **Microsoft Entra Kerberos**, select **Configure**.
1. Uncheck the **Microsoft Entra Kerberos** checkbox.
1. Select **Save**.

# [Azure PowerShell](#tab/azure-powershell)

To disable Microsoft Entra Kerberos authentication on your storage account by using Azure PowerShell, run the following command. Remember to replace placeholder values, including brackets, with your values.

```azurepowershell
Set-AzStorageAccount -ResourceGroupName <resourceGroupName> -StorageAccountName <storageAccountName> -EnableAzureActiveDirectoryKerberosForFile $false
```

# [Azure CLI](#tab/azure-cli)

To disable Microsoft Entra Kerberos authentication on your storage account by using Azure CLI, run the following command. Remember to replace placeholder values, including brackets, with your values.

```azurecli
az storage account update --name <storageaccountname> --resource-group <resourcegroupname> --enable-files-aadkerb false
```

---

## Debugging

If needed, you can run the `Debug-AzStorageAccountAuth` cmdlet to conduct a set of basic checks on your Microsoft Entra ID configuration with the logged on Entra ID user. The Microsoft Entra checks that are part of this cmdlet are supported on [AzFilesHybrid v0.3.0+ version](https://github.com/Azure-Samples/azure-files-samples/releases). This cmdlet is applicable for Microsoft Entra Kerberos and AD DS authentication but doesn't work for Microsoft Entra Domain Services enabled storage accounts. For more information on the checks performed in this cmdlet, see [Unable to mount Azure file shares with Microsoft Entra Kerberos](/troubleshoot/azure/azure-storage/files/security/files-troubleshoot-smb-authentication?tabs=azure-portal#unable-to-mount-azure-file-shares-with-microsoft-entra-kerberos).

## Next steps

- [Mount an Azure file share](storage-files-identity-mount-file-share.md)
- [Potential errors when enabling Microsoft Entra Kerberos authentication](files-troubleshoot-smb-authentication.md#potential-errors-when-enabling-azure-ad-kerberos-authentication-for-hybrid-users)
- [Create a profile container with Azure Files and Microsoft Entra ID](/azure/virtual-desktop/create-profile-container-azure-ad)
