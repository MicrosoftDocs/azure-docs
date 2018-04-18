---
title: Using SQL databases on Azure Stack | Microsoft Docs
description: Learn how you can deploy SQL databases as a service on Azure Stack and the quick steps to deploy the SQL Server resource provider adapter.
services: azure-stack
documentationCenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 4/24/2018
ms.author: mabrigg
ms.reviewer: jeffgo
---

# Use SQL databases on Microsoft Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Use the SQL Server resource provider adapter to expose SQL databases as a service of [Azure Stack](azure-stack-poc.md). After you install the resource provider and connect it to one or more SQL Server instances, you and your users can create:
- Databases for cloud-native apps.
- Websites that are based on SQL.
- Workloads that are based on SQL.
You don't have to provision a virtual machine (VM) that hosts SQL Server each time.

The resource provider does not support all the database management capabilities of [Azure SQL Database](https://azure.microsoft.com/services/sql-database/). For example, Elastic Database pools and the ability to dial database performance up and down automatically aren't available. However, the resource provider does support similar create, read, update, and delete (CRUD) operations. The API is not compatible with SQL Database.

## SQL resource provider adapter architecture
The resource provider consists of three components:

- **The SQL resource provider adapter VM**, which is a Windows virtual machine that runs the provider services.
- **The resource provider itself**, which processes provisioning requests and exposes database resources.
- **Servers that host SQL Server**, which provide capacity for databases called hosting servers.

You must create one (or more) instances of SQL Server and/or provide access to external SQL Server instances.

> [!NOTE]
> Hosting servers that are installed on Azure Stack integrated systems must be created from a tenant subscription. They can't be created from the default provider subscription. They must be created from the tenant portal or from a PowerShell session with an appropriate sign-in. All hosting servers are chargeable VMs and must have appropriate licenses. The service administrator can be the owner of the tenant subscription.

## Deploy the resource provider

1. If you have not already done so, register your development kit and download the Windows Server 2016 Datacenter Core image downloadable through Marketplace Management. You must use a Windows Server 2016 Core image. You can also use a script to create a [Windows Server 2016 image](https://docs.microsoft.com/azure/azure-stack/azure-stack-add-default-image). (Be sure to select the core option.)

2. Sign in to a host that can access the privileged endpoint VM.

    - On Azure Stack Development Kit installations, sign in to the physical host.

    - On multi-node systems, the host must be a system that can access the privileged endpoint.
    
    >[!NOTE]
    > The system where the script is being run *must* be a Windows 10 or Windows Server 2016 system with the latest version of the .NET runtime installed. Installation fails otherwise. The Azure Stack SDK host meets this criterion.


3. Download the SQL resource provider binary. Then run the self-extractor to extract the contents to a temporary directory.

    >[!NOTE] 
    > The resource provider has a minimum corresponding Azure Stack build. Be sure to download the correct binary for the version of Azure Stack that is running.

    | Azure Stack build | SQL resource provider installer |
    | --- | --- |
    | 1802: 1.0.180302.1 | [SQL RP version 1.1.18.0](https://aka.ms/azurestacksqlrp1802) |
    | 1712: 1.0.180102.3, 1.0.180103.2 or 1.0.180106.1 (multi-node) | [SQL RP version 1.1.14.0](https://aka.ms/azurestacksqlrp1712) |
    | 1711: 1.0.171122.1 | [SQL RP version 1.1.12.0](https://aka.ms/azurestacksqlrp1711) |
    | 1710: 1.0.171028.1 | [SQL RP version 1.1.8.0](https://aka.ms/azurestacksqlrp1710) |
  

4. For the Azure Stack SDK, a self-signed certificate is created as part of this process. For integrated systems, you must provide an appropriate certificate.

   To provide your own certificate, place a .pfx file in the **DependencyFilesLocalPath** as follows:

    - Either a wildcard certificate for \*.dbadapter.\<region\>.\<external fqdn\> or a single site certificate with a common name of sqladapter.dbadapter.\<region\>.\<external fqdn\>.

    - This certificate must be trusted. That is, the chain of trust must exist without requiring intermediate certificates.

    - Only a single certificate file can exist in the directory pointed to by the DependencyFilesLocalPath parameter.

    - The file name must not contain any special characters or spaces.


5. Open a **new** elevated (administrative) PowerShell console and change to the directory where you extracted the files. Use a new window to avoid problems that might arise from incorrect PowerShell modules that are already loaded on the system.

6. [Install Azure PowerShell version 1.2.11](azure-stack-powershell-install.md).

7. Run the DeploySqlProvider.ps1 script, which performs these steps:

    - Uploads the certificates and other artifacts to a storage account on Azure Stack.
    - Publishes gallery packages so that you can deploy SQL databases through the gallery.
    - Publishes a gallery package for deploying hosting servers.
    - Deploys a VM by using the Windows Server 2016 image that was created in step 1, and then installs the resource provider.
    - Registers a local DNS record that maps to your resource provider VM.
    - Registers your resource provider with the local Azure Resource Manager (user and admin).
    - Optionally installs a single Windows update during RP installation

8. We recommend that you download the latest Windows Server 2016 Core image from Marketplace Management. If you need to install an update, you can place a single .MSU package in the local dependency path. If more than one .MSU file is found, the script will fail.


Here's an example you can run from the PowerShell prompt. (Be sure to change the account information and passwords as needed.)

```
# Install the AzureRM.Bootstrapper module, set the profile, and install the AzureRM and AzureStack modules.
Install-Module -Name AzureRm.BootStrapper -Force
Use-AzureRmProfile -Profile 2017-03-09-profile
Install-Module -Name AzureStack -RequiredVersion 1.2.11 -Force

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
. $tempDir\DeploySQLProvider.ps1 -AzCredential $AdminCreds `
  -VMLocalCredential $vmLocalAdminCreds `
  -CloudAdminCredential $cloudAdminCreds `
  -PrivilegedEndpoint $privilegedEndpoint `
  -DefaultSSLCertificatePassword $PfxPass `
  -DependencyFilesLocalPath $tempDir\cert
 ```

### DeploySqlProvider.ps1 parameters
You can specify these parameters in the command line. If you do not, or if any parameter validation fails, you are prompted to provide the required parameters.

| Parameter name | Description | Comment or default value |
| --- | --- | --- |
| **CloudAdminCredential** | The credential for the cloud administrator, necessary for accessing the privileged endpoint. | _Required_ |
| **AzCredential** | The credentials for the Azure Stack service admin account. Use the same credentials as you used for deploying Azure Stack. | _Required_ |
| **VMLocalCredential** | The credentials for the local administrator account of the SQL resource provider VM. | _Required_ |
| **PrivilegedEndpoint** | The IP address or DNS name of the privileged endpoint. |  _Required_ |
| **DependencyFilesLocalPath** | Your certificate .pfx file must be placed in this directory as well. | _Optional_ (_mandatory_ for multi-node) |
| **DefaultSSLCertificatePassword** | The password for the .pfx certificate. | _Required_ |
| **MaxRetryCount** | The number of times you want to retry each operation if there is a failure.| 2 |
| **RetryDuration** | The timeout interval between retries, in seconds. | 120 |
| **Uninstall** | Removes the resource provider and all associated resources (see the following notes). | No |
| **DebugMode** | Prevents automatic cleanup on failure. | No |

>[!NOTE]
> SKUs can take up to an hour to be visible in the portal. You cannot create a database until the SKU is created.

## Verify the deployment using the Azure Stack portal

> [!NOTE]
>  After the installation script finishes running, you need to refresh the portal to see the admin blade.


1. Sign in to the admin portal as the service administrator.

2. Verify that the deployment succeeded. Go to **Resource Groups**. Then select the **system.\<location\>.sqladapter** resource group. Verify that all four deployments succeeded.

      ![Verify deployment of the SQL resource provider](./media/azure-stack-sql-rp-deploy/sqlrp-verify.png)


## Update the SQL resource provider adapter (multi-node only, builds 1710 and later)
A new SQL resource provider adapter might be released when Azure Stack builds are updated. While the existing adapter continues to work, we recommend updating to the latest build as soon as possible. Updates must be installed in order: you cannot skip versions (see the table in step 3 of [Deploy the resource provider](#deploy-the-resource-provider)).

To update of the resource provider you use the *UpdateSQLProvider.ps1* script. The process is similar to the process used to install a resource provider, as described in the [Deploy the resource provider](#deploy-the-resource-provider) section of this article. The script is included with the download of the resource provider.

The *UpdateSQLProvider.ps1* script creates a new VM with the latest resource provider code and migrates the settings from the old VM to the new VM. The settings that migrate include database and hosting server information, and the necessary DNS record.

The script requires use of the same arguments that are described for the DeploySqlProvider.ps1 script. Provide the certificate here as well. 

We recommend that you download the latest Windows Server 2016 Core image from Marketplace Management. If you need to install an update, you can place a single .MSU package in the local dependency path. If more than one .MSU file is found, the script will fail.

Following is an example of the *UpdateSQLProvider.ps1* script that you can run from the PowerShell prompt. Be sure to change the account information and passwords as needed: 

> [!NOTE]
> The update process only applies to integrated systems.

```
# Install the AzureRM.Bootstrapper module, set the profile, and install the AzureRM and AzureStack modules.
Install-Module -Name AzureRm.BootStrapper -Force
Use-AzureRmProfile -Profile 2017-03-09-profile
Install-Module -Name AzureStack -RequiredVersion 1.2.11 -Force

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

### UpdateSQLProvider.ps1 parameters
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


## Collect diagnostic logs
The SQL resource provider is a locked down virtual machine. If it becomes necessary to collect logs from the virtual machine, a PowerShell Just Enough Administration (JEA) endpoint _DBAdapterDiagnostics_ is provided for that purpose. There are two commands available through this endpoint:

* Get-AzsDBAdapterLog - Prepares a zip package containing RP diagnostics logs and puts it on the session user drive. The command can be called with no parameters and will collect the last four hours of logs.
* Remove-AzsDBAdapterLog - Cleans up existing log packages on the resource provider VM

A user account called _dbadapterdiag_ is created during RP deployment or update for connecting to the diagnostics endpoint for extracting RP logs. The password of this account is the same as the password provided for the local administrator account during deployment/update.

To use these commands, you will need to create a remote PowerShell session to the resource provider virtual machine and invoke the command. You can optionally provide FromDate and ToDate parameters. If you don't specify one or both of these, the FromDate will be four hours before the current time, and the ToDate will be the current time.

This sample script demonstrates the use of these commands:

```
# Create a new diagnostics endpoint session.
$databaseRPMachineIP = '<RP VM IP>'
$diagnosticsUserName = 'dbadapterdiag'
$diagnosticsUserPassword = '<see above>'

$diagCreds = New-Object System.Management.Automation.PSCredential `
        ($diagnosticsUserName, $diagnosticsUserPassword)
$session = New-PSSession -ComputerName $databaseRPMachineIP -Credential $diagCreds `
        -ConfigurationName DBAdapterDiagnostics

# Sample captures logs from the previous one hour
$fromDate = (Get-Date).AddHours(-1)
$dateNow = Get-Date
$sb = {param($d1,$d2) Get-AzSDBAdapterLog -FromDate $d1 -ToDate $d2}
$logs = Invoke-Command -Session $session -ScriptBlock $sb -ArgumentList $fromDate,$dateNow

# Copy the logs
$sourcePath = "User:\{0}" -f $logs
$destinationPackage = Join-Path -Path (Convert-Path '.') -ChildPath $logs
Copy-Item -FromSession $session -Path $sourcePath -Destination $destinationPackage

# Cleanup logs
$cleanup = Invoke-Command -Session $session -ScriptBlock {Remove- AzsDBAdapterLog }
# Close the session
$session | Remove-PSSession
```

## Maintenance operations (integrated systems)
The SQL resource provider is a locked down virtual machine. Updating the resource provider virtual machine's security can be done through the PowerShell Just Enough Administration (JEA) endpoint _DBAdapterMaintenance_.

A script is provided with the RP's installation package to facilitate these operations.

### Update the virtual machine operating system
There are several ways to update the Windows Server VM:
* Install the latest resource provider package using a currently patched Windows Server 2016 Core image
* Install a Windows Update package during the installation or update of the RP


### Update the virtual machine Windows Defender definitions

Follow these steps to update the Defender definitions:

1. Download the Windows Defender definitions update from [Windows Defender Definition](https://www.microsoft.com/en-us/wdsi/definitions)

    On that page, under “Manually download and install the definitions” download “Windows Defender Antivirus for Windows 10 and Windows 8.1” 64-bit file. 
    
    Direct link: https://go.microsoft.com/fwlink/?LinkID=121721&arch=x64

2. Create a PowerShell session to the SQL RP adapter virtual machine’s maintenance endpoint
3. Copy the definitions update file to the DB adapter machine using the maintenance endpoint session
4. On the maintenance PowerShell session invoke the _Update-DBAdapterWindowsDefenderDefinitions_ command
5. After install, it is recommended to remove the used definitions update file. It can be removed on the maintenance session using the _Remove-ItemOnUserDrive)_ command.


Here is a sample script to update the Defender definitions (substitute the address or name of the virtual machine with the actual value):

```
# Set credentials for the diagnostic user
$diagPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force
$diagCreds = New-Object System.Management.Automation.PSCredential `
    ("dbadapterdiag", $vmLocalAdminPass)$diagCreds = Get-Credential

# Public IP Address of the DB adapter machine
$databaseRPMachine  = "XX.XX.XX.XX"
$localPathToDefenderUpdate = "C:\DefenderUpdates\mpam-fe.exe"
 
# Download Windows Defender update definitions file from https://www.microsoft.com/en-us/wdsi/definitions. 
Invoke-WebRequest -Uri https://go.microsoft.com/fwlink/?LinkID=121721&arch=x64 `
    -Outfile $localPathToDefenderUpdate 

# Create session to the maintenance endpoint
$session = New-PSSession -ComputerName $databaseRPMachine `
    -Credential $diagCreds -ConfigurationName DBAdapterMaintenance
# Copy defender update file to the db adapter machine
Copy-Item -ToSession $session -Path $localPathToDefenderUpdate `
     -Destination "User:\mpam-fe.exe"
# Install the update file
Invoke-Command -Session $session -ScriptBlock `
    {Update-AzSDBAdapterWindowsDefenderDefinitions -DefinitionsUpdatePackageFile "User:\mpam-fe.exe"}
# Cleanup the definitions package file and session
Invoke-Command -Session $session -ScriptBlock `
    {Remove-AzSItemOnUserDrive -ItemPath "User:\mpam-fe.exe"}
$session | Remove-PSSession
```

## Remove the SQL resource provider adapter

To remove the resource provider, it is essential to first remove any dependencies.

1. Ensure that you have the original deployment package that you downloaded for this version of the SQL resource provider adapter.

2. All user databases must be deleted from the resource provider. (Deleting the user databases doesn't delete the data.) This task should be performed by the users themselves.

3. The administrator must delete the hosting servers from the SQL resource provider adapter.

4. The administrator must delete any plans that reference the SQL resource provider adapter.

5. The administrator must delete any SKUs and quotas that are associated with the SQL resource provider adapter.

6. Rerun the deployment script with the following elements:
    - The -Uninstall parameter
    - The Azure Resource Manager endpoints
    - The DirectoryTenantID
    - The credentials for the service administrator account


## Next steps

[Add hosting servers](azure-stack-sql-resource-provider-hosting-servers.md) and [create databases](azure-stack-sql-resource-provider-databases.md).

Try other [PaaS services](azure-stack-tools-paas-services.md) like the [MySQL Server resource provider](azure-stack-mysql-resource-provider-deploy.md) and the [App Services resource provider](azure-stack-app-service-overview.md).
