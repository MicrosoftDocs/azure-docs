---
title: Using SQL databases on Azure Stack | Microsoft Docs
description: Learn how you can deploy SQL databases as a service on Azure Stack and the quick steps to deploy the SQL Server resource provider adapter.
services: azure-stack
documentationCenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/24/2018
ms.author: jeffgilb
ms.reviewer: jeffgo
---

# Use SQL databases on Microsoft Azure Stack
Use the Azure Stack SQL Server resource provider to expose SQL databases as a service of Azure Stack. The SQL resource provider service runs on the SQL resource provider VM, which is a Windows Server core virtual machine.

## Prerequisites
There are several prerequisites that need to be in place before you can deploy the Azure Stack SQL resource provider. 
Perform the following steps on a computer that can access the privileged endpoint VM:

- If you have not already done so, [register Azure Stack](.\azure-stack-registration.md) with Azure so that you can download Azure marketplace items.
- Add the required Windows Server core VM to the Azure Stack marketplace by downloading the **Windows Server 2016 Server core** image. If you need to install an update, you can place a single .MSU package in the local dependency path. If more than one .MSU file is found, SQL resource provider installation will fail.
- Download SQL resource provider binary and then run the self-extractor to extract the contents to a temporary directory. The resource provider has a minimum corresponding Azure Stack build. Be sure to download the correct binary for the version of Azure Stack that you are running:

    |Azure Stack version|SQL RP version|
    |-----|-----|
    |Version 1804 (1.0.180513.1)|[SQL RP version 1.1.24.0](https://aka.ms/azurestacksqlrp1804)
    |Version 1802 (1.0.180302.1)|[SQL RP version 1.1.18.0](https://aka.ms/azurestacksqlrp1802)|
    |Version 1712 (1.0.180102.3, 1.0.180103.2 or 1.0.180106.1 (integrated systems))|[SQL RP version 1.1.14.0](https://aka.ms/azurestacksqlrp1712)|
    |     |     |
- For integrated systems installations only, you must provide the SQL PaaS PKI certificate as described in the optional PaaS certificates section of [Azure Stack deployment PKI requirements](.\azure-stack-pki-certs.md#optional-paas-certificates), by placing the .pfx file in the location specified by the **DependencyFilesLocalPath** parameter.

## Deploy the SQL resource provider
After you have successfully prepared to install the SQL resource provider by meeting all prerequisites, you can now run the **DeploySqlProvider.ps1** script to deploy the SQL resource provider. The DeploySqlProvider.ps1 script is extracted as part of the SQL resource provider binary that you downloaded corresponding to your Azure Stack version. 

> [!IMPORTANT]
> The system where the script is being run must be a Windows 10 or Windows Server 2016 system with the latest version of the .NET runtime installed.


To deploy the SQL resource provider, open a new elevated (administrative) PowerShell console and change to the directory where you extracted the SQL resource provider binary files.

> [!NOTE]
> Use a new PowerShell console window to avoid problems that might arise from incorrect PowerShell modules that are already loaded on the system.

Run the DeploySqlProvider.ps1 script, which performs the following steps:
- Uploads the certificates and other artifacts to a storage account on Azure Stack.
- Publishes gallery packages so that you can deploy SQL databases through the gallery.
- Publishes a gallery package for deploying hosting servers.
- Deploys a VM by using the Windows Server 2016 image that was created in step 1, and then installs the resource provider.
- Registers a local DNS record that maps to your resource provider VM.
- Registers your resource provider with the local Azure Resource Manager (user and admin).
- Optionally installs a single Windows update during RP installation.

SQL resource provider deployment begins and creates the system.local.sqladapter resource group. It may take up to 75 minutes to complete the four required deployments to this resource group.

### DeploySqlProvider.ps1 parameters
You can specify these parameters in the command line. If you do not, or if any parameter validation fails, you are prompted to provide the required parameters.

| Parameter name | Description | Comment or default value |
| --- | --- | --- |
| **CloudAdminCredential** | The credential for the cloud administrator, necessary for accessing the privileged endpoint. | _Required_ |
| **AzCredential** | The credentials for the Azure Stack service admin account. Use the same credentials as you used for deploying Azure Stack. | _Required_ |
| **VMLocalCredential** | The credentials for the local administrator account of the SQL resource provider VM. | _Required_ |
| **PrivilegedEndpoint** | The IP address or DNS name of the privileged endpoint. |  _Required_ |
| **DependencyFilesLocalPath** | Your certificate .pfx file must be placed in this directory as well. | _Optional_ (_mandatory_ for integrated systems) |
| **DefaultSSLCertificatePassword** | The password for the .pfx certificate. | _Required_ |
| **MaxRetryCount** | The number of times you want to retry each operation if there is a failure.| 2 |
| **RetryDuration** | The timeout interval between retries, in seconds. | 120 |
| **Uninstall** | Removes the resource provider and all associated resources (see the following notes). | No |
| **DebugMode** | Prevents automatic cleanup on failure. | No |

>[!NOTE]
> SKUs can take up to an hour to be visible in the portal. You cannot create a database until the SKU is created.


## Deploy the SQL resource provider using a custom script
To avoid manually entering required information when the DeploySqlProvider.ps1 script runs, you can customize the following script example by changing the default account information and passwords as needed:

```powershell
# Install the AzureRM.Bootstrapper module and set the profile.
Install-Module -Name AzureRm.BootStrapper -Force
Use-AzureRmProfile -Profile 2017-03-09-profile

# Use the NetBIOS name for the Azure Stack domain. On the Azure Stack SDK, the default is AzureStack but could have been changed at install time.
$domain = "AzureStack"

# For integrated systems, use the IP address of one of the ERCS virtual machines
$privilegedEndpoint = "AzS-ERCS01"

# Point to the directory where the resource provider installation files were extracted.
$tempDir = 'C:\TEMP\SQLRP'

# The service admin account (can be Azure Active Directory or Active Directory Federation Services).
$serviceAdmin = "admin@mydomain.onmicrosoft.com"
$AdminPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force
$AdminCreds = New-Object System.Management.Automation.PSCredential ($serviceAdmin, $AdminPass)

# Set credentials for the new resource provider VM local administrator account
$vmLocalAdminPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force
$vmLocalAdminCreds = New-Object System.Management.Automation.PSCredential ("sqlrpadmin", $vmLocalAdminPass)

# And the cloudadmin credential that's required for privileged endpoint access.
$CloudAdminPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force
$CloudAdminCreds = New-Object System.Management.Automation.PSCredential ("$domain\cloudadmin", $CloudAdminPass)

# Change the following as appropriate.
$PfxPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force

# Change directory to the folder where you extracted the installation files.
# Then adjust the endpoints.
$tempDir\DeploySQLProvider.ps1 `
    -AzCredential $AdminCreds `
    -VMLocalCredential $vmLocalAdminCreds `
    -CloudAdminCredential $cloudAdminCreds `
    -PrivilegedEndpoint $privilegedEndpoint `
    -DefaultSSLCertificatePassword $PfxPass `
    -DependencyFilesLocalPath $tempDir\cert
 ```

## Verify the deployment using the Azure Stack portal
The steps in this section can be used to ensure that the SQL resource provider was successfully deployed.

> [!NOTE]
>  After the installation script finishes running, you need to refresh the portal to see the admin blade and gallery items.

1. Sign in to the admin portal as the service administrator.

2. Verify that the deployment succeeded. Go to **Resource Groups**. Then select the **system.\<location\>.sqladapter** resource group. Verify that all four deployments succeeded.

      ![Verify deployment of the SQL resource provider](./media/azure-stack-sql-rp-deploy/sqlrp-verify.png)


## Next steps

[Add hosting servers](azure-stack-sql-resource-provider-hosting-servers.md)
