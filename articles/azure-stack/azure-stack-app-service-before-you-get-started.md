---
title: Before you deploy App Service on Azure Stack | Microsoft Docs
description: Steps to complete before you deploy App Service on Azure Stack
services: azure-stack
documentationcenter: ''
author: apwestgarth
manager: stefsch
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: app-service
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/20/2018
ms.author: anwestg

---

# Before you get started with App Service on Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Before you deploy Azure App Service on Azure Stack, you must complete the prerequisite steps in this article.

> [!IMPORTANT]
> Apply the 1807 update to your Azure Stack integrated system or deploy the latest Azure Stack Development Kit (ASDK) before you deploy Azure App Service 1.3.

## Download the installer and helper scripts

1. Download the [App Service on Azure Stack deployment helper scripts](https://aka.ms/appsvconmashelpers).
2. Download the [App Service on Azure Stack installer](https://aka.ms/appsvconmasinstaller).
3. Extract the files from the helper scripts .zip file. The following files and folders are extracted:

   - Common.ps1
   - Create-AADIdentityApp.ps1
   - Create-ADFSIdentityApp.ps1
   - Create-AppServiceCerts.ps1
   - Get-AzureStackRootCert.ps1
   - Remove-AppService.ps1
   - Modules folder
     - GraphAPI.psm1

## High availability

The Azure Stack 1802 update added support for fault domains. New deployments of Azure App Service on Azure Stack will be distributed across fault domains and provide fault tolerance.

For existing deployments of Azure App Service on Azure Stack, which were deployed before the 1802 update, see the [Rebalance an App Service resource provider across fault domains](azure-stack-app-service-fault-domain-update.md) article.

Additionally, deploy the required file server and SQL Server instances in a highly available configuration.

## Get certificates

### Azure Resource Manager root certificate for Azure Stack

Open an elevated PowerShell session on a computer that can reach the privileged endpoint on the Azure Stack Integrated System or Azure Stack Development Kit Host.

Run the *Get-AzureStackRootCert.ps1* script from the folder where you extracted the helper scripts. The script creates a root certificate in the same folder as the script that App Service needs for creating certificates.

When you run the following PowerShell command you'll have to provide the privileged endpoint and the credentials for the AzureStack\CloudAdmin.

```PowerShell
    Get-AzureStackRootCert.ps1
```

#### Get-AzureStackRootCert.ps1 script parameters

| Parameter | Required or optional | Default value | Description |
| --- | --- | --- | --- |
| PrivilegedEndpoint | Required | AzS-ERCS01 | Privileged endpoint |
| CloudAdminCredential | Required | AzureStack\CloudAdmin | Domain account credential for Azure Stack cloud admins |

### Certificates required for ASDK deployment of Azure App Service

The *Create-AppServiceCerts.ps1* script works with the Azure Stack certificate authority to create the four certificates that App Service needs.

| File name | Use |
| --- | --- |
| _.appservice.local.azurestack.external.pfx | App Service default SSL certificate |
| api.appservice.local.azurestack.external.pfx | App Service API SSL certificate |
| ftp.appservice.local.azurestack.external.pfx | App Service publisher SSL certificate |
| sso.appservice.local.azurestack.external.pfx | App Service identity application certificate |

To create the certificates, follow these steps:

1. Sign in to the Azure Stack Development Kit host using the AzureStack\AzureStackAdmin account.
2. Open an elevated PowerShell session.
3. Run the *Create-AppServiceCerts.ps1* script from the folder where you extracted the helper scripts. This script creates four certificates in the same folder as the script that App Service needs for creating certificates.
4. Enter a password to secure the .pfx files, and make a note of it. You'll have to enter it in the App Service on Azure Stack installer.

#### Create-AppServiceCerts.ps1 script parameters

| Parameter | Required or optional | Default value | Description |
| --- | --- | --- | --- |
| pfxPassword | Required | Null | Password that helps protect the certificate private key |
| DomainName | Required | local.azurestack.external | Azure Stack region and domain suffix |

### Certificates required for Azure Stack production deployment of Azure App Service

To run the resource provider in production, you must provide the following certificates:

- Default domain certificate
- API certificate
- Publishing certificate
- Identity certificate

#### Default domain certificate

The default domain certificate is placed on the Front End role. User applications for wildcard or default domain request to Azure App Service use this certificate. The certificate is also used for source control operations (Kudu).

The certificate must be in .pfx format and should be a three-subject wildcard certificate. This requirement allows one certificate to cover both the default domain and the SCM endpoint for source control operations.

| Format | Example |
| --- | --- |
| \*.appservice.\<region\>.\<DomainName\>.\<extension\> | \*.appservice.redmond.azurestack.external |
| \*.scm.appservice.<region>.<DomainName>.<extension> | \*.scm.appservice.redmond.azurestack.external |
| \*.sso.appservice.<region>.<DomainName>.<extension> | \*.sso.appservice.redmond.azurestack.external |

#### API certificate

The API certificate is placed on the Management role. The resource provider uses it to help secure API calls. The certificate for publishing must contain a subject that matches the API DNS entry.

| Format | Example |
| --- | --- |
| api.appservice.\<region\>.\<DomainName\>.\<extension\> | api.appservice.redmond.azurestack.external |

#### Publishing certificate

The certificate for the Publisher role secures the FTPS traffic for application owners when they upload content. The certificate for publishing must contain a subject that matches the FTPS DNS entry.

| Format | Example |
| --- | --- |
| ftp.appservice.\<region\>.\<DomainName\>.\<extension\> | ftp.appservice.redmond.azurestack.external |

#### Identity certificate

The certificate for the identity application enables:

- Integration between the Azure Active Directory (Azure AD) or Active Directory Federation Services (AD FS) directory, Azure Stack, and App Service to support integration with the compute resource provider.
- Single sign-on scenarios for advanced developer tools within Azure App Service on Azure Stack.

The certificate for identity must contain a subject that matches the following format.

| Format | Example |
| --- | --- |
| sso.appservice.\<region\>.\<DomainName\>.\<extension\> | sso.appservice.redmond.azurestack.external |

## Virtual network

Azure App Service on Azure Stack lets you deploy the resource provider to an existing virtual network or lets you create a virtual network as part of the deployment. Using an existing virtual network enables the use of internal IPs to connect to the file server and SQL server required by Azure App Service on Azure Stack. The virtual network must be configured with the following address range and subnets before installing Azure App Service on Azure Stack:

Virtual Network - /16

Subnets

- ControllersSubnet /24
- ManagementServersSubnet /24
- FrontEndsSubnet /24
- PublishersSubnet /24
- WorkersSubnet /21

## Prepare the file server

Azure App Service requires the use of a file server. For production deployments, the file server must be configured to be highly available and capable of handling failures.

For Azure Stack Development Kit deployments only, you can use the [example Azure Resource Manager deployment template](https://aka.ms/appsvconmasdkfstemplate) to deploy a configured single-node file server. The single-node file server will be in a workgroup.

>[!IMPORTANT]
> If you choose to deploy App Service in an existing Virtual Network the File Server should be deployed into a separate Subnet from App Service.

### Provision groups and accounts in Active Directory

1. Create the following Active Directory global security groups:

   - FileShareOwners
   - FileShareUsers

2. Create the following Active Directory accounts as service accounts:

   - FileShareOwner
   - FileShareUser

   As a security best practice, the users for these accounts (and for all web roles) should be unique  and have strong usernames and passwords. Set the passwords with the following conditions:

   - Enable **Password never expires**.
   - Enable **User cannot change password**.
   - Disable **User must change password at next logon**.

3. Add the accounts to the group memberships as follows:

   - Add **FileShareOwner** to the **FileShareOwners** group.
   - Add **FileShareUser** to the **FileShareUsers** group.

### Provision groups and accounts in a workgroup

>[!NOTE]
> When you're configuring a file server, run all the following commands from an **Administrator Command Prompt**. <br>***Don't use PowerShell.***

When you use the Azure Resource Manager template, the users are already created.

1. Run the following commands to create the FileShareOwner and FileShareUser accounts. Replace `<password>` with your own values.

   ``` DOS
   net user FileShareOwner <password> /add /expires:never /passwordchg:no
   net user FileShareUser <password> /add /expires:never /passwordchg:no
   ```

2. Set the passwords for the accounts to never expire by running the following WMIC commands:

   ``` DOS
   WMIC USERACCOUNT WHERE "Name='FileShareOwner'" SET PasswordExpires=FALSE
   WMIC USERACCOUNT WHERE "Name='FileShareUser'" SET PasswordExpires=FALSE
   ```

3. Create the local groups FileShareUsers and FileShareOwners, and add the accounts in the first step to them:

   ``` DOS
   net localgroup FileShareUsers /add
   net localgroup FileShareUsers FileShareUser /add
   net localgroup FileShareOwners /add
   net localgroup FileShareOwners FileShareOwner /add
   ```

### Provision the content share

The content share contains tenant website content. The procedure to provision the content share on a single file server is the same for both Active Directory and Workgroup environments. But it's different for a failover cluster in Active Directory.

#### Provision the content share on a single file server (Active Directory or workgroup)

On a single file server, run the following commands at an elevated command prompt. Replace the value for `C:\WebSites` with the corresponding paths in your environment.

```DOS
set WEBSITES_SHARE=WebSites
set WEBSITES_FOLDER=C:\WebSites
md %WEBSITES_FOLDER%
net share %WEBSITES_SHARE% /delete
net share %WEBSITES_SHARE%=%WEBSITES_FOLDER% /grant:Everyone,full
```

### Configure access control to the shares

Run the following commands at an elevated command prompt on the file server or on the failover cluster node, which is the current cluster resource owner. Replace values in italics with values that are specific to your environment.

#### Active Directory

```DOS
set DOMAIN=<DOMAIN>
set WEBSITES_FOLDER=C:\WebSites
icacls %WEBSITES_FOLDER% /reset
icacls %WEBSITES_FOLDER% /grant Administrators:(OI)(CI)(F)
icacls %WEBSITES_FOLDER% /grant %DOMAIN%\FileShareOwners:(OI)(CI)(M)
icacls %WEBSITES_FOLDER% /inheritance:r
icacls %WEBSITES_FOLDER% /grant %DOMAIN%\FileShareUsers:(CI)(S,X,RA)
icacls %WEBSITES_FOLDER% /grant *S-1-1-0:(OI)(CI)(IO)(RA,REA,RD)
```

#### Workgroup

```DOS
set WEBSITES_FOLDER=C:\WebSites
icacls %WEBSITES_FOLDER% /reset
icacls %WEBSITES_FOLDER% /grant Administrators:(OI)(CI)(F)
icacls %WEBSITES_FOLDER% /grant FileShareOwners:(OI)(CI)(M)
icacls %WEBSITES_FOLDER% /inheritance:r
icacls %WEBSITES_FOLDER% /grant FileShareUsers:(CI)(S,X,RA)
icacls %WEBSITES_FOLDER% /grant *S-1-1-0:(OI)(CI)(IO)(RA,REA,RD)
```

## Prepare the SQL Server instance

For the Azure App Service on Azure Stack hosting and metering databases, you must prepare a SQL Server instance to hold the App Service databases.

For Azure Stack Development Kit deployments, you can use SQL Server Express 2014 SP2 or later.

For production and high-availability purposes, you should use a full version of SQL Server 2014 SP2 or later, enable mixed-mode authentication, and deploy in a [highly available configuration](https://docs.microsoft.com/sql/sql-server/failover-clusters/high-availability-solutions-sql-server).

The SQL Server instance for Azure App Service on Azure Stack must be accessible from all App Service roles. You can deploy SQL Server within the Default Provider Subscription in Azure Stack. Or you can make use of the existing infrastructure within your organization (as long as there is connectivity to Azure Stack). If you're using an Azure Marketplace image, remember to configure the firewall accordingly.

>[!NOTE]
> A number of SQL IaaS virtual machine images are available through the Marketplace Management feature. Make sure you always download the latest version of the SQL IaaS Extension before you deploy a VM using a Marketplace item. The SQL images are the same as the SQL VMs that are available in Azure. For SQL VMs created from these images, the IaaS extension and corresponding portal enhancements provide features such as automatic patching and backup capabilities.
>
For any of the SQL Server roles, you can use a default instance or a named instance. If you use a named instance, be sure to manually start the SQL Server Browser service and open port 1434.

>[!IMPORTANT]
> If you choose to deploy App Service in an existing Virtual Network the SQL Server should be deployed into a separate Subnet from App Service and the File Server.
>

## Create an Azure Active Directory application

Configure an Azure AD service principal to support the following operations:

- Virtual machine scale set integration on worker tiers.
- SSO for the Azure Functions portal and advanced developer tools.

These steps apply to Azure AD-secured Azure Stack environments only.

Administrators must configure SSO to:

- Enable the advanced developer tools within App Service (Kudu).
- Enable the use of the Azure Functions portal experience.

Follow these steps:

1. Open a PowerShell instance as azurestack\AzureStackAdmin.
2. Go to the location of the scripts that you downloaded and extracted in the [prerequisite step](https://docs.microsoft.com/azure/azure-stack/azure-stack-app-service-before-you-get-started#download-the-azure-app-service-on-azure-stack-installer-and-helper-scripts).
3. [Install PowerShell for Azure Stack](azure-stack-powershell-install.md).
4. Run the **Create-AADIdentityApp.ps1** script. When you're prompted, enter the Azure AD tenant ID that you're using for your Azure Stack deployment. For example, enter **myazurestack.onmicrosoft.com**.
5. In the **Credential** window, enter your Azure AD service admin account and password. Select **OK**.
6. Enter the certificate file path and certificate password for the [certificate created earlier](https://docs.microsoft.com/en-gb/azure/azure-stack/azure-stack-app-service-before-you-get-started#certificates-required-for-azure-app-service-on-azure-stack). The certificate created for this step by default is **sso.appservice.local.azurestack.external.pfx**.
7. The script creates a new application in the tenant Azure AD instance. Make note of the application ID that's returned in the PowerShell output. You need this information during installation.
8. Open a new browser window, and sign in to the [Azure portal](https://portal.azure.com) as the Azure Active Directory service admin.
9. Open the Azure AD resource provider.
10. Select **App Registrations**.
11. Search for the application ID returned as part of step 7. An App Service application is listed.
12. Select **Application** in the list.
13. Select **Settings**.
14. Select **Required Permissions** > **Grant Permissions** > **Yes**.

```PowerShell
    Create-AADIdentityApp.ps1
```

| Parameter | Required or optional | Default value | Description |
| --- | --- | --- | --- |
| DirectoryTenantName | Required | Null | Azure AD tenant ID. Provide the GUID or string. An example is myazureaaddirectory.onmicrosoft.com. |
| AdminArmEndpoint | Required | Null | Admin Azure Resource Manager endpoint. An example is adminmanagement.local.azurestack.external. |
| TenantARMEndpoint | Required | Null | Tenant Azure Resource Manager endpoint. An example is management.local.azurestack.external. |
| AzureStackAdminCredential | Required | Null | Azure AD service admin credential. |
| CertificateFilePath | Required | Null | **Full path** to the identity application certificate file generated earlier. |
| CertificatePassword | Required | Null | Password that helps protect the certificate private key. |
| Environment | Optional | AzureCloud | The name of the supported Cloud Environment in which the target Azure Active Directory Graph Service is available.  Allowed values: 'AzureCloud', 'AzureChinaCloud', 'AzureUSGovernment', 'AzureGermanCloud'.|

## Create an Active Directory Federation Services application

For Azure Stack environments secured by AD FS, you must configure an AD FS service principal to support the following operations:

- Virtual machine scale set integration on worker tiers.
- SSO for the Azure Functions portal and advanced developer tools.

Administrators must configure SSO to:

- Configure a service principal for virtual machine scale set integration on worker tiers.
- Enable the advanced developer tools within App Service (Kudu).
- Enable the use of the Azure Functions portal experience.

Follow these steps:

1. Open a PowerShell instance as azurestack\AzureStackAdmin.
2. Go to the location of the scripts that you downloaded and extracted in the [prerequisite step](https://docs.microsoft.com/en-gb/azure/azure-stack/azure-stack-app-service-before-you-get-started#download-the-azure-app-service-on-azure-stack-installer-and-helper-scripts).
3. [Install PowerShell for Azure Stack](azure-stack-powershell-install.md).
4. Run the **Create-ADFSIdentityApp.ps1** script.
5. In the **Credential** window, enter your AD FS cloud admin account and password. Select **OK**.
6. Provide the certificate file path and certificate password for the [certificate created earlier](https://docs.microsoft.com/en-gb/azure/azure-stack/azure-stack-app-service-before-you-get-started#certificates-required-for-azure-app-service-on-azure-stack). The certificate created for this step by default is **sso.appservice.local.azurestack.external.pfx**.

```PowerShell
    Create-ADFSIdentityApp.ps1
```

| Parameter | Required or optional | Default value | Description |
| --- | --- | --- | --- |
| AdminArmEndpoint | Required | Null | Admin Azure Resource Manager endpoint. An example is adminmanagement.local.azurestack.external. |
| PrivilegedEndpoint | Required | Null | Privileged endpoint. An example is AzS-ERCS01. |
| CloudAdminCredential | Required | Null | Domain account credential for Azure Stack cloud admins. An example is Azurestack\CloudAdmin. |
| CertificateFilePath | Required | Null | **Full path** to the identity application's certificate PFX file. |
| CertificatePassword | Required | Null | Password that helps protect the certificate private key. |

## Next steps

[Install the App Service resource provider](azure-stack-app-service-deploy.md)
