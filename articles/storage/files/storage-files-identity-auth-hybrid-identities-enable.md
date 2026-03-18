---
title: Microsoft Entra Kerberos Authentication for Azure Files
description: Learn how to enable identity-based Kerberos authentication over Server Message Block (SMB) for Azure Files through Microsoft Entra ID. Hybrid and cloud-only users can then access Azure file shares by using their Microsoft Entra credentials.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 03/04/2026
ms.author: kendownie
# Customer intent: As a storage administrator, I want to enable Microsoft Entra Kerberos authentication on Azure Files, so that hybrid and cloud-only users can securely access SMB Azure file shares with their Microsoft Entra credentials.
---

# Enable Microsoft Entra Kerberos authentication for hybrid and cloud-only identities (preview) on Azure Files

**Applies to:** :heavy_check_mark: SMB file shares

This article explains how to enable and configure Microsoft Entra ID (formerly Azure AD) for authenticating [hybrid](/entra/identity/hybrid/whatis-hybrid-identity) or cloud-only identities (preview).

- Hybrid identities are on-premises Active Directory Domain Services (AD DS) identities that are synced to Microsoft Entra ID by using either [Microsoft Entra Connect Sync](/entra/identity/hybrid/connect/how-to-connect-sync-whatis) or [Microsoft Entra Cloud Sync](/entra/identity/hybrid/cloud-sync/what-is-cloud-sync).

- Cloud-only identities are created and managed only in Microsoft Entra ID.

When you enable Microsoft Entra Kerberos authentication, users can access Azure file shares by using Kerberos authentication. Microsoft Entra ID issues the necessary Kerberos tickets to access the file share by using the SMB protocol. For cloud-only users, this authentication method means that Azure file shares no longer need a domain controller for authorization or authentication (preview). However, for hybrid identities, configuring Windows access control lists (ACLs) and directory and file-level permissions for a user or group requires unimpeded network connectivity to the on-premises domain controller.

For more information, see [Overview of Azure Files identity-based authentication options for SMB access](storage-files-active-directory-overview.md) and [this deep dive](https://techcommunity.microsoft.com/t5/itops-talk-blog/deep-dive-how-azure-ad-kerberos-works/ba-p/3070889).

> [!IMPORTANT]
> You can only enable one identity source on your storage account for identity-based authentication with Azure Files. If Microsoft Entra Kerberos authentication doesn't fit your requirements, you might be able to use [on-premises Active Directory Domain Service (AD DS)](storage-files-identity-ad-ds-overview.md) or [Microsoft Entra Domain Services](storage-files-identity-auth-domain-services-enable.md) instead. The configuration steps and supported scenarios are different for each method.

## Prerequisites

Before you enable Microsoft Entra Kerberos authentication over SMB for Azure file shares, make sure you complete the following prerequisites.

### Minimum prerequisites

You need the following minimum prerequisites. Without these prerequisites, you can't authenticate by using Microsoft Entra ID.

- Your Azure storage account can't authenticate with both Entra ID and a second method like AD DS or Microsoft Entra Domain Services. If you already chose another identity source for your storage account, you must disable it before enabling Microsoft Entra Kerberos.

- If you want to authenticate hybrid identities, you also need AD DS and either [Microsoft Entra Connect Sync](/entra/identity/hybrid/connect/how-to-connect-sync-whatis) or [Microsoft Entra Cloud Sync](/entra/identity/hybrid/cloud-sync/what-is-cloud-sync). You must create these accounts in Active Directory and sync them to Entra ID. To assign Azure Role-Based Access Control (RBAC) permissions for the Azure file share to a user group, you must create the group in Active Directory and sync it to Entra ID. This requirement doesn't apply to cloud-only identities.

- The WinHTTP Web Proxy Auto-Discovery Service (`WinHttpAutoProxySvc`) is required, and must be in the running state. For security reasons, you can optionally [disable Web Proxy Auto-Discovery (WPAD)](/troubleshoot/windows-server/networking/disable-http-proxy-auth-features#how-to-disable-wpad) via registry keys. However, you shouldn't disable the entire `WinHttpAutoProxySvc` service, as it is responsible for a host of other functionalities, including Kerberos Key Distribution Center Proxy (KDC Proxy) requests.

- The IP Helper service (`iphlpsvc`) is required, and must be in the running state.

- You must disable multifactor authentication (MFA) on the Entra app representing the storage account. For instructions, see [Disable multifactor authentication on the storage account](#disable-multifactor-authentication-on-the-storage-account).

- If you have [application management policies](/entra/identity/enterprise-apps/configure-app-management-policies) that block symmetric key addition on service principals, or that restrict service principal symmetric key lifetime to a value less than 366 days, you will need to [adjust the policy](/entra/identity/enterprise-apps/configure-app-management-policies#enable-a-restriction-for-all-applications) or [grant an exception](/entra/identity/enterprise-apps/configure-app-management-policies#grant-an-exception-to-a-user-or-service) for the "Storage Resource Provider" service (app ID `a6aa9161-5291-40bb-8c5c-923b567bee3b`). If using the [Entra Admin Center](https://aka.ms/app-mgmt-policy-ux), these policies are defined in the "Block password addition" and "Restrict max password lifetime" settings. If using the [Graph API](/graph/api/resources/tenantappmanagementpolicy), these policies are defined in `symmetricKeyAddition` and `symmetricKeyLifetime` restrictions on `servicePrincipalRestrictions.passwordCredentials`.

- This feature currently doesn't support cross-tenant access for B2B users or guest users. Users from an Entra tenant other than the one configured won't be able to access the file share.

- With Microsoft Entra Kerberos, the Kerberos ticket encryption is always AES-256. But you can set the SMB channel encryption that best fits your needs.

- Azure Files SMB support for external identities is currently limited to FSLogix scenarios running on Azure Virtual Desktop. This support applies to external users invited to a Microsoft Entra ID tenant in the public cloud, with the exception of cross-cloud users (those invited into the tenant from Azure Government or Azure operated by 21Vianet). Government cloud scenarios aren't supported. Scenarios not involving Azure Virtual Desktop aren't supported for business-to-business guest users or users from other Entra tenants.

> [!IMPORTANT]
> Cloud-only identities support (preview) is only available by using a [default share-level permission](storage-files-identity-assign-share-level-permissions.md#share-level-permissions-for-all-authenticated-identities).

### Operating system and domain prerequisites

The standard Microsoft Entra Kerberos authentication flow described in this article requires the following prerequisites. If some or all of your client machines don't meet these prerequisites, you can still enable Microsoft Entra Kerberos authentication for SMB file shares, but you need to [configure a cloud trust](storage-files-identity-auth-hybrid-cloud-trust.md) to allow these clients to access file shares.

To use Entra Kerberos authentication for cloud-only identities (preview), use one of the following operating systems:

  - Windows 11 Enterprise/Pro single or multi-session.
  - Windows Server 2025 with the latest cumulative updates installed.

To use Entra Kerberos authentication for hybrid identities, use one of the following operating systems:

  - Windows 11 Enterprise/Pro single or multi-session.
  - Windows 10 Enterprise/Pro single or multi-session, versions 2004 or later with the latest cumulative updates installed, especially the [KB5007253 - 2021-11 Cumulative Update Preview for Windows 10](https://support.microsoft.com/topic/november-22-2021-kb5007253-os-builds-19041-1387-19042-1387-19043-1387-and-19044-1387-preview-d1847be9-46c1-49fc-bf56-1d469fc1b3af).
  - Windows Server 2025 with the latest cumulative updates installed.
  - Windows Server 2022 with the latest cumulative updates installed, especially the [KB5007254 - 2021-11 Cumulative Update Preview for Microsoft server operating system version 21H2](https://support.microsoft.com/topic/november-22-2021-kb5007254-os-build-20348-380-preview-9a960291-d62e-486a-adcc-6babe5ae6fc1).

For information about how to create and configure a Windows VM and sign in by using Entra ID-based authentication, see [Sign in to Windows virtual machine in Azure using Microsoft Entra ID and Azure Role Based Access Control](/entra/identity/devices/howto-vm-sign-in-azure-ad-windows).

Clients must be Microsoft Entra joined or [Microsoft Entra hybrid joined](/entra/identity/devices/hybrid-join-plan). They can't be joined to Microsoft Entra Domain Services or joined to AD only.

## Regional availability

Support for hybrid identities is available in the [Azure Public, Azure US Gov, and Azure China 21Vianet clouds](https://azure.microsoft.com/global-infrastructure/locations/).

Support for cloud-only identities (preview) is available only in the Azure Public clouds and is limited to using a [default share-level permission](storage-files-identity-assign-share-level-permissions.md#share-level-permissions-for-all-authenticated-identities) for all authenticated identities.

<a name='enable-azure-ad-kerberos-authentication'></a>

## Enable Microsoft Entra Kerberos authentication

You can enable Microsoft Entra Kerberos authentication on Azure Files by using the Azure portal, PowerShell, or Azure CLI.

# [Portal](#tab/azure-portal)

To enable Microsoft Entra Kerberos authentication by using the [Azure portal](https://portal.azure.com), follow these steps.

1. Sign in to the Azure portal and select the storage account you want to enable Microsoft Entra Kerberos authentication for.
1. Under **Data storage**, select **File shares**.
1. Next to **Identity-based access**, select the configuration status, such as **Not configured**.
 
   :::image type="content" source="media/storage-files-identity-auth-hybrid-identities-enable/configure-identity-based-access.png" alt-text="Screenshot of the Azure portal showing file share settings for a storage account." lightbox="media/storage-files-identity-auth-hybrid-identities-enable/configure-identity-based-access.png" border="true":::

1. Under **Microsoft Entra Kerberos**, select **Set up**.
1. Select the **Microsoft Entra Kerberos** checkbox.

   :::image type="content" source="media/storage-files-identity-auth-hybrid-identities-enable/enable-entra-kerberos.png" alt-text="Screenshot of the Azure portal showing identity-based access configuration settings for a storage account. Microsoft Entra Kerberos is selected." lightbox="media/storage-files-identity-auth-hybrid-identities-enable/enable-entra-kerberos.png" border="true":::

1. **Optional:** If you're authenticating hybrid identities and want to configure directory and file-level permissions through Windows File Explorer, specify the domain name and domain GUID for your on-premises AD. You can get this information from your domain admin or by running the following Active Directory PowerShell cmdlet from an on-premises AD-joined client: `Get-ADDomain`. Your domain name appears in the output under `DNSRoot` and your domain GUID appears under `ObjectGUID`. If you'd prefer to configure directory and file-level permissions by using icacls, you can skip this step. However, if you want to use icacls, the client needs unimpeded network connectivity to the on-premises AD. **Configuring directory and file-level permissions by using Windows File Explorer isn't currently supported for cloud-only identities (preview).**

1. Select **Save**.

# [Azure PowerShell](#tab/azure-powershell)

To enable Microsoft Entra Kerberos by using Azure PowerShell, run the following command. Replace placeholder values, including brackets, with your values.

```azurepowershell
Set-AzStorageAccount -ResourceGroupName <resourceGroupName> -StorageAccountName <storageAccountName> -EnableAzureActiveDirectoryKerberosForFile $true
```

**Optional:** If you're authenticating hybrid identities and you want to configure directory and file-level permissions through File Explorer, you also need to specify the domain name and domain GUID for your on-premises AD. If you'd prefer to configure directory and file-level permissions by using icacls, you can skip this step. However, if you want to use icacls, the client needs unimpeded network connectivity to the on-premises AD. **Configuring directory and file-level permissions by using File Explorer isn't currently supported for cloud-only identities (preview).**

You can get this information from your domain admin or by running the following Active Directory PowerShell cmdlets from an on-premises AD-joined client:

```PowerShell
$domainInformation = Get-ADDomain
$domainGuid = $domainInformation.ObjectGUID.ToString()
$domainName = $domainInformation.DnsRoot
```

To specify the domain name and domain GUID for your on-premises AD, run the following Azure PowerShell command. Replace placeholder values, including brackets, with your values.

```azurepowershell
Set-AzStorageAccount -ResourceGroupName <resourceGroupName> -StorageAccountName <storageAccountName> -EnableAzureActiveDirectoryKerberosForFile $true -ActiveDirectoryDomainName $domainName -ActiveDirectoryDomainGuid $domainGuid
```

# [Azure CLI](#tab/azure-cli)
  
To enable Microsoft Entra Kerberos by using Azure CLI, run the following command. Replace placeholder values, including brackets, with your values.

```azurecli
az storage account update --name <storageaccountname> --resource-group <resourcegroupname> --enable-files-aadkerb true
```

**Optional:** If you're authenticating hybrid identities and you want to configure directory and file-level permissions through File Explorer, you also need to specify the domain name and domain GUID for your on-premises AD. If you'd prefer to configure directory and file-level permissions by using icacls, you can skip this step. However, if you want to use icacls, the client needs unimpeded network connectivity to the on-premises AD. **Configuring directory and file-level permissions by using File Explorer isn't currently supported for cloud-only identities (preview).**

You can get this information from your domain admin or by running the following Active Directory PowerShell cmdlets from an on-premises AD-joined client:

```PowerShell
$domainInformation = Get-ADDomain
$domainGuid = $domainInformation.ObjectGUID.ToString()
$domainName = $domainInformation.DnsRoot
```

To specify the domain name and domain GUID for your on-premises Active Directory, run the following command. Replace placeholder values, including brackets, with your values.

```azurecli
az storage account update --name <storageAccountName> --resource-group <resourceGroupName> --enable-files-aadkerb true --domain-name <domainName> --domain-guid <domainGuid>
```

---

> [!WARNING]
> If you previously enabled Microsoft Entra Kerberos authentication through manual limited preview steps to store FSLogix profiles on Azure Files for Entra-joined VMs, the password for the storage account's service principal expires every six months. Once the password expires, users can't get Kerberos tickets to the file share. To mitigate this, see [Error - Service principal password has expired in Microsoft Entra ID](/troubleshoot/azure/azure-storage/files-troubleshoot-smb-authentication?toc=/azure/storage/files/toc.json#error---service-principal-password-has-expired-in-microsoft-entra-id).

## Grant admin consent to the new service principal

After enabling Microsoft Entra Kerberos authentication, grant admin consent to the new Entra application registered in your Entra tenant. This service principal is autogenerated and isn't used for authorization to the file share, so don't make any edits to the service principal other than those documented here. If you do, you might get an error.

You can configure the API permissions from the [Azure portal](https://portal.azure.com) by following these steps:

1. Open **Microsoft Entra ID**.
1. In the service menu, under **Manage**, select **App registrations**.
1. Select **All Applications**.
1. Select the application with the name matching **[Storage Account] `<your-storage-account-name>`.file.core.windows.net**.
1. In the service menu, under **Manage**, select **API permissions**.
1. Select **Grant admin consent for [Directory Name]** to grant consent for the three requested API permissions (openid, profile, and User.Read) for all accounts in the directory.
1. Select **Yes** to confirm.

If you're connecting to a storage account through a private endpoint or private link by using Microsoft Entra Kerberos authentication, add the private link FQDN to the storage account's Microsoft Entra application. For instructions, see the [troubleshooting guide](/troubleshoot/azure/azure-storage/files-troubleshoot-smb-authentication?toc=/azure/storage/files/toc.json#error-1326---the-username-or-password-is-incorrect-when-using-private-link).

## Enable cloud-only groups support (mandatory for cloud-only identities)

Kerberos tickets can include a maximum of 1,010 Security Identifiers (SIDs) for groups. Now that Microsoft Entra Kerberos supports Entra-only identities (preview), tickets must include both on-premises group SIDs and cloud group SIDs. If the combined group SIDs exceed 1,010, the Kerberos ticket can't be issued.

If you're using Microsoft Entra Kerberos to authenticate cloud-only identities, update the Tags in your application manifest file, or authentication fails.  

Follow [these instructions](/entra/identity/authentication/kerberos#group-sid-limit-in-entra-kerberos-preview) to update the tag in your application manifest.

## Disable multifactor authentication on the storage account

Microsoft Entra Kerberos doesn't support using MFA to access Azure file shares configured with Microsoft Entra Kerberos. You must exclude the Microsoft Entra app representing your storage account from your MFA conditional access policies if they apply to all apps.

The storage account app should have the same name as the storage account in the conditional access exclusion list. When searching for the storage account app in the conditional access exclusion list, search for: **[Storage Account] `<your-storage-account-name>`.file.core.windows.net**

Replace `<your-storage-account-name>` with the proper value.

  > [!IMPORTANT]
  > If you don't exclude MFA policies from the storage account app, you can't access the file share. Trying to map the file share by using `net use` results in an error message that says "System error 1327: Account restrictions are preventing this user from signing in. For example: blank passwords aren't allowed, sign-in times are limited, or a policy restriction has been enforced."

For guidance on disabling MFA, see the following articles:

- [Add exclusions for service principals of Azure resources](/entra/identity/conditional-access/policy-all-users-mfa-strength#user-exclusions)
- [Create a conditional access policy](/entra/identity/conditional-access/policy-all-users-mfa-strength#create-a-conditional-access-policy)

## Assign share-level permissions

When you enable identity-based access, for each share you must assign which users and groups have access to that particular share. Once a user or group is allowed access to a share, Windows ACLs (also called NTFS permissions) on individual files and directories take over. This permission system allows for fine-grained control over permissions, similar to an SMB share on a Windows Server.

To set share-level permissions, follow the instructions in [Assign share-level permissions to an identity](storage-files-identity-assign-share-level-permissions.md). Cloud-only identities can only be assigned a [default share-level permission](storage-files-identity-assign-share-level-permissions.md#share-level-permissions-for-all-authenticated-identities) that applies to all authenticated identities.

## Configure directory and file-level permissions

Once share-level permissions are in place, you can assign Windows ACLs (directory and file-level permissions) to the user or group. **For hybrid identities, this assignment requires using a device with unimpeded network connectivity to an Active Directory**.

To configure directory and file-level permissions, follow the instructions in [Configure directory and file-level permissions over SMB](storage-files-identity-configure-file-level-permissions.md).

## Configure the clients to retrieve Kerberos tickets

Enable the Entra Kerberos functionality on the client machines you want to use to mount Azure Files shares. You must enable this functionality on every client that uses Azure Files.

Use one of the following three methods:

# [Intune](#tab/intune)

Configure this Intune [Policy CSP](/windows/client-management/mdm/policy-configuration-service-provider) and apply it to the client(s): [Kerberos/CloudKerberosTicketRetrievalEnabled](/windows/client-management/mdm/policy-csp-kerberos#cloudkerberosticketretrievalenabled), set to 1

> [!NOTE]
> When configuring **CloudKerberosTicketRetrievalEnabled** through Intune, use the **Settings Catalog** instead of the OMA-URI method. The OMA-URI method doesn't work on Azure Virtual Desktop multisession devices. Azure Virtual Desktop multisession is a common deployment scenario for Entra Kerberos with hybrid identities, including configurations involving Entra ID Join, FSLogix, and Azure Files.

# [Group Policy](#tab/gpo)

Configure this group policy on the clients to "Enabled": `Administrative Templates\System\Kerberos\Allow retrieving the Azure AD Kerberos Ticket Granting Ticket during logon`

On older versions of Windows, this setting appears as: `Administrative Templates\System\Kerberos\Allow retrieving the cloud Kerberos ticket during the logon`

This setting allows the client to retrieve a cloud-based Kerberos Ticket Granting Ticket (TGT) during user logon.

# [Registry Key](#tab/regkey)

Set the following registry value on the clients by running this command from an elevated command prompt:

```console
reg add HKLM\SYSTEM\CurrentControlSet\Control\Lsa\Kerberos\Parameters /v CloudKerberosTicketRetrievalEnabled /t REG_DWORD /d 1
```

---

Changes aren't instant, and require a policy refresh or a reboot to take effect.

> [!IMPORTANT]
> After you apply this change, the clients can't connect to storage accounts that are configured for on-premises AD DS integration without configuring Kerberos realm mappings. If you want the clients to connect to storage accounts configured for AD DS as well as storage accounts configured for Microsoft Entra Kerberos, follow the steps in [Configure coexistence with storage accounts using on-premises AD DS](#configure-coexistence-with-storage-accounts-using-on-premises-ad-ds).

### Configure coexistence with storage accounts using on-premises AD DS

To enable client machines to connect to storage accounts that are configured for AD DS as well as storage accounts configured for Microsoft Entra Kerberos, follow these steps. If you're only using Microsoft Entra Kerberos, skip this section.

Add an entry for each storage account that uses on-premises AD DS integration. Use one of the following three methods to configure Kerberos realm mappings. Changes aren't instant, and require a policy refresh or a reboot to take effect.

# [Intune](#tab/intune)

Configure this Intune [Policy CSP](/windows/client-management/mdm/policy-configuration-service-provider) and apply it to the clients: [Kerberos/HostToRealm](/windows/client-management/mdm/policy-csp-admx-kerberos#hosttorealm)

# [Group Policy](#tab/gpo)

Configure this Group Policy on the clients: `Administrative Templates\System\Kerberos\Define host name-to-Kerberos realm mappings`

- Set the policy to `Enabled`.
- Select the `Show...` button to define the list of host name-to-realm mappings. For each storage account configured for AD DS, add an entry where:
  - `Value` is the AD DS-enabled storage account's host name, such as `<your storage account name>.file.core.windows.net`
  - `Value name` is the AD DS realm name

# [Registry Key](#tab/regkey)

Run the following `ksetup` Windows command on the clients:

```console
ksetup /addhosttorealmmap <hostname> <REALMNAME>
```

For example, if your realm is `CONTOSO.LOCAL`, run `ksetup /addhosttorealmmap <your storage account name>.file.core.windows.net CONTOSO.LOCAL`

---

> [!IMPORTANT]
> In Kerberos, realm names are case sensitive and uppercase. Your Kerberos realm name is usually the same as your domain name, in uppercase letters.

## Undo the client configuration to retrieve Kerberos tickets

If you no longer want to use a client machine for Microsoft Entra Kerberos authentication, you can disable the Microsoft Entra Kerberos functionality on that machine. Use one of the following three methods, depending on how you enabled the functionality:

# [Intune](#tab/intune)

Configure this Intune [Policy CSP](/windows/client-management/mdm/policy-configuration-service-provider) and apply it to the clients: [Kerberos/CloudKerberosTicketRetrievalEnabled](/windows/client-management/mdm/policy-csp-kerberos#kerberos-cloudkerberosticketretrievalenabled), set to 0

# [Group Policy](#tab/gpo)

Set this Group Policy on the clients to **Disabled**: `Administrative Templates\System\Kerberos\Allow retrieving the Azure AD Kerberos Ticket Granting Ticket during logon`

# [Registry Key](#tab/regkey)

Set the following registry value on the clients by running this command from an elevated command prompt:

```console
reg add HKLM\SYSTEM\CurrentControlSet\Control\Lsa\Kerberos\Parameters /v CloudKerberosTicketRetrievalEnabled /t REG_DWORD /d 0
```

---

Changes aren't instant, and require a policy refresh or a reboot to take effect.

If you followed the steps in [Configure coexistence with storage accounts using on-premises AD DS](#configure-coexistence-with-storage-accounts-using-on-premises-ad-ds), you can optionally remove all host name to Kerberos realm mappings from the client machine. Use one of the following three methods:

# [Intune](#tab/intune)

Configure this Intune [Policy CSP](/windows/client-management/mdm/policy-configuration-service-provider) and apply it to the clients: [Kerberos/HostToRealm](/windows/client-management/mdm/policy-csp-admx-kerberos#hosttorealm)

# [Group Policy](#tab/gpo)

Configure this Group Policy on the clients: `Administrative Templates\System\Kerberos\Define host name-to-Kerberos realm mappings`

# [Registry Key](#tab/regkey)

Run the following `ksetup` Windows command on the clients:

```console
ksetup /delhosttorealmmap <hostname> <realmname>
```

For example, if your realm is `CONTOSO.LOCAL`, run `ksetup /delhosttorealmmap <your storage account name>.file.core.windows.net CONTOSO.LOCAL`.

You can view the list of current host name to Kerberos realm mappings by inspecting the registry key `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa\Kerberos\HostToRealm`.

---

Changes aren't instant, and require a policy refresh or a reboot to take effect.

> [!IMPORTANT]
> After you apply this change, the clients can't connect to storage accounts that are configured for Microsoft Entra Kerberos authentication. However, they can connect to storage accounts configured to AD DS, without any additional configuration.

<a name='disable-azure-ad-authentication-on-your-storage-account'></a>

## Disable Microsoft Entra authentication on your storage account

If you want to use another authentication method, you can disable Microsoft Entra authentication on your storage account by using the Azure portal, Azure PowerShell, or Azure CLI.

> [!NOTE]
> If you disable this feature, there won't be any identity-based access for file shares in your storage account until you enable and configure one of the other identity sources.

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

If needed, run the `Debug-AzStorageAccountAuth` cmdlet to conduct a set of basic checks on your Microsoft Entra ID configuration with the signed in Entra ID user. The Entra checks that are part of this cmdlet are supported on the [AzFilesHybrid PowerShell module](https://www.powershellgallery.com/packages/AzFilesHybrid/) beginning with version 0.3.0+. This cmdlet works for Microsoft Entra Kerberos and AD DS authentication but doesn't work for Microsoft Entra Domain Services enabled storage accounts. For more information on the checks performed in this cmdlet, see [Unable to mount Azure file shares with Microsoft Entra Kerberos](/troubleshoot/azure/azure-storage/files/security/files-troubleshoot-smb-authentication?tabs=azure-portal#unable-to-mount-azure-file-shares-with-microsoft-entra-kerberos).

## Next steps

- [Mount an SMB Azure file share](storage-how-to-use-files-windows.md)
- [Potential errors when enabling Microsoft Entra Kerberos authentication](/troubleshoot/azure/azure-storage/files/security/files-troubleshoot-smb-authentication?tabs=azure-portal#potential-errors-when-enabling-microsoft-entra-kerberos-authentication)
- [Store FSLogix profile containers on Azure Files using Microsoft Entra ID](/fslogix/how-to-configure-profile-container-entra-id-hybrid)
