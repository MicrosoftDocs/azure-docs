---
title: Use Managed Identities with Azure Files (preview)
description: This article explains how you can authenticate managed identities to allow applications and virtual machines to access SMB Azure file shares using identity-based authentication with Microsoft Entra ID.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 12/10/2025
ms.author: kendownie
ms.custom:
  - devx-track-azurepowershell
# Customer intent: As a cloud administrator, I want to improve security by authenticating managed identities to allow applications and virtual machines to access SMB Azure Files shares using identity-based authentication with Microsoft Entra ID instead of using a storage account key.
---

# Access SMB Azure file shares using managed identities with Microsoft Entra ID (preview)

**Applies to:** :heavy_check_mark: SMB Azure file shares

This article explains how you can use [managed identities](/entra/identity/managed-identities-azure-resources/overview) to allow Windows and Linux virtual machines (VMs) to access SMB Azure file shares using identity-based authentication with Microsoft Entra ID (preview). 

A managed identity is an identity in Microsoft Entra ID that is automatically managed by Azure. You typically use managed identities when developing cloud applications to manage the credentials for authenticating to Azure services. 

By the end of this guide, you'll have a storage account ready to access with a managed identity. You'll also know how to create a managed identity for a VM and generate an OAuth token for it. Then you'll mount a file share using managed identity-based authentication and authorization, eliminating the need to use a storage account key.

## Why authenticate using a managed identity?

For security reasons, using storage account keys to access a file share isn't recommended. When you assign a managed identity to a VM or use an application identity, you can use that identity to authenticate to Azure Files.

Benefits include:

- **Enhanced security:** No dependency on storage account keys to manage or expose

- **Simplified management:** No key rotation required

- **Fine-grained access control:** Role-based access at the identity level

- **Automation friendly:** Easy to integrate with CI/CD pipelines, Azure Kubernetes Service (AKS) workloads, and customer applications

- **Cost effective:** Managed identities can be used at no extra storage cost

## System assigned and user assigned managed identities

There are two types of managed identities in Azure: **system assigned** and **user assigned**.

A system assigned managed identity is restricted to one per resource and is tied to the lifecycle of this resource. You can grant permissions to the managed identity by using Azure role-based access control (Azure RBAC). The managed identity is authenticated with Microsoft Entra ID, so you don’t have to store any credentials in code. System assigned managed identities aren't supported on Linux VMs. 

User assigned managed identities enable Azure resources to authenticate to cloud services without storing credentials in code. This type of managed identities is created as a standalone Azure resource, and has its own lifecycle. A single resource such as a VM can utilize multiple user assigned managed identities. Similarly, a single user assigned managed identity can be shared across multiple VMs.

Windows VMs can have both user assigned and system assigned managed identities configured.

## Prerequisites

This article assumes that you have an Azure subscription with permissions to create storage accounts and assign Azure Role-Based Access Control (RBAC) roles. To assign roles, you must have role assignments write permission (Microsoft.Authorization/roleAssignments/write) at the scope you want to assign the role.

In addition, the clients that need to authenticate using a managed identity shouldn't be joined to any domain.

### Prepare your PowerShell environment

Open PowerShell as administrator and run the following command to set the PowerShell execution policy:

```powershell
Set-ExecutionPolicy Unrestricted -Scope CurrentUser 
```

Make sure you have the latest PowerShellGet:

```powershell
Install-Module PowerShellGet -Force -AllowClobber 
```

Install the Az module if it isn't already installed:

```powershell
Install-Module -Name Az -Repository PSGallery -Force 
Import-Module Az 
```

Sign into Azure:

```powershell
Connect-AzAccount
```

Select your subscription by specifying your subscription ID (recommended):

```powershell
Set-AzContext -SubscriptionId "<subscription-ID>" 
```

You can also select your subscription by specifying your subscription name:

```powershell
Set-AzContext -Subscription "<subscription-name>" 
```

## Configure the managed identity access property on your storage account

In order to authenticate a managed identity, you must enable a property called **SMBOAuth** on the storage account that contains the Azure file share you want to access. We recommend creating a new storage account for this purpose. You can use an existing storage account only if it doesn't have any other identity source configured.

To create a new storage account with **SMBOAuth** enabled, run the following PowerShell command as administrator. Replace `<resource-group>`, `<storage-account-name>`, and `<region>` with your values. You can specify a different SKU if needed.

```powershell
New-AzStorageAccount -ResourceGroupName <resource-group> -Name <storage-account-name> -SkuName Standard_LRS -Location <region> -EnableSmbOAuth $true
```

To enable SMBOAuth on an existing storage account, run the following PowerShell command. Replace `<resource-group>` and `<storage-account-name>` with your values.

```powershell
Set-AzStorageAccount -ResourceGroupName <resource-group> -Name <storage-account-name> -EnableSmbOAuth $true
```

If you see errors that the resource was disallowed by policy, then you might have a policy set on your subscription disallowing `Set-AzStorageAccount`. To work around, retry using the following command:

```powershell
Set-AzStorageAccount -ResourceGroupName <resource-group> -Name <storage-account-name> -EnableSmbOAuth $true -AllowBlobPublicAccess $false
```

Next, create an SMB file share on the storage account. Replace `<resource-group>`, `<storage-account-name>`, and `<file-share-name>` with your values. 

```powershell
$storageAccount = Get-AzStorageAccount -ResourceGroupName <resource-group> -Name <storage-account-name>
New-AzStorageShare -Name <file-share-name> -Context $storageAccount.Context
```

You should now have a storage account and file share ready for SMB OAuth authentication. Verify in the Azure portal that your storage account and file share were created.

## Configure managed identity

You can use managed identities with Windows or Linux. Select the appropriate tab and follow the instructions for your operating system.

### [Windows](#tab/windows)

The enablement steps described here are for Azure VMs. If you want to enable a managed identity on non-Azure Windows machines (on-premises or other cloud), you must [onboard them to Azure Arc and assign a managed identity](/azure/cloud-adoption-framework/scenarios/hybrid/arc-enabled-servers/eslz-identity-and-access-management). You can also authenticate using an application identity instead of using a managed identity on a VM or Windows device.

### Enable managed identity on an Azure VM

Follow these steps to enable a managed identity on an Azure VM.

1. Sign in to the Azure portal and create a Windows VM. Your VM must be running Windows Server 2019 or higher for server SKUs, or any Windows client SKU. See [Create a Windows virtual machine in the Azure portal](/azure/virtual-machines/windows/quick-create-portal).

1. Enable a managed identity on the VM. It can be either [system assigned or user assigned](/entra/identity/managed-identities-azure-resources/overview#differences-between-system-assigned-and-user-assigned-managed-identities). If the VM has both system assigned and user assigned identities, Azure defaults to system assigned. Assign only one for best results. You can enable a system assigned managed identity during VM creation on the **Management** tab.

    :::image type="content" source="media/managed-identities/enable-system-assigned-managed-identity.png" alt-text="Screenshot showing how to enable system assigned managed identity when creating a new VM using the Azure portal." border="true":::

### Assign built-in RBAC role to the managed identity or application identity

Once a managed identity is enabled, you can grant all necessary permissions via Azure RBAC. To assign roles, you must be signed in as a user that has role assignments write permission at the scope you want to assign the role.

Follow these steps to assign the built-in Azure RBAC role [Storage File Data SMB MI Admin](/azure/role-based-access-control/built-in-roles/storage#storage-file-data-smb-mi-admin), which allows for admin-level access for managed identities on files and directories in Azure Files.

1. Navigate to the storage account that contains the file share you want to mount using a managed identity. Select **Access Control (IAM)** from the service menu.

1. Under **Grant access to this resource**, select **Add role assignment**.

1. On the **Role** tab, under **Job function roles**, search for and select **Storage File Data SMB MI Admin**, and then select **Next**.

1. On the **Members** tab, under **Assign access to**, select **Managed identity** for VM or Azure Arc identities. For application identities, select **User, group, or service principal**.

1. Under **Members**, click on **+ Select members**. 

1. For Azure VMs or Azure Arc identities, select the managed identity for your VM or Windows device. For application identities, search for and select the application identity. Click **Select**.

1. You should now see the managed identity or application identity listed under **Members**. Select **Next**.

1. Select **Review + assign** to add the role assignment to the storage account.


### [Linux](#tab/linux)

To configure a managed identity on a Linux VM running in Azure, follow these steps. Your VM must be running Azure Linux 3.0, Ubuntu 22.04, or Ubuntu 24.04.

> [!NOTE]
> System assigned managed identities aren't supported on Linux VMs. You must create a user assigned managed identity.

1. Sign in to the Azure portal and [create a user assigned managed identity](/entra/identity/managed-identities-azure-resources/manage-user-assigned-managed-identities-azure-portal#create-a-user-assigned-managed-identity).

1. Navigate to the managed identity you just created and copy the **Client ID**. You'll need this later.

1. Navigate to the storage account that contains the file share you want to mount using a managed identity. Select **Access Control (IAM)** from the service menu.

1. Under **Grant access to this resource**, select **Add role assignment**.

1. On the **Role** tab, under **Job function roles**, search for and select **Storage File Data SMB MI Admin**, and then select **Next**.

1. On the **Members** tab, under **Assign access to**, select **Managed identity**.

1. Under **Members**, click on **+ Select members**. The **Select managed identities** pane appears.

1. Under **Managed identity**, select the user assigned managed identity that you created, and then click **Select**.

1. You should now see the managed identity listed under **Members**. Select **Next**.

1. Select **Review + assign** to add the role assignment to the storage account.

1. Navigate to your VM. From the service menu, under **Security**, select **Identity**.

1. Select the **User assigned** tab, and then select **Add user assigned managed identity**. Select the user assigned managed identity you created, and then select **Add**.

---

## Prepare your client to authenticate using a managed identity

Follow these steps to prepare your system to mount the file share using managed identity authentication. The steps are different for Windows and Linux clients. Clients shouldn't be domain joined.

### [Windows](#tab/windows)

To prepare your client VM or Windows device to authenticate using a managed identity, follow these steps.

1. Log into your VM or device that has the managed identity assigned and open a PowerShell window as administrator. You'll need either PowerShell 5.1+ or PowerShell 7+.

1. Install the [Azure Files SMB Managed Identity Client](https://www.powershellgallery.com/packages/AzFilesSmbMIClient/1.0.4) PowerShell module and import it:

   ```powershell
   Install-Module AzFilesSMBMIClient 
   Import-Module AzFilesSMBMIClient 
   ```

1. Check your current PowerShell execution policy by running the following command:

   ```powershell
   Get-ExecutionPolicy -List 
   ```

   If the execution policy on CurrentUser is **Restricted** or **Undefined**, change it to **RemoteSigned**. If the execution policy is **RemoteSigned**, **Default**, **AllSigned**, **Bypass**, or **Unrestricted**, you can skip this step. 

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser 
   ```

### Refresh the authentication credentials

Before you can mount the file share using the managed identity, you must refresh the authentication credentials and specify your storage account endpoint. To copy your storage account URI, navigate to the storage account in the Azure portal and then select **Settings** > **Endpoints** from the service menu. Be sure to copy the entire URI including the trailing slash: `https://<storage-account-name>.file.core.windows.net/`

```powershell
AzFilesSMBMIClient.exe refresh --uri https://<storage-account-name>.file.core.windows.net/
```

This will get an OAuth token and insert it in the Kerberos cache, and will auto-refresh when the token is close to expiration. You can optionally omit the `refresh`.

If your Windows VM has both user assigned and system assigned managed identities configured, you can use the following command to specify the user assigned managed identity. Replace `<client-id>` with the Client ID of the managed identity.

```powershell
AzFilesSmbMIClient.exe refresh --uri https://<storage-account-name>.file.core.windows.net/ --clientId <client-id> 
```

> [!TIP]
> To view complete usage information and examples, run the executable without any parameters: `AzFilesSmbMIClient.exe`

### [Linux](#tab/linux)

To prepare your Linux VM to authenticate using a managed identity, follow these steps.

### Download and install the authentication packages

The package location and installation steps differ depending on your Linux distro.

#### Azure Linux 3.0

Run the following commands to install `azfilesauth` on Azure Linux 3.0:

```bash
tdnf update 
tdnf install azfilesauth
```

#### Ubuntu 22.04

Run the following commands to install `azfilesauth` on Ubuntu 22.04:

```bash
curl -sSL -O https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb rm packages-microsoft-prod.deb
# the above steps update the sources.list
sudo apt-get update sudo apt-get install azfilesauth
```

#### Ubuntu 24.04

Run the following commands to install `azfilesauth` on Ubuntu 24.04:

```bash
curl -SSL -O https://packages.microsoft.com/config/ubuntu/24.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb rm packages-microsoft-prod.deb
# the above steps update the sources.list
sudo apt-get update sudo apt-get install azfilesauth
```

### Configure authentication

You have two options for configuring authentication on Linux:

- **Use a VM managed identity:** Choose this option when your VM has a user-assigned managed identity assigned.
- **Supply the OAuth token directly**: Choose this option if you're managing OAuth tokens yourself.

#### Option 1: Use a VM managed identity

If your VM has a user-assigned managed identity, run the following commands. Be sure to replace `<client-id>` with the client ID of your managed identity. If you don't have the Client ID, navigate to the managed identity and copy the Client ID.

```bash
# Get a token from the Azure Instance Metadata Service (IMDS) and store it automatically
sudo azfilesauthmanager set https://<storage_account>.file.core.windows.net --imds-client-id <client-id>
# Verify the ticket was created properly
sudo azfilesauthmanager list
```

#### Option 2: Supply the OAuth token directly

If you're managing tokens yourself, supply the OAuth token directly. The `aud` (audience) value for the token must be `https://storage.azure.com` (no trailing forward slash) and not `https://storage.azure.com/` to mount the file share.

Run the following commands and replace `<storage-account-name>` and `<access-token>` with your values.

```bash
# Insert the token into your credential cache
sudo azfilesauthmanager set https://<storage-account-name>.file.core.windows.net <access-token> 
# Verify the ticket is properly stored
sudo azfilesauthmanager list
```

---

## Mount the file share

You should now be able to mount the file share on Windows or Linux without using a storage account key.

### [Windows](#tab/windows)

On Windows clients, you can directly access your Azure file share using the UNC path by entering the following into Windows File Explorer. Be sure to replace `<storage-account-name>` with your storage account name and `<file-share-name>` with your file share name:

`\\<storage-account-name>.file.core.windows.net\<file-share-name>`

For more information, see [Mount SMB Azure file share on Windows](storage-how-to-use-files-windows.md).

### [Linux](#tab/linux)

Run the following command to mount the file share with recommended mount options. Be sure to replace `<storage-account-name>` with your storage account name and `<file-share-name>` with your file share name. You can find your credential ID in the following config file: `cat /etc/azfilesauth/config.yaml`

```bash
sudo mount -t cifs //<storage-account-name>.file.core.windows.net/<file-share-name> /mnt/smb -o sec=krb5,cruid=<credential-id>,dir_mode=0755,file_mode=0755,serverino,nosharesock,mfsymlinks,actimeo=30
```

Verify that the mount succeeded:

```bash
ls -la /mnt/smb
```

For more information, see [Mount SMB Azure file shares on Linux clients](storage-how-to-use-files-linux.md).

### Refresh your credentials

After you mount the file share for the first time, start the refresh service to keep credentials up to date. You can only refresh credentials if your VM has a user-assigned managed identity assigned. If you're supplying the OAuth token directly, then the refresh won't work.

```bash
sudo systemctl start azfilesauth
```

You should refresh your credentials periodically to avoid access interruptions. You can refresh credentials manually using the `azfilesauthmanager set` command as described in [Configure authentication](#configure-authentication), or you can automate the refresh using the shared library APIs.

---

## Troubleshooting

Troubleshooting steps are different for Windows and Linux clients.

### [Windows](#tab/windows)

If you encounter issues when mounting your file share on Windows, follow these steps to enable verbose logging and collect diagnostic information.

1. On Windows clients, use the Registry Editor to set the **Data** level for **verbosity** to 0x00000004 (4) for `Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Azure\Storage\Files\SmbAuth`.

1. Try to mount the share again and reproduce the error.

1. You should now have a file named `AzFilesSmbMILog.log`. Send the log file to azurefilespm@microsoft.com for assistance.

### [Linux](#tab/linux)

If you encounter issues when mounting your file share on Linux, follow [these SMB diagnostics steps](https://github.com/Azure-Samples/azure-files-samples/tree/master/SMBDiagnostics).

---

## Client library installation and integration options

The following information is intended for developers who need to integrate managed identities into their applications.

### [Windows](#tab/windows)

For developers who need to integrate managed identities into their Windows applications, multiple implementation approaches are available depending on your application architecture and requirements.

### Managed assembly integration: NuGet package

For .NET applications, the [Microsoft.Azure.AzFilesSmbMI](https://msazure.pkgs.visualstudio.com/_packaging/Official/nuget/v3/index.json) NuGet package includes a managed assembly (Microsoft.Azure.AzFilesSmbMI.dll) that provides direct access to the SMB OAuth authentication functionality. This approach is recommended for C# and other .NET-based applications.

Installation: `Install-Package Microsoft.Azure.AzFilesSmbMI -version 1.2.3168.94`

### Native DLL integration

For native applications requiring direct API access, AzFilesSmbMIClient is available as a [native DLL](https://github.com/Azure/AzFilesSmbMIClient). This is particularly useful for C/C++ applications or systems requiring lower-level integration. See the [Windows implementation](https://github.com/Azure/AzFilesSmbMIClient/tree/main/Windows) and [API reference](https://github.com/Azure/AzFilesSmbMIClient/blob/main/Windows/dll/src/AzFilesSmbMI.h) (native header file).

#### Native API methods

The native DLL exports the following core methods for credential management:

```cpp
extern "C" AZFILESSMBMI_API HRESULT SmbSetCredential( 
    _In_  PCWSTR pwszFileEndpointUri, 
    _In_  PCWSTR pwszOauthToken, 
    _In_  PCWSTR pwszClientID, 
    _Out_ PDWORD pdwCredentialExpiresInSeconds 
); 
extern "C" AZFILESSMBMI_API HRESULT SmbRefreshCredential( 
    _In_ PCWSTR pwszFileEndpointUri, 
    _In_ PCWSTR pwszClientID 
); 
extern "C" AZFILESSMBMI_API HRESULT SmbClearCredential( 
    _In_ PCWSTR pwszFileEndpointUri 
); 
```

### [Linux](#tab/linux)

Linux developers can use the shared library that's automatically installed with the azfilesauth package. You can link against the library in your C/C++ applications for direct API access.

Be sure to include the [public header](https://github.com/Azure/AzFilesAuthenticator/blob/main/include/azfilesauth.h).

For more information, see the [AzFilesAuthenticator project](https://github.com/Azure/AzFilesAuthenticator/blob/main/README.md).

### Shared library API methods

The shared library exports the following core methods for credential management:

```bash
#ifdef __cplusplus
extern "C" {
#endif

int extern_smb_set_credential_oauth_token(char* file_endpoint_uri,
                                                char* auth_token,
                                                unsigned int* credential_expires_in_seconds);

int extern_smb_clear_credential(char* file_endpoint_uri);

int extern_smb_list_credential(bool is_json);

const char* extern_smb_version();

#ifdef __cplusplus
}
#endif
```

### API description

The following table lists the API commands and their usage. Returned values follow standard C conventions (0 for success, non-zero for errors).

| **Command** | **Description** |
|-------------|-----------------|
| extern_smb_set_credential_oauth_token() | Sets OAuth token credentials for a specific storage endpoint |
| extern_smb_clear_credential() | Removes stored credentials for a storage endpoint |
| extern_smb_list_credential() | Lists all stored credentials |
| extern_smb_version() | Returns the version string of the azfilesauth library |

---

## See also
 
- [Overview of Azure Files identity-based authentication for SMB access](storage-files-active-directory-overview.md)
- [Overview of Azure Files authorization and access control](storage-files-authorization-overview.md)
