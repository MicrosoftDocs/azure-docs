---
title: Create an Azure file share with Azure Active Directory
description: Set up an FSLogix profile container on an Azure file share in an existing Azure Virtual Desktop host pool with your Azure Active Directory domain.
services: virtual-desktop
author: Heidilohr
manager: femila

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 11/17/2021
ms.author: helohr
---
# Create a profile container with Azure Files and Azure Active Directory

> [!IMPORTANT]
> Storing FSLogix profiles on Azure Files for Azure Active Directory (AD)-joined VMs is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, you'll learn how to create an Azure Files share to store FSLogix profiles that can be accessed by hybrid user identities authenticated with Azure Active Directory (AD). An Azure AD user can now access an Azure file share using Kerberos authentication. This configuration uses Azure AD to issue the necessary Kerberos tickets to access the file share with the industry-standard SMB protocol. Your end-users can access Azure file shares over the internet without requiring a line-of-sight to domain controllers from Hybrid Azure AD-joined and Azure AD-joined VMs.

This article describes how to configure Azure Files stored FSLogix user profiles for authentication using Azure AD.

## Prerequisites

The Azure AD Kerberos functionality is only available on the following OSes:

  - Windows 11 ENT single or multi session.
  - Windows 10 ENT single or multi session, version 2004 or later with the latest cumulative update installed including [KB5006670 - 2021-10 Cumulative Update for Windows 10 version 2004](https://support.microsoft.com/topic/october-12-2021-kb5006670-os-builds-19041-1288-19042-1288-and-19043-1288-8902fc49-af79-4b1a-99c4-f74ca886cd95).
  - Windows Server 2022 with the latest cumulative update installed including [KB5006699 - 2021-10 Cumulative Update for Microsoft server operating system version 21H2](https://support.microsoft.com/topic/october-12-2021-kb5006699-os-build-20348-288-e0583b84-7957-4d8e-aba0-15131d1ef8a4).

The user accounts must be [hybrid user identities](../active-directory/hybrid/whatis-hybrid-identity.md), which means you'll also need AD DS and Azure AD Connect. These accounts must be created in Active Directory and synced to Azure AD.

To assign Azure Role-Based Access Control (RBAC) permissions for the Azure file share to a user group, the group must also be created in Active Directory and synced to Azure AD.


> [!IMPORTANT]
> This feature is currently only supported in the Azure Public cloud.

## Set up Azure Files

Start by [creating an Azure Storage account](../storage/files/storage-how-to-create-file-share.md#create-a-storage-account) if you don't already have one.

> [!NOTE]
> Your Azure Storage account can't authenticate with both Azure AD and a second method like Active Directory Domain Services (AD DS) or Azure AD DS. You can only use one authentication method.

Follow the instructions in the following sections to set up Azure Files. To set up Azure Files, you'll need to configure your Azure Storage account to authenticate with Azure AD, create a file share for the FSLogix profiles, and configure access permissions.

### Configure your Azure Storage account

- Install the Azure Storage PowerShell module. This module provides management cmdlets for Azure Storage resources. It's required to create storage accounts, enable Azure AD authentication on the storage account, and retrieve the storage account’s Kerberos keys. To install the module, open PowerShell and run the following command:

    ```powershell
    Install-Module -Name Az.Storage
    ```

- Install the Azure AD PowerShell module. This module provides management cmdlets for Azure AD administrative tasks such as user and service principal management. To install this module, open PowerShell, then run the following command:

    ```powershell
    Install-Module -Name AzureAD
    ```

    For more information, see [Install the Azure AD PowerShell module](/powershell/azure/active-directory/install-adv2).

- Set variables for both storage account name and resource group name by running the following PowerShell cmdlets, replacing the values with the ones relevant to your environment. The cmdlets below uses these variables to configure the storage account.

    ```powershell
    $resourceGroupName = "<MyResourceGroup>"
    $storageAccountName = "<MyStorageAccount>"
    ```
 
- Enable Azure AD authentication on your storage account by running the following PowerShell cmdlets:

    ```powershell
    Connect-AzAccount
    $Subscription =  $(Get-AzContext).Subscription.Id;
    $ApiVersion = '2021-04-01'

    $Uri = ('https://management.azure.com/subscriptions/{0}/resourceGroups/{1}/providers/Microsoft.Storage/storageAccounts/{2}?api-version={3}' -f $Subscription, $ResourceGroupName, $StorageAccountName, $ApiVersion);
    
    $json = 
       @{properties=@{azureFilesIdentityBasedAuthentication=@{directoryServiceOptions="AADKERB"}}};
    $json = $json | ConvertTo-Json -Depth 99

    $token = $(Get-AzAccessToken).Token
    $headers = @{ Authorization="Bearer $token" }

    try {
        Invoke-RestMethod -Uri $Uri -ContentType 'application/json' -Method PATCH -Headers $Headers -Body $json;
    } catch {
        Write-Host $_.Exception.ToString()
        Write-Error -Message "Caught exception setting Storage Account directoryServiceOptions=AADKERB: $_" -ErrorAction Stop
    } 
    ```

- Generate the kerb1 storage account key for your storage account by running the following PowerShell command:

    ```powershell
    New-AzStorageAccountKey -ResourceGroupName $resourceGroupName -Name $storageAccountName -KeyName kerb1 -ErrorAction Stop 
    ```

### Configure the Azure AD service principal and application

To enable Azure AD authentication on a storage account, you need to create an Azure AD application to represent the storage account in Azure AD. During the preview, this configuration is not available in the Azure portal. To create the application using PowerShell, follow these steps:

- Set the password (service principal secret) based on the Kerberos key of the storage account. The Kerberos key is a password shared between Azure AD and Azure Storage. Kerberos derives its value as the first 32 bytes of the storage account’s kerb1 key. To set the password, run the following cmdlets:

    ```powershell
    $kerbKey1 = Get-AzStorageAccountKey -ResourceGroupName $resourceGroupName -Name $storageAccountName -ListKerbKey | Where-Object { $_.KeyName -like "kerb1" }
    $aadPasswordBuffer = [System.Linq.Enumerable]::Take([System.Convert]::FromBase64String($kerbKey1.Value), 32);
    $password = "kk:" + [System.Convert]::ToBase64String($aadPasswordBuffer);
    ```

- Connect to Azure AD and retrieve the tenant information by running the following cmdlets:

    ```powershell
    Connect-AzureAD
    $azureAdTenantDetail = Get-AzureADTenantDetail;
    $azureAdTenantId = $azureAdTenantDetail.ObjectId
    $azureAdPrimaryDomain = ($azureAdTenantDetail.VerifiedDomains | Where-Object {$_._Default -eq $true}).Name
    ```

- Generate the service principal names for the Azure AD service principal by running these cmdlets:

    ```powershell
    $servicePrincipalNames = New-Object string[] 3
    $servicePrincipalNames[0] = 'HTTP/{0}.file.core.windows.net' -f $storageAccountName
    $servicePrincipalNames[1] = 'CIFS/{0}.file.core.windows.net' -f $storageAccountName
    $servicePrincipalNames[2] = 'HOST/{0}.file.core.windows.net' -f $storageAccountName
    ```

- Create an application for the storage account by running this cmdlet:

    ```powershell
    $application = New-AzureADApplication -DisplayName $storageAccountName -IdentifierUris $servicePrincipalNames -GroupMembershipClaims "All";
    ```

- Create a service principal for the storage account by running this cmdlet:

    ```powershell
    $servicePrincipal = New-AzureADServicePrincipal -AccountEnabled $true -AppId $application.AppId -ServicePrincipalType "Application";
    ```

- Set the password for the storage account's service principal by running the following cmdlets.

    ```powershell
    $Token = ([Microsoft.Open.Azure.AD.CommonLibrary.AzureSession]::AccessTokens['AccessToken']).AccessToken
    $apiVersion = '1.6'
    $Uri = ('https://graph.windows.net/{0}/{1}/{2}?api-version={3}' -f $azureAdPrimaryDomain, 'servicePrincipals', $servicePrincipal.ObjectId, $apiVersion)
    $json = @'
    {
      "passwordCredentials": [
      {
        "customKeyIdentifier": null,
        "endDate": "<STORAGEACCOUNTENDDATE>",
        "value": "<STORAGEACCOUNTPASSWORD>",
        "startDate": "<STORAGEACCOUNTSTARTDATE>"
      }]
    }
    '@
    $now = [DateTime]::UtcNow
    $json = $json -replace "<STORAGEACCOUNTSTARTDATE>", $now.AddDays(-1).ToString("s")
	$json = $json -replace "<STORAGEACCOUNTENDDATE>", $now.AddMonths(12).ToString("s")
    $json = $json -replace "<STORAGEACCOUNTPASSWORD>", $password
    $Headers = @{'authorization' = "Bearer $($Token)"}
    try {
      Invoke-RestMethod -Uri $Uri -ContentType 'application/json' -Method Patch -Headers $Headers -Body $json 
      Write-Host "Success: Password is set for $storageAccountName"
    } catch {
      Write-Host $_.Exception.ToString()
      Write-Host "StatusCode: " $_.Exception.Response.StatusCode.value
      Write-Host "StatusDescription: " $_.Exception.Response.StatusDescription
    }
    ```

### Set the API permissions on the newly created application

You can configure the API permissions from the [Azure portal](https://portal.azure.com) by following these steps:

1. Open **Azure Active Directory**.
2. Select **App registrations** on the left pane.
3. Select **All Applications**.
4. Select the application with the name matching your storage account.
5. Select **API permissions** in the left pane.
6. Select **+ Add a permission**.
7. Select **Microsoft Graph** at the top of the page.
8. Select **Delegated permissions**.
9. Select **openid** and **profile** under the **OpenID** permissions group.
10. Select **User.Read** under the **User** permission group.
11. Select **Add permissions** at the bottom of the page.
12. Select **Grant admin consent for "DirectoryName"**.

### Create a file share and configure share-level permissions

Your FSLogix profiles will be stored in a file share under your storage account. This section explains how to create the file share and configure its permissions to provide the right level of access to users.

1. Start by [creating a file share](../storage/files/storage-how-to-create-file-share.md#create-a-file-share) under your storage account.
    
2. You must grant your users access to the file share before they can use it. There are two ways you can assign share-level permissions: either assign them to specific Azure AD users or user groups, or you can assign them to all authenticated identities as a default share-level permission. To learn more about assigning share-level permissions, see [Assign share-level permissions to an identity](../storage/files/storage-files-identity-ad-ds-assign-permissions.md). All users that need to have FSLogix profiles stored on the storage account you're using must be assigned the **Storage File Data SMB Share Contributor** role.

    > [!IMPORTANT]
    > Azure Virtual Desktop currently only supports assigning specific permissions to hybrid users and user groups. Users and user groups must be managed in Active Directory and synced to Azure AD using Azure AD Connect.

### Assign directory level access permissions

To prevent users from accessing the user profile of other users, you must also assign directory and file-level permissions. This section provides the steps to configure the permissions. Learn more about the recommended list of permissions for FSLogix profiles at [Configure the storage permissions for profile containers](/fslogix/fslogix-storage-config-ht)

> [!IMPORTANT]
> Without proper directory level permissions in place, a user could delete the user profile or access the personal information of a different user.

To configure the permissions on the file share, sign-in to a PC or VM joined to the same Azure AD tenant as the storage account running one of the supported OSes defined in the [Prerequisites](#prerequisites) section. Enable the Azure AD Kerberos functionality by configuring the group policy or registry value listed below before restarting the system:

Group policy:

```
Administrative Templates\System\Kerberos\Allow retrieving the Azure AD Kerberos Ticket Granting Ticket during logon
```

Registry value:

```
reg add HKLM\SYSTEM\CurrentControlSet\Control\Lsa\Kerberos\Parameters /v CloudKerberosTicketRetrievalEnabled /t REG_DWORD /d 1
```

After the restart, confirm that Azure Files has been configured properly using the steps below:

1. ADFGLHADFLgKLHDFGHADFKLgHKL

```
net use <DriveLetter>: \\<storage-account-name>.file.core.windows.net\<fIle-share-name>
```
You can configure the directory level permissions using Windows Explorer if your device has line-of-sight to the domain controller. Otherwise, you can configure the permissions using the ICACL tool.

To configure the permissions using Windows Explorer:

1. Step 1

To configure the permissions using ICACL:

1. Step 1

3. We recommend you [configure the Windows ACLs](../storage/files/storage-files-identity-ad-ds-configure-permissions.md) for the directory where the profiles will be stored.


## Configure the session hosts

To access Azure file shares from an Azure AD-joined VM for FSLogix profiles, you must configure the session hosts. To configure session hosts:

1. By default, session hosts can't retrieve Kerberos tickets from Azure AD unless you enable this feature on the VMs through a group policy or registry value. The policy to enable is:

    ```
    Administrative Templates\System\Kerberos\Allow retrieving the Azure AD Kerberos Ticket Granting Ticket during logon
    ```

    You can also set the following registry value to enable the feature:

    ```
    reg add HKLM\SYSTEM\CurrentControlSet\Control\Lsa\Kerberos\Parameters /v CloudKerberosTicketRetrievalEnabled /t REG_DWORD /d 1
    ```

2. When you use Azure AD with a roaming profile solution like FSLogix, the credential keys in Credential Manager must belong to the profile that's currently loading. This will let you load your profile on many different VMs instead of being limited to just one. To enable this setting, create a new registry value by running the following command:

    ```
    reg add HKLM\Software\Policies\Microsoft\AzureADAccount /v LoadCredKeyFromProfile /t REG_DWORD /d 1
    ```

> [!NOTE]
> The session hosts don't need network line-of-sight to the domain controller.

### Configure FSLogix on the session host

This section will show you how to configure a VM with FSLogix. You'll need to follow these instructions every time you configure a session host. There are several options available that ensure the registry keys are set on all session hosts. You can set these options in an image or configure a group policy.

To configure FSLogix:

1. [Update or install FSLogix](/fslogix/install-ht) on your session host, if needed.

2. Follow the instructions in [Configure profile container registry settings](/fslogix/configure-profile-container-tutorial#configure-profile-container-registry-settings) to create the **Enabled** and **VHDLocations** registry values. Set the value of **VHDLocations** to `\\<Storage-account-name>.file.core.windows.net\<file-share-name>`.

## Test your deployment

Once you've installed and configured FSLogix, you can test your deployment by signing in with a user account that's been assigned to an application group on the host pool. The user account you sign in with must have permission to use the file share.

If the user has signed in before, they'll have an existing local profile that the service will use during this session. To avoid creating a local profile, either create a new user account to use for tests or use the configuration methods described in [Tutorial: Configure profile container to redirect user profiles](/fslogix/configure-profile-container-tutorial/) to enable the *DeleteLocalProfileWhenVHDShouldApply* setting.

Finally, test the profile to make sure that it works:

1. Open the Azure portal and sign in with an administrative account.

2. From the sidebar, select **Storage accounts**.

3. Select the storage account you configured for your session host pool.

4. From the sidebar, select **File shares**.

5. Select the file share you configured to store the profiles.

6. If everything's set up correctly, you should see a directory with a name that's formatted like this: `<user SID>_<username>`.

## Next steps

To troubleshoot FSLogix, see [this troubleshooting guide](/fslogix/fslogix-trouble-shooting-ht).
To configure FSLogix profiles on Azure Files with Azure Active Directory Domain Services, see [Create a profile container with Azure Files and Azure AD DS](create-profile-container-adds.md).
To configure FSLogix profiles on Azure Files with Active Directory Domain Services, see [Create a profile container with Azure Files and AD DS](create-file-share.md).
