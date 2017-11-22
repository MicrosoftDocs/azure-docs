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
ms.date: 10/17/2017
ms.author: anwestg

---
# Before you get started with App Service on Azure Stack

Azure App Service on Azure Stack has a number of pre-requisite steps that must be completed prior to deployment:

- Download the Azure App Service on Azure Stack Helper Scripts
- High availability
- Certificates required for Azure App Service on Azure Stack
- Prepare File Server
- Prepare SQL Server
- Create an Azure Active Directory application
- Create an Active Directory Federation Services application

## Download the Azure App Service on Azure Stack Installer and Helper Scripts

1. Download the [App Service on Azure Stack deployment helper scripts](https://aka.ms/appsvconmashelpers).
2. Download the [App Service on Azure Stack installer](https://aka.ms/appsvconmasinstaller).
3. Extract the files from the helper scripts zip file. The following files and folder structure appear:
  - Common.ps1
  - Create-AADIdentityApp.ps1
  - Create-ADFSIdentityApp.ps1
  - Create-AppServiceCerts.ps1
  - Get-AzureStackRootCert.ps1
  - Remove-AppService.ps1
  - Modules
    - GraphAPI.psm1
    
## High availability

Azure App Service on Azure Stack is not currently able to offer high availability because Azure Stack only deploys workloads into one single Fault Domain.

To prepare Azure App Service on Azure Stack for high availability, be sure to deploy the required File Server and SQL Server in a Highly Available configuration. When Azure Stack supports multiple fault domains, we will provide guidance on how to enable Azure App Service on Azure Stack in a Highly Available configuration.


## Certificates required for Azure App Service on Azure Stack

### Certificates required for the Azure Stack Development Kit

This first script works with the Azure Stack certificate authority to create four certificates that are needed by App Service.

| File name | Use |
| --- | --- |
| _.appservice.local.azurestack.external.pfx | App Service default SSL certificate |
| Api.appservice.local.azurestack.external.pfx | App Service API SSL Certificate |
| ftp.appservice.local.azurestack.external.pfx | App Service Publisher SSL Certificate |
| Sso.appservice.local.azurestack.external.pfx | App Service Identity Application Certificate |

Run the script on the Azure Stack Development Kit host and ensure that you're running PowerShell as azurestack\CloudAdmin.

1. In a PowerShell session running as azurestack\CloudAdmin, execute the Create-AppServiceCerts.ps1 script from the folder where you extracted the helper scripts. The script creates four certificates in the same folder as the create certificates script that App Service needs.
2. Enter a password to secure the .pfx files, and make a note of it. You must enter it in the App Service on Azure Stack installer.

#### Create-AppServiceCerts.ps1 parameters

| Parameter | Required/optional | Default value | Description |
| --- | --- | --- | --- |
| pfxPassword | Required | Null | Password used to protect the certificate private key |
| DomainName | Required | local.azurestack.external | Azure Stack region and domain suffix |

### Certificates required for a production deployment of Azure App Service on Azure Stack

To operate the resource provider in production, you must provide the following four certificates:

#### Default Domain Certificate

The default domain certificate is placed on the Front End role. It is used by user applications for wildcard or default domain requests to Azure App Service. The certificate is also used for source control operations (KUDU).

The certificate must be in .pfx format and should be a two-subject wildcard certificate. This allows both the default domain and the scm endpoint for source control operations to be covered by one certificate.

| Format | Example |
| --- | --- |
| \*.appservice.\<region\>.\<DomainName\>.\<extension\> | \*.appservice.redmond.azurestack.external |
| \*.scm.appservice.<region>.<DomainName>.<extension> | \*.appservice.scm.redmond.azurestack.external |

#### API certificate

The API certificate is placed on the Management role and is used by the resource provider to secure api calls. The certificate for publishing must contain a subject that matches the API DNS entry:

| Format | Example |
| --- | --- |
| api.appservice.\<region\>.\<DomainName\>.\<extension\> | api.appservice.redmond.azurestack.external |

#### Publishing certificate

The certificate for the Publisher role secures the FTPS traffic for application owners when they upload content.  The certificate for publishing needs to contain a subject that matches the FTPS DNS entry.

| Format | Example |
| --- | --- |
| ftp.appservice.\<region\>.\<DomainName\>.\<extension\> | api.appservice.redmond.azurestack.external |

#### Identity certificate

The certificate for the Identity Application enables:
- integration between the AAD/ADFS directory, Azure Stack, and App Service to support integration with the Compute Resource Provider
- Single Sign On Scenarios for Advanced Developer Tools within Azure App Service on Azure Stack.
The certificate for Identity must contain a subject that matches the following format:

| Format | Example |
| --- | --- |
| sso.appservice.\<region\>.\<DomainName\>.\<extension\> | sso.appservice.redmond.azurestack.external |

#### Extract the Azure Stack Azure Resource Manager Root Certificate

In a PowerShell session running as azurestack\CloudAdmin, execute the Get-AzureStackRootCert.ps1 script from the folder where you extracted the helper scripts. The script creates four certificates in the same folder as the create certificates script that App Service needs.

| Get-AzureStackRootCert.ps1 parameter | Required/optional | Default value | Description |
| --- | --- | --- | --- |
| PrivelegedEndpoint | Required | AzS-ERCS01 | Privileged endpoint. |
| CloudAdminCredential | Required | AzureStack\CloudAdmin | Azure Stack Cloud Admin domain account credential |


## Prepare the File Server

Azure App Service requires the use of a file server. For production deployments, the File Server must be configured to be Highly Available and capable of handling failures.

For use with Azure Stack Development Kit deployments only, you can use this example Azure Resource Manager Deployment Template to deploy a configured single node file server: https://aka.ms/appsvconmasdkfstemplate.

### Provision groups and accounts in Active Directory

>[!NOTE]
> Execute all the following commands, when configuring the File Server, in an Administrator Command Prompt session.  **Do NOT use PowerShell.**

1. Create the following Active Directory global security groups:
    - FileShareOwners
    - FileShareUsers
2. Create the following Active Directory accounts as service accounts:
    - FileShareOwner
    - FileShareUser

    As a security best practice, the users for these accounts (and for all Web Roles) should be distinct from each other and have strong user names and passwords.
    Set the passwords with the following conditions:
     - Enable **Password never expires**.
     - Enable **User cannot change password**.
     - Disable **User must change password at next logon**.
3. Add the accounts to the group memberships as follows:
    - Add **FileShareOwner** to the **FileShareOwners** group.
    - Add **FileShareUser** to the **FileShareUsers** group.

### Provision groups and accounts in a workgroup

On a workgroup, run net and WMIC commands to provision groups and accounts.

1. Run the following commands to create the FileShareOwner and FileShareUser accounts. Replace <password> with your own values.
``` DOS
net user FileShareOwner <password> /add /expires:never /passwordchg:no
net user FileShareUser <password> /add /expires:never /passwordchg:no
```
2. Set the passwords for the accounts to never expire by running the following WMIC commands:
``` DOS
WMIC USERACCOUNT WHERE "Name='FileShareOwner'" SET PasswordExpires=FALSE
WMIC USERACCOUNT WHERE "Name='FileShareUser'" SET PasswordExpires=FALSE
```
3. Create the local groups FileShareUsers and FileShareOwners, and add the accounts in the first step to them.
``` DOS
net localgroup FileShareUsers /add
net localgroup FileShareUsers FileShareUser /add
net localgroup FileShareOwners /add
net localgroup FileShareOwners FileShareOwner /add
```

### Provision the content share

The content share contains tenant web site content. The procedure to provision the content share on a single file server is the same for both Active Directory and Workgroup environments, but different for a Failover cluster in Active Directory.

#### Provision the content share on a single file server (AD or Workgroup)

On a single file server, run the following commands at an elevated command prompt. Replace the value for <C:\WebSites> with the corresponding paths in your environment.

```DOS
set WEBSITES_SHARE=WebSites
set WEBSITES_FOLDER=<C:\WebSites>
md %WEBSITES_FOLDER%
net share %WEBSITES_SHARE% /delete
net share %WEBSITES_SHARE%=%WEBSITES_FOLDER% /grant:Everyone,full
```

### To enable WinRM, add the FileShareOwners group to the local Administrators group

In order for Windows Remote Management to work properly, you must add the FileShareOwners group to the local Administrators group.

#### Active Directory

Run the following commands at an elevated command prompt on the File Server or on every File Server Failover Cluster node. Replace the value for <DOMAIN> with the domain name you want to use.

```DOS
set DOMAIN=<DOMAIN>
net localgroup Administrators %DOMAIN%\FileShareOwners /add
```

#### Workgroup

Run the following command at an elevated command prompt on the File Server.

```DOS
net localgroup Administrators FileShareOwners /add
```

### Configure access control to the shares

Run the following commands at an elevated command prompt on the File Server or on the File Server Failover Cluster node, which is the current cluster resource owner. Replace values in italics with values specific to your environment.

#### Active Directory
```DOS
set DOMAIN=<DOMAIN>
set WEBSITES_FOLDER=<C:\WebSites>
icacls %WEBSITES_FOLDER% /reset
icacls %WEBSITES_FOLDER% /grant Administrators:(OI)(CI)(F)
icacls %WEBSITES_FOLDER% /grant %DOMAIN%\FileShareOwners:(OI)(CI)(M)
icacls %WEBSITES_FOLDER% /inheritance:r
icacls %WEBSITES_FOLDER% /grant %DOMAIN%\FileShareUsers:(CI)(S,X,RA)
icacls %WEBSITES_FOLDER% /grant *S-1-1-0:(OI)(CI)(IO)(RA,REA,RD)
```

#### Workgroup
```DOS
set WEBSITES_FOLDER=<C:\WebSites>
icacls %WEBSITES_FOLDER% /reset
icacls %WEBSITES_FOLDER% /grant Administrators:(OI)(CI)(F)
icacls %WEBSITES_FOLDER% /grant FileShareOwners:(OI)(CI)(M)
icacls %WEBSITES_FOLDER% /inheritance:r
icacls %WEBSITES_FOLDER% /grant FileShareUsers:(CI)(S,X,RA)
icacls %WEBSITES_FOLDER% /grant *S-1-1-0:(OI)(CI)(IO)(RA,REA,RD)
```

## Prepare the SQL Server

For the Azure App Service on Azure Stack hosting and metering databases, you must prepare a SQL Server to hold the Azure App Service Databases.

For use with the Azure Stack Development Kit, you can use SQL Express 2014 SP2 or later.

For production and high availability purposes, you should use a full version of SQL 2014 SP2 or later, enable Mixed Mode authentication, and deploy in a [highly available configuration](https://docs.microsoft.com/en-us/sql/sql-server/failover-clusters/high-availability-solutions-sql-server).

The Azure App Service on Azure Stack SQL Server must be accessible from all App Service roles. SQL Server can be deployed within the Default Provider Subscription in Azure Stack. Or you can make use of the existing infrastructure within your organization (as long as there is connectivity to Azure Stack).

For any of the SQL Server roles, you can use a default instance or a named instance. However, if you use a named instance, be sure that you manually start the SQL Browser Service and open port 1434.

## Create an Azure Active Directory application

Configure an Azure AD service principal to support the following:
- Virtual machine scale set integration on Worker tiers.
- SSO for the Azure Functions portal and advanced developer tools.

These steps apply to Azure AD secured Azure Stack environments only.

Administrators must configure SSO to:
- Enable the advanced developer tools within App Service (Kudu).
- Enable the use of the Azure Functions portal experience.

Follow these steps:

1. Open a PowerShell instance as azurestack\cloudadmin.
2. Go to the location of the scripts downloaded and extracted in the [prerequisite step](https://docs.microsoft.com/azure/azure-stack/azure-stack-app-service-before-you-get-started#download-the-azure-app-service-on-azure-stack-installer-and-helper-scripts).
3. [Install Azure Stack PowerShell](azure-stack-powershell-install.md).
4. Run the **Create-AADIdentityApp.ps1** script. When you're prompted for your Azure AD tenant ID, enter the Azure AD tenant ID you're using for your Azure Stack deployment, for example, myazurestack.onmicrosoft.com.
5. In the **Credential** window, enter your Azure AD service admin account and password. Click **OK**.
6. Enter the certificate file path and certificate password for the [certificate created earlier](https://docs.microsoft.com/en-gb/azure/azure-stack/azure-stack-app-service-before-you-get-started#certificates-required-for-azure-app-service-on-azure-stack). The certificate created for this step by default is sso.appservice.local.azurestack.external.pfx.
7. The script creates a new application in the tenant Azure AD. Make note of the Application ID that's returned in the PowerShell output. You need this information during installation.
8. Open a new browser window, and sign in to the Azure portal (portal.azure.com) as the **Azure Active Directory Service Admin**.
9. Open the Azure AD resource provider.
10. Click **App Registrations**.
11. Search for the **Application ID** returned as part of step 7. An App Service application is listed.
12. Click **Application** in the list
13. Click **Required Permissions** > **Grant Permissions** > **Yes**.

| Create-AADIdentityApp.ps1  parameter | Required/optional | Default value | Description |
| --- | --- | --- | --- |
| DirectoryTenantName | Required | Null | Azure AD tenant ID. Provide the GUID or string, for example, myazureaaddirectory.onmicrosoft.com |
| AdminArmEndpoint | Required | Null | The Admin Azure Resource Manager Endpoint, for example adminmanagement.local.azurestack.external |
| TenantARMEndpoint | Required | Null | Tenant Azure Resource Manager Endpoint, for example: management.local.azurestack.external |
| AzureStackAdminCredential | Required | Null | Azure AD Service Admin Credential |
| CertificateFilePath | Required | Null | Path to the identity application certificate file generated earlier. |
| CertificatePassword | Required | Null | Password used to protect the certificate private key. |

## Create an Active Directory Federation Services application

For Azure Stack environments secured by AD FS, you must configure an AD FS service principal to support the following:
- Virtual machine scale set integration on Worker tiers.
- SSO for the Azure Functions portal and advanced developer tools.

Administrators need to configure SSO to:
- Configure a service principal for virtual machine scale set integration on Worker tiers.
- Enable the advanced developer tools within App Service (Kudu).
- Enable the use of the Azure Functions portal experience.

Follow these steps:

1. Open a PowerShell instance as azurestack\azurestackadmin.
2. Go to the location of the scripts downloaded and extracted in the [prerequisite step](https://docs.microsoft.com/en-gb/azure/azure-stack/azure-stack-app-service-before-you-get-started#download-the-azure-app-service-on-azure-stack-installer-and-helper-scripts).
3. [Install Azure Stack PowerShell](azure-stack-powershell-install.md).
4.	Run the **Create-ADFSIdentityApp.ps1** script.
5.	In the **Credential** window, enter your AD FS cloud admin account and password. Click **OK**.
6.	Provide the certificate file path and certificate password for the [certificate created earlier](https://docs.microsoft.com/en-gb/azure/azure-stack/azure-stack-app-service-before-you-get-started#certificates-required-for-azure-app-service-on-azure-stack). The certificate created for this step by default is sso.appservice.local.azurestack.external.pfx.

| Create-ADFSIdentityApp.ps1  parameter | Required/optional | Default value | Description |
| --- | --- | --- | --- |
| AdminArmEndpoint | Required | Null | The admin Azure Resource Manager endpoint. For example, adminmanagement.local.azurestack.external. |
| PrivilegedEndpoint | Required | Null | Privileged endpoint. For example, AzS-ERCS01. |
| CloudAdminCredential | Required | Null | Azure Stack cloudadmin domain account credential. For example, Azurestack\CloudAdmin. |
| CertificateFilePath | Required | Null | Path to identity application's certificate PFX file. |
| CertificatePassword | Required | Null | Password used to protect the certificate private key. |


## Next steps

[Install the App Service resource provider](azure-stack-app-service-deploy.md).
