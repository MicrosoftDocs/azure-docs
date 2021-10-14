---
title: Create an Azure file share with Azure Active Directory - Azure
description: Set up an FSLogix profile container on an Azure file share in an existing Azure Virtual Desktop host pool with your Azure Active Directory domain.
services: virtual-desktop
author: Heidilohr
manager: femila

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 10/19/2021
ms.author: helohr
---
# Create a profile container with Azure Files and Azure Active Directory

> [!IMPORTANT]
> Storing FSLogix profiles on Azure Files for Azure Active Directory (AD)-joined VMs is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, you'll learn how to create an Azure file share that can be accessed by hybrid user identities authenticated via Azure AD from Hybrid Azure AD and Azure AD joined VMs. An Azure AD user can now access a file share that requires Kerberos authentication. This configuration uses Azure AD to issue the necessary Kerberos tickets to access the file share with the industry-standard SMB protocol. 

You can move your traditional services that require Kerberos authentication to the cloud without making any changes to the authentication stack of the file shares. This does not require you to deploy new on-premises infrastructure or set up domain services. Your end-users can access Azure file shares over the internet without requiring a line-of-sight to domain controllers. You can use this file share to store FSLogix user profiles for Azure Virtual Desktop.

This article describes how to configure Azure Files for authentication using Azure AD. You can also configure Azure Files for authentication with [Azure Active Directory Domain Services (AD DS)](create-profile-container-adds.md) or with [Active Directory Domain Services](create-file-share.md).

## Prerequisites

- The session host VMs must be using one of the following:
    - Windows 11 ENT single or multi session.
    - Windows 10 ENT single or multi session, version 2004 or later with the latest cumulative update installed including [KB5006670](https://support.microsoft.com/topic/october-12-2021-kb5006670-os-builds-19041-1288-19042-1288-and-19043-1288-8902fc49-af79-4b1a-99c4-f74ca886cd95).
    - 
- The user accounts must be [hybrid user identities](../active-directory/hybrid/whatis-hybrid-identity.md), which means you'll also need AD DS and Azure AD Connect.

> [!IMPORTANT]
> - This feature is currently only supported in the Azure Public cloud.

## Set up a storage account

First, you'll need to set up an Azure Files storage account if you don't already have one.

> [!NOTE]
> - A storage account cannot be configured to authenticate with both Azure AD and AD DS or Azure AD DS.

To set up a storage account:

1. Sign in to the Azure portal.

2. Search for **storage account** in the search bar and select it.

3. Select **+Create**.

4. Enter the following information into the  **Create a storage account** page:

    - Create or select a resource group.
    - Enter a unique name for your storage account.
    - For **Region**, we recommend you choose the same location as the Azure Virtual Desktop host pool.
    - For **Performance**, select the appropriate type depending on your IOPS requirements. For more information, see [Storage options for FSLogix profile containers in Azure Virtual Desktop](store-fslogix-profile.md).
    - For **Redundancy**, select **Locally-redundant storage (LRS)**.

5. When you're done, select **Review + create**, then select **Create**.

## Set up Azure Files

The instructions in this section will help you configure Azure Files and Azure AD to support file shares that you access using Azure AD accounts.

To configure Azure Files:

1. Install the Azure Storage module.

    This module provides management cmdlets for Azure Storage resources. It's required to enable Azure AD authentication on the storage account and retrieve the storage account’s Kerberos keys. In PowerShell, run the following command:

    ```powershell
    Install-Module -Name Az.Storage
    ```

2. Install the Azure AD module.

    This module provides management cmdlets for Azure AD administrative tasks such as user and service principal management. In PowerShell, run the following command:

    ```powershell
    Install-Module -Name AzureAD
    ```

    For more information, see [Install the Azure AD PowerShell module](/powershell/azure/active-directory/install-adv2).

3. Configure the Azure AD service principal and application.

   To enable Azure AD authentication on a storage account, you need to create an Azure AD Application to represent the storage account in Azure AD. This can be done with a set of PowerShell commands from both the Azure Storage and Azure AD modules.

    1. Set variables for both storage account name and resource group name by running the following cmdlets:

        ```powershell
        $resourceGroupName = "<MyResourceGroup>"
        $storageAccountName = "<MyStorageAccount>"
        ```
 
    2. Set the password (service principal secret) based on the Kerberos key of the storage account. The Kerberos key is a password shared between Azure AD and Azure Storage. Kerberos derives its value as the first 32 bytes of the storage account’s kerb1 key. To set the password, run the following cmdlets:

        ```powershell
        $kerbKey1 = Get-AzStorageAccountKey -ResourceGroupName $resourceGroupName -Name $storageAccountName -ListKerbKey | Where-Object { $_.KeyName -like "kerb1" }
        $aadPasswordBuffer = [System.Linq.Enumerable]::Take([System.Convert]::FromBase64String($kerbKey1.Value), 32);
        $password = "kk:" + [System.Convert]::ToBase64String($aadPasswordBuffer);
        ```

    3. Connect to Azure AD and retrieve the tenant information by running the following cmdlets:

        ```powershell
        Connect-AzureAD
        $azureAdTenantDetail = Get-AzureADTenantDetail;
        $azureAdTenantId = $azureAdTenantDetail.ObjectId
        $azureAdPrimaryDomain = ($azureAdTenantDetail.VerifiedDomains | Where-Object {$_._Default -eq $true}).Name
        ```

    4. Generate the service principal names for the Azure AD service principal by running these cmdlets:

        ```powershell
        $servicePrincipalNames = New-Object string[] 3
        $servicePrincipalNames[0] = 'HTTP/{0}.file.core.windows.net' -f $storageAccountName
        $servicePrincipalNames[1] = 'CIFS/{0}.file.core.windows.net' -f $storageAccountName
        $servicePrincipalNames[2] = 'HOST/{0}.file.core.windows.net' -f $storageAccountName
        ```

    5. Create an application for the storage account by running this cmdlet:

        ```powershell
        $application = New-AzureADApplication -DisplayName $storageAccountName -IdentifierUris $servicePrincipalNames -GroupMembershipClaims "All";
        ```

    6. Create a service principal for the storage account by running this cmdlet:

        ```powershell
        $servicePrincipal = New-AzureADServicePrincipal -AccountEnabled $true -AppId $application.AppId -ServicePrincipalType "Application”;
        ```

    7. Set the password for the storage account's service principal by running the following cmdlets. Make sure to use the *$password* value you used in step 3.b.

        ```powershell
        $Token = ([Microsoft.Open.Azure.AD.CommonLibrary.AzureSession]::AccessTokens['AccessToken']).AccessToken
        $apiVersion = '1.6'
        $Uri = ('https://graph.windows.net/{0}/{1}/{2}?api-version={3}' -f $azureAdPrimaryDomain, 'servicePrincipals', $servicePrincipal.ObjectId, $apiVersion)
        $json = @'
        {
          "passwordCredentials": [
          {
            "customKeyIdentifier": null,
            "endDate": "2022-07-30T19:12:51.3058279Z",
            "value": "<STORAGEACCOUNTPASSWORD>",
            "startDate": "2020-07-30T19:15:51.3058279Z"
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
          Write-Host "StatusCode:" $_.Exception.Response.StatusCode.value Define host name-to-Kerberos realm mappings
          Write-Host "StatusDescription:" $_.Exception.Response.StatusDescription
        }
        ```

4. Set the API permissions on the newly created application.

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

5. Create a file share under the storage account through the [Azure portal](../storage/files/storage-how-to-use-files-portal.md) or in PowerShell by running this cmdlet:

    ```powershell
    New-AzRmStorageShare -StorageAccount $storageAccountName -Name “<your-share-name-here>” -QuotaGiB 1024 | Out-Null
    ```
    
6. You must grant your users access to the file share before they can use it. There are two ways you can assign share-level permissions: either assign them to specific Azure AD users or user groups, or you can assign them to all authenticated identities as a default share-level permission. To learn more about assigning share-level permissions, see [Assign share-level permissions to an identity](../storage/files/storage-files-identity-ad-ds-assign-permissions.md). All users that need to have FSLogix profiles stored on the storage account you're using must be assigned the **Storage File Data SMB Share Contributor** role.

    > [!IMPORTANT]
    > Assigning specific permissions to users and user groups is currently only supported with hybrid users and groups. The users and groups must be managed in Active Directory and synced to Azure AD using Azure AD Connect.

7. You must also assign directory and file-level permissions to ensure users cannot access other user's profile. We recommend you [configure the Windows ACLs](../storage/files/storage-files-identity-ad-ds-configure-permissions.md) for the directory where the profiles will be stored. Learn more at [Configure the storage permissions for profile containers](/fslogix/fslogix-storage-config-ht).

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
