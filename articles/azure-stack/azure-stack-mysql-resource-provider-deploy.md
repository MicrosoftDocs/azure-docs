---
title: Using MySQL databases on Azure Stack | Microsoft Docs
description: Learn how you can deploy MySQL databases as a service on Azure Stack and the quick steps to deploy the MySQL Server resource provider adapter. 
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
ms.date: 06/14/2018 
ms.author: jeffgilb 
ms.reviewer: jeffgo 
--- 

# Use MySQL databases on Microsoft Azure Stack
Use the Azure Stack MySQL Server resource provider to expose MySQL databases as a service of Azure Stack. The MySQL resource provider service runs on the MySQL resource provider VM, which is a Windows Server core virtual machine.

## Deploy the resource provider 
1. If you have not already done so, register your development kit and download the Windows Server 2016 Datacenter Core image downloadable through Marketplace management. You must use a Windows Server 2016 Core image. You can also use a script to create a [Windows Server 2016 image](https://docs.microsoft.com/azure/azure-stack/azure-stack-add-default-image). (Be sure to select the core option.) 

2. Sign in to a host that can access the privileged endpoint VM:
    - On Azure SDK installations, sign in to the physical host.  
    - On integrated systems, the host must be a system that can access the privileged endpoint. 
    
    >[!NOTE] 
    > The system on which the script is being run *must* be a Windows 10 or Windows Server 2016 system with the latest version of the .NET runtime installed. Installation fails otherwise. The Azure Stack ASDK host meets this criterion. 
    
3. Download the MySQL resource provider binary. Then run the self-extractor to extract the contents to a temporary directory. 
    >[!NOTE]  
    > The resource provider has a minimum corresponding Azure Stack build. Be sure to download the correct binary for the version of Azure Stack that is running.

    | Azure Stack version | MySQL RP version| 
    | --- | --- | 
    | Version 1804 (1.0.180513.1)|[MySQL RP version 1.1.24.0](https://aka.ms/azurestackmysqlrp1804) | 
    | Version 1802 (1.0.180302.1) | [MySQL RP version 1.1.18.0](https://aka.ms/azurestackmysqlrp1802) | 
    | Version 1712 (1.0.180102.3 or 1.0.180106.1 (integrated systems)) | [MySQL RP version 1.1.14.0](https://aka.ms/azurestackmysqlrp1712) | 

4.  For the ASDK, a self-signed certificate is created as part of this process. For integrated systems, you must provide an appropriate certificate. If you need to provide your own certificate, place a .pfx file in the **DependencyFilesLocalPath** that meets the following criteria: 
    - Either a wildcard certificate for \*.dbadapter.\<region\>.\<external fqdn\> or a single site certificate with a common name of mysqladapter.dbadapter.\<region\>.\<external fqdn\>. 
    - This certificate must be trusted. That is, the chain of trust must exist without requiring intermediate certificates. 
    - Only a single certificate file exists in the DependencyFilesLocalPath. 
    - The file name must not contain any special characters or spaces. 

5. Open a **new** elevated (administrative) PowerShell console. Then change to the directory where you extracted the files. Use a new window to avoid problems that might arise from incorrect PowerShell modules that are already loaded on the system. 

6. Run the **DeployMySqlProvider.ps1** script. The script performs these steps: 
    - Downloads the MySQL connector binary (this can be provided offline). 
    - Uploads the certificates and other artifacts to a storage account on Azure Stack. 
    - Publishes gallery packages so that you can deploy SQL databases through the gallery. 
    - Publishes a gallery package for deploying hosting servers. 
    - Deploys a VM usin a Windows Server 2016 Azure Stack marketplace image and installs the resource provider. 
    - Registers a local DNS record that maps to your resource provider VM. 
    - Registers your resource provider with the local Azure Resource Manager (tenant and admin). 

    You can specifiy the required parameters on the command line or run the script without any parameters, and then enter them when prompted. 

    Here's an example you can run from the PowerShell prompt. Be sure to change the account information and passwords as needed: 

    ```powershell 
    # Install the AzureRM.Bootstrapper module and set the profile. 
    Install-Module -Name AzureRm.BootStrapper -Force 
    Use-AzureRmProfile -Profile 2017-03-09-profile 

    # Use the NetBIOS name for the Azure Stack domain. On the Azure Stack SDK, the default is AzureStack but could have been changed at install time. 
    $domain = "AzureStack"  

    # For integrated systems, use the IP address of one of the ERCS virtual machines 
    $privilegedEndpoint = "AzS-ERCS01" 

    # Point to the directory where the resource provider installation files were extracted. 
    $tempDir = 'C:\TEMP\MYSQLRP' 

    # The service admin account (can be Azure Active Directory or Active Directory Federation Services). 
    $serviceAdmin = "admin@mydomain.onmicrosoft.com" 
    $AdminPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force 
    $AdminCreds = New-Object System.Management.Automation.PSCredential ($serviceAdmin, $AdminPass) 

    # Set the credentials for the new resource provider VM local administrator account 
    $vmLocalAdminPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force 
    $vmLocalAdminCreds = New-Object System.Management.Automation.PSCredential ("mysqlrpadmin", $vmLocalAdminPass) 

    # And the cloudadmin credential required for privileged endpoint access. 
    $CloudAdminPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force 
    $CloudAdminCreds = New-Object System.Management.Automation.PSCredential ("$domain\cloudadmin", $CloudAdminPass) 

    # Change the following as appropriate. 
    $PfxPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force 

    # Run the installation script from the folder where you extracted the installation files. 
    # Find the ERCS01 IP address first, and make sure the certificate 
    # file is in the specified directory. 
    $tempDir\DeployMySQLProvider.ps1 -AzCredential $AdminCreds ` 
    VMLocalCredential $vmLocalAdminCreds ` 
    CloudAdminCredential $cloudAdminCreds ` 
    PrivilegedEndpoint $privilegedEndpoint ` 
    DefaultSSLCertificatePassword $PfxPass ` 
    DependencyFilesLocalPath $tempDir\cert ` 
    AcceptLicense 
    ``` 

### DeployMySqlProvider.ps1 parameters 
You can specify these parameters in the command line. If you do not, or if any parameter validation fails, you are prompted to provide the required parameters. 

| Parameter name | Description | Comment or default value | 
| --- | --- | --- | 
| **CloudAdminCredential** | The credential for the cloud administrator, necessary for accessing the privileged endpoint. | _Required_ | 
| **AzCredential** | The credentials for the Azure Stack service admin account. Use the same credentials that you used for deploying Azure Stack. | _Required_ | 
| **VMLocalCredential** | The credentials for the local administrator account of the MySQL resource provider VM. | _Required_ | 
| **PrivilegedEndpoint** | The IP address or DNS name of the privileged endpoint. |  _Required_ | 
| **DependencyFilesLocalPath** | Path to a local share that contains [mysql-connector-net-6.10.5.msi](https://dev.mysql.com/get/Downloads/Connector-Net/mysql-connector-net-6.10.5.msi). If you provide one of these paths, the certificate file must be placed in this directory as well. | _Optional_ (_mandatory_ for multi-node) | 
| **DefaultSSLCertificatePassword** | The password for the .pfx certificate. | _Required_ | 
| **MaxRetryCount** | The number of times you want to retry each operation if there is a failure.| 2 | 
| **RetryDuration** | The timeout interval between retries, in seconds. | 120 | 
| **Uninstall** | Removes the resource provider and all associated resources (see the following notes). | No | 
| **DebugMode** | Prevents automatic cleanup on failure. | No | 
| **AcceptLicense** | Skips the prompt to accept the GPL license.  (http://www.gnu.org/licenses/old-licenses/gpl-2.0.html) | | 

> [!NOTE] 
> SKUs can take up to an hour to be visible in the portal. You cannot create a database until the SKU is created. 

## Verify the deployment by using the Azure Stack portal 
> [!NOTE] 
>  After the installation script finishes running, you  need to refresh the portal to see the admin blade. 

1. Sign in to the admin portal as the service administrator. 
2. Verify that the deployment succeeded. Go to **Resource Groups**, and then select the **system.\<location\>.mysqladapter** resource group. Verify that all four deployments succeeded:

      ![Verify deployment of the MySQL RP](./media/azure-stack-mysql-rp-deploy/mysqlrp-verify.png) 


## Next steps
[Add hosting servers](azure-stack-mysql-resource-provider-hosting-servers.md)
