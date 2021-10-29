---
title: Create an Azure file share with Azure Active Directory - Azure
description: Set up an FSLogix profile container on an Azure file share in an existing Azure Virtual Desktop host pool with your Azure Active Directory domain.
services: virtual-desktop
author: Heidilohr
manager: femila

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 11/16/2021
ms.author: helohr
---
# Create a profile container with Azure Files and Azure Active Directory

> [!IMPORTANT]
> Storing FSLogix profiles on Azure Files for Azure Active Directory (AD)-joined VMs is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, you'll learn how to create an Azure file share to store FSLogix profiles that can be accessed by hybrid user identities authenticated via Azure AD. An Azure AD user can now access a file share that requires Kerberos authentication. This configuration uses Azure AD to issue the necessary Kerberos tickets to access the file share with the industry-standard SMB protocol. Your end-users can access Azure file shares over the internet without requiring a line-of-sight to domain controllers from Hybrid Azure AD-joined and Azure AD-joined VMs.

This article describes how to configure Azure Files user profiles for authentication using Azure AD. You can also configure Azure Files for authentication with [Azure Active Directory Domain Services (AD DS)](create-profile-container-adds.md) or with [Active Directory Domain Services](create-file-share.md).

## Prerequisites

- The session host VMs must be using one of the following:
    - Windows 11 ENT single or multi session.
    - Windows 10 ENT single or multi session, version 2004 or later with the latest cumulative update installed including [KB5006670 - 2021-10 Cumulative Update for Windows 10 version 2004](https://support.microsoft.com/topic/october-12-2021-kb5006670-os-builds-19041-1288-19042-1288-and-19043-1288-8902fc49-af79-4b1a-99c4-f74ca886cd95).
    - Windows Serer 2022 with the latest cumulative update installed including [KB5006699 - 2021-10 Cumulative Update for Microsoft server operating system version 21H2](https://support.microsoft.com/topic/october-12-2021-kb5006699-os-build-20348-288-e0583b84-7957-4d8e-aba0-15131d1ef8a4).
- The user accounts must be [hybrid user identities](../active-directory/hybrid/whatis-hybrid-identity.md), which means you'll also need AD DS and Azure AD Connect.

> [!IMPORTANT]
> - This feature is currently only supported in the Azure Public cloud.

## Set up Azure Files

Follow the steps below to configure your Azure Storage account for authentication with Azure AD, create a file share for the FSLogix profiles and configure the right access permissions.

### Create an Azure Storage account

Set up an Azure Storage account if you don't already have one.

> [!NOTE]
> A storage account cannot be configured to authenticate with both Azure AD and a second method like AD DS or Azure AD DS.

1. Install the Azure Storage PowerShell module.

    This module provides management cmdlets for Azure Storage resources. It's required to create storage accounts, enable Azure AD authentication on the storage account, and retrieve the storage account’s Kerberos keys. In PowerShell, run the following command:

    ```powershell
    Install-Module -Name Az.Storage
    ```

2. Install the Azure AD PowerShell module.

    This module provides management cmdlets for Azure AD administrative tasks such as user and service principal management. In PowerShell, run the following command:

    ```powershell
    Install-Module -Name AzureAD
    ```

    For more information, see [Install the Azure AD PowerShell module](/powershell/azure/active-directory/install-adv2).

3. Set variables for both storage account name and resource group name by running the following PowerShell cmdlets, replacing the values with your own. These will be used to create the storage account if needed and configure it.

    ```powershell
    $resourceGroupName = "<MyResourceGroup>"
    $storageAccountName = "<MyStorageAccount>"
    ```
 
4. Create a new storage account if needed through the [Azure portal](../storage/common/storage-account-create?tabs=azure-portal) or in PowerShell by using the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) cmdlet:
 
    ```powershell
    Connect-AzAccount
    New-AzStorageAccount -ResourceGroupName $resourceGroupName -StorageAccountName $storageAccountName -SkuName <SKU name> -Location <location>
    ```

5. Enable Azure AD authentication on your storage account by running the following PowerShell cmdlet:

    ```powershell
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

6. Generate the kerb1 storage account key for your storage account by running the following PowerShell command:

    ```powershell
    New-AzStorageAccountKey -ResourceGroupName $resourceGroupName -Name $storageAccountName -KeyName kerb1 -ErrorAction Stop 
    ```

7. Validate your environment can connect to Azure Files over SMB. TODO TODO Add steps to verify!

### Configure the Azure AD service principal and application

To enable Azure AD authentication on a storage account, you need to create an Azure AD Application to represent the storage account in Azure AD. This can be done with a set of PowerShell commands from both the Azure Storage and Azure AD modules.

1. Set the password (service principal secret) based on the Kerberos key of the storage account. The Kerberos key is a password shared between Azure AD and Azure Storage. Kerberos derives its value as the first 32 bytes of the storage account’s kerb1 key. To set the password, run the following cmdlets:

    ```powershell
    $kerbKey1 = Get-AzStorageAccountKey -ResourceGroupName $resourceGroupName -Name $storageAccountName -ListKerbKey | Where-Object { $_.KeyName -like "kerb1" }
    $aadPasswordBuffer = [System.Linq.Enumerable]::Take([System.Convert]::FromBase64String($kerbKey1.Value), 32);
    $password = "kk:" + [System.Convert]::ToBase64String($aadPasswordBuffer);
    ```

2. Connect to Azure AD and retrieve the tenant information by running the following cmdlets:

    ```powershell
    Connect-AzureAD
    $azureAdTenantDetail = Get-AzureADTenantDetail;
    $azureAdTenantId = $azureAdTenantDetail.ObjectId
    $azureAdPrimaryDomain = ($azureAdTenantDetail.VerifiedDomains | Where-Object {$_._Default -eq $true}).Name
    ```

3. Generate the service principal names for the Azure AD service principal by running these cmdlets:

    ```powershell
    $servicePrincipalNames = New-Object string[] 3
    $servicePrincipalNames[0] = 'HTTP/{0}.file.core.windows.net' -f $storageAccountName
    $servicePrincipalNames[1] = 'CIFS/{0}.file.core.windows.net' -f $storageAccountName
    $servicePrincipalNames[2] = 'HOST/{0}.file.core.windows.net' -f $storageAccountName
    ```

4. Create an application for the storage account by running this cmdlet:

    ```powershell
    $application = New-AzureADApplication -DisplayName $storageAccountName -IdentifierUris $servicePrincipalNames -GroupMembershipClaims "All";
    ```

5. Create a service principal for the storage account by running this cmdlet:

    ```powershell
    $servicePrincipal = New-AzureADServicePrincipal -AccountEnabled $true -AppId $application.AppId -ServicePrincipalType "Application";
    ```

6. Set the password for the storage account's service principal by running the following cmdlets. The *$password* value is taken from step 1.

    ```powershell
    $Token = ([Microsoft.Open.Azure.AD.CommonLibrary.AzureSession]::AccessTokens['AccessToken']).AccessToken
    $apiVersion = '1.6'
    $Uri = ('https://graph.windows.net/{0}/{1}/{2}?api-version={3}' -f $azureAdPrimaryDomain, 'servicePrincipals', $servicePrincipal.ObjectId, $apiVersion)
    $json = @'
    {
      "passwordCredentials": [
      {
        "customKeyIdentifier": null,
        "endDate": "2022-07-30T20:00:00.3058279Z",
        "value": "<STORAGEACCOUNTPASSWORD>",
        "startDate": "2021-11-01T20:00:00.3058279Z"
      }]
    }
    '@
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

7. Set the API permissions on the newly created application.

    - Go to the Azure portal.
    - Navigate to **Azure Active Directory**.
    - Select **App registrations** on the left pane.
    - Select **All Applications**.
    - Select the application with the name matching your storage account.
    - Select **API permissions** in the left pane.
    - Select **+ Add a permission**.
    - Select **Microsoft Graph** at the top of the page.
    - Select **Delegated permissions**.
    - Select **openid** and **profile** under the **OpenID** permissions group.
    - Select **User.Read** under the **User** permission group.
    - Select **Add permissions** at the bottom of the page.
    - Select **Grant admin consent for "StorageAccountName"**.

### Create a file share and configure the access permissions

Your FSLogix profiles will be stored in a file share under your storage account. This section explains how to create the file share and configuration its permissions to provide the right level of access to user.

1. Create a file share under the storage account through the [Azure portal](../storage/files/storage-how-to-use-files-portal.md) or in PowerShell by running this cmdlet:

    ```powershell
    New-AzRmStorageShare -StorageAccount $storageAccountName -Name "<your-share-name-here>" -QuotaGiB 1024 | Out-Null
    ```
    
2. You must grant your users access to the file share before they can use it. There are two ways you can assign share-level permissions: either assign them to specific Azure AD users or user groups, or you can assign them to all authenticated identities as a default share-level permission. To learn more about assigning share-level permissions, see [Assign share-level permissions to an identity](../storage/files/storage-files-identity-ad-ds-assign-permissions.md). All users that need to have FSLogix profiles stored on the storage account you're using must be assigned the **Storage File Data SMB Share Contributor** role.

    > [!IMPORTANT]
    > Assigning specific permissions to users and user groups is currently only supported with hybrid users and groups. The users and groups must be managed in Active Directory and synced to Azure AD using Azure AD Connect.

3. You must also assign directory and file-level permissions to ensure users cannot access other user's profile. We recommend you [configure the Windows ACLs](../storage/files/storage-files-identity-ad-ds-configure-permissions.md) for the directory where the profiles will be stored. Learn more about the recommended list of permissions for FSLogix profiles at [Configure the storage permissions for profile containers](/fslogix/fslogix-storage-config-ht).

## Session host configuration

To access Azure file shares from an Azure AD-joined VM for FSLogix profiles, you must configure the session hosts.

1. By default, session hosts can't retrieve a Kerberos token from Azure AD unless you enable this feature on the VMs by changing the **Administrative Templates\System\Kerberos\Allow retrieving the Azure AD Kerberos Ticket Granting Ticket during logon** policy. When you enable this policy, you can stage this feature by choosing the VMs you want to test your deployment on. After your test, you can expand the deployment to all the VMs across your environment.

2. When you use Azure AD with a roaming profile solution like FSLogix, the credential keys in Credential Manager must belong to the profile that's currently loading. This will let you load your profile on many different VMs instead of being limited to just one. To enable this setting, create a new registry value by running the following command:

    ```
    reg add HKLM\Software\Policies\Microsoft\AzureADAccount /v LoadCredKeyFromProfile /t REG_DWORD /d 1
    ```

> [!NOTE]
> The session hosts don't need network line-of-sight to the domain controller.

### Configure FSLogix on the session host

This section will show you how to configure a VM with FSLogix. You'll need to follow these instructions every time you configure a session host. There are several options available that ensure the registry keys are set on all session hosts. You can set these options in an image or configure a group policy.

First, you'll need to get the Universal Naming Convention (UNC) path of the file share storing the user profiles. To get the UNC path:

1. Open the Azure portal.

2. In the Azure portal, open the storage account you created and select the file share you want to get the UNC path for.

3. Select **Properties** under the Settings header in the left panel.

4. Copy the **URL** to the text editor of your choice.

5. After copying the URL, do the following things to change it into the UNC:

    - Remove `https://` and replace with `\\`
    - Replace the forward slash `/` with a back slash `\`.
    - The resulting UNC path should follow this format: `\\customdomain.file.core.windows.net\<fileshare-name>`

After you've got the UNC path, you'll need to configure FSLogix on your Azure AD-joined session host VM. To configure FSLogix:

1. [Update or install FSLogix](/fslogix/install-ht) on the session host if needed.

2. Follow the instructions in [Configure profile container registry settings](/fslogix/configure-profile-container-tutorial#configure-profile-container-registry-settings) to create the **Profiles** and **VHDLocations** registry values. Set the value of **VHDLocations** to the UNC path you generated at the beginning of this section.

## Testing

Once you've installed and configured FSLogix, you can test your deployment by signing in with a user account that's been assigned to an application group on the host pool. Make sure the user account you sign in with has permission to use the file share.

If the user has signed in before, they'll have an existing local profile that will be used during this session. To avoid creating a local profile, either create a new user account to use for tests or use the configuration methods described in [Tutorial: Configure profile container to redirect user profiles](/fslogix/configure-profile-container-tutorial/) to enable the *DeleteLocalProfileWhenVHDShouldApply* setting.

Finally, let's test the profile to make sure that it works:

1. Open the Azure portal and sign in with an administrative account.

2. From the sidebar, select **Storage accounts**.

3. Select the storage account you configured for your session host pool.

4. From the sidebar, select **File shares**.

5. Select the file share you configured to store the profiles.

6. If everything's set up correctly, you should see a directory with a name that's formatted like this: `<user SID>_<username>`.

## Next steps

To troubleshoot FSLogix, see [this troubleshooting guide](/fslogix/fslogix-trouble-shooting-ht).
