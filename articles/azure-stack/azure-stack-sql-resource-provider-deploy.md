---
title: Using SQL databases on Azure Stack | Microsoft Docs
description: Learn how you can deploy SQL databases as a service on Azure Stack and the quick steps to deploy the SQL Server resource provider adapter.
services: azure-stack
documentationCenter: ''
author: JeffGoldner
manager: bradleyb
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/09/2018
ms.author: JeffGo

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

You must create one (or more) intances of SQL Server and/or provide access to external SQL Server instances.

## Deploy the resource provider

1. If you have not already done so, register your development kit and download the Windows Server 2016 Datacenter Core image downloadable through Marketplace Management. You must use a Windows Server 2016 Core image. You can also use a script to create a [Windows Server 2016 image](https://docs.microsoft.com/azure/azure-stack/azure-stack-add-default-image). (Be sure to select the core option). The .NET 3.5 runtime is no longer required.

2. Sign in to a host that can access the privileged endpoint VM.

    - On Azure Stack Development Kit installations, sign in to the physical host.

    - On multi-node systems, the host must be a system that can access the privileged endpoint.
    
    >[!NOTE]
    > The system where the script is being run *must* be a Windows 10 or Windows Server 2016 system with the latest version of the .NET runtime installed. Installation fails otherwise. The Azure Stack SDK host meets this criterion.


3. Download the SQL resource provider binary. Then run the self-extractor to extract the contents to a temporary directory.

    >[!NOTE] 
    > The resource provider build corresponds to Azure Stack builds. Be sure to download the correct binary for the version of Azure Stack that is running.

    | Azure Stack build | SQL resource provider installer |
    | --- | --- |
    |1.0.180102.3, 1.0.180103.2 or 1.0.180106.1 (multi-node) | [SQL RP version 1.1.14.0](https://aka.ms/azurestacksqlrp1712) |
    | 1.0.171122.1 | [SQL RP version 1.1.12.0](https://aka.ms/azurestacksqlrp1711) |
    | 1.0.171028.1 | [SQL RP version 1.1.8.0](https://aka.ms/azurestacksqlrp1710) |
  

4. The Azure Stack root certificate is retrieved from the privileged endpoint. For the Azure Stack SDK, a self-signed certificate is created as part of this process. For multi-node, you must provide an appropriate certificate.

   To provide your own certificate, place a .pfx file in the **DependencyFilesLocalPath** as follows:

    - Either a wildcard certificate for \*.dbadapter.\<region\>.\<external fqdn\> or a single site certificate with a common name of sqladapter.dbadapter.\<region\>.\<external fqdn\>.

    - This certificate must be trusted. That is, the chain of trust must exist without requiring intermediate certificates.

    - Only a single certificate file exists in the DependencyFilesLocalPath.

    - The file name must not contain any special characters.


5. Open a **new** elevated (administrative) PowerShell console and change to the directory where you extracted the files. Use a new window to avoid problems that might arise from incorrect PowerShell modules that are already loaded on the system.

6. [Install Azure PowerShell version 1.2.11](azure-stack-powershell-install.md).

7. Run the DeploySqlProvider.ps1 script, which performs these steps:

    - Uploads the certificates and other artifacts to a storage account on Azure Stack.
    - Publishes gallery packages so that you can deploy SQL databases through the gallery.
    - Publishes a gallery package for deploying hosting servers.
    - Deploys a VM by using the Windows Server 2016 image that was created in step 1, and then installs the resource provider.
    - Registers a local DNS record that maps to your resource provider VM.
    - Registers your resource provider with the local Azure Resource Manager (user and admin).

> [!NOTE]
> If the installation takes more than 90 minutes, it might fail. If it fails, you see a failure message on the screen and in the log file, but the deployment is retried from the failing step. Systems that do not meet the recommended memory and vCPU specifications might not be able to deploy the SQL resoure provider.
>

Here's an example you can run from the PowerShell prompt. (Be sure to change the account information and passwords as needed.)

```
# Install the AzureRM.Bootstrapper module, set the profile, and install the AzureRM and AzureStack modules.
Install-Module -Name AzureRm.BootStrapper -Force
Use-AzureRmProfile -Profile 2017-03-09-profile
Install-Module -Name AzureStack -RequiredVersion 1.2.11 -Force

# Use the NetBIOS name for the Azure Stack domain. On the Azure Stack SDK, the default is AzureStack and the default prefix is AzS.
# For integrated systems, the domain and the prefix are the same.
$domain = "AzureStack"
$prefix = "AzS"
$privilegedEndpoint = "$prefix-ERCS01"

# Point to the directory where the resource provider installation files were extracted.
$tempDir = 'C:\TEMP\SQLRP'

# The service admin account (can be Azure Active Directory or Active Directory Federation Services).
$serviceAdmin = "admin@mydomain.onmicrosoft.com"
$AdminPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force
$AdminCreds = New-Object System.Management.Automation.PSCredential ($serviceAdmin, $AdminPass)

# Set credentials for the new Resource Provider VM.
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


## Verify the deployment using the Azure Stack portal

> [!NOTE]
>  After the installation script finishes running, you need to refresh the portal to see the admin blade.


1. Sign in to the admin portal as the service administrator.

2. Verify that the deployment succeeded. Go to **Resource Groups**. Then select the **system.\<location\>.sqladapter** resource group. Verify that all four deployments succeeded.

      ![Verify deployment of the SQL resource provider](./media/azure-stack-sql-rp-deploy/sqlrp-verify.png)


## Update the SQL resource provider adapter (multi-node only, builds 1710 and later)
Whenever the Azure Stack build is updated, a new SQL resource provider adapter is released. The existing adapter might continue to work. However, we recommend updating to the latest build as soon as possible after the Azure Stack is updated. 

The update process is similar to the installation process that's described earlier. You create a new VM with the latest resource provider code. In addition, you migrate settings to this new instance, including database and hosting server information. You also migrate the necessary DNS record.

Use the UpdateSQLProvider.ps1 script with the same arguments that we described earlier. You must provide the certificate here as well.

> [!NOTE]
> This update process is only supported on multi-node systems.

```
# Install the AzureRM.Bootstrapper module, set the profile, and install the AzureRM and AzureStack modules.
Install-Module -Name AzureRm.BootStrapper -Force
Use-AzureRmProfile -Profile 2017-03-09-profile
Install-Module -Name AzureStack -RequiredVersion 1.2.11 -Force

# Use the NetBIOS name for the Azure Stack domain. On the Azure Stack SDK, the default is AzureStack and the default prefix is AzS.
# For integrated systems, the domain and the prefix are the same.
$domain = "AzureStack"
$prefix = "AzS"
$privilegedEndpoint = "$prefix-ERCS01"

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
