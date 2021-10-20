---
title: How to deploy Azure AD Kerberos authentication for Azure Files (Preview)
description: Learn how to deploy Azure AD Kerberos authentication for Azure Files 

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 10/19/2021

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: rhicock

ms.collection: M365-identity-device-management
ms.custom: contperf-fy20q4
---
# How to deploy Azure AD Kerberos authentication for Azure Files (Preview)

Azure Files offers fully managed file shares in the cloud that are accessible via the industry standard SMB protocol. With this preview, Azure AD supports Kerberos authentication so you can use SMB to access Azure Files using Azure AD credentials from devices and VMs joined to Azure AD or hybrid environments. An Azure AD user can now access a file share in cloud that requires Kerberos authentication. 

Enterprises can move their traditional services that require Kerberos authentication to the cloud maintaining the seamless user experience and without making any changes to the authentication stack of the file servers. This does not require the customers to depDAFloy new on premises infrastructure or manage the overhead of setting up Domain services. The end users can access Azure files or traditional file servers over the internet i.e. sitting in a coffee shop without requiring a line of sight to Domain Controllers. 

Azure AD Kerberos authentication for Azure Files is supported as part of a public preview. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Intended Audience 
Enterprise IT admins who are planning to enable Azure files leveraging Azure AD authentication or access Azure files / file shares in Hybrid environments. 

## Scenarios 
Customers can now leverage Azure AD and Azure files for the following scenarios:

- Lifting and Shifting the on premises file servers to Azure without implementing changes to the authentication stack or deploying Azure AD domain services. Customers can leverage their Azure AD credentials to access Azure files as a replacement of on premises file share from Azure AD /Hybrid Azure AD joined devices.
- Cloud born applications using Azure Files as the shared data storage with Native Azure AD authentication and modern credentials. 
- Accessing on prem file share or Azure files over the internet without line of sight to a DC. 

## How does Azure AD provide Kerberos authentication?
This is achieved by flipping the traditional trust model where Azure AD now becomes the trusted source for both cloud and on premises authentication. Azure AD becomes an independent Kerberos realm, and the Windows clients (insider build) are enlightened and allows clients to access Azure AD Kerberos. This enables:

- Traditional on-premises applications to move to the cloud without changing their fundamental authentication scheme.
- Applications trust Azure AD directly and there is no need for traditional AD.

![Diagram of how Kerberos authentication works for Azure Files.](media\how-to-kerberos-authentication-azure-files\scenario.png)

With this, now the users can access Azure files or traditional file servers over the internet i.e. sitting in a coffee shop without requiring a line of sight to DC. This will require the latest Windows client version (Insider build) and the set up described in following sections. We also support native Azure AD authentication with the previous windows client version i.e. Windows client version 2004 and below but to enable this the clients will require a line of sight to the DC. You will also need to create a trust object in your tenant in on premises and registered in Azure AD. 

>[!NOTE]
>This private preview focuses on the upcoming Windows Insider build only. 

## Prerequisite	Description 

|Prerequisite | Description |
|-------------|-------------|
| Windows 10 Insider build 21304 or higher | Download Windows Insider Preview builds Guide to Windows Insider Program<br>Until an ISO is available for download, you will have to install a current OS and upgrade to the Windows Insiders Dev Channel as needed. |
| Azure AD subscription | Azure AD tenant |
|Use a storage account provided by Azure Files team hosted in pre-prod environment |Email Azure Files team @ FilesADAuth@microsoft.com to create the storage account with:<br>- **Subscription ID**: Choose from existing subscriptions<br>- **Resource Group Name**: Choose from existing resource groups<br>- **Storage Account Name**: Provide a new name that you intend to use for your storage account. (If the name is taken, we will append random strings behind the given name.) |
| Azure AD connect installed | Hybrid environments where identities exist both in Azure AD and Active Directory Domain Services |

## Limitations

### Azure AD cached logon 

In case of upgrades and fresh deployment, there is a potential for the user accounts to not have the refreshed TGT (ticket granting ticket) immediately i.e. within 4 hours resulting in failed tickets requests from Azure AD.  As Windows tries to limit how often it connects to AAD so during that period there is a possibility that the machine hasn’t gotten a TGT yet. As an administrator, you can trigger an online logon immediately to handle upgrade scenarios by running the command below and then locking and unlocking the user session to get a refreshed TGT.

```cmd
dsregcmd.exe /RefreshPrt
```

### Running on-premises-backed Azure Files and cloud-backed Azure Files in the same environment

There is a known limitation with having two or more different Azure Files services with one backed by an on-premises Active Directory environment and the other backed by Azure AD. This is only needed for customers who already have Azure files services using AD authentication in their environment and are now moving to Azure AD backed Azure files with this preview. Windows relies on the namespace of the service (*.file.core.windows.net) to identify whether it should contact Azure AD for a Kerberos ticket or Active Directory. Since both services use the same namespace, Windows cannot distinguish between an on-prem configuration and a cloud configuration. 

To support both these in the same environment, you can provide the Windows client configuration information to choose the correct realm. This is handled by updating the the following Group Policy setting:

**Computer Configuration\Administrative Templates\System\Kerberos\Define host name-to-Kerberos realm mappings**

By Default, all the Azure Files instances will be configured to on-premises and you will be required to list only the cloud instance separately. 

YOURDOMAIN.COM => .file.core.windows.net
KERBEROS.MICROSOFTONLINE.COM => instance1.file.core.windows.net,instance2.file.core.windows.net

## Deployment steps 

### Azure AD set up 

There is no Azure AD set up required for enabling native Azure AD Authentication for accessing Azure files over Wi-Fi. The prerequisites are mentioned under section 5: the latest Windows client insider builds (21304+) and an Azure AD subscription. With this preview, Azure AD is now its own independent Kerberos realm. The clients are already enlightened and will redirect clients to access Azure AD Kerberos to request a Kerberos ticket. By default, this capability for the clients to access Azure AD Kerberos is switched off and you need the below policy change to enable this feature on the clients. This setting can be used to deploy this feature in a staged manner by choosing specific clients you want to pilot on and then expanding it to all the clients across your environment. 

Enable the following Group Policy setting:

**Administrative Templates\System\Kerberos\Allow retrieving the cloud kerberos ticket during the logon**

![Screenshot of group policy setting Allow retrieving the cloud kerberos ticket during the logon.](media\how-to-kerberos-authentication-azure-files\gp.png)

Note that users with existing logon sessions may need to refresh their PRT if they attempt to use this feature immediately after it’s enabled. It can take up to a few hours for the PRT to refresh on its own. To refresh it manually run this command from a command prompt.

```cmd
dsregcmd.exe /RefreshPrt
```

### Set up Azure Files

Follow these instructions to set up Azure files. 

1. Create Azure storage account and enable AAD Kerberos Authentication for Azure Files
   1. Install prerequisites:

      | Module | Descrption | Powershell |
      |--------|------------|---------|
      | Az.Storage PowerShell module |This module provides management cmdlets for Azure Storage resources. Required to create storage account, enable Azure AD Kerberos authentication on storage account, and retrieve storage accounts’ Kerberos keys. | `Install-Module -Name Az.Storage`|
      | Azure Active Directory PowerShell Module | This module provides management cmdlets for Azure AD administrative tasks such as user and service principal management. | `Install-Module -Name AzureAD`. |
         
      For more information about installing the Azure AD PowerShell module, see [Install Azure Active Directory PowerShell for Graph](/powershell/azure/active-directory/install-adv2.md?view=azureadps-2.0).

   1. Register Azure AD Kerberos for Azure Files. Because Azure Files with Azure AD Kerberos is in preview, the feature is gated through a Azure-wide feature exposure system (AFEC). To register, run the following command:
      
      ```powershell
      Register-AzProviderFeature -FeatureName EUAPParticipation -ProviderNamespace Microsoft.Resources
      ```

   1. Email Azure Files team @ FilesADAuth@microsoft.com to create the storage account for Preview testing with the following information:
      - **Subscription ID**: Choose from existing subscriptions
      - **Resource Group name**: choose from existing resource groups
      - **Storage Account name**: provide a new name that you intend to use for your storage account. (If the name is taken, we will append random strings behind the given name.)

   1. Validate your environment can connect to Azure Files over SMB. If you haven’t mount Azure Files shares to your environment before, we strongly suggest you run the AzFileDiagnostics tool to validate your setup before configuring Azure AD authentic.

   1. Configure the Azure AD service principal and application. To enable AAD Kerberos authentication on a storage account, we need to create an Azure AD Application to represent the storage account in Azure AD. This can be done by using PowerShell commands from both the Az.Storage and Azure AD modules.
      1. Set variables for both storage account name and resource group name.
      
         ```powershell
         <# 1. Replace $storageAccountName and $resourceGroupName with the storage account and its resource group names. #>
         $storageAccountName = "ledaviesaad"
         $resourceGroupName = "ledavies"
         ```

      1. Set the password (service principal secret) based on the Kerberos key of the storage account. The Kerberos key is a password shared between AAD Kerberos and Azure Storage. The Kerberos derives its value as the first 32 bytes of the storage account’s kerb1 key.
      
         ```powershell
         <# 2. Use Az.Storage PowerShell to retrieve the kerb1 key of the storage account and generate a password for the Azure AD service principal. #>
         $kerbKey1 = Get-AzStorageAccountKey `
             -ResourceGroupName $resourceGroupName `
             -Name $storageAccountName -ListKerbKey `
             | Where-Object { $_.KeyName -like "kerb1" }

         $aadPasswordBuffer = [System.Linq.Enumerable]::Take([System.Convert]::FromBase64String($kerbKey1.Value), 32);

         $password = "kk:" + [System.Convert]::ToBase64String($aadPasswordBuffer);
         ```

     1. Connect to Azure AD and retrieve tenant information.
    
        ```powershell
        <# 3. Connect to the Azure AD using your Azure AD credentials, retrieve tenant ID and domain name #>
        Connect-AzureAD
        
        $azureAdTenantDetail = Get-AzureADTenantDetail;
        $azureAdTenantId = $azureAdTenantDetail.ObjectId
        $azureAdPrimaryDomain = ($azureAdTenantDetail.VerifiedDomains | Where-Object {$_._Default -eq $true}).Name
        ```

     1. Generate the Service Principal Names for the Azure AD service principal.
     
        ```powershell
        <# 4. Generate the Service Principal Names for the service principal #>
     
        $servicePrincipalNames = New-Object string[] 3
        $servicePrincipalNames[0] = 'HTTP/{0}.file.core.windows.net' -f ` $storageAccountName
        $servicePrincipalNames[1] = 'CIFS/{0}.file.core.windows.net' -f ` $storageAccountName
        $servicePrincipalNames[2] = 'HOST/{0}.file.core.windows.net' -f ` $storageAccountName
        ```

     1. Create an application for the storage account. 
     
        ```powershell
        <# 5. Create an application for the storage account #>
        
        $application = New-AzureADApplication `
            -DisplayName $storageAccountName `
            -IdentifierUris $servicePrincipalNames `
            -GroupMembershipClaims "All";
        ```    

     1. Create a service principal for the storage account.
     
        ```powershell
        <# 6. Create a service principal for the storage account #>
        
        $servicePrincipal = New-AzureADServicePrincipal `
            -AccountEnabled $true `
            -AppId $application.AppId `
            -ServicePrincipalType "Application”;
        ```    

     1. Set the password of the Service Principal for the storage account. (The value of $password can be taken from step 2).
        
        ```powershell
        <# 7. Set the password of the Service Principal for the storage account. #>
        
        $Token = ([Microsoft.Open.Azure.AD.CommonLibrary.AzureSession]::AccessTokens['AccessToken']).AccessToken
        
        $apiVersion = '1.6'
        $Uri = ('https://graph.windows.net/{0}/{1}/{2}?api-version={3}' `
            -f $azureAdPrimaryDomain, 'servicePrincipals', 
            $servicePrincipal.ObjectId, $apiVersion)

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

        $Headers = @{
                'authorization' = "Bearer $($Token)"
            }

        try {
           Invoke-RestMethod -Uri $Uri -ContentType 'application/json' -Method Patch -Headers $Headers -Body $json
           Write-Host "Success: Password is set for $storageAccountName"
        } catch {
           Write-Host $_.Exception.ToString()
           Write-Host "StatusCode:" $_.Exception.Response.StatusCode.value
           Write-Host "StatusDescription:" $_.Exception.Response.StatusDescription
        }
        ```

     1. Set the API permissions on the newly created application.
        1. In the Azure portal, click **Azure Active Directory** > **App registrations** > **All Applications**.
        1. Find the application with the name matching your storage account.
        1. Add three permissions:
           - OpenId
             - OpenId
             - Profile
           - User
             - User.Read
        1. Also select **Grant Admin consent**.

        ![Screenshot showing how to grant Admin consent.](media\how-to-kerberos-authentication-azure-files\consent.png)
 
1. Create a file share under the storage account. You can create a file share under the storage account by using the Azure portal or Powershell. 

   ```powershell
   New-AzRmStorageShare -StorageAccount $storageAccountName -Name "<your-share-name-here>" -QuotaGiB 1024 | Out-Null
   ```

1. Configure RBAC permissions on the file share:
   1. There are three Azure built-in roles for granting share-level permissions to users:
      - *Storage File Data SMB Share Reader* allows read access in Azure Storage file shares over SMB.
      - *Storage File Data SMB Share Contributor* allows read, write, and delete access in Azure Storage file shares over SMB.
      - *Storage File Data SMB Share Elevated Contributor* allows read, write, delete, and modify Windows ACLs in Azure Storage file shares over SMB.
   1. To assign an Azure role to an Azure AD identity, using the Azure portal, follow these steps:
      1. In the Azure portal, go to your file share.
      1. Select **Access Control (IAM)**.
      1. Select **Add a role assignment**.
      1. In the **Add role assignment** blade, select the appropriate built-in role (Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor) from the Role list. Leave Assign access to the default setting: Azure AD user, group, or service principal. Select the target Azure AD identity by name or email address. **The selected Azure AD identity must be a hybrid identity and cannot be a cloud only identity.** This means that the same identity is also represented in AD DS.
      1. Select **Save** to complete the role assignment operation.
   
   For more information, including PowerShell and CLI options, see [Part two: assign share-level permissions to an identity](/storage/files/storage-files-identity-ad-ds-assign-permissions.md).

1. Mount the file share. From a command-line window, mount as the user:

   ```cmd
   net use <DriveLetter>: \\<your-storage-account-name>.file.core.windows.net\<your-share-name>
   ```

   ![Screenshot console output from net use command.](media\how-to-kerberos-authentication-azure-files\net-use.png)

1. Configure Windows File and Directory ACLs (permissions)
   1. Using Windows Explorer:
      1. To use Windows Explorer for permission management, your client should allow RPC call over the internet, and support LDAP to Active Directory domain controller. If not, you can consider option b with icacls.
      1. Use Windows File Explorer to grant full permission to all directories and files under the file share, including the root directory.
      1. Open Windows File Explorer and right-click the file/directory and select **Properties**.
      1. Select the **Security** tab.
      1. Select **Edit...** to change permissions.
      1. You can change the permissions of existing users or select **Add...** to grant permissions to new users.
      1. In the prompt window for adding new users, enter the target username you want to grant permissions to in **Enter the object names to select**, and select **Check Names** to find the full UPN name of the target user.
      1. Select **OK**.
      1. In the **Security** tab, select all permissions you want to grant your new user.
      1. Select **Apply**.

    For more information, including instructions for using icacls cmd-line utility, see [Part three: configure directory and file level permissions over SMB](/storage/files/storage-files-identity-ad-ds-configure-permissions.md).

## Validation Scenarios

Run through the following validation scenarions to confirm Kerberos authentication is working for Azure Files. 

### Share mount

1. To validate share mounting, run the following command from a command line:

   ```comd
   net use <DriveLetter>: \\<your-storage-account-name>.file.core.windows.net\<your-share-name> /persistent:yes
   ```

1. Open the drive letter from Explorer and verify connectivity without any prompts.
1. Reboot the machine and log back into Windows.
1. Verify the drive is reconnected.

### Share-level permissions

In the section to set up Azure Files, there is a guide on how to assign share-level permissions to users’ Azure AD identities using Azure Portal.  We’d want to validate that these permissions are enforced by doing the following:

1. Assign a user **Storage File Data SMB Share Reader** permissions to authorize them read access of the file share.
1. Validate they have mounted the share.
1. Try to add a new file to the share – the expectation is that this fails.

### File-level permissions

In the section to set up Azure Files, there is a guide on how to configure file-level permissions to assign granular access for users at the file and directory level.  We’d want to validate that these permissions are enforced by doing the following:

1. Mount the share using storage account and key.
1. Create a file.
1. Configure the file’s permission such that a user is denied access to that file.
1. Mount the share as the denied user.
1. Verify that they cannot access the file.  

## Troubleshooting 

### Verify tickets are getting cached

1. `klist get krbtgt/kerberos.microsoftonline.com` should return a ticket from on-prem realm.

1. `klist get cifs/<azfiles.host.name.com>` should return a ticket from kerberos.microsoftonline.com realm with SPN to <azfiles.host.name.com>

### Verify and investigate connection issues to Azure Storage

1. Verify connectivity over Port 445 using Test-NetConnection cmdlet, for an example, use [this reference](/storage/files/storage-troubleshoot-windows-file-connection-problems.md#cause-1-port-445-is-blocked).
1. For other issues specific to storage, refer to our [Windows client troubleshooting guide](/storage/files/storage-troubleshoot-windows-file-connection-problems.md).

### Investigate message flow failures

1. Wireshark traffic between client and on-prem KDC. Expect: 
   AS-REQ: Client => on-prem KDC => returns on-prem TGT
   TGS-REQ: Client => on-prem KDC => returns referral to kerberos.microsoftonline.com

1. Fiddler traffic between client and ESTS over HTTPS (run as admin). Expect:
   TGS-REQ: Client => login.msol.com/{tenant}/kerberos => returns ticket to <azfiles.host.name.com>
   Use the [plugin to decode Kerberos messages](https://github.com/dotnet/Kerberos.NET/releases/tag/ext-installer-v1)

### Verify existing commands work as expected

Log collection for troubleshooting.

1. Collect fiddler traces and Request Id or Correlation Id from response headers.
1. Use aka.ms/logsminerto search for traces.
1. Collect Windows ETL traces from client.

## Collect logs with Feedback HUb

Please collect logs by using **FeedBack Hub** to share any feedback or report any issues while logging into the client:

1. Open feedback hub and create a new feedback item.
1. Select the **Security and Privacy** category, and then the **Logging into Your PC** subcategory.
1. Click **Start capture** and reproduce the issue. Monitoring persists across Logon/Logoff and reboots.
1. Return to Feedback Hub, click **Stop capture**, and submit your feedback. If you already filed a ug and were asked to collect additional logs, please parent your new feedback to the existing bug.

## Next steps

Migrate to Azure file shares | Microsoft Docs
