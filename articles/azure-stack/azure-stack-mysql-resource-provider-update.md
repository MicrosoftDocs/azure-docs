---
title: Updating the Azure Stack MySQL resource provider | Microsoft Docs
description: Learn how you can update the Azure Stack MySQL resource provider.
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
ms.date: 09/13/2018 
ms.author: jeffgilb 
ms.reviewer: jeffgo 
---

# Update the MySQL resource provider 

*Applies to: Azure Stack integrated systems.*

A new SQL resource provider adapter might be released when Azure Stack builds are updated. While the existing adapter continues to work, we recommend updating to the latest build as soon as possible. 

>[!IMPORTANT]
>You must install updates in the order they're released. You can't skip versions. Refer to the versions list in [Deploy the resource provider prerequisites](.\azure-stack-mysql-resource-provider-deploy.md#prerequisites).

## Update the MySQL resource provider adapter (integrated systems only)

A new SQL resource provider adapter might be released when Azure Stack builds are updated. While the existing adapter continues to work, we recommend updating to the latest build as soon as possible.  
 
To update of the resource provider you use the **UpdateMySQLProvider.ps1** script. The process is similar to the process used to install a resource provider, as described in the [Deploy the resource provider](#deploy-the-resource-provider) section of this article. The script is included with the download of the resource provider. 

The **UpdateMySQLProvider.ps1** script creates a new VM with the latest resource provider code and migrates the settings from the old VM to the new VM. The settings that migrate include database and hosting server information, and the necessary DNS record. 

>[!NOTE]
>We recommend that you download the latest Windows Server 2016 Core image from Marketplace Management. If you need to install an update, you can place a **single** MSU package in the local dependency path. The script will fail if there's more than one MSU file in this location.

>[!NOTE]  
> 

The script requires use of the same arguments that are described for the DeployMySqlProvider.ps1 script. Provide the certificate here as well.  

Following is an example of the *UpdateMySQLProvider.ps1* script that you can run from the PowerShell prompt. Be sure to change the account information and passwords as needed:  

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

# Provide the Azure environment used for deploying Azure Stack. Required only for Azure AD deployments. Supported environment names are AzureCloud, AzureUSGovernment, or AzureChinaCloud. 
$AzureEnvironment = "<EnvironmentName>"

# Point to the directory where the resource provider installation files were extracted. 
$tempDir = 'C:\TEMP\MYSQLRP' 

# The service admin account (can be Azure Active Directory or Active Directory Federation Services). 
$serviceAdmin = "admin@mydomain.onmicrosoft.com" 
$AdminPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force 
$AdminCreds = New-Object System.Management.Automation.PSCredential ($serviceAdmin, $AdminPass) 
 
# Set credentials for the new resource provider VM. 
$vmLocalAdminPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force 
$vmLocalAdminCreds = New-Object System.Management.Automation.PSCredential ("sqlrpadmin", $vmLocalAdminPass) 
 
# And the cloudadmin credential required for privileged endpoint access. 
$CloudAdminPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force 
$CloudAdminCreds = New-Object System.Management.Automation.PSCredential ("$domain\cloudadmin", $CloudAdminPass) 

# Change the following as appropriate. 
$PfxPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force 
 
# Change directory to the folder where you extracted the installation files. 
# Then adjust the endpoints. 
$tempDir\UpdateMySQLProvider.ps1 -AzCredential $AdminCreds ` 
-VMLocalCredential $vmLocalAdminCreds ` 
-CloudAdminCredential $cloudAdminCreds ` 
-PrivilegedEndpoint $privilegedEndpoint ` 
-AzureEnvironment $AzureEnvironment `
-DefaultSSLCertificatePassword $PfxPass ` 
-DependencyFilesLocalPath $tempDir\cert ` 
-AcceptLicense 
``` 
 
### UpdateMySQLProvider.ps1 parameters 
You can specify these parameters in the command line. If you don't, or if any parameter validation fails, you are prompted to provide the required parameters. 

| Parameter Name | Description | Comment or default value | 
| --- | --- | --- | 
| **CloudAdminCredential** | The credential for the cloud administrator, necessary for accessing the privileged endpoint. | _Required_ | 
| **AzCredential** | The credentials for the Azure Stack service admin account. Use the same credentials as you used for deploying Azure Stack. | _Required_ | 
| **VMLocalCredential** |The credentials for the local administrator account of the SQL resource provider VM. | _Required_ | 
| **PrivilegedEndpoint** | The IP address or DNS name of the privileged endpoint. |  _Required_ | 
| **AzureEnvironment** | The Azure environment of the service admin account which you used for deploying Azure Stack. Required only for Azure AD deployments. Supported environment names are **AzureCloud**, **AzureUSGovernment**, or if using a China Azure AD, **AzureChinaCloud**. | AzureCloud |
| **DependencyFilesLocalPath** | Your certificate .pfx file must be placed in this directory as well. | _Optional_ (_mandatory_ for multi-node) | 
| **DefaultSSLCertificatePassword** | The password for the .pfx certificate. | _Required_ | 
| **MaxRetryCount** | The number of times you want to retry each operation if there is a failure.| 2 | 
| **RetryDuration** | The timeout interval between retries, in seconds. | 120 | 
| **Uninstall** | Remove the resource provider and all associated resources (see the following notes). | No | 
| **DebugMode** | Prevents automatic cleanup on failure. | No | 
| **AcceptLicense** | Skips the prompt to accept the GPL license.  (http://www.gnu.org/licenses/old-licenses/gpl-2.0.html) | | 
 

## Next steps
[Maintain MySQL resource provider](azure-stack-mysql-resource-provider-maintain.md)
