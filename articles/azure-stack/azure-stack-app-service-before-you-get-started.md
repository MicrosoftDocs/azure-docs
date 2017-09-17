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
ms.date: 9/25/2017
ms.author: anwestg

---
# Before you get started with App Service on Azure Stack

Azure App Service on Azure Stack has a number of pre-requisite steps that must be completed prior to deployment:

- Download the Azure App Service on Azure Stack Helper Scripts
- Certificates required for Azure App Service on Azure Stack
- Prepare File Server
- Prepare SQL Server
- Create AAD Application
- Create ADFS Application

## Download the Azure App Service on Azure Stack Helper Scripts

1. Download the [App Service on Azure Stack deployment helper scripts](http://aka.ms/appsvconmasrc1helper).
2. Extract the files from the helper scripts zip file. The following files and folder structure appear:
  - Create-AppServiceCerts.ps1
  - Create-IdentityApp.ps1
  - Modules
    - AzureStack.Identity.psm1
    - GraphAPI.psm1

## Certificates required for Azure App Service on Azure Stack

### Certificates required for the Azure Stack Development Kit

This first script works with the Azure Stack certificate authority to create four certificates that are needed by App Service.

| File name | Use |
| --- | --- |
| _.appservice.local.azurestack.external.pfx | App Service default SSL certificate |
| Api.appservice.local.azurestack.external.pfx | App Service API SSL Certificate |
| ftp.appservice.local.azurestack.external.pfx | App Service Publisher SSL Certificate |
| Sso.appservice.local.azurestack.external.pfx | App Service Identity Application Certificate |

Run the script on the Azure Stack Development Kit host and ensure that you're running PowerShell as azurestack\AzureStackAdmin.

1. In a PowerShell session running as azurestack\AzureStackAdmin, execute the Create-AppServiceCerts.ps1 script from the folder where you extracted the helper scripts. The script creates four certificates in the same folder as the create certificates script that App Service needs.
2. Enter a password to secure the .pfx files, and make a note of it. You will need to enter it in the App Service on Azure Stack installer.

#### Create-AppServiceCerts.ps1 parameters

| Parameter | Required/optional | Default value | Description |
| --- | --- | --- | --- |
| pfxPassword | Required | Null | Password used to protect the certificate private key |
| DomainName | Required | local.azurestack.external | Azure Stack region and domain suffix |
| CertificateAuthority | Required | AzS-CA01.azurestack.local | Certificate authority endpoint |

### Certificates required for a production deployment of Azure App Service on Azure Stack

To operate the resource provider in production you must provide the following four certificates:

#### Default Domain Certificate

The default domain certificate is placed on the Front End role and is used by user applications for wildcard or default domain requests to Azure App Service.  The certificate is also used for source control operations (KUDU).

The certificate must be in .pfx format and should be a two-subject wildcard certificate.  This allows both the default domain and the scm endpoint for source control operations to be covered by one certificate.

| Format | Example |
| --- | --- |
| \*.appservice.<region>.<DomainName>.<extension> | \*.appservice.redmond.azurestack.external |
| \*.scm.appservice.<region>.<DomainName>.<extension> | \*.appservice.scm.redmond.azurestack.external |

#### API certificate

The API certificate is placed on the Management role and is used by the resource provider to secure api calls.  The certificate for publishing must contain a subject that matches the API DNS entry:

| Format | Example |
| --- | --- |
| Api.appservice.<region>.<DomainName>.<extension> | api.appservice.redmond.azurestack.external |

#### Publishing certificate

The certificate for the Publisher role secures the FTPS traffic for application owners when they upload content.  The certificate for publishing needs to contain a subject that matches the FTPS DNS entry.

| Format | Example |
| --- | --- |
| ftp.appservice.<region>.<DomainName>.<extension> | api.appservice.redmond.azurestack.external |

#### Identity certificate

The certificate for the Identity Application enables integration between the AAD/ADFS directory, Azure Stack and App Service to enable integration with the Compute Resource Provider and to enable Single Sign On Scenarios for Advanced Developer Tools within Azure App Service on Azure Stack.  The certificate for Identity must contain a subject that matches the following:

| Format | Example |
| --- | --- |
| sso.appservice.<region>.<DomainName>.<extension> | sso.appservice.redmond.azurestack.external |

#### Extract the Azure Stack Azure Resource Manager Root Certificate

In a PowerShell session running as azurestack\AzureStackAdmin, execute the Get-AzureStackRootCert.ps1 script from the folder where you extracted the helper scripts. The script creates four certificates in the same folder as the create certificates script that App Service needs.

| Get-AzureStackRootCert.ps1 parameter | Required/optional | Default value | Description |
| --- | --- | --- | --- |
| EmergencyConsole | Required | AzS-ERCS01 | Emergency console privileged endpoint. |
| CloudAdminCredential | Required | AzureStack\AzureStackAdmin | Azure Stack cloudadmin domain account credential |


## Prepare the File Server

Azure App Service requires the use of a file server.

### Provision groups and accounts in Active Directory

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
  - net user FileShareOwner <password> /add /expires:never /passwordchg:no
  - net user FileShareUser <password> /add /expires:never /passwordchg:no
2. Set the passwords for the accounts just created to never expire by running the following WMIC commands:
  - WMIC USERACCOUNT WHERE "Name='FileShareOwner'" SET PasswordExpires=FALSE
  - WMIC USERACCOUNT WHERE "Name='FileShareUser'" SET PasswordExpires=FALSE
3. Create the local groups FileShareUsers and FileShareOwners, and add the accounts in the first step to them.
  - net localgroup FileShareUsers /add
  - net localgroup FileShareUsers FileShareUser /add
  - net localgroup FileShareOwners /add
  - net localgroup FileShareOwners FileShareOwner /add

### Provision the content share

The content share contains tenant web site content. The procedure to provision the content share on a single file server is the same for both Active Directory and Workgroup environments, but different for a Failover cluster in Active Directory.

#### Provision the content share on a single file server (AD or Workgroup)

On a single file server, run the following commands at an elevated command prompt. Replace the value for <C:\WebSites> with the corresponding paths in your environment.

```powershell
set WEBSITES_SHARE=WebSites
set WEBSITES_FOLDER=<C:\WebSites>
md %WEBSITES_FOLDER%
net share %WEBSITES_SHARE% /delete
net share %WEBSITES_SHARE%=%WEBSITES_FOLDER% /grant:Everyone,full
```

#### Provision the content share on a Failover cluster (Active Directory)

On the Failover cluster, create the following UNC clustered resources:
1.	WebSites

### Add the FileShareOwners group to the local Administrators group to enable WinRM

In order for Windows Remote Management to work properly, you must add the FileShareOwners group to the local Administrators group.

#### Active Directory

Run the following commands at an elevated command prompt on the File Server, or on every File Server Failover Cluster node. Replace the value for <DOMAIN> with the domain name you will use.

```powershell
set DOMAIN=<DOMAIN>
net localgroup Administrators %DOMAIN%\FileShareOwners /add
```

#### Workgroup

Run the following command at an elevated command prompt on the File Server.

net localgroup Administrators FileShareOwners /add

### Configure access control to the shares

Run the following commands at an elevated command prompt on the File Server or on the File Server Failover Cluster node which is the current cluster resource owner. Replace values in italics with values specific to your environment.

#### Active Directory
```powershell
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
```powershell
set WEBSITES_FOLDER=<C:\WebSites>
icacls %WEBSITES_FOLDER% /reset
icacls %WEBSITES_FOLDER% /grant Administrators:(OI)(CI)(F)
icacls %WEBSITES_FOLDER% /grant FileShareOwners:(OI)(CI)(M)
icacls %WEBSITES_FOLDER% /inheritance:r
icacls %WEBSITES_FOLDER% /grant FileShareUsers:(CI)(S,X,RA)
icacls %WEBSITES_FOLDER% /grant *S-1-1-0:(OI)(CI)(IO)(RA,REA,RD)
```

## Prepare the SQL Server

For the Azure App Service on Azure Stack hosting and metering databases, you must prepare a SQL Server to hold the Windows Azure Pack Web Sites Runtime Database. 

For use with the Azure Stack Development Kit, you can use SQL Express 2012 SP1 or later. For download information, see [Download SQL Server 2012 Express with SP1](https://msdn.microsoft.com/evalcenter/hh230763.aspx).
For production and high availability purposes, you should use a full version of SQL 2012 SP1 or later. For information on installing SQL Server, see [Installation for SQL Server 2012](http://go.microsoft.com/fwlink/?LinkId=322141).
Enable Mixed Mode authentication.
The Azure App Service on Azure Stack SQL Server must be accessible from all App Service roles.
For any of the SQL Server roles, you can use a default instance or a named instance. However, if you use a named instance, be sure that you manually start the SQL Browser Service and open port 1434.

## Create AAD application

Configure an Azure AD service principal for virtual machine scale set integration on Worker tiers and SSO for the Azure Functions portal and advanced developer tools.

These steps apply to Azure AD secured Azure Stack environments only.

Administrators must configure SSO to:
- Enable the advanced developer tools within App Service (Kudu).
- Enable the use of the Azure Functions portal experience.

Follow these steps:

1. Open a PowerShell instance as azurestack\azurestackadmin.
2. Go to the location of the scripts downloaded and extracted in the [prerequisite step](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-app-service-deploy#download-required-components).
3. [Install](azure-stack-powershell-install.md) and [configure an Azure Stack PowerShell environment](azure-stack-powershell-configure-admin.md).
4. In the same PowerShell session, run the **CreateIdentityApp.ps1** script. When you're prompted for your Azure AD tenant ID, enter the Azure AD tenant ID you're using for your Azure Stack deployment, for example, myazurestack.onmicrosoft.com.
5. In the **Credential** window, enter your Azure AD service admin account and password. Click **OK**.
6. Enter the certificate file path and certificate password for the [certificate created earlier](azure-stack-app-service-deploy.md#create-certificates-to-be-used-by-app-service-on-azure-stack). The certificate created for this step by default is sso.appservice.local.azurestack.external.pfx.
7. The script creates a new application in the tenant Azure AD and generates a new PowerShell script named **UpdateConfigOnController.ps1**. Make note of the Application ID that's returned in the PowerShell output. You need this information to search for it in step 11.
8. Open a new browser window, and sign in to the Azure portal (portal.azure.com) as the **Azure Active Directory Service Admin**.
9. Open the Azure AD resource provider.
10. Click **App Registrations**.
11. Search for the **Application ID** returned as part of step 7. An App Service application is listed.
12. Click **Application** in the list
13. Click **Required Permissions** > **Grant Permissions** > **Yes**.

| CreateIdentityApp.ps1  parameter | Required/optional | Default value | Description |
| --- | --- | --- | --- |
| DirectoryTenantName | Required | Null | Azure AD tenant ID. Provide the GUID or string, for example, myazureaaddirectory.onmicrosoft.com |
| TenantAzure Resource ManagerEndpoint | Required | management.local.azurestack.external | The tenant Azure Resource Manager endpoint. |
| AzureStackCredential | Required | Null | Azure AD administrator |
| CertificateFilePath | Required | Null | Path to the identity application certificate file generated earlier. |
| CertificatePassword | Required | Null | Password used to protect the certificate private key. |
| DomainName | Required | local.azurestack.external | Azure Stack region and domain suffix. |
| AdfsMachineName | Optional | AD FS machine name, for example, AzS-ADFS01.azurestack.local | Ignore in the case of Azure AD deployment, but required in AD FS deployment. |

## Create Active Directory Federation Services application

For Azure Stack environments secured by AD FS, you must configure an AD FS service principal for virtual machine scale set integration on Worker tiers and SSO for the Azure Functions portal and advanced developer tools.

Administrators need to configure SSO to:
- Configure a service principal for virtual machine scale set integration on Worker tiers.
- Enable the advanced developer tools within App Service (Kudu).
- Enable the use of the Azure Functions portal experience.

Follow these steps:

1. Open a PowerShell instance as azurestack\azurestackadmin.
2. Go to the location of the scripts downloaded and extracted in the [prerequisite step](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-app-service-deploy#download-required-components).
3. [Install](azure-stack-powershell-install.md) and [configure an Azure Stack PowerShell environment](azure-stack-powershell-configure-admin.md).
4.	In the same PowerShell session, run the **CreateIdentityApp.ps1** script. When you're prompted for your Azure AD tenant ID, enter ADFS.
5.	In the **Credential** window, enter your AD FS service admin account and password. Click **OK**.
6.	Provide the certificate file path and certificate password for the [certificate created earlier](azure-stack-app-service-deploy.md#create-certificates-to-be-used-by-app-service-on-azure-stack). The certificate created for this step by default is sso.appservice.local.azurestack.external.pfx.

| CreateIdentityApp.ps1  parameter | Required/optional | Default value | Description |
| --- | --- | --- | --- |
| DirectoryTenantName | Required | Null | Use ADFS for the AD FS environment. |
| TenantAzure Resource ManagerEndpoint | Required | management.local.azurestack.external | The tenant Azure Resource Manager endpoint. |
| AzureStackCredential | Required | Null | Azure AD administrator |
| CertificateFilePath | Required | Null | Path to the identity application certificate file generated earlier. |
| CertificatePassword | Required | Null | Password used to protect the certificate private key. |
| DomainName | Required | local.azurestack.external | Azure Stack region and domain suffix. |
| AdfsMachineName | Optional | AD FS machine name, for example, AzS-ADFS01.azurestack.local | Ignore in the case of Azure AD deployment, but required in AD FS deployment. |


## Next steps

[Install the App Service resource provider](azure-stack-app-service-deploy.md).
