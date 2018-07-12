---
title: Updating the Azure Stack SQL resource provider | Microsoft Docs
description: Learn how you can update the Azure Stack SQL resource provider.
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
ms.date: 06/11/2018
ms.author: jeffgilb
ms.reviewer: jeffgo
---

# Update the SQL resource provider
A new SQL resource provider might be released when Azure Stack builds are updated. While the existing adapter continues to work, we recommend updating to the latest build as soon as possible. Updates must be installed in order: you cannot skip versions (see the versions list in [Deploy the resource provider prerequisites](.\azure-stack-sql-resource-provider-deploy.md#prerequisites)).

To update of the resource provider you use the *UpdateSQLProvider.ps1* script. The process is similar to the process used to install a resource provider, as described in the [Deploy the resource provider](.\azure-stack-sql-resource-provider-deploy.md) article. The script is included with the download of the resource provider.

The *UpdateSQLProvider.ps1* script creates a new VM with the latest resource provider code and migrates the settings from the old VM to the new VM. The settings that migrate include database and hosting server information, and the necessary DNS record.

The script requires use of the same arguments that are described for the DeploySqlProvider.ps1 script. Provide the certificate here as well. 

We recommend that you download the latest Windows Server 2016 Core image from Marketplace Management. If you need to install an update, you can place a single .MSU package in the local dependency path. If more than one .MSU file is found, the script will fail.

Following is an example of the *UpdateSQLProvider.ps1* script that you can run from the PowerShell prompt. Be sure to change the account information and passwords as needed: 

> [!NOTE]
> The update process only applies to integrated systems.

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

# The service admin account (can be Azure AD or AD FS).
$serviceAdmin = "admin@mydomain.onmicrosoft.com"
$AdminPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force
$AdminCreds = New-Object System.Management.Automation.PSCredential ($serviceAdmin, $AdminPass)

# Set credentials for the new Resource Provider VM.
$vmLocalAdminPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force
$vmLocalAdminCreds = New-Object System.Management.Automation.PSCredential ("sqlrpadmin", $vmLocalAdminPass)

# And the cloudadmin credential required for privileged endpoint access.
$CloudAdminPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force
$CloudAdminCreds = New-Object System.Management.Automation.PSCredential ("$domain\cloudadmin", $CloudAdminPass)

# Change the following as appropriate.
$PfxPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force

# Change directory to the folder where you extracted the installation files.
# Then adjust the endpoints.
. $tempDir\UpdateSQLProvider.ps1 -AzCredential $AdminCreds `
  -VMLocalCredential $vmLocalAdminCreds `
  -CloudAdminCredential $cloudAdminCreds `
  -PrivilegedEndpoint $privilegedEndpoint `
  -DefaultSSLCertificatePassword $PfxPass `
  -DependencyFilesLocalPath $tempDir\cert
 ```

## UpdateSQLProvider.ps1 parameters
You can specify these parameters in the command line. If you do not, or if any parameter validation fails, you are prompted to provide the required parameters.

| Parameter name | Description | Comment or default value |
| --- | --- | --- |
| **CloudAdminCredential** | The credential for the cloud administrator, necessary for accessing the privileged endpoint. | _Required_ |
| **AzCredential** | The credentials for the Azure Stack service admin account. Use the same credentials that you used for deploying Azure Stack. | _Required_ |
| **VMLocalCredential** | The credentials for the local administrator account of the SQL resource provider VM. | _Required_ |
| **PrivilegedEndpoint** | The IP address or DNS name of the privileged endpoint. |  _Required_ |
| **DependencyFilesLocalPath** | Your certificate .pfx file must be placed in this directory as well. | _Optional_ (_mandatory_ for multi-node) |
| **DefaultSSLCertificatePassword** | The password for the .pfx certificate. | _required_ |
| **MaxRetryCount** | The number of times you want to retry each operation if there is a failure.| 2 |
| **RetryDuration** |The timeout interval between retries, in seconds. | 120 |
| **Uninstall** | Removes the resource provider and all associated resources (see the following notes). | No |
| **DebugMode** | Prevents automatic cleanup on failure. | No |


## Next steps

[Maintain the SQL resource provider](azure-stack-sql-resource-provider-maintain.md)
